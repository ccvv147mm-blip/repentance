# Roadmap

## Done (this round)
- [x] Lovable branding removed: badge hidden in-app (CSS + DOM remover, verified live on the published site); old `arab-spark-ai.lovable.app` URLs replaced with `https://arabsparkcommunity.app` in all metadata (canonical, og:url, JSON-LD, sitemap, robots.txt, app-store links); Lovable-hosted og:image replaced with own `og-cover.jpg`.
- [x] Offline-first Android export: `public/app-shell.html` and all external redirects deleted; the app is built locally (`CAP_STATIC=1` prerenders "/") and loads from `dist/client/index.html`; hash navigation inside Capacitor only; `capacitor.config.ts` no longer points at a remote URL; immersive full-screen kept.
- [x] Server-dependent features (AI, messages, friends, search, admin…) proxied to the published domain from the native shell (`src/lib/native-proxy.ts`) with CORS answers for native origins (`nativeCorsMiddleware` in `src/start.ts`). Verified end-to-end with a production-style local run: app booted from local files, hash navigation worked, search called the server remotely and rendered results.
- [x] GitHub APK workflow + `scripts/build-apk.sh` updated (CAP_STATIC build, no app-shell, versionCode baseline raised to 1000 so Play accepts CI builds after the 1000 local build).

## Pending (blocked on user)
- [ ] Publish the site — the CORS answers and the new metadata/og-image only go live with the next publish.
- [ ] Rebuild the APK/AAB after publishing (GitHub "بناء ملف APK" workflow or `scripts/build-apk.sh`) and install/update on the phone; confirm no browser bar and that sign-in + feeds work offline-launched.
- [ ] Note: the official "hide badge" toggle needs a Pro plan — the in-app removal net stays as the working mechanism.
