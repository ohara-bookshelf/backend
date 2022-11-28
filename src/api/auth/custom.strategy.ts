import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const token = req.headers.authorization.split(' ')[1];
    const gProfile = await this.authService.validateGoogleToken(token);

    if (!gProfile) {
      throw new UnauthorizedException(`Token is not valid`);
    }

    return gProfile;
  }
}
