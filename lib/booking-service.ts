import { Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket'
import { Booking, CreateBookingDTO, UpdateBookingDTO } from '@/types/booking'

export class BookingService {
  constructor(
    private socket: Socket<ServerToClientEvents, ClientToServerEvents>
  ) {}

  async createBooking(booking: CreateBookingDTO): Promise<void> {
    try {
      const newBooking = {
        ...booking,
        id: `${booking.userId}_${Date.now()}`,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Booking
      
      this.socket.emit('booking:create', newBooking)
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  }

  async updateBooking(bookingId: string, updatedBooking: UpdateBookingDTO): Promise<void> {
    try {
      const booking = {
        ...updatedBooking,
        id: bookingId,
        updatedAt: new Date(),
      } as Booking
      
      this.socket.emit('booking:update', { bookingId, updatedBooking: booking })
    } catch (error) {
      console.error('Error updating booking:', error)
      throw error
    }
  }

  async deleteBooking(bookingId: string): Promise<void> {
    try {
      this.socket.emit('booking:delete', bookingId)
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  }

  subscribeToBookingCreated(callback: (booking: Booking) => void): () => void {
    this.socket.on('booking:created', callback)
    return () => this.socket.off('booking:created', callback)
  }

  subscribeToBookingUpdated(
    callback: (data: { bookingId: string; updatedBooking: Booking }) => void
  ): () => void {
    this.socket.on('booking:updated', callback)
    return () => this.socket.off('booking:updated', callback)
  }

  subscribeToBookingDeleted(callback: (bookingId: string) => void): () => void {
    this.socket.on('booking:deleted', callback)
    return () => this.socket.off('booking:deleted', callback)
  }
}

