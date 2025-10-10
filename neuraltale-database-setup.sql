-- ======================================
-- NEURALTALE E-COMMERCE DATABASE SETUP
-- Comprehensive SQL Script for Neon PostgreSQL
-- =INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug", "createdAt", "updatedAt") VALUES
('iPad Pro 12.9"', 'M2 chip, 128GB, Wi-Fi + Cellular', 'Ultimate iPad experience with M2 chip. Features Liquid Retina XDR display and support for Apple Pencil (2nd generation).', 109900, '{"128GB", "256GB", "512GB", "1TB"}', '{"Space Gray", "Silver"}', '{"Space Gray": "/products/ipad-pro-gray.jpg", "Silver": "/products/ipad-pro-silver.jpg"}', 'tablets', NOW(), NOW()),

('Samsung Galaxy Tab S9', 'Snapdragon 8 Gen 2, 128GB, 11 inch', 'Premium Android tablet with Snapdragon processor. Includes S Pen and features a stunning AMOLED display.', 79900, '{"128GB", "256GB"}', '{"Graphite", "Beige", "Mint"}', '{"Graphite": "/products/galaxy-tab-graphite.jpg", "Beige": "/products/galaxy-tab-beige.jpg", "Mint": "/products/galaxy-tab-mint.jpg"}', 'tablets', NOW(), NOW());=================================

-- Clear existing data (optional - uncomment if you want to start fresh)
-- DELETE FROM "Product";
-- DELETE FROM "Category";

-- ======================================
-- INSERT CATEGORIES
-- ======================================

-- Main Categories
INSERT INTO "Category" (name, slug) VALUES
("`Laptops", "`laptops"),
("`Desktops", "`desktops"),
("`Computer Monitors", "`monitors"),
("`Storage", "`storage"),
("`Components", "`components"),
("`Peripherals", "`peripherals"),
("`Networking", "`networking"),
("`Gadgets", "`gadgets"),
("`Gaming", "`gaming"),
("`Software & Digital", "`software"),

-- Subcategories for Laptops
("`Gaming Laptops", "`gaming-laptops"),
("`Business Laptops", "`business-laptops"),
("`Ultrabooks", "`ultrabooks"),
("`MacBooks", "`macbooks"),

-- Subcategories for Desktops
("`Gaming PCs", "`gaming-pcs"),
("`Workstations", "`workstations"),
("`All-in-One PCs", "`all-in-one"),
("`Mini PCs", "`mini-pcs"),

-- Subcategories for Monitors
("`Gaming Monitors", "`gaming-monitors"),
("`4K Monitors", "`4k-monitors"),
("`Ultrawide Monitors", "`ultrawide-monitors"),
("`Professional Monitors", "`professional-monitors"),

-- Subcategories for Storage
("`SSDs", "`ssds"),
("`Hard Drives", "`hard-drives"),
("`External Storage", "`external-storage"),
("`NAS", "`nas"),

-- Subcategories for Components
("`Processors", "`processors"),
("`Graphics Cards", "`graphics-cards"),
("`Motherboards", "`motherboards"),
("`RAM", "`ram"),

-- Subcategories for Peripherals
("`Keyboards", "`keyboards"),
("`Mice", "`mice"),
("`Headsets", "`headsets"),
("`Webcams", "`webcams"),

-- Subcategories for Networking
("`Routers", "`routers"),
("`WiFi Adapters", "`wifi-adapters"),
("`Switches", "`switches"),
("`Access Points", "`access-points"),

-- Subcategories for Gadgets
("`Smartphones", "`smartphones"),
("`Tablets", "`tablets"),
("`Smartwatches", "`smartwatches"),
("`Audio", "`audio"),
("`Wearables", "`wearables"),
("`Accessories", "`accessories"),

-- Subcategories for Gaming
("`Gaming Chairs", "`gaming-chairs"),
("`Controllers", "`controllers"),
("`VR Headsets", "`vr-headsets"),
("`Gaming Accessories", "`gaming-accessories"),

-- Subcategories for Software
("`Operating Systems", "`operating-systems"),
("`Productivity Software", "`productivity-software"),
("`Security Software", "`security-software"),
("`Digital Games", "`digital-games");

-- ======================================
-- INSERT PRODUCTS - SMARTPHONES
-- ======================================

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug", "createdAt", "updatedAt") VALUES
("`iPhone 15 Pro Max", "`The ultimate iPhone with titanium design, Action Button, and powerful A17 Pro chip.", "`Experience the pinnacle of iPhone innovation with the iPhone 15 Pro Max. Featuring a lightweight titanium design, the revolutionary Action Button for quick access to your favorite features, and the industry-leading A17 Pro chip with 6-core GPU. The advanced camera system captures stunning detail with 5x Telephoto zoom and next-generation portraits with Focus and Depth Control.", 119999, "`{"128GB", "256GB", "512GB", "1TB"}", "`{"Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"}", "`{"Natural Titanium": "/products/iphone-15-pro-natural.jpg", "Blue Titanium": "/products/iphone-15-pro-blue.jpg", "White Titanium": "/products/iphone-15-pro-white.jpg", "Black Titanium": "/products/iphone-15-pro-black.jpg"}", "`smartphones", NOW(), NOW()),

("`Samsung Galaxy S24 Ultra", "`AI-powered smartphone with S Pen, 200MP camera, and brilliant 6.8" Dynamic AMOLED display.", "`Discover the power of Galaxy AI with the Samsung Galaxy S24 Ultra. This premium smartphone features a built-in S Pen for precision control, a pro-grade 200MP camera system with AI-enhanced photography, and a stunning 6.8-inch Dynamic AMOLED 2X display. The Snapdragon 8 Gen 3 processor delivers exceptional performance for gaming, productivity, and creative tasks.", 129999, "`{"256GB", "512GB", "1TB"}", "`{"Titanium Gray", "Titanium Black", "Titanium Violet", "Titanium Yellow"}", "`{"Titanium Gray": "/products/galaxy-s24-ultra-gray.jpg", "Titanium Black": "/products/galaxy-s24-ultra-black.jpg", "Titanium Violet": "/products/galaxy-s24-ultra-violet.jpg", "Titanium Yellow": "/products/galaxy-s24-ultra-yellow.jpg"}", "`smartphones", NOW(), NOW());

-- ======================================
-- INSERT PRODUCTS - LAPTOPS
-- ======================================

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug", "createdAt", "updatedAt") VALUES
("`MacBook Pro 16-inch M4 Pro", "`Professional laptop with M4 Pro chip, Liquid Retina XDR display, and up to 22-hour battery life.", "`Unleash your creativity with the MacBook Pro 16-inch powered by the revolutionary M4 Pro chip. Features a stunning Liquid Retina XDR display with 1000 nits sustained brightness, advanced thermal design for sustained pro performance, and an impressive battery life of up to 22 hours. Perfect for video editing, 3D rendering, and software development.", 249999, "`{"512GB", "1TB", "2TB", "4TB"}", "`{"Space Black", "Silver"}", "`{"Space Black": "/products/macbook-pro-16-space-black.jpg", "Silver": "/products/macbook-pro-16-silver.jpg"}", "`laptops", NOW(), NOW()),

("`Dell XPS 15 OLED", "`Premium Windows laptop with 4K OLED InfinityEdge display and 13th Gen Intel processors.", "`Experience premium performance with the Dell XPS 15 featuring a breathtaking 4K OLED InfinityEdge display with 100% DCI-P3 color accuracy. Powered by 13th Gen Intel Core processors and NVIDIA GeForce RTX graphics, this laptop delivers exceptional performance for creative professionals and power users. The precision-crafted aluminum chassis ensures durability and style.", 189999, "`{"512GB", "1TB", "2TB"}", "`{"Platinum Silver", "Graphite"}", "`{"Platinum Silver": "/products/dell-xps-15-silver.jpg", "Graphite": "/products/dell-xps-15-graphite.jpg"}", "`laptops", NOW(), NOW());

-- ======================================
-- INSERT PRODUCTS - GAMING LAPTOPS
-- ======================================

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug", "createdAt", "updatedAt") VALUES
("`ASUS ROG Strix G15", "`AMD Ryzen 7 5800H, RTX 3060, 144Hz FHD", "`High-performance gaming laptop with AMD Ryzen 7 processor and NVIDIA GeForce RTX 3060 graphics. Features a 144Hz Full HD display for smooth gaming.", 129900, "`{"15.6in", "17.3in"}", "`{"Eclipse Gray", "Electro Punk"}", "`{"Eclipse Gray": "/products/asus-rog-gray.jpg", "Electro Punk": "/products/asus-rog-pink.jpg"}", "`gaming-laptops", NOW(), NOW()),

("`MSI Katana 15", "`Intel Core i7-12650H, RTX 4060, 144Hz", "`Gaming laptop with Intel 12th Gen processor and RTX 4060 graphics. Perfect for gaming and content creation with high refresh rate display.", 149900, "`{"15.6in"}", "`{"Black", "Blue"}", "`{"Black": "/products/msi-katana-black.jpg", "Blue": "/products/msi-katana-blue.jpg"}", "`gaming-laptops", NOW(), NOW());

-- ======================================
-- INSERT PRODUCTS - AUDIO
-- ======================================

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug", "createdAt", "updatedAt") VALUES
("`Sony WH-1000XM5", "`Industry-leading noise canceling headphones with 30-hour battery and crystal-clear calls.", "`Immerse yourself in premium sound with the Sony WH-1000XM5 wireless headphones. Featuring industry-leading noise cancellation, exceptional sound quality with LDAC codec support, and an impressive 30-hour battery life. The lightweight design with soft leather cushioning ensures all-day comfort, while Speak-to-Chat technology automatically pauses music when you start talking.", 39999, "`{"Standard"}", "`{"Black", "Silver"}", "`{"Black": "/products/sony-wh1000xm5-black.jpg", "Silver": "/products/sony-wh1000xm5-silver.jpg"}", "`audio", NOW(), NOW()),

("`AirPods Pro (3rd Generation)", "`Premium wireless earbuds with Active Noise Cancellation and Spatial Audio support.", "`Experience premium wireless audio with AirPods Pro featuring Active Noise Cancellation, Transparency mode, and Personalized Spatial Audio. The H2 chip delivers smarter noise cancellation and superior three-dimensional sound. With up to 6 hours of listening time and the MagSafe Charging Case providing multiple additional charges.", 24999, "`{"Standard"}", "`{"White"}", "`{"White": "/products/airpods-pro-3rd-gen.jpg"}", "`audio", NOW(), NOW());

-- ======================================
-- INSERT PRODUCTS - ACCESSORIES
-- ======================================

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug", "createdAt", "updatedAt") VALUES
("`Logitech MX Master 3S", "`Advanced wireless mouse with 8K DPI sensor, quiet clicks, and 70-day battery life.", "`Achieve precision and comfort with the Logitech MX Master 3S, featuring an 8000 DPI sensor for ultimate tracking accuracy. The 90% quieter clicks provide a premium experience without disturbing others. With 70-day battery life, USB-C fast charging, and seamless connectivity across multiple devices, it is perfect for professionals and creatives.", 9999, "`{"Standard"}", "`{"Graphite", "Pale Gray"}", "`{"Graphite": "/products/mx-master-3s-graphite.jpg", "Pale Gray": "/products/mx-master-3s-pale-gray.jpg"}", "`accessories", NOW(), NOW()),

("`Logitech K380 Multi-Device Keyboard", "`Compact wireless keyboard with Easy-Switch technology for seamless multi-device typing.", "`Type comfortably on the Logitech K380, a compact wireless keyboard designed for multi-device use. Easy-Switch technology lets you connect up to three devices and switch between them with the press of a button. The round concave keys provide a comfortable, familiar typing experience, while the 2-year battery life ensures long-lasting performance.", 3999, "`{"Compact"}", "`{"Dark Grey", "Off-White", "Blue"}", "`{"Dark Grey": "/products/k380-dark-grey.jpg", "Off-White": "/products/k380-off-white.jpg", "Blue": "/products/k380-blue.jpg"}", "`accessories", NOW(), NOW());

-- ======================================
-- INSERT PRODUCTS - TABLETS
-- ======================================

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug") VALUES
("`iPad Pro 12.9"", "`M2 chip, 128GB, Wi-Fi + Cellular", "`Ultimate iPad experience with M2 chip. Features Liquid Retina XDR display and support for Apple Pencil (2nd generation).", 109900, {"`128GB", "`256GB", "`512GB", "`1TB"}, {"`Space Gray", "`Silver"}, "`{"Space Gray": "/products/ipad-pro-gray.jpg", "Silver": "/products/ipad-pro-silver.jpg"}", "`tablets"),

("`Samsung Galaxy Tab S9", "`Snapdragon 8 Gen 2, 128GB, 11 inch", "`Premium Android tablet with Snapdragon processor. Includes S Pen and features a stunning AMOLED display.", 79900, {"`128GB", "`256GB"}, {"`Graphite", "`Beige", "`Mint"}, "`{"Graphite": "/products/galaxy-tab-graphite.jpg", "Beige": "/products/galaxy-tab-beige.jpg", "Mint": "/products/galaxy-tab-mint.jpg"}", "`tablets");

-- ======================================
-- INSERT PRODUCTS - MONITORS
-- ======================================

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug") VALUES
("`LG UltraGear 27GL850", "`27" QHD IPS, 144Hz, 1ms, G-Sync Compatible", "`High-performance gaming monitor with Nano IPS technology. Features 144Hz refresh rate and 1ms response time for competitive gaming.", 44900, "{`27in}", "{`Black}", "`{"Black": "/products/lg-ultragear-black.jpg"}", "`monitors"),

("`Samsung Odyssey G7", "`32" Curved QLED, 240Hz, 1ms, G-Sync", "`Curved gaming monitor with QLED technology and 1000R curvature. Features 240Hz refresh rate for ultimate gaming performance.", 69900, {"`27in", "`32in"}, "{`Black}", "`{"Black": "/products/samsung-odyssey-black.jpg"}", "`monitors");

-- ======================================
-- INSERT PRODUCTS - WEARABLES
-- ======================================

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug") VALUES
("`Apple Watch Series 9", "`GPS + Cellular, 45mm, Titanium", "`Advanced smartwatch with S9 SiP and Double Tap gesture. Features Always-On Retina display and comprehensive health tracking.", 74900, {"`41mm", "`45mm"}, {"`Natural Titanium", "`Blue Titanium", "`Silver"}, "`{"Natural Titanium": "/products/apple-watch-titanium.jpg", "Blue Titanium": "/products/apple-watch-blue.jpg", "Silver": "/products/apple-watch-silver.jpg"}", "`wearables"),

("`Samsung Galaxy Watch6", "`40mm, Bluetooth, Health Monitoring", "`Advanced smartwatch with comprehensive health monitoring. Features sleep tracking, heart rate monitoring, and long battery life.", 32900, {"`40mm", "`44mm"}, {"`Graphite", "`Gold", "`Silver"}, "`{"Graphite": "/products/galaxy-watch-graphite.jpg", "Gold": "/products/galaxy-watch-gold.jpg", "Silver": "/products/galaxy-watch-silver.jpg"}", "`wearables");

-- ======================================
-- INSERT PRODUCTS - COMPONENTS
-- ======================================

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug") VALUES
("`NVIDIA GeForce RTX 4080", "`High-performance graphics card with DLSS 3 and ray tracing support", "`Experience next-generation gaming with the NVIDIA GeForce RTX 4080. Features Ada Lovelace architecture, DLSS 3, and advanced ray tracing for stunning visuals and exceptional performance.", 119900, "{`16GB GDDR6X}", "{`Black}", "`{"Black": "/products/rtx-4080-black.jpg"}", "`graphics-cards"),

("`AMD Ryzen 9 7900X", "`12-Core, 24-Thread Desktop Processor", "`High-performance desktop processor with 12 cores and 24 threads. Built on advanced 5nm process technology for exceptional gaming and productivity performance.", 42900, "{`Standard}", "{`Silver}", "`{"Silver": "/products/ryzen-9-7900x.jpg"}", "`processors"),

("`Corsair Vengeance DDR5-5600", "`32GB (2x16GB) High-Speed Gaming Memory", "`Premium DDR5 memory optimized for gaming and high-performance computing. Features aluminum heat spreaders and Intel XMP 3.0 support.", 15900, {"`16GB", "`32GB", "`64GB"}, {"`Black", "`White"}, "`{"Black": "/products/corsair-vengeance-black.jpg", "White": "/products/corsair-vengeance-white.jpg"}", "`ram");

-- ======================================
-- INSERT PRODUCTS - STORAGE
-- ======================================

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug") VALUES
("`Samsung 980 PRO NVMe SSD", "`2TB PCIe 4.0 Internal SSD with Heatsink", "`Ultra-fast NVMe SSD with PCIe 4.0 interface. Features sequential read speeds up to 7,000 MB/s and built-in heatsink for optimal thermal management.", 19900, {"`1TB", "`2TB", "`4TB"}, "{`Black}", "`{"Black": "/products/samsung-980-pro.jpg"}", "`ssds"),

("`Western Digital Black 4TB HDD", "`High-Performance Desktop Hard Drive", "`Reliable desktop hard drive designed for gaming and high-performance computing. Features 7200 RPM speed and 256MB cache for fast data access.", 12900, {"`1TB", "`2TB", "`4TB", "`6TB"}, "{`Black}", "`{"Black": "/products/wd-black-hdd.jpg"}", "`hard-drives");

-- ======================================
-- INSERT PRODUCTS - NETWORKING
-- ======================================

INSERT INTO "Product" (name, "shortDescription", description, price, sizes, colors, images, "categorySlug") VALUES
("`ASUS AX6000 WiFi 6 Router", "`Dual-Band Wireless Router with AiMesh Support", "`Next-generation WiFi 6 router with AX6000 speeds. Features MU-MIMO technology, adaptive QoS, and AiMesh support for whole-home coverage.", 29900, "{`Standard}", "{`Black}", "`{"Black": "/products/asus-ax6000-router.jpg"}", "`routers"),

("`TP-Link AC1300 USB WiFi Adapter", "`Dual-Band USB 3.0 WiFi Adapter", "`High-speed USB WiFi adapter with AC1300 speeds. Features dual-band connectivity and USB 3.0 interface for maximum performance.", 3999, "{`Compact}", "{`Black}", "`{"Black": "/products/tp-link-ac1300-adapter.jpg"}", "`wifi-adapters");

-- ======================================
-- VERIFICATION QUERIES
-- ======================================

-- Check total counts
SELECT "`Categories" as type, COUNT(*) as count FROM "Category"
UNION ALL
SELECT "`Products" as type, COUNT(*) as count FROM "Product";

-- View categories with product counts
SELECT 
  c.name as category_name,
  c.slug as category_slug,
  COUNT(p.id) as product_count
FROM "Category" c
LEFT JOIN "Product" p ON c.slug = p."categorySlug"
GROUP BY c.id, c.name, c.slug
ORDER BY product_count DESC, c.name;

-- View sample products with pricing
SELECT 
  p.name as product_name,
  ROUND(p.price / 100.0, 2) as price_usd,
  ROUND(p.price * 23.0, 0) as price_tzs,
  c.name as category,
  array_length(p.colors, 1) as color_options,
  array_length(p.sizes, 1) as size_options
FROM "Product" p
JOIN "Category" c ON p."categorySlug" = c.slug
ORDER BY p.price DESC
LIMIT 15;
