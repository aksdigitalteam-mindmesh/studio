'use client';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

const { firebaseApp, firestore, auth } = initializeFirebase();

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
