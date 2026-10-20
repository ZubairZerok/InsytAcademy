// =============================================================================
// MODULE 09: REMOTE SENSING IMAGE FUNDAMENTALS
// Course 2: Applied GIS Analysis & Remote Sensing
// =============================================================================

module.exports = {
  title: 'Module 09: Remote Sensing Image Fundamentals',
  slug: 'mod-09-remote-sensing-fundamentals',
  order_index: 9,
  description: 'Remote Sensing-এর মূলনীতি — Electromagnetic Spectrum, Spectral Signature, Sensor Platform, Image Acquisition ও Preprocessing (Atmospheric Correction, Geometric Correction)। Satellite ইমেজ বোঝা ও প্রস্তুত করার জন্য এই ভিত্তি অপরিহার্য।',
  lessons: [
    {
      title: 'Lesson 9.1 — Electromagnetic Spectrum ও Spectral Bands',
      slug: 'electromagnetic-spectrum-bands',
      order_index: 1,
      content: `# Lesson 9.1 — Electromagnetic Spectrum ও Spectral Bands

## ১. কী শিখবেন
- Electromagnetic Spectrum-এর সংশ্লিষ্ট অংশ বোঝা (Visible, NIR, SWIR, Thermal)
- Satellite Sensor-এর Band কনফিগারেশন বোঝা (Landsat 8/9, Sentinel-2)
- কোন Band কী তথ্য দেয় তা জানা
- Remote Sensing-এর মূল পদার্থবিজ্ঞান বোঝা

---

## ২. মূল ধারণা

### EM Spectrum ও Remote Sensing

\`\`\`text
তরঙ্গদৈর্ঘ্য →
0.4μm  0.5  0.6  0.7  0.8-1.3   1.3-3.0   3-14μm    1mm+
 |Violet|Blue|Green|Red|  NIR  |  SWIR   | Thermal | Microwave
 |←— Visible Light —→|
\`\`\`

| Spectral Region | তরঙ্গদৈর্ঘ্য | কী সনাক্ত করে |
| :--- | :--- | :--- |
| **Blue** | 0.45-0.52 μm | পানির গভীরতা, বায়ুমণ্ডলীয় ধূলিকণা |
| **Green** | 0.52-0.60 μm | সবুজ গাছপালার প্রতিফলন |
| **Red** | 0.63-0.69 μm | Chlorophyll শোষণ (স্বাস্থ্যকর গাছ কম Red প্রতিফলন করে) |
| **NIR** | 0.77-0.90 μm | গাছপালার Cell Structure (সবচেয়ে বেশি প্রতিফলন) |
| **SWIR** | 1.55-2.35 μm | মাটির আর্দ্রতা, পোড়া এলাকা, খনিজ |
| **Thermal** | 10.4-12.5 μm | ভূ-পৃষ্ঠের তাপমাত্রা |

### Spectral Signature
প্রতিটি বস্তু (উদ্ভিদ, পানি, মাটি, নগর) EM Spectrum-এর বিভিন্ন Band-এ ভিন্ন পরিমাণে আলো প্রতিফলন করে — এটি তার "Spectral Signature" বা "আঙুলের ছাপ"।

\`\`\`text
Reflectance (%)
  60│            ╱─── Vegetation (NIR-এ উচ্চ)
    │           ╱
  40│  ────────╱
    │ ╱        ╲
  20│╱    ╱─────── Soil (সমানভাবে বাড়ে)
    │    ╱
   0│───╱──────── Water (সব Band-এ কম)
    └──────────────────→ Wavelength
     Blue Green Red NIR SWIR
\`\`\`

> [!IMPORTANT]
> **Spectral Signature = Remote Sensing-এর ভিত্তি।** পানি, মাটি, ফসল, নগর — সব কিছুকে আলাদা করার উপায় হলো তাদের ভিন্ন Spectral Signature। এই নীতির উপর ভিত্তি করেই NDVI, Classification ও সব Remote Sensing Analysis কাজ করে।

---

## ৩. Landsat 8/9 ও Sentinel-2 Band তুলনা

| Band | Landsat 8 | Sentinel-2 | ব্যবহার |
| :--- | :--- | :--- | :--- |
| Coastal/Aerosol | B1 (30m) | B1 (60m) | বায়ুমণ্ডল সংশোধন |
| Blue | B2 (30m) | B2 (10m) | পানি, বায়ুমণ্ডল |
| Green | B3 (30m) | B3 (10m) | সবুজ গাছপালা |
| Red | B4 (30m) | B4 (10m) | Chlorophyll শোষণ |
| Red Edge | — | B5,B6,B7 (20m) | ফসল স্বাস্থ্য (Sentinel-2 বিশেষত্ব!) |
| NIR | B5 (30m) | B8 (10m) | গাছপালা, জল |
| SWIR 1 | B6 (30m) | B11 (20m) | আর্দ্রতা, পোড়া |
| SWIR 2 | B7 (30m) | B12 (20m) | খনিজ, আর্দ্রতা |
| Thermal | B10,B11 (100m) | — | তাপমাত্রা |

---

## ৪. অনুশীলন
1. Landsat 8 ও Sentinel-2-এর Band তালিকা পাশাপাশি রাখুন
2. কোন Band কৃষিতে সবচেয়ে গুরুত্বপূর্ণ এবং কেন — লিখুন
3. কেন Sentinel-2-র Red Edge Band কৃষিতে বিশেষ সুবিধাজনক?

---

## ৫. মূল্যায়ন
- ✅ EM Spectrum-এর Remote Sensing-প্রাসঙ্গিক অংশ ব্যাখ্যা করতে পারবেন
- ✅ Spectral Signature-এর ধারণা বুঝবেন
- ✅ Landsat 8 ও Sentinel-2-এর Band তুলনা করতে পারবেন`
    },
    {
      title: 'Lesson 9.2 — Satellite Image ডাউনলোড: USGS EarthExplorer ও Copernicus Open Access Hub',
      slug: 'satellite-image-download',
      order_index: 2,
      content: `# Lesson 9.2 — Satellite Image ডাউনলোড

## ১. কী শিখবেন
- USGS EarthExplorer থেকে Landsat ডেটা ডাউনলোড করা
- Copernicus Browser থেকে Sentinel-2 ডেটা ডাউনলোড করা
- Cloud Cover, Date, Processing Level অনুযায়ী ফিল্টারিং
- ডাউনলোড করা ফাইলের কাঠামো বোঝা

---

## ২. USGS EarthExplorer Workflow

\`\`\`text
1. https://earthexplorer.usgs.gov/ → Login (বিনামূল্যে Account)
2. Search Criteria:
   - Address/Place: "Rajshahi, Bangladesh"
   - Date Range: 2024-01-01 to 2024-03-31 (Dry season)
   - Cloud Cover: 0-10%
3. Data Sets → Landsat → Landsat 8-9 OLI/TIRS C2 L2
   (L2 = Surface Reflectance — Atmospherically Corrected)
4. Results → Preview → Download
5. ফাইল: LC08_L2SP_138043_20240215_...tar.gz
\`\`\`

### Landsat Processing Levels

| Level | বর্ণনা | ব্যবহার |
| :--- | :--- | :--- |
| **L1** | Top-of-Atmosphere (TOA) Reflectance | কাঁচা ডেটা |
| **L2** | Surface Reflectance (Atmospheric Correction done) | বিশ্লেষণ-প্রস্তুত ✓ |

---

## ৩. Copernicus Browser Workflow

\`\`\`text
1. https://browser.dataspace.copernicus.eu/
2. এলাকা: মানচিত্রে Rajshahi-তে জুম করে Draw
3. Filters:
   - Data Source: Sentinel-2
   - Time Range: 2024-01-01 to 2024-03-31
   - Cloud Coverage: < 10%
   - Product Type: S2MSI2A (L2A = Surface Reflectance)
4. Search → Preview → Download
\`\`\`

> [!TIP]
> **Cloud Cover ≤ ১০% নির্বাচন করুন।** বাংলাদেশে বর্ষা মৌসুমে (জুন-সেপ্টেম্বর) প্রায় সব ইমেজ মেঘে ঢাকা থাকে। শুষ্ক মৌসুমে (নভেম্বর-মার্চ) ভালো ইমেজ পাওয়ার সম্ভাবনা বেশি। কৃষি মৌসুমের সাথে মিলিয়ে ইমেজ নির্বাচন করুন।

---

## ৪. ফাইল কাঠামো

\`\`\`text
Landsat 8 L2 ডাউনলোড:
├── LC08_..._B1.TIF  (Coastal/Aerosol)
├── LC08_..._B2.TIF  (Blue)
├── LC08_..._B3.TIF  (Green)
├── LC08_..._B4.TIF  (Red)
├── LC08_..._B5.TIF  (NIR)
├── LC08_..._B6.TIF  (SWIR 1)
├── LC08_..._B7.TIF  (SWIR 2)
├── LC08_..._B10.TIF (Thermal)
├── LC08_..._QA_PIXEL.TIF (Quality Assessment)
└── LC08_..._MTL.txt (Metadata)
\`\`\`

---

## ৫. Failure Mode

> [!WARNING]
> **Processing Level ভুল নির্বাচন:** L1 (TOA) ডেটায় বায়ুমণ্ডলের প্রভাব আছে — সরাসরি NDVI বা Classification করলে ফলাফল ভুল হবে। **সবসময় L2 (Surface Reflectance) ডাউনলোড করুন** — যদি না আপনি নিজে Atmospheric Correction করতে চান।

---

## ৬. অনুশীলন
1. USGS EarthExplorer-এ Account তৈরি করুন
2. আপনার জেলার একটি Landsat 8 L2 ইমেজ ডাউনলোড করুন (Cloud < 10%)
3. QGIS-এ B4 (Red), B5 (NIR) খুলুন — Identify Tool দিয়ে মান দেখুন

---

## ৭. মূল্যায়ন
- ✅ EarthExplorer ও Copernicus Browser ব্যবহার করতে পারবেন
- ✅ Cloud Cover ও Processing Level ফিল্টার করতে পারবেন
- ✅ ডাউনলোড করা ফাইলের Band চিহ্নিত করতে পারবেন`
    },
    {
      title: 'Lesson 9.3 — Band Composite ও Color Composite Visualization',
      slug: 'band-composite-visualization',
      order_index: 3,
      content: `# Lesson 9.3 — Band Composite ও Color Composite Visualization

## ১. কী শিখবেন
- True Color ও False Color Composite-এর ধারণা বোঝা
- RGB-তে Band Assignment-এর নিয়ম শেখা
- কৃষি-প্রাসঙ্গিক Band Combination আয়ত্ত করা
- QGIS-এ Multi-band Raster Visualization করা

---

## ২. মূল ধারণা

### Color Composite কী?
তিনটি Band-কে Red, Green, Blue (RGB) Channel-এ Assign করে রঙিন ইমেজ তৈরি করা।

### গুরুত্বপূর্ণ Band Combinations

| Composite | Landsat 8 (R-G-B) | Sentinel-2 (R-G-B) | কী দেখায় |
| :--- | :--- | :--- | :--- |
| **True Color** | B4-B3-B2 | B4-B3-B2 | মানুষের চোখে যেমন দেখায় |
| **False Color (NIR)** | B5-B4-B3 | B8-B4-B3 | গাছপালা উজ্জ্বল লাল, পানি কালো |
| **SWIR** | B7-B5-B3 | B12-B8A-B4 | আর্দ্রতা, পোড়া, মাটি |
| **Agriculture** | B6-B5-B2 | B11-B8-B2 | ফসল স্বাস্থ্য ও পরিপক্বতা |
| **Natural Color (Enhanced)** | B5-B6-B4 | B8-B11-B4 | মাটি ও গাছপালা আলাদা |

### False Color (NIR) কেন গুরুত্বপূর্ণ?

\`\`\`text
True Color:                 False Color (NIR):
সব সবুজ দেখায়,              স্বাস্থ্যকর ফসল = উজ্জ্বল লাল
ফসল ও ঘাস একই রঙ         অসুস্থ ফসল = গাঢ় লাল/বাদামী
পানি = নীলচে                পানি = কালো
শহর ও খালি মাটি = ধূসর    শহর = নীলচে ধূসর
\`\`\`

> [!TIP]
> **কৃষিতে False Color (NIR) সবচেয়ে দরকারি।** True Color-এ সব সবুজ গাছপালা একই দেখায়। কিন্তু NIR Band-এ স্বাস্থ্যকর গাছপালা অনেক বেশি Reflect করে — তাই False Color-এ ফসলের স্বাস্থ্য পার্থক্য স্পষ্ট দেখা যায়।

---

## ৩. QGIS Workflow

\`\`\`text
Step 1: Build Virtual Raster (Stack)
Raster → Miscellaneous → Build Virtual Raster
Input: B2.tif, B3.tif, B4.tif, B5.tif, B6.tif, B7.tif
Place each file in a separate band: ✓
Output: Landsat_Stack.vrt

Step 2: Color Composite
Layer Properties → Symbology:
Render type: Multiband color
Red band: Band 4 (NIR = B5)
Green band: Band 3 (Red = B4)
Blue band: Band 2 (Green = B3)
\`\`\`

---

## ৪. Failure Mode

> [!WARNING]
> **Contrast Stretch ভুলে যাওয়া:** Raw Band মান (Surface Reflectance) সাধারণত ০-১০,০০০ পরিসরে থাকে। ডিফল্ট Stretch ছাড়া ইমেজ সম্পূর্ণ কালো বা সাদা দেখাবে। **Min/Max Stretch বা 2% Cumulative Cut** প্রয়োগ করুন।

---

## ৫. অনুশীলন
1. Landsat ইমেজ Stack করুন
2. True Color, False Color (NIR), Agriculture Composite দেখুন
3. প্রতিটি Composite-এ ফসল, পানি, শহর কী রঙে দেখায় — নোট করুন

---

## ৬. মূল্যায়ন
- ✅ True Color ও False Color Composite-এর পার্থক্য বুঝবেন
- ✅ কৃষি-প্রাসঙ্গিক Band Combination জানবেন
- ✅ QGIS-এ Band Stacking ও Color Composite তৈরি করতে পারবেন`
    },
    {
      title: 'Lesson 9.4 — Image Preprocessing: Atmospheric Correction ও Cloud Masking',
      slug: 'image-preprocessing',
      order_index: 4,
      content: `# Lesson 9.4 — Image Preprocessing: Atmospheric ও Geometric Correction

## ১. কী শিখবেন
- Atmospheric Correction-এর ধারণা ও প্রয়োজনীয়তা বোঝা
- DN, TOA Reflectance ও Surface Reflectance-এর পার্থক্য আয়ত্ত করা
- Cloud Masking-এর পদ্ধতি শেখা
- Geometric Correction-এর প্রাথমিক ধারণা পাওয়া

---

## ২. মূল ধারণা

### বায়ুমণ্ডলের প্রভাব
সূর্যের আলো → বায়ুমণ্ডলে Scattering ও Absorption → ভূ-পৃষ্ঠে প্রতিফলন → বায়ুমণ্ডলে আবার Scattering → Sensor

\`\`\`text
Processing Levels:

DN (Digital Number)
→ সেন্সরের কাঁচা সংখ্যা (0-65535)
→ সরাসরি বিশ্লেষণযোগ্য নয়

TOA Reflectance (Level 1)
→ বায়ুমণ্ডলের উপরে প্রতিফলন
→ সূর্যের কোণ সংশোধিত, কিন্তু বায়ুমণ্ডলের প্রভাব আছে

Surface Reflectance (Level 2) ← আপনার লক্ষ্য
→ ভূ-পৃষ্ঠে প্রকৃত প্রতিফলন
→ বায়ুমণ্ডলের প্রভাব সরানো হয়েছে
→ বিভিন্ন তারিখ/সেন্সরের ডেটা তুলনাযোগ্য
\`\`\`

> [!IMPORTANT]
> **L2 ডেটা ডাউনলোড করুন = Atmospheric Correction আলাদাভাবে করার দরকার নেই!** Landsat Collection 2 Level-2 ও Sentinel-2 L2A ডেটা ইতিমধ্যে Atmospherically Corrected। আলাদাভাবে Correction শুধু L1 ডেটায় দরকার।

### Cloud Masking

\`\`\`text
Landsat: QA_PIXEL Band → Bit flags for Cloud, Shadow, Snow
Sentinel-2: SCL (Scene Classification Layer) → 
  Value 3: Cloud Shadow
  Value 8: Medium Cloud
  Value 9: High Cloud
  Value 10: Cirrus

QGIS: Raster Calculator
Cloud_free = ("B5@1") * ("SCL@1" != 3 AND "SCL@1" != 8 AND 
              "SCL@1" != 9 AND "SCL@1" != 10)
→ মেঘাচ্ছন্ন Pixel = 0/NoData
\`\`\`

---

## ৩. Failure Mode

> [!WARNING]
> **Cloud Masking না করে NDVI গণনা:** মেঘের Pixel-এ NDVI মান অর্থহীন — মেঘের NIR ও Red প্রতিফলন ফসলের সাথে সম্পর্কহীন। মেঘ ও ছায়া Mask না করলে গড় NDVI, Classification — সবকিছু ভুল হবে।

---

## ৪. অনুশীলন
1. Landsat QA_PIXEL Band QGIS-এ খুলুন — বিভিন্ন Pixel-এর মান দেখুন
2. Sentinel-2 SCL Band-এ Cloud Pixel চিহ্নিত করুন
3. Cloud Mask তৈরি করে NIR Band-এ প্রয়োগ করুন

---

## ৫. মূল্যায়ন
- ✅ DN, TOA, Surface Reflectance-এর পার্থক্য ব্যাখ্যা করতে পারবেন
- ✅ L2 ডেটার সুবিধা বুঝবেন
- ✅ Cloud Masking করতে পারবেন`
    },
    {
      title: 'Lesson 9.5 — Image Enhancement: Histogram Stretch, Pan-sharpening ও Compositing',
      slug: 'image-enhancement-techniques',
      order_index: 5,
      content: `# Lesson 9.5 — Image Enhancement Techniques

## ১. কী শিখবেন
- Histogram Stretch-এর প্রকারভেদ ও প্রয়োগ বোঝা
- Pan-sharpening-এর ধারণা ও ব্যবহার শেখা
- Temporal Compositing (Median, Max NDVI) বোঝা
- Image Enhancement-এর কৃষি প্রয়োগ জানা

---

## ২. Histogram Stretch

| Stretch ধরন | কাজ | ব্যবহার |
| :--- | :--- | :--- |
| **Min-Max** | ডেটার Min ও Max মানকে 0-255-এ ছড়িয়ে দেয় | সাধারণ ভিজ্যুয়ালাইজেশন |
| **2% Cumulative Cut** | ২% Outlier বাদ দিয়ে Stretch | Outlier-এর প্রভাব কমায় |
| **Standard Deviation** | Mean ± n×StDev পরিসরে Stretch | বৈজ্ঞানিক ভিজ্যুয়ালাইজেশন |
| **Histogram Equalization** | সব Intensity Level সমানভাবে বিতরণ | বেশি Contrast |

---

## ৩. Pan-sharpening

### কী?
Panchromatic Band (উচ্চ Resolution, Gray) + Multi-spectral Bands (নিম্ন Resolution, রঙিন) = উচ্চ Resolution রঙিন ইমেজ।

\`\`\`text
Landsat:
Pan Band (B8): 15m, Grayscale
Multispectral: 30m, Color

Pan-sharpened: 15m, Color!
\`\`\`

---

## ৪. Temporal Compositing

একাধিক তারিখের ইমেজ একত্রে একটি Cloud-free Composite তৈরি:

\`\`\`text
Jan Image:  [Cloud] [Clear] [Cloud]  [Clear]
Feb Image:  [Clear] [Cloud] [Clear]  [Clear]
Mar Image:  [Clear] [Clear] [Cloud]  [Clear]

Median Composite: প্রতিটি Pixel-এর Median মান নেয়
→ Cloud-free, Representative Surface
\`\`\`

> [!TIP]
> **Max NDVI Composite:** প্রতিটি Pixel-এর সর্বোচ্চ NDVI মান নেয় → সবচেয়ে সবুজ মৌসুমের ছবি পাওয়া যায়। কৃষি মৌসুমে ফসলের সর্বোচ্চ বৃদ্ধি চিহ্নিত করতে দরকারি।

---

## ৫. Failure Mode

> [!WARNING]
> **Histogram Stretch ≠ Data Change।** Stretch শুধু Display পরিবর্তন করে — মূল ডেটা অপরিবর্তিত থাকে। কিন্তু Stretched ইমেজ Export করলে Display মান সংরক্ষিত হতে পারে। বিশ্লেষণে সবসময় মূল (Unstretched) ডেটা ব্যবহার করুন।

---

## ৬. অনুশীলন
1. একটি Landsat ইমেজে ৪ ধরনের Stretch প্রয়োগ করে তুলনা করুন
2. Pan-sharpening (Processing Toolbox → GDAL → Raster miscellaneous → Pansharpen) করুন
3. ২-৩ মাসের ইমেজ দিয়ে Median Composite তৈরি করুন

---

## ৭. মূল্যায়ন
- ✅ Histogram Stretch প্রকারভেদ ও প্রয়োগ জানবেন
- ✅ Pan-sharpening-এর ধারণা বুঝবেন
- ✅ Temporal Compositing-এর পদ্ধতি ও কৃষি ব্যবহার জানবেন`
    }
  ]
};
