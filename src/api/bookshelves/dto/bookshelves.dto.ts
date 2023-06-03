import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { isValidBase64Image } from 'src/common/lib/validator';

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
  @IsString()
  @Validate((value: string) => isValidBase64Image(value), {
    message: 'Invalid base64 encoded image',
  })
  imageString64: string;

  @IsOptional()
  @IsNumber()
  count?: number = 10;
}
