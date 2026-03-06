import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // Se for um erro de validação (com validationResult).
    if (exception.response?.validationResult) {
      return response.status(400).json({
        statusCode: 400,
        error: 'Erro de Validação',
        validationResult: exception.response.validationResult
      });
    }

    // Para outros erros HTTP
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response.status(status).json({
        statusCode: status,
        message: exception.message
      });
    }

    // Para erros não tratados
    return response.status(500).json({
      statusCode: 500,
      message: 'Erro interno do servidor'
    });
  }
}