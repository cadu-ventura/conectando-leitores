import { IsEmail, Matches, IsNotEmpty, Length } from "class-validator";
import { LoginRegisterValidationMessagesError } from "../../messages/login-register.validation.messages"

const nameRegex = /^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-záàâãéèêíïóôõöúçñ']+$/;

export class UpdateAdminProfileDto {
  /**
   * @example "Carlos"
   */
  @Length(2, 50, {
    message:
      LoginRegisterValidationMessagesError.REGISTER_NAME_NOT_VALID_LENGTH,
  })
  @Matches(nameRegex, {
    message: LoginRegisterValidationMessagesError.REGISTER_NAME_NOT_VALID,
  })
  @IsNotEmpty({
    message: LoginRegisterValidationMessagesError.REGISTER_NAME_NOT_EMPTY,
  })
  firstName: string;

  /**
   * @example "Silva"
   */
  @Length(2, 50, {
    message:
      LoginRegisterValidationMessagesError.REGISTER_NAME_NOT_VALID_LENGTH,
  })
  @Matches(nameRegex, {
    message: LoginRegisterValidationMessagesError.REGISTER_NAME_NOT_VALID,
  })
  @IsNotEmpty({
    message: LoginRegisterValidationMessagesError.REGISTER_NAME_NOT_EMPTY,
  })
  lastName: string;

  /**
   * O e-mail é necessário para o login, mas não necessariamente precisa ser o mesmo e-mail da
   * rede social que estiver conectada. Login sem rede social precisa de uma senha.
   * @example "email@email.com"
   */
  @IsEmail(
    {},
    { message: LoginRegisterValidationMessagesError.REGISTER_EMAIL_NOT_VALID }
  )
  @IsNotEmpty({
    message: LoginRegisterValidationMessagesError.REGISTER_EMAIL_NOT_EMPTY,
  })
  mail: string;
}
