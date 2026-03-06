'use client'
import React from 'react'
import Loader from '../ui/Loader'
import NotificationItem from './NotificationItem'
import WithoutNotifications from './WithoutNotifications'
import { useNotifications } from '@/hooks/useNotifications'

export default function Notifications({ token }: { token: string }) {
  const { notifications, loading, markAsRead } = useNotifications(token)

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-[50vh]">
        <Loader />
      </div>
    )

  if (notifications.length === 0) return <WithoutNotifications />

  return (
    <div className="w-full mt-6 sm:mt-8 space-y-4">
      {notifications.map((n) => (
        <NotificationItem
          key={n._id}
          notification={n}
          onMarkAsRead={markAsRead}
        />
      ))}
    </div>
  )
}