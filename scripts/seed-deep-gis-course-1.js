require('./load-env');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const SUPABASE_URL = 'https://cisulrzguxljaxgogbzi.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Load all 8 module definitions
const moduleFiles = [
  require('./course1-data/module1.js'),
  require('./course1-data/module2.js'),
  require('./course1-data/module3.js'),
  require('./course1-data/module4.js'),
  require('./course1-data/module5.js'),
  require('./course1-data/module6.js'),
  require('./course1-data/module7.js'),
  require('./course1-data/module8.js'),
];

async function seedDeepGISCourse1() {
  console.log('===============================================================');
  console.log('🚀 INSYT ACADEMY: SEEDING DEEP GIS COURSE 1 CURRICULUM');
  console.log('COURSE: Spatial Literacy & GIS Foundations (gis-spatial-foundations)');
  console.log('TARGET: 8 MODULES, 56 COMPLETE LESSONS WITH FULL BANGLA CONTENT');
  console.log('===============================================================\n');

  // 1. Get or verify Course
  const courseSlug = 'gis-spatial-foundations';
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', courseSlug)
    .single();

  if (courseError || !course) {
    throw new Error(`Course ${courseSlug} not found in database: ${courseError?.message}`);
  }

  console.log(`✅ Found Course: "${course.title}" (ID: ${course.id})`);

  // Update course description & metadata to reflect new deep foundation program
  await supabase
    .from('courses')
    .update({
      title: 'Spatial Literacy & GIS Foundations',
      description: 'ভূগোল ও স্থানিক দৃষ্টিভঙ্গির গভীর বিজ্ঞান থেকে শুরু করে ভেক্টর-রাস্টার মডেল, কোঅর্ডিনেট রেফারেন্স সিস্টেম (CRS/EPSG), QGIS অপারেশন, অ্যাট্রিবিউট কুয়েরি, আধুনিক কার্টোগ্রাফি এবং একটি পূর্ণাঙ্গ কৃষি জিআইএস ক্যাপস্টোন প্রকল্প।',
      thumbnail_url: '/images/courses/gis-spatial-foundations.png',
      is_published: true,
    })
    .eq('id', course.id);

  // 2. Fetch existing modules for this course
  const { data: oldModules, error: oldModError } = await supabase
    .from('modules')
    .select('id, title')
    .eq('course_id', course.id);

  if (oldModError) {
    throw new Error(`Failed to fetch old modules: ${oldModError.message}`);
  }

  const oldModuleIds = (oldModules || []).map(m => m.id);
  console.log(`🧹 Found ${oldModuleIds.length} existing modules for this course to clean up.`);

  if (oldModuleIds.length > 0) {
    // Find all lessons under these modules
    const { data: oldLessons, error: oldLessError } = await supabase
      .from('lessons')
      .select('id')
      .in('module_id', oldModuleIds);

    if (oldLessError) {
      throw new Error(`Failed to fetch old lessons: ${oldLessError.message}`);
    }

    const oldLessonIds = (oldLessons || []).map(l => l.id);
    console.log(`   Found ${oldLessonIds.length} old lessons.`);

    if (oldLessonIds.length > 0) {
      // Find quizzes for these lessons
      const { data: oldQuizzes } = await supabase
        .from('quizzes')
        .select('id')
        .in('lesson_id', oldLessonIds);

      const oldQuizIds = (oldQuizzes || []).map(q => q.id);
      if (oldQuizIds.length > 0) {
        // Delete quiz attempts
        await supabase.from('quiz_attempts').delete().in('question_id', 
          (await supabase.from('quiz_questions').select('id').in('quiz_id', oldQuizIds)).data?.map(q => q.id) || []
        );
        // Delete quiz questions
        await supabase.from('quiz_questions').delete().in('quiz_id', oldQuizIds);
        // Delete quizzes
        await supabase.from('quizzes').delete().in('id', oldQuizIds);
        console.log(`   Deleted ${oldQuizIds.length} old quizzes & associated questions.`);
      }

      // Delete user_progress for old lessons
      await supabase.from('user_progress').delete().in('lesson_id', oldLessonIds);
      console.log(`   Cleaned up user_progress records for old lessons.`);

      // Delete old lessons
      const { error: delLessErr } = await supabase
        .from('lessons')
        .delete()
        .in('id', oldLessonIds);
      if (delLessErr) throw new Error(`Failed to delete old lessons: ${delLessErr.message}`);
      console.log(`   Successfully removed ${oldLessonIds.length} old lessons.`);
    }

    // Delete old modules
    const { error: delModErr } = await supabase
      .from('modules')
      .delete()
      .in('id', oldModuleIds);
    if (delModErr) throw new Error(`Failed to delete old modules: ${delModErr.message}`);
    console.log(`   Successfully removed ${oldModuleIds.length} old modules.\n`);
  }

  // 3. Insert New 8 Modules & 56 Complete Lessons
  let totalLessonsInserted = 0;
  let totalQuizzesInserted = 0;

  for (let mIdx = 0; mIdx < moduleFiles.length; mIdx++) {
    const modData = moduleFiles[mIdx];
    console.log(`📦 Inserting Module ${mIdx + 1}/8: "${modData.title}"...`);

    const { data: newMod, error: modInsertErr } = await supabase
      .from('modules')
      .insert({
        course_id: course.id,
        title: modData.title,
        slug: modData.slug,
        description: modData.description,
        order_index: modData.order_index || (mIdx + 1),
      })
      .select('id')
      .single();

    if (modInsertErr) {
      throw new Error(`Error inserting module ${modData.title}: ${modInsertErr.message}`);
    }

    const moduleId = newMod.id;

    for (let lIdx = 0; lIdx < modData.lessons.length; lIdx++) {
      const lesson = modData.lessons[lIdx];
      const lessonOrder = lesson.order_index || (lIdx + 1);

      const { data: newLesson, error: lessonInsertErr } = await supabase
        .from('lessons')
        .insert({
          module_id: moduleId,
          title: lesson.title,
          slug: lesson.slug,
          content: lesson.content,
          order_index: lessonOrder,
        })
        .select('id')
        .single();

      if (lessonInsertErr) {
        throw new Error(`Error inserting lesson "${lesson.title}": ${lessonInsertErr.message}`);
      }

      totalLessonsInserted++;

      // If lesson has assessment quizzes, insert into quizzes & quiz_questions
      if (lesson.quizzes && lesson.quizzes.length > 0) {
        const { data: newQuiz, error: quizInsertErr } = await supabase
          .from('quizzes')
          .insert({
            lesson_id: newLesson.id,
            title: `${lesson.title} — মূল্যায়ন`,
            description: 'এই পাঠের জ্ঞান ও স্থানিক পরিস্থিতি-ভিত্তিক মূল্যায়ন',
            is_published: true,
          })
          .select('id')
          .single();

        if (!quizInsertErr && newQuiz) {
          const questionRows = lesson.quizzes.map((q, qIdx) => ({
            quiz_id: newQuiz.id,
            question_text: q.question,
            options: q.options,
            correct_option: q.correct_option,
            explanation: q.explanation || '',
            points: 10,
            order_index: qIdx + 1,
          }));

          const { error: qErr } = await supabase
            .from('quiz_questions')
            .insert(questionRows);

          if (!qErr) {
            totalQuizzesInserted += questionRows.length;
          } else {
            console.warn(`      ⚠️ Quiz questions warning on ${lesson.slug}: ${qErr.message}`);
          }
        }
      }
    }
    console.log(`   ✓ Module ${mIdx + 1} completed with ${modData.lessons.length} lessons.`);
  }

  console.log('\n===============================================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log(`📊 Summary for "${course.title}":`);
  console.log(`   - Modules Inserted: ${moduleFiles.length}`);
  console.log(`   - Total Lessons Inserted: ${totalLessonsInserted}`);
  console.log(`   - Total Interactive Quiz Questions: ${totalQuizzesInserted}`);
  console.log('===============================================================\n');

  // Final database state verification
  const { data: verifyMods } = await supabase
    .from('modules')
    .select('id, title, order_index')
    .eq('course_id', course.id)
    .order('order_index');

  console.log('🔍 Verified Modules in Database:');
  for (const m of verifyMods || []) {
    const { count } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('module_id', m.id);
    console.log(`   [Module ${m.order_index}] ${m.title} — ${count} Lessons`);
  }
}

seedDeepGISCourse1()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Fatal Error in seedDeepGISCourse1:', err);
    process.exit(1);
  });
