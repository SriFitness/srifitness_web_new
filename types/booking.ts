import { User } from "firebase/auth"

export interface Booking {
  id: string
  scheduleNumber?: string
  startTime: Date
  endTime: Date
  userId?: string
  userName?: string
  status: BookingStatus
  createdAt: Date
  updatedAt: Date
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface CreateBookingDTO {
  startTime: Date
  endTime: Date
  user: User
}

export interface UpdateBookingDTO {
  startTime?: Date
  endTime?: Date
  status?: BookingStatus
}

