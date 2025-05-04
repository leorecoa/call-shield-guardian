
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bruno.callshield',
  appName: 'Call Shield Guardian',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*'],
    hostname: 'lovableproject.com',
    errorPath: '/offline-error.html'
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
