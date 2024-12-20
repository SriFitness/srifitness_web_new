import { firestore } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email?: string;
    phone?: string;
}

export async function GET(request: NextRequest) {
    try {
        if (!firestore) {
            return new NextResponse("Internal Error: Firestore is not initialized", { status: 500 });
        }

        const authToken = request.headers.get("authorization")?.split("Bearer ")[1] || null;

        if (!authToken) {
            return new NextResponse("Unauthorized: Missing auth token", { status: 401 });
        }

        const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify-admin`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!verifyResponse.ok) {
            return new NextResponse("Unauthorized access", { status: 401 });
        }

        const { role } = await verifyResponse.json();

        if (role !== "admin") {
            return new NextResponse("Forbidden: Only admins can access user data", { status: 403 });
        }

        // Fetch all users from the Firestore "users" collection
        const userDetailsSnapshot = await firestore.collection("user-details").get();

        if (userDetailsSnapshot.empty) {
            return NextResponse.json({ message: "No users found" }, { status: 404 });
        }

        // Map the documents to the User interface and filter by role
        const users: User[] = userDetailsSnapshot.docs
            .map((doc) => {
                const data = doc.data() as User;
                return {
                    ...data,
                    id: doc.id, // Use the `id` from Firestore if it's not already present
                };
            });

        // Return the filtered users
        return NextResponse.json(users, { status: 200 });


    } catch (error) {
        console.error("Error fetching users:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
