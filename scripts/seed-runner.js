require('./load-env');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://cisulrzguxljaxgogbzi.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function seedSqlFile(filePath) {
  const label = path.basename(filePath);
  console.log(`\n=== Seeding: ${label} ===`);
  
  const sql = fs.readFileSync(filePath, 'utf8');
  
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  
  if (error) {
    // Fallback: use the REST API directly
    console.log(`RPC failed (${error.message}), trying direct SQL via REST...`);
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });
    
    if (!response.ok) {
      console.log(`REST also failed. Trying PostgreSQL query endpoint...`);
      
      // Try the SQL endpoint directly
      const pgResponse = await fetch(`${SUPABASE_URL}/pg/query`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql }),
      });
      
      if (!pgResponse.ok) {
        const errText = await pgResponse.text();
        console.error(`All methods failed for ${label}:`, errText.substring(0, 500));
        return false;
      }
    }
  }
  
  console.log(`✅ ${label} seeded successfully!`);
  return true;
}

async function main() {
  const seedFiles = process.argv.slice(2);
  
  if (seedFiles.length === 0) {
    console.log('Usage: node seed-runner.js <file1.sql> [file2.sql] ...');
    console.log('Example: node seed-runner.js supabase/seeds/gis_course_1_foundations.sql');
    process.exit(1);
  }
  
  for (const file of seedFiles) {
    await seedSqlFile(file);
  }
  
  // Verify
  console.log('\n=== Verification: Current courses ===');
  const { data: courses } = await supabase
    .from('courses')
    .select('title, slug, is_published')
    .order('created_at');
  console.log(JSON.stringify(courses, null, 2));
}

main().catch(console.error);
