import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  getUserStatus(req: Request) {
    if (req.user) {
      return { msg: 'Authenticated', user: req.user };
    } else {
      return { msg: 'Not Authenticated', user: null };
    }
  }

  async validateUser(
    validateUserDto: ValidateUserDto,
  ): Promise<ValidateUserDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: validateUserDto.email },
    });

    if (user) {
      // * Watch if user profile is changed
      if (user.profileImgUrl !== validateUserDto.profileImgUrl) {
        return await this.prisma.user.update({
          where: { email: validateUserDto.email },
          data: {
            profileImgUrl: validateUserDto.profileImgUrl,
          },
        });
      }

      return user;
    }

    return await this.prisma.user.create({
      data: validateUserDto,
    });
  }

  async login(user: any) {
    const payload = { user };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
