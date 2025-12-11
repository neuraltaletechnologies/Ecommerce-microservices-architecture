import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function updateImages() {
  try {
    console.log('Starting image updates...\n');

    // Update iPhone 16 Pro Max
    console.log('Updating iPhone 16 Pro Max...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Natural Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-natural-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-natural-2.png"],
        "Blue Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-blue-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-blue-2.png"],
        "White Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-white-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-white-2.png"],
        "Black Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-black-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-black-2.png"]
      })}::jsonb
      WHERE name = 'iPhone 16 Pro Max'
    `;

    // Update MacBook Pro 14" M4
    console.log('Updating MacBook Pro 14"...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Space Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-black-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-black-2.png"],
        "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-silver-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-silver-2.png"]
      })}::jsonb
      WHERE name LIKE 'MacBook Pro 14%'
    `;

    // Update AirPods Pro
    console.log('Updating AirPods Pro...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "White": ["https://res.cloudinary.com/dpp83qz2p/image/upload/airpods-pro-3-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/airpods-pro-3-2.png"]
      })}::jsonb
      WHERE name LIKE 'AirPods Pro%'
    `;

    // Update iPad Pro
    console.log('Updating iPad Pro...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Space Gray": ["https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-gray-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-gray-2.png"],
        "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-silver-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-silver-2.png"]
      })}::jsonb
      WHERE name LIKE 'iPad Pro%'
    `;

    // Update Apple Watch Ultra 2
    console.log('Updating Apple Watch Ultra 2...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/watch-ultra-2-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/watch-ultra-2-2.png"]
      })}::jsonb
      WHERE name LIKE 'Apple Watch Ultra%'
    `;

    // Update Samsung Galaxy S24 Ultra
    console.log('Updating Samsung Galaxy S24 Ultra...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Titanium Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-s24-ultra-black-1.png"],
        "Titanium Gray": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-s24-ultra-gray-1.png"],
        "Titanium Violet": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-s24-ultra-violet-1.png"]
      })}::jsonb
      WHERE name LIKE 'Samsung Galaxy S24%'
    `;

    // Update Dell XPS 15
    console.log('Updating Dell XPS 15...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Platinum Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/dell-xps-15-silver-1.png"],
        "Graphite": ["https://res.cloudinary.com/dpp83qz2p/image/upload/dell-xps-15-graphite-1.png"]
      })}::jsonb
      WHERE name LIKE 'Dell XPS%'
    `;

    // Update Sony WH-1000XM5
    console.log('Updating Sony WH-1000XM5...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/sony-wh1000xm5-black-1.png"],
        "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/sony-wh1000xm5-silver-1.png"]
      })}::jsonb
      WHERE name LIKE 'Sony WH%'
    `;

    // Update Samsung Galaxy Tab S9
    console.log('Updating Samsung Galaxy Tab S9...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Graphite": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-tab-s9-graphite-1.png"],
        "Beige": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-tab-s9-beige-1.png"]
      })}::jsonb
      WHERE name LIKE 'Samsung Galaxy Tab%'
    `;

    console.log('\n✅ All images updated successfully!');
    
    // Verify
    console.log('\nVerifying updates...');
    const products = await sql`SELECT id, name, images FROM "Product" ORDER BY id`;
    
    console.log('\nUpdated products:');
    products.forEach(p => {
      const imageCount = Object.keys(p.images).length;
      console.log(`- ${p.name}: ${imageCount} color variant${imageCount > 1 ? 's' : ''}`);
    });

  } catch (error) {
    console.error('Error updating images:', error);
  }
}

updateImages();
