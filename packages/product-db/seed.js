import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating categories...');
  
  // Create categories first
  await prisma.category.createMany({
    data: [
      { name: 'Shirts', slug: 'shirts' },
      { name: 'Hoodies', slug: 'hoodies' },
      { name: 'Sneakers', slug: 'sneakers' },
      { name: 'Jackets', slug: 'jackets' },
      { name: 'Accessories', slug: 'accessories' },
    ],
    skipDuplicates: true,
  });

  console.log('Creating products...');
  
  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: 'Adidas CoreFit T-Shirt',
        shortDescription: 'Comfortable cotton t-shirt perfect for everyday wear and light workouts.',
        description: 'The Adidas CoreFit T-Shirt combines style and comfort with its premium cotton blend fabric. Features the iconic Adidas logo and comes in multiple colors. Perfect for casual wear, gym sessions, or layering. Machine washable and designed to maintain its shape and color after multiple washes.',
        price: 3990,
        sizes: ['s', 'm', 'l', 'xl', 'xxl'],
        colors: ['gray', 'purple', 'green'],
        images: {
          gray: '/products/1g.png',
          purple: '/products/1p.png',
          green: '/products/1gr.png',
        },
        categorySlug: 'shirts',
      },
      {
        name: 'Puma Ultra Warm Zip',
        shortDescription: 'Thermal zip-up hoodie designed for cold weather and active lifestyle.',
        description: 'Stay warm and comfortable with the Puma Ultra Warm Zip hoodie. Features advanced thermal technology, moisture-wicking fabric, and a convenient full-zip design. Perfect for outdoor activities, running, or casual wear during colder months. Includes front pockets and adjustable hood.',
        price: 5990,
        sizes: ['s', 'm', 'l', 'xl'],
        colors: ['gray', 'green'],
        images: {
          gray: '/products/2g.png',
          green: '/products/2gr.png',
        },
        categorySlug: 'hoodies',
      },
      {
        name: 'Nike Air Essentials Pullover',
        shortDescription: 'Classic pullover hoodie with Nike Air branding and premium comfort.',
        description: 'The Nike Air Essentials Pullover brings timeless style and modern comfort. Made with soft fleece fabric and featuring the classic Nike Air logo. Includes a spacious kangaroo pocket and adjustable drawstring hood. Perfect for layering or wearing solo.',
        price: 6990,
        sizes: ['s', 'm', 'l'],
        colors: ['green', 'blue', 'black'],
        images: {
          green: '/products/3gr.png',
          blue: '/products/3b.png',
          black: '/products/3bl.png',
        },
        categorySlug: 'hoodies',
      },
      {
        name: 'Nike Dri Flex T-Shirt',
        shortDescription: 'Moisture-wicking performance t-shirt for active individuals.',
        description: 'Experience superior comfort and performance with the Nike Dri Flex T-Shirt. Features Nike\'s advanced Dri-FIT technology to keep you dry and comfortable during intense workouts. Lightweight, breathable fabric with a modern athletic fit.',
        price: 2990,
        sizes: ['s', 'm', 'l'],
        colors: ['white', 'pink'],
        images: {
          white: '/products/4w.png',
          pink: '/products/4p.png',
        },
        categorySlug: 'shirts',
      },
      {
        name: 'Under Armour StormFleece',
        shortDescription: 'Weather-resistant fleece jacket for outdoor adventures.',
        description: 'The Under Armour StormFleece jacket combines warmth with weather protection. Features UA Storm technology to repel water while maintaining breathability. Perfect for hiking, running, or any outdoor activity. Includes zippered pockets and adjustable cuffs.',
        price: 4990,
        sizes: ['s', 'm', 'l'],
        colors: ['red', 'orange', 'black'],
        images: {
          red: '/products/5r.png',
          orange: '/products/5o.png',
          black: '/products/5bl.png',
        },
        categorySlug: 'jackets',
      },
      {
        name: 'Nike Air Force Sneakers',
        shortDescription: 'Classic basketball-inspired sneakers with modern comfort technology.',
        description: 'Step into style with the iconic Nike Air Force sneakers. Features premium leather upper, Air-Sole unit for cushioning, and the timeless silhouette that\'s been a favorite for decades. Perfect for casual wear, streetwear, or light athletic activities.',
        price: 8990,
        sizes: ['37', '38', '39', '40', '41', '42', '43', '44'],
        colors: ['white', 'black', 'gray'],
        images: {
          white: '/products/6w.png',
          black: '/products/6bl.png',
          gray: '/products/6g.png',
        },
        categorySlug: 'sneakers',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Sample data inserted successfully!');
}

main()
  .catch((e) => {
    console.error('Error inserting sample data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });