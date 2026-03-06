import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/util/Role";
import { GetUser } from "src/auth/get-user.decorator";
import { UserDocument } from "src/user/entities/User.schema";
import { AdminDocument } from "src/admin/entities/Admin.schema";
import { ListFavoriteBookService } from "../service/listFavoriteBook.service";
import { PaginationDto } from "../../../common/dtos/pagination.dto";

@Controller('book')
@ApiTags('Books')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ListFavoriteBookController {
    constructor(private readonly listFavoriteBookService: ListFavoriteBookService) { }

    @Get("favorite/list")
    @Roles(Role.USER, Role.SYSADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Listar livros favoritos do usuário autenticado (paginado)' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página (>=1)', example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página (1-100)', example: 10 })
    async listFavoriteBook(
        @GetUser() user: UserDocument | AdminDocument,
        @Query() pagination: PaginationDto,
    ) {
        const userEmail = user.mail;
        return this.listFavoriteBookService.listFavoriteBook(userEmail, pagination);
    }
}