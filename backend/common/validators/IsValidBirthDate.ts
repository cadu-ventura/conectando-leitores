import { ValidateBy, ValidationOptions } from 'class-validator';
import { format, parse, isValid, startOfDay, isAfter, isBefore, subYears } from 'date-fns';

export function IsValidBirthDate(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isValidBirthDate',
      validator: {
        validate: (value: any) => {
          try {
            // Se já foi transformado para Date, converte para string no formato correto
            if (value instanceof Date) {
              value = format(value, 'dd/MM/yyyy');
            }
          
            if (typeof value !== 'string') return false;

            // Verifica formato primeiro - aceita dd/mm/yyyy
            const formatRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (!formatRegex.test(value)) return false;

            // Verifica se a data é válida usando date-fns
            const date = parse(value, 'dd/MM/yyyy', new Date());
            if (!isValid(date)) return false;

            // Validações adicionais para data de nascimento
            const now = startOfDay(new Date()); // Remove o tempo para comparação apenas da data
            const minDate = startOfDay(subYears(new Date(), 150));

            // Verifica se é data futura
            if (isAfter(date, now)) {
              return false;
            }
            
            // Verifica se é muito antiga
            if (isBefore(date, minDate)) {
              return false;
            }

            return true;
          } catch (error) {
            return false;
          }
        },
        defaultMessage: () => 'Data deve estar no formato dd/mm/yyyy, ser válida e representar uma data de nascimento realística (não pode ser futura ou mais antiga que 150 anos)',
      },
    },
    validationOptions
  );
}