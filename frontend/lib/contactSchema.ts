import { z } from 'zod';

const startsWithUppercaseRegex = /^[A-ZÀ-ÖØ-Þ]/;
const allowedCharsRegex = /^[A-Za-zÀ-úÀ-ÿ0-9\s.,;:!?@#$%&*()\-+=/\\\[\]{}|<>"'`~^´¨]+$/;

export const contactFormSchema = z.object({
  title: z
    .string()
    .min(1, 'O campo Título da mensagem é obrigatório')
    .min(3, 'O campo Título da mensagem deve conter no mínimo 3 caracteres.')
    .max(50, 'O campo Título da mensagem deve conter no máximo 50 caracteres.')
    .refine(value => startsWithUppercaseRegex.test(value), {
      message: 'O campo Título da mensagem deve iniciar com letra maiúscula e aceitar acentuação, caracteres especiais, números, letras e espaço.',
    })
    .refine(value => allowedCharsRegex.test(value), {
      message: 'O campo Título da mensagem deve iniciar com letra maiúscula e aceitar acentuação, caracteres especiais, números, letras e espaço.',
    }),
  message: z
    .string()
    .min(1, 'O campo Mensagem é obrigatório')
    .max(700, 'O campo Mensagem deve conter no máximo 700 caracteres.')
    .refine(value => startsWithUppercaseRegex.test(value), {
      message: 'O campo Mensagem deve iniciar com letra maiúscula e aceitar acentuação, caracteres especiais, números, letras e espaço.',
    })
    .refine(value => allowedCharsRegex.test(value), {
      message: 'O campo Mensagem deve iniciar com letra maiúscula e aceitar acentuação, caracteres especiais, números, letras e espaço.',
    }),
});

export type ContactFormInputs = z.infer<typeof contactFormSchema>;
