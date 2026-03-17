import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy initialization — only runs on the client when actually needed
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;

function isConfigured(): boolean {
  return !!firebaseConfig.apiKey;
}

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined" || !isConfigured()) return null;
  if (!_app) {
    _app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }
  return _app;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!_auth) {
    _auth = getAuth(app);
  }
  return _auth;
}

export function isFirebaseConfigured(): boolean {
  return isConfigured();
}
