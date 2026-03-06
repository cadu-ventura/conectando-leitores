import { IsBoolean, IsString, ValidateIf, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({ 
    example: true,
    description: 'Status do livro: true para aprovar, false para rejeitar'
  })
  @IsBoolean({ message: 'O status deve ser um valor booleano.' })
  status: boolean;

  @ApiProperty({ 
    example: 'Conteúdo inadequado',
    description: 'Justificativa da rejeição (obrigatório quando status é false)',
    required: false
  })
  @ValidateIf((o) => o.status === false)
  @IsNotEmpty({ message: 'O campo justificativa é obrigatório quando o livro é reprovado.' })
  @IsString({ message: 'A justificativa deve ser um texto.' })
  justification?: string;
}