-- CreateTable
CREATE TABLE "Scan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "briefText" TEXT,
    "storyCount" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scanId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "rawContent" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "summary" TEXT,
    "strategicValue" TEXT,
    "relevanceScore" INTEGER,
    "abolitionistAngle" TEXT,
    "framingAdvice" TEXT,
    "competitiveEdge" TEXT,
    "timeUrgency" TEXT,
    "suggestedWriter" TEXT,
    "covered" BOOLEAN NOT NULL DEFAULT false,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "tags" TEXT,
    "patternLinks" TEXT,
    CONSTRAINT "Story_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastScanned" DATETIME
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "scanId" TEXT,
    CONSTRAINT "ChatMessage_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Story_url_key" ON "Story"("url");
