import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

/**
 * Validador customizado para data no formato dd/MM/yyyy
 */
@ValidatorConstraint({ name: 'isValidDateFormat', async: false })
export default class IsValidDateFormat implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    // Verifica se é uma string
    if (typeof value !== 'string') {
      return false;
    }

    // Verifica o formato dd/MM/yyyy (apenas números e barras)
    const formatoRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!formatoRegex.test(value)) {
      return false;
    }

    // Extrai dia, mês e ano
    const [dia, mes, ano] = value.split('/').map(Number);

    // Valida se a data é válida
    const data = new Date(ano, mes - 1, dia);
    
    // Verifica se a data é válida (ex: 31/02/2025 seria inválido)
    if (
      data.getFullYear() !== ano ||
      data.getMonth() !== mes - 1 ||
      data.getDate() !== dia
    ) {
      return false;
    }

    // Verifica se a data não é futura
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999); // Final do dia atual
    
    if (data > hoje) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const value = args.value;
    
    if (typeof value !== 'string') {
      return 'Data de lançamento deve ser uma string no formato dd/MM/yyyy';
    }

    const formatoRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!formatoRegex.test(value)) {
      return 'Data de lançamento deve estar no formato dd/MM/yyyy e conter apenas números';
    }

    const [dia, mes, ano] = value.split('/').map(Number);
    const data = new Date(ano, mes - 1, dia);
    
    if (
      data.getFullYear() !== ano ||
      data.getMonth() !== mes - 1 ||
      data.getDate() !== dia
    ) {
      return 'Data de lançamento inválida. Verifique se o dia, mês e ano são válidos';
    }

    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    
    if (data > hoje) {
      return 'Data de lançamento não pode ser uma data futura';
    }

    return 'Data de lançamento inválida';
  }
}