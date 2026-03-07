import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, User } from "firebase/auth";
import { app } from "./config";

const auth = getAuth(app);

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const signInUser = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const signUpUser = async (name: string, email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (name.trim()) {
    await updateProfile(credential.user, { displayName: name.trim() });
  }
  return credential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export default auth;
