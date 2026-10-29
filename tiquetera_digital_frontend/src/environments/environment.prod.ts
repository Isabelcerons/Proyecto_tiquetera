export const environment = {
  production: true,
  apiUrl: 'https://api.tiquetera-app.com/api',
  appName: 'Tiquetera App',
  version: '1.0.0',
  vapid: {
    publicKey: 'BGde5H2OWAUiRzPEMlH6VNpi9QEOm3yslOIfLl6IXFlkEwjfZGrN4_07BxV3J7NuhY3S_XaRn4Kj38KQQJmDZNE'
  },
  pwa: {
    enabled: true,
    cacheConfig: {
      maxAge: 30 * 24 * 60 * 60, // 30 días en segundos
      maxSize: 100, // Número máximo de entradas en caché
      timeout: 8000 // Timeout para solicitudes en ms
    },
    notifications: {
      defaultIcon: '/assets/icons/icon-128x128.png',
      defaultBadge: '/assets/icons/badge-96x96.png',
      defaultVibrate: [100, 50, 100] // Patrón de vibración
    }
  }
};
