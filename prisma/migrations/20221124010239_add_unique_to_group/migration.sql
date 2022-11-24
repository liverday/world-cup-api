/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Group_code_key" ON "Group"("code");
