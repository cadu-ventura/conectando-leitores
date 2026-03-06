import { Controller, Get, Post,HttpCode, HttpStatus, UnauthorizedException,UseGuards,Req, InternalServerErrorException, BadRequestException} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiInternalServerErrorResponse} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from '../service/auth.service';
import { Roles } from '../roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ValidateTokenService } from '../service/validateToken.service';
import { Role } from '../../util/Role';

interface ApiResponse<T = any> {
  message: string;
  data?: T;
  success: boolean;
}


interface TokenValidationResponse {
  tokenValid: boolean;
  expiresAt?: Date;
}

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth('JWT-auth')
export class ValidadeController {
  constructor(
    private readonly authService: AuthService,
    private readonly validateTokenService: ValidateTokenService,
  ) {}

  
  @Get('validateToken')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SYSADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Validar token JWT',
    description: 'Verifica se o token JWT fornecido é válido e não foi invalidado. Requer autenticação via Bearer token.' 
  })
  @ApiOkResponse({ 
    description: 'Token válido',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Token válido'
        },
        data: {
          type: 'object',
          properties: {
            tokenValid: {
              type: 'boolean',
              example: true
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-12-31T23:59:59Z'
            }
          }
        },
        success: {
          type: 'boolean',
          example: true
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token não fornecido, inválido ou expirado',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Token inválido' },
        success: { type: 'boolean', example: false }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor'
  })
  async validateToken(@Req() request: Request): Promise<ApiResponse<TokenValidationResponse>> {
    try {
      const token = this.extractTokenFromRequest(request);
      
      if (await this.authService.isTokenBlacklisted(token)) {
        throw new UnauthorizedException('Token foi invalidado');
      }

      const tokenInfo = await this.validateTokenService.getTokenInfo(token);
      
      return {
        message: 'Token válido',
        data: {
          tokenValid: true,
          expiresAt: tokenInfo?.expiresAt
        },
        success: true
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Falha na validação do token');
    }
  }

  private extractTokenFromRequest(request: Request): string {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Token de autorização não fornecido');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Formato de token inválido. Use: Bearer <token>');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    
    if (!token) {
      throw new UnauthorizedException('Token vazio');
    }

    return token;
  }
}