import { Bookshelf, Forkedshelf, User } from '@prisma/client';

export interface UserDetail extends User {
  totalForks: number;
  bookshelves: {
    public: Bookshelf[];
    private: Bookshelf[];
  };
  forkedshelves: Forkedshelf[];
}
