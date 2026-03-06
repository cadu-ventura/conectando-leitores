import { ApiTags, ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse, ApiBearerAuth, ApiForbiddenResponse, ApiBadRequestResponse, ApiQuery } from "@nestjs/swagger";
import { Controller, Get, HttpCode, HttpStatus, UseGuards, Query, BadRequestException } from "@nestjs/common";
import { ListAllUsersService } from "../service/ListAllUser.service";
import { Roles } from "../../auth/roles.decorator";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { PaginationDto } from "common/dtos/pagination.dto";
import { Role } from "../../util/Role";

@ApiTags('User')
@ApiBearerAuth('JWT-auth')
@Controller('user')
export class ListAllUsersController {
    constructor(
        private readonly listAllUsersService: ListAllUsersService,
    ) { }

    @HttpCode(HttpStatus.OK)
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SYSADMIN)
    @ApiOperation({
        summary: 'Listar usuários com paginação',
        description: 'Retorna uma lista paginada dos usuários cadastrados no sistema para o administrador.'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Número da página (começa em 1)',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Quantidade de itens por página (máximo 100)',
    })
    @ApiOkResponse({
        description: 'Lista de usuários retornada com sucesso',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                example: 'uuid-here'
                            },
                            name: {
                                type: 'string',
                                example: 'João Silva'
                            },
                            email: {
                                type: 'string',
                                example: 'joao@email.com'
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                                example: '2024-01-01T00:00:00.000Z'
                            },
                            updatedAt: {
                                type: 'string',
                                format: 'date-time',
                                example: '2024-01-01T00:00:00.000Z'
                            }
                        }
                    }
                },
                meta: {
                    type: 'object',
                    properties: {
                        total: {
                            type: 'number',
                            example: 50,
                            description: 'Total de registros'
                        },
                        page: {
                            type: 'number',
                            example: 1,
                            description: 'Página atual'
                        },
                        lastPage: {
                            type: 'number',
                            example: 5,
                            description: 'Última página'
                        },
                        itemsPerPage: {
                            type: 'number',
                            example: 10,
                            description: 'Itens por página'
                        }
                    }
                },
                message: {
                    type: 'string',
                    example: 'Usuários listados com sucesso'
                }
            }
        }
    })
    @ApiBadRequestResponse({
        description: 'Parâmetros de paginação inválidos',
        schema: {
            type: 'object',
            properties: {
                statusCode: {
                    type: 'number',
                    example: 400
                },
                message: {
                    type: 'string',
                    example: 'O limite deve ser maior ou igual a 1'
                },
                error: {
                    type: 'string',
                    example: 'Bad Request'
                }
            }
        }
    })
    @ApiInternalServerErrorResponse({
        description: 'Erro interno do servidor',
        schema: {
            type: 'object',
            properties: {
                statusCode: {
                    type: 'number',
                    example: 500
                },
                message: {
                    type: 'string',
                    example: 'Erro interno do servidor'
                },
                error: {
                    type: 'string',
                    example: 'Internal Server Error'
                }
            }
        }
    })
    @ApiForbiddenResponse({
        description: 'Acesso negado',
        schema: {
            type: 'object',
            properties: {
                statusCode: {
                    type: 'number',
                    example: 403
                },
                message: {
                    type: 'string',
                    example: 'Acesso negado'
                },
                error: {
                    type: 'string',
                    example: 'Forbidden'
                }
            }
        }
    })
    async listAllUsers(@Query() paginationDto: PaginationDto) {
        try {
            const { page = 1, limit = 10 } = paginationDto;
            
            if (isNaN(page) || isNaN(limit)) {
                throw new BadRequestException('Parâmetros de paginação devem ser números');
            }

            return await this.listAllUsersService.listAllUsers(page, limit);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Erro ao processar a paginação: ' + error.message);
        }
    }
}