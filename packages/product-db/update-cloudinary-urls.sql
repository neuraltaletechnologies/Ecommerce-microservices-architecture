-- Quick update script to set Cloudinary image URLs for existing products
-- Run this in Prisma Studio's SQL query or via psql

-- Update iPhone 16 Pro Max
UPDATE "Product"
SET images = '{
  "Natural Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-natural-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-natural-2.png"],
  "Blue Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-blue-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-blue-2.png"],
  "White Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-white-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-white-2.png"],
  "Black Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-black-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-black-2.png"]
}'::jsonb
WHERE name = 'iPhone 16 Pro Max';

-- Update MacBook Pro 14" M4
UPDATE "Product"
SET images = '{
  "Space Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-black-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-black-2.png"],
  "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-silver-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-silver-2.png"]
}'::jsonb
WHERE name LIKE 'MacBook Pro 14%';

-- Update AirPods Pro
UPDATE "Product"
SET images = '{
  "White": ["https://res.cloudinary.com/dpp83qz2p/image/upload/airpods-pro-3-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/airpods-pro-3-2.png"]
}'::jsonb
WHERE name LIKE 'AirPods Pro%';

-- Update iPad Pro
UPDATE "Product"
SET images = '{
  "Space Gray": ["https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-gray-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-gray-2.png"],
  "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-silver-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-silver-2.png"]
}'::jsonb
WHERE name LIKE 'iPad Pro%';

-- Update Apple Watch Ultra 2
UPDATE "Product"
SET images = '{
  "Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/watch-ultra-2-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/watch-ultra-2-2.png"]
}'::jsonb
WHERE name LIKE 'Apple Watch Ultra%';

-- Update Samsung Galaxy S24 Ultra
UPDATE "Product"
SET images = '{
  "Titanium Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-s24-ultra-black-1.png"],
  "Titanium Gray": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-s24-ultra-gray-1.png"],
  "Titanium Violet": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-s24-ultra-violet-1.png"]
}'::jsonb
WHERE name LIKE 'Samsung Galaxy S24%';

-- Update Dell XPS 15
UPDATE "Product"
SET images = '{
  "Platinum Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/dell-xps-15-silver-1.png"],
  "Graphite": ["https://res.cloudinary.com/dpp83qz2p/image/upload/dell-xps-15-graphite-1.png"]
}'::jsonb
WHERE name LIKE 'Dell XPS%';

-- Update Sony WH-1000XM5
UPDATE "Product"
SET images = '{
  "Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/sony-wh1000xm5-black-1.png"],
  "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/sony-wh1000xm5-silver-1.png"]
}'::jsonb
WHERE name LIKE 'Sony WH%';

-- Update Samsung Galaxy Tab S9
UPDATE "Product"
SET images = '{
  "Graphite": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-tab-s9-graphite-1.png"],
  "Beige": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-tab-s9-beige-1.png"]
}'::jsonb
WHERE name LIKE 'Samsung Galaxy Tab%';

-- Verify the updates
SELECT name, images FROM "Product" ORDER BY id;
