import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(token: string): Promise<any> {
    const user = {
      userId: 1,
      token,
    };
    console.log('user', user);
    return user;
  }

  async validateGoogleToken(token: string): Promise<any> {
    const client = new OAuth2Client(process.env.GAUTH_CLIENT_ID);

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GAUTH_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      return payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
