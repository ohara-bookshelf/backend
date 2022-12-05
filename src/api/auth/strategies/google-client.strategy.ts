import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class GoogleClientStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const user = await this.authService.validateGoogleToken(token);

    if (!user) {
      throw new UnauthorizedException(`Google access token is not valid`);
    }

    return user;
  }
}
