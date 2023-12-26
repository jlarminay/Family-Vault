/*
  Warnings:

  - You are about to drop the column `userId` on the `Person` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_userId_fkey";

-- DropIndex
DROP INDEX "Person_userId_key";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "userId",
ADD COLUMN     "image" TEXT;
