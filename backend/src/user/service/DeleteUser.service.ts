import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { DeletionJustification } from '../../util/deletion-justification';
import { UserDeleteRepository } from '../repository/user-delete.repository';

@Injectable()
export class DeleteUserService {
  constructor(
    private readonly userDeleteRepository: UserDeleteRepository
  ) {}

  async deleteUser(userId: string, justification: DeletionJustification) {
    // Validar se o ID é um ObjectId válido
    if (!isValidObjectId(userId)) {
      throw new BadRequestException('ID de usuário inválido');
    }

    // Validar se a justificativa é válida
    if (!Object.values(DeletionJustification).includes(justification)) {
      throw new BadRequestException('Justificativa inválida');
    }

    // Buscar o usuário
    const user = await this.userDeleteRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Deletar permanentemente
    await this.userDeleteRepository.deleteById(userId);
    
    return {
      deletedUser: user,
      justification: justification
    };
  }
}