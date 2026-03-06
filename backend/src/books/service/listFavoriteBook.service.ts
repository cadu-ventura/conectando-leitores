import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../user/entities/User.schema';
import { Admin, AdminDocument } from '../../admin/entities/Admin.schema';
import { Book } from '../entities/book.schema';
import { PaginationDto } from '../../../common/dtos/pagination.dto';

@Injectable()
export class ListFavoriteBookService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
        @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    ) { }

    private gerarUrlCapa(storagePath: string | null | undefined): string | null {
        if (!storagePath) return null;
        const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
        return `https://storage.googleapis.com/${bucketName}/${storagePath}`;
    }

    async listFavoriteBook(userEmail: string, pagination: PaginationDto) {
        const page = pagination.page ?? 1;
        const limit = pagination.limit ?? 10;
        const skip = (page - 1) * limit;

        // Busca o usuário ou admin pelo email (sem popular) para obter o total
        const user = await this.userModel.findOne({ mail: userEmail }).select('favorites');
        const admin = !user ? await this.adminModel.findOne({ mail: userEmail }).select('favorites') : null;

        const entity: (UserDocument | AdminDocument) | null = (user as any) || (admin as any) || null;
        const isAdmin = !!admin && !user;

        if (!entity) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const total = Array.isArray(entity.favorites) ? entity.favorites.length : 0;

        // Busca com populate paginado
        const model = isAdmin ? this.adminModel : this.userModel;
        const populated = await model
            .findById((entity as any)._id)
            .populate({
                path: 'favorites',
                model: 'Book',
                select: 'title author category description book.cover',
            })
            .select('favorites')
            .lean()
            .exec();

        const favoritos = (populated?.favorites as any[]) || [];

        // Log para debug
        console.log('Dados dos livros favoritos:', JSON.stringify(favoritos, null, 2));

        const data = favoritos.map((livro: any) => {
            if (!livro) {
                console.warn('Livro não encontrado na lista de favoritos');
                return null;
            }

            return {
                _id: livro._id,
                title: livro.title || 'Título não disponível',
                author: livro.author || 'Autor desconhecido',
                category: livro.category || 'Categoria não definida',
                description: livro.description || 'Descrição não disponível',
                coverUrl: this.gerarUrlCapa(livro?.book?.cover?.storagePath || null),
            };
        }).filter(Boolean); // Remove quaisquer null da lista

        const lastPage = Math.max(1, Math.ceil(total / limit));

        return {
            data,
            meta: {
                total,
                page,
                lastPage,
                itemsPerPage: limit,
            },
            message: 'Lista de favoritos recuperada com sucesso',
        };
    }
}
