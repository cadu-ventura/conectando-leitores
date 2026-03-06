import { Controller, Post, Get, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ContactService } from '../service/contact.service';
import { CreateContactMessageDto } from '../dtos/create-contact-message.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('contact')
@ApiBearerAuth()
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'Sua mensagem foi enviada com sucesso!' })
  @ApiResponse({ status: 400, description: 'Erro de validação dos campos.' })
  @ApiResponse({ status: 500, description: 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.' })
  async create(@Body() createContactMessageDto: CreateContactMessageDto, @Request() req) {
    try {
      const user = req.user;
      if (!user) {
        throw new HttpException('Acesso não autorizado', HttpStatus.UNAUTHORIZED);
      }
      await this.contactService.create(createContactMessageDto, user.mail || user.email || user.id);
      return { message: 'Sua mensagem foi enviada com sucesso!' };
    } catch (error) {
      throw new HttpException(
        error?.message || 'Não foi possível enviar sua mensagem. Tente novamente mais tarde.',
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({ status: 200, description: 'Lista de mensagens de contato.' })
  async findAll(@Request() req) {
    const user = req.user;
    // Aqui você pode adicionar lógica para permitir apenas admins, se necessário
    return this.contactService.findAll();
  }
}
