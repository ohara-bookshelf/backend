import { PartialType } from '@nestjs/mapped-types';
import { CreateBookshelfDto } from './create-bookshelf.dto';

export class UpdateBookshelfDto extends PartialType(CreateBookshelfDto) {}
