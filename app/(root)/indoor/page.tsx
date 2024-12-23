//app/(root)/indoor/page.tsx

import React from 'react'
import IndoorBooking from '@/features/root/indoor/components/IndoorBooking'

const IndoorPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Indoor Facility Booking</h1>
      <IndoorBooking />
    </div>
  )
}

export default IndoorPage

