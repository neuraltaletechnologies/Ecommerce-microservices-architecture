-- Add inventory management columns to Product table
ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "stockQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "stockStatus" TEXT NOT NULL DEFAULT 'in_stock',
ADD COLUMN IF NOT EXISTS "lowStockThreshold" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN IF NOT EXISTS "soldCount" INTEGER NOT NULL DEFAULT 0;

-- Add check constraint for stockStatus
ALTER TABLE "Product" 
ADD CONSTRAINT "Product_stockStatus_check" 
CHECK ("stockStatus" IN ('in_stock', 'limited_stock', 'pre_order', 'out_of_stock'));

-- Update existing products with default inventory values
UPDATE "Product" 
SET 
  "stockQuantity" = 50,
  "stockStatus" = 'in_stock',
  "lowStockThreshold" = 10,
  "soldCount" = 0
WHERE "stockQuantity" IS NULL OR "stockStatus" IS NULL;
