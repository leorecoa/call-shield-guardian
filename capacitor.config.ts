
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.8458a5d67702467098046353f343f574',
  appName: 'call-shield-guardian',
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
  }
};

export default config;
