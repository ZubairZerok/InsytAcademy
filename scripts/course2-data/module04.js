// =============================================================================
// MODULE 04: RASTER FUNDAMENTALS FOR ANALYSIS
// Course 2: Applied GIS Analysis & Remote Sensing
// =============================================================================

module.exports = {
  title: 'Module 04: Raster Fundamentals for Analysis',
  slug: 'mod-04-raster-fundamentals-analysis',
  order_index: 4,
  description: 'Raster ডেটার গভীর কাঠামো — Band, Cell, NoData, Resolution — বোঝার পর Raster Algebra, Reclassification, Resampling, Reprojection ও Raster Data Management শিখুন। পরবর্তী Terrain, Remote Sensing ও Classification Module-এর জন্য এই ভিত্তি অপরিহার্য।',
  lessons: [
    {
      title: 'Lesson 4.1 — Raster Data Revisited: Band, Cell, NoData ও Resolution',
      slug: 'raster-data-band-cell-nodata',
      order_index: 1,
      content: `# Lesson 4.1 — Raster Data Revisited: Band, Cell, NoData ও Resolution

## ১. কী শিখবেন (Learning Objectives)
- Raster ডেটার অভ্যন্তরীণ কাঠামো (Band, Cell, Row, Column) গভীরভাবে বোঝা
- Single-Band ও Multi-Band Raster-এর পার্থক্য আয়ত্ত করা
- NoData মান ও এর বিশ্লেষণে প্রভাব বোঝা
- Spatial, Spectral, Temporal ও Radiometric Resolution-এর ধারণা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনি USGS থেকে একটি Landsat 8 ইমেজ ডাউনলোড করেছেন। ফাইলটি খুললে দেখলেন একটি সাদা-কালো ইমেজ এবং Properties-এ লেখা: "Band count: 1, Data type: UInt16, NoData: 0, Pixel size: 30x30"। এগুলোর মানে কী? কেন ইমেজটি রঙিন নয়? NoData = 0 মানে কি সব শূন্য মান বাদ যাবে?

---

## ৩. মূল ধারণা (Core Concept)

### Raster-এর অভ্যন্তরীণ কাঠামো

একটি Raster হলো একটি নিয়মিত গ্রিড (Regular Grid) যেখানে প্রতিটি Cell (Pixel)-এ একটি সংখ্যাসূচক মান সংরক্ষিত থাকে।

\`\`\`text
গ্রিড কাঠামো (5×4 Raster):
Column →  1    2    3    4    5
Row ↓
1       [120] [135] [142] [138] [NoData]
2       [118] [128] [145] [NoData] [NoData]
3       [125] [132] [139] [141] [136]
4       [130] [140] [148] [152] [149]

প্রতিটি Cell = একটি Pixel = একটি সংখ্যা
\`\`\`

### Band কী?
Band হলো Raster-এর একটি "স্তর"। প্রতিটি Band-এ সম্পূর্ণ গ্রিডের মান থাকে, কিন্তু ভিন্ন ভিন্ন তথ্য ধারণ করে।

| Raster ধরন | Band সংখ্যা | উদাহরণ |
| :--- | :--- | :--- |
| **Single-Band** | ১ | DEM (উচ্চতা), Slope, একটি Spectral Band |
| **Multi-Band** | ২+ | Satellite Image (RGB = ৩ Band), Landsat 8 (১১ Band) |

### NoData কী?

NoData হলো "এখানে কোনো বৈধ তথ্য নেই" — এটি ০ (শূন্য) থেকে সম্পূর্ণ আলাদা।

> [!WARNING]
> **NoData ≠ 0।** শূন্য (0) একটি বৈধ মান — যেমন সমুদ্রপৃষ্ঠের উচ্চতা ০ মিটার। কিন্তু NoData মানে ডেটা নেই (মেঘে ঢাকা, সেন্সর ত্রুটি, Study Area-র বাইরে)। যদি NoData = 0 সেট করা থাকে এবং আপনার ডেটায় বৈধ 0 মান থাকে — সেগুলোও বাদ পড়বে!

### Resolution-এর চার প্রকার

| Resolution | অর্থ | উদাহরণ |
| :--- | :--- | :--- |
| **Spatial** | একটি Pixel কতটুকু পৃথিবীর পৃষ্ঠ ঢেকে রাখে | Sentinel-2: 10m, Landsat: 30m |
| **Spectral** | কতগুলো Band ও প্রতিটি Band-এর তরঙ্গদৈর্ঘ্য পরিসর | Landsat 8: 11 Band, Hyperspectral: 200+ Band |
| **Temporal** | একই এলাকার পুনঃপরিদর্শন সময় | Sentinel-2: ৫ দিন, Landsat: ১৬ দিন |
| **Radiometric** | মান সংরক্ষণের Bit Depth | 8-bit: 0-255, 16-bit: 0-65535 |

> [!IMPORTANT]
> **High Spatial Resolution ≠ Best।** ১ মিটার Resolution-এ সারা বাংলাদেশের ইমেজ GB-তে হবে, প্রসেসিং ঘন্টায় চলবে। আপনার বিশ্লেষণের প্রয়োজন অনুযায়ী Resolution নির্বাচন করুন — জাতীয় পর্যায়ে MODIS (250m) যথেষ্ট, খামার পর্যায়ে Sentinel-2 (10m) দরকার।

---

## ৪. QGIS-এ Raster পরিদর্শন

\`\`\`text
Layer Properties → Information:
├── Dimensions: 7000 × 5000 (Columns × Rows)
├── Bands: 1
├── Data type: Float32
├── CRS: EPSG:32646
├── Pixel Size: 30, -30 (meters)
├── NoData: -9999
└── Statistics: Min=2.3, Max=85.7, Mean=24.6

Layer Properties → Transparency:
└── Additional no data value: -9999 (এখানে সেট/পরিবর্তন করুন)
\`\`\`

---

## ৫. বাস্তব কৃষি উদাহরণ

### কেস: DEM Resolution-এর প্রভাব

| DEM Source | Resolution | উপযুক্ত ব্যবহার |
| :--- | :--- | :--- |
| SRTM | 30m | জাতীয়/বিভাগীয় পর্যায়ে বন্যা মডেলিং |
| ALOS PALSAR | 12.5m | জেলা পর্যায়ে Terrain Analysis |
| Drone DEM | 0.1-1m | খামার পর্যায়ে সেচ নালা পরিকল্পনা |

---

## ৬. Failure Mode

> [!WARNING]
> **Data Type Overflow:** 8-bit Unsigned Integer (UInt8) শুধু 0-255 ধারণ করতে পারে। আপনি যদি NDVI গণনা করেন (যার মান -1 থেকে +1), UInt8 Raster-এ সংরক্ষণ করলে দশমিক ও ঋণাত্মক মান হারিয়ে যাবে। **Float32 বা Float64 ব্যবহার করুন।**

---

## ৭. অনুশীলন (Practice Task)
1. একটি Landsat 8 Band (GeoTIFF) QGIS-এ খুলুন
2. Layer Properties → Information থেকে নোট করুন: Band count, Data type, Pixel size, NoData value
3. Identify Tool দিয়ে বিভিন্ন Pixel-এ ক্লিক করে মান দেখুন
4. একটি মেঘাচ্ছন্ন এলাকায় Pixel মান কত? (NoData?)

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Band, Cell, Row, Column কাঠামো ব্যাখ্যা করতে পারবেন
- ✅ NoData ও 0 (শূন্য)-এর পার্থক্য বুঝবেন
- ✅ চার ধরনের Resolution (Spatial, Spectral, Temporal, Radiometric) চিহ্নিত করতে পারবেন
- ✅ বিশ্লেষণের প্রয়োজন অনুযায়ী Resolution নির্বাচন করতে পারবেন`
    },
    {
      title: 'Lesson 4.2 — Raster Algebra ও Map Calculator: পিক্সেল-স্তরের গণনা',
      slug: 'raster-algebra-map-calculator',
      order_index: 2,
      content: `# Lesson 4.2 — Raster Algebra ও Map Calculator: পিক্সেল-স্তরের গণনা

## ১. কী শিখবেন (Learning Objectives)
- Raster Algebra-এর ধারণা ও গাণিতিক ভিত্তি বোঝা
- Local, Focal, Zonal ও Global অপারেশনের পার্থক্য আয়ত্ত করা
- QGIS Raster Calculator ব্যবহার করা
- কৃষি সূচক (NDVI, Yield Index) গণনার প্রাথমিক ধারণা পাওয়া

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনার কাছে দুটি Raster আছে:
1. **DEM (Digital Elevation Model):** প্রতিটি Pixel-এ ভূমির উচ্চতা (মিটার)
2. **Water Level Raster:** প্রতিটি Pixel-এ বন্যার পানির স্তর (মিটার)

আপনি জানতে চান: "কোন কোন Pixel-এ পানির গভীরতা ≥ ১ মিটার?" এর জন্য আপনাকে **Pixel-by-Pixel** হিসাব করতে হবে: Water Level - DEM = Flood Depth।

---

## ৩. মূল ধারণা: Raster Algebra

### Raster Algebra কী?
দুই বা ততোধিক Raster-এর Pixel মান নিয়ে গাণিতিক অপারেশন চালানো। প্রতিটি Pixel-এ একই অপারেশন স্বয়ংক্রিয়ভাবে প্রয়োগ হয়।

\`\`\`text
Raster A:        Raster B:        A - B (Result):
[10] [15] [20]   [8]  [12] [18]   [2]  [3]  [2]
[25] [30] [35]   [22] [28] [31]   [3]  [2]  [4]
[40] [45] [50]   [38] [40] [45]   [2]  [5]  [5]
\`\`\`

### চার ধরনের Raster Operation

| Operation | কাজ | QGIS উদাহরণ |
| :--- | :--- | :--- |
| **Local** | প্রতিটি Pixel স্বতন্ত্রভাবে | A + B, A × 0.5, NDVI |
| **Focal** | প্রতিবেশী Pixel-এর উপর ভিত্তি করে | Slope, Aspect, Smooth filter |
| **Zonal** | একটি Zone-এর সব Pixel একত্রে | Zonal Mean, Zonal Sum |
| **Global** | পুরো Raster-এর সব Pixel একত্রে | Flow Direction, Viewshed |

---

## ৪. QGIS Raster Calculator

\`\`\`text
QGIS Menu: Raster → Raster Calculator

Expression:
"Water_Level@1" - "DEM@1"

→ @1 মানে Band 1
→ Output: Flood_Depth.tif
\`\`\`

### সাধারণ Raster Algebra Expressions

| কাজ | Expression | ব্যবহার |
| :--- | :--- | :--- |
| বিয়োগ | "A@1" - "B@1" | বন্যার গভীরতা |
| যোগ | "A@1" + "B@1" | সম্মিলিত বৃষ্টিপাত |
| গুণ | "A@1" * 0.01 | ইউনিট রূপান্তর |
| ভাগ | "A@1" / "B@1" | ফলন ঘনত্ব |
| শর্তাধীন | ("A@1" > 100) * 1 | Binary mask (সত্য=1, মিথ্যা=0) |
| NDVI | ("NIR@1" - "RED@1") / ("NIR@1" + "RED@1") | ভেজিটেশন ইনডেক্স |

> [!TIP]
> **Boolean/Conditional Raster:** Expression-এ comparison operator (>, <, =) ব্যবহার করলে আউটপুট হয় 1 (সত্য) বা 0 (মিথ্যা)। এটি দিয়ে Binary Mask তৈরি করে পরে অন্য Raster-এ প্রয়োগ করা যায়।

---

## ৫. বাস্তব কৃষি উদাহরণ

### কেস ১: বন্যার গভীরতা মানচিত্র
\`\`\`text
Flood_Depth = "Water_Level@1" - "DEM@1"

Pixel মান:
  > 0 = প্লাবিত
  ≤ 0 = শুষ্ক
  > 1.0 = গভীর প্লাবন (ফসল সম্পূর্ণ ক্ষতিগ্রস্ত)
  0.3-1.0 = মাঝারি প্লাবন (ফসল আংশিক ক্ষতিগ্রস্ত)
\`\`\`

### কেস ২: তাপমাত্রা রূপান্তর (Kelvin → Celsius)
\`\`\`text
Celsius = "LST_Kelvin@1" - 273.15
\`\`\`

### কেস ৩: Yield Density Map
\`\`\`text
Yield_per_ha = "Total_Production@1" / "Agricultural_Area@1"
\`\`\`

---

## ৬. Failure Mode

> [!WARNING]
> **Division by Zero:** "A@1" / "B@1" — যদি B-এর কোনো Pixel-এ মান 0 থাকে, ফলাফল Infinity বা NaN হবে। সমাধান: শর্তাধীন Expression ব্যবহার করুন — ("B@1" != 0) * ("A@1" / ("B@1" + 0.0001))

**আরও ভুল:**
1. **Resolution Mismatch:** দুটি ভিন্ন Resolution-এর Raster-এ Algebra করলে QGIS Output Resolution সম্পর্কে সতর্কতা দেবে
2. **NoData Propagation:** যেকোনো Input-এ NoData থাকলে Output-ও NoData হবে — এটি কখনো সমস্যা, কখনো প্রত্যাশিত
3. **Band নম্বর ভুল:** Multi-Band Raster-এ @1, @2, @3 সঠিকভাবে নির্বাচন না করলে ভুল Band-এ গণনা হবে

---

## ৭. অনুশীলন (Practice Task)
1. DEM ও Water Level Raster ব্যবহার করে Flood Depth Map তৈরি করুন
2. Flood Depth > 1m এলাকার Binary Mask তৈরি করুন (সত্য=1, মিথ্যা=0)
3. LST Kelvin ডেটাকে Celsius-এ রূপান্তর করুন
4. দুটি সময়কালের NDVI Raster-এর পার্থক্য (Change) গণনা করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Local, Focal, Zonal, Global Operation-এর পার্থক্য ব্যাখ্যা করতে পারবেন
- ✅ QGIS Raster Calculator-এ Expression লিখতে পারবেন
- ✅ Boolean/Conditional Raster তৈরি করতে পারবেন
- ✅ Division by Zero ও NoData Propagation সমস্যা এড়াতে পারবেন`
    },
    {
      title: 'Lesson 4.3 — Reclassification ও Value Mapping',
      slug: 'raster-reclassification',
      order_index: 3,
      content: `# Lesson 4.3 — Reclassification ও Value Mapping

## ১. কী শিখবেন (Learning Objectives)
- Reclassification-এর ধারণা ও উদ্দেশ্য বোঝা
- Continuous মান থেকে Categorical শ্রেণী তৈরি করা
- QGIS-এ Reclassify by Table ও Raster Calculator-এ রিক্লাসিফিকেশন করা
- কৃষি সূচকের শ্রেণীবিন্যাস প্রয়োগ করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনার কাছে একটি Slope Raster আছে যেখানে প্রতিটি Pixel-এ ভূমির ঢাল ডিগ্রিতে (0°-89°) আছে। কিন্তু আপনার রিপোর্টে দরকার: "সমতল", "মৃদু ঢাল", "মাঝারি ঢাল", "খাড়া ঢাল" — শ্রেণীভিত্তিক মানচিত্র। Continuous মান থেকে Categorical শ্রেণী তৈরি করার প্রক্রিয়াই **Reclassification**।

---

## ৩. মূল ধারণা: Reclassification

### কী ঘটে?
Reclassification মূল Raster-এর Continuous মানগুলোকে নতুন Categorical মানে রূপান্তর করে:

\`\`\`text
মূল Slope Raster:          Reclassified:
[2.3] [5.1] [12.4]         [1]   [1]   [2]
[0.8] [18.7] [25.3]   →    [1]   [3]   [4]
[3.2] [8.9] [35.1]         [1]   [2]   [4]

শ্রেণী:
1 = সমতল (0-5°)
2 = মৃদু ঢাল (5-15°)
3 = মাঝারি ঢাল (15-25°)
4 = খাড়া ঢাল (>25°)
\`\`\`

### Reclassification Table

| শ্রেণী | Min | Max | নতুন মান | লেবেল |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 0 | 5 | 1 | সমতল |
| 2 | 5 | 15 | 2 | মৃদু ঢাল |
| 3 | 15 | 25 | 3 | মাঝারি ঢাল |
| 4 | 25 | 90 | 4 | খাড়া ঢাল |

---

## ৪. QGIS Workflow

### পদ্ধতি ১: Reclassify by Table
\`\`\`text
QGIS: Processing Toolbox → Raster analysis → Reclassify by table

Input raster: Slope.tif
Band: 1
Reclassification table:
  0    | 5    | 1
  5    | 15   | 2
  15   | 25   | 3
  25   | 90   | 4
Output: Slope_classified.tif
\`\`\`

### পদ্ধতি ২: Raster Calculator
\`\`\`text
("Slope@1" <= 5) * 1 + 
("Slope@1" > 5 AND "Slope@1" <= 15) * 2 + 
("Slope@1" > 15 AND "Slope@1" <= 25) * 3 + 
("Slope@1" > 25) * 4
\`\`\`

> [!TIP]
> **Reclassify by Table সহজ ও নিরাপদ।** Raster Calculator-এ জটিল Conditional Expression লিখলে ভুলের ঝুঁকি বেশি। সাধারণ Reclassification-এর জন্য Table পদ্ধতি ব্যবহার করুন।

---

## ৫. কৃষি প্রয়োগ

### কেস ১: মাটির pH শ্রেণীবিন্যাস

| শ্রেণী | pH পরিসর | কৃষি ব্যাখ্যা |
| :--- | :--- | :--- |
| 1 (Strongly Acidic) | < 4.5 | অধিকাংশ ফসলের জন্য অনুপযুক্ত |
| 2 (Moderately Acidic) | 4.5-5.5 | চা, আনারস উপযুক্ত |
| 3 (Slightly Acidic) | 5.5-6.5 | বেশিরভাগ ফসলের জন্য গ্রহণযোগ্য |
| 4 (Neutral) | 6.5-7.5 | আদর্শ |
| 5 (Alkaline) | > 7.5 | লবণাক্ততা সমস্যা হতে পারে |

### কেস ২: NDVI শ্রেণীবিন্যাস

| শ্রেণী | NDVI পরিসর | ব্যাখ্যা |
| :--- | :--- | :--- |
| 1 | < 0.0 | পানি |
| 2 | 0.0 - 0.2 | নগ্ন ভূমি / অনুর্বর |
| 3 | 0.2 - 0.4 | দুর্বল গাছপালা / শুষ্ক ফসল |
| 4 | 0.4 - 0.6 | মাঝারি সবুজ / ফসলের বৃদ্ধি পর্যায় |
| 5 | > 0.6 | ঘন সবুজ / সুস্থ ফসল |

---

## ৬. Failure Mode

> [!WARNING]
> **Boundary Value সমস্যা:** যদি আপনার Table-এ ৫ শ্রেণী থাকে কিন্তু পরিসরে ফাঁক থাকে (যেমন 0-5 ও 6-15 — ৫.৫ মান কোথায় যাবে?), কিছু Pixel অনির্ধারিত থেকে যাবে। **সবসময় পরিসরগুলো ক্রমাগত ও ফাঁক-মুক্ত রাখুন।**

**আরও ভুল:**
1. **শ্রেণী সংখ্যা নির্বাচন:** অতিরিক্ত শ্রেণী (১০+) মানচিত্রকে জটিল করে, অতি কম (২-৩) তথ্য হারায়
2. **Threshold-এর বৈজ্ঞানিক ভিত্তি:** আপনার শ্রেণী সীমানা যুক্তিসঙ্গত হতে হবে — সাহিত্য বা বিশেষজ্ঞ মতামতের ভিত্তিতে

---

## ৭. অনুশীলন (Practice Task)
1. একটি DEM থেকে Slope তৈরি করুন (Raster → Analysis → Slope)
2. Slope-কে ৪টি শ্রেণীতে Reclassify করুন (সমতল/মৃদু/মাঝারি/খাড়া)
3. একটি NDVI Raster-কে ৫টি শ্রেণীতে Reclassify করুন
4. Reclassified Raster-এ Unique Values Symbology প্রয়োগ করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Continuous থেকে Categorical Reclassification করতে পারবেন
- ✅ QGIS-এ Reclassify by Table ও Raster Calculator উভয় পদ্ধতি ব্যবহার করতে পারবেন
- ✅ কৃষি সূচকের (pH, NDVI, Slope) যথাযথ শ্রেণীবিন্যাস করতে পারবেন
- ✅ Boundary Value সমস্যা এড়াতে পারবেন`
    },
    {
      title: 'Lesson 4.4 — Resampling, Reprojection ও Raster Alignment',
      slug: 'raster-resampling-reprojection',
      order_index: 4,
      content: `# Lesson 4.4 — Resampling, Reprojection ও Raster Alignment

## ১. কী শিখবেন (Learning Objectives)
- Raster Reprojection কী এবং কেন দরকার তা বোঝা
- Resampling Method (Nearest Neighbor, Bilinear, Cubic) নির্বাচন করা
- Raster Alignment-এর ধারণা ও প্রয়োগ আয়ত্ত করা
- ভিন্ন Resolution ও CRS-এর Raster একত্রে ব্যবহারের নিয়ম শেখা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনি Raster Algebra করতে চান — Sentinel-2 NDVI (10m, EPSG:32646) এবং SRTM DEM (30m, EPSG:4326)। দুটি Raster-এর CRS ভিন্ন, Resolution ভিন্ন, এবং Pixel গ্রিড Aligned নয়। সরাসরি Calculator-এ Expression লিখলে ভুল ফলাফল আসবে।

**সমাধান:** Reprojection ও Resampling করে দুটি Raster Align করুন।

---

## ৩. মূল ধারণা

### Raster Reprojection
একটি Raster-কে একটি CRS থেকে অন্য CRS-এ রূপান্তর। Vector Reprojection-এর মতো, কিন্তু Raster-এ প্রতিটি Pixel-এর মান পুনঃগণনা করতে হয়।

### Resampling Method

Reprojection বা Resolution পরিবর্তনের সময় নতুন Pixel-এর মান কীভাবে নির্ধারণ হবে:

| Method | কাজ | উপযুক্ত ডেটা |
| :--- | :--- | :--- |
| **Nearest Neighbor** | নিকটতম মূল Pixel-এর মান নেয় | Categorical ডেটা (Land cover, Classification) |
| **Bilinear** | ৪টি নিকটতম Pixel-এর Weighted Average | Continuous ডেটা (DEM, Temperature) |
| **Cubic** | ১৬টি নিকটতম Pixel-এর Weighted Average | Continuous ডেটা (মসৃণ ফলাফল, কিন্তু ধীর) |

> [!IMPORTANT]
> **Categorical Raster-এ Bilinear ব্যবহার করবেন না!** Land Cover Map-এ Pixel মান 1=Water, 2=Forest, 3=Agriculture। Bilinear Average করলে 1.5 বা 2.3 আসবে — যার কোনো অর্থ নেই! Categorical ডেটায় সবসময় **Nearest Neighbor** ব্যবহার করুন।

### Raster Alignment
দুটি Raster-কে একই:
- CRS
- Resolution (Pixel size)
- Extent (সীমানা)
- Grid Origin

তে আনার প্রক্রিয়া।

---

## ৪. QGIS Workflow

### Reprojection
\`\`\`text
QGIS: Raster → Projections → Warp (Reproject)

Input: DEM_WGS84.tif
Source CRS: EPSG:4326
Target CRS: EPSG:32646
Resampling method: Bilinear (DEM = Continuous)
Output resolution: 30 (meters)
Output: DEM_UTM46N.tif
\`\`\`

### Align Rasters
\`\`\`text
QGIS: Processing Toolbox → Raster analysis → Align rasters

Input layers:
  - Sentinel2_NDVI.tif (10m, EPSG:32646)
  - DEM.tif (30m, EPSG:32646)

Reference layer: Sentinel2_NDVI.tif
Resampling: 
  - NDVI: Nearest Neighbor
  - DEM: Bilinear
Output resolution: 10 (match reference)
\`\`\`

---

## ৫. Resolution পরিবর্তন: Upsampling বনাম Downsampling

| পরিবর্তন | ব্যাখ্যা | সতর্কতা |
| :--- | :--- | :--- |
| **Downsampling** (30m → 100m) | Resolution কমানো, ফাইল ছোট | তথ্য হারায় |
| **Upsampling** (30m → 10m) | Resolution বাড়ানো | **নতুন তথ্য তৈরি হয় না!** শুধু Pixel ছোট হয় |

> [!WARNING]
> **Upsampling = False Precision।** 30m DEM-কে 10m-এ Resample করলে Pixel ছোট হবে, কিন্তু মূল ডেটার চেয়ে বেশি Detail পাওয়া যাবে না। এটি বিভ্রান্তিকর — রিপোর্টে মনে হবে উচ্চ Resolution, কিন্তু বাস্তবে তথ্যের মান ৩০m-ই রয়ে গেছে।

---

## ৬. Failure Mode

**সাধারণ ভুল:**
1. **Categorical Raster-এ Bilinear/Cubic:** Land Cover শ্রেণী অর্থহীন হয়ে যায়
2. **Resolution Mismatch ignore করা:** 10m ও 250m Raster সরাসরি Algebra করলে Pixel Alignment ভুল হয়
3. **CRS ভুলে Raster Algebra:** Geographic ও Projected CRS মেশালে Pixel-এর ভৌগোলিক অবস্থান মিলবে না

---

## ৭. অনুশীলন (Practice Task)
1. SRTM DEM (EPSG:4326) → EPSG:32646-এ Reproject করুন (Bilinear)
2. Land Cover Raster (30m) → 10m-এ Resample করুন (Nearest Neighbor)
3. দুটি ভিন্ন Resolution-এর Raster Align করুন
4. Aligned Raster দিয়ে Raster Algebra (NDVI × Slope) করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Nearest Neighbor, Bilinear, Cubic Resampling-এর পার্থক্য ও সঠিক ব্যবহার জানবেন
- ✅ Raster Reprojection ও Alignment QGIS-এ করতে পারবেন
- ✅ Upsampling-এর False Precision সমস্যা বুঝবেন
- ✅ Multi-source Raster Analysis-এর আগে প্রস্তুতিমূলক পদক্ষেপ জানবেন`
    },
    {
      title: 'Lesson 4.5 — Mosaic, Subset ও Raster Data Management',
      slug: 'raster-mosaic-subset-management',
      order_index: 5,
      content: `# Lesson 4.5 — Mosaic, Subset ও Raster Data Management

## ১. কী শিখবেন (Learning Objectives)
- একাধিক Raster Tile-কে Mosaic করে একটি Raster তৈরি করা
- বড় Raster থেকে নির্দিষ্ট এলাকা Subset/Clip করা
- Raster File Format (GeoTIFF, COG, VRT) বোঝা
- Raster Data Management Best Practices আয়ত্ত করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনি বাংলাদেশের SRTM DEM ডাউনলোড করেছেন — কিন্তু বাংলাদেশ ৪টি SRTM Tile-এ বিভক্ত। আবার, আপনি শুধু রাজশাহী বিভাগ নিয়ে কাজ করবেন — পুরো দেশের DEM দরকার নেই। প্রথমে ৪টি Tile জোড়া লাগাতে হবে (**Mosaic**), তারপর রাজশাহী সীমানায় কেটে নিতে হবে (**Subset/Clip**)।

---

## ৩. মূল ধারণা

### Mosaic কী?
একাধিক Raster Tile-কে একটি Seamless Raster-এ যুক্ত করা। Satellite imagery সাধারণত Scene/Tile-এ আসে — বড় এলাকা নিয়ে কাজ করতে Mosaic করতে হয়।

\`\`\`text
Tile 1:    Tile 2:         Mosaic:
[█████]    [█████]         [████████████]
[█████]    [█████]    →    [████████████]
[█████]    [█████]         [████████████]
\`\`\`

### Overlap Handling
দুটি Tile-এর ওভারল্যাপ এলাকায় কোন মান রাখবেন?

| পদ্ধতি | ব্যাখ্যা |
| :--- | :--- |
| **First** | প্রথম Tile-এর মান রাখে |
| **Last** | শেষ Tile-এর মান রাখে |
| **Average** | দুটির গড় নেয় |
| **Maximum / Minimum** | সর্বোচ্চ / সর্বনিম্ন মান |

### Raster Clip/Subset
বড় Raster থেকে নির্দিষ্ট এলাকা কেটে নেওয়া — Vector Clip-এর Raster সংস্করণ।

---

## ৪. QGIS Workflow

### Mosaic (Merge)
\`\`\`text
QGIS: Raster → Miscellaneous → Merge

Input layers:
  - N24E089_DEM.tif
  - N24E090_DEM.tif
  - N25E089_DEM.tif
  - N25E090_DEM.tif
Overlap: Average
Output: Bangladesh_DEM_merged.tif
\`\`\`

### Clip by Extent
\`\`\`text
QGIS: Raster → Extraction → Clip Raster by Extent

Input: Bangladesh_DEM_merged.tif
Clipping extent: [Calculate from Layer → রাজশাহী বিভাগ সীমানা]
Output: Rajshahi_DEM.tif
\`\`\`

### Clip by Mask Layer
\`\`\`text
QGIS: Raster → Extraction → Clip Raster by Mask Layer

Input: Bangladesh_DEM_merged.tif
Mask layer: রাজশাহী বিভাগ সীমানা (Polygon)
Assign NoData: -9999 (সীমানার বাইরে)
Output: Rajshahi_DEM_masked.tif
\`\`\`

> [!NOTE]
> **Clip by Extent vs Clip by Mask:** Extent = আয়তক্ষেত্রাকার (Bounding Box) কাটা। Mask = Polygon-এর আকৃতি অনুযায়ী কাটা। Mask-এ বাইরের Pixel NoData হয়ে যায়।

---

## ৫. File Format Guide

| Format | বিশেষত্ব | উপযুক্ত ব্যবহার |
| :--- | :--- | :--- |
| **GeoTIFF** (.tif) | সবচেয়ে সাধারণ, সব সফটওয়্যারে কাজ করে | সর্বদা নিরাপদ পছন্দ |
| **Cloud Optimized GeoTIFF (COG)** | Streaming-ready, বড় ফাইলের জন্য দ্রুত | Cloud/Web mapping |
| **VRT** (Virtual Raster) | ফাইল কপি না করে একাধিক Raster একত্রে দেখায় | Mosaic preview, disk space বাঁচায় |
| **NetCDF** (.nc) | Multi-temporal, Multi-variable | Climate/Weather ডেটা |

### VRT (Virtual Raster) — গুরুত্বপূর্ণ!
\`\`\`text
QGIS: Raster → Miscellaneous → Build Virtual Raster

VRT কী?
- একটি ছোট XML ফাইল যা মূল Raster ফাইলগুলোকে Reference করে
- কোনো ডেটা কপি হয় না — শুধু "পথনির্দেশ"
- Disk space বাঁচায়
- Mosaic-এর মতো দেখায়, কিন্তু মূল ফাইল অপরিবর্তিত থাকে
\`\`\`

> [!TIP]
> **VRT প্রথমে ব্যবহার করুন।** বড় Mosaic তৈরির আগে VRT দিয়ে Preview দেখুন — ফলাফল সন্তোষজনক হলে তারপর Merge করে Physical GeoTIFF তৈরি করুন। এতে GB-আকারের অস্থায়ী ফাইল তৈরি এড়ানো যায়।

---

## ৬. Failure Mode

> [!WARNING]
> **CRS Mismatch in Mosaic:** যদি Tile-গুলোর CRS ভিন্ন হয় (কিছু EPSG:4326, কিছু EPSG:32646), Merge অপারেশন ভুল ফলাফল দেবে বা Error দেবে। **সবগুলো Tile একই CRS-এ Reproject করুন আগে।**

**আরও ভুল:**
1. **Seam Line:** Mosaic-এ Tile-এর সংযোগস্থলে দৃশ্যমান রেখা — Radiometric পার্থক্যের কারণে
2. **Massive File Size:** 10m Resolution-এ সারা বাংলাদেশের Mosaic = GB-আকারের ফাইল — Clip করে ছোট করুন
3. **NoData Conflict:** বিভিন্ন Tile-এ ভিন্ন NoData মান (-9999 বনাম 0) — Mosaic-এর আগে একই করুন

---

## ৭. অনুশীলন (Practice Task)
1. ৪টি SRTM DEM Tile ডাউনলোড করুন এবং VRT তৈরি করুন
2. VRT থেকে Physical Mosaic (GeoTIFF) তৈরি করুন
3. আপনার জেলার সীমানা দিয়ে Mosaic Clip (Mask) করুন
4. Clipped Raster-এর File size মূল Mosaic-এর সাথে তুলনা করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Mosaic, Clip by Extent, Clip by Mask Layer-এর পার্থক্য ব্যাখ্যা করতে পারবেন
- ✅ VRT-এর সুবিধা ও ব্যবহার জানবেন
- ✅ GeoTIFF, COG, VRT, NetCDF Format-এর উপযুক্ততা বুঝবেন
- ✅ Raster Data Management-এর Best Practices প্রয়োগ করতে পারবেন`
    }
  ]
};
