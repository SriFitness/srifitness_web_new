"use client"

import { auth } from '@/firebase/client';
import { signInWithEmailAndPassword, User, signOut } from 'firebase/auth'
import { resolve } from 'path';
import { createContext, useContext, useState } from 'react';

type AuthContextType = {
    currentUser : User | null;
    isAdmin: boolean;
    isSubAdmin: boolean;
    loginEmail: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null> (null);

export const AuthProvider = ({children} : {children : any}) =>{

    const [ currentUser, setCurrentUser ] = useState<User | null>(null);
    const [ isAdmin, setIsAdmin ] = useState<boolean>(false);
    const [ isSubAdmin, setIsSubAdmin ] = useState<boolean>(false);

    const loginEmail = () : Promise<void> => {
        return new Promise((resolve, reject) => {
            if(!auth) {
                reject();
                return;
            }
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
              });
        })
    }
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