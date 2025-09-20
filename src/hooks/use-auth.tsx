"use client";

// This is a placeholder file. The login system has been removed.
// You can re-implement authentication here later if needed.

export function useAuth() {
    return {
        user: null,
        loading: false,
        signInWithGoogle: async () => { console.log("Sign in not implemented"); },
        signOutUser: async () => { console.log("Sign out not implemented"); },
    };
}
