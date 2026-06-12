import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.realvirtuality.socialpanel',
  appName: 'Social Panel',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    hostname: 'realvirtuality.app',
  },
  ios: {
    contentInset: 'automatic',
  },
}

export default config
