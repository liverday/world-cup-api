-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "bracketId" TEXT,
ADD COLUMN     "fifaMatchNumber" INTEGER,
ADD COLUMN     "fifaPlaceholderA" TEXT,
ADD COLUMN     "fifaPlaceholderB" TEXT;

-- CreateTable
CREATE TABLE "Bracket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Bracket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_bracketId_fkey" FOREIGN KEY ("bracketId") REFERENCES "Bracket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
