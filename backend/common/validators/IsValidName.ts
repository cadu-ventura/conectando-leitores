import { ValidateBy, ValidationOptions } from 'class-validator';

export function IsValidName(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isValidName',
      validator: {
        validate: (value: any) => {
          if (typeof value !== 'string') return false;
          
          // Remove espaços extras e verifica se não está vazio
          const trimmedValue = value.trim();
          if (trimmedValue.length === 0) return false;
          
          // Verifica se contém apenas letras, acentos e espaços
          const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/;
          if (!nameRegex.test(trimmedValue)) return false;
          
          // Verifica se não tem espaços consecutivos
          if (/\s{2,}/.test(trimmedValue)) return false;
          
          // Verifica se a primeira letra é maiúscula
          const firstChar = trimmedValue.charAt(0);
          if (firstChar !== firstChar.toUpperCase()) return false;
          
          return true;
        },
        defaultMessage: () => 'Nome deve conter apenas letras',
      },
    },
    validationOptions
  );
}