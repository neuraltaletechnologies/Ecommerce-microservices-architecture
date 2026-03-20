-- Set initial hero products
-- This will mark the first 5 products as hero products with proper ordering

UPDATE "Product"
SET 
  "isHeroProduct" = true,
  "heroOrder" = 1
WHERE id = (SELECT id FROM "Product" ORDER BY id LIMIT 1 OFFSET 0);

UPDATE "Product"
SET 
  "isHeroProduct" = true,
  "heroOrder" = 2
WHERE id = (SELECT id FROM "Product" ORDER BY id LIMIT 1 OFFSET 1);

UPDATE "Product"
SET 
  "isHeroProduct" = true,
  "heroOrder" = 3
WHERE id = (SELECT id FROM "Product" ORDER BY id LIMIT 1 OFFSET 2);

UPDATE "Product"
SET 
  "isHeroProduct" = true,
  "heroOrder" = 4
WHERE id = (SELECT id FROM "Product" ORDER BY id LIMIT 1 OFFSET 3);

UPDATE "Product"
SET 
  "isHeroProduct" = true,
  "heroOrder" = 5
WHERE id = (SELECT id FROM "Product" ORDER BY id LIMIT 1 OFFSET 4);

-- Verify the changes
SELECT id, name, "isHeroProduct", "heroOrder" 
FROM "Product" 
WHERE "isHeroProduct" = true 
ORDER BY "heroOrder";
