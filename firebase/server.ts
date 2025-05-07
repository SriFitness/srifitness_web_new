//firebase/server.ts
import { initializeApp, ServiceAccount, cert, getApps } from 'firebase-admin/app';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Auth, getAuth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';
import { getDatabase, Database } from 'firebase-admin/database';

let firestore: Firestore | undefined;
let auth: Auth | undefined;
let storage: Storage | undefined;
let realtimeDB: Database | undefined;

const currentApps = getApps();
if (currentApps.length === 0) {
    // Check if environment variables are available
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        // Use environment variables
        const app = initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            } as ServiceAccount),
            storageBucket: "srifitness-96c1b.firebasestorage.app",
            databaseURL: "https://srifitness-96c1b-default-rtdb.asia-southeast1.firebasedatabase.app/",
        });

        firestore = getFirestore(app);
        auth = getAuth(app);
        storage = getStorage(app);
        realtimeDB = getDatabase(app);
    } else {
        // Fallback to local file for development
        try {
            // Use dynamic import with import() instead of require()
            import('./serviceAccount.json').then((serviceAccount) => {
                const app = initializeApp({
                    credential: cert(serviceAccount.default as ServiceAccount),
                    storageBucket: "srifitness-96c1b.firebasestorage.app",
                    databaseURL: "https://srifitness-96c1b-default-rtdb.asia-southeast1.firebasedatabase.app/",
                });
    
                firestore = getFirestore(app);
                auth = getAuth(app);
                storage = getStorage(app);
                realtimeDB = getDatabase(app);
            }).catch(error => {
                console.error("Failed to initialize Firebase:", error);
            });
        } catch (error) {
            console.error("Failed to initialize Firebase:", error);
        }
    }
} else {
    const app = currentApps[0];
    firestore = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    realtimeDB = getDatabase(app);
}

export { firestore, auth, storage, realtimeDB };
