import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { GetBookService } from "../service/getBook.service";
import { Role } from "../../util/Role";
import { Roles } from "src/auth/roles.decorator";
import { ParseObjectIdPipe } from "common/pipes/parse-objectid.pipe";
import { Response } from 'express';

@Controller('book')
@ApiTags('Books')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GetBookController {
    constructor(
        private readonly getBookService: GetBookService
    ){}

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    @Roles(Role.USER, Role.SYSADMIN)
    @ApiOperation({ summary: 'Obter livro por ID', description: 'Retorna os detalhes do livro e seu arquivo em base64' })
    @ApiParam({ name: 'id', description: 'ID do livro', type: String })
    @ApiResponse({ 
        status: 200, 
        description: 'Livro encontrado e retornado com sucesso',
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'Título do livro' },
                author: { type: 'string', description: 'Autor do livro' },
                contentType: { type: 'string', description: 'Tipo do arquivo (application/pdf ou application/epub)' },
                file: { type: 'base64', description: 'Arquivo do livro em base64' }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Livro não encontrado ou ID inválido' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async getBookById(
        @Param("id", ParseObjectIdPipe) id: string
    ) {
        const book = await this.getBookService.findById(id);
        
        return {
            title: book.title,
            author: book.author,
            contentType: book.contentType,
            file: book.bookFile.toString('base64')
        };
    }
}