// =============================================================================
// MODULE 03: SPATIAL QUERY & SELECTION MASTERY
// Course 2: Applied GIS Analysis & Remote Sensing
// =============================================================================

module.exports = {
  title: 'Module 03: Spatial Query & Selection Mastery',
  slug: 'mod-03-spatial-query-selection',
  order_index: 3,
  description: 'Location-based ও Attribute-based Query-এর উন্নত কৌশল শিখুন। Select by Location, Select by Expression, Spatial Join, Summary Statistics এবং Complex Query Pipeline দিয়ে সুনির্দিষ্ট ডেটা নিষ্কাশন করুন।',
  lessons: [
    {
      title: 'Lesson 3.1 — Select by Location: Contains, Intersects, Within Distance',
      slug: 'select-by-location-advanced',
      order_index: 1,
      content: `# Lesson 3.1 — Select by Location: Contains, Intersects, Within Distance

## ১. কী শিখবেন (Learning Objectives)
- Select by Location-এর বিভিন্ন Spatial Predicate বোঝা
- Contains, Within, Intersects, Crosses, Touches-এর পার্থক্য আয়ত্ত করা
- Within Distance-এর ব্যবহার শেখা
- কৃষি ডেটায় Spatial Selection প্রয়োগ করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনি জানতে চান: "সিলেট জেলার কোন কোন চা বাগান হাওর এলাকার ৫ km-এর মধ্যে অবস্থিত?" এই প্রশ্নের উত্তর দিতে আপনাকে একটি লেয়ারের ফিচারগুলোকে অন্য লেয়ারের ফিচারের সাথে **ভৌগোলিক সম্পর্ক** (Spatial Relationship) দিয়ে বাছাই করতে হবে।

---

## ৩. মূল ধারণা: Spatial Predicates

### Spatial Predicate কী?
দুটি ফিচারের মধ্যে ভৌগোলিক সম্পর্ক পরীক্ষা করার গাণিতিক শর্ত।

| Predicate | অর্থ | উদাহরণ |
| :--- | :--- | :--- |
| **Intersects** | যেকোনো অংশে স্পর্শ বা ওভারল্যাপ করে | রাস্তা কোন ইউনিয়নের মধ্য দিয়ে গেছে? |
| **Contains** | A-এর ভিতরে B সম্পূর্ণ আছে | কোন জেলায় কোন নদী সম্পূর্ণভাবে আছে? |
| **Within** | B-এর ভিতরে A সম্পূর্ণ আছে (Contains-এর বিপরীত) | কোন নলকূপ কৃষিজমির ভিতরে? |
| **Crosses** | A B-কে অতিক্রম করে | কোন রাস্তা নদী পার করেছে? |
| **Touches** | সীমানায় স্পর্শ করে, ওভারল্যাপ নেই | কোন দুটি ইউনিয়ন পাশাপাশি? |
| **Within Distance** | নির্দিষ্ট দূরত্বের মধ্যে | হাওর থেকে ৫km-এর মধ্যে কোন চা বাগান? |
| **Disjoint** | কোনো সম্পর্ক নেই | কোন ইউনিয়ন বন্যা এলাকায় পড়ে না? |

### সবচেয়ে ব্যবহৃত: Intersects

> [!TIP]
> **Intersects সবচেয়ে নিরাপদ।** আপনি যদি নিশ্চিত না হন কোন Predicate ব্যবহার করবেন — Intersects দিয়ে শুরু করুন। এটি "যেকোনো ধরনের ভৌগোলিক স্পর্শ বা ওভারল্যাপ" ধরে — তাই কোনো ফিচার মিস হয় না।

---

## ৪. QGIS Workflow

### Select by Location
\`\`\`text
QGIS Menu: Vector → Research Tools → Select by Location

Select features from: চা বাগান (Point/Polygon)
Where the features:  Are within a distance of
By comparing to:     হাওর এলাকা (Polygon)
Distance:            5000 meters
Modify current selection: Creating new selection
\`\`\`

### ধাপে ধাপে:
1. **Input Layer সেট করুন** — কোন লেয়ারের ফিচার বাছাই করবেন (চা বাগান)
2. **Predicate বেছে নিন** — Intersects / Within / Within Distance ইত্যাদি
3. **Comparison Layer সেট করুন** — কোন লেয়ারের সাথে তুলনা হবে (হাওর)
4. **Distance (ঐচ্ছিক)** — Within Distance-এর ক্ষেত্রে দূরত্ব সেট করুন
5. **Run করুন** — নির্বাচিত ফিচার হাইলাইট হবে

> [!IMPORTANT]
> **Select ≠ Delete।** Select by Location ফিচার বাদ দেয় না — শুধু Highlight করে। নির্বাচিত ফিচার আলাদা লেয়ারে রাখতে চাইলে: Right-click → Export → Save Selected Features As...

---

## ৫. বাস্তব কৃষি উদাহরণ

### কেস ১: বন্যায় ক্ষতিগ্রস্ত স্কুল চিহ্নিতকরণ
\`\`\`text
Select features from: প্রাথমিক বিদ্যালয় (Point)
Where: Intersects
By comparing to: ২০২৩ বন্যা প্লাবিত এলাকা (Polygon)
→ ফলাফল: বন্যায় প্লাবিত এলাকার ভিতরে থাকা বিদ্যালয়গুলো
\`\`\`

### কেস ২: সেচ ক্যানালের কাছের কৃষিজমি
\`\`\`text
Select features from: কৃষিজমি (Polygon)
Where: Are within a distance of
By comparing to: সেচ ক্যানাল (Line)
Distance: 500 meters
→ ফলাফল: ক্যানাল থেকে ৫০০m-এর মধ্যে থাকা কৃষিজমি
\`\`\`

### কেস ৩: কোন ইউনিয়নে নলকূপ নেই?
\`\`\`text
Select features from: ইউনিয়ন (Polygon)
Where: Are disjoint
By comparing to: গভীর নলকূপ (Point)
→ ফলাফল: যেসব ইউনিয়নে একটিও গভীর নলকূপ নেই
\`\`\`

---

## ৬. Failure Mode

> [!WARNING]
> **CRS Mismatch + Within Distance = বিপর্যয়:** Within Distance-এ দূরত্ব Layer-এর CRS Unit-এ পরিমাপ হয়। EPSG:4326 (Geographic)-এ ৫০০০ দিলে ৫,০০০ Degrees হবে — পুরো পৃথিবী নির্বাচিত হবে! অবশ্যই Projected CRS ব্যবহার করুন।

**আরও ভুল:**
1. **Input ও Comparison Layer উল্টে দেওয়া** — "কোন নলকূপ ধানক্ষেতের ভিতরে" ≠ "কোন ধানক্ষেতে নলকূপ আছে"
2. **Contains বনাম Intersects বিভ্রান্তি** — একটি নদী যদি ইউনিয়নের সীমানা পার করে, Contains তা ধরবে না কিন্তু Intersects ধরবে

---

## ৭. অনুশীলন (Practice Task)
নিচের প্রতিটি প্রশ্নের জন্য কোন Predicate ব্যবহার করবেন লিখুন:
1. "কোন বাজার/হাট জাতীয় মহাসড়কের ২ km-এর মধ্যে?"
2. "কোন ধানক্ষেত বন্যা এলাকার সাথে ওভারল্যাপ করে?"
3. "কোন ইউনিয়নে কোনো প্রাথমিক স্বাস্থ্য কেন্দ্র নেই?"
4. "কোন রাস্তা নদী পার করেছে?"

---

## ৮. মূল্যায়ন (Assessment)
- ✅ ৭টি Spatial Predicate-এর পার্থক্য ব্যাখ্যা করতে পারবেন
- ✅ Select by Location QGIS-এ চালাতে পারবেন
- ✅ কৃষি প্রশ্নের জন্য সঠিক Predicate বাছাই করতে পারবেন
- ✅ CRS-related Distance ভুল এড়াতে পারবেন`
    },
    {
      title: 'Lesson 3.2 — Select by Attribute: SQL Expressions, Wildcards ও Compound Conditions',
      slug: 'select-by-attribute-sql',
      order_index: 2,
      content: `# Lesson 3.2 — Select by Attribute: SQL Expressions, Wildcards ও Compound Conditions

## ১. কী শিখবেন (Learning Objectives)
- QGIS Expression Builder-এ SQL-style Query লেখা শেখা
- Comparison, Logical ও String Operators আয়ত্ত করা
- Wildcard (LIKE, ILIKE) ও IN Operator ব্যবহার করা
- Complex Compound Conditions তৈরি করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনার কাছে বাংলাদেশের ৪,৫৫৪টি ইউনিয়নের ডেটা আছে। আপনি শুধু সেই ইউনিয়নগুলো চান যেখানে: জনসংখ্যা > ২০,০০০ এবং আবাদযোগ্য জমি > ৫০০ হেক্টর এবং জেলার নাম "রাজশাহী" বা "নাটোর"। হাতে হাতে খোঁজা অসম্ভব — SQL Expression দিয়ে সেকেন্ডে বের করতে পারবেন।

---

## ৩. মূল ধারণা: Expression Syntax

### মৌলিক Comparison Operators

| Operator | অর্থ | উদাহরণ |
| :--- | :--- | :--- |
| = | সমান | "district" = 'Rajshahi' |
| != বা <> | সমান নয় | "crop" != 'Rice' |
| > | বড় | "yield" > 4.0 |
| < | ছোট | "rainfall_mm" < 1500 |
| >= | বড় বা সমান | "area_ha" >= 500 |
| <= | ছোট বা সমান | "depth_m" <= 20 |
| BETWEEN | পরিসরে | "ph" BETWEEN 5.5 AND 7.0 |
| IS NULL | খালি মান | "soil_type" IS NULL |
| IS NOT NULL | খালি নয় | "yield" IS NOT NULL |

### Logical Operators

| Operator | অর্থ | উদাহরণ |
| :--- | :--- | :--- |
| AND | এবং (দুটি শর্তই সত্য) | "yield" > 4 AND "district" = 'Bogra' |
| OR | অথবা (যেকোনো একটি সত্য) | "crop" = 'Rice' OR "crop" = 'Wheat' |
| NOT | নয় (শর্তের বিপরীত) | NOT "district" = 'Dhaka' |

### String Operators ও Wildcards

\`\`\`text
LIKE:   "upazila" LIKE 'Savar%'       → Savar দিয়ে শুরু
LIKE:   "upazila" LIKE '%ganj'         → ganj দিয়ে শেষ
LIKE:   "upazila" LIKE '%pur%'         → pur আছে যেকোনো জায়গায়
ILIKE:  "name" ILIKE '%rice%'          → Case-insensitive
IN:     "district" IN ('Rajshahi', 'Natore', 'Chapainawabganj')
\`\`\`

> [!TIP]
> **% = যেকোনো সংখ্যক Character, _ = ঠিক একটি Character।** 'M_mensingh' → Mymensingh ধরবে, Mamensingh ধরবে, কিন্তু Mymensinghh ধরবে না।

---

## ৪. QGIS Workflow

### Expression Builder ব্যবহার
\`\`\`text
QGIS: Layer → Open Attribute Table → Select by Expression (ε icon)

Expression:
"population" > 20000 
AND "arable_land_ha" > 500 
AND "district" IN ('Rajshahi', 'Natore')
\`\`\`

### Field Calculator-এ Expression
\`\`\`text
নতুন ফিল্ড তৈরি: "yield_category"
Expression:
CASE
  WHEN "yield_mt_ha" >= 5.0 THEN 'High'
  WHEN "yield_mt_ha" >= 3.5 THEN 'Medium'
  WHEN "yield_mt_ha" >= 2.0 THEN 'Low'
  ELSE 'Very Low'
END
\`\`\`

---

## ৫. বাস্তব কৃষি উদাহরণ

### কেস: ক্ষুদ্র সেচ প্রকল্পের জন্য ইউনিয়ন নির্বাচন

\`\`\`text
শর্ত:
1. বৃষ্টিপাত < ১৫০০ mm/year (খরা-প্রবণ)
2. ভূগর্ভস্থ পানির স্তর <= ১৫m (নলকূপ সম্ভব)
3. কৃষিজমি > ৩০০ ha (যথেষ্ট চাষযোগ্য জমি)
4. বিভাগ = রাজশাহী বা রংপুর

Expression:
"rainfall_mm" < 1500 
AND "gw_depth_m" <= 15 
AND "agri_land_ha" > 300 
AND "division" IN ('Rajshahi', 'Rangpur')
\`\`\`

---

## ৬. Failure Mode

> [!WARNING]
> **String Case Sensitivity:** 'Rajshahi' ≠ 'rajshahi' ≠ 'RAJSHAHI'। LIKE Case-sensitive, ILIKE Case-insensitive। যদি আপনার ডেটায় Mixed case থাকে, ILIKE ব্যবহার করুন অথবা lower("district") = 'rajshahi' ব্যবহার করুন।

**আরও ভুল:**
1. **Single Quote বনাম Double Quote:** ফিল্ড নাম "double quote"-এ, মান 'single quote'-এ। উল্টে দিলে Error
2. **NULL-এর সাথে তুলনা:** "yield" = NULL কাজ করবে না! "yield" IS NULL ব্যবহার করুন
3. **OR-এর ফাঁদ:** "district" = 'Rajshahi' OR 'Natore' কাজ করবে না! "district" = 'Rajshahi' OR "district" = 'Natore' লিখতে হবে, অথবা IN ব্যবহার করুন

---

## ৭. অনুশীলন (Practice Task)
নিচের প্রতিটি শর্তের জন্য QGIS Expression লিখুন:
1. জনসংখ্যা ৫০,০০০-র বেশি এবং কৃষিজমি ১,০০০ হেক্টরের বেশি
2. ফসল "Rice" অথবা "Wheat" অথবা "Maize"
3. উপজেলার নাম "pur" দিয়ে শেষ হয় এবং বিভাগ "Khulna"
4. মাটির pH ৫.৫ থেকে ৭.০ এর মধ্যে এবং জৈব পদার্থ NULL নয়

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Comparison, Logical ও String Operator ব্যবহার করতে পারবেন
- ✅ LIKE/ILIKE Wildcard সঠিকভাবে ব্যবহার করতে পারবেন
- ✅ Complex Compound Expression লিখতে পারবেন
- ✅ NULL handling ও Case sensitivity ভুল এড়াতে পারবেন`
    },
    {
      title: 'Lesson 3.3 — Spatial Join: Point-in-Polygon, Nearest Neighbor Join',
      slug: 'spatial-join-techniques',
      order_index: 3,
      content: `# Lesson 3.3 — Spatial Join: Point-in-Polygon, Nearest Neighbor Join

## ১. কী শিখবেন (Learning Objectives)
- Spatial Join-এর ধারণা ও প্রকারভেদ বোঝা
- Point-in-Polygon Join আয়ত্ত করা
- Nearest Neighbor Join শেখা
- Attribute Table Join বনাম Spatial Join-এর পার্থক্য বোঝা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনার কাছে দুটি ডেটাসেট আছে:
1. **Point Layer:** ৫০০টি মাটির নমুনার অবস্থান ও pH মান
2. **Polygon Layer:** উপজেলা সীমানা ও কৃষি পরিসংখ্যান

আপনি জানতে চান: "প্রতিটি উপজেলায় মাটির গড় pH কত?" এর জন্য আপনাকে Point গুলোকে তাদের অবস্থান অনুযায়ী সংশ্লিষ্ট Polygon-এর সাথে যুক্ত করতে হবে — এটিই **Spatial Join**।

---

## ৩. মূল ধারণা: Spatial Join

### Attribute Join বনাম Spatial Join

| Attribute Join | Spatial Join |
| :--- | :--- |
| একটি সাধারণ ফিল্ডের মান মিলিয়ে যুক্ত করে | ভৌগোলিক অবস্থানের ভিত্তিতে যুক্ত করে |
| দরকার: Common Key Field (যেমন upazila_code) | দরকার: উভয় লেয়ারে Geometry |
| Table-to-Table | Layer-to-Layer |

### Spatial Join-এর প্রকারভেদ

**১. Point-in-Polygon (সবচেয়ে সাধারণ)**
প্রতিটি Point কোন Polygon-এর ভিতরে আছে তা নির্ধারণ করে এবং সেই Polygon-এর Attribute Point-এ যুক্ত করে।

\`\`\`text
মাটির নমুনা (Point):     ●₁  ●₂  ●₃     ●₄  ●₅
উপজেলা (Polygon):    [—— উপজেলা A ——] [—— উপজেলা B ——]

Join Result:
●₁ → উপজেলা A-এর Attributes যুক্ত
●₂ → উপজেলা A-এর Attributes যুক্ত
●₃ → উপজেলা A-এর Attributes যুক্ত
●₄ → উপজেলা B-এর Attributes যুক্ত
●₅ → উপজেলা B-এর Attributes যুক্ত
\`\`\`

**২. Nearest Neighbor Join**
প্রতিটি ফিচারের নিকটতম ফিচারের Attribute যুক্ত করে এবং দূরত্ব গণনা করে।

\`\`\`text
কৃষিজমি (Polygon):  ■₁        ■₂        ■₃
বাজার (Point):         ●ₐ              ●ᵦ

Join Result:
■₁ → নিকটতম বাজার: ●ₐ (দূরত্ব: ২.৩ km)
■₂ → নিকটতম বাজার: ●ₐ (দূরত্ব: ১.১ km)
■₃ → নিকটতম বাজার: ●ᵦ (দূরত্ব: ০.৮ km)
\`\`\`

---

## ৪. QGIS Workflow

### Point-in-Polygon Join
\`\`\`text
QGIS: Processing Toolbox → Vector general → Join attributes by location

Input layer: মাটির নমুনা (Point)
Join layer: উপজেলা সীমানা (Polygon)
Geometric predicate: Intersects (বা Within)
Join type: Create separate feature for each matching feature (one-to-many)
           অথবা Take attributes of the first matching feature (one-to-one)
Fields to add: upazila_name, district_name, division
\`\`\`

### Nearest Neighbor Join
\`\`\`text
QGIS: Processing Toolbox → Vector general → Join attributes by nearest

Input layer: কৃষিজমি (Polygon centroid)
Input layer 2: বাজার/হাট (Point)
Maximum nearest neighbors: 1
Maximum distance: 50000 (50 km cap)
Output: joined_layer.gpkg (নতুন ফিল্ড: nearest_market, distance)
\`\`\`

---

## ৫. বাস্তব কৃষি উদাহরণ

### কেস ১: উপজেলা-ভিত্তিক মাটির pH সারসংক্ষেপ
\`\`\`text
Step 1: Spatial Join (Point-in-Polygon)
  মাটির নমুনা (Point) + উপজেলা (Polygon)
  → প্রতিটি নমুনায় upazila_name যুক্ত

Step 2: Dissolve by upazila_name + Mean(pH)
  → প্রতিটি উপজেলার গড় মাটির pH

Step 3: Graduated Symbology
  → pH অনুযায়ী রঙিন থিমেটিক ম্যাপ
\`\`\`

### কেস ২: নিকটতম Cold Storage-র দূরত্ব
\`\`\`text
Nearest Join:
  আলু উৎপাদন এলাকা → Cold Storage
  → প্রতিটি এলাকার নিকটতম Storage ও দূরত্ব
  → "দূরত্ব > ২০ km" → Critical Gap
\`\`\`

> [!IMPORTANT]
> **Spatial Join = GIS-এর সবচেয়ে শক্তিশালী Integration টুলগুলোর একটি।** যখনই আপনার দুটি ভিন্ন ডেটাসেটে Common Key Field নেই কিন্তু ভৌগোলিক সম্পর্ক আছে — Spatial Join আপনার সমাধান।

---

## ৬. Failure Mode

> [!WARNING]
> **Duplicate Records (One-to-Many):** একটি Point যদি দুটি Overlapping Polygon-এর মধ্যে পড়ে (যেমন Administrative + Ecological zone), Join-এ সেই Point দুবার আসবে। ফলে Record Count বেড়ে যাবে এবং পরবর্তী গণনা ভুল হবে। **সবসময় Join-এর পর Record Count যাচাই করুন।**

**আরও ভুল:**
1. **Polygon Gap-এ Point পড়া:** ইউনিয়ন সীমানায় ছোট Gap থাকলে কিছু Point কোনো Polygon-এ Join হবে না (NULL)
2. **Nearest Join-এ Maximum Distance না দেওয়া:** সারাদেশে Join হলে দূরতম Point-ও Join হবে (৩০০+ km দূরের বাজার!)

---

## ৭. অনুশীলন (Practice Task)
1. ২০০টি নলকূপ Point-কে ইউনিয়ন Polygon-এ Spatial Join করুন
2. প্রতিটি ইউনিয়নে কতটি নলকূপ আছে — Count করুন (Dissolve)
3. প্রতিটি কৃষিজমি Polygon-এর নিকটতম সড়কের দূরত্ব বের করুন (Nearest Join)
4. যেসব কৃষিজমি সড়ক থেকে > ৫ km দূরে — চিহ্নিত করুন

---

## ৮. মূল্যায়ন (Assessment)
- ✅ Point-in-Polygon ও Nearest Neighbor Join-এর পার্থক্য ব্যাখ্যা করতে পারবেন
- ✅ QGIS-এ উভয় ধরনের Spatial Join সম্পন্ন করতে পারবেন
- ✅ One-to-Many Duplicate সমস্যা চিহ্নিত করতে পারবেন
- ✅ কৃষি ডেটা Integration-এ Spatial Join প্রয়োগ করতে পারবেন`
    },
    {
      title: 'Lesson 3.4 — Summary Statistics ও Aggregate Functions',
      slug: 'summary-statistics-aggregate',
      order_index: 4,
      content: `# Lesson 3.4 — Summary Statistics ও Aggregate Functions

## ১. কী শিখবেন (Learning Objectives)
- QGIS-এ Summary Statistics টুল ব্যবহার করে ডেটার সারসংক্ষেপ তৈরি করা
- Group By Aggregation দিয়ে শ্রেণীভিত্তিক পরিসংখ্যান বের করা
- Statistical Output-কে GIS Analysis-এ একীভূত করা
- ফলন, বৃষ্টিপাত ও ফসল ডেটার উপর Aggregate Function প্রয়োগ করা

---

## ২. সমস্যা থেকে শুরু (The Problem)
আপনার কাছে ৪৯৫টি উপজেলার কৃষি ডেটা আছে — ফসলের ধরন, আবাদি এলাকা, ফলন। আপনি জেলা পর্যায়ে সারসংক্ষেপ চান: প্রতিটি জেলায় মোট কৃষিজমি কত? গড় ফলন কত? কতটি উপজেলায় ফলন ৪ MT/ha-র বেশি?

---

## ৩. মূল ধারণা: Aggregate Functions

### মৌলিক Statistical Functions

| Function | কাজ | উদাহরণ |
| :--- | :--- | :--- |
| **count()** | ফিচার/সারি সংখ্যা | কতটি উপজেলা |
| **sum()** | যোগফল | মোট কৃষিজমি (ha) |
| **mean()** | গড় | গড় ফলন (MT/ha) |
| **median()** | মধ্যক | মধ্যক ফলন |
| **min() / max()** | সর্বনিম্ন / সর্বোচ্চ | সর্বনিম্ন ও সর্বোচ্চ বৃষ্টিপাত |
| **stdev()** | মানক বিচ্যুতি | ফলনের Variability |
| **range()** | পরিসর (Max - Min) | তাপমাত্রার পরিসর |

### Group By Aggregation
Group By নির্দিষ্ট ফিল্ড অনুযায়ী ডেটাকে গ্রুপ করে প্রতিটি গ্রুপের জন্য আলাদা পরিসংখ্যান গণনা করে:

\`\`\`text
Input:
  উপজেলা    | জেলা      | ফলন
  সাভার      | ঢাকা      | 4.2
  ধামরাই     | ঢাকা      | 3.8
  গাজীপুর    | গাজীপুর   | 4.5
  কালীগঞ্জ   | গাজীপুর   | 4.1

Group By: জেলা
Aggregate: Mean(ফলন)

Output:
  ঢাকা → গড় ফলন: 4.0
  গাজীপুর → গড় ফলন: 4.3
\`\`\`

---

## ৪. QGIS Workflow

### Basic Statistics
\`\`\`text
QGIS: Vector → Analysis Tools → Basic Statistics for Fields

Input layer: উপজেলা ডেটা
Field to calculate: yield_mt_ha
→ Count, Sum, Mean, Median, StDev, Min, Max, Range
\`\`\`

### Statistics by Categories (Group By)
\`\`\`text
QGIS: Processing Toolbox → Vector analysis → Statistics by categories

Input layer: উপজেলা ডেটা
Field to calculate: yield_mt_ha
Categories field: district_name
→ প্রতিটি জেলার জন্য আলাদা পরিসংখ্যান
\`\`\`

### Expression Aggregate Functions
\`\`\`text
Field Calculator → নতুন ফিল্ড তৈরি:

aggregate(
  layer:='upazila_data',
  aggregate:='mean',
  expression:="yield_mt_ha",
  filter:="district" = 'Rajshahi'
)
→ রাজশাহী জেলার উপজেলাগুলোর গড় ফলন
\`\`\`

> [!TIP]
> **aggregate() Function অত্যন্ত শক্তিশালী।** এটি Field Calculator-এর মধ্যেই অন্য লেয়ার বা ফিল্টার করা ডেটা থেকে পরিসংখ্যান টেনে আনতে পারে — আলাদা টুল চালানোর দরকার নেই।

---

## ৫. বাস্তব কৃষি উদাহরণ

### কেস: জেলা-ভিত্তিক কৃষি পারফরম্যান্স Dashboard

\`\`\`text
Input: উপজেলা কৃষি ডেটা (৪৯৫ rows)

Group By: district_name

Aggregate Outputs:
├── Sum(agricultural_area_ha) → মোট কৃষিজমি
├── Mean(yield_mt_ha) → গড় ফলন
├── Max(yield_mt_ha) → সর্বোচ্চ ফলনের উপজেলা
├── Min(yield_mt_ha) → সর্বনিম্ন ফলনের উপজেলা
├── Stdev(yield_mt_ha) → ফলনের Variability
├── Count(*) → উপজেলা সংখ্যা
└── count("yield_mt_ha" > 4.0) → "High Yield" উপজেলা সংখ্যা

→ ৬৪টি জেলার Performance Summary Table
→ Dissolve করে থিমেটিক ম্যাপ
\`\`\`

---

## ৬. Failure Mode

> [!WARNING]
> **NULL-র প্রভাব:** যদি ফলন ফিল্ডে কিছু উপজেলার জন্য NULL থাকে, তাহলে Mean() গণনায় NULL মানগুলো বাদ যাবে — ফলে গড় Biased হবে। Sum()-এও NULL থাকলে মোট কম দেখাবে। **NULL মান আগে চিহ্নিত করুন এবং সিদ্ধান্ত নিন — বাদ দেবেন, ০ ধরবেন, নাকি Impute করবেন।**

---

## ৭. অনুশীলন (Practice Task)
1. উপজেলা ডেটায় **বিভাগ-ভিত্তিক** গড়, সর্বোচ্চ ও সর্বনিম্ন ফলন বের করুন
2. প্রতিটি জেলায় কতটি উপজেলায় ফলন < ৩.০ MT/ha — গণনা করুন
3. ফলন ডেটায় NULL আছে কিনা চেক করুন ("yield" IS NULL)
4. aggregate() Function দিয়ে Field Calculator-এ প্রতিটি উপজেলার পাশে জেলার গড় ফলন দেখান

---

## ৮. মূল্যায়ন (Assessment)
- ✅ count, sum, mean, stdev ও অন্যান্য Aggregate Function ব্যবহার করতে পারবেন
- ✅ Group By Aggregation দিয়ে শ্রেণীভিত্তিক পরিসংখ্যান তৈরি করতে পারবেন
- ✅ QGIS aggregate() Expression Function প্রয়োগ করতে পারবেন
- ✅ NULL মানের Statistical প্রভাব বুঝে সতর্কতা অবলম্বন করতে পারবেন`
    },
    {
      title: 'Lesson 3.5 — Complex Query Pipeline: বহুস্তরীয় ফিল্টারিং ও বিশ্লেষণ',
      slug: 'complex-query-pipeline',
      order_index: 5,
      content: `# Lesson 3.5 — Complex Query Pipeline: বহুস্তরীয় ফিল্টারিং ও বিশ্লেষণ

## ১. কী শিখবেন (Learning Objectives)
- Spatial Query + Attribute Query সংযুক্ত করে Complex Pipeline তৈরি করা
- "And then..." ধরনের ক্রমাগত ফিল্টারিং চেইন আয়ত্ত করা
- Selection Pipeline-এ Intermediate Verification করা
- একটি পূর্ণাঙ্গ কৃষি সাইট সিলেকশন সম্পন্ন করা

---

## ২. সমস্যা (The Problem)
একটি NGO ক্ষুদ্র সেচ প্রকল্পের জন্য সবচেয়ে উপযুক্ত ইউনিয়ন খুঁজছে। শর্ত:
1. রাজশাহী বা রংপুর বিভাগে হতে হবে
2. বার্ষিক বৃষ্টিপাত < ১,৪০০ mm (খরা-প্রবণ)
3. ভূগর্ভস্থ পানির স্তর ≤ ২০m (নলকূপ সম্ভব)
4. নিকটতম বাজার ৫ km-এর মধ্যে (বাজারজাতকরণ সুবিধা)
5. কৃষিজমি > ২০০ ha (পর্যাপ্ত আবাদি জমি)
6. বন্যাপ্রবণ এলাকায় পড়ে না

এটি একটি **Complex Query Pipeline** যেখানে Attribute Query ও Spatial Query উভয়ই লাগবে।

---

## ৩. Pipeline Design

\`\`\`text
Step 1: Attribute Filter (Division)
├── "division" IN ('Rajshahi', 'Rangpur')
└── ৪,৫৫৪ → ~১,২০০ ইউনিয়ন

Step 2: Attribute Filter (Rainfall)
├── "rainfall_mm" < 1400
└── ~১,২০০ → ~৭৫০ ইউনিয়ন

Step 3: Attribute Filter (Groundwater)
├── "gw_depth_m" <= 20
└── ~৭৫০ → ~৫৫০ ইউনিয়ন

Step 4: Nearest Join + Filter (Market)
├── Nearest Join: ইউনিয়ন centroid → বাজার Point
├── Filter: "nearest_market_km" <= 5
└── ~৫৫০ → ~৩৫০ ইউনিয়ন

Step 5: Attribute Filter (Agricultural Land)
├── "agri_land_ha" > 200
└── ~৩৫০ → ~২২০ ইউনিয়ন

Step 6: Spatial Filter (Flood Risk)
├── Select by Location: Disjoint from বন্যা এলাকা
└── ~২২০ → ~১৫০ ইউনিয়ন (FINAL CANDIDATE LIST)
\`\`\`

---

## ৪. QGIS-এ বাস্তবায়ন

### দুটি পদ্ধতি:

**পদ্ধতি ক: Sequential Selection (ধাপে ধাপে)**
\`\`\`text
1. Select by Expression: 
   "division" IN ('Rajshahi','Rangpur') 
   AND "rainfall_mm" < 1400 
   AND "gw_depth_m" <= 20 
   AND "agri_land_ha" > 200

2. Export Selected → interim_layer.gpkg

3. Join attributes by nearest (interim → বাজার)

4. Select by Expression: "distance" <= 5000

5. Export Selected → candidate_with_market.gpkg

6. Select by Location:
   From: candidate_with_market
   Where: Disjoint
   By comparing to: বন্যা এলাকা

7. Export Selected → FINAL_CANDIDATES.gpkg
\`\`\`

**পদ্ধতি খ: Combined Expression (একক Expression)**
\`\`\`text
"division" IN ('Rajshahi', 'Rangpur')
AND "rainfall_mm" < 1400
AND "gw_depth_m" <= 20
AND "agri_land_ha" > 200
\`\`\`
> তারপর Spatial Query আলাদাভাবে (Spatial Selection Expression-এ লেখা যায় না)

---

## ৫. Intermediate Verification Table

| ধাপ | প্রত্যাশিত সংখ্যা | প্রকৃত সংখ্যা | পরীক্ষা |
| :--- | :--- | :--- | :--- |
| Step 1: Division Filter | ~১,২০০ | ___ | যৌক্তিক? |
| Step 2: + Rainfall | ~৭৫০ | ___ | কমেছে? |
| Step 3: + Groundwater | ~৫৫০ | ___ | কমেছে? |
| Step 4: + Market Proximity | ~৩৫০ | ___ | কমেছে? |
| Step 5: + Agri Land | ~২২০ | ___ | কমেছে? |
| Step 6: – Flood Zone | ~১৫০ | ___ | চূড়ান্ত |

> [!IMPORTANT]
> **প্রতিটি ধাপে Record Count কমতে হবে।** যদি কোনো ধাপে Count না কমে বা বেড়ে যায় — সেই ধাপে ভুল আছে। যদি কোনো ধাপে Count শূন্যে নেমে আসে — আপনার শর্ত অতিরিক্ত কঠোর বা ডেটায় সমস্যা আছে।

---

## ৬. Sensitivity Analysis

একটি ভালো Analysis Pipeline-এ আপনি পরীক্ষা করবেন: শর্ত পরিবর্তন করলে ফলাফল কতটা বদলায়?

\`\`\`text
Scenario A: rainfall < 1400 → 150 ইউনিয়ন
Scenario B: rainfall < 1500 → 210 ইউনিয়ন
Scenario C: rainfall < 1200 → 85 ইউনিয়ন

→ Rainfall threshold সিদ্ধান্তে বড় প্রভাব ফেলে
→ Report-এ এই Sensitivity উল্লেখ করুন
\`\`\`

---

## ৭. Failure Mode

> [!WARNING]
> **Filter Order Dependency:** তত্ত্বগতভাবে AND দিয়ে যুক্ত Attribute Filter-এর ক্রম ফলাফল পরিবর্তন করে না। কিন্তু Spatial Filter-এর ক্রম গুরুত্বপূর্ণ — কারণ Spatial Query আগের নির্বাচনের উপর কাজ করে। "Select from selected features" বা "Remove from current selection" অপশনগুলো সঠিকভাবে ব্যবহার না করলে ভুল ফলাফল আসবে।

---

## ৮. অনুশীলন (Practice Task)
নিচের শর্ত অনুযায়ী একটি Complex Query Pipeline ডিজাইন ও বাস্তবায়ন করুন:

**প্রশ্ন:** "চট্টগ্রাম বিভাগে কোন ইউনিয়নে পাহাড়ি এলাকা (slope > 15°), বনাঞ্চল থেকে ২ km-এর মধ্যে, এবং জনসংখ্যা < ১০,০০০ — এমন এলাকা আদিবাসী কমিউনিটি ফার্মিং প্রকল্পের জন্য উপযুক্ত?"

Pipeline-এর প্রতিটি ধাপে:
- Input, Operation, Output লিখুন
- প্রত্যাশিত Record Count আনুমানিক দিন
- Intermediate Verification Point চিহ্নিত করুন

---

## ৯. মূল্যায়ন (Assessment)
- ✅ Attribute ও Spatial Query মিলিয়ে Complex Pipeline তৈরি করতে পারবেন
- ✅ Intermediate Verification Table তৈরি ও পূরণ করতে পারবেন
- ✅ Sensitivity Analysis-এর ধারণা ব্যাখ্যা করতে পারবেন
- ✅ কৃষি সাইট সিলেকশন পাইপলাইন ডিজাইন ও বাস্তবায়ন করতে পারবেন`
    }
  ]
};
