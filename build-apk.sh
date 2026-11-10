#!/usr/bin/env bash
# بناء ملف APK كامل لتطبيق "وَصْل" على جهازك.
# المتطلبات: Node 20+، Java 21 (JDK)، Android SDK (أو Android Studio).
# التطبيق يُبنى محليًا (CAP_STATIC=1) فيحمَّل داخل الأندرويد من ملفاته
# نفسها بملء الشاشة — بدون أي شاشة انتظار أو رابط خارجي.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> تثبيت الحزم"
npm install --legacy-peer-deps

echo "==> بناء الويب (نسخة محلية للهاتف)"
CAP_STATIC=1 npm run build
[ -f dist/client/index.html ] || { echo "خطأ: dist/client/index.html غير موجود بعد البناء"; exit 1; }

echo "==> تجهيز منصة أندرويد"
[ -d android ] || npx cap add android
npx cap sync android

echo "==> بناء APK"
cd android
chmod +x ./gradlew
./gradlew assembleDebug

echo
echo "تم! الملف الناتج:"
echo "android/app/build/outputs/apk/debug/app-debug.apk"
echo
echo "لبناء نسخة النشر الموقّعة (AAB لمتجر Play):"
echo "  CAP_STATIC=1 npm run build && npx cap sync android && ./gradlew bundleRelease"
