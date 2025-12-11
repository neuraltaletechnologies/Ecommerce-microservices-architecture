import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function updateNewImages() {
  try {
    console.log('Updating products with new Cloudinary images...\n');

    // Update Samsung Galaxy Watch 7
    console.log('Updating Samsung Galaxy Watch 7...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Silver": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765473118/galaxy-watch-7-silver-1.jpg"
        ],
        "Green": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765473217/galaxy-watch-7-green-1.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'Samsung Galaxy Watch%'
    `;

    // Update iPad Air 11"
    console.log('Updating iPad Air 11"...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Space Gray": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765472160/ipad-air-gray-1.jpg"
        ],
        "Starlight": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765472538/ipad-air-starlight-1.jpg"
        ],
        "Purple": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765472432/ipad-air-purple-1.jpg"
        ],
        "Blue": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765472249/ipad-air-blue-1.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'iPad Air%'
    `;

    // Update Google Pixel 9 Pro
    console.log('Updating Google Pixel 9 Pro...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Obsidian": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765472048/pixel-9-pro-obsidian-1.jpg"
        ],
        "Hazel": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765472052/pixel-9-pro-hazel-1.jpg"
        ],
        "Porcelain": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765472056/pixel-9-pro-porcelian-1.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'Google Pixel 9%'
    `;

    // Update MagSafe Charger
    console.log('Updating MagSafe Charger...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "White": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765474106/magsafe-charger-1.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'MagSafe Charger%'
    `;

    // Update LG UltraGear OLED Monitor
    console.log('Updating LG UltraGear OLED Monitor...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Black": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765475135/lg-oled-monitor-1.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'LG%UltraGear%'
    `;

    // Update Sony A7 IV
    console.log('Updating Sony A7 IV...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Black": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765475263/sony-a7iv-1.jpg",
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765475257/sony-a7iv-2.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'Sony A7%'
    `;

    // Update HomePod (2nd Gen)
    console.log('Updating HomePod (2nd Gen)...');
    await sql`
      UPDATE "Product"
      SET images = ${JSON.stringify({
        "Midnight": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765482400/homepod-midnight-1.jpg"
        ],
        "White": [
          "https://res.cloudinary.com/dpp83qz2p/image/upload/v1765482398/homepod-white-1.jpg"
        ]
      })}::jsonb
      WHERE name LIKE 'HomePod%'
    `;

    console.log('\n✅ All new images updated successfully!');
    console.log('📸 Updated Products:');
    console.log('   - Samsung Galaxy Watch 7 (Silver, Green)');
    console.log('   - iPad Air 11" (Gray, Starlight, Purple, Blue)');
    console.log('   - Google Pixel 9 Pro (Obsidian, Hazel, Porcelain)');
    console.log('   - MagSafe Charger (White)');
    console.log('   - LG UltraGear OLED Monitor (Black)');
    console.log('   - Sony A7 IV (Black - 2 images)');
    console.log('   - HomePod 2nd Gen (Midnight, White)');
  } catch (error) {
    console.error('❌ Error updating images:', error);
    throw error;
  }
}

updateNewImages();
