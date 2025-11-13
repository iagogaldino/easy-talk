/**
 * Interface que define a estrutura do objeto environment
 * Garante type-safety ao usar os arquivos de environment
 */
export interface Environment {
  production: boolean;
  apiUrl: string;
  wsUrl: string;
  appName: string;
  appVersion: string;
  features: {
    enableAdmin: boolean;
    enableMessaging: boolean;
    enableAnalytics: boolean;
    enableDebugMode: boolean;
  };
  enableConsoleLog: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  assetsPath: string;
  auth: {
    tokenKey: string;
    userKey: string;
    sessionTimeout: number;
  };
  defaultPageSize: number;
  maxPageSize: number;
  requestTimeout: number;
  connectionRetryAttempts: number;
  connectionRetryDelay: number;
}

