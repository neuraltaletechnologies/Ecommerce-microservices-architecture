/**
 * Seed database with Cloudinary images using Prisma
 */

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_jMfztEK6WVJ3@ep-late-haze-adbmi2n9.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('Clearing existing products and categories...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('✅ Cleared\n');

  // Create categories
  console.log('Creating categories...');
  await prisma.category.createMany({
    data: [
      { name: 'Smartphones', slug: 'smartphones', image: 'https://res.cloudinary.com/dpp83qz2p/image/upload/v1728315180/samples/ecommerce/accessories-bag.jpg', description: 'Latest smartphones and mobile devices' },
      { name: 'Laptops', slug: 'laptops', image: 'https://res.cloudinary.com/dpp83qz2p/image/upload/v1728315180/samples/ecommerce/car-interior-design.jpg', description: 'High-performance laptops and notebooks' },
      { name: 'Audio', slug: 'audio', image: 'https://res.cloudinary.com/dpp83qz2p/image/upload/v1728315179/samples/ecommerce/shoes.png', description: 'Premium headphones and audio devices' },
      { name: 'Tablets', slug: 'tablets', image: 'https://res.cloudinary.com/dpp83qz2p/image/upload/v1728315180/samples/ecommerce/leather-bag-gray.jpg', description: 'Tablets and iPad devices' },
      { name: 'Wearables', slug: 'wearables', image: 'https://res.cloudinary.com/dpp83qz2p/image/upload/v1728315178/samples/ecommerce/analog-classic.jpg', description: 'Smartwatches and fitness trackers' },
    ]
  });
  console.log('✅ Categories created\n');

  // Create products
  console.log('Creating products with Cloudinary images...');
  
  await prisma.product.createMany({
    data: [
      {
        name: 'iPhone 16 Pro Max',
        slug: 'iphone-16-pro-max',
        description: 'The ultimate iPhone with titanium design and A18 Pro chip.',
        long_description: 'Experience the pinnacle of smartphone technology with the iPhone 16 Pro Max.',
        price: 119999,
        compare_price: 129999,
        stock: 50,
        colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
        sizes: ['256GB', '512GB', '1TB'],
        images: {
          "Natural Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1765451591/Screenshot_2025-12-11_141206_f2stm2.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1765451586/Screenshot_2025-12-11_141214_irn5bc.png"],
          "Blue Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1765451584/Screenshot_2025-12-11_141223_vhdw2c.png"],
          "White Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1765451422/Screenshot_2025-12-11_140914_pq3yg2.png"],
          "Black Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1765451421/Screenshot_2025-12-11_140936_plrgbu.png"]
        },
        category: 'smartphones',
        is_hero: true,
        hero_order: 1
      },
      {
        name: 'MacBook Pro 14" M4',
        slug: 'macbook-pro-14-m4',
        description: 'Supercharged for pros with M4 chip and Liquid Retina XDR display.',
        long_description: 'The MacBook Pro 14-inch with M4 chip delivers groundbreaking performance.',
        price: 199999,
        compare_price: 219999,
        stock: 30,
        colors: ['Space Black', 'Silver'],
        sizes: ['16GB RAM 512GB SSD', '24GB RAM 1TB SSD', '32GB RAM 2TB SSD'],
        images: {
          "Space Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1765451418/Screenshot_2025-12-11_140942_motdb4.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1765451351/image_2025-12-11_140859358_iyv0le.png"],
          "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315188/samples/coffee.jpg"]
        },
        category: 'laptops',
        is_hero: true,
        hero_order: 2
      },
      {
        name: 'AirPods Pro (3rd Gen)',
        slug: 'airpods-pro-3rd-gen',
        description: 'Premium wireless earbuds with advanced active noise cancellation.',
        long_description: 'AirPods Pro (3rd generation) feature adaptive audio.',
        price: 24999,
        compare_price: null,
        stock: 100,
        colors: ['White'],
        sizes: ['Standard'],
        images: {
          "White": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315188/samples/cup-on-a-table.jpg", "https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315188/samples/dessert-on-a-plate.jpg"]
        },
        category: 'audio',
        is_hero: true,
        hero_order: 3
      },
      {
        name: 'iPad Pro 13" M4',
        slug: 'ipad-pro-13-m4',
        description: 'The ultimate iPad experience with M4 chip.',
        long_description: 'iPad Pro with the ultra-powerful M4 chip.',
        price: 109999,
        compare_price: 119999,
        stock: 40,
        colors: ['Space Gray', 'Silver'],
        sizes: ['256GB', '512GB', '1TB', '2TB'],
        images: {
          "Space Gray": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315187/samples/man-portrait.jpg", "https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315187/samples/chair-and-coffee-table.jpg"],
          "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315187/samples/outdoor-woman.jpg"]
        },
        category: 'tablets',
        is_hero: true,
        hero_order: 4
      },
      {
        name: 'Apple Watch Ultra 2',
        slug: 'apple-watch-ultra-2',
        description: 'The most rugged and capable Apple Watch.',
        long_description: 'Apple Watch Ultra 2 features precision GPS.',
        price: 79999,
        compare_price: null,
        stock: 60,
        colors: ['Titanium'],
        sizes: ['49mm'],
        images: {
          "Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315178/samples/ecommerce/analog-classic.jpg", "https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315186/samples/smile.jpg"]
        },
        category: 'wearables',
        is_hero: true,
        hero_order: 5
      },
      // Regular products
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Premium Android flagship with S Pen.',
        long_description: 'Samsung Galaxy S24 Ultra combines powerful performance.',
        price: 129999,
        compare_price: 139999,
        stock: 45,
        colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet'],
        sizes: ['256GB', '512GB', '1TB'],
        images: {
          "Titanium Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315186/samples/balloons.jpg"],
          "Titanium Gray": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315184/samples/shoe.jpg"],
          "Titanium Violet": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315182/samples/two-ladies.jpg"]
        },
        category: 'smartphones',
        is_hero: false,
        hero_order: null
      },
      {
        name: 'Dell XPS 15',
        slug: 'dell-xps-15',
        description: 'Premium Windows laptop.',
        long_description: 'Dell XPS 15 combines power and portability.',
        price: 159999,
        compare_price: 169999,
        stock: 25,
        colors: ['Platinum Silver', 'Graphite'],
        sizes: ['16GB RAM 512GB SSD', '32GB RAM 1TB SSD'],
        images: {
          "Platinum Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315180/samples/imagecon-group.jpg"],
          "Graphite": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315180/samples/cloudinary-group.jpg"]
        },
        category: 'laptops',
        is_hero: false,
        hero_order: null
      },
      {
        name: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise canceling headphones.',
        long_description: 'Sony WH-1000XM5 delivers premium audio experience.',
        price: 39999,
        compare_price: 44999,
        stock: 80,
        colors: ['Black', 'Silver'],
        sizes: ['Standard'],
        images: {
          "Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315179/samples/people/jazz.jpg"],
          "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315179/samples/bike.jpg"]
        },
        category: 'audio',
        is_hero: false,
        hero_order: null
      },
      {
        name: 'Samsung Galaxy Tab S9',
        slug: 'samsung-galaxy-tab-s9',
        description: 'Powerful Android tablet with S Pen.',
        long_description: 'Samsung Galaxy Tab S9 features 11-inch display.',
        price: 79999,
        compare_price: 84999,
        stock: 35,
        colors: ['Graphite', 'Beige'],
        sizes: ['128GB', '256GB'],
        images: {
          "Graphite": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315179/samples/people/smiling-man.jpg"],
          "Beige": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315178/samples/people/kitchen-bar.jpg"]
        },
        category: 'tablets',
        is_hero: false,
        hero_order: null
      }
    ]
  });

  console.log('✅ Products created with Cloudinary images\n');
  console.log('✨ Database seeding complete!');
  console.log('   - 5 categories created');
  console.log('   - 9 products created (5 hero, 4 regular)');
  console.log('   - All images are using Cloudinary URLs');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
