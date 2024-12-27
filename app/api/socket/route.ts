// //app/api/socket/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { Server as SocketIOServer } from 'socket.io'
// import { createServer } from 'http'
// import { SocketService } from '@/lib/socket-service'

// const httpServer = createServer()
// const io = new SocketIOServer(httpServer, {
//   path: '/api/socket',
//   addTrailingSlash: false,
//   transports: ['websocket', 'polling'],
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type'],
//     credentials: true,
//   },
// })

// SocketService.initialize(io)

// export async function GET(req: NextRequest) {
//   try {
//     const socket = SocketService.getInstance()
//     if (!socket) {
//       throw new Error('Socket.IO server not initialized')
//     }

//     // Handle the socket connection
//     socket.on('connection', (clientSocket) => {
//       console.log('New client connected:', clientSocket.id)

//       clientSocket.on('disconnect', () => {
//         console.log('Client disconnected:', clientSocket.id)
//       })
//     })

//     return new NextResponse('Socket.IO server is running', {
//       status: 200,
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'GET, POST',
//         'Access-Control-Allow-Headers': 'Content-Type',
//         'Access-Control-Allow-Credentials': 'true',
//       }
//     })
//   } catch (error) {
//     console.error('Socket.IO Error:', error)
//     return new NextResponse('Internal Server Error', { status: 500 })
//   }
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }


import { Server as SocketIOServer } from "socket.io";
import { NextRequest } from "next/server";
import { Server as HTTPServer } from "http";

// Create a type to extend the Node.js Server type
interface ServerWithSocket extends HTTPServer {
  io?: SocketIOServer;
}

export async function GET(req: NextRequest) {
  const res = new Response("Socket.io handler initialized", {
    status: 200,
  });

  const server = (res as any).socket?.server as ServerWithSocket;

  if (server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");

    const io = new SocketIOServer(server);

    // Attach the `io` instance to the server so it's reused
    server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  return res;
}


