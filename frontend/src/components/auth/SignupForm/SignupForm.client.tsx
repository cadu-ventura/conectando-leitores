'use client';

import { Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useSignupForm } from '@/hooks/useSignupForm';
import { DatePicker } from '@/components/ui/DatePicker';
import PasswordStrength from '../PasswordStrength';
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

export default function SignupFormClient({
  onViewChange,
  onClose,
  onDirtyChange,
}: FormComponentProps) {
  const { states, functions, form } = useSignupForm({ onClose, onDirtyChange });

  const {
    showPassword,
    showConfirmPassword,
    isSuccess,
    apiError,
    passwordValue,
  } = states;

  const { toggleShowPassword, toggleShowConfirmPassword, onSubmit } = functions;
  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = form;

  if (isSuccess) {
    return (
      <div
        className={clsx(
          'flex',
          'flex-col',
          'items-center',
          'justify-center',
          'text-center',
          'p-4',
          'min-h-[300px]',
        )}
      >
        <FaCheckCircle className={clsx('text-success text-5xl mb-4')} />
        <h3 className={clsx('text-xl', 'font-semibold', 'text-gray-800')}>
          Parabéns!
        </h3>
        <p className='text-title-color mt-2'>Cadastro realizado com sucesso!</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className='flex w-full flex-col lg:p-2'>
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
          'rounded-lg',
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

      <div className={clsx('absolute', 'w-0', 'h-0', 'overflow-hidden')}>
        <label htmlFor='website-signup'>Não preencha este campo</label>
        <input
          id='website-signup'
          type='text'
          {...register('website')}
          tabIndex={-1}
          autoComplete='off'
        />
      </div>

      <div
        className={clsx(
          'grid',
          'grid-cols-1',
          'md:grid-cols-2',
          'gap-x-4',
          'gap-y-5',
          'md:gap-x-10',
        )}
      >
        <div className={clsx('flex', 'flex-col')}>
          <label
            htmlFor='firstName-signup'
            className={clsx('mb-2', 'text-base', 'text-title-color')}
          >
            Nome*
          </label>
          <input
            id='firstName-signup'
            type='text'
            placeholder='Digite seu nome..'
            {...register('firstName')}
            autoComplete='given-name'
            className={clsx(
              'p-2',
              'border',
              'rounded-md',
              'focus:ring-2',
              'focus:outline-none',
              'text-sm',
              `${
                errors.firstName
                  ? 'border-error focus:ring-error'
                  : 'border-gray-300 focus:ring-primary'
              }`,
            )}
          />
          {errors.firstName && (
            <p className={clsx('text-error', 'text-xs', 'mt-1')}>
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className={clsx('flex', 'flex-col')}>
          <label
            htmlFor='lastName-signup'
            className={clsx('mb-2', 'text-base', 'text-title-color')}
          >
            Sobrenome*
          </label>
          <input
            id='lastName-signup'
            type='text'
            placeholder='Digite seu sobrenome..'
            {...register('lastName')}
            autoComplete='family-name'
            className={clsx(
              'p-2',
              'border',
              'rounded-md',
              'focus:ring-2',
              'focus:outline-none',
              'text-sm',
              `${
                errors.lastName
                  ? 'border-error focus:ring-error'
                  : 'border-gray-300 focus:ring-primary'
              }`,
            )}
          />
          {errors.lastName && (
            <p className={clsx('text-error', 'text-xs', 'mt-1')}>
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className={clsx('flex', 'flex-col')}>
          <label
            htmlFor='birthDate'
            className={clsx('mb-2', 'text-base', 'text-title-color')}
          >
            Data de nascimento*
          </label>
          <Controller
            control={control}
            name='birthDate'
            render={({ field }) => (
              <DatePicker
                {...field}
                placeholder='DD / MM / AAAA'
                autoComplete='bday'
                className={clsx(
                  'p-2',
                  'border',
                  'rounded-md',
                  'focus:ring-2',
                  'focus:outline-none',
                  'text-sm',
                  `${
                    errors.birthDate
                      ? 'border-error focus:ring-error'
                      : 'border-gray-300 focus:ring-primary'
                  }`,
                )}
              />
            )}
          />
          {errors.birthDate && (
            <p className={clsx('text-error', 'text-xs', 'mt-1')}>
              {errors.birthDate.message}
            </p>
          )}
        </div>

        <div className={clsx('flex', 'flex-col')}>
          <label
            htmlFor='mail-signup'
            className={clsx('mb-2', 'text-base', 'text-title-color')}
          >
            E-mail*
          </label>
          <input
            id='mail-signup'
            type='email'
            placeholder='nome@dominio.com'
            {...register('mail')}
            autoComplete='email'
            className={clsx(
              'p-2',
              'border',
              'rounded-md',
              'focus:ring-2',
              'focus:outline-none',
              'text-sm',
              `${
                errors.mail
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

        <div className='flex flex-col'>
          <label
            htmlFor='password-signup'
            className={clsx('mb-2', 'text-base', 'text-title-color')}
          >
            Senha*
          </label>
          <div className={clsx('relative', 'group')}>
            <input
              id='password-signup'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••••'
              {...register('password')}
              autoComplete='new-password'
              className={clsx(
                'w-full',
                'p-2',
                'border',
                'rounded-md',
                'focus:ring-2',
                'focus:outline-none',
                'text-sm',
                'pr-10',
                `${
                  errors.password
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

          {errors.password ? (
            <p className={clsx('text-error', 'text-xs', 'mt-1')}>
              {errors.password.message}
            </p>
          ) : passwordValue && passwordValue.length > 0 ? (
            <PasswordStrength password={passwordValue} />
          ) : null}
        </div>

        <div className={clsx('flex', 'flex-col')}>
          <label
            htmlFor='confirmPassword-signup'
            className={clsx('mb-2', 'text-base', 'text-title-color')}
          >
            Confirmar senha*
          </label>
          <div className='relative group'>
            <input
              id='confirmPassword-signup'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='••••••••••'
              {...register('confirmPassword')}
              autoComplete='new-password'
              className={clsx(
                'w-full',
                'p-2',
                'border',
                'rounded-md',
                'focus:ring-2',
                'focus:outline-none',
                'text-sm',
                'pr-10',
                `${
                  errors.confirmPassword
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
              onClick={toggleShowConfirmPassword}
              aria-label={
                showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'
              }
            >
              {showConfirmPassword ? (
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
          {errors.confirmPassword && (
            <p className={clsx('text-error', 'text-xs', 'mt-1')}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className={clsx('flex', 'flex-col', 'mt-2', 'md:col-span-2')}>
          <div className={clsx('flex', 'items-start')}>
            <input
              id='acceptTerms-signup'
              type='checkbox'
              {...register('acceptTerms')}
              className={clsx(
                'h-4',
                'w-4',
                'mt-1',
                'rounded',
                'border-gray-300',
                'accent-primary',
              )}
            />
            <label
              htmlFor='acceptTerms-signup'
              className={clsx('ml-2', 'text-sm', 'text-title-color')}
            >
              Li e aceito os{' '}
              <a
                href='/termos_e_condicoes.pdf'
                target='_blank'
                rel='noopener noreferrer'
                className={clsx('font-bold', 'text-primary', 'hover:underline')}
              >
                termos e condições do serviço
              </a>{' '}
              e também as{' '}
              <a
                href='/politicas_de_privacidade.pdf'
                target='_blank'
                rel='noopener noreferrer'
                className={clsx('font-bold', 'text-primary', 'hover:underline')}
              >
                políticas de privacidade do serviço
              </a>
              .
            </label>
          </div>
          {errors.acceptTerms && (
            <p className={clsx('text-error', 'text-xs', 'mt-1')}>
              {errors.acceptTerms.message}
            </p>
          )}
        </div>
      </div>

      <div className='mt-6'>
        <motion.button
          id='signup-submit-btn'
          type='submit'
          disabled={isSubmitting}
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
            'disabled:opacity-50',
            'hover:cursor-pointer'
          )}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </motion.button>

        {apiError && (
          <p className={clsx('text-error', 'text-sm', 'text-center', 'mt-2')}>
            {apiError}
          </p>
        )}
      </div>

      <p className={clsx('text-center', 'text-sm', 'text-title-color', 'mt-6')}>
        Já possui uma conta?{' '}
        <button
          type='button'
          onClick={() => onViewChange('login')}
          className={clsx('font-semibold', 'text-primary', 'hover:underline')}
        >
          Fazer login
        </button>
      </p>
    </form>
  );
}
