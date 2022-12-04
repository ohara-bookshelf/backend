import { Prisma, Visibility } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookshelfDto implements Prisma.BookshelfCreateInput {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsEnum(Visibility)
  visible: Visibility;

  @IsOptional()
  @IsString()
  owner: Prisma.UserCreateNestedOneWithoutBookshelvesInput;

  @IsOptional()
  @IsString({ each: true })
  books?: Prisma.BookshelfBookCreateNestedManyWithoutBookshelfInput & string[];
}
