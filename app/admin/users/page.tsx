import UserTable from '@/features/admin/users/components/UserTable'
import { getUsers } from '@/features/admin/users/server/actions/users'
import React from 'react'

export default async function UsersAdminPage() {
    const users = await getUsers();
    
    return (
        <div className="container mx-auto py-10">
            <UserTable users={users}/>
        </div>
    )
}