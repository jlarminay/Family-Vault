/*
  Warnings:

  - You are about to drop the `_UserToVideo1` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToVideo2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserToVideo1" DROP CONSTRAINT "_UserToVideo1_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVideo1" DROP CONSTRAINT "_UserToVideo1_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVideo2" DROP CONSTRAINT "_UserToVideo2_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVideo2" DROP CONSTRAINT "_UserToVideo2_B_fkey";

-- DropTable
DROP TABLE "_UserToVideo1";

-- DropTable
DROP TABLE "_UserToVideo2";

-- CreateTable
CREATE TABLE "_VideoAllowedUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_VideoBlockedUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_VideoAllowedUser_AB_unique" ON "_VideoAllowedUser"("A", "B");

-- CreateIndex
CREATE INDEX "_VideoAllowedUser_B_index" ON "_VideoAllowedUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VideoBlockedUser_AB_unique" ON "_VideoBlockedUser"("A", "B");

-- CreateIndex
CREATE INDEX "_VideoBlockedUser_B_index" ON "_VideoBlockedUser"("B");

-- AddForeignKey
ALTER TABLE "_VideoAllowedUser" ADD CONSTRAINT "_VideoAllowedUser_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoAllowedUser" ADD CONSTRAINT "_VideoAllowedUser_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoBlockedUser" ADD CONSTRAINT "_VideoBlockedUser_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VideoBlockedUser" ADD CONSTRAINT "_VideoBlockedUser_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
