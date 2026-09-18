import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDg4WdJyFufQ19Qjdzfb1xI2lEjxywTDCg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cartverse-143dd.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cartverse-143dd',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cartverse-143dd.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '968612466551',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:968612466551:web:9c3577885bdec123655b72',
};

// Initialize Firebase (singleton check to prevent re-initialization)
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Authentication Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const githubProvider = new GithubAuthProvider();

export { signInWithPopup, signInWithRedirect, getRedirectResult, signOut };
export type { FirebaseUser };
