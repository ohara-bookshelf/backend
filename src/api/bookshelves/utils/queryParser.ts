import { BookshelfQueryDto } from '../dto/bookshelves.dto';

type BookshelfInclude = {
  owner: boolean;
  userForks: boolean;
  books: boolean | { select: { book: boolean } };
  _count: boolean | { select: { userForks: boolean; books: boolean } };
};

function parseBookshelfQueryString(queryString: BookshelfQueryDto) {
  const { take = 100, books, owner, userForks, _count } = queryString;

  const include: BookshelfInclude = {
    owner: false,
    userForks: false,
    _count: false,
    books: false,
  };

  if (books === true) {
    include.books = {
      select: {
        book: true,
      },
    };
  }

  if (owner === true) {
    include.owner = true;
  }

  if (userForks === true) {
    include.userForks = true;
  }

  if (_count === true) {
    include._count = {
      select: {
        userForks: true,
        books: true,
      },
    };
  }

  return {
    take,
    include,
  };
}

export { parseBookshelfQueryString };
