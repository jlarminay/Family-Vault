/*
  Warnings:

  - You are about to drop the column `videoId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `videoId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToVideo1` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToVideo2` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,itemId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemId` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_videoId_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_videoId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_thumbnailId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_videoId_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVideo1" DROP CONSTRAINT "_UserToVideo1_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVideo1" DROP CONSTRAINT "_UserToVideo1_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVideo2" DROP CONSTRAINT "_UserToVideo2_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVideo2" DROP CONSTRAINT "_UserToVideo2_B_fkey";

-- DropIndex
DROP INDEX "Like_userId_videoId_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "videoId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "History" DROP COLUMN "videoId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "videoId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "videoId",
ADD COLUMN     "itemId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Video";

-- DropTable
DROP TABLE "_UserToVideo1";

-- DropTable
DROP TABLE "_UserToVideo2";

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "people" TEXT,
    "dateDisplay" TEXT,
    "dateOrder" DATE NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "published" TEXT NOT NULL DEFAULT 'private',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AllowList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlockList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AllowList_AB_unique" ON "_AllowList"("A", "B");

-- CreateIndex
CREATE INDEX "_AllowList_B_index" ON "_AllowList"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlockList_AB_unique" ON "_BlockList"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockList_B_index" ON "_BlockList"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_itemId_key" ON "Like"("userId", "itemId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllowList" ADD CONSTRAINT "_AllowList_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllowList" ADD CONSTRAINT "_AllowList_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockList" ADD CONSTRAINT "_BlockList_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockList" ADD CONSTRAINT "_BlockList_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
