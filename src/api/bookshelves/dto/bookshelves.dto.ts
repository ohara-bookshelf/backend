import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class RecommendedBookshelfQueryDto {
  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  count?: number;
}

export class BookshelfQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  take?: number = 10;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  books?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  owner?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  userForks?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  _count?: boolean;
}

export class RecommendedBookshelfDto extends BookshelfQueryDto {
  @IsOptional()
  @IsNumber()
  count?: number = 10;

  @IsOptional()
  @IsNumber()
  title?: string;
}
