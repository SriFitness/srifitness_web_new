import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './socket'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
    }
  }
}

