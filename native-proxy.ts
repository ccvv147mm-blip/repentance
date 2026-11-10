/**
 * Native-shell networking shim.
 *
 * In the Capacitor Android/iOS build the app is served from local files
 * (dist). Anything that must execute on the server — TanStack server
 * functions, /api routes — is transparently rewritten here to the published
 * deployment, which answers with CORS headers for the native origins
 * (see nativeCorsMiddleware in src/start.ts).
 */

const DEFAULT_REMOTE = "https://arabsparkcommunity.app";

const LOCAL_PATH_PREFIXES = [
  "/assets/",
  "/icon-",
  "/og-cover",
  "/apple-touch-icon",
  "/manifest.json",
  "/robots.txt",
  "/sitemap.xml",
  "/firebase-messaging-sw.js",
  "/index.html",
];

function isLocalAsset(pathname: string): boolean {
  if (LOCAL_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  const last = pathname.split("/").pop() ?? "";
  // A path with a dot in its final segment is a static file request.
  return last.includes(".");
}

export function installNativeProxy(): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    Capacitor?: unknown;
    __nativeProxyInstalled?: boolean;
  };
  if (!w.Capacitor || w.__nativeProxyInstalled) return;
  w.__nativeProxyInstalled = true;

  const remote = (
    window as unknown as { __nativeRemote?: string }
  ).__nativeRemote ?? DEFAULT_REMOTE;
  const localOrigin = window.location.origin;
  const originalFetch = window.fetch.bind(window);

  const rewrite = (rawUrl: string): string | null => {
    try {
      const url = new URL(rawUrl, localOrigin);
      if (url.origin !== localOrigin) return null;
      if (isLocalAsset(url.pathname)) return null;
      return remote + url.pathname + url.search;
    } catch {
      return null;
    }
  };

  const proxiedFetch: typeof fetch = (input, init) => {
    if (typeof input === "string") {
      const target = rewrite(input);
      if (target) return originalFetch(target, init);
      return originalFetch(input, init);
    }
    if (input && typeof input === "object" && "url" in input) {
      const target = rewrite((input as Request).url);
      if (target) return originalFetch(target, init);
    }
    return originalFetch(input, init);
  };

  window.fetch = proxiedFetch;
}
