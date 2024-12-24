import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import moment from 'moment'

interface Booking {
  id: string
  title: string
  start: string
  end: string
  userId: string
  userName: string
}

interface UnavailablePeriod {
  id: string
  start: string
  end: string
  reason: string
}

interface ScheduleListProps {
  bookings: Booking[]
  unavailablePeriods: UnavailablePeriod[]
  onEdit: (item: Booking | UnavailablePeriod) => void
  onDeleteUnavailable: (id: string) => void
}

export function ScheduleList({ bookings, unavailablePeriods, onEdit, onDeleteUnavailable }: ScheduleListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell>Booking</TableCell>
            <TableCell>{moment(booking.start).format('MMMM Do YYYY, h:mm a')}</TableCell>
            <TableCell>{moment(booking.end).format('MMMM Do YYYY, h:mm a')}</TableCell>
            <TableCell>{booking.userName}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onEdit(booking)}>
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {unavailablePeriods.map((period) => (
          <TableRow key={period.id}>
            <TableCell>Unavailable</TableCell>
            <TableCell>{moment(period.start).format('MMMM Do YYYY, h:mm a')}</TableCell>
            <TableCell>{moment(period.end).format('MMMM Do YYYY, h:mm a')}</TableCell>
            <TableCell>{period.reason}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => onEdit(period)} className="mr-2">
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDeleteUnavailable(period.id)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

