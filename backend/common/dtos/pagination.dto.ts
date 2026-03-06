import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Número da página (começa em 1)',
    default: 1,
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'A página deve ser maior ou igual a 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    default: 10,
    minimum: 1,
    maximum: 100,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'O limite deve ser maior ou igual a 1' })
  @Max(100, { message: 'O limite não pode ser maior que 100' })
  limit?: number = 10;
}