-- Sample Data for Neon PostgreSQL (Product Database)
-- Run this after running prisma migrate

-- Clear existing data (optional - remove if you want to keep existing data)
DELETE FROM "Product";
DELETE FROM "Category";

-- Insert Categories
INSERT INTO "Category" (name, slug) VALUES
('Laptops', 'laptops'),
('Smartphones', 'smartphones'),
('Tablets', 'tablets'),
('Headphones', 'headphones'),
('Smartwatches', 'smartwatches'),
('Cameras', 'cameras');

-- Insert Laptops
INSERT INTO "Product" (
  name, 
  "shortDescription", 
  description, 
  price, 
  sizes, 
  colors, 
  images, 
  "techHighlights",
  "boxContents",
  "productFeatures",
  "technicalSpecs",
  certifications,
  "categorySlug",
  "createdAt",
  "updatedAt"
) VALUES
(
  'MacBook Pro 16"',
  'Powerful laptop with M3 Pro chip',
  'The MacBook Pro 16" delivers exceptional performance with the revolutionary M3 Pro chip. Perfect for professionals who demand the best in computing power, battery life, and display quality.',
  249900,
  ARRAY['512GB', '1TB', '2TB'],
  ARRAY['Space Gray', 'Silver'],
  '{"main": "/products/1g.png", "gallery": ["/products/1g.png", "/products/1gr.png", "/products/1p.png"]}',
  '[{"label": "M3 Pro Chip", "icon": "Cpu"}, {"label": "16GB RAM", "icon": "MemoryStick"}, {"label": "18hr Battery", "icon": "Battery"}]',
  '["MacBook Pro 16\"", "USB-C Charge Cable (2m)", "140W USB-C Power Adapter", "Quick Start Guide"]',
  '[{"title": "Incredible Performance", "description": "The M3 Pro chip delivers up to 40% faster performance than M1 Pro with industry-leading power efficiency."}, {"title": "Stunning Display", "description": "16.2-inch Liquid Retina XDR display with 1000 nits sustained brightness and 1600 nits peak brightness for HDR content."}]',
  '{"Display": [{"label": "Size", "value": "16.2-inch"}, {"label": "Resolution", "value": "3456 x 2234"}, {"label": "Technology", "value": "Liquid Retina XDR"}], "Performance": [{"label": "Chip", "value": "Apple M3 Pro"}, {"label": "RAM", "value": "16GB Unified"}, {"label": "Storage", "value": "512GB - 2TB SSD"}], "Battery": [{"label": "Capacity", "value": "100Wh"}, {"label": "Life", "value": "Up to 18 hours"}]}',
  '[{"label": "Energy Star Certified", "icon": "ShieldCheck"}, {"label": "EPEAT Gold", "icon": "Award"}]',
  'laptops',
  NOW(),
  NOW()
),
(
  'Dell XPS 15',
  'Premium Windows laptop with stunning OLED display',
  'Experience the best of Windows with the Dell XPS 15. Featuring a gorgeous OLED display, powerful Intel Core i7 processor, and premium build quality.',
  189900,
  ARRAY['512GB', '1TB'],
  ARRAY['Platinum Silver', 'Graphite'],
  '{"main": "/products/2g.png", "gallery": ["/products/2g.png", "/products/2gr.png"]}',
  '[{"label": "Intel Core i7", "icon": "Cpu"}, {"label": "32GB RAM", "icon": "MemoryStick"}, {"label": "OLED Display", "icon": "Monitor"}]',
  '["Dell XPS 15 Laptop", "130W AC Adapter", "USB-C Cable", "Documentation"]',
  '[{"title": "Stunning OLED Display", "description": "15.6-inch 3.5K OLED with 100% DCI-P3 color gamut and HDR 500 True Black certification."}, {"title": "All-Day Battery", "description": "Up to 13 hours of battery life with 86Wh battery capacity."}]',
  '{"Display": [{"label": "Size", "value": "15.6-inch"}, {"label": "Resolution", "value": "3456 x 2160"}, {"label": "Technology", "value": "OLED InfinityEdge"}], "Performance": [{"label": "Processor", "value": "Intel Core i7-13700H"}, {"label": "RAM", "value": "32GB DDR5"}, {"label": "Graphics", "value": "NVIDIA RTX 4060"}]}',
  '[{"label": "TCO Certified", "icon": "ShieldCheck"}, {"label": "ISO 9001", "icon": "Award"}]',
  'laptops',
  NOW(),
  NOW()
);

-- Insert Smartphones
INSERT INTO "Product" (
  name, 
  "shortDescription", 
  description, 
  price, 
  sizes, 
  colors, 
  images, 
  "techHighlights",
  "boxContents",
  "productFeatures",
  "technicalSpecs",
  certifications,
  "categorySlug",
  "createdAt",
  "updatedAt"
) VALUES
(
  'iPhone 15 Pro',
  'Titanium design with A17 Pro chip',
  'The iPhone 15 Pro introduces a stunning titanium design, the powerful A17 Pro chip, and an advanced camera system. The action button gives you quick access to your favorite features.',
  99900,
  ARRAY['128GB', '256GB', '512GB', '1TB'],
  ARRAY['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
  '{"main": "/products/3b.png", "gallery": ["/products/3b.png", "/products/3bl.png", "/products/3gr.png"]}',
  '[{"label": "A17 Pro Chip", "icon": "Cpu"}, {"label": "48MP Camera", "icon": "Camera"}, {"label": "Titanium", "icon": "Shield"}]',
  '["iPhone 15 Pro", "USB-C to USB-C Cable", "Documentation"]',
  '[{"title": "A17 Pro Chip", "description": "The most powerful chip ever in a smartphone with hardware-accelerated ray tracing and console-level gaming."}, {"title": "Pro Camera System", "description": "48MP main camera with 5x telephoto zoom and improved Night mode."}]',
  '{"Display": [{"label": "Size", "value": "6.1-inch"}, {"label": "Type", "value": "Super Retina XDR OLED"}, {"label": "Refresh Rate", "value": "120Hz ProMotion"}], "Camera": [{"label": "Main", "value": "48MP f/1.78"}, {"label": "Ultra Wide", "value": "12MP f/2.2"}, {"label": "Telephoto", "value": "12MP f/2.8, 5x zoom"}], "Battery": [{"label": "Video Playback", "value": "Up to 23 hours"}, {"label": "Charging", "value": "USB-C, MagSafe, Qi"}]}',
  '[{"label": "CE Certified", "icon": "ShieldCheck"}, {"label": "IP68 Rating", "icon": "Droplet"}]',
  'smartphones',
  NOW(),
  NOW()
),
(
  'Samsung Galaxy S24 Ultra',
  'Galaxy AI. Epic in every way.',
  'Meet the Samsung Galaxy S24 Ultra with built-in Galaxy AI. The most powerful Galaxy phone yet with an integrated S Pen, 200MP camera, and stunning display.',
  119900,
  ARRAY['256GB', '512GB', '1TB'],
  ARRAY['Titanium Black', 'Titanium Gray', 'Titanium Violet', 'Titanium Yellow'],
  '{"main": "/products/4p.png", "gallery": ["/products/4p.png", "/products/4w.png"]}',
  '[{"label": "Snapdragon 8 Gen 3", "icon": "Cpu"}, {"label": "200MP Camera", "icon": "Camera"}, {"label": "S Pen Built-in", "icon": "Pen"}]',
  '["Galaxy S24 Ultra", "S Pen", "USB-C Cable", "SIM Ejector Tool", "Quick Start Guide"]',
  '[{"title": "Galaxy AI", "description": "Transform the way you search, work and create with AI capabilities built right into your phone."}, {"title": "200MP Camera", "description": "Capture stunning detail with the 200MP sensor and enhanced AI photo processing."}]',
  '{"Display": [{"label": "Size", "value": "6.8-inch"}, {"label": "Type", "value": "Dynamic AMOLED 2X"}, {"label": "Brightness", "value": "2600 nits peak"}], "Camera": [{"label": "Main", "value": "200MP OIS"}, {"label": "Ultra Wide", "value": "12MP"}, {"label": "Telephoto", "value": "50MP 5x + 10MP 3x"}], "Performance": [{"label": "Processor", "value": "Snapdragon 8 Gen 3"}, {"label": "RAM", "value": "12GB"}]}',
  '[{"label": "IP68 Certified", "icon": "Droplet"}, {"label": "Gorilla Glass Armor", "icon": "Shield"}]',
  'smartphones',
  NOW(),
  NOW()
);

-- Insert Tablets
INSERT INTO "Product" (
  name, 
  "shortDescription", 
  description, 
  price, 
  sizes, 
  colors, 
  images, 
  "techHighlights",
  "boxContents",
  "productFeatures",
  "technicalSpecs",
  certifications,
  "categorySlug",
  "createdAt",
  "updatedAt"
) VALUES
(
  'iPad Pro 12.9"',
  'The ultimate iPad experience with M2 chip',
  'The iPad Pro features the powerful M2 chip, stunning Liquid Retina XDR display, and all-day battery life. Compatible with Apple Pencil Pro and Magic Keyboard.',
  109900,
  ARRAY['128GB', '256GB', '512GB', '1TB', '2TB'],
  ARRAY['Space Gray', 'Silver'],
  '{"main": "/products/5bl.png", "gallery": ["/products/5bl.png", "/products/5o.png", "/products/5r.png"]}',
  '[{"label": "M2 Chip", "icon": "Cpu"}, {"label": "12.9\" Display", "icon": "Monitor"}, {"label": "All-Day Battery", "icon": "Battery"}]',
  '["iPad Pro", "USB-C Charge Cable (1m)", "20W USB-C Power Adapter"]',
  '[{"title": "M2 Performance", "description": "8-core CPU and 10-core GPU deliver desktop-class performance for creative workflows."}, {"title": "Liquid Retina XDR", "description": "Extreme dynamic range with 1000 nits full-screen brightness and 1600 nits peak brightness."}]',
  '{"Display": [{"label": "Size", "value": "12.9-inch"}, {"label": "Technology", "value": "Liquid Retina XDR"}, {"label": "Refresh Rate", "value": "120Hz ProMotion"}], "Performance": [{"label": "Chip", "value": "Apple M2"}, {"label": "Storage", "value": "Up to 2TB"}], "Connectivity": [{"label": "Ports", "value": "Thunderbolt / USB 4"}, {"label": "Wireless", "value": "Wi-Fi 6E, 5G"}]}',
  '[{"label": "Energy Star", "icon": "ShieldCheck"}, {"label": "RoHS Compliant", "icon": "Award"}]',
  'tablets',
  NOW(),
  NOW()
);

-- Insert Headphones
INSERT INTO "Product" (
  name, 
  "shortDescription", 
  description, 
  price, 
  sizes, 
  colors, 
  images, 
  "techHighlights",
  "boxContents",
  "productFeatures",
  "technicalSpecs",
  certifications,
  "categorySlug",
  "createdAt",
  "updatedAt"
) VALUES
(
  'Sony WH-1000XM5',
  'Industry-leading noise cancellation',
  'Premium wireless headphones with industry-leading noise cancellation, exceptional sound quality, and all-day comfort. Perfect for music lovers and frequent travelers.',
  39900,
  ARRAY['One Size'],
  ARRAY['Black', 'Silver'],
  '{"main": "/products/6g.png", "gallery": ["/products/6g.png", "/products/6w.png"]}',
  '[{"label": "30hr Battery", "icon": "Battery"}, {"label": "ANC", "icon": "Volume2"}, {"label": "Hi-Res Audio", "icon": "Music"}]',
  '["WH-1000XM5 Headphones", "Carrying Case", "USB-C Cable", "Audio Cable (3.5mm)", "Airplane Adapter"]',
  '[{"title": "Best Noise Cancellation", "description": "Two processors controlling 8 microphones for unprecedented noise canceling performance."}, {"title": "Exceptional Sound", "description": "Integrated Processor V1 and 30mm driver unit for premium sound quality."}]',
  '{"Audio": [{"label": "Driver", "value": "30mm dynamic"}, {"label": "Frequency", "value": "4Hz-40kHz"}, {"label": "Codec", "value": "LDAC, AAC, SBC"}], "Battery": [{"label": "Playback", "value": "Up to 30 hours"}, {"label": "Quick Charge", "value": "3min = 3hrs"}], "Features": [{"label": "ANC", "value": "8-microphone system"}, {"label": "Controls", "value": "Touch sensor"}]}',
  '[{"label": "Hi-Res Audio", "icon": "Award"}, {"label": "CE Certified", "icon": "ShieldCheck"}]',
  'headphones',
  NOW(),
  NOW()
),
(
  'AirPods Max',
  'Computational audio. Effortless magic.',
  'AirPods Max reimagine over-ear headphones with breathtaking audio quality, adaptive EQ, Active Noise Cancellation, and spatial audio.',
  54900,
  ARRAY['One Size'],
  ARRAY['Space Gray', 'Silver', 'Pink', 'Green', 'Sky Blue'],
  '{"main": "/products/7g.png", "gallery": ["/products/7g.png", "/products/7p.png"]}',
  '[{"label": "Spatial Audio", "icon": "Headphones"}, {"label": "20hr Battery", "icon": "Battery"}, {"label": "Premium Build", "icon": "Award"}]',
  '["AirPods Max", "Smart Case", "Lightning to USB-C Cable", "Documentation"]',
  '[{"title": "Spatial Audio", "description": "Dynamic head tracking creates theater-like sound that surrounds you."}, {"title": "Premium Materials", "description": "Stainless steel frame with breathable knit mesh canopy and memory foam ear cushions."}]',
  '{"Audio": [{"label": "Driver", "value": "40mm Apple-designed"}, {"label": "Features", "value": "Spatial Audio, ANC"}, {"label": "Modes", "value": "Transparency, ANC, Off"}], "Design": [{"label": "Weight", "value": "384.8g"}, {"label": "Materials", "value": "Aluminum, Stainless Steel"}], "Battery": [{"label": "Listening", "value": "Up to 20 hours"}, {"label": "Charging", "value": "Lightning"}]}',
  '[{"label": "Apple Quality", "icon": "Award"}, {"label": "Energy Efficient", "icon": "ShieldCheck"}]',
  'headphones',
  NOW(),
  NOW()
);

-- Insert Smartwatches
INSERT INTO "Product" (
  name, 
  "shortDescription", 
  description, 
  price, 
  sizes, 
  colors, 
  images, 
  "techHighlights",
  "boxContents",
  "productFeatures",
  "technicalSpecs",
  certifications,
  "categorySlug",
  "createdAt",
  "updatedAt"
) VALUES
(
  'Apple Watch Series 9',
  'Powerful health insights. Beautiful design.',
  'The Apple Watch Series 9 features the new S9 chip, brighter display, and advanced health sensors including temperature sensing and ECG.',
  39900,
  ARRAY['41mm', '45mm'],
  ARRAY['Midnight', 'Starlight', 'Silver', 'Pink', 'Product RED'],
  '{"main": "/products/8b.png", "gallery": ["/products/8b.png", "/products/8gr.png"]}',
  '[{"label": "S9 Chip", "icon": "Cpu"}, {"label": "18hr Battery", "icon": "Battery"}, {"label": "Health Sensors", "icon": "Activity"}]',
  '["Apple Watch Series 9", "Sport Band", "Magnetic Charging Cable", "Quick Start Guide"]',
  '[{"title": "Double Tap Gesture", "description": "A magical new way to interact with your Apple Watch without touching the display."}, {"title": "Advanced Health", "description": "ECG, blood oxygen, temperature sensing, and advanced sleep tracking."}]',
  '{"Display": [{"label": "Type", "value": "Always-On Retina"}, {"label": "Brightness", "value": "Up to 2000 nits"}], "Health": [{"label": "Sensors", "value": "ECG, Blood Oxygen, Temperature"}, {"label": "Safety", "value": "Fall Detection, Crash Detection"}], "Battery": [{"label": "Life", "value": "Up to 18 hours"}, {"label": "Fast Charge", "value": "0-80% in 45min"}]}',
  '[{"label": "ISO 13485", "icon": "ShieldCheck"}, {"label": "Swim Proof", "icon": "Droplet"}]',
  'smartwatches',
  NOW(),
  NOW()
);

-- Insert Cameras
INSERT INTO "Product" (
  name, 
  "shortDescription", 
  description, 
  price, 
  sizes, 
  colors, 
  images, 
  "techHighlights",
  "boxContents",
  "productFeatures",
  "technicalSpecs",
  certifications,
  "categorySlug",
  "createdAt",
  "updatedAt"
) VALUES
(
  'Sony Alpha 7 IV',
  'Professional full-frame mirrorless camera',
  'The Alpha 7 IV combines professional-grade features with remarkable usability. 33MP full-frame sensor, 10fps shooting, and advanced autofocus make it perfect for both photo and video.',
  249900,
  ARRAY['Body Only', 'With 28-70mm Lens'],
  ARRAY['Black'],
  '{"main": "/products/1g.png", "gallery": ["/products/1g.png"]}',
  '[{"label": "33MP Sensor", "icon": "Camera"}, {"label": "4K 60fps", "icon": "Video"}, {"label": "693 AF Points", "icon": "Focus"}]',
  '["Sony Alpha 7 IV Body", "Rechargeable Battery", "AC Adapter", "USB Cable", "Shoulder Strap", "Eyepiece Cup", "Cable Protector", "Body Cap", "Accessory Shoe Cap"]',
  '[{"title": "Advanced AF System", "description": "693 phase-detection AF points covering approximately 94% of the image area with Real-time Eye AF."}, {"title": "Professional Video", "description": "4K 60p recording with full pixel readout and no pixel binning for exceptional detail."}]',
  '{"Sensor": [{"label": "Type", "value": "35mm Full-Frame Exmor R CMOS"}, {"label": "Resolution", "value": "33.0 megapixels"}], "Performance": [{"label": "ISO Range", "value": "100-51200 (expandable to 50-204800)"}, {"label": "Shooting Speed", "value": "10fps continuous"}], "Video": [{"label": "Recording", "value": "4K 60p / Full HD 120p"}, {"label": "Format", "value": "XAVC S, XAVC HS"}]}',
  '[{"label": "CE Certified", "icon": "ShieldCheck"}]',
  'cameras',
  NOW(),
  NOW()
);
