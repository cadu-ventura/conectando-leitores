import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class MostFavoritedBooksQueryDto {
  @ApiProperty({
    description: 'Número de livros a retornar (limite)',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite deve ser um número inteiro' })
  @Min(1, { message: 'O limite mínimo é 1' })
  @Max(50, { message: 'O limite máximo é 50' })
  limit?: number = 10;
}