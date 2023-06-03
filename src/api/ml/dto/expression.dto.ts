import { Transform } from 'class-transformer';
import { IsEnum, IsString, Validate } from 'class-validator';
import { Expression } from 'src/common/type';

const isValidBase64Image = (value: string): boolean => {
  const pattern = /^data:image\/[a-z]+;base64,/i;
  return pattern.test(value);
};

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
}
