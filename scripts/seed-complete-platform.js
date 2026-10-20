require('./load-env');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cisulrzguxljaxgogbzi.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Helper to safely insert course and cascade delete previous
async function resetCourse(courseData) {
  console.log(`\n=== Seeding Course: "${courseData.title}" [${courseData.slug}] ===`);
  await supabase.from('courses').delete().eq('slug', courseData.slug);
  const { data, error } = await supabase.from('courses').insert({
    title: courseData.title,
    slug: courseData.slug,
    description: courseData.description,
    is_published: courseData.is_published ?? true,
    thumbnail_url: courseData.thumbnail_url,
  }).select('id').single();

  if (error) throw new Error(`Course insert error: ${error.message}`);
  return data.id;
}

// Helper to seed a list of modules with lessons and quizzes
async function seedModulesWithLessons(courseId, modules) {
  let totalLessons = 0;
  let totalQuizzes = 0;

  for (const mod of modules) {
    const { data: modData, error: modErr } = await supabase.from('modules').insert({
      course_id: courseId,
      title: mod.title,
      slug: mod.slug,
      order_index: mod.order_index,
      description: mod.description || null,
    }).select('id').single();

    if (modErr) throw new Error(`Module [${mod.title}] insert error: ${modErr.message}`);
    const moduleId = modData.id;

    for (const l of (mod.lessons || [])) {
      const { data: lessonData, error: lErr } = await supabase.from('lessons').insert({
        module_id: moduleId,
        title: l.title,
        slug: l.slug,
        order_index: l.order_index,
        content: l.content,
        video_url: l.video_url || null,
      }).select('id').single();

      if (lErr) throw new Error(`Lesson [${l.title}] insert error: ${lErr.message}`);
      const lessonId = lessonData.id;
      totalLessons++;

      // Seed quizzes for this lesson if present
      const quizzes = l.quizzes || [];
      if (quizzes.length > 0) {
        const quizSlug = `quiz-${l.slug}-${Math.random().toString(36).substring(2, 8)}`;
        const { data: qData, error: qErr } = await supabase.from('quizzes').insert({
          course_id: courseId,
          module_id: moduleId,
          lesson_id: lessonId,
          title: `${l.title} Quiz`,
          slug: quizSlug,
          is_published: true,
          pass_threshold: 60,
          max_xp: quizzes.length * 10,
        }).select('id').single();

        if (qErr) {
          console.warn(`  Quiz warning for lesson ${l.title}:`, qErr.message);
        } else {
          const qRows = quizzes.map((q, idx) => ({
            quiz_id: qData.id,
            question_text: q.question_text || q.question,
            options: q.options,
            correct_option: String(q.correct_option ?? q.correct_answer ?? 0),
            explanation: q.explanation || null,
            points: 10,
            order_index: idx + 1,
          }));

          const { error: qRowsErr } = await supabase.from('quiz_questions').insert(qRows);
          if (qRowsErr) {
            console.warn(`  Quiz questions warning for lesson ${l.title}:`, qRowsErr.message);
          } else {
            totalQuizzes += qRows.length;
          }
        }
      }
    }
    console.log(`  ✓ ${mod.title} (${mod.lessons?.length || 0} lessons)`);
  }

  console.log(`  🎉 Finished: ${modules.length} modules, ${totalLessons} lessons, ${totalQuizzes} quizzes.`);
}

const { COURSE_1, MODULES: C1_MODULES } = require('./seed-gis-course-1.js');
const { COURSE_2, COURSE_2_MODULES, COURSE_3, COURSE_3_MODULES } = require('./seed-gis-courses-2-3.js');

// -----------------------------------------------------------------------------
// R Course Data from r_course_seeds.sql
// -----------------------------------------------------------------------------
function parseRCourse() {
  const text = fs.readFileSync(path.join(__dirname, '../supabase/seeds/r_course_seeds.sql'), 'utf8');

  const course = {
    title: 'R for Agri-Science',
    slug: 'r-agri-data-bau',
    description: 'Bangladesh Agricultural University Special Edition. Master R for Data Science, ML & GIS from absolute zero.',
    thumbnail_url: '/images/courses/r-agri-data-bau.png',
    is_published: true,
  };

  const moduleRegex = /INSERT INTO public\.modules\s*\([^)]+\)\s*VALUES\s*\([^,]+,\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*'([^']+)'\)\s*RETURNING id INTO ([^;]+);/gi;
  const modules = [];
  let mMatch;
  while ((mMatch = moduleRegex.exec(text)) !== null) {
    modules.push({
      title: mMatch[1],
      slug: mMatch[2],
      order_index: parseInt(mMatch[3]),
      description: mMatch[4],
      indexInFile: mMatch.index,
    });
  }

  for (let i = 0; i < modules.length; i++) {
    const currentMod = modules[i];
    const nextMod = modules[i + 1];
    const sectionText = text.substring(currentMod.indexInFile, nextMod ? nextMod.indexInFile : text.length);

    const lessonRegex = /INSERT INTO public\.lessons\s*\(([^)]+)\)\s*VALUES\s*\(\s*\w+,\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*\$markdown\$([\s\S]*?)\$markdown\$(?:,\s*'(\{[\s\S]*?\})'::jsonb)?(?:,\s*(NULL|'[^']+'))?\)\s*(?:RETURNING id INTO\s*(\w+);)?/gi;

    let lMatch;
    currentMod.lessons = [];
    while ((lMatch = lessonRegex.exec(sectionText)) !== null) {
      const lessonTitle = lMatch[2];
      const lessonSlug = lMatch[3];
      const orderIndex = parseInt(lMatch[4]);
      const content = lMatch[5];
      let videoUrl = lMatch[7];
      if (videoUrl === 'NULL' || !videoUrl) videoUrl = null;
      else if (videoUrl.startsWith("'") && videoUrl.endsWith("'")) videoUrl = videoUrl.slice(1, -1);

      const lessonStartIndex = lMatch.index;
      const lessonEndIndex = lessonStartIndex + lMatch[0].length;

      currentMod.lessons.push({
        title: lessonTitle,
        slug: lessonSlug,
        order_index: orderIndex,
        content,
        video_url: videoUrl,
        lessonEndIndex,
      });
    }

    for (let j = 0; j < currentMod.lessons.length; j++) {
      const l = currentMod.lessons[j];
      const nextL = currentMod.lessons[j + 1];
      const lessonSubText = sectionText.substring(l.lessonEndIndex, nextL ? nextL.lessonEndIndex - nextL.content.length : sectionText.length);

      const quizRegex = /INSERT INTO public\.quiz_questions\s*\([^)]+\)\s*VALUES\s*\([^,]+,\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'(\[[\s\S]*?\])'::jsonb,\s*(\d+),\s*(\d+)\);/gi;

      l.quizzes = [];
      let qMatch;
      while ((qMatch = quizRegex.exec(lessonSubText)) !== null) {
        const qText = qMatch[1].replace(/''/g, "'");
        let opts = [];
        try {
          opts = JSON.parse(qMatch[3]);
        } catch (e) {
          opts = JSON.parse(qMatch[3].replace(/\\"/g, '"'));
        }
        const correct = parseInt(qMatch[4]);
        l.quizzes.push({
          question_text: qText,
          options: opts,
          correct_option: String(correct),
        });
      }
    }
  }

  return { course, modules };
}

// -----------------------------------------------------------------------------
// Main execution
// -----------------------------------------------------------------------------
async function main() {
  console.log('🚀 Starting Complete Insyt Academy Platform Curriculum Seeding...');

  // 1. Delete placeholder / obsolete courses
  console.log('\n🧹 Cleaning up old & placeholder courses...');
  const obsoleteSlugs = ['gis-masterclass', 'gis-agri-arcgis', 'r-masterclass'];
  for (const slug of obsoleteSlugs) {
    const { error } = await supabase.from('courses').delete().eq('slug', slug);
    if (!error) console.log(`  Removed obsolete course: ${slug}`);
  }

  // 2. Seed GIS Course 1: Spatial Literacy & GIS Foundations
  const c1Id = await resetCourse(COURSE_1);
  await seedModulesWithLessons(c1Id, C1_MODULES);

  // 3. Seed GIS Course 2: GIS Analysis & Remote Sensing
  const c2Id = await resetCourse(COURSE_2);
  await seedModulesWithLessons(c2Id, COURSE_2_MODULES);

  // 4. Seed GIS Course 3: Geospatial Engineering & Cloud GIS
  const c3Id = await resetCourse(COURSE_3);
  await seedModulesWithLessons(c3Id, COURSE_3_MODULES);

  // 5. Seed R Course from r_course_seeds.sql
  const { course: R_COURSE, modules: R_MODULES } = parseRCourse();
  const rId = await resetCourse(R_COURSE);
  await seedModulesWithLessons(rId, R_MODULES);

  // 6. Verification
  console.log('\n=============================================');
  console.log('🏁 FINAL DATABASE STATE VERIFICATION:');
  console.log('=============================================');
  const { data: finalCourses } = await supabase
    .from('courses')
    .select('id, title, slug, modules(id, title, lessons(id, title, quizzes(id, quiz_questions(id))))')
    .order('created_at');

  for (const c of finalCourses || []) {
    const totalLessons = c.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    const totalQuizzes = c.modules?.reduce((acc, m) => {
      return acc + (m.lessons?.reduce((lAcc, l) => lAcc + (l.quizzes?.reduce((qAcc, q) => qAcc + (q.quiz_questions?.length || 0), 0) || 0), 0) || 0);
    }, 0) || 0;
    console.log(`* Course: "${c.title}" [slug: ${c.slug}]`);
    console.log(`  Modules: ${c.modules?.length || 0} | Lessons: ${totalLessons} | Quizzes: ${totalQuizzes}`);
  }
}

main().catch(err => {
  console.error('FATAL SEED ERROR:', err);
  process.exit(1);
});
