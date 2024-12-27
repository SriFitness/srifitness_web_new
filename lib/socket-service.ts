//lib/socket-service.ts
import { Server as SocketIOServer } from 'socket.io'
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '@/types/socket'

export class SocketService {
  private static io: SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  > | null = null

  static getInstance(): SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  > {
    if (!this.io) {
      throw new Error('Socket.IO has not been initialized')
    }
    return this.io
  }

  static initialize(io: SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >) {
    console.log("calling for socket initialization...");
    if (this.io) {
      console.warn('Socket.IO is already initialized')
      return
    }

    this.io = io

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('booking:create', (booking) => {
        socket.broadcast.emit('booking:created', booking)
      })

      socket.on('booking:update', (data) => {
        socket.broadcast.emit('booking:updated', data)
      })

      socket.on('booking:delete', (bookingId) => {
        socket.broadcast.emit('booking:deleted', bookingId)
      })

      socket.on('disconnect', (reason) => {
        console.log('Client disconnected:', socket.id, 'Reason:', reason)
      })

      socket.on('error', (error) => {
        console.error('Socket error:', error)
        socket.emit('error', { message: 'Internal server error' })
      })
    })

    console.log('Socket.IO initialized')
  }
}

