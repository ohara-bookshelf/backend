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

export type BookReview = {
  user: string;
  text: string;
  rating: string;
  positivity: number;
  negativity: number;
  neutrality: number;
  compound: number;
  label: 'POSITIVE' | 'NEGATIVE';
};

export type EmotionResponse = { data: { emotion: string } };
export type RecommendedResponse = { data: { books: string[] } };
