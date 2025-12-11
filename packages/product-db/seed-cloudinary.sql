-- Updated seed file with Cloudinary image URLs
-- Replace 'dpp83qz2p' with your actual Cloudinary cloud name
-- After uploading images to Cloudinary, replace placeholder URLs with actual URLs

-- Clear existing data
DELETE FROM products;
DELETE FROM categories;

-- Reset sequences
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;

-- Insert Categories
INSERT INTO categories (name, slug, image, description) VALUES
('Smartphones', 'smartphones', 'https://res.cloudinary.com/dpp83qz2p/image/upload/v1/neuraltale/categories/smartphones.jpg', 'Latest smartphones and mobile devices'),
('Laptops', 'laptops', 'https://res.cloudinary.com/dpp83qz2p/image/upload/v1/neuraltale/categories/laptops.jpg', 'High-performance laptops and notebooks'),
('Audio', 'audio', 'https://res.cloudinary.com/dpp83qz2p/image/upload/v1/neuraltale/categories/audio.jpg', 'Premium headphones and audio devices'),
('Tablets', 'tablets', 'https://res.cloudinary.com/dpp83qz2p/image/upload/v1/neuraltale/categories/tablets.jpg', 'Tablets and iPad devices'),
('Wearables', 'wearables', 'https://res.cloudinary.com/dpp83qz2p/image/upload/v1/neuraltale/categories/wearables.jpg', 'Smartwatches and fitness trackers');

-- Insert Products
INSERT INTO products (name, slug, description, long_description, price, compare_price, stock, colors, sizes, images, category, is_hero, hero_order) VALUES

-- Hero Products (Featured on Homepage)
(
  'iPhone 16 Pro Max',
  'iphone-16-pro-max',
  'The ultimate iPhone with titanium design and A18 Pro chip.',
  'Experience the pinnacle of smartphone technology with the iPhone 16 Pro Max. Featuring a stunning 6.7-inch Super Retina XDR display, revolutionary A18 Pro chip, advanced camera system with 48MP main, ultra-wide, and telephoto lenses. Titanium design, USB-C connectivity, and all-day battery life.',
  119999,
  129999,
  50,
  ARRAY['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
  ARRAY['256GB', '512GB', '1TB'],
  '{"Natural Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/iphone-16-pro-natural-1.jpg", "https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/iphone-16-pro-natural-2.jpg"], "Blue Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/iphone-16-pro-blue-1.jpg"], "White Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/iphone-16-pro-white-1.jpg"], "Black Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/iphone-16-pro-black-1.jpg"]}',
  'smartphones',
  true,
  1
),
(
  'MacBook Pro 14" M4',
  'macbook-pro-14-m4',
  'Supercharged for pros with M4 chip and Liquid Retina XDR display.',
  'The MacBook Pro 14-inch with M4 chip delivers groundbreaking performance and battery life. Features stunning Liquid Retina XDR display, up to 32GB unified memory, advanced thermal design, comprehensive connectivity including Thunderbolt 5, HDMI, and SD card slot. Perfect for developers, creators, and professionals.',
  199999,
  219999,
  30,
  ARRAY['Space Black', 'Silver'],
  ARRAY['16GB RAM 512GB SSD', '24GB RAM 1TB SSD', '32GB RAM 2TB SSD'],
  '{"Space Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/macbook-pro-14-black-1.jpg", "https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/macbook-pro-14-black-2.jpg"], "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/macbook-pro-14-silver-1.jpg"]}',
  'laptops',
  true,
  2
),
(
  'AirPods Pro (3rd Gen)',
  'airpods-pro-3rd-gen',
  'Premium wireless earbuds with advanced active noise cancellation.',
  'AirPods Pro (3rd generation) feature adaptive audio that adjusts noise control based on your environment. USB-C charging, improved H2 chip for better sound quality, enhanced Find My features with precision finding, and up to 6 hours of listening time. Water and sweat resistant (IPX4).',
  24999,
  NULL,
  100,
  ARRAY['White'],
  ARRAY['Standard'],
  '{"White": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/airpods-pro-3-1.jpg", "https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/airpods-pro-3-2.jpg"]}',
  'audio',
  true,
  3
),
(
  'iPad Pro 13" M4',
  'ipad-pro-13-m4',
  'The ultimate iPad experience with M4 chip and stunning display.',
  'iPad Pro with the ultra-powerful M4 chip and breathtaking 13-inch Ultra Retina XDR display. Features ProMotion technology, 12MP camera system, Face ID, and support for Apple Pencil Pro and Magic Keyboard. Perfect for creative professionals and power users.',
  109999,
  119999,
  40,
  ARRAY['Space Gray', 'Silver'],
  ARRAY['256GB', '512GB', '1TB', '2TB'],
  '{"Space Gray": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/ipad-pro-13-gray-1.jpg", "https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/ipad-pro-13-gray-2.jpg"], "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/ipad-pro-13-silver-1.jpg"]}',
  'tablets',
  true,
  4
),
(
  'Apple Watch Ultra 2',
  'apple-watch-ultra-2',
  'The most rugged and capable Apple Watch for athletes and adventurers.',
  'Apple Watch Ultra 2 features precision GPS, depth gauge, water temperature sensor, and a brilliant Always-On Retina display. 49mm titanium case, Action button for quick access to workouts, 36 hours of battery life, cellular connectivity, and advanced health features.',
  79999,
  NULL,
  60,
  ARRAY['Titanium'],
  ARRAY['49mm'],
  '{"Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/watch-ultra-2-1.jpg", "https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/watch-ultra-2-2.jpg"]}',
  'wearables',
  true,
  5
),

-- Regular Products
(
  'Samsung Galaxy S24 Ultra',
  'samsung-galaxy-s24-ultra',
  'Premium Android flagship with S Pen and AI features.',
  'Samsung Galaxy S24 Ultra combines powerful performance with Galaxy AI features. Features 6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 3 processor, 200MP camera system, integrated S Pen, and titanium frame. All-day battery with 45W fast charging.',
  129999,
  139999,
  45,
  ARRAY['Titanium Black', 'Titanium Gray', 'Titanium Violet'],
  ARRAY['256GB', '512GB', '1TB'],
  '{"Titanium Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/galaxy-s24-ultra-black-1.jpg"], "Titanium Gray": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/galaxy-s24-ultra-gray-1.jpg"], "Titanium Violet": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/galaxy-s24-ultra-violet-1.jpg"]}',
  'smartphones',
  false,
  NULL
),
(
  'Dell XPS 15',
  'dell-xps-15',
  'Premium Windows laptop with stunning InfinityEdge display.',
  'Dell XPS 15 combines power and portability. Features 15.6-inch InfinityEdge display, Intel Core i7 processor, NVIDIA RTX graphics, up to 64GB RAM, and premium aluminum chassis. Ideal for content creators and professionals.',
  159999,
  169999,
  25,
  ARRAY['Platinum Silver', 'Graphite'],
  ARRAY['16GB RAM 512GB SSD', '32GB RAM 1TB SSD'],
  '{"Platinum Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/dell-xps-15-silver-1.jpg"], "Graphite": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/dell-xps-15-graphite-1.jpg"]}',
  'laptops',
  false,
  NULL
),
(
  'Sony WH-1000XM5',
  'sony-wh-1000xm5',
  'Industry-leading noise canceling headphones with exceptional sound quality.',
  'Sony WH-1000XM5 delivers premium audio experience with industry-leading noise cancellation. Features 8 microphones for crystal-clear calls, 30-hour battery life, multipoint connection, LDAC support, and comfortable design for all-day wear.',
  39999,
  44999,
  80,
  ARRAY['Black', 'Silver'],
  ARRAY['Standard'],
  '{"Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/sony-wh1000xm5-black-1.jpg"], "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/sony-wh1000xm5-silver-1.jpg"]}',
  'audio',
  false,
  NULL
),
(
  'Samsung Galaxy Tab S9',
  'samsung-galaxy-tab-s9',
  'Powerful Android tablet with S Pen included.',
  'Samsung Galaxy Tab S9 features 11-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2 processor, included S Pen, IP68 water resistance, and DeX mode for desktop-like productivity. Perfect for work and entertainment.',
  79999,
  84999,
  35,
  ARRAY['Graphite', 'Beige'],
  ARRAY['128GB', '256GB'],
  '{"Graphite": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/galaxy-tab-s9-graphite-1.jpg"], "Beige": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1/neuraltale/products/galaxy-tab-s9-beige-1.jpg"]}',
  'tablets',
  false,
  NULL
);
