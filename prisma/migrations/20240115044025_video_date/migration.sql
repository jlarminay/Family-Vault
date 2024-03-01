/*
  Warnings:

  - You are about to drop the `_VideoAllowedUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_VideoBlockedUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dateDisplay` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOrder` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_VideoAllowedUser" DROP CONSTRAINT "_VideoAllowedUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_VideoAllowedUser" DROP CONSTRAINT "_VideoAllowedUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_VideoBlockedUser" DROP CONSTRAINT "_VideoBlockedUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_VideoBlockedUser" DROP CONSTRAINT "_VideoBlockedUser_B_fkey";

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "dateDisplay" TEXT NOT NULL,
ADD COLUMN     "dateOrder" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "_VideoAllowedUser";

-- DropTable
DROP TABLE "_VideoBlockedUser";

-- CreateTable
CREATE TABLE "_UserToVideo1" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToVideo2" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToVideo1_AB_unique" ON "_UserToVideo1"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToVideo1_B_index" ON "_UserToVideo1"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToVideo2_AB_unique" ON "_UserToVideo2"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToVideo2_B_index" ON "_UserToVideo2"("B");

-- AddForeignKey
ALTER TABLE "_UserToVideo1" ADD CONSTRAINT "_UserToVideo1_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVideo1" ADD CONSTRAINT "_UserToVideo1_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVideo2" ADD CONSTRAINT "_UserToVideo2_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVideo2" ADD CONSTRAINT "_UserToVideo2_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
