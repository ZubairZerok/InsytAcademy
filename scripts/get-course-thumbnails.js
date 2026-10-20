require('./load-env');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://cisulrzguxljaxgogbzi.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function main() {
  const { data, error } = await supabase.from('courses').select('id, title, slug, thumbnail_url');
  if (error) {
    console.error(error);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

main();
