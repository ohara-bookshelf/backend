/*
  Warnings:

  - The values [HAPPY,SAD,ANGRY,SURPRISED,DISGUSTED,FEARFUL,NEUTRAL] on the enum `Expression` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Expression_new" AS ENUM ('neutral', 'happy', 'sad', 'angry', 'disgust', 'fear', 'surprised');
ALTER TABLE "User" ALTER COLUMN "expression" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "expression" TYPE "Expression_new" USING ("expression"::text::"Expression_new");
ALTER TYPE "Expression" RENAME TO "Expression_old";
ALTER TYPE "Expression_new" RENAME TO "Expression";
DROP TYPE "Expression_old";
ALTER TABLE "User" ALTER COLUMN "expression" SET DEFAULT 'neutral';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expression" SET DEFAULT 'neutral';
