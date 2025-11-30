// Sample Data for MongoDB Atlas (Orders Database)
// Run this in MongoDB Compass or mongosh

// Use the ecommerce-orders database
use('ecommerce-orders');

// Insert sample orders
db.orders.insertMany([
  {
    userId: "user_2abc123xyz456",
    email: "john.doe@example.com",
    amount: 249900,
    status: "success",
    products: [
      {
        name: "MacBook Pro 16\"",
        quantity: 1,
        price: 249900
      }
    ],
    createdAt: new Date("2024-11-20T14:23:00Z"),
    updatedAt: new Date("2024-11-20T14:23:00Z")
  },
  {
    userId: "user_2def789ghi012",
    email: "sarah.smith@example.com",
    amount: 154800,
    status: "success",
    products: [
      {
        name: "iPhone 15 Pro",
        quantity: 1,
        price: 99900
      },
      {
        name: "AirPods Max",
        quantity: 1,
        price: 54900
      }
    ],
    createdAt: new Date("2024-11-21T09:45:00Z"),
    updatedAt: new Date("2024-11-21T09:45:00Z")
  },
  {
    userId: "user_2jkl345mno678",
    email: "mike.johnson@example.com",
    amount: 189900,
    status: "success",
    products: [
      {
        name: "Dell XPS 15",
        quantity: 1,
        price: 189900
      }
    ],
    createdAt: new Date("2024-11-22T16:12:00Z"),
    updatedAt: new Date("2024-11-22T16:12:00Z")
  },
  {
    userId: "user_2pqr901stu234",
    email: "emily.brown@example.com",
    amount: 119900,
    status: "success",
    products: [
      {
        name: "Samsung Galaxy S24 Ultra",
        quantity: 1,
        price: 119900
      }
    ],
    createdAt: new Date("2024-11-23T11:30:00Z"),
    updatedAt: new Date("2024-11-23T11:30:00Z")
  },
  {
    userId: "user_2vwx567yza890",
    email: "david.wilson@example.com",
    amount: 149800,
    status: "success",
    products: [
      {
        name: "iPad Pro 12.9\"",
        quantity: 1,
        price: 109900
      },
      {
        name: "Apple Watch Series 9",
        quantity: 1,
        price: 39900
      }
    ],
    createdAt: new Date("2024-11-24T13:45:00Z"),
    updatedAt: new Date("2024-11-24T13:45:00Z")
  },
  {
    userId: "user_2abc123xyz456",
    email: "john.doe@example.com",
    amount: 79800,
    status: "success",
    products: [
      {
        name: "Sony WH-1000XM5",
        quantity: 2,
        price: 39900
      }
    ],
    createdAt: new Date("2024-11-25T10:20:00Z"),
    updatedAt: new Date("2024-11-25T10:20:00Z")
  },
  {
    userId: "user_2bcd234efg567",
    email: "lisa.anderson@example.com",
    amount: 249900,
    status: "success",
    products: [
      {
        name: "Sony Alpha 7 IV",
        quantity: 1,
        price: 249900
      }
    ],
    createdAt: new Date("2024-11-26T15:55:00Z"),
    updatedAt: new Date("2024-11-26T15:55:00Z")
  },
  {
    userId: "user_2def789ghi012",
    email: "sarah.smith@example.com",
    amount: 39900,
    status: "failed",
    products: [
      {
        name: "Apple Watch Series 9",
        quantity: 1,
        price: 39900
      }
    ],
    createdAt: new Date("2024-11-26T17:10:00Z"),
    updatedAt: new Date("2024-11-26T17:10:00Z")
  },
  {
    userId: "user_2hij123klm456",
    email: "robert.taylor@example.com",
    amount: 289700,
    status: "success",
    products: [
      {
        name: "MacBook Pro 16\"",
        quantity: 1,
        price: 249900
      },
      {
        name: "Apple Watch Series 9",
        quantity: 1,
        price: 39900
      }
    ],
    createdAt: new Date("2024-11-27T08:30:00Z"),
    updatedAt: new Date("2024-11-27T08:30:00Z")
  },
  {
    userId: "user_2nop789qrs012",
    email: "jennifer.martinez@example.com",
    amount: 159800,
    status: "success",
    products: [
      {
        name: "Samsung Galaxy S24 Ultra",
        quantity: 1,
        price: 119900
      },
      {
        name: "Sony WH-1000XM5",
        quantity: 1,
        price: 39900
      }
    ],
    createdAt: new Date("2024-11-27T10:15:00Z"),
    updatedAt: new Date("2024-11-27T10:15:00Z")
  }
]);

// Verify the data was inserted
print("Inserted " + db.orders.countDocuments() + " sample orders");

// Show a sample order
print("\nSample order:");
printjson(db.orders.findOne());

// Orders by status
print("\nOrders by status:");
db.orders.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 },
      totalAmount: { $sum: "$amount" }
    }
  }
]);

// Top customers by order count
print("\nTop customers:");
db.orders.aggregate([
  {
    $group: {
      _id: "$userId",
      email: { $first: "$email" },
      orderCount: { $sum: 1 },
      totalSpent: { $sum: "$amount" }
    }
  },
  { $sort: { totalSpent: -1 } },
  { $limit: 5 }
]);
