import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Config read securely from environment variables only
export const getEnvFirebaseConfig = (): FirebaseConfig => {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  };
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export const initFirebase = (customConfig?: FirebaseConfig) => {
  try {
    const config = customConfig || getEnvFirebaseConfig();
    
    // Check if config has minimum required fields
    if (!config.apiKey || !config.projectId) {
      return { app: null, db: null, auth: null, isConfigured: false };
    }

    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }

    db = getFirestore(app);
    auth = getAuth(app);

    return { app, db, auth, isConfigured: true };
  } catch (error) {
    console.warn('Firebase initialization notice:', error);
    return { app: null, db: null, auth: null, isConfigured: false };
  }
};

export const getFirebaseInstance = () => {
  return initFirebase();
};
