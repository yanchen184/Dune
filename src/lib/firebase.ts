import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getConfig } from './config';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

// Initialize Firebase with configuration
export function initializeFirebase(): { app: FirebaseApp; db: Firestore; storage: FirebaseStorage } | null {
  const config = getConfig();

  if (!config) {
    console.warn('Firebase configuration not found. Please configure in Settings.');
    return null;
  }

  try {
    // Initialize Firebase if not already initialized
    if (!app) {
      app = initializeApp(config.firebase);
      db = getFirestore(app);
      storage = getStorage(app);
      console.log('✅ Firebase initialized successfully');
    }

    return { app, db, storage };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return null;
  }
}

// Get Firebase services (lazy initialization)
export function getFirebaseServices() {
  if (!app || !db || !storage) {
    return initializeFirebase();
  }
  return { app, db, storage };
}

// Export getters for backward compatibility
export function getDb(): Firestore | null {
  const services = getFirebaseServices();
  return services?.db || null;
}

export function getStorageInstance(): FirebaseStorage | null {
  const services = getFirebaseServices();
  return services?.storage || null;
}

export default app;
