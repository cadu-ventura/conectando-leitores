import React from 'react'
import MyFavoriteBooksPage from '@/components/MyFavorites/MyFavoriteBooksPage'
import { cookies } from 'next/headers';

export default async function Page() {

  const token = (await cookies()).get('authToken')?.value;

  if (!token) return

  return <MyFavoriteBooksPage token={token} />
}