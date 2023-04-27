export type BookQueryDto = {
  title?: string;
  author?: string;
  publisher?: string;
  startYear?: number;
  endYear?: number;
  take?: number;
};

export type RecommendedBookQueryDto = {
  title: string;
  count: number;
};
