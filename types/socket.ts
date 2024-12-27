//types/socket.ts

import { Booking } from '@/types/booking'

export interface ServerToClientEvents {
  'booking:created': (booking: Booking) => void
  'booking:updated': (data: { bookingId: string; updatedBooking: Booking }) => void
  'booking:deleted': (bookingId: string) => void
  'error': (error: { message: string }) => void
}

export interface ClientToServerEvents {
  'booking:create': (booking: Booking) => void
  'booking:update': (data: { bookingId: string; updatedBooking: Booking }) => void
  'booking:delete': (bookingId: string) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  userId: string
  userName: string
}

