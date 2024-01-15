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
