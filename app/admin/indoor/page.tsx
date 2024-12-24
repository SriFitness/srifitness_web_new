import React from 'react'
import IndoorScheduleManager from '@/features/admin/indoor/components/IndoorScheduleManager'

const IndoorAdminPage = () => {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-5">Indoor Facility Management</h1>
            <IndoorScheduleManager />
        </div>
    )
}

export default IndoorAdminPage

