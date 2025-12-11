// MongoDB Atlas Seed Data for Orders Collection
// Run this script with: mongosh "YOUR_MONGODB_ATLAS_CONNECTION_STRING" < seed-orders.js

// Switch to your database
use("neuraltale-orders");

// Clear existing data
db.orders.deleteMany({});

// Sample orders for testing
const sampleOrders = [
  {
    userId: "user_2abc123def456", // Replace with actual Clerk user IDs
    email: "john.doe@example.com",
    items: [
      {
        productId: 1, // iPhone 16 Pro Max
        name: "iPhone 16 Pro Max",
        slug: "iphone-16-pro-max",
        quantity: 1,
        price: 119999,
        selectedColor: "Natural Titanium",
        selectedSize: "256GB",
        image: "/products/iphone-16-pro-natural-1.jpg"
      },
      {
        productId: 14, // MagSafe Charger
        name: "MagSafe Charger",
        slug: "magsafe-charger",
        quantity: 2,
        price: 3999,
        selectedColor: "White",
        selectedSize: "Standard",
        image: "/products/magsafe-charger-1.jpg"
      }
    ],
    subtotal: 127997,
    shippingCost: 0,
    tax: 12799,
    totalAmount: 140796,
    shippingAddress: {
      fullName: "John Doe",
      addressLine1: "123 Tech Street",
      addressLine2: "Apt 4B",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "United States",
      phone: "+1 555-123-4567"
    },
    paymentIntentId: "pi_3abc123def456",
    paymentStatus: "succeeded",
    status: "delivered",
    trackingNumber: "NT1234567890",
    estimatedDelivery: new Date("2025-12-15"),
    createdAt: new Date("2025-12-01T10:30:00Z"),
    updatedAt: new Date("2025-12-08T14:20:00Z"),
    deliveredAt: new Date("2025-12-08T14:20:00Z")
  },
  {
    userId: "user_3xyz789ghi012",
    email: "jane.smith@example.com",
    items: [
      {
        productId: 2, // MacBook Pro 14" M4
        name: 'MacBook Pro 14" M4',
        slug: "macbook-pro-14-m4",
        quantity: 1,
        price: 199999,
        selectedColor: "Space Black",
        selectedSize: "24GB RAM 1TB SSD",
        image: "/products/macbook-pro-14-black-1.jpg"
      },
      {
        productId: 3, // AirPods Pro 3rd Gen
        name: "AirPods Pro (3rd Gen)",
        slug: "airpods-pro-3rd-gen",
        quantity: 1,
        price: 24999,
        selectedColor: "White",
        selectedSize: "Standard",
        image: "/products/airpods-pro-3-1.jpg"
      }
    ],
    subtotal: 224998,
    shippingCost: 0,
    tax: 22499,
    totalAmount: 247497,
    shippingAddress: {
      fullName: "Jane Smith",
      addressLine1: "456 Innovation Ave",
      addressLine2: "",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "United States",
      phone: "+1 555-987-6543"
    },
    paymentIntentId: "pi_4def456ghi789",
    paymentStatus: "succeeded",
    status: "shipped",
    trackingNumber: "NT2345678901",
    estimatedDelivery: new Date("2025-12-14"),
    createdAt: new Date("2025-12-05T14:15:00Z"),
    updatedAt: new Date("2025-12-10T09:00:00Z")
  },
  {
    userId: "user_4mno345pqr678",
    email: "alex.johnson@example.com",
    items: [
      {
        productId: 8, // Sony WH-1000XM5
        name: "Sony WH-1000XM5",
        slug: "sony-wh-1000xm5",
        quantity: 1,
        price: 39999,
        selectedColor: "Black",
        selectedSize: "Standard",
        image: "/products/sony-xm5-black-1.jpg"
      }
    ],
    subtotal: 39999,
    shippingCost: 0,
    tax: 3999,
    totalAmount: 43998,
    shippingAddress: {
      fullName: "Alex Johnson",
      addressLine1: "789 Audio Lane",
      addressLine2: "Suite 200",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "United States",
      phone: "+1 555-456-7890"
    },
    paymentIntentId: "pi_5ghi789jkl012",
    paymentStatus: "succeeded",
    status: "processing",
    trackingNumber: null,
    estimatedDelivery: new Date("2025-12-16"),
    createdAt: new Date("2025-12-08T16:45:00Z"),
    updatedAt: new Date("2025-12-09T11:30:00Z")
  },
  {
    userId: "user_5stu901vwx234",
    email: "maria.garcia@example.com",
    items: [
      {
        productId: 4, // iPad Pro 12.9"
        name: 'iPad Pro 12.9"',
        slug: "ipad-pro-12-9",
        quantity: 1,
        price: 129999,
        selectedColor: "Space Gray",
        selectedSize: "512GB WiFi",
        image: "/products/ipad-pro-gray-1.jpg"
      },
      {
        productId: 19, // Anker 100W Charger
        name: "Anker 100W USB-C Charger",
        slug: "anker-100w-charger",
        quantity: 1,
        price: 7999,
        selectedColor: "Black",
        selectedSize: "Standard",
        image: "/products/anker-737-1.jpg"
      }
    ],
    subtotal: 137998,
    shippingCost: 0,
    tax: 13799,
    totalAmount: 151797,
    shippingAddress: {
      fullName: "Maria Garcia",
      addressLine1: "321 Creative Blvd",
      addressLine2: "",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "United States",
      phone: "+1 555-234-5678"
    },
    paymentIntentId: "pi_6jkl012mno345",
    paymentStatus: "succeeded",
    status: "pending",
    trackingNumber: null,
    estimatedDelivery: new Date("2025-12-17"),
    createdAt: new Date("2025-12-10T08:20:00Z"),
    updatedAt: new Date("2025-12-10T08:20:00Z")
  },
  {
    userId: "user_6yza567bcd890",
    email: "david.lee@example.com",
    items: [
      {
        productId: 11, // ASUS ROG Zephyrus G16
        name: "ASUS ROG Zephyrus G16",
        slug: "asus-rog-zephyrus-g16",
        quantity: 1,
        price: 279999,
        selectedColor: "Eclipse Gray",
        selectedSize: "32GB RAM 1TB SSD",
        image: "/products/rog-g16-1.jpg"
      },
      {
        productId: 18, // Razer BlackShark V2 Pro
        name: "Razer BlackShark V2 Pro",
        slug: "razer-blackshark-v2-pro",
        quantity: 1,
        price: 17999,
        selectedColor: "Black",
        selectedSize: "Standard",
        image: "/products/razer-blackshark-1.jpg"
      },
      {
        productId: 20, // LG OLED Gaming Monitor
        name: 'LG 27" UltraGear OLED Gaming Monitor',
        slug: "lg-27-ultragear-oled",
        quantity: 1,
        price: 99999,
        selectedColor: "Black",
        selectedSize: "27 inch",
        image: "/products/lg-oled-monitor-1.jpg"
      }
    ],
    subtotal: 397997,
    shippingCost: 0,
    tax: 39799,
    totalAmount: 437796,
    shippingAddress: {
      fullName: "David Lee",
      addressLine1: "567 Gaming Road",
      addressLine2: "Unit 12",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "United States",
      phone: "+1 555-876-5432"
    },
    paymentIntentId: "pi_7mno345pqr678",
    paymentStatus: "succeeded",
    status: "shipped",
    trackingNumber: "NT3456789012",
    estimatedDelivery: new Date("2025-12-13"),
    createdAt: new Date("2025-12-03T13:10:00Z"),
    updatedAt: new Date("2025-12-09T15:45:00Z")
  },
  {
    userId: "user_7efg123hij456",
    email: "sarah.chen@example.com",
    items: [
      {
        productId: 5, // Apple Watch Ultra 3
        name: "Apple Watch Ultra 3",
        slug: "apple-watch-ultra-3",
        quantity: 1,
        price: 79999,
        selectedColor: "Natural Titanium",
        selectedSize: "49mm",
        image: "/products/watch-ultra-3-1.jpg"
      }
    ],
    subtotal: 79999,
    shippingCost: 0,
    tax: 7999,
    totalAmount: 87998,
    shippingAddress: {
      fullName: "Sarah Chen",
      addressLine1: "890 Fitness Way",
      addressLine2: "",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "+1 555-345-6789"
    },
    paymentIntentId: "pi_8pqr678stu901",
    paymentStatus: "succeeded",
    status: "delivered",
    trackingNumber: "NT4567890123",
    estimatedDelivery: new Date("2025-12-07"),
    createdAt: new Date("2025-11-28T09:30:00Z"),
    updatedAt: new Date("2025-12-06T16:20:00Z"),
    deliveredAt: new Date("2025-12-06T16:20:00Z")
  },
  {
    userId: "user_8klm789nop012",
    email: "michael.brown@example.com",
    items: [
      {
        productId: 6, // Samsung Galaxy S24 Ultra
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        quantity: 1,
        price: 129999,
        selectedColor: "Titanium Black",
        selectedSize: "512GB",
        image: "/products/s24-ultra-black-1.jpg"
      },
      {
        productId: 13, // Bose QC Ultra Earbuds
        name: "Bose QuietComfort Ultra Earbuds",
        slug: "bose-qc-ultra-earbuds",
        quantity: 1,
        price: 29999,
        selectedColor: "Black",
        selectedSize: "Standard",
        image: "/products/bose-qc-ultra-black-1.jpg"
      }
    ],
    subtotal: 159998,
    shippingCost: 0,
    tax: 15999,
    totalAmount: 175997,
    shippingAddress: {
      fullName: "Michael Brown",
      addressLine1: "234 Mobile Drive",
      addressLine2: "Floor 3",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "United States",
      phone: "+1 555-654-3210"
    },
    paymentIntentId: "pi_9stu901vwx234",
    paymentStatus: "succeeded",
    status: "processing",
    trackingNumber: null,
    estimatedDelivery: new Date("2025-12-15"),
    createdAt: new Date("2025-12-09T11:50:00Z"),
    updatedAt: new Date("2025-12-10T10:15:00Z")
  }
];

// Insert sample orders
db.orders.insertMany(sampleOrders);

// Create indexes for better query performance
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ email: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });
db.orders.createIndex({ "items.productId": 1 });

print("✅ Successfully seeded orders database with sample data");
print(`📦 Total orders created: ${sampleOrders.length}`);
print("\n📋 Order Status Distribution:");
print(`   - Pending: ${sampleOrders.filter(o => o.status === 'pending').length}`);
print(`   - Processing: ${sampleOrders.filter(o => o.status === 'processing').length}`);
print(`   - Shipped: ${sampleOrders.filter(o => o.status === 'shipped').length}`);
print(`   - Delivered: ${sampleOrders.filter(o => o.status === 'delivered').length}`);
print("\n💰 Total Revenue: $" + (sampleOrders.reduce((sum, o) => sum + o.totalAmount, 0) / 100).toFixed(2));
