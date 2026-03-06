'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useLoginForm } from '@/hooks/useLoginForm';
import type { FormComponentProps } from '@/types';
import clsx from 'clsx';

const Separator = () => (
  <div className={clsx('flex', 'items-center', 'my-6')}>
    <div className={clsx('flex-grow', 'border-t', 'border-gray-200')}></div>
    <span
      className={clsx('flex-shrink', 'mx-4', 'text-base', 'text-title-color')}
    >
      ou
    </span>
    <div className={clsx('flex-grow', 'border-t', 'border-gray-200')}></div>
  </div>
);

export default function LoginFormClient({
  onViewChange,
  onClose,
}: FormComponentProps) {
  const {
    showPassword,
    isLoading,
    authError,
    toggleShowPassword,
    onSubmit,
    form,
  } = useLoginForm({ onClose });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={clsx('flex', 'w-full', 'flex-col', 'lg:p-2')}
    >
      <motion.button
        type='button'
        className={clsx(
          'w-full',
          'flex',
          'justify-center',
          'items-center',
          'gap-2',
          'py-2.5',
          'px-2',
          'border',
          'border-gray-300',
          'rounded-md',
          'text-base',
          'text-title-color',
          'hover:bg-gray-50',
          'transition-colors',
          'hover:cursor-pointer'
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FcGoogle size={20} />
        Entre com sua conta Google
      </motion.button>

      <Separator />

      <div className={clsx('flex', 'flex-col', 'gap-5')}>
        <div>
          <label
            htmlFor='mail-login'
            className={clsx('mb-2', 'block', 'text-base', 'text-title-color')}
          >
            E-mail*
          </label>
          <input
            id='mail-login'
            type='email'
            placeholder='nome@dominio.com'
            {...register('mail')}
            className={clsx(
              'w-full',
              'p-2',
              'border',
              'rounded-md',
              'focus:ring-2',
              'focus:outline-none',
              'text-sm',
              `${errors.mail
                ? 'border-error focus:ring-error'
                : 'border-gray-300 focus:ring-primary'
              }`,
            )}
          />
          {errors.mail && (
            <p className={clsx('text-error', 'text-xs', 'mt-1')}>
              {errors.mail.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor='password-login'
            className={clsx('mb-2', 'block', 'text-base', 'text-title-color')}
          >
            Senha*
          </label>
          <div className='relative group'>
            <input
              id='password-login'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••••'
              {...register('password')}
              className={clsx(
                'w-full',
                'p-2',
                'border',
                'rounded-md',
                'focus:ring-2',
                'focus:outline-none',
                'text-sm',
                'pr-10',
                `${errors.password
                  ? 'border-error focus:ring-error'
                  : 'border-gray-300 focus:ring-primary'
                }`,
              )}
            />
            <button
              type='button'
              className={clsx(
                'absolute',
                'inset-y-0',
                'right-0',
                'flex',
                'items-center',
                'pr-3',
              )}
              onClick={toggleShowPassword}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff
                  className={clsx(
                    'text-gray-400',
                    'group-focus-within:text-primary',
                    'transition-colors',
                  )}
                  size={18}
                />
              ) : (
                <Eye
                  className={clsx(
                    'text-gray-400',
                    'group-focus-within:text-primary',
                    'transition-colors',
                  )}
                  size={18}
                />
              )}
            </button>
          </div>
          {errors.password && (
            <p className={clsx('text-error', 'text-xs', 'mt-1')}>
              {errors.password.message}
            </p>
          )}

          <div className={clsx('w-full', 'text-right', 'mt-2')}>
            <span
              className={clsx(
                'text-sm',
                'font-semibold',
                'text-gray-400',
                'cursor-not-allowed',
              )}
            >
              Esqueceu sua senha?
            </span>
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <motion.button
          id='submit-button'
          type='submit'
          disabled={isLoading}
          className={clsx(
            'w-full',
            'py-3',
            'text-base',
            'font-sans',
            'bg-primary',
            'hover:bg-secondary',
            'text-white',
            'rounded-lg',
            'transition-colors',
            'hover:cursor-pointer',
            'disabled:opacity-50',
            'disabled:cursor-not-allowed',
          )}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </motion.button>
        {authError && (
          <p className={clsx('text-error', 'text-sm', 'text-center', 'mt-2')}>
            {authError}
          </p>
        )}
      </div>

      <p className={clsx('text-center', 'text-sm', 'text-title-color', 'mt-6')}>
        Não possui uma conta?{' '}
        <button
          type='button'
          onClick={() => onViewChange('signup')}
          className={clsx('font-semibold', 'text-primary', 'hover:underline')}
        >
          Criar conta
        </button>
      </p>
    </form>
  );
}
