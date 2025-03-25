import { firestore } from "@/firebase/server";

interface UserDetails {
  firstName: string;
  secondName: string;
  email: string;
  phone: string;
  membership: string;
}

export async function getUserDetails(userId: string): Promise<UserDetails | null> {
  if (!firestore) {
    throw new Error("Firestore is not initialized");
  }

  const userDoc = await firestore
    .collection('user-details')
    .doc(userId)
    .get();

  if (!userDoc.exists) {
    return null;
  }

  return userDoc.data() as UserDetails;
}