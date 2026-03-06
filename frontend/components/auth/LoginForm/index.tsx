import LoginFormClient from './LoginForm.client';
import type { FormComponentProps } from '@/types';

export default function LoginForm(props: FormComponentProps) {
  return <LoginFormClient {...props} />;
}
