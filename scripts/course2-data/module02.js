// =============================================================================
// MODULE 02: VECTOR GEOPROCESSING TOOLKIT
// Course 2: Applied GIS Analysis & Remote Sensing
// =============================================================================

module.exports = {
  title: 'Module 02: Vector Geoprocessing Toolkit',
  slug: 'mod-02-vector-geoprocessing-toolkit',
  order_index: 2,
  description: 'Vector ডেটার উপর মূল Geoprocessing অপারেশনগুলো — Buffer, Clip, Erase, Intersect, Union, Dissolve, Merge — গভীরভাবে শিখুন। প্রতিটি অপারেশনের গাণিতিক ভিত্তি, কৃষি প্রয়োগ, এবং সাধারণ ভুলগুলো বুঝুন।',
  lessons: [
    {
      title: 'Lesson 2.1 — Buffer Analysis: নিকটতা ও সেবা এলাকা নির্ধারণ',
      slug: 'buffer-analysis-proximity',
      order_index: 1,
      content: `# Lesson 2.1 — Buffer Analysis: নিকটতা ও সেবা এলাকা নির্ধারণ

## ১. কী শিখবেন (Learning Objectives)
- Buffer Analysis-এর ধারণা ও গাণিতিক ভিত্তি বোঝা
- Fixed Distance, Variable Distance ও Multi-Ring Buffer-এর পার্থক্য
- কৃষি ও পরিবেশ বিশ্লেষণে Buffer-এর প্রয়োগ শেখা
- Buffer Analysis-এ সাধারণ ভুল ও Failure Modes চিহ্নিত করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
কৃষি সম্প্রসারণ অধিদপ্তর জানতে চায়: "উপজেলা কৃষি অফিস থেকে কোন কোন ইউনিয়ন ৫ km-এর বেশি দূরে? সেখানে কি Sub-Center স্থাপন করা দরকার?"

এই প্রশ্নের উত্তর দিতে আপনাকে প্রতিটি কৃষি অফিসের চারপাশে একটি নির্দিষ্ট দূরত্বের "সেবা এলাকা" তৈরি করতে হবে। এটিই Buffer Analysis।

---

## ৩. মূল ধারণা (Core Concept)

### Buffer কী?
Buffer হলো একটি ফিচারের (Point, Line বা Polygon) চারপাশে একটি নির্দিষ্ট দূরত্বের মধ্যে তৈরি করা নতুন Polygon। এটি **Proximity** বা নিকটতা পরিমাপের সবচেয়ে মৌলিক টুল।

### Buffer-এর প্রকারভেদ

| Buffer ধরন | ব্যাখ্যা | উদাহরণ |
| :--- | :--- | :--- |
| **Fixed Distance** | সব ফিচারের জন্য একই দূরত্ব | প্রতিটি নলকূপ থেকে ৫০০m Buffer |
| **Variable Distance** | ফিচারের Attribute অনুযায়ী ভিন্ন দূরত্ব | নদীর প্রশস্ততা অনুযায়ী ভিন্ন Flood Buffer |
| **Multi-Ring Buffer** | একাধিক দূরত্বে ক্রমবর্ধমান Buffer | ১km, ৩km, ৫km সেবা অঞ্চল |
| **Dissolved Buffer** | ওভারল্যাপিং Buffer একত্রিত | সব স্কুলের ১km Buffer → মোট কভারেজ |

### Point Buffer বনাম Line Buffer বনাম Polygon Buffer

\`\`\`text
Point Buffer:      ● → ⬤ (বৃত্তাকার)
Line Buffer:       — → ▬ (দুই পাশে সমান প্রশস্ততা)
Polygon Buffer:    □ → ▣ (বাইরের দিকে প্রসারিত)
\`\`\`

> [!IMPORTANT]
> **CRS সতর্কতা:** Buffer distance সবসময় আপনার Layer-এর CRS Unit-এ পরিমাপ হয়। Geographic CRS (EPSG:4326)-এ Buffer দিলে দূরত্ব **Degrees**-এ গণনা হবে — মিটারে নয়! সঠিক মিটার দূরত্বের জন্য অবশ্যই Projected CRS (যেমন EPSG:32646 বা EPSG:3106) ব্যবহার করুন।

---

## ৪. QGIS Workflow

### ধাপ ১: ডেটা প্রস্তুতি
- Point Layer: উপজেলা কৃষি অফিসের অবস্থান (Lat/Lon)
- Polygon Layer: ইউনিয়ন সীমানা
- CRS: দুটি লেয়ারকেই EPSG:32646 (UTM Zone 46N)-এ Reproject করুন

### ধাপ ২: Buffer তৈরি
\`\`\`text
QGIS Menu: Vector → Geoprocessing Tools → Buffer

Input layer: কৃষি অফিস (Point)
Distance: 5000 (meters)
Segments: 25 (মসৃণ বৃত্তের জন্য)
End cap style: Round
Dissolve result: ☐ (আলাদা রাখুন)
\`\`\`

### ধাপ ৩: Gap Analysis
- Buffer Layer ও Union Layer ওভারলে করুন (Select by Location)
- যেসব ইউনিয়ন কোনো Buffer-এর মধ্যে পড়ে না — সেগুলো "Service Gap"

---

## ৫. কৃষি প্রয়োগ (Agricultural Applications)

| বিশ্লেষণ | Buffer কনফিগারেশন |
| :--- | :--- |
| সেচ ক্যানালের সেবা এলাকা | Line Buffer, ৫০০m-১km |
| কীটনাশক স্প্রে থেকে জলাশয়ের নিরাপদ দূরত্ব | Point/Polygon Buffer, ১০০-৫০০m |
| বাজার/হাটের ক্যাচমেন্ট এলাকা | Point Buffer, ৩-৫km |
| সড়ক থেকে কৃষিজমির প্রবেশগম্যতা | Line Buffer, ১-৩km |
| নদীর তীরবর্তী ক্ষয়প্রবণ এলাকা | Line Buffer, Variable (নদীর প্রশস্ততা × ২) |

---

## ৬. Failure Mode

> [!WARNING]
> **Buffer ≠ প্রকৃত সেবা এলাকা:** Buffer একটি সরলরেখা দূরত্ব (Euclidean Distance) পরিমাপ করে। বাস্তবে একজন কৃষক সোজা পথে কৃষি অফিসে যেতে পারেন না — নদী, রাস্তা, ভূমিরূপ বাধা হতে পারে। প্রকৃত সেবা এলাকার জন্য Network Analysis (Service Area) প্রয়োজন, যা Course 3-তে শেখানো হবে।

**অন্যান্য সাধারণ ভুল:**
1. **Geographic CRS-এ Buffer:** ৫০০০ degrees Buffer তৈরি হয়ে সারা পৃথিবী ঢেকে যায়
2. **Segments খুব কম:** ৫ segments দিলে Buffer পঞ্চভুজাকার দেখায়, বৃত্তাকার নয়
3. **Dissolve ভুলে যাওয়া:** ওভারল্যাপিং Buffer আলাদা থাকলে Area Count দ্বিগুণ হয়

---

## ৭. অনুশীলন (Practice Task)
**পরিস্থিতি:** নাটোর জেলায় ১৫টি গভীর নলকূপের GPS কোঅর্ডিনেট দেওয়া আছে। প্রতিটি নলকূপ ১ km ব্যাসার্ধে সেচ দিতে পারে।

কাজ:
1. ১ km Fixed Distance Buffer তৈরি করুন
2. Multi-Ring Buffer তৈরি করুন (৫০০m, ১km, ১.৫km)
3. Dissolved Buffer তৈরি করে মোট সেচ কভারেজ এলাকা (ha) বের করুন
4. কোন কৃষিজমি কোনো নলকূপের ১ km-এর মধ্যে পড়ে না — চিহ্নিত করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Fixed, Variable, Multi-Ring ও Dissolved Buffer-এর পার্থক্য ব্যাখ্যা করতে পারবেন
- ✅ Buffer Analysis-এ CRS-এর গুরুত্ব বুঝতে পারবেন
- ✅ কৃষি সমস্যায় Buffer Analysis প্রয়োগ করতে পারবেন
- ✅ Buffer-এর সীমাবদ্ধতা (Euclidean vs. Network distance) ব্যাখ্যা করতে পারবেন`
    },
    {
      title: 'Lesson 2.2 — Clip ও Erase: স্থানিক কাটিং ও মাস্কিং',
      slug: 'clip-erase-spatial-cutting',
      order_index: 2,
      content: `# Lesson 2.2 — Clip ও Erase: স্থানিক কাটিং ও মাস্কিং

## ১. কী শিখবেন (Learning Objectives)
- Clip ও Erase অপারেশনের ধারণা ও পার্থক্য বোঝা
- কখন Clip এবং কখন Erase ব্যবহার করতে হয় শেখা
- QGIS-এ Clip ও Erase Workflow আয়ত্ত করা
- কৃষি ডেটা প্রসেসিং-এ Clip/Erase প্রয়োগ করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনার কাছে সারা বাংলাদেশের মাটির মানচিত্র আছে, কিন্তু আপনি শুধু রাজশাহী জেলার মাটি নিয়ে কাজ করবেন। পুরো দেশের ডেটাসেট নিয়ে কাজ করলে প্রসেসিং ধীর হবে এবং ম্যাপেও অপ্রাসঙ্গিক এলাকা দেখাবে।

**সমাধান:** রাজশাহী জেলার সীমানা দিয়ে মাটির ডেটা **Clip** করুন।

আবার ধরুন, আপনার কাছে একটি জেলার সম্পূর্ণ Land Use Map আছে কিন্তু আপনি শুধু শহুরে এলাকার বাইরের কৃষিজমি চান। শহুরে এলাকার Polygon দিয়ে **Erase** করুন।

---

## ৩. মূল ধারণা (Core Concept)

### Clip কী?
Clip হলো একটি "Cookie Cutter" — আপনি একটি Input Layer-কে একটি Clip Layer-এর সীমানা দিয়ে কেটে ফেলেন। শুধু Clip Layer-এর ভিতরের অংশ থাকে।

\`\`\`text
Clip অপারেশন:
Input Layer:    [████████████]
Clip Layer:          [████]
Result:              [████]  ← শুধু ভিতরের অংশ
\`\`\`

### Erase কী?
Erase হলো Clip-এর বিপরীত — Erase Layer-এর ভিতরের অংশ বাদ যায়, বাকিটুকু থাকে।

\`\`\`text
Erase অপারেশন:
Input Layer:    [████████████]
Erase Layer:         [████]
Result:         [████]    [████]  ← বাইরের অংশ
\`\`\`

### Clip বনাম Erase তুলনা

| বৈশিষ্ট্য | Clip | Erase |
| :--- | :--- | :--- |
| **রাখে** | Overlay Layer-এর ভিতরের অংশ | Overlay Layer-এর বাইরের অংশ |
| **বাদ দেয়** | বাইরের অংশ | ভিতরের অংশ |
| **সাদৃশ্য** | Cookie cutter | Hole puncher |
| **কৃষি উদাহরণ** | জেলা সীমানায় জাতীয় ডেটা কাটা | শহুরে এলাকা বাদ দিয়ে কৃষিজমি রাখা |

---

## ৪. QGIS Workflow

### Clip Workflow
\`\`\`text
QGIS Menu: Vector → Geoprocessing Tools → Clip

Input layer: বাংলাদেশ মাটি মানচিত্র (Polygon)
Overlay layer: রাজশাহী জেলা সীমানা (Polygon)
Output: রাজশাহী_মাটি_clipped.gpkg
\`\`\`

### Erase (Difference) Workflow
\`\`\`text
QGIS Menu: Vector → Geoprocessing Tools → Difference

Input layer: জেলা Land Use Map (Polygon)
Overlay layer: শহুরে এলাকা (Urban Polygon)
Output: গ্রামীণ_ভূমি_ব্যবহার.gpkg
\`\`\`

> [!NOTE]
> **QGIS Terminology:** QGIS-এ "Erase" অপারেশনটি **"Difference"** নামে পরিচিত। ArcGIS-এ এটি "Erase" নামে আছে। কার্যত একই অপারেশন।

---

## ৫. কৃষি প্রয়োগ (Agricultural Applications)

### কেস ১: জেলা-ভিত্তিক ফসল বিশ্লেষণ
জাতীয় Crop Map → Clip by District Boundary → জেলা-নির্দিষ্ট ক্রপ ম্যাপ

### কেস ২: নদী তীরবর্তী কৃষিজমি বাদ দেওয়া
কৃষিজমি Map → Erase by River Buffer (৫০০m) → ক্ষয়ঝুঁকিমুক্ত কৃষিজমি

### কেস ৩: সংরক্ষিত বনাঞ্চল বাদ
Land Use Map → Erase by Protected Forest Boundary → উন্নয়নযোগ্য এলাকা

---

## ৬. Failure Mode

> [!WARNING]
> **Invalid Geometry সমস্যা:** Clip ও Erase অপারেশন Invalid Geometry (self-intersecting polygons, slivers) থাকলে ব্যর্থ হতে পারে বা ভুল ফলাফল দিতে পারে। অপারেশন চালানোর আগে অবশ্যই দুটি লেয়ারেই **Fix Geometries** টুল চালান।

\`\`\`text
QGIS: Processing Toolbox → Vector geometry → Fix geometries
\`\`\`

**আরেকটি সাধারণ ভুল:** Input ও Overlay Layer উল্টে দেওয়া। Clip-এ Input হলো "যেটি কাটা হবে" এবং Overlay হলো "কাটার ছাঁচ"। উল্টে দিলে সম্পূর্ণ ভিন্ন ফলাফল আসবে।

---

## ৭. অনুশীলন (Practice Task)
**ডেটা:** বাংলাদেশের জাতীয় সড়ক নেটওয়ার্ক (Line) এবং সিলেট জেলার সীমানা (Polygon)

1. সিলেট জেলার মধ্যে থাকা সড়কগুলো Clip করুন
2. সড়কগুলোর ২ km Buffer তৈরি করুন
3. সিলেট জেলার কৃষিজমি থেকে সড়ক Buffer Erase (Difference) করুন
4. ফলাফল: "সড়ক থেকে ২ km-এর বেশি দূরের কৃষিজমি" চিহ্নিত

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Clip ও Erase (Difference) অপারেশনের পার্থক্য ব্যাখ্যা করতে পারবেন
- ✅ QGIS-এ Clip ও Difference Workflow চালাতে পারবেন
- ✅ কৃষি ডেটা প্রসেসিং-এ Clip/Erase কখন ব্যবহার করবেন জানবেন
- ✅ Invalid Geometry সমস্যা চিহ্নিত ও সমাধান করতে পারবেন`
    },
    {
      title: 'Lesson 2.3 — Intersect ও Union: ডেটা একত্রীকরণ ও ওভারলে বিশ্লেষণ',
      slug: 'intersect-union-overlay',
      order_index: 3,
      content: `# Lesson 2.3 — Intersect ও Union: ডেটা একত্রীকরণ ও ওভারলে বিশ্লেষণ

## ১. কী শিখবেন (Learning Objectives)
- Intersect ও Union অপারেশনের ধারণা ও গাণিতিক ভিত্তি বোঝা
- দুটি অপারেশনের আউটপুটে কোন ফিচার ও অ্যাট্রিবিউট থাকে তা বোঝা
- Overlay Analysis-এর মূল ধারণা আয়ত্ত করা
- কৃষি সমস্যায় Intersect ও Union প্রয়োগ করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনি জানতে চান: "রংপুর জেলায় কোন কোন এলাকায় বন্যাপ্রবণ জমি এবং আমনের আবাদ একই সাথে আছে?" এটি জানতে আপনাকে দুটি ভিন্ন ডেটাসেট (বন্যা মানচিত্র + ফসল মানচিত্র) একত্রে বিশ্লেষণ করতে হবে। এটিই **Overlay Analysis**, এবং এর দুটি সবচেয়ে গুরুত্বপূর্ণ টুল হলো Intersect ও Union।

---

## ৩. মূল ধারণা (Core Concept)

### Intersect কী?
Intersect দুটি লেয়ারের **সাধারণ (Common) এলাকা** বের করে। শুধু যেখানে দুটি লেয়ার ওভারল্যাপ করে, সেই অংশটুকুই আউটপুটে থাকে। **উভয় লেয়ারের Attribute** আউটপুটে যুক্ত হয়।

\`\`\`text
Intersect:
Layer A:    [████████]
Layer B:         [████████]
Result:          [████]      ← শুধু Common এলাকা, A+B Attributes
\`\`\`

### Union কী?
Union দুটি লেয়ারের **সমস্ত এলাকা** একত্রিত করে। যেখানে ওভারল্যাপ আছে সেখানে উভয়ের Attribute থাকে, যেখানে নেই সেখানে যার আছে তার Attribute থাকে।

\`\`\`text
Union:
Layer A:    [████████]
Layer B:         [████████]
Result:     [████████████████]  ← সমস্ত এলাকা
            A only | A∩B | B only
\`\`\`

### তুলনা সারণী

| বৈশিষ্ট্য | Intersect | Union |
| :--- | :--- | :--- |
| **আউটপুট এলাকা** | শুধু Common অংশ | সমস্ত এলাকা |
| **Attributes** | উভয় লেয়ারের | উভয় (যেখানে প্রযোজ্য) |
| **ফিচার সংখ্যা** | কমে যায় | অনেক বেড়ে যায় |
| **সাদৃশ্য** | Venn Diagram-এর মাঝখান (A∩B) | Venn Diagram-এর পুরোটা (A∪B) |
| **প্রধান ব্যবহার** | "কোথায় দুটি শর্ত একসাথে আছে?" | "দুটি ডেটাসেটের সম্পূর্ণ চিত্র কী?" |

---

## ৪. QGIS Workflow

### Intersect Workflow
\`\`\`text
QGIS Menu: Vector → Geoprocessing Tools → Intersection

Input layer: বন্যাপ্রবণ এলাকা (Polygon)
Overlay layer: আমন ধানের আবাদি এলাকা (Polygon)
Output: বন্যাপ্রবণ_আমন_intersect.gpkg
\`\`\`

**আউটপুট:** শুধু সেই এলাকাগুলো যেখানে বন্যাপ্রবণ জমি এবং আমন ধানের আবাদ একই সাথে আছে। প্রতিটি Polygon-এ বন্যার তীব্রতা ও আমনের আবাদি তথ্য দুটোই থাকবে।

### Union Workflow
\`\`\`text
QGIS Menu: Vector → Geoprocessing Tools → Union

Input layer: মাটির ধরন (Polygon)
Overlay layer: ভূমি ব্যবহার (Polygon)
Output: মাটি_ভূমি_union.gpkg
\`\`\`

> [!TIP]
> **Union-এর পর Attribute Table চেক করুন।** ওভারল্যাপ এলাকায় উভয় লেয়ারের ফিল্ড মান থাকবে। নন-ওভারল্যাপ এলাকায় অপর লেয়ারের ফিল্ডে NULL থাকবে। এই NULL মানগুলো পরবর্তী গণনায় সমস্যা করতে পারে।

---

## ৫. বাস্তব কৃষি উদাহরণ

### কেস: বন্যা-ফসল Overlay Analysis

**প্রশ্ন:** "সিরাজগঞ্জ জেলায় ২০২৩ সালের বন্যায় কোন ফসলের কত হেক্টর জমি ক্ষতিগ্রস্ত?"

\`\`\`text
Step 1: Intersect
├── Input: ২০২৩ বন্যা প্লাবিত এলাকা (Flood Extent Polygon)
├── Overlay: ফসল মানচিত্র (Crop Map Polygon)
└── Result: প্লাবিত কৃষিজমি + ফসলের ধরন

Step 2: Field Calculator
├── $area / 10000 → হেক্টর গণনা
└── Group by ফসলের ধরন → Summary Statistics

Step 3: Output
├── আমন ধান: ১২,৪৫০ হেক্টর ক্ষতিগ্রস্ত
├── পাট: ৩,২২০ হেক্টর ক্ষতিগ্রস্ত
└── সবজি: ৮৯০ হেক্টর ক্ষতিগ্রস্ত
\`\`\`

> [!IMPORTANT]
> **Intersect-ই GIS Overlay Analysis-এর হৃদপিণ্ড।** যখনই আপনি দুটি ভিন্ন Spatial Dataset-এর সম্পর্ক জানতে চান — "কোথায় A এবং B একসাথে আছে?" — তখন Intersect আপনার প্রথম টুল।

---

## ৬. Failure Mode

> [!WARNING]
> **Feature Explosion:** Union অপারেশন ফিচার সংখ্যা ব্যাপকভাবে বাড়ায়। দুটি লেয়ারে যদি ১,০০০ ও ৫০০ Polygon থাকে, Union-এর পর ৫,০০০+ Polygon হতে পারে। বড় ডেটাসেটে এটি Processing Time ও File Size বিশালভাবে বাড়ায়।

**আরও ভুল:**
1. **CRS Mismatch:** Input ও Overlay Layer ভিন্ন CRS-এ থাকলে ফলাফল ভুল হবে
2. **Sliver Polygons:** Intersect-এর পর অতি ছোট, অর্থহীন Polygon তৈরি হতে পারে — এগুলো Clean করতে হবে
3. **Topology Errors:** Self-intersection বা Gap থাকলে অপারেশন ব্যর্থ হতে পারে

---

## ৭. অনুশীলন (Practice Task)
**ডেটা:** রাজশাহী জেলার মাটির ধরন (Soil Type Polygon) এবং সেচ কভারেজ এলাকা (Irrigation Polygon)

1. **Intersect** করুন → "কোন মাটির ধরনে সেচ কভারেজ আছে?" বের করুন
2. প্রতিটি Soil Type-র জন্য সেচ কভারেজ Area (ha) গণনা করুন
3. **Union** করুন → সম্পূর্ণ চিত্র দেখুন (সেচ আছে/নেই × মাটির ধরন)
4. Union Attribute Table-তে NULL মান কোথায় আছে চিহ্নিত করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Intersect ও Union অপারেশনের আউটপুট পার্থক্য ব্যাখ্যা করতে পারবেন
- ✅ Overlay Analysis-এর ধারণা ও প্রয়োগ বুঝতে পারবেন
- ✅ Feature Explosion ও Sliver Polygon সমস্যা চিহ্নিত করতে পারবেন
- ✅ কৃষি বিশ্লেষণে Intersect কখন ও কেন ব্যবহার করবেন জানবেন`
    },
    {
      title: 'Lesson 2.4 — Dissolve ও Merge: ফিচার সরলীকরণ ও সংযুক্তকরণ',
      slug: 'dissolve-merge-simplification',
      order_index: 4,
      content: `# Lesson 2.4 — Dissolve ও Merge: ফিচার সরলীকরণ ও সংযুক্তকরণ

## ১. কী শিখবেন (Learning Objectives)
- Dissolve অপারেশনের ধারণা ও কার্যপদ্ধতি বোঝা
- Merge Vector Layers-এর ব্যবহার শেখা
- Dissolve Statistics (Sum, Mean, Count) আয়ত্ত করা
- কৃষি ডেটা ব্যবস্থাপনায় Dissolve ও Merge প্রয়োগ করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনার কাছে বাংলাদেশের ইউনিয়ন পর্যায়ের ভূমি ব্যবহার মানচিত্র আছে (৪,৫০০+ Polygon)। কিন্তু আপনি উপজেলা পর্যায়ে সারসংক্ষেপ চান — প্রতিটি উপজেলায় মোট কৃষিজমির পরিমাণ। হাজার হাজার ইউনিয়ন Polygon-কে উপজেলায় একত্রিত করার উপায় কী?

**সমাধান:** Dissolve by Upazila Name — একই উপজেলার সব ইউনিয়ন একটি একক Polygon-এ পরিণত হবে।

---

## ৩. মূল ধারণা (Core Concept)

### Dissolve কী?
Dissolve একটি নির্দিষ্ট Attribute ফিল্ডের মান অনুযায়ী একাধিক ফিচারকে একটি ফিচারে একত্রিত করে। একই মানের সব Polygon-এর সীমানা মুছে যায় এবং একটি বড় Polygon তৈরি হয়।

\`\`\`text
Dissolve by "District":
Input:  [ইউনিয়ন-১|ইউনিয়ন-২|ইউনিয়ন-৩] [ইউনিয়ন-ক|ইউনিয়ন-খ]
         ←——— জেলা A ———→  ←—— জেলা B ——→

Result: [        জেলা A        ] [    জেলা B    ]
         একটি Polygon             একটি Polygon
\`\`\`

### Dissolve Statistics
Dissolve করার সময় সংখ্যাসূচক ফিল্ডের সারসংক্ষেপ তৈরি করা যায়:

| Statistic | কাজ | উদাহরণ |
| :--- | :--- | :--- |
| **Sum** | যোগফল | মোট কৃষিজমি (ha) |
| **Mean** | গড় | গড় ফলন (MT/ha) |
| **Count** | সংখ্যা | কতটি ইউনিয়ন |
| **Min / Max** | সর্বনিম্ন / সর্বোচ্চ | সর্বনিম্ন/সর্বোচ্চ ভূগর্ভস্থ পানির স্তর |
| **First / Last** | প্রথম / শেষ মান | — |

### Merge কী?
Merge একাধিক আলাদা ভেক্টর লেয়ারকে একটি লেয়ারে যুক্ত করে। Dissolve-এর সাথে পার্থক্য — Merge সীমানা মোছে না, শুধু ফাইল একত্রিত করে।

| Dissolve | Merge |
| :--- | :--- |
| একটি লেয়ারের মধ্যে ফিচার একত্রিত | একাধিক লেয়ার একটি ফাইলে যুক্ত |
| সীমানা মুছে যায় | সীমানা অপরিবর্তিত |
| Attribute দিয়ে গ্রুপিং | কোনো গ্রুপিং নেই |

---

## ৪. QGIS Workflow

### Dissolve Workflow
\`\`\`text
QGIS Menu: Vector → Geoprocessing Tools → Dissolve

Input layer: ইউনিয়ন ভূমি ব্যবহার (Polygon)
Dissolve field: upazila_name
Statistics:
  - agricultural_area_ha → Sum
  - yield_mt_per_ha → Mean
  - union_count → Count
Output: উপজেলা_সারসংক্ষেপ.gpkg
\`\`\`

### Merge Workflow
\`\`\`text
QGIS Menu: Vector → Data Management Tools → Merge Vector Layers

Input layers:
  - রাজশাহী_মাটি.gpkg
  - নাটোর_মাটি.gpkg
  - চাঁপাইনবাবগঞ্জ_মাটি.gpkg
Output: রাজশাহী_বিভাগ_মাটি.gpkg
\`\`\`

> [!TIP]
> **Dissolve + Statistics = Spatial Aggregation।** এটি GIS-এর সবচেয়ে শক্তিশালী সারসংক্ষেপ পদ্ধতিগুলোর একটি। আপনি ইউনিয়ন-পর্যায়ের হাজার হাজার ডেটা থেকে উপজেলা পর্যায়ের সিদ্ধান্তমূলক তথ্য তৈরি করতে পারেন।

---

## ৫. বাস্তব কৃষি উদাহরণ

### কেস: উপজেলা-ভিত্তিক ক্রপ ডাইভার্সিটি ইনডেক্স

\`\`\`text
Input: ইউনিয়ন-পর্যায়ের ক্রপ ডেটা
├── ইউনিয়ন নাম
├── প্রধান ফসল
├── আবাদি এলাকা (ha)
└── ফসলের জাত সংখ্যা

Dissolve by: upazila_name
Statistics:
├── Sum(আবাদি এলাকা) → মোট কৃষিজমি
├── Count(ইউনিয়ন) → ইউনিয়ন সংখ্যা
└── Mean(ফসলের জাত সংখ্যা) → গড় ক্রপ ডাইভার্সিটি

Output: প্রতিটি উপজেলার ক্রপ ডাইভার্সিটি সূচক
\`\`\`

---

## ৬. Failure Mode

> [!WARNING]
> **Mean-এর ফাঁদ:** Dissolve-এ Mean ব্যবহার করার সময় সাবধান। "ইউনিয়নগুলোর গড় ফলন" আর "উপজেলার প্রকৃত গড় ফলন" এক জিনিস নয়। ইউনিয়নগুলোর আয়তন ভিন্ন — বড় ইউনিয়ন ও ছোট ইউনিয়নের ফলন সমান ওজনে গণ্য হলে ফলাফল বিভ্রান্তিকর হবে। **Weighted Mean** ব্যবহার করা উচিত।

**আরও ভুল:**
1. **Dissolve Field ভুলে যাওয়া:** Dissolve Field না দিলে পুরো লেয়ার একটি মাত্র Polygon-এ পরিণত হবে
2. **Multipart Polygon:** Dissolve-এর পর দ্বীপের মতো বিচ্ছিন্ন অংশ Multipart Polygon তৈরি করে — পরবর্তী Analysis-এ সমস্যা হতে পারে
3. **Merge-এ Schema Mismatch:** ভিন্ন ফিল্ড নামের লেয়ার Merge করলে Attribute Table-তে NULL ছড়িয়ে যায়

---

## ৭. অনুশীলন (Practice Task)
1. বাংলাদেশের ইউনিয়ন লেয়ার নিন এবং **জেলা নাম** দিয়ে Dissolve করুন
2. Dissolve Statistics-এ Union Count ও Total Area (ha) যোগ করুন
3. তিনটি জেলার (রাজশাহী, চাঁপাইনবাবগঞ্জ, নাটোর) ফসল ডেটা আলাদা ফাইলে আছে — **Merge** করুন
4. Merged ডেটাসেটে ফিল্ড স্ট্রাকচার ও NULL মান চেক করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Dissolve ও Merge-এর পার্থক্য ব্যাখ্যা করতে পারবেন
- ✅ Dissolve Statistics (Sum, Mean, Count) প্রয়োগ করতে পারবেন
- ✅ কৃষি ডেটায় Spatial Aggregation করতে পারবেন
- ✅ Weighted Mean সমস্যা ও Multipart Polygon ঝুঁকি বুঝবেন`
    },
    {
      title: 'Lesson 2.5 — Multi-Step Geoprocessing Pipeline: একটি বাস্তব কৃষি উদাহরণ',
      slug: 'multi-step-geoprocessing-pipeline',
      order_index: 5,
      content: `# Lesson 2.5 — Multi-Step Geoprocessing Pipeline: একটি বাস্তব কৃষি উদাহরণ

## ১. কী শিখবেন (Learning Objectives)
- একাধিক Geoprocessing অপারেশন ক্রমানুসারে সংযুক্ত করে সম্পূর্ণ Analysis Pipeline তৈরি করা
- প্রতিটি ধাপে Intermediate Output যাচাই করার গুরুত্ব বোঝা
- QGIS Processing Modeler-এর প্রাথমিক ধারণা পাওয়া
- একটি পূর্ণাঙ্গ কৃষি বিশ্লেষণ সম্পন্ন করা

---

## ২. সমস্যা (The Problem)
**প্রশ্ন:** "নওগাঁ জেলায় কোন কোন ইউনিয়নে প্রধান সড়ক থেকে ৩ km-এর বাইরে এবং সেচ ক্যানালের ১ km-এর মধ্যে এমন কৃষিজমি আছে যেখানে আমের আবাদ সম্ভব (মাটির ধরন: Barind Clay)?"

এই প্রশ্নের উত্তর দিতে একটি মাত্র GIS টুল যথেষ্ট নয়। আপনাকে **একাধিক অপারেশন** ক্রমানুসারে চালাতে হবে — এটিই **Multi-Step Geoprocessing Pipeline**।

---

## ৩. Pipeline Architecture

\`\`\`text
Step 1: Data Preparation
├── সব ডেটা EPSG:32646 (UTM Zone 46N)-এ Reproject
├── নওগাঁ জেলা সীমানা দিয়ে সব ডেটা Clip
└── Fix Geometries (সব Vector Layer)

Step 2: Buffer Operations
├── প্রধান সড়ক → 3 km Buffer → "সড়ক সেবা এলাকা"
└── সেচ ক্যানাল → 1 km Buffer → "সেচ সেবা এলাকা"

Step 3: Spatial Selection
├── কৃষিজমি Difference (Erase) সড়ক Buffer
│   → "সড়ক থেকে ৩ km-এর বাইরের কৃষিজমি"
└── Result Intersect সেচ Buffer
    → "সড়ক থেকে দূরে কিন্তু সেচের কাছে থাকা কৃষিজমি"

Step 4: Attribute Filter
└── Select by Attribute: soil_type = 'Barind Clay'
    → "Barind Clay মাটিতে সেচযুক্ত, সড়ক-দূরবর্তী কৃষিজমি"

Step 5: Spatial Aggregation
├── Intersect with Union Boundary
├── Dissolve by union_name
└── Calculate area (ha) per Union

Step 6: Final Output
├── থিমেটিক ম্যাপ: Union-ভিত্তিক আম আবাদ সম্ভাবনা
├── সারণী: Top 10 ইউনিয়ন (আয়তন অনুযায়ী)
└── সীমাবদ্ধতা ও সুপারিশ
\`\`\`

---

## ৪. প্রতিটি ধাপের বিস্তারিত

### Step 1: Data Preparation (সবচেয়ে গুরুত্বপূর্ণ!)

\`\`\`text
QGIS Processing:
1. Reproject layer → EPSG:32646 (সব ৫টি Input Layer)
2. Clip → নওগাঁ জেলা সীমানা দিয়ে
3. Fix geometries → প্রতিটি Clipped Layer
\`\`\`

> [!IMPORTANT]
> **Data Preparation = ৬০% সময়।** একটি প্রফেশনাল GIS প্রকল্পের ৬০% সময় ডেটা প্রস্তুতিতে ব্যয় হয়। Analysis মাত্র ২০%, আর Interpretation ও Reporting-এ ২০%। Data Preparation সংক্ষিপ্ত করলে পুরো Analysis ভুল হওয়ার ঝুঁকি থাকে।

### Step 2-3: Buffer + Overlay

| ধাপ | Input | Operation | Output |
| :--- | :--- | :--- | :--- |
| 2a | প্রধান সড়ক | Buffer (3km) | সড়ক সেবা এলাকা |
| 2b | সেচ ক্যানাল | Buffer (1km) | সেচ সেবা এলাকা |
| 3a | কৃষিজমি, সড়ক Buffer | Difference | সড়ক-দূরবর্তী জমি |
| 3b | Step 3a Result, সেচ Buffer | Intersect | চূড়ান্ত Candidate এলাকা |

### Step 4: Attribute Filter
\`\`\`text
QGIS: Select by Expression
"soil_type" = 'Barind Clay'

→ Export Selected Features as new layer
\`\`\`

### Step 5: Spatial Aggregation
\`\`\`text
1. Intersect (Candidate area × Union boundary) → Union-tagged polygons
2. Dissolve by "union_name" with Sum(area_ha)
3. Sort descending by total_area_ha
\`\`\`

---

## ৫. Intermediate Verification

> [!TIP]
> **প্রতিটি ধাপের পর চেক করুন:**
> 1. **Visual Check:** ম্যাপে দেখুন ফলাফল যৌক্তিক কিনা
> 2. **Record Count:** ফিচার সংখ্যা চেক করুন (অস্বাভাবিকভাবে বেশি/কম হলে ভুল)
> 3. **Attribute Check:** NULL মান, অপ্রত্যাশিত মান দেখুন
> 4. **Area Check:** মোট Area কি জেলার Area-র চেয়ে বেশি? (বেশি হলে ভুল!)

---

## ৬. QGIS Processing Modeler (Preview)

QGIS-এ **Graphical Modeler** (Processing → Graphical Modeler) ব্যবহার করে পুরো Pipeline-কে একটি Visual Workflow-তে সাজানো যায়:

\`\`\`text
Input: 5 layers → [Reproject] → [Clip] → [Fix Geom]
                                            ↓
                         [Buffer Roads] → [Difference]
                                            ↓
                         [Buffer Canal] → [Intersect]
                                            ↓
                         [Select Soil] → [Dissolve] → Output
\`\`\`

> [!NOTE]
> **Graphical Modeler** আপনাকে পুরো Pipeline সংরক্ষণ করতে, পুনরায় চালাতে এবং ভিন্ন ডেটায় প্রয়োগ করতে দেয়। এটি **Reproducibility**-র জন্য অত্যন্ত গুরুত্বপূর্ণ। তবে Modeler-এর বিস্তারিত ব্যবহার Course 3-তে শেখানো হবে।

---

## ৭. Failure Mode

> [!WARNING]
> **Pipeline Error Propagation:** একটি Multi-Step Pipeline-এ Step 2-তে যদি CRS ভুল থাকে, তাহলে Step 3, 4, 5 — সবকিছু ভুল হবে, কিন্তু QGIS কোনো Error দেবে না। এটি **Silent Failure** — সবচেয়ে বিপজ্জনক ধরনের ভুল। প্রতিটি ধাপে Intermediate Verification না করলে শেষ পর্যন্ত ভুল ধরা অসম্ভব।

---

## ৮. অনুশীলন (Practice Task)
নিচের প্রশ্নের জন্য একটি সম্পূর্ণ Multi-Step Pipeline ডিজাইন করুন (ধাপ, Input, Operation, Output লিখুন):

**প্রশ্ন:** "দিনাজপুর জেলায় কোন ইউনিয়নে বিদ্যালয় থেকে ২ km-এর বাইরে এবং নদীর ৫০০m-এর মধ্যে বন্যাপ্রবণ কৃষিজমি আছে?"

প্রয়োজনীয় ডেটা:
- বিদ্যালয়ের অবস্থান (Point)
- নদী নেটওয়ার্ক (Line)
- বন্যাপ্রবণ এলাকা (Polygon)
- কৃষিজমি (Polygon)
- ইউনিয়ন সীমানা (Polygon)

---

## ৯. মূল্যায়ন (Assessment)
- ✅ একাধিক Geoprocessing অপারেশন ক্রমানুসারে সাজাতে পারবেন
- ✅ প্রতিটি ধাপে Intermediate Output যাচাই করতে পারবেন
- ✅ Pipeline-এ Silent Failure চিহ্নিত করার গুরুত্ব বুঝবেন
- ✅ সম্পূর্ণ কৃষি বিশ্লেষণ Pipeline ডিজাইন ও বাস্তবায়ন করতে পারবেন`
    }
  ]
};
