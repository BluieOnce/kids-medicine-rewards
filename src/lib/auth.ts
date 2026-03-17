import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

function toAppUser(user: User): AppUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
}

export async function signInWithGoogle(): Promise<AppUser> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return toAppUser(result.user);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAuthChange(
  callback: (user: AppUser | null) => void
): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? toAppUser(user) : null);
  });
}
