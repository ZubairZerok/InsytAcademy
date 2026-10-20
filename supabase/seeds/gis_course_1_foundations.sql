-- SEED DATA: GIS COURSE 1 — SPATIAL LITERACY & GIS FOUNDATIONS
-- Progressive GIS Pathway: Course 1 of 3
-- Target: Complete beginner. No GIS experience required.
-- Language: Bilingual (Bangla narrative + English technical terms)

DO $$
DECLARE
  c_id UUID;   -- Course ID
  m1_id UUID;  -- Module IDs
  m2_id UUID;
  m3_id UUID;
  m4_id UUID;
  m5_id UUID;
  m6_id UUID;
  m7_id UUID;
  m8_id UUID;
  l_id UUID;   -- Temp Lesson ID
BEGIN
  -- ================================================================================================
  -- CLEANUP & COURSE CREATION
  -- ================================================================================================
  DELETE FROM public.courses WHERE slug = 'gis-spatial-foundations';

  INSERT INTO public.courses (title, slug, description, is_published, thumbnail_url)
  VALUES (
    'Spatial Literacy & GIS Foundations',
    'gis-spatial-foundations',
    'GIS এর মূল ভিত্তি শিখুন — স্পেশিয়াল থিংকিং, কোঅর্ডিনেট সিস্টেম, ভেক্টর-রাস্টার ডেটা মডেল, QGIS পরিচিতি এবং আপনার প্রথম কৃষি মানচিত্র তৈরি করুন।',
    TRUE,
    '/images/courses/gis-spatial-foundations.png'
  ) RETURNING id INTO c_id;

  -- ================================================================================================
  -- MODULE 1: WHAT IS GIS? WHY SPATIAL THINKING MATTERS
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 1: What is GIS? Why Spatial Thinking Matters', 'mod1-what-is-gis', 1,
    'GIS এর মৌলিক ধারণা, স্পেশিয়াল থিংকিং এবং কৃষি গবেষণায় এর বিপ্লবী ভূমিকা বুঝুন।')
  RETURNING id INTO m1_id;

  -- M1-L1: Introduction to GIS
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id,
    '1. GIS কি? কৃষিতে এর গুরুত্ব', 'what-is-gis-importance', 1,
  $markdown$
# Module Overview
এই মডিউলে আমরা ভৌগোলিক তথ্য ব্যবস্থা বা GIS (Geographic Information System) এর মূল ধারণার সাথে পরিচিত হবো। কৃষি বিজ্ঞানে GIS কীভাবে গেম-চেঞ্জার, তা বুঝবো।

# Lesson 1: GIS কি? কৃষিতে এর গুরুত্ব

আসসালামু আলাইকুম! আশা করি সবাই ভালো আছেন।

আমাদের R কোর্সে আমরা ডেটা টেবিল নিয়ে অনেক কাজ করেছি। কিন্তু ভাবুন তো — যদি আপনার ডেটার সাথে **লোকেশন** সরাসরি সংযুক্ত থাকে? উদাহরণস্বরূপ, ময়মনসিংহের কোন ইউনিয়নের মাটিতে নাইট্রোজেনের পরিমাণ কত, কিংবা চলনবিলের কোন এলাকায় এ বছর বোরো ধান বেশি হয়েছে — তা যদি সরাসরি **ম্যাপে** দেখা যেত?

সেখানেই আমাদের উদ্ধারকর্তা হলো **GIS (Geographic Information System)**।

## সহজ সংজ্ঞা

> **GIS = Geography + Data + Software Tools**

এটি শুধু মানচিত্র নয়। এটি এমন একটি **ডাটাবেজ সিস্টেম** যা মানচিত্রের প্রতিটি ফিচারের পেছনে তার গুণাগুণ (Attributes) সংরক্ষণ করে।

## কৃষি গবেষণায় GIS এর প্রয়োগ

| ক্ষেত্র | GIS এর কাজ | উদাহরণ |
|---|---|---|
| **Crop Suitability** | মাটি, ঢাল, বৃষ্টিপাত ওভারলে করে ফসল উপযুক্ততা নির্ণয় | রাজশাহীতে কোথায় আম চাষ সবচেয়ে ভালো হবে |
| **Flood Damage** | বন্যার আগে-পরের স্যাটেলাইট ইমেজ তুলনা | সুনামগঞ্জে কত একর ধানী জমি তলিয়ে গেছে |
| **Precision Farming** | GPS + ড্রোন দিয়ে সার প্রয়োগ ম্যাপ | নির্দিষ্ট জায়গায় নির্দিষ্ট পরিমাণ সার দেওয়া |
| **Soil Mapping** | মাটির pH, জৈব পদার্থ, টেক্সচার ম্যাপিং | জেলাভিত্তিক মৃত্তিকা সম্পদ মানচিত্র |
| **Water Resource** | সেচ খাল, পুকুর, নদীর নেটওয়ার্ক বিশ্লেষণ | জলাশয় ব্যবস্থাপনা পরিকল্পনা |

## সাধারণ ডেটা vs GIS ডেটা

সাধারণ এক্সেলে ডেটা দেখতে এমন হয়:
```
District | Soil_pH | Yield_ton_ha
Mymensingh | 5.5 | 4.2
Bogra | 6.1 | 3.8
```

কিন্তু GIS-এ এই ডেটার সাথে যুক্ত থাকে **Geometry** (জ্যামিতিক আকৃতি):
```
District | Soil_pH | Yield | Geometry (Polygon Boundary)
Mymensingh | 5.5 | 4.2 | POLYGON((90.1 24.7, 90.5 24.7, ...))
```

> 💡 **মনে রাখুন:** R-এ আমরা যে `data.frame` ব্যবহার করতাম, GIS সেই ডেটাফ্রেমেই প্রতিটি রো-র সাথে একটি করে **জ্যামিতিক নকশা** (Point, Line, বা Polygon) জুড়ে দেয়! R-এ এটিকে বলে `sf` (Simple Features) অবজেক্ট।

## GIS এর ৩টি মূল উপাদান

1. **Hardware:** কম্পিউটার, GPS রিসিভার, ড্রোন, স্যাটেলাইট
2. **Software:** QGIS (ফ্রি), ArcGIS Pro (পেইড), Google Earth Engine (ক্লাউড)
3. **Data:** স্পেশিয়াল ডেটা (ম্যাপ) + অ্যাট্রিবিউট ডেটা (টেবিল)

## সারসংক্ষেপ
আজকে আমরা জানলাম:
1. GIS কী এবং কীভাবে ডেটার সাথে মানচিত্রকে সংযুক্ত করে
2. কৃষি বিজ্ঞানে GIS এর বহুমুখী ব্যবহার
3. সাধারণ টেবুলার ডেটা এবং স্পেশিয়াল ডেটার মধ্যে পার্থক্য
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'GIS এর পূর্ণরূপ কোনটি?', '["Geographic Information System", "Geological Info Study", "Global Infrastructure System", "General Imaging Software"]'::jsonb, 0),
    (l_id, 'সাধারণ স্প্রেডশিটের সাথে GIS স্প্রেডশিটের মূল পার্থক্য কোথায়?', '["GIS এ ডেটা এন্ট্রি করা যায় না", "GIS এ প্রতিটি ডেটার সাথে স্পেশিয়াল জিওমেট্রি যুক্ত থাকে", "GIS এ গ্রাফ আঁকা যায় না", "কোন পার্থক্য নেই"]'::jsonb, 1),
    (l_id, 'নিচের কোনটি Precision Farming এর উদাহরণ?', '["GPS ও ড্রোন ব্যবহার করে নির্দিষ্ট জায়গায় সার প্রয়োগ", "হাতে চাষ করা", "বীজ শুকানো", "অনলাইনে সার কেনা"]'::jsonb, 0);


  -- M1-L2: Spatial Thinking — Thinking in Layers
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id,
    '2. স্পেশিয়াল থিংকিং: Layers এ চিন্তা করা', 'spatial-thinking-layers', 2,
  $markdown$
# Lesson 2: স্পেশিয়াল থিংকিং — Layers এ চিন্তা করা

স্বাগতম দ্বিতীয় লেসনে! আজ আমরা শিখবো কিভাবে একজন GIS বিশেষজ্ঞের মতো চিন্তা করতে হয়। একে বলে **Spatial Thinking (স্থানিক চিন্তা)**।

## স্যান্ডউইচ অ্যানালজি 🥪

একটি স্যান্ডউইচের কথা ভাবুন:
- সবার নিচে **রুটি** (Base Layer)
- তার উপরে **লেটুস পাতা** (Vegetation Layer)
- তার উপরে **মুরগির টুকরো** (Feature Layer)
- সবার উপরে আরেকটি **রুটি** (Top Layer)

GIS-ও ঠিক এভাবে কাজ করে! বাস্তব জগতকে আমরা বিভিন্ন **Layer (স্তর)** এ ভাগ করি:

## GIS Layer এর ধারণা

| Layer নম্বর | বিষয়বস্তু | ডেটা টাইপ |
|---|---|---|
| Layer 1 | স্যাটেলাইট ইমেজ / বেসম্যাপ | Raster |
| Layer 2 | নদী ও খাল নেটওয়ার্ক | Vector (Line) |
| Layer 3 | কৃষি ব্লক/জমির সীমানা | Vector (Polygon) |
| Layer 4 | মৌসুম কেন্দ্র / আবহাওয়া স্টেশন | Vector (Point) |
| Layer 5 | উচ্চতা / ভূমি ঢাল | Raster (DEM) |

> 💡 **মূল কথা:** প্রতিটি Layer একটি নির্দিষ্ট বিষয়ের তথ্য ধারণ করে। সব Layer একসাথে ওভারলে (Overlay) করলে আমরা বাস্তব জগতের একটি **ডিজিটাল মডেল** পাই।

## কেন Layer ভিত্তিক চিন্তা জরুরি?

ধরুন, আপনি জানতে চান: **"সিলেটের কোন উপজেলায় বন্যার ঝুঁকি সবচেয়ে বেশি?"**

এর জন্য আপনার দরকার:
1. **উচ্চতার ম্যাপ (DEM Layer):** কোন এলাকা নিচু
2. **নদীর Layer:** কোন নদীর কাছাকাছি
3. **জনবসতি Layer:** কত মানুষ ঝুঁকিতে
4. **ঐতিহাসিক বন্যা Layer:** আগে কোথায় বন্যা হয়েছে

এই ৪টি Layer একসাথে **Overlay Analysis** করলে আপনি বন্যা ঝুঁকি মানচিত্র তৈরি করতে পারবেন!

## স্পেশিয়াল থিংকিং এর ৩টি মূল দক্ষতা

1. **Spatial Concepts:** দূরত্ব, দিক, আকৃতি, প্যাটার্ন বোঝা
2. **Spatial Representation:** বাস্তব জগতকে ম্যাপে রূপান্তর করা
3. **Spatial Reasoning:** ম্যাপ দেখে সিদ্ধান্ত নেওয়া (যেমন: "নদী থেকে ৫০০ মিটারের মধ্যে কত বাড়ি আছে?")

## সারসংক্ষেপ
1. GIS বাস্তব জগতকে আলাদা আলাদা **Layer** এ ভাগ করে
2. প্রতিটি Layer একটি নির্দিষ্ট বিষয়ের তথ্য ধারণ করে
3. Layer গুলো ওভারলে করে জটিল প্রশ্নের উত্তর খুঁজতে হয়
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'GIS এ Layer ভিত্তিক চিন্তা করার মূল সুবিধা কী?', '["বিভিন্ন বিষয়ের তথ্য আলাদা রেখে প্রয়োজনে একসাথে বিশ্লেষণ করা যায়", "ম্যাপ সুন্দর দেখায়", "কম্পিউটারের RAM বাঁচে", "ইন্টারনেট ছাড়া কাজ করা যায়"]'::jsonb, 0),
    (l_id, 'বন্যা ঝুঁকি মানচিত্র তৈরিতে নিচের কোন Layer সবচেয়ে গুরুত্বপূর্ণ?', '["Digital Elevation Model (DEM)", "রাস্তার নেটওয়ার্ক", "দোকানের লোকেশন", "মোবাইল টাওয়ারের অবস্থান"]'::jsonb, 0),
    (l_id, 'Spatial Reasoning বলতে কী বোঝায়?', '["ম্যাপ দেখে বিশ্লেষণ ও সিদ্ধান্ত নেওয়ার ক্ষমতা", "কম্পিউটারে কোড লেখা", "GPS দিয়ে গাড়ি চালানো", "স্যাটেলাইট উৎক্ষেপণ"]'::jsonb, 0);


  -- M1-L3: GIS Software Ecosystem Overview
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id,
    '3. GIS সফটওয়্যার ইকোসিস্টেম: কোনটা কখন?', 'gis-software-ecosystem', 3,
  $markdown$
# Lesson 3: GIS সফটওয়্যার ইকোসিস্টেম

GIS জগতে অনেকগুলো সফটওয়্যার আছে। প্রতিটির আলাদা শক্তি ও দুর্বলতা আছে। আজ আমরা সবগুলো জানবো এবং বুঝবো কখন কোনটি ব্যবহার করবো।

## মূল GIS সফটওয়্যার তুলনা

| সফটওয়্যার | টাইপ | মূল্য | শক্তি | আমরা শিখবো? |
|---|---|---|---|---|
| **QGIS** | Desktop | 🆓 ফ্রি | সবচেয়ে শক্তিশালী ফ্রি GIS | ✅ Course 1 & 2 |
| **ArcGIS Pro** | Desktop | 💰 পেইড | ইন্ডাস্ট্রি স্ট্যান্ডার্ড | ✅ Course 3 |
| **Google Earth Engine** | Cloud | 🆓 ফ্রি | Petabyte-scale স্যাটেলাইট প্রসেসিং | ✅ Course 3 |
| **Google Earth Pro** | Desktop | 🆓 ফ্রি | দ্রুত visualization | ✅ এই কোর্স |
| **PostGIS** | Database | 🆓 ফ্রি | Enterprise spatial DB | ✅ Course 3 |
| **R (sf, terra)** | Programming | 🆓 ফ্রি | Statistical spatial analysis | ✅ Course 2 & 3 |
| **Python (GeoPandas)** | Programming | 🆓 ফ্রি | Automation & ML | ✅ Course 3 |

## কেন QGIS দিয়ে শুরু?

QGIS বিশ্বের সবচেয়ে জনপ্রিয় **ওপেন সোর্স** GIS সফটওয়্যার:
- 🆓 সম্পূর্ণ **বিনামূল্যে** — কোন লাইসেন্স ফি নেই
- 🌐 **Cross-platform:** Windows, Mac, Linux সবখানে চলে
- 🔌 **Plugin System:** ১০০০+ প্লাগইন দিয়ে ক্ষমতা বাড়ানো যায়
- 📚 **Community:** বিশ্বব্যাপী লক্ষ লক্ষ ব্যবহারকারী

## GIS শেখার পথনকশা (Learning Pathway)

```
📍 আপনি এখানে আছেন
     ↓
[Course 1: GIS Foundations] ← QGIS ভিত্তিক ম্যাপ তৈরি
     ↓
[Course 2: GIS Analysis] ← Spatial Analysis + Remote Sensing
     ↓
[Course 3: Geospatial Engineering] ← PostGIS, Python, GEE, Cloud
```

> 💡 **এই কোর্সে (Course 1)** আমরা মূলত QGIS এবং Google Earth Pro ব্যবহার করবো। কোন কোডিং দরকার নেই — শুধু ক্লিক করে শিখবেন!

## সারসংক্ষেপ
1. GIS জগতে অনেক সফটওয়্যার আছে — প্রতিটির আলাদা কাজ
2. আমরা QGIS দিয়ে শুরু করছি কারণ এটি ফ্রি, শক্তিশালী এবং ইন্ডাস্ট্রি-গ্রেড
3. ধাপে ধাপে Desktop → Analysis → Cloud/Programming শিখবো
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'নিচের কোন GIS সফটওয়্যারটি সম্পূর্ণ বিনামূল্যে ও ওপেন সোর্স?', '["QGIS", "ArcGIS Pro", "ERDAS Imagine", "MapInfo"]'::jsonb, 0),
    (l_id, 'Google Earth Engine মূলত কোন ধরনের কাজের জন্য সবচেয়ে উপযুক্ত?', '["বিশাল পরিমাণ স্যাটেলাইট ইমেজ ক্লাউডে প্রসেস করা", "ওয়ার্ড ডকুমেন্ট তৈরি", "ভিডিও এডিটিং", "ইমেইল পাঠানো"]'::jsonb, 0),
    (l_id, 'PostGIS মূলত কী?', '["PostgreSQL ডাটাবেজের জন্য Spatial Extension", "একটি মোবাইল অ্যাপ", "একটি ড্রোন সফটওয়্যার", "একটি ক্লাউড স্টোরেজ"]'::jsonb, 0);


  -- ================================================================================================
  -- MODULE 2: COORDINATE SYSTEMS & MAP PROJECTIONS
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 2: Coordinate Systems & Map Projections', 'mod2-coordinate-systems', 2,
    'পৃথিবীকে ম্যাপে রূপান্তরের গাণিতিক ভিত্তি — CRS, ডেটাম, প্রজেকশন এবং EPSG কোড শিখুন।')
  RETURNING id INTO m2_id;

  -- M2-L1: Geographic Coordinate System
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id,
    '1. Geographic Coordinate System: অক্ষাংশ ও দ্রাঘিমাংশ', 'geographic-coordinate-system', 1,
  $markdown$
# Lesson 1: Geographic Coordinate System (GCS)

পৃথিবীতে যেকোনো স্থানের অবস্থান বলতে আমাদের একটি **ঠিকানা ব্যবস্থা** দরকার। সেটাই হলো **Coordinate System (স্থানাঙ্ক ব্যবস্থা)**।

## অক্ষাংশ ও দ্রাঘিমাংশ (Latitude & Longitude)

পৃথিবীর প্রতিটি বিন্দুকে দুটি সংখ্যা দিয়ে চিহ্নিত করা যায়:

- **Latitude (অক্ষাংশ, φ):** বিষুবরেখা থেকে উত্তর বা দক্ষিণে কোণিক দূরত্ব
  - পরিসীমা: -90° (দক্ষিণ মেরু) থেকে +90° (উত্তর মেরু)
  - বাংলাদেশ: প্রায় 20.5°N থেকে 26.6°N
  
- **Longitude (দ্রাঘিমাংশ, λ):** প্রাইম মেরিডিয়ান (Greenwich) থেকে পূর্ব বা পশ্চিমে কোণিক দূরত্ব
  - পরিসীমা: -180° (পশ্চিম) থেকে +180° (পূর্ব)
  - বাংলাদেশ: প্রায় 88.0°E থেকে 92.7°E

## বাংলাদেশের গুরুত্বপূর্ণ স্থানাঙ্ক

| স্থান | Latitude | Longitude |
|---|---|---|
| বাংলাদেশ কৃষি বিশ্ববিদ্যালয় (BAU) | 24.7256°N | 90.4440°E |
| ঢাকা (শাহবাগ) | 23.7384°N | 90.3954°E |
| সুনামগঞ্জ হাওর | 25.0658°N | 91.3950°E |
| কক্সবাজার সমুদ্র সৈকত | 21.4272°N | 91.9750°E |

## WGS84 — বিশ্বের স্ট্যান্ডার্ড GCS

আপনার মোবাইলের GPS যে Coordinate দেখায়, সেটি **WGS84 (World Geodetic System 1984)** ব্যবস্থায়। এর EPSG কোড হলো **EPSG:4326**।

> ⚠️ **সাবধান!** WGS84 (EPSG:4326) এ Coordinate **ডিগ্রিতে** (কোণিক একক) দেওয়া হয়, মিটারে নয়। তাই এই সিস্টেমে সরাসরি **দূরত্ব বা ক্ষেত্রফল** হিসাব করলে ভুল উত্তর পাবেন!

## কেন EPSG কোড মনে রাখতে হবে?

**EPSG (European Petroleum Survey Group)** হলো Coordinate Reference System এর আন্তর্জাতিক ক্যাটালগ নম্বর:

| EPSG কোড | নাম | ব্যবহার |
|---|---|---|
| **4326** | WGS84 | GPS, Google Maps, GeoJSON |
| **32646** | UTM Zone 46N | বাংলাদেশের (পশ্চিম) জন্য মিটার ভিত্তিক |
| **3857** | Web Mercator | Google Maps, OpenStreetMap (টাইল) |

## সারসংক্ষেপ
1. পৃথিবীর যেকোনো বিন্দু Latitude (φ) ও Longitude (λ) দিয়ে চিহ্নিত করা যায়
2. WGS84 (EPSG:4326) হলো GPS এর স্ট্যান্ডার্ড Coordinate System
3. EPSG কোড মনে রাখা GIS এ অপরিহার্য
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'বাংলাদেশ কৃষি বিশ্ববিদ্যালয় (BAU) এর প্রায় Latitude কত?', '["24.7°N", "90.4°E", "23.8°N", "0°"]'::jsonb, 0),
    (l_id, 'WGS84 এর EPSG কোড কোনটি?', '["4326", "3857", "32646", "2154"]'::jsonb, 0),
    (l_id, 'EPSG:4326 এ Coordinate কোন একক ব্যবহৃত হয়?', '["ডিগ্রি (কোণিক একক)", "মিটার", "কিলোমিটার", "ফুট"]'::jsonb, 0);


  -- M2-L2: Map Projections
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id,
    '2. Map Projection: গোল পৃথিবীকে সমতলে আনা', 'map-projections', 2,
  $markdown$
# Lesson 2: Map Projections — গোল পৃথিবীকে সমতলে আনা

পৃথিবী হলো একটি অনিয়মিত গোলক (Oblate Spheroid/Geoid)। কিন্তু আমাদের ম্যাপ, মনিটর, এবং কাগজ — সবই সমতল (Flat)! তাহলে গোল জিনিসকে সমতলে আনবো কিভাবে?

এই রূপান্তরকেই বলে **Map Projection (মানচিত্র অভিক্ষেপ)**।

## কমলালেবু অ্যানালজি 🍊

একটি কমলালেবুর খোসা ছাড়ানোর চেষ্টা করুন এবং সেটিকে সমতলে রাখুন — দেখবেন খোসা ছিঁড়ে যায়, বাঁকা হয়, বা টানাটানি হয়। ঠিক একইভাবে পৃথিবীকে সমতলে আনলে **বিকৃতি (Distortion)** হয়।

## ৩ ধরনের বিকৃতি (Tissot's Indicatrix)

প্রতিটি Projection অন্তত একটি জিনিস **বিকৃত** করবেই:

| Projection টাইপ | কী সংরক্ষণ করে? | কী বিকৃত হয়? | কখন ব্যবহার? |
|---|---|---|---|
| **Conformal** (Mercator) | আকৃতি ও কোণ | ক্ষেত্রফল | নৌচালনা, ওয়েব ম্যাপ |
| **Equal-Area** (Albers) | ক্ষেত্রফল | আকৃতি | 🌾 **কৃষি ফলন**, বনায়ন, জমি ম্যাপিং |
| **Equidistant** | দূরত্ব | আকৃতি ও ক্ষেত্রফল | দূরত্ব পরিমাপ |

> 🌾 **কৃষি গবেষকদের জন্য গুরুত্বপূর্ণ:** আপনি যদি জমির আয়তন, ফসলি জমির পরিমাণ, বা বন এলাকা হিসাব করতে চান — তাহলে **অবশ্যই Equal-Area Projection** ব্যবহার করতে হবে!

## UTM (Universal Transverse Mercator) — কৃষি গবেষণার সেরা বন্ধু

UTM পুরো পৃথিবীকে ৬০টি **Zone** এ ভাগ করে। প্রতিটি Zone ৬° দ্রাঘিমাংশ জুড়ে। বাংলাদেশ পড়ে **Zone 45N** ও **Zone 46N** এ।

| বাংলাদেশের অংশ | UTM Zone | EPSG কোড |
|---|---|---|
| পশ্চিম (রাজশাহী, খুলনা) | 45N | 32645 |
| পূর্ব (ঢাকা, সিলেট, চট্টগ্রাম) | 46N | 32646 |

**UTM এর সুবিধা:**
- মিটার ভিত্তিক — সরাসরি দূরত্ব ও ক্ষেত্রফল হিসাব করা যায়
- প্রতিটি Zone এ ন্যূনতম বিকৃতি

## Web Mercator (EPSG:3857) — ওয়েবে কেন ভুল?

Google Maps ও OpenStreetMap **Web Mercator (EPSG:3857)** ব্যবহার করে। এটি নৌচালনা ও নেভিগেশনের জন্য ভালো, কিন্তু:

> ⚠️ **গ্রিনল্যান্ডকে আফ্রিকার সমান দেখায়!** বাস্তবে আফ্রিকা গ্রিনল্যান্ডের ১৪ গুণ বড়। কৃষি গবেষণায় **কখনই** Web Mercator এ ক্ষেত্রফল হিসাব করবেন না।

## সারসংক্ষেপ
1. গোল পৃথিবীকে সমতল ম্যাপে আনতে **Projection** লাগে, এবং বিকৃতি অনিবার্য
2. কৃষি গবেষণায় ক্ষেত্রফল হিসাবের জন্য **Equal-Area** বা **UTM** Projection ব্যবহার করুন
3. বাংলাদেশের জন্য **EPSG:32646 (UTM Zone 46N)** সবচেয়ে উপযুক্ত
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'কৃষি জমির ক্ষেত্রফল হিসাবের জন্য কোন ধরনের Projection ব্যবহার করা উচিত?', '["Equal-Area Projection", "Conformal Projection", "Equidistant Projection", "যেকোনো Projection"]'::jsonb, 0),
    (l_id, 'বাংলাদেশের পূর্বাংশ (ঢাকা, সিলেট) কোন UTM Zone এ পড়ে?', '["Zone 46N (EPSG:32646)", "Zone 45N (EPSG:32645)", "Zone 44N", "Zone 50N"]'::jsonb, 0),
    (l_id, 'Google Maps এ গ্রিনল্যান্ডকে আফ্রিকার সমান দেখানোর কারণ কী?', '["Web Mercator Projection ক্ষেত্রফল বিকৃত করে", "গ্রিনল্যান্ড সত্যিই আফ্রিকার সমান", "Google এর ক্যামেরায় সমস্যা", "ইন্টারনেট ধীর হলে এমন হয়"]'::jsonb, 0);


  -- M2-L3: Datum & CRS Transformations
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id,
    '3. Datum ও CRS Transformation: বাস্তব প্রয়োগ', 'datum-crs-transformation', 3,
  $markdown$
# Lesson 3: Datum ও CRS Transformation

## Datum কী?

**Datum** হলো পৃথিবীর আকৃতির একটি **গাণিতিক মডেল (Reference Ellipsoid)**। পৃথিবী পুরোপুরি গোল নয় — এটি মেরু অঞ্চলে চ্যাপটা এবং বিষুবরেখায় স্ফীত। বিভিন্ন Datum এই আকৃতিকে বিভিন্নভাবে মডেল করে।

| Datum | Ellipsoid | কোথায় ব্যবহৃত? |
|---|---|---|
| **WGS84** | WGS84 Ellipsoid | GPS, আন্তর্জাতিক মানক |
| **Everest 1830** | Everest Ellipsoid | পুরনো ভারতীয় উপমহাদেশ সার্ভে |
| **NAD83** | GRS80 | উত্তর আমেরিকা |

> 💡 **বাংলাদেশে:** পুরনো তথ্য জরিপ মানচিত্র (Mauza Map) **Everest 1830 Datum** ব্যবহার করে। আধুনিক GPS ডেটা **WGS84** ব্যবহার করে। দুটো মিশালে **শত মিটার পর্যন্ত** ত্রুটি হতে পারে!

## CRS (Coordinate Reference System) = Datum + Projection

- **Geographic CRS:** Datum + কোণিক Coordinate (Lat/Lon)
  - উদাহরণ: WGS84 Geographic (EPSG:4326)
- **Projected CRS:** Datum + Projection + মিটার ভিত্তিক Coordinate
  - উদাহরণ: WGS84 / UTM Zone 46N (EPSG:32646)

## CRS Transformation — কেন প্রয়োজন?

ধরুন, আপনি দুটি ডেটাসেট নিয়ে কাজ করছেন:
1. সরকারি জমি জরিপ ম্যাপ → **Everest 1830 Datum**
2. আপনার GPS সার্ভে পয়েন্ট → **WGS84 Datum**

এদের একসাথে ওভারলে করতে হলে **অবশ্যই** একই CRS এ Transform করতে হবে!

## QGIS এ CRS বদলানো (Hands-On Preview)

QGIS তে যেকোনো Layer এর CRS বদলাতে:
1. Layer এ **Right Click → Export → Save Features As**
2. **CRS** ড্রপডাউন থেকে নতুন CRS সিলেক্ট করুন (যেমন EPSG:32646)
3. **OK** চাপুন — নতুন ফাইল তৈরি হবে সঠিক CRS এ

> ⚠️ **ভুল #1 (সবচেয়ে কমন ভুল):** QGIS এ Project CRS বদলালে **ডেটার CRS বদলায় না**, শুধু **দেখানোর** (On-the-fly reprojection) CRS বদলায়। ডেটার CRS বদলাতে Export করতে হবে!

## সারসংক্ষেপ
1. **Datum** হলো পৃথিবীর আকৃতির গাণিতিক মডেল
2. **CRS = Datum + Projection** — এটি ডেটার "ভাষা"
3. দুটি ভিন্ন CRS এর ডেটা একসাথে কাজ করতে **Transform** করতে হবে
4. বাংলাদেশে পুরনো সার্ভে ম্যাপ (Everest) ও GPS ডেটা (WGS84) মিশালে ভুল হয়
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'বাংলাদেশের পুরনো তথ্য জরিপ মানচিত্রে কোন Datum ব্যবহৃত হয়?', '["Everest 1830", "WGS84", "NAD83", "GRS80"]'::jsonb, 0),
    (l_id, 'CRS (Coordinate Reference System) এর সূত্র কোনটি?', '["Datum + Projection", "Latitude + Longitude", "GPS + Maps", "Software + Hardware"]'::jsonb, 0),
    (l_id, 'QGIS এ Project CRS বদলালে কী হয়?', '["শুধু দেখানোর (on-the-fly) CRS বদলায়, ডেটার CRS বদলায় না", "ডেটা মুছে যায়", "ফাইল corrupt হয়", "ডেটার আসল CRS বদলে যায়"]'::jsonb, 0);


  -- ================================================================================================
  -- MODULE 3: VECTOR DATA MODEL
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 3: Vector Data Model — Points, Lines, Polygons', 'mod3-vector-data-model', 3,
    'GIS এর ভেক্টর ডেটা মডেল — Point, Line, Polygon জিওমেট্রি এবং Attribute Table বিস্তারিত।')
  RETURNING id INTO m3_id;

  -- M3-L1: Vector Geometry Types
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m3_id,
    '1. Vector Geometry: Point, Line ও Polygon', 'vector-geometry-types', 1,
  $markdown$
# Lesson 1: Vector Geometry Types

GIS এ বাস্তব জগতের **বিচ্ছিন্ন (Discrete)** বস্তু বা ফিচারকে **Vector ডেটা** দিয়ে মডেল করা হয়। ভেক্টর ডেটা তিন ধরনের জ্যামিতিক আকৃতি ব্যবহার করে:

## ১. Point (বিন্দু) — 0-Dimension

একটি নির্দিষ্ট অবস্থান, যার দৈর্ঘ্য বা প্রস্থ নেই — শুধু (X, Y) Coordinate আছে।

**কৃষিতে উদাহরণ:**
- 🌡️ আবহাওয়া স্টেশন
- 🧪 মাটি নমুনা সংগ্রহের স্থান
- 🏥 উপজেলা কৃষি অফিস
- 📍 GPS-চিহ্নিত রোগাক্রান্ত গাছের অবস্থান

## ২. Line / Polyline (রেখা) — 1-Dimension

সংযুক্ত বিন্দুর ধারাবাহিক সিরিজ, যার দৈর্ঘ্য আছে কিন্তু প্রস্থ নেই।

**কৃষিতে উদাহরণ:**
- 🌊 নদী ও সেচ খালের নেটওয়ার্ক
- 🛤️ রাস্তা ও পরিবহন রুট
- 🔌 বৈদ্যুতিক ট্রান্সমিশন লাইন
- 📏 জরিপ ট্রানজেক্ট লাইন

## ৩. Polygon (বহুভুজ) — 2-Dimension

একটি বদ্ধ এলাকা, যার ক্ষেত্রফল ও পরিসীমা আছে। প্রথম ও শেষ বিন্দু একই (Closed Ring)।

**কৃষিতে উদাহরণ:**
- 🌾 জমির সীমানা / প্লট
- 🏘️ ইউনিয়ন বা উপজেলার প্রশাসনিক সীমানা
- 🌳 বনাঞ্চল
- 💧 জলাশয় ও হাওর এলাকা
- 🏭 শিল্প অঞ্চল

## Multi-Geometry

কখনো কখনো একটি ফিচার একাধিক জিওমেট্রি নিয়ে গঠিত:
- **MultiPoint:** একটি জেলায় সব মাটি নমুনার অবস্থান
- **MultiLineString:** একটি নদীর একাধিক শাখা
- **MultiPolygon:** দ্বীপ রাষ্ট্র (যেমন ইন্দোনেশিয়া) যেখানে একটি দেশ অনেক আলাদা ভূখণ্ড নিয়ে গঠিত

## WKT (Well-Known Text) — জিওমেট্রির লিখিত রূপ

```
POINT(90.4440 24.7256)
LINESTRING(90.3 24.7, 90.4 24.8, 90.5 24.7)
POLYGON((90.3 24.6, 90.5 24.6, 90.5 24.8, 90.3 24.8, 90.3 24.6))
```

> 💡 **মনে রাখুন:** WKT তে সবসময় **(Longitude, Latitude)** অর্থাৎ **(X, Y)** ক্রমে লেখা হয়। Google Maps এর মতো (Lat, Lon) নয়!

## সারসংক্ষেপ
1. Vector ডেটা = **Point** (বিন্দু) + **Line** (রেখা) + **Polygon** (ক্ষেত্র)
2. প্রতিটি ফিচারের সাথে **Attribute** (গুণাগুণ) টেবিল যুক্ত থাকে
3. WKT তে জিওমেট্রি টেক্সটে লেখা যায়
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'একটি সেচ খালকে GIS এ কোন জিওমেট্রি টাইপ দিয়ে মডেল করা হবে?', '["Line (Polyline)", "Point", "Polygon", "Raster"]'::jsonb, 0),
    (l_id, 'WKT তে Coordinate কোন ক্রমে লেখা হয়?', '["Longitude, Latitude (X, Y)", "Latitude, Longitude (Y, X)", "শুধু Latitude", "শুধু Longitude"]'::jsonb, 0),
    (l_id, 'MultiPolygon কখন ব্যবহৃত হয়?', '["একটি ফিচার একাধিক আলাদা ভূখণ্ড নিয়ে গঠিত হলে", "শুধু বিন্দু ডেটায়", "রাস্টার ডেটায়", "কখনই ব্যবহৃত হয় না"]'::jsonb, 0);


  -- M3-L2: Attribute Table
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m3_id,
    '2. Attribute Table: ফিচারের পরিচয়পত্র', 'attribute-table', 2,
  $markdown$
# Lesson 2: Attribute Table — ফিচারের পরিচয়পত্র

ভেক্টর ডেটার সবচেয়ে শক্তিশালী দিক হলো — প্রতিটি জিওমেট্রিক ফিচারের পেছনে একটি **ডেটাবেজ টেবিল** লুকিয়ে থাকে। একে বলে **Attribute Table**।

## Attribute Table এর গঠন

ধরুন আপনার কাছে বাংলাদেশের জেলাভিত্তিক মানচিত্র আছে:

| FID | District | Division | Area_sqkm | Population | Rice_Yield_ton_ha |
|---|---|---|---|---|---|
| 0 | Mymensingh | Mymensingh | 4,363 | 5,430,000 | 4.2 |
| 1 | Gazipur | Dhaka | 1,741 | 5,040,000 | 3.8 |
| 2 | Sunamganj | Sylhet | 3,670 | 2,760,000 | 2.1 |

- প্রতিটি **Row** = একটি **Feature** (জেলা)
- প্রতিটি **Column** = একটি **Attribute** (বৈশিষ্ট্য)
- **FID (Feature ID)** = ফিচারের ইউনিক আইডি

## ডেটা টাইপ (Field Types)

| টাইপ | বর্ণনা | উদাহরণ |
|---|---|---|
| **Text / String** | অক্ষর ও শব্দ | "Mymensingh", "Rice" |
| **Integer** | পূর্ণ সংখ্যা | 5430000, 64 |
| **Real / Float** | দশমিক সংখ্যা | 4.2, 90.444 |
| **Date** | তারিখ | 2026-01-15 |

## Attribute Query — ডেটা দিয়ে ফিচার খোঁজা

GIS এর অন্যতম শক্তি হলো **Attribute Query** — SQL-এর মতো শর্ত দিয়ে নির্দিষ্ট ফিচার বের করা:

```sql
-- ধান উৎপাদন ৩ টন/হেক্টরের বেশি এমন জেলা
"Rice_Yield_ton_ha" > 3.0

-- ময়মনসিংহ বিভাগের সব জেলা
"Division" = 'Mymensingh'

-- জনসংখ্যা ৫০ লক্ষের বেশি এবং ধান উৎপাদন ৪ টনের বেশি
"Population" > 5000000 AND "Rice_Yield_ton_ha" > 4.0
```

> 💡 **R জানেন?** এটি R-এ `dplyr::filter()` এর মতোই! GIS এর Attribute Query = R এর `filter(df, Yield > 3)`।

## Join — বাহ্যিক ডেটা যোগ করা

আপনার কাছে যদি একটি CSV ফাইল থাকে (যেমন জেলাভিত্তিক আবহাওয়া ডেটা), সেটিকে মানচিত্রের সাথে **Join** করতে পারেন:

```
Shapefile Attribute Table     +     CSV File
District | Area               District | Rainfall_mm | Temp_C
Mymensingh | 4363             Mymensingh | 2174 | 25.6
```

**ফলাফল (Joined Table):**
```
District | Area | Rainfall_mm | Temp_C | Geometry
Mymensingh | 4363 | 2174 | 25.6 | POLYGON(...)
```

## সারসংক্ষেপ
1. প্রতিটি Vector ফিচারের পেছনে **Attribute Table** আছে — এটিই GIS এর শক্তি
2. **Attribute Query** দিয়ে শর্তসাপেক্ষে ফিচার খোঁজা যায়
3. **Table Join** দিয়ে বাহ্যিক CSV/Excel ডেটা মানচিত্রে যোগ করা যায়
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'Attribute Table এর প্রতিটি Row কী নির্দেশ করে?', '["একটি Geographic Feature (ফিচার)", "একটি Column", "একটি CRS", "একটি Projection"]'::jsonb, 0),
    (l_id, 'নিচের কোন Query সঠিক — "ধান উৎপাদন ৩ টনের বেশি" খুঁজতে?', '["Rice_Yield > 3.0", "Rice_Yield = 3.0", "Rice_Yield < 3.0", "Rice_Yield != 3.0"]'::jsonb, 0),
    (l_id, 'Table Join করতে উভয় টেবিলে কোনটি থাকা আবশ্যক?', '["একটি Common/Shared Column (যেমন District নাম)", "একই সংখ্যক Row", "একই ফাইল ফরম্যাট", "একই CRS"]'::jsonb, 0);


  -- M3-L3: Vector File Formats
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m3_id,
    '3. ভেক্টর ফাইল ফরম্যাট: Shapefile, GeoPackage ও GeoJSON', 'vector-file-formats', 3,
  $markdown$
# Lesson 3: ভেক্টর ফাইল ফরম্যাট

GIS ডেটা বিভিন্ন ফরম্যাটে সংরক্ষণ করা হয়। প্রতিটি ফরম্যাটের সুবিধা-অসুবিধা আছে। আসুন প্রধান ফরম্যাটগুলো জানি।

## ১. Shapefile (.shp) — Legacy Standard

**Esri** কোম্পানির তৈরি সবচেয়ে পুরনো ও ব্যাপক ব্যবহৃত ফরম্যাট।

**গঠন — একটি "Shapefile" আসলে ৩-৬টি ফাইলের সমষ্টি:**

| ফাইল | কাজ | আবশ্যক? |
|---|---|---|
| `.shp` | জিওমেট্রি (আকৃতি) | ✅ হ্যাঁ |
| `.shx` | জিওমেট্রির Index | ✅ হ্যাঁ |
| `.dbf` | Attribute Table (dBase) | ✅ হ্যাঁ |
| `.prj` | CRS তথ্য | ⚠️ অবশ্যই দরকার |
| `.cpg` | Character Encoding | ঐচ্ছিক |
| `.sbn/.sbx` | Spatial Index | ঐচ্ছিক |

> ⚠️ **Shapefile এর সমস্যা:**
> - Column নামে সর্বোচ্চ **১০ অক্ষর** — `Rice_Yield_Ton_Per_Hectare` লিখতে পারবেন না!
> - সর্বোচ্চ ফাইল সাইজ **2 GB**
> - একটি "ফাইল" আসলে ৩-৬টি ফাইল — একটি হারালে সব নষ্ট

## ২. GeoPackage (.gpkg) — আধুনিক প্রতিস্থাপন 🏆

**OGC (Open Geospatial Consortium)** এর তৈরি আধুনিক মানক:

- ✅ **একটি মাত্র ফাইল** — `.gpkg`
- ✅ কোন নামের দৈর্ঘ্য সীমাবদ্ধতা নেই
- ✅ ফাইল সাইজ সীমা নেই
- ✅ একটি ফাইলে **একাধিক Layer** রাখা যায়
- ✅ SQLite ডাটাবেজ ভিত্তিক — দ্রুত
- ✅ Raster ডেটাও রাখা যায়

> 🏆 **সুপারিশ:** নতুন প্রকল্পে সবসময় **GeoPackage** ব্যবহার করুন। Shapefile শুধু পুরনো ডেটা পড়ার জন্য ব্যবহার করুন।

## ৩. GeoJSON (.geojson) — ওয়েব ও API এর জন্য

```json
{
  "type": "Feature",
  "properties": { "district": "Mymensingh", "yield": 4.2 },
  "geometry": {
    "type": "Point",
    "coordinates": [90.4440, 24.7256]
  }
}
```

- ✅ মানুষ পড়তে পারে (Human-readable JSON)
- ✅ Web API ও JavaScript ম্যাপে (Leaflet, Mapbox) চমৎকার
- ❌ বড় ডেটাসেটে ধীর (টেক্সট ফরম্যাট)
- ❌ শুধু WGS84 (EPSG:4326) সাপোর্ট করে

## ফরম্যাট তুলনা সারণি

| বৈশিষ্ট্য | Shapefile | GeoPackage | GeoJSON |
|---|---|---|---|
| ফাইল সংখ্যা | ৩-৬ | ১ | ১ |
| সাইজ লিমিট | 2 GB | ∞ | ∞ (ধীর) |
| Column নাম | ১০ অক্ষর | ∞ | ∞ |
| একাধিক Layer | ❌ | ✅ | ❌ |
| ওয়েবে ব্যবহার | ❌ | ❌ | ✅ |
| সুপারিশ | ⛔ Legacy | 🏆 Desktop | 🌐 Web |

## সারসংক্ষেপ
1. **Shapefile** পুরনো — ১০ অক্ষর ও 2GB সীমা আছে
2. **GeoPackage** আধুনিক, একটি ফাইলে সব — নতুন কাজে এটি ব্যবহার করুন
3. **GeoJSON** ওয়েব অ্যাপে দারুণ কিন্তু বড় ডেটাসেটে ধীর
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'Shapefile ফরম্যাটের সবচেয়ে বড় সীমাবদ্ধতা কোনটি?', '["Column নামে সর্বোচ্চ ১০ অক্ষর এবং ২ GB ফাইল সাইজ সীমা", "শুধু Point ডেটা রাখা যায়", "CRS সাপোর্ট করে না", "বিনামূল্যে নয়"]'::jsonb, 0),
    (l_id, 'নতুন GIS প্রকল্পে কোন ফাইল ফরম্যাট সবচেয়ে সুপারিশকৃত?', '["GeoPackage (.gpkg)", "Shapefile (.shp)", "CSV", "PDF"]'::jsonb, 0),
    (l_id, 'GeoJSON কোন CRS এ ডেটা সংরক্ষণ করে?', '["WGS84 (EPSG:4326)", "UTM Zone 46N", "Web Mercator", "যেকোনো CRS"]'::jsonb, 0);


  -- ================================================================================================
  -- MODULE 4: RASTER DATA MODEL
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 4: Raster Data Model — Pixels, Grids & Satellite Imagery', 'mod4-raster-data-model', 4,
    'রাস্টার ডেটার ভিত্তি — পিক্সেল, রেজোলিউশন, ব্যান্ড, DEM এবং স্যাটেলাইট ইমেজারির পরিচিতি।')
  RETURNING id INTO m4_id;

  -- M4-L1: What is Raster?
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id,
    '1. Raster ডেটা কী? পিক্সেল ও গ্রিডের জগৎ', 'raster-data-basics', 1,
  $markdown$
# Lesson 1: Raster ডেটা — পিক্সেল ও গ্রিডের জগৎ

Vector ডেটা যেখানে বিচ্ছিন্ন বস্তু (পয়েন্ট, লাইন, পলিগন) মডেল করে, **Raster ডেটা** ক্রমাগত (Continuous) ক্ষেত্র মডেল করে — যেমন তাপমাত্রা, বৃষ্টিপাত, উচ্চতা, বা স্যাটেলাইট ছবি।

## Raster = সমান আকারের পিক্সেলের গ্রিড

একটি Raster ফাইলকে ভাবুন একটি **ডিজিটাল ছবি** হিসেবে:
- প্রতিটি **Pixel (Cell)** একটি মান ধারণ করে (সংখ্যা)
- সব পিক্সেল **সমান আকারের** (যেমন 10m × 10m)
- পিক্সেলগুলো একটি নিয়মিত **গ্রিড** প্যাটার্নে সাজানো

## রেজোলিউশন (Spatial Resolution)

**রেজোলিউশন** = একটি পিক্সেল ভূপৃষ্ঠের কত বর্গমিটার এলাকা প্রতিনিধিত্ব করে।

| স্যাটেলাইট | রেজোলিউশন | এক পিক্সেল = | উদাহরণ |
|---|---|---|---|
| **Sentinel-2** | 10m | 10m × 10m | ফসল মনিটরিং |
| **Landsat 8/9** | 30m | 30m × 30m | ভূমি আচ্ছাদন |
| **MODIS** | 250m - 1km | 250m × 250m | জাতীয় পর্যায়ে NDVI |
| **Planet** | 3m | 3m × 3m | স্বতন্ত্র গাছ চিহ্নিতকরণ |

> 💡 **ট্রেড-অফ:** রেজোলিউশন যত ভালো (ছোট পিক্সেল), ফাইল সাইজ তত **বিশাল** এবং প্রসেসিং তত ধীর!

## ব্যান্ড (Spectral Bands)

স্যাটেলাইট ইমেজ শুধু "ছবি" নয় — এগুলো **বিভিন্ন তরঙ্গদৈর্ঘ্যে** (Wavelength) পৃথিবীর প্রতিফলন রেকর্ড করে:

| ব্যান্ড | তরঙ্গদৈর্ঘ্য | কী দেখা যায়? |
|---|---|---|
| **Blue (B2)** | ~490 nm | পানি, বায়ুমণ্ডল |
| **Green (B3)** | ~560 nm | সবুজ গাছপালা |
| **Red (B4)** | ~665 nm | ক্লোরোফিল শোষণ |
| **NIR (B8)** | ~842 nm | 🌱 **উদ্ভিদের স্বাস্থ্য** — সুস্থ গাছ NIR বেশি প্রতিফলন করে |
| **SWIR (B11)** | ~1610 nm | মাটির আর্দ্রতা, খনিজ |

> 🌾 **কৃষি গবেষকদের জন্য:** **NIR (Near-Infrared)** ব্যান্ড সবচেয়ে গুরুত্বপূর্ণ! সুস্থ ফসল NIR বেশি প্রতিফলন করে, অসুস্থ বা শুকনো ফসল কম প্রতিফলন করে। এটিই NDVI গণনার ভিত্তি।

## Vector vs Raster তুলনা

| বৈশিষ্ট্য | Vector | Raster |
|---|---|---|
| **প্রতিনিধিত্ব** | বিচ্ছিন্ন বস্তু (সীমানা, পয়েন্ট) | ক্রমাগত ক্ষেত্র (তাপমাত্রা, উচ্চতা) |
| **ডেটা সাইজ** | ছোট (শুধু Coordinate) | বড় (প্রতিটি পিক্সেলে মান) |
| **বিশ্লেষণ** | Overlay, Query, Network | Band Math, Classification, Terrain |
| **সফটওয়্যার** | QGIS, GeoPandas | QGIS, Rasterio, GEE |
| **উদাহরণ** | জেলার সীমানা | স্যাটেলাইট ইমেজ, DEM |

## সারসংক্ষেপ
1. Raster = পিক্সেলের গ্রিড, প্রতিটি পিক্সেলে একটি সংখ্যা
2. রেজোলিউশন নির্ধারণ করে একটি পিক্সেল কত বড়
3. স্যাটেলাইট ইমেজে একাধিক ব্যান্ড থাকে — NIR ব্যান্ড কৃষিতে সবচেয়ে গুরুত্বপূর্ণ
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'Sentinel-2 স্যাটেলাইটের সবচেয়ে ভালো (Fine) রেজোলিউশন কত?', '["10 মিটার", "30 মিটার", "1 কিলোমিটার", "3 মিটার"]'::jsonb, 0),
    (l_id, 'সুস্থ ফসল কোন ব্যান্ডে সবচেয়ে বেশি প্রতিফলন করে?', '["NIR (Near-Infrared)", "Blue", "Red", "SWIR"]'::jsonb, 0),
    (l_id, 'Raster ডেটা কোন ধরনের ঘটনা মডেল করতে সবচেয়ে উপযুক্ত?', '["ক্রমাগত/Continuous ক্ষেত্র (তাপমাত্রা, উচ্চতা)", "বিচ্ছিন্ন বস্তু (রাস্তা, ভবন)", "টেক্সট ডকুমেন্ট", "ভিডিও ফাইল"]'::jsonb, 0);


  -- M4-L2: DEM & Common Raster Formats
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id,
    '2. DEM ও রাস্টার ফাইল ফরম্যাট', 'dem-raster-formats', 2,
  $markdown$
# Lesson 2: DEM ও রাস্টার ফাইল ফরম্যাট

## DEM (Digital Elevation Model) — ভূপৃষ্ঠের ত্রিমাত্রিক মডেল

DEM হলো এমন একটি Raster যেখানে প্রতিটি পিক্সেলের মান = সমুদ্রপৃষ্ঠ থেকে **উচ্চতা (মিটারে)**।

**ব্যবহার:**
- 🌊 বন্যা মডেলিং — কোন এলাকা আগে তলিয়ে যাবে?
- ⛰️ Slope (ঢাল) ও Aspect (মুখ) গণনা — পাহাড়ি কৃষির জন্য অপরিহার্য
- 🌊 Watershed (জলবিভাজিকা) সীমানা নির্ধারণ
- 🛤️ রাস্তা ও সেচ খাল পরিকল্পনা

**জনপ্রিয় DEM ডেটাসেট:**

| নাম | রেজোলিউশন | কভারেজ | বিনামূল্যে? |
|---|---|---|---|
| **SRTM** | 30m | বৈশ্বিক (60°N-56°S) | ✅ |
| **ASTER GDEM** | 30m | বৈশ্বিক | ✅ |
| **ALOS PALSAR** | 12.5m | বৈশ্বিক | ✅ |
| **FABDEM** | 30m | বিল্ডিং ও বন সরানো DEM | ✅ |

> 🌊 **বাংলাদেশের জন্য বিশেষ গুরুত্ব:** বাংলাদেশ বিশ্বের অন্যতম সমতল দেশ — বেশিরভাগ এলাকা সমুদ্রপৃষ্ঠ থেকে মাত্র ৫-১০ মিটার উঁচু। DEM ছাড়া বন্যা ঝুঁকি মূল্যায়ন অসম্ভব!

## রাস্টার ফাইল ফরম্যাট

| ফরম্যাট | এক্সটেনশন | বিশেষত্ব |
|---|---|---|
| **GeoTIFF** | `.tif` | 🏆 সবচেয়ে জনপ্রিয়, CRS তথ্য ফাইলের মধ্যে |
| **COG** | `.tif` | Cloud-Optimized GeoTIFF — ক্লাউডে দ্রুত |
| **NetCDF** | `.nc` | জলবায়ু ও সময় সিরিজ ডেটা |
| **JPEG2000** | `.jp2` | Sentinel-2 র ডিফল্ট |
| **IMG** | `.img` | ERDAS Imagine ফরম্যাট |

> 🏆 **সুপারিশ:** সব সময় **GeoTIFF (.tif)** ব্যবহার করুন। এটি সর্বজনীনভাবে সাপোর্টেড এবং CRS তথ্য ফাইলের মধ্যেই সংরক্ষণ করে।

## NoData — অনুপস্থিত মানের ধারণা

Raster এ কিছু পিক্সেলে ডেটা নাও থাকতে পারে (মেঘের ছায়া, সেন্সর ত্রুটি)। এগুলোকে **NoData** বলে:
- সাধারণত `-9999` বা `NaN` দিয়ে চিহ্নিত করা হয়
- বিশ্লেষণে এই মানগুলো **বাদ** দিতে হয়

## সারসংক্ষেপ
1. DEM = প্রতিটি পিক্সেলে ভূমির উচ্চতা (মিটার)
2. GeoTIFF হলো সবচেয়ে জনপ্রিয় রাস্টার ফরম্যাট
3. NoData মান (-9999) বিশ্লেষণে অবশ্যই handle করতে হবে
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'DEM এর প্রতিটি পিক্সেলে কোন তথ্য সংরক্ষিত থাকে?', '["সমুদ্রপৃষ্ঠ থেকে উচ্চতা (মিটারে)", "রঙের মান (RGB)", "তাপমাত্রা", "বৃষ্টিপাত"]'::jsonb, 0),
    (l_id, 'GIS এ সবচেয়ে সুপারিশকৃত Raster ফরম্যাট কোনটি?', '["GeoTIFF (.tif)", "JPEG (.jpg)", "PNG (.png)", "BMP (.bmp)"]'::jsonb, 0),
    (l_id, 'Raster ডেটায় NoData মান (-9999) কী নির্দেশ করে?', '["সেই পিক্সেলে কোন তথ্য নেই বা অবৈধ", "সমুদ্রপৃষ্ঠ", "সর্বোচ্চ উচ্চতা", "শূন্য মান"]'::jsonb, 0);


  -- ================================================================================================
  -- MODULE 5: INTRODUCTION TO QGIS
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 5: QGIS পরিচিতি — ইন্সটলেশন ও ইন্টারফেস', 'mod5-qgis-introduction', 5,
    'QGIS ইন্সটল করুন এবং এর ইন্টারফেস, প্যানেল, টুলবার ও Layer ব্যবস্থাপনা শিখুন।')
  RETURNING id INTO m5_id;

  -- M5-L1: QGIS Installation
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m5_id,
    '1. QGIS ইন্সটলেশন ও প্রথম পরিচয়', 'qgis-installation', 1,
  $markdown$
# Lesson 1: QGIS ইন্সটলেশন ও প্রথম পরিচয়

এখন আমরা হাতে কলমে কাজ শুরু করবো! আমাদের প্রথম কাজ হলো QGIS ইন্সটল করা।

## QGIS ডাউনলোড

1. ব্রাউজারে যান: **https://qgis.org/download/**
2. আপনার অপারেটিং সিস্টেম অনুযায়ী ডাউনলোড করুন:
   - **Windows:** `.msi` ইন্সটলার
   - **Mac:** `.dmg` ফাইল
   - **Linux:** `apt-get install qgis`

> 💡 **দুটি ভার্সন আছে:**
> - **LTR (Long Term Release):** সবচেয়ে স্থিতিশীল — **এটি ডাউনলোড করুন**
> - **Latest:** নতুন ফিচার আছে, কিন্তু কিছু বাগ থাকতে পারে

## QGIS ইন্টারফেস পরিচিতি

QGIS খুললে আপনি দেখবেন:

### ১. Menu Bar (মেনু বার)
সবার উপরে — Project, Edit, View, Layer, Processing ইত্যাদি মেনু

### ২. Toolbar (টুলবার)
মেনু বারের নিচে — Zoom, Pan, Select, Measure ইত্যাদি আইকন

### ৩. Layer Panel (বাম পাশে)
আপনার সব Layer এর তালিকা। এখানে:
- ✅ টিক চিহ্ন দিয়ে Layer দেখানো/লুকানো
- 🔼🔽 Layer এর ক্রম পরিবর্তন (উপরের Layer সামনে দেখায়)
- 🎨 Layer এ ডাবল ক্লিক করে Symbology বদলানো

### ৪. Map Canvas (মূল এলাকা)
মাঝখানে সবচেয়ে বড় অংশ — আপনার মানচিত্র এখানে দেখা যায়

### ৫. Status Bar (নিচে)
বর্তমান Coordinate, Scale, CRS দেখায়

## প্রথম কাজ: একটি Basemap যোগ করা

QGIS এ Google Satellite বা OpenStreetMap basemap যোগ করতে:

1. **Browser Panel** এ যান (বাম পাশে)
2. **XYZ Tiles** এ ক্লিক করুন
3. **OpenStreetMap** এ ডাবল ক্লিক করুন

🎉 আপনার প্রথম ম্যাপ লোড হলো! এখন Zoom এবং Pan ব্যবহার করে বাংলাদেশ খুঁজুন।

## প্রয়োজনীয় কীবোর্ড শর্টকাট

| শর্টকাট | কাজ |
|---|---|
| `Scroll Wheel` | Zoom In/Out |
| `Space + Drag` | Pan (ম্যাপ সরানো) |
| `Ctrl+Shift+F` | Full Extent (পুরো ম্যাপ দেখুন) |
| `V` | Select Features |
| `Ctrl+S` | Project Save |

## সারসংক্ষেপ
1. QGIS LTR ভার্সন ডাউনলোড ও ইন্সটল করুন
2. ইন্টারফেসের ৫টি মূল অংশ চিনুন
3. OpenStreetMap basemap যোগ করে প্রথম ম্যাপ দেখুন
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'QGIS এর কোন ভার্সনটি সবচেয়ে স্থিতিশীল ও সুপারিশকৃত?', '["LTR (Long Term Release)", "Latest/Nightly Build", "Beta Version", "Alpha Version"]'::jsonb, 0),
    (l_id, 'QGIS এ Layer Panel এর কাজ কী?', '["সব Layer এর তালিকা দেখানো, দৃশ্যমানতা ও ক্রম নিয়ন্ত্রণ", "কোড লেখা", "ইন্টারনেট ব্রাউজ করা", "ভিডিও দেখা"]'::jsonb, 0),
    (l_id, 'QGIS এ OpenStreetMap basemap কোথা থেকে যোগ করা যায়?', '["Browser Panel → XYZ Tiles", "File → Open", "Layer → Add CSV", "Settings → Options"]'::jsonb, 0);


  -- M5-L2: Loading & Managing Data
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m5_id,
    '2. QGIS এ ডেটা লোড ও ব্যবস্থাপনা', 'qgis-data-loading', 2,
  $markdown$
# Lesson 2: QGIS এ ডেটা লোড ও ব্যবস্থাপনা

এখন আমরা শিখবো কিভাবে QGIS এ বিভিন্ন ধরনের ডেটা লোড করতে হয়।

## ভেক্টর ডেটা লোড করা

**Method 1: Drag & Drop**
সবচেয়ে সহজ! ফাইল ম্যানেজার থেকে `.shp`, `.gpkg`, বা `.geojson` ফাইল সরাসরি **QGIS Map Canvas** এ টেনে ছেড়ে দিন।

**Method 2: Menu**
Layer → Add Layer → Add Vector Layer → ফাইল সিলেক্ট করুন

## রাস্টার ডেটা লোড করা

Layer → Add Layer → Add Raster Layer → `.tif` ফাইল সিলেক্ট

## CSV/Excel ডেটা লোড করা (Lat/Lon সহ)

1. Layer → Add Layer → **Add Delimited Text Layer**
2. CSV ফাইল সিলেক্ট করুন
3. **X field** = Longitude Column
4. **Y field** = Latitude Column
5. **CRS** = EPSG:4326
6. **Add** ক্লিক করুন

> 💡 আপনার এক্সেল ডেটায় যদি Latitude ও Longitude কলাম থাকে, এই পদ্ধতিতে সেটিকে সরাসরি **Point ম্যাপে** রূপান্তর করতে পারেন!

## Layer ব্যবস্থাপনা

### Layer এর ক্রম
Layer Panel এ **উপরের Layer সামনে দেখায়**। তাই:
- Basemap সবার নিচে রাখুন
- Point Layer সবার উপরে রাখুন
- Polygon Layer মাঝখানে রাখুন

### Layer Properties
যেকোনো Layer এ **Right Click → Properties** করলে পাবেন:
- **Information:** CRS, ফিচার সংখ্যা, ফাইল পাথ
- **Source:** ডেটা উৎস বদলানো
- **Symbology:** রঙ ও স্টাইল বদলানো
- **Labels:** ফিচারের নামের লেবেল দেখানো

## Attribute Table খোলা

Layer এ **Right Click → Open Attribute Table** (বা `F6`)

এখানে আপনি:
- ডেটা দেখতে পারবেন
- Sort (সাজানো) করতে পারবেন
- Filter (ফিল্টার) করতে পারবেন
- Select (নির্বাচন) করতে পারবেন

## সারসংক্ষেপ
1. Vector, Raster, এবং CSV — তিন ধরনের ডেটাই QGIS এ লোড করা যায়
2. Layer এর ক্রম গুরুত্বপূর্ণ — উপরের Layer সামনে দেখায়
3. Attribute Table দিয়ে ডেটা দেখা, ফিল্টার ও সিলেক্ট করা যায়
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'CSV ফাইল থেকে Point ম্যাপ তৈরি করতে কোন ফিল্ড দুটি নির্ধারণ করতে হয়?', '["X = Longitude, Y = Latitude", "X = ID, Y = Name", "X = Area, Y = Population", "X = Date, Y = Time"]'::jsonb, 0),
    (l_id, 'QGIS এ কোন Layer সামনে দেখায়?', '["Layer Panel এ যেটি উপরে আছে", "যেটি সবচেয়ে পুরনো", "যেটি সবচেয়ে বড়", "যেটি সবচেয়ে ছোট"]'::jsonb, 0);


  -- ================================================================================================
  -- MODULE 6: BASIC MAP STYLING & SYMBOLOGY
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 6: Map Styling ও Symbology', 'mod6-map-styling', 6,
    'ম্যাপকে অর্থবহ ও সুন্দর করুন — Graduated, Categorized, Rule-Based Symbology শিখুন।')
  RETURNING id INTO m6_id;

  -- M6-L1: Symbology Basics
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m6_id,
    '1. Symbology: ম্যাপকে অর্থবহ করা', 'symbology-basics', 1,
  $markdown$
# Lesson 1: Symbology — ম্যাপকে অর্থবহ করা

এখন পর্যন্ত আমরা শিখেছি ডেটা লোড করতে। কিন্তু ডেটা লোড করলে সব ফিচার একই রঙে দেখায় — কিছু বোঝা যায় না! **Symbology** হলো ডেটাকে রঙ, আকার ও প্যাটার্ন দিয়ে **দৃশ্যমান ও অর্থবহ** করার শিল্প।

## ৪ ধরনের Symbology

### ১. Single Symbol (একক প্রতীক)
সব ফিচার **একই রঙ ও আকারে** দেখায়। শুধু ফিচারের অবস্থান দেখাতে ব্যবহৃত হয়।

### ২. Categorized (শ্রেণিভুক্ত) 🏷️
একটি **Text/Category** Attribute অনুযায়ী ফিচারকে আলাদা রঙে দেখায়।

**উদাহরণ:** `Land_Use` কলাম অনুযায়ী:
- 🟢 **Agricultural** → সবুজ
- 🔵 **Water** → নীল
- 🟤 **Urban** → বাদামী
- 🟡 **Barren** → হলুদ

### ৩. Graduated (ক্রমায়িত) 📊
একটি **সংখ্যা** Attribute অনুযায়ী ফিচারকে রঙের গ্র্যাডিয়েন্টে দেখায়।

**উদাহরণ:** `Rice_Yield` কলাম অনুযায়ী:
- 🟢 গাঢ় সবুজ = উচ্চ ফলন (> 5 টন/হেক্টর)
- 🟡 হলুদ = মাঝারি ফলন (3-5)
- 🔴 লাল = নিম্ন ফলন (< 3)

এটিকে **Choropleth Map** বলে — কৃষি গবেষণায় সবচেয়ে বেশি ব্যবহৃত!

### ৪. Rule-Based (নিয়ম ভিত্তিক)
নিজের শর্ত (Expression) দিয়ে কাস্টম রঙ নির্ধারণ।

**উদাহরণ:**
```
"Population" > 5000000 AND "Rice_Yield" < 3 → লাল (ঝুঁকিপূর্ণ)
"Rice_Yield" > 5 → গাঢ় সবুজ (ভালো)
```

## QGIS এ Symbology প্রয়োগ (Step-by-Step)

1. Layer এ **ডাবল ক্লিক** করুন (বা Right Click → Properties)
2. বাম পাশে **Symbology** ট্যাব ক্লিক করুন
3. উপরের ড্রপডাউন থেকে `Graduated` সিলেক্ট করুন
4. **Column** এ `Rice_Yield` সিলেক্ট করুন
5. **Color Ramp** থেকে `RdYlGn` (লাল-হলুদ-সবুজ) সিলেক্ট করুন
6. **Classify** বাটন ক্লিক করুন
7. **OK** চাপুন — আপনার Choropleth Map তৈরি!

## সারসংক্ষেপ
1. **Symbology** ম্যাপকে তথ্যপূর্ণ ও দৃশ্যত আকর্ষণীয় করে
2. **Categorized** → টেক্সট ক্যাটাগরি অনুযায়ী আলাদা রঙ
3. **Graduated** → সংখ্যা অনুযায়ী রঙের গ্র্যাডিয়েন্ট (Choropleth)
4. **Rule-Based** → কাস্টম শর্ত দিয়ে নিজের নিয়ম তৈরি
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'জেলাভিত্তিক ধান উৎপাদনের মানচিত্র তৈরি করতে কোন Symbology ব্যবহার করবেন?', '["Graduated (ক্রমায়িত)", "Single Symbol", "Heatmap", "No Symbology"]'::jsonb, 0),
    (l_id, 'Categorized Symbology কোন ধরনের Attribute দিয়ে কাজ করে?', '["Text/Category ভিত্তিক (যেমন Land_Use)", "শুধু সংখ্যা ভিত্তিক", "শুধু তারিখ ভিত্তিক", "কোন Attribute লাগে না"]'::jsonb, 0),
    (l_id, 'Choropleth Map কী?', '["Graduated রঙ দিয়ে সংখ্যাগত ডেটা দেখানো এলাকা-ভিত্তিক মানচিত্র", "স্যাটেলাইট ছবি", "রাস্তার মানচিত্র", "টপোগ্রাফিক ম্যাপ"]'::jsonb, 0);


  -- M6-L2: Labels & Annotations
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m6_id,
    '2. Labels ও Annotations: ম্যাপে তথ্য লেখা', 'labels-annotations', 2,
  $markdown$
# Lesson 2: Labels ও Annotations

ম্যাপে রঙ দিয়ে তথ্য দেখানোর পাশাপাশি, ফিচারের উপরে **নাম বা মান লেখা** অত্যন্ত গুরুত্বপূর্ণ — একে বলে **Labeling**।

## QGIS এ Label যোগ করা

1. Layer Properties → **Labels** ট্যাব
2. উপরে `No Labels` থেকে **Single Labels** সিলেক্ট করুন
3. **Value** ড্রপডাউনে কোন Column এর মান দেখাতে চান সেটি সিলেক্ট করুন (যেমন `District`)

## Label Formatting Tips

| সেটিং | সুপারিশ |
|---|---|
| **Font** | Noto Sans Bengali (বাংলায়) বা Arial |
| **Size** | ৮-১২ pt (জুম লেভেলে তারতম্য) |
| **Color** | ব্যাকগ্রাউন্ডের বিপরীত রঙ |
| **Buffer** | ✅ চালু করুন — হালকা সাদা আউটলাইন দেয়, পড়তে সহজ |
| **Placement** | Polygon = Horizontal, Line = Curved, Point = Offset |

## Expression Based Labels

শুধু Column নাম নয়, **Expression** লিখে Label কাস্টমাইজ করতে পারেন:

```
-- জেলার নাম + ফলন একসাথে দেখাতে
"District" || '\n' || round("Rice_Yield", 1) || ' t/ha'
```

**ফলাফল:** 
```
Mymensingh
4.2 t/ha
```

## Annotations — স্থায়ী নোট

Label ছাড়াও ম্যাপের নির্দিষ্ট জায়গায় **হাতে লেখা নোট** (Annotation) যোগ করতে পারেন:
- **Text Annotation:** ম্যাপে টেক্সট বক্স
- **HTML Annotation:** ফরম্যাটেড টেক্সট
- **Form Annotation:** ফিচারের Attribute দেখানো পপআপ

## সারসংক্ষেপ
1. **Label** = Attribute Column এর মান ফিচারের উপরে দেখানো
2. **Buffer** চালু করুন — পড়তে সহজ হয়
3. **Expression** দিয়ে একাধিক Column একসাথে Label এ দেখাতে পারেন
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'QGIS এ Label এ Buffer চালু করার সুবিধা কী?', '["Label এর চারপাশে হালকা আউটলাইন দেয়, পড়তে সহজ হয়", "ম্যাপ দ্রুত লোড হয়", "ফাইল সাইজ কমে", "CRS বদলায়"]'::jsonb, 0),
    (l_id, 'একটি Label এ একাধিক Attribute Column দেখাতে কী ব্যবহার করতে হয়?', '["Expression (যেমন \"District\" || \" \" || \"Yield\")", "শুধু একটি Column সিলেক্ট করলেই হয়", "Photoshop", "Excel Formula"]'::jsonb, 0);


  -- ================================================================================================
  -- MODULE 7: CARTOGRAPHY ESSENTIALS
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 7: কার্টোগ্রাফি — প্রকাশনা-যোগ্য মানচিত্র তৈরি', 'mod7-cartography', 7,
    'প্রফেশনাল মানচিত্র তৈরির শিল্প — Layout, Scale Bar, Legend, North Arrow ও PDF Export।')
  RETURNING id INTO m7_id;

  -- M7-L1: Print Layout Basics
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m7_id,
    '1. QGIS Print Layout: প্রকাশনা-মানের মানচিত্র', 'print-layout-basics', 1,
  $markdown$
# Lesson 1: QGIS Print Layout — প্রকাশনা-মানের মানচিত্র

আপনার বিশ্লেষণ শেষ, ম্যাপও সুন্দর দেখাচ্ছে। এখন এটিকে একটি **প্রকাশনা-যোগ্য (Publication-Ready)** মানচিত্রে রূপান্তর করতে হবে — থিসিস, জার্নাল পেপার, বা রিপোর্টের জন্য।

## প্রকাশনা-মানের মানচিত্রের ৬টি আবশ্যক উপাদান

| উপাদান | বর্ণনা |
|---|---|
| 📍 **Title** | স্পষ্ট শিরোনাম |
| 📏 **Scale Bar** | দূরত্ব বোঝার জন্য (km/m) |
| 🧭 **North Arrow** | দিক নির্দেশনা |
| 🗺️ **Legend** | রঙ ও প্রতীকের ব্যাখ্যা |
| 📋 **Source/Attribution** | ডেটা উৎস, CRS, তারিখ |
| 🔍 **Inset/Overview Map** | বৃহৎ প্রেক্ষাপটে অবস্থান দেখানো |

## QGIS Print Layout তৈরি (Step-by-Step)

### ধাপ ১: নতুন Layout তৈরি
**Project → New Print Layout** → একটি নাম দিন (যেমন "Soil_pH_Map")

### ধাপ ২: Map Item যোগ
**Add Item → Add Map** → ক্যানভাসে ড্র্যাগ করে আয়তক্ষেত্র আঁকুন

### ধাপ ৩: Scale & Extent ফিক্স করুন
- **Item Properties → Scale:** 1:500000 (বাংলাদেশের জেলা ম্যাপের জন্য উপযুক্ত)
- **Lock layers and styles:** ✅ টিক দিন (গুরুত্বপূর্ণ!)

### ধাপ ৪: অন্যান্য উপাদান যোগ
- **Add Item → Add Scale Bar** → মিটার/কিলোমিটার ইউনিট সেট করুন
- **Add Item → Add North Arrow** → একটি স্টাইল বেছে নিন
- **Add Item → Add Legend** → অপ্রয়োজনীয় Layer বাদ দিন
- **Add Item → Add Label** → Title ও Attribution টেক্সট লিখুন

### ধাপ ৫: Export
- **Layout → Export as PDF** → 300 DPI সেট করুন (জার্নাল মানের জন্য)
- **Layout → Export as Image** → PNG বা TIFF ফরম্যাট

> ⚠️ **সাবধান:** জার্নাল পেপারে জমা দেওয়ার আগে অবশ্যই **300 DPI** বা তার বেশি রেজোলিউশনে Export করুন। ডিফল্ট 96 DPI প্রিন্টে ঝাপসা দেখায়!

## সারসংক্ষেপ
1. Print Layout দিয়ে প্রকাশনা-মানের PDF/PNG মানচিত্র তৈরি করুন
2. **৬টি আবশ্যক উপাদান** অবশ্যই থাকতে হবে
3. জার্নালের জন্য **300 DPI** তে Export করুন
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'প্রকাশনা-মানের মানচিত্রে নিচের কোনটি আবশ্যক নয়?', '["সফটওয়্যার লাইসেন্স নম্বর", "Scale Bar", "Legend", "North Arrow"]'::jsonb, 0),
    (l_id, 'জার্নাল পেপারে জমা দেওয়ার জন্য মানচিত্র কত DPI তে Export করা উচিত?', '["300 DPI বা তার বেশি", "72 DPI", "96 DPI", "50 DPI"]'::jsonb, 0),
    (l_id, 'Print Layout এ Lock layers and styles কেন চালু করা উচিত?', '["মূল QGIS উইন্ডোতে Layer পরিবর্তন করলেও Layout এর ম্যাপ অপরিবর্তিত থাকে", "ম্যাপ দ্রুত লোড হয়", "ফাইল Password প্রটেক্ট হয়", "ইন্টারনেট সংযোগ লাগে না"]'::jsonb, 0);


  -- ================================================================================================
  -- MODULE 8: MINI-PROJECT — YOUR FIRST AGRICULTURAL MAP
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 8: ক্যাপস্টোন প্রজেক্ট — প্রথম কৃষি মানচিত্র', 'mod8-capstone-first-map', 8,
    'সব শেখা জ্ঞান প্রয়োগ করে বাংলাদেশের একটি পূর্ণাঙ্গ কৃষি মানচিত্র তৈরি করুন।')
  RETURNING id INTO m8_id;

  -- M8-L1: Capstone Project Brief
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m8_id,
    '1. ক্যাপস্টোন প্রজেক্ট: বাংলাদেশের জেলাভিত্তিক ধান উৎপাদন মানচিত্র', 'capstone-rice-map', 1,
  $markdown$
# 🎓 ক্যাপস্টোন প্রজেক্ট: বাংলাদেশের জেলাভিত্তিক ধান উৎপাদন মানচিত্র

অভিনন্দন! আপনি Course 1 এর শেষ প্রান্তে এসেছেন। এখন আমরা পুরো কোর্সে শেখা সবকিছু একত্রে প্রয়োগ করে একটি পূর্ণাঙ্গ **প্রকাশনা-মানের Choropleth Map** তৈরি করবো।

## 🎯 প্রজেক্ট লক্ষ্য

**বাংলাদেশের ৬৪ জেলার ধান উৎপাদন (টন/হেক্টর) Choropleth Map** তৈরি করা।

## 📂 প্রয়োজনীয় ডেটা

| ডেটা | উৎস | ফরম্যাট |
|---|---|---|
| বাংলাদেশের জেলা সীমানা | GADM / HDX | Shapefile / GeoPackage |
| জেলাভিত্তিক ধান উৎপাদন | BBS (বাংলাদেশ পরিসংখ্যান ব্যুরো) | CSV / Excel |

### ডেটা ডাউনলোড লিংক
1. **জেলা সীমানা:** https://gadm.org → Bangladesh → Level 2 (District)
2. **ধান উৎপাদন:** BBS কৃষি পরিসংখ্যান বার্ষিকী

## 📋 ধাপে ধাপে কর্মপরিকল্পনা

### ধাপ ১: QGIS প্রকল্প সেটআপ
- QGIS খুলুন → **Project → New**
- **Project CRS** সেট করুন: **EPSG:32646** (UTM Zone 46N)
- **Project → Save As:** `rice_production_map.qgz`

### ধাপ ২: জেলা সীমানা লোড
- GADM থেকে ডাউনলোড করা Shapefile লোড করুন
- Layer Properties → CRS চেক করুন (EPSG:4326 হবে)
- **Export → Save Features As** → CRS: **EPSG:32646** → নতুন GeoPackage এ সেভ করুন

### ধাপ ৩: ধান উৎপাদন CSV লোড ও Join
- CSV ফাইল ড্র্যাগ-ড্রপ করুন
- জেলা সীমানা Layer Properties → **Joins** ট্যাব
- **Add Join:** Target = District নাম Column, Input = CSV এর District নাম Column

### ধাপ ৪: Graduated Symbology প্রয়োগ
- Layer Properties → **Symbology** → Graduated
- Column: `Rice_Yield_ton_ha`
- Color Ramp: `RdYlGn` (লাল-হলুদ-সবুজ)
- Classes: **5** (Natural Breaks / Jenks)
- **Classify → OK**

### ধাপ ৫: Label যোগ
- Properties → **Labels** → Single Labels
- Value: Expression → `"NAME_2" || '\n' || round("Rice_Yield_ton_ha", 1) || ' t/ha'`
- Buffer: ✅ চালু

### ধাপ ৬: Print Layout ও Export
- **Project → New Print Layout** → "Rice Production Map"
- Map, Scale Bar, North Arrow, Legend, Title যোগ করুন
- **Export as PDF** → 300 DPI

## ✅ মূল্যায়ন মানদণ্ড

| মানদণ্ড | পয়েন্ট |
|---|---|
| সঠিক CRS (UTM Zone 46N) | ২০ |
| সঠিক Table Join | ২০ |
| Graduated Symbology (Choropleth) | ২০ |
| Labels (জেলার নাম + ফলন) | ১৫ |
| Print Layout (৬টি উপাদান) | ২০ |
| সামগ্রিক পরিচ্ছন্নতা | ৫ |

## 🎉 পরবর্তী ধাপ

Course 1 সম্পন্ন হলে আপনি **Course 2: GIS Analysis & Remote Sensing** এ যেতে পারেন, যেখানে শিখবেন:
- Geoprocessing (Buffer, Clip, Intersect)
- Remote Sensing ও NDVI
- Change Detection
- GPS ও Field Data Collection

> 💪 আপনি এখন **GIS Literate**! এই দক্ষতা দিয়ে আপনি থিসিসের জন্য মানচিত্র তৈরি, কৃষি গবেষণায় ডেটা ভিজ্যুয়ালাইজেশন, এবং যেকোনো স্পেশিয়াল ডেটা নিয়ে কাজ করতে পারবেন।
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'বাংলাদেশের জেলা ম্যাপের জন্য কোন Projected CRS ব্যবহার করা উচিত?', '["EPSG:32646 (UTM Zone 46N)", "EPSG:4326 (WGS84)", "EPSG:3857 (Web Mercator)", "EPSG:2154"]'::jsonb, 0),
    (l_id, 'CSV ডেটা Shapefile এ যোগ করতে কোন অপারেশন ব্যবহৃত হয়?', '["Table Join (একটি Common Column দিয়ে)", "Buffer", "Clip", "Dissolve"]'::jsonb, 0),
    (l_id, 'Choropleth Map এ Class ভাগ করার জন্য কোন পদ্ধতি সবচেয়ে ভালো?', '["Natural Breaks (Jenks)", "Equal Interval সবসময়", "Random", "বর্ণমালা ক্রমে"]'::jsonb, 0);


  -- M8-L2: Course Summary & Next Steps
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m8_id,
    '2. কোর্স সারসংক্ষেপ ও পরবর্তী পথ', 'course-summary-next', 2,
  $markdown$
# 🎓 Course 1 সারসংক্ষেপ: আপনি কী শিখলেন?

অভিনন্দন! আপনি **"Spatial Literacy & GIS Foundations"** কোর্সটি সফলভাবে সম্পন্ন করেছেন!

## আপনার অর্জিত দক্ষতা

| Module | মূল দক্ষতা |
|---|---|
| Module 1 | GIS কী, Spatial Thinking, GIS Ecosystem |
| Module 2 | Coordinate System, Projection, UTM, EPSG কোড |
| Module 3 | Vector ডেটা — Point, Line, Polygon, Attribute Table |
| Module 4 | Raster ডেটা — পিক্সেল, ব্যান্ড, DEM, NoData |
| Module 5 | QGIS — ইন্সটলেশন, ডেটা লোড, Layer ব্যবস্থাপনা |
| Module 6 | Symbology — Categorized, Graduated, Choropleth Map |
| Module 7 | Cartography — Print Layout, PDF Export |
| Module 8 | ক্যাপস্টোন — পূর্ণাঙ্গ ধান উৎপাদন মানচিত্র |

## পরবর্তী কোর্স: GIS Analysis & Remote Sensing

**Course 2** এ আপনি শিখবেন:

1. 🔧 **Geoprocessing:** Buffer, Clip, Intersect, Union, Dissolve
2. ⛰️ **Terrain Analysis:** Slope, Aspect, Hillshade, Watershed
3. 🛰️ **Remote Sensing:** EM Spectrum, Spectral Signatures
4. 🌱 **NDVI:** ফসল স্বাস্থ্য মনিটরিং
5. 🗺️ **Land Cover Classification:** Supervised ও Unsupervised
6. 📱 **Field Data:** GPS, KoboToolbox
7. 🌊 **Capstone:** বাংলাদেশ হাওর অঞ্চলে বন্যার প্রভাব মূল্যায়ন

> 🚀 **Ready?** Course 2 শুরু করুন এবং একজন **GIS Analyst** এর দিকে আপনার যাত্রা অব্যাহত রাখুন!
$markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES
    (l_id, 'Course 1 এ আমরা মূলত কোন GIS সফটওয়্যার ব্যবহার করেছি?', '["QGIS", "ArcGIS Pro", "Google Earth Engine", "ERDAS Imagine"]'::jsonb, 0),
    (l_id, 'GIS Foundations কোর্সের পরে পরবর্তী ধাপ কী?', '["GIS Analysis & Remote Sensing (Course 2)", "সরাসরি PhD গবেষণা", "কোন কিছু শেখার দরকার নেই", "শুধু Excel ব্যবহার"]'::jsonb, 0);


END $$;
