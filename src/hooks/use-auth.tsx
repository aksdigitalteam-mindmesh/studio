
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useFirebase } from "@/firebase";
import { Loader2 } from "lucide-react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUpWithEmail: (email: string, password: string) => Promise<string | null>;
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
    const { auth } = useFirebase();
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
    
    const signUpWithEmail = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            return null;
        } catch (error: any) {
            console.error("Error signing up:", error);
            return error.message;
        }
    };
    
    const signInWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return null;
        } catch (error: any) {
            console.error("Error signing in:", error);
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
