import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_jMfztEK6WVJ3@ep-late-haze-adbmi2n9.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

const baseUrl = "https://res.cloudinary.com/dpp83qz2p/image/upload";

async function main() {
  console.log('🌱 Seeding database with actual Cloudinary images...\n');

  // Clear existing data
  console.log('Clearing existing products and categories...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log('✅ Cleared\n');

  // Create categories
  console.log('Creating categories...');
  await prisma.category.createMany({
    data: [
      { name: 'Smartphones', slug: 'smartphones', image: `${baseUrl}/category-smartphones.jpg`, description: 'Latest smartphones and mobile devices' },
      { name: 'Laptops', slug: 'laptops', image: `${baseUrl}/category-laptops.jpg`, description: 'High-performance laptops and notebooks' },
      { name: 'Audio', slug: 'audio', image: `${baseUrl}/category-audio.jpg`, description: 'Premium headphones and audio devices' },
      { name: 'Tablets', slug: 'tablets', image: `${baseUrl}/category-tablets.jpg`, description: 'Tablets and iPad devices' },
      { name: 'Wearables', slug: 'wearables', image: `${baseUrl}/category-wearables.jpg`, description: 'Smartwatches and fitness trackers' },
    ]
  });
  console.log('✅ Categories created\n');

  // Create products with actual Cloudinary images
  console.log('Creating products...');
  
  const products = [
    {
      name: 'iPhone 16 Pro Max',
      shortDescription: 'The ultimate iPhone with titanium design and A18 Pro chip.',
      description: 'Experience the pinnacle of smartphone technology with the iPhone 16 Pro Max. Featuring a stunning 6.7-inch Super Retina XDR display, revolutionary A18 Pro chip, advanced camera system with 48MP main, ultra-wide, and telephoto lenses. Titanium design, USB-C connectivity, and all-day battery life.',
      price: 119999,
      stock: 50,
      colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
      sizes: ['256GB', '512GB', '1TB'],
      images: {
        "Natural Titanium": [
          `${baseUrl}/iphone-16-pro-natural-1.png`,
          `${baseUrl}/iphone-16-pro-natural-2.png`
        ],
        "Blue Titanium": [
          `${baseUrl}/iphone-16-pro-blue-1.png`,
          `${baseUrl}/iphone-16-pro-blue-2.png`
        ],
        "White Titanium": [
          `${baseUrl}/iphone-16-pro-white-1.png`,
          `${baseUrl}/iphone-16-pro-white-2.png`
        ],
        "Black Titanium": [
          `${baseUrl}/iphone-16-pro-black-1.png`,
          `${baseUrl}/iphone-16-pro-black-2.png`
        ]
      },
      categorySlug: 'smartphones',
      isHeroProduct: true,
      heroOrder: 1
    },
    {
      name: 'MacBook Pro 14" M4',
      shortDescription: 'Supercharged for pros with M4 chip and Liquid Retina XDR display.',
      description: 'The MacBook Pro 14-inch with M4 chip delivers groundbreaking performance and battery life. Features stunning Liquid Retina XDR display, up to 32GB unified memory, advanced thermal design, comprehensive connectivity including Thunderbolt 5, HDMI, and SD card slot.',
      price: 199999,
      stock: 30,
      colors: ['Space Black', 'Silver'],
      sizes: ['16GB RAM 512GB SSD', '24GB RAM 1TB SSD', '32GB RAM 2TB SSD'],
      images: {
        "Space Black": [
          `${baseUrl}/macbook-pro-14-black-1.png`,
          `${baseUrl}/macbook-pro-14-black-2.png`
        ],
        "Silver": [
          `${baseUrl}/macbook-pro-14-silver-1.png`,
          `${baseUrl}/macbook-pro-14-silver-2.png`
        ]
      },
      categorySlug: 'laptops',
      isHeroProduct: true,
      heroOrder: 2
    },
    {
      name: 'AirPods Pro (3rd Gen)',
      shortDescription: 'Premium wireless earbuds with advanced active noise cancellation.',
      description: 'AirPods Pro (3rd generation) feature adaptive audio that adjusts noise control based on your environment. USB-C charging, improved H2 chip for better sound quality, enhanced Find My features with precision finding, and up to 6 hours of listening time.',
      price: 24999,
      stock: 100,
      colors: ['White'],
      sizes: ['Standard'],
      images: {
        "White": [
          `${baseUrl}/airpods-pro-3-1.png`,
          `${baseUrl}/airpods-pro-3-2.png`
        ]
      },
      categorySlug: 'audio',
      isHeroProduct: true,
      heroOrder: 3
    },
    {
      name: 'iPad Pro 13" M4',
      shortDescription: 'The ultimate iPad experience with M4 chip and stunning display.',
      description: 'iPad Pro with the ultra-powerful M4 chip and breathtaking 13-inch Ultra Retina XDR display. Features ProMotion technology, 12MP camera system, Face ID, and support for Apple Pencil Pro and Magic Keyboard.',
      price: 109999,
      stock: 40,
      colors: ['Space Gray', 'Silver'],
      sizes: ['256GB', '512GB', '1TB', '2TB'],
      images: {
        "Space Gray": [
          `${baseUrl}/ipad-pro-13-gray-1.png`,
          `${baseUrl}/ipad-pro-13-gray-2.png`
        ],
        "Silver": [
          `${baseUrl}/ipad-pro-13-silver-1.png`,
          `${baseUrl}/ipad-pro-13-silver-2.png`
        ]
      },
      categorySlug: 'tablets',
      isHeroProduct: true,
      heroOrder: 4
    },
    {
      name: 'Apple Watch Ultra 2',
      shortDescription: 'The most rugged and capable Apple Watch for athletes and adventurers.',
      description: 'Apple Watch Ultra 2 features precision GPS, depth gauge, water temperature sensor, and a brilliant Always-On Retina display. 49mm titanium case, Action button for quick access to workouts, 36 hours of battery life.',
      price: 79999,
      stock: 60,
      colors: ['Titanium'],
      sizes: ['49mm'],
      images: {
        "Titanium": [
          `${baseUrl}/watch-ultra-2-1.png`,
          `${baseUrl}/watch-ultra-2-2.png`
        ]
      },
      categorySlug: 'wearables',
      isHeroProduct: true,
      heroOrder: 5
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      shortDescription: 'Premium Android flagship with S Pen and AI features.',
      description: 'Samsung Galaxy S24 Ultra combines powerful performance with Galaxy AI features. Features 6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 3 processor, 200MP camera system, integrated S Pen, and titanium frame.',
      price: 129999,
      stock: 45,
      colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet'],
      sizes: ['256GB', '512GB', '1TB'],
      images: {
        "Titanium Black": [`${baseUrl}/galaxy-s24-ultra-black-1.png`],
        "Titanium Gray": [`${baseUrl}/galaxy-s24-ultra-gray-1.png`],
        "Titanium Violet": [`${baseUrl}/galaxy-s24-ultra-violet-1.png`]
      },
      categorySlug: 'smartphones',
      isHeroProduct: false,
      heroOrder: null
    },
    {
      name: 'Dell XPS 15',
      shortDescription: 'Premium Windows laptop with stunning InfinityEdge display.',
      description: 'Dell XPS 15 combines power and portability. Features 15.6-inch InfinityEdge display, Intel Core i7 processor, NVIDIA RTX graphics, up to 64GB RAM, and premium aluminum chassis.',
      price: 159999,
      stock: 25,
      colors: ['Platinum Silver', 'Graphite'],
      sizes: ['16GB RAM 512GB SSD', '32GB RAM 1TB SSD'],
      images: {
        "Platinum Silver": [`${baseUrl}/dell-xps-15-silver-1.png`],
        "Graphite": [`${baseUrl}/dell-xps-15-graphite-1.png`]
      },
      categorySlug: 'laptops',
      isHeroProduct: false,
      heroOrder: null
    },
    {
      name: 'Sony WH-1000XM5',
      shortDescription: 'Industry-leading noise canceling headphones with exceptional sound quality.',
      description: 'Sony WH-1000XM5 delivers premium audio experience with industry-leading noise cancellation. Features 8 microphones for crystal-clear calls, 30-hour battery life, multipoint connection, and LDAC support.',
      price: 39999,
      stock: 80,
      colors: ['Black', 'Silver'],
      sizes: ['Standard'],
      images: {
        "Black": [`${baseUrl}/sony-wh1000xm5-black-1.png`],
        "Silver": [`${baseUrl}/sony-wh1000xm5-silver-1.png`]
      },
      categorySlug: 'audio',
      isHeroProduct: false,
      heroOrder: null
    },
    {
      name: 'Samsung Galaxy Tab S9',
      shortDescription: 'Powerful Android tablet with S Pen included.',
      description: 'Samsung Galaxy Tab S9 features 11-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2 processor, included S Pen, IP68 water resistance, and DeX mode for desktop-like productivity.',
      price: 79999,
      stock: 35,
      colors: ['Graphite', 'Beige'],
      sizes: ['128GB', '256GB'],
      images: {
        "Graphite": [`${baseUrl}/galaxy-tab-s9-graphite-1.png`],
        "Beige": [`${baseUrl}/galaxy-tab-s9-beige-1.png`]
      },
      categorySlug: 'tablets',
      isHeroProduct: false,
      heroOrder: null
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`✅ Created: ${product.name}`);
  }

  console.log('\n✨ Database seeding complete!');
  console.log(`   - 5 categories created`);
  console.log(`   - ${products.length} products created (5 hero, 4 regular)`);
  console.log('   - All images using Cloudinary URLs');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
