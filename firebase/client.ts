"use client"

import { getApps, initializeApp } from "firebase/app"
import { Auth, getAuth } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator, Functions } from "firebase/functions";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { Firestore, getFirestore } from "firebase/firestore";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDOATdDVy2tMkbiha76_zK_EkniEjTh9Lw",
    authDomain: "srifitness-96c1b.firebaseapp.com",
    databaseURL: "https://srifitness-96c1b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "srifitness-96c1b",
    storageBucket: "srifitness-96c1b.firebasestorage.app",
    messagingSenderId: "446562789301",
    appId: "1:446562789301:web:23da2385e5d450d62e5bfc",
    measurementId: "G-07SGC18VPB"
};

let auth: Auth | undefined = undefined;
let functions: Functions | undefined = undefined;
let storage: FirebaseStorage | undefined = undefined;
let firestore: Firestore | undefined = undefined;
let realtimeDB: Database | undefined = undefined;

const currentApps = getApps();
if ( currentApps.length <= 0){
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    functions = getFunctions(app);
    storage = getStorage(app);
    firestore = getFirestore(app);
    realtimeDB = getDatabase(app);

    if (process.env.NODE_ENV === "development") {
        connectFunctionsEmulator(functions, "localhost", 5001);
    }
} else {
    auth = getAuth(currentApps[0])
    storage = getStorage(currentApps[0]);
    firestore = getFirestore(currentApps[0]);
    realtimeDB = getDatabase(currentApps[0]);
}

export { auth, functions, storage, firestore, realtimeDB };