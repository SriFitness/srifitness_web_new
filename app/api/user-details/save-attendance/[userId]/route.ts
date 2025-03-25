import { NextRequest, NextResponse } from 'next/server';
import { auth, firestore} from "@/firebase/server";
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
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

    if (role !== "admin" && role !== "subadmin") {
        return new NextResponse("Forbidden: Only admins, subadmins can create users", { status: 403 });
    }

    const { userId } = await params;
    
    // Get current date and time in Sri Lanka time zone (Asia/Colombo)
    const now = new Date();
    // Convert to Sri Lanka time (UTC+5:30)
    const sriLankaTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    const attendanceDate = sriLankaTime.toISOString();
    
    // Create a date-based ID in format: YYYY-MM-DD_HH-MM-SS using Sri Lanka time
    const dateId = sriLankaTime.toISOString()
        .replace('T', '_')
        .replace(/:/g, '-')
        .split('.')[0]; // Remove milliseconds
    
    // Use Firestore to save attendance
    const attendanceRef = firestore
        .collection("user-details")
        .doc(userId)
        .collection("attendance");
    
    // Add a new attendance document with date-based ID
    await attendanceRef.doc(dateId).set({
        date: attendanceDate,
        recordedBy: role,
        timestamp: Timestamp.now(),
        timeZone: "Asia/Colombo"
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Attendance recorded successfully',
      date: attendanceDate
    });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return NextResponse.json(
      { error: 'Failed to save attendance' },
      { status: 500 }
    );
  }
}