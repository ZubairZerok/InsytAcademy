// =============================================================================
// MODULE 06: HYDROLOGICAL ANALYSIS
// Course 2: Applied GIS Analysis & Remote Sensing
// =============================================================================

module.exports = {
  title: 'Module 06: Hydrological Analysis',
  slug: 'mod-06-hydrological-analysis',
  order_index: 6,
  description: 'DEM থেকে পানির প্রবাহের দিক, নদী নেটওয়ার্ক, ওয়াটারশেড সীমানা ও বন্যা সংবেদনশীলতা বিশ্লেষণ করুন। কৃষি হাইড্রোলজিতে সেচ নালা পরিকল্পনা ও জলাবদ্ধতা মূল্যায়নের জন্য অপরিহার্য দক্ষতা।',
  lessons: [
    {
      title: 'Lesson 6.1 — Flow Direction ও Flow Accumulation',
      slug: 'flow-direction-accumulation',
      order_index: 1,
      content: `# Lesson 6.1 — Flow Direction ও Flow Accumulation

## ১. কী শিখবেন (Learning Objectives)
- Flow Direction-এর ধারণা ও D8 Algorithm বোঝা
- Flow Accumulation-এর গণনা পদ্ধতি আয়ত্ত করা
- DEM Fill (Sink Removal)-এর গুরুত্ব বোঝা
- QGIS-এ Hydrological Analysis-এর প্রথম ধাপ সম্পন্ন করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
একটি প্রকল্পে জানতে চান: "বরেন্দ্র অঞ্চলে বৃষ্টির পানি কোন দিকে প্রবাহিত হয় এবং কোথায় সবচেয়ে বেশি পানি জমা হয়?" এটি জানতে আপনাকে DEM থেকে প্রতিটি Pixel-এর জন্য পানির প্রবাহের দিক এবং সংগৃহীত পানির পরিমাণ গণনা করতে হবে।

---

## ৩. মূল ধারণা

### Step 0: DEM Fill (Sink Removal)
প্রকৃত DEM-এ অনেক "Sink" বা গর্ত থাকে — যেখানে পানি আটকে যায় এবং আর প্রবাহিত হয় না। এগুলো DEM-এর ত্রুটি (Data artifact)। Hydrological Analysis-এর আগে **Fill** করে Sink মুছতে হবে।

\`\`\`text
Original DEM:     Filled DEM:
10  8  9          10  8  9
 7  3  6    →      7  6  6
 8  5  7           8  5  7
    ↑ Sink (3)        ↑ Filled to 6
\`\`\`

### Flow Direction (D8 Algorithm)
প্রতিটি Cell থেকে পানি কোন প্রতিবেশী Cell-এ প্রবাহিত হবে — সবচেয়ে নিচু প্রতিবেশীর দিকে।

\`\`\`text
D8 Direction Encoding:
 32  64  128
 16  ●    1
  8   4    2

DEM:              Flow Direction:
10  8  9          4   4   8
 7  6  6          4   4   4
 8  5  7          2   ●   8
\`\`\`

### Flow Accumulation
প্রতিটি Cell-এ কতগুলো Upstream Cell-এর পানি প্রবাহিত হয়ে আসে।

\`\`\`text
Flow Accumulation:
0   0   0
0   3   1     ← Cell (2,2)-তে ৩টি Upstream Cell-এর পানি আসে
0   8   0     ← Cell (3,2)-তে ৮টি Cell-এর পানি জমা = নদী/নালা
\`\`\`

> [!IMPORTANT]
> **উচ্চ Flow Accumulation = নদী বা নালা।** Flow Accumulation মান যত বেশি, সেই Cell দিয়ে তত বেশি পানি প্রবাহিত হয়। একটি Threshold (যেমন > ১০০০) সেট করে আপনি Stream Network বের করতে পারেন।

---

## ৪. QGIS Workflow

\`\`\`text
Step 1: Fill Sinks
QGIS: Processing Toolbox → SAGA → Terrain Analysis → 
Fill Sinks (Wang & Liu)
Input: DEM.tif → Output: DEM_Filled.tif

Step 2: Flow Direction
QGIS: Processing Toolbox → SAGA → Terrain Analysis → 
Flow Direction → Output: Flow_Dir.tif

Step 3: Flow Accumulation
Processing Toolbox → SAGA → Terrain Analysis → 
Flow Accumulation → Output: Flow_Acc.tif
\`\`\`

---

## ৫. কৃষি প্রয়োগ

Flow Accumulation Map থেকে:
- **উচ্চ Accumulation** = প্রাকৃতিক নালার পথ → সেচ নালা এই পথে বসালে কার্যকর
- **নিম্ন Accumulation** = পাহাড়চূড়া/ঢালের উপরি অংশ → খরা-প্রবণ, সেচ দরকার
- **মধ্যম Accumulation** = পানি সংগ্রহের সম্ভাবনা → পুকুর/জলাধার স্থাপনের জন্য

---

## ৬. Failure Mode

> [!WARNING]
> **Fill না করে Flow Direction চালানো:** Sink থাকলে পানি সেখানে আটকে যাবে এবং Flow Accumulation সারাদেশে সঠিকভাবে কাজ করবে না। **সবসময় Fill → Flow Direction → Flow Accumulation ক্রমে কাজ করুন।**

---

## ৭. অনুশীলন (Practice Task)
1. আপনার জেলার DEM Fill করুন
2. Flow Direction ও Flow Accumulation গণনা করুন
3. Flow Accumulation > ৫০০ Pixel চিহ্নিত করুন (এগুলো সম্ভাব্য নদী/নালা)
4. Flow Accumulation Map-কে Pseudocolor-এ দেখুন — প্রধান প্রবাহ পথগুলো চিহ্নিত করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Fill, Flow Direction, Flow Accumulation-এর ক্রম ও উদ্দেশ্য ব্যাখ্যা করতে পারবেন
- ✅ D8 Algorithm-এর মূল নীতি বুঝবেন
- ✅ Flow Accumulation থেকে নদী/নালা চিহ্নিত করতে পারবেন
- ✅ Sink Removal-এর গুরুত্ব ব্যাখ্যা করতে পারবেন`
    },
    {
      title: 'Lesson 6.2 — Stream Network Extraction ও Strahler Order',
      slug: 'stream-network-strahler',
      order_index: 2,
      content: `# Lesson 6.2 — Stream Network Extraction ও Strahler Order

## ১. কী শিখবেন (Learning Objectives)
- Flow Accumulation থেকে Stream Network বের করা
- Threshold নির্বাচনের প্রভাব বোঝা
- Strahler Stream Order-এর ধারণা আয়ত্ত করা
- Stream Network-এর কৃষি ও জল সম্পদ প্রয়োগ বোঝা

---

## ২. মূল ধারণা

### Stream Extraction
Flow Accumulation-এ একটি Threshold সেট করে "নদী" ও "নদী নয়" আলাদা করা:

\`\`\`text
Threshold = 500:
Flow Acc < 500 → ভূমি (0)
Flow Acc ≥ 500 → নদী/নালা (1)
\`\`\`

| Threshold | ফলাফল |
| :--- | :--- |
| ছোট (১০০) | ঘন Stream Network, ছোট নালাও ধরে |
| মাঝারি (৫০০-১০০০) | প্রধান ও মাধ্যমিক নদী/নালা |
| বড় (৫০০০+) | শুধু প্রধান নদী |

### Strahler Stream Order
নদী নেটওয়ার্কে প্রতিটি শাখার গুরুত্ব পরিমাপ:

\`\`\`text
Order 1: উৎসধারা (কোনো উপনদী নেই)
Order 2: দুটি Order 1 মিলে তৈরি
Order 3: দুটি Order 2 মিলে তৈরি
...

      1   1
       \\ /
    1---2---1
         \\
      1---2
           \\
        2---3 (প্রধান নদী)
\`\`\`

> [!TIP]
> **Strahler Order কৃষিতে:** Order 1-2 = ছোট নালা (স্থানীয় সেচ), Order 3-4 = মাঝারি নদী (উপজেলা পর্যায়ের জল সম্পদ), Order 5+ = প্রধান নদী (বিভাগীয় জল ব্যবস্থাপনা)।

---

## ৩. QGIS Workflow

\`\`\`text
Step 1: Stream Network (Raster Calculator)
("Flow_Acc@1" >= 500) * 1
→ Binary Stream Raster

Step 2: Channel Network (SAGA)
Processing Toolbox → SAGA → Terrain Analysis → Channel Network
Input: DEM_Filled, Threshold: 500
→ Stream Network (Vector Line) + Strahler Order

Step 3: Symbolize by Order
Stream Layer → Categorized by "ORDER"
Order 1: পাতলা নীল
Order 2: মাঝারি নীল
Order 3+: মোটা গাঢ় নীল
\`\`\`

---

## ৪. Failure Mode

> [!WARNING]
> **Threshold নির্বাচন Subjective।** কোনো "সঠিক" Threshold নেই — এটি আপনার বিশ্লেষণের উদ্দেশ্য, DEM Resolution ও এলাকার উপর নির্ভর করে। সমতল বাংলাদেশে বড় Threshold দিলে প্রধান নদী ছাড়া কিছু দেখাবে না, ছোট Threshold দিলে প্রতিটি ধানক্ষেতের আইল Stream হিসেবে দেখাবে।

---

## ৫. অনুশীলন (Practice Task)
1. তিনটি ভিন্ন Threshold (১০০, ৫০০, ২০০০) দিয়ে Stream Network তৈরি করে তুলনা করুন
2. Strahler Order দিয়ে Stream Network ভিজ্যুয়ালাইজ করুন
3. বাস্তব নদী/নালার সাথে DEM-derived Stream তুলনা করুন

---

## ৬. মূল্যায়ন (Assessment)
- ✅ Threshold-ভিত্তিক Stream Extraction করতে পারবেন
- ✅ Strahler Stream Order ব্যাখ্যা ও প্রয়োগ করতে পারবেন
- ✅ Threshold নির্বাচনের প্রভাব বুঝবেন`
    },
    {
      title: 'Lesson 6.3 — Watershed ও Catchment Delineation',
      slug: 'watershed-catchment-delineation',
      order_index: 3,
      content: `# Lesson 6.3 — Watershed ও Catchment Delineation

## ১. কী শিখবেন (Learning Objectives)
- Watershed (জলবিভাজিকা)-এর ধারণা বোঝা
- Pour Point ভিত্তিক Watershed Delineation শেখা
- Sub-Catchment বিভাজন আয়ত্ত করা
- কৃষি জল সম্পদ পরিকল্পনায় Watershed ব্যবহার করা

---

## ২. মূল ধারণা

### Watershed কী?
একটি নির্দিষ্ট বিন্দুতে (Pour Point) প্রবাহিত হওয়া সমস্ত পানির উৎস এলাকা। Watershed-এর সীমানা (Ridge line) বরাবর পানি দুই দিকে আলাদা হয়ে প্রবাহিত হয়।

\`\`\`text
Watershed Boundary:
    ╱ Ridge ╲
   ╱ ↓     ↓ ╲
  ╱  ↓ ──→ ↓  ╲
 ╱   ↓ →→→ ↓   ╲
 ────── ● ──────
      Pour Point
\`\`\`

### Pour Point
Watershed-এর আউটলেট — যেখানে সব পানি শেষ পর্যন্ত জমা হয় বা বের হয়ে যায়। সাধারণত নদীর কোনো বিন্দু, বাঁধ, বা জলাধারের অবস্থান।

---

## ৩. QGIS Workflow

\`\`\`text
Step 1: Fill DEM → Flow Direction → Flow Accumulation (আগের পাঠ)

Step 2: Pour Point নির্ধারণ
- Flow Accumulation Map-এ সর্বোচ্চ মানের Cell চিহ্নিত করুন
- অথবা আপনার পছন্দমতো বিন্দু (যেমন প্রস্তাবিত বাঁধ) Point Layer-এ তৈরি করুন

Step 3: Watershed Delineation
Processing Toolbox → SAGA → Terrain Analysis → 
Upslope Area
Input: Flow Direction, Pour Point
→ Output: Watershed Boundary (Polygon)
\`\`\`

---

## ৪. কৃষি প্রয়োগ

### কেস: ক্ষুদ্র জলাধার পরিকল্পনা

\`\`\`text
প্রশ্ন: "এই নির্দিষ্ট বিন্দুতে একটি জলাধার বসালে কত বর্গকিলোমিটার 
এলাকা থেকে বৃষ্টির পানি সংগ্রহ হবে?"

Workflow:
1. Pour Point = প্রস্তাবিত জলাধারের অবস্থান
2. Watershed Delineation → Catchment Area
3. Catchment Area × বার্ষিক বৃষ্টিপাত × Runoff Coefficient
   = আনুমানিক বার্ষিক পানি সংগ্রহ
\`\`\`

> [!IMPORTANT]
> **Watershed = প্রাকৃতিক জল ব্যবস্থাপনা একক।** প্রশাসনিক সীমানা (জেলা/উপজেলা) দিয়ে জল সম্পদ পরিকল্পনা করা বৈজ্ঞানিকভাবে ভুল — কারণ পানি প্রশাসনিক সীমানা মানে না। Watershed হলো সঠিক পরিকল্পনা একক।

---

## ৫. Failure Mode

> [!WARNING]
> **Pour Point Snapping:** Pour Point যদি ঠিক Stream Cell-এর উপর না পড়ে, Watershed সম্পূর্ণ ভুল হবে। Pour Point-কে নিকটতম High Flow Accumulation Cell-এ **Snap** করতে হবে।

---

## ৬. অনুশীলন (Practice Task)
1. একটি নদীর বিন্দুতে Pour Point সেট করুন
2. সেই বিন্দুর Watershed Delineate করুন
3. Watershed-এর আয়তন (km²) গণনা করুন
4. Watershed-এর মধ্যে কত কৃষিজমি আছে — Intersect দিয়ে বের করুন

---

## ৭. মূল্যায়ন (Assessment)
- ✅ Watershed-এর ধারণা ও Pour Point ব্যাখ্যা করতে পারবেন
- ✅ DEM থেকে Watershed Delineation করতে পারবেন
- ✅ কৃষি জল সম্পদ পরিকল্পনায় Watershed প্রয়োগ করতে পারবেন`
    },
    {
      title: 'Lesson 6.4 — Topographic Wetness Index (TWI) ও Flood Susceptibility',
      slug: 'twi-flood-susceptibility',
      order_index: 4,
      content: `# Lesson 6.4 — Topographic Wetness Index (TWI) ও Flood Susceptibility

## ১. কী শিখবেন (Learning Objectives)
- TWI (Topographic Wetness Index)-এর ধারণা ও সূত্র বোঝা
- TWI থেকে আর্দ্রতা-প্রবণ ও খরা-প্রবণ এলাকা চিহ্নিত করা
- সরলীকৃত Flood Susceptibility Mapping শেখা
- কৃষিতে TWI-এর প্রয়োগ বোঝা

---

## ২. মূল ধারণা

### TWI কী?
Topographic Wetness Index পরিমাপ করে একটি নির্দিষ্ট স্থানে কতটা পানি জমা হওয়ার সম্ভাবনা আছে — Upslope Contributing Area ও স্থানীয় Slope-এর ভিত্তিতে।

\`\`\`text
TWI = ln(a / tan(β))

a = Specific Catchment Area (Upslope Area / Cell Width)
β = Local Slope (Radians)
\`\`\`

| TWI মান | অর্থ | কৃষি প্রাসঙ্গিকতা |
| :--- | :--- | :--- |
| উচ্চ (>12) | খুব আর্দ্র — পানি জমা হয় | জলাবদ্ধতা ঝুঁকি, ধান চাষে ভালো |
| মধ্যম (7-12) | মাঝারি আর্দ্রতা | বেশিরভাগ ফসলের জন্য উপযুক্ত |
| নিম্ন (<7) | শুষ্ক — পানি দ্রুত বয়ে যায় | খরা ঝুঁকি, সেচ দরকার |

> [!TIP]
> **TWI কৃষিতে অত্যন্ত দরকারি।** সমতল ও নিচু এলাকায় (উচ্চ TWI) ধান/পাট ভালো হয়, ঢাল ও উঁচু এলাকায় (নিম্ন TWI) গম/ভুট্টা/ফলের বাগান উপযুক্ত। ফসল পরিকল্পনায় TWI একটি শক্তিশালী সূচক।

---

## ৩. QGIS Workflow

\`\`\`text
SAGA: Processing Toolbox → SAGA → Terrain Analysis → 
Topographic Wetness Index (TWI)

Input: DEM_Filled.tif
Output: TWI.tif

Symbology: Singleband pseudocolor
Low TWI = হলুদ/বাদামী (শুষ্ক)
High TWI = গাঢ় নীল (আর্দ্র)
\`\`\`

### সরলীকৃত Flood Susceptibility Map

\`\`\`text
TWI + Elevation + Proximity to River = Flood Susceptibility

Raster Calculator:
Flood_Risk = (TWI_normalized * 0.4) + 
             ((Max_Elev - DEM) / Max_Elev * 0.3) + 
             (River_Proximity_normalized * 0.3)

Reclassify:
0.0-0.3 = Low Risk
0.3-0.6 = Moderate Risk
0.6-0.8 = High Risk
0.8-1.0 = Very High Risk
\`\`\`

---

## ৪. Failure Mode

> [!WARNING]
> **সমতল এলাকায় TWI সমস্যা:** বাংলাদেশের সমতল ব-দ্বীপে Slope ≈ 0, ফলে tan(β) ≈ 0 এবং TWI → ∞ (Infinity)। SAGA এটি Handle করে কিন্তু মান অতিরিক্ত বড় হতে পারে। সমতল এলাকায় TWI-র পরম মানের চেয়ে **আপেক্ষিক তুলনা** বেশি অর্থবহ।

---

## ৫. অনুশীলন (Practice Task)
1. DEM থেকে TWI গণনা করুন
2. TWI-কে ৩ শ্রেণীতে Reclassify করুন (শুষ্ক/মাঝারি/আর্দ্র)
3. আর্দ্র এলাকা (উচ্চ TWI) কৃষিজমির সাথে Overlay করে ধান চাষের উপযুক্ত এলাকা চিহ্নিত করুন

---

## ৬. মূল্যায়ন (Assessment)
- ✅ TWI-এর সূত্র ও ব্যাখ্যা দিতে পারবেন
- ✅ TWI থেকে কৃষি সিদ্ধান্ত নিতে পারবেন
- ✅ সরলীকৃত Flood Susceptibility Map তৈরি করতে পারবেন`
    },
    {
      title: 'Lesson 6.5 — কৃষি হাইড্রোলজি: সেচ নালা পরিকল্পনা ও জলাবদ্ধতা বিশ্লেষণ',
      slug: 'agricultural-hydrology-irrigation',
      order_index: 5,
      content: `# Lesson 6.5 — কৃষি হাইড্রোলজি: সেচ নালা পরিকল্পনা ও জলাবদ্ধতা বিশ্লেষণ

## ১. কী শিখবেন (Learning Objectives)
- Hydrological Analysis-এর সব উপাদান একত্রে কৃষি সমস্যায় প্রয়োগ করা
- সেচ নালার প্রাকৃতিক পথ নির্ধারণ করা
- জলাবদ্ধতা-প্রবণ এলাকা চিহ্নিত করা
- একটি পূর্ণাঙ্গ কৃষি হাইড্রোলজি প্রকল্প সম্পন্ন করা

---

## ২. সমস্যা (The Problem)
"রাজশাহীর গোদাগাড়ী উপজেলায় একটি ক্ষুদ্র সেচ প্রকল্পে নালা কোন পথে কাটা উচিত যাতে সর্বাধিক কৃষিজমিতে পানি পৌঁছায়? এবং কোন এলাকায় বর্ষায় জলাবদ্ধতা হওয়ার সম্ভাবনা বেশি?"

---

## ৩. সমন্বিত Workflow

\`\`\`text
Phase A: Terrain Preparation
├── DEM → Fill → Flow Direction → Flow Accumulation
├── Slope, TWI, TPI গণনা
└── Stream Network Extraction (Threshold: 500)

Phase B: সেচ নালা পরিকল্পনা
├── Flow Direction Map → প্রাকৃতিক পানির পথ দেখুন
├── Stream Network → বিদ্যমান নদী/নালার পথ
├── TWI Map → আর্দ্রতা-প্রবণ এলাকা
├── Contour Map → ঢালের দিক ও গ্রেডিয়েন্ট
└── সুপারিশ: নালা প্রাকৃতিক Flow Path অনুসরণ করবে,
    Contour-এর সামান্য কোণে (০.১-০.৫% গ্রেডিয়েন্ট)

Phase C: জলাবদ্ধতা মানচিত্র
├── উচ্চ TWI (>12) → জলাবদ্ধতা ঝুঁকি
├── নিম্ন Slope (<1°) → পানি সহজে নামে না
├── নিম্ন TPI (Valley bottom) → পানি জমা হয়
├── Raster Algebra:
│   Waterlog_Risk = (TWI_high) AND (Slope_low) AND (TPI_negative)
└── Output: জলাবদ্ধতা ঝুঁকি মানচিত্র (High/Medium/Low)
\`\`\`

---

## ৪. আউটপুট ও ব্যাখ্যা

| আউটপুট | ব্যবহার | সিদ্ধান্ত |
| :--- | :--- | :--- |
| Flow Direction Map | নালার পথ নির্ধারণ | প্রাকৃতিক পথে নালা কাটুন |
| TWI Map | আর্দ্রতা বিতরণ | উচ্চ TWI-তে ধান, নিম্ন TWI-তে সবজি/ফল |
| Waterlog Risk Map | জলাবদ্ধতা-প্রবণ এলাকা | নিষ্কাশন নালা (Drainage) পরিকল্পনা |
| Watershed Map | পানি সংগ্রহ এলাকা | জলাধারের আকার নির্ধারণ |

> [!IMPORTANT]
> **GIS-ভিত্তিক Hydrological Analysis একটি প্রাথমিক মূল্যায়ন (Preliminary Assessment)।** সুনির্দিষ্ট সেচ প্রকল্পের জন্য মাঠ জরিপ, মাটি পরীক্ষা, ও হাইড্রোলজিক্যাল ইঞ্জিনিয়ারিং স্টাডি অপরিহার্য। GIS আপনাকে "কোথায় দেখতে হবে" বলে দেয় — "ঠিক কী করতে হবে" বলে দেয় না।

---

## ৫. Failure Mode

> [!WARNING]
> **DEM Resolution ও Flat Terrain:** বাংলাদেশের সমতল এলাকায় ৩০m DEM দিয়ে সেচ নালার সুনির্দিষ্ট পথ নির্ধারণ নির্ভরযোগ্য নয় — কারণ উচ্চতার তারতম্য DEM-এর Vertical Accuracy-র মধ্যে পড়ে। এই ক্ষেত্রে Drone-based DEM (<১m) বা Total Station Survey দরকার।

---

## ৬. অনুশীলন (Capstone Practice)
একটি নির্দিষ্ট উপজেলার জন্য সম্পূর্ণ কৃষি হাইড্রোলজি প্রতিবেদন তৈরি করুন:
1. DEM Processing Pipeline সম্পূর্ণ চালান
2. Stream Network ও Watershed Map তৈরি করুন
3. TWI-ভিত্তিক জলাবদ্ধতা ঝুঁকি মানচিত্র তৈরি করুন
4. সুপারিশসহ ১-পৃষ্ঠার সারসংক্ষেপ লিখুন

---

## ৭. মূল্যায়ন (Assessment)
- ✅ সমন্বিত Hydrological Analysis Pipeline চালাতে পারবেন
- ✅ সেচ নালা ও জলাবদ্ধতা মানচিত্র তৈরি করতে পারবেন
- ✅ GIS Hydrology-এর সীমাবদ্ধতা বুঝবেন
- ✅ কৃষি হাইড্রোলজি প্রতিবেদন তৈরি করতে পারবেন`
    }
  ]
};
