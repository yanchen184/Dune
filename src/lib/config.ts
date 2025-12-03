// Configuration management using localStorage
import { decryptKey } from './encryption';

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

// Default encrypted configuration (can be committed to git)
// Uses simple character shift encryption (+1 for letters and numbers)
const DEFAULT_ENCRYPTED_CONFIG = {
  firebase: {
    // TODO: 請填入您加密後的 Firebase 配置
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
  // Encrypted OpenAI API Key (shift +1)
  openaiApiKey: 'tl-qspk-e3SDNbk8KCn_EWBe2wmPvvkRoE4hEd-Q7Xix9PCDF5zRSDzOIOdo00n2yDfDBYfFHw_ujS30bOU4CmclGKbiRxtjyFdBccvJ7w3kktPEvMyvqn4ILx6GHFZ1ARKeW9u1LqRxcyTBSzclTq6mtPJvNAbaFtdB',
};

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

  // Second fallback: environment variables (if available)
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

  // Third fallback: default encrypted configuration (decrypted at runtime)
  if (DEFAULT_ENCRYPTED_CONFIG.openaiApiKey && DEFAULT_ENCRYPTED_CONFIG.firebase.apiKey) {
    console.log('🔓 Using default encrypted configuration');
    return {
      firebase: {
        apiKey: decryptKey(DEFAULT_ENCRYPTED_CONFIG.firebase.apiKey),
        authDomain: decryptKey(DEFAULT_ENCRYPTED_CONFIG.firebase.authDomain),
        databaseURL: DEFAULT_ENCRYPTED_CONFIG.firebase.databaseURL
          ? decryptKey(DEFAULT_ENCRYPTED_CONFIG.firebase.databaseURL)
          : undefined,
        projectId: decryptKey(DEFAULT_ENCRYPTED_CONFIG.firebase.projectId),
        storageBucket: decryptKey(DEFAULT_ENCRYPTED_CONFIG.firebase.storageBucket),
        messagingSenderId: decryptKey(DEFAULT_ENCRYPTED_CONFIG.firebase.messagingSenderId),
        appId: decryptKey(DEFAULT_ENCRYPTED_CONFIG.firebase.appId),
        measurementId: DEFAULT_ENCRYPTED_CONFIG.firebase.measurementId
          ? decryptKey(DEFAULT_ENCRYPTED_CONFIG.firebase.measurementId)
          : undefined,
      },
      openaiApiKey: decryptKey(DEFAULT_ENCRYPTED_CONFIG.openaiApiKey),
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
