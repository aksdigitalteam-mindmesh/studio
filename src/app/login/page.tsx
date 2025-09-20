"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace('/dashboard');
        }
    }, [user, router]);

    if (loading || user) {
        return (
             <div className="flex h-screen w-full items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 dark:from-green-900/50 dark:via-background dark:to-blue-900/50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 bg-primary p-3 rounded-full text-primary-foreground">
                        <Icons.Logo className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-3xl font-bold font-headline">Welcome to FitBoost</CardTitle>
                    <CardDescription>Your personal AI fitness and nutrition coach.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={signInWithGoogle} className="w-full" disabled={loading}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C307.2 92.2 280.4 80 248 80c-81.6 0-149.3 65.2-153.2 148.2H15.1C22.5 101.3 125.1 8 248 8s225.5 93.3 232.9 194.5H250v-77h238v44.3z"></path>
                        </svg>
                        Sign in with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
