export type BookQueryDto = {
  title?: string;
  author?: string;
  publisher?: string;
  startYear?: number;
  endYear?: number;
};

export type RecommendedBookQueryDto = {
  title: string;
  count: number;
};
