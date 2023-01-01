-- DropForeignKey
ALTER TABLE "BookshelfBook" DROP CONSTRAINT "BookshelfBook_bookshelfId_fkey";

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookshelfId_fkey" FOREIGN KEY ("bookshelfId") REFERENCES "Bookshelf"("id") ON DELETE CASCADE ON UPDATE CASCADE;
