/*
  Warnings:

  - Added the required column `matchId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "extraInfo" JSONB,
ADD COLUMN     "matchId" TEXT NOT NULL,
ALTER COLUMN "time" SET DATA TYPE TEXT,
ALTER COLUMN "fifaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
