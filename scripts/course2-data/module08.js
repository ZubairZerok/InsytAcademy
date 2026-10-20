// =============================================================================
// MODULE 08: POINT PATTERN ANALYSIS
// Course 2: Applied GIS Analysis & Remote Sensing
// =============================================================================

module.exports = {
  title: 'Module 08: Point Pattern Analysis',
  slug: 'mod-08-point-pattern-analysis',
  order_index: 8,
  description: 'Point ডেটার Spatial Distribution Pattern বিশ্লেষণ করুন — Random, Clustered, Dispersed। Kernel Density Estimation, Nearest Neighbor Analysis ও Quadrat Analysis শিখুন এবং কৃষি সেবা/সম্পদ বিতরণ মূল্যায়নে প্রয়োগ করুন।',
  lessons: [
    {
      title: 'Lesson 8.1 — Spatial Distribution: Random, Clustered, Dispersed',
      slug: 'spatial-distribution-patterns',
      order_index: 1,
      content: `# Lesson 8.1 — Spatial Distribution: Random, Clustered, Dispersed

## ১. কী শিখবেন
- Point Feature-এর তিনটি মৌলিক Spatial Pattern চেনা
- কৃষি ও পরিবেশ ডেটায় Pattern Recognition-এর গুরুত্ব বোঝা
- Visual Pattern Assessment-এর সীমাবদ্ধতা বোঝা

---

## ২. সমস্যা থেকে শুরু
আপনার কাছে একটি জেলায় ৩০০টি কৃষি সম্প্রসারণ Sub-Center-এর অবস্থান আছে। জানতে চান: "Sub-Center গুলো কি সমানভাবে বিতরিত, নাকি কোনো এলাকায় জড়ো, নাকি এলোমেলো?"

---

## ৩. তিনটি মৌলিক Pattern

\`\`\`text
Clustered:          Random:           Dispersed (Uniform):
●●●●                ●   ●             ●   ●   ●   ●
●●●                   ● ●            
  ●●●●●            ●     ●           ●   ●   ●   ●
                      ●●
        ●●●         ●      ●         ●   ●   ●   ●
\`\`\`

| Pattern | বর্ণনা | কৃষি উদাহরণ |
| :--- | :--- | :--- |
| **Clustered** | নির্দিষ্ট এলাকায় জড়ো | কীটনাশক দোকান শহরে জড়ো, গ্রামীণ এলাকায় নেই |
| **Random** | কোনো নির্দিষ্ট Pattern নেই | বজ্রপাতের অবস্থান |
| **Dispersed** | সমানভাবে ছড়ানো | পরিকল্পিতভাবে বসানো নলকূপ |

> [!IMPORTANT]
> **চোখ দিয়ে Pattern দেখা বিপজ্জনক।** মানুষ এলোমেলো Pattern-এও "Cluster" দেখতে পায়। Statistical Test ছাড়া আপনি নিশ্চিত হতে পারেন না Pattern আসল কিনা। পরবর্তী পাঠে এই Statistical Test শেখানো হবে।

---

## ৪. Pattern-এর কৃষি গুরুত্ব

### Clustered = সেবা ফাঁক!
যদি কৃষি সেবা কেন্দ্র Clustered হয়, তাহলে কিছু এলাকায় অতিরিক্ত সেবা এবং অনেক এলাকায় কোনো সেবা নেই।

### Dispersed = পরিকল্পিত বিতরণ
সরকারি প্রকল্পে নলকূপ বা সেচ পাম্প Dispersed Pattern-এ বসানো উচিত — যাতে সব কৃষক সমানভাবে সুবিধা পায়।

---

## ৫. অনুশীলন
1. একটি জেলার বাজার/হাটের অবস্থান QGIS-এ দেখুন — কোন Pattern মনে হচ্ছে?
2. নলকূপের অবস্থান দেখুন — একই প্রশ্ন
3. আপনার চোখে যে Pattern দেখছেন তা লিখে রাখুন — পরে Statistical Test-এর সাথে তুলনা করবেন

---

## ৬. মূল্যায়ন
- ✅ তিনটি Spatial Pattern চিনতে পারবেন
- ✅ Visual Assessment-এর সীমাবদ্ধতা বুঝবেন
- ✅ কৃষি সেবা বিতরণে Pattern-এর গুরুত্ব ব্যাখ্যা করতে পারবেন`
    },
    {
      title: 'Lesson 8.2 — Density Mapping: Kernel Density Estimation (KDE)',
      slug: 'kernel-density-estimation',
      order_index: 2,
      content: `# Lesson 8.2 — Density Mapping: Kernel Density Estimation (KDE)

## ১. কী শিখবেন
- KDE-এর ধারণা ও কার্যপদ্ধতি বোঝা
- Bandwidth (Search Radius) parameter-এর প্রভাব আয়ত্ত করা
- QGIS-এ Heatmap ও KDE তৈরি করা
- কৃষি ডেটায় ঘনত্ব মানচিত্র প্রয়োগ করা

---

## ২. মূল ধারণা

### KDE কী?
প্রতিটি Point-এর চারপাশে একটি মসৃণ "ঘনত্ব পৃষ্ঠ" তৈরি করে — যেখানে Point বেশি, সেখানে ঘনত্ব বেশি দেখায়।

\`\`\`text
Points:    ●  ●● ●    ●       ●

KDE:       ▁▂▄▆█▆▄▂▁▂▃▂▁  ▁▂▃▂▁
           Low  High  Low    Low
\`\`\`

### Bandwidth-এর প্রভাব

| Bandwidth | ফলাফল |
| :--- | :--- |
| ছোট (৫০০m) | খুব বিস্তারিত, Noisy, অনেক ছোট Hotspot |
| মাঝারি (২km) | সামগ্রিক Pattern স্পষ্ট |
| বড় (১০km) | অতি মসৃণ, সব Detail মুছে যায় |

---

## ৩. QGIS Workflow

\`\`\`text
Processing Toolbox → Interpolation → Heatmap (Kernel Density Estimation)

Point layer: কীটনাশক দোকান (Point)
Radius: 3000 (3 km)
Pixel size: 100 (meters)
Weight from field: (ঐচ্ছিক — দোকানের আকার)
Output: Pesticide_Shop_Density.tif
\`\`\`

> [!TIP]
> **Weight Field ব্যবহার করুন।** শুধু Point count নয়, Point-এর গুরুত্বও বিবেচনা করতে পারেন। যেমন: Cold Storage-র Density Map-এ প্রতিটি Storage-র ক্ষমতা (MT) Weight হিসেবে ব্যবহার করলে ক্ষমতা-ভারিত ঘনত্ব পাবেন।

---

## ৪. কৃষি প্রয়োগ

| ডেটা | KDE আউটপুট | সিদ্ধান্ত |
| :--- | :--- | :--- |
| কীটনাশক দোকান | দোকান ঘনত্ব মানচিত্র | কোথায় দোকান কম — সেখানে নতুন দোকান |
| মাটির নমুনা | নমুনা ঘনত্ব | কোথায় আরো নমুনা দরকার |
| ফসল রোগের রিপোর্ট | রোগ ঘনত্ব | কোন এলাকায় ব্যবস্থা দরকার |

---

## ৫. Failure Mode

> [!WARNING]
> **Bandwidth ভুল নির্বাচন।** খুব ছোট Bandwidth = Noise-কে Pattern মনে করা। খুব বড় Bandwidth = আসল Pattern মুছে যায়। সমাধান: ২-৩টি ভিন্ন Bandwidth দিয়ে তুলনা করুন এবং বিশ্লেষণের উদ্দেশ্যের সাথে সবচেয়ে প্রাসঙ্গিকটি বেছে নিন।

---

## ৬. অনুশীলন
1. ৩টি ভিন্ন Bandwidth (১km, ৩km, ১০km) দিয়ে KDE তৈরি করুন
2. কোন Bandwidth-এ Pattern সবচেয়ে অর্থবহ?
3. Weight Field ব্যবহার করে ক্ষমতা-ভারিত KDE তৈরি করুন

---

## ৭. মূল্যায়ন
- ✅ KDE-এর কার্যপদ্ধতি ব্যাখ্যা করতে পারবেন
- ✅ Bandwidth-এর প্রভাব বুঝবেন
- ✅ কৃষিতে Density Mapping প্রয়োগ করতে পারবেন`
    },
    {
      title: 'Lesson 8.3 — Nearest Neighbor Analysis ও Average Nearest Neighbor Index',
      slug: 'nearest-neighbor-analysis',
      order_index: 3,
      content: `# Lesson 8.3 — Nearest Neighbor Analysis ও Average Nearest Neighbor Index

## ১. কী শিখবেন
- Average Nearest Neighbor (ANN) Index-এর ধারণা ও গণনা বোঝা
- ANN Ratio-এর ব্যাখ্যা: Clustered, Random, Dispersed চিহ্নিত করা
- Z-score ও p-value-এর প্রাথমিক ব্যাখ্যা
- QGIS-এ Nearest Neighbor Analysis চালানো

---

## ২. মূল ধারণা

### ANN Index কী?
প্রতিটি Point থেকে তার নিকটতম Point-এর দূরত্ব পরিমাপ করে, সব দূরত্বের গড় বের করে, এবং Random Distribution-এর প্রত্যাশিত গড়ের সাথে তুলনা করে।

\`\`\`text
ANN Ratio = Observed Mean Distance / Expected Mean Distance

Ratio < 1 → Clustered (পর্যবেক্ষিত দূরত্ব প্রত্যাশিত থেকে কম)
Ratio = 1 → Random
Ratio > 1 → Dispersed (পর্যবেক্ষিত দূরত্ব প্রত্যাশিত থেকে বেশি)
\`\`\`

### Z-score ও p-value

| Z-score | p-value | ব্যাখ্যা |
| :--- | :--- | :--- |
| < -2.58 | < 0.01 | Pattern **অত্যন্ত তাৎপর্যপূর্ণ** (99% confidence) |
| < -1.96 | < 0.05 | Pattern **তাৎপর্যপূর্ণ** (95% confidence) |
| -1.96 to 1.96 | > 0.05 | Random Distribution — Pattern **তাৎপর্যপূর্ণ নয়** |
| > 1.96 | < 0.05 | Dispersed Pattern তাৎপর্যপূর্ণ |

> [!IMPORTANT]
> **p-value < 0.05 না হলে Pattern আসল নয়!** আপনার চোখে Cluster দেখা গেলেও, যদি p-value > 0.05 হয়, তাহলে সেই Pattern Random Chance-এর ফলাফল হতে পারে — এটিকে রিপোর্ট করা অনুচিত।

---

## ৩. QGIS Workflow
\`\`\`text
Processing Toolbox → Vector analysis → Nearest neighbour analysis

Input: কৃষি সম্প্রসারণ কেন্দ্র (Point)
Output:
  Observed mean distance: ৩.২ km
  Expected mean distance: ৫.১ km
  Nearest neighbour index: ০.৬৩ (< 1 → Clustered)
  Z-score: -৪.৫৬
  p-value: 0.000005 (< 0.01 → অত্যন্ত তাৎপর্যপূর্ণ)
\`\`\`

---

## ৪. কৃষি ব্যাখ্যা
ANN Ratio = ০.৬৩ → কৃষি সম্প্রসারণ কেন্দ্রগুলো **Clustered**। অর্থাৎ কেন্দ্রগুলো নির্দিষ্ট এলাকায় (সম্ভবত উপজেলা সদর) জড়ো — গ্রামীণ প্রান্তিক এলাকায় সেবা ফাঁক আছে।

---

## ৫. অনুশীলন
1. বিভিন্ন Point ডেটায় (বাজার, নলকূপ, স্কুল) ANN Analysis চালান
2. ANN Ratio ও p-value রিপোর্ট করুন
3. কোন ডেটায় Clustering সবচেয়ে বেশি?

---

## ৬. মূল্যায়ন
- ✅ ANN Index গণনা ও ব্যাখ্যা করতে পারবেন
- ✅ Z-score ও p-value-এর তাৎপর্য বুঝবেন
- ✅ Statistical significance ছাড়া Pattern রিপোর্ট করার ঝুঁকি বুঝবেন`
    },
    {
      title: 'Lesson 8.4 — Quadrat Analysis ও Spatial Intensity',
      slug: 'quadrat-analysis-intensity',
      order_index: 4,
      content: `# Lesson 8.4 — Quadrat Analysis ও Spatial Intensity

## ১. কী শিখবেন
- Quadrat Analysis-এর ধারণা ও কার্যপদ্ধতি বোঝা
- Variance-to-Mean Ratio (VMR) দিয়ে Pattern পরীক্ষা করা
- Spatial Intensity (ঘনত্ব প্রতি একক এলাকা) গণনা করা
- Quadrat Size নির্বাচনের প্রভাব বোঝা

---

## ২. মূল ধারণা

### Quadrat Analysis কী?
Study Area-কে সমান আকারের গ্রিড (Quadrat)-এ ভাগ করুন। প্রতিটি Quadrat-এ কতটি Point পড়ে — গণনা করুন। যদি Random distribution হয়, তাহলে Variance ≈ Mean হবে (Poisson distribution)।

\`\`\`text
Quadrat Grid:
[3] [1] [0] [2]
[1] [0] [0] [1]
[5] [4] [2] [0]
[0] [1] [0] [0]

Mean = 20/16 = 1.25
Variance = 2.47

VMR = Variance/Mean = 2.47/1.25 = 1.98
VMR > 1 → Clustered!
\`\`\`

| VMR | Pattern |
| :--- | :--- |
| VMR ≈ 1 | Random (Poisson) |
| VMR > 1 | Clustered (ডেটা জড়ো) |
| VMR < 1 | Dispersed (ডেটা সমানভাবে ছড়ানো) |

---

## ৩. Spatial Intensity
Intensity = Point সংখ্যা / এলাকা (km²)

একটি জেলায় ১২০টি কৃষি সম্প্রসারণ Sub-Center, জেলার আয়তন ২,৪০০ km²
→ Intensity = ১২০/২,৪০০ = ০.০৫ per km² = **প্রতি ২০ km²-তে ১টি কেন্দ্র**

> [!TIP]
> **Intensity Map = Quadrat Count / Quadrat Area।** প্রতিটি Quadrat-এর Intensity গণনা করে Color Map দিলে ঘনত্ব মানচিত্র পাওয়া যায় — KDE-এর সরল বিকল্প।

---

## ৪. Failure Mode

> [!WARNING]
> **Quadrat Size সংবেদনশীলতা:** ছোট Quadrat = অনেক খালি Cell, Pattern Noisy। বড় Quadrat = সব Pattern মুছে যায়। সর্বোত্তম Quadrat Size নির্ভর করে ডেটার ঘনত্ব ও বিশ্লেষণের স্কেলের উপর। সাধারণ নিয়ম: প্রতি Quadrat-এ গড় ≥ ২টি Point থাকা উচিত।

---

## ৫. অনুশীলন
1. QGIS-এ একটি Grid (Vector → Research Tools → Create Grid) তৈরি করুন
2. Count Points in Polygon (Processing Toolbox) চালান
3. VMR গণনা করুন
4. তিনটি ভিন্ন Grid Size দিয়ে VMR তুলনা করুন

---

## ৬. মূল্যায়ন
- ✅ Quadrat Analysis ও VMR ব্যাখ্যা করতে পারবেন
- ✅ Spatial Intensity গণনা করতে পারবেন
- ✅ Quadrat Size-এর প্রভাব বুঝবেন`
    },
    {
      title: 'Lesson 8.5 — কৃষি প্রয়োগ: কীটনাশক দোকান বিতরণ ও সেবা ফাঁক বিশ্লেষণ',
      slug: 'service-gap-analysis',
      order_index: 5,
      content: `# Lesson 8.5 — কৃষি প্রয়োগ: সেবা ফাঁক বিশ্লেষণ

## ১. কী শিখবেন
- Point Pattern Analysis-এর সব উপাদান একত্রে কৃষি সমস্যায় প্রয়োগ করা
- Service Gap Analysis-এর পূর্ণাঙ্গ Workflow সম্পন্ন করা
- ফলাফল ব্যাখ্যা ও নীতি-সুপারিশ তৈরি করা

---

## ২. সম্পূর্ণ কেস স্টাডি

**প্রশ্ন:** "নাটোর জেলায় কৃষি উপকরণ দোকান (সার, বীজ, কীটনাশক) কি সমানভাবে বিতরিত? কোন ইউনিয়নে সেবা ফাঁক আছে? কোথায় নতুন দোকান বসানো উচিত?"

### Workflow:

\`\`\`text
Step 1: ANN Analysis
→ ANN Ratio: 0.45 (Strongly Clustered)
→ p-value: < 0.001
→ ব্যাখ্যা: দোকান উপজেলা সদরে জড়ো

Step 2: KDE (Bandwidth: 3km)
→ Density Map: উচ্চ ঘনত্ব শহরে, গ্রামীণ এলাকায় শূন্য

Step 3: Service Area Buffer (3km)
→ প্রতিটি দোকান থেকে 3km Buffer
→ Dissolved → মোট কভারেজ এলাকা

Step 4: Gap Identification
→ জেলা সীমানা - Dissolved Buffer = Service Gap
→ কোন ইউনিয়ন সম্পূর্ণ Gap-এ?
→ Gap Area-র কৃষিজমি ও জনসংখ্যা (Intersect + Zonal Stats)

Step 5: নতুন দোকানের অবস্থান সুপারিশ
→ Gap Area-র Centroid বা সর্বাধিক জনসংখ্যার পয়েন্ট
→ নিকটতম সড়কের ২০০m-এর মধ্যে
\`\`\`

---

## ৩. আউটপুট

| আউটপুট | বর্ণনা |
| :--- | :--- |
| ANN Report | Clustering তাৎপর্যপূর্ণ (p < 0.001) |
| KDE Map | ঘনত্ব মানচিত্র — শহর vs. গ্রাম |
| Service Gap Map | সেবাহীন এলাকা (সবুজ = কভার্ড, লাল = Gap) |
| Recommendation Map | প্রস্তাবিত নতুন দোকানের অবস্থান |
| Summary Table | Gap Area, কৃষিজমি, প্রভাবিত কৃষক সংখ্যা |

> [!IMPORTANT]
> **ফলাফলকে সিদ্ধান্তে রূপান্তর করুন।** "দোকান Clustered" — এটি একটি পর্যবেক্ষণ। "গ্রামীণ ইউনিয়ন X, Y, Z-তে ৩ km-এর মধ্যে কোনো দোকান নেই, ৫,০০০+ কৃষক সেবাবঞ্চিত, ৩টি নতুন দোকান প্রয়োজন" — এটি একটি **Actionable Recommendation**।

---

## ৪. অনুশীলন (Capstone)
একটি জেলায় স্বাস্থ্যকেন্দ্র বা কৃষি সেবা কেন্দ্রের সম্পূর্ণ Service Gap Analysis সম্পন্ন করুন:
1. ANN Analysis + KDE Map
2. Service Buffer + Gap Identification
3. Gap Area-র জনসংখ্যা ও কৃষিজমি গণনা
4. ৩-৫টি নতুন সেবা কেন্দ্রের অবস্থান সুপারিশ (যুক্তিসহ)

---

## ৫. মূল্যায়ন
- ✅ পূর্ণাঙ্গ Service Gap Analysis Pipeline তৈরি ও চালাতে পারবেন
- ✅ Statistical Analysis-কে Actionable Recommendation-এ রূপান্তর করতে পারবেন
- ✅ Point Pattern Analysis-এর সব টুল সমন্বিতভাবে প্রয়োগ করতে পারবেন`
    }
  ]
};
