/*
  Warnings:

  - You are about to drop the `Mac` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `histories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Mac";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "macs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_histories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entry" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_histories" ("createdAt", "entry", "id", "userId") SELECT "createdAt", "entry", "id", "userId" FROM "histories";
DROP TABLE "histories";
ALTER TABLE "new_histories" RENAME TO "histories";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL
);
INSERT INTO "new_users" ("email", "id", "nome", "senha") SELECT "email", "id", "nome", "senha" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
