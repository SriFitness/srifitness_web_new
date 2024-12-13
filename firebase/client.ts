"use client"

import { getApps, initializeApp } from "firebase/app"
import { Auth, getAuth } from "firebase/auth";

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

const currentApps = getApps();
if ( currentApps.length <= 0){
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} else {
    auth = getAuth(currentApps[0])
}

export { auth };