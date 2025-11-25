import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function addMissingColumns() {
  try {
    console.log('🔧 Adding missing columns to Product table...\n');

    // Add techHighlights column
    console.log('Adding techHighlights column...');
    await sql`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "techHighlights" JSONB`;
    
    // Add boxContents column
    console.log('Adding boxContents column...');
    await sql`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "boxContents" JSONB`;
    
    // Add productFeatures column
    console.log('Adding productFeatures column...');
    await sql`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "productFeatures" JSONB`;
    
    // Add technicalSpecs column
    console.log('Adding technicalSpecs column...');
    await sql`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "technicalSpecs" JSONB`;
    
    // Add certifications column
    console.log('Adding certifications column...');
    await sql`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "certifications" JSONB`;
    
    console.log('\n✅ All columns added successfully!');
    console.log('🎉 Database schema is now up to date\n');

    // Verify columns exist
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Product' 
      ORDER BY ordinal_position
    `;
    
    console.log('📋 Current Product table columns:');
    result.forEach((col: any) => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });

  } catch (error) {
    console.error('❌ Error adding columns:', error);
    process.exit(1);
  }
}

addMissingColumns();
