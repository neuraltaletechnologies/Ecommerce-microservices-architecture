/**
 * Cloudinary Image URLs for Neuraltale Products
 * 
 * PLACEHOLDER IMAGES - Using Unsplash for demonstration
 * Replace these with your actual Cloudinary URLs after uploading
 */

export const PRODUCT_IMAGES = {
  // iPhone 16 Pro Max
  'iphone-16-pro-max': {
    'Natural Titanium': [
      'https://images.unsplash.com/photo-1592286927505-2c3c3fc2faef?w=800&q=80', // iPhone front
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80'  // iPhone back
    ],
    'Blue Titanium': [
      'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80'
    ],
    'White Titanium': [
      'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?w=800&q=80'
    ],
    'Black Titanium': [
      'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=800&q=80'
    ]
  },
  
  // MacBook Pro 14" M4
  'macbook-pro-14-m4': {
    'Space Black': [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80'
    ],
    'Silver': [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80'
    ]
  },
  
  // AirPods Pro 3rd Gen
  'airpods-pro-3rd-gen': {
    'White': [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&q=80'
    ]
  },
  
  // iPad Pro 12.9"
  'ipad-pro-12-9': {
    'Space Gray': [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'
    ],
    'Silver': [
      'https://images.unsplash.com/photo-1585790050230-5dd28404f869?w=800&q=80'
    ]
  },
  
  // Apple Watch Ultra 3
  'apple-watch-ultra-3': {
    'Titanium': [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80'
    ]
  },
  
  // Samsung Galaxy S24 Ultra
  'samsung-galaxy-s24-ultra': {
    'Titanium Gray': [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80'
    ],
    'Titanium Black': [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'
    ],
    'Titanium Violet': [
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80'
    ],
    'Titanium Yellow': [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'
    ]
  },
  
  // Dell XPS 15
  'dell-xps-15': {
    'Platinum Silver': [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80'
    ],
    'Graphite': [
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&q=80'
    ]
  },
  
  // Sony WH-1000XM5
  'sony-wh-1000xm5': {
    'Black': [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80'
    ],
    'Silver': [
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80'
    ]
  },
  
  // Samsung Galaxy Tab S9
  'samsung-galaxy-tab-s9': {
    'Graphite': [
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80'
    ],
    'Beige': [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'
    ]
  },
  
  // Add more products as needed...
};

// Helper function to generate Cloudinary URLs with transformations
export function getOptimizedImageUrl(baseUrl: string, width = 800, quality = 'auto') {
  if (baseUrl.includes('cloudinary.com')) {
    // Insert transformation parameters for Cloudinary
    return baseUrl.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
  }
  return baseUrl;
}
