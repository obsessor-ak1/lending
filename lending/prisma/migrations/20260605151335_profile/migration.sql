/*
  Warnings:

  - Added the required column `bio` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lender_status` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_lender_interest_rate` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `min_lender_interest_rate` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "lender_status" BOOLEAN NOT NULL,
ADD COLUMN     "max_lender_interest_rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "min_lender_interest_rate" DOUBLE PRECISION NOT NULL;
