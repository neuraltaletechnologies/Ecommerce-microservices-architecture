/**
 * List all images in your Cloudinary account
 * This helps verify what images you've uploaded and their URLs
 */

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary directly (from your .env file)
cloudinary.config({
  cloud_name: 'dpp83qz2p',
  api_key: '766216387162258',
  api_secret: 'l61jKK2RfTvt1WNImkS78uahiYM'
});

async function listImages() {
  try {
    console.log('📸 Fetching images from Cloudinary...\n');
    console.log(`Cloud Name: dpp83qz2p\n`);

    // List all resources
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 500,
      prefix: 'neuraltale' // Filter by your folder
    });

    if (result.resources.length === 0) {
      console.log('⚠️  No images found in the "neuraltale" folder!');
      console.log('\nTrying to list ALL images...\n');
      
      const allResult = await cloudinary.api.resources({
        type: 'upload',
        max_results: 100
      });

      if (allResult.resources.length === 0) {
        console.log('❌ No images found in your Cloudinary account.');
        console.log('\n📝 Next steps:');
        console.log('   1. Go to https://cloudinary.com/console');
        console.log('   2. Upload images to "neuraltale/products" folder');
        console.log('   3. Run this script again to verify');
        return;
      }

      console.log(`Found ${allResult.resources.length} images (not in neuraltale folder):\n`);
      allResult.resources.forEach((resource, i) => {
        console.log(`${i + 1}. ${resource.public_id}`);
        console.log(`   URL: ${resource.secure_url}\n`);
      });
      return;
    }

    console.log(`✅ Found ${result.resources.length} images:\n`);
    
    result.resources.forEach((resource, i) => {
      console.log(`${i + 1}. Public ID: ${resource.public_id}`);
      console.log(`   Secure URL: ${resource.secure_url}`);
      console.log(`   Format: ${resource.format}`);
      console.log(`   Size: ${resource.width}x${resource.height}`);
      console.log('');
    });

    // Generate sample seed SQL
    console.log('\n📋 Sample URLs for your seed file:\n');
    result.resources.slice(0, 3).forEach(resource => {
      const url = resource.secure_url;
      console.log(`"${url}"`);
    });

  } catch (error) {
    console.error('❌ Error listing images:', error.message);
    
    if (error.http_code === 401) {
      console.log('\n⚠️  Authentication failed! Check your credentials in the script.');
    }
  }
}

listImages();
