
import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ContactService } from '../../contact/service/contact.service';
import { CreateContactMessageDto } from '../../contact/dtos/create-contact-message.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @UseGuards(JwtAuthGuard)
  @Post('contact')
  @ApiResponse({ status: 201, description: 'Mensagem enviada com sucesso!' })
  @ApiResponse({ status: 400, description: 'Erro de validação.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 500, description: 'Erro interno.' })
  async create(@Body() dto: CreateContactMessageDto, @Request() req) {
    try {
      const user = req.user;
      if (!user) {
        throw new HttpException('Acesso não autorizado', HttpStatus.UNAUTHORIZED);
      }
      const userIdentifier = user.email || user.mail || user.id || user.sub;
      if (!userIdentifier) {
        throw new HttpException(
          'Dados de usuário inválidos',
          HttpStatus.BAD_REQUEST
        );
      }
      const result = await this.contactService.create(dto, userIdentifier);
      return {
        success: true,
        message: 'Sua mensagem foi enviada com sucesso!',
        data: {
          id: result._id,
          createdAt: result.createdAt
        }
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors || {}).map((e: any) => e.message);
        throw new HttpException(
          `Erro de validação: ${messages.join(', ')}`,
          HttpStatus.BAD_REQUEST
        );
      }
      if (error.code === 11000) {
        throw new HttpException(
          'Mensagem duplicada',
          HttpStatus.CONFLICT
        );
      }
      throw new HttpException(
        'Não foi possível enviar sua mensagem. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
