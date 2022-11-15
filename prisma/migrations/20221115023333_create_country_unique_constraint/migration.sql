/*
  Warnings:

  - A unique constraint covering the columns `[country]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_country_key" ON "Team"("country");
