require('./load-env');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://cisulrzguxljaxgogbzi.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function listGisCourses() {
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      id, title, slug, description, thumbnail_url,
      modules (
        id, title, slug, order_index, description,
        lessons (
          id, title, slug, order_index
        )
      )
    `)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  const gisCourses = courses.filter(c => c.slug.includes('gis'));
  console.log(JSON.stringify(gisCourses, null, 2));
}

listGisCourses();
