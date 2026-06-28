-- Step 1: Create the new join table for many-to-many relationship
CREATE TABLE "_ProductCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- Step 2: Create unique index and index (Prisma standard for implicit m2m)
CREATE UNIQUE INDEX "_ProductCategories_AB_unique" ON "_ProductCategories"("A", "B");
CREATE INDEX "_ProductCategories_B_index" ON "_ProductCategories"("B");

-- Step 3: Migrate existing data — move each product's current categoryId into the join table
INSERT INTO "_ProductCategories" ("A", "B")
SELECT "categoryId", "id" FROM "Product"
WHERE "categoryId" IS NOT NULL;

-- Step 4: Add foreign key constraints
ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_A_fkey"
    FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_ProductCategories" ADD CONSTRAINT "_ProductCategories_B_fkey"
    FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 5: Drop the old foreign key constraint and column
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_categoryId_fkey";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "categoryId";
