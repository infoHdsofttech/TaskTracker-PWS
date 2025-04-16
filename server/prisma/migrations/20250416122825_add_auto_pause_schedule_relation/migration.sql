-- CreateTable
CREATE TABLE "AutoPauseSchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pauseAt" TIMESTAMP(3) NOT NULL,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AutoPauseSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AutoPauseSchedule" ADD CONSTRAINT "AutoPauseSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
