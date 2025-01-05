//app/(root)/indoor/page.tsx

import React, { Suspense } from 'react'
import IndoorBooking from '@/features/root/indoor/components/IndoorBooking'

const  IndoorPage = async () => {
  return (
      <Suspense>
        <div className="container mx-auto py-10">
            <IndoorBooking />
        </div>
      </Suspense>
  )
}

export default IndoorPage

