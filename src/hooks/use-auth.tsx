
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string, profileData?: Record<string, any>) => Promise<string | null>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, firestore } = useFirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signUpWithEmail = async (email: string, password: string, profileData: Record<string, any> = {}) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        
        await updateProfile(newUser, {
            displayName: profileData.displayName,
        });

        const userDocRef = doc(firestore, 'users', newUser.uid);
        await setDoc(userDocRef, {
            uid: newUser.uid,
            email: newUser.email,
            displayName: profileData.displayName,
            medicalConditions: profileData.medicalConditions || '',
            workoutDuration: profileData.workoutDuration || 60,
            workoutDaysPerWeek: profileData.workoutDaysPerWeek || 4,
        });

        setUser(newUser);
        return null;
    } catch (error: any) {
        console.error("Error signing up:", error);
        if (error.code === 'auth/configuration-not-found') {
            return "Authentication method not enabled. Please enable Email/Password sign-in in your Firebase console.";
        }
        return error.message || "An unknown error occurred.";
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
      try {
          await signInWithEmailAndPassword(auth, email, password);
          return null;
      } catch (error: any) {
          console.error("Error signing in:", error);
           if (error.code === 'auth/configuration-not-found') {
              return "Authentication method not enabled. Please enable Email/Password sign-in in your Firebase console.";
          }
          return error.message || "An unknown error occurred.";
      }
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signOutUser,
  };

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
