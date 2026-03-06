import { IsEmail, IsNotEmpty, Length, Validate, IsOptional, IsEnum, ValidateIf, IsDefined } from "class-validator";
import { Transform } from "class-transformer";
import { LoginRegisterValidationMessagesError } from "../../messages/login-register.validation.messages";
import { ValidatePassword } from "../../middleware/password.validator"
import { ApiProperty } from '@nestjs/swagger';
import { IsValidBirthDate } from "common/validators/IsValidBirthDate";
import { IsValidName } from "common/validators/IsValidName";
import { IsValidEmailDomain } from "common/validators/IsValidEmailDomain";
import { IsValidValue } from 'common/validators/IsValidValue';
import { Role } from "../../util/Role";
import { parse, isValid } from 'date-fns';

export class CreateUserDto {
  @ApiProperty({ example: 'João', description: 'Nome deve conter apenas letras' })
  @IsNotEmpty({ message: "O campo nome é obrigatório." })
  @ValidateIf((o) => o.firstName !== undefined && o.firstName !== null && String(o.firstName).trim().length > 0)
  @Length(2, 50, { message: "O campo nome deve conter entre 2 e 50 caracteres." })
  @ValidateIf((o) => o.firstName !== undefined && o.firstName !== null && String(o.firstName).trim().length > 0)
  @IsValidName({ message: "O campo nome deve iniciar com letra maiúscula e aceitar apenas letras, acentuação e espaços." })
  firstName: string;

  @ApiProperty({ example: 'Silva', description: 'Sobrenome deve conter apenas letras' })
  @IsNotEmpty({ message: "O campo sobrenome é obrigatório." })
  @ValidateIf((o) => o.lastName !== undefined && o.lastName !== null && String(o.lastName).trim().length > 0)
  @Length(2, 50, { message: "O campo sobrenome deve conter entre 2 e 50 caracteres." })
  @ValidateIf((o) => o.lastName !== undefined && o.lastName !== null && String(o.lastName).trim().length > 0)
  @IsValidName({ message: "O campo sobrenome deve iniciar com letra maiúscula e aceitar apenas letras, acentuação e espaços." })
  lastName: string;

  @ApiProperty({ example: 'joao.silva@email.com.br', description: 'Email válido com domínio permitido' })
  @IsDefined({ message: "O campo E-mail é obrigatório." })
  @IsNotEmpty({ message: "O campo E-mail é obrigatório." })
  @ValidateIf((o) => o.mail && String(o.mail).trim().length > 0)
  @Length(5, 50, { message: "O campo E-mail deve conter entre 5 e 50 caracteres." })
  @ValidateIf((o) => o.mail && String(o.mail).trim().length > 0)
  @IsEmail({}, { message: "O e-mail inserido é inválido." })
  @ValidateIf((o) => o.mail && String(o.mail).trim().length > 0)
  @IsValidEmailDomain({ message: 'O e-mail inserido é inválido.' })
  mail: string;

  @ApiProperty({ example: '25/09/2012', description: 'Data no formato dd/mm/yyyy' })
  @IsNotEmpty({ message: "O campo data de nascimento é obrigatório." })
  @ValidateIf((o) => o.birthDate && String(o.birthDate).trim().length > 0)
  @IsValidBirthDate({ message: 'A data de nascimento deve estar no formato DD/MM/AAAA e ser válida.' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      // Converte string no formato dd/mm/yyyy para Date
      const date = parse(value, 'dd/MM/yyyy', new Date());
      return isValid(date) ? date : value;
    }
    return value;
  })
  birthDate: Date;

  @ApiProperty({ example: 'Senha@123', description: 'Senha forte obrigatória' })
  @IsNotEmpty({ message: "O campo senha é obrigatório." })
  @ValidateIf((o) => o.password && o.password.length > 0)
  @Validate(ValidatePassword)
  password: string;

  @ApiProperty({ example: 'Senha@123', description: 'Senha forte obrigatória' })
  @IsNotEmpty({ message: "O campo confirmação de senha é obrigatório." })
  @ValidateIf((o) => o.confirmPassword && o.confirmPassword.length > 0)
  @Validate(ValidatePassword)
  confirmPassword: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role deve ser um valor válido do enum Role' })
  role?: Role.USER;
}