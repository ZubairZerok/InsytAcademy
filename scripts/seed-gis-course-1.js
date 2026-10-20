require('./load-env');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://cisulrzguxljaxgogbzi.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function upsertCourse(course) {
  await supabase.from('courses').delete().eq('slug', course.slug);
  const { data, error } = await supabase.from('courses').insert(course).select('id').single();
  if (error) throw new Error(`Course insert: ${error.message}`);
  return data.id;
}

async function insertModule(mod) {
  const { data, error } = await supabase.from('modules').insert(mod).select('id').single();
  if (error) throw new Error(`Module insert: ${error.message}`);
  return data.id;
}

async function insertLesson(lesson) {
  const { data, error } = await supabase.from('lessons').insert(lesson).select('id').single();
  if (error) throw new Error(`Lesson insert: ${error.message}`);
  return data.id;
}

async function insertQuizzes(lessonId, quizzes) {
  const rows = quizzes.map(q => ({
    lesson_id: lessonId, question: q.question, options: q.options, correct_answer: q.correct_answer,
  }));
  const { error } = await supabase.from('quiz_questions').insert(rows);
  if (error) console.warn(`  Quiz warning: ${error.message}`);
}

// =============================================================================
// GIS COURSE 1: SPATIAL LITERACY & GIS FOUNDATIONS
// =============================================================================

const COURSE_1 = {
  title: 'Spatial Literacy & GIS Foundations',
  slug: 'gis-spatial-foundations',
  description: 'GIS এর মূল ভিত্তি শিখুন — স্পেশিয়াল থিংকিং, কোঅর্ডিনেট সিস্টেম, ভেক্টর-রাস্টার ডেটা মডেল, QGIS পরিচিতি এবং আপনার প্রথম কৃষি মানচিত্র তৈরি করুন।',
  is_published: true,
  thumbnail_url: '/images/courses/gis-spatial-foundations.png',
};

const MODULES = [
  {
    title: 'Module 1: What is GIS? Why Spatial Thinking Matters',
    slug: 'mod1-what-is-gis', order_index: 1,
    description: 'GIS এর মৌলিক ধারণা, স্পেশিয়াল থিংকিং এবং কৃষি গবেষণায় এর বিপ্লবী ভূমিকা বুঝুন।',
    lessons: [
      {
        title: '1. GIS কি? কৃষিতে এর গুরুত্ব', slug: 'what-is-gis-importance', order_index: 1,
        content: `# Module Overview\nএই মডিউলে আমরা ভৌগোলিক তথ্য ব্যবস্থা বা GIS (Geographic Information System) এর মূল ধারণার সাথে পরিচিত হবো। কৃষি বিজ্ঞানে GIS কীভাবে গেম-চেঞ্জার, তা বুঝবো।\n\n# Lesson 1: GIS কি? কৃষিতে এর গুরুত্ব\n\nআসসালামু আলাইকুম! আশা করি সবাই ভালো আছেন।\n\nআমাদের R কোর্সে আমরা ডেটা টেবিল নিয়ে অনেক কাজ করেছি। কিন্তু ভাবুন তো — যদি আপনার ডেটার সাথে **লোকেশন** সরাসরি সংযুক্ত থাকে? উদাহরণস্বরূপ, ময়মনসিংহের কোন ইউনিয়নের মাটিতে নাইট্রোজেনের পরিমাণ কত, কিংবা চলনবিলের কোন এলাকায় এ বছর বোরো ধান বেশি হয়েছে — তা যদি সরাসরি **ম্যাপে** দেখা যেত?\n\nসেখানেই আমাদের উদ্ধারকর্তা হলো **GIS (Geographic Information System)**।\n\n## সহজ সংজ্ঞা\n\n> **GIS = Geography + Data + Software Tools**\n\nএটি শুধু মানচিত্র নয়। এটি এমন একটি **ডাটাবেজ সিস্টেম** যা মানচিত্রের প্রতিটি ফিচারের পেছনে তার গুণাগুণ (Attributes) সংরক্ষণ করে।\n\n## কৃষি গবেষণায় GIS এর প্রয়োগ\n\n| ক্ষেত্র | GIS এর কাজ | উদাহরণ |\n|---|---|---|\n| **Crop Suitability** | মাটি, ঢাল, বৃষ্টিপাত ওভারলে করে ফসল উপযুক্ততা নির্ণয় | রাজশাহীতে কোথায় আম চাষ সবচেয়ে ভালো হবে |\n| **Flood Damage** | বন্যার আগে-পরের স্যাটেলাইট ইমেজ তুলনা | সুনামগঞ্জে কত একর ধানী জমি তলিয়ে গেছে |\n| **Precision Farming** | GPS + ড্রোন দিয়ে সার প্রয়োগ ম্যাপ | নির্দিষ্ট জায়গায় নির্দিষ্ট পরিমাণ সার দেওয়া |\n| **Soil Mapping** | মাটির pH, জৈব পদার্থ, টেক্সচার ম্যাপিং | জেলাভিত্তিক মৃত্তিকা সম্পদ মানচিত্র |\n\n## GIS এর ৩টি মূল উপাদান\n\n1. **Hardware:** কম্পিউটার, GPS রিসিভার, ড্রোন, স্যাটেলাইট\n2. **Software:** QGIS (ফ্রি), ArcGIS Pro (পেইড), Google Earth Engine (ক্লাউড)\n3. **Data:** স্পেশিয়াল ডেটা (ম্যাপ) + অ্যাট্রিবিউট ডেটা (টেবিল)\n\n> 💡 **মনে রাখুন:** R-এ আমরা যে data.frame ব্যবহার করতাম, GIS সেই ডেটাফ্রেমেই প্রতিটি রো-র সাথে একটি করে **জ্যামিতিক নকশা** (Point, Line, বা Polygon) জুড়ে দেয়! R-এ এটিকে বলে sf (Simple Features) অবজেক্ট।`,
        quizzes: [
          { question: 'GIS এর পূর্ণরূপ কোনটি?', options: ['Geographic Information System', 'Geological Info Study', 'Global Infrastructure System', 'General Imaging Software'], correct_answer: 0 },
          { question: 'সাধারণ স্প্রেডশিটের সাথে GIS স্প্রেডশিটের মূল পার্থক্য কোথায়?', options: ['GIS এ ডেটা এন্ট্রি করা যায় না', 'GIS এ প্রতিটি ডেটার সাথে স্পেশিয়াল জিওমেট্রি যুক্ত থাকে', 'GIS এ গ্রাফ আঁকা যায় না', 'কোন পার্থক্য নেই'], correct_answer: 1 },
          { question: 'নিচের কোনটি Precision Farming এর উদাহরণ?', options: ['GPS ও ড্রোন ব্যবহার করে নির্দিষ্ট জায়গায় সার প্রয়োগ', 'হাতে চাষ করা', 'বীজ শুকানো', 'অনলাইনে সার কেনা'], correct_answer: 0 },
        ]
      },
      {
        title: '2. স্পেশিয়াল থিংকিং: Layers এ চিন্তা করা', slug: 'spatial-thinking-layers', order_index: 2,
        content: `# Lesson 2: স্পেশিয়াল থিংকিং — Layers এ চিন্তা করা\n\nGIS বাস্তব জগতকে বিভিন্ন **Layer (স্তর)** এ ভাগ করে:\n\n| Layer | বিষয়বস্তু | ডেটা টাইপ |\n|---|---|---|\n| Layer 1 | স্যাটেলাইট ইমেজ / বেসম্যাপ | Raster |\n| Layer 2 | নদী ও খাল নেটওয়ার্ক | Vector (Line) |\n| Layer 3 | কৃষি ব্লক/জমির সীমানা | Vector (Polygon) |\n| Layer 4 | আবহাওয়া স্টেশন | Vector (Point) |\n| Layer 5 | উচ্চতা / ভূমি ঢাল | Raster (DEM) |\n\n> 💡 **মূল কথা:** প্রতিটি Layer একটি নির্দিষ্ট বিষয়ের তথ্য ধারণ করে। সব Layer একসাথে ওভারলে (Overlay) করলে আমরা বাস্তব জগতের একটি **ডিজিটাল মডেল** পাই।\n\n## বন্যা ঝুঁকি মূল্যায়ন উদাহরণ\n\nধরুন, আপনি জানতে চান: "সিলেটের কোন উপজেলায় বন্যার ঝুঁকি সবচেয়ে বেশি?"\n\nএর জন্য আপনার দরকার:\n1. **উচ্চতার ম্যাপ (DEM Layer):** কোন এলাকা নিচু\n2. **নদীর Layer:** কোন নদীর কাছাকাছি\n3. **জনবসতি Layer:** কত মানুষ ঝুঁকিতে\n4. **ঐতিহাসিক বন্যা Layer:** আগে কোথায় বন্যা হয়েছে\n\nএই ৪টি Layer একসাথে **Overlay Analysis** করলে আপনি বন্যা ঝুঁকি মানচিত্র তৈরি করতে পারবেন!`,
        quizzes: [
          { question: 'GIS এ Layer ভিত্তিক চিন্তা করার মূল সুবিধা কী?', options: ['বিভিন্ন বিষয়ের তথ্য আলাদা রেখে প্রয়োজনে একসাথে বিশ্লেষণ করা যায়', 'ম্যাপ সুন্দর দেখায়', 'কম্পিউটারের RAM বাঁচে', 'ইন্টারনেট ছাড়া কাজ করা যায়'], correct_answer: 0 },
          { question: 'বন্যা ঝুঁকি মানচিত্র তৈরিতে নিচের কোন Layer সবচেয়ে গুরুত্বপূর্ণ?', options: ['Digital Elevation Model (DEM)', 'রাস্তার নেটওয়ার্ক', 'দোকানের লোকেশন', 'মোবাইল টাওয়ারের অবস্থান'], correct_answer: 0 },
        ]
      },
      {
        title: '3. GIS সফটওয়্যার ইকোসিস্টেম: কোনটা কখন?', slug: 'gis-software-ecosystem', order_index: 3,
        content: `# Lesson 3: GIS সফটওয়্যার ইকোসিস্টেম\n\n| সফটওয়্যার | টাইপ | মূল্য | শক্তি | শিখবো? |\n|---|---|---|---|---|\n| **QGIS** | Desktop | 🆓 ফ্রি | সবচেয়ে শক্তিশালী ফ্রি GIS | ✅ Course 1 & 2 |\n| **ArcGIS Pro** | Desktop | 💰 পেইড | ইন্ডাস্ট্রি স্ট্যান্ডার্ড | ✅ Course 3 |\n| **Google Earth Engine** | Cloud | 🆓 ফ্রি | Petabyte-scale স্যাটেলাইট প্রসেসিং | ✅ Course 3 |\n| **PostGIS** | Database | 🆓 ফ্রি | Enterprise spatial DB | ✅ Course 3 |\n| **R (sf, terra)** | Programming | 🆓 ফ্রি | Statistical spatial analysis | ✅ Course 2 & 3 |\n| **Python (GeoPandas)** | Programming | 🆓 ফ্রি | Automation & ML | ✅ Course 3 |\n\n## GIS শেখার পথনকশা\n\n\`\`\`\n📍 আপনি এখানে আছেন\n     ↓\n[Course 1: GIS Foundations] ← QGIS ভিত্তিক ম্যাপ তৈরি\n     ↓\n[Course 2: GIS Analysis] ← Spatial Analysis + Remote Sensing\n     ↓\n[Course 3: Geospatial Engineering] ← PostGIS, Python, GEE, Cloud\n\`\`\`\n\n> 💡 **এই কোর্সে (Course 1)** আমরা মূলত QGIS এবং Google Earth Pro ব্যবহার করবো। কোন কোডিং দরকার নেই!`,
        quizzes: [
          { question: 'নিচের কোন GIS সফটওয়্যারটি সম্পূর্ণ বিনামূল্যে ও ওপেন সোর্স?', options: ['QGIS', 'ArcGIS Pro', 'ERDAS Imagine', 'MapInfo'], correct_answer: 0 },
          { question: 'Google Earth Engine মূলত কোন ধরনের কাজের জন্য সবচেয়ে উপযুক্ত?', options: ['বিশাল পরিমাণ স্যাটেলাইট ইমেজ ক্লাউডে প্রসেস করা', 'ওয়ার্ড ডকুমেন্ট তৈরি', 'ভিডিও এডিটিং', 'ইমেইল পাঠানো'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 2: Coordinate Systems & Map Projections', slug: 'mod2-coordinate-systems', order_index: 2,
    description: 'পৃথিবীকে ম্যাপে রূপান্তরের গাণিতিক ভিত্তি — CRS, ডেটাম, প্রজেকশন এবং EPSG কোড শিখুন।',
    lessons: [
      {
        title: '1. Geographic Coordinate System: অক্ষাংশ ও দ্রাঘিমাংশ', slug: 'geographic-coordinate-system', order_index: 1,
        content: `# Lesson 1: Geographic Coordinate System (GCS)\n\nপৃথিবীতে যেকোনো স্থানের অবস্থান বলতে আমাদের একটি **ঠিকানা ব্যবস্থা** দরকার। সেটাই হলো **Coordinate System**।\n\n## অক্ষাংশ ও দ্রাঘিমাংশ\n\n- **Latitude (অক্ষাংশ, φ):** বিষুবরেখা থেকে উত্তর বা দক্ষিণে কোণিক দূরত্ব (-90° থেকে +90°)\n- **Longitude (দ্রাঘিমাংশ, λ):** প্রাইম মেরিডিয়ান থেকে পূর্ব বা পশ্চিমে (-180° থেকে +180°)\n\n## বাংলাদেশের গুরুত্বপূর্ণ স্থানাঙ্ক\n\n| স্থান | Latitude | Longitude |\n|---|---|---|\n| BAU | 24.7256°N | 90.4440°E |\n| ঢাকা | 23.7384°N | 90.3954°E |\n| সুনামগঞ্জ হাওর | 25.0658°N | 91.3950°E |\n\n## WGS84 — EPSG:4326\nGPS এর স্ট্যান্ডার্ড। Coordinate **ডিগ্রিতে**, মিটারে নয়!\n\n> ⚠️ WGS84 এ সরাসরি দূরত্ব/ক্ষেত্রফল হিসাব করলে **ভুল** উত্তর পাবেন!`,
        quizzes: [
          { question: 'WGS84 এর EPSG কোড কোনটি?', options: ['4326', '3857', '32646', '2154'], correct_answer: 0 },
          { question: 'EPSG:4326 এ Coordinate কোন একক ব্যবহৃত হয়?', options: ['ডিগ্রি (কোণিক একক)', 'মিটার', 'কিলোমিটার', 'ফুট'], correct_answer: 0 },
        ]
      },
      {
        title: '2. Map Projection: গোল পৃথিবীকে সমতলে আনা', slug: 'map-projections', order_index: 2,
        content: `# Lesson 2: Map Projections\n\nগোল পৃথিবীকে সমতল ম্যাপে আনতে **Projection** লাগে, এবং **বিকৃতি** অনিবার্য।\n\n## ৩ ধরনের Projection:\n\n| টাইপ | সংরক্ষণ করে | বিকৃত করে | কখন ব্যবহার? |\n|---|---|---|---|\n| **Conformal** | আকৃতি ও কোণ | ক্ষেত্রফল | নৌচালনা, ওয়েব ম্যাপ |\n| **Equal-Area** | ক্ষেত্রফল | আকৃতি | 🌾 কৃষি, বনায়ন, জমি ম্যাপিং |\n| **Equidistant** | দূরত্ব | আকৃতি ও ক্ষেত্রফল | দূরত্ব পরিমাপ |\n\n## UTM — কৃষি গবেষণার সেরা বন্ধু\n\n| বাংলাদেশের অংশ | UTM Zone | EPSG কোড |\n|---|---|---|\n| পশ্চিম (রাজশাহী, খুলনা) | 45N | 32645 |\n| পূর্ব (ঢাকা, সিলেট, চট্টগ্রাম) | 46N | 32646 |\n\n> ⚠️ **Google Maps এ ক্ষেত্রফল হিসাব করবেন না!** Web Mercator (EPSG:3857) ক্ষেত্রফল বিকৃত করে — গ্রিনল্যান্ডকে আফ্রিকার সমান দেখায়!`,
        quizzes: [
          { question: 'কৃষি জমির ক্ষেত্রফল হিসাবের জন্য কোন Projection ব্যবহার করা উচিত?', options: ['Equal-Area Projection', 'Conformal Projection', 'Equidistant Projection', 'যেকোনো Projection'], correct_answer: 0 },
          { question: 'বাংলাদেশের পূর্বাংশ কোন UTM Zone এ পড়ে?', options: ['Zone 46N (EPSG:32646)', 'Zone 45N', 'Zone 44N', 'Zone 50N'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 3: Vector Data Model — Points, Lines, Polygons', slug: 'mod3-vector-data-model', order_index: 3,
    description: 'GIS এর ভেক্টর ডেটা মডেল — Point, Line, Polygon জিওমেট্রি এবং Attribute Table।',
    lessons: [
      {
        title: '1. Vector Geometry: Point, Line ও Polygon', slug: 'vector-geometry-types', order_index: 1,
        content: `# Lesson 1: Vector Geometry Types\n\nGIS এ বাস্তব জগতের বিচ্ছিন্ন বস্তু **Vector ডেটা** দিয়ে মডেল করা হয়:\n\n## ১. Point (বিন্দু)\nনির্দিষ্ট অবস্থান — আবহাওয়া স্টেশন, মাটি নমুনা, কৃষি অফিস\n\n## ২. Line (রেখা)\nসংযুক্ত বিন্দুর সিরিজ — নদী, সেচ খাল, রাস্তা\n\n## ৩. Polygon (বহুভুজ)\nবদ্ধ এলাকা — জমির সীমানা, জেলার সীমানা, বনাঞ্চল, জলাশয়\n\n## WKT (Well-Known Text):\n\`\`\`\nPOINT(90.4440 24.7256)\nLINESTRING(90.3 24.7, 90.4 24.8, 90.5 24.7)\nPOLYGON((90.3 24.6, 90.5 24.6, 90.5 24.8, 90.3 24.8, 90.3 24.6))\n\`\`\`\n\n> 💡 WKT তে সবসময় **(Longitude, Latitude)** অর্থাৎ **(X, Y)** ক্রমে লেখা হয়!`,
        quizzes: [
          { question: 'সেচ খালকে কোন জিওমেট্রি টাইপ দিয়ে মডেল করা হবে?', options: ['Line (Polyline)', 'Point', 'Polygon', 'Raster'], correct_answer: 0 },
          { question: 'WKT তে Coordinate কোন ক্রমে লেখা হয়?', options: ['Longitude, Latitude (X, Y)', 'Latitude, Longitude (Y, X)', 'শুধু Latitude', 'শুধু Longitude'], correct_answer: 0 },
        ]
      },
      {
        title: '2. Attribute Table: ফিচারের পরিচয়পত্র', slug: 'attribute-table', order_index: 2,
        content: `# Lesson 2: Attribute Table\n\nপ্রতিটি ফিচারের পেছনে একটি **ডেটাবেজ টেবিল** আছে:\n\n| FID | District | Area_sqkm | Rice_Yield_ton_ha |\n|---|---|---|---|\n| 0 | Mymensingh | 4,363 | 4.2 |\n| 1 | Gazipur | 1,741 | 3.8 |\n\n## Attribute Query:\n\`\`\`sql\n"Rice_Yield_ton_ha" > 3.0\n"Division" = 'Mymensingh'\n"Population" > 5000000 AND "Rice_Yield_ton_ha" > 4.0\n\`\`\`\n\n## Table Join:\nCSV ফাইলের ডেটা মানচিত্রে যোগ করা — একটি Common Column (যেমন District) দিয়ে।\n\n> 💡 R জানেন? এটি R-এ dplyr::filter() এর মতোই!`,
        quizzes: [
          { question: 'Attribute Table এর প্রতিটি Row কী নির্দেশ করে?', options: ['একটি Geographic Feature', 'একটি Column', 'একটি CRS', 'একটি Projection'], correct_answer: 0 },
          { question: 'Table Join করতে কী থাকা আবশ্যক?', options: ['একটি Common/Shared Column', 'একই সংখ্যক Row', 'একই ফরম্যাট', 'একই CRS'], correct_answer: 0 },
        ]
      },
      {
        title: '3. ভেক্টর ফাইল ফরম্যাট: Shapefile, GeoPackage ও GeoJSON', slug: 'vector-file-formats', order_index: 3,
        content: `# Lesson 3: ভেক্টর ফাইল ফরম্যাট\n\n| বৈশিষ্ট্য | Shapefile | GeoPackage | GeoJSON |\n|---|---|---|---|\n| ফাইল সংখ্যা | ৩-৬ | ১ | ১ |\n| সাইজ লিমিট | 2 GB | ∞ | ∞ (ধীর) |\n| Column নাম | ১০ অক্ষর | ∞ | ∞ |\n| একাধিক Layer | ❌ | ✅ | ❌ |\n| ওয়েবে ব্যবহার | ❌ | ❌ | ✅ |\n| সুপারিশ | ⛔ Legacy | 🏆 Desktop | 🌐 Web |\n\n> 🏆 নতুন প্রকল্পে সবসময় **GeoPackage** ব্যবহার করুন!`,
        quizzes: [
          { question: 'নতুন GIS প্রকল্পে কোন ফরম্যাট সবচেয়ে সুপারিশকৃত?', options: ['GeoPackage (.gpkg)', 'Shapefile (.shp)', 'CSV', 'PDF'], correct_answer: 0 },
          { question: 'GeoJSON কোন CRS এ ডেটা সংরক্ষণ করে?', options: ['WGS84 (EPSG:4326)', 'UTM Zone 46N', 'Web Mercator', 'যেকোনো CRS'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 4: Raster Data Model — Pixels & Satellite Imagery', slug: 'mod4-raster-data-model', order_index: 4,
    description: 'রাস্টার ডেটার ভিত্তি — পিক্সেল, রেজোলিউশন, ব্যান্ড, DEM।',
    lessons: [
      {
        title: '1. Raster ডেটা কী? পিক্সেল ও গ্রিড', slug: 'raster-data-basics', order_index: 1,
        content: `# Lesson 1: Raster ডেটা — পিক্সেল ও গ্রিডের জগৎ\n\nRaster = সমান আকারের পিক্সেলের গ্রিড। প্রতিটি পিক্সেলে একটি সংখ্যা থাকে।\n\n## রেজোলিউশন:\n\n| স্যাটেলাইট | রেজোলিউশন | ব্যবহার |\n|---|---|---|\n| Sentinel-2 | 10m | ফসল মনিটরিং |\n| Landsat 8/9 | 30m | ভূমি আচ্ছাদন |\n| MODIS | 250m-1km | জাতীয় পর্যায়ে NDVI |\n\n## Spectral Bands:\n\n| ব্যান্ড | কী দেখা যায়? |\n|---|---|\n| **Blue** | পানি, বায়ুমণ্ডল |\n| **Green** | সবুজ গাছপালা |\n| **Red** | ক্লোরোফিল শোষণ |\n| **NIR** | 🌱 উদ্ভিদের স্বাস্থ্য |\n| **SWIR** | মাটির আর্দ্রতা |\n\n> 🌾 **NIR (Near-Infrared)** ব্যান্ড কৃষিতে সবচেয়ে গুরুত্বপূর্ণ!`,
        quizzes: [
          { question: 'Sentinel-2 এর সবচেয়ে ভালো রেজোলিউশন কত?', options: ['10 মিটার', '30 মিটার', '1 কিলোমিটার', '3 মিটার'], correct_answer: 0 },
          { question: 'সুস্থ ফসল কোন ব্যান্ডে সবচেয়ে বেশি প্রতিফলন করে?', options: ['NIR (Near-Infrared)', 'Blue', 'Red', 'SWIR'], correct_answer: 0 },
        ]
      },
      {
        title: '2. DEM ও রাস্টার ফাইল ফরম্যাট', slug: 'dem-raster-formats', order_index: 2,
        content: `# Lesson 2: DEM ও রাস্টার ফরম্যাট\n\n## DEM\nপ্রতিটি পিক্সেলের মান = সমুদ্রপৃষ্ঠ থেকে **উচ্চতা (মিটারে)**। বন্যা মডেলিং, Slope, Watershed এ অপরিহার্য।\n\n## ফরম্যাট:\n\n| ফরম্যাট | বিশেষত্ব |\n|---|---|\n| **GeoTIFF** (.tif) | 🏆 সবচেয়ে জনপ্রিয় |\n| **COG** | Cloud-Optimized |\n| **NetCDF** (.nc) | জলবায়ু সিরিজ |\n\n## NoData:\nকিছু পিক্সেলে ডেটা নেই (মেঘ, সেন্সর ত্রুটি) → -9999 বা NaN\n\n> 🏆 সব সময় **GeoTIFF (.tif)** ব্যবহার করুন।`,
        quizzes: [
          { question: 'DEM এর প্রতিটি পিক্সেলে কোন তথ্য সংরক্ষিত?', options: ['সমুদ্রপৃষ্ঠ থেকে উচ্চতা (মিটারে)', 'রঙের মান', 'তাপমাত্রা', 'বৃষ্টিপাত'], correct_answer: 0 },
          { question: 'সবচেয়ে সুপারিশকৃত Raster ফরম্যাট কোনটি?', options: ['GeoTIFF (.tif)', 'JPEG (.jpg)', 'PNG (.png)', 'BMP'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 5: QGIS পরিচিতি — ইন্সটলেশন ও ইন্টারফেস', slug: 'mod5-qgis-introduction', order_index: 5,
    description: 'QGIS ইন্সটল করুন এবং এর ইন্টারফেস, প্যানেল, টুলবার ও Layer ব্যবস্থাপনা শিখুন।',
    lessons: [
      {
        title: '1. QGIS ইন্সটলেশন ও প্রথম পরিচয়', slug: 'qgis-installation', order_index: 1,
        content: `# Lesson 1: QGIS ইন্সটলেশন\n\n## ডাউনলোড: https://qgis.org/download/\n\n> 💡 **LTR (Long Term Release)** ডাউনলোড করুন — সবচেয়ে স্থিতিশীল।\n\n## ইন্টারফেসের ৫ অংশ:\n1. **Menu Bar** — Project, Edit, View, Layer, Processing\n2. **Toolbar** — Zoom, Pan, Select, Measure আইকন\n3. **Layer Panel** (বাম) — Layer তালিকা ও নিয়ন্ত্রণ\n4. **Map Canvas** (মাঝ) — মানচিত্র দেখানো\n5. **Status Bar** (নিচ) — Coordinate, Scale, CRS\n\n## প্রথম কাজ: Basemap যোগ\nBrowser Panel → XYZ Tiles → OpenStreetMap → ডাবল ক্লিক\n\n## শর্টকাট:\n| শর্টকাট | কাজ |\n|---|---|\n| Scroll | Zoom |\n| Space+Drag | Pan |\n| Ctrl+S | Save |\n| V | Select |`,
        quizzes: [
          { question: 'QGIS এর কোন ভার্সন সবচেয়ে স্থিতিশীল?', options: ['LTR (Long Term Release)', 'Latest/Nightly', 'Beta', 'Alpha'], correct_answer: 0 },
          { question: 'QGIS এ Basemap কোথা থেকে যোগ করা যায়?', options: ['Browser Panel → XYZ Tiles', 'File → Open', 'Layer → Add CSV', 'Settings → Options'], correct_answer: 0 },
        ]
      },
      {
        title: '2. QGIS এ ডেটা লোড ও ব্যবস্থাপনা', slug: 'qgis-data-loading', order_index: 2,
        content: `# Lesson 2: QGIS এ ডেটা লোড\n\n## ভেক্টর ডেটা:\nDrag & Drop → .shp, .gpkg, .geojson ম্যাপে টানুন\n\n## রাস্টার ডেটা:\nLayer → Add Layer → Add Raster Layer → .tif\n\n## CSV (Lat/Lon সহ):\n1. Layer → Add Delimited Text Layer\n2. X = Longitude, Y = Latitude\n3. CRS = EPSG:4326\n\n## Layer ক্রম:\n- Basemap → নিচে\n- Polygon → মাঝে\n- Point → উপরে\n\n## Attribute Table:\nRight Click → Open Attribute Table (F6)`,
        quizzes: [
          { question: 'CSV থেকে Point ম্যাপ তৈরিতে কোন ফিল্ড দুটি দরকার?', options: ['X = Longitude, Y = Latitude', 'X = ID, Y = Name', 'X = Area, Y = Pop', 'X = Date, Y = Time'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 6: Map Styling ও Symbology', slug: 'mod6-map-styling', order_index: 6,
    description: 'ম্যাপকে অর্থবহ ও সুন্দর করুন — Graduated, Categorized, Rule-Based Symbology।',
    lessons: [
      {
        title: '1. Symbology: ম্যাপকে অর্থবহ করা', slug: 'symbology-basics', order_index: 1,
        content: `# Lesson 1: Symbology\n\n## ৪ ধরনের Symbology:\n\n### ১. Single Symbol — সব একই রঙ\n### ২. Categorized — টেক্সট অনুযায়ী আলাদা রঙ\n### ৩. Graduated — সংখ্যা অনুযায়ী রঙের গ্র্যাডিয়েন্ট (**Choropleth Map**) 🏆\n### ৪. Rule-Based — কাস্টম শর্ত\n\n## QGIS এ Graduated Symbology:\n1. Layer ডাবল ক্লিক → Symbology\n2. Graduated সিলেক্ট\n3. Column: Rice_Yield\n4. Color Ramp: RdYlGn\n5. Classify → OK\n\n> 🌾 কৃষি গবেষণায় **Choropleth Map** সবচেয়ে বেশি ব্যবহৃত!`,
        quizzes: [
          { question: 'জেলাভিত্তিক ধান উৎপাদনের ম্যাপে কোন Symbology ব্যবহার করবেন?', options: ['Graduated (Choropleth)', 'Single Symbol', 'Heatmap', 'No Symbology'], correct_answer: 0 },
          { question: 'Choropleth Map কী?', options: ['Graduated রঙ দিয়ে সংখ্যাগত ডেটা দেখানো এলাকা-ভিত্তিক মানচিত্র', 'স্যাটেলাইট ছবি', 'রাস্তার মানচিত্র', 'টপোগ্রাফিক ম্যাপ'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 7: কার্টোগ্রাফি — প্রকাশনা-যোগ্য মানচিত্র', slug: 'mod7-cartography', order_index: 7,
    description: 'Print Layout, Scale Bar, Legend, North Arrow ও PDF Export।',
    lessons: [
      {
        title: '1. QGIS Print Layout: প্রকাশনা-মানের মানচিত্র', slug: 'print-layout-basics', order_index: 1,
        content: `# Lesson 1: Print Layout\n\n## ৬টি আবশ্যক উপাদান:\n| উপাদান | বর্ণনা |\n|---|---|\n| 📍 Title | স্পষ্ট শিরোনাম |\n| 📏 Scale Bar | দূরত্ব (km/m) |\n| 🧭 North Arrow | দিক নির্দেশনা |\n| 🗺️ Legend | রঙ ও প্রতীকের ব্যাখ্যা |\n| 📋 Source | ডেটা উৎস, CRS, তারিখ |\n| 🔍 Inset Map | বৃহৎ প্রেক্ষাপটে অবস্থান |\n\n## ধাপ:\n1. Project → New Print Layout\n2. Add Item → Add Map → ড্র্যাগ\n3. Scale সেট, Lock layers ✅\n4. Scale Bar, North Arrow, Legend, Title যোগ\n5. Export as PDF → **300 DPI**\n\n> ⚠️ জার্নালে জমা দিতে **300 DPI**+ লাগে!`,
        quizzes: [
          { question: 'জার্নাল পেপারে ম্যাপ কত DPI তে Export করা উচিত?', options: ['300 DPI বা বেশি', '72 DPI', '96 DPI', '50 DPI'], correct_answer: 0 },
        ]
      },
    ]
  },
  {
    title: 'Module 8: ক্যাপস্টোন — প্রথম কৃষি মানচিত্র', slug: 'mod8-capstone-first-map', order_index: 8,
    description: 'সব শেখা জ্ঞান প্রয়োগ করে বাংলাদেশের একটি পূর্ণাঙ্গ কৃষি মানচিত্র তৈরি করুন।',
    lessons: [
      {
        title: '1. ক্যাপস্টোন: বাংলাদেশের ধান উৎপাদন মানচিত্র', slug: 'capstone-rice-map', order_index: 1,
        content: `# 🎓 ক্যাপস্টোন: বাংলাদেশের জেলাভিত্তিক ধান উৎপাদন মানচিত্র\n\n## ধাপে ধাপে:\n1. QGIS প্রকল্প সেটআপ → **EPSG:32646**\n2. GADM থেকে জেলা সীমানা লোড → CRS Transform\n3. BBS CSV ডেটা → **Table Join** (District কলাম দিয়ে)\n4. **Graduated Symbology** → RdYlGn → 5 Classes (Jenks)\n5. **Labels** → Expression: "NAME_2" || '\\n' || round("Yield", 1) || ' t/ha'\n6. **Print Layout** → Map, Scale Bar, North Arrow, Legend, Title → **PDF 300 DPI**\n\n## মূল্যায়ন: ১০০ পয়েন্ট\n| মানদণ্ড | পয়েন্ট |\n|---|---|\n| সঠিক CRS | ২০ |\n| Table Join | ২০ |\n| Choropleth | ২০ |\n| Labels | ১৫ |\n| Print Layout | ২০ |\n| পরিচ্ছন্নতা | ৫ |\n\n> 🚀 **Course 2: GIS Analysis & Remote Sensing** এ এগিয়ে যান!`,
        quizzes: [
          { question: 'বাংলাদেশের জেলা ম্যাপের জন্য কোন CRS ব্যবহার করা উচিত?', options: ['EPSG:32646 (UTM Zone 46N)', 'EPSG:4326', 'EPSG:3857', 'EPSG:2154'], correct_answer: 0 },
          { question: 'CSV ডেটা Shapefile এ যোগ করতে কোন অপারেশন ব্যবহৃত হয়?', options: ['Table Join', 'Buffer', 'Clip', 'Dissolve'], correct_answer: 0 },
        ]
      },
    ]
  },
];

// =============================================================================
// MAIN
// =============================================================================
async function seedCourse(courseData, modulesData) {
  console.log(`\n=== Seeding: ${courseData.title} ===`);
  const courseId = await upsertCourse(courseData);
  console.log(`  Course ID: ${courseId}`);
  
  let totalLessons = 0, totalQuizzes = 0;
  
  for (const mod of modulesData) {
    const moduleId = await insertModule({
      course_id: courseId, title: mod.title, slug: mod.slug,
      order_index: mod.order_index, description: mod.description,
    });
    console.log(`  Module: ${mod.title}`);
    
    for (const lesson of mod.lessons) {
      const lessonId = await insertLesson({
        module_id: moduleId, title: lesson.title, slug: lesson.slug,
        order_index: lesson.order_index, content: lesson.content, video_url: null,
      });
      totalLessons++;
      
      if (lesson.quizzes?.length > 0) {
        await insertQuizzes(lessonId, lesson.quizzes);
        totalQuizzes += lesson.quizzes.length;
      }
    }
  }
  
  console.log(`  ✅ Done! ${modulesData.length} modules, ${totalLessons} lessons, ${totalQuizzes} quizzes`);
}

async function main() {
  try {
    await seedCourse(COURSE_1, MODULES);
    
    console.log('\n=== Verification ===');
    const { data: courses } = await supabase.from('courses').select('title, slug').order('created_at');
    console.log(JSON.stringify(courses, null, 2));
  } catch (err) {
    console.error('FATAL:', err.message);
    process.exit(1);
  }
}

module.exports = { COURSE_1, MODULES };

if (require.main === module) {
  main();
}
