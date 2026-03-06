import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { ParseObjectIdPipe } from "../../../common/pipes/parse-objectid.pipe";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "../../util/Role";
import { Roles } from "../../auth/roles.decorator";
import { AdminDocument } from "../../admin/entities/Admin.schema";
import { UserDocument } from "../../user/entities/User.schema";
import { GetUser } from "../../auth/get-user.decorator";
import { DeleteFavoriteBookService } from "../service/deleteFavoriteBook.service";

@Controller('book')
@ApiTags('Books')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeleteFavoriteBookController {
    constructor(
        private readonly deleteFavoriteBookService: DeleteFavoriteBookService
    ){}

    @Delete('favorite/:id')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.USER, Role.SYSADMIN)
    @ApiOperation({
        summary: 'Remover livro dos favoritos',
        description: 'Remove um livro da lista de favoritos do usuário autenticado. Usuários comuns só podem remover seus próprios favoritos, enquanto SYSADMIN pode remover qualquer favorito.'
    })
    @ApiParam({
        name: 'id',
        description: 'ID do livro a ser removido dos favoritos (MongoDB ObjectId)',
        type: String,
        example: '507f1f77bcf86cd799439011'
    })
    @ApiResponse({ 
        status: 200,
        description: 'Livro removido dos favoritos com sucesso',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Favorito deletado com sucesso'
                },
                statusCode: {
                    type: 'number',
                    example: 200
                }
            }
        }
    })
    @ApiResponse({ 
        status: 404,
        description: 'Não encontrado - Livro não está nos favoritos ou não existe',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Livro não encontrado nos favoritos'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    @ApiResponse({ 
        status: 500,
        description: 'Não autorizado - Token JWT ausente ou inválido',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Não autorizado'
                },
                statusCode: {
                    type: 'number',
                    example: 500
                }
            }
        }
    })
    async deleteFavoriteBook(
        @Param('id', new ParseObjectIdPipe()) favoriteId: string,
        @GetUser() user: UserDocument | AdminDocument
    ): Promise<{ message: string, statusCode: number }> {
        await this.deleteFavoriteBookService.deleteFavoriteBook(user.id, favoriteId);
        return {
            message: 'Favorito deletado com sucesso',
            statusCode: HttpStatus.OK
        };
    }
}