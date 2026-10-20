require('./load-env');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://cisulrzguxljaxgogbzi.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function check() {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, slug, modules(id, title, lessons(id, title))');

  if (error) {
    console.error('Fetch error:', error);
    return;
  }

  console.log('Total Masterclasses in Supabase:', courses.length);
  for (const c of courses) {
    const totalLessons = c.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    console.log(`* Course: "${c.title}" [${c.slug}]`);
    console.log(`  Modules: ${c.modules?.length}, Total Lessons: ${totalLessons}`);
    for (const m of c.modules || []) {
      console.log(`    - [${m.title}] (${m.lessons?.length || 0} lessons)`);
    }
  }
}

check();
