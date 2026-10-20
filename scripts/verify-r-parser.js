const fs = require('fs');

const text = fs.readFileSync('supabase/seeds/r_course_seeds.sql', 'utf8');

// 1. Course
const courseMatch = text.match(/INSERT INTO public\.courses\s*\([^)]+\)\s*VALUES\s*\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(TRUE|FALSE),\s*'([^']+)'\s*\)/i);
console.log('Course matched:', courseMatch ? {
  title: courseMatch[1],
  slug: courseMatch[2],
  description: courseMatch[3],
  thumbnail_url: courseMatch[5]
} : 'Failed');

// 2. Modules
// Notice in the SQL:
// INSERT INTO public.modules (course_id, title, slug, order_index, description)
// VALUES (r_cid, 'Module 1: Orientation & Setup', 'orientation-setup', 1, 'Get comfortable with R language and specific BAU tools.')
// RETURNING id INTO m1_id;

// Split by module definitions
const moduleRegex = /INSERT INTO public\.modules\s*\([^)]+\)\s*VALUES\s*\([^,]+,\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*'([^']+)'\)\s*RETURNING id INTO ([^;]+);/gi;
const modules = [];
let mMatch;
while ((mMatch = moduleRegex.exec(text)) !== null) {
  modules.push({
    title: mMatch[1],
    slug: mMatch[2],
    order_index: parseInt(mMatch[3]),
    description: mMatch[4],
    varName: mMatch[5].trim(),
    indexInFile: mMatch.index,
  });
}
console.log(`Found ${modules.length} modules.`);

// For each module, find its section until the next module (or EOF)
let totalLessons = 0;
let totalQuizzes = 0;

for (let i = 0; i < modules.length; i++) {
  const currentMod = modules[i];
  const nextMod = modules[i + 1];
  const sectionText = text.substring(currentMod.indexInFile, nextMod ? nextMod.indexInFile : text.length);

  // Lessons inside this module
  // INSERT INTO public.lessons (module_id, title, slug, order_index, content, [content_variants,] video_url) VALUES (m1_id, ...
  // Pattern:
  // INSERT INTO public.lessons ([^)]+) VALUES (\w+,\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*\$markdown\$([\s\S]*?)\$markdown\$(?:,\s*'(\{[\s\S]*?\})'::jsonb)?(?:,\s*(NULL|'[^']+'))?\)\s*RETURNING id INTO (\w+);

  const lessonRegex = /INSERT INTO public\.lessons\s*\(([^)]+)\)\s*VALUES\s*\(\s*\w+,\s*'([^']+)',\s*'([^']+)',\s*(\d+),\s*\$markdown\$([\s\S]*?)\$markdown\$(?:,\s*'(\{[\s\S]*?\})'::jsonb)?(?:,\s*(NULL|'[^']+'))?\)\s*(?:RETURNING id INTO\s*(\w+);)?/gi;
  
  let lMatch;
  currentMod.lessons = [];
  while ((lMatch = lessonRegex.exec(sectionText)) !== null) {
    const lessonTitle = lMatch[2];
    const lessonSlug = lMatch[3];
    const orderIndex = parseInt(lMatch[4]);
    const content = lMatch[5];
    const variants = lMatch[6] ? JSON.parse(lMatch[6]) : null;
    let videoUrl = lMatch[7];
    if (videoUrl === 'NULL' || !videoUrl) videoUrl = null;
    else if (videoUrl.startsWith("'") && videoUrl.endsWith("'")) videoUrl = videoUrl.slice(1, -1);

    // Find quiz questions for this lesson by looking ahead until the next lesson or next module
    const lessonStartIndex = lMatch.index;
    const lessonEndIndex = lessonStartIndex + lMatch[0].length;
    
    currentMod.lessons.push({
      title: lessonTitle,
      slug: lessonSlug,
      order_index: orderIndex,
      content,
      content_variants: variants,
      video_url: videoUrl,
      lessonEndIndex,
    });
    totalLessons++;
  }

  // Now find quizzes for each lesson in sectionText
  for (let j = 0; j < currentMod.lessons.length; j++) {
    const l = currentMod.lessons[j];
    const nextL = currentMod.lessons[j + 1];
    const lessonSubText = sectionText.substring(l.lessonEndIndex, nextL ? nextL.lessonEndIndex - nextL.content.length : sectionText.length);
    
    // Quiz pattern:
    // INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '...', '...', '["..."]'::jsonb, 2, 2);
    const quizRegex = /INSERT INTO public\.quiz_questions\s*\([^)]+\)\s*VALUES\s*\([^,]+,\s*'((?:''|[^'])*)',\s*'((?:''|[^'])*)',\s*'(\[[\s\S]*?\])'::jsonb,\s*(\d+),\s*(\d+)\);/gi;
    
    l.quizzes = [];
    let qMatch;
    while ((qMatch = quizRegex.exec(lessonSubText)) !== null) {
      const qText = qMatch[1].replace(/''/g, "'");
      let opts = [];
      try {
        opts = JSON.parse(qMatch[3]);
      } catch (e) {
        // try cleaning
        opts = JSON.parse(qMatch[3].replace(/\\"/g, '"'));
      }
      const correct = parseInt(qMatch[4]);
      l.quizzes.push({
        question_text: qText,
        options: opts,
        correct_option: String(correct),
      });
      totalQuizzes++;
    }
  }
}

console.log(`Parsed Summary: ${modules.length} modules, ${totalLessons} lessons, ${totalQuizzes} quizzes.`);
for (const m of modules.slice(0, 3)) {
  console.log(`Module: ${m.title} -> ${m.lessons.length} lessons`);
  for (const l of m.lessons) {
    console.log(`  - Lesson: ${l.title} (${l.quizzes.length} quizzes)`);
  }
}
