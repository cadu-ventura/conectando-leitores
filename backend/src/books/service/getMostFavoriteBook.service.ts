import { Injectable } from "@nestjs/common";
import { Model, Types } from "mongoose";
import { Admin, AdminDocument } from "../../admin/entities/Admin.schema";
import { User, UserDocument } from "../../user/entities/User.schema";
import { Book } from "../entities/book.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class GetMostFavoriteBookService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
        @InjectModel(Book.name) private readonly bookModel: Model<Book>,
    ) { }

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
    * Busca os livros mais favoritados
    * @param limit - Número máximo de livros a retornar (padrão: 10)
    * @returns Lista de livros ordenados por número de favoritos (decrescente)
    */
    async getMostFavoritedBooks(limit: number = 10) {
        try {
            // Agrega dados de User e Admin para contar favoritos
            const [userFavorites, adminFavorites] = await Promise.all([
                this.userModel.aggregate([
                    { $unwind: '$favorites' },
                    { $group: { _id: '$favorites', count: { $sum: 1 } } },
                ]),
                this.adminModel.aggregate([
                    { $unwind: '$favorites' },
                    { $group: { _id: '$favorites', count: { $sum: 1 } } },
                ]),
            ]);

            // Combina as contagens de User e Admin
            const favoriteCounts = new Map<string, number>();

            [...userFavorites, ...adminFavorites].forEach((item) => {
                const bookId = item._id.toString();
                const currentCount = favoriteCounts.get(bookId) || 0;
                favoriteCounts.set(bookId, currentCount + item.count);
            });

            // Ordena por contagem (decrescente) e pega os top N
            const topBookIds = Array.from(favoriteCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, limit)
                .map(([bookId]) => new Types.ObjectId(bookId));

            // Se não houver livros favoritados, retorna array vazio
            if (topBookIds.length === 0) {
                return [];
            }

            // Busca os dados completos dos livros
            const books = await this.bookModel
                .find({ _id: { $in: topBookIds } })
                .select('title author category description book.cover')
                .lean()
                .exec();

            // Mapeia os livros com suas contagens e URL da capa
            const booksWithFavoriteCount = books
                .map((book: any) => {
                    const bookId = book._id.toString();
                    const favoriteCount = favoriteCounts.get(bookId) || 0;

                    return {
                        _id: book._id,
                        title: book.title,
                        author: book.author,
                        category: book.category,
                        coverUrl: book.book?.cover?.storagePath
                            ? this.gerarUrlCapa(book.book.cover.storagePath)
                            : null,
                        favoriteCount,
                        description : book.description
                    };
                })
                // Reordena baseado na contagem (pois o find não mantém a ordem)
                .sort((a, b) => b.favoriteCount - a.favoriteCount);

            return booksWithFavoriteCount;
        } catch (error) {
            console.error('Erro ao buscar livros mais favoritados:', error);
            throw error;
        }
    }
}