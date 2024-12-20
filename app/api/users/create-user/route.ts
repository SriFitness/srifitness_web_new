import { auth, firestore } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

interface UserData {
  firstName: string;
  secondName: string;
  email: string;
  phone: string;
  location: string;
  membership: string;
  password: string;
}

export async function POST(request: NextRequest) {
  // Reject if method is not POST
  if (request.method !== "POST") {
    return new NextResponse(`Method ${request.method} not allowed`, { status: 405 });
  }

  try {
    // Check if Firestore and Auth are initialized
    if (!firestore || !auth) {
      return new NextResponse("Internal Error: Firestore or Auth not initialized", { status: 500 });
    }

    // Extract the authorization token
    const authToken =
      request.headers.get("authorization")?.split("Bearer ")[1] || null;

    if (!authToken) {
      return new NextResponse("Unauthorized: Missing auth token", { status: 401 });
    }

    // Verify admin role via another API
    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify-admin`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!verifyResponse.ok) {
      return new NextResponse("Unauthorized access", { status: 401 });
    }

    const { role } = await verifyResponse.json();

    // Allow only 'admin' or 'subadmin' to create users
    if (role !== "admin" && role !== "subadmin") {
      return new NextResponse("Forbidden: Only admins or subadmins can create users", { status: 403 });
    }

    // Parse user data from request body
    const userData: UserData = await request.json();
    const { firstName, secondName, email, phone, location, membership, password } = userData;

    // Validate required fields
    if (!firstName || !secondName || !email || !phone || !location || !membership || !password) {
      return new NextResponse("Invalid input: All fields are required", { status: 400 });
    }

    let userRecord = null;
    const batch = firestore.batch();

    try {
      // Create a user in Firebase Authentication
      userRecord = await auth.createUser({
        email,
        password,
      });

      // Prepare Firestore document references
      const userDocRef = firestore.collection("users").doc(userRecord.uid);
      const userDetailsDocRef = firestore.collection("user-details").doc(userRecord.uid);

      // Write user data to Firestore in batch
      batch.set(userDocRef, { email, role: "user" });
      batch.set(userDetailsDocRef, {
        firstName,
        secondName,
        phone,
        location,
        membership,
        email
      });

      // Commit Firestore batch
      await batch.commit();

      // Success Response
      return NextResponse.json({
        success: true,
        message: "User created successfully",
        uid: userRecord.uid,
      });
    } catch (error) {
      // Delete user in Firebase Auth if Firestore write fails
      if (userRecord && userRecord.uid) {
        await auth.deleteUser(userRecord.uid);
      }
      return new NextResponse(`Failed to create user: ${error}`, { status: 500 });
    }
  } catch (error) {
    console.log("Error creating user:", error);
    return new NextResponse(`${error}`, { status: 500 });
  }
}
