// src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ✅ ADD THIS

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) { // ✅ INJECT ConfigService
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // ✅ USE ConfigService to get the exact same secret
      secretOrKey: configService.get<string>('JWT_SECRET') || 'super_secret_key_change_me',
    });
  }

  async validate(payload: any) {
    // This object will be attached to req.user in protected routes
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}