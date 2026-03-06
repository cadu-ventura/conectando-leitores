import {  ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateUserDto } from "../dtos/user-create.dto"
import { UserAccountRepository } from "../repository/user-login-register.repository";
import { UserQueryRepository } from "../repository/user-read.repository";

import { LoginRegisterRequestMessagesError, LoginRegisterRequestMessagesOk } from "../../messages/register.request.messages";
import { HttpMessagesError } from "common/messages/CommonMessagesHttp";

import * as bcrypt from "bcrypt";

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userAccountRepository: UserAccountRepository,
    private readonly userQueryRepository: UserQueryRepository
  ) {}

  async registerNewUser(registrationData: CreateUserDto) {
    // Validação adicional para garantir campos obrigatórios - coleta todos os erros
    const errors: string[] = [];
    
    if (!registrationData.firstName || registrationData.firstName.trim() === '') {
      errors.push('O campo nome é obrigatório.');
    }
    if (!registrationData.lastName || registrationData.lastName.trim() === '') {
      errors.push('O campo sobrenome é obrigatório.');
    }
    if (!registrationData.mail || registrationData.mail.trim() === '') {
      errors.push('O campo E-mail é obrigatório.');
    }
    if (!registrationData.birthDate) {
      errors.push('O campo data de nascimento é obrigatório.');
    }
    if (!registrationData.password || registrationData.password.trim() === '') {
      errors.push('O campo senha é obrigatório.');
    }
    if (!registrationData.confirmPassword || registrationData.confirmPassword.trim() === '') {
      errors.push('O campo confirmação de senha é obrigatório.');
    }

    if (errors.length > 0) {
      throw new ConflictException({
        statusCode: 400,
        message: errors
      });
    }

    const existingUser =
      await this.userQueryRepository.findUserByEmail(registrationData.mail);

    if (existingUser) {
      throw new ConflictException(
        null,
        LoginRegisterRequestMessagesError.REGISTER_EXIST_EMAIL_ACCOUNT
      );
    }

    if (registrationData.password !== registrationData.confirmPassword) {
      throw new ConflictException(
        {
          statusCode: 400,
          message: ['As senhas não conferem.']
        }
      );
    }

    const sanitizedUserData = {
      firstName: registrationData.firstName.trim(),
      lastName: registrationData.lastName.trim(),
      mail: registrationData.mail.trim().toLowerCase(),
      birthDate: registrationData.birthDate,
      password: registrationData.password
    };

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const newUser = await this.userAccountRepository.createAccount(
      sanitizedUserData,
      hashedPassword
    );

    if (!newUser) {
      throw new InternalServerErrorException(
        null,
        HttpMessagesError.INTERNAL_SERVER_ERROR_EXCEPTION
      );
    }

    return {
      message: LoginRegisterRequestMessagesOk.REGISTER_CREATED_SUCESSFULLY,
      user: newUser,
    };
  }
}
