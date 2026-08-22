-- SEED DATA: GOOGLE EARTH ENGINE COURSE (ULTRA GOAT EDITION)
-- This file contains the ultra-comprehensive curriculum for "End-to-End Google Earth Engine".
-- It handles cleanup, course creation, detailed markdown content, and gamified quizzes for 8 modules.

DO $$
DECLARE
  gee_cid UUID; -- Course ID
  m1_id UUID;
  m2_id UUID;
  m3_id UUID;
  m4_id UUID;
  m5_id UUID;
  m6_id UUID;
  m7_id UUID;
  m8_id UUID;
  l_id UUID;  -- Temp Lesson ID
  q_id UUID;  -- Temp Quiz ID
BEGIN
  -- ================================================================================================
  -- 1. SETUP & CLEANUP
  -- ================================================================================================
  
  DELETE FROM public.courses WHERE slug = 'end-to-end-gee';

  INSERT INTO public.courses (title, slug, description, is_published, thumbnail_url)
  VALUES (
    'End-to-End Google Earth Engine', 
    'end-to-end-gee', 
    'Master cloud-based remote sensing, spatial analysis, and machine learning using Google Earth Engine. Real-world case studies on floods, crop health, and land cover in Bangladesh.', 
    TRUE,
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2670&auto=format&fit=crop'
  ) RETURNING id INTO gee_cid;

  -- ================================================================================================
  -- MODULE 1: Module 1: Planetary Computer & Cloud Remote Sensing
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gee_cid, 'Module 1: Planetary Computer & Cloud Remote Sensing', 'mod1-planetary-computer', 1, 'Understanding the GEE architecture, signing up, and mastering the Code Editor UI.')
  RETURNING id INTO m1_id;

  -- Lesson 1: 1. What is GEE? The Cloud Revolution
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id, '1. What is GEE? The Cloud Revolution', 'what-is-gee', 1, 
  $markdown$

# Google Earth Engine (GEE) কি? 🌍

Google Earth Engine (GEE) হলো একটি Cloud-based geospatial analysis platform। সহজ ভাষায় বললে, এটি একটি "Planetary-scale Computer"। 

আগে স্যাটেলাইট ইমেজ (যেমন Landsat বা Sentinel) নিয়ে কাজ করার জন্য আমাদের বিশাল বিশাল ফাইল ডাউনলোড করতে হতো, এরপর ENVI বা ERDAS Imagine-এর মতো ভারি সফটওয়্যারে দিনের পর দিন প্রসেস করতে হতো। কিন্তু GEE এই পুরো প্রসেসটিকে Cloud-এ নিয়ে গেছে। 

### GEE এর প্রধান সুবিধা (Key Advantages):
1. **No Downloads:** Petabytes of data (Landsat, Sentinel, MODIS) অলরেডি গুগলের সার্ভারে স্টোর করা আছে।
2. **Super Fast Computing:** গুগলের ডেটা সেন্টারের হাজার হাজার প্রসেসর আপনার কোড রান করে সেকেন্ডের মধ্যে ফলাফল দেয়।
3. **Browser Based:** আপনার শুধু একটি ইন্টারনেট কানেকশন এবং ব্রাউজার (Chrome/Edge) লাগবে। 

> 💡 **Pro Tip:** GEE প্রধানত JavaScript (Code Editor) এবং Python (Jupyter/Colab) সাপোর্ট করে। এই কোর্সে আমরা Code Editor (JavaScript) ব্যবহার করে কাজ শিখবো, কারণ এটি সবচেয়ে সহজ এবং ইন্টারেক্টিভ।

### Use Cases in Agriculture & Environment:
- **Crop Health Monitoring:** NDVI ব্যবহার করে ফসলের অবস্থা পর্যবেক্ষণ।
- **Flood Mapping:** Sylhet বা Sunamganj-এর বন্যার ব্যাপ্তি ম্যাপ করা।
- **Deforestation:** সুন্দরবন বা পার্বত্য চট্টগ্রামের বনভূমি ধ্বংসের হার বের করা।

$markdown$, NULL) RETURNING id INTO l_id;

  -- Lesson 2: 2. GEE Code Editor & JavaScript Crash Course
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id, '2. GEE Code Editor & JavaScript Crash Course', 'gee-js-crash-course', 2, 
  $markdown$

# Code Editor Overview

GEE-তে কাজ করার মূল জায়গা হলো [Code Editor](https://code.earthengine.google.com/)। 

### Code Editor এর ৪টি প্রধান অংশ:
1. **Scripts Panel:** এখানে আপনার সেভ করা কোডগুলো থাকবে।
2. **Code Editor:** এখানে আপনি JavaScript কোড লিখবেন।
3. **Console, Inspector, Tasks:** 
   - *Console:* কোডের আউটপুট বা Error দেখার জন্য।
   - *Inspector:* ম্যাপে ক্লিক করে পিক্সেলের ভ্যালু (Pixel values) দেখার জন্য।
   - *Tasks:* Export করা ফাইল (Drive বা Asset-এ) ট্র্যাক করার জন্য।
4. **Map View:** আপনার স্যাটেলাইট ইমেজের আউটপুট এখানে রেন্ডার হবে।

---

# JavaScript Crash Course for GEE

GEE-তে কাজ করার জন্য আপনাকে খুব বেশি JavaScript জানতে হবে না। মাত্র ৩টি জিনিস জানলেই আপনি শুরু করতে পারবেন!

### ১. Variables (ভেরিয়েবল)
কোনো ডেটা বা তথ্য সেভ করে রাখার জন্য `var` ব্যবহার করা হয়।
```javascript
var myName = "INSYT Academy";
var number = 10;
print(myName); // Console এ প্রিন্ট করবে
```

### ২. GEE Objects (Server-side Objects)
GEE-তে গুগলের সার্ভারে প্রসেস করার জন্য সব কিছুর আগে `ee.` লাগাতে হয়।
```javascript
var serverString = ee.String("Hello Server!");
var serverNumber = ee.Number(50);
print(serverString);
```

### ৩. Lists and Dictionaries
একাধিক ডেটা একসাথে রাখার জন্য।
```javascript
var myList = ee.List([10, 20, 30, 40]);
var myDict = ee.Dictionary({
  'Crop': 'Rice',
  'Season': 'Boro'
});
print(myList.get(0)); // 10
```


$markdown$, NULL) RETURNING id INTO l_id;

  -- Quiz: Module 1 Quiz
  INSERT INTO public.quizzes (lesson_id, title, is_published, max_xp, pass_threshold) 
  VALUES (l_id, 'Module 1 Quiz', TRUE, 75, 70) RETURNING id INTO q_id;
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'Google Earth Engine এর সবচেয়ে বড় সুবিধা কোনটি?', '["খুব দামী সফটওয়্যার কেনা লাগে","পিসিতে প্রচুর র‍্যাম লাগে","ইমেজ ডাউনলোড না করেই ক্লাউডে প্রসেস করা যায়","শুধুমাত্র অফলাইনে কাজ করে"]'::jsonb, '2');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'GEE Code Editor এ কোন প্রোগ্রামিং ভাষা ব্যবহার করা হয়?', '["Python","JavaScript","C++","Java"]'::jsonb, '1');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'ম্যাপের কোনো নির্দিষ্ট পিক্সেলের ভ্যালু দেখতে Code Editor-এর কোন ট্যাব ব্যবহার করা হয়?', '["Console","Scripts","Inspector","Tasks"]'::jsonb, '2');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'গুগলের সার্ভারে কোনো ভেরিয়েবল ডিফাইন করতে কোন প্রিফিক্স ব্যবহার করা হয়?', '["ge.","google.","ee.","server."]'::jsonb, '2');

  -- ================================================================================================
  -- MODULE 2: Module 2: The Core Elements (Images & Vectors)
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gee_cid, 'Module 2: The Core Elements (Images & Vectors)', 'mod2-core-elements', 2, 'Mastering ImageCollections, FeatureCollections, and Map Visualization.')
  RETURNING id INTO m2_id;

  -- Lesson 1: 1. FeatureCollections: Working with Vectors
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '1. FeatureCollections: Working with Vectors', 'feature-collections', 1, 
  $markdown$

# FeatureCollections (Vectors in GEE)

GIS-এ ভেক্টর ডেটা (Point, Line, Polygon) খুবই গুরুত্বপূর্ণ। GEE-তে এই ভেক্টর ডেটাকে বলা হয় **FeatureCollection**। 

ধরি, আমরা বাংলাদেশের ম্যাপ বা কোনো নির্দিষ্ট জেলার বাউন্ডারি নিয়ে কাজ করতে চাই। 

### LSIB (Large Scale International Boundary)
GEE-তে পৃথিবীর সব দেশের বাউন্ডারি দেওয়া আছে।
```javascript
// পুরো পৃথিবীর বাউন্ডারি লোড করা
var countries = ee.FeatureCollection("USDOS/LSIB_SIMPLE/2017");

// ফিল্টার করে শুধু বাংলাদেশকে আলাদা করা
var bangladesh = countries.filter(ee.Filter.eq('country_na', 'Bangladesh'));

// ম্যাপে অ্যাড করা
Map.addLayer(bangladesh, {color: 'red'}, 'Bangladesh Boundary');
Map.centerObject(bangladesh, 6); // জুম করা
```

### Filtering Features
আপনি চাইলে `ee.Filter` ব্যবহার করে যেকোনো নির্দিষ্ট এলাকা (যেমন: ঢাকা) ফিল্টার করতে পারেন।
```javascript
// Example: GEE Data Catalog থেকে নির্দিষ্ট শেপফাইল ফিল্টার করা
var dhaka = myShapefile.filter(ee.Filter.eq('District', 'Dhaka'));
```

$markdown$, NULL) RETURNING id INTO l_id;

  -- Lesson 2: 2. ImageCollections: Finding the Right Satellite Data
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '2. ImageCollections: Finding the Right Satellite Data', 'image-collections', 2, 
  $markdown$

# ImageCollections

একটি একক স্যাটেলাইট ইমেজকে বলা হয় **Image**। আর অনেকগুলো ইমেজের সমষ্টিকে (Time series) বলা হয় **ImageCollection**। 

যেমন, Landsat 8-এর সারা পৃথিবীর ২০ বছরের ইমেজ একসাথে একটি ImageCollection-এ থাকে। আমাদের কাজ হলো সেখান থেকে **আমাদের দরকারি জায়গা, সময় এবং কম মেঘযুক্ত** ইমেজ খুঁজে বের করা।

### How to Filter an ImageCollection

```javascript
// 1. Point of Interest (যশোরের একটি পয়েন্ট)
var roi = ee.Geometry.Point([89.21, 23.16]);

// 2. Landsat 8 Image Collection লোড করা
var collection = ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA")
  .filterBounds(roi) // এলাকা দিয়ে ফিল্টার
  .filterDate('2023-01-01', '2023-12-31') // তারিখ দিয়ে ফিল্টার
  .filter(ee.Filter.lt('CLOUD_COVER', 10)); // ১০% এর কম মেঘ আছে এমন ইমেজ

print("Number of images:", collection.size());
```

এখানে আমরা ৩টি ফিল্টার ব্যবহার করেছি:
1. `filterBounds()`: স্পেশাল বাউন্ডারি বা পয়েন্ট
2. `filterDate()`: সময়কাল (Start Date, End Date)
3. `ee.Filter.lt('CLOUD_COVER', 10)`: মেঘের পরিমাণ (Less Than 10%)

$markdown$, NULL) RETURNING id INTO l_id;

  -- Lesson 3: 3. Compositing & Map Visualization
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '3. Compositing & Map Visualization', 'map-visualization', 3, 
  $markdown$

# Compositing & Visualization

ImageCollection থেকে অনেকগুলো ইমেজ ফিল্টার করার পর, আমরা সেগুলোকে একত্রিত করে একটি সিঙ্গেল ক্লিয়ার ইমেজ বানাতে পারি। একে **Compositing** বলা হয়। সবচেয়ে জনপ্রিয় মেথড হলো `median()`।

```javascript
// Median কম্পোজিট তৈরি করা
var image = collection.median();
```

### Visualization Parameters (RGB)
ম্যাপে স্যাটেলাইট ইমেজ দেখানোর জন্য আমাদের ঠিক করতে হবে কোন ব্যান্ড কোন কালারে দেখাবে। 

Landsat 8 এর ক্ষেত্রে:
- Band 4 = Red
- Band 3 = Green
- Band 2 = Blue

```javascript
var visParams = {
  bands: ['B4', 'B3', 'B2'], // True Color Composite
  min: 0,
  max: 0.3,
  gamma: 1.4 // ব্রাইটনেস ঠিক করার জন্য
};

Map.addLayer(image.clip(bangladesh), visParams, 'True Color Image');
```

> 💡 **clip() ফাংশন:** `image.clip(bangladesh)` ব্যবহার করলে ইমেজটি শুধু বাংলাদেশের বাউন্ডারির ভেতরেই দেখাবে, বাইরের অংশ কেটে যাবে!

$markdown$, NULL) RETURNING id INTO l_id;

  -- Quiz: Module 2 Quiz
  INSERT INTO public.quizzes (lesson_id, title, is_published, max_xp, pass_threshold) 
  VALUES (l_id, 'Module 2 Quiz', TRUE, 75, 70) RETURNING id INTO q_id;
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'GEE তে ভেক্টর ডেটা (Polygon/Shapefile) কে কী বলা হয়?', '["ImageCollection","FeatureCollection","GeometryCollection","VectorCollection"]'::jsonb, '1');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'একটি ImageCollection থেকে নির্দিষ্ট তারিখের ইমেজ বের করতে কোন ফাংশন ব্যবহার করা হয়?', '["filterTime()","filterBounds()","filterDate()","selectDate()"]'::jsonb, '2');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'Landsat 8 এর True Color Composite তৈরি করতে কোন ব্যান্ডগুলো ব্যবহার করা হয়?', '["B5, B4, B3","B4, B3, B2","B3, B2, B1","B7, B6, B4"]'::jsonb, '1');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'ইমেজ থেকে শুধু বাংলাদেশের অংশটুকু কেটে নিতে কোন ফাংশনটি কাজ করবে?', '["image.crop(bangladesh)","image.cut(bangladesh)","image.mask(bangladesh)","image.clip(bangladesh)"]'::jsonb, '3');

  -- ================================================================================================
  -- MODULE 3: Module 3: Spectral Indices & Agricultural Monitoring
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gee_cid, 'Module 3: Spectral Indices & Agricultural Monitoring', 'mod3-indices', 3, 'Mastering Band Math, NDVI, NDWI and thresholding for crop health.')
  RETURNING id INTO m3_id;

  -- Lesson 1: 1. Band Math & NDVI (Normalized Difference Vegetation Index)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m3_id, '1. Band Math & NDVI (Normalized Difference Vegetation Index)', 'ndvi', 1, 
  $markdown$

# NDVI: The King of Vegetation Indices 🌾

কৃষিক্ষেত্রে রিমোট সেন্সিংয়ের সবচেয়ে বহুল ব্যবহৃত ইনডেক্স হলো NDVI। এটি দিয়ে গাছের স্বাস্থ্য বা সবুজত্ব (Greenness) মাপা হয়। 

**Formula:**  
`NDVI = (NIR - RED) / (NIR + RED)`

Landsat 8 এর জন্য: NIR = Band 5, Red = Band 4
Sentinel-2 এর জন্য: NIR = Band 8, Red = Band 4

### Calculating NDVI in GEE

GEE-তে ইনডেক্স বের করার দুটি উপায় আছে। সবচেয়ে সহজ উপায় হলো `normalizedDifference()` ফাংশন ব্যবহার করা।

```javascript
// Landsat 8 ইমেজ লোড ও ফিল্টার (ধরে নিচ্ছি image ভেরিয়েবল আগে তৈরি করা আছে)

// NDVI বের করা
var ndvi = image.normalizedDifference(['B5', 'B4']).rename('NDVI');

// ভিজ্যুয়ালাইজেশন (কালার প্যালেট)
var ndviParams = {
  min: 0,
  max: 0.8,
  palette: ['red', 'yellow', 'green', 'darkgreen']
};

Map.addLayer(ndvi, ndviParams, 'NDVI Image');
```
এখানে:
- **Red:** গাছপালা নেই (পানি বা কংক্রিট)
- **Yellow:** রুগ্ন বা শুষ্ক গাছপালা
- **Dark Green:** অত্যন্ত স্বাস্থ্যবান ও ঘন বন/ফসল

$markdown$, NULL) RETURNING id INTO l_id;

  -- Lesson 2: 2. NDWI (Water Index) & Thresholding
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m3_id, '2. NDWI (Water Index) & Thresholding', 'ndwi', 2, 
  $markdown$

# NDWI: Tracking Water Bodies 💧

বন্যা বা হাওর অঞ্চলের পানি মাপার জন্য NDWI (Normalized Difference Water Index) ব্যবহার করা হয়। 

**Formula:**  
`NDWI = (Green - NIR) / (Green + NIR)`

Landsat 8 এর জন্য: Green = B3, NIR = B5

```javascript
var ndwi = image.normalizedDifference(['B3', 'B5']).rename('NDWI');

var ndwiParams = {
  min: -1,
  max: 1,
  palette: ['brown', 'white', 'blue']
};
Map.addLayer(ndwi, ndwiParams, 'NDWI');
```

### Thresholding (পানিকে আলাদা করা)
NDWI ভ্যালু যদি > 0 হয়, তার মানে সেখানে পানি আছে। আমরা `gt()` (Greater Than) ফাংশন ব্যবহার করে শুধু পানির পিক্সেলগুলোকে আলাদা করতে পারি। একে **Thresholding** বলে।

```javascript
// শুধু পানি বের করা (NDWI > 0)
var waterMask = ndwi.gt(0);

// ম্যাপে শুধু পানি দেখাবো
Map.addLayer(waterMask.selfMask(), {palette: 'blue'}, 'Water Bodies Only');
```
> 💡 **selfMask():** এটি 0 ভ্যালুর পিক্সেলগুলোকে ট্রান্সপারেন্ট (অদৃশ্য) করে দেয়, ফলে ম্যাপে শুধু 1 (অর্থাৎ পানি) দেখা যায়!

$markdown$, NULL) RETURNING id INTO l_id;

  -- Quiz: Module 3 Quiz
  INSERT INTO public.quizzes (lesson_id, title, is_published, max_xp, pass_threshold) 
  VALUES (l_id, 'Module 3 Quiz', TRUE, 75, 70) RETURNING id INTO q_id;
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'NDVI এর ফুল মিনিং কী?', '["Normal Difference Vegetation Index","Normalized Difference Vegetation Index","Negative Difference Vegetation Index","Natural Density Vegetation Index"]'::jsonb, '1');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'GEE তে খুব সহজে NDVI বা NDWI বের করতে কোন ফাংশনটি ব্যবহার করা হয়?', '["bandMath()","calculateIndex()","normalizedDifference()","subtract()"]'::jsonb, '2');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'NDWI এর মান কত হলে আমরা সাধারণত ধরে নিই সেখানে পানি আছে?', '["< 0","= 0","> 0","> 1"]'::jsonb, '2');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, '০ ভ্যালুর পিক্সেলগুলোকে ম্যাপে অদৃশ্য করতে কোন ফাংশন ব্যবহার করা হয়?', '["hideZeros()","removeZeros()","selfMask()","transparent()"]'::jsonb, '2');

  -- ================================================================================================
  -- MODULE 4: Module 4: Analytics via Reducers (Zonal Statistics)
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gee_cid, 'Module 4: Analytics via Reducers (Zonal Statistics)', 'mod4-reducers', 4, 'The true power of GEE—Extracting statistics at scale using Reducers.')
  RETURNING id INTO m4_id;

  -- Lesson 1: 1. The Power of Reducers
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id, '1. The Power of Reducers', 'intro-reducers', 1, 
  $markdown$

# Reducers 📊

GEE-এর সবচেয়ে শক্তিশালী কনসেপ্ট হলো **Reducers**। 
Reducer এর কাজ হলো অনেকগুলো ডেটাকে প্রসেস করে একটি সিঙ্গেল সামারি ভ্যালুতে রূপান্তর করা (যেমন: Mean, Max, Min, Sum, Median)।

### ৩ ধরনের Reducer মূলত ব্যবহার করা হয়:
1. **Spatial Reducers:** একটি নির্দিষ্ট এলাকার (Polygon) ভেতরের সব পিক্সেলের গড় বা যোগফল বের করা। (GIS এ একে Zonal Statistics বলে)।
2. **Temporal Reducers:** সময়ের সাথে অনেকগুলো ইমেজের (Time Series) গড় বা ম্যাক্সিমাম ভ্যালু বের করা।
3. **Region Reducers (reduceRegion):** একটি ইমেজের কোনো স্পেসিফিক ব্যান্ডের স্ট্যাটিস্টিকস বের করা।

$markdown$, NULL) RETURNING id INTO l_id;

  -- Lesson 2: 2. Spatial Reducers: Extracting Regional Statistics
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id, '2. Spatial Reducers: Extracting Regional Statistics', 'spatial-reducers', 2, 
  $markdown$

# Zonal Statistics (reduceRegion)

ধরি, আমরা জানতে চাই **সিলেট জেলার গড় NDVI কত?** 

এর জন্য আমাদের `reduceRegion()` ফাংশন ব্যবহার করতে হবে।

```javascript
// সিলেট জেলার শেপফাইল
var sylhet = bangladesh.filter(ee.Filter.eq('ADM2_EN', 'Sylhet'));

// গড় NDVI বের করা
var meanNDVI = ndvi.reduceRegion({
  reducer: ee.Reducer.mean(), // আমরা গড় চাই
  geometry: sylhet.geometry(), // কোন এলাকার জন্য?
  scale: 30, // Landsat এর রেজোলিউশন ৩০ মিটার
  maxPixels: 1e9 // বড় এলাকার জন্য লিমিট বাড়ানো
});

print('Mean NDVI of Sylhet:', meanNDVI.get('NDVI'));
```

> ⚠️ **Note on Scale:** `scale` খুবই গুরুত্বপূর্ণ। GEE-তে আপনি scale উল্লেখ না করলে সে ম্যাপের বর্তমান জুম লেভেলের উপর ভিত্তি করে হিসাব করবে, যা ভুল রেজাল্ট দিতে পারে! সব সময় ইমেজের অরিজিনাল রেজোলিউশন (Landsat = 30, Sentinel = 10) ব্যবহার করবেন।

$markdown$, NULL) RETURNING id INTO l_id;

  -- Quiz: Module 4 Quiz
  INSERT INTO public.quizzes (lesson_id, title, is_published, max_xp, pass_threshold) 
  VALUES (l_id, 'Module 4 Quiz', TRUE, 75, 70) RETURNING id INTO q_id;
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'GEE তে অনেকগুলো পিক্সেলের গড়, ম্যাক্সিমাম বা মিনমাম বের করতে কোন কনসেপ্ট ব্যবহার করা হয়?', '["Calculators","Reducers","Summarizers","MathTools"]'::jsonb, '1');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'GIS-এর Zonal Statistics-এর কাজ GEE-তে কোন ফাংশন দিয়ে করা যায়?', '["reduceRegion()","reduceTime()","spatialMath()","zoneCalc()"]'::jsonb, '0');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'reduceRegion() ফাংশনে scale 30 দেওয়ার অর্থ কী?', '["ম্যাপ ৩০% জুম করা","প্রতি পিক্সেলের সাইজ ৩০ মিটার ধরা (Landsat resolution)","সর্বোচ্চ ৩০টি পিক্সেল ক্যালকুলেট করা","ফলাফল ৩০ দিয়ে গুণ করা"]'::jsonb, '1');

  -- ================================================================================================
  -- MODULE 5: Module 5: Machine Learning & Land Cover Classification
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gee_cid, 'Module 5: Machine Learning & Land Cover Classification', 'mod5-machine-learning', 5, 'Training Random Forest models directly in the browser to map land cover.')
  RETURNING id INTO m5_id;

  -- Lesson 1: 1. Machine Learning in GEE (Supervised Classification)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m5_id, '1. Machine Learning in GEE (Supervised Classification)', 'ml-classification', 1, 
  $markdown$

# Supervised Classification 🤖

GEE-তে Machine Learning (ML) মডেল রান করানো খুবই সহজ। আমরা প্রধানত **Supervised Classification** দেখবো, যেখানে আমরা মডেলকে আগে থেকে কিছু "Training Data" দিয়ে শিখিয়ে দেবো কোনটা পানি, কোনটা বন, আর কোনটা শহর।

### Workflow:
1. **Training Data Collection:** ম্যাপে পয়েন্ট (FeatureCollection) এঁকে বলে দেওয়া (Water=0, Veg=1, Urban=2)।
2. **Feature Extraction:** ওই পয়েন্টগুলোতে স্যাটেলাইট ইমেজের ব্যান্ড ভ্যালুগুলো (Signature) এক্সট্র্যাক্ট করা।
3. **Training the Classifier:** Random Forest বা CART মডেলকে ট্রেইন করা।
4. **Classification:** পুরো ইমেজকে ক্লাসিফাই করা।

$markdown$, NULL) RETURNING id INTO l_id;

  -- Lesson 2: 2. Case Study: Training a Random Forest Classifier
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m5_id, '2. Case Study: Training a Random Forest Classifier', 'random-forest', 2, 
  $markdown$

# Training a Random Forest Model

GEE-তে Random Forest হলো সবচেয়ে পপুলার এবং একুরেট ক্লাসিফায়ার।

```javascript
// 1. Training Data (ধরি water, veg, urban ৩টি FeatureCollection)
var trainingPoints = water.merge(veg).merge(urban);

// 2. Training Data-তে ইমেজের ভ্যালু যুক্ত করা
var training = image.sampleRegions({
  collection: trainingPoints,
  properties: ['class'], // কোন কলামে ক্লাস (0,1,2) লেখা আছে
  scale: 30
});

// 3. Random Forest ক্লাসিফায়ার ট্রেইন করা (ধরি 50 টি গাছ/trees)
var classifier = ee.Classifier.smileRandomForest(50).train({
  features: training,
  classProperty: 'class',
  inputProperties: ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'] // ব্যান্ডগুলো
});

// 4. ইমেজ ক্লাসিফাই করা
var classifiedImage = image.classify(classifier);

// 5. ম্যাপে দেখানো
var classVis = {
  min: 0, max: 2, 
  palette: ['blue', 'green', 'red'] // 0=Blue, 1=Green, 2=Red
};
Map.addLayer(classifiedImage, classVis, 'Land Cover Map');
```

অসাধারণ! আপনি মাত্র ১০ লাইন কোডে একটি Machine Learning মডেল ট্রেইন করে পুরো জেলার ল্যান্ড কাভার ম্যাপ তৈরি করে ফেললেন!

$markdown$, NULL) RETURNING id INTO l_id;

  -- Quiz: Module 5 Quiz
  INSERT INTO public.quizzes (lesson_id, title, is_published, max_xp, pass_threshold) 
  VALUES (l_id, 'Module 5 Quiz', TRUE, 75, 70) RETURNING id INTO q_id;
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'Supervised Classification-এ মডেলকে শেখানোর জন্য যে ডেটা দেওয়া হয় তাকে কী বলে?', '["Testing Data","Training Data","Validation Data","Input Data"]'::jsonb, '1');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'GEE-তে Random Forest ক্লাসিফায়ার কল করার সঠিক ফাংশন কোনটি?', '["ee.ML.RandomForest()","ee.Classifier.RandomForest()","ee.Classifier.smileRandomForest()","ee.Model.RandomForest()"]'::jsonb, '2');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'trainingPoints-এ ইমেজের পিক্সেল ভ্যালু এক্সট্র্যাক্ট করতে কোন ফাংশন ব্যবহার করা হয়?', '["extractValues()","getPixels()","sampleRegions()","reduceRegion()"]'::jsonb, '2');

  -- ================================================================================================
  -- MODULE 6: Module 6: Synthetic Aperture Radar (SAR) & Flood Mapping
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gee_cid, 'Module 6: Synthetic Aperture Radar (SAR) & Flood Mapping', 'mod6-sar-floods', 6, 'Using Sentinel-1 SAR data to see through clouds during monsoons.')
  RETURNING id INTO m6_id;

  -- Lesson 1: 1. Intro to SAR & Sentinel-1
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m6_id, '1. Intro to SAR & Sentinel-1', 'intro-sar', 1, 
  $markdown$

# Why SAR? (Seeing through clouds) ☁️🛰️

বাংলাদেশে বন্যার সময় (Monsoon) আকাশ সবসময় মেঘে ঢাকা থাকে। তখন Landsat বা Sentinel-2 (Optical Sensors) দিয়ে মাটির ছবি তোলা অসম্ভব। 

এখানেই **SAR (Synthetic Aperture Radar)** এর ম্যাজিক শুরু! SAR সেন্সর মেঘ ভেদ করে মাটির ছবি তুলতে পারে। 

GEE-তে সবচেয়ে পপুলার SAR ডেটা হলো **Sentinel-1**।

```javascript
// Load Sentinel-1 GRD Data
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(sylhet)
  .filterDate('2022-06-15', '2022-06-30') // ২০২২ সালের ভয়াবহ বন্যা
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .select('VV');

var floodedImage = s1.mosaic().clip(sylhet);
Map.addLayer(floodedImage, {min: -25, max: 0}, 'Sentinel-1 Flood');
```

$markdown$, NULL) RETURNING id INTO l_id;

  -- Lesson 2: 2. Thresholding SAR for Rapid Flood Mapping
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m6_id, '2. Thresholding SAR for Rapid Flood Mapping', 'sar-flood-mapping', 2, 
  $markdown$

# Rapid Flood Mapping

রাডারে পানি সবসময় কালো (Dark) দেখায়। কারণ পানির পৃষ্ঠ খুব মসৃণ হওয়ায় রাডার সিগন্যাল স্যাটেলাইটে ফেরত না গিয়ে অন্যদিকে চলে যায় (Specular Reflection)। 

ফলে পানির ব্যাকস্ক্যাটার (Backscatter) ভ্যালু খুব কম হয় (সাধারণত -18 dB এর নিচে)।

```javascript
// Thresholding: -16 dB এর নিচের পিক্সেলগুলো পানি
var waterMask = floodedImage.lt(-16);

// ম্যাপে শুধু পানি (নীল রঙে) দেখানো
Map.addLayer(waterMask.selfMask(), {palette: 'blue'}, 'Flood Extent');
```

এই পদ্ধতি ব্যবহার করে দুর্যোগ ব্যবস্থাপনার সময় মাত্র কয়েক মিনিটের মধ্যে বন্যার ব্যাপ্তি (Flood Extent) ম্যাপ করে ফেলা সম্ভব!

$markdown$, NULL) RETURNING id INTO l_id;

  -- Quiz: Module 6 Quiz
  INSERT INTO public.quizzes (lesson_id, title, is_published, max_xp, pass_threshold) 
  VALUES (l_id, 'Module 6 Quiz', TRUE, 75, 70) RETURNING id INTO q_id;
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'বন্যার সময় অপটিক্যাল স্যাটেলাইট (Landsat) এর প্রধান সমস্যা কী?', '["রেজোলিউশন খারাপ","মেঘের কারণে মাটির ছবি তোলা যায় না","ছবি সাদাকালো আসে","ডেটা পাওয়া যায় না"]'::jsonb, '1');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'মেঘ ভেদ করে ছবি তুলতে সক্ষম স্যাটেলাইট সেন্সর কোনটি?', '["Optical","Thermal","SAR (Synthetic Aperture Radar)","LiDAR"]'::jsonb, '2');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'SAR ইমেজে পানি কেন কালো (Dark) দেখায়?', '["পানি সিগন্যাল শুষে নেয়","Specular Reflection এর কারণে সিগন্যাল অন্যদিকে চলে যায়","পানির গভীরতার কারণে","মেঘের ছায়ার কারণে"]'::jsonb, '1');

  -- ================================================================================================
  -- MODULE 7: Module 7: Time Series Analysis & Visualization
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gee_cid, 'Module 7: Time Series Analysis & Visualization', 'mod7-time-series', 7, 'Plotting charts and detecting changes over time.')
  RETURNING id INTO m7_id;

  -- Lesson 1: 1. Interactive Charting in GEE
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m7_id, '1. Interactive Charting in GEE', 'charts', 1, 
  $markdown$

# Plotting Time Series Charts 📈

GEE-তে `ui.Chart` ব্যবহার করে আমরা খুব সহজেই ডেটার টাইম সিরিজ প্লট করতে পারি। 
ধরি আমরা একটি নির্দিষ্ট কৃষি জমিতে সারা বছরের NDVI-এর পরিবর্তন দেখতে চাই।

```javascript
var myFarm = ee.Geometry.Point([89.5, 24.5]);

// Create NDVI Time Series Chart
var chart = ui.Chart.image.series({
  imageCollection: modisNDVI, // MODIS NDVI Collection
  region: myFarm,
  reducer: ee.Reducer.mean(),
  scale: 250,
  xProperty: 'system:time_start'
}).setOptions({
  title: 'NDVI Time Series for My Farm',
  vAxis: {title: 'NDVI'},
  hAxis: {title: 'Date'},
  lineWidth: 2,
  colors: ['green']
});

print(chart);
```
এই কোডটি রান করলে Console-এ একটি সুন্দর ইন্টার‍্যাক্টিভ গ্রাফ তৈরি হবে, যেখান থেকে আপনি বুঝতে পারবেন কখন ফসল বোনা হয়েছিল আর কখন কাটা হয়েছে!

$markdown$, NULL) RETURNING id INTO l_id;

  -- Quiz: Module 7 Quiz
  INSERT INTO public.quizzes (lesson_id, title, is_published, max_xp, pass_threshold) 
  VALUES (l_id, 'Module 7 Quiz', TRUE, 75, 70) RETURNING id INTO q_id;
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'GEE Code Editor-এ গ্রাফ বা চার্ট তৈরি করার জন্য কোন মডিউল ব্যবহার করা হয়?', '["ee.Graph","ui.Chart","Map.Plot","Export.Chart"]'::jsonb, '1');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'Time Series Chart-এ X-Axis এ সাধারণত কী থাকে?', '["NDVI Value","Temperature","Time/Date (system:time_start)","Latitude"]'::jsonb, '2');

  -- ================================================================================================
  -- MODULE 8: Module 8: Exporting & Building UI Apps
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gee_cid, 'Module 8: Exporting & Building UI Apps', 'mod8-export-apps', 8, 'Exporting maps to Google Drive and building interactive Web Apps.')
  RETURNING id INTO m8_id;

  -- Lesson 1: 1. Exporting Data (Drive & Asset)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m8_id, '1. Exporting Data (Drive & Asset)', 'exporting', 1, 
  $markdown$

# Exporting Results 📤

যেকোনো অ্যানালাইসিস শেষে ম্যাপ বা ডেটা এক্সপোর্ট করা খুবই জরুরি, যাতে ক্লায়েন্ট বা অন্য সফটওয়্যারে (QGIS/ArcGIS) কাজ করা যায়।

### Exporting Raster Image to Google Drive
```javascript
Export.image.toDrive({
  image: ndviImage,
  description: 'NDVI_Map_2024',
  folder: 'GEE_Outputs',
  scale: 30, // Landsat resolution
  region: bangladesh.geometry(), // বাউন্ডারি
  maxPixels: 1e13 // বড় ম্যাপের জন্য মাস্ট!
});
```
কোড রান করার পর **Tasks** ট্যাবে গিয়ে "Run" এ ক্লিক করলে এটি আপনার Google Drive-এ সেভ হওয়া শুরু করবে।

### Exporting Stats (CSV) to Drive
```javascript
Export.table.toDrive({
  collection: districtStats, // Zonal stats FeatureCollection
  description: 'District_Rainfall_Stats',
  fileFormat: 'CSV'
});
```

$markdown$, NULL) RETURNING id INTO l_id;

  -- Lesson 2: 2. Building Earth Engine Apps
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m8_id, '2. Building Earth Engine Apps', 'ee-apps', 2, 
  $markdown$

# Earth Engine Apps 🚀

GEE-এর সবচেয়ে দারুণ ফিচার হলো আপনি আপনার কোডকে একটি ইন্টার‍্যাক্টিভ ওয়েব অ্যাপ (Web App) এ রূপান্তর করতে পারবেন, যা যে কেউ (GEE অ্যাকাউন্ট ছাড়াই) ব্যবহার করতে পারবে।

```javascript
// Create a User Interface Panel
var panel = ui.Panel({
  style: {width: '300px'}
});

// Add a Title
var title = ui.Label({
  value: 'Flood Monitoring App',
  style: {fontSize: '20px', fontWeight: 'bold'}
});
panel.add(title);

// Add Panel to Map
ui.root.insert(0, panel);
```
এইভাবে আপনি স্লাইডার, ড্রপডাউন এবং বাটন অ্যাড করে একটি পূর্ণাঙ্গ ড্যাশবোর্ড তৈরি করতে পারেন। **Apps** বাটনে ক্লিক করে এটি পাবলিকলি পাবলিশ করা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- Quiz: Module 8 Quiz
  INSERT INTO public.quizzes (lesson_id, title, is_published, max_xp, pass_threshold) 
  VALUES (l_id, 'Module 8 Quiz', TRUE, 75, 70) RETURNING id INTO q_id;
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'ম্যাপ (Raster Image) Google Drive-এ এক্সপোর্ট করার ফাংশন কোনটি?', '["Export.map.toDrive()","Export.image.toDrive()","Export.raster.toDrive()","Export.table.toDrive()"]'::jsonb, '1');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'বড় ইমেজ এক্সপোর্ট করার সময় এরর এড়াতে কোন প্যারামিটারটি অবশ্যই সেট করতে হয়?', '["folder","description","maxPixels","fileFormat"]'::jsonb, '2');
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_option) VALUES (q_id, 'GEE Apps পাবলিশ করলে সেটি কে ব্যবহার করতে পারবে?', '["শুধু আমি","শুধু যাদের GEE অ্যাকাউন্ট আছে","যে কেউ (লিংক থাকলে)","শুধু ডেভেলপাররা"]'::jsonb, '2');

END;
$$;