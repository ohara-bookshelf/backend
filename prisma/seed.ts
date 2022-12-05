import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding books... 🌱');
  await prisma.$queryRaw`COPY public."Book" FROM '/seeds/books.bin'`;
  console.log('Seed books done! 🌱 \n');

  console.log('Start seeding users... 🌱');
  await prisma.$queryRaw`COPY public."User" FROM '/seeds/users.bin'`;
  console.log('Seed users done! 🌱 \n');

  console.log('Start seeding bookshelves... 🌱');
  await prisma.$queryRaw`COPY public."Bookshelf" FROM '/seeds/bookshelves.bin'`;
  console.log('Seed bookshelves done! 🌱 \n');

  console.log('Start seeding bookshelfbooks... 🌱');
  await prisma.$queryRaw`COPY public."BookshelfBook" FROM '/seeds/bookshelfbooks.bin'`;
  console.log('Seed bookshelfbooks done! 🌱 \n');

  console.log('Start seeding forkedshelves... 🌱');
  await prisma.$queryRaw`COPY public."Forkedshelf" FROM '/seeds/forkedshelves.bin'`;
  console.log('Seed forkedshelves done! 🌱 \n');
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
