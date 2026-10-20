require('./load-env');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cisulrzguxljaxgogbzi.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const { COURSE_1, MODULES: C1_MODULES } = require('./seed-gis-course-1.js');
const { COURSE_2, COURSE_2_MODULES, COURSE_3, COURSE_3_MODULES } = require('./seed-gis-courses-2-3.js');

function parseRCourse() {
  const text = fs.readFileSync(path.join(__dirname, '../supabase/seeds/r_course_seeds.sql'), 'utf8');

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
      const lessonStartIndex = lMatch.index;
      const lessonEndIndex = lessonStartIndex + lMatch[0].length;

      currentMod.lessons.push({
        title: lessonTitle,
        slug: lessonSlug,
        order_index: orderIndex,
        lessonEndIndex,
      });
    }

    for (let j = 0; j < currentMod.lessons.length; j++) {
      const l = currentMod.lessons[j];
      const nextL = currentMod.lessons[j + 1];
      const lessonSubText = sectionText.substring(l.lessonEndIndex, nextL ? nextL.lessonEndIndex - (nextL.title?.length || 0) : sectionText.length);

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

  return modules;
}

async function attachQuizzesForCourse(courseSlug, modules) {
  console.log(`\nAttaching quizzes for course: [${courseSlug}]`);
  
  // 1. Get course ID
  const { data: course, error: cErr } = await supabase
    .from('courses')
    .select('id, modules(id, slug, lessons(id, slug, title))')
    .eq('slug', courseSlug)
    .single();

  if (cErr || !course) {
    console.error(`Course [${courseSlug}] not found:`, cErr);
    return;
  }

  // Create lookup for lessons: slug -> id
  const lessonLookup = new Map();
  for (const m of course.modules || []) {
    for (const l of m.lessons || []) {
      lessonLookup.set(l.slug, l.id);
    }
  }

  let totalQuizzesAdded = 0;
  let totalQuestionsAdded = 0;

  for (const mod of modules) {
    for (const l of (mod.lessons || [])) {
      const lessonId = lessonLookup.get(l.slug);
      if (!lessonId) {
        // Try fallback match
        continue;
      }

      const quizzes = l.quizzes || [];
      if (quizzes.length === 0) continue;

      // 1. Insert into quizzes
      const { data: qData, error: qErr } = await supabase.from('quizzes').insert({
        lesson_id: lessonId,
        title: `${l.title} Quiz`,
        is_published: true,
        pass_threshold: 60,
        max_xp: quizzes.length * 10,
        time_limit_seconds: 600,
      }).select('id').single();

      if (qErr) {
        console.warn(`  Quiz warning for [${l.title}]:`, qErr.message);
        continue;
      }

      totalQuizzesAdded++;

      // 2. Insert into quiz_questions
      const qRows = quizzes.map((q, idx) => ({
        quiz_id: qData.id,
        question_text: q.question_text || q.question,
        options: q.options,
        correct_option: String(q.correct_option ?? q.correct_answer ?? 0),
        explanation: q.explanation || null,
        points: 10,
        order_index: idx + 1,
      }));

      const { error: questErr } = await supabase.from('quiz_questions').insert(qRows);
      if (questErr) {
        console.warn(`  Questions warning for [${l.title}]:`, questErr.message);
      } else {
        totalQuestionsAdded += qRows.length;
      }
    }
  }

  console.log(`✓ Attached: ${totalQuizzesAdded} quizzes with ${totalQuestionsAdded} questions.`);
}

async function main() {
  console.log('🎯 Seeding All Quizzes...');

  // Clean any test quizzes
  await supabase.from('quiz_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('quizzes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Course 1
  await attachQuizzesForCourse('gis-spatial-foundations', C1_MODULES);

  // Course 2
  await attachQuizzesForCourse('gis-analysis-remote-sensing', COURSE_2_MODULES);

  // Course 3
  await attachQuizzesForCourse('gis-engineering-cloud', COURSE_3_MODULES);

  // R Course
  const rModules = parseRCourse();
  await attachQuizzesForCourse('r-agri-data-bau', rModules);

  console.log('\n🎉 ALL QUIZZES SUCCESSFULLY SEEDED!');
}

main().catch(console.error);
