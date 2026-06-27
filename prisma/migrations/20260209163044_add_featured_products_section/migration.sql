-- CreateTable
CREATE TABLE "HeroSlide" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "arabic_subtitle" TEXT,
    "english_subtitle" TEXT,
    "arabic_title" TEXT,
    "english_title" TEXT,
    "arabic_description" TEXT,
    "english_description" TEXT,
    "arabic_buttonText" TEXT,
    "english_buttonText" TEXT,
    "arabic_buttonLink" TEXT,
    "english_buttonLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "image" TEXT NOT NULL,
    "arabic_name" TEXT,
    "english_name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategorySection" (
    "id" SERIAL NOT NULL,
    "arabic_header" TEXT,
    "english_header" TEXT,
    "arabic_description" TEXT,
    "english_description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CategorySection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedProductsSection" (
    "id" SERIAL NOT NULL,
    "arabic_header" TEXT,
    "english_header" TEXT,
    "arabic_description" TEXT,
    "english_description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedProductsSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
