import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/v2/https";
import { checkRole } from "../utils/checkRole";

export interface UpdateUserRoleData {
  userId: string;
  newRole: string;
}

export const updateUserRole = async (data: UpdateUserRoleData, auth: { uid: string } | undefined) => {
  const { userId, newRole } = data;

  if (!auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated to perform this action.");
  }

  const db = admin.firestore();

  if (!(await checkRole(auth.uid, "admin"))) {
    throw new HttpsError("permission-denied", "Only admins can change user roles.");
  }

  await db.collection("users").doc(userId).update({ role: newRole });
  return { message: "User role updated successfully" };
};
