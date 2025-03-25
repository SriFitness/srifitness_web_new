import { NextRequest, NextResponse } from 'next/server';
import { auth, firestore} from "@/firebase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }>}
) {
  try {
    const { userId } = await params;

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
    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify-admin-subadmin`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!verifyResponse.ok) {
      return new NextResponse("Unauthorized access", { status: 401 });
    }

    const { role } = await verifyResponse.json();

    const decodedToken = await auth.verifyIdToken(authToken);
    const id = decodedToken.uid;

    // Allow only 'admin' or 'subadmin' to create users
    if (role !== "admin" && role !== "subadmin" && userId !== id) {
      return new NextResponse("Forbidden: Only admins, subadmins or relevant user can create users", { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json(
        { error: 'Start and end dates are required' },
        { status: 400 }
      );
    }

    // Fetch attendance records from Firestore
    const attendanceRef = firestore
      .collection("user-details")
      .doc(userId)
      .collection("attendance");
    
    // Query for attendance records between start and end dates
    const snapshot = await attendanceRef
      .where('date', '>=', start)
      .where('date', '<=', end + 'T23:59:59.999Z')
      .get();

    // Extract dates from the attendance records
    const attendance = snapshot.docs.map(doc => {
      const data = doc.data();
      // Extract just the date part (YYYY-MM-DD) from the ISO string
      return data.date.split('T')[0];
    });

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance data' },
      { status: 500 }
    );
  }
}