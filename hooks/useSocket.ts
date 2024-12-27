import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket';

export function useSocket() {
  const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | undefined>(undefined);
  const { toast } = useToast();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!socket.current) {
      console.log('Initializing from the client...');

      socket.current = io({
        // WebSocket connection URL (matches custom server's URL and port)
        path: '/api/socket', // Ensure this matches the path defined in `server.js`
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000, // Connection timeout
      });

      console.log('Current socket instance:', socket.current);

      // Event: Successfully connected
      socket.current.on('connect', () => {
        console.log('Socket connected successfully');
        reconnectAttempts.current = 0;
      });

      // Event: Connection error
      socket.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        console.error('Error details:', error.message);
        reconnectAttempts.current++;

        if (reconnectAttempts.current >= maxReconnectAttempts) {
          toast({
            title: 'Connection Error',
            description: `Failed to establish real-time connection. Error: ${error.message}`,
            variant: 'destructive',
          });
        }
      });

      // Event: General socket error
      socket.current.on('error', (error) => {
        console.error('Socket error:', error);
        toast({
          title: 'Socket Error',
          description: error.message,
          variant: 'destructive',
        });
      });

      // Event: Disconnection
      socket.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);

        if (reason === 'io server disconnect') {
          // If the server initiates the disconnect, reconnect manually
          socket.current?.connect();
        }
      });
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = undefined;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return socket.current;
}
