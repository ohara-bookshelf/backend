export type Meta = {
  total: number;
  currentPage: number;
  take: number;
  totalPages: number;
};

export enum Expression {
  ANGRY = 'angry',
  DISGUST = 'disgust',
  FEAR = 'fear',
  HAPPY = 'happy',
  SAD = 'sad',
  SURPRISE = 'surprise',
  NEUTRAL = 'neutral',
}

export type EmotionResponse = { data: { emotion: string } };
export type RecommendedResponse = { data: { books: string[] } };
