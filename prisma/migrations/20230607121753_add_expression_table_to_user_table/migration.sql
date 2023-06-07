-- CreateEnum
CREATE TYPE "Expression" AS ENUM ('HAPPY', 'SAD', 'ANGRY', 'SURPRISED', 'DISGUSTED', 'FEARFUL', 'NEUTRAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expression" "Expression" NOT NULL DEFAULT 'NEUTRAL';
