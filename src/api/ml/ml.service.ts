import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { MLException } from 'src/exceptions/ml.exception';
import {
  BookReviewResponse,
  EmotionResponse,
  RecommendedResponse,
} from './types/ml.types';
import {
  DetectExpressionDto,
  ExpressionBasedDto,
  HybridRecommentationDto,
} from './dto/ml.dto';
import { Book, Bookshelf } from '@prisma/client';
import { AxiosResponse } from 'axios';
import { BookReview } from 'src/common/type';

@Injectable()
export class MlService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async getHybridBooks({
    isbn,
    count = 10,
  }: HybridRecommentationDto): Promise<RecommendedResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.ML_API_URL}/hybrid-recommendation`, {
          ISBN: {
            text: isbn,
          },
          NUMBER: {
            count,
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

  async getHybridBookRecommendations({
    isbn,
    count = 10,
  }: HybridRecommentationDto): Promise<Book[]> {
    const { books: isbnList } = await this.getHybridBooks({ isbn, count });

    const books = await this.prisma.book.findMany({
      where: {
        isbn: {
          in: isbnList,
        },
      },
      take: count,
    });

    return books;
  }

  async getHybridBookshelfRecommendations({
    isbn,
    count = 10,
  }: HybridRecommentationDto): Promise<Bookshelf[]> {
    const { books: isbnList } = await this.getHybridBooks({
      isbn,
      count,
    });

    return this.prisma.bookshelf.findMany({
      where: {
        visible: 'PUBLIC',
        books: {
          some: {
            book: {
              isbn: {
                in: isbnList,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: count,
      include: {
        owner: true,
        _count: {
          select: {
            userForks: true,
            books: true,
          },
        },
      },
    });
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

  async getExpressionBasedRecommendation({
    expression,
    count = 10,
  }: ExpressionBasedDto): Promise<RecommendedResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.EMOTION_API_URL}/emotion-based-recommend`, {
          emotion: {
            text: expression,
          },
          count: {
            count,
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

    const { data: genres } = await firstValueFrom(
      this.httpService
        .post(`${process.env.EMOTION_API_URL}/top_genres`, {
          emotion: {
            text: expression,
          },
          count: {
            count,
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

    return {
      books: data.books,
      genres: genres.genres,
    };
  }

  async getBookReviews(book_path: string): Promise<BookReviewResponse> {
    const res: AxiosResponse<{
      reviews: BookReview[];
    }> = await firstValueFrom(
      this.httpService
        .post(`${process.env.REVIEW_API_URL}/book-reviews`, {
          text: book_path,
        })
        .pipe(
          catchError(() => {
            throw new MLException('Cannot get book reviews from goodreads api');
          }),
        ),
    );

    if (!res.data) {
      throw new MLException('Cannot get book reviews from goodreads api');
    }

    const reviews = res.data.reviews.sort((a, b) => b.compound - a.compound);
    const rating: number =
      reviews.reduce((acc, cur) => acc + Number(cur.rating), 0) /
      reviews.length;

    return { reviews, rating };
  }
}
