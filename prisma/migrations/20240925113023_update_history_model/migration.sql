-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_histories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entry" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_histories" ("entry", "id", "userId") SELECT "entry", "id", "userId" FROM "histories";
DROP TABLE "histories";
ALTER TABLE "new_histories" RENAME TO "histories";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
