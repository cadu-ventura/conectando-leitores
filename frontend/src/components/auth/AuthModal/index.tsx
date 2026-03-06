import AuthModalClient from './AuthModal.client';
import { AuthModalProps } from '@/types';

export default function AuthModal(props: AuthModalProps) {
  return <AuthModalClient {...props} />;
}
