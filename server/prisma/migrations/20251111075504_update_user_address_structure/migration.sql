/*
  Warnings:

  - You are about to drop the column `addressDetails` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `thana` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "addressDetails",
DROP COLUMN "district",
DROP COLUMN "division",
DROP COLUMN "isActive",
DROP COLUMN "name",
DROP COLUMN "thana",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "districtBnName" TEXT,
ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "districtName" TEXT,
ADD COLUMN     "divisionBnName" TEXT,
ADD COLUMN     "divisionId" TEXT,
ADD COLUMN     "divisionName" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "upazilaBnName" TEXT,
ADD COLUMN     "upazilaId" TEXT,
ADD COLUMN     "upazilaName" TEXT;
