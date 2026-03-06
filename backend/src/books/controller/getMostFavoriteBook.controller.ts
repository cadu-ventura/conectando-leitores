import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MostFavoritedBooksQueryDto } from "../dtos/mostFavoritedBooksQuery.dto";
import { GetMostFavoriteBookService } from "../service/getMostFavoriteBook.service";

@ApiTags('Books')
@Controller("book")
export class GetMostFavoriteBookController {
    constructor(private readonly getMostFavoriteBook: GetMostFavoriteBookService) {}

    @Get("favorite/mostFavorite")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Buscar livros mais favoritados',
        description:
            'Retorna uma lista dos livros mais favoritados na plataforma, ' +
            'ordenados por número de favoritos (do maior para o menor). ' +
            'Este endpoint é privado e requer autenticação (USER ou SYSADMIN).',
    })
    @ApiQuery({
        name: 'limit',
        description: 'Número máximo de livros a retornar',
        required: false,
        type: Number,
        example: 10,
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de livros mais favoritados retornada com sucesso',
        schema: {
            type: 'object',
            properties: {
                mensagem: {
                    type: 'string',
                    example: 'Livros mais favoritados recuperados com sucesso',
                },
                total: {
                    type: 'number',
                    example: 10,
                    description: 'Quantidade de livros retornados',
                },
                dados: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            _id: {
                                type: 'string',
                                example: '507f1f77bcf86cd799439011',
                                description: 'ID do livro',
                            },
                            title: {
                                type: 'string',
                                example: 'Dom Casmurro',
                                description: 'Título do livro',
                            },
                            author: {
                                type: 'string',
                                example: 'Machado de Assis',
                                description: 'Autor do livro',
                            },
                            category: {
                                type: 'string',
                                example: 'Romance',
                                description: 'Categoria do livro',
                            },
                            coverUrl: {
                                type: 'string',
                                example: 'https://storage.googleapis.com/seu-bucket/...',
                                description: 'URL pública da capa do livro',
                            },
                            favoriteCount: {
                                type: 'number',
                                example: 42,
                                description: 'Número de vezes que o livro foi favoritado',
                            },
                            description: {
                                type: 'string',
                                example: 'Um romance clássico da literatura brasileira...',
                                description: 'Descrição do livro',
                            }
                        },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Parâmetros inválidos',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: { type: 'string', example: 'O limite deve ser um número inteiro' },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    })
    async getMostFavorited(@Query() query: MostFavoritedBooksQueryDto) {
        const limit = query.limit || 10;

        const livros = await this.getMostFavoriteBook.getMostFavoritedBooks(limit);

        return {
            mensagem: 'Livros mais favoritados recuperados com sucesso',
            total: livros.length,
            dados: livros,
        };
    }
}