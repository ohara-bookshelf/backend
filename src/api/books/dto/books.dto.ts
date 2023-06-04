import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BookQueryDto {
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
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  startYear?: number = 0;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  endYear?: number = 9999;
}

export class RecommendedBookQueryDto {
  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  count?: number;
}

export class ReviewsBookQueryDto {
  @IsNotEmpty({ message: 'isbn is required' })
  @IsString()
  bookPath: string;
}
