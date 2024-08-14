-- CreateTable
CREATE TABLE "SystemLog" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "responseSize" INTEGER NOT NULL,
    "requestBody" JSONB,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
