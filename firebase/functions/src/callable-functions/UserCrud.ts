const https = require("firebase-functions/v1/https");
const admin = require("firebase-admin");

if (admin.apps.length === 0) {
    admin.initializeApp();
}

const db = admin.firestore();

// Middleware function to check roles
const checkRole = async (userId: string, requiredRole: string) => {
  const userDoc = await db.collection("users").doc(userId).get();
  const userRole = userDoc.data().role;
  return userRole === requiredRole;
};


exports.createUser = https.onCall(async (data: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    gymLocation: string; 
    phone: string; 
    membershipPlan: string; 
}, context: { auth: { uid: string; }; }) => {


  console.log("\n\n\n\n\n");
  console.log(data);
  console.log("\n\n\n\n\n");
  // Check if user is authenticated
  if (!context.auth) {
      throw new https.HttpsError("unauthenticated", "User must be authenticated to perform this action.");
  }

  // Check if user has admin role
  if (!(await checkRole(context.auth.uid, "admin"))) {
      throw new https.HttpsError("permission-denied", "Only admins can create users.");
  }

  const { email, password, firstName, lastName, gymLocation, phone, membershipPlan } = data;
  const role = "user";

  let userRecord = null;
  // Start a batch write
  const batch = db.batch();

  try {
      // Create user in Firebase Authentication
      userRecord = await admin.auth().createUser({
          email,
          password,
      });

      // Check for required fields
      if (!firstName || !lastName || !gymLocation || !phone || !membershipPlan) {
        throw new https.HttpsError("invalid-argument", "All fields are required.");
      }

      // Create a reference to the users and user-details documents

      const userDocRef = db.collection("users").doc(userRecord.uid);
      const userDetailsDocRef = db.collection("user-details").doc(userRecord.uid);

      // Add writes to the batch
      batch.set(userDocRef, { email, role });
      batch.set(userDetailsDocRef, {
          firstName : firstName,
          lastName: lastName,
          gymLocation : gymLocation,
          phone : phone,
          membershipPlan : membershipPlan
      });

      // Commit the batch
      await batch.commit();

      return { message: "User created successfully", uid: userRecord.uid };
  } catch (error) {
      console.error("Error creating user:", error);

      // Rollback: Delete the user in Firebase Authentication if created
      if (userRecord && userRecord.uid) {
          await admin.auth().deleteUser(userRecord.uid);
          console.log("Rollback: Deleted user in Firebase Authentication");
      }

      throw new https.HttpsError("internal", "Unable to create user. Please try again.");
  }
});





  
exports.getUser = https.onCall(async (data: { userId: any; }, context: { auth: { uid: string; }; }) => {
    const { userId } = data;
  
    if (!(await checkRole(context.auth.uid, "admin"))) {
      throw new https.HttpsError("permission-denied", "Only admins can view user details.");
    }
  
    const userDoc = await db.collection("users").doc(userId).get();
    return userDoc.exists ? userDoc.data() : { message: "User not found" };
  });

  
exports.updateUserRole = https.onCall(async (data: { userId: any; newRole: any; }, context: { auth: { uid: string; }; }) => {
    const { userId, newRole } = data;
  
    if (!(await checkRole(context.auth.uid, "admin"))) {
      throw new https.HttpsError("permission-denied", "Only admins can change user roles.");
    }
  
    await db.collection("users").doc(userId).update({ role: newRole });
    return { message: "User role updated successfully" };
  });

  
exports.deleteUser = https.onCall(async (data: { userId: any; }, context: { auth: { uid: string; }; }) => {
    const { userId } = data;
  
    if (!(await checkRole(context.auth.uid, "admin"))) {
      throw new https.HttpsError("permission-denied", "Only admins can delete users.");
    }
  
    await admin.auth().deleteUser(userId);
    await db.collection("users").doc(userId).delete();
  
    return { message: "User deleted successfully" };
  });
  