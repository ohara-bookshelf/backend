import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { GetUser } from '../users/decorator/get-user.decorator';
import { AuthService } from './auth.service';
import { AuthenticatedDto } from './dto/req-user.dto';
import { GoogleClientGuard, JwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleClientGuard)
  @Post('/login')
  async login(@GetUser('id') userId: string): Promise<AuthenticatedDto> {
    return this.authService.login(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  getUser(@Req() req: Request) {
    return req.user;
  }
}
