
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bruno.callshield', // 👈 Formato correto!
  appName: 'Call Shield Guardian',
  webDir: 'dist',
  server: {
    url: 'https://8458a5d6-7702-4670-9804-6353f343f574.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      minSdkVersion: 26, // Android 8.0
      targetSdkVersion: 33,
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1F516E", // shield-700 color
      showSpinner: false,
      androidSpinnerStyle: "large",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
