import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CustomGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(CustomGuard)
  @Post('/login')
  async login(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(CustomGuard)
  @Get('user')
  getUser(@Req() req: Request) {
    return req.user;
  }
}
