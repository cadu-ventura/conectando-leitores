'use client';
import BookRegisterPage from './BookRegisterPage';

export default function BookRegisterPageWrapper({
  token,
  user
}: { token: string; user: { isAdmin: boolean  } }) {
  return <BookRegisterPage token={token} user={user} />;
}
