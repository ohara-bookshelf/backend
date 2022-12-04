import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookshelvesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.bookshelf.findMany({
      where: { visible: 'PUBLIC' },
      include: {
        owner: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} bookshelf`;
  }
}
