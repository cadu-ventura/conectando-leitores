import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { UserQueryRepository } from '../../user/repository/user-read.repository';
import { TokenBlacklistService } from './token-blacklist.service';
import { AdminQueryRepository } from '../../admin/repository/admin-read.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersQuery: UserQueryRepository,
    private readonly adminsQuery: AdminQueryRepository,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async validateUser(mail: string, password: string) {
    const user = await this.usersQuery.findByEmail(mail);

    if (!user) return null;
    
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) return null;
    return user;
  }

  async validateAdmin(mail: string, password: string) {
    const admin = await this.adminsQuery.findByEmail(mail);
    if (!admin) return null;

    console.log("senha que veio na requisicao >>>>>>>>>>>>>   " + password);
    console.log("senha do admin que veio do banco >>>>>>>>>>>>>   " + admin.password);

    const passwordMatches = await bcrypt.compare(password, admin.password);

    console.log("ve se a senha criptografada bate com a do admin enviada >>>>>>>   " + passwordMatches);

    if (!passwordMatches) return null;
    return admin;
  }

  async login(user: any) {
    console.log("admin passado no login (from: validacao) >>>>>>" + user);
    
    const payload = { sub: user._id, mail: user.mail, roles: user.roles };

    const safeUser = {
      fullName: user.firstName + ' ' + user.lastName,
      roles: user.roles,
    };

    return {
      user: safeUser,
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(token: string): Promise<void> {
    if (token) {
      this.tokenBlacklistService.addToBlacklist(token);
    }
  }

  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklistService.isBlacklisted(token);
  }
}
