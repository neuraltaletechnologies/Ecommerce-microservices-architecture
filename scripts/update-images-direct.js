/**
 * Update product images via direct database connection
 * This bypasses Prisma Studio and updates images directly
 */

const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://neondb_owner:npg_jMfztEK6WVJ3@ep-late-haze-adbmi2n9.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
});

const updates = [
  {
    name: 'iPhone 16 Pro Max',
    images: {
      "Natural Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-natural-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-natural-2.png"],
      "Blue Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-blue-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-blue-2.png"],
      "White Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-white-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-white-2.png"],
      "Black Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-black-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-black-2.png"]
    }
  },
  {
    name: 'MacBook Pro 14" M4',
    images: {
      "Space Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-black-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-black-2.png"],
      "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-silver-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-silver-2.png"]
    }
  },
  {
    name: 'AirPods Pro (3rd Gen)',
    images: {
      "White": ["https://res.cloudinary.com/dpp83qz2p/image/upload/airpods-pro-3-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/airpods-pro-3-2.png"]
    }
  },
  {
    name: 'iPad Pro 13" M4',
    images: {
      "Space Gray": ["https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-gray-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-gray-2.png"],
      "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-silver-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-silver-2.png"]
    }
  },
  {
    name: 'Apple Watch Ultra 2',
    images: {
      "Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/watch-ultra-2-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/watch-ultra-2-2.png"]
    }
  }
];

async function updateImages() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    for (const update of updates) {
      const result = await client.query(
        'UPDATE "Product" SET images = $1 WHERE name = $2 RETURNING name',
        [JSON.stringify(update.images), update.name]
      );
      
      if (result.rowCount > 0) {
        console.log(`✅ Updated: ${update.name}`);
      } else {
        console.log(`⚠️  Product not found: ${update.name}`);
      }
    }

    console.log('\n🎉 All images updated successfully!');
    console.log('   Restart your client and admin apps to see the images');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

updateImages();
