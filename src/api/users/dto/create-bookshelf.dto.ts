import { Prisma, Visibility } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookshelfDto implements Prisma.BookshelfCreateInput {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsEnum(Visibility)
  visible: Visibility;

  // @IsNotEmpty()
  createdBy: Prisma.UserCreateNestedOneWithoutBookshelvesInput;
}
