require('./load-env');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://cisulrzguxljaxgogbzi.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function audit() {
  const slugs = [
    'gis-spatial-foundations',
    'gis-analysis-remote-sensing',
    'gis-engineering-cloud'
  ];

  for (const slug of slugs) {
    const { data: course, error } = await supabase
      .from('courses')
      .select('id, title, slug, description, is_published')
      .eq('slug', slug)
      .single();

    if (error || !course) {
      console.log(`Course not found / error for ${slug}:`, error);
      continue;
    }

    console.log(`\n================================================================================`);
    console.log(`COURSE: ${course.title} [slug: ${course.slug}]`);
    console.log(`Description: ${course.description}`);
    console.log(`Published: ${course.is_published}`);
    console.log(`================================================================================`);

    const { data: modules } = await supabase
      .from('modules')
      .select('id, title, slug, order_index, description')
      .eq('course_id', course.id)
      .order('order_index');

    console.log(`Total Modules in DB: ${modules ? modules.length : 0}`);

    let totalLessons = 0;
    let totalLength = 0;
    let totalQuizzes = 0;

    for (const m of modules || []) {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, title, slug, order_index, content')
        .eq('module_id', m.id)
        .order('order_index');

      console.log(`\n  📂 [Module ${m.order_index}] ${m.title} (${lessons ? lessons.length : 0} lessons)`);
      if (m.description) {
        console.log(`     Desc: ${m.description}`);
      }

      for (const l of lessons || []) {
        totalLessons++;
        const len = (l.content || '').length;
        totalLength += len;

        const { count: qCount } = await supabase
          .from('quizzes')
          .select('id', { count: 'exact', head: true })
          .eq('lesson_id', l.id);

        totalQuizzes += (qCount || 0);

        console.log(`     📄 L${l.order_index}: ${l.title} [${len} chars, ${qCount || 0} quizzes]`);
      }
    }

    console.log(`\n--- SUMMARY FOR ${slug} ---`);
    console.log(`Modules: ${modules ? modules.length : 0}`);
    console.log(`Total Lessons: ${totalLessons}`);
    console.log(`Total Content Length: ${totalLength} chars (Avg: ${totalLessons ? Math.round(totalLength / totalLessons) : 0} chars/lesson)`);
    console.log(`Total Quizzes: ${totalQuizzes}`);
  }
}

audit().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
