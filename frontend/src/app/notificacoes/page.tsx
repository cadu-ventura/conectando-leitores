import NotificationPage from '@/components/Notifications/NotificationPage';
import { cookies } from 'next/headers';
import React from 'react'

export default async function Page() {

    const token = (await cookies()).get('authToken')?.value;

    if (!token) return

    return <NotificationPage token={token} />
}