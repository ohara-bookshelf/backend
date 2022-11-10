import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type BookCreateManyInput = {
  id?: string;
  isbn: string;
  title: string;
  author: string;
  year_of_publication: number;
  publisher: string;
  image_url_s?: string | null;
  image_url_m?: string | null;
  image_url_l?: string | null;
};

const csvImportHander = (): Promise<BookCreateManyInput[]> => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve('assets', 'books.csv'))
      .on('error', (error) => {
        reject(error);
      })
      .pipe(
        csv({
          separator: ';',
          escape: '\\',
          quote: '"',
        }),
      )
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        results.map((res) =>
          Object.keys(res).map((key) => {
            res[key] = res[key] || null;
          }),
        );
        resolve(results);
      });
  });
};

async function main() {
  const books = await csvImportHander();

  for (const book of books) {
    await prisma.book.create({
      data: {
        ...book,
        year_of_publication: +book.year_of_publication,
      },
    });
  }

  const result = await prisma.book.createMany({
    data: books,
    skipDuplicates: true,
  });

  console.log(`${result.count} books created`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
