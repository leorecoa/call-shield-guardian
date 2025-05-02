
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bruno.callshield',
  appName: 'Call Shield Guardian',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    hostname: '8458a5d6-7702-4670-9804-6353f343f574.lovableproject.com',
    cleartext: true,
    allowNavigation: ['*']
  },
  android: {
    buildOptions: {
      minSdkVersion: 26, // Android 8.0
      targetSdkVersion: 33,
    },
    intentFilters: [
      {
        action: "android.intent.action.VIEW"
      }
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1F516E", // shield-700 color
      showSpinner: false,
      androidSpinnerStyle: "large",
      splashFullScreen: true,
      splashImmersive: true
    },
    Permissions: {
      // Incluindo as permissões solicitadas
      permissions: [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.MODIFY_PHONE_STATE",
        "android.permission.READ_PHONE_STATE",
        "android.permission.POST_NOTIFICATIONS"
      ]
    }
  }
};

export default config;
