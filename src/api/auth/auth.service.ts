import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  getUserStatus(req: Request) {
    console.log(req.user);

    if (req.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }

  async validateUser(
    validateUserDto: ValidateUserDto,
  ): Promise<ValidateUserDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: validateUserDto.email },
    });

    if (user) return user;

    return await this.prisma.user.create({
      data: validateUserDto,
    });
  }
}
