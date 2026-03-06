// ...existing code...
// ...existing code...
import { Controller, Post, UploadedFiles, UseInterceptors, BadRequestException, Body, Request, UseGuards } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Get, Query } from '@nestjs/common';
import { UploadBookService } from '../service/uploadBook.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../admin/entities/Admin.schema';
import { NotificationService } from '../../contact/service/notification.service';
import { UploadBookDto } from '../dtos/bookUpload.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/get-user.decorator';
import { UserDocument } from '../../user/entities/User.schema';
import { AdminDocument } from '../../admin/entities/Admin.schema';
import { Role } from '../../util/Role';
import type { Express } from 'express';
import type { Multer } from 'multer';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('book')
export class UploadBookController {
// ...existing code...
  constructor(
    private readonly uploadBookService: UploadBookService,
    private readonly notificationService: NotificationService,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
  ) {}

  /**
   * Endpoint para listar livros pendentes para análise de admins
   * Protegido por autenticação JWT e role SYSADMIN
   */
  @Get('pendentes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SYSADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Listar livros pendentes para análise',
    description: 'Retorna todos os livros com status pendente para que administradores possam analisar e aprovar/reprovar.'
  })
  @ApiResponse({ status: 200, description: 'Lista de livros pendentes retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Proibido (role sem permissão).' })
  async listarLivrosPendentes() {
    return this.uploadBookService.listarLivrosPendentes();
  }

  /**
   * Endpoint para listar livros ativos, ordenados por título, com paginação
   * Query params: page (padrão 1), limit (padrão 20)
   * Protegido por autenticação JWT
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Lista livros ativos com paginação',
    description: 'Retorna livros ativos (status aprovado) apenas para usuários autenticados.'
  })
  async listarLivros(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 20);
    return this.uploadBookService.listarLivrosAtivos(pageNumber, limitNumber);
  }

  /**
   * Endpoint para fazer upload de um livro e sua capa (opcional) para o Firebase Storage
   * e salvar as informações no MongoDB.
   * Se a capa não for fornecida, será usada uma capa padrão.
   * Requer autenticação JWT. O status do livro será definido baseado na role do usuário:
   * - sysadmin: aprovado
   * - user: pendente
   * @param files - Arquivos enviados pelo usuário (livro obrigatório, capa opcional)
   * @param uploadBookDto - Dados do livro (título, autor, categoria, etc)
   * @param user - Usuário autenticado (obtido via JWT)
   * @returns Informações do livro cadastrado
   */
  @Post('upload')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SYSADMIN)
  @ApiOperation({
    summary: 'Faz upload de um livro (PDF ou EPUB) e capa (opcional)',
    description:
      'Requer autenticação via Bearer JWT. Usuários com role user criam livros com status pendente; sysadmin cria com status aprovado. O arquivo do livro é obrigatório, a capa é opcional (apenas JPG/JPEG/PNG). PDF será convertido para EPUB automaticamente.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Envie multipart/form-data contendo: arquivo do livro em `livro` (obrigatório) e imagem da capa em `capa` (opcional), além dos campos textuais do DTO.',
    schema: {
      type: 'object',
      properties: {
        book: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo do livro (PDF). Máx 50MB.',
        },
        cover: {
          type: 'string',
          format: 'binary',
          description: 'Imagem da capa (JPG/JPEG/PNG). Máx 5MB. Opcional.',
        },
        title: { type: 'string', example: 'Dom Casmurro' },
        author: { type: 'string', example: 'Machado de Assis' },
        category: { type: 'string', example: 'Romance' },
        description: { type: 'string', example: 'Clássico da literatura brasileira.' },
        releaseDate: { type: 'string', example: '25/12/1899' },
      },
      required: ['book', 'title', 'author', 'category', 'description', 'releaseDate'],
    },
  })
  @ApiResponse({ status: 201, description: 'Livro cadastrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida (validações ou arquivos inválidos)' })
  @ApiResponse({ status: 401, description: 'Não autorizado (Bearer token ausente ou inválido)' })
  @ApiResponse({ status: 403, description: 'Proibido (role sem permissão)' })
  @ApiResponse({ status: 500, description: 'Token JWT não enviado' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'book', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  async uploadArquivo(
    @UploadedFiles()
    files: { book: Express.Multer.File[]; cover?: Express.Multer.File[] },
    @Body() uploadBookDto: UploadBookDto,
    @GetUser() user: UserDocument | AdminDocument,
  ) {
    // Valida se o livro foi enviado (obrigatório)
    if (!files.book || files.book.length === 0) {
      throw new BadRequestException('O campo Upload do arquivo do livro é obrigatório.');
    }

    const arquivoLivro = files.book[0];

    // Capa é opcional - se não for fornecida, será usada a configuração padrão do service
    const arquivoCapa = files.cover?.[0];

    // Valida o tamanho do livro (máximo 50MB)
    const tamanhoMaximoLivro = 50 * 1024 * 1024; // 50MB em bytes
    if (arquivoLivro.size > tamanhoMaximoLivro) {
      throw new BadRequestException('Livro muito grande. Tamanho máximo: 50MB');
    }

    // Validações da capa apenas se ela foi enviada
    if (arquivoCapa) {
      const tamanhoMaximoCapa = 5 * 1024 * 1024; // 5MB em bytes
      if (arquivoCapa.size > tamanhoMaximoCapa) {
        throw new BadRequestException(
          'Imagem da capa muito grande. Tamanho máximo: 5MB',
        );
      }

      // Tipos de arquivo permitidos para a capa
      const tiposPermitidosCapa = ['image/jpeg', 'image/jpg', 'image/png'];

      if (!tiposPermitidosCapa.includes(arquivoCapa.mimetype)) {
        throw new BadRequestException(
          'Tipo de arquivo da capa não permitido. Envie apenas JPG, JPEG ou PNG',
        );
      }
    }

    // Valida o tipo do livro (obrigatório)
    const tiposPermitidosLivro = [
      'application/pdf',
      'application/epub+zip',
    ];

    if (!tiposPermitidosLivro.includes(arquivoLivro.mimetype)) {
      throw new BadRequestException(
        'Tipo de arquivo do livro não permitido. Envie apenas PDF e EPUB',
      );
    }

    // Obtém o ID do usuário autenticado
    const userId = user.id?.toString();
    if (!userId) {
      throw new BadRequestException(
        'Usuário não autenticado. Faça login para fazer upload de livros',
      );
    }

    // Determina o status baseado na role do usuário
    const statusLivro = user.roles === Role.SYSADMIN ? 'aprovado' : 'pendente';

    // Chama o serviço
    const resultado = await this.uploadBookService.uploadLivroComCapa(
      arquivoLivro,
      arquivoCapa,
      uploadBookDto,
      userId,
      statusLivro,
    );

    // Notificação para o usuário: status pendente
    if (statusLivro === 'pendente') {
      await this.notificationService.create({
        type: 'Obra pendente de análise',
        message: `Sua obra "${uploadBookDto.title}" foi enviada e aguarda análise do administrador.`,
        user: user.mail,
      });
    }

    // Notificação para todos os admins: novo livro pendente
    if (statusLivro === 'pendente') {
      // Buscar todos os admins
      const admins = await this.adminModel.find({ roles: 'sysadmin' });
      for (const admin of admins) {
        await this.notificationService.create({
          type: 'Obra pendente de análise',
          message: `A obra "${uploadBookDto.title}" foi enviada por ${user.mail} e aguarda sua análise.`,
          user: admin.mail,
        });
      }
    }


    return {
      mensagem: 'Livro cadastrado com sucesso',
      dados: resultado,
    };
  }

  /**
   * Endpoint para buscar livros por título ou autor
   * Query param: q (texto de busca)
   * Protegido por autenticação JWT
   */
  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Buscar livros por título ou autor',
    description: 'Retorna livros cujo título ou autor contenham o texto pesquisado.'
  })
  async buscarLivros(@Query('q') q: string) {
    return this.uploadBookService.buscarLivros(q);
  }
}
