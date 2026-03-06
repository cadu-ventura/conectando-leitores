import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import BookRegisterPageWrapper from '@/components/Books/Registering/BookRegisterPageWrapper';

export default async function Page() {
    const token = (await cookies()).get('authToken')?.value;
    if (!token) return null;

    const user = await getCurrentUser();
    if (!user) return null;

    // Garantir que isAdmin nunca seja undefined
    const safeUser = { ...user, isAdmin: !!user.isAdmin };

    return <BookRegisterPageWrapper token={token} user={safeUser} />;
}