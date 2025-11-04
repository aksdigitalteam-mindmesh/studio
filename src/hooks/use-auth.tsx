
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useFirebase } from "@/firebase";
import { Loader2 } from "lucide-react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => {},
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

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (error) {
            console.error("Error signing in with Google:", error);
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
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
};
