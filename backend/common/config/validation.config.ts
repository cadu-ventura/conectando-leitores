import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const ValidationConfig = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const result = errors.reduce((acc, err) => {
      // Se for uma propriedade não permitida
      if (!err.constraints && !err.children) {
        acc[err.property] = `O campo '${err.property}' não é permitido`;
        return acc;
      }

      // Para erros de validação com constraints
      if (err.constraints) {
        // Traduzir a mensagem "should not exist" se presente
        const messages = Object.entries(err.constraints).map(([key, value]) => {
          if (value === `property ${err.property} should not exist`) {
            return `O campo '${err.property}' não é permitido`;
          }
          return value;
        });
        acc[err.property] = messages[0];
      }

      // Para erros aninhados
      if (err.children && err.children.length > 0) {
        acc[err.property] = translateNestedErrors(err.children);
      }

      return acc;
    }, {});

    throw new BadRequestException({
      statusCode: 400,
      error: 'Erro de Validação',
      validationResult: result
    });
  }
});

function translateNestedErrors(errors: ValidationError[]): any {
  return errors.reduce((acc, err) => {
    if (err.constraints) {
      const messages = Object.values(err.constraints);
      acc[err.property] = messages[0];
    } else if (err.children && err.children.length > 0) {
      acc[err.property] = translateNestedErrors(err.children);
    }
    return acc;
  }, {});
}