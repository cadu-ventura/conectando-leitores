import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerAuthLoginMessages } from './messages/swagger.messages';
import { formatErrorPipe } from 'common/formatted/NestJsFormattedErrorsHelper';
import { ValidationConfig } from 'common/config/validation.config';
import { ValidationExceptionFilter } from 'common/filters/validation.filter';
import { MemoryConfig, setupGarbageCollection } from './config/memory.config';
import { ValidationPipe } from '@nestjs/common/pipes';
import { BadRequestException } from '@nestjs/common/exceptions';
import { LogLevel } from '@nestjs/common/services';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = process.env.PORT;

async function bootstrap() {
  // Configura garbage collection otimizado para produção
  setupGarbageCollection();

  const app = await NestFactory.create(AppModule, {
    logger: MemoryConfig.logging.levels as LogLevel[],
    bufferLogs: MemoryConfig.logging.bufferLogs,
  });

  // CORS
  app.enableCors();

  // ValidationPipe global customizado
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
      exceptionFactory: (errors) => {
        const messages = errors.map(error => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));
        return new BadRequestException({
          statusCode: 400,
          message: 'Erro de validação',
          errors: messages,
        });
      },
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Biblioteca Virtual - Qa.Coders ')
    .setDescription(SwaggerAuthLoginMessages.WHAT_IS_SWAGGER)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port, function () {
    console.log(`BACKEND is running on port ${port}.`);
  });

}
bootstrap();
