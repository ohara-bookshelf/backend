-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- CreateTable
CREATE TABLE "Forkedshelf" (
    "userId" TEXT NOT NULL,
    "bookshelfId" TEXT NOT NULL,

    CONSTRAINT "Forkedshelf_pkey" PRIMARY KEY ("userId","bookshelfId")
);

-- AddForeignKey
ALTER TABLE "Forkedshelf" ADD CONSTRAINT "Forkedshelf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Forkedshelf" ADD CONSTRAINT "Forkedshelf_bookshelfId_fkey" FOREIGN KEY ("bookshelfId") REFERENCES "Bookshelf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
