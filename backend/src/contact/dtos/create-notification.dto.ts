import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'contact' })
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Nova mensagem de contato recebida.' })
  @IsNotEmpty()
  message: string;

  @ApiProperty({ example: 'usuario@email.com' })
  @IsNotEmpty()
  user: string;
  @ApiProperty({ example: 'João Silva', required: false })
  userName?: string;
}
