"use client"

import { auth } from '@/firebase/client';
import { signInWithEmailAndPassword, User, signOut, createUserWithEmailAndPassword } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from "js-cookie";

export function getAuthToken(): string | undefined {
    return Cookies.get("firebaseIdToken");
}

export function setAuthToken(token: string): string | undefined {
    return Cookies.set("firebaseIdToken", token, { secure: true });
}

export function removeAuthToken(): void {
    return Cookies.remove("firebaseIdToken");
}

type AuthContextType = {
    currentUser: User | null;
    isAdmin: boolean;
    isSubAdmin: boolean;
    isUser: boolean;
    loginEmail: ({ email, password }: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isSubAdmin, setIsSubAdmin] = useState<boolean>(false);
    const [isUser, setIsUser] = useState<boolean>(false);

    useEffect(() => {
        if (!auth) return;

        return auth.onAuthStateChanged(async (user) => {
            if (!user) {
                setCurrentUser(null);
                setIsAdmin(false);
                setIsSubAdmin(false);
                setIsUser(false);
                removeAuthToken();
                return;
            }

            const token = await user.getIdToken();
            setCurrentUser(user);
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
            }
        });
    }, []);

    useEffect(() => {
      console.log(`User is admin: ${isAdmin}`);
    }, [isAdmin])
    

    const loginEmail = ({ email, password }: { email: string; password: string }): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!auth) {
                reject(new Error("Auth instance is not available"));
                return;
            }
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    resolve();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    reject(new Error(`Error ${errorCode}: ${errorMessage}`));
                });
        });
    };

    const logout = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!auth) {
                reject(new Error("Auth instance is not available"));
                return;
            }
            signOut(auth).then(() => {
                // Sign-out successful.
                resolve();
            }).catch((error) => {
                // An error happened.
                reject(error);
            });
        })
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

