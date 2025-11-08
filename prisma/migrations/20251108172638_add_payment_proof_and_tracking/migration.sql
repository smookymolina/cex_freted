-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "shippingCity" TEXT NOT NULL,
    "shippingState" TEXT NOT NULL,
    "shippingPostalCode" TEXT NOT NULL,
    "shippingReferences" TEXT,
    "subtotal" REAL NOT NULL,
    "shippingCost" REAL NOT NULL,
    "total" REAL NOT NULL,
    "items" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentReleaseStatus" TEXT NOT NULL DEFAULT 'WAITING_SUPPORT',
    "paymentReleaseNotes" TEXT,
    "paymentReleaseBy" TEXT,
    "paymentReleaseAt" DATETIME,
    "orderReleaseData" JSONB,
    "trackingStatus" TEXT NOT NULL DEFAULT 'ORDER_RECEIVED',
    "trackingHistory" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "supportNotes" TEXT,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "customerEmail", "customerName", "customerPhone", "id", "items", "orderNumber", "shippingAddress", "shippingCity", "shippingCost", "shippingPostalCode", "shippingReferences", "shippingState", "status", "subtotal", "supportNotes", "total", "updatedAt", "userId") SELECT "createdAt", "customerEmail", "customerName", "customerPhone", "id", "items", "orderNumber", "shippingAddress", "shippingCity", "shippingCost", "shippingPostalCode", "shippingReferences", "shippingState", "status", "subtotal", "supportNotes", "total", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "referenceNumber" TEXT NOT NULL,
    "paymentMetadata" JSONB,
    "paymentProof" TEXT,
    "paymentProofUploadedAt" DATETIME,
    "paymentProofVerified" BOOLEAN NOT NULL DEFAULT false,
    "paymentProofVerifiedAt" DATETIME,
    "paymentProofVerifiedBy" TEXT,
    "processedAt" DATETIME,
    "processedBy" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "createdAt", "id", "notes", "orderId", "paymentMetadata", "paymentMethod", "processedAt", "processedBy", "referenceNumber", "status", "transactionId", "updatedAt") SELECT "amount", "createdAt", "id", "notes", "orderId", "paymentMetadata", "paymentMethod", "processedAt", "processedBy", "referenceNumber", "status", "transactionId", "updatedAt" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");
CREATE UNIQUE INDEX "Payment_referenceNumber_key" ON "Payment"("referenceNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
