
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, AuthErrorCodes, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useFirebase } from "@/firebase";
import { Loader2 } from "lucide-react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUpWithEmail: (email: string, password: string, profileData?: Record<string, any>) => Promise<string | null>;
    signInWithEmail: (email: string, password: string) => Promise<string | null>;
    signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signUpWithEmail: async () => null,
    signInWithEmail: async () => null,
    signOutUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const { auth, firestore } = useFirebase();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
            
            // Set display name (from email) and save other data to Firestore
            const displayName = email.split('@')[0];
            await updateProfile(newUser, { displayName });

            const userDocRef = doc(firestore, "users", newUser.uid);
            await setDoc(userDocRef, {
                uid: newUser.uid,
                email: newUser.email,
                displayName: displayName,
                photoURL: newUser.photoURL || `https://i.pravatar.cc/150?u=${newUser.uid}`,
                ...profileData
            }, { merge: true });

            return null;
        } catch (error: any) {
            console.error("Error signing up:", error);
            if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
                return "This email is already in use. Please try logging in.";
            }
            if (error.code === 'auth/configuration-not-found') {
                return "Authentication method not enabled. Please enable Email/Password sign-in in your Firebase console.";
            }
            return error.message;
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
             if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
                return "Invalid email or password. Please try again.";
            }
            return error.message;
        }
    };
    
    const signOutUser = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, signUpWithEmail, signInWithEmail, signOutUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
};
