import AdminRegisterPage from '@/components/NewAdmin/AdminRegisterPage';
import { cookies } from 'next/headers';

export default async function Page() {
  const token = (await cookies()).get('authToken')?.value;

  if (!token) return;

  return <AdminRegisterPage token={token} />;
}