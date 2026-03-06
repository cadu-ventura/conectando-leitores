import type { LoginFormInputs } from '@/lib/validations';
import type { SignupPayload, LoginResponse, ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  /**
   * Verifica o status da API.
   */
  getStatus: async (): Promise<{ status: string }> => {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) {
      throw new Error('A API parece estar offline ou com problemas.');
    }
    return response.json();
  },

  /**
   * Valida um token JWT existente com o backend.
   */
  validateToken: async (token: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/validateToken`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token inválido ou expirado.');
    }
    return response.json();
  },

  /**
   * Autentica um usuário e retorna um token e dados do usuário.
   */
  login: async (credentials: LoginFormInputs): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error(
          'Erro interno no servidor. Tente novamente mais tarde.',
        );
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'E-mail e/ou senha inválidos.');
    }
    return response.json();
  },

  /**
   * Desloga o usuário no backend, invalidando o token.
   */
  logout: async (token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      console.warn(
        'A sessão no backend não pôde ser invalidada, mas o logout local prosseguirá.',
      );
    }
    return;
  },

  /**
   * Cadastra um novo usuário.
   */
  signup: async (data: SignupPayload): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao realizar o cadastro.');
    }
    return response.json();
  },
};
