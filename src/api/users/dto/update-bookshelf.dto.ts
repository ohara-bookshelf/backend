import { PartialType } from '@nestjs/mapped-types';
import { Prisma, Visibility } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateBookshelfDto } from './create-bookshelf.dto';

export class UpdateBookshelfDto extends PartialType(CreateBookshelfDto) {
  @IsString()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(Visibility)
  @IsOptional()
  visible: Visibility;

  @IsOptional()
  @IsString()
  owner: Prisma.UserCreateNestedOneWithoutBookshelvesInput;

  @IsOptional()
  @IsString({ each: true })
  books?: Prisma.BookshelfBookCreateNestedManyWithoutBookshelfInput & string[];
}
