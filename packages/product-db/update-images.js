import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma/index.js';

dotenv.config();

const prisma = new PrismaClient();

async function updateImages() {
  try {
    console.log('Starting image updates...\n');

    // Update iPhone 16 Pro Max
    console.log('Updating iPhone 16 Pro Max...');
    await prisma.product.updateMany({
      where: { name: 'iPhone 16 Pro Max' },
      data: {
        images: {
          "Natural Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-natural-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-natural-2.png"],
          "Blue Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-blue-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-blue-2.png"],
          "White Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-white-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-white-2.png"],
          "Black Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-black-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/iphone-16-pro-black-2.png"]
        }
      }
    });

    // Update MacBook Pro 14" M4
    console.log('Updating MacBook Pro 14"...');
    await prisma.product.updateMany({
      where: { name: { contains: 'MacBook Pro 14' } },
      data: {
        images: {
          "Space Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-black-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-black-2.png"],
          "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-silver-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/macbook-pro-14-silver-2.png"]
        }
      }
    });

    // Update AirPods Pro
    console.log('Updating AirPods Pro...');
    await prisma.product.updateMany({
      where: { name: { contains: 'AirPods Pro' } },
      data: {
        images: {
          "White": ["https://res.cloudinary.com/dpp83qz2p/image/upload/airpods-pro-3-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/airpods-pro-3-2.png"]
        }
      }
    });

    // Update iPad Pro
    console.log('Updating iPad Pro...');
    await prisma.product.updateMany({
      where: { name: { contains: 'iPad Pro' } },
      data: {
        images: {
          "Space Gray": ["https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-gray-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-gray-2.png"],
          "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-silver-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/ipad-pro-13-silver-2.png"]
        }
      }
    });

    // Update Apple Watch Ultra 2
    console.log('Updating Apple Watch Ultra 2...');
    await prisma.product.updateMany({
      where: { name: { contains: 'Apple Watch Ultra' } },
      data: {
        images: {
          "Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/watch-ultra-2-1.png", "https://res.cloudinary.com/dpp83qz2p/image/upload/watch-ultra-2-2.png"]
        }
      }
    });

    // Update Samsung Galaxy S24 Ultra
    console.log('Updating Samsung Galaxy S24 Ultra...');
    await prisma.product.updateMany({
      where: { name: { contains: 'Samsung Galaxy S24' } },
      data: {
        images: {
          "Titanium Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-s24-ultra-black-1.png"],
          "Titanium Gray": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-s24-ultra-gray-1.png"],
          "Titanium Violet": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-s24-ultra-violet-1.png"]
        }
      }
    });

    // Update Dell XPS 15
    console.log('Updating Dell XPS 15...');
    await prisma.product.updateMany({
      where: { name: { contains: 'Dell XPS' } },
      data: {
        images: {
          "Platinum Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/dell-xps-15-silver-1.png"],
          "Graphite": ["https://res.cloudinary.com/dpp83qz2p/image/upload/dell-xps-15-graphite-1.png"]
        }
      }
    });

    // Update Sony WH-1000XM5
    console.log('Updating Sony WH-1000XM5...');
    await prisma.product.updateMany({
      where: { name: { contains: 'Sony WH' } },
      data: {
        images: {
          "Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/sony-wh1000xm5-black-1.png"],
          "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/sony-wh1000xm5-silver-1.png"]
        }
      }
    });

    // Update Samsung Galaxy Tab S9
    console.log('Updating Samsung Galaxy Tab S9...');
    await prisma.product.updateMany({
      where: { name: { contains: 'Samsung Galaxy Tab' } },
      data: {
        images: {
          "Graphite": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-tab-s9-graphite-1.png"],
          "Beige": ["https://res.cloudinary.com/dpp83qz2p/image/upload/galaxy-tab-s9-beige-1.png"]
        }
      }
    });

    console.log('\n✅ All images updated successfully!');
    
    // Verify
    console.log('\nVerifying updates...');
    const products = await prisma.product.findMany({
      select: { id: true, name: true, images: true }
    });
    
    console.log('\nUpdated products:');
    products.forEach(p => {
      console.log(`- ${p.name}: ${Object.keys(p.images).length} color variants`);
    });

  } catch (error) {
    console.error('Error updating images:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateImages();
