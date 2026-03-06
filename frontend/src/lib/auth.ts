import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import type { User, DecodedToken } from '@/types';

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('authToken');

  if (!tokenCookie) {
    return null;
  }

  try {
    const token = tokenCookie.value;
    const decodedToken: DecodedToken = jwtDecode(token);

    const isExpired = decodedToken.exp * 1000 < Date.now();
    if (isExpired) {
      return null;
    }

    const rolesFromToken = (decodedToken.roles || '')
      .split(',')
      .map((r: string) => r.trim())
      .filter((r: string) => r.length > 0);

    const user: User = {
      id: decodedToken.sub,
      mail: decodedToken.mail,
      roles: rolesFromToken,
      username: decodedToken.mail.split('@')[0],
      isAdmin: rolesFromToken.includes('sysadmin'),
    };

    return user;
  } catch (error) {
    console.error(
      'Falha ao decodificar o token de autenticação no servidor:',
      error,
    );
    return null;
  }
}
