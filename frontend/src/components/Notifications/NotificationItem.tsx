'use client'
import React from 'react'
import { NotificationItemProps } from '@/types/notification'

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {

    const [mainMessage, justificationPart] = (() => {
        const text = notification.message || ''

        // tenta encontrar onde começa "Justificativa"
        const justificationIndex = text.toLowerCase().indexOf('motivo')

        if (justificationIndex !== -1) {
            const message = text.slice(0, justificationIndex).trim()
            const justification = text.slice(justificationIndex).trim()
            return [message, justification]
        }

        return [text, '']
    })()
    return (
        <div
            key={notification._id}
            className={`relative flex py-6 px-6 gap-4 items-center sm:px-10 rounded-lg border 
        ${notification.read ? 'bg-white border-secondary/20' : 'bg-accent border-secondary'}
      `}
        >
            <div>
                {!notification.read && (
                    <div
                        onClick={() => onMarkAsRead(notification._id)}
                        className='w-2 h-2 flex md:hidden bg-primary rounded-full cursor-pointer'>
                    </div>
                )}
            </div>

            <div className='w-full text-primary/100 space-y-2'>
                <h2 className="text-xl font-semibold ">{notification.type}</h2>
                <div className='w-full flex flex-col gap-3'>
                    <p className="text-sm sm:text-base text-primary/90 leading-relaxed sm:max-w-[85%]">
                        {mainMessage}
                    </p>
                    {justificationPart && (
                        <p className="text-sm sm:text-base text-primary/90 leading-relaxed sm:max-w-[85%]">
                            {justificationPart}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap text-xs sm:text-sm gap-1">
                    <span>
                        {new Date(notification.createdAt).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        }).replace(',', ' às')}
                    </span>
                </div>

                {!notification.read && (
                    <div className="absolute top-10 hidden right-6 md:flex flex-col w-full items-end space-y-6 sm:space-y-8">
                        <span className="text-xs sm:text-sm text-white font-medium mt-2 bg-secondary px-3 sm:px-4 py-1 rounded-full">
                            Nova
                        </span>
                        <button
                            onClick={() => onMarkAsRead(notification._id)}
                            className="text-secondary text-xs sm:text-sm hover:underline hover:cursor-pointer"
                        >
                            Marcar como lida
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}