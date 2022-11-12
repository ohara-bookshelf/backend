import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GAUTH_CLIENT_ID,
      clientSecret: process.env.GAUTH_CLIENT_SECRET,
      callbackURL: process.env.GAUTH_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user = await this.authService.validateUser({
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      profileImgUrl: photos[0].value,
    });

    return user || null;
  }
}
