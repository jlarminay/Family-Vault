/*
  Warnings:

  - You are about to drop the column `image` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "image",
ADD COLUMN     "imageId" INTEGER;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
