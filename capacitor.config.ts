
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bruno.callshield',
  appName: 'Call Shield Guardian',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*'],
    hostname: 'app',
    url: 'https://8458a5d6-7702-4670-9804-6353f343f574.lovableproject.com?forceHideBadge=true',
    errorPath: '/offline-error.html',
    iosScheme: 'ionic'
  },
  android: {
    buildOptions: {
      minSdkVersion: 26, // Android 8.0
      targetSdkVersion: 33,
    },
    intentFilters: [
      {
        action: "android.intent.action.VIEW"
      },
      {
        action: "android.intent.action.PHONE_STATE"
      },
      {
        action: "android.intent.action.NEW_OUTGOING_CALL"
      },
      {
        action: "android.intent.action.BOOT_COMPLETED",
        category: ["android.intent.category.DEFAULT"]
      }
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      backgroundColor: "#1F516E", // shield-700 color
      showSpinner: false,
      androidSpinnerStyle: "large",
      splashFullScreen: true,
      splashImmersive: true
    },
    Permissions: {
      permissions: [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.MODIFY_PHONE_STATE",
        "android.permission.READ_PHONE_STATE",
        "android.permission.CALL_PHONE",
        "android.permission.PROCESS_OUTGOING_CALLS",
        "android.permission.READ_CALL_LOG",
        "android.permission.WRITE_CALL_LOG",
        "android.permission.RECEIVE_BOOT_COMPLETED",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.POST_NOTIFICATIONS"
      ]
    }
  }
};

export default config;
