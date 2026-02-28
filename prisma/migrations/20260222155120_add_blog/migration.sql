/*
  Warnings:

  - A unique constraint covering the columns `[referrerCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `properties` JSON NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `discount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `grade` VARCHAR(191) NULL,
    ADD COLUMN `gradeType` VARCHAR(191) NULL,
    ADD COLUMN `orderType` VARCHAR(191) NULL,
    ADD COLUMN `paymentInstallments` JSON NULL,
    ADD COLUMN `paymentType` VARCHAR(191) NULL,
    ADD COLUMN `priority` VARCHAR(191) NULL DEFAULT 'normal',
    ADD COLUMN `referrerCommission` DOUBLE NULL,
    ADD COLUMN `referrerId` VARCHAR(191) NULL,
    ADD COLUMN `revisionCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `subjectName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Portfolio` ADD COLUMN `academicLevel` VARCHAR(191) NULL,
    ADD COLUMN `countries` JSON NULL,
    ADD COLUMN `date` DATETIME(3) NULL,
    ADD COLUMN `file` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Service` ADD COLUMN `countries` JSON NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `shortDescription` TEXT NULL;

-- AlterTable
ALTER TABLE `Student` ADD COLUMN `academicLevel` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `phoneCountryCode` VARCHAR(191) NULL DEFAULT '+962',
    ADD COLUMN `specialization` VARCHAR(191) NULL,
    ADD COLUMN `university` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `academicLevels` JSON NULL,
    ADD COLUMN `commissionRate` DOUBLE NULL,
    ADD COLUMN `complaintsCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `isReferrer` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `phoneCountryCode` VARCHAR(191) NULL DEFAULT '+962',
    ADD COLUMN `referrerCode` VARCHAR(191) NULL,
    ADD COLUMN `services` JSON NULL,
    ADD COLUMN `specialization` VARCHAR(191) NULL,
    ALTER COLUMN `defaultProfitRate` DROP DEFAULT;

-- CreateTable
CREATE TABLE `PaymentRecord` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentType` VARCHAR(191) NOT NULL,
    `paidBy` VARCHAR(191) NULL,
    `paymentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PaymentRecord_orderId_fkey`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blog` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `content` TEXT NOT NULL,
    `image` VARCHAR(191) NULL,
    `author` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `views` INTEGER NOT NULL DEFAULT 0,
    `tags` JSON NULL,
    `category` VARCHAR(191) NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Blog_slug_key`(`slug`),
    INDEX `Blog_slug_idx`(`slug`),
    INDEX `Blog_isPublished_idx`(`isPublished`),
    INDEX `Blog_publishedAt_idx`(`publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Order_referrerId_fkey` ON `Order`(`referrerId`);

-- CreateIndex
CREATE INDEX `Order_createdAt_idx` ON `Order`(`createdAt`);

-- CreateIndex
CREATE INDEX `Order_priority_idx` ON `Order`(`priority`);

-- CreateIndex
CREATE INDEX `Service_isActive_idx` ON `Service`(`isActive`);

-- CreateIndex
CREATE UNIQUE INDEX `User_referrerCode_key` ON `User`(`referrerCode`);

-- CreateIndex
CREATE INDEX `User_referrerCode_idx` ON `User`(`referrerCode`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_referrerId_fkey` FOREIGN KEY (`referrerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentRecord` ADD CONSTRAINT `PaymentRecord_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
