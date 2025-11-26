// Simple test script to verify product service endpoints
async function testEndpoints() {
  console.log('🧪 Testing Product Service Endpoints...\n');
  
  // Test products endpoint
  try {
    const productsResponse = await fetch('http://localhost:8000/products?limit=3');
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log('✅ Products endpoint working!');
      console.log(`   Found ${products.length} products`);
      if (products.length > 0) {
        console.log(`   First product: "${products[0].name}"`);
      }
    } else {
      console.log(`❌ Products endpoint failed: ${productsResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Products endpoint error: ${error.message}`);
  }
  
  console.log('');
  
  // Test categories endpoint
  try {
    const categoriesResponse = await fetch('http://localhost:8000/categories');
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      console.log('✅ Categories endpoint working!');
      console.log(`   Found ${categories.length} categories`);
      if (categories.length > 0) {
        console.log(`   Categories: ${categories.map(c => c.name).join(', ')}`);
      }
    } else {
      console.log(`❌ Categories endpoint failed: ${categoriesResponse.status}`);
    }
  } catch (error) {
    console.log(`❌ Categories endpoint error: ${error.message}`);
  }
  
  console.log('\n✨ Test complete!');
}

testEndpoints();
