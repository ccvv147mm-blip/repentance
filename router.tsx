import { QueryClient } from "@tanstack/react-query";
import { createRouter, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { installNativeProxy } from "./lib/native-proxy";

// The native Android/iOS shells load the UI from local files, so every
// server-side call is proxied to the published deployment and navigation
// uses hash URLs that always resolve to the local index.html.
installNativeProxy();

const isNative =
  typeof window !== "undefined" &&
  !!(window as unknown as { Capacitor?: unknown }).Capacitor;

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000 } },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    history: isNative ? createHashHistory() : undefined,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
