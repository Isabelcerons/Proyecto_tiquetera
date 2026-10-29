// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Tiquetera App',
  version: '1.0.0',
  vapid: {
    publicKey: 'BGde5H2OWAUiRzPEMlH6VNpi9QEOm3yslOIfLl6IXFlkEwjfZGrN4_07BxV3J7NuhY3S_XaRn4Kj38KQQJmDZNE'
  },
  pwa: {
    enabled: true,
    cacheConfig: {
      maxAge: 7 * 24 * 60 * 60, // 7 días en segundos
      maxSize: 50, // Número máximo de entradas en caché
      timeout: 5000 // Timeout para solicitudes en ms
    },
    notifications: {
      defaultIcon: '/assets/icons/icon-128x128.png',
      defaultBadge: '/assets/icons/badge-96x96.png',
      defaultVibrate: [100, 50, 100] // Patrón de vibración
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
