/**
 * Run the Cloudinary seed file on the database
 * This will update all product images with Cloudinary URLs
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function runSeed() {
  try {
    console.log('🚀 Starting database seeding with Cloudinary URLs...\n');

    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'packages', 'product-db', 'seed-cloudinary.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements (simple split by semicolon)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await prisma.$executeRawUnsafe(statement);
        console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
      } catch (error) {
        console.error(`❌ Failed to execute statement ${i + 1}:`, error.message);
        console.log('Statement:', statement.substring(0, 100) + '...');
      }
    }

    console.log('\n✨ Database seeding completed!');
    console.log('   Products and categories updated with Cloudinary image URLs');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSeed();
