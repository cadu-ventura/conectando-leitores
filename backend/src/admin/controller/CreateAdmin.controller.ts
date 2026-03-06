import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateAdminService } from "../service/CreateAdmin.service";
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ResponseMessagesOk } from "common/messages/ReponseMessages";
import { CreateAdminDto } from "../dtos/admin-create.dto"
import { LoginRegisterRequestMessagesError } from "../../messages/register.request.messages";
import { LoginRegisterDescriptionSwagger } from "../../messages/register.swagger.messages";
import { Roles } from "../../auth/roles.decorator";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Role } from "../../util/Role";

@ApiTags('Admin')
@Controller('admin')
@ApiBearerAuth('JWT-auth')
export class CreateAdminController {
    constructor(
        private readonly createAdmin: CreateAdminService,
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SYSADMIN)
    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    @ApiBadRequestResponse({
        description: 'Dados inválidos - Data deve estar no formato dd/mm/yyyy com apenas números'
    })
    @ApiCreatedResponse({ description: ResponseMessagesOk.REGISTER_DATA_CREATE })
    @ApiConflictResponse({ description: LoginRegisterRequestMessagesError.REGISTER_EXIST_EMAIL_ACCOUNT })
    @ApiOperation({ description: LoginRegisterDescriptionSwagger.DESCRIPTION_CREATE_USER })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno do servidor - Token JWT não foi enviado no header Authorization'
    })
    async create(@Body() cadastroAdminDTO: CreateAdminDto) {
        return await this.createAdmin.registerNewAdmin(cadastroAdminDTO);
    }

}