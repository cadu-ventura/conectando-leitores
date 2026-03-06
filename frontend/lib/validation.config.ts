export const passwordRules = [
  {
    id: 'minLength',
    text: 'Mínimo 6 caracteres',
    validator: (password: string): boolean => password.length >= 6,
  },
  {
    id: 'maxLength',
    text: 'Máximo 10 caracteres',
    validator: (password: string): boolean => password.length <= 10,
  },
  {
    id: 'hasUpperCase',
    text: 'Pelo menos uma letra maiúscula',
    validator: (password: string): boolean => /[A-Z]/.test(password),
  },
  {
    id: 'hasLowerCase',
    text: 'Pelo menos uma letra minúscula',
    validator: (password: string): boolean => /[a-z]/.test(password),
  },
  {
    id: 'hasSpecialChar',
    text: 'Pelo menos um caractere especial',
    validator: (password: string): boolean => /[^A-Za-z0-9]/.test(password),
  },
  {
    id: 'hasNumber',
    text: 'Pelo menos um número',
    validator: (password: string): boolean => /[0-9]/.test(password),
  },
  {
    id: 'hasNoSpaces',
    text: 'Não conter espaços',
    validator: (password: string): boolean => !/\s/.test(password),
  },
];
