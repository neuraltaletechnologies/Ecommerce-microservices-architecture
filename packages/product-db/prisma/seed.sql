-- ============================================
-- Neurashop E-commerce Platform
-- Complete Database Seed File
-- ============================================
-- This file contains sample data for categories and products
-- Run this after your Prisma migrations are complete
-- ============================================

-- Clear existing data (optional - use with caution in production)
-- TRUNCATE TABLE "Product" CASCADE;
-- TRUNCATE TABLE "Category" CASCADE;

-- ============================================
-- CATEGORIES
-- ============================================

INSERT INTO "Category" ("id", "name", "slug") VALUES
(1, 'Smartphones', 'smartphones'),
(2, 'Laptops', 'laptops'),
(3, 'Gaming Laptops', 'gaming-laptops'),
(4, 'Tablets', 'tablets'),
(5, 'Audio', 'audio'),
(6, 'Headphones', 'headphones'),
(7, 'Wireless Earbuds', 'wireless-earbuds'),
(8, 'Wearables', 'wearables'),
(9, 'Smartwatches', 'smartwatches'),
(10, 'Accessories', 'accessories'),
(11, 'Keyboards', 'keyboards'),
(12, 'Mice', 'mice'),
(13, 'Monitors', 'monitors'),
(14, 'Gaming', 'gaming'),
(15, 'Graphics Cards', 'graphics-cards'),
(16, 'Processors', 'processors'),
(17, 'RAM', 'ram'),
(18, 'SSDs', 'ssds'),
(19, 'Hard Drives', 'hard-drives'),
(20, 'Networking', 'networking')
ON CONFLICT (slug) DO NOTHING;

-- Reset sequence for categories
SELECT setval('"Category_id_seq"', (SELECT MAX(id) FROM "Category"));

-- ============================================
-- SAMPLE PRODUCTS WITH HERO PRODUCTS
-- ============================================

-- HERO PRODUCT 1: Premium Gaming Laptop
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "techHighlights",
    "boxContents",
    "productFeatures",
    "technicalSpecs",
    "certifications",
    "isHeroProduct",
    "heroOrder",
    "categorySlug"
) VALUES (
    'ASUS ROG Strix G16 Gaming Laptop',
    'High-performance gaming laptop with RTX 4060 and 165Hz display',
    'Experience unparalleled gaming performance with the ASUS ROG Strix G16. Powered by Intel Core i7-13650HX processor and NVIDIA GeForce RTX 4060 graphics card, this laptop delivers smooth gameplay at high settings. The 16-inch FHD 165Hz display ensures buttery-smooth visuals, while the advanced cooling system keeps temperatures in check during intense gaming sessions.',
    1299900,
    ARRAY['16GB RAM + 512GB SSD', '16GB RAM + 1TB SSD', '32GB RAM + 1TB SSD'],
    ARRAY['Eclipse Gray', 'Volt Green'],
    '{"Eclipse Gray": ["/products/asus-rog-strix-1.jpg", "/products/asus-rog-strix-2.jpg"], "Volt Green": ["/products/asus-rog-strix-green-1.jpg"]}',
    '[{"label": "RTX 4060 Graphics", "icon": "Zap"}, {"label": "165Hz Display", "icon": "Monitor"}, {"label": "RGB Keyboard", "icon": "Keyboard"}]',
    '["ASUS ROG Strix G16 Laptop", "65W Power Adapter", "User Manual", "Warranty Card", "ROG Logo Sticker"]',
    '[{"title": "Ultimate Gaming Performance", "description": "NVIDIA GeForce RTX 4060 delivers incredible graphics and smooth gameplay"}, {"title": "Blazing Fast Display", "description": "16-inch FHD 165Hz panel for competitive gaming advantage"}, {"title": "Advanced Cooling", "description": "ROG Intelligent Cooling keeps your system cool under pressure"}]',
    '{"Display": [{"label": "Screen Size", "value": "16 inches"}, {"label": "Resolution", "value": "1920 x 1080 FHD"}, {"label": "Refresh Rate", "value": "165Hz"}], "Performance": [{"label": "Processor", "value": "Intel Core i7-13650HX"}, {"label": "Graphics", "value": "NVIDIA GeForce RTX 4060 8GB"}, {"label": "RAM", "value": "16GB DDR5"}, {"label": "Storage", "value": "512GB PCIe 4.0 NVMe SSD"}], "Connectivity": [{"label": "Wi-Fi", "value": "Wi-Fi 6E"}, {"label": "Bluetooth", "value": "5.3"}, {"label": "USB", "value": "3x USB 3.2, 1x Thunderbolt 4"}]}',
    '[{"label": "ENERGY STAR Certified", "icon": "Award"}, {"label": "RoHS Compliant", "icon": "Shield"}]',
    true,
    1,
    'gaming-laptops'
);

-- HERO PRODUCT 2: Premium Smartphone
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "techHighlights",
    "boxContents",
    "productFeatures",
    "technicalSpecs",
    "isHeroProduct",
    "heroOrder",
    "categorySlug"
) VALUES (
    'iPhone 15 Pro Max',
    'Titanium design with A17 Pro chip and advanced camera system',
    'The iPhone 15 Pro Max features aerospace-grade titanium construction, the powerful A17 Pro chip with 6-core GPU, and a revolutionary camera system. Capture stunning photos with the 48MP main camera, enhanced Night mode, and up to 10x optical zoom. The Action button gives you quick access to your favorite features.',
    1199900,
    ARRAY['256GB', '512GB', '1TB'],
    ARRAY['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    '{"Natural Titanium": ["/products/iphone-15-pro-natural-1.jpg", "/products/iphone-15-pro-natural-2.jpg"], "Blue Titanium": ["/products/iphone-15-pro-blue-1.jpg"], "White Titanium": ["/products/iphone-15-pro-white-1.jpg"], "Black Titanium": ["/products/iphone-15-pro-black-1.jpg"]}',
    '[{"label": "A17 Pro Chip", "icon": "Cpu"}, {"label": "Titanium Design", "icon": "Shield"}, {"label": "48MP Camera", "icon": "Camera"}]',
    '["iPhone 15 Pro Max", "USB-C Charging Cable", "Documentation", "SIM Ejector Tool"]',
    '[{"title": "Titanium Powerhouse", "description": "Aerospace-grade titanium design - lighter, stronger, more refined"}, {"title": "A17 Pro Performance", "description": "Revolutionary chip delivers incredible performance and efficiency"}, {"title": "Pro Camera System", "description": "48MP main camera with advanced computational photography"}]',
    '{"Display": [{"label": "Screen Size", "value": "6.7 inches"}, {"label": "Resolution", "value": "2796 x 1290"}, {"label": "Type", "value": "Super Retina XDR OLED"}, {"label": "Refresh Rate", "value": "120Hz ProMotion"}], "Camera": [{"label": "Main Camera", "value": "48MP f/1.78"}, {"label": "Telephoto", "value": "12MP 5x optical zoom"}, {"label": "Ultra Wide", "value": "12MP f/2.2"}, {"label": "Front Camera", "value": "12MP TrueDepth"}], "Performance": [{"label": "Chip", "value": "A17 Pro"}, {"label": "RAM", "value": "8GB"}, {"label": "Storage Options", "value": "256GB, 512GB, 1TB"}], "Battery": [{"label": "Video Playback", "value": "Up to 29 hours"}, {"label": "Charging", "value": "USB-C fast charging"}]}',
    true,
    2,
    'smartphones'
);

-- HERO PRODUCT 3: Premium Wireless Earbuds
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "techHighlights",
    "boxContents",
    "productFeatures",
    "technicalSpecs",
    "isHeroProduct",
    "heroOrder",
    "categorySlug"
) VALUES (
    'AirPods Pro (3rd Generation)',
    'Active Noise Cancellation and Personalized Spatial Audio',
    'Experience immersive sound with AirPods Pro featuring the H2 chip. Active Noise Cancellation blocks outside noise, while Adaptive Audio adjusts to your environment. Personalized Spatial Audio creates a theater-like experience. With up to 6 hours of listening time and dust, sweat, and water resistance, these are the ultimate everyday earbuds.',
    24990,
    ARRAY['One Size'],
    ARRAY['White'],
    '{"White": ["/products/airpods-pro-1.jpg", "/products/airpods-pro-2.jpg", "/products/airpods-pro-3.jpg"]}',
    '[{"label": "H2 Chip", "icon": "Cpu"}, {"label": "Active Noise Cancellation", "icon": "Volume2"}, {"label": "Spatial Audio", "icon": "Headphones"}]',
    '["AirPods Pro", "MagSafe Charging Case", "Silicone Ear Tips (4 sizes)", "USB-C Charging Cable", "Documentation"]',
    '[{"title": "Magical Audio Experience", "description": "H2 chip delivers rich, immersive sound with deep bass and crystal-clear highs"}, {"title": "Advanced Noise Control", "description": "Active Noise Cancellation and Adaptive Audio intelligently adapt to your environment"}, {"title": "All-Day Comfort", "description": "Four sizes of silicone tips ensure a customized, secure fit"}]',
    '{"Audio": [{"label": "Driver", "value": "Custom high-excursion driver"}, {"label": "Amplifier", "value": "Custom high dynamic range amplifier"}, {"label": "Chip", "value": "Apple H2"}], "Features": [{"label": "Active Noise Cancellation", "value": "Yes"}, {"label": "Transparency Mode", "value": "Yes"}, {"label": "Adaptive Audio", "value": "Yes"}, {"label": "Spatial Audio", "value": "Personalized with head tracking"}], "Battery": [{"label": "Listening Time", "value": "Up to 6 hours (ANC on)"}, {"label": "Total with Case", "value": "Up to 30 hours"}, {"label": "Charging", "value": "USB-C, MagSafe, Qi"}], "Resistance": [{"label": "Rating", "value": "IP54 (dust, sweat, water resistant)"}]}',
    true,
    3,
    'wireless-earbuds'
);

-- HERO PRODUCT 4: Premium Smartwatch
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "techHighlights",
    "boxContents",
    "productFeatures",
    "technicalSpecs",
    "isHeroProduct",
    "heroOrder",
    "categorySlug"
) VALUES (
    'Apple Watch Series 9',
    'Advanced health and fitness tracking with always-on display',
    'Apple Watch Series 9 features the powerful S9 SiP chip, enabling a super-bright display and magical new ways to use your watch without touching the screen. Track your workouts, monitor your health with advanced sensors, and stay connected with calls, messages, and apps. The always-on Retina display keeps information visible at a glance.',
    39900,
    ARRAY['41mm', '45mm'],
    ARRAY['Midnight', 'Starlight', 'Pink', 'Silver', 'Product RED'],
    '{"Midnight": ["/products/watch-9-midnight-1.jpg", "/products/watch-9-midnight-2.jpg"], "Starlight": ["/products/watch-9-starlight-1.jpg"], "Pink": ["/products/watch-9-pink-1.jpg"], "Silver": ["/products/watch-9-silver-1.jpg"], "Product RED": ["/products/watch-9-red-1.jpg"]}',
    '[{"label": "S9 SiP Chip", "icon": "Cpu"}, {"label": "Always-On Display", "icon": "Watch"}, {"label": "Health Sensors", "icon": "Activity"}]',
    '["Apple Watch Series 9", "Sport Band", "USB-C Magnetic Fast Charger", "Quick Start Guide"]',
    '[{"title": "Powerful Health Insights", "description": "Advanced sensors track heart rate, blood oxygen, sleep, and more"}, {"title": "Ultimate Fitness Partner", "description": "Track workouts with GPS and advanced metrics for all your activities"}, {"title": "Always-On Brilliance", "description": "Stunning always-on Retina display - 2x brighter than Series 8"}]',
    '{"Display": [{"label": "Size Options", "value": "41mm or 45mm"}, {"label": "Type", "value": "Always-On Retina LTPO OLED"}, {"label": "Brightness", "value": "Up to 2000 nits"}], "Health": [{"label": "Heart Rate", "value": "Optical sensor"}, {"label": "Blood Oxygen", "value": "Yes"}, {"label": "ECG", "value": "Yes"}, {"label": "Temperature", "value": "Yes"}], "Performance": [{"label": "Chip", "value": "S9 SiP with 64-bit dual-core"}, {"label": "Storage", "value": "64GB"}], "Battery": [{"label": "Life", "value": "Up to 18 hours"}, {"label": "Fast Charge", "value": "0-80% in 45 minutes"}], "Connectivity": [{"label": "GPS", "value": "Precision dual-frequency"}, {"label": "Cellular", "value": "LTE and UMTS (optional)"}, {"label": "Wi-Fi", "value": "802.11b/g/n 2.4GHz and 5GHz"}, {"label": "Bluetooth", "value": "5.3"}]}',
    true,
    4,
    'smartwatches'
);

-- HERO PRODUCT 5: Premium Laptop
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "techHighlights",
    "boxContents",
    "productFeatures",
    "technicalSpecs",
    "isHeroProduct",
    "heroOrder",
    "categorySlug"
) VALUES (
    'MacBook Pro 14-inch M4 Pro',
    'Supercharged performance for professionals with M4 Pro chip',
    'The 14-inch MacBook Pro with M4 Pro chip delivers groundbreaking performance and the world''s best laptop display. With up to 24 hours of battery life, Liquid Retina XDR display, and an array of pro connectivity options including three Thunderbolt 5 ports, it''s the ultimate tool for professionals who demand the best.',
    199900,
    ARRAY['512GB SSD + 18GB RAM', '1TB SSD + 24GB RAM', '2TB SSD + 48GB RAM'],
    ARRAY['Space Black', 'Silver'],
    '{"Space Black": ["/products/mbp-14-black-1.jpg", "/products/mbp-14-black-2.jpg"], "Silver": ["/products/mbp-14-silver-1.jpg"]}',
    '[{"label": "M4 Pro Chip", "icon": "Cpu"}, {"label": "Liquid Retina XDR", "icon": "Monitor"}, {"label": "24hr Battery", "icon": "Battery"}]',
    '["MacBook Pro 14-inch", "140W USB-C Power Adapter", "USB-C to MagSafe 3 Cable", "Documentation"]',
    '[{"title": "M4 Pro Power", "description": "Up to 14-core CPU and 20-core GPU deliver pro-level performance"}, {"title": "Stunning XDR Display", "description": "Liquid Retina XDR display with 1000 nits sustained brightness"}, {"title": "All-Day Battery Life", "description": "Up to 24 hours of battery life - longest ever in a Mac"}]',
    '{"Display": [{"label": "Size", "value": "14.2-inch"}, {"label": "Resolution", "value": "3024 x 1964"}, {"label": "Type", "value": "Liquid Retina XDR"}, {"label": "Brightness", "value": "1000 nits sustained, 1600 nits peak HDR"}], "Performance": [{"label": "Chip", "value": "Apple M4 Pro"}, {"label": "CPU", "value": "Up to 14-core"}, {"label": "GPU", "value": "Up to 20-core"}, {"label": "Neural Engine", "value": "16-core"}], "Memory & Storage": [{"label": "Unified Memory", "value": "18GB, 24GB, or 48GB"}, {"label": "SSD Storage", "value": "512GB, 1TB, or 2TB"}], "Battery": [{"label": "Life", "value": "Up to 24 hours video playback"}, {"label": "Charging", "value": "140W fast charging via MagSafe 3"}], "Connectivity": [{"label": "Thunderbolt", "value": "3x Thunderbolt 5 (USB 4)"}, {"label": "HDMI", "value": "HDMI 2.1"}, {"label": "SD Card", "value": "SDXC card slot"}, {"label": "Audio", "value": "3.5mm headphone jack"}]}',
    true,
    5,
    'laptops'
);

-- REGULAR PRODUCTS (Non-Hero)

-- Smartphone 2
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "categorySlug"
) VALUES (
    'Samsung Galaxy S24 Ultra',
    '200MP camera, S Pen, and Galaxy AI features',
    'The Samsung Galaxy S24 Ultra combines cutting-edge technology with premium design. Featuring a 200MP main camera, built-in S Pen, and powerful Galaxy AI features for enhanced productivity and creativity.',
    119900,
    ARRAY['256GB', '512GB', '1TB'],
    ARRAY['Titanium Black', 'Titanium Gray', 'Titanium Violet'],
    '{"Titanium Black": ["/products/s24-ultra-black-1.jpg"], "Titanium Gray": ["/products/s24-ultra-gray-1.jpg"], "Titanium Violet": ["/products/s24-ultra-violet-1.jpg"]}',
    'smartphones'
);

-- Laptop 2
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "categorySlug"
) VALUES (
    'Dell XPS 15 9530',
    'InfinityEdge display with Intel Core i7 and NVIDIA RTX',
    'Premium productivity laptop with stunning InfinityEdge display, powerful performance, and professional-grade features. Perfect for creators and professionals.',
    179900,
    ARRAY['512GB SSD + 16GB RAM', '1TB SSD + 32GB RAM'],
    ARRAY['Platinum Silver', 'Graphite'],
    '{"Platinum Silver": ["/products/xps-15-silver-1.jpg"], "Graphite": ["/products/xps-15-graphite-1.jpg"]}',
    'laptops'
);

-- Wireless Keyboard
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "categorySlug"
) VALUES (
    'Logitech MX Keys Advanced Wireless Keyboard',
    'Illuminated keys with smart backlighting and multi-device support',
    'Type with confidence on spherically dished keys shaped for your fingers. Smart backlighting adjusts to lighting conditions. Connect up to three devices via Bluetooth or USB receiver.',
    10900,
    ARRAY['Full Size'],
    ARRAY['Graphite', 'Pale Gray'],
    '{"Graphite": ["/products/mx-keys-graphite-1.jpg"], "Pale Gray": ["/products/mx-keys-gray-1.jpg"]}',
    'keyboards'
);

-- Wireless Mouse
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "categorySlug"
) VALUES (
    'Logitech MX Master 3S',
    'Ultra-precise scrolling with quiet clicks and customizable buttons',
    'The ultimate precision mouse for power users. Features Darkfield tracking, ultra-fast scrolling, and customizable buttons. Works on virtually any surface.',
    9900,
    ARRAY['One Size'],
    ARRAY['Graphite', 'Pale Gray'],
    '{"Graphite": ["/products/mx-master-3s-graphite-1.jpg"], "Pale Gray": ["/products/mx-master-3s-gray-1.jpg"]}',
    'mice'
);

-- Gaming Monitor
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "categorySlug"
) VALUES (
    'ASUS ROG Swift OLED PG27AQDM',
    '27" 1440p 240Hz OLED gaming monitor with G-SYNC',
    'Experience stunning visuals with true blacks and vibrant colors on this OLED panel. 240Hz refresh rate and 0.03ms response time ensure competitive advantage in fast-paced games.',
    89900,
    ARRAY['27 inches'],
    ARRAY['Black'],
    '{"Black": ["/products/rog-swift-oled-1.jpg", "/products/rog-swift-oled-2.jpg"]}',
    'monitors'
);

-- Tablet
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "categorySlug"
) VALUES (
    'iPad Air M2',
    'Powerful M2 chip in a thin and light design',
    'iPad Air features the M2 chip with an 8-core CPU and 10-core GPU for incredible performance. The 11-inch Liquid Retina display supports Apple Pencil Pro and Magic Keyboard.',
    59900,
    ARRAY['128GB', '256GB', '512GB'],
    ARRAY['Space Gray', 'Starlight', 'Purple', 'Blue'],
    '{"Space Gray": ["/products/ipad-air-gray-1.jpg"], "Starlight": ["/products/ipad-air-starlight-1.jpg"], "Purple": ["/products/ipad-air-purple-1.jpg"], "Blue": ["/products/ipad-air-blue-1.jpg"]}',
    'tablets'
);

-- Premium Headphones
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "categorySlug"
) VALUES (
    'Sony WH-1000XM5',
    'Industry-leading noise cancellation with exceptional sound quality',
    'Experience premium sound quality with industry-leading noise cancellation. 8 microphones and AI technology for crystal-clear calls. Up to 30 hours of battery life with quick charging.',
    39900,
    ARRAY['One Size'],
    ARRAY['Black', 'Silver'],
    '{"Black": ["/products/sony-xm5-black-1.jpg", "/products/sony-xm5-black-2.jpg"], "Silver": ["/products/sony-xm5-silver-1.jpg"]}',
    'headphones'
);

-- SSD Storage
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "categorySlug"
) VALUES (
    'Samsung 990 PRO PCIe 4.0 NVMe SSD',
    'Ultimate gaming and creative storage with blazing speeds',
    'Experience extreme performance with read speeds up to 7,450 MB/s. Perfect for gaming, 4K video editing, and intensive workloads. Includes heatsink for optimal thermal management.',
    12900,
    ARRAY['1TB', '2TB', '4TB'],
    ARRAY['Black'],
    '{"Black": ["/products/990-pro-1.jpg", "/products/990-pro-2.jpg"]}',
    'ssds'
);

-- Graphics Card
INSERT INTO "Product" (
    "name", 
    "shortDescription", 
    "description", 
    "price", 
    "sizes", 
    "colors", 
    "images",
    "categorySlug"
) VALUES (
    'NVIDIA GeForce RTX 4080 SUPER',
    'Ultimate gaming performance with AI-powered graphics',
    'Power your gaming experience with RTX 4080 SUPER. Features DLSS 3.5, ray tracing, and 16GB GDDR6X memory for ultra-smooth gameplay at 4K resolution.',
    99900,
    ARRAY['16GB GDDR6X'],
    ARRAY['Founders Edition'],
    '{"Founders Edition": ["/products/rtx-4080-super-1.jpg", "/products/rtx-4080-super-2.jpg"]}',
    'graphics-cards'
);

-- ============================================
-- UPDATE SEQUENCES
-- ============================================

SELECT setval('"Product_id_seq"', (SELECT MAX(id) FROM "Product"));

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify categories
SELECT COUNT(*) as category_count FROM "Category";

-- Verify products
SELECT COUNT(*) as product_count FROM "Product";

-- Verify hero products
SELECT COUNT(*) as hero_product_count FROM "Product" WHERE "isHeroProduct" = true;

-- View all hero products with their order
SELECT id, name, "heroOrder", "isHeroProduct" 
FROM "Product" 
WHERE "isHeroProduct" = true 
ORDER BY "heroOrder";

-- ============================================
-- NOTES
-- ============================================
-- 1. Image paths are placeholders - replace with actual Cloudinary URLs
-- 2. Prices are in cents (e.g., 1299900 = TZS 12,999.00)
-- 3. Hero products are ordered 1-5 for the slider
-- 4. All products include proper JSON formatting for images, highlights, etc.
-- 5. Run this file using: psql -h <host> -U <user> -d <database> -f seed.sql
-- ============================================
