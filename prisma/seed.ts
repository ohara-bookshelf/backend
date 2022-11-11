import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding book... 🌱');

  await prisma.$queryRaw`COPY public."Book" FROM './seeds/books'`;

  console.log('Seed book done! 🌱');
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
