import {  ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateAdminDto } from "../dtos/admin-create.dto"
import { AdminAccountRepository } from "../repository/admin-login-register.repository";
import { AdminQueryRepository } from "../repository/admin-read.repository";

import { LoginRegisterRequestMessagesError, LoginRegisterRequestMessagesOk } from "../../messages/register.request.messages";
import { HttpMessagesError } from "common/messages/CommonMessagesHttp";

import * as bcrypt from "bcrypt";

@Injectable()
export class CreateAdminService {
  constructor(
    private readonly adminAccountRepository: AdminAccountRepository,
    private readonly adminQueryRepository: AdminQueryRepository
  ) {}

  async registerNewAdmin(registrationData: CreateAdminDto) {
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

    const existingAdmin =
      await this.adminQueryRepository.findAdminByEmail(registrationData.mail);

    if (existingAdmin) {
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

    const sanitizedAdminData = {
      firstName: registrationData.firstName.trim(),
      lastName: registrationData.lastName.trim(),
      mail: registrationData.mail.trim().toLowerCase(),
      birthDate: registrationData.birthDate,
      password: registrationData.password
    };

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const newAdmin = await this.adminAccountRepository.createAccount(
      sanitizedAdminData,
      hashedPassword
    );

    if (!newAdmin) {
      throw new InternalServerErrorException(
        null,
        HttpMessagesError.INTERNAL_SERVER_ERROR_EXCEPTION
      );
    }

    return {
      message: LoginRegisterRequestMessagesOk.REGISTER_CREATED_SUCESSFULLY,
      admin: newAdmin,
    };
  }
}
