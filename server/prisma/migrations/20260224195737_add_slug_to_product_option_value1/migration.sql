/*
  Warnings:

  - Added the required column `slug` to the `ProductOptionValue` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductOptionValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER,
    "optionId" TEXT NOT NULL,
    CONSTRAINT "ProductOptionValue_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "ProductOption" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProductOptionValue" ("id", "optionId", "price", "title") SELECT "id", "optionId", "price", "title" FROM "ProductOptionValue";
DROP TABLE "ProductOptionValue";
ALTER TABLE "new_ProductOptionValue" RENAME TO "ProductOptionValue";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
