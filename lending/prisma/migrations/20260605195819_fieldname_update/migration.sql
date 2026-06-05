/*
  Warnings:

  - You are about to drop the column `descriptioin` on the `Application` table. All the data in the column will be lost.
  - Added the required column `description` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "descriptioin",
ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "max_lender_interest_rate" DROP NOT NULL,
ALTER COLUMN "min_lender_interest_rate" DROP NOT NULL;
