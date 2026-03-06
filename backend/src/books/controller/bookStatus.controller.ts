import { Body, Controller, Param, Patch, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { Role } from '../../util/Role';
import { UpdateStatusDto } from '../../../common/dtos/UpdateStatusCommon.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from '../entities/book.schema';
import { NotificationService } from '../../contact/service/notification.service';
import { User } from '../../user/entities/User.schema';
import { StatusLivro } from '../enums/book.enums';

@ApiTags('Books')
@ApiBearerAuth('JWT-auth')
@Controller('book')
export class BookStatusController {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly notificationService: NotificationService,
  ) {}

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SYSADMIN)
  @ApiOperation({
    summary: 'Atualizar status do livro',
    description: 'Permite que um administrador aprove ou reprove um livro enviado por um usuário. Também notifica o dono do livro sobre a decisão.'
  })
  @ApiResponse({
    status: 200,
    description: 'Status do livro atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Status do livro atualizado para aprovado' },
        bookId: { type: 'string', example: '653a1b2c3d4e5f6a7b8c9d0e' },
        status: { type: 'string', example: 'aprovado' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Livro não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Livro não encontrado' },
        bookId: { type: 'string', example: '653a1b2c3d4e5f6a7b8c9d0e' }
      }
    }
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Livro não encontrado',
        bookId: id
      });
    }
    book.status = updateStatusDto.status ? StatusLivro.APROVADO : StatusLivro.REPROVADO;
    await book.save();

    // Busca o usuário dono do livro
    const user = await this.userModel.findById(book.uploadedBy);
    if (user) {
      let notificationMessage: string;
      let notificationType: string;
      
      if (updateStatusDto.status) {
        notificationType = 'Obra aprovada!';
        notificationMessage = `Parabéns! Sua obra "${book.title}" foi analisada e aprovada pelo administrador. Ela já está disponível no acervo da biblioteca para todos os usuários.`;
      } else {
        notificationType = 'Obra não aprovada';
        // Se rejeitado, inclui a justificativa na notificação
        const justification = updateStatusDto.justification 
          ? ` Motivo: ${updateStatusDto.justification}` 
          : '';
        notificationMessage = `Sua obra "${book.title}" não pôde ser aprovada pelo administrador neste momento. Verifique as orientações enviadas e realize as correções necessárias antes de reenviar.${justification}`;
      }
      
      await this.notificationService.create({
        type: notificationType,
        message: notificationMessage,
        user: user.mail,
      });
    }
    return {
      statusCode: 200,
      message: `Status do livro atualizado para ${book.status}`,
      bookId: book._id,
      status: book.status
    };
  }
}
