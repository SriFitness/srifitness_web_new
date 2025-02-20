import QRScanner from '@/features/admin/users/attendance/components/QRScanner'

export default function AttendancePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Attendance Scanner</h1>
      <QRScanner />
    </div>
  )
}