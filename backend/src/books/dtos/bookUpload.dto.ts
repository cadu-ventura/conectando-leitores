import { IsString, IsNotEmpty, MaxLength, IsEnum, Matches, Validate, Allow, ValidateIf } from 'class-validator';
import { CategoriaLivro } from '../enums/book.enums';
import { Transform } from 'class-transformer';
import IsValidDateFormat from 'common/validators/IsValidDateFormat';
import { ApiProperty } from '@nestjs/swagger';

export class UploadBookDto {
  @ApiProperty({ description: 'Título do livro', maxLength: 50, example: 'Dom Casmurro' })
  @IsNotEmpty({ message: 'O campo Título é obrigatório.' })
  @ValidateIf((o) => o.title && o.title.trim().length > 0)
  @IsString({ message: 'Título deve ser um texto' })
  @MaxLength(50, { message: 'O campo Título do livro deve conter no máximo 50 caracteres.' })
  @Matches(/^[\w\W\sÀ-ú0-9.,;:!?@#$%&*()\-+=/\\\[\]{}|<>"'`~^´¨]+$/, {
    message: 'O campo Título do livro aceita letras, espaços, acentuação, caracteres especiais e números.',
  })
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiProperty({ description: 'Autor do livro', maxLength: 50, example: 'Machado de Assis' })
  @IsNotEmpty({ message: 'O campo Autor é obrigatório.' })
  @ValidateIf((o) => o.author && o.author.trim().length > 0)
  @IsString({ message: 'Autor deve ser um texto' })
  @MaxLength(50, { message: 'O campo Autor deve conter no máximo 50 caracteres.' })
  @Matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
    message: 'O campo Autor aceita apenas letras, acentuação e espaços.',
  })
  @Transform(({ value }) => value?.trim())
  author: string;

  @ApiProperty({ description: 'Categoria do livro', enum: CategoriaLivro, example: 'ROMANCE' })
  @IsNotEmpty({ message: 'O campo Categoria é obrigatório.' })
  @ValidateIf((o) => o.category)
  @IsEnum(CategoriaLivro, {
    message: `O campo Categoria deve ser uma das opções: ${Object.values(CategoriaLivro).join(', ')}.`,
  })
  category: CategoriaLivro;

  @ApiProperty({ description: 'Descrição do livro', maxLength: 800, example: 'Clássico da literatura brasileira.' })
  @IsNotEmpty({ message: 'O campo Descrição é obrigatório.' })
  @ValidateIf((o) => o.description && o.description.trim().length > 0)
  @IsString({ message: 'Descrição deve ser um texto' })
  @MaxLength(800, { message: 'O campo descrição deve conter até 800 caracteres.' })
  @Matches(/^[\w\W\sÀ-ú0-9.,;:!?@#$%&*()\-+=/\\\[\]{}|<>"'`~^´¨]+$/, {
    message: 'O campo Descrição aceita letras, espaços, acentuação, caracteres especiais e números.',
  })
  @Transform(({ value }) => value?.trim())
  description: string;

  @ApiProperty({ description: 'Data de lançamento no formato dd/MM/yyyy', example: '25/12/1899' })
  @IsNotEmpty({ message: 'Data de lançamento é obrigatória' })
  @ValidateIf((o) => o.releaseDate && o.releaseDate.trim().length > 0)
  @IsString({ message: 'Data de lançamento deve ser um texto' })
  @Validate(IsValidDateFormat)
  releaseDate: string;

  @ApiProperty({ description: 'Arquivo do livro (PDF/EPUB) enviado como arquivo em multipart/form-data', required: true, type: 'string', format: 'binary' })
  @Allow()
  book?: any;

  @ApiProperty({ description: 'Imagem da capa (JPG/JPEG) enviada como arquivo em multipart/form-data', required: false, type: 'string', format: 'binary' })
  @Allow()
  cover?: any;
}
