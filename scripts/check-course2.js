require('./load-env');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://cisulrzguxljaxgogbzi.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function main() {
  const { data: c } = await supabase
    .from('courses')
    .select('id,title,slug')
    .eq('slug', 'gis-analysis-remote-sensing')
    .single();
  console.log('Course:', JSON.stringify(c, null, 2));

  const { data: mods } = await supabase
    .from('modules')
    .select('id,title,order_index')
    .eq('course_id', c.id)
    .order('order_index');
  console.log('Modules:', mods.length);

  for (const m of mods || []) {
    const { data: ls, count } = await supabase
      .from('lessons')
      .select('id,title,order_index', { count: 'exact' })
      .eq('module_id', m.id)
      .order('order_index');
    console.log('  Module ' + m.order_index + ': ' + m.title + ' => ' + count + ' lessons');
    for (const l of ls || []) {
      console.log('    L' + l.order_index + ': ' + l.title);
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
