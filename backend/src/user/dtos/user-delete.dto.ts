import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DeletionJustification } from 'src/util/deletion-justification';


export class DeleteUserDto {
  @ApiProperty({
    description: 'Justificativa para a deleção do usuário',
    enum: DeletionJustification,
    enumName: 'DeletionJustification',
    example: DeletionJustification.PLATFORM_MISUSE,
    required: true,
  })
  @IsNotEmpty({ message: 'Justificativa é obrigatória' })
  @IsEnum(DeletionJustification, {
    message: `Justificativa deve ser uma das seguintes opções: ${Object.values(DeletionJustification).join(', ')}`,
  })
  justification: DeletionJustification;
}