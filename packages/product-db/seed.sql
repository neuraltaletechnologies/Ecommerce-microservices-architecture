-- Insert Categories first (required for foreign key relationship)
INSERT INTO "Category" (name, slug) VALUES
('Shirts', 'shirts'),
('Hoodies', 'hoodies'),
('Sneakers', 'sneakers'),
('Jackets', 'jackets'),
('Accessories', 'accessories');

-- Insert Products
INSERT INTO "Product" (
  name, 
  "shortDescription", 
  description, 
  price, 
  sizes, 
  colors, 
  images, 
  "categorySlug"
) VALUES
(
  'Adidas CoreFit T-Shirt',
  'Comfortable cotton t-shirt perfect for everyday wear and light workouts.',
  'The Adidas CoreFit T-Shirt combines style and comfort with its premium cotton blend fabric. Features the iconic Adidas logo and comes in multiple colors. Perfect for casual wear, gym sessions, or layering. Machine washable and designed to maintain its shape and color after multiple washes.',
  3990,
  ARRAY['s', 'm', 'l', 'xl', 'xxl'],
  ARRAY['gray', 'purple', 'green'],
  '{"gray": "/products/1g.png", "purple": "/products/1p.png", "green": "/products/1gr.png"}',
  'shirts'
),
(
  'Puma Ultra Warm Zip',
  'Thermal zip-up hoodie designed for cold weather and active lifestyle.',
  'Stay warm and comfortable with the Puma Ultra Warm Zip hoodie. Features advanced thermal technology, moisture-wicking fabric, and a convenient full-zip design. Perfect for outdoor activities, running, or casual wear during colder months. Includes front pockets and adjustable hood.',
  5990,
  ARRAY['s', 'm', 'l', 'xl'],
  ARRAY['gray', 'green'],
  '{"gray": "/products/2g.png", "green": "/products/2gr.png"}',
  'hoodies'
),
(
  'Nike Air Essentials Pullover',
  'Classic pullover hoodie with Nike Air branding and premium comfort.',
  'The Nike Air Essentials Pullover brings timeless style and modern comfort. Made with soft fleece fabric and featuring the classic Nike Air logo. Includes a spacious kangaroo pocket and adjustable drawstring hood. Perfect for layering or wearing solo.',
  6990,
  ARRAY['s', 'm', 'l'],
  ARRAY['green', 'blue', 'black'],
  '{"green": "/products/3gr.png", "blue": "/products/3b.png", "black": "/products/3bl.png"}',
  'hoodies'
),
(
  'Nike Dri Flex T-Shirt',
  'Moisture-wicking performance t-shirt for active individuals.',
  'Experience superior comfort and performance with the Nike Dri Flex T-Shirt. Features Nike''s advanced Dri-FIT technology to keep you dry and comfortable during intense workouts. Lightweight, breathable fabric with a modern athletic fit.',
  2990,
  ARRAY['s', 'm', 'l'],
  ARRAY['white', 'pink'],
  '{"white": "/products/4w.png", "pink": "/products/4p.png"}',
  'shirts'
),
(
  'Under Armour StormFleece',
  'Weather-resistant fleece jacket for outdoor adventures.',
  'The Under Armour StormFleece jacket combines warmth with weather protection. Features UA Storm technology to repel water while maintaining breathability. Perfect for hiking, running, or any outdoor activity. Includes zippered pockets and adjustable cuffs.',
  4990,
  ARRAY['s', 'm', 'l'],
  ARRAY['red', 'orange', 'black'],
  '{"red": "/products/5r.png", "orange": "/products/5o.png", "black": "/products/5bl.png"}',
  'jackets'
),
(
  'Nike Air Force Sneakers',
  'Classic basketball-inspired sneakers with modern comfort technology.',
  'Step into style with the iconic Nike Air Force sneakers. Features premium leather upper, Air-Sole unit for cushioning, and the timeless silhouette that''s been a favorite for decades. Perfect for casual wear, streetwear, or light athletic activities.',
  8990,
  ARRAY['37', '38', '39', '40', '41', '42', '43', '44'],
  ARRAY['white', 'black', 'gray'],
  '{"white": "/products/6w.png", "black": "/products/6bl.png", "gray": "/products/6g.png"}',
  'sneakers'
);