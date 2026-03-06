import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'
import { IsValidValue } from 'common/validators/IsValidValue';

export class AuthLoginDto {
  @ApiProperty({ example: 'sysadmin@qacoders.com' })
  @IsEmail({}, { message: 'O email informado é inválido' })
  @IsNotEmpty({ message: 'O campo email não pode estar vazio' })
  @IsValidValue({ message: 'O campo "mail" é obrigatório' })
  mail: string;

  @ApiProperty({ example: '1234@Test' })
  @IsNotEmpty({ message: 'O campo senha não pode estar vazio' })
  @IsValidValue({ message: 'O campo "password" é obrigatório' })
  password: string;
}
