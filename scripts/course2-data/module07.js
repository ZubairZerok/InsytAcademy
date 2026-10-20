// =============================================================================
// MODULE 07: INTERPOLATION & SURFACE MODELING
// Course 2: Applied GIS Analysis & Remote Sensing
// =============================================================================

module.exports = {
  title: 'Module 07: Interpolation & Surface Modeling',
  slug: 'mod-07-interpolation-surface',
  order_index: 7,
  description: 'বিচ্ছিন্ন পয়েন্ট ডেটা (মাটির নমুনা, আবহাওয়া স্টেশন, নলকূপ) থেকে ক্রমাগত পৃষ্ঠ (Continuous Surface) তৈরি করুন। IDW, Kriging, Spline ও TIN পদ্ধতি শিখুন এবং সঠিক পদ্ধতি নির্বাচন ও যথার্থতা মূল্যায়ন করুন।',
  lessons: [
    {
      title: 'Lesson 7.1 — Interpolation কী? Point থেকে Surface তৈরি',
      slug: 'interpolation-concept',
      order_index: 1,
      content: `# Lesson 7.1 — Interpolation কী? Point থেকে Surface তৈরি

## ১. কী শিখবেন (Learning Objectives)
- Interpolation-এর মূল ধারণা ও উদ্দেশ্য বোঝা
- Exact vs. Approximate Interpolator-এর পার্থক্য আয়ত্ত করা
- কৃষি ডেটায় Interpolation-এর প্রয়োজনীয়তা ব্যাখ্যা করা
- Tobler's First Law ও Spatial Autocorrelation-এর সম্পর্ক বোঝা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনার কাছে ময়মনসিংহ জেলার ১২০টি মাটির নমুনার pH মান আছে — প্রতিটি নমুনার GPS কোঅর্ডিনেট ও pH জানা। কিন্তু আপনি পুরো জেলার pH মানচিত্র চান — অর্থাৎ যেখানে নমুনা নেওয়া হয়নি সেখানেও pH-এর আনুমানিক মান জানতে চান। **বিচ্ছিন্ন পয়েন্ট থেকে ক্রমাগত পৃষ্ঠ তৈরি — এটিই Interpolation।**

---

## ৩. মূল ধারণা

### Interpolation-এর মূলনীতি
**Tobler's First Law of Geography:** "Everything is related to everything else, but near things are more related than distant things." — কাছের জিনিস দূরের জিনিসের চেয়ে বেশি সম্পর্কিত।

Interpolation এই নীতির উপর ভিত্তি করে কাজ করে: একটি অজানা অবস্থানের মান তার নিকটবর্তী জানা পয়েন্টগুলোর মান থেকে অনুমান করা হয়।

\`\`\`text
জানা পয়েন্ট:     ●(pH=6.2)     ●(pH=5.8)
                        ?
অজানা অবস্থান:         ●(pH≈6.0) ← Interpolated
\`\`\`

### Exact vs. Approximate Interpolator

| বৈশিষ্ট্য | Exact Interpolator | Approximate Interpolator |
| :--- | :--- | :--- |
| জানা পয়েন্টে | মূল মান হুবহু রাখে | মূল মান থেকে সামান্য ভিন্ন হতে পারে |
| উদাহরণ | IDW, Kriging, TIN | Spline (Regularized), Trend Surface |
| উপযুক্ত | সুনির্দিষ্ট পরিমাপ (pH, তাপমাত্রা) | Noisy ডেটা (কিছু Error আছে) |

> [!IMPORTANT]
> **Interpolation ≠ Extrapolation।** Interpolation জানা পয়েন্টগুলোর মধ্যবর্তী এলাকায় মান অনুমান করে। জানা পয়েন্টগুলোর বাইরের এলাকায় মান অনুমান করাকে **Extrapolation** বলে — যা অনেক কম নির্ভরযোগ্য এবং সাধারণত এড়ানো উচিত।

---

## ৪. কৃষি প্রয়োগ

| ডেটা | Interpolation আউটপুট | ব্যবহার |
| :--- | :--- | :--- |
| মাটির নমুনা (pH, OM, N, P, K) | মাটির গুণমান মানচিত্র | সার সুপারিশ, ফসল নির্বাচন |
| আবহাওয়া স্টেশন (বৃষ্টিপাত, তাপমাত্রা) | জলবায়ু মানচিত্র | ফসল পরিকল্পনা, খরা মূল্যায়ন |
| নলকূপের পানির স্তর | ভূগর্ভস্থ পানির মানচিত্র | সেচ পরিকল্পনা |
| ফসলের ফলন (নমুনা প্লট) | ফলন মানচিত্র | Yield gap বিশ্লেষণ |

---

## ৫. Failure Mode

> [!WARNING]
> **Sample Density সমস্যা:** যদি নমুনা সংখ্যা খুব কম বা খুব অসমভাবে বিতরিত থাকে, Interpolation-এর ফলাফল অবিশ্বাস্য হবে। ১০টি নমুনা দিয়ে পুরো জেলার মানচিত্র তৈরি করা বিপজ্জনক। সাধারণ নিয়ম: **প্রতি বর্গকিলোমিটারে অন্তত ১টি নমুনা** — তবে ডেটার Variability-র উপর নির্ভর করে।

---

## ৬. অনুশীলন (Practice Task)
1. ৫০টি Point (Lat, Lon, pH) সহ একটি CSV QGIS-এ লোড করুন
2. প্রতিটি Point-কে pH মান অনুযায়ী Graduated Color দিন
3. কোন এলাকায় নমুনা ঘনত্ব বেশি/কম — চিহ্নিত করুন
4. "কোথায় বেশি নমুনা দরকার?" — একটি সুপারিশ লিখুন

---

## ৭. মূল্যায়ন (Assessment)
- ✅ Interpolation-এর মূলনীতি ব্যাখ্যা করতে পারবেন
- ✅ Exact ও Approximate Interpolator-এর পার্থক্য বুঝবেন
- ✅ কৃষিতে Interpolation-এর প্রয়োগ চিহ্নিত করতে পারবেন
- ✅ Sample Density-র গুরুত্ব বুঝবেন`
    },
    {
      title: 'Lesson 7.2 — IDW (Inverse Distance Weighted) Interpolation',
      slug: 'idw-interpolation',
      order_index: 2,
      content: `# Lesson 7.2 — IDW (Inverse Distance Weighted) Interpolation

## ১. কী শিখবেন (Learning Objectives)
- IDW-এর গাণিতিক নীতি ও Power parameter বোঝা
- QGIS-এ IDW Interpolation চালানো
- Power parameter-এর প্রভাব বোঝা
- IDW-এর সুবিধা ও সীমাবদ্ধতা জানা

---

## ২. মূল ধারণা

### IDW কীভাবে কাজ করে?
অজানা পয়েন্টের মান = কাছের জানা পয়েন্টগুলোর Weighted Average, যেখানে Weight = 1 / (Distance^p)

\`\`\`text
সূত্র: Z(x) = Σ(Zi / di^p) / Σ(1 / di^p)

Z(x) = অজানা পয়েন্টের অনুমানিত মান
Zi = i-তম জানা পয়েন্টের মান
di = অজানা পয়েন্ট থেকে i-তম পয়েন্টের দূরত্ব
p = Power parameter (সাধারণত ২)
\`\`\`

### Power Parameter-এর প্রভাব

| Power | প্রভাব | ফলাফল |
| :--- | :--- | :--- |
| p = 1 | দূরত্বের প্রভাব কম | মসৃণ Surface, দূরের পয়েন্টও প্রভাব ফেলে |
| p = 2 (ডিফল্ট) | মাঝারি | সবচেয়ে সাধারণ পছন্দ |
| p = 3+ | দূরত্বের প্রভাব বেশি | "Bull's eye" প্যাটার্ন, শুধু খুব কাছের পয়েন্ট প্রভাব ফেলে |

---

## ৩. QGIS Workflow

\`\`\`text
QGIS: Processing Toolbox → Interpolation → IDW Interpolation

Point layer: মাটির_নমুনা (Point)
Interpolation attribute: pH
Distance coefficient (Power): 2
Extent: জেলা সীমানা
Output raster size: 100 (meters)
Output: pH_IDW.tif
\`\`\`

> [!TIP]
> **Bull's Eye Effect:** Power বাড়ালে প্রতিটি নমুনার চারপাশে বৃত্তাকার "Bull's eye" প্যাটার্ন তৈরি হয় — এটি সাধারণত বাস্তবসম্মত নয়। p = 2 একটি ভালো শুরু।

---

## ৪. IDW-এর সুবিধা ও সীমাবদ্ধতা

| সুবিধা | সীমাবদ্ধতা |
| :--- | :--- |
| সহজ ও দ্রুত | জানা মানের চেয়ে বেশি/কম মান তৈরি করে না (No extrapolation beyond data range) |
| কোনো পূর্বানুমান লাগে না | Bull's eye effect |
| সব ধরনের ডেটায় কাজ করে | Anisotropy (দিক-নির্ভর পরিবর্তন) বিবেচনা করে না |
| | Uncertainty/Error পরিমাপ দেয় না |

---

## ৫. অনুশীলন (Practice Task)
1. মাটির pH ডেটায় IDW (p=1, p=2, p=4) দিয়ে তিনটি Surface তৈরি করুন
2. তিনটি Surface তুলনা করুন — কোনটি সবচেয়ে মসৃণ? কোনটিতে Bull's eye আছে?
3. জেলা সীমানায় Clip করুন

---

## ৬. মূল্যায়ন (Assessment)
- ✅ IDW-এর গাণিতিক নীতি ব্যাখ্যা করতে পারবেন
- ✅ Power parameter-এর প্রভাব বুঝবেন
- ✅ IDW-এর সীমাবদ্ধতা (Bull's eye, No uncertainty) জানবেন`
    },
    {
      title: 'Lesson 7.3 — Kriging: Geostatistical Interpolation এর মূলনীতি',
      slug: 'kriging-geostatistical',
      order_index: 3,
      content: `# Lesson 7.3 — Kriging: Geostatistical Interpolation এর মূলনীতি

## ১. কী শিখবেন (Learning Objectives)
- Kriging-এর মূল ধারণা ও IDW থেকে পার্থক্য বোঝা
- Semivariogram-এর প্রাথমিক ধারণা পাওয়া
- Kriging-এর সুবিধা: Uncertainty estimation
- QGIS-এ Kriging চালানোর প্রাথমিক Workflow জানা

---

## ২. মূল ধারণা

### Kriging কী?
Kriging হলো Geostatistical Interpolation — এটি শুধু দূরত্ব নয়, ডেটার **Spatial Structure** (স্থানিক নকশা) বিবেচনা করে। Kriging নিজে বের করে কাছের পয়েন্টগুলো কতটা সম্পর্কিত (Semivariogram) এবং সেই অনুযায়ী Weight নির্ধারণ করে।

### IDW বনাম Kriging

| IDW | Kriging |
| :--- | :--- |
| Weight শুধু দূরত্বের উপর নির্ভর করে | Weight ডেটার Spatial Structure-এর উপর নির্ভর করে |
| কোনো Statistical model নেই | Semivariogram-ভিত্তিক Statistical model |
| শুধু Predicted মান দেয় | Predicted মান + **Prediction Error (Uncertainty)** দেয় |
| দ্রুত ও সহজ | ধীর কিন্তু বেশি তথ্যবহ |

### Semivariogram (সরলীকৃত ব্যাখ্যা)

Semivariogram বলে: "দুটি পয়েন্টের মধ্যে দূরত্ব বাড়লে তাদের মানের পার্থক্য কতটা বাড়ে?"

\`\`\`text
Semivariance
  ▲
  │         ╭────── Sill (সর্বোচ্চ Variance)
  │       ╱
  │     ╱
  │   ╱
  │ ╱ ← Range (এর পরে আর সম্পর্ক নেই)
  │╱
  ●── Nugget (শূন্য দূরত্বে Variance — পরিমাপ ত্রুটি)
  └──────────────► Distance (Lag)
\`\`\`

| Parameter | অর্থ |
| :--- | :--- |
| **Nugget** | শূন্য দূরত্বে Variance — পরিমাপ ত্রুটি বা Micro-scale variation |
| **Sill** | সর্বোচ্চ Variance — এর পরে দূরত্ব বাড়লেও Variance বাড়ে না |
| **Range** | যে দূরত্ব পর্যন্ত Spatial Autocorrelation আছে |

---

## ৩. QGIS Workflow (SAGA Ordinary Kriging)

\`\`\`text
Processing Toolbox → SAGA → Geostatistics → Ordinary Kriging

Points: মাটির_নমুনা (Point)
Attribute: pH
Variogram Model: Spherical (সবচেয়ে সাধারণ)
Output: 
  - Prediction.tif (অনুমানিত মান)
  - Variance.tif (অনিশ্চয়তা মানচিত্র)
\`\`\`

> [!IMPORTANT]
> **Kriging-এর সবচেয়ে বড় সুবিধা: Variance Map।** এটি আপনাকে বলে কোথায় আপনার Interpolation বিশ্বস্ত এবং কোথায় অনিশ্চিত। উচ্চ Variance = কম নমুনা, কম নির্ভরযোগ্য। নিম্ন Variance = বেশি নমুনা, বেশি নির্ভরযোগ্য।

---

## ৪. Failure Mode

> [!WARNING]
> **Kriging সবসময় সেরা নয়।** Kriging তখনই ভালো কাজ করে যখন: (১) ডেটা Spatially Autocorrelated (Tobler's Law মানে), (২) পর্যাপ্ত নমুনা আছে (>৫০), (৩) নমুনা মোটামুটি সমানভাবে বিতরিত। এই শর্ত না মানলে IDW ভালো ফলাফল দিতে পারে।

---

## ৫. অনুশীলন (Practice Task)
1. SAGA Ordinary Kriging দিয়ে pH Surface তৈরি করুন
2. Prediction Map ও Variance Map পাশাপাশি দেখুন
3. কোথায় Variance সবচেয়ে বেশি? সেখানে কি নমুনা কম? যাচাই করুন

---

## ৬. মূল্যায়ন (Assessment)
- ✅ Kriging ও IDW-এর পার্থক্য ব্যাখ্যা করতে পারবেন
- ✅ Semivariogram-এর Nugget, Sill, Range বুঝবেন
- ✅ Variance Map-এর গুরুত্ব ও ব্যাখ্যা জানবেন`
    },
    {
      title: 'Lesson 7.4 — Spline ও TIN Interpolation',
      slug: 'spline-tin-interpolation',
      order_index: 4,
      content: `# Lesson 7.4 — Spline ও TIN Interpolation

## ১. কী শিখবেন (Learning Objectives)
- Spline Interpolation-এর ধারণা ও প্রকারভেদ (Regularized vs. Tension) বোঝা
- TIN (Triangulated Irregular Network)-এর কাঠামো বোঝা
- Spline ও TIN কখন ব্যবহার করবেন শেখা

---

## ২. মূল ধারণা

### Spline Interpolation
গাণিতিক সমীকরণ দিয়ে সবচেয়ে মসৃণ Surface তৈরি করে যা সব পয়েন্টের মধ্য দিয়ে যায় (বা কাছ দিয়ে যায়)।

| Spline ধরন | বৈশিষ্ট্য | ব্যবহার |
| :--- | :--- | :--- |
| **Regularized** | অতি মসৃণ, নমুনা মানের কাছ দিয়ে যায় | বৃষ্টিপাত, তাপমাত্রা |
| **Tension** | নমুনা মানের মধ্য দিয়ে যায়, কম oscillation | উচ্চতা, ভূগর্ভস্থ পানি |

> [!WARNING]
> **Spline Oscillation:** নমুনা মানের বাইরে Spline অতিরিক্ত উচ্চ বা নিম্ন মান তৈরি করতে পারে (Overshoot/Undershoot)। যেমন pH 4.5-7.5 পরিসরের ডেটায় Spline কিছু জায়গায় pH 3.0 বা 8.5 দেখাতে পারে — যা বাস্তবে সম্ভব নয়।

### TIN (Triangulated Irregular Network)
পয়েন্টগুলোকে সরাসরি ত্রিভুজ দিয়ে সংযুক্ত করে একটি Surface তৈরি করে। প্রতিটি ত্রিভুজের মধ্যে Linear Interpolation হয়।

\`\`\`text
TIN:
●───────●
│╲     ╱│
│  ╲ ╱  │
│   ●   │
│  ╱ ╲  │
│╱     ╲│
●───────●
\`\`\`

| TIN সুবিধা | TIN সীমাবদ্ধতা |
| :--- | :--- |
| দ্রুত গণনা | ত্রিভুজের সীমানায় "ভাঁজ" দেখা যায় |
| Variable density সমর্থন করে | মসৃণ নয় |
| Terrain representation-এ ভালো | Extrapolation করে না |

---

## ৩. সব পদ্ধতি তুলনা

| পদ্ধতি | মসৃণতা | গতি | Uncertainty | সেরা ব্যবহার |
| :--- | :--- | :--- | :--- | :--- |
| IDW | মাঝারি | দ্রুত | নেই | দ্রুত preview, সহজ ডেটা |
| Kriging | ভালো | ধীর | আছে ✓ | বৈজ্ঞানিক গবেষণা |
| Spline | খুব ভালো | মাঝারি | নেই | মসৃণ surface (আবহাওয়া) |
| TIN | কম | দ্রুত | নেই | Terrain, অনিয়মিত নমুনা |

---

## ৪. অনুশীলন (Practice Task)
1. একই ডেটায় IDW, Spline, TIN তৈরি করে তুলনা করুন
2. Spline-এ কোথাও Overshoot আছে কিনা দেখুন
3. কোন পদ্ধতি আপনার ডেটার জন্য সবচেয়ে বাস্তবসম্মত ফলাফল দিচ্ছে?

---

## ৫. মূল্যায়ন (Assessment)
- ✅ Spline ও TIN-এর কার্যপদ্ধতি ব্যাখ্যা করতে পারবেন
- ✅ চারটি Interpolation পদ্ধতি তুলনা করতে পারবেন
- ✅ ডেটার ধরন অনুযায়ী সঠিক পদ্ধতি বাছাই করতে পারবেন`
    },
    {
      title: 'Lesson 7.5 — Method Selection ও Accuracy Assessment (Cross-validation, RMSE)',
      slug: 'interpolation-accuracy-assessment',
      order_index: 5,
      content: `# Lesson 7.5 — Method Selection ও Accuracy Assessment

## ১. কী শিখবেন (Learning Objectives)
- Interpolation পদ্ধতি নির্বাচনের মানদণ্ড বোঝা
- Cross-validation-এর ধারণা ও প্রয়োগ আয়ত্ত করা
- RMSE, MAE ও R² ব্যবহার করে Accuracy Assessment করা
- একটি সম্পূর্ণ Interpolation প্রকল্পের Workflow তৈরি করা

---

## ২. মূল ধারণা

### Cross-validation কী?
একটি একটি করে পয়েন্ট বাদ দিয়ে বাকি পয়েন্ট দিয়ে সেই বাদ দেওয়া পয়েন্টের মান Interpolate করা এবং প্রকৃত মানের সাথে তুলনা করা (Leave-One-Out Cross-validation)।

\`\`\`text
৫০টি নমুনা পয়েন্ট আছে:
Round 1: পয়েন্ট ১ বাদ → বাকি ৪৯ দিয়ে Interpolate → পয়েন্ট ১-এ Predicted vs. Actual
Round 2: পয়েন্ট ২ বাদ → বাকি ৪৯ দিয়ে Interpolate → পয়েন্ট ২-এ Predicted vs. Actual
...
Round 50: পয়েন্ট ৫০ বাদ → বাকি ৪৯ দিয়ে → Predicted vs. Actual

→ ৫০টি (Predicted, Actual) জোড়া থেকে Error পরিমাপ
\`\`\`

### Error Metrics

| Metric | সূত্র | ব্যাখ্যা |
| :--- | :--- | :--- |
| **RMSE** | √(Σ(Predicted-Actual)²/n) | সামগ্রিক ভুলের পরিমাণ (একক: মূল ডেটার একক) |
| **MAE** | Σ|Predicted-Actual|/n | গড় পরম ভুল |
| **R²** | 1 - (SS_res/SS_tot) | কতটুকু Variance ব্যাখ্যা করা হয়েছে (0-1) |

> [!IMPORTANT]
> **RMSE তুলনা করুন, শুধু দেখবেন না।** RMSE = ২.৫ ভালো না খারাপ — এটি ডেটার পরিসরের উপর নির্ভর করে। pH (পরিসর ৪-৮)-এ RMSE ২.৫ মানে মারাত্মক ভুল, কিন্তু বৃষ্টিপাত (পরিসর ১০০০-৩০০০ mm)-এ RMSE ২.৫ চমৎকার।

---

## ৩. Method Selection Decision Tree

\`\`\`text
আপনার ডেটা:
├── নমুনা < ৩০? → IDW (Kriging-এর জন্য যথেষ্ট নয়)
├── নমুনা ≥ ৫০ এবং Uncertainty দরকার? → Kriging
├── অতি মসৃণ Surface দরকার? → Spline
├── Terrain/Elevation ডেটা? → TIN
└── দ্রুত Preview দরকার? → IDW (p=2)

চূড়ান্ত সিদ্ধান্ত: Cross-validation RMSE দিয়ে তুলনা করুন!
\`\`\`

---

## ৪. সম্পূর্ণ Interpolation Workflow

\`\`\`text
Step 1: ডেটা পরিদর্শন
├── নমুনা সংখ্যা ও বিতরণ দেখুন
├── Histogram ও Basic Statistics
└── Outlier চিহ্নিত ও বিবেচনা করুন

Step 2: ২-৩টি পদ্ধতিতে Interpolation চালান
├── IDW (p=2)
├── Ordinary Kriging (Spherical variogram)
└── Spline (Regularized)

Step 3: Cross-validation দিয়ে তুলনা
├── প্রতিটির RMSE, MAE, R² গণনা
└── সবচেয়ে কম RMSE → সেরা পদ্ধতি

Step 4: চূড়ান্ত Surface তৈরি
├── সেরা পদ্ধতি দিয়ে Final Raster
├── Clip to Study Area
└── Pseudocolor Symbology

Step 5: রিপোর্টে উল্লেখ করুন
├── পদ্ধতি, Parameter, RMSE
├── নমুনা সংখ্যা ও বিতরণ
└── সীমাবদ্ধতা ও অনিশ্চয়তা
\`\`\`

---

## ৫. Failure Mode

> [!WARNING]
> **পদ্ধতি উল্লেখ না করা:** অনেক রিপোর্টে শুধু "Interpolated soil pH map" লেখা থাকে — কোন পদ্ধতি, কত নমুনা, RMSE কত — কিছুই উল্লেখ থাকে না। এটি অপেশাদার ও অবৈজ্ঞানিক। **সবসময় পদ্ধতি, Parameter ও Accuracy metric রিপোর্টে অন্তর্ভুক্ত করুন।**

---

## ৬. অনুশীলন (Capstone Practice)
মাটির pH ডেটায় একটি সম্পূর্ণ Interpolation প্রকল্প সম্পন্ন করুন:
1. ৩টি পদ্ধতিতে (IDW, Kriging, Spline) Surface তৈরি
2. Cross-validation RMSE তুলনা
3. সেরা পদ্ধতি দিয়ে চূড়ান্ত pH মানচিত্র তৈরি
4. ১ অনুচ্ছেদের মেথডোলজি বিবরণ লিখুন

---

## ৭. মূল্যায়ন (Assessment)
- ✅ Cross-validation প্রক্রিয়া ব্যাখ্যা করতে পারবেন
- ✅ RMSE, MAE, R² গণনা ও ব্যাখ্যা করতে পারবেন
- ✅ সঠিক Interpolation পদ্ধতি নির্বাচনের Decision Tree ব্যবহার করতে পারবেন
- ✅ পেশাদার Interpolation রিপোর্ট লিখতে পারবেন`
    }
  ]
};
