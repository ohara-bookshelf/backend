import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

import { PrismaService } from '../../../prisma/prisma.service';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    return await this.prisma.cat.create({ data: createCatDto });
  }

  async findAll(): Promise<Cat[]> {
    return await this.prisma.cat.findMany();
  }

  async findOne(id: number): Promise<Cat> {
    return await this.prisma.cat.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateCatDto: UpdateCatDto): Promise<Cat> {
    return await this.prisma.cat.update({
      where: { id },
      data: updateCatDto,
    });
  }

  async remove(id: number): Promise<number> {
    const deleted = await this.prisma.cat.delete({
      where: { id },
    });

    return deleted.id;
  }
}
