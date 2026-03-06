import { ValidateBy, ValidationOptions } from 'class-validator';

export function IsValidEmailDomain(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isValidEmailDomain',
      validator: {
        validate: (value: any) => {
          
          if (typeof value !== 'string') return false;
          
          const email = value.toLowerCase();
          
          const validDomainPattern = /\.(com|com\.br)$/;
          
          return validDomainPattern.test(email);
        },
        defaultMessage: () => 'O e-mail deve terminar com .com ou .com.br',
      },
    },
    validationOptions
  );
}