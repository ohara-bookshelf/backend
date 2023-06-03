import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class HybridRecommentationDto {
  @IsString()
  isbn: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  count: number;
}
