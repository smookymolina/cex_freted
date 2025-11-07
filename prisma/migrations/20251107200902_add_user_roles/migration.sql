-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "phone" TEXT,
    "refreshToken" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'COMPRADOR',
    "notifyEmail" BOOLEAN NOT NULL DEFAULT true,
    "notifyPush" BOOLEAN NOT NULL DEFAULT false,
    "notifySms" BOOLEAN NOT NULL DEFAULT false,
    "notifyMarketing" BOOLEAN NOT NULL DEFAULT true,
    "profilePublic" BOOLEAN NOT NULL DEFAULT false,
    "showPurchases" BOOLEAN NOT NULL DEFAULT false,
    "allowMessages" BOOLEAN NOT NULL DEFAULT true,
    "cart" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("allowMessages", "cart", "createdAt", "email", "emailVerified", "id", "image", "name", "notifyEmail", "notifyMarketing", "notifyPush", "notifySms", "password", "phone", "profilePublic", "refreshToken", "resetPasswordExpires", "resetPasswordToken", "showPurchases", "updatedAt") SELECT "allowMessages", "cart", "createdAt", "email", "emailVerified", "id", "image", "name", "notifyEmail", "notifyMarketing", "notifyPush", "notifySms", "password", "phone", "profilePublic", "refreshToken", "resetPasswordExpires", "resetPasswordToken", "showPurchases", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
