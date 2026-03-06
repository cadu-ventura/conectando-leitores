import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserDocument } from '../../user/entities/User.schema';
import { Role } from '../../util/Role';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Garante que o usuário está autenticado via JWT
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      // O JwtAuthGuard já lida com o lançamento de exceção 401 se não estiver autenticado
      return false;
    }

    // 2. Pega o usuário que foi validado e anexado à requisição
    const request = context.switchToHttp().getRequest();
    const user: UserDocument = request.user;

    // 3. Verifica se o usuário tem o papel (role) de SYSADMIN
    // Conforme User.schema.ts, 'roles' é uma string, não um array.
    const isAdmin = user?.roles === Role.SYSADMIN;

    if (isAdmin) {
      return true; // Permite o acesso
    }

    // 4. Se não for SYSADMIN, lança um erro de acesso proibido (403)
    throw new ForbiddenException(
      'Acesso negado. Recurso restrito a administradores.',
    );
  }
}