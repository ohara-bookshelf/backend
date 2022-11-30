import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

import { PrismaService } from '../../prisma/prisma.service';
import { ReqUserDto } from './dto/req-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(
    userId: string,
  ): Promise<{ user: ReqUserDto; access_token: string }> {
    const payload = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return {
      user: payload,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateGoogleToken(token: string): Promise<ReqUserDto> {
    const client = new OAuth2Client(process.env.GAUTH_CLIENT_ID);

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GAUTH_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      // Check if user exists in database
      const existingUser = await this.prisma.user.findUnique({
        where: {
          sub: payload.sub,
        },
      });

      // If user exists update user info
      // If user does not exist create user
      if (existingUser) {
        return await this.prisma.user.update({
          where: {
            sub: payload.sub,
          },
          data: {
            firstName: payload.given_name,
            lastName: payload.family_name,
            profileImgUrl: payload.profile,
          },
        });
      } else {
        return await this.prisma.user.create({
          data: {
            sub: payload.sub,
            firstName: payload.given_name,
            lastName: payload.family_name,
            profileImgUrl: payload.profile,
          },
        });
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
