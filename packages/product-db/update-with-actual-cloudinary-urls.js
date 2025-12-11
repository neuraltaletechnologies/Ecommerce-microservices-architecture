import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function updateImages() {
  try {
    console.log('Starting image updates with ACTUAL Cloudinary URLs...\n');

    // Update iPhone 16 Pro Max
    console.log('Updating iPhone 16 Pro Max...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Natural Titanium": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765467739/iphone-16-pro-natural-1.jpg",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765467737/iphone-16-pro-natural-2.jpg"
        ],
        "Blue Titanium": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765467829/iphone-16-pro-blue-1.jpg",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765467832/iphone-16-pro-blue-2.jpg"
        ],
        "White Titanium": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765467895/iphone-16-pro-white-1.jpg",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765467891/iphone-16-pro-white-2.jpg"
        ],
        "Black Titanium": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765467968/iphone-16-pro-black-1.webp",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765467969/iphone-16-pro-black-2.jpg"
        ]
      })}::jsonb
      WHERE name = 'iPhone 16 Pro Max'
    `;

    // Update MacBook Pro 14" M4
    console.log('Updating MacBook Pro 14"...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Space Black": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765465321/macbook-pro-14-black-1.jpg",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765465324/macbook-pro-14-black-2.jpg"
        ],
        "Silver": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765451591/macbook-pro-14-silver-1.png",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765468113/macbook-pro-14-silver-2.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'MacBook Pro 14%'
    `;

    // Update AirPods Pro 3
    console.log('Updating AirPods Pro...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "White": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765465004/airpods-pro-3-1.jpg",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765465008/airpods-pro-3-2.png"
        ]
      })}::jsonb
      WHERE name LIKE 'AirPods Pro%'
    `;

    // Update iPad Pro 13"
    console.log('Updating iPad Pro...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Space Gray": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765464831/ipad-pro-13-gray-1.jpg",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765468312/ipad-pro-13-gray-2.jpg"
        ],
        "Silver": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765464834/ipad-pro-13-silver-1.jpg",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765468229/ipad-pro-13-silver-2.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'iPad Pro%'
    `;

    // Update Apple Watch Ultra 3
    console.log('Updating Apple Watch Ultra 3...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Natural Titanium": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765468369/watch-ultra-3-1.jpg",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765464698/watch-ultra-3-2.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'Apple Watch Ultra%'
    `;

    // Update Samsung Galaxy S24 Ultra
    console.log('Updating Samsung Galaxy S24 Ultra...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Titanium Black": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765466871/galaxy-s24-ultra-black-1.jpg"
        ],
        "Titanium Gray": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765464635/galaxy-s24-ultra-gray-1.png"
        ]
      })}::jsonb
      WHERE name LIKE 'Samsung Galaxy S24%'
    `;

    // Update Dell XPS 15
    console.log('Updating Dell XPS 15...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Platinum Silver": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765470288/dell-xps-15-silver-1.jpg"
        ],
        "Graphite": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765470349/dell-xps-15-graphite-1.png"
        ]
      })}::jsonb
      WHERE name LIKE 'Dell XPS%'
    `;

    // Update Sony WH-1000XM5
    console.log('Updating Sony WH-1000XM5...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Black": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765464477/sony-wh1000xm5-black-1.png"
        ],
        "Silver": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765466752/sony-wh1000xm5-silver-1.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'Sony WH-1000XM5%'
    `;

    // Update Samsung Galaxy Tab S9
    console.log('Updating Samsung Galaxy Tab S9...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Graphite": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765466653/galaxy-tab-s9-graphite-1.jpg"
        ],
        "Beige": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765466704/galaxy-tab-s9-beige.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'Samsung Galaxy Tab%'
    `;

    // Update Bose QuietComfort Ultra
    console.log('Updating Bose QuietComfort Ultra...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Black": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765470143/bose-qc-ultra-black-1.jpg"
        ],
        "White": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765470147/bose-qc-ultra-white-1.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'Bose QuietComfort%'
    `;

    // Update ASUS ROG Zephyrus G16
    console.log('Updating ASUS ROG Zephyrus G16...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Eclipse Gray": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765469458/rog-g16-1.jpg",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765469461/rog-g16-2.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'ASUS ROG%'
    `;

    // Update Anker 737 Power Bank
    console.log('Updating Anker 737 Power Bank...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Black": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765469646/anker-737-1.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'Anker 737%'
    `;

    console.log('\n✅ All images updated successfully with actual Cloudinary URLs!');
    console.log('📸 All images now point to existing Cloudinary resources');
  } catch (error) {
    console.error('❌ Error updating images:', error);
    throw error;
  }
}

updateImages();
