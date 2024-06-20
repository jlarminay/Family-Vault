/*
  Warnings:

  - You are about to drop the column `originalFormat` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the `Collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PersonToVideo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_VideoToCollection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Person" DROP CONSTRAINT "Person_userId_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToVideo" DROP CONSTRAINT "_PersonToVideo_A_fkey";

-- DropForeignKey
ALTER TABLE "_PersonToVideo" DROP CONSTRAINT "_PersonToVideo_B_fkey";

-- DropForeignKey
ALTER TABLE "_VideoToCollection" DROP CONSTRAINT "_VideoToCollection_A_fkey";

-- DropForeignKey
ALTER TABLE "_VideoToCollection" DROP CONSTRAINT "_VideoToCollection_B_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "originalFormat",
ADD COLUMN     "people" TEXT,
ADD COLUMN     "tags" TEXT;

-- DropTable
DROP TABLE "Collection";

-- DropTable
DROP TABLE "Person";

-- DropTable
DROP TABLE "_PersonToVideo";

-- DropTable
DROP TABLE "_VideoToCollection";
