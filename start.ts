import { createStart, createMiddleware } from "@tanstack/react-start";
import { setResponseHeaders } from "@tanstack/start-server-core";

import { isAbortError } from "./lib/abort-error";
import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

/**
 * Origins used by the native Capacitor shells. The Android/iOS apps load the
 * UI from local files (https://localhost), so calls that must run on the
 * server are proxied to the published deployment and need CORS here.
 */
const NATIVE_ORIGINS = new Set([
  "https://localhost",
  "http://localhost",
  "capacitor://localhost",
]);

/** Any origin on the local machine (native shells and local test servers). */
function isNativeOrigin(origin: string): boolean {
  if (NATIVE_ORIGINS.has(origin)) return true;
  try {
    return new URL(origin).hostname === "localhost";
  } catch {
    return false;
  }
}

function nativeCorsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers":
      "content-type,authorization,apikey,x-client-info,x-supabase-api-version",
    "Access-Control-Max-Age": "86400",
  };
}

const nativeCorsMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const origin = request.headers.get("origin") ?? "";
    if (!isNativeOrigin(origin)) return next();

    if (request.method === "OPTIONS") {
      const headers = nativeCorsHeaders(origin);
      // Allow whatever headers the caller asked for (TanStack RPC sends its own).
      const requested = request.headers.get("access-control-request-headers");
      if (requested) headers["Access-Control-Allow-Headers"] = requested;
      return new Response(null, { status: 204, headers });
    }

    // Apply CORS headers to whatever response the pipeline produces.
    setResponseHeaders(new Headers(nativeCorsHeaders(origin)));

    const result = await next();
    if (result instanceof Response) {
      for (const [key, value] of Object.entries(nativeCorsHeaders(origin))) {
        result.headers.set(key, value);
      }
      return result;
    }
    return result;
  },
);

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (isAbortError(error)) {
      return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
    }
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [nativeCorsMiddleware, errorMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));
