/**
 * Ambiente de produção
 * Este arquivo substitui `environment.ts` durante o build de produção.
 */
export const environment = {
  production: true,
  
  // API Configuration
  apiUrl: 'https://api.easytalk.com.br/api',
  wsUrl: 'wss://api.easytalk.com.br',
  
  // Application Settings
  appName: 'EasyTalk',
  appVersion: '1.0.0',
  
  // Feature Flags
  features: {
    enableAdmin: true,
    enableMessaging: true,
    enableAnalytics: true,
    enableDebugMode: false,
  },
  
  // Logging
  enableConsoleLog: false,
  logLevel: 'error', // 'debug' | 'info' | 'warn' | 'error'
  
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
  
  // OpenAI Configuration
  // Nota: As credenciais da OpenAI agora são gerenciadas pelo backend
  // Este objeto é mantido para compatibilidade, mas não é mais usado
  openai: {
    apiKey: '',
    assistantId: '',
  },
};

