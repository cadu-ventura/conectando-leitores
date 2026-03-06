import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { LoginRegisterValidationMessagesError } from '../messages/login-register.validation.messages';

// Regex para senha: 6-10 caracteres, pelo menos 1 maiúscula, 1 minúscula, 1 número, 1 especial, sem espaços
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*\s).{6,10}$/;

@ValidatorConstraint({ name: 'ValidatePassword', async: false })
export class ValidatePassword implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    if (!password || typeof password !== 'string') {
      return false;
    }

    return passwordRegex.test(password);
  }

  defaultMessage(args: ValidationArguments) {
    return LoginRegisterValidationMessagesError.REGISTER_PASSWORD_NOT_VALID;
  }
}
