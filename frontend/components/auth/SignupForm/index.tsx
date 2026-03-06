import SignupFormClient from './SignupForm.client';
import type { FormComponentProps } from '@/types';

export default function SignupForm(props: FormComponentProps) {
  return <SignupFormClient {...props} />;
}
