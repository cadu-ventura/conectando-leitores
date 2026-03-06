import { Bell } from 'lucide-react'
import React from 'react'

export default function WithoutNotifications() {
    return (
        <>
            <div
                className="w-full h-auto sm:h-50 flex flex-col items-center justify-center
                       mt-10 sm:mt-20 space-y-3 sm:space-y-4 text-primary 
                       bg-secondary/10 rounded-lg p-6 text-center"
            >
                <Bell size={45} />
                <p className="font-bold text-lg sm:text-xl">Sem notificações</p>
                <p className="text-sm sm:text-base">
                    Você ainda não possui notificações.
                </p>
            </div>
        </>
    )
}

