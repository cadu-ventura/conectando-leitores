'use client';

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormInputs } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';

interface UseLoginFormProps {
  onClose: () => void;
}

interface UseLoginFormReturn {
  showPassword: boolean;
  isLoading: boolean;
  authError: string | null;
  toggleShowPassword: () => void;
  onSubmit: (data: LoginFormInputs) => Promise<void>;
  form: UseFormReturn<LoginFormInputs>;
}

export const useLoginForm = ({
  onClose,
}: UseLoginFormProps): UseLoginFormReturn => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error: authError } = useAuth();

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data);
      onClose();
    } catch (err) {
      console.error('Falha no login:', err);
    }
  };

  return {
    showPassword,
    isLoading,
    authError,
    toggleShowPassword,
    onSubmit: onSubmit,
    form,
  };
};
