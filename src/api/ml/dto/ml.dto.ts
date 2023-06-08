import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { isValidBase64Image } from 'src/common/lib/validator';
import { Expression } from 'src/common/type';

export class DetectExpressionDto {
  @IsString()
  @Validate((value: string) => isValidBase64Image(value), {
    message: 'Invalid base64 encoded image',
  })
  imageString64: string;
}

export class ExpressionBasedDto {
  @IsString()
  @IsEnum(Expression, { message: 'Invalid expression' })
  @Transform(({ value }) => value.toLocaleLowerCase())
  expression: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 10))
  count?: number;
}

export class HybridRecommentationDto {
  @IsString()
  isbn: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  count: number;
}

export class ExpressionRecommentationDto extends DetectExpressionDto {
  @IsString()
  @Validate((value: string) => isValidBase64Image(value), {
    message: 'Invalid base64 encoded image',
  })
  imageString64: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 10))
  count?: number;
}
