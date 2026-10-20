require('./load-env');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const sourceDir = path.join(__dirname, '..', 'app', 'Course Photos');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'courses');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const fileMappings = [
  {
    src: 'Spatial Literacy GIS Foundations.png',
    destSlug: 'gis-spatial-foundations.png',
    courseSlug: 'gis-spatial-foundations',
    url: '/images/courses/gis-spatial-foundations.png',
  },
  {
    src: 'GIS Analysis and Remote Sensing.png',
    destSlug: 'gis-analysis-remote-sensing.png',
    courseSlug: 'gis-analysis-remote-sensing',
    url: '/images/courses/gis-analysis-remote-sensing.png',
  },
  {
    src: 'Geospatial Engineering and Cloud GIS.png',
    destSlug: 'gis-engineering-cloud.png',
    courseSlug: 'gis-engineering-cloud',
    url: '/images/courses/gis-engineering-cloud.png',
  },
  {
    src: 'R.png',
    destSlug: 'r-agri-data-bau.png',
    courseSlug: 'r-agri-data-bau',
    url: '/images/courses/r-agri-data-bau.png',
  },
  {
    src: 'Machine Learning.png',
    destSlug: 'ml-masterclass.png',
    courseSlug: 'ml-masterclass',
    url: '/images/courses/ml-masterclass.png',
  },
];

console.log('Copying course photos to public/images/courses...');
for (const mapping of fileMappings) {
  const srcPath = path.join(sourceDir, mapping.src);
  if (fs.existsSync(srcPath)) {
    // Copy as slug-based filename
    const destSlugPath = path.join(targetDir, mapping.destSlug);
    fs.copyFileSync(srcPath, destSlugPath);
    // Also copy with original name as fallback
    const destOrigPath = path.join(targetDir, mapping.src);
    fs.copyFileSync(srcPath, destOrigPath);
    console.log(`✓ Copied "${mapping.src}" -> "${mapping.destSlug}" (${fs.statSync(destSlugPath).size} bytes)`);
  } else {
    console.error(`✗ Source file not found: ${srcPath}`);
  }
}

const supabase = createClient('https://cisulrzguxljaxgogbzi.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

async function updateDb() {
  console.log('\nUpdating course records in Supabase...');
  for (const mapping of fileMappings) {
    const { data, error } = await supabase
      .from('courses')
      .update({ thumbnail_url: mapping.url })
      .eq('slug', mapping.courseSlug)
      .select('id, title, slug, thumbnail_url');

    if (error) {
      console.error(`✗ Error updating course ${mapping.courseSlug}:`, error);
    } else {
      console.log(`✓ Updated course "${mapping.courseSlug}":`, data?.[0]?.thumbnail_url);
    }
  }

  // Verify all courses now
  const { data: allCourses } = await supabase
    .from('courses')
    .select('id, title, slug, thumbnail_url');
  console.log('\nAll updated course records:');
  console.log(JSON.stringify(allCourses, null, 2));
}

updateDb();
