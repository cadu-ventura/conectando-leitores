import Notifications from '@/components/Notifications/Notifications'
import { getCurrentUser } from '@/lib/auth'
import React from 'react'

export default async function NotificationPage({ token }: { token: string }) {
    const isAdmin = await getCurrentUser().then(user => user?.roles.includes('sysadmin'))

    return (
        <main
            className="flex flex-col items-start px-4 sm:px-10 md:px-20 lg:px-40 
                 min-h-screen mt-10 sm:mt-15"
        >
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4">
                Notificações
            </h1>

            <p className="text-primary text-center sm:text-left text-sm md:text-base max-w-md mb-2">
                {isAdmin
                    ? 'Gerencie todas as notificações da plataforma.'
                    : 'Visualize suas notificações recebidas.'}
            </p>
            <Notifications token={token} />
        </main>
    )
}