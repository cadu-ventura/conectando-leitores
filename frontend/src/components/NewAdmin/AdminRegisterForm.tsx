'use client'
import React from 'react';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { DatePicker } from '../ui/DatePicker';
import PasswordStrength from '../auth/PasswordStrength';
import { useAdminRegisterForm } from '@/hooks/useAdminRegisterForm';
import { AdminRegisterFormProps } from '@/types/adminRegister';

export default function AdminRegisterForm({
  setRegisterSucess,
  handleCancel,
  setLoading,
  token
}: AdminRegisterFormProps & { token: string }) {

  const {
    register,
    errors,
    handleSubmit,
    control,
    passwordValue,
    showPassword,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    formKey,
    onSubmit,
    isDisabled,
  } = useAdminRegisterForm(setRegisterSucess, setLoading, token);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col space-y-4 px-2 sm:px-5 md:px-10 lg:px-15 py-5'
    >
      {/* Nome */}
      <div className='flex flex-col'>
        <label htmlFor='firstName-admin' className='text-base text-title-color'>
          Nome*
        </label>
        <input
          id='firstName-admin'
          type='text'
          placeholder='Digite seu nome..'
          {...register('firstName')}
          autoComplete='given-name'
          className={`w-full p-2 border-2 border-gray-300 focus:ring-2 rounded-md text-sm md:text-md focus:outline-none ${errors.firstName
            ? 'border-error focus:ring-error'
            : 'border-gray-300 focus:ring-primary'
            }`}
        />
        {errors.firstName && (
          <p className='text-error text-xs mt-1'>{errors.firstName.message}</p>
        )}
      </div>

      {/* Sobrenome */}
      <div className='flex flex-col'>
        <label htmlFor='lastName-admin' className='text-base text-title-color'>
          Sobrenome*
        </label>
        <input
          id='lastName-admin'
          type='text'
          placeholder='Digite seu sobrenome..'
          {...register('lastName')}
          autoComplete='family-name'
          className={`w-full p-2 border-2 border-gray-300 focus:ring-2 rounded-md text-sm md:text-md focus:outline-none ${errors.lastName
            ? 'border-error focus:ring-error'
            : 'border-gray-300 focus:ring-primary'
            }`}
        />
        {errors.lastName && (
          <p className='text-error text-xs mt-1'>{errors.lastName.message}</p>
        )}
      </div>

      {/* Data de nascimento */}
      <div className='flex flex-col'>
        <label htmlFor='birthDate-admin' className='text-base text-title-color'>
          Data de nascimento*
        </label>
        <Controller
          key={formKey}
          control={control}
          name='birthDate'
          render={({ field }) => (
            <DatePicker
              {...field}
              id='birthDate-admin'
              placeholder='DD / MM / AAAA'
              autoComplete='bday'
              className={`w-full p-2 border-2 border-gray-300 focus:ring-2 rounded-md text-sm md:text-md focus:outline-none ${errors.birthDate
                ? ' focus:ring-error'
                : 'border-gray-300 focus:ring-primary'
                }`}
            />
          )}
        />
        {errors.birthDate && (
          <p className='text-error text-xs mt-1'>
            {errors.birthDate.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className='flex flex-col'>
        <label htmlFor='mail-admin' className='text-base text-title-color'>
          E-mail*
        </label>
        <input
          id='mail-admin'
          type='email'
          placeholder='nome@dominio.com'
          {...register('mail')}
          autoComplete='email'
          className={`w-full p-2 border-2 border-gray-300 focus:ring-2 rounded-md text-sm md:text-md focus:outline-none ${errors.mail
            ? 'border-error focus:ring-error'
            : 'border-gray-300 focus:ring-primary'
            }`}
        />
        {errors.mail && (
          <p className='text-error text-xs mt-1'>{errors.mail.message}</p>
        )}
      </div>

      {/* Senha */}
      <div className='flex flex-col'>
        <label htmlFor='password-admin' className='text-base text-title-color'>
          Senha*
        </label>
        <div className='relative'>
          <input
            id='password-admin'
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••••'
            {...register('password')}
            autoComplete='new-password'
            className={`w-full p-2 border-2 border-gray-300 focus:ring-2 rounded-md text-sm md:text-md focus:outline-none ${errors.password
              ? 'border-error focus:ring-error'
              : 'border-gray-300 focus:ring-primary'
              }`}
          />
          <button
            type='button'
            className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-primary hover:cursor-pointer'
            onClick={toggleShowPassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {/* Mensagem de erro do Zod */}
        {errors.password && (
          <p className='text-error text-xs mt-1'>
            {errors.password.message}
          </p>
        )}

        {/* Exibe a força da senha */}
        {passwordValue && <PasswordStrength password={passwordValue} />}
      </div>

      {/* Confirmar senha */}
      <div className='flex flex-col'>
        <label
          htmlFor='confirmPassword-admin'
          className='text-base text-title-color'
        >
          Confirmar senha*
        </label>
        <div className='relative'>
          <input
            id='confirmPassword-admin'
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder='••••••••••'
            {...register('confirmPassword')}
            autoComplete='new-password'
            className={`w-full p-2 border-2 border-gray-300 focus:ring-2 rounded-md text-sm md:text-md focus:outline-none  ${errors.confirmPassword
              ? 'border-error focus:ring-error'
              : 'border-gray-300 focus:ring-primary'
              }`}
          />
          <button
            type='button'
            className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400  hover:text-primary hover:cursor-pointer'
            onClick={toggleShowConfirmPassword}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className='text-error text-xs mt-1'>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Botões */}
      <div className='w-full flex justify-center space-x-5 px-3 md:space-x-10 md:px-6 mt-5 '>
        <Button
          type='button'
          variant='ghost'
          onClick={handleCancel}
          className='w-1/2 border border-primary text-primary hover:bg-gray-50 hover:cursor-pointer'
        >
          Cancelar
        </Button>
        <Button
          type='submit'
          variant='default'
          className='w-1/2 hover:cursor-pointer'
          disabled={isDisabled}
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
