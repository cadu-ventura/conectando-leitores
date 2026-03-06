import { Body, Controller, Post, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthLoginDto } from '../dtos/auth-login.dto';
import { ApiOperation, ApiTags, ApiBody, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class LoginController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Login com email e senha' })
  @ApiBody({ type: AuthLoginDto })
  @ApiOkResponse({ description: 'Login realizado, retorna token JWT' })
  @ApiUnauthorizedResponse({ description: 'E-mail e/ou senha inválidos' })
  async login(@Body() data: AuthLoginDto) {
    const user = await this.authService.validateUser(data.mail, data.password);
    console.log("user encontrado na validação >>>>>> " + user);

    const admin = await this.authService.validateAdmin(data.mail, data.password);
    console.log("admin encontrado na validação >>>>>> " + admin);
    
    if (admin) {
      return this.authService.login(admin);
    }

    if(user) {
      return this.authService.login(user);
    }

    if (!user && !admin) {
      throw new UnauthorizedException('E-mail e/ou senha inválidos');
    }
    return this.authService.login(user)
  }
}
