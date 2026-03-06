import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

export interface TokenInfo {
  sub: string;           // User ID
  email: string;         // Email do usuário
  role: string;          // Role do usuário
  iat: number;          // Issued at (timestamp)
  exp: number;          // Expires at (timestamp)
  expiresAt: Date;      // Data de expiração formatada
  issuedAt: Date;       // Data de emissão formatada
  timeToExpire: number; // Tempo restante em segundos
  isExpired: boolean;   // Se o token está expirado
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class ValidateTokenService {
    constructor(
        private readonly jwtService: JwtService,
    ){}

    async getTokenInfo(token: string): Promise<TokenInfo> {
    try {
      // Decodifica o token sem verificar a assinatura (apenas para extrair informações)
      const decodedToken = this.jwtService.decode(token) as JwtPayload;

      if (!decodedToken) {
        throw new UnauthorizedException('Token inválido - não foi possível decodificar');
      }

      // Verifica se o token possui os campos obrigatórios
      if (!decodedToken.sub || !decodedToken.exp || !decodedToken.iat) {
        throw new UnauthorizedException('Token inválido - campos obrigatórios ausentes');
      }

      // Converte timestamps para datas
      const issuedAt = new Date(decodedToken.iat * 1000);
      const expiresAt = new Date(decodedToken.exp * 1000);
      const now = new Date();

      // Calcula tempo restante
      const timeToExpire = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
      const isExpired = now > expiresAt;

      return {
        sub: decodedToken.sub,
        email: decodedToken.email,
        role: decodedToken.role,
        iat: decodedToken.iat,
        exp: decodedToken.exp,
        expiresAt,
        issuedAt,
        timeToExpire,
        isExpired,
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException('Erro ao processar token JWT');
    }
  }
}