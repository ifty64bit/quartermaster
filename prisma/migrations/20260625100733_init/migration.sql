-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "twoFactorEnabled" BOOLEAN DEFAULT false,
    "username" TEXT,
    "displayUsername" TEXT
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "twoFactor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verified" BOOLEAN DEFAULT true,
    CONSTRAINT "twoFactor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "asset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "serial" TEXT,
    "purchaseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchasePrice" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "store" TEXT,
    "productUrl" TEXT,
    "condition" TEXT NOT NULL DEFAULT 'new',
    "warrantyExpiry" DATETIME,
    "notes" TEXT,
    "categoryId" INTEGER,
    "brandId" INTEGER,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "asset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "asset_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "asset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "assetHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assetId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "assetHistory_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "assetId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'photo',
    "mimeType" TEXT NOT NULL DEFAULT 'image',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "media_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "brand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "twoFactor_secret_idx" ON "twoFactor"("secret");

-- CreateIndex
CREATE INDEX "twoFactor_userId_idx" ON "twoFactor"("userId");

-- CreateIndex
CREATE INDEX "asset_name_idx" ON "asset"("name");

-- CreateIndex
CREATE INDEX "asset_ownerId_idx" ON "asset"("ownerId");

-- CreateIndex
CREATE INDEX "asset_categoryId_idx" ON "asset"("categoryId");

-- CreateIndex
CREATE INDEX "asset_brandId_idx" ON "asset"("brandId");

-- CreateIndex
CREATE INDEX "asset_purchaseDate_idx" ON "asset"("purchaseDate");

-- CreateIndex
CREATE INDEX "asset_warrantyExpiry_idx" ON "asset"("warrantyExpiry");

-- CreateIndex
CREATE INDEX "asset_condition_idx" ON "asset"("condition");

-- CreateIndex
CREATE INDEX "assetHistory_assetId_idx" ON "assetHistory"("assetId");

-- CreateIndex
CREATE INDEX "assetHistory_assetId_createdAt_idx" ON "assetHistory"("assetId", "createdAt");

-- CreateIndex
CREATE INDEX "media_assetId_idx" ON "media"("assetId");

-- CreateIndex
CREATE INDEX "media_assetId_type_idx" ON "media"("assetId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "brand_name_key" ON "brand"("name");
