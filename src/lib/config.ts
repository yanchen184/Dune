// Configuration management using localStorage

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export interface AppConfig {
  firebase: FirebaseConfig;
  openaiApiKey: string;
}

const CONFIG_KEY = 'dune_app_config';

// Get configuration from localStorage or environment variables
export function getConfig(): AppConfig | null {
  // First try localStorage
  const stored = localStorage.getItem(CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored config:', e);
    }
  }

  // Fallback to environment variables (if available)
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_OPENAI_API_KEY) {
    return {
      firebase: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
      },
      openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
    };
  }

  return null;
}

// Save configuration to localStorage
export function saveConfig(config: AppConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

// Clear configuration from localStorage
export function clearConfig(): void {
  localStorage.removeItem(CONFIG_KEY);
}

// Check if configuration is complete
export function isConfigured(): boolean {
  const config = getConfig();
  if (!config) return false;

  const { firebase, openaiApiKey } = config;
  return !!(
    firebase.apiKey &&
    firebase.authDomain &&
    firebase.projectId &&
    firebase.storageBucket &&
    firebase.messagingSenderId &&
    firebase.appId &&
    openaiApiKey
  );
}
