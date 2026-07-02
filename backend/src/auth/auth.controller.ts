import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } }) // Max 5 login attempts per minute per IP
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const result = await this.authService.login(loginDto);

    // Log successful login audit (non-blocking)
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Fire-and-forget audit log
    this.authService.logLogin(result.user.id, result.user.email, ipAddress, userAgent).catch(err => {
      console.error('Failed to log login audit:', err);
    });

    return result;
  }
}
