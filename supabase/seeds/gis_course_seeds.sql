-- SEED DATA: GIS COURSE (ALL MODULES)
-- This file contains the complete curriculum for "ArcGIS & Spatial Analysis for Agri-Sciences".
-- It handles cleanup, course creation, and content for all modules.

DO $$
DECLARE
  gis_cid UUID; -- GIS Course ID
  m1_id UUID; -- Module 1 ID
  m2_id UUID; -- Module 2 ID
  m3_id UUID; -- Module 3 ID
  m4_id UUID; -- Module 4 ID
  m5_id UUID; -- Module 5 ID
  m6_id UUID; -- Module 6 ID
  m7_id UUID; -- Module 7 ID
  m8_id UUID; -- Module 8 ID
  m9_id UUID; -- Module 9 ID
  m10_id UUID; -- Module 10 ID
  l_id UUID;  -- Temp Lesson ID
BEGIN
  -- ================================================================================================
  -- 1. SETUP & CLEANUP
  -- ================================================================================================
  
  -- Remove existing course to ensure a clean slate (Cascade will remove modules/lessons/quizzes)
  DELETE FROM public.courses WHERE slug = 'gis-agri-arcgis';

  -- Create Course
  INSERT INTO public.courses (title, slug, description, is_published, thumbnail_url)
  VALUES (
    'ArcGIS & Spatial Analysis for Agri-Sciences', 
    'gis-agri-arcgis', 
    'Master Spatial Thinking, ArcGIS Pro, and Satellite Remote Sensing for Agriculture. Solve real-world mapping, soil suitability, and flood impact problems in Bangladesh.', 
    TRUE,
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2670&auto=format&fit=crop'
  ) RETURNING id INTO gis_cid;

  -- ================================================================================================
  -- MODULE 1: INTRODUCTION TO SPATIAL THINKING & GIS ECOSYSTEM
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gis_cid, 'Module 1: Orientation & GIS Ecosystem', 'intro-gis-ecosystem', 1, 'Understand the foundations of GIS and setup your ArcGIS environment.')
  RETURNING id INTO m1_id;

  -- Lesson 1: Introduction to GIS and Agri-GIS
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id, '1. What is GIS? Why Agri-GIS is Your Secret Weapon', 'what-is-gis', 1, 
  $markdown$
# Module Overview
এই মডিউলে আমরা ভৌগোলিক তথ্য ব্যবস্থা বা GIS (Geospatial Information Systems) এর মূল ধারণার সাথে পরিচিত হব। একইসাথে আমাদের সিস্টেমে ArcGIS সেটআপ এবং এর বেসিক ইন্টারফেস নেভিগেশন শিখব।

# Lesson 1: What is GIS? Why Agri-GIS is Your Secret Weapon

আসসালামু আলাইকুম! আশা করি সবাই ভালো আছেন।
R-এর মাধ্যমে আমরা ডেটা টেবিল নিয়ে তো অনেক কাজ করেছি। কিন্তু ভাবুন তো, যদি আপনার ডেটার সাথে একটি লোকেশন বা মানচিত্রের সরাসরি সংযোগ থাকে? উদাহরণস্বরূপ, ময়মনসিংহের কোন ইউনিয়নের মাটিতে নাইট্রোজেনের পরিমাণ কত, কিংবা চলনবিলের কোন এলাকায় এ বছর বোরো ধান বেশি উৎপন্ন হয়েছে, তা যদি সরাসরি ম্যাপে ভিজ্যুয়ালাইজ করা যেত?

সেখানেই আমাদের উদ্ধার করতে আসে **GIS (Geographic Information System)**। 

সহজ কথায়, **GIS = Geography + Data + Tools**। এটি শুধু একটি মানচিত্র নয়, এটি এমন একটি ডাটাবেজ সিস্টেম যা মানচিত্রের প্রতিটি ফিচারের পেছনে তার গুণাগুণ বা অ্যাট্রিবিউট লুকিয়ে রাখে।

[IMAGE: What is GIS Conceptual Diagram. Caption: GIS এর বিভিন্ন স্তরের লেয়ার ওভারলে কনসেপ্ট - সীমানা, রাস্তা, নদী এবং ফসল ক্ষেত মিলে একটি পূর্ণাঙ্গ ম্যাপ তৈরি হয়।]

### এগ্রিকালচার এবং আমাদের বাস্তব গবেষণায় এর কাজ কী?
১. **Crop Suitability (ফসল উপযুক্ততা নির্ধারণ):** মাটি, ঢাল (Slope), বৃষ্টিপাত এবং তাপমাত্রার মানচিত্র ওভারলে বা উপরিপাতন করে বের করা সম্ভব যে ঠিক কোন অংশে আলু চাষ ভালো হবে।
২. **Flood Damage Assessment (বন্যা ক্ষয়ক্ষতি নিরূপণ):** কুড়িগ্রাম বা নেত্রকোনার হাওর অঞ্চলে বন্যার আগে ও পরের স্যাটেলাইট ইমেজ ম্যাপ করে জানা যায় কত একর আবাদি জমি পানির নিচে তলিয়ে গেছে।
৩. **Precision Farming (পরিমিত কৃষি):** জিপিএস ট্র্যাকার ব্যবহার করে ড্রোন বা ট্রাক্টর দিয়ে সার ছিটানোর ম্যাপ তৈরি করা।

### Step-by-Step Spatial Concept
আমাদের সাধারণ এক্সেলে ডেটা দেখতে এমন হয়:
`District | Soil_pH | Yield`
`Mymensingh | 5.5 | 4.2`

কিন্তু GIS-এ এই ডেটার সাথে যুক্ত থাকে স্পেশিয়াল কোঅর্ডিনেট (Spatial Coordinates/Geometry):
`District | Soil_pH | Yield | Geometry (Polygon Boundary)`

👉 **বাস্তব চিন্তা:** আপনি কি জানেন? আগে আমরা R-এ যে `data.frame` ব্যবহার করতাম, GIS সেই ডেটাফ্রেমেই প্রতিটি রোর সাথে একটি করে জ্যামিতিক নকশা (Point, Line, বা Polygon) জুড়ে দেয়!

### End of Lesson Summary
আজকে আমরা জানলাম:
১. GIS কী এবং কীভাবে ডেটার সাথে মানচিত্রকে সংযুক্ত করে।
২. কৃষি বিজ্ঞানে এর বহুমুখী ব্যবহারের একটি প্রাথমিক ধারণা।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L1
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'GIS এর পূর্ণরূপ কোনটি?', '["Geographic Information System", "Geological Info Study", "Global Infrastructure System", "General Imaging Software"]'::jsonb, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'সাধারণ স্প্রেডশিটের সাথে GIS স্প্রেডশিটের মূল পার্থক্য কোথায়?', '["GIS এ ডেটা এন্ট্রি করা যায় না", "GIS এ প্রতিটি ডেটার সাথে স্পেশিয়াল জিওমেট্রি যুক্ত থাকে", "GIS এ গ্রাফ আঁকা যায় না", "কোন পার্থক্য নেই"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'নিচের কোনটি এগ্রি-জিআইএস এর বাস্তব উদাহরণ?', '["বন্যার পরে ক্ষতিগ্রস্ত ফসল ক্ষেতের সীমানা ও আয়তন নির্ধারণ", "মোবাইলের ক্যামেরা দিয়ে ছবি তোলা", "ওয়ার্ড ফাইলে রিপোর্ট লেখা", "অনলাইনে সার কেনা"]'::jsonb, 0);


  -- Lesson 2: Spatial Thinking: Thinking in Layers
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id, '2. Spatial Thinking: Thinking in Layers', 'spatial-thinking-layers', 2, 
  $markdown$
# Lesson 2: Spatial Thinking: Thinking in Layers

স্বাগতম দ্বিতীয় লেসনে! আজ আমরা শিখব কিভাবে একজন কার্টোগ্রাফার বা স্পেশিয়াল সায়েন্টিস্টের মতো চিন্তা করতে হয়। একে বলে **Spatial Thinking (স্থানিক চিন্তা)**।

যখন আমরা বাস্তব জগতের দিকে তাকাই, আমরা একসাথে বাড়িঘর, মাটি, ফসল, রাস্তাঘাট, নদী সবকিছু দেখতে পাই। কিন্তু GIS সিস্টেমে আমরা এই বাস্তব জগতকে ভেঙে ফেলি এবং কিছু আলাদা স্তরে (Layers) ভাগ করি।

[IMAGE: Spatial Thinking Layers Overlay Visual. Caption: বাস্তব বিশ্বকে কীভাবে ক্যাডাস্ট্রাল সীমানা, এলিভেশন, ল্যান্ড ইউজ এবং ইমেজ লেয়ারে আলাদা করে ম্যাপ তৈরি করা হয় তার চিত্র।]

### স্যান্ডউইচ অ্যানালজি (Sandwich Analogy)
একটি সুস্বাদু স্যান্ডউইচের কথা চিন্তা করুন। সেখানে নিচে থাকে ব্রেড, তার ওপর মেয়নেজ, তার ওপর লেটুস পাতা, ডিম এবং সবশেষে আরেক টুকরো ব্রেড। আপনি যদি ওপর থেকে স্যান্ডউইচটি কামড় দেন, তবে আপনি একসাথে সবকিছুর স্বাদ পাবেন। 
GIS-ও ঠিক এই স্যান্ডউইচের মতো!
- **বেস লেয়ার (Base Layer):** আমাদের বাংলাদেশ ম্যাপের সীমানা।
- **মাটি লেয়ার (Soil Layer):** মাটির পিএইচ (pH) বা পুষ্টি উপাদান।
- **পানি লেয়ার (Hydrology Layer):** নদী বা খাল-বিলের ম্যাপ।
- **ফসল লেয়ার (Crop Layer):** কোথায় কোন ফসল চাষ হচ্ছে।

এই লেয়ারগুলোকে যখন আপনি একটির ওপর আরেকটি সাজিয়ে রাখবেন, তখন আপনার স্ক্রিনে সম্পূর্ণ সুন্দর একটি কৃষি মানচিত্র ফুটে উঠবে।

👉 **বাস্তব চিন্তা:** আমরা R-এ যেভাবে `ggplot2` লাইব্রেরি দিয়ে প্লাস চিহ্নের (`+`) মাধ্যমে একের পর এক জ্যামিতিক লেয়ার (`geom_point()`, `geom_line()`) যোগ করে প্লট তৈরি করতাম, GIS সফটওয়্যারেও ঠিক তেমনি মাউসের ক্লিকে লেয়ার টেনে একটার ওপর আরেকটা বসানো হয়!

### End of Lesson Summary
১. স্পেশিয়াল থিংকিং মানে হচ্ছে পুরো বিশ্বকে আলাদা আলাদা লেয়ারে ভাগ করে দেখা।
২. ম্যাপ ওভারলে করার মাধ্যমে আমরা বিভিন্ন বিষয়ের পারস্পরিক সম্পর্ক খুঁজে বের করতে পারি।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L2
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'GIS সিস্টেমে বিভিন্ন মানচিত্রের ডেটা কীভাবে সাজানো থাকে?', '["একক ফাইলে এলোমেলোভাবে", "আলাদা আলাদা স্তরে বা লেয়ারে (Layers)", "শুধু পিডিএফ ফরমেটে", "শুধুমাত্র টেক্সট আকারে"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একটি কৃষি এলাকায় নাইট্রোজেনের ঘাটতি ও সেচ খালের দূরত্বের সম্পর্ক বের করতে কোন পদ্ধতি ব্যবহার করবেন?', '["ম্যাপ ডিলিট করবেন", "দুটি ভিন্ন লেয়ারকে একে অপরের ওপর বসিয়ে (Overlay) বিশ্লেষণ করবেন", "শুধু এক্সেল ব্যবহার করবেন", "কিছুই করার প্রয়োজন নেই"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'R-এর ggplot2-এর সাথে GIS লেয়ারের মিল কোথায়?', '["উভয়েই লেয়ার-ভিত্তিক ডিজাইনে কাজ করে", "উভয়েই ডাটাবেজ আপডেট করতে পারে না", "উভয়ের কাজ কেবল ওয়েবসাইট বানানো", "কোনো মিল নেই"]'::jsonb, 0);


  -- Lesson 3: The ArcGIS Ecosystem (ArcMap vs ArcGIS Pro)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id, '3. The ArcGIS Ecosystem: Standard ArcGIS vs ArcGIS Pro', 'arcgis-ecosystem', 3, 
  $markdown$
# Lesson 3: The ArcGIS Ecosystem: ArcMap vs ArcGIS Pro

আজকে আমরা কথা বলব GIS দুনিয়ার সবচেয়ে জনপ্রিয় সফটওয়্যার ব্র্যান্ড **ArcGIS** নিয়ে। এটি মূলত তৈরি করেছে **Esri** নামক একটি আমেরিকান কোম্পানি।

আপনি যদি বড় ভাইদের থিসিস বা পুরানো টিউটোরিয়াল দেখেন, তবে দুটি সফটওয়্যারের নাম বারবার শুনবেন:
১. **ArcMap (Legacy/Classic):** এটি গত দুই দশকেরও বেশি সময় ধরে বিশ্বজুড়ে ব্যবহৃত হয়ে আসছে। তবে মনে রাখবেন, এটি একটি ৩২-বিট (32-bit) পুরানো সফটওয়্যার, যা Esri ধীরে ধীরে বন্ধ করে দিচ্ছে।
২. **ArcGIS Pro (Modern):** এটি হলো বর্তমান ও ভবিষ্যৎ। এটি সম্পূর্ণ ৬৪-বিট (64-bit) অ্যাপ্লিকেশন এবং এতে রয়েছে আধুনিক ফিতা-ভিত্তিক (Ribbon Interface) ডিজাইন, যা মাইক্রোসফট অফিসের মতো দেখতে।

[IMAGE: ArcMap vs ArcGIS Pro UI Comparison. Caption: প্রাচীন ArcMap এর ধূসর ক্লাসিক উইন্ডো এবং আধুনিক ArcGIS Pro এর চমৎকার রিবন ইন্টারফেসের একটি স্ক্রিনশট।]

### এগ্রি-রিসার্চে কোনটি ব্যবহার করবেন?
আমরা সবসময় **ArcGIS Pro** শেখার দিকে জোর দেব, তবে একই সাথে আমরা এই কোর্সে এমনভাবে টুলগুলো নিয়ে আলোচনা করব যাতে আপনি যদি ল্যাবে ArcMap ব্যবহার করতে বাধ্য হন, তাহলেও যেন কাজ করতে কোনো সমস্যা না হয়। কারণ দিনশেষে উভয়ের পেছনের স্পেশিয়াল লজিক কিন্তু একই!

👉 **মনে রাখার টিপস:** ArcMap এবং ArcGIS Pro এর সম্পর্ক হচ্ছে ক্লাসিক নোকিয়া ফোন আর লেটেস্ট আইফোনের মতো। কাজ দুটিতেই ফোন করা বা ম্যাপ তৈরি করা যায়, তবে আইফোন বা ArcGIS Pro তে কাজটি অনেক দ্রুত ও থ্রি-ডি ভিজ্যুয়ালাইজেশন সহ করা যায়!

### End of Lesson Summary
১. ArcGIS হলো Esri কোম্পানির তৈরি একটি স্পেশিয়াল সফটওয়্যার ইকোসিস্টেম।
২. ArcMap হচ্ছে পুরোনো ক্লাসিক ইন্টারফেস এবং ArcGIS Pro হচ্ছে আধুনিক ৬৪-বিট ফিউচার সফটওয়্যার।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L3
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'Esri কোম্পানির তৈরি সবচেয়ে আধুনিক ডেস্কটপ GIS সফটওয়্যার কোনটি?', '["QGIS", "ArcGIS Pro", "ArcMap", "MS Excel"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ArcMap এবং ArcGIS Pro এর মধ্যে বড় যান্ত্রিক পার্থক্য কোথায়?', '["ArcMap 64-bit এবং ArcGIS Pro 32-bit", "ArcGIS Pro সম্পূর্ণ ৬৪-বিট যা বিশাল মেমোরি ও প্রোসেসিং হ্যান্ডেল করতে পারে", "ArcMap এ ম্যাপ তৈরি করা যায় না", "উভয়ই একদম এক"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কেন আমাদের নতুন প্রজেক্টগুলোতে ArcGIS Pro শেখা উচিত?', '["কারণ এটি Esri এর ভবিষ্যৎ এবং এতে শক্তিশালী ৩ডি ও প্রসেসিং ফিচার আছে", "কারণ এটি ফ্রিতে চলে", "কারণ এটি দিয়ে ওয়েবসাইট কোড করা যায়", "কারণ এটি মোবাইল অ্যাপ"]'::jsonb, 0);


  -- Lesson 4: Installing ArcGIS Pro & Setup
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id, '4. Installing ArcGIS and Setting Up Your Workstation', 'install-setup', 4, 
  $markdown$
# Lesson 4: Installing ArcGIS Pro & Setting Up Your Workstation

কোনো সফটওয়্যার নিয়ে কাজ শুরু করার আগে তার ঘরদোর গুছিয়ে নেওয়া বা সেটআপ করা জরুরি। আজকে আমরা জানব কীভাবে আপনার উইন্ডোজ কম্পিউটারে ArcGIS Pro ইন্সটল করতে হবে এবং এর সিস্টেম রিকোয়ারমেন্টস কী।

### সিস্টেমের প্রয়োজনীয়তা (System Requirements)
ArcGIS Pro অনেক বেশি গ্রাফিক্স এবং প্রসেসর ব্যবহার করে। মসৃণভাবে এটি রান করার জন্য আপনার ন্যূনতম প্রয়োজন:
- **Processor:** Intel Core i5/i7 (বা AMD সমমানের)
- **RAM:** 8 GB (16 GB রেকমেন্ডেড)
- **Storage:** SSD হতে হবে, সাধারণ হার্ডডিস্কে এটি বেশ ধীরগতিতে চলবে।
- **Operating System:** Windows 10 বা 11 (64-bit)

[IMAGE: ArcGIS Pro Installation Guide Step. Caption: ArcGIS Pro এর ইন্সটলেশন সেটআপ উইজার্ড উইন্ডো।]

### ইন্সটলেশন ধাপসমূহ:
১. **Esri Account:** প্রথমে Esri এর অফিসিয়াল ওয়েবসাইটে একটি অ্যাকাউন্ট খুলুন। শিক্ষার্থীরা সহজেই ২১ দিনের ট্রায়াল লাইসেন্স পেতে পারেন।
২. **Download Installer:** ArcGIS Pro ডাউনলোডার ফাইলটি নামিয়ে নিন (আকার প্রায় ২.৫ জিবি)।
৩. **Run Setup:** ডাউনলোড শেষে ক্লিক করে স্বাভাবিক উইন্ডোজ সফটওয়্যারের মতো ইন্সটল করুন।
৪. **Sign In:** প্রথমবার সফটওয়্যার চালু করার সময় আপনার অ্যাকাউন্ট দিয়ে সাইন ইন করলেই ইন্টারফেস রেডি হয়ে যাবে।

👉 **সাহস বাড়ানোর টিপস:** যাদের কম্পিউটার একটু কমজোরি, তারা চিন্তিত হবেন না। আমাদের প্র্যাকটিক্যাল মডিউলগুলোতে আমরা হালকা ওজনের ডেটাসেট ব্যবহার করব যাতে আপনার পিসি হ্যাং না হয়!

### End of Lesson Summary
১. ArcGIS Pro ইন্সটলেশনের জন্য উইন্ডোজ ১০/১১ এবং ন্যূনতম ৮ জিবি র‍্যাম থাকা প্রয়োজন।
২. Esri ট্রায়াল বা প্রাতিষ্ঠানিক অ্যাকাউন্ট দিয়ে এটি অ্যাক্টিভেট করা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L4
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ArcGIS Pro ব্যবহারের জন্য ন্যূনতম কতটুকু র‍্যাম প্রয়োজন?', '["2 GB", "4 GB", "8 GB", "32 GB"]'::jsonb, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কোন অপারেটিং সিস্টেমে ArcGIS Pro সাপোর্ট করে?', '["Android", "Windows 10/11 (64-bit)", "Linux Mint 32-bit", "macOS standard natively"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ইন্সটলেশন শেষ হওয়ার পর সফটওয়্যার চালুর জন্য প্রথম কাজ কোনটি?', '["কম্পিউটার ফরম্যাট করা", "Esri অ্যাকাউন্ট দিয়ে সাইন ইন ও লাইসেন্স ভেরিফিকেশন", "কোডিং শুরু করা", "স্যাটেলাইট কেনা"]'::jsonb, 1);


  -- Lesson 5: Interface Navigation and Catalog Basics
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id, '5. Interface Tour: Panels, Catalogs & Creating Your First Project', 'interface-catalog', 5, 
  $markdown$
# Lesson 5: Interface Tour: Panels, Catalogs & Creating Your First Project

আসুন এবার আমরা আমাদের প্রথম প্রজেক্ট শুরু করি এবং ArcGIS Pro-এর মূল ইন্টারফেসটির সাথে হাত মেলানো যাক!

সফটওয়্যারটি ওপেন করলেই আপনি বেশ কিছু প্যানেল বা উইন্ডো দেখতে পাবেন। ভয় পাওয়ার কিছু নেই, এগুলো বোঝা খুবই সহজ!

[IMAGE: ArcGIS Pro Main Interface Layout. Caption: ArcGIS Pro এর ইন্টারফেস পরিচিতি - রিবন মেনু, কন্টেন্টস প্যানেল, ম্যাপ ক্যানভাস এবং ক্যাটালগ ভিউ এর অবস্থান।]

### ৩টি গুরুত্বপূর্ণ স্তম্ভ (The Three Main Panels)
১. **The Ribbon (রিবন):** একদম ওপরে থাকা মাইক্রোসফট ওয়ার্ডের মতো অপশনবার। এখানে Map, Insert, Analysis, Share ইত্যাদি ট্যাব থাকে।
২. **Contents Panel (কন্টেন্টস প্যানেল):** বাম পাশের এই প্যানেলে আপনার ম্যাপের সব লেয়ারের তালিকা থাকবে। যেমন: বর্ডার, নদী, মাটির লেয়ার। আপনি এখান থেকেই লেয়ার অন-অফ করতে পারবেন।
৩. **Catalog Panel (ক্যাটালগ প্যানেল):** ডান পাশের এটি হলো আপনার ফাইলের ম্যানেজার। এর মাধ্যমেই আপনি কম্পিউটারের ফোল্ডার কানেক্ট করবেন এবং নতুন ডেটা যুক্ত করবেন।

👉 **বাস্তব প্র্যাকটিস:** প্রথমে `New Project` এ ক্লিক করে একটি নাম দিন (যেমন: `My_First_Agri_Map`)। খেয়াল রাখবেন যাতে প্রজেক্টটি ড্রাইভের এমন ফোল্ডারে সেভ হয় যা আপনি সহজে খুঁজে পান!

### End of Lesson Summary
১. রিবন বার আমাদের টুলস সিলেক্ট করতে সাহায্য করে।
২. কন্টেন্টস প্যানেল আমাদের ম্যাপ লেয়ার নিয়ন্ত্রণ করে।
৩. ক্যাটালগ প্যানেল দিয়ে আমরা এক্সটার্নাল ডেটা আমাদের প্রজেক্টে কানেক্ট করি।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L5
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ম্যাপে কোন কোন লেয়ার দৃশ্যমান তা নিয়ন্ত্রণ করে কোন প্যানেল?', '["Catalog Panel", "Contents Panel", "Geoprocessing Tool", "Attribute Table"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কম্পিউটারের কোনো ফোল্ডার থেকে ডেটা ম্যাপে ড্র্যাগ করে আনতে কোন প্যানেল ব্যবহার করবেন?', '["Contents Panel", "Ribbon Menu", "Catalog Panel", "Metadata Viewer"]'::jsonb, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ArcGIS Pro চালু করার পর নতুন কাজ শুরুর প্রথম বৈজ্ঞানিক ধাপ কোনটি?', '["কম্পিউটার রিস্টার্ট করা", "একটি নতুন প্রজেক্ট (.aprx) তৈরি বা ওপেন করা", "ইন্টারনেট ব্রাউজ করা", "ম্যাপ প্রিন্ট দেওয়া"]'::jsonb, 1);

  -- ================================================================================================
  -- MODULE 2: THE GEOMETRY OF EARTH: COORDINATE SYSTEMS & MAP PROJECTIONS
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gis_cid, 'Module 2: Coordinate Systems & Map Projections', 'coordinate-systems-projections', 2, 'Learn how Earth geometry is represented on flat maps without distortion.')
  RETURNING id INTO m2_id;

  -- Lesson 6: Earth is Not Round (Spheroids and Geoids)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '6. Earth is Not Round (Spheroids and Geoids)', 'earth-shape-geometry', 1, 
  $markdown$
# Module Overview
এই মডিউলে আমরা মানচিত্রের প্রাণ—কোঅর্ডিনেট সিস্টেম ও প্রজেকশন নিয়ে আলোচনা করব। পৃথিবী গোল কিন্তু ম্যাপ চ্যাপ্টা; এই পার্থক্যের কারণে ম্যাপে যে দূরত্ব ও ক্ষেত্রফলের বিকৃতি ঘটে, তা আমরা বৈজ্ঞানিকভাবে মোকাবিলা করতে শিখব।

# Lesson 6: Earth is Not Round (Spheroids and Geoids)

ছোটবেলা থেকে আমরা পড়ে এসেছি—"পৃথিবী দেখতে কমলালেবুর মতো গোল।" কিন্তু একজন ভূ-বিজ্ঞানী বা GIS স্পেশালিস্টের চোখে পৃথিবী কিন্তু মোটেও গোল বা মসৃণ কমলালেবু নয়!

বাস্তবে পাহাড়-পর্বত, সমুদ্রের গভীরতা আর ঘূর্ণনের কারণে পৃথিবীর আকার খুবই অদ্ভুত এবং অসম। এই আকারকে সঠিকভাবে পরিমাপের জন্য আমাদের কিছু গাণিতিক মডেল বুঝতে হবে।

[IMAGE: Geoid vs Ellipsoid Shape. Caption: মহাকর্ষ বলের ওপর ভিত্তি করে তৈরি আঁকাবাঁকা Geoid মডেল এবং গাণিতিক হিসাবের সুবিধার্থে তৈরি মসৃণ Ellipsoid/Spheroid মডেলের তুলনা।]

### ৩টি আলাদা মডেল
১. **Topography (ভূপৃষ্ঠ):** যা আমরা চোখে দেখি। পাহাড়, নদী, সমতল জমি (যেমন আমাদের দেশের বরেন্দ্র অঞ্চল বা হাওর)।
২. **Geoid (জিওইড):** সমুদ্রপৃষ্ঠের মহাকর্ষের ওপর ভিত্তি করে তৈরি একটি অত্যন্ত জটিল, আঁকাবাঁকা ও বাস্তবমুখী পৃথিবীর রূপ।
৩. **Spheroid/Ellipsoid (স্ফিয়ারয়েড/ইলিপ্সয়েড):** জিপিএস এবং গণিতের হিসাব সহজ করার জন্য জিওইডের ওপরে ফিট করা একটি মসৃণ উপবৃত্তাকার গোলক। যেমন: **WGS84** (যা আমরা জিপিএসে ব্যবহার করি)।

👉 **বাস্তব চিন্তা:** আপনি যখন আপনার জিপিএস হ্যান্ডসেট দিয়ে ময়মনসিংহের কোনো ধানি জমির কোঅর্ডিনেট নেন, জিপিএস কিন্তু ব্যাকগ্রাউন্ডে WGS84 Ellipsoid মডেলের সাহায্যেই সেই ডেটা হিসাব করে!

### End of Lesson Summary
১. পৃথিবী মসৃণ গোলক নয়; এর আকার অসম ও জটিল।
২. বাস্তব গণনা ও জিপিএসের জন্য আমরা ইলিপ্সয়েড মডেল (যেমন WGS84) ব্যবহার করি।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L6
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'পৃথিবীর মহাকর্ষীয় সমতার ওপর ভিত্তি করে তৈরি আঁকাবাঁকা ভৌগোলিক মডেলকে কী বলা হয়?', '["Ellipsoid", "Geoid", "Flat Earth Model", "Spheroid"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'মোবাইল বা জিপিএস যন্ত্রে বৈশ্বিক কোঅর্ডিনেট পরিমাপের জন্য সবচেয়ে বেশি কোন ইলিপ্সয়েড ব্যবহৃত হয়?', '["Everest 1830", "WGS84", "Clarke 1866", "GRS 80"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কেন আমরা মানচিত্রে সরাসরি টপোগ্রাফি (বাস্তব পাহাড়-পর্বত) এর ওপর জ্যামিতিক হিসাব করতে পারি না?', '["কারণ পাহাড় ধসে পড়তে পারে", "কারণ এর গঠন অত্যন্ত জটিল এবং কোনো নির্দিষ্ট গাণিতিক সূত্র মেনে চলে না", "কারণ ম্যাপে পাহাড় আঁকা যায় না", "কারণ সরকার অনুমতি দেয় না"]'::jsonb, 1);


  -- Lesson 7: Map Projections (How We Flatten the Earth)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '7. Map Projections: Flattening the Earth', 'map-projections-distortion', 2, 
  $markdown$
# Lesson 7: Map Projections: Flattening the Earth (Why Maps Lie!)

একটি বাস্কেটবল বা ফুটবলের কথা ভাবুন। আপনি যদি কোনো ফুটবলকে কেটে দেয়ালে একদম সোজা ও চ্যাপ্টা করে লেপ্টে দিতে চান, তাহলে কি ফুটবলটি না ফেটে বা না টেনে সোজা হবে? অবশ্যই হবে না!

ঠিক একইভাবে, গোল পৃথিবীর মানচিত্রকে যখন কাগজের চ্যাপ্টা পৃষ্ঠা বা কম্পিউটারের স্ক্রিনে আঁকা হয়, তখন কিছু না কিছু বিকৃতি ঘটে। এই গোলক থেকে সমতলে নিয়ে আসার পদ্ধতিকে বলা হয় **Map Projection**।

[IMAGE: Types of Map Projections Cylindrical Conical Planar. Caption: তিন ধরণের প্রজেকশন পদ্ধতি - সিলিন্ড্রিক্যাল (Cylindrical), কনিক্যাল (Conical), এবং প্ল্যানার (Planar) এর কার্যপ্রণালী।]

### ৩টি প্রধান প্রজেকশন ফ্যামিলি
১. **Cylindrical (নলাকার):** পৃথিবীকে একটি সিলিন্ডারের মধ্যে রেখে প্রজেক্ট করা হয় (যেমন: Mercator)। নিরক্ষরেখার কাছাকাছি এলাকার জন্য এটি দারুণ, কিন্তু মেরু অঞ্চলে বিকৃতি চরম হয়।
২. **Conical (শঙ্কু আকৃতির):** কাগজের মোড়ক বা কোণ তৈরি করে মাথায় পরিয়ে দেওয়া। মধ্য অক্ষাংশের জন্য এটি বেশ ভালো।
৩. **Planar/Azimuthal (সমতলীয়):** ম্যাপের ওপরে একটি সমতল কাগজ আলতো করে স্পর্শ করানো। মেরু অঞ্চলের ম্যাপ তৈরিতে এটি বেশি ব্যবহৃত হয়।

👉 **কৃষিবিদের সতর্কতা:** কোনো ফসল ক্ষেতের সঠিক ক্ষেত্রফল (Area) হিসাব করতে হলে আমাদের এমন প্রজেকশন ব্যবহার করতে হবে যা ক্ষেত্রফল ঠিক রাখে (Equal Area), অন্যথায় আপনার হেক্টর প্রতি ফলনের সম্পূর্ণ হিসাব ভুল আসবে!

### End of Lesson Summary
১. গোল পৃথিবী চ্যাপ্টা ম্যাপে রূপান্তরের সময় বিকৃতি অপরিহার্য।
২. ম্যাপ প্রজেকশনের মাধ্যমে আমরা ক্ষেত্রফল, আকার, দিক অথবা দূরত্বের যেকোনো একটি বা দুটি বিষয়কে অক্ষুণ্ন রাখতে পারি।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L7
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'মানচিত্র আঁকার ক্ষেত্রে প্রজেকশন কেন প্রয়োজন?', '["মানচিত্রের সীমানা বড় করার জন্য", "গোলাকার পৃথিবীকে চ্যাপ্টা দ্বি-মাত্রিক স্ক্রিনে দেখানোর জন্য", "ফাইলের সাইজ কমানোর জন্য", "ম্যাপে রঙ করার জন্য"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ফসল চাষের মোট আবাদি জমির সঠিক ক্ষেত্রফল (hectare/acre) বের করতে কোন ধরণের প্রজেকশন ব্যবহার করা উচিত?', '["Conformal Projection", "Equal Area Projection", "Equidistant Projection", "Mercator Projection"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কোনো ম্যাপ প্রজেকশন কি একই সাথে আকৃতি, দূরত্ব ও ক্ষেত্রফল নিখুঁত রাখতে পারে?', '["হ্যাঁ, সব ম্যাপই নিখুঁত", "না, কোনো না কোনো বিষয়ে বিকৃতি (Distortion) ঘটবেই", "শুধু বাংলাদেশে সম্ভব", "জানিনা"]'::jsonb, 1);


  -- Lesson 8: Coordinate Systems (Geographic vs Projected)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '8. Geographic vs Projected Coordinate Systems', 'gcs-vs-pcs', 3, 
  $markdown$
# Lesson 8: Geographic vs Projected Coordinate Systems

মানচিত্র ব্যবহার করতে গেলে আপনাকে অবশ্যই দুটি বড় শব্দের সাথে পরিচিত হতে হবে: **GCS** এবং **PCS**।

এই দুটি বিষয় না বুঝলে আপনার ম্যাপের ডেটা একটার ওপর আরেকটা সঠিক স্থানে না বসে একটি সিলেট তো অন্যটি খুলনায় গিয়ে পড়বে!

[IMAGE: GCS vs PCS Grid Systems. Caption: ভৌগোলিক কোঅর্ডিনেট সিস্টেম (GCS) যা ডিগ্রিতে পরিমাপ করে বনাম প্রজেক্টেড কোঅর্ডিনেট সিস্টেম (PCS) যা মিটারে গ্রিড তৈরি করে তার তুলনা।]

### সহজ তুলনা:
- **GCS (Geographic Coordinate System):**
  - এটি পৃথিবীকে গোলক ধরে ত্রিমাত্রিক হিসাব করে।
  - এর একক হলো **Degree, Minute, Second (DMS)** বা **Decimal Degrees (DD)**।
  - যেমন: `24.75° N, 90.40° E` (ময়মনসিংহ)।
  - এটি গ্লোবাল অবস্থানের জন্য দারুণ, কিন্তু এটি দিয়ে কোনো জমির দৈর্ঘ্য বা ক্ষেত্রফল পরিমাপ করা যায় না (ডিগ্রিতে তো আর আলুর ফলন মাপা যাবে না!)।
  
- **PCS (Projected Coordinate System):**
  - এটি পৃথিবীকে চ্যাপ্টা ধরে একটি দ্বিমাত্রিক গ্রিড তৈরি করে।
  - এর একক হলো **Meter (মিটার)** বা **Feet (ফুট)**।
  - এটি দিয়ে আপনি খুব সহজেই দূরত্ব এবং ক্ষেত্রফল নিখুঁতভাবে পরিমাপ করতে পারবেন।

👉 **বাস্তব সংযোগ:** আমরা R-এ যে `sf` প্যাকেজ ব্যবহার করে স্থানিক বিশ্লেষণ করতাম, সেখানেও `st_crs()` দিয়ে কোঅর্ডিনেট সিস্টেম চেক করতাম। ডিগ্রিতে বাফার করতে গেলে R আমাদের সতর্কবার্তা দিত—মিটার ইউনিটে প্রজেক্ট করার জন্য!

### End of Lesson Summary
১. GCS গোলাকার পৃথিবীর অবস্থান ডিগ্রি ইউনিটে প্রকাশ করে।
২. PCS সমতল গ্রিডে দূরত্ব ও ক্ষেত্রফল মিটার ইউনিটে পরিমাপ করতে সাহায্য করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L8
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'নিচের কোনটি Geographic Coordinate System (GCS) এর প্রধান পরিমাপের একক?', '["Meter", "Decimal Degrees (DD)", "Pixel", "Kilometer"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কেন আমাদের কোঅর্ডিনেট সিস্টেমকে GCS থেকে PCS এ পরিবর্তন করতে হয়?', '["ফাইল সেভ করার জন্য", "যাতে আমরা মিটার বা ফুটে সঠিক ক্ষেত্রফল ও দূরত্ব মাপতে পারি", "ম্যাপের রেজোলিউশন বাড়ানোর জন্য", "কোনো প্রয়োজন নেই"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'জিপিএস দিয়ে নেওয়া `23.8103° N, 90.4125° E` অবস্থানটি কোন সিস্টেমের উদাহরণ?', '["PCS", "GCS", "Raster Grid", "Geodatabase Link"]'::jsonb, 1);


  -- Lesson 9: Bangladesh Coordinate Systems (BTM, BUTM, UTM Zone 45N/46N)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '9. Coordinate Systems in Bangladesh: UTM & BTM', 'bangladesh-coordinates-utm-btm', 4, 
  $markdown$
# Lesson 9: Coordinate Systems in Bangladesh: UTM & BTM

আজকে আমরা আমাদের নিজের দেশ বাংলাদেশের মানচিত্র নিয়ে আলোচনা করব। বাংলাদেশের ওপর দিয়ে গেছে কর্কটক্রান্তি রেখা (Tropic of Cancer)। আমাদের দেশের ভৌগোলিক অবস্থানের কারণে এখানে নির্দিষ্ট কিছু প্রজেক্টেড সিস্টেম ব্যবহৃত হয়।

[IMAGE: Bangladesh Map with UTM Zone 45 and 46. Caption: বাংলাদেশকে দুটি ভাগে ভাগ করা UTM Zone 45N (পশ্চিম ভাগ) এবং UTM Zone 46N (পূর্ব ভাগ) এর সীমানা নির্দেশক মানচিত্র।]

### ১. UTM (Universal Transverse Mercator)
পুরো বিশ্বকে ৬০টি জোনে ভাগ করা হয়েছে। বাংলাদেশ এই সিস্টেমের দুটি জোনে পড়েছে:
- **UTM Zone 45N:** বাংলাদেশের পশ্চিম অংশ (রাজশাহী, রংপুর, খুলনা বিভাগ)।
- **UTM Zone 46N:** বাংলাদেশের পূর্ব অংশ (ঢাকা, সিলেট, চট্টগ্রাম বিভাগ)।
*সমস্যা:* আপনি যদি সারা দেশের একটি একক ম্যাপ তৈরি করতে চান, তবে দুটি জোন একসাথে ব্যবহার করলে সংযোগস্থলে মানচিত্র কিছুটা বাঁকা হয়ে যাবে।

### ২. BTM (Bangladesh Transverse Mercator)
এই সমস্যা সমাধানের জন্য বাংলাদেশ জরিপ অধিদপ্তর একটি কাস্টম প্রজেকশন তৈরি করেছে যাকে বলা হয় **BTM**।
- এটি পুরো বাংলাদেশকে একটি একক প্রজেকশনের আওতায় নিয়ে আসে।
- এর কেন্দ্রীয় ড্রাগিমাংশ বা Central Meridian হলো `90° E` (যা আমাদের দেশের মাঝামাঝি দিয়ে গেছে)।
- এর ফলে দেশীয় যেকোনো বড় গবেষণার জন্য BTM হলো আদর্শ পছন্দ!

👉 **কৃষিবিদের বাস্তব টিপস:** যখন আপনি কোনো দেশীয় এনজিও বা সরকারি এগ্রিকালচার ডিপার্টমেন্টের শেপফাইল ডাউনলোড করবেন, সাধারণত সেটি **BTM** প্রজেকশনেই সংরক্ষণ করা থাকে।

### End of Lesson Summary
১. বাংলাদেশ বিশ্ব পরিমণ্ডলে UTM Zone 45N এবং 46N এর মধ্যে অবস্থিত।
২. সারা দেশের একক ও নির্ভুল মানচিত্রায়নের জন্য BTM প্রজেকশন ব্যবহৃত হয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L9
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'বাংলাদেশ প্রধানত কোন দুটি UTM জোনের অন্তর্ভুক্ত?', '["Zone 30N and 31N", "Zone 45N and 46N", "Zone 50N and 51N", "Zone 10S and 11S"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'সমগ্র বাংলাদেশের একটি একক ম্যাপ তৈরি করতে কোন দেশীয় প্রজেকশনটি সবচেয়ে উপযোগী?', '["Everest 1830", "BTM (Bangladesh Transverse Mercator)", "UTM Zone 45N", "Mercator Sphere"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'BTM প্রজেকশনে সেন্ট্রাল মেরিডিয়ান বা মধ্যরেখা কত ডিগ্রী ড্রাগিমাংশে অবস্থিত?', '["88° E", "90° E", "92° E", "0° (Greenwich)"]'::jsonb, 1);


  -- Lesson 10: Scale, Resolution, and Spatial Detail
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '10. Scale, Resolution, and Spatial Detail', 'scale-resolution-detail', 5, 
  $markdown$
# Lesson 10: Scale, Resolution, and Spatial Detail

মডিউলের শেষ লেসনে আজ আমরা ম্যাপের অন্যতম গুরুত্বপূর্ণ বিষয়—**Scale (স্কেল)** এবং **Resolution (রেজোলিউশন)** নিয়ে ধারণা পরিষ্কার করব।

আপনি হয়তো ম্যাপের নিচে দেখতে পান `1:10,000` বা `1:100,000` লেখা থাকে। এটি আসলে কী নির্দেশ করে?

[IMAGE: Map Scale Comparison Large vs Small. Caption: বড় স্কেলের ম্যাপ (যা ছোট এলাকাকে অনেক ডিটেইলে দেখায়) বনাম ছোট স্কেলের ম্যাপ (যা বড় এলাকাকে সংক্ষেপে দেখায়) এর তুলনা।]

### স্কেল ভগ্নাংশ (Representative Fraction)
স্কেল হলো ম্যাপের দূরত্ব এবং বাস্তব পৃথিবীর দূরত্বের অনুপাত।
- **Large Scale Map (বড় স্কেলের ম্যাপ):** উদাহরণ: `1:1,000`। এখানে জুম বেশি থাকে, তাই একটি ছোট জায়গা খুব ডিটেইলে দেখা যায় (যেমন কোনো নির্দিষ্ট কৃষি খামার বা গবেষণাগার)।
- **Small Scale Map (ছোট স্কেলের ম্যাপ):** উদাহরণ: `1:5,000,000`। এখানে জুম আউট করা থাকে, তাই বড় জায়গা সংক্ষেপে দেখা যায় (যেমন পুরো এশিয়া বা বাংলাদেশ)।

👉 **মনে রাখার ট্রিক:** হর বা নিচের সংখ্যাটি যত ছোট হবে (যেমন ১,০০০), ম্যাপের স্কেল তত বড় হবে এবং ডিটেইল তত বেশি দেখা যাবে!

### স্থানিক রেজোলিউশন (Spatial Resolution)
রিমোট সেন্সিং বা স্যাটেলাইট ইমেজের ক্ষেত্রে আমরা পিক্সেল সাইজ দিয়ে ডিটেইল বুঝি। যেমন ১০ মিটার রেজোলিউশনের ইমেজে একটি পিক্সেল বাস্তব জগতের ১০ মিটার বাই ১০ মিটার এলাকা নির্দেশ করে। পিক্সেল যত ছোট, রেজোলিউশন তত বেশি!

### End of Lesson Summary
১. ম্যাপ স্কেল বাস্তব দূরত্ব ও মানচিত্রের দূরত্বের অনুপাত।
২. ছোট হর মানে বড় স্কেল, যা অনেক বেশি সূক্ষ্ম বিষয়বস্তু প্রদর্শন করতে পারে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L10
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'নিচের কোন স্কেলের ম্যাপে একটি ধানের মাঠের সীমানা সবচেয়ে পরিষ্কারভাবে দেখা যাবে?', '["1:1,000 (Large Scale)", "1:100,000", "1:1,000,000 (Small Scale)", "1:10,000,000"]'::jsonb, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, '১০ মিটার রেজোলিউশনের একটি স্যাটেলাইট ইমেজের প্রতিটি পিক্সেল জমিতে কতটুকু এলাকা নির্দেশ করে?', '["১ বর্গ মিটার", "১০ মিটার × ১০ মিটার এলাকা", "১০০ কিলোমিটার", "১০ ইঞ্চি"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ক্ষুদ্র স্কেলের (Small Scale) মানচিত্র দিয়ে সাধারণত কী ধরণের এলাকা প্রদর্শন করা হয়?', '["একটি গবেষণাগার", "সমগ্র দেশ বা মহাদেশের মতো বিশাল এলাকা", "একটি ছোট গ্রাম", "একটি পুকুর"]'::jsonb, 1);

  -- ================================================================================================
  -- MODULE 3: VECTOR DATA MODEL: POINTS, LINES, POLYGONS & ATTRIBUTE TABLES
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gis_cid, 'Module 3: Vector Data Model & Attribute Tables', 'vector-data-model', 3, 'Master vector spatial data structures, attribute joins, and file formats.')
  RETURNING id INTO m3_id;

  -- Lesson 11: Vector Data Basics (Points, Lines, Polygons)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m3_id, '11. Vector Data Basics: Points, Lines & Polygons', 'vector-basics', 1, 
  $markdown$
# Module Overview
এই মডিউলে আমরা ভেক্টর ডেটা মডেল নিয়ে বিস্তারিত জানব। পয়েন্ট, লাইন, পলিগনের বাস্তব ব্যবহার, ডাটাবেজের সাথে সংযোগ এবং এক্সেল ফাইল সংযুক্ত করার পদ্ধতি ধাপে ধাপে শিখব।

# Lesson 11: Vector Data Basics: Points, Lines & Polygons

ভেক্টর ডেটা (Vector Data) হলো জ্যামিতিক স্থানাঙ্কের ওপর ভিত্তি করে গঠিত স্থানিক তথ্য। এটি মূলত ৩টি বেসিক শেপে বিভক্ত থাকে।

[IMAGE: Point Line Polygon Agri Examples. Caption: কৃষি ক্ষেত্রে ভেক্টর ডেটার প্রকারভেদ - পয়েন্ট (নলকূপ), লাইন (সেচ নালা), এবং পলিগন (ফসল ক্ষেতের সীমানা)।]

### ৩টি মূল রূপ:
১. **Point (বিন্দু):** এতে কেবল একক স্থানাঙ্ক `(X, Y)` থাকে।
   - *কৃষি উদাহরণ:* একটি গভীর নলকূপ, একটি রোগাক্রান্ত গাছের অবস্থান, অথবা সয়েল স্যাম্পল সংগ্রহের স্থান।
২. **Line/Polyline (রেখা):** একাধিক সংযুক্ত বিন্দুর সিরিজ।
   - *কৃষি উদাহরণ:* পানি সেচ দেওয়ার প্রধান ক্যানেল, গ্রামীণ সংযোগ সড়ক, কিংবা প্রবহমান নদী।
৩. **Polygon (বহুভুজ):** একটি আবদ্ধ স্থান যা একই বিন্দুতে শুরু ও শেষ হয়।
   - *কৃষি উদাহরণ:* ধানের জমি, সুন্দরবনের সীমানা, জেলা বা উপজেলার প্রশাসনিক এলাকা।

👉 **বাস্তব চিন্তা:** আমরা R-এ কাজ করার সময় দেখেছি কিভাবে কোঅর্ডিনেট ডেটাফ্রেমকে জ্যামিতিক শেপে কনভার্ট করা যায়। এই ভেক্টর মডেলগুলোই মানচিত্রের মূল নকশা তৈরি করে!

### End of Lesson Summary
১. ভেক্টর ডেটা মূলত পয়েন্ট, লাইন এবং পলিগন দিয়ে বাস্তব জগতকে উপস্থাপন করে।
২. এর পেছনের মূল ভিত্তি হলো সুনির্দিষ্ট স্থানাঙ্ক বা কোঅর্ডিনেট।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L11
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'হাওর অঞ্চলের কোনো সেচ খালের নকশা ম্যাপে দেখানোর জন্য কোন ভেক্টর শেপটি সবচেয়ে মানানসই?', '["Point", "Polyline/Line", "Polygon", "Grid Cell"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একটি জেলার সীমানা বা নির্দিষ্ট ফসল ক্ষেতকে ম্যাপে আঁকতে কোনটি ব্যবহার করবেন?', '["Point", "Line", "Polygon", "None"]'::jsonb, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'সয়েল টেস্ট করার জন্য মাঠ থেকে মাটি সংগ্রহের নির্দিষ্ট স্থানটিকে কী হিসেবে চিহ্নিত করা উচিত?', '["Point (বিন্দু)", "Polygon (বহুভুজ)", "Polyline (রেখা)", "Raster Pixel"]'::jsonb, 0);


  -- Lesson 12: Shapefiles, GeoJSON, and Geodatabases
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m3_id, '12. Exploring GIS Formats: Shapefiles & Geodatabases', 'gis-formats', 2, 
  $markdown$
# Lesson 12: Exploring GIS Formats: Shapefiles & Geodatabases

মানচিত্রের ফাইলগুলো সাধারণ ডক (`.docx`) বা এক্সেল (`.xlsx`) ফাইলের মতো একক ফাইলে থাকে না। GIS ফাইলের ফাইল ফরমেটগুলো বেশ বৈচিত্র্যময়।

আজকে আমরা জানব সবচেয়ে বেশি ব্যবহৃত কিছু ফাইল ফরমেটের খুটিনাটি।

[IMAGE: Shapefile Multi-file Structure. Caption: একটি শেপফাইলের ভেতরের ফাইলসমূহ - .shp, .shx, .dbf এবং .prj এর পারস্পরিক সংযোগের চিত্র।]

### ১. Shapefile (শেপফাইল - Esri-র ঐতিহ্যবাহী ফরমেট)
একটি শেপফাইল আসলে কোনো একক ফাইল নয়, এটি ৪-৫টি ফাইলের একটি সমষ্টি। এই ফাইলগুলোর নাম একই হতে হয়, তবে এক্সটেনশন ভিন্ন হয়:
- **`.shp`:** মূল জ্যামিতিক নকশা ধারণ করে।
- **`.dbf`:** এটি হলো ডাটাবেজ ফাইল, যা টেবিলের তথ্য সংরক্ষণ করে।
- **`.shx`:** ইনডেক্স ফাইল যা জ্যামিতির সাথে ডেটার লিঙ্ক বজায় রাখে।
- **`.prj`:** এটি আপনার ম্যাপের প্রজেকশন বা কোঅর্ডিনেট সিস্টেম সংরক্ষণ করে।
*পরামর্শ:* কাউকে ম্যাপ পাঠাতে চাইলে এই সবগুলো ফাইল একসাথে জিপ (`.zip`) করে পাঠাতে হবে, অন্যথায় ফাইলটি নষ্ট হয়ে যাবে।

### ২. File Geodatabase (FGDB - `.gdb`)
এটি হলো Esri-র আধুনিক ডেটা স্টোরেজ যেখানে অনেকগুলো ভেক্টর এবং রাস্টার ফাইলকে একটি একক ফোল্ডার ডাটাবেজের মধ্যে সুন্দরভাবে সাজিয়ে রাখা যায়।

### End of Lesson Summary
১. শেপফাইল একাধিক ফাইলের সমন্বয়ে গঠিত একটি স্পেশিয়াল ভেক্টর ফরমেট।
২. আধুনিক GIS কাজের জন্য ফাইল জিওডাটাবেজ (`.gdb`) ব্যবহার করা সুবিধাজনক ও নিরাপদ।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L12
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'শেপফাইলের (.shp) প্রজেকশন বা কোঅর্ডিনেট সিস্টেমের তথ্য কোন এক্সটেনশন ফাইলে সংরক্ষিত থাকে?', '[".dbf", ".prj", ".shx", ".txt"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'অন্য কাউকে ইমেইলে ম্যাপ ফাইল পাঠানোর সঠিক নিয়ম কোনটি?', '["শুধু .shp ফাইলটি পাঠানো", "সবগুলো সাপোর্টিং ফাইল একসাথে জিপ (.zip) করে পাঠানো", "ফাইল এক্সটেনশন মুছে পাঠানো", "শুধু .dbf ফাইল পাঠানো"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'আধুনিক ArcGIS Pro তে একটি সিঙ্গেল ফোল্ডারের অধীনে অনেকগুলো লেয়ার সুন্দরভাবে ম্যানেজ করার সিস্টেমকে কী বলে?', '["Zip Archive", "File Geodatabase (.gdb)", "GeoJSON Array", "Excel Workbook"]'::jsonb, 1);


  -- Lesson 13: The Attribute Table (GIS Databases)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m3_id, '13. The Attribute Table: The Spreadsheet Behind the Map', 'attribute-table', 3, 
  $markdown$
# Lesson 13: The Attribute Table: The Spreadsheet Behind the Map

আমরা শুরুতেই বলেছি, GIS মানচিত্রের প্রতিটি বিন্দুর পেছনে রয়েছে একটি করে বিশাল স্প্রেডশিট। এই স্প্রেডশিটকে আমরা বলি **Attribute Table**।

আপনি যখন ম্যাপের কোনো পলিগনে মাউস দিয়ে ক্লিক করবেন, তার আড়ালে থাকা সকল তথ্য এই টেবিল থেকে আপনার স্ক্রিনে ভেসে উঠবে।

[IMAGE: Attribute Table ArcGIS Screenshot. Caption: ArcGIS Pro এর মানচিত্রের নিচে থাকা অ্যাট্রিবিউট টেবিল এবং তার মধ্যবর্তী সারি ও কলামের সংযোগ।]

### টেবিলের মূল উপাদান:
- **Rows (সারি):** প্রতিটি সারি নির্দেশ করে একটি নির্দিষ্ট ফিচার বা জ্যামিতিক বস্তুকে। যেমন: ম্যাপের ১ নম্বর ফসল ক্ষেত্রটি টেবিলের প্রথম সারির সাথে যুক্ত।
- **Columns/Fields (কলাম):** এগুলো ফিচারটির বিভিন্ন বৈশিষ্ট্য ধারণ করে। যেমন: `Area`, `CropType`, `Yield_MT` ইত্যাদি।
- **FID/ObjectID:** এটি প্রতিটি ফিচারের জন্য একটি অনন্য নম্বর (Unique ID) যা ডুপ্লিকেট হয় না।

👉 **বাস্তব কাজ:** আপনি যখন ArcGIS Pro তে কোনো রো সিলেক্ট করবেন, ম্যাপের ওপর সেই নির্দিষ্ট ফসল ক্ষেত্রটি নীল রঙে হাইলাইট হয়ে উঠবে! এটিই হলো ম্যাপ ও টেবিলের মধ্যকার সরাসরি যোগাযোগ।

### End of Lesson Summary
১. অ্যাট্রিবিউট টেবিল হলো মানচিত্রের ডেটা ব্যাকবোন।
২. কলামগুলোকে ফিল্ড এবং সারিগুলোকে রেকর্ড বলা হয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L13
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'অ্যাট্রিবিউট টেবিলে প্রতিটি সারি (Row) কী নির্দেশ করে?', '["একটি কলাম হেডার", "একটি নির্দিষ্ট ভৌগোলিক অবয়ব বা ফিচার", "পুরো দেশের মানচিত্র", "একটি নতুন ফোল্ডার"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'অ্যাট্রিবিউট টেবিলে নতুন কলাম যোগ করাকে কী বলা হয়?', '["Add Row", "Add Field", "Join Link", "New Feature"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'অ্যাট্রিবিউট টেবিলের কোনো রো সিলেক্ট করলে ম্যাপে কী পরিবর্তন ঘটে?', '["ম্যাপ ডিলিট হয়ে যায়", "সংশ্লিষ্ট জিওমেট্রিক অবয়বটি ম্যাপে হাইলাইট বা সিলেক্ট হয়ে যায়", "ম্যাপের স্কেল ছোট হয়ে যায়", "কিছুই পরিবর্তন হয় না"]'::jsonb, 1);


  -- Lesson 14: Querying Data (Select by Attribute)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m3_id, '14. Querying Data: Select by Attribute', 'querying-select-attribute', 4, 
  $markdown$
# Lesson 14: Querying Data: Select by Attribute

বাস্তব গবেষণায় আপনার হাজার হাজার রেকর্ডের মধ্যে থেকে নির্দিষ্ট তথ্য খুঁজে বের করতে হয়। যেমন: আপনার কাছে বাংলাদেশের সব উপজেলার মাটির তথ্য আছে, কিন্তু আপনি কেবল সেই উপজেলাগুলো দেখতে চান যেগুলোর মাটির পিএইচ (pH) ৫.৫ এর নিচে (অ্যাসিডিক মাটি)।

এই কাজটির জন্য আমরা ব্যবহার করি **Select by Attribute** টুল। এটি মূলত SQL (Structured Query Language) এর ওপর ভিত্তি করে কাজ করে।

[IMAGE: Select by Attribute Dialog Box. Caption: ArcGIS Pro এর Select by Attribute ডায়ালগ উইন্ডো যেখানে SQL কুয়েরি বিল্ডার দেখা যাচ্ছে।]

### কীভাবে কুয়েরি সাজাবেন?
ধরি, আমাদের ফিল্ডের নাম `Soil_pH` এবং আমরা ৫.৫ এর নিচের মানগুলো চাই। আমরা কুয়েরি লিখব:
`Soil_pH < 5.5`

আবার যদি আমরা আম বাগান এবং তাদের আয়তন ৫ একরের বেশি দেখতে চাই:
`Crop_Type = 'Mango' AND Area_Acre > 5`

👉 **বাস্তব সংযোগ:** মনে করুন R-এর `filter()` ফাংশন! আমরা যেভাবে R-এ লিখতাম `filter(df, Soil_pH < 5.5)` এটিও ঠিক একই লজিক, কেবল আপনি এখানে একটি চমৎকার ডায়ালগ বক্সের ক্লিকে কাজ করছেন!

### End of Lesson Summary
১. Select by Attribute এর মাধ্যমে ফিল্টারিং বা কুয়েরি চালিয়ে ডেটা আলাদা করা যায়।
২. এটি লজিক্যাল অপারেটর (AND, OR, NOT) এবং গাণিতিক সাইন ব্যবহার করে চলে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L14
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কৃষি গবেষণায় ৫ হেক্টরের চেয়ে বড় কেবল বোরো ধানের জমিগুলো ফিল্টার করতে কোন কুয়েরিটি সঠিক?', '["Crop_Type = ''Boro'' AND Area > 5", "Crop_Type = ''Boro'' OR Area > 5", "Crop_Type < 5", "Boro = 5"]'::jsonb, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'Select by Attribute কোন ব্যাকগ্রাউন্ড ভাষার ওপর ভিত্তি করে কাজ করে?', '["HTML", "SQL", "JavaScript", "C++"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কুয়েরিতে একাধিক লজিক্যাল কন্ডিশন একসাথে মেলাতে কোন অপারেটর ব্যবহার করা হয়?', '["AND / OR", "ADD / MINUS", "SELECT / FROM", "WHERE / LIKE"]'::jsonb, 0);


  -- Lesson 15: Joining Excel Data to Attribute Tables
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m3_id, '15. Joining Excel Data to Attribute Tables', 'join-excel-data', 5, 
  $markdown$
# Lesson 15: Joining Excel Data to Attribute Tables

অনেক সময় কৃষি সম্প্রসারণ অধিদপ্তর আপনাকে একটি এক্সেল ফাইলে জেলার ফসল উৎপাদনের ডেটা দেবে, কিন্তু সেই ফাইলে কোনো ম্যাপ বা স্থানাঙ্ক থাকবে না। অন্যদিকে আপনার কাছে বাংলাদেশের জেলার ম্যাপ আছে কিন্তু তাতে নতুন ফসল উৎপাদনের ডেটা নেই।

আমরা কীভাবে এই এক্সেল টেবিলকে আমাদের ম্যাপ ফাইলের সাথে জুড়ে দেব? উত্তর হলো: **Table Join**।

[IMAGE: Attribute Table Join Concept Diagram. Caption: কমন কী (Common Key / ID) এর মাধ্যমে এক্সেল ফাইল এবং ম্যাপের অ্যাট্রিবিউট টেবিল লিংক করার চিত্র।]

### কমন কী (Common Key / Join Key)
দুটি টেবিলকে জোড়া দেওয়ার জন্য একটি কমন কলাম থাকতে হবে যা উভয়ের মধ্যেই হুবহু একই রকম তথ্য ধারণ করে। যেমন: জেলাগুলোর ইউনিক কোড বা নাম (যেমন `District_ID` বা `Dist_Name`)।
*সতর্কতা:* স্পেলিং বা বানানে যদি সামান্য অমিল থাকে (যেমন এক জায়গায় `Mymensingh` আর অন্য জায়গায় `Mymenshing`), তবে জয়েন সফল হবে না।

👉 **বাস্তব প্র্যাকটিস:** কন্টেন্টস প্যানেলের ম্যাপ লেয়ারে রাইট ক্লিক করুন > `Joins and Relates` > `Add Join` সিলেক্ট করে এক্সেল শিটটি সিলেক্ট করলেই জাদুকরী উপায়ে আপনার এক্সেলের ডেটা ম্যাপের অংশ হয়ে যাবে!

### End of Lesson Summary
১. Table Join এর মাধ্যমে নন-স্পেশিয়াল এক্সেল ফাইলকে ম্যাপের সাথে যুক্ত করা যায়।
২. জয়েন করার জন্য অবশ্যই একটি অনন্য কমন কলাম (Key) থাকতে হবে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L15
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'দুটি ভিন্ন টেবিলকে জয়েন করার জন্য প্রধান শর্ত কোনটি?', '["উভয় টেবিল এক্সেল ফাইল হতে হবে", "উভয় টেবিলে একটি কমন আইডি বা কী কলাম (Common Key) থাকতে হবে", "ম্যাপ ডিলিট করতে হবে", "উভয় টেবিলে একই সংখ্যক রো থাকতে হবে"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'যদি এক্সেলে জেলার নাম লেখা থাকে "Kushtia" এবং ম্যাপের টেবিলে লেখা থাকে "Kustia", তবে জয়েন করলে কী ঘটবে?', '["সফটওয়্যার একা বানানের ভুল ঠিক করে নেবে", "জয়েনিং এ ইরর হবে অথবা সংশ্লিষ্ট রেকর্ডটির জয়েন মিস হয়ে যাবে", "কম্পিউটার বন্ধ হয়ে যাবে", "কোনো সমস্যা হবে না"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'জয়েন করার পর আপনি যদি নতুন কলামটি ম্যাপের রঙের সাহায্যে দেখাতে চান, সেটি কি সম্ভব?', '["না, অসম্ভব", "হ্যাঁ, নতুন কলামের ডেটা ব্যবহার করে থিমেটিক ম্যাপ আঁকা যাবে", "কেবল প্রিন্ট করা যাবে", "জানিনা"]'::jsonb, 1);

  -- ================================================================================================
  -- MODULE 4: RASTER DATA MODEL: PIXELS, ELEVATION & SATELLITE GRIDS
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gis_cid, 'Module 4: Raster Data Model & Georeferencing', 'raster-georeferencing', 4, 'Explore raster data structures, terrain elevation grids, and map georeferencing.')
  RETURNING id INTO m4_id;

  -- Lesson 16: Raster Data Basics (Pixels and Bands)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id, '16. Raster Data Basics: Pixels, Grid Cells & Bands', 'raster-basics', 1, 
  $markdown$
# Module Overview
এই মডিউলে আমরা রাস্টার ডেটা বা গ্রিডভিত্তিক তথ্য কাঠামো শিখব। ল্যান্ড সারফেস ডেটা, উচ্চতা নির্দেশক মডেল (DEM), কাগজের ম্যাপকে স্থানাঙ্ক দেওয়া (Georeferencing) এবং এক্সেল স্থানাঙ্ক থেকে জিপিএস পয়েন্ট তৈরির কাজ হাতে-কলমে শিখব।

# Lesson 16: Raster Data Basics: Pixels, Grid Cells & Bands

এতক্ষণ আমরা ভেক্টর ডেটা (পয়েন্ট, লাইন, পলিগন) নিয়ে কাজ করেছি। এবার আসি GIS-এর দ্বিতীয় বড় শক্তি: **Raster Data** বা রাস্টার ডেটা মডেল।

সহজ কথায়, রাস্টার ডেটা হলো গ্রিড বা পিক্সেলের একটি ম্যাট্রিক্স। এটি আপনার মোবাইলে তোলা ছবির মতোই—খুব কাছে নিয়ে জুম করলে ছোট ছোট চারকোনা ঘর বা পিক্সেল দেখা যায়।

[IMAGE: Raster Resolution Comparison Cells. Caption: ৩০ মিটার পিক্সেল বনাম ১০ মিটার পিক্সেল গ্রিডের রেজোলিউশন তুলনা - ছোট পিক্সেল সূক্ষ্ম ল্যান্ডস্কেপ প্রকাশ করে।]

### রাস্টারের মূল বৈশিষ্ট্য:
১. **Cell Size (পিক্সেল সাইজ):** প্রতিটি পিক্সেলের একটি নির্দিষ্ট সাইজ থাকে যা মাঠের রিয়েল এরিয়া নির্দেশ করে। যেমন ৩০ মিটার পিক্সেলের একটি ইমেজ মাঠের ৩০m x ৩০m জায়গার গড় মান প্রকাশ করে।
২. **Continuous Data (নিরবচ্ছিন্ন ডেটা):** মাটির উচ্চতা, তাপমাত্রা, বা স্যাটেলাইট থেকে পাওয়া আলোর প্রতিচ্ছবি সবসময় মসৃণভাবে পরিবর্তিত হয়। এই ধরণের নিরবচ্ছিন্ন ডেটা রাস্টার মডেলে অসাধারণভাবে সংরক্ষিত থাকে।
৩. **Bands (ব্যান্ডস):** একটি ইমেজে একাধিক লেয়ার বা ব্যান্ড থাকতে পারে (যেমন লাল আলো, নীল আলো বা অবলোহিত আলো)।

👉 **বাস্তব চিন্তা:** আমাদের ফসলের সূচক বা NDVI মূলত রাস্টার মডেলেই হিসেব করা হয়, যেখানে প্রতিটি পিক্সেলের মান ফসলের ক্লোরোফিল বা স্বাস্থ্যের অবস্থা নির্দেশ করে।

### End of Lesson Summary
১. রাস্টার ডেটা ম্যাট্রিক্স আকারে সাজানো পিক্সেলের সমষ্টি।
২. তাপমাত্রা, উচ্চতা এবং স্যাটেলাইট ইমেজ রাস্টারের মূল উদাহরণ।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L16
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'নিচের কোনটি রাস্টার ডেটা মডেলের উদাহরণ?', '["উপজেলার সীমানা পলিগন", "স্যাটেলাইট ইমেজ বা মাটির তাপমাত্রার গ্রিড ম্যাপ", "জেলার সড়কের লাইন ম্যাপ", "নলকূপের জিপিএস পয়েন্ট"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'রাস্টার ডেটা নিয়ে কাজ করার সময় পিক্সেল সাইজ ছোট হলে কী সুবিধা হয়?', '["ফাইলের সাইজ অনেক কমে যায়", "স্থানিক ডিটেইলস বা রেজোলিউশন অনেক বৃদ্ধি পায়", "কম্পিউটার দ্রুত কাজ করে", "কোনো সুবিধা নেই"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'পয়েন্ট, লাইন, পলিগনের সাথে রাস্টারের প্রধান জ্যামিতিক তফাৎ কোথায়?', '["রাস্টারে কোনো স্থানাঙ্ক থাকে না", "ভেক্টর নির্দিষ্ট জ্যামিতিক বাউন্ডারি ব্যবহার করে কিন্তু রাস্টার গ্রিডভিত্তিক পিক্সেল গ্রিড ব্যবহার করে", "রাস্টার ম্যাপে প্রিন্ট করা যায় না", "উভয়ই একদম এক"]'::jsonb, 1);


  -- Lesson 17: Elevation Data (DEMs, Slope, and Aspect)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id, '17. Elevation Data: Terrain, Slope & Flow Direction', 'elevation-dems-slope', 2, 
  $markdown$
# Lesson 17: Elevation Data: Terrain, Slope & Flow Direction

কৃষি ক্ষেত্রে মাটির উচ্চতা, ঢাল এবং পানি কোন দিকে গড়িয়ে যাবে তা জানা অত্যন্ত গুরুত্বপূর্ণ। এই কাজের জন্য আমরা ব্যবহার করি **DEM (Digital Elevation Model)** বা ডিজিটাল এলিভেশন মডেল।

DEM হলো একটি বিশেষ ব্ল্যাক-অ্যান্ড-হোয়াইট রাস্টার ম্যাপ যেখানে প্রতিটি পিক্সেলের মান নির্দেশ করে সমুদ্রপৃষ্ঠ থেকে ওই স্থানের উচ্চতা (মিটার বা ফুটে)।

[IMAGE: DEM Slope Hillshade Maps. Caption: একটি এলাকার মূল DEM ম্যাপ থেকে কীভাবে স্লোপ (Slope) এবং পাহাড়ের ছায়া (Hillshade) ম্যাপ তৈরি করা হয় তার ছবি।]

### DEM থেকে আমরা কী কী তৈরি করতে পারি?
১. **Slope Map (মাটির ঢাল):** জমি কত ডিগ্রি কোণে ঢালু তা নির্ধারণ করা। পাহাড় বা টিলায় ফসল চাষের পরিকল্পনা করতে এটি অত্যন্ত জরুরি।
২. **Aspect Map (ঢালের দিক):** পাহাড়ের ঢালটি কোন দিকে মুখ করে আছে (উত্তর, দক্ষিণ, পূর্ব নাকি পশ্চিম)। সূর্যের আলো পাওয়ার সাথে এটি যুক্ত।
৩. **Hillshade (পাহাড়ের ছায়া ভিজ্যুয়ালাইজেশন):** পাহাড়ি অঞ্চলের ওপরে কৃত্রিম সূর্যের আলো ফেলে চমৎকার ৩ডি ম্যাপের অনুভূতি দেওয়া।

👉 **বাস্তব প্রজেক্ট:** শ্রীমঙ্গলের চা বাগানগুলোর ঢাল বিশ্লেষণ করার জন্য আমরা DEM ব্যবহার করে ১০ ডিগ্রির চেয়ে বেশি খাড়া জমিগুলো সহজেই খুঁজে বের করতে পারি!

### End of Lesson Summary
১. DEM হলো উচ্চতা পরিমাপক বিশেষ রাস্টার ফাইল।
২. এটি ব্যবহার করে মাটির ঢাল (Slope) এবং পানি প্রবাহের গতিপথ বিশ্লেষণ করা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L17
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'DEM এর পূর্ণরূপ কোনটি?', '["Digital Elevation Model", "Database Earth Map", "Detailed Environmental Measurement", "Digital Energy Monitor"]'::jsonb, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'পাহাড়ে চা বাগান করার ক্ষেত্রে কোন স্থানে গাছ রোপণ করবেন তা নির্ধারণে কোন বিশ্লেষণটি করা প্রয়োজন?', '["বাফার এনালাইসিস", "DEM থেকে মাটির ঢাল (Slope) ও ঢালের দিক (Aspect) বের করা", "এক্সেল ফাইল ওপেন করা", "কিছুই না"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'DEM ম্যাপের পিক্সেলের ভ্যালু সাধারণত কী নির্দেশ করে?', '["মাটির পিএইচ মান", "সমুদ্রপৃষ্ঠ থেকে ওই স্থানের উচ্চতা (উচ্চতা মান)", "জমির মালিকের আইডি", "ফসলের সবুজায়ন ইনডেক্স"]'::jsonb, 1);


  -- Lesson 18: Raster vs Vector (Which is best when?)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id, '18. Vector vs Raster: When to Use Which?', 'vector-vs-raster-usecase', 3, 
  $markdown$
# Lesson 18: Vector vs Raster: When to Use Which?

এখন আপনারা ম্যাপের দুটি মূল স্তম্ভ—**Vector** এবং **Raster** সম্পর্কে বিশদ জানেন। কিন্তু বাস্তব গবেষণায় কখন আপনি কোনটি ব্যবহার করবেন?

এই সিদ্ধান্তটি নেওয়া একজন গবেষকের জন্য অত্যন্ত গুরুত্বপূর্ণ।

[IMAGE: Raster vs Vector Grid Comparison Overlay. Caption: একটি নদী ও বনের এলাকাকে কীভাবে ভেক্টরের শার্প লাইন/পলিগন এবং রাস্টারের গ্রিড পিক্সেল মডেলে ভিন্নভাবে দেখানো হয় তার তুলনামূলক চার্ট।]

### তুলনা গাইড:
- **Vector (ভেক্টর) ব্যবহার করবেন যখন:**
  - আপনার সীমানাগুলো সুনির্দিষ্ট বা ডিফাইনড হতে হবে (যেমন: জেলা সীমানা, জমির আইল বা সীমানা)।
  - আপনার অ্যাট্রিবিউট টেবিলে অনেক বিবরণ লিখতে হবে।
  - নিখুঁত দূরত্ব ও ক্ষেত্রফল হিসাব করা প্রজেক্টের প্রধান উদ্দেশ্য।
  
- **Raster (রাস্টার) ব্যবহার করবেন যখন:**
  - ডেটাগুলো নিরবচ্ছিন্নভাবে পরিবর্তিত হয় (যেমন: বৃষ্টিপাত, তাপমাত্রা, মাটির আর্দ্রতা)।
  - স্যাটেলাইট ইমেজ বা ড্রোনের আকাশ থেকে তোলা ছবি প্রসেস করবেন।
  - জটিল গাণিতিক ও ওভারলে ম্যাট্রিক্স হিসাবের প্রয়োজন (Raster Calculator)।

👉 **বাস্তব সতর্কতা:** মনে রাখবেন, রাস্টার ফাইলের সাইজ সাধারণত অনেক বড় হয়। তাই অপ্রয়োজনে পুরো দেশের রাস্টার ডেটা প্রসেস করতে গেলে আপনার পিসি হ্যাং হতে পারে। যেখানে সম্ভব ভেক্টর বাউন্ডারি দিয়ে ডেটা কেটে নিয়ে কাজ করা বুদ্ধিমানের কাজ!

### End of Lesson Summary
১. ভেক্টর শার্প বাউন্ডারির জন্য এবং রাস্টার কন্টিনিউয়াস পরিবেশের ডেটার জন্য আদর্শ।
২. কাজের উদ্দেশ্য ও ফাইলের আকারের ওপর ভিত্তি করে সঠিক মডেল বেছে নিতে হবে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L18
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'বাংলাদেশের সকল উপজেলার সুনির্দিষ্ট প্রশাসনিক সীমানা ম্যাপ করার জন্য কোন ডেটা মডেলটি সবচেয়ে উপযুক্ত?', '["Raster Model", "Vector Model (Polygons)", "DEM Grid", "ASCII Grid"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একটি কৃষি মাঠে গত ২৪ ঘণ্টায় বৃষ্টিপাতের পরিমাণ সারা মাঠে কীভাবে পরিবর্তিত হচ্ছে তা ম্যাপিং করার জন্য কোন মডেলটি নিবেন?', '["Vector Point Only", "Raster continuous grid", "Polyline Model", "CSV text file"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ভেক্টর ডেটার তুলনায় রাস্টার ডেটার প্রধান সীমাবদ্ধতা কোনটি হতে পারে?', '["এতে কোনো স্থানাঙ্ক ব্যবহার করা যায় না", "ফাইলের সাইজ অনেক বড় হতে পারে এবং জুম করলে পিক্সেল ফেটে যায়", "এটিতে রঙ করা যায় না", "এটি ল্যাপটপে ওপেন হয় না"]'::jsonb, 1);


  -- Lesson 19: Georeferencing (Mapping Scanned Mauza Maps)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id, '19. Georeferencing: Giving Scanned Maps Coordinates', 'georeferencing-scanned-maps', 4, 
  $markdown$
# Lesson 19: Georeferencing: Giving Scanned Maps Coordinates

বাস্তব জীবনে অনেক সময় ভূমি অফিস থেকে আপনি স্ক্যান করা পুরানো মৌজা ম্যাপ পাবেন, যা মূলত একটি সাধারণ জেপেগ (`.jpg`) বা ইমেজ ফাইল। এই ইমেজ ফাইলটি যখন আপনি প্রথমবার ArcGIS Pro-তে আনবেন, এটি মহাকাশে বা ভুল কোনো স্থানাঙ্কে ভাসতে থাকবে কারণ এর কোনো বাস্তব ভৌগোলিক অবস্থান নেই।

এই ইমেজ ম্যাপটিকে বাস্তব পৃথিবীর সঠিক স্থানাঙ্কে বসানোর প্রক্রিয়াকে বলা হয় **Georeferencing**।

[IMAGE: Georeferencing Control Points. Caption: স্ক্যান করা কাগজের মৌজা ম্যাপকে গুগুল আর্থ বা বাস্তব বর্ডারের সাথে কন্ট্রোল পয়েন্ট (Control Points) দিয়ে যুক্ত করার চিত্র।]

### কন্ট্রোল পয়েন্ট (Control Points) এর জাদুকরী আইডিয়া:
১. আমরা ইমেজের এমন কিছু সুনির্দিষ্ট স্থান বা কোণ চিহ্নিত করব যা আমরা চিনি (যেমন রাস্তার মোড়, ব্রিজের কোণ বা জিপিএস দিয়ে নেওয়া নির্দিষ্ট সীমানা)।
২. প্রথমে স্ক্যান ম্যাপের সেই বিন্দুতে ক্লিক করব, তারপর রিয়েল ম্যাপের (যেমন বেসম্যাপ বা Google Satellite) ঠিক একই বিন্দুতে ক্লিক করব।
৩. সফটওয়্যার এই দুই বিন্দুর মধ্যে যোগসূত্র তৈরি করে স্ক্যান ম্যাপটিকে টেনে সঠিক জায়গায় বসিয়ে দেবে। একে বলে **Control Point Creation**।
৪. কমপক্ষে ৩ থেকে ৪টি কন্ট্রোল পয়েন্ট বসালেই ম্যাপটি নিখুঁতভাবে জায়গামতো বসে যাবে।

👉 **বাস্তব প্রজেক্ট:** আমরা যখন আমাদের গবেষণার জন্য পুরানো কোনো ইউনিয়ন ল্যান্ড ইউজ ম্যাপকে ডিজিটাইজ করি, এই জিওরেফারেন্সিং-ই আমাদের প্রথম ও প্রধান ধাপ!

### End of Lesson Summary
১. জিওরেফারেন্সিং হলো কোঅর্ডিনেটবিহীন ছবিকে সঠিক স্থানিক কোঅর্ডিনেট দেওয়ার পদ্ধতি।
২. কন্ট্রোল পয়েন্ট বসানোর সময় এরর বা ত্রুটির পরিমাণ (RMS Error) যত কম হবে, ম্যাপ তত নিখুঁত হবে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L19
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কোনো সাধারণ ছবি বা জেপেগ (JPEG) ম্যাপকে ভৌগোলিক স্থানাঙ্ক দেওয়ার প্রক্রিয়াকে কী বলে?', '["Clipping", "Georeferencing", "Data Joining", "Rasterizing"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'জিওরেফারেন্সিং করার সময় সর্বনিম্ন কয়টি কন্ট্রোল পয়েন্ট নিখুঁতভাবে সেট করা উচিত?', '["১টি", "২টি", "৩ থেকে ৪টি ভালো ফলাফলের জন্য", "১০০টি"]'::jsonb, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'জিওরেফারেন্সিং এর শুদ্ধতা কোন মানটি দেখে বোঝা যায়?', '["Pixel size", "Root Mean Square (RMS) Error", "File Type", "Projection Name"]'::jsonb, 1);


  -- Lesson 20: Creating Points from GPS Coordinate Lists
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id, '20. Importing GPS Coordinates from Excel into Map Points', 'gps-excel-import', 5, 
  $markdown$
# Lesson 20: Importing GPS Coordinates from Excel into Map Points

মাঠ পর্যায় থেকে জিপিএস দিয়ে নেওয়া ডেটা সাধারণত শিক্ষার্থীরা এক্সেল বা সিএসভি (`.csv`) ফাইলে লিখে রাখেন। যেমন:
`Sample_ID, Latitude, Longitude, Soil_pH`
`1, 24.7523, 90.4021, 6.2`

আজকে আমরা শিখব কীভাবে এই এক্সেল টেবিলকে সরাসরি ম্যাপে পয়েন্ট ফিচারে রূপান্তর করব।

[IMAGE: XY Data Import Box ArcGIS. Caption: ArcGIS Pro এর Add XY Data অপশন উইন্ডো যেখানে Latitude কে Y Field এবং Longitude কে X Field হিসেবে সিলেক্ট করা হচ্ছে।]

### ৩টি সোনার নিয়ম (Rules of XY Data):
১. **X Field = Longitude (দ্রাঘিমাংশ):** এটি মানচিত্রের পূর্ব-পশ্চিম বরাবর অবস্থান নির্দেশ করে।
২. **Y Field = Latitude (অক্ষাংশ):** এটি মানচিত্রের উত্তর-দক্ষিণ বরাবর অবস্থান নির্দেশ করে।
৩. **Coordinate System (কোঅর্ডিনেট সিস্টেম):** জিপিএস থেকে নেওয়া কাঁচা কোঅর্ডিনেট সবসময় **GCS_WGS_1984** সিস্টেমে থাকে। ভুল করেও এটিতে শুরুতেই Projected System সিলেক্ট করবেন না!

👉 **বাস্তব প্র্যাকটিস:** ArcGIS Pro-তে `Map` ট্যাবে যান > `Add Data` > `XY Point Data` তে ক্লিক করুন। কলামগুলো সঠিকভাবে সিলেক্ট করে রান দিলেই আপনার জিপিএস পয়েন্টগুলো মানচিত্রে ফুটে উঠবে!

### End of Lesson Summary
১. এক্সেল কোঅর্ডিনেট ইম্পোর্ট করতে X ফিল্ডে Longitude এবং Y ফিল্ডে Latitude দিতে হয়।
২. ইম্পোর্ট করার সময় সঠিক কোঅর্ডিনেট সিস্টেম সিলেক্ট করা অপরিহার্য।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L20
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'এক্সেল থেকে জিপিএস স্থানাঙ্ক ইম্পোর্ট করার সময় X Field এবং Y Field হিসেবে যথাক্রমে কোনগুলো সিলেক্ট করতে হবে?', '["Latitude & Longitude", "Longitude & Latitude", "pH & Yield", "East & West"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'সাধারণ মোবাইল জিপিএস দিয়ে রেকর্ড করা কোঅর্ডিনেট ইম্পোর্টের সময় কোন কোঅর্ডিনেট সিস্টেমটি সিলেক্ট করা উচিত?', '["BTM", "WGS 1984 (GCS)", "UTM Zone 45N", "Mercator Sphere"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'পয়েন্টগুলো ম্যাপে দেখানোর পর সেগুলোকে চিরস্থায়ীভাবে শেপফাইল হিসেবে সেভ করতে কোন অপশনটি ব্যবহার করতে হবে?', '["Save Project", "Data > Export Features", "Close Application", "Delete Layer"]'::jsonb, 1);

  -- ================================================================================================
  -- MODULE 5: BASIC MAPPING & STYLING (SYMBOLOGY & CARTOGRAPHY)
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gis_cid, 'Module 5: Basic Mapping & Styling', 'mapping-styling-cartography', 5, 'Design thematic maps, edit labels, and build print-ready map layouts.')
  RETURNING id INTO m5_id;

  -- Lesson 21: Symbology (Visualizing Categorical Data)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m5_id, '21. Symbology: Coloring Soil pH, Yield & Crop Types', 'symbology-categorical', 1, 
  $markdown$
# Module Overview
এই মডিউলে আমরা মানচিত্রের ভিজ্যুয়াল ডিজাইন বা কার্টোগ্রাফি শিখব। কীভাবে ফসল বা মাটির ডেটাকে ক্যাটাগরি ও রঙের মাধ্যমে সুন্দরভাবে ফুটিয়ে তোলা যায়, লেবেল সেট করা যায় এবং প্রিন্ট-রেডি আকর্ষণীয় লেআউট তৈরি করা যায় তা শিখব।

# Lesson 21: Symbology: Coloring Soil pH, Yield & Crop Types

একটি মানচিত্রকে সহজে পাঠযোগ্য করার প্রধান হাতিয়ার হলো **Symbology (সিম্বলজি)** বা প্রতীকায়ন। কেবল কালো রঙের বর্ডার আর লাইনের ম্যাপ কেউ পড়তে চায় না।

আজকে আমরা শিখব কীভাবে ক্যাটাগরিকাল বা গুণগত ডেটা ম্যাপে প্রদর্শন করব। যেমন: আপনার জেলা মানচিত্রে আলাদা আলাদা ফসল বা সয়েল টাইপকে আলাদা রঙে সাজানো।

[IMAGE: Unique Values Symbology Example. Caption: ইউনিক ভ্যালুজ (Unique Values) অপশন ব্যবহার করে বিভিন্ন ফসলের জমিকে ভিন্ন ভিন্ন রঙে ফুটিয়ে তোলার দৃশ্য।]

### Unique Values (ইউনিক ভ্যালুজ)
যখন ডেটাগুলো সংখ্যাবাচক নয়, বরং গ্রুপ বা শ্রেণীভিত্তিক (যেমন: ধান, গম, সরিষা, আম), তখন আমরা ব্যবহার করি **Unique Values** সিম্বলজি।
- এটি প্রতিটি ভিন্ন ক্যাটাগরির জন্য একটি নির্দিষ্ট রঙ বরাদ্দ করে।
- *কৃষি টিপস:* ধানের জন্য হালকা সবুজ, আমের জন্য উজ্জ্বল হলুদ বা সবুজ এবং নদীর জন্য নীল রঙ ব্যবহার করা আমাদের কার্টোগ্রাফিক স্ট্যান্ডার্ড বা বৈজ্ঞানিক নিয়ম।

👉 **বাস্তব প্র্যাকটিস:** লেয়ারে রাইট ক্লিক করুন > `Symbology` > ড্রপডাউন থেকে `Unique Values` সিলেক্ট করুন এবং আপনার কাঙ্ক্ষিত কলামটি (যেমন: `Crop_Type`) বেছে নিন!

### End of Lesson Summary
১. সিম্বলজি ম্যাপের ফিচারগুলোকে দৃষ্টিনন্দন ও অর্থপূর্ণ করে তোলে।
২. ক্যাটাগরিকাল ডেটা দেখানোর জন্য ইউনিক ভ্যালুজ সিম্বলজি ব্যবহৃত হয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L21
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ম্যাপে মাটির ধরণ (যেমন: বেলে, এঁটেল, দোআঁশ) আলাদা আলাদা রঙে দেখাতে কোন সিম্বলজি ব্যবহার করবেন?', '["Graduated Colors", "Unique Values", "Single Symbol", "Proportional Symbols"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কার্টোগ্রাফিক নিয়ম অনুযায়ী সাধারণত মানচিত্রে নদী বা জলাশয়কে কোন রঙে দেখানো উচিত?', '["লাল", "সবুজ", "নীল", "হলুদ"]'::jsonb, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'সিম্বলজি পরিবর্তন করলে কি পেছনের ডাটাবেজ বা এক্সেলে থাকা মূল ডেটা পরিবর্তিত হয়ে যায়?', '["হ্যাঁ, সব ডিলিট হয়ে যায়", "না, এটি কেবল ম্যাপের ভিজ্যুয়াল বা বাহ্যিক উপস্থাপনা পরিবর্তন করে", "হ্যাঁ, ডেটা এডিট হয়ে যায়", "জানিনা"]'::jsonb, 1);


  -- Lesson 22: Visualizing Quantitative Data (Graduated Colors)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m5_id, '22. Visualizing Quantitative Data: Graduated Colors', 'symbology-quantitative', 2, 
  $markdown$
# Lesson 22: Visualizing Quantitative Data: Graduated Colors

আজ আমরা শিখব কীভাবে সংখ্যাবাচক বা পরিমাণগত ডেটা ম্যাপে দেখাব। যেমন: ফলনের পরিমাণ (টন/হেক্টর) বা নাইট্রোজেনের ঘনত্ব।

যখন ডেটা সংখ্যাবাচক হয়, তখন আমরা রঙের শেড বা তীব্রতা ব্যবহার করে কম থেকে বেশির রূপান্তর দেখাই। একে বলা হয় **Graduated Colors** থিমেটিক ম্যাপ।

[IMAGE: Graduated Colors Soil Map. Caption: হালকা থেকে গাঢ় লাল শেড ব্যবহার করে নাইট্রোজেনের ঘনত্ব (কম থেকে বেশি) দেখানোর মানচিত্র।]

### ডেটা ক্লাসিফিকেশন মেথড (Classification Methods):
সফটওয়্যার কীভাবে আপনার ডেটাকে ৪-৫টি গ্রুপে ভাগ করবে?
১. **Natural Breaks (Jenks):** এটি ডেটার নিজস্ব ন্যাচারাল গ্যাপ খুঁজে গ্রুপ তৈরি করে। এটি সবচেয়ে বেশি ব্যবহৃত ডিফল্ট মেথড।
২. **Equal Interval (সমান ব্যবধান):** পুরো রেঞ্জকে সমান ভাগে ভাগ করে (যেমন: ০-১০, ১০-২০, ২০-৩০)।
３. **Quantile:** প্রতিটি গ্রুপে সমান সংখ্যক জ্যামিতিক ফিচার রাখে।

👉 **কৃষিবিদের প্র্যাকটিস:** উচ্চ নাইট্রোজেন ঘনত্ব দেখতে আমরা গাঢ় সবুজ রঙ ব্যবহার করতে পারি এবং কম ঘনত্ব দেখতে হালকা হলুদ বা লাল শেড ব্যবহার করতে পারি।

### End of Lesson Summary
১. সংখ্যাবাচক উপাত্ত ভিজ্যুয়ালাইজ করতে গ্র্যাজুয়েটেড কালারস সিম্বলজি ব্যবহার করা হয়।
২. ন্যাচারাল ব্রেকস মেথড প্রাকৃতিকভাবে গ্রুপ তৈরি করতে সবচেয়ে উপযোগী।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L22
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'মাটির লবণের পরিমাণ (Salinity Level) কম থেকে বেশি ক্রমান্বয়ে প্রদর্শন করতে কোন পদ্ধতিটি নিবেন?', '["Unique Values", "Graduated Colors", "Chart Symbol", "Single Symbol"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কোন ডেটা ক্লাসিফিকেশন পদ্ধতিটি ডেটার মধ্যকার প্রাকৃতিক শূন্যস্থান বা বিন্যাসের ওপর ভিত্তি করে গ্রুপ তৈরি করে?', '["Equal Interval", "Natural Breaks (Jenks)", "Manual Interval", "Standard Deviation"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'রঙের তীব্রতার ক্ষেত্রে (Color Ramp) সাধারণত গাঢ় রঙ মানচিত্রে কী নির্দেশ করে?', '["কম পরিমাণ বা ঘনত্ব", "বেশি পরিমাণ বা উচ্চ ঘনত্ব", "শুন্য মান", "কোনোটিই নয়"]'::jsonb, 1);


  -- Lesson 23: Labeling and Annotating Map Features
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m5_id, '23. Labeling and Annotating Map Features', 'labeling-annotation', 3, 
  $markdown$
# Lesson 23: Labeling and Annotating Map Features

ম্যাপে সুন্দর রঙ করার পর আপনার দর্শক হয়তো জানতে চাইবেন—"ভাইয়া, এই সুন্দর সবুজ অংশটা কোন উপজেলা?"

এর জন্য আমাদের ম্যাপের ওপরে টেক্সট বা লেবেল যুক্ত করতে হবে। আজকে আমরা শিখব কীভাবে অটোমেটিক লেবেলিং করতে হয় এবং তার ফ্রন্ট সাইজ ও ওভারল্যাপ কন্ট্রোল করতে হয়।

[IMAGE: Labeling Properties Panel ArcGIS. Caption: ArcGIS Pro এর Label Properties উইন্ডো যেখানে ফন্ট সাইজ, পজিশন এবং বাফার অবজেক্ট কন্ট্রোল করা হচ্ছে।]

### লেবেলিং এর ৩টি গোল্ডেন টিপস:
১. **Select Right Field:** কন্টেন্টস প্যানেলের লেবেল ড্রপডাউন থেকে সঠিক কলামটি (যেমন: `Upazila_Name`) সিলেক্ট করুন।
২. **Halo Effect (হ্যালো ইফেক্ট):** লেখাটির চারপাশে হালকা সাদা বা হালকা রঙের বর্ডার দেওয়া যাতে জটিল ব্যাকগ্রাউন্ডের ওপরেও লেখাটি পরিষ্কার পড়া যায়।
৩. **Avoid Clutter (জটলা কমানো):** অনেক বেশি লেবেল ম্যাপকে নোংরা করে ফেলে। তাই স্কেল রেঞ্জ সেট করে দিন যাতে জুম আউট করলে লেবেল লুকিয়ে যায় এবং জুম ইন করলে দেখা যায়।

👉 **বাস্তব প্র্যাকটিস:** Label Properties এ গিয়ে `Text Symbol` > `Halo` অপশনটি অন করে দেখুন, আপনার ম্যাপের উপজেলার নামগুলো কতটা প্রফেশনাল ও ঝকঝকে দেখায়!

### End of Lesson Summary
১. লেবেলিং ম্যাপের বিভিন্ন স্থান বা ফিচারকে টেক্সটের মাধ্যমে পরিচিত করায়।
২. হ্যালো ইফেক্ট জটিল ম্যাপ ব্যাকগ্রাউন্ডে টেক্সটের পঠনযোগ্যতা বৃদ্ধি করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L23
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'মানচিত্রের ওপরে লেখার চারপাশে একটি হালকা বর্ডার বা ছায়া তৈরি করাকে কী বলা হয়?', '["Shadow Drop", "Halo Effect", "Text Border", "Masking Color"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ম্যাপে জুম আউট করলে উপজেলার নামগুলো যাতে জটলা না পাকায় সেজন্য আমাদের কী নিয়ন্ত্রণ করা উচিত?', '["ম্যাপের নাম পরিবর্তন করা", "স্কেল ডিপেন্ডেন্সি বা ভিজিবিলিটি রেঞ্জ (Visibility Range)", "কম্পিউটারের ব্রাইটনেস", "লেবেল ডিলিট করা"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'লেবেলে বাংলা টেক্সট ভেঙে গেলে আমাদের কী নিশ্চিত করা উচিত?', '["ইন্টারনেট কানেকশন চেক করা", "সঠিক ইউনিকোড বাংলা ফন্ট (যেমন কালপুরুষ বা সোলাইমানলিপি) সিলেক্ট করা", "ফাইল ডিলিট করা", "জানিনা"]'::jsonb, 1);


  -- Lesson 24: Map Layout Design (Scale, Legends, North Arrow)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m5_id, '24. Map Layout Design: Scalebars, Legends & North Arrows', 'map-layout-design', 4, 
  $markdown$
# Lesson 24: Map Layout Design: Scalebars, Legends & North Arrows

আপনার সুন্দর ম্যাপটি থিসিস রিপোর্টে বসানোর আগে বা প্রিন্ট করার আগে সেটির একটি পূর্ণাঙ্গ ফ্রেম তৈরি করতে হবে। এই ফ্রেমকে বলা হয় **Map Layout**।

একটি প্রফেশনাল বৈজ্ঞানিক ম্যাপ লেআউটে ৫টি অত্যন্ত গুরুত্বপূর্ণ উপাদান থাকতেই হবে।

[IMAGE: Map Layout Complete Elements. Caption: একটি আদর্শ মানচিত্রের লেআউট - মূল ম্যাপ, গ্রিড লাইন, লিজেন্ড বা সূচক, নর্থ অ্যারো এবং স্কেলবার এর সঠিক বিন্যাস।]

### ৫টি মূল উপাদান:
১. **Title (শিরোনাম):** ম্যাপটি কী বিষয়ের (যেমন: "Soil pH Map of Mymensingh Sadar Upazila")।
২. **North Arrow (উত্তরমুখী তীর):** দিক চেনার জন্য উত্তর দিক কোন দিকে তা নির্দেশ করা।
৩. **Scale Bar (স্কেল বার):** ম্যাপের ১ সেন্টিমিটার বাস্তবে কত কিলোমিটার তা দেখানোর গ্রাফিক্যাল স্কেল।
৪. **Legend (সূচক):** কোন রঙ দিয়ে কী বোঝানো হয়েছে তা দর্শককে বুঝিয়ে দেওয়ার তালিকা।
৫. **Grid Lines (গ্রিড/কোঅর্ডিনেট লাইন):** চারপাশের ল্যাটিচিউড ও লঙ্গিচিউডের দাগসমূহ।

👉 **বাস্তব প্র্যাকটিস:** `Insert` ট্যাব থেকে `New Layout` এ ক্লিক করে একটি স্ট্যান্ডার্ড সাইজ (যেমন: A4 বা Letter) সিলেক্ট করুন, তারপর আপনার তৈরি ম্যাপটি ফ্রেমের ভেতর টেনে বসিয়ে দিন!

### End of Lesson Summary
১. লেআউট ভিউ ম্যাপকে প্রিন্ট করার উপযোগী ফ্রেমে রূপান্তর করে।
২. লিজেন্ড, স্কেলবার এবং নর্থ অ্যারো ছাড়া যেকোনো ম্যাপ বৈজ্ঞানিকভাবে অসম্পূর্ণ।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L24
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একটি প্রফেশনাল বৈজ্ঞানিক ম্যাপে উত্তর দিক নির্দেশক কোন প্রতীকটি থাকা আবশ্যক?', '["Scale Bar", "North Arrow", "Legend", "Title Frame"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ম্যাপের লাল ও সবুজ রঙের অর্থ কী তা দর্শকদের বুঝিয়ে দিতে কোন উপাদানটি যোগ করতে হবে?', '["Title", "Legend (লিজেন্ড বা সূচক)", "North Arrow", "Gridlines"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'লেআউটে স্কেলবারের প্রধান কাজ কী?', '["ম্যাপের ফাইল সাইজ মাপা", "ম্যাপের দূরত্ব এবং বাস্তব দূরত্বের সম্পর্ক দেখানো", "ম্যাপ সুন্দর করা", "দিক নির্ণয় করা"]'::jsonb, 1);


  -- Lesson 25: Exporting Maps (PDF, PNG, and Print Options)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m5_id, '25. Exporting Maps: High-Quality Formats for Research', 'exporting-maps-formats', 5, 
  $markdown$
# Lesson 25: Exporting Maps: High-Quality Formats for Research

অভিনন্দন! আপনি আপনার ম্যাপ ও লেআউট সম্পূর্ণ প্রস্তুত করে ফেলেছেন। এবার এটি আমাদের থিসিস রিপোর্ট, জার্নাল আর্টিকেল বা প্রেজেন্টেশন স্লাইডে যুক্ত করার পালা।

আজ আমরা শিখব কীভাবে সেরা রেজোলিউশন বজায় রেখে ম্যাপ এক্সপোর্ট করতে হয়।

[IMAGE: ArcGIS Pro Export Window. Caption: ArcGIS Pro এর Export Layout উইন্ডো যেখানে DPI এবং ফাইল ফরম্যাট সিলেক্ট করা হচ্ছে।]

### প্রধান এক্সপোর্ট ফাইল ফরমেটসমূহ:
১. **PDF (Portable Document Format):** ভেক্টর ও টেক্সট ম্যাপের জন্য সবচেয়ে সেরা। এটি জুম করলেও টেক্সট এবং সীমানা একটুও ফাটে না বা ঘোলা হয় না।
২. **PNG (Portable Network Graphics):** প্রেজেন্টেশন বা ওয়েবসাইটে ম্যাপ ব্যবহারের জন্য সেরা ছবি ফরমেট। এটি ব্যাকগ্রাউন্ড ট্রান্সপারেন্ট সাপোর্ট করে।
৩. **TIFF:** জার্নাল বা প্রিন্টিং প্রেসের জন্য সর্বোচ্চ রেজোলিউশনের আনকমপ্রেসড ফাইল ফরম্যাট।

### রেজোলিউশন বা DPI (Dots Per Inch)
থিসিস বা জার্নাল আর্টিকেলের জন্য ম্যাপের রেজোলিউশন ন্যূনতম **300 DPI** হওয়া দরকার। ৩০০ ডিপিআই এর নিচে এক্সপোর্ট করলে প্রিন্ট করার সময় আপনার মানচিত্রের উপজেলার সীমানা ও লেখা ঘোলা হয়ে যাবে।

👉 **বাস্তব প্র্যাকটিস:** `Share` ট্যাব > `Export Layout` ক্লিক করুন। ফরম্যাট সিলেক্ট করুন `PNG` বা `PDF` এবং রেজোলিউশন বক্সে `300 DPI` লিখে এক্সপোর্ট করুন!

### End of Lesson Summary
১. জার্নালে প্রকাশের জন্য ন্যূনতম ৩০০ ডিপিআই রেজোলিউশনে ম্যাপ এক্সপোর্ট করতে হয়।
২. পিডিএফ ফরম্যাট ম্যাপের ভেক্টর শার্পনেস ও লেবেলের স্পষ্টতা বজায় রাখে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L25
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'থিসিস রিপোর্ট বা বৈজ্ঞানিক জার্নালে ম্যাপ ব্যবহারের জন্য ন্যূনতম কত DPI রেজোলিউশন রেকমেন্ড করা হয়?', '["72 DPI", "150 DPI", "300 DPI", "1200 DPI"]'::jsonb, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কোন ফাইল ফরম্যাটে ম্যাপ এক্সপোর্ট করলে জুম করার পরেও উপজেলার নাম ও বর্ডার লাইন একদম ঘোলা বা পিক্সেলড হবে না?', '["JPEG (low quality)", "Vector PDF", "GIF", "BMP"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'প্রেজেণ্টেশন স্লাইডে ম্যাপ ব্যবহারের জন্য সাধারণত কোন ছবি ফরম্যাটটি লাইটওয়েট এবং স্বচ্ছ ব্যাকগ্রাউন্ডের কারণে দারুণ কাজ করে?', '["PNG", "TIFF", "RAW", "SVG standard code"]'::jsonb, 0);

  -- ================================================================================================
  -- MODULE 6: BASIC VECTOR SPATIAL ANALYSIS (GEOPROCESSING TOOLKIT)
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gis_cid, 'Module 6: Basic Vector Spatial Analysis', 'vector-spatial-analysis', 6, 'Execute fundamental geoprocessing workflows: Buffer, Clip, Intersect, and Spatial Joins.')
  RETURNING id INTO m6_id;

  -- Lesson 26: Buffer Analysis (Proximity Zones)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m6_id, '26. Buffer Analysis: Finding Proximity Zones', 'buffer-analysis', 1, 
  $markdown$
# Module Overview
এই মডিউলে আমরা স্থানিক বিশ্লেষণের আসল দুনিয়ায় প্রবেশ করব। ভূ-প্রক্রিয়াকরণ বা Geoprocessing টুলস যেমন: Buffer, Clip, Intersect, এবং Spatial Join ব্যবহার করে জটিল কৃষি ও পরিবেশগত সমস্যার সমাধান করব।

# Lesson 26: Buffer Analysis: Finding Proximity Zones

মনে করুন, ময়মনসিংহের ব্রক্ষ্মপুত্র নদের অববাহিকায় নদীর দুধারে ৫০০ মিটারের মধ্যে কী পরিমাণ আবাদি জমি রয়েছে, যা আকস্মিক বন্যায় তলিয়ে যেতে পারে, তা আপনাকে বের করতে হবে।

এই ধরণের দূরত্ব-ভিত্তিক বিশ্লেষণকে বলা হয় **Buffer Analysis** বা বাফার বিশ্লেষণ। এটি মূলত কোনো ফিচারের চারপাশে নির্দিষ্ট দূরত্বের একটি নতুন সীমানা বা পলিগন তৈরি করে।

[IMAGE: Buffer Tool Diagram. Caption: সেচ নালার দুধারে নির্দিষ্ট দূরত্বের বাফার জোন তৈরির জ্যামিতিক চিত্র।]

### বাফার ব্যবহারের নিয়ম:
১. বাফার পয়েন্ট, লাইন বা পলিগন—যেকোনো ভেক্টরের ওপর চালানো যায়।
২. **গুরুত্বপূর্ণ শর্ত:** বাফার করার আগে আপনার ডেটা অবশ্যই Projected Coordinate System (যেমন UTM বা BTM) এ থাকতে হবে, কারণ মিটারে সঠিক দূরত্ব হিসেব করার জন্য Projected সিস্টেম প্রয়োজন। degrees ইউনিটে বাফার করলে ফলাফল ভুল আসবে।

👉 **বাস্তব চিন্তা:** আমরা R-এ কাজ করার সময় `sf` প্যাকেজের `st_buffer()` ফাংশন ব্যবহার করে এই একই কাজ করেছিলাম। জ্যামিতিক লজিকটি কিন্তু একদম একই!

### End of Lesson Summary
১. বাফার টুল কোনো স্পেশিয়াল ফিচারের চারপাশে একটি নির্দিষ্ট ব্যাসার্ধের সীমানা (Buffer Zone) তৈরি করে।
২. নিখুঁত মিটার ইউনিটে বাফার করার জন্য PCS কোঅর্ডিনেট সিস্টেম অত্যন্ত জরুরি।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L26
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'বাফার (Buffer) বিশ্লেষণ করার মূল উদ্দেশ্য কী?', '["ম্যাপের কালার চেঞ্জ করা", "কোনো ফিচারের চারপাশে নির্দিষ্ট দূরত্বের একটি স্থানিক জোন তৈরি করা", "ডেটার সাইজ ছোট করা", "ফাইল ফরম্যাট রূপান্তর"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একটি নদীর ম্যাপ লাইনের দুধারে ১০০ মিটার বন্যা ঝুঁকি অঞ্চল বের করতে কোন টুলের সাহায্য নেবেন?', '["Clip Tool", "Buffer Tool", "Intersect Tool", "Dissolve Tool"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কেন বাফার রান করার আগে ম্যাপ লেয়ারের CRS-কে Projected (PCS) এ রূপান্তর করতে হবে?', '["যাতে বাফার দূরত্বটি ডিগ্রির বদলে মিটার বা ফুটে সঠিক মাপে করা যায়", "যাতে ম্যাপের স্কেল ১:১ হয়", "যাতে ফাইল সাইজ ছোট থাকে", "কোনো কারণ নেই"]'::jsonb, 0);


  -- Lesson 27: Clip Tool (Spatial Extraction)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m6_id, '27. Clip Tool: Spatial Extraction', 'clip-tool', 2, 
  $markdown$
# Lesson 27: Clip Tool: Spatial Extraction

অনেক সময় ইন্টারনেট থেকে পুরো বাংলাদেশের একটি বড় রাস্তা বা নদীর ম্যাপ ডাউনলোড করার পর আপনি দেখবেন, আপনার ল্যাপটপ ধীরগতির হয়ে গেছে কারণ এত বড় ফাইল লোড হতে সময় লাগছে। কিন্তু আপনার গবেষণা কেবল "ময়মনসিংহ সদর" উপজেলা নিয়ে।

পুরো দেশের বিশাল ম্যাপ থেকে নির্দিষ্ট উপজেলার ভেতরের অংশটুকু কুকি-কাটারের মতো কেটে আলাদা করে নেওয়াকে বলা হয় **Clip** বা ক্লিপ করা।

[IMAGE: Clip Geoprocessing Concept. Caption: কুকি কাটার অ্যানালজি - কীভাবে মূল বড় লেয়ার থেকে ইনপুট বাউন্ডারি ব্যবহার করে কাঙ্ক্ষিত অংশটি ক্লিপ করে আনা হয়।]

### কুকি-কাটার অ্যানালজি (Cookie-Cutter Analogy):
১. **Input Features (ময়দা):** আপনার মূল ম্যাপ (যেমন পুরো দেশের নদী বা রাস্তা)।
２. **Clip Features (কুকি কাটার):** আপনার বাউন্ডারি লেয়ার (যেমন আপনার নির্দিষ্ট উপজেলা সীমানা)।
３. **Output Feature Class (কুকি):** উপজেলার ভেতরের নির্দিষ্ট কাট-আউট অংশটি।

👉 **বাস্তব প্র্যাকটিস:** Geoprocessing ট্যাবে গিয়ে `Clip` সার্চ করুন। Input এ নদীর লেয়ার দিন, Clip Features এ উপজেলার সীমানা দিন এবং রান করুন। দেখবেন শুধু উপজেলার ভেতরের নদীর অংশটুকু নতুন লেয়ার হিসেবে চলে এসেছে!

### End of Lesson Summary
১. ক্লিপ টুল আমাদের অযাচিত স্থানিক এলাকা বাদ দিয়ে কেবল কাঙ্ক্ষিত সীমানার ভেতরের ভেক্টর ডেটা কেটে নিতে সাহায্য করে।
২. এটি আমাদের ফাইল সাইজ ছোট করে কাজ অনেক দ্রুত করতে সাহায্য করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L27
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'GIS সিস্টেমে ক্লিপ (Clip) টুলের মূল কাজ কী?', '["একটি লেয়ারের সাথে অন্য লেয়ারের টেবিল যুক্ত করা", "ইনপুট লেয়ার থেকে কেবল ক্লিপ সীমানার ভেতরের অংশ কেটে আলাদা লেয়ার তৈরি করা", "ম্যাপের রেজোলিউশন দ্বিগুণ করা", "ম্যাপ প্রিন্ট দেওয়া"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'সারা দেশের রেললাইনের ডেটা থেকে আপনার স্টাডি এরিয়া "সিলেট জেলার" রেললাইন আলাদা করতে ক্লিপ ফিচারে কোনটি ইনপুট দেবেন?', '["রেললাইনের ম্যাপ", "সিলেট জেলার সীমানা পলিগন ম্যাপ", "বাংলাদেশের নদী ম্যাপ", "একটি টেক্সট ফাইল"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ক্লিপ টুল রান করার পর আউটপুট ফাইলের আয়তন মূল ফাইলের তুলনায় কেমন হয়?', '["একদম সমান থাকে", "অনেক ছোট বা সমান হতে পারে স্টাডি বাউন্ডারি অনুযায়ী", "দশগুণ বড় হয়ে যায়", "সব তথ্য মুছে যায়"]'::jsonb, 1);


  -- Lesson 28: Intersect and Union (Spatial Overlay)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m6_id, '28. Intersect vs Union: Spatial Overlay', 'intersect-vs-union', 3, 
  $markdown$
# Lesson 28: Intersect and Union: Spatial Overlay

আজ আমরা শিখব স্থানিক ওভারলের দুটি সুপারস্টার টুল—**Intersect** এবং **Union**। এই দুটি টুল দুটি ভিন্ন ম্যাপের সীমানা ও তথ্যকে একসাথে জোড়া দিয়ে নতুন জ্যামিতি তৈরি করে।

[IMAGE: Intersect vs Union Venn Diagrams. Caption: ইন্টারসেক্ট (কেবল কমন অংশ) বনাম ইউনিয়ন (সব অংশ একত্রীকরণ) এর গাঠনিক ও জ্যামিতিক পার্থক্য।]

### ১. Intersect (ছেদ)
এটি কেবল দুটি ম্যাপের সাধারণ বা কমন (Overlap) অংশটুকুকে কেটে নেয় এবং তাদের উভয়ের অ্যাট্রিবিউট ডেটা যুক্ত করে।
- *বাস্তব কৃষি উদাহরণ:* আপনার কাছে মাটির এঁটেল মাটির ম্যাপ আছে এবং বন্যার প্লাবনভূমির ম্যাপ আছে। দুটি ইন্টারসেক্ট করলে আপনি কেবল সেই এরিয়াগুলো পাবেন যেখানে এঁটেল মাটি এবং বন্যা এলাকা—দুটি কন্ডিশনই একসাথে সত্য।

### ২. Union (মিলন)
এটি দুটি ম্যাপের সব অংশকেই একসাথে জুড়ে দেয় (কমন অংশ এবং আনকমন অংশ সবই থাকবে)।
- *বাস্তব কৃষি উদাহরণ:* আপনার ফসল ক্ষেত এবং বনভূমির সম্পূর্ণ মোট এরিয়া একসাথে হিসাব করার জন্য এটি ব্যবহার করা যেতে পারে।

👉 **বাস্তব সংযোগ:** আমরা R-এ যেভাবে `st_intersection()` এবং `st_union()` ব্যবহার করতাম, ArcGIS Pro এর এই টুলগুলো ঠিক একই জ্যামিতিক ও ডাটাবেজ অপারেশনগুলো সম্পন্ন করে!

### End of Lesson Summary
১. ইন্টারসেক্ট কেবল ওভারল্যাপিং বা কমন অংশটুকুর তথ্য ও জ্যামিতি ধারণ করে।
২. ইউনিয়ন দুটি ইনপুট লেয়ারের সম্পূর্ণ জ্যামিতিক বিস্তৃতি একসাথে জুড়ে নতুন লেয়ার তৈরি করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L28
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একটি কৃষি মাঠে এঁটেল মাটি ও অতিরিক্ত বৃষ্টিপাত প্রবণ এলাকার ওপরে ওভারল্যাপ হওয়া কমন অংশটুকু বের করতে কোন টুলটি ব্যবহার করবেন?', '["Union", "Intersect", "Clip only", "Buffer"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ইউনিয়ন (Union) টুলের আউটপুট ম্যাপে কোন কোন অংশ সংরক্ষিত থাকে?', '["কেবল কমন বা ওভারল্যাপড অংশ", "দুটি ইনপুট লেয়ারের সব জ্যামিতিক অংশ ও তথ্য একসাথে মিলে যায়", "কোনো অংশই থাকে না", "শুধু পয়েন্ট ডাটা"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ইন্টারসেক্ট টুলের পর আউটপুটের অ্যাট্রিবিউট টেবিলে কোন তথ্যগুলো পাওয়া যায়?', '["কেবল প্রথম লেয়ারের কলাম", "উভয় ইনপুট লেয়ারের কলাম বা বৈশিষ্ট্যের সমষ্টি", "কোনো কলাম থাকে না", "ডিফল্ট কলাম"]'::jsonb, 1);


  -- Lesson 29: Spatial Joins (Aggregating Data)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m6_id, '29. Spatial Joins: Point in Polygon', 'spatial-joins', 4, 
  $markdown$
# Lesson 29: Spatial Joins: Point in Polygon

আমরা মডিউল ৩-এ সাধারণ টেবিল জয়েন শিখেছিলাম যেখানে একটি কমন আইডি কলাম দরকার হতো। কিন্তু ধরুন, আপনার কাছে ১০০০টি গভীর নলকূপের জিপিএস পয়েন্ট আছে এবং বাংলাদেশের উপজেলার সীমানা পলিগন ম্যাপ আছে। আপনি জানতে চান কোন উপজেলার অধীনে কয়টি নলকূপ পড়েছে।

নলকূপের পয়েন্ট ফাইলে কোনো "উপজেলা আইডি" লেখা নেই। তাহলে কীভাবে মেলাবেন? উত্তর হলো: **Spatial Join** বা স্থানিক সংযোগ।

[IMAGE: Spatial Join Point in Polygon Concept. Caption: কীভাবে পলিগনের সীমানার ভেতরে থাকা পয়েন্টগুলোর অবস্থান বিশ্লেষণ করে টেবিল দুটিকে লিঙ্ক করা হয় তার উদাহরণ।]

### স্থানিক অবস্থানই আপনার কমন কী (Spatial Location as the Key):
এখানে কোনো কলামের মিলের প্রয়োজন নেই। সফটওয়্যার পয়েন্টটির স্থানিক অবস্থান (Latitude/Longitude) দেখে স্বয়ংক্রিয়ভাবে হিসাব করে যে পয়েন্টটি কোন উপজেলার সীমানার ভেতরে পড়েছে।
- **Point in Polygon:** পয়েন্টগুলোর ওপর উপজেলার ডেটা নিয়ে আসা।
- **Polygon to Point:** উপজেলার সীমানার ভেতরে মোট কতগুলো পয়েন্ট আছে তা কাউন্ট করা।

👉 **বাস্তব প্রজেক্ট:** চরাঞ্চলের খামারিদের ডেইরি ফার্মের পয়েন্ট ডেটার সাথে বন্যার ঝুঁকি সীমানা ম্যাপ স্থানিকভাবে জয়েন করে সহজেই বের করা যায় কোন কোন খামার বন্যা এলাকার ভেতরে অবস্থিত!

### End of Lesson Summary
১. স্পেশিয়াল জয়েন স্থানিক অবস্থানের ওপর ভিত্তি করে দুটি টেবিলের তথ্য সংযুক্ত করে।
২. পয়েন্ট ও পলিগনের মধ্যকার ভৌগোলিক সম্পর্ক স্থাপনে এটি সেরা টুল।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L29
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কোনো কমন কলাম ছাড়া কেবল স্থানিক অবস্থানের ওপর ভিত্তি করে ডেটা লিঙ্ক করার প্রক্রিয়াকে কী বলে?', '["Table Join", "Spatial Join", "Clip Join", "Index Overlap"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একটি উপজেলার পলিগন ম্যাপের ভেতরে কতগুলো সয়েল স্যাম্পল পয়েন্ট পড়েছে তা গণনা করতে কোনটি ব্যবহার করবেন?', '["Buffer Tool", "Spatial Join (polygon overlay count)", "Excel VLOOKUP", "Label annotation"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'স্পেশিয়াল জয়েন করতে নিচের কোনটি আবশ্যক?', '["উভয় ফাইলে একই জেলা কোড থাকতে হবে", "উভয় ফাইল একই প্রজেকশন বা সঠিক ভৌগোলিক অবস্থানে ওভারল্যাপ থাকতে হবে", "ইন্টারনেট কানেকশন", "এক্সেলে ম্যাক্রো অন থাকা"]'::jsonb, 1);


  -- Lesson 30: Measuring Distance, Area, and Calculating Geometry
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m6_id, '30. Measuring Distance, Area, and Calculating Geometry', 'calculate-geometry', 5, 
  $markdown$
# Lesson 30: Measuring Distance, Area, and Calculating Geometry

মডিউল ৬-এর শেষ লেসনে আজ আমরা শিখব কীভাবে জ্যামিতির সাহায্যে সরাসরি ক্ষেত্রফল এবং দূরত্ব পরিমাপ করা যায়।

গবেষণায় প্রায়ই প্রশ্নের মুখোমুখি হতে হয়—"আপনার এই প্রজেক্টের মোট আবাদি জমির ক্ষেত্রফল কত হেক্টর?" কিংবা "সেচ নালাটির মোট দৈর্ঘ্য কত মিটার?"

[IMAGE: Calculate Geometry Attributes Menu. Caption: ArcGIS Pro এর Calculate Geometry Attributes ডায়ালগ বক্স যেখানে Area এবং Length হিসাব করার কলাম সিলেক্ট করা হচ্ছে।]

### Calculate Geometry (জ্যামিতি গণনা)
অ্যাট্রিবিউট টেবিলে নতুন ফিল্ড যোগ করার পর আমরা সহজেই সফটওয়্যারকে দিয়ে জ্যামিতিক পরিমাপ গণনা করতে পারি:
- **Area (ক্ষেত্রফল):** পলিগন লেয়ারের জন্য (যেমন: একর, হেক্টর, বর্গমিটার)।
- **Length (দৈর্ঘ্য):** লাইন লেয়ারের জন্য (যেমন: মিটার, কিলোমিটার)।
- **Centroid (কেন্দ্রবিন্দু স্থানাঙ্ক):** পলিগনের মাঝখানের এক্স ও ওয়াই স্থানাঙ্ক।

👉 **বাস্তব প্র্যাকটিস:** টেবিলে নতুন ফিল্ড নিন `Area_Hectares` (টাইপ: Double) > কলামে রাইট ক্লিক করুন > `Calculate Geometry` সিলেক্ট করুন > Property তে `Area` এবং Area Unit এ `Hectares` সিলেক্ট করে ওকে দিন!

### End of Lesson Summary
১. ক্যালকুলেট জিওমেট্রি ব্যবহার করে ভেক্টর ম্যাপ থেকে সরাসরি দৈর্ঘ্য ও ক্ষেত্রফল পরিমাপ করা যায়।
২. নিখুঁত পরিমাপের জন্য ম্যাপের Projected Coordinate System (যেমন UTM/BTM) থাকা বাধ্যতামূলক।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L30
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কোন পলিগনের মোট ক্ষেত্রফল হেক্টরে বের করতে টেবিলে রাইট ক্লিক করে কোন অপশনটি বেছে নেবেন?', '["Field Calculator", "Calculate Geometry", "Add Join", "Sort Ascending"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একটি নদীর মোট প্রবহমান দৈর্ঘ্য কিলোমিটারে হিসাব করার জন্য কোন জ্যামিতিক বৈশিষ্ট্যটি সিলেক্ট করতে হবে?', '["Area", "Length (Geodesic/Planar)", "Perimeter", "Centroid X"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ক্যালকুলেট জিওমেট্রি করার সময় যদি ক্ষেত্রফলের মান সবগুলো ০ (শূন্য) দেখায়, তবে সমস্যাটি কোথায় হতে পারে?', '["ম্যাপটি ডিলিট হয়ে গেছে", "ম্যাপ লেয়ারটি Geographic (GCS/Degree) সিস্টেমে আছে যা মিটার গণনা করতে পারে না", "ল্যাপটপ হ্যাং করেছে", "সফটওয়্যার আপডেট নেই"]'::jsonb, 1);

  -- ================================================================================================
  -- MODULE 7: AGRICULTURE GIS APPLICATIONS: REAL-WORLD SCENARIOS
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gis_cid, 'Module 7: Agriculture GIS Applications & Suitability', 'agri-gis-suitability', 7, 'Solve real-world agricultural problems: soil suitability, land use classification, and flood risk.')
  RETURNING id INTO m7_id;

  -- Lesson 31: Land Use & Land Cover (LULC) Mapping
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m7_id, '31. Crop Type Classification & Land Use Land Cover (LULC) Analysis', 'lulc-mapping', 1, 
  $markdown$
# Module Overview
এই মডিউলে আমরা সরাসরি এগ্রিকালচার এবং আমাদের দেশীয় বাস্তব কৃষি ক্ষেত্রে জিআইএস প্রয়োগ করার কেস স্টাডিগুলো সমাধান করব। ল্যান্ড কভার ক্লাস, মাটির উপযুক্ততা বিশ্লেষণ এবং বন্যার ক্ষয়ক্ষতি মানচিত্র তৈরি করা শিখব।

# Lesson 31: Crop Type Classification & Land Use Land Cover (LULC) Analysis

গবেষক এবং কৃষি নীতি নির্ধারকদের জন্য প্রথম বড় প্রশ্ন হলো—"আমাদের মোট জমির কত শতাংশে বনভূমি, কত শতাংশে আবাদি জমি আর কত শতাংশে ঘরবাড়ি বা শহর রয়েছে?"

এই বন্টন জানার বৈজ্ঞানিক পদ্ধতিকে বলা হয় **LULC (Land Use Land Cover) Mapping**।

[IMAGE: LULC Map Bangladesh Example. Caption: বাংলাদেশের একটি উপজেলার স্যাটেলাইট ইমেজ ভিত্তিক আবাদি জমি, জলভাগ, বনভূমি এবং বসতি এলাকার ম্যাপ।]

### Land Cover বনাম Land Use:
- **Land Cover (ভূমি আচ্ছাদন):** ভূপৃষ্ঠের ওপরে প্রাকৃতিকভাবে কী রয়েছে তা দেখায়। যেমন: পানি, সবুজ গাছপালা, বরফ।
- **Land Use (ভূমি ব্যবহার):** মানুষ সেই ল্যান্ড কভারকে কীভাবে ব্যবহার করছে। যেমন: পানির ওপর মাছ চাষ করা (মৎস্য খামার), বা সমতল জমিতে ধান চাষ করা (আবাদি জমি)।

👉 **কৃষিবিদের প্র্যাকটিস:** ল্যান্ড কভার ম্যাপ তৈরি করার মাধ্যমে আমরা দেখতে পারি গত ১০ বছরে দেশের বনভূমি কেটে বসতি স্থাপন করায় আমাদের মোট আবাদি জমির পরিমাণ কত একর কমে গেছে।

### End of Lesson Summary
১. LULC মানচিত্র ভূমি ব্যবহার ও প্রাকৃতিকভাবে ভূপৃষ্ঠের উপরিভাগের আচ্ছাদন প্রদর্শন করে।
২. এটি জলবায়ু পরিবর্তন ও কৃষি নীতি নির্ধারণের একটি প্রাথমিক টুল।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L31
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ভূপৃষ্ঠের ওপরে প্রাকৃতিকভাবে কী ধরনের উপাদান বা বনাঞ্চল রয়েছে তা জানা যায় কোন ম্যাপ থেকে?', '["Soil Texture Map", "Land Cover Map", "Road Network Map", "Cadastral Mauza Map"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'LULC পরিবর্তনের মাধ্যমে নিচের কোনটি নির্ণয় করা সম্ভব?', '["মাটির গভীরতা", "ফসলের জিনগত পরিবর্তন", "গত এক দশকে আবাদি জমি কমে বসতভিটা বৃদ্ধির হার", "বাষ্পীভবনের হার"]'::jsonb, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ল্যান্ড কভার ক্লাসিফিকেশনে ফসল ক্ষেত্র ও বনাঞ্চলকে ম্যাপে সাধারণত কোন রঙে দেখানো হয়?', '["লাল", "সবুজ", "হলুদ", "নীল"]'::jsonb, 1);


  -- Lesson 32: Soil Suitability Analysis (Multi-Criteria Overlay)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m7_id, '32. Soil Suitability Mapping: Combining pH, Texture & Slope', 'soil-suitability-overlay', 2, 
  $markdown$
# Lesson 32: Soil Suitability Mapping: Combining pH, Texture & Slope

বাস্তব কৃষি গবেষণার অন্যতম সেরা চমৎকার একটি কাজ হলো **Multi-Criteria Land Suitability Analysis** বা ফসল চাষের উপযুক্ত জমি নির্বাচন।

মনে করুন, আমরা গম চাষের জন্য সবচেয়ে সেরা উপযুক্ত এলাকা খুঁজে বের করতে চাই। বিজ্ঞানীদের মতে, গম চাষের জন্য ৩টি শর্ত মিলতে হবে:
১. মাটির পিএইচ (pH) হতে হবে ৬.০ থেকে ৭.০ (হালকা অম্লীয় থেকে নিরপেক্ষ)।
২. মাটির টেক্সচার হতে হবে দোআঁশ (Loamy)।
৩. জমির ঢাল হতে হবে খুব কম (৫ ডিগ্রির নিচে সমতল জমি)।

[IMAGE: Suitability Overlay Diagram. Caption: পিএইচ, টেক্সচার ও ঢালের তিনটি আলাদা ম্যাপকে ওভারলে করে চূড়ান্ত গম চাষের উপযুক্ততার ম্যাপ তৈরির ফ্লোচার্ট।]

### কীভাবে কাজ করবেন?
১. প্রথমে ৩টি আলাদা ম্যাপ বা লেয়ার তৈরি করুন: pH Layer, Texture Layer, এবং Slope Layer।
২. প্রতিটিতে উপযুক্ত স্থানগুলোকে '1' এবং অনুপযুক্ত স্থানগুলোকে '0' দিয়ে রি-ক্লাসিফাই করুন।
৩. এরপর Geoprocessing টুল **Intersect** অথবা **Raster Calculator** ব্যবহার করে ৩টি লেয়ারকে গুণ বা একত্র করুন:
   `Final Suitability = pH_Suitable * Texture_Suitable * Slope_Suitable`
৪. ফলাফল ম্যাপে কেবল সেই স্থানগুলোই '1' বা সবুজ রঙে হাইলাইট হবে যেখানে তিনটি শর্তই একসাথে মিলেছে!

### End of Lesson Summary
১. ফসল উপযুক্ততা ম্যাপিং-এ একাধিক মাটি ও জলবায়ুগত শর্তকে একসাথে ওভারলে করে সিদ্ধান্ত নেওয়া হয়।
২. উপযুক্ততা ম্যাপ মাঠ পর্যায়ে ফলন বাড়াতে ও সারের সঠিক ব্যবহারে চাষিদের গাইড করতে পারে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L32
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ফসল উপযুক্ততা নির্ধারণের জন্য একাধিক মানচিত্রের কন্ডিশন একসাথে মেলানোর প্রক্রিয়াকে কী বলে?', '["Vector Clipping", "Multi-Criteria Spatial Overlay", "Georeferencing Step", "Data Join Wizard"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'গম চাষের উপযুক্ততা বের করতে Soil_pH = 1 এবং Slope = 0 হলে গুণফল উপযুক্ততা মান কত হবে?', '["১ (সম্পূর্ণ উপযুক্ত)", "০ (অনুপযুক্ত)", "২ (অতিরিক্ত উপযুক্ত)", "০.৫ (আংশিক উপযুক্ত)"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'উপযুক্ততা বিশ্লেষণে ঢাল (Slope) কন্ডিশনটি কোথা থেকে বের করা হয়?', '["রাস্তাঘাট ম্যাপ থেকে", "ডিজিটাল এলিভেশন মডেল (DEM) থেকে", "বৃষ্টিপাতের টেবিল থেকে", "নদীর সীমানা থেকে"]'::jsonb, 1);


  -- Lesson 33: Irrigation Channel Planning and Watersheds
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m7_id, '33. Irrigation Network Planning & Flow Path Analysis', 'irrigation-watershed', 3, 
  $markdown$
# Lesson 33: Irrigation Network Planning & Flow Path Analysis

কৃষি জমিতে ফসল উৎপাদনের প্রধান প্রাণ হলো পানি। কিন্তু অসমান ভূপৃষ্ঠের কারণে নালা বা সেচ ক্যানেল তৈরি করার পরেও পানি অনেক সময় মাঠের শেষ প্রান্ত পর্যন্ত পৌঁছায় না কারণ পানি সবসময় নিচের দিকে গড়ায়।

আজ আমরা শিখব কীভাবে ডিজিটাল এলিভেশন মডেল (DEM) ব্যবহার করে পানির গতিপথ এবং সেচ নালার সঠিক রুট পরিকল্পনা করতে হয়।

[IMAGE: Hydrology Flow Direction DEM. Caption: DEM থেকে কীভাবে পানির প্রবাহের দিক (Flow Direction) এবং প্রাকৃতিক পানি নিষ্কাশন ক্যানেল (Drainage Lines) ম্যাপ করা হয়।]

### ৩টি হাইড্রোলজি প্রসেসিং ধাপ:
১. **Fill (গর্ত পূরণ):** DEM এর ভেতরে থাকা অপ্রয়োজনীয় ক্ষতিকর স্পাইক বা কৃত্রিম গর্ত পূরণ করা।
২. **Flow Direction (প্রবাহের দিক):** একটি পিক্সেলের চারপাশে থাকা ৮টি প্রতিবেশীর মধ্যে কোন দিকে ঢাল সবচেয়ে বেশি তা হিসাব করে পানির গতি নির্ধারণ করা।
৩. **Flow Accumulation (প্রবাহ পুঞ্জীভবন):** প্রতিটি পিক্সেলের ওপর দিয়ে কতগুলো পিক্সেলের পানি প্রবাহিত হয়ে যাচ্ছে তা গণনা করা। যেখানে অনেক পিক্সেল একত্র হবে, সেখানেই প্রাকৃতিক বড় সেচ নালা বা খাল গঠিত হবে!

👉 **বাস্তব ব্যবহার:** এই অ্যানালিসিস করে আমরা মাঠে না গিয়েই নিখুঁতভাবে ড্রেনেজ সিস্টেমের ম্যাপ এবং নদীর গতিপথ ম্যাপ করে ফেলতে পারি!

### End of Lesson Summary
১. হাইড্রোলজিক্যাল অ্যানালিসিসের মাধ্যমে ভূপৃষ্ঠের পানির প্রবাহ এবং খালের রুট ম্যাপ করা হয়।
২. সেচ ক্যানেল বসানোর পূর্বে মাটির ঢাল ও ফ্লো ডিরেকশন চেক করা অত্যন্ত জরুরি।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L33
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'হাইড্রোলজিক্যাল বিশ্লেষণে পানির প্রবাহের দিক বের করতে কোন প্রসেসটি চালানো হয়?', '["Buffer Calculation", "Flow Direction Analysis", "Georeferencing Image", "Attribute Linkage"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'পানি প্রবাহের দিক বিশ্লেষণের পূর্বে DEM এর কৃত্রিম ত্রুটি বা গর্ত দূর করতে কোন টুলটি ব্যবহার করতে হয়?', '["Clip Tool", "Fill Tool", "Slope Tool", "Aspect Tool"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'নিচের কোনটি সেচ ক্যানেল বসানোর জন্য সবচেয়ে গুরুত্বপূর্ণ স্পেশিয়াল ফ্যাক্টর?', '["জমির মালিকের বয়স", "ডিজিটাল এলিভেশন মডেল (উচ্চতা ও ঢাল)", "রাস্তাঘাটের ফন্ট সাইজ", "জেলার সীমানার রং"]'::jsonb, 1);


  -- Lesson 34: Flood Inundation Risk Mapping
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m7_id, '34. Flood Inundation Risk Mapping', 'flood-inundation-risk', 4, 
  $markdown$
# Lesson 34: Flood Inundation Risk Mapping: Delineating Char Land Vulnerability

বাংলাদেশ একটি বন্যাপ্রবণ ব-দ্বীপ। প্রতি বছর বর্ষাকালে দেশের উত্তর ও পূর্বাঞ্চলে বিস্তীর্ণ ফসল জমি তলিয়ে যায়। বিশেষ করে কুড়িগ্রাম ও সিরাজগঞ্জের চরাঞ্চলের হাজার হাজার হেক্টর ফসল নষ্ট হয়।

আজকে আমরা শিখব কীভাবে মাটির উচ্চতার ম্যাপ (DEM) এবং নদীর দূরত্বের বাফার জোন ব্যবহার করে একটি সরল কিন্তু অত্যন্ত কাজের **Flood Risk Map (বন্যা ঝুঁকি মানচিত্র)** তৈরি করতে হয়।

[IMAGE: Flood Inundation Vulnerability Map Kurigram. Caption: কুড়িগ্রাম জেলার একটি বন্যা প্লাবন ম্যাপ - নদী তীরবর্তী নিম্নভূমিগুলো লাল রঙে (উচ্চ ঝুঁকিপূর্ণ) এবং উঁচু জমিগুলো সবুজ রঙে প্রদর্শিত হচ্ছে।]

### বন্যার ঝুঁকির ম্যাট্রিক্স (Flood Vulnerability Matrix):
- **উচ্চ ঝুঁকি (High Risk):** উচ্চতা সমুদ্রপৃষ্ঠ থেকে ৩ মিটারের নিচে এবং প্রধান নদীর ২ কিলোমিটারের মধ্যে অবস্থিত এলাকা।
- **মাঝারি ঝুঁকি (Medium Risk):** উচ্চতা ৩ থেকে ৬ মিটার এবং নদীর ৩ কিলোমিটারের ভেতরের এলাকা।
- **কম ঝুঁকি (Low Risk):** উচ্চতা ৬ মিটারের ওপরে অবস্থিত উঁচু সমতল জমি।

👉 **বাস্তব প্রয়োগ:** এই ম্যাপ তৈরি করার মাধ্যমে আপনি স্থানীয় কৃষি অফিসারকে সাহায্য করতে পারেন বন্যাকালীন কোন ফসল চাষ এড়ানো উচিত এবং কোন উঁচু চরে বীজতলা তৈরি করা নিরাপদ তা নির্ধারণে।

### End of Lesson Summary
১. বন্যা ঝুঁকি মানচিত্র তৈরিতে মাটির উচ্চতা (DEM) ও নদীর নৈকট্য (Buffer) মূল ফ্যাক্টর।
২. এটি দুর্যোগকালীন ফসলের ক্ষয়ক্ষতি কমাতে অত্যন্ত কার্যকরী সিদ্ধান্ত গ্রহণের হাতিয়ার।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L34
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'চরাঞ্চলের কোন কোন এলাকা বেশি বন্যা ঝুঁকির মুখে রয়েছে তা বের করতে কোন দুটি ম্যাপ লেয়ারের সংযোগ প্রসেস করবেন?', '["মাটির পিএইচ ম্যাপ ও রাস্তার ম্যাপ", "উচ্চতা ম্যাপ (DEM) ও নদী থেকে দূরত্বের বাফার ম্যাপ", "চা বাগানের ম্যাপ ও বন সীমানা ম্যাপ", "জেলার জনসংখ্যা ও ফসল উৎপাদন ম্যাপ"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'সমুদ্রপৃষ্ঠ থেকে অত্যন্ত কম উচ্চতা এবং নদীর একদম কাছের এলাকাটি কোন বন্যা ঝুঁকি জোনে পড়বে?', '["কম ঝুঁকি অঞ্চল", "উচ্চ ঝুঁকি অঞ্চল (High Risk Zone)", "ঝুঁকিবিহীন অঞ্চল", "জানিনা"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'বন্যা ঝুঁকি ম্যাপ তৈরি করে মাঠ পর্যায়ে কৃষি সম্প্রসারণ কর্মীরা কীভাবে চাষিদের সহায়তা করতে পারেন?', '["চাষিদের ল্যাপটপ কিনে দিয়ে", "বন্যার পানি সহ্য করতে পারে এমন ফসলের জাত বা নিরাপদ বীজতলা নির্বাচনের মাধ্যমে", "সার ডিলিট করে", "কোনো সহায়তা করা যায় না"]'::jsonb, 1);


  -- Lesson 35: Yield Density and Disease Outbreak Hotspots
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m7_id, '35. Yield Density Mapping & Point Density Analysis of Disease Outbreaks', 'yield-disease-hotspots', 5, 
  $markdown$
# Lesson 35: Yield Density Mapping & Point Density Analysis of Disease Outbreaks

মডিউলের শেষ লেসনে আজ আমরা শিখব কীভাবে ফসলের রোগবালাই বা কীটপতঙ্গের আক্রমণ মানচিত্রে চিহ্নিত করে তার হটস্পট বা উচ্চ ঘনত্বের এলাকা খুঁজে বের করতে হয়।

মনে করুন, আপনার উপজেলায় ৫০টি ফসল জমিতে হঠাৎ ব্লাস্ট রোগ (Blast Disease) ছড়ানোর খবর পাওয়া গেছে এবং মাঠ পর্যায়ে কর্মীরা আক্রান্ত জমির স্থানাঙ্ক আপনার জিপিএস ফাইলে যুক্ত করেছেন।

[IMAGE: Kernel Density Outbreak Map. Caption: আক্রান্ত পয়েন্ট ডেটা থেকে তৈরি কার্নেল ডেনসিটি (Kernel Density) হটস্পট মানচিত্র যেখানে লাল রঙ দিয়ে রোগের মূল কেন্দ্র বোঝানো হচ্ছে।]

### Point Density (বিন্দু ঘনত্ব বিশ্লেষণ)
বিন্দু বা পয়েন্ট ম্যাপ দেখে অনেক সময় বোঝা যায় না কোন এলাকায় রোগের তীব্রতা সবচেয়ে বেশি। **Kernel Density** বা পয়েন্ট ডেনসিটি টুলটি আক্রান্ত পয়েন্টগুলোর চারপাশে একটি মসৃণ রঙিন রাস্টার ম্যাপ তৈরি করে:
- **Red Zone (হটস্পট):** যেখানে অল্প জায়গার মধ্যে অনেক বেশি রোগের সংক্রমণ ঘটেছে।
- **Green/Blue Zone:** যেখানে সংক্রমণ অনেক দূরে দূরে বা খুব কম।

👉 **বাস্তব কৃষি প্রয়োগ:** হটস্পট ম্যাপ তৈরি করার পর আক্রান্ত এলাকার চারপাশে দ্রুত স্প্রে করার জন্য দমকল বা কীটনাশক দলের রুট প্ল্যান করা সম্ভব!

### End of Lesson Summary
১. বিন্দু ঘনত্ব বিশ্লেষণের মাধ্যমে ম্যাপে ফসলের রোগ বা পোকার আক্রমণের হটস্পট চিহ্নিত করা যায়।
২. হটস্পট ম্যাপ কৃষিতে রোগ নিয়ন্ত্রণে তাৎক্ষণিক বৈজ্ঞানিক সিদ্ধান্ত গ্রহণে সাহায্য করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L35
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'রোগাক্রান্ত পয়েন্ট ডেটার ওপর ভিত্তি করে আক্রান্তের প্রধান কেন্দ্র বা হটস্পট খুঁজে বের করার টুল কোনটি?', '["Clip Tool", "Kernel/Point Density Analysis", "Georeferencing Dialog", "Table Join Link"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'পয়েন্ট ডেনসিটি ম্যাপের আউটপুট সাধারণত কোন ডেটা মডেলে পাওয়া যায়?', '["ভেক্টর লাইন লেয়ার", "রাস্টার ডেনসিটি গ্রিড (Raster Grid)", "নন-স্পেশিয়াল টেক্সট ফাইল", "এক্সেল স্প্রেডশিট"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কেন একক রোগাক্রান্ত বিন্দু ম্যাপের চেয়ে ডেনসিটি হটস্পট ম্যাপ বেশি কার্যকরী?', '["কারণ এটি দেখতে রঙিন", "কারণ এটি ঘন বসতি বা আক্রমণের সঠিক তীব্রতার ক্ষেত্রফল স্পষ্ট করে", "কারণ এটি ফাইলের আকার ছোট করে", "কোনোটিই নয়"]'::jsonb, 1);

  -- ================================================================================================
  -- MODULE 8: INTRODUCTION TO REMOTE SENSING & SATELLITE IMAGERY
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gis_cid, 'Module 8: Remote Sensing & Satellite Imagery', 'remote-sensing-ndvi', 8, 'Understand remote sensing physics, satellite platforms, band combinations, and NDVI calculation.')
  RETURNING id INTO m8_id;

  -- Lesson 36: Remote Sensing Basics (Bands and Signatures)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m8_id, '36. Remote Sensing Basics: Electromagnetic Spectrum & Spectral Signatures', 'remote-sensing-basics', 1, 
  $markdown$
# Module Overview
এই মডিউলে আমরা রিমোট সেন্সিং বা দূর অনুধাবনের মৌলিক তত্ত্ব জানব। কীভাবে স্যাটেলাইট মহাকাশ থেকে ফসলের স্বাস্থ্য পরিমাপ করে, ল্যান্ডস্যাট ও সেন্টিনেল ডাটা ডাউনলোড করতে হয়, রঙের ব্যান্ড কম্বিনেশন এবং বহুল পরিচিত ভেজিটেশন ইনডেক্স (NDVI) হিসাব করা শিখব।

# Lesson 36: Remote Sensing Basics: Electromagnetic Spectrum & Spectral Signatures

রিমোট সেন্সিং (Remote Sensing) হলো কোনো বস্তুকে স্পর্শ না করে দূর থেকে (সাধারণত স্যাটেলাইট বা বিমান থেকে) সেটির তথ্য সংগ্রহ করার বিজ্ঞান।

কিন্তু কীভাবে স্যাটেলাইট ধানের চারা আর বেলে মাটির পার্থক্য বুঝতে পারে? উত্তর লুকিয়ে আছে **Spectral Signature** বা বর্ণালীর প্রতিফলনের মধ্যে।

[IMAGE: Spectral Signature Vegetation Soil Water. Caption: উদ্ভিদ, মাটি ও পানির বিভিন্ন ব্যান্ডে আলোর প্রতিফলনের শতকরা হারের স্পেকট্রাল সিগনেচার গ্রাফ।]

### আলোর বর্ণালী ও উদ্ভিদের প্রতিফলন:
১. **Visible Light (দৃশ্যমান আলো):** আমাদের চোখ কেবল লাল, সবুজ ও নীল আলো দেখতে পায়। সবুজ পাতা লাল এবং নীল আলো শোষণ করে সালোকসংশ্লেষণ প্রক্রিয়ার জন্য, আর সবুজ আলো প্রতিফলিত করে (তাই আমরা পাতাকে সবুজ দেখি)।
২. **Near-Infrared (NIR - অবলোহিত আলো):** সুস্থ উদ্ভিদের পাতার ভেতরের স্পঞ্জি মেসোফিল কোষগুলো প্রচুর পরিমাণে এনআইআর আলো প্রতিফলিত করে, যা আমাদের চোখ সরাসরি দেখতে পায় না। কিন্তু স্যাটেলাইটের বিশেষ ক্যামেরা এই আলো রেকর্ড করতে পারে!

👉 **রিমোট সেন্সিং এর মূল রহস্য:** পাতা যত বেশি সুস্থ হবে, সে তত বেশি NIR আলো প্রতিফলিত করবে এবং তত বেশি লাল আলো শোষণ করবে। পাতায় রোগ ধরলে এই রিফ্লেক্টেন্স প্যাটার্ন ওলটপালট হয়ে যায়!

### End of Lesson Summary
১. রিমোট সেন্সিং দূর থেকে আলোর প্রতিফলনের মাধ্যমে ভূপৃষ্ঠের বৈশিষ্ট্য পরিমাপ করে।
২. সুস্থ পাতা দৃশ্যমান লাল আলো শোষণ করে এবং অবলোহিত (NIR) আলো প্রবলভাবে প্রতিফলিত করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L36
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'সুস্থ পাতা সালোকসংশ্লেষণ প্রক্রিয়ার সময় কোন আলোটি বেশি শোষণ করে?', '["Near-Infrared (NIR)", "Red (লাল আলো)", "Green (সবুজ আলো)", "X-Ray"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'উদ্ভিদের পাতার ভেতরের কোষের সুস্থতা ও ক্লোরোফিল থেকে কোন তরঙ্গদৈর্ঘ্যের আলো সবচেয়ে বেশি প্রতিফলিত হয়?', '["নীল আলো", "অবলোহিত আলো বা Near-Infrared (NIR)", "অতিবেগুনি রশ্মি", "লাল আলো"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'স্পেকট্রাল সিগনেচার (Spectral Signature) বলতে কী বোঝায়?', '["স্যাটেলাইটের একটি নাম", "ভিন্ন ভিন্ন বস্তুর দ্বারা ভিন্ন ভিন্ন আলোর ব্যান্ডের প্রতিফলন বা শোষণের অনন্য আচরণ", "ম্যাপ প্রিন্ট করার স্বাক্ষর", "ডিজিটাল ক্যামেরার লেন্স"]'::jsonb, 1);


  -- Lesson 37: Satellite Data Sources (Landsat and Sentinel)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m8_id, '37. Satellite Platforms: Landsat vs Sentinel-2', 'landsat-vs-sentinel', 2, 
  $markdown$
# Lesson 37: Satellite Platforms: Landsat vs Sentinel-2

গবেষক হিসেবে ম্যাপ তৈরি করতে আমাদের দরকার আসল স্যাটেলাইট ইমেজ। আনন্দের বিষয় হলো, বিশ্বের দুটি সেরা ফ্রি স্যাটেলাইট প্রোগ্রাম আমাদের ফ্রিতে ডেটা দিয়ে আসছে।

আজ আমরা জানব এগ্রিকালচার গবেষণায় বহুল ব্যবহৃত **Landsat** এবং **Sentinel-2** এর পার্থক্য।

[IMAGE: USGS EarthExplorer Search Portal. Caption: USGS EarthExplorer ডেটা ডাউনলোড পোর্টাল থেকে কীভাবে বাংলাদেশের ওপরে ক্লাউড কাভার বা মেঘমুক্ত ডেটা সার্চ ও ফিল্টার করতে হয়।]

### তুলনামূলক সারণী:
- **Landsat (নাসা/ইউএসজিএস - আমেরিকা):**
  - **Resolution:** ৩০ মিটার (প্রতিটি পিক্সেল ৩০m x ৩০m এলাকা)।
  - **Temporal Resolution:** ১৬ দিন পর পর একই জায়গার ছবি নেয়।
  - **ইতিহাস:** এর ডেটা ১৯৭২ সাল থেকে পাওয়া যায়, তাই দীর্ঘমেয়াদী জলবায়ু পরিবর্তন বা বনায়ন গবেষণায় এটি অপরিহার্য।
  
- **Sentinel-2 (ইউরোপিয়ান স্পেস এজেন্সি - ইএসএ):**
  - **Resolution:** ১০ মিটার (১০m x ১০m পিক্সেল, যা ল্যান্ডস্যাটের চেয়ে ৩ গুণ বেশি নিখুঁত)।
  - **Temporal Resolution:** ৫ দিন পর পর ছবি নেয়।
  - **ব্যবহার:** ফসলের তাৎক্ষণিক রোগ ও সাপ্তাহিক বৃদ্ধি ট্র্যাকিং এর জন্য এটি অত্যন্ত সেরা!

👉 **কোথা থেকে ডাউনলোড করবেন?** সবচেয়ে সহজ পোর্টাল হলো **USGS EarthExplorer** অথবা **Copernicus Data Space Ecosystem**।

### End of Lesson Summary
১. ল্যান্ডস্যাট ৩০ মিটার রেজোলিউশনের ঐতিহাসিক গবেষণার জন্য সেরা।
২. সেন্টিনেল-২ ১০ মিটার রেজোলিউশনের উচ্চ স্থানিক সূক্ষ্মতার এগ্রি-রিসার্চের জন্য দারুণ উপযোগী।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L37
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'Sentinel-2 স্যাটেলাইট ইমেজের মাল্টি-স্পেক্ট্রাল প্রধান ব্যান্ডগুলোর স্থানিক রেজোলিউশন কত মিটার?', '["৩০ মিটার", "১০ মিটার", "১০০ মিটার", "১ মিটার"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'USGS EarthExplorer পোর্টাল থেকে প্রধানত কোন স্যাটেলাইট সিরিজের প্রাচীন থেকে আধুনিক ছবি ফ্রিতে ডাউনলোড করা যায়?', '["Landsat Series", "QuickBird (commercial)", "MODIS basic grid", "SPOT series"]'::jsonb, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ফসলের সাপ্তাহিক বৃদ্ধির হার ও তাৎক্ষণিক রোগবালাই ট্র্যাক করতে ল্যান্ডস্যাটের চেয়ে সেন্টিনেল-২ কেন বেশি উপযোগী?', '["কারণ সেন্টিনেল-২ ম্যাপে মেঘ দেখা যায় না", "কারণ এর স্থানিক রেজোলিউশন (১০মি.) অনেক বেশি এবং প্রতি ৫ দিন পর পর রিভিজিট করে", "কারণ এটি দেখতে সুন্দর", "কোনোটিই নয়"]'::jsonb, 1);


  -- Lesson 38: Band Composites (True Color vs False Color Infrared)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m8_id, '38. Band Composites: True Color vs False Color Infrared', 'band-composites-rgb', 3, 
  $markdown$
# Lesson 38: Band Composites: True Color vs False Color Infrared

স্যাটেলাইট ইমেজগুলো যখন কম্পিউটার ফোল্ডারে ডাউনলোড করা হয়, তখন সেগুলো অনেকগুলো আলাদা রাস্টার ফাইল হিসেবে থাকে। একেকটি ফাইলকে বলা হয় একেকটি **Band (ব্যান্ড)**।

লাল আলো, সবুজ আলো, নীল আলো বা অবলোহিত আলো পৃথকভাবে ধারণ করা ফাইলগুলোকে আমরা একসাথে মেলালে সুন্দর রঙিন ছবি তৈরি হয়। একে বলে **Band Composite (RGB)**।

[IMAGE: True Color vs False Color Images. Caption: ট্রু কালার ব্যান্ড কম্বিনেশন (যা আমরা চোখ দিয়ে দেখি) বনাম ফল্স কালার ইনফ্রারেড কম্বিনেশন (যেখানে গাছপালা উজ্জ্বল লাল দেখায়) এর তুলনা।]

### ২টি বহুল ব্যবহৃত কম্বিনেশন:
১. **True Color Composite (RGB: 4, 3, 2 - Sentinel-2 এর জন্য):**
   - Red Band কে Red চ্যানেলে, Green কে Green এ এবং Blue কে Blue চ্যানেলে ম্যাপ করা হয়।
   - ফলাফল: সাধারণ মানুষের চোখ দিয়ে দেখা ছবির মতো (বন সবুজ দেখাবে, পানি নীল দেখাবে)।
   
২. **False Color Infrared (RGB: 8, 4, 3 - Sentinel-2 এর জন্য):**
   - Near-Infrared (Band 8) কে Red চ্যানেলে বসানো হয়।
   - ফলাফল: সমস্ত গাছপালা ও ফসল উজ্জ্বল লাল রঙে দেখাবে!
   - *সুবিধা:* স্বাস্থ্যকর উদ্ভিদগুলো গাড় লাল দেখাবে এবং রোগাক্রান্ত চারাগুলো কালচে লাল বা ধূসর দেখাবে, যা ফসলের সুস্বাস্থ্য নিখুঁতভাবে প্রকাশ করে।

👉 **বাস্তব প্র্যাকটিস:** ArcGIS Pro তে স্যাটেলাইট ইমেজের Layer Properties এ গিয়ে Symbology থেকে সহজেই ব্যান্ডের ক্রম পরিবর্তন করে `8, 4, 3` সেট করে ফল্স কালার ম্যাপ তৈরি করতে পারেন!

### End of Lesson Summary
১. ব্যান্ড কম্পোজিট হলো ভিন্ন ভিন্ন আলোর তরঙ্গদৈর্ঘ্যের ব্যান্ডকে লাল, সবুজ ও নীল (RGB) চ্যানেলে সাজিয়ে ছবি তৈরি করা।
২. ফল্স কালার ইনফ্রারেড (NIR, Red, Green) ফসলের ক্লোরোফিলের তারতম্য স্পষ্ট করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L38
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ফল্স কালার ইনফ্রারেড (False Color Infrared) ম্যাপে সুস্থ ফসল বা গাছপালা কোন রঙে ফুটে ওঠে?', '["সবুজ", "উজ্জ্বল লাল (Bright Red)", "নীল", "হলুদ"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'Sentinel-2 স্যাটেলাইটের জন্য ট্রু কালার (True Color) কম্বিনেশনের ব্যান্ডের ক্রম কোনটি?', '["Red=8, Green=4, Blue=3", "Red=4, Green=3, Blue=2", "Red=3, Green=2, Blue=1", "Red=11, Green=8, Blue=4"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কেন ফল্স কালার ইনফ্রারেড ম্যাপ এগ্রিকালচার ইমেজারিতে এত বেশি জনপ্রিয়?', '["কারণ এটি দেখতে আকর্ষণীয়", "কারণ এটি মেসোফিল কোষের অবলোহিত আলোর প্রতিচ্ছবি ব্যবহার করে ফসলের রোগ ও ক্লোরোফিল স্পষ্ট করে", "কারণ এটি ফাইল সাইজ কমায়", "জানিনা"]'::jsonb, 1);


  -- Lesson 39: Understanding NDVI (Vegetation Health Index)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m8_id, '39. Understanding NDVI: Measuring Vegetation Health from Space', 'ndvi-calculation-concept', 4, 
  $markdown$
# Lesson 39: Understanding NDVI: Measuring Vegetation Health from Space

রিমোট সেন্সিং-এর সেরা আবিষ্কারগুলোর একটি হলো **NDVI (Normalized Difference Vegetation Index)** বা ভেজিটেশন ইনডেক্স।

এটি মূলত একটি সংখ্যাবাচক সূচক যা স্যাটেলাইট ডেটা থেকে প্রতিটি পিক্সেলের জন্য উদ্ভিদের ঘনত্বের মান হিসাব করে।

[IMAGE: NDVI Map Green to Red. Caption: একটি চরাঞ্চলের NDVI মানচিত্র যেখানে সবুজ অংশগুলো সুস্থ ধানক্ষেত এবং লাল অংশগুলো বালুচর বা পানিসীমানা নির্দেশ করে।]

### NDVI এর গাণিতিক সূত্র:
$NDVI = (NIR - Red) / (NIR + Red)$

- **NIR (Near-Infrared):** ক্লোরোফিল দ্বারা প্রতিফলিত আলো।
- **Red (লাল আলো):** ক্লোরোফিল দ্বারা শোষিত আলো।

### NDVI মানের পরিসর (Index Values Range):
NDVI এর মান সবসময় **-1.0 থেকে +1.0** এর মধ্যে থাকে।
- **-1.0 থেকে 0:** পানি, নদী, বরফ বা মেঘ।
- **0 থেকে 0.2:** খালি বালি মাটি, শিলা বা রাস্তাঘাট।
- **0.2 থেকে 0.5:** বিরল ঘাস বা আংশিক রোগাক্রান্ত চারা।
- **0.5 থেকে 0.9:** অত্যন্ত সুস্থ, ঘন সবুজ ধান বা চা বাগান।

👉 **বাস্তব প্র্যাকটিস:** ArcGIS Pro তে `Raster Calculator` টুল ব্যবহার করে খুব সহজেই আপনি NDVI এর সূত্রটি টাইপ করে স্যাটেলাইট ইমেজ প্রসেস করতে পারেন!

### End of Lesson Summary
১. NDVI সূত্রটি হলো: $(NIR - Red) / (NIR + Red)$।
২. এর মান -১ থেকে +১ এর মধ্যে থাকে; ধনাত্মক উচ্চ মান সুস্থ উদ্ভিদের উপস্থিতি নিশ্চিত করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L39
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'NDVI এর গাণিতিক সূত্র কোনটি?', '["(Red - NIR) / (Red + NIR)", "(NIR - Red) / (NIR + Red)", "NIR * Red", "(Green - Red) / (Green + Red)"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'NDVI মানচিত্রের একটি পিক্সেলের মান যদি ০.৮৫ পাওয়া যায়, তবে সেই স্থানে কী থাকার সম্ভাবনা সবচেয়ে বেশি?', '["পুকুর বা নদী", "খালি বালি বা রাস্তা", "ঘন স্বাস্থ্যকর বনভূমি বা ফসল ক্ষেত", "মেঘলা আকাশ"]'::jsonb, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'NDVI সূচকের মান কত সীমার মধ্যে অবস্থান করে?', '["০ থেকে ১০০", "-১.০ থেকে +১.০", "-১০০ থেকে +১০০", "০ থেকে ১"]'::jsonb, 1);


  -- Lesson 40: Delineating Crop Drought or Stress using NDVI Map Interpretation
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m8_id, '40. Delineating Crop Drought or Stress using NDVI', 'delineating-crop-stress-ndvi', 5, 
  $markdown$
# Lesson 40: Delineating Crop Drought or Stress using NDVI

মডিউল ৮-এর শেষ লেসনে আজ আমরা শিখব কীভাবে তৈরি করা NDVI ম্যাপটি দিয়ে মাঠ পর্যায়ের একটি বড় কৃষি সমস্যা—**Drought (খরা)** এবং **Crop Stress (উদ্ভিদ স্ট্রেস)** সনাক্ত করা যায়।

ধরি, আপনার বরেন্দ্র অঞ্চলের আমন ধানের ক্ষেতে অনাবৃষ্টির কারণে চারাগুলো ঝিমিয়ে পড়ছে।

[IMAGE: Temporal NDVI Change Stress. Caption: একই মাঠের এক মাস আগের সুস্থ সবুজ NDVI বনাম অনাবৃষ্টির কারণে হলদেটে লালচে হয়ে যাওয়া NDVI এর তুলনামূলক দৃশ্য।]

### কীভাবে স্ট্রেস রি-ক্লাসিফাই করবেন?
আমরা জানি, সুস্থ ধানের NDVI সাধারণত ০.৬ এর ওপরে থাকে। যদি তা কমতে কমতে ০.৩ এ নেমে আসে, তবে বুঝতে হবে চারাগুলোতে পানির অভাব (Drought Stress) বা পোকার আক্রমণ ঘটেছে।
- **০.৬ এর বেশি:** Healthy Canopy
- **০.৪ থেকে ০.৬:** Moderate Stress
- **০.২ থেকে ০.৪:** High Stress (খরা বা আক্রান্ত আবাদ)
- **০.২ এর কম:** Non-vegetated

👉 **কৃষিবিদের প্র্যাকটিস:** এই বিশ্লেষণের মাধ্যমে উপজেলা কৃষি কর্মকর্তা ম্যাপ দেখেই বুঝতে পারবেন কোন গ্রামে সেচ পাম্পগুলো অবিলম্বে চালু করা জরুরি!

### End of Lesson Summary
১. সময়ের সাথে NDVI মানের হ্রাস পাওয়া ফসলের স্ট্রেস বা পানির অভাব নির্দেশ করে।
২. স্যাটেলাইট ইমেজ ভিত্তিক খরা ট্র্যাকিং ফসলের ব্যাপক ক্ষয়ক্ষতি রোধে অত্যন্ত উপযোগী।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L40
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'সুস্থ ফসলের NDVI মান আকস্মিকভাবে ০.৭ থেকে ০.৩৫ এ নেমে আসলে সেটি কী নির্দেশ করতে পারে?', '["ফসলের ব্যাপক বৃদ্ধি", "ফসল খরা, রোগ বা স্ট্রেস দ্বারা আক্রান্ত", "জমিতে পানি বৃদ্ধি", "ম্যাপ সুন্দর হওয়া"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'বরেন্দ্র অঞ্চলে আমন ধানের অনাবৃষ্টির কারণে খরা ম্যাপ তৈরি করতে কোন সূচকটি সাহায্য করবে?', '["Slope map", "NDVI (Normalized Difference Vegetation Index)", "Aspect map", "River buffer map"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একটি নির্দিষ্ট মাঠে NDVI মান ০.১৫ পাওয়া গেছে, এর অর্থ কী হতে পারে?', '["মাঠে কোনো ফসল বা গাছপালা নেই, এটি হয়তো পতিত বালি জমি বা খালি মাটি", "সেখানে ঘন জঙ্গল রয়েছে", "সেখানে বড় চা বাগান আছে", "জানিনা"]'::jsonb, 0);

  -- ================================================================================================
  -- MODULE 9: THE R + GIS BRIDGE: SPATIAL DATA SCIENCE
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gis_cid, 'Module 9: The R + GIS Bridge & Spatial Coding', 'r-gis-bridge', 9, 'Connect ArcGIS data with R workflows, spatial databases, and automated scripting.')
  RETURNING id INTO m9_id;

  -- Lesson 41: Why Integrate R with GIS?
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m9_id, '41. Connecting GIS with R: Why Code When You Can Click?', 'why-r-gis-bridge', 1, 
  $markdown$
# Module Overview
এই মডিউলে আমরা ArcGIS এর ডেস্কটপ কাজের সাথে পূর্বে শেখা R কোডিং এর সংযোগ স্থাপন করব। কীভাবে স্থানিক ডাটা R-এ ইম্পোর্ট করে স্ট্যাটিস্টিক্যাল মডেলিং করতে হয় এবং কোডের মাধ্যমে স্থানিক কাজগুলো অটোমেট করা যায় তা শিখব।

# Lesson 41: Connecting GIS with R: Why Code When You Can Click?

আমরা এতক্ষণ মাউস দিয়ে ক্লিক করে করে অনেক চমৎকার জিওপ্রসেসিং ও ম্যাপ তৈরি করেছি। কিন্তু ধরুন, আপনাকে বাংলাদেশের ৬৪টি জেলার জন্য পৃথকভাবে মাটির উপযুক্ততা বিশ্লেষণ করতে বলা হলো। 

একই কাজ ৬৪ বার মাউস দিয়ে ক্লিক করে করা অত্যন্ত ক্লান্তিকর এবং বিরক্তিকর।

সেখানেই আমাদের সাহায্য করে **R + GIS Bridge**।

[IMAGE: Spatial Data Science Flow R GIS. Caption: ডেটা প্রিপারেশন, স্পেশিয়াল স্ট্যাটিসটিক্স এবং ভিজ্যুয়ালাইজেশনে কীভাবে ArcGIS ও R প্রোগ্রামিং একে অপরকে পরিপূরক হিসেবে কাজ করে তার ফ্লোচার্ট।]

### ক্লিকিং বনাম কোডিং (Desktop GIS vs R GIS):
- **ArcGIS (Desktop GUI) সেরা:** ম্যাপ ডিজাইন করতে, জ্যামিতি ম্যানুয়ালি এডিট করতে এবং ৩ডি ভিজ্যুয়ালাইজেশনের জন্য।
- **R (Spatial Programming) সেরা:** একই কাজ বারবার করতে (Automation), বড় বড় ডেটাসেটে জটিল পরিসংখ্যান বা মেশিন লার্নিং চালাতে (যেমন Random Forest দিয়ে ফসল ক্লাসিফিকেশন)।

👉 **বাস্তব চিন্তা:** আমরা যখন এই দুই জগতের শক্তিকে একত্র করি, তখন আমরা পরিণত হই একজন **Spatial Data Scientist**-এ!

### End of Lesson Summary
১. ক্লিকিং এবং কোডিং একসাথে কাজ করলে স্থানিক বিশ্লেষণের কাজের গতি অনেক বৃদ্ধি পায়।
২. আর (R) প্রোগ্রামিং আমাদের পুনরাবৃত্তিমূলক স্থানিক কাজগুলো অটোমেট করতে সাহায্য করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L41
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একই স্থানিক বিশ্লেষণ বা ম্যাপ তৈরির কাজ ১০০০ বার অটোমেট করতে নিচের কোনটি সবচেয়ে সহজ ও প্রফেশনাল পদ্ধতি?', '["মাউস দিয়ে ১০০০ বার ক্লিক করা", "কোডিং বা স্ক্রিপ্টিং (যেমন R বা Python) এর সাহায্য নেওয়া", "ম্যাপ তৈরি বন্ধ করে দেওয়া", "কাগজে ম্যাপ আঁকা"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'মেশিন লার্নিং বা জটিল পরিসংখ্যানের কাজ স্থানিক ডেটার ওপর চালানোর জন্য কোন টুলটি সবচেয়ে বেশি নমনীয়?', '["R / Python", "MS Paint", "ArcMap standard print", "PDF Viewer"]'::jsonb, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'R এর সাথে ArcGIS এর মূল সম্পর্কের মেলবন্ধন কোথায়?', '["উভয়েই একই কোম্পানি তৈরি করেছে", "ArcGIS দিয়ে স্থানিক ডেটা প্রসেস করে R-এ নিয়ে স্ট্যাটিস্টিক্যাল অ্যানালাইসিস করা যায়", "উভয়ই একদম এক সফটওয়্যার", "জানিনা"]'::jsonb, 1);


  -- Lesson 42: Exporting ArcGIS Attribute Tables for R Statistics
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m9_id, '42. Exporting ArcGIS Attribute Tables for R Statistics', 'exporting-table-to-r', 2, 
  $markdown$
# Lesson 42: Exporting ArcGIS Attribute Tables for R Statistics

স্ট্যাটিস্টিক্সে আমরা রিগ্রেশন অ্যানালাইসিস (Regression) বা কোরিলেশন (Correlation) করতে পছন্দ করি। যেমন: উপজেলার মাটির লবণের পরিমাণের সাথে ফসলের ফলনের সম্পর্ক কী।

এই পরিসংখ্যান করতে আমাদের ম্যাপের জ্যামিতির প্রয়োজন নেই, কেবল ম্যাপের পেছনে থাকা ডাটাবেজ টেবিলটি পেলেই চলে।

[IMAGE: Export Table Options ArcGIS. Caption: ArcGIS Pro এর Table view থেকে কীভাবে ডাটাবেজ টেবিলকে .csv বা .xlsx হিসেবে এক্সপোর্ট করতে হয় তার স্ক্রিনশট।]

### কিভাবে টেবিল এক্সপোর্ট করবেন:
১. আপনার ম্যাপ লেয়ারের Attribute Table ওপেন করুন।
২. ওপরে থাকা ৩টি ডট মেনু বা অপশন বারে ক্লিক করে `Export Table` সিলেক্ট করুন।
৩. আউটপুট ফরম্যাট হিসেবে `CSV Table (.csv)` বা `dBASE Table (.dbf)` সিলেক্ট করুন।
৪. সেভ করুন।

👉 **R-এ রিডিং:** এবার RStudio ওপেন করে খুব সহজেই লিখুন:
```r
my_data <- read.csv("my_exported_table.csv")
head(my_data)
```
আপনি আপনার ম্যাপের ডেটাফ্রেম R-এর ওপরে পেয়ে গেলেন!

### End of Lesson Summary
১. ম্যাপ ডেটা থেকে কেবল ডাটাবেজ টেবিল এক্সপোর্ট করে সিএসভি ফরম্যাটে সেভ করা যায়।
২. সিএসভি ফাইলটি সরাসরি R-এ রিড করে স্ট্যাটিস্টিক্যাল মডেল তৈরি করা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L42
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ম্যাপের পেছনের টেবিলটিকে R-এ নেওয়ার জন্য সবচেয়ে সুবিধাজনক ফাইল ফরম্যাট কোনটি?', '["PDF", "CSV (Comma Separated Values)", "DOCX", "PNG"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'R-এ সিএসভি টেবিল রিড করার জন্য কোন ফাংশনটি ব্যবহার করা হয়?', '["read.csv()", "load.table()", "import_data()", "get_file()"]'::jsonb, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'টেবিল এক্সপোর্ট করলে কি ম্যাপের ওপরে আঁকা লাইন বা পয়েন্টগুলো এক্সপোর্ট হয়ে যায়?', '["হ্যাঁ, সব চলে যায়", "না, কেবল বৈশিষ্ট্যসমূহ বা অ্যাট্রিবিউট টেক্সট ডাটা এক্সপোর্ট হয়, জ্যামিতিক নকশা নয়", "ম্যাপটি ডিলিট হয়ে যায়", "জানিনা"]'::jsonb, 1);


  -- Lesson 43: Reading Shapefiles in R: Introduction to the `sf` Package
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m9_id, '43. Reading Shapefiles in R: The sf Package', 'read-shapefiles-r-sf', 3, 
  $markdown$
# Lesson 43: Reading Shapefiles in R: The `sf` Package

যদি আমরা কেবল টেবিল না, বরং পুরো শেপফাইল জ্যামিতিসহ সরাসরি R-এ রিড করতে চাই?

আজকে আমরা R-এর সবচেয়ে জনপ্রিয় স্থানিক বা স্পেশিয়াল লাইব্রেরি **sf (Simple Features)** এর সাথে পরিচিত হব।

[IMAGE: RStudio Console sf Loading. Caption: RStudio-তে sf লাইব্রেরি লোড করে একটি বাংলাদেশের শেপফাইল রিড করার কোড ও কনসোল ভিউ।]

### `sf` প্যাকেজ ব্যবহার করার কোড:
প্রথমে আমাদের প্যাকেজটি লোড করতে হবে:
```r
library(sf)
```
এবার শেপফাইলটি রিড করার জাদু ফাংশন:
```r
bd_map <- st_read("bangladesh_districts.shp")
```
এটি রান করার পর আপনি যদি লিখেন `plot(bd_map["Yield"])`, R সঙ্গে সঙ্গে আপনাকে একটি রঙিন ফসল ফলনের ডিস্ট্রিক্ট ম্যাপ ড্র করে দেবে!

👉 **কৃষিবিদের ট্রিক:** R-এ `sf` অবজেক্ট আসলে একটি ডেটাফ্রেমের মতোই আচরণ করে, যার শেষে একটি কাস্টম কলাম থাকে নাম `geometry`। এই কলামেই ম্যাপের নকশার তথ্য থাকে।

### End of Lesson Summary
১. R-এ জ্যামিতিসহ ম্যাপ ডেটা সরাসরি রিড করার সেরা লাইব্রেরি হলো `sf`।
২. `st_read()` ফাংশন দিয়ে শেপফাইল বা জিওজেসন ফাইল ইম্পোর্ট করা হয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L43
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'R-এ শেপফাইল রিড করার জন্য বহুল ব্যবহৃত লাইব্রেরি বা প্যাকেজ কোনটি?', '["ggplot2", "sf (Simple Features)", "dplyr", "tidyr"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'sf লাইব্রেরির কোন ফাংশন দিয়ে শেপফাইলটি রিড করা হয়?', '["read.shape()", "st_read()", "st_open()", "load_vector()"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'R-এর sf অবজেক্ট টেবিলে জ্যামিতিক নকশার তথ্য সাধারণত কোন কলামে সংরক্ষিত থাকে?', '["coord", "geometry", "shape_id", "locations"]'::jsonb, 1);


  -- Lesson 44: Desktop GIS vs Spatial Coding in R
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m9_id, '44. Desktop GIS vs Spatial Coding in R', 'desktop-gis-vs-spatial-coding', 4, 
  $markdown$
# Lesson 44: Desktop GIS vs Spatial Coding in R

আজ আমরা একটি গুরুত্বপূর্ণ বিতর্ক বা তুলনা নিয়ে আলোচনা করব—**Desktop GIS (ArcGIS Pro/QGIS)** নাকি **Spatial Coding in R/Python**?

উভয়েরই নিজস্ব শক্তি ও দুর্বলতা রয়েছে এবং একজন দক্ষ গবেষক সঠিক সময়ে সঠিক টুল বেছে নিতে পারেন।

[IMAGE: GUI vs CLI GIS Comparison. Caption: ArcGIS Pro এর গ্রাফিকাল ইউজার ইন্টারফেস (GUI) এবং RStudio এর কমান্ড লাইন ইন্টারফেস (CLI) এর পাশাপাশি তুলনা।]

### শক্তির তুলনা:
- **Desktop GIS (ArcGIS Pro):**
  - **সুবিধা:** ম্যাপ সুন্দর ডিজাইনে সাজানো (Cartography), ড্রয়িং বা সীমানা কাটার কাজ নিখুঁতভাবে চোখে দেখে মাউস দিয়ে করা।
  - **অসুবিধা:** মেমোরি ও প্রোসেসিং লোড অনেক বেশি নেয়। বড় রাস্টার ফাইলে কাজ করার সময় হ্যাং করতে পারে।
  
- **Spatial Coding (R / sf):**
  - **সুবিধা:** রিপ্রোডুসিবিলিটি (Reproducibility) - একই স্ক্রিপ্ট অন্য ফাইলে সহজেই বারবার রান করা যায়। রাস্টার এনালাইসিস অনেক হালকা ও দ্রুত চলে।
  - **অসুবিধা:** কোনো ম্যাপ সরাসরি মাউস দিয়ে ধরে কাস্টম ড্রয়িং করা খুবই কঠিন।

👉 **সুপার সলিউশন:** ArcGIS Pro তে ডেটা ক্লিপ, রেডি ও সিম্বলজি ডিজাইন করুন, আর স্ট্যাটিস্টিক্যাল ক্যালকুলেশন ও থিসিসের রিগ্রেশন মডেল R-এ স্ক্রিপ্ট দিয়ে করুন!

### End of Lesson Summary
১. ডেস্কটপ জিআইএস ম্যাপ আর্ট ও ভিজ্যুয়াল ড্রয়িং এর জন্য সেরা।
২. স্পেশিয়াল কোডিং ডেটা সায়েন্স প্রসেসিং ও কাজের পুনরাবৃত্তি এড়াতে সেরা।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L44
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কোন কাজের জন্য ArcGIS Pro এর মতো ডেস্কটপ জিআইএস সবচেয়ে সেরা পছন্দ?', '["ডাটাবেজ সার্ভার তৈরি করতে", "ম্যাপ লেআউট সাজাতে, কার্টোগ্রাফি ও ভিজ্যুয়ালি এডিটিং করতে", "রিগ্রেশন স্ক্রিপ্ট লিখতে", "ওয়েবসাইট হোস্ট করতে"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'R-এর মতো স্পেশিয়াল কোডিং লাইব্রেরির প্রধান সুবিধা কোনটি?', '["মাউস দিয়ে ম্যাপ ড্র করা সহজ", "রিপ্রোডুসিবিলিটি বা একই কোড দিয়ে পুনরাবৃত্তিমূলক প্রসেস দ্রুত অটোমেট করা", "এটি রঙিন বাটন অফার করে", "কোনো সুবিধা নেই"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একজন স্পেশিয়াল ডাটা সায়েন্টিস্টের সঠিক ওয়ার্কফ্লো কেমন হওয়া উচিত?', '["কেবল আর (R) ব্যবহার করা", "প্রজেক্টের প্রয়োজন অনুযায়ী ডেস্কটপ জিআইএস ও প্রোগ্রামিং এর কম্বিনেশন ব্যবহার করা", "কেবল এক্সেলে কাজ করা", "কোনোটিই নয়"]'::jsonb, 1);


  -- Lesson 45: Spatial Automation (ModelBuilder vs R Scripts)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m9_id, '45. Spatial Automation: ModelBuilder Basics vs R Scripting', 'automation-modelbuilder-r', 5, 
  $markdown$
# Lesson 45: Spatial Automation: ModelBuilder Basics vs R Scripting

মডিউল ৯-এর শেষ লেসনে আজ আমরা শিখব স্থানিক অটোমেশনের একটি দারুণ ভিজ্যুয়াল টুল—**ModelBuilder**।

কোডিং ছাড়াই কীভাবে আপনি আপনার জিওপ্রসেসিং ধাপগুলোকে (যেমন প্রথমে Buffer, তারপর Clip, সবশেষে Intersect) একটি চেইনের মতো একসাথে যুক্ত করে এক ক্লিকে রান করতে পারেন, তা আমরা দেখব।

[IMAGE: ModelBuilder Flowchart ArcGIS. Caption: ArcGIS Pro এর ModelBuilder এর একটি প্রসেস ফ্লো - কীভাবে ইনপুট ফাইল বাফার ও ক্লিপ টুলের মধ্য দিয়ে গিয়ে আউটপুট তৈরি করছে।]

### ModelBuilder কী?
এটি হলো ArcGIS Pro এর একটি ভিজ্যুয়াল প্রোগ্রামিং উইন্ডো। এখানে আপনি কোনো কোড লেখেন না, বরং:
- ফাইল এবং জিওপ্রসেসিং টুলগুলোকে ড্র্যাগ করে উইন্ডোতে আনেন।
- বুবল বা সার্কেলের সংযোগের মাধ্যমে তাদের ফ্লোচার্টের মতো সাজান।
- এবার নতুন ডেটা দিয়ে রান বাটনে ক্লিক করলেই পুরো ফ্লোচার্ট স্বয়ংক্রিয়ভাবে প্রসেস সম্পন্ন করে!

👉 **আর স্ক্রিপ্টের সাথে তুলনা:** আপনি যদি কোডিং ভালোবাসেন, তবে R-এর স্ক্রিপ্ট লিখে এই চেইনটি `%>%` (পাইপ) অপারেটরের মাধ্যমে এক লাইনে করতে পারেন। আর কোডিং কঠিন লাগলে ModelBuilder আপনার সেরা ভরসা!

### End of Lesson Summary
১. মডেল বিল্ডার হলো কোডিং ছাড়াই জিআইএস প্রসেস অটোমেট করার ভিজ্যুয়াল ফ্লোচার্ট টুল।
২. এটি জটিল প্রসেসিং ফ্লোকে দলগত কাজের জন্য শেয়ার করার উপযোগী করে তোলে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L45
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ArcGIS Pro তে কোডিং ছাড়া ভিজ্যুয়াল ফ্লোচার্টের সাহায্যে কাজের ধাপগুলো যুক্ত করার টুল কোনটি?', '["Attribute Query", "ModelBuilder", "Georeference Editor", "Catalog View"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'মডেল বিল্ডারে বিভিন্ন ফাইল ও টুলের ফ্লো কীভাবে নির্দেশ করা হয়?', '["পয়েন্ট দিয়ে", "তীর চিহ্ন বা কানেক্টরের মাধ্যমে কানেক্ট করে", "ইমেইল করে", "কোনোটিই নয়"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'R কোডে ModelBuilder এর মতো একাধিক স্থানিক প্রসেসকে চেইনের মতো মেলানোর সুবিধা কোনটি দেয়?', '["ggplot()", "dplyr এর পাইপ অপারেটর (%>%)", "read.csv()", "print()"]'::jsonb, 1);

  -- ================================================================================================
  -- MODULE 10: CAPSTONE PROJECT: BANGLADESHI AGRICULTURAL MAPPING
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (gis_cid, 'Module 10: Capstone Project: Flood Inundation Vulnerability', 'capstone-project-gis', 10, 'Apply all GIS, Remote Sensing, and Spatial analysis skills to a real Kurigram flood hazard mapping project.')
  RETURNING id INTO m10_id;

  -- Lesson 46: Capstone Project Overview (Flood Impact in Kurigram)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m10_id, '46. Capstone Project Overview: Flood Hazard Mapping in Kurigram', 'capstone-overview', 1, 
  $markdown$
# Module Overview
এই চূড়ান্ত ক্যাপস্টোন মডিউলে আমরা এতদিনের শেখা সমস্ত স্পেশিয়াল জ্ঞান প্রয়োগ করে বাস্তবধর্মী একটি বড় প্রজেক্ট শেষ করব। আমরা কুড়িগ্রাম জেলার বন্যার ক্ষয়ক্ষতির একটি প্রফেশনাল মানচিত্র তৈরি করব।

# Lesson 46: Capstone Project Overview: Flood Hazard Mapping in Kurigram

অভিনন্দন! আপনি কোর্সের শেষ মডিউলে চলে এসেছেন। এখন আর কোনো ছোট উদাহরণের প্র্যাকটিস নয়, এখন আমরা একটি বাস্তব বড় সমস্যার সমাধান করব।

আমাদের আজকের ক্যাপস্টোন প্রজেক্টের লক্ষ্য: **কুড়িগ্রাম জেলার ব্রহ্মপুত্র নদ সংলগ্ন চরাঞ্চলে বন্যা ঝুঁকি এলাকা এবং সম্ভাব্য ক্ষতিগ্রস্ত ফসল ক্ষেতের মোট এরিয়া (হেক্টরে) বের করা।**

[IMAGE: Kurigram Study Area Sentinel Image. Caption: কুড়িগ্রাম জেলার স্যাটেলাইট ইমেজ ও নদী সীমানার বেস ম্যাপ।]

### প্রজেক্টের প্রধান প্রশ্নসমূহ:
১. কুড়িগ্রামের নিম্নভূমিগুলো (DEM অনুযায়ী ৩ মিটারের নিচে) কোথায় অবস্থিত?
২. ব্রহ্মপুত্র নদী থেকে ১ কিলোমিটারের বাফার জোনের ভেতরে কোন কোন কৃষি জমি বা ইউনিয়নগুলো অবস্থিত?
৩. বন্যার পরে তোলা স্যাটেলাইট ইমেজের NDVI ক্যালকুলেট করে ধানের ফলন কতটা ক্ষতিগ্রস্ত হয়েছে তা কীভাবে নির্ধারণ করবেন?

👉 **পোর্টফোলিও টিপস:** এই প্রজেক্টটি শেষ করার পর আপনি এটিকে আপনার সিভিতে যুক্ত করতে পারবেন, যা আপনাকে যেকোনো কৃষি ও পরিবেশ বিষয়ক সংস্থায় চাকরির আবেদনে অন্যদের চেয়ে অনেক এগিয়ে রাখবে!

### End of Lesson Summary
১. ক্যাপস্টোন প্রজেক্টের লক্ষ্য কুড়িগ্রামের বন্যা ঝুঁকির স্থানিক ম্যাপ তৈরি ও ক্ষেত্রফল পরিমাপ করা।
২. এটি ডেটা সংগ্রহ, প্রসেসিং ও লেআউট ডিজাইনের সব ধাপ কভার করবে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L46
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'আমাদের ক্যাপস্টোন প্রজেক্টের মূল ভৌগোলিক এলাকা কোনটি?', '["সিলেট হাওর অঞ্চল", "কুড়িগ্রাম জেলা ও ব্রহ্মপুত্র অববাহিকা", "বরেন্দ্র অঞ্চল", "ঢাকা শহর"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'এই ক্যাপস্টোন প্রজেক্টটি সম্পূর্ণ করার পর আপনি এটি কোথায় প্রদর্শন করতে পারেন?', '["কোথাও না", "আপনার প্রফেশনাল রিসার্চ পোর্টফোলিও বা সিভি (CV) তে", "কেবল ড্রাফট ফোল্ডারে", "জানিনা"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'বন্যা প্লাবিত ফসলের ক্ষয়ক্ষতির মাত্রা পরিমাপের সেরা রাস্টার সূচক কোনটি যা আমরা ক্যাপস্টোনে ব্যবহার করব?', '["Aspect Index", "NDVI (Normalized Difference Vegetation Index)", "Slope Index", "Rainfall Map Only"]'::jsonb, 1);


  -- Lesson 47: Sourcing and Preparing Project Data
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m10_id, '47. Sourcing and Preparing Project Data', 'capstone-data-prep', 2, 
  $markdown$
# Lesson 47: Sourcing and Preparing Project Data

একটি সফল প্রজেক্টের পেছনের কাজ হলো সঠিক ডেটা খুঁজে পাওয়া এবং তা ArcGIS Pro-তে কাজের জন্য প্রস্তুত করা। আজ আমরা এই প্রজেক্টের প্রয়োজনীয় ডেটাসেটগুলোর খোঁজ করব।

[IMAGE: GIS Data Catalog Folder Structure. Caption: ক্যাপস্টোন প্রজেক্ট ফোল্ডারের ভেতরে ভেক্টর এবং রাস্টার ফাইলের সুন্দর সুশৃঙ্খল বিন্যাস।]

### ৩টি প্রয়োজনীয় ডেটাসেট:
১. **Kurigram Boundary Shapefile:** কুড়িগ্রাম জেলা ও উপজেলার সীমানা নির্দেশক ভেক্টর ফাইল (পলিগন)।
২. **SRTM DEM (ডিজিটাল এলিভেশন মডেল):** কুড়িগ্রাম অঞ্চলের ভূপৃষ্ঠের উচ্চতা পরিমাপের রাস্টার গ্রিড (রেজোলিউশন ৩০ মিটার)।
৩. **Sentinel-2 Images:** বর্ষার সময় ও বর্ষার পরের মেঘমুক্ত দুটি ভিন্ন ডেটের স্যাটেলাইট ইমেজ ব্যান্ড।

👉 **বাস্তব প্র্যাকটিস:** আপনার কম্পিউটার ড্রাইভে একটি ফোল্ডার খুলুন নাম দিন `Kurigram_Capstone`। এর ভেতরে দুটি আলাদা সাব-ফোল্ডার করুন—`Vector_Data` এবং `Raster_Data`। ডেটাগুলো আলাদা রাখলে কাজ করার সময় কোনো ফাইল হারিয়ে যাবে না!

### End of Lesson Summary
১. প্রজেক্ট ডেটা অর্গানাইজ করা যেকোনো পেশাদার জিআইএস কাজের প্রথম শর্ত।
২. বাউন্ডারি ফাইল, এলিভেশন গ্রিড এবং স্যাটেলাইট ইমেজ এই প্রজেক্টের কাঁচামাল।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L47
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ক্যাপস্টোন প্রজেক্টের ফাইলগুলো এলোমেলো না রেখে কীভাবে গুছিয়ে রাখা উচিত?', '["ডেস্কটপে ছড়িয়ে রাখা", "ড্রাইভে নির্দিষ্ট প্রজেক্ট ফোল্ডার বানিয়ে সাব-ফোল্ডারে ক্যাটাগরি অনুযায়ী রাখা", "ডিলিট করে রাখা", "জানিনা"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কুড়িগ্রামের ভূমির উচ্চতা ও পানির ঢাল বিশ্লেষণ করতে আমাদের কোন রাস্টার ফাইলটি সংগ্রহ করতে হবে?', '["Road Line map", "DEM (Digital Elevation Model)", "Excel Coordinate Sheet", "Weather text report"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'স্যাটেলাইট ইমেজ রাখার জন্য আমাদের কোন সাব-ফোল্ডারটি তৈরি করা উচিত?', '["Vector_Data", "Raster_Data", "Document_Data", "Video_Data"]'::jsonb, 1);


  -- Lesson 48: Executing the Spatial Analysis Workflow
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m10_id, '48. Executing the Spatial Analysis Workflow', 'capstone-spatial-analysis', 3, 
  $markdown$
# Lesson 48: Executing the Spatial Analysis Workflow

এবার আমরা আমাদের বিশ্লেষণের মূল প্রসেসগুলো একে একে সম্পন্ন করব। আমাদের কাজের ফ্লোচার্টটি লক্ষ্য করুন।

[IMAGE: Capstone Geoprocessing Flow. Caption: বাফার, ক্লিপ এবং ইন্টারসেক্টের মাধ্যমে ধাপে ধাপে বন্যা ঝুঁকি জোনের ক্ষেত্রফল ম্যাপ তৈরির ফ্লোচার্ট।]

### ৪টি প্রসেসিং ধাপ:
১. **River Buffering:** কুড়িগ্রামের প্রধান নদীগুলোর লাইন লেয়ার সিলেক্ট করুন এবং ২ কিলোমিটারের একটি বাফার জোন তৈরি করুন (`River_Buffer_2km`)।
২. **DEM Elevation Clip:** কুড়িগ্রামের সীমানা দিয়ে আমাদের মূল DEM ফাইলটি ক্লিপ করুন যাতে কুড়িগ্রামের বাইরের অতিরিক্ত উচ্চতার ডেটা বাদ যায়।
৩. **Raster Calculator (Reclassifying Risk):** ক্লিপ করা DEM এর ওপর লজিক্যাল কুয়েরি চালিয়ে ৩ মিটারের নিচের পিক্সেলগুলো আলাদা করুন।
৪. **Intersect Overlay:** বাফার জোন এবং নিম্নভূমির পলিগনকে ইন্টারসেক্ট করুন। এর ফলে আমরা সেই নিচু এলাকাগুলো পাবো যা একই সাথে নদীর খুব কাছে অবস্থিত। এটিই আমাদের মূল "হাই-রিস্ক প্লাবন অঞ্চল"!

👉 **বাস্তব চিন্তা:** ফলাফল ম্যাপের অ্যাট্রিবিউট টেবিলে গিয়ে `Calculate Geometry` ব্যবহার করে দেখুন কত বর্গ কিলোমিটার এলাকা উচ্চ ঝুঁকিপূর্ণ অঞ্চলের আওতায় রয়েছে!

### End of Lesson Summary
১. বাফার ও ক্লিপ দিয়ে ডেটা ছেঁটে নিয়ে লজিক্যাল ওভারলের মাধ্যমে ঝুঁকি এলাকা চিহ্নিত করা যায়।
２. ক্যালকুলেট জিওমেট্রির মাধ্যমে আক্রান্ত এলাকার ক্ষেত্রফল সংখ্যায় বের করা হয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L48
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'কুড়িগ্রামের উচ্চ ঝুঁকিপূর্ণ বন্যা এলাকা নির্ধারণের সঠিক স্থানিক কন্ডিশন কোনটি?', '["উচ্চতা ১০ মিটারের বেশি ও নদী থেকে ১০ কিমি দূরে", "উচ্চতা সমুদ্রপৃষ্ঠ থেকে ৩ মিটারের নিচে এবং নদী থেকে ২ কিলোমিটারের মধ্যে", "সবুজ বনাঞ্চল এলাকা", "জানিনা"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'আক্রান্ত এলাকার মোট আয়তন বর্গকিলোমিটারে পরিমাপ করতে কোন জ্যামিতিক ক্যালকুলেশনটি রান করতে হবে?', '["Calculate Centroid X", "Calculate Area (Square Kilometers)", "Calculate Length", "Calculate Index Number"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'নদী থেকে নির্দিষ্ট দূরত্বের ঝুঁকি অঞ্চল বের করতে কোন জিওপ্রসেসিং টুলটি ব্যবহার করতে হবে?', '["Clip Tool", "Buffer Tool", "Union Tool", "Dissolve Tool"]'::jsonb, 1);


  -- Lesson 49: Creating the Capstone Presentation Map
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m10_id, '49. Designing the Capstone Presentation Map Layout', 'capstone-layout-design', 4, 
  $markdown$
# Lesson 49: Designing the Capstone Presentation Map Layout

বিশ্লেষণ শেষ! এবার আমাদের সুন্দর ও বৈজ্ঞানিক তথ্যবহুল মানচিত্রটি বিশ্ববাসীর কাছে দেখানোর পালা। আজ আমরা আমাদের ক্যাপস্টোন ম্যাপটির একটি চূড়ান্ত লেআউট ডিজাইন করব।

[IMAGE: Final Capstone Layout Presentation. Caption: কুড়িগ্রামের বন্যা ঝুঁকি মানচিত্রের চূড়ান্ত লেআউট - লাল জোন, স্কেলবার, লিজেন্ড, এবং সুন্দর গ্রিডলাইন সম্বলিত প্রিন্ট-রেডি ভিউ।]

### ডিজাইনের মূল চেকলিস্ট:
১. **Symbology (সিম্বলজি):** বন্যা ঝুঁকি অঞ্চলকে হালকা স্বচ্ছ লাল রঙে দেখান যাতে ব্যাকগ্রাউন্ডের স্যাটেলাইট ম্যাপটি নিচে আবছা দেখা যায়।
২. **Map Elements (ম্যাপ উপাদান):**
   - লিজেন্ডের নাম দিন: "Legend: Flood Risk Classes"।
   - স্কেলবারের জোন সেট করুন "Kilometer" ইউনিটে।
   - উত্তরমুখী তীর বা নর্থ অ্যারোটি ম্যাপের ওপরে ফ্রেমে স্পষ্ট কোণায় রাখুন।
৩. **Title Text:** "Flood Vulnerability Mapping of Kurigram District, Bangladesh"।

👉 **বাস্তব প্র্যাকটিস:** ম্যাপ এক্সপোর্ট ডায়ালগে গিয়ে রেজোলিউশন **300 DPI** সেট করে ফাইলটি `Kurigram_Flood_Risk_Map.pdf` নামে এক্সপোর্ট করুন!

### End of Lesson Summary
১. লেআউট ডিজাইন ম্যাপের বৈজ্ঞানিক ফলাফলকে দর্শকদের কাছে বোধগম্য করে তোলে।
২. ৩-ডি বা স্বচ্ছ রঙের ব্যবহার ম্যাপকে আরও প্রফেশনাল ও দৃষ্টিনন্দন করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L49
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'চূড়ান্ত প্রফেশনাল ম্যাপের পেজের ওপরে নিচে গ্রিডলাইনে থাকা অক্ষাংশ ও দ্রাঘিমাংশের দাগগুলোকে কী বলা হয়?', '["Legends", "Graticules / Grid Lines", "North Arrows", "Scales"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'বাংলাদেশি দর্শক ও কর্মকর্তাদের সুবিধার্থে স্কেল বারের একক মিটারের পাশাপাশি কিসে দেখানো সবচেয়ে উত্তম?', '["Pixel", "Kilometers / Meters", "Miles", "Inches"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ঝুঁকি জোনের পেছনে থাকা জমির স্যাটেলাইট ইমেজ আবছাভাবে দেখতে সাহায্য করতে লাল রঙের কোন অপশনটি পরিবর্তন করা উচিত?', '["Color Ramp", "Transparency (স্বচ্ছতা বা ওড়না ইফেক্ট)", "Outline Width", "Rotation Angle"]'::jsonb, 1);


  -- Lesson 50: Saving, Sharing, and Building a GIS Portfolio
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m10_id, '50. Saving, Sharing, and Building a GIS Portfolio', 'gis-portfolio-conclusion', 5, 
  $markdown$
# Lesson 50: Saving, Sharing, and Building a GIS Portfolio

আজ আমাদের যাত্রার শেষ দিন। আলহামদুলিল্লাহ! আপনি সফলভাবে ৫০টি লেসন পার করে আপনার এগ্রি-জিআইএস এবং স্পেশিয়াল এনালাইসিস কোর্সটি সম্পূর্ণ করেছেন।

কিন্তু শেখার এই শক্তিকে চাকরি বা গবেষণার বাজারে কাজে লাগাতে হলে আপনাকে আপনার কাজগুলো মানুষের সামনে তুলে ধরতে হবে।

[IMAGE: GIS Portfolio Github LinkedIn. Caption: গিটহাব বা অন্য অনলাইন প্ল্যাটফর্মে আপনার প্রজেক্টের ডেসক্রিপশন ও ম্যাপ ইমেজ দিয়ে সাজানো প্রফেশনাল পোর্টফোলিওর চিত্র।]

### আপনার পোর্টফোলিও কীভাবে সাজাবেন?
১. **GitHub/LinkedIn Share:** আপনার ক্যাপস্টোন প্রজেক্টের এক্সপোর্ট করা পিডিএফ ম্যাপটি একটি ছোট বিবরণ ও গবেষণার মূল ফলাফলসহ (যেমন: "নদী তীরের ১৭.৫% আবাদি জমি বোরো মৌসুমে বন্যার উচ্চ ঝুঁকিতে আছে") লিঙ্কডইন বা গিটহাবে শেয়ার করুন।
২. **Make a Project Report:** সংক্ষেপে ১ পৃষ্ঠার একটি পিডিএফ রিপোর্ট তৈরি করুন যেখানে প্রজেক্টের অবজেক্টিভ, ডেটা সোর্স, মেথডোলজির ফ্লোচার্ট এবং চূড়ান্ত ম্যাপ ও ডিসকাশন থাকবে।
৩. **Keep Learning:** জিআইএস একটি বিশাল জগৎ। এই বেসিক কোর্স শেষ করার পর আপনি জিআইএস প্রোগ্রামিং, পাইথন স্ক্রিপ্টিং, ও গুগল আর্থ ইঞ্জিনের (Google Earth Engine) অ্যাডভান্সড রিমোট সেন্সিং কাজের জন্য এখন সম্পূর্ণ প্রস্তুত!

আপনাদের সবার সুন্দর ও স্মার্ট এগ্রি-রিসার্চ ক্যারিয়ারের শুভকামনা জানিয়ে আমরা এই কোর্সটি এখানেই শেষ করছি। অনেক অনেক শুভকামনা!

### End of Course Summary
১. অভিনন্দন! আপনি এখন বাস্তব জিআইএস প্রজেক্ট স্বাধীনভাবে শুরু করার যোগ্যতা অর্জন করেছেন।
২. গবেষণার ম্যাপ শেয়ারিং এবং একটি সুন্দর স্থানিক পোর্টফোলিও তৈরি আপনার সিভির মান বহুগুণ বাড়িয়ে দেবে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ L50
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'এই কোর্সটি শেষ করার পর আপনার স্থানিক দক্ষতা প্রদর্শন করার সেরা প্রফেশনাল প্ল্যাটফর্ম কোনটি?', '["ফেসবুক চ্যাট", "LinkedIn / ResearchGate / GitHub", "কোনোটিই নয়", "মোবাইলের গ্যালারি"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'ভবিষ্যতে হাজার হাজার একর জমির স্যাটেলাইট ইমেজ ক্লাউড কম্পিউটিং এর সাহায্যে বিগ-ডেটা প্রসেস করতে কোন অ্যাডভান্সড টুলটি শেখা দরকার?', '["MS Word", "Google Earth Engine (GEE)", "Paintbrush", "Notepad"]'::jsonb, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, options, correct_answer) VALUES (l_id, 'একটি প্রফেশনাল প্রজেক্ট রিপোর্টে ম্যাপ ইমেজের পাশাপাশি আর কী থাকা উচিত?', '["কেবল লেখকের নাম", "অবজেক্টিভ, ডেটা সোর্স, মেথডোলজির ফ্লোচার্ট ও বিশ্লেষণের সারসংক্ষেপ", "কেবল লোগো", "কোনো বাড়তি বিবরণের প্রয়োজন নেই"]'::jsonb, 1);

END $$;
