import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para validação do ID do livro a ser favoritado
 */
export class FavoriteBookParamDto {
  @ApiProperty({
    description: 'ID do livro a ser favoritado',
    example: '507f1f77bcf86cd799439011',
    type: String,
  })
  @IsNotEmpty({ message: 'O ID do livro é obrigatório' })
  @IsMongoId({ message: 'O ID do livro deve ser um MongoID válido' })
  id: string;
}