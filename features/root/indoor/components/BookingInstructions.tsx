//features/root/indoor/components/BookingInstructions.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export function BookingInstructions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>How to Book</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Check the calendar for available time slots.</li>
            <li>Click the "Book Now" button below.</li>
            <li>Select your desired date and time in the booking form.</li>
            <li>Confirm your booking.</li>
          </ol>
          <p className="mt-4 text-sm text-gray-600">
            Note: Bookings are limited to 4 hours maximum, with a 10-minute gap between bookings.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

