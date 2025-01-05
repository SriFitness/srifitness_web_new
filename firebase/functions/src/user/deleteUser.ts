// import * as admin from "firebase-admin";
// import { HttpsError } from "firebase-functions/v2/https";
// import { checkRole } from "../utils/checkRole";

// export interface DeleteUserData {
//   userId: string;
// }

// export const deleteUser = async (data: DeleteUserData, auth: { uid: string } | undefined) => {
//   const { userId } = data;

//   if (!auth) {
//     throw new HttpsError("unauthenticated", "User must be authenticated to perform this action.");
//   }

//   const db = admin.firestore();

//   if (!(await checkRole(auth.uid, "admin"))) {
//     throw new HttpsError("permission-denied", "Only admins can delete users.");
//   }

//   try {
//     await admin.auth().deleteUser(userId);
//     await db.collection("users").doc(userId).delete();
//     return { message: "User deleted successfully" };
//   } catch (error) {
//     throw new HttpsError("internal", `Failed to delete user. Error: ${error}`);
//   }
// };
