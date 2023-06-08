import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export type UsersBookshelfQueryDto = {
  visible: 'PUBLIC' | 'PRIVATE';
};

export class UserQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  take?: number = 10;

  @IsOptional()
  @IsString()
  firstName?: string;
}
