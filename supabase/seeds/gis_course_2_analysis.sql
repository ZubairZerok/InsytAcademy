-- SEED DATA: GIS ANALYSIS & REMOTE SENSING
-- Auto-generated SQL seed

DO $$
DECLARE
  c_id UUID;
  m_id UUID;
  l_id UUID;
BEGIN
  DELETE FROM public.courses WHERE slug = 'gis-analysis-remote-sensing';

  INSERT INTO public.courses (title, slug, description, is_published, thumbnail_url)
  VALUES ('GIS Analysis & Remote Sensing', 'gis-analysis-remote-sensing', 'স্পেশিয়াল বিশ্লেষণ ও রিমোট সেন্সিং শিখুন — Geoprocessing, Terrain Analysis, NDVI, Supervised Classification, Change Detection এবং Field Data Collection।', TRUE, '/images/courses/gis-analysis-remote-sensing.png')
  RETURNING id INTO c_id;

  -- Module: Module 1: Vector Geoprocessing Toolkit
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 1: Vector Geoprocessing Toolkit', 'mod1-vector-geoprocessing', 1, 'Buffer, Clip, Intersect, Union, Dissolve — ভেক্টর বিশ্লেষণের মূল হাতিয়ারগুলো।')
  RETURNING id INTO m_id;

  -- Lesson: 1. Buffer ও Clip: নিকটতা ও কাটিং বিশ্লেষণ
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. Buffer ও Clip: নিকটতা ও কাটিং বিশ্লেষণ', 'buffer-clip-analysis', 1, $markdown$
# Lesson 1: Buffer ও Clip — নিকটতা ও কাটিং বিশ্লেষণ

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
3. সবসময় **Projected CRS** এ কাজ করুন
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Lesson: 2. Intersect, Union ও Dissolve
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '2. Intersect, Union ও Dissolve', 'intersect-union-dissolve', 2, $markdown$
# Lesson 2: Intersect, Union ও Dissolve

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

```
          Input Layer A
              |
    ┌─────────┼──────────┐
    ▼         ▼          ▼
 Intersect  Union    Dissolve
 (A ∩ B)   (A ∪ B)  (Merge by Attr)
```

## সারসংক্ষেপ
1. **Intersect** = দুটি Layer এর Common অংশ (উভয়ের Attribute সহ)
2. **Union** = দুটি Layer কে সম্পূর্ণভাবে একত্রিত
3. **Dissolve** = একই Attribute এর পাশাপাশি Polygon মিশিয়ে দেওয়া
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 2: Raster ও Terrain Analysis
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 2: Raster ও Terrain Analysis', 'mod2-raster-terrain-analysis', 2, 'DEM থেকে Slope, Aspect, Hillshade এবং Zonal Statistics গণনা।')
  RETURNING id INTO m_id;

  -- Lesson: 1. Slope, Aspect ও Hillshade: ভূমি বিশ্লেষণ
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. Slope, Aspect ও Hillshade: ভূমি বিশ্লেষণ', 'slope-aspect-hillshade', 1, $markdown$
# Lesson 1: Slope, Aspect ও Hillshade

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
3. **Hillshade** = 3D ভিজ্যুয়ালাইজেশন → সুন্দর ম্যাপ Basemap
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Lesson: 2. Zonal Statistics: Raster + Vector বিশ্লেষণ
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '2. Zonal Statistics: Raster + Vector বিশ্লেষণ', 'zonal-statistics', 2, $markdown$
# Lesson 2: Zonal Statistics — Raster ও Vector এর মিলন

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
3. আউটপুট Vector Layer এর Attribute Table এ নতুন Column হিসেবে যোগ হয়
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 3: Remote Sensing Fundamentals
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 3: Remote Sensing Fundamentals', 'mod3-remote-sensing', 3, 'রিমোট সেন্সিং এর মূল ধারণা — তড়িৎচুম্বকীয় বর্ণালী, স্পেকট্রাল সিগনেচার ও ডেটা উৎস।')
  RETURNING id INTO m_id;

  -- Lesson: 1. রিমোট সেন্সিং ও তড়িৎচুম্বকীয় বর্ণালী
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. রিমোট সেন্সিং ও তড়িৎচুম্বকীয় বর্ণালী', 'remote-sensing-em-spectrum', 1, $markdown$
# Lesson 1: রিমোট সেন্সিং ও তড়িৎচুম্বকীয় বর্ণালী

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
3. প্রতিটি পদার্থের আলাদা Spectral Signature আছে
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 4: Spectral Indices — NDVI, NDWI, EVI
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 4: Spectral Indices — NDVI, NDWI, EVI', 'mod4-spectral-indices', 4, 'ফসল স্বাস্থ্য ও পানির সূচক — NDVI, NDWI, EVI গণনা ও ব্যাখ্যা।')
  RETURNING id INTO m_id;

  -- Lesson: 1. NDVI: ফসল স্বাস্থ্যের ব্যারোমিটার
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. NDVI: ফসল স্বাস্থ্যের ব্যারোমিটার', 'ndvi-crop-health', 1, $markdown$
# Lesson 1: NDVI — ফসল স্বাস্থ্যের ব্যারোমিটার

## NDVI কী?
**Normalized Difference Vegetation Index (NDVI)** হলো সবচেয়ে জনপ্রিয় Vegetation Index। এটি ফসলের সবুজতা ও স্বাস্থ্য পরিমাপ করে।

## NDVI সূত্র:
```
NDVI = (NIR - Red) / (NIR + Red)
```

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
2. Expression: `("B8@1" - "B4@1") / ("B8@1" + "B4@1")`
3. Output: `NDVI_output.tif`

## কৃষিতে NDVI ব্যবহার:
- 📈 ফসলের বৃদ্ধি পর্যবেক্ষণ (সময় অনুযায়ী NDVI পরিবর্তন)
- 🐛 কীটপতঙ্গ/রোগ আক্রমণ চিহ্নিতকরণ (হঠাৎ NDVI কমে গেলে)
- 🌾 ফলন পূর্বাভাস
- 🔥 খরা প্রভাবিত এলাকা চিহ্নিতকরণ

## সারসংক্ষেপ
1. NDVI = (NIR - Red) / (NIR + Red) → মান -1 থেকে +1
2. বেশি NDVI = বেশি সবুজ/সুস্থ ফসল
3. QGIS Raster Calculator দিয়ে সহজেই গণনা করা যায়
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 5: Supervised Classification
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 5: Supervised Classification', 'mod5-supervised-classification', 5, 'ভূমি আচ্ছাদন শ্রেণিবিভাগ — Training Sites, ML Algorithms ও Accuracy Assessment।')
  RETURNING id INTO m_id;

  -- Lesson: 1. Supervised Classification Pipeline
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. Supervised Classification Pipeline', 'supervised-classification-pipeline', 1, $markdown$
# Lesson 1: Supervised Classification Pipeline

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
3. Random Forest সবচেয়ে নির্ভুল ও জনপ্রিয়
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 6: Change Detection ও Time-Series
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 6: Change Detection ও Time-Series', 'mod6-change-detection', 6, 'সময়ের সাথে ভূমি আচ্ছাদনের পরিবর্তন বিশ্লেষণ — NDVI Time-Series, Pre/Post Comparison।')
  RETURNING id INTO m_id;

  -- Lesson: 1. Change Detection: সময়ের সাথে পরিবর্তন
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. Change Detection: সময়ের সাথে পরিবর্তন', 'change-detection-analysis', 1, $markdown$
# Lesson 1: Change Detection

## Change Detection কী?
দুটি বা ততোধিক সময়ের স্যাটেলাইট ইমেজ তুলনা করে **ভূমি আচ্ছাদনের পরিবর্তন** চিহ্নিত করা।

## পদ্ধতি ১: Post-Classification Comparison
- সময় ১ (যেমন 2020) → Classification → Land Cover Map 2020
- সময় ২ (যেমন 2025) → Classification → Land Cover Map 2025
- দুটি ম্যাপ তুলনা → **Change Matrix** তৈরি

## পদ্ধতি ২: NDVI Differencing
```
ΔNDVI = NDVI_2025 - NDVI_2020

ΔNDVI > 0 → গাছপালা বেড়েছে (সবুজায়ন)
ΔNDVI < 0 → গাছপালা কমেছে (বনউজাড়/শহরায়ন)
ΔNDVI ≈ 0 → কোন পরিবর্তন নেই
```

## বাংলাদেশে ব্যবহার:
- 🌳→🏘️ চট্টগ্রাম পাহাড়ে বনউজাড় → বসতি
- 🌾→🏭 ঢাকার চারপাশে কৃষি জমি → শিল্প অঞ্চল
- 💧→🌾 হাওরে বন্যার পরে ক্ষতিগ্রস্ত ফসলি জমি

## সারসংক্ষেপ
1. দুই সময়ের ইমেজ তুলনা = Change Detection
2. NDVI Differencing সবচেয়ে সহজ পদ্ধতি
3. বনউজাড়, শহরায়ন ও বন্যা ক্ষয়ক্ষতি মূল্যায়নে অপরিহার্য
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 7: GPS ও Field Data Collection
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 7: GPS ও Field Data Collection', 'mod7-field-data-gps', 7, 'মাঠ পর্যায়ে ডেটা সংগ্রহ — GPS, KoboToolbox ও Ground Truth।')
  RETURNING id INTO m_id;

  -- Lesson: 1. GPS, KoboToolbox ও Ground Truthing
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. GPS, KoboToolbox ও Ground Truthing', 'gps-kobotoolbox-ground-truth', 1, $markdown$
# Lesson 1: GPS, KoboToolbox ও Ground Truthing

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
3. Ground Truth ছাড়া Classification Accuracy যাচাই অসম্ভব
$markdown$, NULL)
  RETURNING id INTO l_id;

  -- Module: Module 8: ক্যাপস্টোন — বন্যা প্রভাব মূল্যায়ন
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (c_id, 'Module 8: ক্যাপস্টোন — বন্যা প্রভাব মূল্যায়ন', 'mod8-capstone-flood-assessment', 8, 'সবকিছু একত্রে — বাংলাদেশের হাওর অঞ্চলে বন্যার প্রভাব মূল্যায়ন প্রকল্প।')
  RETURNING id INTO m_id;

  -- Lesson: 1. ক্যাপস্টোন: হাওর অঞ্চলে বন্যার প্রভাব মূল্যায়ন
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url)
  VALUES (m_id, '1. ক্যাপস্টোন: হাওর অঞ্চলে বন্যার প্রভাব মূল্যায়ন', 'capstone-flood-impact', 1, $markdown$
# 🎓 ক্যাপস্টোন: হাওর অঞ্চলে বন্যার প্রভাব মূল্যায়ন

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
Course 2 সম্পন্ন! এখন **Course 3: Geospatial Engineering & Cloud GIS** এ যান — PostGIS, Python, GEE শিখুন!
$markdown$, NULL)
  RETURNING id INTO l_id;

END $$;
