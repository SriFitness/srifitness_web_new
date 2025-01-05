// import * as admin from "firebase-admin";
// import { HttpsError } from "firebase-functions/v2/https";
// import { checkRole } from "../utils/checkRole";

// export interface CreateUserData {
//   email: string;
//   password: string;
//   firstName: string;
//   lastName: string;
//   gymLocation: string;
//   phone: string;
//   membershipPlan: string;
// }

// export const createUser = async (data: CreateUserData, auth: { uid: string } | undefined) => {
//   if (!auth) {
//     throw new HttpsError("unauthenticated", "User must be authenticated to perform this action.");
//   }

//   const db = admin.firestore();

//   if (!(await checkRole(auth.uid, "admin"))) {
//     throw new HttpsError("permission-denied", "Only admins can create users.");
//   }

//   const { email, password, firstName, lastName, gymLocation, phone, membershipPlan } = data;
//   const role = "user";

//   let userRecord = null;
//   const batch = db.batch();

//   try {
//     userRecord = await admin.auth().createUser({ email, password });

//     if (!firstName || !lastName || !gymLocation || !phone || !membershipPlan) {
//       throw new HttpsError("invalid-argument", "All fields are required.");
//     }

//     const userDocRef = db.collection("users").doc(userRecord.uid);
//     const userDetailsDocRef = db.collection("user-details").doc(userRecord.uid);

//     batch.set(userDocRef, { email, role });
//     batch.set(userDetailsDocRef, { firstName, lastName, gymLocation, phone, membershipPlan });

//     await batch.commit();

//     return { success: true, message: "User created successfully" };
//   } catch (error) {
//     if (userRecord && userRecord.uid) {
//       await admin.auth().deleteUser(userRecord.uid);
//     }
//     throw new HttpsError("internal", `Unable to create user. Error: ${error}`);
//   }
// };
