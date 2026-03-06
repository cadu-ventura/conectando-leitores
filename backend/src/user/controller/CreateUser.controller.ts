import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CreateUserService } from "../service/CreateUser.service";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ResponseMessagesOk } from "common/messages/ReponseMessages";
import { CreateUserDto } from "../dtos/user-create.dto"
import { LoginRegisterRequestMessagesError } from "../../messages/register.request.messages";
import { LoginRegisterDescriptionSwagger } from "../../messages/register.swagger.messages";

@ApiTags('User')
@Controller('user')
export class CreateUserController {
    constructor(
        private readonly createUser: CreateUserService,
    ) { }

    @HttpCode(HttpStatus.CREATED)
    @Post("register")
    @ApiCreatedResponse({
        description: ResponseMessagesOk.REGISTER_DATA_CREATE
    })
    @ApiBadRequestResponse({
        description: 'Dados inválidos informados - verifique o formato dos dados enviados'
    })
    @ApiConflictResponse({
        description: LoginRegisterRequestMessagesError.REGISTER_EXIST_EMAIL_ACCOUNT
    })
    @ApiOperation({
        description: LoginRegisterDescriptionSwagger.DESCRIPTION_CREATE_USER
    })
    async create(@Body() cadastroUserDTO: CreateUserDto) {
        return await this.createUser.registerNewUser(cadastroUserDTO);
    }

}