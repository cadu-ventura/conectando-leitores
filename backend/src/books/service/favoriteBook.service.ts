import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../user/entities/User.schema';
import { Admin, AdminDocument } from '../../admin/entities/Admin.schema';
import { Book } from '../entities/book.schema';

@Injectable()
export class FavoriteBookService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  /**
   * Gera a URL pública da capa do livro no Firebase Storage
   * @param storagePath - Caminho do arquivo no Firebase Storage
   * @returns URL pública da capa
   */
  private gerarUrlCapa(storagePath: string): string {
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    return `https://storage.googleapis.com/${bucketName}/${storagePath}`;
  }

  /**
   * Adiciona um livro aos favoritos do usuário ou admin
   * @param bookId - ID do livro a ser favoritado
   * @param userEmail - Email do usuário/admin (extraído do token JWT)
   * @returns Dados do usuário/admin atualizado com o livro favoritado
   */
  async addFavoriteBook(bookId: string, userEmail: string) {
    // Valida se o ID é um ObjectId válido
    if (!Types.ObjectId.isValid(bookId)) {
      console.log('ID do livro inválido');
      throw new BadRequestException('ID do livro inválido');
    }

    // Verifica se o livro existe
    const book = await this.bookModel.findById(bookId);
    if (!book) {
      console.log('Livro não encontrado');
      throw new NotFoundException('Livro não encontrado');
    }

    // Busca o usuário ou admin pelo email
    const user = await this.userModel.findOne({ mail: userEmail });
    const admin = await this.adminModel.findOne({ mail: userEmail });

    // Verifica se encontrou usuário ou admin
    if (!user && !admin) {
      console.log('Usuário não encontrado');
      throw new NotFoundException('Usuário não encontrado');
    }

    // Determina qual entidade usar (user ou admin)
    const entity = user || admin;
    const isAdmin = !!admin;

    // Verifica se o livro já está nos favoritos
    const isAlreadyFavorite = entity.favorites.some(
      (favoriteId) => favoriteId.toString() === bookId,
    );

    if (isAlreadyFavorite) {
      console.log('Este livro já está nos favoritos');
      throw new ConflictException('Este livro já está nos seus favoritos');
    }

    // Adiciona o livro aos favoritos
    entity.favorites.push(new Types.ObjectId(bookId) as any);
    await entity.save();

    // Retorna o usuário/admin atualizado com os favoritos populados
    const model = isAdmin ? this.adminModel : this.userModel;
    const entityAtualizada = await model
      .findById(entity._id)
      .populate({
        path: 'favorites',
        model: 'Book',
        select: 'title author category description book.cover'
      })
      .select('-password')
      .lean()
      .exec();

    // Verifica se favorites existe e é um array antes de mapear
    if (!entityAtualizada || !Array.isArray(entityAtualizada.favorites)) {
      throw new Error('Erro ao buscar favoritos atualizados');
    }

    // Formata os favoritos com os dados necessários: título, capa, autor, categoria e descrição
    const favoritosFormatados = entityAtualizada.favorites.map((livro: any) => {
      // Log para debug
      console.log('Dados do livro:', JSON.stringify(livro, null, 2));

      // Verifica se o livro existe
      if (!livro) {
        console.warn('Livro não encontrado');
        return null;
      }

      // Verifica se tem a capa
      const coverUrl = livro.book?.cover?.storagePath 
        ? this.gerarUrlCapa(livro.book.cover.storagePath)
        : null;

      return {
        _id: livro._id,
        title: livro.title || 'Título não disponível',
        author: livro.author || 'Autor desconhecido',
        category: livro.category || 'Categoria não definida',
        description: livro.description || 'Descrição não disponível',
        coverUrl: coverUrl,
      };
    });

    return {
      favorites: favoritosFormatados,
    };
  }
}