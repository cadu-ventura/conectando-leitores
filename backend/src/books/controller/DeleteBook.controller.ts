import { Controller, Delete, Param, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { DeleteBookService } from '../service/DeleteBook.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/util/Role';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Books')
@ApiBearerAuth('JWT-auth')
@Controller('book')
export class DeleteBookController {
  constructor(private readonly deleteBookService: DeleteBookService) {}

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SYSADMIN)
  @ApiOperation({
    summary: 'Deletar livro por ID',
    description: 'Remove um livro permanentemente do acervo. Apenas administradores do sistema podem executar esta ação. O usuário que enviou o livro será notificado sobre a exclusão.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID do livro a ser deletado (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Livro deletado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Obra excluída com sucesso!' },
        deletedBook: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'Título do Livro' },
            author: { type: 'string', example: 'Autor do Livro' },
            category: { type: 'string', example: 'Ficção' },
            description: { type: 'string', example: 'Descrição do livro' },
            releaseDate: { type: 'string', example: '2023-01-01T00:00:00.000Z' },
            uploadedBy: { type: 'string', example: '507f1f77bcf86cd799439011' },
            status: { type: 'string', example: 'aprovado' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'ID de livro inválido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'ID de livro inválido' },
      },
    },
  })
  @ApiResponse({
    status: 401,
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
    description: 'Livro não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Livro não encontrado' },
      },
    },
  })
  async deleteBook(@Param('id') id: string) {
    try {
      const result = await this.deleteBookService.deleteBook(id);
      
      return result;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Erro interno do servidor ao deletar livro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
