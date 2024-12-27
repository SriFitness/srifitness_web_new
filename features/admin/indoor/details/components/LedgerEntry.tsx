import React from 'react'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

interface LedgerItem {
  id: string
  type: 'booking' | 'cancellation' | 'rescheduling' | 'unavailable'
  userId?: string
  userName?: string
  startTime: string
  endTime: string
  createdAt: string
  details: string
}

interface LedgerEntryProps {
  item: LedgerItem
}

export const LedgerEntry: React.FC<LedgerEntryProps> = ({ item }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-green-100 text-green-800'
      case 'cancellation':
        return 'bg-red-100 text-red-800'
      case 'rescheduling':
        return 'bg-yellow-100 text-yellow-800'
      case 'unavailable':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="p-4 border-b last:border-b-0 hover:bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <div>
          <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
          <span className="ml-2 text-sm text-gray-600">
            {format(new Date(item.createdAt), 'MMM d, yyyy HH:mm')}
          </span>
        </div>
        {item.userId && (
          <span className="text-sm text-gray-600">User: {item.userName || item.userId}</span>
        )}
      </div>
      <p className="text-gray-800 mb-2">{item.details}</p>
      <div className="text-sm text-gray-600">
        <span>Start: {format(new Date(item.startTime), 'MMM d, yyyy HH:mm')}</span>
        <span className="mx-2">-</span>
        <span>End: {format(new Date(item.endTime), 'MMM d, yyyy HH:mm')}</span>
      </div>
    </div>
  )
}

