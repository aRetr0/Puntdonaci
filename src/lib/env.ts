/**
 * Environment configuration with type-safe access to environment variables
 */

interface EnvConfig {
  apiUrl: string;
  apiTimeout: number;
  mapLibreStyleUrl: string;
  enableAnalytics: boolean;
  enablePushNotifications: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
}

function getEnv(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

function getEnvBoolean(key: string, defaultValue = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

export const env: EnvConfig = {
  apiUrl: getEnv('VITE_API_URL', 'http://localhost:5000/api'),
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', 10000),
  mapLibreStyleUrl: getEnv(
    'VITE_MAPLIBRE_STYLE_URL',
    'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
  ),
  enableAnalytics: getEnvBoolean('VITE_ENABLE_ANALYTICS', false),
  enablePushNotifications: getEnvBoolean('VITE_ENABLE_PUSH_NOTIFICATIONS', false),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Log environment configuration in development
if (env.isDevelopment) {
  console.log('[ENV] Configuration loaded:', {
    apiUrl: env.apiUrl,
    isDevelopment: env.isDevelopment,
  });
}
