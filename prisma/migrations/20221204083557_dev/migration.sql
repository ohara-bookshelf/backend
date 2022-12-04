/*
  Warnings:

  - The primary key for the `Forkedshelf` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "Forkedshelf" DROP CONSTRAINT "Forkedshelf_pkey",
ADD COLUMN     "id" TEXT NOT NULL DEFAULT public.uuid_generate_v4(),
ADD CONSTRAINT "Forkedshelf_pkey" PRIMARY KEY ("id");
