/**
 * Ambiente de desenvolvimento
 * Este arquivo pode ser substituído durante o build usando `fileReplacements`.
 * A lista de substituições de arquivos pode ser encontrada em `angular.json`.
 */
export const environment = {
  production: false,
  
  // API Configuration
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000',
  
  // Application Settings
  appName: 'EasyTalk',
  appVersion: '1.0.0',
  
  // Feature Flags
  features: {
    enableAdmin: true,
    enableMessaging: true,
    enableAnalytics: false,
    enableDebugMode: true,
  },
  
  // Logging
  enableConsoleLog: true,
  logLevel: 'debug', // 'debug' | 'info' | 'warn' | 'error'
  
  // Assets
  assetsPath: '/assets',
  
  // Authentication
  auth: {
    tokenKey: 'authToken',
    userKey: 'userEmail',
    sessionTimeout: 3600000, // 1 hora em milissegundos
  },
  
  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,
  
  // Timeouts
  requestTimeout: 30000, // 30 segundos
  connectionRetryAttempts: 3,
  connectionRetryDelay: 1000, // 1 segundo
};

