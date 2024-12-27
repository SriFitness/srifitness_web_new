//hooks/useBookingService.ts
import { useMemo } from 'react'
import { useSocket } from './useSocket'
import { BookingService } from '@/lib/booking-service'

export function useBookingService() {
  const socket = useSocket();
  
  return useMemo(() => {
    if (!socket) {
      return null
    }
    return new BookingService(socket)
  }, [socket])
}

