/*
  Warnings:

  - You are about to drop the column `endDate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Task` table. All the data in the column will be lost.
  - Added the required column `plannedStart` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "actualEnd" TIMESTAMP(3),
ADD COLUMN     "actualStart" TIMESTAMP(3),
ADD COLUMN     "completedHours" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "estimatedTime" INTEGER,
ADD COLUMN     "isPaused" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plannedEnd" TIMESTAMP(3),
ADD COLUMN     "plannedStart" TIMESTAMP(3) NOT NULL;
