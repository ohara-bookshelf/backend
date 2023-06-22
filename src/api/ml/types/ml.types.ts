import { Expression } from '@prisma/client';
import { BookReview } from 'src/common/type';

export type EmotionResponse = { emotion: Expression };
export type RecommendedResponse = { books: string[]; genres: string[] };
export type BookReviewResponse = { reviews: BookReview[]; rating: number };
export type SENTIMENT =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'disgust'
  | 'fear'
  | 'surprised';
