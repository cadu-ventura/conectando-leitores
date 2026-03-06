'use client';

import { useState, useEffect } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupFormInputs } from '@/lib/validations';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

interface UseSignupFormProps {
  onClose: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

// 1. Interface explícita para o valor de retorno do hook
interface UseSignupFormReturn {
  states: {
    showPassword: boolean;
    showConfirmPassword: boolean;
    isSuccess: boolean;
    apiError: string | null;
    passwordValue: string;
  };
  functions: {
    toggleShowPassword: () => void;
    toggleShowConfirmPassword: () => void;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  };
  form: UseFormReturn<SignupFormInputs>;
}

const defaultSignupValues: SignupFormInputs = {
  firstName: '',
  lastName: '',
  mail: '',
  birthDate: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  website: '',
};

export const useSignupForm = ({
  onClose,
  onDirtyChange,
}: UseSignupFormProps): UseSignupFormReturn => {
  // 2. Tipo de retorno aplicado
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { login } = useAuth();

  const form = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: defaultSignupValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isDirty, dirtyFields },
    trigger,
    reset,
  } = form;

  const passwordValue = watch('password');

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (dirtyFields.confirmPassword) {
      trigger('confirmPassword');
    }
  }, [passwordValue, trigger, dirtyFields.confirmPassword]);

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, onClose]);

  const onSubmit = async (data: SignupFormInputs) => {
    setApiError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { acceptTerms, website, ...apiPayload } = data;
      await authService.signup(apiPayload);

      try {
        await login({ mail: data.mail, password: data.password });
      } catch (loginErr) {
        console.error(
          'Cadastro bem-sucedido, mas o login automático falhou:',
          loginErr,
        );
        setApiError('Cadastro realizado! Faça o login para continuar.');
        setTimeout(() => onClose(), 3000);
        return;
      }

      setIsSuccess(true);
      reset();
    } catch (signupErr) {
      console.error('Erro no fluxo de cadastro:', signupErr);
      const errorMessage =
        signupErr instanceof Error
          ? signupErr.message
          : 'Ocorreu um erro inesperado durante o cadastro.';
      setApiError(errorMessage);
    }
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);

  return {
    states: {
      showPassword,
      showConfirmPassword,
      isSuccess,
      apiError,
      passwordValue,
    },
    functions: {
      toggleShowPassword,
      toggleShowConfirmPassword,
      onSubmit: handleSubmit(onSubmit),
    },
    form,
  };
};
