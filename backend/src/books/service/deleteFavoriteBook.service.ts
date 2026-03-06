import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../user/entities/User.schema';
import { Admin, AdminDocument } from '../../admin/entities/Admin.schema';
import { Book } from '../entities/book.schema';
import { Role } from "../../util/Role";

@Injectable()
export class DeleteFavoriteBookService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
        @InjectModel(Book.name) private readonly bookModel: Model<Book>
    ) {}

    async deleteFavoriteBook(userId: string, favoriteId: string): Promise<void> {
        // Validar IDs
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('ID do usuário inválido');
        }

        if (!Types.ObjectId.isValid(favoriteId)) {
            throw new BadRequestException('ID do livro inválido');
        }

        // Tentar encontrar o usuário primeiro
        const user = await this.userModel.findById(userId);
        const isAdmin = !user;
        
        // Se não encontrado como usuário, tentar como admin
        const entity = user || await this.adminModel.findById(userId);
        
        if (!entity) {
            throw new NotFoundException('Usuário ou administrador não encontrado');
        }

        // Verificar se o livro existe
        const book = await this.bookModel.findById(favoriteId);
        if (!book) {
            throw new NotFoundException('Livro não encontrado');
        }

        // Verificar se o livro está nos favoritos
        const favoriteExists = entity.favorites.some(favId => favId.equals(book._id));
        if (!favoriteExists) {
            throw new NotFoundException('Livro não encontrado nos favoritos');
        }

        try {
            // Remover o livro dos favoritos
            entity.favorites = entity.favorites.filter(id => !id.equals(book._id));
            
            // Salvar o documento atualizado
            await entity.save();
        } catch (error) {
            throw new BadRequestException('Erro ao remover livro dos favoritos. Por favor, tente novamente.');
        }
    }
}