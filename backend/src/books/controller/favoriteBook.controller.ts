import { Controller, Post, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FavoriteBookService } from '../service/favoriteBook.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { GetUser } from '../../auth/get-user.decorator';
import { Role } from '../../util/Role';
import { UserDocument } from '../../user/entities/User.schema';
import { AdminDocument } from '../../admin/entities/Admin.schema';
import { FavoriteBookParamDto } from '../dtos/favoriteBook.dto';

@ApiTags('Books')
@Controller('book')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FavoriteBookController {
  constructor(private readonly favoriteBookService: FavoriteBookService) {}

  /**
   * Adiciona um livro aos favoritos do usuário ou admin autenticado.
   * O email é extraído automaticamente do token JWT.
   * Funciona para ambas as coleções: User e Admin.
   * @param params - Contém o ID do livro a ser favoritado
   * @param user - Usuário ou Admin autenticado (injetado automaticamente via @GetUser decorator)
   * @returns Dados do usuário/admin atualizado com o livro nos favoritos
   */
  @Post('favorite/:id')
  @Roles(Role.USER, Role.SYSADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Adicionar livro aos favoritos',
    description:
      'Adiciona um livro à lista de favoritos do usuário ou admin autenticado. ' +
      'O livro deve existir e não pode estar duplicado nos favoritos. ' +
      'O email do usuário/admin é extraído automaticamente do token JWT fornecido no header Authorization. ' +
      'Funciona tanto para usuários (USER) quanto para administradores (SYSADMIN). ' +
      'Requer autenticação via Bearer JWT.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do livro a ser favoritado (MongoDB ObjectId)',
    type: String,
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Livro adicionado aos favoritos com sucesso',
    schema: {
      type: 'object',
      properties: {
        mensagem: {
          type: 'string',
          example: 'Livro adicionado aos favoritos com sucesso',
        },
        dados: {
          type: 'object',
          properties: {
            favorites: {
              type: 'array',
              description: 'Lista de livros favoritos com URL da capa pronta para exibição',
              items: {
                type: 'object',
                properties: {
                  _id: { 
                    type: 'string', 
                    example: '507f1f77bcf86cd799439011',
                    description: 'ID do livro'
                  },
                  title: { 
                    type: 'string', 
                    example: 'Dom Casmurro',
                    description: 'Título do livro'
                  },
                  author: { 
                    type: 'string', 
                    example: 'Machado de Assis',
                    description: 'Autor do livro'
                  },
                  category: { 
                    type: 'string', 
                    example: 'Romance',
                    description: 'Categoria do livro'
                  },
                  description: { 
                    type: 'string',
                    example: 'Clássico da literatura brasileira sobre ciúmes e obsessão',
                    description: 'Descrição detalhada da obra'
                  },
                  coverUrl: {
                    type: 'string',
                    example: 'https://storage.googleapis.com/seu-bucket/oraculo/livros/dom-casmurro/capa-uuid.jpg',
                    description: 'URL pública da capa do livro (pronta para usar em <img src="">)'
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'ID do livro inválido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'ID do livro inválido' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT ausente ou inválido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Proibido - Role sem permissão',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Livro não encontrado ou usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: {
          type: 'string',
          example: 'Livro não encontrado',
        },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Livro já está nos favoritos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example: 'Este livro já está nos seus favoritos',
        },
        error: { type: 'string', example: 'Conflict' },
      },
    },
  })
  async addFavorite(
    @Param() params: FavoriteBookParamDto,
    @GetUser() user: UserDocument | AdminDocument,
  ) {
    // O email é extraído automaticamente do token JWT através do @GetUser decorator
    const userEmail = user.mail;

    const resultado = await this.favoriteBookService.addFavoriteBook(
      params.id,
      userEmail,
    );

    return {
      mensagem: 'Livro adicionado aos favoritos com sucesso',
      dados: resultado,
    };
  }
}