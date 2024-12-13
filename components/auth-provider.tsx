"use client"

import { auth } from '@/firebase/client';
import { signInWithEmailAndPassword, User, signOut } from 'firebase/auth'
import { resolve } from 'path';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    currentUser : User | null;
    isAdmin: boolean;
    isSubAdmin: boolean;
    loginEmail: ({ email, password }: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null> (null);

export const AuthProvider = ({children} : {children : any}) =>{

    const [ currentUser, setCurrentUser ] = useState<User | null>(null);
    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);
    const [ isSubAdmin, setIsSubAdmin ] = useState<boolean>(false);

    useEffect (() => {
        if (!auth) return;

        return auth.onAuthStateChanged(async (user) => {
            if(!user) {
                setCurrentUser(null);
            }
            if (user) {
                setCurrentUser(user);
            }
        })
    }, []);

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

    
    const logout = () : Promise<void> => {
        return new Promise((resolve, reject) => {
            if(!auth) {
                reject();
                return;
            }
            signOut(auth).then(() => {
                // Sign-out successful.
              }).catch((error) => {
                // An error happened.
              });
        })
    }

    return(
        <AuthContext.Provider
            value={{
                currentUser,
                isAdmin,
                isSubAdmin,
                loginEmail,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);