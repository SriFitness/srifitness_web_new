import * as admin from "firebase-admin";

export const checkRole = async (userId: string, requiredRole: string): Promise<boolean> => {
  const db = admin.firestore();
  const userDoc = await db.collection("users").doc(userId).get();
  const userRole = userDoc.data()?.role;
  return userRole === requiredRole;
};
