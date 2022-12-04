-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "BookshelfBook" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();
