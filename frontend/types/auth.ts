import type { ComponentType } from 'react';

// --- Tipos para a UI do Componente AuthModal ---

/**
 * Define os possíveis "estados" ou "telas" do modal de autenticação.
 */
export type ModalView = 'login' | 'signup';

/**
 * Define as props para o componente AuthModal principal.
 */
export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: ModalView;
}

/**
 * Define o contrato de props que cada formulário (LoginForm, SignupForm)
 * deve seguir para ser renderizado dentro do AuthModal.
 */
export interface FormComponentProps {
  onViewChange: (view: ModalView) => void;
  onClose: () => void;
  onDirtyChange: (isDirty: boolean) => void;
}

/**
 * Usado internamente pelo AuthModal para mapear uma view a um componente e título.
 */
export interface ViewConfigValue {
  Component: ComponentType<FormComponentProps>;
  title: string;
}

// --- Tipos para Dados de Autenticação e Contratos da API ---

/**
 * Descreve a estrutura do payload decodificado de um token JWT.
 */
export interface DecodedToken {
  sub: string;
  mail: string;
  roles: 'user' | 'sysadmin';
  iat: number;
  exp: number;
}

/**
 * Descreve o payload de dados enviado para a API no momento do cadastro.
 */
export interface SignupPayload {
  firstName: string;
  lastName: string;
  mail: string;
  birthDate: string;
  password?: string;
}

/**
 * Descreve o objeto 'user' que a API de login retorna.
 */
interface LoginUserResponse {
  fullName: string;
  roles: string;
}

/**
 * Descreve a resposta completa e bem-sucedida da API de login.
 */
export interface LoginResponse {
  access_token: string;
  user: LoginUserResponse;
}

/**
 * Um tipo genérico para respostas de API que retornam uma mensagem de sucesso.
 */
export interface ApiResponse {
  message: string;
}
/**
 * Um tipo para os contatos
 */
export interface ContactFormPayload {
  title: string;
  summary: string;
}
