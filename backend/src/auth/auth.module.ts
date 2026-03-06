import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './service/auth.service';
import { UserModule } from '../user/user.module';
import { TokenBlacklistService } from './service/token-blacklist.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JWT_CONSTANTS } from './constants'
import { ValidateTokenService } from './service/validateToken.service';
import { ValidadeController } from './controller/validateToken.controller';
import { AdminModule } from '../admin/admin.module';
import { LogoutController } from './controller/Logout.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
      signOptions: { expiresIn: JWT_CONSTANTS.expiresIn || '24h' },
      global: true,
    }),
    forwardRef(() => UserModule),
    AdminModule
  ],
  providers: [
    AuthService, 
    JwtStrategy, 
    TokenBlacklistService, 
    JwtAuthGuard, 
    ValidateTokenService
  ],
  controllers: [ValidadeController, LogoutController],
  exports: [AuthService, JwtModule, JwtAuthGuard],
})
export class AuthModule {}
