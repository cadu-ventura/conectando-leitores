import { Controller, Delete, Param, Body, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { DeleteUserService } from '../service/DeleteUser.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/util/Role';
import { Roles } from 'src/auth/roles.decorator';
import { DeleteUserDto } from '../dtos/user-delete.dto';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class DeleteUserController {
  constructor(private readonly deleteUserService: DeleteUserService) {}

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SYSADMIN)
  @ApiOperation({
    summary: 'Deletar usuário por ID',
    description: 'Remove um usuário do sistema com justificativa obrigatória. Apenas administradores do sistema podem executar esta ação.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do usuário a ser deletado',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiBody({
    type: DeleteUserDto,
    description: 'Dados necessários para deletar o usuário',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuário deletado com sucesso' },
        deletedUser: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            firstName: { type: 'string', example: 'Nome do Usuário' },
            lastName: { type: 'string', example: 'Sobrenome do Usuário' },
            mail: { type: 'string', example: 'usuario@exemplo.com' },
            password: { type: 'string', example: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lui/9p2K6Ff5eW' },
            birthDate: { type: 'string', example: '2000-01-01T00:00:00.000Z' },
            role: { type: 'string', example: 'user' },
            createdAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
          },
        },
        justification: { type: 'string', example: 'Uso indevido da plataforma' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Justificativa invalida fornecida',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        error: { type: 'string', example: 'Erro de validação' },
        validationResult: { type: 'object', example: { justification: 'Justificativa deve ser uma das seguintes opções: Uso indevido da plataforma, Comportamento inadequado, Violação de direitos autorais, Fraudes ou irregularidades cadastrais, Inatividade prolongada, Descumprimento do regulamento da biblioteca, Solicitação do próprio usuário' } },
        message: { type: 'string', example: 'Justificativa inválida' }
        },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'ID de usuário inválido',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 400 },
            message: { type: 'string', example: 'ID de usuário inválido' },
        },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Token de autenticação inválido ou ausente',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - privilégios de administrador necessários',
    schema: {
        type: 'object',
        properties: {
            statusCode: { type: 'number', example: 403 },
            message: { type: 'string', example: 'Forbidden resource' },
        },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
      },
    },
  })
  async deleteUser(@Param('id') id: string, @Body() deleteUserDto: DeleteUserDto,) {
    try {
      const result = await this.deleteUserService.deleteUser(id, deleteUserDto.justification);
      
      return {
        message: 'Usuário deletado com sucesso',
        deletedUser: {...result.deletedUser.toObject()},
        justification: result.justification
      }; // SÓ SUBIR PRO GIT NA SEGUNDA <-----------------------------

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Erro interno do servidor ao deletar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}