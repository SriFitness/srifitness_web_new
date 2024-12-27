import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface UpcomingBookingsProps {
  bookings: Booking[];
  onCancel: (bookingId: string) => void;
  onReschedule: (bookingId: string) => void;
}

export function UpcomingBookings({ bookings, onCancel, onReschedule }: UpcomingBookingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Upcoming Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <p className="font-semibold">{booking.date}</p>
                    <p>{booking.startTime} - {booking.endTime}</p>
                    <div className="mt-2 flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onReschedule(booking.id)}>
                        Reschedule
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onCancel(booking.id)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You have no upcoming bookings.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

