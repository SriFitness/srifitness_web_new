import { initializeApp, ServiceAccount, cert, getApps } from 'firebase-admin/app';
import serviceAccount from './serviceAccount.json';
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
    const app = initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
        storageBucket: "srifitness-96c1b.firebasestorage.app", // Add your storage bucket name here
        databaseURL: "https://srifitness-96c1b-default-rtdb.asia-southeast1.firebasedatabase.app/",
    });

    firestore = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    realtimeDB = getDatabase(app);
} else {
    const app = currentApps[0];
    firestore = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    realtimeDB = getDatabase(app)
}

export { firestore, auth, storage, realtimeDB };
