import { BookReview, Expression } from 'src/common/type';

export type EmotionResponse = { emotion: Expression };
export type RecommendedResponse = { books: string[] };
export type BookReviewResponse = { reviews: BookReview[]; rating: number };
