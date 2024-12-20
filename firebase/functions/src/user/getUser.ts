import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v2/https";
import { checkRole } from "../utils/checkRole";

export interface GetUserData {
  userId: string;
}

export const getUser = async (data: GetUserData, auth: { uid: string } | undefined) => {
  const { userId } = data;

  if (!auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated to perform this action.");
  }

  const db = admin.firestore();

  if (!(await checkRole(auth.uid, "admin"))) {
    throw new HttpsError("permission-denied", "Only admins can view user details.");
  }

  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) {
    throw new HttpsError("not-found", "User not found.");
  }

  return userDoc.data();
};
