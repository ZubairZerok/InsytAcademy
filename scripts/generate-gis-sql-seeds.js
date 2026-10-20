const fs = require('fs');
const path = require('path');
const { COURSE_2, COURSE_2_MODULES, COURSE_3, COURSE_3_MODULES } = require('./seed-gis-courses-2-3.js');

function escapeSql(str) {
  if (!str) return "''";
  return "'" + str.replace(/'/g, "''") + "'";
}

function generateCourseSql(course, modules) {
  let sql = `-- SEED DATA: ${course.title.toUpperCase()}\n`;
  sql += `-- Auto-generated SQL seed\n\n`;
  sql += `DO $$\nDECLARE\n  c_id UUID;\n  m_id UUID;\n  l_id UUID;\nBEGIN\n`;
  sql += `  DELETE FROM public.courses WHERE slug = ${escapeSql(course.slug)};\n\n`;
  sql += `  INSERT INTO public.courses (title, slug, description, is_published, thumbnail_url)\n`;
  sql += `  VALUES (${escapeSql(course.title)}, ${escapeSql(course.slug)}, ${escapeSql(course.description)}, TRUE, ${escapeSql(course.thumbnail_url)})\n`;
  sql += `  RETURNING id INTO c_id;\n\n`;

  for (const mod of modules) {
    sql += `  -- Module: ${mod.title}\n`;
    sql += `  INSERT INTO public.modules (course_id, title, slug, order_index, description)\n`;
    sql += `  VALUES (c_id, ${escapeSql(mod.title)}, ${escapeSql(mod.slug)}, ${mod.order_index}, ${escapeSql(mod.description)})\n`;
    sql += `  RETURNING id INTO m_id;\n\n`;

    for (const l of (mod.lessons || [])) {
      sql += `  -- Lesson: ${l.title}\n`;
      sql += `  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)\n`;
      sql += `  VALUES (m_id, ${escapeSql(l.title)}, ${escapeSql(l.slug)}, ${l.order_index}, $markdown$\n${l.content}\n$markdown$, ${l.video_url ? escapeSql(l.video_url) : 'NULL'})\n`;
      sql += `  RETURNING id INTO l_id;\n\n`;
    }
  }

  sql += `END $$;\n`;
  return sql;
}

const c2Sql = generateCourseSql(COURSE_2, COURSE_2_MODULES);
fs.writeFileSync(path.join(__dirname, '../supabase/seeds/gis_course_2_analysis.sql'), c2Sql, 'utf8');
console.log('✓ Generated supabase/seeds/gis_course_2_analysis.sql');

const c3Sql = generateCourseSql(COURSE_3, COURSE_3_MODULES);
fs.writeFileSync(path.join(__dirname, '../supabase/seeds/gis_course_3_engineering.sql'), c3Sql, 'utf8');
console.log('✓ Generated supabase/seeds/gis_course_3_engineering.sql');
