import { ValidateBy, ValidationOptions } from 'class-validator';

export function IsValidValue(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isValidValue',
      validator: {
        validate: (value: any) => {
          if (value === null || value === undefined) return false;
          if(value instanceof Date) return true;
          if (typeof value !== 'string') return false;
          
          const trimmedValue = value.trim();
          return trimmedValue.length > 0;
        },
        defaultMessage: () => 'Este campo não pode ser vazio ou conter apenas espaços',
      },
    },
    validationOptions
  );
}