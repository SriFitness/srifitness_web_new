//app/api/user-details/[userId]/route.ts
import { firestore } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;

    try {
        if (!firestore) {
            return new NextResponse("Internal Error: Firestore is not initialized", { status: 500 });
        }

        const authToken = request.headers.get("authorization")?.split("Bearer ")[1] || null;

        if (!authToken) {
            return new NextResponse("Unauthorized: Missing auth token", { status: 401 });
        }

        const verifyAdmin = await fetch(`${request.nextUrl.origin}/api/auth/verify-admin-subadmin`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!verifyAdmin.ok){
            return new NextResponse("Unauthorized Access!", { status: 401 });
        }

        

        const { role } = await verifyAdmin.json();

        if (role !== "subadmin" && role !== "admin") {
            return new NextResponse("Forbidden: Only admins, subadmins and users can access user data", { status: 403 });
        }

        const userDoc = await firestore
            .collection('user-details')
            .doc(userId)
            .get();


        // Check if the document exists
        if (!userDoc.exists) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }


        // Get user data and check the role
        const userData = userDoc.data();
        if (!userData) {
            return NextResponse.json({ role: 'user' }, { status: 200 }); // Default role is "user"
        }

        return NextResponse.json(userData, { status: 200 });

    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}