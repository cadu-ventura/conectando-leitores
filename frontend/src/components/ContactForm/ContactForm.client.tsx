'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormInputs } from '@/lib/contactSchema';
import { useState } from 'react';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import FeedbackPopup from '@/components/ui/FeedbackPopup';
import { authService } from '@/services/contactService';

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
  });

  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { token } = useAuth();

  const onSubmit = async (data: ContactFormInputs) => {
    if (!token) {
      setSubmissionStatus('error');
      setSubmitError('Você precisa estar logado para enviar uma mensagem.');
      return;
    }

    setSubmissionStatus('idle');
    setSubmitError(null);

    try {
      const payload = {
        title: data.title,
        summary: data.message,
      };

      await authService.sendContactMessage(payload, token);

      setSubmissionStatus('success');
      reset();
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmissionStatus('error');
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.',
      );
    }
  };

  const handlePopupClose = () => {
    setSubmissionStatus('idle');
    setSubmitError(null);
  };

  return (
    <>
      <section className='mx-auto flex w-full max-w-lg flex-col items-center rounded-lg bg-white p-8 shadow-lg'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col gap-4'
          noValidate
        >
          {/* Campo Título da Mensagem */}
          <div className='flex flex-col gap-1'>
            <label
              htmlFor='title'
              className='text-sm font-semibold text-gray-800'
            >
              Título da Mensagem*
            </label>
            <input
              id='title'
              type='text'
              placeholder='Digite o título da mensagem'
              {...register('title')}
              className={clsx(
                'rounded-lg border p-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all',
                errors.title ? 'border-red-500' : 'border-gray-300',
              )}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className='mt-1 text-xs text-red-500'>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Campo Mensagem */}
          <div className='flex flex-col gap-1'>
            <label
              htmlFor='message'
              className='text-sm font-semibold text-gray-800'
            >
              Mensagem*
            </label>
            <textarea
              id='message'
              rows={5}
              maxLength={700}
              placeholder='Descreva a mensagem (máximo 700 caracteres)'
              {...register('message')}
              className={clsx(
                'resize-y rounded-lg border p-3 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all',
                errors.message ? 'border-red-500' : 'border-gray-300',
              )}
              aria-invalid={!!errors.message}
            />
            {errors.message && (
              <p className='mt-1 text-xs text-red-500'>
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Botão de Enviar */}
          <button
            type='submit'
            disabled={!isValid || isSubmitting}
            className={clsx(
              'mt-4 self-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-terciary disabled:cursor-not-allowed disabled:opacity-50',
              'w-1/2', 'hover:cursor-pointer'
            )}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </section>

      {/* Renderiza o FeedbackPopup aqui fora */}
      <FeedbackPopup
        status={submissionStatus}
        title={submissionStatus === 'success' ? 'Enviado' : 'Erro'}
        message={
          submissionStatus === 'success'
            ? 'Sua mensagem foi enviada com sucesso!'
            : submitError ||
            'Não foi possível enviar sua mensagem. Tente novamente mais tarde.'
        }
        onClose={handlePopupClose}
      />
    </>
  );
}
