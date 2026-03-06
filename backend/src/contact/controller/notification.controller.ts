import { Controller, Get, UseGuards, Patch, Param } from '@nestjs/common';
import { GetUser } from '../../auth/get-user.decorator';
import { NotificationService } from '../service/notification.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Notification')
@ApiBearerAuth('JWT-auth')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Listar todas as notificações do usuário',
    description: 'Retorna todas as notificações do usuário autenticado, incluindo lidas e não lidas.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificações retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
          type: { type: 'string', example: 'Obra aprovada!' },
          message: { type: 'string', example: 'Sua obra "Título do Livro" foi aprovada e está disponível no acervo.' },
          user: { type: 'string', example: 'usuario@exemplo.com' },
          read: { type: 'boolean', example: false },
          createdAt: { type: 'string', example: '2025-11-07T10:30:00.000Z' },
          justification: { type: 'string', example: 'Motivo da rejeição', nullable: true }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT ausente ou inválido'
  })
  async findAll(@GetUser() user: any) {
    // Filtra notificações pelo campo user (email ou id)
    return this.notificationService.findByUser(user.mail || user.email || user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  @ApiOperation({
    summary: 'Marcar notificação como lida',
    description: 'Atualiza o status de uma notificação específica para lida (read = true).'
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID da notificação a ser marcada como lida (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({
    status: 200,
    description: 'Notificação marcada como lida com sucesso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        type: { type: 'string', example: 'Obra aprovada!' },
        message: { type: 'string', example: 'Sua obra foi aprovada' },
        user: { type: 'string', example: 'usuario@exemplo.com' },
        read: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2025-11-07T10:30:00.000Z' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Notificação não encontrada'
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado - A notificação não pertence ao usuário autenticado'
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT ausente ou inválido'
  })
  async markAsRead(@Param('id') id: string, @GetUser() user: any) {
    const userIdentifier = user.mail || user.email || user.id;
    return this.notificationService.markAsRead(id, userIdentifier);
  }
}