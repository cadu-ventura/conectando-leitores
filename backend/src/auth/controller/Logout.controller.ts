import { Controller, Post, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiOperation, ApiTags, ApiOkResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { Roles } from '../roles.decorator';
import { UseGuards, Req } from '@nestjs/common'
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Role } from '../../util/Role';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth('JWT-auth')
export class LogoutController {
  constructor(private readonly authService: AuthService) {}

  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER, Role.SYSADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Logout do usuário',
    description: 'Realiza o logout do usuário invalidando o token JWT. É necessário enviar o token JWT no header Authorization.' 
  })
  @ApiOkResponse({ 
    description: 'Logout realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Logout realizado com sucesso'
        },
        tokenInvalidated: {
          type: 'boolean',
          example: true
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token não fornecido ou inválido'
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro interno do servidor - Token JWT não foi enviado no header Authorization'
  })
  async logout(@Req() req: any) {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }
    
    await this.authService.logout(token);
    return { message: 'Logout realizado com sucesso', tokenInvalidated: true };
  }
}
