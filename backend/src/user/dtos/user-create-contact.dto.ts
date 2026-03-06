import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class UserCreateContactDto {
  @ApiProperty({ example: 'Sugestão de melhoria', maxLength: 50 })
  @IsNotEmpty({ message: 'O campo Título da mensagem é obrigatório' })
  @MaxLength(50, { message: 'O campo Título da mensagem deve conter no máximo 50 caracteres.' })
  @Matches(/^[A-ZÀ-Ú][\w\W\sÀ-ú0-9.,;:!?@#$%&*()\-+=/\\\[\]{}|<>"'`~^´¨]*$/, {
    message: 'O campo Título da mensagem deve iniciar com letra maiúscula e aceitar acentuação, caracteres especiais, números, letras e espaço.'
  })
  title: string;

  @ApiProperty({ example: 'Gostaria de sugerir uma nova funcionalidade...', maxLength: 700 })
  @IsNotEmpty({ message: 'O campo Texto/resumo é obrigatório' })
  @MaxLength(700, { message: 'O campo Texto/resumo deve conter no máximo 700 caracteres.' })
  @Matches(/^[A-ZÀ-Ú][\w\W\sÀ-ú0-9.,;:!?@#$%&*()\-+=/\\\[\]{}|<>"'`~^´¨]*$/, {
    message: 'O campo Texto/resumo deve iniciar com letra maiúscula e aceitar acentuação, caracteres especiais, números, letras e espaço.'
  })
  summary: string;
}
