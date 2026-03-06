import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
	catch(exception: BadRequestException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		if (exception.message && Array.isArray(exception.message) && exception.message[0] instanceof ValidationError) {
			const validationErrors = exception.message as ValidationError[];
			const errors = validationErrors.reduce((acc, error) => ({
				...acc,
				[error.property]: Object.values(error.constraints)[0]
			}), {});

			response.status(400).json({
				statusCode: 400,
				errors:errors,
				error: 'Bad Request'
			});
		} else {
			response.status(400).json(exception);
		}
	}
}
