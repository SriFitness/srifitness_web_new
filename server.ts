//server.ts (in the root)
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { realtimeDB } from './firebase/server'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  })

  const io = new SocketIOServer(server, {
    path: '/api/socket',
    addTrailingSlash: false,
  })

  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id)

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })

    // Listen for booking events
    socket.on('booking:create', (data) => {
      // Handle booking creation
      createBooking(data).then(() => {
        io.emit('booking:created', data)
      })
    })

    socket.on('booking:update', (data) => {
      // Handle booking update
      updateBooking(data).then(() => {
        io.emit('booking:updated', data)
      })
    })

    socket.on('booking:delete', (id) => {
      // Handle booking deletion
      deleteBooking(id).then(() => {
        io.emit('booking:deleted', id)
      })
    })
  })

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
  const hostname = '0.0.0.0'
  server.listen(PORT, hostname, () => {
    console.log(`> Ready on http://${hostname}:${PORT}`)
  })
})

// Firebase Realtime Database operations 
async function createBooking(data: any) {
  if (!realtimeDB){
    console.log("firebase isn't initialized yet.")
    return new Error("Internal server error");
  } 
  const ref = realtimeDB.ref('bookings').push()
  await ref.set(data)
  return ref.key
}

async function updateBooking(data: any) {
  if (!realtimeDB){
    console.log("firebase isn't initialized yet.")
    return new Error("Internal server error");
  } 
  await realtimeDB.ref(`bookings/${data.id}`).update(data)
}

async function deleteBooking(id: string) {
  if (!realtimeDB){
    console.log("firebase isn't initialized yet.")
    return new Error("Internal server error");
  } 
  await realtimeDB.ref(`bookings/${id}`).remove()
}

