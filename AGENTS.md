# Project Architecture Rules

- Keep phone installation metadata in `public/manifest.json`; use manifest-only home-screen support unless offline mode is explicitly requested.
- The Capacitor Android/iOS shells load the app locally from `dist/client/index.html` (built with `CAP_STATIC=1`, which prerenders "/") and stay in immersive full-screen so native launches never show browser chrome. Server-side calls (TanStack server functions and /api routes) are proxied to the published deployment by `src/lib/native-proxy.ts`; the published server answers with CORS for the native origins via the `nativeCorsMiddleware` in `src/start.ts`. Do not reintroduce a remote `server.url` or an app-shell redirect page.
- Hash navigation (`createHashHistory`) is enabled only when running inside Capacitor (`window.Capacitor`); the web app keeps clean browser URLs for SEO.
