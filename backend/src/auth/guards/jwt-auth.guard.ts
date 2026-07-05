// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('🔥 JWT AUTH GUARD CALLED');
    console.log('🔥 Authorization Header:', request.headers.authorization);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any){
    console.log('🔥 JWT AUTH GUARD HANDLE REQUEST');
    console.log('🔥 Error:', err);
    console.log('🔥 User:', user);
    console.log('🔥 Info:', info);
    
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}