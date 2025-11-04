
'use client';
import {
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore }from 'firebase/firestore';
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

export interface FirebaseContextValue {
  firebaseApp: FirebaseApp;
  options: FirebaseOptions;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(
  undefined
);

export function FirebaseProvider({
  children,
  ...value
}: {
  children: ReactNode;
} & FirebaseContextValue) {
  const memoizedValue = useMemo(
    () => ({
      firebaseApp: value.firebaseApp,
      options: value.firebaseApp.options,
      auth: value.auth,
      firestore: value.firestore,
    }),
    [value.firebaseApp, value.auth, value.firestore]
  );
  return (
    <FirebaseContext.Provider value={memoizedValue}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
}

export function useFirestore() {
  const { firestore } = useFirebase();
  return firestore;
}

export function useAuth() {
  const { auth } = useFirebase();
  return auth;
}
