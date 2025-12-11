/**
 * Quick seed script - makes API calls to product-service to create products
 * Make sure product-service is running on port 8000
 */

async function seedViaAPI() {
  const baseUrl = 'http://localhost:8000/api/v1';

  console.log('🌱 Seeding database via product-service API...\n');
  console.log('⚠️  Make sure product-service is running on port 8000\n');

  try {
    // Create products
    const products = [
      {
        name: 'iPhone 16 Pro Max',
        slug: 'iphone-16-pro-max',
        description: 'The ultimate iPhone with titanium design and A18 Pro chip.',
        long_description: 'Experience the pinnacle of smartphone technology.',
        price: 119999,
        compare_price: 129999,
        stock: 50,
        colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
        sizes: ['256GB', '512GB', '1TB'],
        images: {
          "Natural Titanium": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1765451591/Screenshot_2025-12-11_141206_f2stm2.png"],
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
        description: 'Supercharged for pros with M4 chip.',
        long_description: 'The MacBook Pro 14-inch delivers groundbreaking performance.',
        price: 199999,
        compare_price: 219999,
        stock: 30,
        colors: ['Space Black', 'Silver'],
        sizes: ['16GB RAM 512GB SSD', '24GB RAM 1TB SSD'],
        images: {
          "Space Black": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1765451418/Screenshot_2025-12-11_140942_motdb4.png"],
          "Silver": ["https://res.cloudinary.com/dpp83qz2p/image/upload/w_800,q_auto,f_auto/v1728315188/samples/coffee.jpg"]
        },
        category: 'laptops',
        is_hero: true,
        hero_order: 2
      }
    ];

    console.log(`Creating ${products.length} products...\n`);

    for (const product of products) {
      try {
        const response = await fetch(`${baseUrl}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });

        if (response.ok) {
          const created = await response.json();
          console.log(`✅ Created: ${product.name} (ID: ${created.id})`);
        } else {
          const error = await response.text();
          console.log(`❌ Failed to create ${product.name}: ${response.status} - ${error}`);
        }
      } catch (err) {
        console.error(`❌ Error creating ${product.name}:`, err.message);
      }
    }

    console.log('\n✨ Seeding complete!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.log('\nMake sure:');
    console.log('  1. product-service is running (pnpm dev)');
    console.log('  2. Database is accessible');
  }
}

seedViaAPI();
