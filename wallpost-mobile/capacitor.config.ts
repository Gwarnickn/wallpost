import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.knan.wallpost',
  appName: 'wallpost',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'wallpost.knan.com',
  },
};

export default config;
