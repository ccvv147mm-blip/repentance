import type { CapacitorConfig } from "@capacitor/cli";

/**
 * إعداد Capacitor لتغليف تطبيق "وَصْل" ورفعه على Google Play و App Store.
 * التطبيق يعمل بملء الشاشة ويُحمَّل محليًا من ملفات التطبيق نفسها (dist) —
 * بدون أي شريط متصفح أو روابط خارجية. الطلبات التي تحتاج السيرفر
 * (الذكاء الاصطناعي والرسائل والإدارة وغيرها) تُوجَّه تلقائيًا إلى
 * arabsparkcommunity.app عبر src/lib/native-proxy.ts.
 */
const config: CapacitorConfig = {
  appId: "app.lovable.arabsparkai",
  appName: "وَصْل",
  webDir: "dist/client",
  server: {
    cleartext: false,
    androidScheme: "https",
    // أي تنقّل لهذه النطاقات يبقى داخل التطبيق بدل فتح المتصفح
    allowNavigation: [
      "arabsparkcommunity.app",
      "*.arabsparkcommunity.app",
      "*.supabase.co",
      "accounts.google.com",
      "*.google.com",
    ],
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "always",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#0f172a",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#0f172a",
      overlaysWebView: true,
    },
  },
};

export default config;
