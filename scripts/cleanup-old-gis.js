require('./load-env');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cisulrzguxljaxgogbzi.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function cleanup() {
  console.log('=== Phase 1: Deleting old GIS courses ===');
  
  // Delete old GIS Masterclass
  const { error: e1 } = await supabase
    .from('courses')
    .delete()
    .eq('slug', 'gis-masterclass');
  console.log('Delete gis-masterclass:', e1 ? `ERROR: ${e1.message}` : 'OK (or not found)');

  // Delete old GIS Agri course
  const { error: e2 } = await supabase
    .from('courses')
    .delete()
    .eq('slug', 'gis-agri-arcgis');
  console.log('Delete gis-agri-arcgis:', e2 ? `ERROR: ${e2.message}` : 'OK (or not found)');

  // List remaining courses
  const { data: courses } = await supabase
    .from('courses')
    .select('title, slug, is_published');
  console.log('\nRemaining courses:', JSON.stringify(courses, null, 2));
}

cleanup().catch(console.error);
