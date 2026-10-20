// =============================================================================
// MODULE 05: DEM & TERRAIN ANALYSIS
// Course 2: Applied GIS Analysis & Remote Sensing
// =============================================================================

module.exports = {
  title: 'Module 05: Digital Elevation Model (DEM) & Terrain Analysis',
  slug: 'mod-05-dem-terrain-analysis',
  order_index: 5,
  description: 'DEM থেকে ভূমির বৈশিষ্ট্য বের করুন — Slope, Aspect, Hillshade, Contour, Curvature, TPI, TRI। SRTM, ASTER, ALOS PALSAR ডেটা সোর্স বোঝা থেকে শুরু করে কৃষি-প্রাসঙ্গিক Terrain Derivatives তৈরি পর্যন্ত।',
  lessons: [
    {
      title: 'Lesson 5.1 — DEM কী? SRTM, ASTER, ALOS PALSAR ডেটা সোর্স',
      slug: 'dem-data-sources',
      order_index: 1,
      content: `# Lesson 5.1 — DEM কী? SRTM, ASTER, ALOS PALSAR ডেটা সোর্স

## ১. কী শিখবেন (Learning Objectives)
- Digital Elevation Model (DEM)-এর সংজ্ঞা ও প্রকারভেদ বোঝা
- DSM, DTM ও DEM-এর পার্থক্য আয়ত্ত করা
- প্রধান বিনামূল্যে DEM ডেটা সোর্স চেনা ও তুলনা করা
- বাংলাদেশের জন্য উপযুক্ত DEM নির্বাচন করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনি একটি Hydrological Analysis করতে চান — "রাজশাহী জেলায় বৃষ্টির পানি কোন দিকে প্রবাহিত হয়?" এই প্রশ্নের উত্তর দিতে আপনার ভূমির উচ্চতার তথ্য দরকার — যেখান থেকে পানি উচ্চ থেকে নিচু এলাকায় প্রবাহিত হওয়ার দিক নির্ণয় করা যাবে। এই উচ্চতার তথ্যই হলো DEM।

---

## ৩. মূল ধারণা

### DEM, DSM ও DTM

| মডেল | পুরো নাম | কী পরিমাপ করে |
| :--- | :--- | :--- |
| **DEM** | Digital Elevation Model | সাধারণ উচ্চতা (DSM বা DTM উভয়কেই বোঝাতে পারে) |
| **DSM** | Digital Surface Model | ভূ-পৃষ্ঠের উপরের সবকিছুর উচ্চতা (গাছ, ভবন সহ) |
| **DTM** | Digital Terrain Model | শুধু খোলা মাটির উচ্চতা (গাছ ও ভবন বাদ) |

\`\`\`text
DSM:    ___/\\___  ___
       /  গাছ  \\/ভবন\\
DTM:   ___________    ___
       শুধু মাটি

DTM = DSM - (গাছ ও ভবনের উচ্চতা)
\`\`\`

> [!IMPORTANT]
> **কৃষি বিশ্লেষণে সাধারণত DTM দরকার** — কারণ আপনি মাটির ঢাল, পানির প্রবাহ ও উচ্চতা জানতে চান, গাছের উচ্চতা নয়। কিন্তু বিনামূল্যে পাওয়া SRTM ও ASTER আসলে DSM — অর্থাৎ গাছ ও ভবনের উচ্চতা অন্তর্ভুক্ত। সমতল কৃষি এলাকায় এটি বড় সমস্যা নয়, কিন্তু বনাঞ্চল বা পাহাড়ি এলাকায় ত্রুটি হতে পারে।

---

## ৪. বিনামূল্যে DEM ডেটা সোর্স তুলনা

| DEM Source | Resolution | Coverage | Sensor | ডাউনলোড |
| :--- | :--- | :--- | :--- | :--- |
| **SRTM** | 30m (~1 arc-sec) | 60°N-56°S | Radar (C-band) | USGS EarthExplorer |
| **ASTER GDEM** | 30m | 83°N-83°S | Stereo optical | NASA Earthdata |
| **ALOS PALSAR** | 12.5m | Global | Radar (L-band) | Alaska SAR Facility |
| **MERIT DEM** | 90m | Global | Multi-source corrected | MERIT Website |
| **Copernicus DEM** | 30m | Global | Radar (TanDEM-X) | Copernicus Open Access |

### বাংলাদেশের জন্য সুপারিশ

| বিশ্লেষণের ধরন | সুপারিশকৃত DEM | কারণ |
| :--- | :--- | :--- |
| জাতীয় পর্যায়ে বন্যা মডেলিং | MERIT DEM (90m) | Hydrological correction করা |
| জেলা পর্যায়ে Terrain Analysis | SRTM 30m বা Copernicus 30m | ভালো মান, সহজলভ্য |
| উপজেলা পর্যায়ে সেচ পরিকল্পনা | ALOS PALSAR 12.5m | উচ্চতর Resolution |
| খামার পর্যায়ের পরিকল্পনা | Drone DEM (< 1m) | সর্বোচ্চ নির্ভুলতা |

---

## ৫. DEM ডাউনলোড ও পরিদর্শন

### USGS EarthExplorer থেকে SRTM ডাউনলোড
\`\`\`text
1. https://earthexplorer.usgs.gov/ → Login
2. Search Criteria → Address/Place → "Rajshahi, Bangladesh"
3. Data Sets → Digital Elevation → SRTM 1 Arc-Second Global
4. Results → Download
5. ফাইল: N24E088.hgt (বা .tif)
\`\`\`

### QGIS-এ DEM পরিদর্শন
\`\`\`text
Layer Properties → Information:
├── Data type: Int16 (SRTM) বা Float32
├── Pixel size: 0.000278° (~30m at equator)
├── NoData: -32768
├── Min: 5m (সমতল এলাকা)
├── Max: 45m (বরেন্দ্র ভূমি)

Layer Properties → Symbology:
├── Render type: Singleband pseudocolor
├── Color ramp: Earth tones (নিচু=সবুজ, উঁচু=বাদামী)
└── Min-Max: 5-45
\`\`\`

---

## ৬. বাস্তব বাংলাদেশ উদাহরণ

### বাংলাদেশের ভূমিরূপ DEM-এ

\`\`\`text
উত্তর-পূর্ব (সিলেট হাওর): 2-8m → অতি নিচু, বন্যাপ্রবণ
উত্তর-পশ্চিম (বরেন্দ্র ভূমি): 20-45m → উঁচু, খরা-প্রবণ
দক্ষিণ (উপকূল): 1-5m → অতি নিচু, জোয়ার-ভাটা প্রভাবিত
পার্বত্য চট্টগ্রাম: 50-1000+m → পাহাড়ি, ভূমিধস-প্রবণ
ঢাকা-ময়মনসিংহ: 8-20m → মধ্যম উচ্চতা
\`\`\`

---

## ৭. Failure Mode

> [!WARNING]
> **Vertical Accuracy সীমাবদ্ধতা:** SRTM-এর Vertical Accuracy ±16m (90% confidence)। বাংলাদেশের সমতল এলাকায় (ভূমির উচ্চতার তারতম্য মাত্র ২-৫ মিটার), এই ত্রুটি আপনার Analysis-কে অর্থহীন করতে পারে। সমতল ব-দ্বীপ অঞ্চলে SRTM DEM দিয়ে ক্ষুদ্র Hydrological Analysis (ছোট নালার দিক) নির্ভরযোগ্য নয়।

---

## ৮. অনুশীলন (Practice Task)
1. USGS EarthExplorer থেকে আপনার জেলার SRTM DEM ডাউনলোড করুন
2. QGIS-এ খুলে Singleband Pseudocolor Symbology প্রয়োগ করুন
3. Identify Tool দিয়ে বিভিন্ন পয়েন্টে উচ্চতা দেখুন
4. Layer Properties → Information → Statistics নোট করুন (Min, Max, Mean)

---

## ৯. মূল্যায়ন (Assessment)
- ✅ DEM, DSM, DTM-এর পার্থক্য ব্যাখ্যা করতে পারবেন
- ✅ SRTM, ASTER, ALOS PALSAR ডেটা সোর্স তুলনা করতে পারবেন
- ✅ বিশ্লেষণের ধরন অনুযায়ী উপযুক্ত DEM নির্বাচন করতে পারবেন
- ✅ বাংলাদেশের সমতল ভূমিতে DEM-এর সীমাবদ্ধতা বুঝবেন`
    },
    {
      title: 'Lesson 5.2 — Slope ও Aspect: ঢাল ও দিক বিশ্লেষণ',
      slug: 'slope-aspect-analysis',
      order_index: 2,
      content: `# Lesson 5.2 — Slope ও Aspect: ঢাল ও দিক বিশ্লেষণ

## ১. কী শিখবেন (Learning Objectives)
- Slope (ঢাল) ও Aspect (দিক)-এর ধারণা ও গাণিতিক ভিত্তি বোঝা
- Degree বনাম Percent Slope-এর পার্থক্য আয়ত্ত করা
- Aspect-এর ৮-দিক ব্যবস্থা বোঝা
- কৃষি ও পরিবেশ বিশ্লেষণে Slope-Aspect প্রয়োগ করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
পার্বত্য চট্টগ্রামে একটি কৃষি প্রকল্প পাহাড়ের ঢালে আদা চাষের জন্য উপযুক্ত এলাকা খুঁজছে। আদা চাষের জন্য: মাঝারি ঢাল (১০-২৫°) দরকার (সমতলে জলাবদ্ধতা, খাড়া ঢালে মাটি ক্ষয়) এবং উত্তর-পূর্ব মুখী ঢাল ভালো (অতিরিক্ত সরাসরি রোদ এড়ানো)। DEM থেকে Slope ও Aspect বের করে এই শর্ত মেলানো সম্ভব।

---

## ৩. মূল ধারণা

### Slope কী?
ভূমির উচ্চতার পরিবর্তনের হার — কতটা "খাড়া" বা "সমতল"।

\`\`\`text
                ╱ (খাড়া ঢাল = High Slope)
              ╱
            ╱
──────────── (সমতল = Low Slope)
\`\`\`

**Slope পরিমাপের দুটি এককঃ**

| একক | সূত্র | উদাহরণ |
| :--- | :--- | :--- |
| **Degree** | arctan(Rise/Run) | ০° = সমতল, ৪৫° = ১:১ ঢাল, ৯০° = সোজা দেয়াল |
| **Percent** | (Rise/Run) × ১০০ | ০% = সমতল, ১০০% = ৪৫°, ৫০% ≈ ২৬.৬° |

> [!TIP]
> **কৃষিতে সাধারণত Degree ব্যবহার হয়।** সড়ক প্রকৌশলে Percent Slope বেশি ব্যবহৃত। QGIS-এ Slope তৈরির সময় Unit নির্বাচন করতে পারবেন।

### Aspect কী?
ভূমির ঢাল কোন দিকে মুখ করে আছে — উত্তর, দক্ষিণ, পূর্ব, পশ্চিম?

\`\`\`text
Aspect Values (Degree):
     360°/0°
       N
       |
  315° |  45°
 NW    |    NE
       |
270°---●---90°
  W    |    E
       |
  225° |  135°
 SW    |    SE
       |
      180°
       S
\`\`\`

### কৃষিতে Aspect-এর গুরুত্ব

| Aspect | সূর্যালোক | প্রভাব (উত্তর গোলার্ধে) |
| :--- | :--- | :--- |
| **দক্ষিণ (S)** | সবচেয়ে বেশি | তাড়াতাড়ি শুকিয়ে যায়, উষ্ণ |
| **উত্তর (N)** | সবচেয়ে কম | আর্দ্র থাকে, শীতল |
| **পূর্ব (E)** | সকালের রোদ | মাঝারি |
| **পশ্চিম (W)** | বিকেলের রোদ | উষ্ণ, শুষ্ক |

---

## ৪. QGIS Workflow

### Slope তৈরি
\`\`\`text
QGIS: Raster → Analysis → Slope

Input: DEM.tif
Z factor: 1 (যদি CRS-এ Horizontal ও Vertical Unit একই)
Output: Slope_degree.tif
\`\`\`

### Aspect তৈরি
\`\`\`text
QGIS: Raster → Analysis → Aspect

Input: DEM.tif
Output: Aspect_degree.tif (0-360°)
\`\`\`

> [!WARNING]
> **Z Factor সতর্কতা:** যদি আপনার DEM-এর CRS Geographic (EPSG:4326) হয়, তাহলে Horizontal unit হলো Degree আর Vertical unit হলো Meter। এই Mismatch Slope-কে ভুলভাবে খুব কম দেখাবে। সমাধান: DEM-কে Projected CRS-এ Reproject করুন অথবা Z Factor ≈ 111120 (1° latitude ≈ 111,120 meter) ব্যবহার করুন।

---

## ৫. কৃষি প্রয়োগ

### কেস: আদা চাষের উপযুক্ত ঢাল

\`\`\`text
Step 1: Slope তৈরি (DEM → Slope)
Step 2: Reclassify Slope:
  0-5°   = অনুপযুক্ত (জলাবদ্ধতা ঝুঁকি)
  5-10°  = কম উপযুক্ত
  10-25° = উপযুক্ত ✓
  >25°   = অনুপযুক্ত (মাটি ক্ষয় ঝুঁকি)

Step 3: Aspect তৈরি (DEM → Aspect)
Step 4: Reclassify Aspect:
  0-90° (N-E) = উপযুক্ত ✓
  90-180° (E-S) = গ্রহণযোগ্য
  180-360° (S-W-N) = কম উপযুক্ত

Step 5: Raster Algebra
  Suitability = Slope_class * Aspect_class
  (উভয় শর্ত পূরণ = সর্বোচ্চ উপযুক্ততা)
\`\`\`

---

## ৬. Failure Mode

> [!WARNING]
> **Flat Area Aspect:** সম্পূর্ণ সমতল এলাকায় (Slope = 0°) Aspect-এর কোনো অর্থ নেই — কারণ ঢালই নেই তো দিক কী হবে! QGIS সমতল এলাকায় Aspect = -1 বা NoData দেখায়। এই Pixel গুলো বিশ্লেষণ থেকে বাদ দিন।

---

## ৭. অনুশীলন (Practice Task)
1. DEM থেকে Slope (Degree) ও Aspect তৈরি করুন
2. Slope-কে ৪টি শ্রেণীতে Reclassify করুন
3. Aspect-কে ৮টি দিকে (N, NE, E, SE, S, SW, W, NW) Reclassify করুন
4. "মাঝারি ঢাল (১০-২৫°) + উত্তর-পূর্ব মুখী" এলাকা চিহ্নিত করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Slope ও Aspect-এর গাণিতিক ভিত্তি ব্যাখ্যা করতে পারবেন
- ✅ Degree ও Percent Slope-এর পার্থক্য বুঝবেন
- ✅ Z Factor সমস্যা ও সমাধান জানবেন
- ✅ কৃষি সাইট সিলেকশনে Slope-Aspect প্রয়োগ করতে পারবেন`
    },
    {
      title: 'Lesson 5.3 — Hillshade ও Terrain Visualization',
      slug: 'hillshade-terrain-visualization',
      order_index: 3,
      content: `# Lesson 5.3 — Hillshade ও Terrain Visualization

## ১. কী শিখবেন (Learning Objectives)
- Hillshade-এর ধারণা ও তৈরির পদ্ধতি বোঝা
- Azimuth ও Altitude parameter-এর প্রভাব বোঝা
- DEM Visualization কৌশল আয়ত্ত করা (Hillshade overlay, Multi-directional)
- পেশাদার Terrain মানচিত্র তৈরি করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনি একটি DEM-কে Pseudocolor-এ ভিজ্যুয়ালাইজ করেছেন — নিচু এলাকা সবুজ, উঁচু এলাকা বাদামী। কিন্তু ম্যাপটি "ফ্ল্যাট" দেখাচ্ছে — ভূমির ত্রিমাত্রিক রূপ বোঝা যাচ্ছে না। পাহাড়, উপত্যকা, খাদ — কিছুই স্পষ্ট নয়।

**সমাধান:** Hillshade — কৃত্রিম আলোকিত ছায়া দিয়ে ভূমির ত্রিমাত্রিক অনুভূতি তৈরি।

---

## ৩. মূল ধারণা: Hillshade

### Hillshade কী?
একটি কাল্পনিক সূর্য থেকে DEM-এর উপর আলো ফেললে কোন অংশ আলোকিত ও কোন অংশ ছায়ায় থাকবে — তার গণনা।

### দুটি মূল Parameter

| Parameter | অর্থ | ডিফল্ট মান |
| :--- | :--- | :--- |
| **Azimuth** | সূর্যের দিক (0°=N, 90°=E, 180°=S, 270°=W) | 315° (NW) |
| **Altitude** | সূর্যের উচ্চতা কোণ (0°=দিগন্ত, 90°=ঠিক মাথার উপর) | 45° |

\`\`\`text
Azimuth = 315° (NW থেকে আলো):
  আলোকিত: SE-মুখী ঢাল (উজ্জ্বল)
  ছায়ায়: NW-মুখী ঢাল (অন্ধকার)
\`\`\`

---

## ৪. QGIS Workflow

### Basic Hillshade
\`\`\`text
QGIS: Raster → Analysis → Hillshade

Input: DEM.tif
Z factor: 1 (বা 111120 যদি Geographic CRS)
Azimuth: 315
Altitude: 45
Output: Hillshade.tif
\`\`\`

### Hillshade + DEM Overlay (পেশাদার ভিজ্যুয়ালাইজেশন)
\`\`\`text
1. Hillshade Layer → Symbology: Singleband gray
2. DEM Layer → Symbology: Singleband pseudocolor (Earth tones)
3. DEM Layer → Transparency → Global opacity: 50-60%
4. DEM Layer-কে Hillshade-এর উপরে রাখুন

ফলাফল: রঙিন উচ্চতা + ত্রিমাত্রিক ছায়া = পেশাদার Terrain Map!
\`\`\`

> [!TIP]
> **Blending Mode ব্যবহার করুন।** Layer Properties → Symbology → Blending mode: "Multiply" সেট করলে DEM-এর রঙ ও Hillshade-এর ছায়া সুন্দরভাবে মিশে যায় — আলাদাভাবে Opacity adjust করার চেয়ে ভালো ফলাফল দেয়।

---

## ৫. Multi-directional Hillshade

একটি দিক থেকে আলো দিলে কিছু ফিচার ছায়ায় লুকিয়ে যায়। সমাধান: একাধিক দিক থেকে Hillshade তৈরি করে Merge করা।

\`\`\`text
Hillshade_NW (Azimuth: 315°)
Hillshade_NE (Azimuth: 45°)
Hillshade_SE (Azimuth: 135°)

Combined = (NW + NE + SE) / 3
\`\`\`

> [!NOTE]
> **QGIS 3.x-এ Multi-directional Hillshade সরাসরি পাওয়া যায়:** Processing Toolbox → GDAL → Raster analysis → Hillshade → Multidirectional checkbox চালু করুন।

---

## ৬. Vertical Exaggeration (Z Factor)

বাংলাদেশের সমতল এলাকায় (উচ্চতার তারতম্য মাত্র ২-৫ মিটার) সাধারণ Hillshade-এ কিছুই দেখা যায় না। **Z Factor বাড়িয়ে** ভূমির ক্ষুদ্র তারতম্য দৃশ্যমান করুন:

| এলাকা | Z Factor | কারণ |
| :--- | :--- | :--- |
| পার্বত্য চট্টগ্রাম | 1-2 | প্রাকৃতিক উচ্চতা যথেষ্ট |
| বরেন্দ্র ভূমি | 5-10 | মৃদু ঢাল দৃশ্যমান করতে |
| সমতল ব-দ্বীপ | 20-50 | অতি ক্ষুদ্র তারতম্য দেখাতে |

---

## ৭. Failure Mode

> [!WARNING]
> **অতিরিক্ত Z Factor:** Z Factor = ৫০ দিলে ভূমির ক্ষুদ্র তারতম্য দেখা যাবে, কিন্তু মনে হবে বিশাল পাহাড় আছে — যা বিভ্রান্তিকর। রিপোর্টে অবশ্যই Z Factor উল্লেখ করুন।

---

## ৮. অনুশীলন (Practice Task)
1. DEM থেকে Hillshade তৈরি করুন (Azimuth: 315°, Altitude: 45°)
2. DEM + Hillshade Overlay তৈরি করুন (Blending Mode: Multiply)
3. সমতল এলাকায় Z Factor = 20 দিয়ে Hillshade তৈরি করে তুলনা করুন
4. Multi-directional Hillshade তৈরি করুন

---

## ৯. মূল্যায়ন (Assessment)
- ✅ Hillshade-এর ধারণা ও Azimuth/Altitude parameter ব্যাখ্যা করতে পারবেন
- ✅ DEM + Hillshade Overlay দিয়ে পেশাদার Terrain Map তৈরি করতে পারবেন
- ✅ Z Factor-এর সঠিক ব্যবহার জানবেন
- ✅ Multi-directional Hillshade-এর সুবিধা বুঝবেন`
    },
    {
      title: 'Lesson 5.4 — Contour Generation ও Profile Analysis',
      slug: 'contour-generation-profile',
      order_index: 4,
      content: `# Lesson 5.4 — Contour Generation ও Profile Analysis

## ১. কী শিখবেন (Learning Objectives)
- DEM থেকে Contour Line (সমোচ্চ রেখা) তৈরি করা
- Contour Interval নির্বাচনের নিয়ম বোঝা
- Elevation Profile (Cross-Section) তৈরি করা
- কৃষি পরিকল্পনায় Contour ও Profile ব্যবহার করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনি একটি পাহাড়ি এলাকায় সেচ নালা পরিকল্পনা করছেন। পানি মাধ্যাকর্ষণে প্রবাহিত হবে, তাই নালার পথ ভূমির উচ্চতার সাথে সামঞ্জস্যপূর্ণ হতে হবে। Contour Line দেখলে বুঝবেন কোন পথে পানি স্বাভাবিকভাবে যাবে এবং কোথায় বাঁধ দিতে হবে।

---

## ৩. মূল ধারণা

### Contour Line কী?
সমান উচ্চতার বিন্দুগুলোকে সংযুক্ত করা রেখা। টপোগ্রাফিক মানচিত্রের সবচেয়ে পরিচিত উপাদান।

\`\`\`text
Contour Map:
    ╭─── 20m ───╮
   ╱  ╭── 15m ──╮  ╲
  ╱  ╱  ╭─ 10m ─╮  ╲  ╲
 ╱  ╱  ╱          ╲  ╲  ╲

ঘন Contour = খাড়া ঢাল
পাতলা Contour = মৃদু ঢাল
\`\`\`

### Contour Interval নির্বাচন

| এলাকার ধরন | উচ্চতার তারতম্য | সুপারিশকৃত Interval |
| :--- | :--- | :--- |
| সমতল ব-দ্বীপ (বরিশাল) | ১-৫m | ০.৫m বা ১m |
| মধ্যম উচ্চতা (বরেন্দ্র) | ১০-৪৫m | ৫m |
| পাহাড়ি (চট্টগ্রাম) | ৫০-১০০০m | ২০m বা ৫০m |

### Elevation Profile কী?
একটি নির্দিষ্ট লাইন বরাবর ভূমির উচ্চতার Cross-Section — কোন দিকে ভূমি উঁচু হচ্ছে, কোথায় নিচু, কোথায় সমতল।

---

## ৪. QGIS Workflow

### Contour Generation
\`\`\`text
QGIS: Raster → Extraction → Contour

Input: DEM.tif
Band: 1
Interval between contour lines: 5 (meters)
Attribute name: ELEV
Output: Contour_5m.gpkg (Vector Line)
\`\`\`

### Elevation Profile
\`\`\`text
QGIS: View → Elevation Profile (QGIS 3.26+)

1. Elevation Profile Panel খুলুন
2. DEM Layer যোগ করুন
3. Map-এ একটি Line আঁকুন (যেমন নদী থেকে বরেন্দ্র ভূমি পর্যন্ত)
4. Profile দেখুন: X-axis = দূরত্ব, Y-axis = উচ্চতা
\`\`\`

---

## ৫. কৃষি প্রয়োগ

### কেস: সেচ নালা পরিকল্পনা

Contour Line ব্যবহার করে সেচ নালার পথ নির্ধারণ:
- **নালা Contour Line-এর সমান্তরালে** চললে পানি ধীরে প্রবাহিত হয়
- **নালা Contour Line-কে সরাসরি অতিক্রম** করলে পানি দ্রুত প্রবাহিত হয়
- **নালা সামান্য কোণে Contour অতিক্রম** করলে নিয়ন্ত্রিত প্রবাহ হয় (আদর্শ)

> [!TIP]
> **Index Contour ব্যবহার করুন।** প্রতি ৫ম Contour Line-কে মোটা করুন (Index Contour) এবং উচ্চতা লেবেল দিন। এটি মানচিত্র পড়া অনেক সহজ করে। QGIS-এ: ELEV % 25 = 0 শর্তে Rule-based Styling।

---

## ৬. Failure Mode

> [!WARNING]
> **Noisy Contour:** কম Resolution DEM থেকে ছোট Interval-এ Contour তৈরি করলে অসংখ্য অর্থহীন, জটিল রেখা তৈরি হয়। ৩০m DEM থেকে ০.৫m Contour তৈরি করবেন না — DEM-এর Vertical Accuracy-র চেয়ে ছোট Interval ব্যবহারযোগ্য নয়।

---

## ৭. অনুশীলন (Practice Task)
1. DEM থেকে ৫m Interval-এ Contour তৈরি করুন
2. Index Contour (প্রতি ২৫m) আলাদা Style দিন
3. একটি নদী-বরাবর Elevation Profile তৈরি করুন
4. Profile থেকে নদীর ঢালের হার (Gradient) অনুমান করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ DEM থেকে Contour Line তৈরি করতে পারবেন
- ✅ Contour Interval সঠিকভাবে নির্বাচন করতে পারবেন
- ✅ Elevation Profile তৈরি ও ব্যাখ্যা করতে পারবেন
- ✅ কৃষি পরিকল্পনায় Contour ব্যবহার করতে পারবেন`
    },
    {
      title: 'Lesson 5.5 — Terrain Derivatives: Curvature, TPI, TRI ও Ruggedness',
      slug: 'terrain-derivatives-tpi-tri',
      order_index: 5,
      content: `# Lesson 5.5 — Terrain Derivatives: Curvature, TPI, TRI ও Ruggedness

## ১. কী শিখবেন (Learning Objectives)
- Curvature (Profile ও Plan)-এর ধারণা ও কৃষি প্রাসঙ্গিকতা বোঝা
- Topographic Position Index (TPI)-এর ধারণা ও Landform Classification শেখা
- Terrain Ruggedness Index (TRI)-এর ব্যবহার বোঝা
- এই Derivatives কৃষি ও পরিবেশ বিশ্লেষণে কীভাবে প্রয়োগ হয় শেখা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনি জানেন Slope কত — কিন্তু ঢালটি কি উত্তল (Convex) নাকি অবতল (Concave)? এটি গুরুত্বপূর্ণ — কারণ Convex ঢালে পানি ছড়িয়ে যায় (মাটি ক্ষয়), Concave ঢালে পানি জমা হয় (জলাবদ্ধতা)। শুধু Slope-Aspect দিয়ে এই পার্থক্য ধরা যায় না।

---

## ৩. মূল ধারণা

### Curvature (বক্রতা)

**Profile Curvature:** ঢালের দিকে (Downslope) বক্রতা — পানির প্রবাহ ত্বরান্বিত হচ্ছে কি ধীর হচ্ছে?

| মান | অর্থ | প্রভাব |
| :--- | :--- | :--- |
| ঋণাত্মক (−) | Convex (উত্তল) | পানি ত্বরান্বিত হয়, মাটি ক্ষয় বেশি |
| ০ | সরলরেখা | সমান প্রবাহ |
| ধনাত্মক (+) | Concave (অবতল) | পানি ধীর হয়, পলি জমে, আর্দ্রতা বেশি |

**Plan Curvature:** ঢালের সাথে সমকোণে (Across-slope) বক্রতা — পানি কি কেন্দ্রীভূত হচ্ছে কি ছড়িয়ে যাচ্ছে?

### Topographic Position Index (TPI)

TPI = একটি Cell-এর উচ্চতা − চারপাশের Cell-এর গড় উচ্চতা

| TPI মান | অর্থ | Landform |
| :--- | :--- | :--- |
| বড় ধনাত্মক (++) | চারপাশের চেয়ে অনেক উঁচু | পাহাড়চূড়া, Ridge |
| ছোট ধনাত্মক (+) | চারপাশের চেয়ে কিছুটা উঁচু | Upper slope |
| ≈ ০ | চারপাশের সমান | সমতল, Mid-slope |
| ছোট ঋণাত্মক (−) | চারপাশের চেয়ে কিছুটা নিচু | Lower slope, Valley side |
| বড় ঋণাত্মক (−−) | চারপাশের চেয়ে অনেক নিচু | Valley bottom, Depression |

> [!IMPORTANT]
> **TPI কৃষিতে অত্যন্ত গুরুত্বপূর্ণ।** Valley bottom (TPI << 0) = আর্দ্র, উর্বর পলিমাটি, ধান চাষে উপযুক্ত। Ridge top (TPI >> 0) = শুষ্ক, বাতাস-প্রবণ, শুষ্ক ফসল বা বাগান চাষে উপযুক্ত।

### Terrain Ruggedness Index (TRI)

TRI প্রতিটি Cell ও তার প্রতিবেশীদের উচ্চতার পার্থক্যের পরম মানের গড় — ভূমি কতটা "অসমতল" বা "রুক্ষ"।

| TRI মান | ভূমির ধরন | কৃষি প্রাসঙ্গিকতা |
| :--- | :--- | :--- |
| ০-৮০ | সমতল-মৃদু | যান্ত্রিক চাষ সম্ভব |
| ৮০-২০০ | মাঝারি রুক্ষ | সাবধানে চাষ |
| ২০০-৩০০ | রুক্ষ | শুধু হাতে চাষ |
| ৩০০+ | অতি রুক্ষ | চাষ অসম্ভব |

---

## ৪. QGIS Workflow

### Curvature
\`\`\`text
QGIS: Processing Toolbox → SAGA → Terrain Analysis → 
Slope, Aspect, Curvature

Input: DEM.tif
Output: Profile Curvature, Plan Curvature
\`\`\`

### TPI
\`\`\`text
QGIS: Processing Toolbox → GDAL → Raster analysis → 
Topographic Position Index (TPI)

Input: DEM.tif
Radius: 10 (cells) — বিশ্লেষণ এলাকার আকার
Output: TPI.tif
\`\`\`

### TRI
\`\`\`text
QGIS: Processing Toolbox → GDAL → Raster analysis → 
Terrain Ruggedness Index (TRI)

Input: DEM.tif
Output: TRI.tif
\`\`\`

---

## ৫. সব Terrain Derivative একত্রে

| Derivative | কী বলে | কৃষি সিদ্ধান্ত |
| :--- | :--- | :--- |
| **Slope** | কতটা খাড়া | যান্ত্রিক চাষ সম্ভব কি না |
| **Aspect** | কোন দিকে মুখ | সূর্যালোক ও আর্দ্রতা |
| **Hillshade** | আলো-ছায়া | ভিজ্যুয়ালাইজেশন |
| **Curvature** | উত্তল/অবতল | পানির প্রবাহ ও ক্ষয় |
| **TPI** | অবস্থান (চূড়া/উপত্যকা) | মাটির আর্দ্রতা ও উর্বরতা |
| **TRI** | রুক্ষতা | যন্ত্রপাতি ব্যবহারযোগ্যতা |

---

## ৬. Failure Mode

> [!WARNING]
> **TPI Window Size সংবেদনশীলতা:** TPI-র ফলাফল Radius (Window size)-এর উপর নির্ভর করে। ছোট Radius (৫ cell) = স্থানীয় মাইক্রো-ল্যান্ডফর্ম ধরে। বড় Radius (৫০ cell) = আঞ্চলিক ল্যান্ডফর্ম ধরে। একটি Cell ছোট Window-এ "চূড়া" কিন্তু বড় Window-এ "সমতল" হতে পারে! আপনার বিশ্লেষণের স্কেলের সাথে সামঞ্জস্যপূর্ণ Radius নির্বাচন করুন।

---

## ৭. অনুশীলন (Practice Task)
1. DEM থেকে Profile Curvature, TPI ও TRI তৈরি করুন
2. TPI-কে ৫টি Landform শ্রেণীতে Reclassify করুন (Valley, Lower slope, Flat, Upper slope, Ridge)
3. TRI-কে ৪টি শ্রেণীতে Reclassify করুন (সমতল/মৃদু/রুক্ষ/অতি রুক্ষ)
4. কোন Landform-এ (TPI class) গড় TRI সবচেয়ে বেশি — Zonal Statistics দিয়ে বের করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Curvature, TPI, TRI-এর ধারণা ও গণনা পদ্ধতি ব্যাখ্যা করতে পারবেন
- ✅ TPI দিয়ে Landform Classification করতে পারবেন
- ✅ TPI Window Size-এর প্রভাব বুঝবেন
- ✅ সব Terrain Derivative কৃষি সিদ্ধান্তে প্রয়োগ করতে পারবেন`
    }
  ]
};
