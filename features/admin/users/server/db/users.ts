import 'server-only';
import { firestore } from "@/firebase/server";

type User = {
    id: string;
    firstName: string;
    secondName: string;
    email: string;
    location: string;
    phone: string;
    membership: string;
    status: 'new' | 'attention' | 'ok';
}

export async function getUsers(): Promise<User[]> {
    try {
        if (!firestore) {
            throw new Error("Internal Error: Firestore is not initialized");
        }

        const userDetailsSnapshot = await firestore.collection("user-details").get();

        if (userDetailsSnapshot.empty) {
            return [];
        }

        const users: User[] = await Promise.all(userDetailsSnapshot.docs.map(async (doc) => {
            const data = doc.data() as Omit<User, 'id' | 'status'>;
            const userId = doc.id;

            if (!firestore) {
                throw new Error("Internal Error: Firestore is not initialized");
            }

            const medicalInquiriesDoc = await firestore
                .collection("user-details")
                .doc(userId)
                .collection("medical-inquiries")
                .limit(1)
                .get();

            const personalDetailsDoc = await firestore
                .collection("user-details")
                .doc(userId)
                .collection("personal-details")
                .limit(1)
                .get();

            const workoutDetailsDoc = await firestore
                .collection("user-details")
                .doc(userId)
                .collection("workout-details")
                .limit(1)
                .get();

            let status: 'new' | 'attention' | 'ok' = 'new';
            
            if (!medicalInquiriesDoc.empty && !personalDetailsDoc.empty) {
                if (workoutDetailsDoc.empty) {
                    status = 'attention';
                } else {
                    status = 'ok';
                }
            }

            return {
                ...data,
                id: userId,
                status
            };
        }));

        return users;

    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}