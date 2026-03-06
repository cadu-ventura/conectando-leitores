import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Matches, ValidateIf } from 'class-validator';

export class CreateContactMessageDto {
  @ApiProperty({ example: 'Sugestão de melhoria', minLength: 3, maxLength: 50 })
  @IsNotEmpty({ message: 'O campo Título da mensagem é obrigatório' })
  @ValidateIf((o) => o.title && o.title.trim().length > 0)
  @MinLength(3, { message: 'O campo Título da mensagem deve conter no mínimo 3 caracteres.' })
  @ValidateIf((o) => o.title && o.title.trim().length > 0)
  @MaxLength(50, { message: 'O campo Título da mensagem deve conter no máximo 50 caracteres.' })
  @ValidateIf((o) => o.title && o.title.trim().length > 0)
  @Matches(/^[A-ZÀ-Ú][A-Za-zÀ-úÀ-ÿ0-9\s.,;:!?@#$%&*()\-+=/\\\[\]{}|<>"'`~^´¨]*$/, {
    message: 'O campo Título da mensagem deve iniciar com letra maiúscula e aceitar acentuação, caracteres especiais, números, letras e espaço.'
  })
  title: string;

  @ApiProperty({ example: 'Gostaria de sugerir uma nova funcionalidade...', maxLength: 700 })
  @IsNotEmpty({ message: 'O campo Mensagem é obrigatório' })
  @ValidateIf((o) => o.summary && o.summary.trim().length > 0)
  @MaxLength(700, { message: 'O campo Mensagem deve conter no máximo 700 caracteres.' })
  @ValidateIf((o) => o.summary && o.summary.trim().length > 0)
  @Matches(/^[A-ZÀ-Ú][A-Za-zÀ-úÀ-ÿ0-9\s.,;:!?@#$%&*()\-+=/\\\[\]{}|<>"'`~^´¨]*$/, {
    message: 'O campo Mensagem deve iniciar com letra maiúscula e aceitar acentuação, caracteres especiais, números, letras e espaço.'
  })
  summary: string;
}
