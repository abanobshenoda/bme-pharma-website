-- CreateTable
CREATE TABLE "WhoWeAreSection" (
    "id" SERIAL NOT NULL,
    "arabic_header" TEXT,
    "english_header" TEXT,
    "arabic_description" TEXT,
    "english_description" TEXT,
    "backgroundImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhoWeAreSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhoWeAreContent" (
    "id" SERIAL NOT NULL,
    "icon" TEXT,
    "arabic_title" TEXT,
    "english_title" TEXT,
    "arabic_subtitle" TEXT,
    "english_subtitle" TEXT,
    "sectionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhoWeAreContent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WhoWeAreContent" ADD CONSTRAINT "WhoWeAreContent_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "WhoWeAreSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
