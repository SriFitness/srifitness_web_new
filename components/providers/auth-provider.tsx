"use client"

//root/components/providers/auth-provider.tsx

import { auth } from '@/firebase/client';
import { signInWithEmailAndPassword, User, signOut, onAuthStateChanged } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import loadingGif from '@/public/loadingGif.gif'

// Set token expiration time (e.g., 20 seconds for testing)
const TOKEN_EXPIRATION_TIME = 60 * 60 * 1000;


export function getAuthToken(): string | undefined {
    return Cookies.get("firebaseIdToken");
}

export function setAuthToken(token: string): void {
    const expirationTime = new Date(new Date().getTime() + TOKEN_EXPIRATION_TIME);
    Cookies.set("firebaseIdToken", token, {
        expires: expirationTime,
        secure: true,
        sameSite: 'strict'
    });
    Cookies.set("tokenExpiration", expirationTime.getTime().toString(), {
        expires: expirationTime,
        secure: true,
        sameSite: 'strict'
    });
}


export function removeAuthToken(): void {
    Cookies.remove("firebaseIdToken");
    Cookies.remove("tokenExpiration");
}

export function isTokenExpired(): boolean {
    const expirationTime = Cookies.get("tokenExpiration");
    if (!expirationTime) return true;
    return new Date().getTime() > parseInt(expirationTime);
}

type AuthContextType = {
    currentUser: User | null;
    isAdmin: boolean;
    isSubAdmin: boolean;
    isUser: boolean;
    loginEmail: ({ email, password }: { email: string; password: string }) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isSubAdmin, setIsSubAdmin] = useState<boolean>(false);
    const [isUser, setIsUser] = useState<boolean>(false);
    const [isLogged, setIsLogged] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!auth) return;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log("Auth state changed", user);
            setCurrentUser(user);
            setIsLogged(!!user);
            setLoading(false);

            if (user) {
                try {
                    const token = await user.getIdToken(true);
                    setAuthToken(token);

                    const response = await fetch(`/api/users/${user.uid}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const { role } = await response.json();
                        const normalizedRole = role.trim().toLowerCase();

                        setIsAdmin(normalizedRole === "admin");
                        setIsSubAdmin(normalizedRole === "subadmin");
                        setIsUser(normalizedRole === "user");
                    } else {
                        console.error("Could not get user info");
                        removeAuthToken();
                    }
                } catch (error) {
                    console.error("Error refreshing token:", error);
                    removeAuthToken();
                }
            } else {
                setIsAdmin(false);
                setIsSubAdmin(false);
                setIsUser(false);
                removeAuthToken();
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const checkTokenExpiration = setInterval(() => {
            console.log("Checking for token expiration");
            console.log("Is logged:", isLogged);
            console.log("Current user:", currentUser);
            if (isTokenExpired() && isLogged) {
                logout();
                toast({
                    title: "Token has expired!",
                    description: "The token has expired. Please login again.",
                    variant: "destructive"
                });
                router.push('/sign-in');
            }
        }, 60000);

        return () => clearInterval(checkTokenExpiration);
    }, [isLogged, currentUser, toast, router]);

    const loginEmail = async ({ email, password }: { email: string; password: string }): Promise<boolean> => {
        
        try {
            if(!auth) throw new Error("Firebase is not initialized!!!")
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const token = await user.getIdToken(true);
            setAuthToken(token);
            setIsLogged(true);
            return true;
        } catch (error: any) {
            console.error("Login error:", error);
            throw new Error(`Error ${error.code}: ${error.message}`);
        }
    };
    
    const logout = async (): Promise<void> => {
        try {
            if(!auth) throw new Error("Firebase is not initialized!!!")
            await signOut(auth);
            setIsLogged(false);
            setCurrentUser(null);
            removeAuthToken();
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAdmin,
                isSubAdmin,
                isUser,
                loginEmail,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

