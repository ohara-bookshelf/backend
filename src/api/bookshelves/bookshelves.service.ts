import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CreateBookshelfDto } from './dto/create-bookshelf.dto';
import { UpdateBookshelfDto } from './dto/update-bookshelf.dto';

@Injectable()
export class BookshelvesService {
  create(createBookshelfDto: CreateBookshelfDto, req: Request) {
    return req.user;
  }

  findAll() {
    return `This action returns all bookshelves`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bookshelf`;
  }

  update(id: number, updateBookshelfDto: UpdateBookshelfDto) {
    return `This action updates a #${id} bookshelf`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookshelf`;
  }
}
