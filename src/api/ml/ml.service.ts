import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { HybridRecommentationDto } from './dto/hybrid.dto';
import { MLException } from 'src/exceptions/ml.exception';
import { EmotionResponse, RecommendedResponse } from './types/ml.types';
import { DetectExpressionDto, ExpressionBasedDto } from './dto/expression.dto';

@Injectable()
export class MlService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async getHybridRecommendation(
    hybridRecommentationDto: HybridRecommentationDto,
  ): Promise<RecommendedResponse> {
    const { isbn, count } = hybridRecommentationDto;

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.ML_API_URL}/hybrid-recommendation`, {
          ISBN: {
            text: isbn,
          },
          NUMBER: {
            count: count,
          },
        })
        .pipe(
          catchError(() => {
            throw new MLException('Error while getting hybrid recommendation');
          }),
        ),
    );

    return data;
  }

  async detectExpression(
    detectExpressionDto: DetectExpressionDto,
  ): Promise<EmotionResponse> {
    const { imageString64 } = detectExpressionDto;

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.EXPRESSION_API_URL}/process_image`, {
          image: imageString64,
        })
        .pipe(
          catchError(() => {
            throw new MLException('Error when detecting expression');
          }),
        ),
    );
    return data;
  }

  async getExpressionBasedRecommendation(
    expressionBasedDto: ExpressionBasedDto,
  ): Promise<RecommendedResponse> {
    const { expression } = expressionBasedDto;

    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.EMOTION_API_URL}/emotion-based-recommend`, {
          emotion: {
            text: expression,
          },
          count: {
            count: 10,
          },
        })
        .pipe(
          catchError(() => {
            throw new MLException(
              'Error get recommendation based on expression',
            );
          }),
        ),
    );

    return data;
  }
}
