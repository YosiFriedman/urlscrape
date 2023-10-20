-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "link" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
