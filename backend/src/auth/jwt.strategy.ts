import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './service/auth.service'
import { UserQueryRepository } from '../user/repository/user-read.repository';
import { JWT_CONSTANTS } from './constants';
import { AdminQueryRepository } from '../admin/repository/admin-read.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userQuery: UserQueryRepository,
    private readonly adminQuery: AdminQueryRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANTS.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token foi invalidado');
    }

    const user = await this.userQuery.findByEmail(payload.mail);
    const admin = await this.adminQuery.findByEmail(payload.mail);

    function getId(obj: any): string {
      // Busca direta
      if (obj?._id) return obj._id;
      if (obj?.id) return obj.id;
      if (obj?.mail) return obj.mail;
      if (obj?.email) return obj.email;
      if (obj?.sub) return obj.sub;
      // Busca em _doc (caso Mongoose)
      if (obj?._doc) {
        if (obj._doc._id) return obj._doc._id;
        if (obj._doc.id) return obj._doc.id;
        if (obj._doc.mail) return obj._doc.mail;
        if (obj._doc.email) return obj._doc.email;
        if (obj._doc.sub) return obj._doc.sub;
      }
      return '';
    }

    if (admin) {
      const adminId = getId(admin);
      return {
        id: adminId,
        mail: admin.mail,
        email: admin.mail,
        sub: adminId,
        roles: admin.roles,
        isAdmin: true,
        ...admin,
      };
    }

    if (user) {
      const userId = getId(user);
      return {
        id: userId,
        mail: user.mail,
        email: user.mail,
        sub: userId,
        roles: user.roles,
        isAdmin: false,
        ...user,
      };
    }

    throw new UnauthorizedException('Usuário não encontrado');
  }
}
