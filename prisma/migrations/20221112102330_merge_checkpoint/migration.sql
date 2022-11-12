/*
  Warnings:

  - You are about to drop the `ForkList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ForkList" DROP CONSTRAINT "ForkList_bookshelfId_fkey";

-- DropForeignKey
ALTER TABLE "ForkList" DROP CONSTRAINT "ForkList_userId_fkey";

-- DropTable
DROP TABLE "ForkList";
