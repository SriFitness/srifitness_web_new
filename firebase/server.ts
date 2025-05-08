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
    // Use hardcoded values from serviceAccount.json
    const app = initializeApp({
        credential: cert({
            projectId: "srifitness-96c1b",
            privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQC6cCmLJmPBrE0H\nybiE+rzcKLobuG949ZzaD0Hsi0zTKyIvatYHvdA54CzCLLApQqdXKlf9DE0e2z70\nlngkBIsS/muLLtN/8lwIIpGLIDT9N5NG0tAc/i/7vqtXq+xkD5OiO2LrwiUItMpc\nuVLKYpxj0pKFcKERdzb4zUe/7te55XIXKiLhE+CRyNoYMg4VJQk8WR6U4SwMgVdv\nmxK67KvSggxBevB0fG2isY/deFsLzO3KQC4jCE1mWPZmdhcwJjt7xIvF4qXd9Fi5\nPC8SxuekU1AEAgy3bCKXAjSjZriR1UCvYd44z8G2lJ9ierTLZr1a0ZlUkGyu9A8n\nQs2n+S5JAgMBAAECgf8KyEctBQQ/7y/3EY/2y4mEMg+t0dlLOukzz7xOhzGqPbDR\nxhv+SGatKxgWPzhGRw10vROETwAKXiOwngMqEhkx3Ha/Ve7XN3tFxEhDA5K3oIZO\np5tv2O40meeyeI0sPEibvOG7spQOLNhOWds+IEsyQdfT7gwNUvtFkwt96qCBGJUz\nFEl6kZTC7E0EQWDTORXTgbLZx52n4ztk07nrKGwlK1FE9ZajVnOgozlVbeH/0/gj\nZ8RI9T0+XF7Z0K6QlrfxEZaxJI59ELtCevV2yQYqyur/eFCoLJGeOI2FUE8OPcOf\n/kAsjvpIgOTChzmnDG2agIo1gYSPvtOfkPgkizUCgYEA9Xmuy4DOU+zrTD50RIby\nt1mI7YA8Z19Lp7WzPwwiaiZSPjcD0rozQzu1lc0DSwHtgch5fvvgnC/2rUwW9SPJ\nAmd2oYuzlgrb+HKyND/NSoQMpBqMvak9v9gZhKEw7/FXD9bWkV48YoYCoI4YcXgJ\nOPydYn/eGDhNzNkwazQjeE0CgYEAwm59+ay7oN9j7BJntemf8APOUklevhsjdBrd\nlcymlM6f4VqxSicmeUsGOuu1Coy2LauRkmfz4ZmEVcX9i95g+DFwc+OSB09ONTEb\nGB/s2fyKXOvgSX+4K7440zbzFksYHvxwodt5NrMOsrYJL2PD3fTIjIQsuhTrb1JT\nEIyVi+0CgYAD/iizsrKodtAU+2cUvkUwakpp4o4Y+FnYroHt4pqks17fGDH9uX2f\n+Fapyx3kmHFujP487Ifownb2tqgg8KYSXfB2DDmtlRui3Oq9ItSKA7/Y432qkBgr\nCK7Rk3WiUYCjB1GSJ8A/sgJU7jrDjbpIrQM6WO4Z4sCRNm8tLznseQKBgC3oTNJQ\n2JRpanxo9Bfdq6fOHj8Ll9UnLz3QwhUGlyZ3iwR4l3e8urbU4gmzcbGl+7XY1qxM\n4yaXSsm9z9ngjeDMO5MBXo9fSEYC7DTMBO6LVFgQUYrJH0EkzuIADXFsFavrSuTM\nn1gs+wFzPcP0uGCF1XxoEO921QgZ1gcISp8ZAoGBAMo4y9VcOaIeVw7Dq10bLprt\nXQ5tCRmHfBkjs3cDQeJko+M4+PeP1EZjjYOW/wmE+Y8o6tmV3fD9UgwJCV4sA9gW\nKPipyQby9tzfLtUwlvOGPyrsvCsracRfAPiGcnp9oxsT4fqFtjIy0XfyJw8zHO/b\nbkWxdmQIGp3+sCBt6HFq\n-----END PRIVATE KEY-----\n",
            clientEmail: "firebase-adminsdk-2ph88@srifitness-96c1b.iam.gserviceaccount.com",
        } as ServiceAccount),
        storageBucket: "srifitness-96c1b.firebasestorage.app",
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
    realtimeDB = getDatabase(app);
}

export { firestore, auth, storage, realtimeDB };
