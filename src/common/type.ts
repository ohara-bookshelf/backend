export type Meta = {
  total: number;
  currentPage: number;
  take: number;
  totalPages: number;
};

export type EmotionResponse = { data: { emotion: string } };
export type RecommendedResponse = { data: { books: string[] } };
