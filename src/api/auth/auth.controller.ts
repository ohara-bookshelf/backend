import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  test() {
    return this.authService.test();
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req) {
    return this.authService.googleAuth(req);
  }
}
