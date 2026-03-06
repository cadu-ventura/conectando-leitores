import type { LoginFormInputs } from '@/lib/validations';
import type {
  SignupPayload,
  LoginResponse,
  ApiResponse,
  ContactFormPayload,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  getStatus: async (): Promise<{ status: string }> => {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) {
      throw new Error('A API parece estar offline ou com problemas.');
    }
    return response.json();
  },
  validateToken: async (token: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/validateToken`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error('Token inválido ou expirado.');
    }
    return response.json();
  },
  login: async (credentials: LoginFormInputs): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('Erro interno no servidor...');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'E-mail e/ou senha inválidos.');
    }
    return response.json();
  },
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
      console.warn('A sessão no backend não pôde ser invalidada...');
    }
    return;
  },
  signup: async (data: SignupPayload): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao realizar o cadastro.');
    }
    return response.json();
  },

  sendContactMessage: async (
    payload: ContactFormPayload,
    token: string,
  ): Promise<ApiResponse> => {
    const endpoint = `${API_BASE_URL}/user/contact`;

    console.log('Enviando mensagem de contato para API:', endpoint, payload);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = 'Falha ao enviar mensagem.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        console.warn('Could not parse error response from contact API.');
      }
      throw new Error(errorMessage);
    }

    return response.json();
  },
};
