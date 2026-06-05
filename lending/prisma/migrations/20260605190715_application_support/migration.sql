-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Purpose" AS ENUM ('VENTURE', 'EDUCATION', 'MEDICAL', 'PERSONAL', 'DEBTCONSOLIDATION', 'HOMEIMPROVEMENT', 'OTHER');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "max_amount" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "by" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,
    "purpose" "Purpose" NOT NULL,
    "descriptioin" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "interest_rate" DOUBLE PRECISION NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_by_fkey" FOREIGN KEY ("by") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_to_fkey" FOREIGN KEY ("to") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
