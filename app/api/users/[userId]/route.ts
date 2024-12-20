import { auth, firestore } from "@/firebase/server";
import { DecodedIdToken } from "firebase-admin/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    const { userId } = await params;
    try {
        if (!firestore)
            return new NextResponse("Internal Error", { status: 500 });

        const authToken =
            request.headers.get("authorization")?.split("Bearer ")[1] || null;

        let user: DecodedIdToken | null = null;
        if (auth && authToken)
            try {
                user = await auth.verifyIdToken(authToken);
            } catch (error) {
                console.log("auth or auth token")
                // One possible error is the token being expired, return forbidden
                console.log(error);
            }

        const userDoc = await firestore
            .collection('users')
            .doc(userId)
            .get();


        // Check if the document exists
        if (!userDoc.exists) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }


        // Get user data and check the role
        const userData = userDoc.data();
        if (!userData || !userData.role) {
            return NextResponse.json({ role: 'user' }, { status: 200 }); // Default role is "user"
        }

        // Only admin or user can delete user info
        const valid = user?.uid === userId || userData.role === 'admin';
        if (!valid) return new NextResponse("Unauthorized", { status: 401 });

        return NextResponse.json({ role: userData.role }, { status: 200 });
        
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}
