import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    // First run JWT auth
    const authCan = (await super.canActivate(context)) as boolean;
    if (!authCan) return false;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user || !user.roles) {
      throw new ForbiddenException('Acesso negado. Você não tem permissão para realizar esta ação.');
    }

    const hasRole = requiredRoles.some((role) => user.roles === role);
    if (!hasRole) {
      throw new ForbiddenException('Acesso negado. Você não tem permissão para realizar esta ação.');
    }

    return true;
  }
}
