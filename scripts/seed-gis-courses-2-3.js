require('./load-env');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cisulrzguxljaxgogbzi.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Helper to insert a course and return its id
async function upsertCourse(course) {
  // Delete existing
  await supabase.from('courses').delete().eq('slug', course.slug);
  
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select('id')
    .single();
  
  if (error) throw new Error(`Course insert failed: ${error.message}`);
  return data.id;
}

// Helper to insert a module and return its id
async function insertModule(mod) {
  const { data, error } = await supabase
    .from('modules')
    .insert(mod)
    .select('id')
    .single();
  
  if (error) throw new Error(`Module insert failed: ${error.message}`);
  return data.id;
}

// Helper to insert a lesson and return its id
async function insertLesson(lesson) {
  const { data, error } = await supabase
    .from('lessons')
    .insert(lesson)
    .select('id')
    .single();
  
  if (error) throw new Error(`Lesson insert failed: ${error.message}`);
  return data.id;
}

// Helper to insert quiz questions
async function insertQuizzes(lessonId, quizzes) {
  const rows = quizzes.map(q => ({
    lesson_id: lessonId,
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
  }));
  
  const { error } = await supabase.from('quiz_questions').insert(rows);
  if (error) console.warn(`Quiz insert warning: ${error.message}`);
}

// =============================================================================
// COURSE DATA DEFINITIONS
// =============================================================================

const COURSE_1 = {
  title: 'Spatial Literacy & GIS Foundations',
  slug: 'gis-spatial-foundations',
  description: 'GIS এর মূল ভিত্তি শিখুন — স্পেশিয়াল থিংকিং, কোঅর্ডিনেট সিস্টেম, ভেক্টর-রাস্টার ডেটা মডেল, QGIS পরিচিতি এবং আপনার প্রথম কৃষি মানচিত্র তৈরি করুন।',
  is_published: true,
  thumbnail_url: '/images/courses/gis-spatial-foundations.png',
};

const COURSE_2 = {
  title: 'GIS Analysis & Remote Sensing',
  slug: 'gis-analysis-remote-sensing',
  description: 'স্পেশিয়াল বিশ্লেষণ ও রিমোট সেন্সিং শিখুন — Geoprocessing, Terrain Analysis, NDVI, Supervised Classification, Change Detection এবং Field Data Collection।',
  is_published: true,
  thumbnail_url: '/images/courses/gis-analysis-remote-sensing.png',
};

const COURSE_3 = {
  title: 'Geospatial Engineering & Cloud GIS',
  slug: 'gis-engineering-cloud',
  description: 'প্রোডাকশন-গ্রেড জিওস্পেশিয়াল ইঞ্জিনিয়ারিং — PostgreSQL/PostGIS, Spatial SQL, Python (GeoPandas/Rasterio), Google Earth Engine, R Spatial এবং Web GIS।',
  is_published: true,
  thumbnail_url: '/images/courses/gis-engineering-cloud.png',
};

// Helper function to build a full module definition
function buildModules(modules) {
  return modules;
}

// =============================================================================
// COURSE 2 MODULES
// =============================================================================
const COURSE_2_MODULES = [
  {
    title: 'Module 1: Vector Geoprocessing Toolkit',
    slug: 'mod1-vector-geoprocessing',
    order_index: 1,
    description: 'Buffer, Clip, Intersect, Union, Dissolve — ভেক্টর বিশ্লেষণের মূল হাতিয়ারগুলো।',
    lessons: [
      {
        title: '1. Buffer ও Clip: নিকটতা ও কাটিং বিশ্লেষণ',
        slug: 'buffer-clip-analysis',
        order_index: 1,
        content: `# Lesson 1: Buffer ও Clip — নিকটতা ও কাটিং বিশ্লেষণ

## Buffer কী?

**Buffer** হলো একটি ফিচারের চারপাশে নির্দিষ্ট দূরত্বের জোন তৈরি করা।

### কৃষিতে Buffer এর ব্যবহার:
- 🌊 নদী থেকে **৫০০ মিটার** সুরক্ষিত এলাকা → বন্যা ঝুঁকি মূল্যায়ন
- 🏭 কারখানা থেকে **১ কিমি** বাফার → দূষণ প্রভাবিত কৃষি জমি চিহ্নিতকরণ
- 🛤️ রাস্তা থেকে **২০০ মিটার** → বাজারে প্রবেশযোগ্য জমি

### QGIS এ Buffer তৈরি:
1. **Vector → Geoprocessing Tools → Buffer**
2. Input Layer: যেটির চারপাশে বাফার চান
3. Distance: দূরত্ব (মিটারে — **অবশ্যই Projected CRS এ!**)
4. **Run**

> ⚠️ **সাবধান!** Buffer সবসময় **Projected CRS** (যেমন UTM) এ করুন। Geographic CRS (EPSG:4326) এ Buffer করলে দূরত্ব ডিগ্রিতে হয়, মিটারে নয়!

## Clip কী?

**Clip** হলো cookie-cutter এর মতো — একটি Polygon দিয়ে অন্য Layer কেটে বের করা।

### উদাহরণ:
- পুরো বাংলাদেশের DEM থেকে **শুধু ময়মনসিংহ জেলার** অংশ কেটে নেওয়া
- বিশাল ভূমি ব্যবহার ম্যাপ থেকে **শুধু আপনার স্টাডি এরিয়া** বের করা

### QGIS এ Clip:
1. **Vector → Geoprocessing Tools → Clip**
2. Input Layer: যেটি কাটতে চান
3. Overlay Layer: যে Polygon দিয়ে কাটবেন (mask)
4. **Run**

## সারসংক্ষেপ
1. **Buffer** = ফিচারের চারপাশে দূরত্ব ভিত্তিক জোন
2. **Clip** = একটি Polygon দিয়ে অন্য Layer কেটে নেওয়া
3. সবসময় **Projected CRS** এ কাজ করুন`,
        quizzes: [
          { question: 'নদী থেকে ৫০০ মিটারের মধ্যে কত কৃষি জমি আছে — এটি বের করতে কোন টুল ব্যবহার হবে?', options: ['Buffer', 'Dissolve', 'Union', 'Merge'], correct_answer: 0 },
          { question: 'EPSG:4326 এ Buffer করলে কী সমস্যা হয়?', options: ['দূরত্ব ডিগ্রিতে হয়, মিটারে নয়', 'সফটওয়্যার ক্র্যাশ করে', 'ফাইল মুছে যায়', 'কোন সমস্যা হয় না'], correct_answer: 0 },
          { question: 'Clip অপারেশনে Overlay Layer এর ভূমিকা কী?', options: ['Cookie-cutter হিসেবে কাটার সীমানা নির্ধারণ', 'রঙ পরিবর্তন', 'CRS পরিবর্তন', 'ডেটা ডিলিট'], correct_answer: 0 },
        ]
      },
      {
        title: '2. Intersect, Union ও Dissolve',
        slug: 'intersect-union-dissolve',
        order_index: 2,
        content: `# Lesson 2: Intersect, Union ও Dissolve

## Intersect (ছেদ)
দুটি Layer এর **Common/Overlapping** অংশ বের করে, উভয় Layer এর Attribute সহ।

**উদাহরণ:** কৃষি জমি Layer ∩ বন্যা জোন Layer = বন্যা ঝুঁকিতে থাকা কৃষি জমি (উভয়ের Attribute সহ)

## Union (সংযোগ)
দুটি Layer কে একত্রে মিশিয়ে দেয় — Overlapping ও Non-overlapping সব অংশ থাকে।

**উদাহরণ:** দুটি আলাদা সার্ভে এলাকার ম্যাপ একটি Layer এ মেশানো

## Dissolve (গলানো)
একটি Layer এর ভেতরে **একই Attribute মানের** পাশাপাশি Polygon গুলো মিশিয়ে দেয়।

**উদাহরণ:** 
- ৬৪ জেলাকে **বিভাগ অনুযায়ী Dissolve** করলে ৮টি বিভাগের Polygon পাওয়া যায়
- উপজেলাভিত্তিক ভূমি ব্যবহারকে **জেলা পর্যায়ে Dissolve** করে সমষ্টিগত তথ্য পাওয়া

### QGIS এ Dissolve:
1. **Vector → Geoprocessing Tools → Dissolve**
2. Input Layer সিলেক্ট
3. **Dissolve field:** কোন Column অনুযায়ী মেশাবেন (যেমন "Division")
4. **Run**

## Geoprocessing ফ্লোচার্ট

\`\`\`
          Input Layer A
              |
    ┌─────────┼──────────┐
    ▼         ▼          ▼
 Intersect  Union    Dissolve
 (A ∩ B)   (A ∪ B)  (Merge by Attr)
\`\`\`

## সারসংক্ষেপ
1. **Intersect** = দুটি Layer এর Common অংশ (উভয়ের Attribute সহ)
2. **Union** = দুটি Layer কে সম্পূর্ণভাবে একত্রিত
3. **Dissolve** = একই Attribute এর পাশাপাশি Polygon মিশিয়ে দেওয়া`,
        quizzes: [
          { question: '৬৪ জেলাকে বিভাগ অনুযায়ী একত্র করতে কোন অপারেশন ব্যবহার হয়?', options: ['Dissolve', 'Buffer', 'Clip', 'Split'], correct_answer: 0 },
          { question: 'Intersect ও Clip এর মূল পার্থক্য কী?', options: ['Intersect উভয় Layer এর Attribute রাখে, Clip শুধু Input Layer এর', 'কোন পার্থক্য নেই', 'Clip দ্রুত কাজ করে', 'Intersect শুধু Point ডেটায় কাজ করে'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 2: Raster ও Terrain Analysis',
    slug: 'mod2-raster-terrain-analysis',
    order_index: 2,
    description: 'DEM থেকে Slope, Aspect, Hillshade এবং Zonal Statistics গণনা।',
    lessons: [
      {
        title: '1. Slope, Aspect ও Hillshade: ভূমি বিশ্লেষণ',
        slug: 'slope-aspect-hillshade',
        order_index: 1,
        content: `# Lesson 1: Slope, Aspect ও Hillshade

DEM (Digital Elevation Model) থেকে ভূমির তিনটি গুরুত্বপূর্ণ বৈশিষ্ট্য বের করা যায়।

## Slope (ঢাল)
প্রতিটি পিক্সেলের **ঢালের পরিমাণ** — ডিগ্রি বা শতাংশে।

**কৃষিতে গুরুত্ব:**
- ঢাল > ১৫° → যান্ত্রিক চাষ কঠিন
- ঢাল > ২৫° → মাটি ক্ষয়ের উচ্চ ঝুঁকি → সংরক্ষণমূলক কৃষি দরকার
- সমতল ভূমি (< ৫°) → সেচ ও যন্ত্র ব্যবহারে সুবিধা

### QGIS এ Slope:
**Raster → Analysis → Slope** → Input DEM → Output: ডিগ্রিতে ঢালের ম্যাপ

## Aspect (মুখ)
প্রতিটি পিক্সেলের **ঢালের দিক** — উত্তর (0°), পূর্ব (90°), দক্ষিণ (180°), পশ্চিম (270°)।

**কৃষিতে গুরুত্ব:**
- দক্ষিণ-মুখী ঢাল → বেশি সূর্যালোক → শীতকালীন ফসলে সুবিধা
- উত্তর-মুখী ঢাল → ছায়াযুক্ত → আর্দ্রতা বেশি থাকে

## Hillshade (ছায়া প্রভাব)
কৃত্রিম আলোর উৎস ব্যবহার করে DEM এর **3D-like ভিজ্যুয়ালাইজেশন** তৈরি করে।

- ম্যাপকে ত্রিমাত্রিক চেহারা দেয়
- Basemap হিসেবে চমৎকার (অস্বচ্ছতা কমিয়ে অন্য Layer এর নিচে রাখুন)

### QGIS এ Hillshade:
**Raster → Analysis → Hillshade** → Input DEM → Azimuth: 315° (উত্তর-পশ্চিম আলো)

## সারসংক্ষেপ
1. **Slope** = ঢালের তীব্রতা → যান্ত্রিক চাষযোগ্যতা ও ক্ষয় ঝুঁকি
2. **Aspect** = ঢালের দিক → সূর্যালোক ও আর্দ্রতা
3. **Hillshade** = 3D ভিজ্যুয়ালাইজেশন → সুন্দর ম্যাপ Basemap`,
        quizzes: [
          { question: 'কোন Slope এর বেশি হলে যান্ত্রিক চাষ কঠিন হয়ে পড়ে?', options: ['১৫ ডিগ্রি', '১ ডিগ্রি', '৪৫ ডিগ্রি', '৯০ ডিগ্রি'], correct_answer: 0 },
          { question: 'Hillshade এর প্রধান উদ্দেশ্য কী?', options: ['DEM কে 3D-like ভিজ্যুয়ালাইজেশন দেওয়া', 'ডেটা মুছে ফেলা', 'CRS বদলানো', 'Polygon তৈরি'], correct_answer: 0 },
        ]
      },
      {
        title: '2. Zonal Statistics: Raster + Vector বিশ্লেষণ',
        slug: 'zonal-statistics',
        order_index: 2,
        content: `# Lesson 2: Zonal Statistics — Raster ও Vector এর মিলন

**Zonal Statistics** হলো একটি **Polygon Layer** এর প্রতিটি ফিচারের (Zone) ভেতরে একটি **Raster Layer** এর পরিসংখ্যান গণনা করা।

## কৃষিতে ব্যবহার

| Raster Input | Vector Zones | আউটপুট | ব্যবহার |
|---|---|---|---|
| DEM (উচ্চতা) | জেলা সীমানা | গড় উচ্চতা, সর্বনিম্ন-সর্বোচ্চ | বন্যা ঝুঁকি |
| NDVI (ফসল স্বাস্থ্য) | কৃষি প্লট | গড় NDVI, Std Dev | ফলন পূর্বাভাস |
| বৃষ্টিপাত Raster | উপজেলা | মোট বৃষ্টিপাত | খরা পর্যবেক্ষণ |
| তাপমাত্রা | বিভাগ | গড় তাপমাত্রা | জলবায়ু বিশ্লেষণ |

## QGIS এ Zonal Statistics:
1. **Processing Toolbox → Raster Analysis → Zonal Statistics**
2. Raster Layer: DEM বা NDVI
3. Vector Layer: জেলা বা প্লট সীমানা
4. Statistics: Mean, Min, Max, Sum, Std Dev
5. **Run** → Vector Layer এর Attribute Table এ নতুন Column যোগ হবে

> 💡 **এটি সবচেয়ে শক্তিশালী GIS টুলগুলোর একটি!** একটি জেলার গড় NDVI জানতে লাখ লাখ পিক্সেল ম্যানুয়ালি গণনা না করে, একটি ক্লিকেই উত্তর পান।

## সারসংক্ষেপ
1. Zonal Statistics = Raster এর মান + Vector এর সীমানা → পরিসংখ্যান
2. কৃষিতে অপরিহার্য: গড় NDVI, গড় উচ্চতা, মোট বৃষ্টিপাত
3. আউটপুট Vector Layer এর Attribute Table এ নতুন Column হিসেবে যোগ হয়`,
        quizzes: [
          { question: 'Zonal Statistics এ "Zone" কী?', options: ['Vector Polygon Layer এর প্রতিটি ফিচার', 'Raster এর প্রতিটি পিক্সেল', 'একটি CRS', 'একটি Color Ramp'], correct_answer: 0 },
          { question: 'জেলাভিত্তিক গড় NDVI বের করতে কোন টুল ব্যবহার হয়?', options: ['Zonal Statistics', 'Buffer', 'Clip', 'Dissolve'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 3: Remote Sensing Fundamentals',
    slug: 'mod3-remote-sensing',
    order_index: 3,
    description: 'রিমোট সেন্সিং এর মূল ধারণা — তড়িৎচুম্বকীয় বর্ণালী, স্পেকট্রাল সিগনেচার ও ডেটা উৎস।',
    lessons: [
      {
        title: '1. রিমোট সেন্সিং ও তড়িৎচুম্বকীয় বর্ণালী',
        slug: 'remote-sensing-em-spectrum',
        order_index: 1,
        content: `# Lesson 1: রিমোট সেন্সিং ও তড়িৎচুম্বকীয় বর্ণালী

## রিমোট সেন্সিং কী?
দূর থেকে (Remote) কোনো বস্তু বা এলাকার তথ্য সংগ্রহ (Sensing) করার প্রযুক্তি — সরাসরি স্পর্শ না করেই। মূলত **স্যাটেলাইট** বা **ড্রোন** থেকে তড়িৎচুম্বকীয় বিকিরণ (EMR) ব্যবহার করে তথ্য সংগ্রহ।

## তড়িৎচুম্বকীয় বর্ণালী (EM Spectrum)

| বিভাগ | তরঙ্গদৈর্ঘ্য | GIS এ ব্যবহার |
|---|---|---|
| **Visible (দৃশ্যমান)** | 400-700 nm | True Color ইমেজ (RGB) |
| **Near-Infrared (NIR)** | 700-1400 nm | 🌱 উদ্ভিদ স্বাস্থ্য |
| **SWIR** | 1400-3000 nm | মাটির আর্দ্রতা, খনিজ |
| **Thermal IR** | 8-15 μm | ভূপৃষ্ঠের তাপমাত্রা |
| **Microwave (Radar)** | 1 mm - 1 m | মেঘ ভেদ করে দেখতে পারে → বন্যা ম্যাপিং |

## স্পেকট্রাল সিগনেচার

প্রতিটি পদার্থ আলোর বিভিন্ন তরঙ্গদৈর্ঘ্য **ভিন্নভাবে প্রতিফলন** করে:
- 🌿 **সবুজ গাছপালা:** Red কম শোষণ করে (ক্লোরোফিল), NIR **অনেক বেশি** প্রতিফলন করে
- 💧 **পানি:** Visible এ কিছুটা প্রতিফলন, NIR এ **প্রায় শূন্য** (শোষণ করে)
- 🏗️ **ভবন/শহর:** সব ব্যান্ডে মোটামুটি সমান প্রতিফলন

> 💡 এই পার্থক্যই আমাদের স্যাটেলাইট ইমেজ থেকে **ফসল চিহ্নিত করতে**, পানি খুঁজে বের করতে, এবং ভূমি ব্যবহার শ্রেণিবিভাগ করতে সাহায্য করে!

## সারসংক্ষেপ
1. রিমোট সেন্সিং = দূর থেকে EMR ব্যবহার করে তথ্য সংগ্রহ
2. বিভিন্ন তরঙ্গদৈর্ঘ্য বিভিন্ন তথ্য দেয়
3. প্রতিটি পদার্থের আলাদা Spectral Signature আছে`,
        quizzes: [
          { question: 'সবুজ গাছপালা কোন ব্যান্ডে সবচেয়ে বেশি প্রতিফলন করে?', options: ['NIR (Near-Infrared)', 'Blue', 'Red', 'Thermal'], correct_answer: 0 },
          { question: 'পানি NIR ব্যান্ডে কিভাবে আচরণ করে?', options: ['প্রায় সম্পূর্ণ শোষণ করে (কম প্রতিফলন)', 'অনেক বেশি প্রতিফলন করে', 'কোন প্রভাব নেই', 'সবুজ রঙ দেখায়'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 4: Spectral Indices — NDVI, NDWI, EVI',
    slug: 'mod4-spectral-indices',
    order_index: 4,
    description: 'ফসল স্বাস্থ্য ও পানির সূচক — NDVI, NDWI, EVI গণনা ও ব্যাখ্যা।',
    lessons: [
      {
        title: '1. NDVI: ফসল স্বাস্থ্যের ব্যারোমিটার',
        slug: 'ndvi-crop-health',
        order_index: 1,
        content: `# Lesson 1: NDVI — ফসল স্বাস্থ্যের ব্যারোমিটার

## NDVI কী?
**Normalized Difference Vegetation Index (NDVI)** হলো সবচেয়ে জনপ্রিয় Vegetation Index। এটি ফসলের সবুজতা ও স্বাস্থ্য পরিমাপ করে।

## NDVI সূত্র:
\`\`\`
NDVI = (NIR - Red) / (NIR + Red)
\`\`\`

Sentinel-2 এ: NIR = Band 8, Red = Band 4

## NDVI মানের ব্যাখ্যা:

| NDVI মান | অর্থ | রঙ |
|---|---|---|
| -1.0 to 0.0 | পানি, মেঘ, তুষার | 🔵 নীল |
| 0.0 to 0.2 | মাটি, বালু, শহুরে এলাকা | 🟤 বাদামী |
| 0.2 to 0.4 | ঘাস, ঝোপ, শুকনো ফসল | 🟡 হলুদ |
| 0.4 to 0.6 | মাঝারি সবুজ ফসল | 🟢 হালকা সবুজ |
| 0.6 to 0.9 | ঘন সবুজ ফসল, বন | 🌲 গাঢ় সবুজ |

## QGIS এ NDVI গণনা (Raster Calculator):
1. **Raster → Raster Calculator**
2. Expression: \`("B8@1" - "B4@1") / ("B8@1" + "B4@1")\`
3. Output: \`NDVI_output.tif\`

## কৃষিতে NDVI ব্যবহার:
- 📈 ফসলের বৃদ্ধি পর্যবেক্ষণ (সময় অনুযায়ী NDVI পরিবর্তন)
- 🐛 কীটপতঙ্গ/রোগ আক্রমণ চিহ্নিতকরণ (হঠাৎ NDVI কমে গেলে)
- 🌾 ফলন পূর্বাভাস
- 🔥 খরা প্রভাবিত এলাকা চিহ্নিতকরণ

## সারসংক্ষেপ
1. NDVI = (NIR - Red) / (NIR + Red) → মান -1 থেকে +1
2. বেশি NDVI = বেশি সবুজ/সুস্থ ফসল
3. QGIS Raster Calculator দিয়ে সহজেই গণনা করা যায়`,
        quizzes: [
          { question: 'NDVI = 0.75 মানে কী?', options: ['ঘন সবুজ ও সুস্থ ফসল', 'পানি', 'মরুভূমি', 'শহুরে এলাকা'], correct_answer: 0 },
          { question: 'NDVI গণনায় কোন দুটি ব্যান্ড ব্যবহৃত হয়?', options: ['NIR ও Red', 'Blue ও Green', 'Thermal ও SWIR', 'Red ও Green'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 5: Supervised Classification',
    slug: 'mod5-supervised-classification',
    order_index: 5,
    description: 'ভূমি আচ্ছাদন শ্রেণিবিভাগ — Training Sites, ML Algorithms ও Accuracy Assessment।',
    lessons: [
      {
        title: '1. Supervised Classification Pipeline',
        slug: 'supervised-classification-pipeline',
        order_index: 1,
        content: `# Lesson 1: Supervised Classification Pipeline

## ভূমি আচ্ছাদন শ্রেণিবিভাগ কী?
স্যাটেলাইট ইমেজের **প্রতিটি পিক্সেলকে** একটি শ্রেণিতে (Class) ভাগ করা — যেমন পানি, ফসল, বন, শহর, খালি মাটি।

## Supervised Classification এর ধাপ:

### ধাপ ১: Training Sites তৈরি
আপনি নিজে ম্যাপে কিছু এলাকা চিহ্নিত করেন এবং বলেন "এটি পানি", "এটি ধানক্ষেত" ইত্যাদি। এগুলোকে **ROI (Regions of Interest)** বলে।

### ধাপ ২: Algorithm Training
কম্পিউটার আপনার ROI থেকে প্রতিটি শ্রেণির **Spectral Signature** শেখে।

### ধাপ ৩: Classification
Algorithm পুরো ইমেজের প্রতিটি পিক্সেলকে শেখা Signature এর সাথে তুলনা করে শ্রেণি নির্ধারণ করে।

### ধাপ ৪: Accuracy Assessment
**Confusion Matrix** থেকে:
- **Overall Accuracy:** মোট কত পিক্সেল সঠিকভাবে শ্রেণিবদ্ধ হয়েছে
- **Kappa Coefficient:** Chance agreement বাদ দিয়ে প্রকৃত সঠিকতা

## জনপ্রিয় Algorithm:

| Algorithm | ধরন | সুবিধা |
|---|---|---|
| **Maximum Likelihood** | Parametric | ক্লাসিক, ভালো বোঝা যায় |
| **Random Forest** | Non-parametric | 🏆 সবচেয়ে নির্ভুল, বেশি ব্যবহৃত |
| **SVM** | Non-parametric | জটিল শ্রেণি পৃথককরণে ভালো |

## সারসংক্ষেপ
1. Supervised Classification = মানুষ Training দেয়, কম্পিউটার শ্রেণিবদ্ধ করে
2. ROI → Algorithm Training → Classification → Accuracy Assessment
3. Random Forest সবচেয়ে নির্ভুল ও জনপ্রিয়`,
        quizzes: [
          { question: 'Supervised Classification এ "Supervised" মানে কী?', options: ['মানুষ Training Sample (ROI) তৈরি করে কম্পিউটারকে শেখায়', 'কম্পিউটার নিজে নিজে শ্রেণিবদ্ধ করে', 'শুধু ম্যানুয়ালি করা হয়', 'কোন Training দরকার নেই'], correct_answer: 0 },
          { question: 'Kappa Coefficient কী পরিমাপ করে?', options: ['Chance agreement বাদ দিয়ে শ্রেণিবিভাগের প্রকৃত সঠিকতা', 'ফাইল সাইজ', 'রেজোলিউশন', 'ব্যান্ড সংখ্যা'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 6: Change Detection ও Time-Series',
    slug: 'mod6-change-detection',
    order_index: 6,
    description: 'সময়ের সাথে ভূমি আচ্ছাদনের পরিবর্তন বিশ্লেষণ — NDVI Time-Series, Pre/Post Comparison।',
    lessons: [
      {
        title: '1. Change Detection: সময়ের সাথে পরিবর্তন',
        slug: 'change-detection-analysis',
        order_index: 1,
        content: `# Lesson 1: Change Detection

## Change Detection কী?
দুটি বা ততোধিক সময়ের স্যাটেলাইট ইমেজ তুলনা করে **ভূমি আচ্ছাদনের পরিবর্তন** চিহ্নিত করা।

## পদ্ধতি ১: Post-Classification Comparison
- সময় ১ (যেমন 2020) → Classification → Land Cover Map 2020
- সময় ২ (যেমন 2025) → Classification → Land Cover Map 2025
- দুটি ম্যাপ তুলনা → **Change Matrix** তৈরি

## পদ্ধতি ২: NDVI Differencing
\`\`\`
ΔNDVI = NDVI_2025 - NDVI_2020

ΔNDVI > 0 → গাছপালা বেড়েছে (সবুজায়ন)
ΔNDVI < 0 → গাছপালা কমেছে (বনউজাড়/শহরায়ন)
ΔNDVI ≈ 0 → কোন পরিবর্তন নেই
\`\`\`

## বাংলাদেশে ব্যবহার:
- 🌳→🏘️ চট্টগ্রাম পাহাড়ে বনউজাড় → বসতি
- 🌾→🏭 ঢাকার চারপাশে কৃষি জমি → শিল্প অঞ্চল
- 💧→🌾 হাওরে বন্যার পরে ক্ষতিগ্রস্ত ফসলি জমি

## সারসংক্ষেপ
1. দুই সময়ের ইমেজ তুলনা = Change Detection
2. NDVI Differencing সবচেয়ে সহজ পদ্ধতি
3. বনউজাড়, শহরায়ন ও বন্যা ক্ষয়ক্ষতি মূল্যায়নে অপরিহার্য`,
        quizzes: [
          { question: 'ΔNDVI < 0 মানে কী?', options: ['গাছপালা কমেছে (বনউজাড় বা ক্ষতি)', 'গাছপালা বেড়েছে', 'কোন পরিবর্তন নেই', 'পানি বেড়েছে'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 7: GPS ও Field Data Collection',
    slug: 'mod7-field-data-gps',
    order_index: 7,
    description: 'মাঠ পর্যায়ে ডেটা সংগ্রহ — GPS, KoboToolbox ও Ground Truth।',
    lessons: [
      {
        title: '1. GPS, KoboToolbox ও Ground Truthing',
        slug: 'gps-kobotoolbox-ground-truth',
        order_index: 1,
        content: `# Lesson 1: GPS, KoboToolbox ও Ground Truthing

## GIS শুধু কম্পিউটারে বসে কাজ নয়!
মাঠে গিয়ে **Ground Truth** (ভূমি সত্যায়ন) ডেটা সংগ্রহ করা GIS এর অবিচ্ছেদ্য অংশ।

## GPS ডেটা সংগ্রহ

### স্মার্টফোন GPS অ্যাপ:
- **SW Maps** (Android) — Point, Line, Polygon সংগ্রহ + GeoPackage Export
- **Avenza Maps** (iOS/Android) — অফলাইন ম্যাপে GPS পয়েন্ট রেকর্ড

### GNSS সঠিকতা:
| ডিভাইস | সঠিকতা | কখন ব্যবহার? |
|---|---|---|
| স্মার্টফোন GPS | ±3-5 মিটার | সাধারণ সার্ভে |
| Handheld GNSS | ±1-2 মিটার | গবেষণা মানের |
| RTK GNSS | ±1-2 সেমি | প্রিসিশন এগ্রিকালচার |

## KoboToolbox — ফ্রি ফিল্ড ডেটা সংগ্রহ

**KoboToolbox** একটি ফ্রি, ওপেন সোর্স প্ল্যাটফর্ম:
1. **ওয়েবে ফর্ম ডিজাইন** করুন (Drag & Drop)
2. **মোবাইল অ্যাপে** (KoboCollect) অফলাইনে ডেটা সংগ্রহ করুন
3. **GPS পয়েন্ট** স্বয়ংক্রিয়ভাবে রেকর্ড হয়
4. **ফটো, অডিও** সংযুক্ত করুন
5. সার্ভারে **sync** করলে CSV/GeoJSON ডাউনলোড করুন

## Ground Truthing
Classification Accuracy যাচাই করতে মাঠে গিয়ে প্রকৃত ভূমি আচ্ছাদন রেকর্ড করা:
- র‍্যান্ডম পয়েন্টে যান
- আসলে কী আছে রেকর্ড করুন (ধান? পানি? বন?)
- Confusion Matrix তৈরিতে ব্যবহার করুন

## সারসংক্ষেপ
1. মাঠ পর্যায়ে GPS দিয়ে ডেটা সংগ্রহ GIS এর অবিচ্ছেদ্য অংশ
2. KoboToolbox ফ্রি ও শক্তিশালী ফিল্ড ডেটা সংগ্রহ টুল
3. Ground Truth ছাড়া Classification Accuracy যাচাই অসম্ভব`,
        quizzes: [
          { question: 'KoboToolbox এর প্রধান সুবিধা কী?', options: ['ফ্রি, অফলাইনে কাজ করে, GPS ও ফটো সংযুক্ত করা যায়', 'শুধু পেইড সংস্করণ আছে', 'শুধু কম্পিউটারে চলে', 'শুধু ইংরেজিতে কাজ করে'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 8: ক্যাপস্টোন — বন্যা প্রভাব মূল্যায়ন',
    slug: 'mod8-capstone-flood-assessment',
    order_index: 8,
    description: 'সবকিছু একত্রে — বাংলাদেশের হাওর অঞ্চলে বন্যার প্রভাব মূল্যায়ন প্রকল্প।',
    lessons: [
      {
        title: '1. ক্যাপস্টোন: হাওর অঞ্চলে বন্যার প্রভাব মূল্যায়ন',
        slug: 'capstone-flood-impact',
        order_index: 1,
        content: `# 🎓 ক্যাপস্টোন: হাওর অঞ্চলে বন্যার প্রভাব মূল্যায়ন

## প্রকল্প লক্ষ্য
সুনামগঞ্জ/কিশোরগঞ্জের হাওর অঞ্চলে বন্যার আগে ও পরে NDVI তুলনা করে **ক্ষতিগ্রস্ত ফসলি জমির পরিমাণ** নির্ণয় করুন।

## ধাপ:
1. **Pre-flood NDVI** (মার্চ) ও **Post-flood NDVI** (মে) ইমেজ সংগ্রহ
2. **NDVI গণনা** (Raster Calculator)
3. **ΔNDVI = Post - Pre** → Change Detection
4. **Threshold:** ΔNDVI < -0.3 → ক্ষতিগ্রস্ত ফসলি জমি
5. **Zonal Statistics** → উপজেলা ভিত্তিক ক্ষতির পরিমাণ
6. **Choropleth Map** → Print Layout → PDF Export

## মূল্যায়ন: ১০০ পয়েন্ট
- সঠিক NDVI গণনা: ২০
- Change Detection: ২০
- Zonal Statistics: ২০
- Choropleth + Labels: ২০
- Print Layout (৬ উপাদান): ২০

## 🎉 পরবর্তী ধাপ
Course 2 সম্পন্ন! এখন **Course 3: Geospatial Engineering & Cloud GIS** এ যান — PostGIS, Python, GEE শিখুন!`,
        quizzes: [
          { question: 'বন্যায় ক্ষতিগ্রস্ত ফসলি জমি চিহ্নিত করতে কোন সূচক সবচেয়ে কার্যকর?', options: ['ΔNDVI (Pre-Post NDVI পার্থক্য)', 'Slope', 'Aspect', 'Population Density'], correct_answer: 0 },
        ]
      },
    ]
  },
];

// =============================================================================
// COURSE 3 MODULES (abbreviated for now - key modules)
// =============================================================================
const COURSE_3_MODULES = [
  {
    title: 'Module 1: PostgreSQL + PostGIS Setup',
    slug: 'mod1-postgis-setup',
    order_index: 1,
    description: 'এন্টারপ্রাইজ স্পেশিয়াল ডাটাবেজ — PostgreSQL এ PostGIS ইন্সটল ও ডেটা ইনজেশন।',
    lessons: [
      {
        title: '1. PostGIS: Spatial Database পরিচিতি',
        slug: 'postgis-intro-setup',
        order_index: 1,
        content: `# Lesson 1: PostGIS — Spatial Database

## কেন Spatial Database?
Shapefile ও GeoPackage ফাইল-ভিত্তিক। কিন্তু যখন:
- হাজার হাজার ব্যবহারকারী একই ডেটা ব্যবহার করবে
- মিলিয়ন+ ফিচার নিয়ে কাজ করতে হবে
- ওয়েব অ্যাপে ডেটা সার্ভ করতে হবে

তখন **Spatial Database** অপরিহার্য।

## PostGIS কী?
**PostGIS** = PostgreSQL ডাটাবেজের জন্য **Spatial Extension**। এটি PostgreSQL কে বিশ্বের সবচেয়ে শক্তিশালী ওপেন সোর্স GIS ডাটাবেজে রূপান্তর করে।

## Setup:
\`\`\`sql
-- PostGIS চালু করা
CREATE EXTENSION IF NOT EXISTS postgis;
SELECT PostGIS_Full_Version();
\`\`\`

## ডেটা ইনজেশন (ogr2ogr):
\`\`\`bash
ogr2ogr -f "PostgreSQL" PG:"host=localhost dbname=geodb" parcels.gpkg -nln cadastral_parcels
\`\`\`

## সারসংক্ষেপ
1. PostGIS = PostgreSQL + Spatial Capabilities
2. Enterprise-grade, multi-user, scalable
3. SQL দিয়ে স্পেশিয়াল বিশ্লেষণ`,
        quizzes: [
          { question: 'PostGIS কী?', options: ['PostgreSQL ডাটাবেজের Spatial Extension', 'একটি মোবাইল অ্যাপ', 'একটি ক্লাউড স্টোরেজ', 'একটি ড্রোন সফটওয়্যার'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 2: Spatial SQL Mastery',
    slug: 'mod2-spatial-sql',
    order_index: 2,
    description: 'Geometry Constructors, Spatial Joins, ST_Intersects, ST_DWithin ও GIST Indexing।',
    lessons: [
      {
        title: '1. Spatial SQL: Geometry ও Spatial Join',
        slug: 'spatial-sql-geometry-joins',
        order_index: 1,
        content: `# Lesson 1: Spatial SQL

## PostGIS Geometry Functions:
\`\`\`sql
-- Point তৈরি
SELECT ST_SetSRID(ST_MakePoint(90.4125, 23.8103), 4326);

-- Polygon তৈরি
SELECT ST_GeomFromText('POLYGON((90.3 24.6, 90.5 24.6, 90.5 24.8, 90.3 24.8, 90.3 24.6))', 4326);

-- CRS Transform
SELECT ST_Transform(ST_SetSRID(ST_MakePoint(90.4125, 23.8103), 4326), 32646);
\`\`\`

## Spatial Join:
\`\`\`sql
-- প্রতিটি জেলায় কতটি আবহাওয়া স্টেশন আছে?
SELECT d.district_name, COUNT(s.id) AS station_count
FROM districts d
LEFT JOIN weather_stations s ON ST_Contains(d.geom, s.geom)
GROUP BY d.district_name;
\`\`\`

## GIST Index:
\`\`\`sql
CREATE INDEX idx_geom ON parcels USING GIST (geom);
\`\`\`

## সারসংক্ষেপ
1. PostGIS functions: ST_MakePoint, ST_Contains, ST_DWithin
2. Spatial Join = Location-based table join
3. GIST Index = O(log N) spatial queries`,
        quizzes: [
          { question: 'ST_Contains(A, B) কী রিটার্ন করে?', options: ['B পুরোপুরি A এর ভেতরে থাকলে TRUE', 'A ও B এর ক্ষেত্রফল', 'A এর CRS', 'B মুছে ফেলে'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 3: Python Spatial Stack',
    slug: 'mod3-python-spatial',
    order_index: 3,
    description: 'GeoPandas, Shapely, Rasterio — Python দিয়ে স্পেশিয়াল বিশ্লেষণ।',
    lessons: [
      {
        title: '1. GeoPandas ও Shapely: Vector Pipelines',
        slug: 'geopandas-shapely-intro',
        order_index: 1,
        content: `# Lesson 1: GeoPandas — Python এ Spatial Data Science

## GeoPandas কী?
pandas এর spatial extension — DataFrame এ geometry column যোগ করে।

\`\`\`python
import geopandas as gpd

# GeoPackage পড়া
parcels = gpd.read_file("data/parcels.gpkg")
print(parcels.head())

# CRS পরিবর্তন
parcels_utm = parcels.to_crs(epsg=32646)

# ক্ষেত্রফল গণনা (হেক্টরে)
parcels_utm["area_ha"] = parcels_utm.geometry.area / 10000
\`\`\`

## Spatial Join:
\`\`\`python
wells = gpd.read_file("data/wells.geojson").to_crs(parcels_utm.crs)
result = gpd.sjoin(wells, parcels_utm, how="inner", predicate="within")
\`\`\`

## সারসংক্ষেপ
1. GeoPandas = pandas + spatial
2. .to_crs() দিয়ে CRS বদলান
3. gpd.sjoin() দিয়ে Spatial Join`,
        quizzes: [
          { question: 'GeoPandas এ CRS পরিবর্তন করতে কোন method ব্যবহৃত হয়?', options: ['.to_crs()', '.set_crs()', '.transform()', '.reproject()'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 4: GDAL/OGR CLI Automation',
    slug: 'mod4-gdal-ogr',
    order_index: 4,
    description: 'Command-line দিয়ে Raster/Vector প্রসেসিং — gdalwarp, gdal_translate, ogr2ogr।',
    lessons: [
      {
        title: '1. GDAL/OGR: Command-Line GIS Automation',
        slug: 'gdal-ogr-cli',
        order_index: 1,
        content: `# Lesson 1: GDAL/OGR CLI

## GDAL কী?
সব GIS সফটওয়্যারের পেছনে থাকা **মূল ইঞ্জিন** — 200+ ফরম্যাট পড়তে ও লিখতে পারে।

## মূল কমান্ড:

### gdalwarp (Reproject + Clip):
\`\`\`bash
gdalwarp -t_srs EPSG:32646 -r bilinear input.tif output_utm.tif
gdalwarp -cutline boundary.shp -crop_to_cutline dem.tif dem_clipped.tif
\`\`\`

### gdal_translate (Format Convert):
\`\`\`bash
gdal_translate input.tif output_cog.tif -co TILED=YES -co COMPRESS=DEFLATE
\`\`\`

### ogr2ogr (Vector Convert + Filter):
\`\`\`bash
ogr2ogr -f "GeoJSON" output.geojson input.shp -where "land_use = 'Agriculture'"
\`\`\`

## সারসংক্ষেপ
1. GDAL (Raster) + OGR (Vector) = CLI GIS Engine
2. Batch processing ও automation এ অপরিহার্য`,
        quizzes: [
          { question: 'Raster ফাইল Reproject করতে কোন GDAL কমান্ড ব্যবহৃত হয়?', options: ['gdalwarp', 'gdal_translate', 'ogr2ogr', 'gdalinfo'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 5: Google Earth Engine Architecture',
    slug: 'mod5-gee-architecture',
    order_index: 5,
    description: 'GEE ক্লাউড আর্কিটেকচার, Server-Side Computation ও Multi-Petabyte Collections।',
    lessons: [
      {
        title: '1. GEE: Planetary-Scale Earth Observation',
        slug: 'gee-cloud-intro',
        order_index: 1,
        content: `# Lesson 1: Google Earth Engine

## GEE কেন বিপ্লবী?
আগে: 100 GB স্যাটেলাইট ইমেজ ডাউনলোড → লোকাল প্রসেসিং → দিনের পর দিন
এখন: GEE তে ব্রাউজারে কোড লিখুন → Google এর সার্ভারে সেকেন্ডে প্রসেস!

## মূল ধারণা:
- **Lazy Evaluation:** আউটপুট চাওয়ার আগে কিছুই প্রসেস হয় না
- **Server-Side Objects:** ee.Image, ee.ImageCollection — এগুলো Google এর সার্ভারে চলে

## কোড উদাহরণ (JavaScript):
\`\`\`javascript
var aoi = ee.Geometry.Point([90.4125, 23.8103]).buffer(10000);

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)
  .filterDate('2026-01-01', '2026-06-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15));

var composite = s2.median().clip(aoi);
Map.addLayer(composite, {bands: ['B4','B3','B2'], min: 0, max: 3000}, 'True Color');
\`\`\`

## সারসংক্ষেপ
1. GEE = ক্লাউড-ভিত্তিক Petabyte-scale GIS
2. ডাউনলোড ছাড়াই বিশ্লেষণ
3. JavaScript বা Python API`,
        quizzes: [
          { question: 'GEE তে Lazy Evaluation মানে কী?', options: ['আউটপুট চাওয়ার আগে কিছুই প্রসেস হয় না', 'সবসময় ধীরে কাজ করে', 'শুধু রাতে কাজ করে', 'শুধু ছোট ডেটায় কাজ করে'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 6: GEE Time-Series ও Export',
    slug: 'mod6-gee-timeseries',
    order_index: 6,
    description: 'NDVI Phenology, Flood Mapping, Time-Series Chart ও Export Pipeline।',
    lessons: [
      {
        title: '1. GEE NDVI Time-Series ও Flood Mapping',
        slug: 'gee-ndvi-flood',
        order_index: 1,
        content: `# Lesson 1: GEE NDVI Time-Series

## NDVI Time-Series Chart:
\`\`\`javascript
function addNDVI(image) {
  return image.addBands(image.normalizedDifference(['B8','B4']).rename('NDVI'));
}

var withNDVI = s2.map(addNDVI);

var chart = ui.Chart.image.seriesByRegion({
  imageCollection: withNDVI.select('NDVI'),
  regions: farmParcels,
  reducer: ee.Reducer.mean(),
  scale: 10
});
print(chart);
\`\`\`

## Flood Mapping (SAR):
\`\`\`javascript
var before = ee.Image('COPERNICUS/S1_GRD/S1A_IW_GRDH_..._pre');
var after = ee.Image('COPERNICUS/S1_GRD/S1A_IW_GRDH_..._post');
var flood = after.select('VV').lt(-15).and(before.select('VV').gt(-15));
\`\`\`

## সারসংক্ষেপ
1. NDVI Time-Series = ফসলের বৃদ্ধি চক্র ট্র্যাক
2. SAR (Radar) = মেঘ ভেদ করে বন্যা ম্যাপিং`,
        quizzes: [
          { question: 'SAR (Radar) ডেটা দিয়ে বন্যা ম্যাপিং করার সুবিধা কী?', options: ['মেঘ ভেদ করে দেখতে পারে', 'রঙিন ছবি দেয়', 'বিনামূল্যে নয়', 'শুধু দিনের বেলায় কাজ করে'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 7: R Spatial Stack',
    slug: 'mod7-r-spatial',
    order_index: 7,
    description: 'R দিয়ে Spatial Data Science — sf, terra, tmap, spdep।',
    lessons: [
      {
        title: '1. R Spatial: sf, terra ও tmap',
        slug: 'r-sf-terra-tmap',
        order_index: 1,
        content: `# Lesson 1: R Spatial Stack

## R এ Spatial ডেটা
R এ দুটি মূল প্যাকেজ:
- **sf** (Simple Features): Vector ডেটা
- **terra**: Raster ডেটা

## sf দিয়ে Vector কাজ:
\`\`\`r
library(sf)

# Shapefile পড়া
districts <- st_read("bangladesh_districts.shp")

# CRS পরিবর্তন
districts_utm <- st_transform(districts, crs = 32646)

# ক্ষেত্রফল গণনা
districts_utm$area_km2 <- as.numeric(st_area(districts_utm)) / 1e6

# Spatial Join
wells <- st_read("wells.geojson") |> st_transform(32646)
wells_with_district <- st_join(wells, districts_utm)
\`\`\`

## tmap দিয়ে ম্যাপ:
\`\`\`r
library(tmap)
tm_shape(districts_utm) +
  tm_polygons("Rice_Yield", palette = "RdYlGn", title = "ধান উৎপাদন (টন/হে.)") +
  tm_layout(title = "বাংলাদেশ ধান উৎপাদন মানচিত্র")
\`\`\`

## সারসংক্ষেপ
1. sf = R এ Vector GIS
2. terra = R এ Raster GIS
3. tmap = Publication-grade ম্যাপ`,
        quizzes: [
          { question: 'R এ Vector Spatial ডেটা পড়তে কোন প্যাকেজ ব্যবহৃত হয়?', options: ['sf', 'ggplot2', 'dplyr', 'readr'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 8: Spatial Statistics',
    slug: 'mod8-spatial-statistics',
    order_index: 8,
    description: 'Spatial Autocorrelation — Moran\'s I, LISA, Hot-Spot Analysis।',
    lessons: [
      {
        title: '1. Moran\'s I ও LISA: Spatial Autocorrelation',
        slug: 'morans-i-lisa',
        order_index: 1,
        content: `# Lesson 1: Spatial Autocorrelation

## Tobler's First Law of Geography:
> "সবকিছু সবকিছুর সাথে সম্পর্কিত, কিন্তু কাছের জিনিস দূরের জিনিসের চেয়ে বেশি সম্পর্কিত।"

## Global Moran's I:
- **I > 0:** Clustering (উচ্চ মানের কাছে উচ্চ, নিম্ন মানের কাছে নিম্ন)
- **I ≈ 0:** Random (কোন প্যাটার্ন নেই)
- **I < 0:** Dispersion (Checkerboard প্যাটার্ন)

## LISA (Local Moran's I):
- **High-High:** Hotspot 🔴 (দারিদ্র্য ক্লাস্টার)
- **Low-Low:** Coldspot 🔵
- **High-Low / Low-High:** Outlier

## Python Implementation:
\`\`\`python
from libpysal.weights import Queen
from esda.moran import Moran, Moran_Local

w = Queen.from_dataframe(gdf)
w.transform = 'R'

moran = Moran(gdf["poverty_rate"], w)
print(f"Moran's I: {moran.I:.4f}, p: {moran.p_sim:.4f}")
\`\`\`

## সারসংক্ষেপ
1. Spatial Autocorrelation = কাছের জিনিসের সাদৃশ্য পরিমাপ
2. Global Moran's I = সামগ্রিক clustering
3. LISA = স্থানীয় hotspot/coldspot চিহ্নিতকরণ`,
        quizzes: [
          { question: 'Moran\'s I > 0 মানে কী?', options: ['Positive spatial clustering (কাছের এলাকায় সমান মান)', 'Random distribution', 'Negative correlation', 'কোন সম্পর্ক নেই'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 9: Web GIS ও GeoServer',
    slug: 'mod9-webgis-geoserver',
    order_index: 9,
    description: 'GeoServer, WMS, WFS এবং Leaflet দিয়ে Interactive Web Map।',
    lessons: [
      {
        title: '1. GeoServer ও Web Map তৈরি',
        slug: 'geoserver-web-map',
        order_index: 1,
        content: `# Lesson 1: Web GIS ও GeoServer

## Web GIS কেন?
আপনার GIS বিশ্লেষণ শেষ — এখন এটি **ওয়েবে শেয়ার** করতে চান যাতে অন্যরা ব্রাউজারেই দেখতে পারে।

## GeoServer:
- OGC Standard: **WMS** (Map Images), **WFS** (Vector Data), **WCS** (Raster Data)
- PostGIS ডাটাবেজ সরাসরি সার্ভ করতে পারে

## Leaflet দিয়ে Interactive Map:
\`\`\`html
<script>
var map = L.map('map').setView([23.81, 90.41], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
    layers: 'workspace:layer_name',
    format: 'image/png',
    transparent: true
}).addTo(map);
</script>
\`\`\`

## সারসংক্ষেপ
1. GeoServer = Spatial Layer ওয়েবে প্রকাশ
2. WMS = ম্যাপ ইমেজ, WFS = ভেক্টর ডেটা
3. Leaflet = Interactive web map`,
        quizzes: [
          { question: 'WFS (Web Feature Service) কী ধরনের ডেটা সার্ভ করে?', options: ['Raw vector geometry ও attributes (GeoJSON)', 'Pre-rendered map images', 'Video files', 'PDF documents'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 10: Production Capstone',
    slug: 'mod10-production-capstone',
    order_index: 10,
    description: 'End-to-End Precision Agriculture Pipeline — ডেটা সংগ্রহ থেকে Web Map পর্যন্ত।',
    lessons: [
      {
        title: '1. ক্যাপস্টোন: End-to-End Precision Agriculture Pipeline',
        slug: 'capstone-precision-agriculture',
        order_index: 1,
        content: `# 🎓 Final Capstone: End-to-End Precision Agriculture Pipeline

## প্রকল্প লক্ষ্য
সম্পূর্ণ pipeline তৈরি করুন: ডেটা সংগ্রহ → প্রসেসিং → বিশ্লেষণ → Web Map

## Architecture:
\`\`\`
Field Data (KoboToolbox GPS)
    ↓
Satellite Imagery (GEE → NDVI Export)
    ↓
PostGIS Database (ogr2ogr Ingestion)
    ↓
Spatial Analysis (Python/R → Zonal Stats)
    ↓
GeoServer (WMS/WFS Publishing)
    ↓
Leaflet Web Map (Interactive Dashboard)
\`\`\`

## মূল্যায়ন: ১০০ পয়েন্ট
- GEE থেকে NDVI Export: ১৫
- PostGIS Database ডিজাইন: ১৫
- Python/R Analysis Script: ২০
- Spatial Statistics (Moran's I): ১৫
- GeoServer Layer Publishing: ১৫
- Leaflet Web Map: ২০

## 🎉 অভিনন্দন!
আপনি এখন একজন **Geospatial Engineer**! আপনি desktop GIS, cloud GIS, spatial databases, programming, এবং web GIS — সবকিছু জানেন।`,
        quizzes: [
          { question: 'End-to-End GIS Pipeline এ সবশেষে কী করা হয়?', options: ['Web Map এ ফলাফল প্রকাশ', 'ডেটা মুছে ফেলা', 'QGIS বন্ধ করা', 'শুধু CSV ফাইল সেভ'], correct_answer: 0 },
        ]
      },
    ]
  },
];


// =============================================================================
// MAIN EXECUTION
// =============================================================================
async function seedCourse(courseData, modulesData) {
  console.log(`\n=== Seeding: ${courseData.title} ===`);
  
  const courseId = await upsertCourse(courseData);
  console.log(`  Course created: ${courseId}`);
  
  let totalLessons = 0;
  let totalQuizzes = 0;
  
  for (const mod of modulesData) {
    const moduleId = await insertModule({
      course_id: courseId,
      title: mod.title,
      slug: mod.slug,
      order_index: mod.order_index,
      description: mod.description,
    });
    console.log(`  Module: ${mod.title}`);
    
    for (const lesson of mod.lessons) {
      const lessonId = await insertLesson({
        module_id: moduleId,
        title: lesson.title,
        slug: lesson.slug,
        order_index: lesson.order_index,
        content: lesson.content,
        video_url: lesson.video_url || null,
      });
      totalLessons++;
      
      if (lesson.quizzes && lesson.quizzes.length > 0) {
        await insertQuizzes(lessonId, lesson.quizzes);
        totalQuizzes += lesson.quizzes.length;
      }
    }
  }
  
  console.log(`  ✅ Done! ${modulesData.length} modules, ${totalLessons} lessons, ${totalQuizzes} quizzes`);
}

async function main() {
  try {
    // Seed Course 2
    await seedCourse(COURSE_2, COURSE_2_MODULES);
    
    // Seed Course 3
    await seedCourse(COURSE_3, COURSE_3_MODULES);
    
    // Verify
    console.log('\n=== All courses in database ===');
    const { data: courses } = await supabase
      .from('courses')
      .select('title, slug, is_published')
      .order('created_at');
    console.log(JSON.stringify(courses, null, 2));
    
  } catch (err) {
    console.error('FATAL:', err.message);
    process.exit(1);
  }
}

module.exports = { COURSE_2, COURSE_2_MODULES, COURSE_3, COURSE_3_MODULES };

if (require.main === module) {
  main();
}
