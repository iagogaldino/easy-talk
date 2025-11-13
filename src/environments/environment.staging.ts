/**
 * Ambiente de staging/testes
 * Ambiente intermediário para testes antes da produção
 */
export const environment = {
  production: false,
  
  // API Configuration
  apiUrl: 'https://staging-api.easytalk.com.br/api',
  wsUrl: 'wss://staging-api.easytalk.com.br',
  
  // Application Settings
  appName: 'EasyTalk',
  appVersion: '1.0.0',
  
  // Feature Flags
  features: {
    enableAdmin: true,
    enableMessaging: true,
    enableAnalytics: true,
    enableDebugMode: true,
  },
  
  // Logging
  enableConsoleLog: true,
  logLevel: 'info', // 'debug' | 'info' | 'warn' | 'error'
  
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

