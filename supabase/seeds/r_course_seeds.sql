-- SEED DATA: R COURSE (ALL MODULES)
-- This file contains the complete curriculum for "R for Agri-Data Science".
-- It handles cleanup, course creation, and content for all modules.

-- 0. SCHEMA MIGRATION (Ensures columns exist before seeding)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sector TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sub_sector TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS content_variants JSONB;
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'quiz_questions' 
          AND column_name = 'quiz_id'
    ) THEN
        ALTER TABLE public.quiz_questions ALTER COLUMN quiz_id DROP NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'lesson_id') THEN
        ALTER TABLE public.quiz_questions ADD COLUMN lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'question') THEN
        ALTER TABLE public.quiz_questions ADD COLUMN question TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'options') THEN
        ALTER TABLE public.quiz_questions ADD COLUMN options JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'correct_answer') THEN
        ALTER TABLE public.quiz_questions ADD COLUMN correct_answer INTEGER;
    END IF;
END $$;

DO $$
DECLARE
  r_cid UUID; -- R Course ID
  m1_id UUID; -- Module 1 ID
  m2_id UUID; -- Module 2 ID
  l_id UUID;  -- Temp Lesson ID
BEGIN
  -- ================================================================================================
  -- 1. SETUP & CLEANUP
  -- ================================================================================================
  
  -- Remove existing course to ensure a clean slate (Cascade will remove modules/lessons/quizzes)
  DELETE FROM public.courses WHERE slug = 'r-agri-data-bau';

  -- Create Course
  INSERT INTO public.courses (title, slug, description, is_published, thumbnail_url)
  VALUES (
    'R for Agri-Science', 
    'r-agri-data-bau', 
    'Bangladesh Agricultural University Special Edition. Master R for Data Science, ML & GIS from absolute zero.', 
    TRUE,
    'https://www.computerworld.com/wp-content/uploads/2024/09/1534430-0-41575800-1726249957-r_programming_language_abstract_programming_background_thinkstock_3x2_1200x800-100703503-orig.jpg?quality=50&strip=all&w=1024'
  ) RETURNING id INTO r_cid;

  -- ================================================================================================
  -- MODULE 1: ORIENTATION & SETUP
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 1: Orientation & Setup', 'orientation-setup', 1, 'Get comfortable with R language and specific BAU tools.')
  RETURNING id INTO m1_id;

  -- M1-L1: What is R?
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id, '1. What is R? Why Learn It?', 'intro-r', 1, 
  $markdown$
# Module Overview
এই মডিউলে আমরা R প্রোগ্রামিং ভাষার সাথে পরিচিত হবো। কেন এটি কৃষি এবং ডেটা সায়েন্সের জন্য এত গুরুত্বপূর্ণ, এবং আপনার ক্যারিয়ারে এটি কীভাবে গেম-চেঞ্জার হতে পারে, তা আমরা জানবো। ভয় পাওয়ার কিছু নেই, আমরা ধাপে ধাপে শিখবো!

# Lesson 1: What is R? Why R for Data Science, ML & GIS?

আসসালামু আলাইকুম! কেমন আছেন সবাই?
আজকে আমরা শুরু করতে যাচ্ছি **R Programming** শেখার এক নতুন যাত্রা। প্রথমেই মনে প্রশ্ন আসতে পারে—"ভাইয়া, R কি? এটা খেয়ে ফেলে না মাথায় দেয়?"

সহজ কথায়, **R** হলো ডেটা সায়েন্সের জন্য তৈরি একটি সুপার-পাওয়ারফুল ক্যালকুলেটর এবং প্রোগ্রামিং ভাষা। এটি দিয়ে আমরা ডেটা বিশ্লেষণ (Analysis), সুন্দর সুন্দর গ্রাফ (Visualization) এবং ম্যাপ (GIS) তৈরি করতে পারি।

### কৃষিবিদ এবং BAU ছাত্রদের জন্য এটি কেন জরুরি?
১. **Research & Thesis:** মাস্টার্স বা পিএইচডি থিসিসে বিশাল বিশাল ডেটা অ্যানালাইসিস করতে হয়। এক্সেলে (Excel) যা করতে ৫ ঘণ্টা লাগে, R দিয়ে তা ৫ সেকেন্ডে করা সম্ভব।
২. **Precision Agriculture:** এখন যুগ স্মার্ট এগ্রিকালচারের। জমির স্যাটেলাইট ইমেজ প্রসেস করতে R এবং Python এর কোনো বিকল্প নেই।
৩. **Job Market:** দেশে এবং বিদেশে ডেটা এনালিস্টদের প্রচুর চাহিদা। আপনি যদি কৃষিবিদ হওয়ার পাশাপাশি কোডিং পারেন, তবে আপনার ভ্যালু অন্যদের চেয়ে ১০ গুণ বেশি!

### Step 1: R is Just a Calculator
চলুন আমরা একদম বেসিক দিয়ে শুরু করি। R কে আমরা প্রথমে একটি সাধারণ ক্যালকুলেটর হিসেবে ব্যবহার করবো।

নিচের কোড বক্সে একটি সাধারণ যোগ অংক দেওয়া আছে।

**R Code:**
```r
10 + 20
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Printing Your Name
কম্পিউটার প্রোগ্রামিং ইত্যদি শেখার সময় সবাই প্রথমে "Hello World" প্রিন্ট করে। আমরা যেহেতু কৃষিবিদ, আমরা আমাদের ভার্সিটির নাম প্রিন্ট করবো!

কোনো লেখা (Text) প্রিন্ট করতে হলে আমাদের `print()` ফাংশন ব্যবহার করতে হয় এবং লেখাটিকে ডাবল কোটেশন `""` এর মধ্যে রাখতে হয়।

**R Code:**
```r
print("I love BAU")
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 3: A Little Magic (Simple Plot)
R কেন এত জনপ্রিয় জানেন? কারণ এটি দিয়ে খুব সহজে গ্রাফ আঁকা যায়। নিচের কোডটি রান করে দেখুন তো কি হয়?

**R Code:**
```r
plot(1:10, main="My First Growth Chart")
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
আজকে আমরা শিখলাম:
১. R একটি শক্তিশালী টুল যা আমাদের গবেষণায় সাহায্য করবে।
২. এটি সাধারণ ক্যালকুলেটরের মতো কাজ করতে পারে।
৩. `print()` ফাংশন দিয়ে আমরা যেকোনো লেখা দেখাতে পারি।

অভিনন্দন! আপনি আপনার কোডিং যাত্রার প্রথম ধাপ পার করেছেন।

$markdown$, 'https://www.youtube.com/watch?v=9kYUGMg_14s') RETURNING id INTO l_id;
  
  -- QUIZ M1-L1
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R প্রধানত কি ধরণের কাজের জন্য ব্যবহৃত হয়?', 'R প্রধানত কি ধরণের কাজের জন্য ব্যবহৃত হয়?', '["ওয়েবসাইট ডিজাইন", "গেম ডেভেলপমেন্ট", "ডেটা সায়েন্স ও পরিসংখ্যান", "ভিডিও এডিটিং"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোন ফাংশনটি টেক্সট দেখানোর জন্য ব্যবহৃত হয়?', 'কোন ফাংশনটি টেক্সট দেখানোর জন্য ব্যবহৃত হয়?', '["show()", "print()", "text()", "display()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'BAU এর ছাত্রদের জন্য R কেন গুরুত্বপূর্ণ?', 'BAU এর ছাত্রদের জন্য R কেন গুরুত্বপূর্ণ?', '["এটি দেখতে সুন্দর", "গবেষণা ও থিসিসের ডেটা বিশ্লেষণের জন্য", "ফেসবুক চালানোর জন্য", "গেম খেলার জন্য"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Precision Agriculture এ কি বিশ্লেষণ করতে R ব্যবহার করা হতে পারে?', 'Precision Agriculture এ কি বিশ্লেষণ করতে R ব্যবহার করা হতে পারে?', '["জমির মালিকের নাম", "স্যাটেলাইট ইমেজ ও ডেটা", "ট্রাক্টরের রং", "ফসলের দাম"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R কোডে `10 + 20` লিখলে আউটপুট কি হবে?', 'R কোডে `10 + 20` লিখলে আউটপুট কি হবে?', '["1020", "30", "Error", "None"]'::jsonb, 1, 1);


  -- M1-L2: Installation
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, content_variants, video_url) VALUES (m1_id, '2. Installing R & RStudio', 'install-r', 2, 
  $markdown$
# Lesson 2: Installing R & RStudio (General)

R দিয়ে কাজ করার জন্য আমাদের কম্পিউটারে দুটি জিনিস ইন্সটল করতে হয়:
১. **R (The Engine):** এটি হলো মূল ইঞ্জিন যা সব কাজ করে।
২. **RStudio (The Dashboard):** এটি হলো সেই সফটওয়্যার যেখানে আমরা কোড লিখি।

এটি জেনারেল ভার্সন।
$markdown$,
'{
    "AGRI": "# Lesson 2: Installing R for Agriculture\n\nকৃষিবিদদের জন্য R ইন্সটল করা খুবই জরুরি। এটি আপনার ফিল্ড ডেটা এনালাইসিসে সাহায্য করবে।\n\nএটি এগ্রিকালচার স্পেশাল ভার্সন!",
    "LIFE": "# Lesson 2: R for Life Sciences\n\nলাইফ সায়েন্সে জিনোমিক ডেটা নিয়ে কাজের জন্য R অপরিহার্য।\n\nএটি লাইফ সায়েন্স স্পেশাল ভার্সন!"
}'::jsonb, NULL) RETURNING id INTO l_id;

  -- QUIZ M1-L2
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'প্রথমে কোনটি ইন্সটল করতে হয়?', 'প্রথমে কোনটি ইন্সটল করতে হয়?', '["RStudio", "R", "Excel", "Chrome"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'RStudio কে কিসের সাথে তুলনা করা হয়েছে?', 'RStudio কে কিসের সাথে তুলনা করা হয়েছে?', '["ইঞ্জিন", "চাকা", "গাড়ির ড্যাশবোর্ড", "রাস্তা"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'CRAN এর পূর্ণরূপ কি?', 'CRAN এর পূর্ণরূপ কি?', '["Computer Ram Access Network", "Comprehensive R Archive Network", "Common R Application Node", "Central R Admin Network"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'আমাদের সিমুলেটরে কোড রান করার জন্য কি সফটওয়্যার ইন্সটল করা বাধ্যতামূলক?', 'আমাদের সিমুলেটরে কোড রান করার জন্য কি সফটওয়্যার ইন্সটল করা বাধ্যতামূলক?', '["RStudio", "Python", "কিছুই না (এটি ব্রাউজারে চলে)", "Matlab"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বর্তমানে বেশীরভাগ ল্যাপটপ কোন আর্কিটেকচারের?', 'বর্তমানে বেশীরভাগ ল্যাপটপ কোন আর্কিটেকচারের?', '["32-bit", "64-bit", "128-bit", "16-bit"]'::jsonb, 1, 1);


  -- M1-L3: Interface Tour
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id, '3. RStudio Interface Tour & How R Works', 'interface-tour', 3, 
  $markdown$
# Lesson 3: How R Works (Scripts, Console, Environment)

RStudio (এবং আমাদের সিমুলেটর) মূলত ৪টি ভাগে বিভক্ত। একে আমরা বলি **"The 4 Panes of Greatness"**।

### 1. Source (The Script) 📝
উপরে বাম দিকে থাকে। এখানে আমরা কোড লিখি এবং সেভ করে রাখি। এটি রান্নার রেসিপি বইয়ের মতো। এখানে লিখলে সাথে সাথে রান হয় না, `Run` বাটনে ক্লিক করতে হয়।

### 2. Console (The Action) ⚡
নিচে বাম দিকে থাকে। এখানে কোড রান হয় এবং আউটপুট দেখা যায়। আমাদের সিমুলেটরে ডানদিকের কালো বক্সটিই হলো কনসোল।

### 3. Environment (The Memory) 🧠
উপরে ডান দিকে থাকে। আমরা যা যা ভেরিয়েবল বা ডেটা তৈরি করি, সব এখানে জমা থাকে।

### Step 1: Script vs Console
নিচের কোডটি দেখুন। এখানে আমরা দুটি লাইন লিখেছি। যখন আপনি রান করবেন, কম্পিউটার একের পর এক লাইন পড়বে এবং কনসোলে ফলাফল দেখাবে।

**R Code:**
```r
print("Line 1 Executed")
print("Line 2 Executed")
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Plot Pane
নিচে ডান দিকে থাকে প্লট এরিয়া। আমরা যখন কোনো গ্রাফ আঁকি, সেটি এখানে ভেসে ওঠে।

**R Code:**
```r
# একটি সিম্পল হিস্টোগ্রাম
x <- c(10, 12, 15, 20, 35, 40)
hist(x, col="green")
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
মনে রাখবেন:
- **Script:** যেখানে কোড লিখি।
- **Console:** যেখানে রেজাল্ট দেখি।
- **Environment:** যেখানে ডেটা জমা থাকে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M1-L3
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোড লেখার জায়গা কোনটি?', 'কোড লেখার জায়গা কোনটি?', '["Console", "Source/Script", "Plots", "History"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোড রান হওয়ার পর ফলাফল কোথায় দেখা যায়?', 'কোড রান হওয়ার পর ফলাফল কোথায় দেখা যায়?', '["Source", "Environment", "Console", "Files"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'তৈরি করা ভেরিয়েবল বা ডেটা কোথায় জমা থাকে?', 'তৈরি করা ভেরিয়েবল বা ডেটা কোথায় জমা থাকে?', '["Plots Pane", "Console", "Environment", "Help"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'গ্রাফ বা চার্ট কোথায় প্রদর্শিত হয়?', 'গ্রাফ বা চার্ট কোথায় প্রদর্শিত হয়?', '["Source Pane", "Console", "Plot Pane", "History"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'RStudio তে সাধারনত কয়টি প্রধান পেইন (Pane) থাকে?', 'RStudio তে সাধারনত কয়টি প্রধান পেইন (Pane) থাকে?', '["২টি", "৩টি", "৪টি", "৬টি"]'::jsonb, 2, 2);


  -- M1-L4: First Program
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id, '4. Your First R Program', 'first-program', 4, 
  $markdown$
# Lesson 4: Your First R Program

এখন আমরা সত্যিকারের কোডিং করবো! আমরা একটি ছোট প্রোগ্রাম লিখবো যা:
১. একটি ভেরিয়েবলে কিছু সংখ্যা রাখবে।
২. তাদের গড় (Mean) বের করবে।

### Step 1: Variables (Box Concept)
ভেরিয়েবল হলো একটি বক্সের মতো, যেখানে আমরা কোনো মান (Value) বা ডেটা রাখতে পারি। R এ মান রাখার জন্য আমরা `<-` চিহ্ন ব্যবহার করি। একে বলে **Assignment Operator**।

**R Code:**
```r
yield <- 5000   # ৫০০০ সংখ্যাটি yield নামের বক্সে রাখলাম
print(yield)    # বক্সের ভেতর কি আছে তা দেখলাম
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Doing Math with Variables
এখন আমরা ভেরিয়েবল দিয়ে অংক করবো। ধরুন আপনার ধানের ফলন ৫০০০ কেজি, এবং আপনি তার দ্বিগুণ আশা করেছিলেন।

**R Code:**
```r
current_yield <- 5000
target_yield <- current_yield * 2
print(target_yield)
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 3: Functions (The Helpers)
ফাংশন হলো রেডিমেড মেশিন। ইনপুট দিলে আউটপুট দেয়। যেমন `sqrt()` ফাংশন বর্গমূল বের করে।

**R Code:**
```r
number <- 64
result <- sqrt(number)
print(result)
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `<-` দিয়ে ভেরিয়েবলে মান রাখা হয়।
- ভেরিয়েবলের নাম অর্থপূর্ণ হওয়া ভালো (যেমন `x` এর চেয়ে `yield` ভালো)।
- ফাংশন আমাদের কাজ সহজ করে দেয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M1-L4
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ কোনো ভেরিয়েবলে মান রাখার সঠিক নিয়ম কোনটি?', 'R এ কোনো ভেরিয়েবলে মান রাখার সঠিক নিয়ম কোনটি?', '["x = 5", "x <- 5", "x -> 5", "x : 5"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ফাংশন (Function) কি?', 'ফাংশন (Function) কি?', '["একটি ভেরিয়েবল", "একটি গানল", "একটি রেডিমেড কোড ব্লক যা নির্দিষ্ট কাজ করে", "একটি এরর মেসেজ"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'sqrt(49) এর ফলাফল কত হবে?', 'sqrt(49) এর ফলাফল কত হবে?', '["7", "49", "14", "2401"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'নিচের কোনটি ভালো ভেরিয়েবল নাম?', 'নিচের কোনটি ভালো ভেরিয়েবল নাম?', '["a", "b123", "total_cost", "x_y_z"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'print(x) কি করে?', 'print(x) কি করে?', '["x মুছে ফেলে", "x এর মান কনসোলে দেখায়", "x এর মান পরিবর্তন করে", "কম্পিউটার বন্ধ করে"]'::jsonb, 1, 1);


  -- M1-L5: Help & Mistakes
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m1_id, '5. How to Get Help & Common Mistakes', 'help-mistakes', 5, 
  $markdown$
# Lesson 5: Common Beginner Mistakes

নতুন অবস্থায় ভুল হওয়া খুবই স্বাভাবিক। ভয়ের কিছু নেই, সব এক্সপার্টরাই একসময় বিগিনার ছিলেন। আসুন দেখি সচরাচর কি কি ভুল হয়।

### Step 1: Case Sensitivity (বড় হাতের vs ছোট হাতের)
R খুব সেনসিটিভ। `Mean` এবং `mean` এক জিনিস নয়। R এর সব বিল্ট-ইন ফাংশন সাধারণত ছোট হাতের অক্ষরে হয়।

**R Code (Error Example):**
```r
# এটি এরর দিবে কারণ Mean নামে কিছু নেই, সঠিক হলো mean
Mean(c(1, 2, 3)) 
```

👉 Now click **Run Code** and try this in our website Simulator (You will see an error!)

**R Code (Correct):**
```r
mean(c(1, 2, 3))
```

👉 Now click **Run Code** to fix it.

### Step 2: Quotation Marks missing
টেক্সট লেখার সময় কোটেশন মার্ক মিস করা যাবে না।

**R Code:**
```r
print(Hello)   # ভুল! R ভাববে Hello একটা ভেরিয়েবল
print("Hello") # সঠিক! এটি একটি টেক্সট
```

### Step 3: Getting Help
কোনো ফাংশন সম্পর্কে ভুলে গেলে `?` চিহ্ন দিয়ে তার নাম লিখলে হেল্প পাওয়া যায়।

**R Code:**
```r
?sum
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- R ছোট হাতের ও বড় হাতের অক্ষর আলাদাভাবে দেখে।
- টেক্সট সবসময় `" "` এর ভেতরে রাখতে হয়।
- আটকে গেলে `?` ব্যবহার করে হেল্প নিতে হয়।

অভিনন্দন! আপনি মডিউল ১ সফলভাবে শেষ করেছেন! 🎉

$markdown$, NULL) RETURNING id INTO l_id;
  
  -- QUIZ M1-L5
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R ল্যাঙ্গুয়েজ কি Case Sensitive?', 'R ল্যাঙ্গুয়েজ কি Case Sensitive?', '["হ্যাঁ", "না", "মাঝে মাঝে", "শুধুমাত্র উইন্ডোজ পিসিতে"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোন ফাংশনের হেল্প দেখার জন্য কি সংকেত ব্যবহার করা হয়?', 'কোন ফাংশনের হেল্প দেখার জন্য কি সংকেত ব্যবহার করা হয়?', '["#", "$", "?", "!"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'print(BAU) কোডটি কেন এরর দিবে?', 'print(BAU) কোডটি কেন এরর দিবে?', '["BAU বাউ এর বানান ভুল", "সেমিকোলন নেই", "BAU টেক্সট হিসেবে ডাবল কোটেশনের মধ্যে নেই", "প্রিন্ট ফাংশন কাজ করছে না"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'নিচের কোনটি সঠিক ফাংশন নাম?', 'নিচের কোনটি সঠিক ফাংশন নাম?', '["Mean()", "MEAN()", "mean()", "MeAn()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোড লেখার সময় ভুল হলে কি করা উচিত?', 'কোড লেখার সময় ভুল হলে কি করা উচিত?', '["কম্পিউটার বন্ধ করে দেওয়া", "ভয়ের কিছু নেই, এরর মেসেজ পড়ে ঠিক করা", "R আনইন্সটল করা", "কান্নাকাটি করা"]'::jsonb, 1, 1);


  -- ================================================================================================
  -- MODULE 2: R BASICS
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 2: R Basics (Core Foundation)', 'r-basics', 2, 'Variables, Data Types, Vectors, and Built-in Functions.')
  RETURNING id INTO m2_id;

  -- M2-L6: Variables & Naming
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '6. Variables, Assignment & Naming Rules', 'variables-naming', 1, 
  $markdown$
# Module 2 Overview
এই মডিউলে আমরা R এর ভিত্তি শক্ত করবো। ভেরিয়েবল, ডেটা টাইপ এবং ভেক্টর—এই তিনটি জিনিস না বুঝলে সামনে আগানো অসম্ভব।

# Lesson 6: Variables & Naming Rules

ভেরিয়েবল বা চলক নিয়ে আমরা আগেই একটু জেনেছি। এটি একটি পাত্রের মতো। তবে এই পাত্রের নাম দেওয়ার কিছু নিয়ম আছে।

### Step 1: Making Variables
মনে রাখবেন, R এ `=` চিহ্নের চেয়ে `<-` চিহ্ন ব্যবহার করা বেশি ভালো (একে বলে Standard Practice)।

**R Code:**
```r
my_age <- 22
print(my_age)
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Naming Rules (নামকরণের নিয়ম)
পাত্রের নাম যা খুশি তাই দেওয়া যায় না।
১. **No Spaces:** নামের মাঝে ফাঁকা রাখা যাবে না। `my age` ভুল, `my_age` সঠিক।
২. **Case Sensitive:** `Age` এবং `age` আলাদা।
৩. **No Numbers at Start:** `1st_prize` ভুল, `prize_1st` সঠিক।

**R Code (Bad vs Good):**
```r
# ভুল নাম (Error দিবে)
# 1student <- "Rahim" 

# সঠিক নাম
student_1 <- "Rahim"
print(student_1)
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 3: Snake Case
R ইউজাররা সাধারণত **snake_case** পছন্দ করে। অর্থাৎ সব ছোট হাতের অক্ষর এবং মাঝে আন্ডারস্কোর (_)।
যেমন: `total_crop_yield` (দেখতে সাপের মতো লম্বা)।

**R Code:**
```r
# Snake Case Example
paddy_price_kg <- 45
print(paddy_price_kg)
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- ভেরিয়েবল নামের মাঝে স্পেস দেবেন না।
- আন্ডারস্কোর (_) ব্যবহার করুন।
- নাম যেন অর্থপূর্ণ হয় (যেমন `x` এর চেয়ে `student_name` ভালো)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M2-L6
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ ভেরিয়েবল নামকরণের সঠিক পদ্ধতি কোনটি?', 'R এ ভেরিয়েবল নামকরণের সঠিক পদ্ধতি কোনটি?', '["my variable", "my-variable", "my_variable", "1my_variable"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'নিচের কোনটি ভুল ভেরিয়েবল নাম?', 'নিচের কোনটি ভুল ভেরিয়েবল নাম?', '["total_sum", "avg_score", "2nd_place", "final_result"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Snake Case এর বৈশিষ্ট্য কি?', 'Snake Case এর বৈশিষ্ট্য কি?', '["সব বড় হাতের অক্ষর", "শব্দের মাঝে হাইফেন", "সব ছোট হাতের অক্ষর ও মাঝে আন্ডারস্কোর", "স্পেস ব্যবহার করা"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Assignment Operator হিসেবে কোনটি বেশি জনপ্রিয়?', 'Assignment Operator হিসেবে কোনটি বেশি জনপ্রিয়?', '["=", "->", "<-", "::"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Case Sensitive মানে কি?', 'Case Sensitive মানে কি?', '["বড় ও ছোট হাতের অক্ষর আলাদা", "স্পেস দেওয়া যাবে না", "সংখ্যা ব্যবহার করা যাবে না", "সব অক্ষর বড় হতে হবে"]'::jsonb, 0, 0);


  -- M2-L7: Data Types
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '7. Data Types (The Big Three)', 'data-types', 2, 
  $markdown$
# Lesson 7: Data Types

R এ মূলত তিন ধরণের ডেটা বা তথ্য নিয়ে আমরা কাজ করি। এদের চেনা খুবই জরুরি।

### 1. Numeric (সংখ্যা) 🔢
যেকোনো দশমিক বা পূর্ণ সংখ্যা। যেমন: `10`, `3.14`, `-50`।

### 2. Character (লেখা) 🔡
যেকোনো নাম বা টেক্সট। অবশ্যই কোটেশন `" "` এর মধ্যে থাকতে হবে। যেমন: `"Bangladesh"`, `"Rice"`.

### 3. Logical (সত্য/মিথ্যা) ✅❌
মাত্র দুটি মান হতে পারে: `TRUE` অথবা `FALSE`। (সব বড় হাতের অক্ষরে লিখতে হয়)।

### Step 1: Checking Types
কোনো ভেরিয়েবল কি ধরণের ডেটা, তা জানার জন্য `class()` ফাংশন ব্যবহার করা হয়।

**R Code:**
```r
x <- 100
class(x)  # এটি "numeric" দেখাবে

name <- "Karim"
class(name) # এটি "character" দেখাবে

is_student <- TRUE
class(is_student) # এটি "logical" দেখাবে
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Logical Gates
লজিক্যাল ডেটা সাধারণত কোনো প্রশ্নের উত্তর হিসেবে আসে।
যেমন: ১০ কি ৫ এর চেয়ে বড়?

**R Code:**
```r
result <- 10 > 5
print(result) # TRUE
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- **Numeric:** সংখ্যা।
- **Character:** টেক্সট (কোটেশনসহ)।
- **Logical:** TRUE / FALSE।
- `class()` দিয়ে টাইপ চেক করা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M2-L7
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '3.14 কোন ধরণের ডেটা?', '3.14 কোন ধরণের ডেটা?', '["Character", "Numeric", "Logical", "Complex"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '"BAU" কোন ধরণের ডেটা?', '"BAU" কোন ধরণের ডেটা?', '["Numeric", "Logical", "Character", "Integer"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'নিচের কোনটি সঠিক লজিক্যাল ভ্যালু?', 'নিচের কোনটি সঠিক লজিক্যাল ভ্যালু?', '["True", "true", "TRUE", "Yes"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোন ফাংশন দিয়ে ডেটার টাইপ দেখা যায়?', 'কোন ফাংশন দিয়ে ডেটার টাইপ দেখা যায়?', '["type()", "check()", "class()", "what()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোড `10 < 5` এর আউটপুট কি হবে?', 'কোড `10 < 5` এর আউটপুট কি হবে?', '["TRUE", "FALSE", "Error", "5"]'::jsonb, 1, 1);


  -- M2-L8: Vectors
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '8. Vectors (The Power of Many)', 'vectors-intro', 3, 
  $markdown$
# Lesson 8: Vectors

এতক্ষণ আমরা একটি বক্সে একটি মাত্র মান রাখছিলাম। কিন্তু কৃষি গবেষণায় আমাদের হাজার হাজার ডেটা নিয়ে কাজ করতে হয়। তখন আমরা **Vector** ব্যবহার করি।

ভেক্টর হলো এক লাইনে সাজানো অনেকগুলো মানের সমষ্টি।

### Step 1: Creating a Vector
ভেক্টর তৈরির জন্য `c()` ফাংশন ব্যবহার করা হয়। `c` মানে combine বা connect।

**R Code:**
```r
# ধানের ৫টি নমুনার ফলন (কেজি)
yields <- c(40, 45, 50, 42, 48)
print(yields)
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: The Golden Rule of Vectors
একটি ভেক্টরের ভেতরে সব ডেটা **একই ধরণের** হতে হবে। আপনি খিচুড়ি পাকাতে পারবেন না (সংখ্যা এবং লেখা মেশাতে পারবেন না)। যদি মেশান, R জোর করে সব টেক্সট বানিয়ে দেবে।

**R Code:**
```r
# মিক্সড ভেক্টর (ভুল পদ্ধতি)
mixed <- c(10, "Apple", 20)
print(mixed)
# আউটপুট দেখুন: সবগুলোর পাশে কোটেশন চলে এসেছে! অর্থাৎ সব Character হয়ে গেছে।
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 3: Sequence
সহজে ১ থেকে ১০০ পর্যন্ত সংখ্যা লেখার উপায়:

**R Code:**
```r
nums <- 1:50
print(nums)
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `c()` দিয়ে ভেক্টর বানাতে হয়।
- ভেক্টরে সব ডেটা একই টাইপের হতে হয়।
- `1:10` দিয়ে সিরিয়াল তৈরি করা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M2-L8
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ভেক্টর তৈরির ফাংশন কোনটি?', 'ভেক্টর তৈরির ফাংশন কোনটি?', '["v()", "c()", "vec()", "list()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'c(1, "A", 2) এই ভেক্টরের ডেটা টাইপ কি হবে?', 'c(1, "A", 2) এই ভেক্টরের ডেটা টাইপ কি হবে?', '["Numeric", "Logical", "Character", "Error"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '1 থেকে 100 পর্যন্ত সংখ্যা লেখার শর্টকাট কি?', '1 থেকে 100 পর্যন্ত সংখ্যা লেখার শর্টকাট কি?', '["1-100", "1 to 100", "1:100", "seq(100)"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'c দ্বারা কি বোঝায়?', 'c দ্বারা কি বোঝায়?', '["Calibrate", "Combine", "Count", "Code"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'একটি ভেক্টরে কি ভিন্ন ধরণের ডেটা রাখা যায়?', 'একটি ভেক্টরে কি ভিন্ন ধরণের ডেটা রাখা যায়?', '["হ্যাঁ", "না", "মাঝে মাঝে", "শুধু লগিক্যাল ডেটা"]'::jsonb, 1, 1);


  -- M2-L9: Operations
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '9. Basic Operations with Vectors', 'vector-operations', 4, 
  $markdown$
# Lesson 9: Basic Operations

এক্সেলে যেমন একটা একটা করে সেলে যোগ বিয়োগ করতে হয়, R এ তেমনটি নয়। এখানে পুরো ভেক্টরের উপর একসাথে অপারেশন চালানো যায়। একে বলে **Vectorization**।

### Step 1: Math on Vectors
ধরুন আপনার ৫ জন শ্রমিকের বেতন ১০০ টাকা করে বাড়াতে হবে।

**R Code:**
```r
salary <- c(500, 600, 550)
new_salary <- salary + 100
print(new_salary)
# দেখুন সবার সাথে ১০০ যোগ হয়ে গেছে!
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Vector vs Vector
দুটি ভেক্টর যোগ করলে কি হয়? পজিশন অনুযায়ী যোগ হয় (প্রথমটার সাথে প্রথমটা, দ্বিতীয়টার সাথে দ্বিতীয়টা)।

**R Code:**
```r
a <- c(1, 2, 3)
b <- c(10, 20, 30)
print(a + b)
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- R এ লুপ চালানো ছাড়াই পুরো লিস্টের উপর অংক করা যায়।
- এটি আমাদের কাজ অনেক দ্রুত করে দেয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M2-L9
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Vectorization এর সুবিধা কি?', 'Vectorization এর সুবিধা কি?', '["কোড স্লো করে দেয়", "একসাথে অনেক ডেটার উপর অপারেশন করা যায়", "শুধুমাত্র টেক্সট ডেটায় কাজ করে", "কম্পিউটার হ্যাং করে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'যদি x <- c(2, 4) হয়, তবে x * 2 কত হবে?', 'যদি x <- c(2, 4) হয়, তবে x * 2 কত হবে?', '["2 4", "4 8", "4 4", "Error"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'দুটি ভেক্টর যোগ করলে কিভাবে যোগ হয়?', 'দুটি ভেক্টর যোগ করলে কিভাবে যোগ হয়?', '["সবগুলো একসাথে", "এলিমেন্ট-ওয়াইজ (Element-wise)", "পাশাপাশি বসে যায়", "শুধু প্রথম উপাদান যোগ হয়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'x <- c(10, 20); y <- c(5, 5); x - y কত?', 'x <- c(10, 20); y <- c(5, 5); x - y কত?', '["5 15", "15 5", "50 100", "0 0"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ কি সাধারণ অংকের নিয়ম (BODMAS) মেনে চলে?', 'R এ কি সাধারণ অংকের নিয়ম (BODMAS) মেনে চলে?', '["হ্যাঁ", "না", "শুধু যোগের ক্ষেত্রে", "জানা নেই"]'::jsonb, 0, 0);


  -- M2-L10: Functions & Conversion
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '10. Built-in Functions & Type Conversion', 'functions-conversion', 5, 
  $markdown$
# Lesson 10: Built-in Functions & Conversion

R এ প্রচুর বিল্ট-ইন ফাংশন আছে যা আমাদের জীবন সহজ করে দেয়। এবং আমরা চাইলে এক টাইপের ডেটাকে অন্য টাইপে বদলাতে পারি।

### Step 1: Useful Stats Functions
কৃষি গবেষণায় আমাদের প্রায়ই গড় (Mean), মোট (Sum), এবং মধ্যক (Median) বের করতে হয়।

**R Code:**
```r
yields <- c(50, 60, 55, 40, 100)

print(mean(yields))  # গড়
print(sum(yields))   # মোট যোগফল
print(length(yields)) # কয়টি ডেটা আছে? (Sample Size)
print(max(yields))   # সর্বোচ্চ মান
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Type Conversion (রূপান্তর)
মাঝে মাঝে টেক্সট হিসেবে থাকা সংখ্যাকে আমাদের আসল সংখ্যায় রূপান্তর করতে হয়।
- `as.numeric()`: সংখ্যায় রূপান্তর করে।
- `as.character()`: টেক্সটে রূপান্তর করে।

**R Code:**
```r
# টেক্সট হিসেবে আছে
price <- "500"
# print(price + 20) # এটি এরর দিবে কারণ টেক্সটের সাথে সংখ্যা যোগ করা যায় না

# রূপান্তর
real_price <- as.numeric(price)
print(real_price + 20) # এখন কাজ করবে!
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `mean()`, `sum()`, `max()` ফাংশনগুলো মনে রাখবেন।
- `as.numeric()` দিয়ে টেক্সটকে সংখ্যায় রূপান্তর করা যায়।

অভিনন্দন! আপনি মডিউল ২ সফলভাবে শেষ করেছেন! 🎉

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M2-L10
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ভেক্টরের গড় বের করার ফাংশন কোনটি?', 'ভেক্টরের গড় বের করার ফাংশন কোনটি?', '["average()", "mean()", "avg()", "mid()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ভেক্টরে কয়টি উপাদান আছে তা জানার ফাংশন কোনটি?', 'ভেক্টরে কয়টি উপাদান আছে তা জানার ফাংশন কোনটি?', '["count()", "size()", "length()", "total()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Character ডেটাকে Numeric এ বদলানোর ফাংশন কোনটি?', 'Character ডেটাকে Numeric এ বদলানোর ফাংশন কোনটি?', '["to_number()", "as.numeric()", "num()", "change()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'সর্বোচ্চ মান বের করার ফাংশন কোনটি?', 'সর্বোচ্চ মান বের করার ফাংশন কোনটি?', '["top()", "maximum()", "max()", "high()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'sum(c(1, 2, 3)) এর ফলাফল কত?', 'sum(c(1, 2, 3)) এর ফলাফল কত?', '["5", "6", "10", "Error"]'::jsonb, 1, 1);

  -- ================================================================================================
  -- MODULE 3: DATA STRUCTURES (Matrices, Lists, Data Frames)
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 3: Data Structures', 'data-structures', 3, 'Understanding how R stores complex data: Matrices, Lists, and Data Frames.')
  RETURNING id INTO m2_id; -- Reusing variable name, it's just an ID holder

  -- M3-L11: Matrices
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '11. Matrices (The 2D Grid)', 'matrices', 1, 
  $markdown$
# Module 3 Overview
এতদিন আমরা শুধু এক লাইনের ডেটা (Vector) নিয়ে কাজ করেছি। কিন্তু বাস্তবে ডেটা টেবিল বা গ্রিড আকারে থাকে। এই মডিউলে আমরা শিখবো কিভাবে জটিল ডেটা সাজাতে হয়।

# Lesson 11: Matrices (2D Grid)

ম্যাট্রিক্স হলো মেঝের টাইলসের মতো। এটি একটি 2D গ্রিড যেখানে সারি (Row) এবং কলাম (Column) থাকে।
**শর্ত:** ভেক্টরের মতো ম্যাট্রিক্সের ভেতরের সব ডেটা **একই ধরণের** (Numeric, Character etc.) হতে হবে।

### Step 1: Creating a Matrix
ম্যাট্রিক্স বানানোর জন্য `matrix()` ফাংশন ব্যবহার করা হয়।

**R Code:**
```r
# ১ থেকে ৯ পর্যন্ত সংখ্যা দিয়ে ৩x৩ ম্যাট্রিক্স
my_matrix <- matrix(1:9, nrow=3, ncol=3)
print(my_matrix)
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Accessing Elements
ম্যাট্রিক্সের নির্দিষ্ট কোনো ঘর বা সেল ধরতে চাইলে `[row, column]` ব্যবহার করতে হয়।

**R Code:**
```r
# ২ নম্বর সারি এবং ৩ নম্বর কলামের মান
val <- my_matrix[2, 3] 
print(val)

# শুধু ২ নম্বর সারিটি দেখতে চাইলে
print(my_matrix[2, ]) 
```

👉 Now click **Run Code** and try this in our website Simulator

### Real Life Example: Field Plot
কৃষি গবেষণায় এক্সপেরিমেন্টাল প্লট প্রায়ই ম্যাট্রিক্স আকারে সাজানো থাকে।

### End of Lesson Summary
- `matrix()` দিয়ে ২D গ্রিড বানানো হয়।
- `[row, col]` দিয়ে ডেটা এক্সেস করা হয়।
- সব ডেটা একই টাইপের হতে হয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M3-L11
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাট্রিক্স তৈরি করার ফাংশন কোনটি?', 'ম্যাট্রিক্স তৈরি করার ফাংশন কোনটি?', '["grid()", "matrix()", "table()", "2d()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'একটি ম্যাট্রিক্সের ভ্যালু এক্সেস করার সঠিক সিনট্যাক্স কি?', 'একটি ম্যাট্রিক্সের ভ্যালু এক্সেস করার সঠিক সিনট্যাক্স কি?', '["m(row, col)", "m{row, col}", "m[row, col]", "m<row, col>"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাট্রিক্সের ডেটা কি ভিন্ন ধরণের হতে পারে?', 'ম্যাট্রিক্সের ডেটা কি ভিন্ন ধরণের হতে পারে?', '["হ্যাঁ", "না", "মাঝে মাঝে", "শুধু প্রথম সারিতে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'x[2, 3] দ্বারা কি বোঝায়?', 'x[2, 3] দ্বারা কি বোঝায়?', '["২য় কলাম ৩য় সারি", "২য় সারি ৩য় কলাম", "২য় মান", "৩য় মান"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'পুরো ১ম সারি দেখার কোড কি?', 'পুরো ১ম সারি দেখার কোড কি?', '["x[1, ]", "x[, 1]", "x[1]", "x(1)"]'::jsonb, 0, 0);


  -- M3-L12: Lists
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '12. Lists (The Super Container)', 'lists', 2, 
  $markdown$
# Lesson 12: Lists

লিস্ট (List) হলো R এর সবচেয়ে শক্তিশালী ঝুড়ি। ভেক্টর বা ম্যাট্রিক্সে সব একই ধরণের জিনিস রাখতে হয়, কিন্তু লিস্টে **যেকোনো কিছু** একসাথে রাখা যায়।
একে আপনারা "বাজারের ব্যাগ" বা "Shopping Bag" ভাবতে পারেন। ব্যাগে যেমন আলু, সাবান, ডিম একসাথে থাকে, লিস্টেও তাই।

### Step 1: Creating a List
`list()` ফাংশন ব্যবহার করে লিস্ট বানানো হয়।

**R Code:**
```r
my_bag <- list(
  name = "Rahim",       # Character
  age = 25,             # Numeric
  scores = c(80, 90, 85), # Vector
  passed = TRUE         # Logical
)

print(my_bag)
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Accessing List Elements ($)
লিস্টের কোনো আইটেম বের করতে হলে `$` চিহ্ন ব্যবহার করা সবচেয়ে সহজ। এটি জাদুর কাঠির মতো কাজ করে!

**R Code:**
```r
# শুধু নাম দেখতে চাইলে
print(my_bag$name)

# স্কোরের গড় দেখতে চাইলে
print(mean(my_bag$scores))
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- লিস্টে যেকোনো ধরণের ডেটা মিক্স করে রাখা যায়।
- `list()` ফাংশন দিয়ে তৈরি করতে হয়।
- `$` সাইন দিয়ে লিস্টের ভেতরের জিনিস বের করা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M3-L12
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ভেক্টর এবং লিস্টের মূল পার্থক্য কি?', 'ভেক্টর এবং লিস্টের মূল পার্থক্য কি?', '["কোনো পার্থক্য নেই", "ভেক্টরে সব এক টাইপ, লিস্টে মিক্স টাইপ রাখা যায়", "লিস্ট ছোট হয়", "ভেক্টর বড় হয়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'লিস্ট তৈরি করার ফাংশন কোনটি?', 'লিস্ট তৈরি করার ফাংশন কোনটি?', '["c()", "vector()", "list()", "group()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'লিস্টের আইটেম এক্সেস করার সহজ উপায় কোনটি?', 'লিস্টের আইটেম এক্সেস করার সহজ উপায় কোনটি?', '["#", "%", "$", "&"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'my_list$age এর কাজ কি?', 'my_list$age এর কাজ কি?', '["age ভেরিয়েবল তৈরি করা", "লিস্ট থেকে age এর মান বের করা", "age ডিলেট করা", "এরর দেওয়া"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'একটি লিস্টে কি আরেকটি লিস্ট রাখা সম্ভব?', 'একটি লিস্টে কি আরেকটি লিস্ট রাখা সম্ভব?', '["হ্যাঁ", "না", "অসম্ভব", "শুধু ২ বার"]'::jsonb, 0, 0);


  -- M3-L13: Data Frames
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '13. Data Frames (The Excel Sheet)', 'data-frames', 3, 
  $markdown$
# Lesson 13: Data Frames

ডেটা সায়েন্সে আমরা ৯৯% সময় **Data Frame** নিয়ে কাজ করি। এটি হুবহু এক্সেল শিটের (Excel Sheet) মতো।
- সারি (Rows) = Observations (নমুনা)
- কলাম (Columns) = Variables (বৈশিষ্ট্য)

### Step 1: Creating a Data Frame
`data.frame()` ফাংশন ব্যবহার করে এটি তৈরি করা যায়। প্রতিটি কলাম আসলে একটি করে ভেক্টর।

**R Code:**
```r
students <- data.frame(
  id = 1:3,
  name = c("Akash", "Batash", "Sagor"),
  gpa = c(3.5, 3.8, 3.2),
  pass = c(TRUE, TRUE, FALSE)
)

print(students)
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Accessing Columns ($)
লিস্টের মতো ডেটা ফ্রেমেও `$` চিহ্ন দিয়ে কলাম সিলেক্ট করা যায়।

**R Code:**
```r
# শুধু জিপিএ কলামটি দেখতে
print(students$gpa)

# গড় জিপিএ বের করতে
print(mean(students$gpa))
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- Data Frame হলো R এর এক্সেল শিট।
- কলামগুলো আলাদা টাইপের হতে পারে (নাম=Text, বয়স=Number)।
- `$` চিহ্ন দিয়ে কলাম ধরা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M3-L13
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ডেটা সায়েন্সে সবচেয়ে বেশি ব্যবহৃত ডেটা স্ট্রাকচার কোনটি?', 'ডেটা সায়েন্সে সবচেয়ে বেশি ব্যবহৃত ডেটা স্ট্রাকচার কোনটি?', '["Matrix", "Vector", "Data Frame", "List"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Data Frame কিসের মতো দেখতে?', 'Data Frame কিসের মতো দেখতে?', '["মাইক্রোসফট ওয়ার্ড", "এক্সেল শিট", "পাওয়ারপয়েন্ট", "নোটপ্যাড"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Data Frame এর একটি কলাম সিলেক্ট করতে কোন চিহ্ন ব্যবহৃত হয়?', 'Data Frame এর একটি কলাম সিলেক্ট করতে কোন চিহ্ন ব্যবহৃত হয়?', '["@", "#", "$", "!"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Data Frame এ সারি (Row) দ্বারা কি বোঝায়?', 'Data Frame এ সারি (Row) দ্বারা কি বোঝায়?', '["Variable", "Header", "Observation বা নমুনা", "Price"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'একটি Data Frame এ কলামগুলোর নাম থাকা কি জরুরি?', 'একটি Data Frame এ কলামগুলোর নাম থাকা কি জরুরি?', '["না", "হ্যাঁ, সাধারণত থাকে", "কখনই থাকে না", "ক্ষতিকর"]'::jsonb, 1, 1);


  -- M3-L14: Factors & Tibbles
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '14. Factors & Tibbles', 'factors-tibbles', 4, 
  $markdown$
# Lesson 14: Factors & Tibbles

### Part 1: Factors (Categorical Data)
ফ্যাক্টর (Factor) হলো বিশেষ ধরণের ভেক্টর যা ক্যাটাগরি (Category) নিয়ে কাজ করে। যেমন: ধানের জাত (BR-28, BR-29) বা জেন্ডার (Male, Female)। 
কম্পিউটার এগুলোকে টেক্সট হিসেবে রাখে না, সে এগুলোকে লেভেল (Levels) হিসেবে চিনে রাখে।

**R Code:**
```r
gender <- factor(c("Male", "Female", "Male", "Male"))
print(gender)
# আউটপুটে দেখবেন Levels: Female Male লেখা আছে।
```

### Part 2: Tibbles (Modern Data Frames)
Tibble হলো Data Frame এর আধুনিক সংস্করণ। এটি দেখতে সুন্দর এবং কাজ করা সহজ। আমরা যখন **Tidyverse** শিখবো, তখন সারাদিন Tibble ব্যবহার করবো।
আপাতত জেনে রাখুন, সব Tibble ই Data Frame, কিন্তু সব Data Frame Tibble না (একটু আপগ্রেডেড আরকি!)।

**R Code (Checking Tibble):**
```r
# সাধারণ ডেটা ফ্রেমকে টিবল বানালাম (এটি কাজ করতে tidyverse প্যাকেজ লাগে, তাই সিম্পল উদাহরণ)
df <- data.frame(a = 1:5, b = letters[1:5])
print(df)
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- **Factor:** ক্যাটাগরিকাল ডেটার জন্য।
- **Tibble:** মডার্ন ও স্মার্ট ডেটা ফ্রেম।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M3-L14
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Factor কিসের জন্য ব্যবহৃত হয়?', 'Factor কিসের জন্য ব্যবহৃত হয়?', '["Numeric calculation", "Categorical Data", "Image Processing", "Text Editing"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Factor এর ক্যাটাগরিগুলোকে কি বলা হয়?', 'Factor এর ক্যাটাগরিগুলোকে কি বলা হয়?', '["Steps", "Levels", "Points", "Classes"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Tibble কি?', 'Tibble কি?', '["একটি ফলের নাম", "একটি নতুন প্রোগ্রামিং ল্যাঙ্গুয়েজ", "Data Frame এর আধুনিক সংস্করণ", "ভাইরাস"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'জেন্ডার (Male/Female) ডেটা সংরক্ষণের জন্য কোনটি উপযুক্ত?', 'জেন্ডার (Male/Female) ডেটা সংরক্ষণের জন্য কোনটি উপযুক্ত?', '["Matrix", "Factor", "Numeric", "Logical"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'সব Tibble ই কি Data Frame?', 'সব Tibble ই কি Data Frame?', '["না", "হ্যাঁ", "মাঝে মাঝে", "বলা যাবে না"]'::jsonb, 1, 1);


  -- M3-L15: Converting Structures
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '15. Structure Summary & Conversion', 'structure-summary', 5, 
  $markdown$
# Lesson 15: Converting Between Structures

আমরা এক স্ট্রাকচার থেকে আরেক স্ট্রাকচারে ডেটা নিতে পারি। একে বলে Coercion বা Conversion।

### Common Functions:
- `as.data.frame(matrix)`: ম্যাট্রিক্সকে ডেটা ফ্রেম বানায়।
- `as.matrix(dataframe)`: ডেটা ফ্রেমকে ম্যাট্রিক্স বানায় (সাবধান! সব ডেটা এক টাইপ হয়ে যাবে)।
- `as.list(vector)`: ভেক্টরকে লিস্ট বানায়।

**R Code:**
```r
# Matrix to Data Frame
mat <- matrix(1:4, ncol=2)
df <- as.data.frame(mat)
print(df)

# Check structure
class(df)
```

👉 Now click **Run Code** and try this in our website Simulator

### Summary Chart
| Structure | Dimensions | Data Type |
| :--- | :--- | :--- |
| **Vector** | 1D | Same Type |
| **Matrix** | 2D | Same Type |
| **List** | 1D/Nested | Mixed Type |
| **Data Frame** | 2D | Mixed Type |

অভিনন্দন! আপনি ডেটা স্ট্রাকচার মডিউল শেষ করেছেন। এটিই ছিলো R এর সবচেয়ে কঠিন অংশগুলোর একটি। এখন আপনি আসল ডেটা সায়েন্সের জন্য প্রস্তুত! 🚀

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M3-L15
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাট্রিক্সকে ডেটা ফ্রেমে রূপান্তর করার ফাংশন কোনটি?', 'ম্যাট্রিক্সকে ডেটা ফ্রেমে রূপান্তর করার ফাংশন কোনটি?', '["to_df()", "as.data.frame()", "change.df()", "make.df()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Data Frame থেকে Matrix এ নিলে কি সমস্যা হতে পারে?', 'Data Frame থেকে Matrix এ নিলে কি সমস্যা হতে পারে?', '["ডেটা মুছে যেতে পারে", "সব ডেটা Character হয়ে যেতে পারে (যদি মিক্স থাকে)", "কম্পিউটার স্লো হবে", "কোনো সমস্যা নেই"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোন স্ট্রাকচারটি "Mixed Type" ডেটা সাপোর্ট করে?', 'কোন স্ট্রাকচারটি "Mixed Type" ডেটা সাপোর্ট করে?', '["Vector", "Matrix", "Data Frame", "Array"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Vector এর ডাইমেনশন কত?', 'Vector এর ডাইমেনশন কত?', '["1D", "2D", "3D", "ND"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Moudle 3 তে আমরা মুলত কি শিখলাম?', 'Moudle 3 তে আমরা মুলত কি শিখলাম?', '["কিভাবে গ্রাফ আঁকতে হয়", "কিভাবে ডেটা সাজাতে ও রাখতে হয় (Data Structures)", "মেশিন লার্নিং", "ওয়েব ডেভেলপমেন্ট"]'::jsonb, 1, 1);

  -- ================================================================================================
  -- MODULE 4: CONTROL FLOW & FUNCTIONS
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 4: Control Flow & Functions', 'control-flow-functions', 4, 'Mastering logic, automation (loops), and creating your own tools (functions).')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M4-L16: If / The Logic Gate
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '16. The Logic Gate (If / Else)', 'if-else', 1, 
  $markdown$
# Module 4 Overview
এখন আমরা R কে সিদ্ধান্ত নিতে শেখাবো। "যদি বৃষ্টি হয়, তবে ছাতা নাও"—এই লজিক কম্পিউটারকে বোঝানোই হলো Control Flow। এবং আমরা নিজেদের মেশিন (Function) বানানো শিখবো!

# Lesson 16: If, Else If, Else

জীবনের মতো কোডিংয়েও আমাদের শর্তের ওপর ভিত্তি করে কাজ করতে হয়। একে বলে **Conditional Logic**।

### Step 1: The Simple 'If'
"যদি" শর্ত পূরণ হয়, তবেই কোড রান করবে।

**R Code:**
```r
temp <- 35

if (temp > 30) {
  print("It is very hot today!") 
}
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: The 'Else' (অথবা)
যদি শর্ত পূরণ না হয়, তবে কি করবে?

**R Code:**
```r
temp <- 25

if (temp > 30) {
  print("Hot Day")
} else {
  print("Pleasant Day")
}
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 3: Multiple Conditions (Else If)
যখন অনেকগুলো শর্ত থাকে।

**R Code:**
```r
marks <- 75

if (marks >= 80) {
  print("Grade: A+")
} else if (marks >= 70) {
  print("Grade: A")
} else {
  print("Grade: Pass")
}
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `if`: শর্ত চেক করে।
- `else`: শর্ত না মিললে কি হবে তা বলে।
- `{ }` এর ভেতরে কোড লিখতে হয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M4-L16
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'শর্ত চেক করার জন্য কোন কি-ওয়ার্ড (Keyword) ব্যবহার করা হয়?', 'শর্ত চেক করার জন্য কোন কি-ওয়ার্ড (Keyword) ব্যবহার করা হয়?', '["check", "if", "when", "condition"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'যদি if এর শর্ত মিথ্যা হয়, তবে কোন ব্লকটি কাজ করবে?', 'যদি if এর শর্ত মিথ্যা হয়, তবে কোন ব্লকটি কাজ করবে?', '["then", "else", "stop", "exit"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'একাধিক শর্ত চেক করতে কোনটি লাগে?', 'একাধিক শর্ত চেক করতে কোনটি লাগে?', '["else if", "maybe", "or", "and"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'if (10 > 5) print("Yes") else print("No") - আউটপুট কি?', 'if (10 > 5) print("Yes") else print("No") - আউটপুট কি?', '["Yes", "No", "Error", "10"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোড লেখার ব্লক বা এরিয়া বোঝাতে কোন ব্র্যাকেট ব্যবহার করা হয়?', 'কোড লেখার ব্লক বা এরিয়া বোঝাতে কোন ব্র্যাকেট ব্যবহার করা হয়?', '["( )", "[ ]", "{ }", "< >"]'::jsonb, 2, 2);


  -- M4-L17: Loops
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '17. Loops (Automation)', 'loops', 2, 
  $markdown$
# Lesson 17: Loops (For, While)

লুপ (Loop) হলো কোডিংয়ের রোবট। একই কাজ বারবার করার জন্য লুপ ব্যবহার করা হয়। ধরুন আপনাকে ১০০ বার "Sorry" লিখতে হবে। আপনি কি ১০০ বার টাইপ করবেন? নাকি লুপ চালাবেন?

### Step 1: For Loop (সবচেয়ে জনপ্রিয়)
যখন আমরা জানি কতবার ঘুরতে হবে।

**R Code:**
```r
# ১ থেকে ৫ পর্যন্ত প্রিন্ট করা
for (i in 1:5) {
  print(paste("Loop Number:", i))
}
```
*Note: `paste()` ফাংশন টেক্সট এবং সংখ্যা জোড়া লাগায়।*

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: While Loop
যতক্ষণ শর্ত সত্য থাকবে, ততক্ষণ চলবে। (সাবধান! শর্ত কখনো মিথ্যা না হলে এটি আজীবন চলতে থাকবে—একে বলে Infinite Loop)।

**R Code:**
```r
fuel <- 5

while (fuel > 0) {
  print(paste("Driving... Fuel left:", fuel))
  fuel <- fuel - 1  # ফুয়েল ১ কমালাম, নইলে লুপ থামবে না
}
print("Fuel Empty! Stop.")
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 3: Loop over Vector
আমরা ভেক্টরের ডেটা একে একে প্রসেস করতে লুপ ব্যবহার করি।

**R Code:**
```r
crops <- c("Rice", "Wheat", "Jute")

for (crop in crops) {
  print(paste("I am growing:", crop))
}
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- **For Loop:** নির্দিষ্ট সংখ্যক বার চলে।
- **While Loop:** শর্ত পূরণ না হওয়া পর্যন্ত চলে।
- **Infinite Loop:** যা কখনো থামে না (এড়িয়ে চলুন)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M4-L17
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'একই কাজ বারবার করার জন্য কি ব্যবহার করা হয়?', 'একই কাজ বারবার করার জন্য কি ব্যবহার করা হয়?', '["If condition", "Loop", "Vector", "Matrix"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'যে লুপ কখনো থামে না তাকে কি বলে?', 'যে লুপ কখনো থামে না তাকে কি বলে?', '["Super Loop", "Infinite Loop", "Mega Loop", "Bad Loop"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'for (x in 1:3) print(x) - এটি কতবার প্রিন্ট করবে?', 'for (x in 1:3) print(x) - এটি কতবার প্রিন্ট করবে?', '[" ১ বার", "২ বার", "৩ বার", "৪ বার"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'paste() ফাংশনের কাজ কি?', 'paste() ফাংশনের কাজ কি?', '["কপি পেস্ট করা", "টেক্সট জোড়া লাগানো", "কালার করা", "প্রিন্ট করা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'While loop কখন থামে?', 'While loop কখন থামে?', '["যখন ইউজার স্পেস চাপে", "শর্ত মিথ্যা (FALSE) হলে", "শর্ত সত্য (TRUE) হলে", "৫ মিনিট পর"]'::jsonb, 1, 1);


  -- M4-L18: Writing Functions
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '18. Creating Your Own Functions', 'custom-functions', 3, 
  $markdown$
# Lesson 18: Writing Your Own Functions

এতদিন আমরা R এর বানানো ফাংশন (`mean`, `print`, `sum`) ব্যবহার করেছি। এখন আমরা **নিজেরা ফাংশন বা মেশিন বানাবো**!
ফাংশন হলো জুস মেশিনের মতো—ফল (Input) দেবেন, জুস (Output) বের হবে।

### Step 1: Basic Function Structure
ফাংশন বানানোর নিয়ম:
`Function_Name <- function(Parameters) { Body }`

**R Code (A Greeting Machine):**
```r
say_hello <- function(name) {
  print(paste("Assalamu Alaikum,", name))
}

# মেশিন কল করা
say_hello("Hasan")
say_hello("Mita")
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Function that Returns Value
কিছু মেশিন রেজাল্ট ফেরত দেয় (Retrun), যা আমরা অন্য কাজে লাগাতে পারি।

**R Code (Area Calculator):**
```r
calc_field_area <- function(length, width) {
  area <- length * width
  return(area)
}

# ব্যবহার
my_field <- calc_field_area(50, 20)
print(my_field)
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `function()` কি-ওয়ার্ড দিয়ে ফাংশন বানাতে হয়।
- `return()` দিয়ে ফলাফল ফেরত পাঠানো হয়।
- একবার ফাংশন বানিয়ে আমরা হাজার বার ব্যবহার করতে পারি (Code Reusability)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M4-L18
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ফাংশন তৈরির কি-ওয়ার্ড কি?', 'ফাংশন তৈরির কি-ওয়ার্ড কি?', '["def", "fun", "function", "create"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ফাংশন থেকে ফলাফল ফেরত পাওয়ার জন্য কোনটি ব্যবহৃত হয়?', 'ফাংশন থেকে ফলাফল ফেরত পাওয়ার জন্য কোনটি ব্যবহৃত হয়?', '["send()", "return()", "back()", "output()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ফাংশনের সুবিধা কি?', 'ফাংশনের সুবিধা কি?', '["কোড বারবার লিখতে হয় না (Reusability)", "কম্পিউটার ফাস্ট হয়", "মেমোরি সেভ হয়", "সবগুলোই"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ফাংশনে ইনপুট হিসেবে যা দেওয়া হয় তাকে কি বলে?', 'ফাংশনে ইনপুট হিসেবে যা দেওয়া হয় তাকে কি বলে?', '["Result", "Parameter / Argument", "Output", "Return"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'একটি ফাংশন কতবার ব্যবহার করা যায়?', 'একটি ফাংশন কতবার ব্যবহার করা যায়?', '["একবার", "দুইবার", "যতবার খুশি", "১০ বার"]'::jsonb, 2, 2);


  -- M4-L19: Scope
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '19. Scope (Local vs Global)', 'scope', 4, 
  $markdown$
# Lesson 19: Variable Scope (Global vs Local)

কোডিং জগতে "এলাকা" বা Scope খুব গুরুত্বপূর্ণ।
দুই ধরণের ভেরিয়েবল আছে:
১. **Global Variable:** যা সবার (পুরো স্ক্রিপ্টের)।
২. **Local Variable:** যা শুধু ফাংশনের ভেতরের (ব্যক্তিগত)।

### Step 1: The Concept
ফাংশনের ভেতরে তৈরি করা ভেরিয়েবল ফাংশনের বাইরে দেখা যায় না। সে ওই ফাংশনের মধ্যেই মারা যায়।

**R Code:**
```r
# Global (সবার জন্য)
city <- "Mymensingh"

my_func <- function() {
  # Local (শুধু এই মেশিনের ভেতরের)
  secret_code <- 999 
  print(city)         # গ্লোবাল জিনিস ভেতরে এক্সেস করা যায়
  print(secret_code)
}

my_func()

# কিন্তু...
print(secret_code) # এটি ERROR দিবে! কারণ secret_code বাইরে থেকে দেখা যায় না।
```

👉 Now click **Run Code** and try this in our website Simulator (Expect an Error)

### Step 2: Why Scope Matters?
লোকাল ভেরিয়েবল মেমোরি বাঁচায় এবং কনফিউশন কমায়। একই নামের ভেরিয়েবল ভিন্ন ভিন্ন ফাংশনে থাকলে সমস্যা হয় না।

### End of Lesson Summary
- **Global:** ফাংশনের বাইরে তৈরি, সব জায়গা থেকে এক্সেসিবল।
- **Local:** ফাংশনের ভেতরে তৈরি, বাইরে থেকে দেখা যায় না।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M4-L19
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ফাংশনের ভেতরে তৈরি করা ভেরিয়েবলকে কি বলে?', 'ফাংশনের ভেতরে তৈরি করা ভেরিয়েবলকে কি বলে?', '["Global Variable", "Universal Variable", "Local Variable", "Constant"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'লোকাল ভেরিয়েবল কি ফাংশনের বাইরে ব্যবহার করা যায়?', 'লোকাল ভেরিয়েবল কি ফাংশনের বাইরে ব্যবহার করা যায়?', '["হ্যাঁ", "না", "মাঝে মাঝে", "যদি পারমিশন নেওয়া হয়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'গ্লোবাল ভেরিয়েবল কোথায় তৈরি হয়?', 'গ্লোবাল ভেরিয়েবল কোথায় তৈরি হয়?', '["ফাংশনের ভেতরে", "ফাংশনের বাইরে (Main Script)", "কীবোর্ডে", "মনিটরে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Local Scope এর সুবিধা কি?', 'Local Scope এর সুবিধা কি?', '["কোড স্লো করে", "অন্য কোডের সাথে সংঘর্ষ (Conflict) কমায়", "ফাইল সাইজ বাড়ায়", "খারাপ প্র্যাকটিস"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Scope বলতে কি বোঝায়?', 'Scope বলতে কি বোঝায়?', '["ভেরিয়েবলের এলাকা বা দৃশ্যমানতা", "কোডের স্পিড", "কোডের রঙ", "মাইক্রোস্কোপ"]'::jsonb, 0, 0);


  -- M4-L20: Debugging
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '20. Debugging (Fixing Broken Code)', 'debugging', 5, 
  $markdown$
# Lesson 20: Debugging Basics

কোডে ভুল (Bug) থাকা খুবই স্বাভাবিক। ভুল খুঁজে বের করে ঠিক করাকে বলে **Debugging**। 
কৃষিবিদরা যেমন ফসলের রোগ ডিটেক্ট করে চিকিৎসা দেন, প্রোগ্রামাররাও তাই করেন।

### Common Error Types
১. **Syntax Error:** গ্রামার ভুল (যেমন ব্র্যাকেট মিসিং)। কোড রানই করবে না।
   - *Example:* `print("Hello"` (Missing closing bracket)
   
২. **Runtime Error:** রান করার সময় ক্র্যাশ করে।
   - *Example:* `5 + "Ten"` (সংখ্যা ও টেক্সট যোগ করা অসম্ভব)

৩. **Logical Error:** কোড রান করে কিন্তু ভুল রেজাল্ট দেয়। (সবচেয়ে ভয়ানক!)
   - *Example:* গড় বের করতে গিয়ে যোগের বদলে গুণ করে ফেলা।

### Step 1: Read the Red Message
R যখন লাল রঙের এরর মেসেজ দেয়, ভয় পাবেন না। সেটি পড়ুন। R আপনাকে বলার চেষ্টা করছে কোথায় ব্যথা।

**R Code (Try to fix it):**
```r
# এই কোডে এরর আছে
numbers <- c(10, 20, 30)
mean_val <- mean(Numbers) # ভেরিয়েবলের নাম লক্ষ্য করুন
print(mean_val)
```
*Hint: R Case Sensitive. `numbers` এবং `Numbers` আলাদা।*

👉 Now click **Run Code** and try to Check & Fix.

### Step 2: Use Print Debugging
কোডের মাঝে মাঝে `print()` দিয়ে চেক করুন ডেটা ঠিক আছে কিনা।

**R Code:**
```r
x <- 10
print(paste("Current value of x:", x)) # Checking

x <- x * 5
print(paste("After multiplying:", x)) # Checking again
```

### End of Lesson Summary
- এরর মেসেজ পড়লে ৮০% সমস্যার সমাধান হয়।
- ছোট হাতের/বড় হাতের অক্ষর চেক করুন।
- ব্র্যাকেট/কোটেশন ঠিক আছে কিনা দেখুন।

অভিনন্দন! আপনি প্রোগ্রামিংয়ের লজিক অংশও শেষ করলেন! এখন আপনার হাতে সুপারপাওয়ার আছে! 🕵️‍♂️🛠️

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M4-L20
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোডের ভুল খুঁজে বের করে ঠিক করাকে কি বলে?', 'কোডের ভুল খুঁজে বের করে ঠিক করাকে কি বলে?', '["Coding", "Hacking", "Debugging", "Testing"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'যে এরর এর কারণে কোড রানই করে না, তাকে কি বলে?', 'যে এরর এর কারণে কোড রানই করে না, তাকে কি বলে?', '["Logical Error", "Syntax Error", "Runtime Error", "Fatal Error"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Logical Error এর বৈশিষ্ট্য কি?', 'Logical Error এর বৈশিষ্ট্য কি?', '["কোড রান করে না", "কম্পিউটার বন্ধ হয়ে যায়", "কোড রান করে কিন্তু ভুল উত্তর দেয়", "লাল মেসেজ দেখায়"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'print() ফাংশন ডিবাগিংয়ে কিভাবে সাহায্য করে?', 'print() ফাংশন ডিবাগিংয়ে কিভাবে সাহায্য করে?', '["কোড মুছে দিয়ে", "কোডের বিভিন্ন ধাপে ভেরিয়েবলের মান দেখিয়ে", "এরর লুকিয়ে রেখে", "কালার চেঞ্জ করে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এরর মেসেজ সাধারণত কোন রঙের হয়?', 'R এরর মেসেজ সাধারণত কোন রঙের হয়?', '["সবুজ", "নীল", "লাল", "কালো"]'::jsonb, 2, 2);

  -- ================================================================================================
  -- MODULE 5: DATA IMPORT & EXPORT
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 5: Data Import & Export', 'import-export', 5, 'Working with real-world data: Reading CSV, Excel, and writing files.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M5-L21: Reading CSV
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '21. Reading CSV Files (read.csv)', 'read-csv', 1, 
  $markdown$
# Module 5 Overview
এখন আমরা "Sandbox" থেকে বের হয়ে বাইরের জগতের ডেটা নিয়ে কাজ করবো। কৃষি গবেষণায় ডেটা সাধারণত এক্সেল বা CSV ফাইলে থাকে। এই মডিউলে আমরা শিখবো কিভাবে সেই ফাইলগুলো R এ ওপেন করতে হয়।

# Lesson 21: Reading CSV Files

**CSV (Comma Separated Values)** হলো ডেটা সায়েন্সের সবচেয়ে জনপ্রিয় ফরম্যাট। এটি হালকা এবং সব সফটওয়্যারে সাপোর্ট করে।

### Step 1: The `read.csv()` Function
R এ বিল্ট-ইন ফাংশন আছে ফাইল পড়ার জন্য।

**R Code:**
```r
# আমাদের সার্ভারে 'crop_data.csv' নামে একটি ফাইল আছে
# সেটি আমরা পড়বো এবং একটি ভেরিয়েবলে রাখবো

my_data <- read.csv("https://raw.githubusercontent.com/insyt/demo-data/main/crop_yield.csv")

# ডেটা ঠিকমতো লোড হলো কিনা দেখতে প্রথম ৫টি লাইন প্রিন্ট করি
head(my_data)
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Understanding Header
বেশিরভাগ ফাইলে প্রথম লাইনে কলামের নাম থাকে (যেমন: Date, Crop, Price)। একে বলে **Header**। R স্বয়ংক্রিয়ভাবে এটি বুঝে নেয়।

**R Code (Check Structure):**
```r
# ডেটার সাইজ এবং টাইপ দেখা
str(my_data)
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `read.csv("filepath")` দিয়ে ফাইল ওপেন করা হয়।
- `head()` দিয়ে প্রথম ৬টি লাইন দেখা যায়।
- `str()` দিয়ে পুরো ডেটাফ্রেমের স্ট্রাকচার দেখা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M5-L21
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'CSV এর পূর্ণরূপ কি?', 'CSV এর পূর্ণরূপ কি?', '["Computer Saved Video", "Comma Separated Values", "Common System Version", "Crop Soil Value"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'CSV ফাইল পড়ার জন্য কোন ফাংশন ব্যবহৃত হয়?', 'CSV ফাইল পড়ার জন্য কোন ফাংশন ব্যবহৃত হয়?', '["read.table()", "load.csv()", "read.csv()", "open.file()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'head() ফাংশন সাধারণত কয়টি লাইন দেখায়?', 'head() ফাংশন সাধারণত কয়টি লাইন দেখায়?', '["১০টি", "১০০টি", "৬টি", "সবগুলো"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ডেটা লোড করার পর স্ট্রাকচার দেখার জন্য কোন ফাংশন সেরা?', 'ডেটা লোড করার পর স্ট্রাকচার দেখার জন্য কোন ফাংশন সেরা?', '["summary()", "str()", "class()", "View()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Header বলতে ফাইলে কি বোঝায়?', 'Header বলতে ফাইলে কি বোঝায়?', '["ফাইলের নাম", "কলামের নাম", "শেষের লাইন", "ফাঁকা লাইন"]'::jsonb, 1, 1);


  -- M5-L22: Reading Excel
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '22. Reading Excel Files (readxl)', 'read-excel', 2, 
  $markdown$
# Lesson 22: Reading Excel Files

যদিও CSV সেরা, কিন্তু বাস্তবে আমাদের বস বা সুপারভাইজাররা **Excel (.xlsx)** ফাইলই পাঠান।
R এ এক্সেল পড়ার জন্য `readxl` প্যাকেজ লাগে।

### Step 1: Install & Load Package
এক্সেল ফাইল পড়ার ক্ষমতা R এর ডিফল্ট ইঞ্জিনে নেই। তাই আমাদের একটি প্লাগিন বা প্যাকেজ ইনস্টল করতে হয়। (আমাদের সিমুলেটরে এটি করাই আছে)।

**R Code:**
```r
# প্যাকেজ লোড করা (লাইব্রেরি থেকে বই বের করার মতো)
library(readxl)

print("Package Loaded Successfully!")
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Read Excel
ফাংশনটির নাম `read_excel()` (মাঝখানে আন্ডারস্কোর)।

**R Code:**
```r
# কাল্পনিক এক্সেল ফাইল পড়া
# data <- read_excel("data.xlsx", sheet = 1)
# print("Excel File Read (Demo Mode)")
```
*Note: সিমুলেটরে এক্সেল ফাইল সাপোর্ট জটিল, তাই আমরা কোডটি দেখালাম। নিজের পিসিতে এটি কাজ করবে।*

### End of Lesson Summary
- এক্সেল পড়ার জন্য `readxl` লাইব্রেরি লাগে।
- ফাংশন: `read_excel("filename", sheet = 1)`।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M5-L22
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'এক্সেল ফাইল পড়ার জন্য কোন প্যাকেজটি জনপ্রিয়?', 'এক্সেল ফাইল পড়ার জন্য কোন প্যাকেজটি জনপ্রিয়?', '["ggplot2", "readxl", "dplyr", "shiny"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'যেকোনো প্যাকেজ ব্যবহারের আগে কি করতে হয়?', 'যেকোনো প্যাকেজ ব্যবহারের আগে কি করতে হয়?', '["ইন্সটল ও লোড (library)", "ডিলিট", "রিনেম", "কিছুই না"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'এক্সেল ফাইলের এক্সটেনশন কোনটি?', 'এক্সেল ফাইলের এক্সটেনশন কোনটি?', '["docx", ".xlsx", ".pdf", ".mp4"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'read_excel ফাংশনে sheet=1 কেন দেওয়া হয়?', 'read_excel ফাংশনে sheet=1 কেন দেওয়া হয়?', '["প্রথম শীট পড়ার জন্য", "সাইজ ১ এমবি বোঝাতে", "১টি কলাম পড়তে", "জানিনা"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'read_excel() ফাংশনে কোন চিহ্ন ব্যবহার করা হয়েছে?', 'read_excel() ফাংশনে কোন চিহ্ন ব্যবহার করা হয়েছে?', '["ডট (.)", "আন্ডারস্কোর (_)", "হাইফেন (-)", "স্পেস"]'::jsonb, 1, 1);


  -- M5-L23: File Paths
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '23. Working Directory & Paths', 'file-paths', 3, 
  $markdown$
# Lesson 23: Where are my files? (Paths)

অনেক সময় কোড সঠিক থাকে, কিন্তু এরর আসে: `"File not found"`। এর কারণ ভুল ঠিকানা বা Path।

### Step 1: Working Directory (বর্তমান লোকেশন)
আপনি এখন কম্পিউটারের কোন ফোল্ডারে আছেন, সেটি জানা জরুরি।

**R Code:**
```r
# Get Working Directory (বর্তমান ফোল্ডার)
getwd()
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Setting Directory
আপনি যদি ফোল্ডার পাল্টাতে চান, তবে `setwd()` ব্যবহার করতে হয়।
*Windows User সাবধান:* উইন্ডোজে পাথে ব্যাকস্ল্যাশ `\` থাকে, কিন্তু R এ ডাবল ব্যাকস্ল্যাশ `\\` অথবা স্ল্যাশ `/` দিতে হয়।

**Example Path (Windows):** `C:\Users\Name\Documents\Data`
**R Path:** `C:/Users/Name/Documents/Data`

### End of Lesson Summary
- `getwd()`: আমি কোথায় আছি?
- `setwd()`: আমি কোথায় যেতে চাই?
- পাথে স্ল্যাশ `/` ব্যবহার করবেন।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M5-L23
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বর্তমান ফোল্ডারের লোকেশন দেখার ফাংশন কোনটি?', 'বর্তমান ফোল্ডারের লোকেশন দেখার ফাংশন কোনটি?', '["pwd()", "getwd()", "where()", "location()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Working Directory সেট করার ফাংশন কোনটি?', 'Working Directory সেট করার ফাংশন কোনটি?', '["setwd()", "setpath()", "godir()", "chdir()"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ উইন্ডোজ পাথ লেখার সঠিক নিয়ম কোনটি?', 'R এ উইন্ডোজ পাথ লেখার সঠিক নিয়ম কোনটি?', '["C:\\Folder", "C:/Folder", "C-Folder", "C_Folder"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'File not found এরর কেন হয়?', 'File not found এরর কেন হয়?', '["ফাইল করাপ্ট হলে", "ভুল পাথ বা নামের কারণে", "ইন্টারনেট না থাকলে", "RStudio নষ্ট হলে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'wd এর পূর্ণরূপ কি?', 'wd এর পূর্ণরূপ কি?', '["Wide Data", "Working Directory", "Wrong Decision", "Web Development"]'::jsonb, 1, 1);


  -- M5-L24: Writing Files
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '24. Saving Your Data (Export)', 'writing-files', 4, 
  $markdown$
# Lesson 24: Saving Files

কাজ শেষে আমাদের ক্লিন ডেটা বা ফলাফল সেভ করতে হবে। একে বলে **Exporting**।

### Step 1: Write to CSV
আমরা `write.csv()` ব্যবহার করে যেকোনো ডেটা ফ্রেমকে CSV ফাইল হিসেবে সেভ করতে পারি।

**R Code:**
```r
# একটি ডামি ডেটা ফ্রেম বানাই
results <- data.frame(
  Student = c("A", "B", "C"),
  Score = c(95, 88, 92)
)

# এখন এটি সেভ করবো (row.names = FALSE দেওয়া ভালো, নাহলে ১,২,৩ নাম্বারিং সেভ হয়ে যায়)
# write.csv(results, "final_results.csv", row.names = FALSE)

print("File would be saved as 'final_results.csv'")
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `write.csv(data, "filename.csv")` দিয়ে ফাইল সেভ করা হয়।
- `row.names = FALSE` দিলে বাড়তি কলাম তৈরি হয় না।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M5-L24
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'CSV ফাইল সেভ করার ফাংশন কোনটি?', 'CSV ফাইল সেভ করার ফাংশন কোনটি?', '["save.csv()", "export.csv()", "write.csv()", "print.csv()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'প্রথম প্যারামিটার হিসেবে কি দিতে হয়?', 'প্রথম প্যারামিটার হিসেবে কি দিতে হয়?', '["ফাইলের নাম", "যে ডেটা ফ্রেম সেভ করবো", "ফোল্ডারের নাম", "তারিখ"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'row.names = FALSE কেন ব্যবহার করা হয়?', 'row.names = FALSE কেন ব্যবহার করা হয়?', '["ফাইল ছোট করার জন্য", "বাড়তি ইনডেক্স কলাম বাদ দেওয়ার জন্য", "স্পিড বাড়ানোর জন্য", "কালার করার জন্য"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ফাইল কোথায় সেভ হয়?', 'ফাইল কোথায় সেভ হয়?', '["ডেস্কটপে", "Working Directory তে", "ডাউনলোড ফোল্ডারে", "হারিয়ে যায়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Export মানে কি?', 'Export মানে কি?', '["ফাইল ওপেন করা", "ফাইল সেভ করা বা বের করা", "ফাইল ডিলিট করা", "ফাইল প্রিন্ট করা"]'::jsonb, 1, 1);


  -- M5-L25: Web Data & Large Files
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '25. Reading from Web & Large Data', 'web-data', 5, 
  $markdown$
# Lesson 25: Reading from Web & Tips

### Part 1: Reading directly from URL
আপনার ডেটা যদি গিটহাব বা কোনো ওয়েবসাইটে থাকে (CSV ফরম্যাটে), তবে ডাউনলোড না করেও সরাসরি লিংক দিয়ে পড়া যায়!

**R Code:**
```r
url <- "https://raw.githubusercontent.com/insyt/demo-data/main/weather_bau.csv"
weather <- read.csv(url)
head(weather)
```

👉 Now click **Run Code** and try this in our website Simulator

### Part 2: Working with Large Data (`data.table`)
যখন লাখ লাখ ডেটা থাকে (যেমন ১০ বছরের আবহাওয়ার ডেটা), তখন সাধারণ `read.csv` স্লো হতে পারে। তখন আমরা `data.table` বা `fread()` ব্যবহার করি। এটি রকেটের মতো ফাস্ট!

**R Code:**
```r
library(data.table)
# fread = Fast Read
# data <- fread("huge_file.csv")
print("fread is super fast for big data!")
```

### End of Module Summary
আমরা এখন ফাইল ওপেন করতে পারি, সেভ করতে পারি এবং ফোল্ডার চিনতে পারি। আপনি এখন নিজের ডেটা দিয়ে অ্যানালাইসিস শুরু করতে পারবেন!

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M5-L25
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ইন্টারনেট থেকে সরাসরি ডেটা পড়ার জন্য কি দরকার?', 'ইন্টারনেট থেকে সরাসরি ডেটা পড়ার জন্য কি দরকার?', '["পাসওয়ার্ড", "সরাসরি ফাইলের লিংক (URL)", "ভিপিএন", "টাকা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বিশাল বড় ডেটা ফাস্ট পড়ার জন্য কোন ফাংশন সেরা?', 'বিশাল বড় ডেটা ফাস্ট পড়ার জন্য কোন ফাংশন সেরা?', '["read.csv()", "scan()", "fread()", "slow()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'fread() কোন প্যাকেজের অংশ?', 'fread() কোন প্যাকেজের অংশ?', '["dplyr", "data.table", "base", "stats"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'লিংক থেকে পড়ার সময় লিংকটি কিসের মধ্যে রাখতে হয়?', 'লিংক থেকে পড়ার সময় লিংকটি কিসের মধ্যে রাখতে হয়?', '["ব্র্যাকেটে", "কোটেশনে", "হ্যাশট্যাগে", "কিছুতে না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Module 5 শেষে আমরা কি শিখলাম?', 'Module 5 শেষে আমরা কি শিখলাম?', '["লুপ চালানো", "ফাংশন বানানো", "ডেটা ইম্পোর্ট ও এক্সপোর্ট", "গ্রাফ আঁকা"]'::jsonb, 2, 2);

  -- ================================================================================================
  -- MODULE 6: DATA CLEANING & WRANGLING (dplyr, tidyr)
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 6: Data Cleaning & Wrangling', 'data-wrangling', 6, 'Mastering the Tidyverse: dplyr, tidyr, and the art of data manipulation.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M6-L26: Intro Tidyverse
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '26. Intro to Tidyverse & The Pipe (%>%)', 'tidyverse-intro', 1, 
  $markdown$
# Module 6 Overview
ডেটা সায়েন্সের ৮০% সময় যায় ডেটা পরিষ্কার করতে। R এ এই কাজ সহজ করার জন্য আছে **tidyverse**। এটি আধুনিক R এর প্রাণ।

# Lesson 26: Tidyverse & The Pipe Operator

### Step 1: The Pipe Operator (`%>%`)
এর মানে হলো "এবং তারপর" (And Then)। এটি কোড পড়াকে সহজ করে।
আমরা আগের মত `f(x)` না লিখে লিখবো `x %>% f()`।

**R Code:**
```r
library(dplyr)

# সাধারণ পদ্ধতি (Old School)
# log(sqrt(100))

# Pipe পদ্ধতি (Modern)
100 %>% 
  sqrt() %>% 
  log()
```
*Tip: `Ctrl + Shift + M` দিয়ে পাইপ অপারেটর লেখা যায়।*

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Select & Filter
- `select()`: কলাম বেছে নেয়।
- `filter()`: সারি বা ডেটা বেছে নেয়।

**R Code:**
```r
# ডামি ডেটা
df <- data.frame(Name = c("Abul", "Babul", "Kabul"), Age = c(20, 25, 22), GPA = c(3.5, 3.8, 2.9))

# আমরা শুধু নাম এবং জিপিএ চাই, যাদের বয়স ২২ এর বেশি
clean_data <- df %>%
  filter(Age > 22) %>%
  select(Name, GPA)

print(clean_data)
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- Tidyverse কোড লেখাকে গল্পের মতো সহজ করে দেয়।
- `%>%` মানে "এরপর"।
- `filter` দিয়ে রো এবং `select` দিয়ে কলাম বাছা হয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M6-L26
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Tidyverse এর মূল দর্শন কি?', 'Tidyverse এর মূল দর্শন কি?', '["কোড জটিল করা", "কোডকে মানুষের পড়ার উপযোগী (Human Readable) করা", "পুরানো স্টাইল ব্যবহার করা", "শুধু গ্রাফ আঁকা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '%>% অপারেটরকে কি বলে?', '%>% অপারেটরকে কি বলে?', '["Arrow", "Pipe Operator", "Chain", "Connector"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'DataFrame থেকে নির্দিষ্ট কলাম বেছে নিতে কোনটি ব্যবহৃত হয়?', 'DataFrame থেকে নির্দিষ্ট কলাম বেছে নিতে কোনটি ব্যবহৃত হয়?', '["filter()", "arrange()", "select()", "pull()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Filter() ফাংশনের কাজ কি?', 'Filter() ফাংশনের কাজ কি?', '["কলাম বাদ দেওয়া", "শর্ত সাপেক্ষে সারি (Row) বা ডেটা সিলেক্ট করা", "নাম চেঞ্জ করা", "রঙ করা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Pipe অপারেটর লেখার শর্টকাট কি?', 'Pipe অপারেটর লেখার শর্টকাট কি?', '["Ctrl+C", "Ctrl+Shift+M", "Alt+Shift+K", "Ctrl+P"]'::jsonb, 1, 1);


  -- M6-L27: Mutate
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '27. Creating New Columns (mutate)', 'mutate', 2, 
  $markdown$
# Lesson 27: Mutate & Transmute

আমাদের প্রায়ই ডেটা কলামের ওপর অংক করে নতুন কলাম বানাতে হয়। যেমন: ফলন (কেজি) থেকে ফলন (টন) এ নেওয়া। এর জন্য `mutate()` ব্যবহার করা হয়।

### Step 1: Mutate (Add new, keep old)
এটি নতুন কলাম যোগ করে এবং পুরানোগুলো রেখে দেয়।

**R Code:**
```r
library(dplyr)
df <- data.frame(Crop = c("Rice", "Wheat"), Yield_Kg = c(5000, 4000))

# কেজি কে টনে কনভার্ট করা (1000 kg = 1 ton)
df_new <- df %>%
  mutate(Yield_Ton = Yield_Kg / 1000)

print(df_new)
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Transmute (Keep only new)
আপনি যদি শুধু নতুন কলামটি রাখতে চান এবং বাকি সব ফেলে দিতে চান।

**R Code:**
```r
df_only_ton <- df %>%
  transmute(Yield_Ton = Yield_Kg / 1000)

print(df_only_ton)
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `mutate()`: কলাম যোগ করে।
- `transmute()`: শুধু নতুন কলাম রাখে।
- গাণিতিক কাজের জন্য এগুলো সেরা।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M6-L27
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বিদ্যমান কলাম ব্যবহার করে নতুন কলাম তৈরির ফাংশন কোনটি?', 'বিদ্যমান কলাম ব্যবহার করে নতুন কলাম তৈরির ফাংশন কোনটি?', '["add_col()", "mutate()", "create()", "append()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'mutate এবং transmute এর পার্থক্য কি?', 'mutate এবং transmute এর পার্থক্য কি?', '["কোনো পার্থক্য নেই", "mutate সব কলাম রাখে, transmute শুধু নতুনগুলো রাখে", "transmute ফাস্ট কাজ করে", "mutate শুধু টেক্সটে কাজ করে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'mutate() কি মেইন ডেটা ফ্রেমের ডেটা পার্মানেন্টলি চেঞ্জ করে?', 'mutate() কি মেইন ডেটা ফ্রেমের ডেটা পার্মানেন্টলি চেঞ্জ করে?', '["হ্যাঁ", "না, যতক্ষণ না নতুন ভেরিয়েবলে সেভ করা হয়", "মাঝে মাঝে", "সব ডিলিট করে দেয়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Yield_kg থেকে Yield_ton বের করতে কোন গানিতিক অপারেশন লাগবে?', 'Yield_kg থেকে Yield_ton বের করতে কোন গানিতিক অপারেশন লাগবে?', '["গুণ", "ভাগ (/1000)", "যোগ", "বিয়োগ"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'df %>% mutate(x = 10) কি করবে?', 'df %>% mutate(x = 10) কি করবে?', '["একটি নতুন কলাম x যোগ করবে যার সব মান ১০", "x নামে কলাম ডিলিট করবে", "১০ নম্বর রো দেখাবে", "এরর দিবে"]'::jsonb, 0, 0);


  -- M6-L28: Group By Summarise
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '28. Group By & Summarise', 'groupby-summarise', 3, 
  $markdown$
# Lesson 28: Group By & Summarise

এটি Tidyverse এর সবচেয়ে শক্তিশালী ফিচার। একে বলা হয় **Split-Apply-Combine** স্ট্র্যাটেজি।
যেমন: "প্রতিটি ধানের জাতের গড় ফলন কত?"

### Step 1: The Duo (Group_by + Summarise)
এরা সবসময় একসাথে কাজ করে।

**R Code:**
```r
library(dplyr)
# ডামি ডেটা
harvest <- data.frame(
  Variety = c("BR-28", "BR-28", "BR-29", "BR-29"),
  Yield = c(40, 42, 50, 55)
)

# জাত অনুযায়ী গড় ফলন বের করা
summary_table <- harvest %>%
  group_by(Variety) %>%
  summarise(
    Avg_Yield = mean(Yield),
    Total_Samples = n()
  )

print(summary_table)
```
*Note: `n()` ফাংশন গুনতে সাহায্য করে।*

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `group_by()`: ডেটাকে গ্রুপে ভাগ করে।
- `summarise()`: প্রতি গ্রুপের জন্য সামারি (গড়, মোট) তৈরি করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M6-L28
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'group_by() এর কাজ কি?', 'group_by() এর কাজ কি?', '["ডেটা ডিলিট করা", "ডেটাকে ক্যাটাগরি অনুযায়ী ভাগ করা", "গ্রাফ আঁকা", "সাজানো"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'summarise() এর কাজ কি?', 'summarise() এর কাজ কি?', '["পুরো ডেটা দেখানো", "সামারি স্ট্যাটিসটিকস (গড়, মোট) তৈরি করে নতুন ছোট টেবিল বানানো", "ডিটেইলস রিপোর্ট করা", "কিছু না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'n() ফাংশন কি করে?', 'n() ফাংশন কি করে?', '["নতুন রো যোগ করে", "সংখ্যা বা কাউন্ট (Count) রিটার্ন করে", "নাল ভ্যালু দেয়", "নাম্বার প্রিন্ট করে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'group_by এবং summarise সাধারণত কিভাবে ব্যবহৃত হয়?', 'group_by এবং summarise সাধারণত কিভাবে ব্যবহৃত হয়?', '["আলাদা আলাদা", "একসাথে (জোড়ায়)", "mutate এর সাথে", "select এর সাথে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'গড় বের করার জন্য summarise এর ভেতরে কোন ফাংশন ব্যবহার করবেন?', 'গড় বের করার জন্য summarise এর ভেতরে কোন ফাংশন ব্যবহার করবেন?', '["sum()", "mean()", "avg()", "count()"]'::jsonb, 1, 1);


  -- M6-L29: Handling NA & Reshaping
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '29. Missing Values & Reshaping', 'na-reshaping', 4, 
  $markdown$
# Lesson 29: Handling Missing Data

বাস্তব ডেটা কখনো নিখুঁত হয় না। অনেক সময় মান মিসিং থাকে, যাকে R এ `NA` (Not Available) বলা হয়।

### Part 1: Handling NA
`NA` থাকলে গড়ের হিসাব `NA` আসবে। তাই আমাদের `na.rm = TRUE` ব্যবহার করতে হয় অথবা `NA` বাদ দিতে হয়।

**R Code:**
```r
x <- c(10, 20, NA, 40)

# ভুল পদ্ধতি
print(mean(x)) # রেজাল্ট NA আসবে

# সঠিক পদ্ধতি
print(mean(x, na.rm = TRUE))

# NA যুক্ত সারি মুছে ফেলা
clean_x <- na.omit(x)
print(clean_x)
```

👉 Now click **Run Code** and try this in our website Simulator

### Part 2: Reshaping (Pivot)
কখনো আমাদের ডেটা "প্রশস্ত" (Wide) হয়, আবার কখনো "লম্বা" (Long) করতে হয়।
- `pivot_longer()`
- `pivot_wider()`

**R Code:**
```r
library(tidyr)
# Wide Data (মানুষের পড়তে সুবিধা)
wide_df <- data.frame(Month = "Jan", Min_Temp = 10, Max_Temp = 25)

# Long Data (কম্পিউটারের সুবিধা)
long_df <- wide_df %>%
  pivot_longer(cols = c("Min_Temp", "Max_Temp"), names_to = "Type", values_to = "Temp")

print(long_df)
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `NA` মানে ডেটা মিসিং। `na.rm = TRUE` ব্যবহার করুন।
- `pivot_longer` ডেটা লম্বা করে (টাইডি ফরম্যাট)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M6-L29
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ মিসিং ভ্যালুকে কি দিয়ে প্রকাশ করা হয়?', 'R এ মিসিং ভ্যালুকে কি দিয়ে প্রকাশ করা হয়?', '["NULL", "0", "NA (Not Available)", "Empty"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'গড় করার সময় NA বাদ দিতে কোন প্যারামিটার লাগে?', 'গড় করার সময় NA বাদ দিতে কোন প্যারামিটার লাগে?', '["no.na = TRUE", "na.rm = TRUE", "rm.na = YES", "delete.na"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Wide ডেটাকে Long ডেটায় রূপান্তর করার ফাংশন কোনটি?', 'Wide ডেটাকে Long ডেটায় রূপান্তর করার ফাংশন কোনটি?', '["make_long()", "pivot_longer()", "gather()", "melt()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ডেটা সায়েন্সে কোন ফরম্যাটটি এনালাইসিসের জন্য ভালো?', 'ডেটা সায়েন্সে কোন ফরম্যাটটি এনালাইসিসের জন্য ভালো?', '["Wide Format", "Long / Tidy Format", "Messy Format", "Zip Format"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'na.omit() কি করে?', 'na.omit() কি করে?', '["NA ভ্যালুগুলোকে ০ বানিয়ে দেয়", "যেসব সারিতে NA আছে তা পুরোটা ডিলিট করে দেয়", "NA ঠিক করে দেয়", "ওয়ার্নিং দেয়"]'::jsonb, 1, 1);


  -- M6-L30: Joins
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '30. Joins (Merging Datasets)', 'joins', 5, 
  $markdown$
# Lesson 30: Joins (Connecting Data)

আমাদের কাছে সাধারণত একাধিক টেবিল থাকে। যেমন একটিতে ছাত্রের নাম, আরেকটিতে পরীক্ষার রেজাল্ট। এই দুটি টেবিল জোড়া লাগানোর নাম **Join**।

### Types of Joins
১. **Left Join (সবচেয়ে সেফ):** বাম দিকের সব রাখবে, ডান দিকের মিলগুলো আনবে।
২. **Inner Join:** শুধু মিলগুলো রাখবে।
৩. **Full Join:** সব রাখবে।

### Step 1: Left Join Example

**R Code:**
```r
library(dplyr)

students <- data.frame(ID = 1:3, Name = c("A", "B", "C"))
scores <- data.frame(ID = 1:2, Marks = c(80, 90)) # ছাত্র ৩ এর মার্কস নেই

# জোড়া লাগানো
combined <- left_join(students, scores, by = "ID")

print(combined)
# দেখুন ছাত্র C এর মার্কস NA এসেছে, কিন্তু সে হারিয়ে যায়নি।
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `left_join`: মেইন টেবিলের সব তথ্য ঠিক রাখে।
- `by = "Common_Column"` দিয়ে বলে দিতে হয় কিসের ভিত্তিতে জোড়া লাগবে।

অভিনন্দন! আপনি ডেটা ক্লিনিং এবং ম্যানিপুলেশন মাস্টারি অর্জন করেছেন। 🧹📊

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M6-L30
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'দুটি ভিন্ন টেবিল জোড়া লাগানোর পদ্ধতিকে কি বলে?', 'দুটি ভিন্ন টেবিল জোড়া লাগানোর পদ্ধতিকে কি বলে?', '["Attach", "Join", "Merge", "Link"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোন Join এ বাম দিকের টেবিলের সব ডেটা সংরক্ষিত থাকে?', 'কোন Join এ বাম দিকের টেবিলের সব ডেটা সংরক্ষিত থাকে?', '["Right Join", "Inner Join", "Left Join", "Outer Join"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Join করার জন্য দুটি টেবিলে কি থাকতে হবে?', 'Join করার জন্য দুটি টেবিলে কি থাকতে হবে?', '["একই সংখ্যক রো", "কমন কলাম (Key/ID)", "একই নাম", "একই কালার"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'যদি ডান দিকের টেবিলে তথ্য না থাকে, তবে Left Join এ কি আসবে?', 'যদি ডান দিকের টেবিলে তথ্য না থাকে, তবে Left Join এ কি আসবে?', '["0", "Error", "NA", "False"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Inner Join কি করে?', 'Inner Join কি করে?', '["সব ডেটা রাখে", "শুধু কমন (যেগুলো দুই টেবিলেই আছে) ডেটা রাখে", "র‍্যান্ডমলি সিলেক্ট করে", "ডুপ্লিকেট করে"]'::jsonb, 1, 1);

  -- ================================================================================================
  -- MODULE 7: DATA VISUALIZATION (ggplot2)
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 7: Data Visualization', 'data-visualization', 7, 'The Art of Data Science: Creating publication-quality graphs with ggplot2.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M7-L31: Base R vs ggplot2
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '31. The Grammar of Graphics (ggplot2)', 'ggplot2-intro', 1, 
  $markdown$
# Module 7 Overview
একটি ছবি হাজার শব্দের সমান। ডেটা সায়েন্সের সবচেয়ে মজার পার্ট হলো **Data Visualization**।
আমরা শিখবো **ggplot2**, যা বিশ্বের সবচেয়ে শক্তিশালী এবং সুন্দর গ্রাফিক্স সিস্টেমগুলোর একটি।

# Lesson 31: Base R vs ggplot2

R এ ছবি আঁকার দুটি উপায় আছে:
১. **Base R:** সহজ, দ্রুত কিন্তু দেখতে তেমন সুন্দর না।
২. **ggplot2:** একটু কঠিন, কিন্তু প্রফেশনাল এবং কাস্টমাইজেবল।

### Why ggplot2?
একে বলা হয় **Grammar of Graphics**। আমরা যেমন শব্দ দিয়ে বাক্য বানাই, তেমনি `ggplot2` লেয়ার (Layer) দিয়ে গ্রাফ বানায়।
- **Data:** কোন ডেটা দেখবো?
- **Aesthetics (aes):** x এবং y অক্ষে কি থাকবে? রঙ কি হবে?
- **Geometries (geom):** বার চার্ট হবে নাকি লাইন চার্ট?

### Compare the Code

**1. Base R Plot:**
```r
x <- c(1, 2, 3, 4, 5)
y <- c(10, 20, 15, 25, 30)

plot(x, y, type="l", col="blue", main="Base R Plot")
```

**2. ggplot2 Plot:**
```r
library(ggplot2)
df <- data.frame(x=x, y=y)

ggplot(df, aes(x=x, y=y)) + 
  geom_line(color="red", size=2) +
  geom_point(size=4) +
  ggtitle("My First ggplot") +
  theme_minimal()
```

👉 **Run Code** করে দুটির পার্থক্য দেখুন। ২য় টি দেখতে অনেক বেশি মডার্ন, তাই না?

### End of Lesson Summary
- আমরা আজীবন `ggplot2` ব্যবহার করবো।
- গ্রাফ আঁকা হয় লেয়ার বাই লেয়ার (`+` চিহ্ন দিয়ে)।
- `aes()` এর ভেতরে ভেরিয়েবল সেট করতে হয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M7-L31
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ggplot2 এর পূর্ণরূপ কোনটি?', 'ggplot2 এর পূর্ণরূপ কোনটি?', '["Grammar of Graphics Plot 2", "Great Google Plot 2", "Good Graph Plot", "General Graph Plot"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ggplot2 এ গ্রাফের লেয়ার যোগ করতে কোন চিহ্ন ব্যবহৃত হয়?', 'ggplot2 এ গ্রাফের লেয়ার যোগ করতে কোন চিহ্ন ব্যবহৃত হয়?', '["%>%", "+", "&", "$"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'aes() এর কাজ কি?', 'aes() এর কাজ কি?', '["রঙ করা", "এক্সিস (x, y) এবং অন্যান্য ভিজ্যুয়াল প্রপার্টি ঠিক করা", "ডেটা সেভ করা", "কিছুই না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Base R এবং ggplot2 এর প্রধান পার্থক্য কি?', 'Base R এবং ggplot2 এর প্রধান পার্থক্য কি?', '["Base R ফাস্ট কিন্তু সিম্পল, ggplot2 সুন্দর এবং লেয়ার-ভিত্তিক", "Base R ভালো", "ggplot2 টাকা দিয়ে কিনতে হয়", "কোনো পার্থক্য নেই"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'geom_line() কি আঁকে?', 'geom_line() কি আঁকে?', '["বার চার্ট", "লাইন চার্ট", "পয়েন্ট", "বক্সপ্লট"]'::jsonb, 1, 1);


  -- M7-L32: The Big Three (Scatter, Bar, Line)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '32. Essential Plots: Scatter, Bar, & Line', 'basic-plots', 2, 
  $markdown$
# Lesson 32: The Big Three Plots

ডেটা সায়েন্সের ৯০% কাজ এই ৩টি প্লট দিয়ে হয়ে যায়।
আসুন `iris` ডেটাবেস ব্যবহার করে এগুলো শিখি (R এর ভেতরেই এটি আছে)।

### 1. Scatter Plot (সম্পর্ক দেখার জন্য)
দুটি সংখ্যার মধ্যে সম্পর্ক দেখতে ব্যবহার হয়। যেমন: উচ্চতা বাড়লে ওজন বাড়ে কিনা।
ফাংশন: `geom_point()`

**R Code:**
```r
library(ggplot2)

ggplot(iris, aes(x = Sepal.Length, y = Sepal.Width, color = Species)) +
  geom_point(size = 3, alpha = 0.7) +
  labs(title = "Sepal Length vs Width", x = "Length (cm)", y = "Width (cm)")
```
*লক্ষ্য করুন: `color = Species` দেওয়ায় প্রজাতি অনুযায়ী রঙ আলাদা হয়ে গেছে!*

### 2. Bar Plot (তুলনা করার জন্য)
কোনো ক্যাটাগরির সংখ্যা কত তা দেখতে। যেমন: প্রতিটি ক্লাসে কতজন ছাত্র।
ফাংশন: `geom_bar()`

**R Code:**
```r
# প্রজাতির সংখ্যা দেখা
ggplot(iris, aes(x = Species, fill = Species)) +
  geom_bar() +
  theme_classic()
```

### 3. Line Plot (ট্রেন্ড দেখার জন্য)
সময়ের সাথে সাথে পরিবর্তন দেখতে (Time Series)।
ফাংশন: `geom_line()`

**R Code:**
```r
# ডামি টাইম সিরিজ ডেটা
growth <- data.frame(Day = 1:10, Height = c(2, 4, 5, 7, 9, 12, 15, 18, 20, 25))

ggplot(growth, aes(x = Day, y = Height)) +
  geom_line(color = "darkgreen", size = 1.5) +
  geom_point() +
  ggtitle("Plant Growth Over Time")
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `geom_point()` -> Scatter Plot (সম্পর্ক)
- `geom_bar()` -> Bar Chart (তুলনা)
- `geom_line()` -> Line Chart (সময়/ট্রেন্ড)
- `color` বা `fill` দিয়ে ডেটা অনুযায়ী রঙ করা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M7-L32
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'দুটি সংখ্যার (Numeric) সম্পর্ক দেখার জন্য কোন প্লট সেরা?', 'দুটি সংখ্যার (Numeric) সম্পর্ক দেখার জন্য কোন প্লট সেরা?', '["Bar Plot", "Scatter Plot", "Pie Chart", "Histogram"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'সময়ের সাথে পরিবর্তন (Trend) দেখতে কোনটি ব্যবহৃত হয়?', 'সময়ের সাথে পরিবর্তন (Trend) দেখতে কোনটি ব্যবহৃত হয়?', '["geom_bar", "geom_line", "geom_boxplot", "geom_point"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Bar chart এ রঙ পূর্ণ করতে color এর বদলে কোনটি ব্যবহার হয়?', 'Bar chart এ রঙ পূর্ণ করতে color এর বদলে কোনটি ব্যবহার হয়?', '["paint", "fill", "shade", "bg"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'transparency বা স্বচ্ছতা কমানোর জন্য কোন প্যারামিটার ব্যবহৃত হয়?', 'transparency বা স্বচ্ছতা কমানোর জন্য কোন প্যারামিটার ব্যবহৃত হয়?', '["beta", "alpha", "glass", "clear"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'labs() ফাংশন কি করে?', 'labs() ফাংশন কি করে?', '["ল্যাবরেটরি তৈরি করে", "টাইটেল এবং লেবেল (Axis Label) সেট করে", "রঙ ঠিক করে", "প্লট সেভ করে"]'::jsonb, 1, 1);


  -- M7-L33: Distributions (Hist & Box)
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '33. Understanding Spread: Histogram & Boxplot', 'distribution-plots', 3, 
  $markdown$
# Lesson 33: Distributions (Statistics in Graphics)

গড় মানের চেয়ে ডেটা কিভাবে ছড়িয়ে আছে (Spread/Variance) তা জানা বেশি জরুরি।

### 1. Histogram (Frequency)
কোনো রেঞ্জে কতগুলো ডেটা আছে। যেমন: ৩০-৪০ বছরের মানুষ কতজন।
ফাংশন: `geom_histogram()`

**R Code:**
```r
library(ggplot2)

ggplot(iris, aes(x = Sepal.Length)) +
  geom_histogram(binwidth = 0.5, fill = "skyblue", color = "black") +
  ggtitle("Distribution of Sepal Length")
```

### 2. Box Plot (The Five Number Summary)
এটি একসাথে ৫টি তথ্য দেয়: Minimum, 1st Quartile, Median, 3rd Quartile, Maximum। আউটলাইয়ার (অস্বাভাবিক মান) ধরতেও এটি সেরা।
ফাংশন: `geom_boxplot()`

**R Code:**
```r
ggplot(iris, aes(x = Species, y = Sepal.Length, fill = Species)) +
  geom_boxplot() +
  ggtitle("Species-wise Sepal Length Comparison")
```
*চিত্রে লক্ষ্য করুন, বাক্সের মাঝখানের দাগটি হলো মিডিয়ান (Median)।*

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- **Histogram:** একটি ভেরিয়েবলের ডিস্ট্রিবিউশন দেখায়।
- **Boxplot:** গ্রুপ অনুযায়ী ডেটার তুলনা এবং আউটলাইয়ার দেখায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M7-L33
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Histogram কি কাজে লাগে?', 'Histogram কি কাজে লাগে?', '["সম্পর্ক দেখতে", "ফ্রিকোয়েন্সি বা ডিস্ট্রিবিউশন দেখতে", "সময় দেখতে", "ম্যাপ আঁকতে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Boxplot এর মাঝখানের দাগটি কি নির্দেশ করে?', 'Boxplot এর মাঝখানের দাগটি কি নির্দেশ করে?', '["Average (Mean)", "Median", "Maximum", "Minimum"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ডেটার আউটলাইয়ার (অস্বাভাবিক মান) ধরতে কোন প্লট সেরা?', 'ডেটার আউটলাইয়ার (অস্বাভাবিক মান) ধরতে কোন প্লট সেরা?', '["Bar Chart", "Box Plot", "Line Chart", "Pie Chart"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Histogram এর বারের প্রস্থ ঠিক করতে কোনটি ব্যবহৃত হয়?', 'Histogram এর বারের প্রস্থ ঠিক করতে কোনটি ব্যবহৃত হয়?', '["width", "binwidth", "size", "fat"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Boxplot কয়টি পরিসংখ্যানগত মানের সারসংক্ষেপ?', 'Boxplot কয়টি পরিসংখ্যানগত মানের সারসংক্ষেপ?', '["১টি", "৩টি", "৫টি (Five Number Summary)", "১০টি"]'::jsonb, 2, 2);


  -- M7-L34: Faceting & Themes
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '34. Pro Visualization: Faceting & Themes', 'faceting-themes', 4, 
  $markdown$
# Lesson 34: Advanced Features (Faceting)

একই প্লটের ভেতরে অনেকগুলো ছোট প্লট আঁকার নাম **Faceting**। এটি তুলনা করাকে পানির মতো সহজ করে দেয়।

### 1. Faceting (`facet_wrap`)
ধরুন ৩টি প্রজাতির জন্য ৩টি আলাদা গ্রাফ আঁকতে চাই।

**R Code:**
```r
library(ggplot2)

ggplot(iris, aes(x = Sepal.Length, y = Sepal.Width, color = Species)) +
  geom_point() +
  facet_wrap(~Species) +  # ম্যাজিক লাইন!
  theme_bw() +            # সাদা-কালো থিম
  labs(title = "Faceting Example: Splits by Species")
```

### 2. Themes (Make it Beautiful)
R এ অনেক থিম আছে যা গ্রাফকে জার্নাল বা রিপোর্টের উপযোগী করে।
- `theme_minimal()`: ক্লিন লুক।
- `theme_classic()`: ক্লাসিক সায়েন্টিফিক জার্নাল লুক।
- `theme_dark()`: ডার্ক মোড।

**R Code (Customizing):**
```r
ggplot(iris, aes(x = Species, y = Sepal.Length)) +
  geom_boxplot(fill = "orange") +
  theme_minimal() +
  theme(
    plot.title = element_text(size = 20, face = "bold", color = "darkblue"),
    axis.text = element_text(size = 12)
  )
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- `facet_wrap(~Variable)`: ভেরিয়েবল অনুযায়ী গ্রাফ আলাদা করে।
- `theme()`: গ্রাফের সৌন্দর্য (ফন্ট, সাইজ, ব্যাকগ্রাউন্ড) কন্ট্রোল করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M7-L34
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Faceting এর কাজ কি?', 'Faceting এর কাজ কি?', '["গ্রাফে মুখ আঁকা", "একই গ্রাফকে ক্যাটাগরি অনুযায়ী ভেঙে সাব-প্লট তৈরি করা", "গ্রাফ জুম করা", "গ্রাফ ডিলিট করা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোন ফাংশন দিয়ে Faceting করা হয়?', 'কোন ফাংশন দিয়ে Faceting করা হয়?', '["cut_graph()", "facet_wrap()", "split_plot()", "divide()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'একটি ক্লিন এবং মিনিমালিস্ট লুকের জন্য কোন থিম সেরা?', 'একটি ক্লিন এবং মিনিমালিস্ট লুকের জন্য কোন থিম সেরা?', '["theme_grey()", "theme_minimal()", "theme_void()", "theme_dark()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'গ্রাফের ফন্ট সাইজ বা কালার চেঞ্জ করতে কোন ফাংশন লাগে?', 'গ্রাফের ফন্ট সাইজ বা কালার চেঞ্জ করতে কোন ফাংশন লাগে?', '["style()", "theme()", "css()", "design()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'facet_wrap(~Species) এর টিল্ডা (~) চিহ্নটি কি বোঝায়?', 'facet_wrap(~Species) এর টিল্ডা (~) চিহ্নটি কি বোঝায়?', '["কিছু না", "By (অনুযায়ী) বা Formula", "Infinity", "Approximately"]'::jsonb, 1, 1);


  -- M7-L35: Saving Plots
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '35. Publication Quality Export (ggsave)', 'saving-plots', 5, 
  $markdown$
# Lesson 35: Saving Your Masterpiece

এত কষ্ট করে গ্রাফ আঁকলেন, এখন সেটি থিসিস বা পেপারে ব্যবহার করবেন কিভাবে? স্ক্রিনশট নেওয়া বন্ধ করুন! `ggsave` ব্যবহার করুন।

### The `ggsave()` Function
এটি অটোমেটিক্যালি সবশেষ আঁকা প্লটটি সেভ করে। আপনি রেজোলিউশন (DPI), হাইট, উইডথ সব বলে দিতে পারেন।

**R Code:**
```r
library(ggplot2)

# ১. আগে গ্রাফ আঁকুন
ggplot(iris, aes(x = Species, fill = Species)) + geom_bar()

# ২. সেভ করুন
# ggsave("my_plot.png", width = 8, height = 5, dpi = 300)

print("Plot saved as my_plot.png with 300 DPI!")
```

### High Quality Formats
- **PNG/JPG:** সোশ্যাল মিডিয়া বা স্লাইডের জন্য।
- **PDF/SVG:** ভেক্টর গ্রাফিক্স (ফাটে না), জার্নাল পাবলিকেশনের জন্য সেরা।

**Pro Tip:**
আপনি চাইলে প্লটটি একটি ভেরিয়েবলে রেখে তারপর সেভ করতে পারেন।
```r
p <- ggplot(iris, aes(x=Sepal.Length)) + geom_histogram()
# ggsave("hist.pdf", plot = p, device = "pdf")
```

অভিনন্দন! আপনি এখন R দিয়ে যেকোনো ধরণের ভিজ্যুয়ালাইজেশন তৈরি করতে সক্ষম! 🎨📈

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M7-L35
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ggplot2 প্লট সেভ করার ফাংশন কোনটি?', 'ggplot2 প্লট সেভ করার ফাংশন কোনটি?', '["savePlot()", "export()", "ggsave()", "download()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ভালো কোয়ালিটির (High Res) জন্য কত DPI রাখা উচিত?', 'ভালো কোয়ালিটির (High Res) জন্য কত DPI রাখা উচিত?', '["৭২", "১০০", "৩০০ বা তার বেশি", "১০"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোন ফরম্যাটটি ফাটে না (Vector Graphics)?', 'কোন ফরম্যাটটি ফাটে না (Vector Graphics)?', '["PNG", "JPG", "PDF/SVG", "BMP"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ggsave() ডিফল্টভাবে কোন প্লটটি সেভ করে?', 'ggsave() ডিফল্টভাবে কোন প্লটটি সেভ করে?', '["প্রথম প্লট", "সর্বশেষ আঁকা প্লট (Last Plot)", "সবগুলো প্লট", "কোনোটিই না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Module 7 এ আমরা কি শিখলাম?', 'Module 7 এ আমরা কি শিখলাম?', '["শুধু বেসিক গ্রাফ", "প্রফেশনাল ডেটা ভিজ্যুয়ালাইজেশন (ggplot2)", "মেশিন লার্নিং", "ওয়েব ডিজাইন"]'::jsonb, 1, 1);

  -- ================================================================================================
  -- MODULE 8: EXPLORATORY DATA ANALYSIS (EDA)
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 8: Exploratory Data Analysis (EDA)', 'eda-analytics', 8, 'Learning how to investigate data, spot patterns, and find anomalies like a detective.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M8-L36: What is EDA?
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '36. What is EDA? (The Detective Work)', 'eda-intro', 1, 
  $markdown$
# Module 8 Overview
মডেল বা গ্রাফ বানানোর আগে ডেটাকে ভালোভাবে চিনে নেওয়া জরুরি। এই ধাপকে বলা হয় **EDA (Exploratory Data Analysis)**।
এখানে আমরা ডেটার "পালস" চেক করি। ডেটা কি ভালো? নাকি এতে কোনো সমস্যা আছে?

# Lesson 36: Summary Statistics

EDA এর প্রথম ধাপ হলো ডেটার একটি সামগ্রিক চিত্র বা Summary দেখা।

### Step 1: `summary()` Function
এটি R এর সবচেয়ে বেসিক কিন্তু কাজের ফাংশন। এটি প্রতি কলামের Min, Max, Mean, Median ইত্যাদি বলে দেয়।

**R Code:**
```r
# আইরিস ডেটাসেটের সামারি দেখা
summary(iris)
```
*আউটপুট এনালাইসিস:* যদি দেখেন Mean এবং Median এর মধ্যে বিশাল পার্থক্য, বুঝবেন ডেটায় ঝামেলা (Skewness) আছে।

### Step 2: `skimr` Package (Professional Summary)
আপনার যদি আরও ডিটেইলস এবং সুন্দর রিপোর্ট দরকার হয়, তবে `skimr` প্যাকেজ ব্যবহার করুন।

**R Code:**
```r
# library(skimr)
# skim(iris)
print("skim() gives histograms and missing value counts too!")
```

👉 Now click **Run Code** and try `summary(iris)` in our website Simulator

### End of Lesson Summary
- EDA হলো ডেটার সাথে পরিচিত হওয়ার ধাপ।
- `summary()` দিয়ে প্রাথমিক চেকআপ করা হয়।
- ডেটার কোয়ালিটি এবং রেঞ্জ বোঝা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M8-L36
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'EDA এর পূর্ণরূপ কি?', 'EDA এর পূর্ণরূপ কি?', '["Easy Data Access", "Exploratory Data Analysis", "External Database API", "Evolutionary Data Algorithm"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'summary() ফাংশন কি তথ্য দেয় না?', 'summary() ফাংশন কি তথ্য দেয় না?', '["Mean & Median", "Min & Max", "Correlation", "Quartiles"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Mean এবং Median এর মান খুব আলাদা হলে কি বোঝা যায়?', 'Mean এবং Median এর মান খুব আলাদা হলে কি বোঝা যায়?', '["ডেটা নরমাল", "ডেটা সিমেট্রিক", "ডেটা Skewed বা আউটলাইয়ার আছে", "ডেটা পারফেক্ট"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'skimr প্যাকেজের সুবিধা কি?', 'skimr প্যাকেজের সুবিধা কি?', '["এটি শুধু গ্রাফ আঁকে", "এটি সুন্দর ফরম্যাটে ডিটেইলস সামারি এবং ছোট হিস্টোগ্রাম দেয়", "এটি ডেটা ডিলিট করে", "এটি গান শোনায়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোন ধাপে আমরা ডেটার "পালস" চেক করি?', 'কোন ধাপে আমরা ডেটার "পালস" চেক করি?', '["Modeling", "EDA", "Deployment", "Cleaning"]'::jsonb, 1, 1);


  -- M8-L37: Distribution Analysis
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '37. Distribution Analysis (Shape of Data)', 'distribution-analysis', 2, 
  $markdown$
# Lesson 37: Distribution Analysis

ডেটা কি নরমাল (Bell Curve)? নাকি একদিকে হেলে আছে? এটি জানা জরুরি কারণ অনেক পরিসংখ্যানগত টেস্ট (যেমন t-test) নরমাল ডেটা চায়।

### 1. Visualization Check (Density Plot)
হিস্টোগ্রামের স্মুথ ভার্সন হলো ডেনসিটি প্লট। এটি ডেটার সেপ (Shape) বুঝতে সাহায্য করে।

**R Code:**
```r
library(ggplot2)

ggplot(iris, aes(x = Sepal.Length, fill = Species)) +
  geom_density(alpha = 0.5) +
  ggtitle("Density Plot looks like a Mountain")
```

👉 Now click **Run Code** and try this in our website Simulator

### 2. Normality Checking
যদি পাহাড়ের চূড়া মাঝখানে থাকে, তবে ডেটা নরমাল।
- **Left Skewed:** লেজ বাম দিকে বড়।
- **Right Skewed:** লেজ ডান দিকে বড়।

### End of Lesson Summary
- `geom_density()` দিয়ে ডেটার সেপ দেখা যায়।
- নরমাল ডিস্ট্রিবিউশন দেখতে ঘন্টার (Bell) মতো হয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M8-L37
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'নরমাল ডিস্ট্রিবিউশন দেখতে কিসের মতো?', 'নরমাল ডিস্ট্রিবিউশন দেখতে কিসের মতো?', '["পিরামিড", "ঘন্টা (Bell Curve)", "বক্স", "সরলরেখা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Histogram এর স্মুথ ভার্সন কোনটি?', 'Histogram এর স্মুথ ভার্সন কোনটি?', '["Bar Chart", "Density Plot", "Box Plot", "Scatter Plot"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ডেটা একদিকে হেলে থাকাকে কি বলে?', 'ডেটা একদিকে হেলে থাকাকে কি বলে?', '["Skewness", "Flatness", "Normalcy", "Peak"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'অনেক স্ট্যাটিসটিকাল টেস্ট (t-test) কোন ধরণের ডেটা পছন্দ করে?', 'অনেক স্ট্যাটিসটিকাল টেস্ট (t-test) কোন ধরণের ডেটা পছন্দ করে?', '["Skewed Data", "Normal Data", "Broken Data", "Mixed Data"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'geom_density() কি কাজ করে?', 'geom_density() কি কাজ করে?', '["ডেটা ডিলিট করে", "ডেনসিটি বা সেপ দেখায়", "গড় বের করে", "টেবিল বানায়"]'::jsonb, 1, 1);


  -- M8-L38: Outlier Detection
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '38. Outlier Detection (Finding Anomalies)', 'outlier-detection', 3, 
  $markdown$
# Lesson 38: detecting Outliers

আউটলাইয়ার (Outlier) হলো "দলে থেকেও দলের বাইরে"। যেমন: সবার ক্লাসে বয়স ২০-২৫, কিন্তু একজনের বয়স ৮০। এই ৮০ হলো আউটলাইয়ার।
এটি গড় (Mean) কে নষ্ট করে দিতে পারে।

### 1. Using Boxplot
আমরা মডিউল ৭ এ শিখেছি বক্সপ্লট আউটলাইয়ার ধরে। বক্সের বাইরে যে ফোঁটাগুলো থাকে, সেগুলোই আউটলাইয়ার।

**R Code:**
```r
library(ggplot2)
# একটি কৃত্রিম আউটলাইয়ার যোগ করি
data_with_outlier <- c(rnorm(100), 50) # ৫০ হলো আউটলাইয়ার
df <- data.frame(Value = data_with_outlier)

ggplot(df, aes(y = Value)) +
  geom_boxplot(fill = "orange") +
  ggtitle("Can you see the dot far away?")
```

👉 Now click **Run Code** and try this in our website Simulator

### 2. Analytical Method (IQR)
সাধারনত `Q3 + 1.5 * IQR` এর চেয়ে বড় হলে তাকে আউটলাইয়ার ধরা হয়।

### End of Lesson Summary
- আউটলাইয়ার এনালাইসিস নষ্ট করতে পারে।
- বক্সপ্লট দিয়ে এটি সহজে চেনা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M8-L38
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Outlier কি?', 'Outlier কি?', '["সবচেয়ে ভালো ডেটা", "অস্বাভাবিক বা এক্সট্রিম ভ্যালু", "ভুল ডেটা", "মিসিং ডেটা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'আউটলাইয়ার কোন প্যারামিটারকে বেশি প্রভাবিত করে?', 'আউটলাইয়ার কোন প্যারামিটারকে বেশি প্রভাবিত করে?', '["Median", "Mode", "Mean (Average)", "Count"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বক্সপ্লটে আউটলাইয়ার কিভাবে দেখানো হয়?', 'বক্সপ্লটে আউটলাইয়ার কিভাবে দেখানো হয়?', '["আলাদা রঙ দিয়ে", "বক্সের বাইরে আলাদা বিন্দু (Dot) হিসেবে", "বড় বার হিসেবে", "দেখানো যায় না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'সাধারনত আউটলাইয়ারের লিমিট কত?', 'সাধারনত আউটলাইয়ারের লিমিট কত?', '["Q3 + 1.5 * IQR", "Q3 + 10", "Mean + 1", "Max Value"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'আউটলাইয়ার থাকলে কি করা উচিত?', 'আউটলাইয়ার থাকলে কি করা উচিত?', '["চেক করা উচিত (ভুল নাকি সত্য)", "চোখ বন্ধ করে ডিলিট করা", "রেখে দেওয়া", "কিছুই না"]'::jsonb, 0, 0);


  -- M8-L39: Correlation
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '39. Correlation Analysis (Relationships)', 'correlation', 4, 
  $markdown$
# Lesson 39: Correlation Analysis

দুইটি ভেরিয়েবলের মধ্যে সম্পর্ক কেমন?
- **Positive:** একটি বাড়লে অন্যটিও বাড়ে (বৃষ্টি ও ফলন)।
- **Negative:** একটি বাড়লে অন্যটি কমে (তাপমাত্রা ও শীতবস্ত্র বিক্রি)।
- **Zero:** কোনো সম্পর্ক নেই (জুতার সাইজ ও আইকিউ)।

### Step 1: The `cor()` Function
এটি -১ থেকে +১ এর মধ্যে মান দেয়।

**R Code:**
```r
# Sepal Length ও Petal Length এর সম্পর্ক
correlation_score <- cor(iris$Sepal.Length, iris$Petal.Length)
print(paste("Correlation:", correlation_score))
```

👉 Now click **Run Code** and try this in our website Simulator

### Step 2: Correlation Heatmap
অনেকগুলো ভেরিয়েবলের সম্পর্ক একসাথে দেখতে হিটম্যাপ (Heatmap) সেরা।

**R Code:**
```r
# শুধুমাত্র নিউমেরিক ডেটা নিতে হবে
num_data <- iris[, 1:4] 
cor_matrix <- cor(num_data)

# হিটম্যাপ আঁকা (সাধারনত প্যাকেজ লাগে, এখানে বেসিক দেখাচ্ছি)
image(cor_matrix, main = "Heatmap of Correlations")
```

### End of Lesson Summary
- `cor()` ফাংশন সম্পর্ক মাপে।
- ১ এর কাছাকাছি হলে শক্তিশালী পজিটিভ সম্পর্ক।
- -১ এর কাছাকাছি হলে শক্তিশালী নেগেটিভ সম্পর্ক।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M8-L39
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Correlation এর মান কত থেকে কতর মধ্যে হয়?', 'Correlation এর মান কত থেকে কতর মধ্যে হয়?', '["0 থেকে 100", "-1 থেকে +1", "0 থেকে 1", "-10 থেকে +10"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Correlation +0.9 বলতে কি বোঝায়?', 'Correlation +0.9 বলতে কি বোঝায়?', '["শক্তিশালী পজিটিভ সম্পর্ক", "দুর্বল সম্পর্ক", "নেগেটিভ সম্পর্ক", "কোনো সম্পর্ক নেই"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Correlation -0.8 মানে কি?', 'Correlation -0.8 মানে কি?', '["একটি ভেরিয়েবল বাড়লে অন্যটি কমে (বিপরীতমুখী সম্পর্ক)", "দুটিই বাড়ে", "দুটিই কমে", "কোনো সম্পর্ক নেই"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'cor() ফাংশন কোন ধরণের ডেটায় কাজ করে?', 'cor() ফাংশন কোন ধরণের ডেটায় কাজ করে?', '["শুধু টেক্সট", "শুধু নিউমেরিক (সংখ্যা)", "সব ধরণের", "শুধু লজিক্যাল"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'অনেকগুলো ভেরিয়েবলের কোরিলেশন একসাথে দেখতে কি ব্যবহার করা হয়?', 'অনেকগুলো ভেরিয়েবলের কোরিলেশন একসাথে দেখতে কি ব্যবহার করা হয়?', '["Bar Chart", "Heatmap", "Pie Chart", "Line Chart"]'::jsonb, 1, 1);


  -- M8-L40: Case Study
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '40. Case Study: Real World EDA', 'eda-case-study', 5, 
  $markdown$
# Lesson 40: Case Study - Putting It All Together

আমরা যা শিখলাম, তা এখন একটি প্রজেক্টে অ্যাপ্লাই করবো। ধরুন আমরা একটি "Plant Growth" ডেটাসেট নিয়ে কাজ করছি।

### The Workflow
1.  **Import Data:** ডেটা লোড করা।
2.  **Summary Check:** `str()` এবং `summary()` দেখা।
3.  **Missing Value Check:** `is.na()` দিয়ে চেক করা।
4.  **Visualize:** বক্সপ্লট এবং হিস্টোগ্রাম দিয়ে ডেটা দেখা।
5.  **Correlations:** ভেরিয়েবলের সম্পর্ক বের করা।

**R Code (Full EDA):**
```r
library(dplyr)
library(ggplot2)

# ১. ডেটা লোড
df <- trees # R এর বিল্ট-ইন ডেটাসেট

# ২. প্রাথমিক চেক
print("--- Structure ---")
str(df)

# ৩. ভিজ্যুয়ালাইজেশন
ggplot(df, aes(x = Girth, y = Volume)) +
  geom_point(color = "darkgreen") +
  geom_smooth(method = "lm") + # Trend Line
  ggtitle("Tree Girth vs Volume")

# ৪. কোরিলেশন
print("--- Correlation ---")
print(cor(df$Girth, df$Volume))
```

👉 Now click **Run Code** and try this in our website Simulator

### End of Module Summary
অভিনন্দন! আপনি এখন একজন ডেটা ডিটেকটিভ! 🕵️‍♀️ আপনি ডেটার ভেতরের গল্প বের করতে শিখে গেছেন। এরপর আমরা পরিসংখ্যান বা স্ট্যাটিসটিক্স শিখবো।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M8-L40
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Case Study তে আমরা সাধারণত কি করি?', 'Case Study তে আমরা সাধারণত কি করি?', '["নতুন থিওরি বানাই", "বাস্তব ডেটায় এতদিনের শেখা নলেজ অ্যাপ্লাই করি", "শুধু কোড কপি করি", "পরীক্ষা দেই"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'EDA এর সাধারণ ফ্লো (Workflow) কোনটি?', 'EDA এর সাধারণ ফ্লো (Workflow) কোনটি?', '["Import -> Summary -> Visualize -> Interpret", "Visualize -> Import -> Summary", "Summary -> Export -> Delete", "Import -> Sleep"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'geom_smooth(method="lm") কি করে?', 'geom_smooth(method="lm") কি করে?', '["স্মুথ করে", "লিনিয়ার ট্রেন্ড লাইন (Trend Line) আঁকে", "কালার মুছে দেয়", "কিছুই না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Trees ডেটাসেটটি কোথায় পাওয়া যায়?', 'Trees ডেটাসেটটি কোথায় পাওয়া যায়?', '["ইন্টারনেটে", "R এর ভেতরেই (Built-in)", "এক্সেলে", "ফেসবুকে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'EDA শেষে আমরা কিসের জন্য প্রস্তুত হই?', 'EDA শেষে আমরা কিসের জন্য প্রস্তুত হই?', '["ঘুমানোর জন্য", "হাইপোথিসিস টেস্টিং ও মডেলিং (Advanced Stat)", "ডেটা ডিলিট করার জন্য", "কম্পিউটার বন্ধ করার জন্য"]'::jsonb, 1, 1);

  -- ================================================================================================
  -- MODULE 9: STATISTICS WITH R
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 9: Statistics with R', 'statistics-r', 9, 'Build your analytical brain: Hypothesis testing, t-tests, ANOVA, and Regression.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M9-L41: Stats Basics & P-value
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '41. Stats Basics & The P-Value', 'stats-basics', 1, 
  $markdown$
# Module 9 Overview
R এর আসল শক্তি হলো **Statistics**। আমরা এখন ডেটার ওপর ভিত্তি করে সিদ্ধান্ত নেওয়া শিখবো।

# Lesson 41: Probability & The Magic P-Value

### 1. Normal Distribution (The Bell Curve)
পৃথিবীর অধিকাংশ ডেটা (যেমন উচ্চতা, আইকিউ) একটি ঘন্টার মতো শেপ মেনে চলে। একে বলে নরমাল ডিস্ট্রিবিউশন।
- মাঝখানে বেশি মানুষ থাকে (Average)।
- দুই পাশে খুব কম মানুষ থাকে (Extraordinary)।

### 2. The P-Value (সবচেয়ে গুরুত্বপূর্ণ কনসেপ্ট)
গবেষণায় আমরা প্রায়ই শুনি "P-value < 0.05 হতে হবে"। এর মানে কি?
- **P-value:** এটি একটি সম্ভাবনা (Probability)। এটি বলে দেয় আপনার ফলাফল কি **কাকতালীয় (By Chance)** নাকি **সত্যি (Real)**।
- **Rule of Thumb:**
    - `p < 0.05`: ফলাফল সত্যি (Significant)। আমরা খুশি! 🎉
    - `p > 0.05`: ফলাফল কাকতালীয় হতে পারে (Not Significant)। আমরা দুঃখিত! 😔

### End of Lesson Summary
- নরমাল ডিস্ট্রিবিউশন হলে স্ট্যাটিসটিকাল টেস্ট ভালো কাজ করে।
- P-value ০.০৫ এর কম হলে আমরা বলি "পার্থক্যটি সিগনিফিকেন্ট"।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M9-L41
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'অধিকাংশ প্রাকৃতিক ডেটা কোন ডিস্ট্রিবিউশন মেনে চলে?', 'অধিকাংশ প্রাকৃতিক ডেটা কোন ডিস্ট্রিবিউশন মেনে চলে?', '["Linear Distribution", "Normal Distribution (Bell Curve)", "Random Distribution", "Box Distribution"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'P-value আসলে কি?', 'P-value আসলে কি?', '["একটি ভুল সংখ্যা", "একটি সম্ভাবনা (Probability) বা প্রমান", "লটারি টিকেট", "গড় মান"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'গবেষক হিসেবে আমরা কোন P-value চাই?', 'গবেষক হিসেবে আমরা কোন P-value চাই?', '["p > 0.05", "p < 0.05", "p = 1", "p = 100"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Significant Result মানে কি?', 'Significant Result মানে কি?', '["ফলাফলটি কাকতালীয় নয়, বরং সত্যি", "ফলাফলটি ভুল", "ফলাফল খুব ছোট", "ফলাফল অগুরুত্বপূর্ণ"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'P-value এর গোল্ডেন রুল (Threshold) কত?', 'P-value এর গোল্ডেন রুল (Threshold) কত?', '["0.50", "0.01", "0.05", "0.001"]'::jsonb, 2, 2);


  -- M9-L42: Hypothesis Testing
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '42. Hypothesis Testing (The Judicial System)', 'hypothesis-testing', 2, 
  $markdown$
# Lesson 42: Hypothesis Testing

পরিসংখ্যান অনেকটা আদালতের মতো। এখানে দুটি পক্ষ থাকে।

### 1. Null Hypothesis (H0) - আসামী নির্দোষ
এটি বলে: "কোনো পার্থক্য নেই" বা "ঔষধ কাজ করেনি"।
আদালত শুরুতে ধরে নেয় আসামী নির্দোষ।

### 2. Alternative Hypothesis (H1) - আসামী দোষী
এটি বলে: "পার্থক্য আছে" বা "ঔষধ কাজ করেছে"।
আমরা গবেষকরা এটিই প্রমাণ করতে চাই।

### Decision Making
যদি **P-value < 0.05** হয়, তবে আমরা **H0 কে রিজেক্ট করি**। (মানে আসামী দোষী, বা ঔষধ কাজ করেছে)।

### End of Lesson Summary
- **H0:** কোনো ইফেক্ট নেই।
- **H1:** ইফেক্ট আছে।
- আমরা প্রমাণ খুঁজছি H0 কে ভুল প্রমাণ করার জন্য।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M9-L42
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Null Hypothesis (H0) সাধারণত কি দাবি করে?', 'Null Hypothesis (H0) সাধারণত কি দাবি করে?', '["পার্থক্য আছে", "কোনো পার্থক্য বা ইফেক্ট নেই", "সবকিছু নতুন", "ডেটা ভুল"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Alternative Hypothesis (H1) কি?', 'Alternative Hypothesis (H1) কি?', '["যা আমরা প্রমাণ করতে চাই (ইফেক্ট আছে)", "যা আমরা বিশ্বাস করি না", "পুরানো থিওরি", "শুন্য"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'P-value < 0.05 হলে আমরা H0 কে কি করি?', 'P-value < 0.05 হলে আমরা H0 কে কি করি?', '["গ্রহণ (Accept) করি", "বাতিল (Reject) করি", "কিছু করি না", "পছন্দ করি"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'স্ট্যাটিসটিকাল টেস্ট কার মতো কাজ করে?', 'স্ট্যাটিসটিকাল টেস্ট কার মতো কাজ করে?', '["খেলার মাঠের মতো", "বিচার ব্যবস্থার (Court) মতো", "দোকানের মতো", "লটারির মতো"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'গবেষণার মূল লক্ষ্য সাধারণত কোনটি প্রমাণ করা?', 'গবেষণার মূল লক্ষ্য সাধারণত কোনটি প্রমাণ করা?', '["H0", "H1", "H2", "H3"]'::jsonb, 1, 1);


  -- M9-L43: T-Test & ANOVA
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '43. Comparing Means: t-test & ANOVA', 'ttest-anova', 3, 
  $markdown$
# Lesson 43: Comparing Groups

আমরা প্রায়ই জানতে চাই: "সার দিলে কি ফলন বাড়ে?" বা "ছেলে ও মেয়েদের রেজাল্ট কি আলাদা?"

### 1. T-Test (Two Groups)
যখন মাত্র **দুইটি** গ্রুপের গড় (Mean) তুলনা করবেন।
- উদাহরণ: সার দেওয়া vs সার না দেওয়া।

**R Code:**
```r
# Sleep ডেটাসেট (দুই ধরণের ড্রাগের প্রভাব)
t.test(extra ~ group, data = sleep)
```
*রেজাল্টে দেখতে হবে `p-value` কত।*

### 2. ANOVA (More than Two Groups)
যখন **তিন বা তার বেশি** গ্রুপের তুলনা করবেন।
- উদাহরণ: ইউরিয়া vs পটাশ vs গোবর সার (৩টি গ্রুপ)।

**R Code:**
```r
# PlantGrowth ডেটাসেট (৩টি গ্রুপ: ctrl, trt1, trt2)
model <- aov(weight ~ group, data = PlantGrowth)
summary(model)
```
*এখানে `Pr(>F)` মানে হলো P-value।*

### End of Lesson Summary
- ২ গ্রুপ হলে `t.test`।
- ২ এর বেশি হলে `ANOVA` (`aov`)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M9-L43
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'দুটি গ্রুপের গড় তুলনা করতে কোন টেস্ট করা হয়?', 'দুটি গ্রুপের গড় তুলনা করতে কোন টেস্ট করা হয়?', '["ANOVA", "t-test", "Chi-square", "Regression"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ANOVA কখন ব্যবহার করা হয়?', 'ANOVA কখন ব্যবহার করা হয়?', '["যখন ১টি গ্রুপ থাকে", "যখন ২টির বেশি (3+) গ্রুপ থাকে", "কখনই না", "শুধু মানুষের ক্ষেত্রে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ ANOVA করার ফাংশন কোনটি?', 'R এ ANOVA করার ফাংশন কোনটি?', '["anova()", "aov()", "test()", "group()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 't-test এ আমরা কি তুলনা করি?', 't-test এ আমরা কি তুলনা করি?', '["Mode", "Median", "Mean (Average)", "Sum"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ANOVA রেজাল্ট দেখতে কোন ফাংশন লাগে?', 'ANOVA রেজাল্ট দেখতে কোন ফাংশন লাগে?', '["print()", "summary()", "show()", "get()"]'::jsonb, 1, 1);


  -- M9-L44: Chi-square Test
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '44. Categorical Relationships (Chi-square)', 'chi-square', 4, 
  $markdown$
# Lesson 44: The Chi-Square Test

সব ডেটা তো সংখ্যা নয় (যেমন: ফলন, ওজন)। কিছু ডেটা হলো ক্যাটাগরি (যেমন: ধানের জাত, রোগের উপস্থিতি)।
যখন আমরা দুইটি ক্যাটাগরিকাল ভেরিয়েবলের সম্পর্ক দেখতে চাই, তখন **Chi-Square Test** লাগে।

**Scenario:** ধূমপানের সাথে ক্যান্সারের কোনো সম্পর্ক আছে কি? (দুটিই হ্যাঁ/না টাইপ ডেটা)।

**R Code:**
```r
# টেবিল তৈরি করা
result_table <- table(iris$Species, iris$Petal.Width > 1)

# কাই-স্কয়ার টেস্ট
chisq.test(result_table)
```
*এখানেও P-value < 0.05 হলে বুঝবো দুইটির মধ্যে সম্পর্ক আছে।*

### End of Lesson Summary
- ক্যাটাগরি vs ক্যাটাগরি হলে `chisq.test`।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M9-L44
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Chi-square টেস্ট কোন ধরণের ডেটায় ব্যবহৃত হয়?', 'Chi-square টেস্ট কোন ধরণের ডেটায় ব্যবহৃত হয়?', '["Numeric vs Numeric", "Categorical vs Categorical", "Time Series", "Map Data"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '"ধূমপান" (হ্যাঁ/না) এবং "ক্যান্সার" (আছে/নেই) - এদের সম্পর্ক দেখতে কোন টেস্ট করবেন?', '"ধূমপান" (হ্যাঁ/না) এবং "ক্যান্সার" (আছে/নেই) - এদের সম্পর্ক দেখতে কোন টেস্ট করবেন?', '["t-test", "Chi-square test", "Correlation", "ANOVA"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ এই টেস্টের ফাংশন কোনটি?', 'R এ এই টেস্টের ফাংশন কোনটি?', '["chi.sq()", "chisq.test()", "cat.test()", "x2()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'টেস্ট করার আগে ডেটাকে কি ফরম্যাটে নিতে হয়?', 'টেস্ট করার আগে ডেটাকে কি ফরম্যাটে নিতে হয়?', '["List", "Frequency Table (table)", "Vector", "Matrix"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Chi-square টেস্ট কি প্রমাণ করে?', 'Chi-square টেস্ট কি প্রমাণ করে?', '["গড়ের পার্থক্য", "দুটি ক্যাটাগরির মধ্যে অ্যাসোসিয়েশন বা সম্পর্ক", "ভবিষ্যৎবাণী", "লিনিয়ার সম্পর্ক"]'::jsonb, 1, 1);


  -- M9-L45: Regression
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '45. Predicting the Future (Linear Regression)', 'linear-regression', 5, 
  $markdown$
# Lesson 45: Linear Regression

স্ট্যাটিসটিক্সের সবচেয়ে পাওয়ারফুল টুল। আমরা অতীতের ডেটা দিয়ে ভবিষ্যৎ বা অজানা মান বের করতে পারি।
**Formula:** `y = mx + c` (মনে আছে ছোটবেলার কথা?)

### Simple Linear Regression
একটি ভেরিয়েবল দিয়ে আরেকটি প্রেডিক্ট করা। যেমন: `Girth` দিয়ে গাছের `Volume` বের করা।

**R Code:**
```r
# মডেল তৈরি (Volume নির্ভর করে Girth এর ওপর)
model <- lm(Volume ~ Girth, data = trees)

# রেজাল্ট দেখা
summary(model)

# গ্রাফ দেখা
plot(trees$Girth, trees$Volume)
abline(model, col="red") # প্রেডিকশন লাইন
```

### Interpreting Output
- **R-squared:** মডেলটি কত ভালো কাজ করছে (১ এর যত কাছে তত ভালো)।
- **Coefficients:** ১ ইউনিট বাড়লে কতটুকু বাড়ে।

### End of Module Summary
অভিনন্দন! আপনি এখন স্ট্যাটিসটিকাল টেস্ট রান করতে পারেন এবং রেজাল্ট ব্যাখ্যা করতে পারেন। আপনি এখন সত্যিকারের গবেষক! 🎓🔬

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M9-L45
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'রিগ্রেশন দিয়ে মূলক কি করা হয়?', 'রিগ্রেশন দিয়ে মূলক কি করা হয়?', '["অতীত দেখা হয়", "ভবিষ্যৎবাণী বা প্রেডিকশন (Prediction)", "ডাটা ডিলিট", "ছবি আঁকা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Liner Regression এর সরলরেখার সমীকরণ কোনটি?', 'Liner Regression এর সরলরেখার সমীকরণ কোনটি?', '["E = mc^2", "y = mx + c", "a^2 + b^2 = c^2", "unknown"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ লিনিয়ার মডেল তৈরির ফাংশন কোনটি?', 'R এ লিনিয়ার মডেল তৈরির ফাংশন কোনটি?', '["model()", "lm()", "lr()", "reg()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'lm(y ~ x) কোডে y কে কি বলা হয়?', 'lm(y ~ x) কোডে y কে কি বলা হয়?', '["Dependent Variable (যা প্রেডিক্ট করছি)", "Independent Variable", "Constant", "Result"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'মডেলটি কতটা ভালো তা বুঝতে কোন মানটি দেখা হয়?', 'মডেলটি কতটা ভালো তা বুঝতে কোন মানটি দেখা হয়?', '["P-value", "R-squared", "Mean", "Median"]'::jsonb, 1, 1);

  -- ================================================================================================
  -- MODULE 10: CLASSICAL MODELS & REGRESSION
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 10: Classical Models & Regression', 'classical-models', 10, 'Bridging Statistics and Machine Learning: From Regression to Classification.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M10-L46: Simple Linear Regression Deep Dive
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '46. Simple Linear Regression: The Details', 'simple-regression-deep', 1, 
  $markdown$
# Module 10 Overview
আমরা এখন স্ট্যাটিসটিক্স থেকে **মেশিন লার্নিং (ML)** এর দিকে পা বাড়াচ্ছি। রিগ্রেশন হলো ML এর ভিত্তি।

# Lesson 46: Simple Linear Regression Deep Dive

আমরা আগের মডিউলে `y = mx + c` দেখেছি। এখন আমরা এর গভীরতা বুঝবো।

### Interpreting Coefficients (ফলাফল বাখ্যা)
ধরি, `Yield = 50 + 20 * Fertilizer`
- **Intercept (50):** যদি সার ০ কেজি দেই, তাও ৫০ কেজি ফলন পাবো (মাটির নিজস্ব গুনে)।
- **Slope (20):** ১ কেজি সার বাড়ালে ফলন ২০ কেজি বাড়বে।

**R Code:**
```r
# গাছেদের Girth দিয়ে Volume প্রেডিকশন
model <- lm(Volume ~ Girth, data = trees)
summary(model)
```
*Tip: `Estimate` কলামে Intercept এবং Girth এর মান থাকে।*

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- **Intercept:** শুরু বা বেসলাইন।
- **Slope:** পরিবর্তনের হার।
- **P-value:** সম্পর্কটি কি সত্যি নাকি কাকতালীয়? (এখানেও এটি চেক করতে হয়)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M10-L46
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'রিগ্রেশন সমীকরণ y = 5 + 2x হলে, Intercept কত?', 'রিগ্রেশন সমীকরণ y = 5 + 2x হলে, Intercept কত?', '["2", "5", "x", "y"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Slope (ঢাল) কি নির্দেশ করে?', 'Slope (ঢাল) কি নির্দেশ করে?', '["গড় মান", "পরিবর্তনের হার (Rate of Change)", "সর্বোচ্চ মান", "শুরুর মান"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'যদি Slope নেগেটিভ হয়, তবে সম্পর্কটি কেমন?', 'যদি Slope নেগেটিভ হয়, তবে সম্পর্কটি কেমন?', '["পজিটিভ (বাড়লে বাড়ে)", "নেগেটিভ (বাড়লে কমে)", "কোনো সম্পর্ক নেই", "সমান"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'summary(model) ফাংশনে Estimate কলামে কি থাকে?', 'summary(model) ফাংশনে Estimate কলামে কি থাকে?', '["শুধু P-value", "Coefficients (Intercept & Slope)", "Error", "Date"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Logistic Regression কোন ধরণের কাজের ভিত্তি?', 'Logistic Regression কোন ধরণের কাজের ভিত্তি?', '["Excel", "Machine Learning", "Drawing", "Typing"]'::jsonb, 1, 1);


  -- M10-L47: Multiple Linear Regression
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '47. Multiple Linear Regression', 'multiple-regression', 2, 
  $markdown$
# Lesson 47: Multiple Linear Regression

বাস্তবে একটি ঘটনার পেছনে অনেক কারণ থাকে।
যেমন: ধান উৎপাদন শুধু সারের ওপর নির্ভর করে না; বৃষ্টি, মাটি এবং বীজের ওপরও করে।
যখন আমরা **একাধিক** ভেরিয়েবল ব্যবহার করি, তাকে **Multiple Regression** বলে।

**Formula:** `y = m1x1 + m2x2 + ... + c`

### R Code
আমরা `+` সাইন দিয়ে ভেরিয়েবল যোগ করি।

```r
# Volume নির্ভর করে Girth এবং Height উভয়ের ওপর
multi_model <- lm(Volume ~ Girth + Height, data = trees)

summary(multi_model)
```

### Adjusted R-Squared
মাল্টিপল রিগ্রেশনে আমরা সাধারন `R-Squared` এর বদলে `Adjusted R-Squared` দেখি। কারণ ভেরিয়েবল বাড়ালে সাধারণ R2 এমনিতেই বেড়ে যায় (ভুলভাবে)। Adjusted R2 সত্যি কথা বলে।

### End of Lesson Summary
- একাধিক কারণ বা Predictor থাকলে Multiple Regression.
- `lm(y ~ x1 + x2)`
- মডেলের জাজমেন্টের জন্য **Adjusted R-squared** দেখুন।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M10-L47
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Multiple Regression এ কয়টি Independent Variable থাকে?', 'Multiple Regression এ কয়টি Independent Variable থাকে?', '["মাত্র ১টি", "একাধিক (Multiple)", "শুন্যটি", "অসীম"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ একাধিক ভেরিয়েবল যোগ করতে কোন চিহ্ন ব্যবহৃত হয়?', 'R এ একাধিক ভেরিয়েবল যোগ করতে কোন চিহ্ন ব্যবহৃত হয়?', '["&", "+", "*", "-"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Multiple Regression এ মডেলের পারফরম্যান্স দেখতে কোনটি ব্যবহার করা উচিত?', 'Multiple Regression এ মডেলের পারফরম্যান্স দেখতে কোনটি ব্যবহার করা উচিত?', '["Multiple R-squared", "Adjusted R-squared", "P-value only", "Mean"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Adjusted R-squared কেন দেখা হয়?', 'Adjusted R-squared কেন দেখা হয়?', '["এটি বড় সংখ্যা দেখায়", "এটি অপ্রয়োজনীয় ভেরিয়েবল যোগ করলে পেনাল্টি দেয় (সঠিক মান দেয়)", "এটি দেখতে সুন্দর", "জানিনা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'lm(y ~ x1 + x2) বলতে কি বোঝায়?', 'lm(y ~ x1 + x2) বলতে কি বোঝায়?', '["y কে x1 এবং x2 দিয়ে প্রেডিক্ট করা", "সব যোগ করা", "ভাগ করা", "কিছুই না"]'::jsonb, 0, 0);


  -- M10-L48: Model Diagnostics
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '48. Check Constraints: Model Diagnostics', 'model-diagnostics', 3, 
  $markdown$
# Lesson 48: Model Diagnostics

মডেল বানালেই হবে না, সেটি সুস্থ কিনা চেক করতে হবে। একে বলে **Diagnostics**।
লিনিয়ার রিগ্রেশনের কিছু শর্ত (Assumptions) আছে:
1.  **Linearity:** সম্পর্ক সরলরেখার মতো হতে হবে।
2.  **Normality:** এরর (Residuals) গুলো নরমাল হতে হবে।
3.  **Homoscedasticity:** ভেরিয়েন্স সমান হতে হবে।

### Plotting Diagnostics
R এ এটি খুব সহজ। শুধু মডেলকে `plot()` ফাংশনে দিন।

**R Code:**
```r
model <- lm(Volume ~ Girth, data = trees)

# ৪টি গ্রাফ একসাথে দেখা
par(mfrow = c(2, 2)) 
plot(model)
```

**কি চেক করবেন?**
- **Residuals vs Fitted:** রেখাটি সোজা (Horizontal) হলে ভালো।
- **Normal Q-Q:** ডটগুলো দাগের ওপর থাকলে নরমাল।

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- অন্ধভাবে মডেল বিশ্বাস করবেন না।
- `plot(model)` দিয়ে চেকআপ করুন।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M10-L48
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'মডেলের সুস্থতা বা শর্ত চেক করাকে কি বলে?', 'মডেলের সুস্থতা বা শর্ত চেক করাকে কি বলে?', '["Treatment", "Diagnostics", "Surgery", "Repair"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Normal Q-Q প্লট কি চেক করে?', 'Normal Q-Q প্লট কি চেক করে?', '["লিনিয়ারিটি", "নরমালিটি (এররগুলো নরমাল কিনা)", "হোমোসিডাস্টিসিটি", "ভেরিয়েন্স"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ ডায়াগনস্টিক প্লট দেখার কমান্ড কি?', 'R এ ডায়াগনস্টিক প্লট দেখার কমান্ড কি?', '["check(model)", "diagnose(model)", "plot(model)", "summary(model)"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Homoscedasticity মানে কি?', 'Homoscedasticity মানে কি?', '["ভেরিয়েন্স সমান থাকা (Constant Variance)", "ভেরিয়েন্স পরিবর্তন হওয়া", "ডেটা মিসিং", "বড় ডেটা"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'par(mfrow = c(2, 2)) কি করে?', 'par(mfrow = c(2, 2)) কি করে?', '["৪টি গ্রাফ এক উইন্ডোতে সাজায়", "গ্রাফ ডিলিট করে", "২টি গ্রাফ আঁকে", "কালার চেঞ্জ করে"]'::jsonb, 0, 0);


  -- M10-L49: Logistic Regression
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '49. Logistic Regression (Yes/No Prediction)', 'logistic-regression', 4, 
  $markdown$
# Lesson 49: Logistic Regression

সবসময় আমরা সংখ্যা প্রেডিক্ট করি না (যেমন ফলন)। মাঝে মাঝে আমাদের প্রেডিক্ট করতে হয়: "রোগ হবে কি হবে না?", "বৃষ্টি হবে কি হবে না?"।
এগুলো **Classification** সমস্যা। এর জন্য লাগে **Logistic Regression**।

### The `glm()` Function
এখানে `lm` (Linear Model) এর বদলে `glm` (Generalized Linear Model) ব্যবহার হয়।

**R Code:**
```r
# ডামি ডেটা (Disease: 0 = সুস্থ, 1 = অসুস্থ)
health_data <- data.frame(
  Age = c(25, 30, 45, 50, 60),
  Disease = c(0, 0, 1, 1, 1) # বাইনারি ডেটা
)

# মডেল তৈরি (family = binomial দিতে হবে)
log_model <- glm(Disease ~ Age, data = health_data, family = binomial)

summary(log_model)
```
*এটি আমাদের একটি সম্ভাবনা (Probability) দেয়।*

👉 Now click **Run Code** and try this in our website Simulator

### End of Lesson Summary
- **Classification** এর জন্য Logistic Regression.
- ফাংশন: `glm(..., family = binomial)`।
- আউটপুট ০ থেকে ১ এর মধ্যে হয় (Probability)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M10-L49
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'আউটপুট যখন ইয়েস/নো (Category) হয়, তখন কোন রিগ্রেশন লাগে?', 'আউটপুট যখন ইয়েস/নো (Category) হয়, তখন কোন রিগ্রেশন লাগে?', '["Linear Regression", "Logistic Regression", "ANOVA", "T-Test"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Logistic Regression কোন ধরণের সমস্যা সমাধান করে?', 'Logistic Regression কোন ধরণের সমস্যা সমাধান করে?', '["Regression", "Classification", "Clustering", "Printing"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ Logistic Regression এর জন্য কোন ফাংশন ব্যবহার হয়?', 'R এ Logistic Regression এর জন্য কোন ফাংশন ব্যবহার হয়?', '["lm()", "glm()", "log()", "reg()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'glm() এ family = ? কি দিতে হয়?', 'glm() এ family = ? কি দিতে হয়?', '["gaussian", "binomial", "poisson", "gamma"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'লজিস্টিক রিগ্রেশনের আউটপুট কি?', 'লজিস্টিক রিগ্রেশনের আউটপুট কি?', '["সরাসরি সংখ্যা", "সম্ভাবনা (Probability 0 to 1)", "টেক্সট", "ছবি"]'::jsonb, 1, 1);


  -- M10-L50: Evaluation
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '50. How Good is My Model? (Evaluation)', 'model-evaluation', 5, 
  $markdown$
# Lesson 50: Model Evaluation Measures

মডেল বানালেই শেষ নয়, সেটি কতটা ভালো কাজ করছে তা মাপতে হয়।

### 1. Regression Metrics (সংখ্যার জন্য)
- **RMSE (Root Mean Square Error):** গড়ে আমাদের প্রেডিকশন কতটুকু ভুল হচ্ছে। যত কম, তত ভালো।
- **R-squared:** মডেল ডেটাকে কতটা ব্যাখ্যা করতে পারছে। ১ এর কাছে হলে ভালো।

**R Code:**
```r
# RMSE বের করার নিয়ম
actual <- c(10, 20, 30)
predicted <- c(12, 19, 29)
rmse <- sqrt(mean((actual - predicted)^2))
print(paste("RMSE:", rmse))
```

### 2. Classification Metrics (ইয়েস/নো এর জন্য)
- **Confusion Matrix:** কয়টা সঠিক আর কয়টা ভুল ধরেছে তার টেবিল।
- **Accuracy:** মোট কত শতাংশ সঠিক।

**R Code:**
```r
# টেবিল বানানো
actual_class <- c(1, 0, 1, 1)
pred_class   <- c(1, 0, 0, 1) # ৩য় টি ভুল

table(actual_class, pred_class)
```

অভিনন্দন! আপনি ক্লাসিকাল মডেলিং শেষ করেছেন। সামনে অপেক্ষা করছে মেশিন লার্নিংয়ের নতুন জগত! 🤖🚀

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M10-L50
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Model Evaluation কেন প্রয়োজন?', 'Model Evaluation কেন প্রয়োজন?', '["মডেলের পারফরম্যান্স বা দক্ষতা মাপার জন্য", "মডেল ডিলিট করার জন্য", "কোড বড় করার জন্য", "কিছুই না"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'রিগ্রেশন মডেলে ভুলের পরিমাণ মাপার মেট্রিক কোনটি?', 'রিগ্রেশন মডেলে ভুলের পরিমাণ মাপার মেট্রিক কোনটি?', '["Accuracy", "RMSE (Root Mean Square Error)", "Confusion Matrix", "Precision"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'RMSE মান কেমন হওয়া ভালো?', 'RMSE মান কেমন হওয়া ভালো?', '["যত বেশি তত ভালো", "যত কম (শূন্যের কাছে) তত ভালো", "১০০ হতে হবে", "অসীম"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ক্লাসিফিকেশন মডেলের পারফরম্যান্স দেখার টেবিলকে কি বলে?', 'ক্লাসিফিকেশন মডেলের পারফরম্যান্স দেখার টেবিলকে কি বলে?', '["Multiplication Table", "Confusion Matrix", "Data Table", "Periodic Table"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R-squared এর মান ১ এর অর্থ কি?', 'R-squared এর মান ১ এর অর্থ কি?', '["মডেলটি খুব খারাপ", "মডেলটি ডেটাকে ১০০% ব্যাখ্যা করতে পারছে (খুব ভালো)", "ডেটা ভুল", "মডেল কাজ করছে না"]'::jsonb, 1, 1);

  -- ================================================================================================
  -- MODULE 11: MACHINE LEARNING FUNDAMENTALS
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 11: ML Fundamentals', 'ml-fundamentals', 11, 'The theory before the code. Understanding how machines learn, types of ML, and the workflow.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M11-L51: What is ML?
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '51. What is Machine Learning? (Beyond Magic)', 'what-is-ml', 1, 
  $markdown$
# Module 11 Overview: Welcome to the Future
এখন পর্যন্ত আমরা কম্পিউটারকে বলে দিয়েছি *কি করতে হবে* (Rule-based Programming)।
যেমন: `if (x > 10) print("High")`

কিন্তু **Machine Learning (ML)** এ আমরা রুল বলে দেই না। আমরা ডেটা দেই, আর কম্পিউটার নিজেই রুল খুঁজে বের করে।
- **Traditional Programming:** Data + Rules = Output
- **Machine Learning:** Data + Output = Rules

# Lesson 51: What really is Machine Learning?

মেশিন লার্নিং হলো এমন একটি বিজ্ঞান যা কম্পিউটারকে সেই ক্ষমতা দেয়, যে বিষয়ে তাকে আলাদা করে প্রোগ্রাম করা হয়নি। এটি অভিজ্ঞতার (Data) মাধ্যমে শেখে।

### The Child Learning Analogy (শিশুর উদাহরণ)
ভাবুন একটি ছোট বাচ্চাকে আপনি "আপেল" চেনাতে চান।
১. আপনি তাকে ১০ রকমের লাল আপেল দেখালেন। (Training Data)
২. তারপর একটি সবুজ আপেল দেখিয়ে বললেন, এটিও আপেল। (Generalization)
৩. এরপর একটি টেনিস বল দেখালেন। সে বলল "আপেল"। আপনি বললেন "না, এটি বল"। (Feedback/Error Correction)

মেশিন এভাবেই শেখে। সে হাজার হাজার ছবি দেখে প্যাটার্ন (গোল, বোঁটা আছে, লাল বা সবুজ) খুঁজে বের করে।

### AI vs ML vs Deep Learning
অনেকে এগুলো গুলিয়ে ফেলেন।
- **Artificial Intelligence (AI):** একটি বড় ছাতা। মানুষের বুদ্ধিমত্তা অনুকরণ করার যেকোনো প্রযুক্তি।
- **Machine Learning (ML):** AI এর একটি সাবসেট। যেখানে স্ট্যাটিসটিকাল মেথড ব্যবহার করে মেশিন শেখে।
- **Deep Learning (DL):** ML এর একটি সাবসেট। যেখানে মানুষের ব্রেইনের নিউরনের মতো (Neural Network) গঠন ব্যবহার করা হয়।

### Why R for ML?
Python খুব জনপ্রিয়, কিন্তু R স্ট্যাটিসটিকাল ML এর জন্য অপ্রতিদ্বন্দ্বী। `caret` এবং `tidymodels` এর মতো প্যাকেজ R কে সুপারপাওয়ার দেয়।

### End of Lesson Summary
- ML কোনো জাদু নয়, এটি প্যাটার্ন রিকগনিশন।
- আমরা ইনপুট এবং আউটপুট দেই, মেশিন অ্যালগরিদম বা রুল বানায়।
- এটি অভিজ্ঞতার সাথে সাথে উন্নত হয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M11-L51
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Machine Learning এবং Traditional Programming এর মূল পার্থক্য কি?', 'Machine Learning এবং Traditional Programming এর মূল পার্থক্য কি?', '["Tradional এ আমরা রুল লিখি, ML এ মেশিন ডেটা থেকে রুল শেখে", "ML স্লো", "Traditional এ কোড লাগে না", "কোনো পার্থক্য নেই"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'AI, ML এবং Deep Learning এর সম্পর্ক কি?', 'AI, ML এবং Deep Learning এর সম্পর্ক কি?', '["সব আলাদা", "AI > ML > DL (AI এর পেটে ML, ML এর পেটে DL)", "DL > ML > AI", "AI = ML"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'মেশিন লার্নিং কিসের মাধ্যমে শেখে?', 'মেশিন লার্নিং কিসের মাধ্যমে শেখে?', '["ম্যাজিক", "ডেটা বা অভিজ্ঞতা (Experience)", "ব্যাটারি", "ভাইরাস"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'আমাদের কোর্সে আমরা ML এর জন্য কোন ল্যাঙ্গুয়েজ ব্যবহার করছি?', 'আমাদের কোর্সে আমরা ML এর জন্য কোন ল্যাঙ্গুয়েজ ব্যবহার করছি?', '["Java", "C++", "R", "Python"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'মেশিনকে আপেল চেনানোর উদাহরণটি কিসের?', 'মেশিনকে আপেল চেনানোর উদাহরণটি কিসের?', '["Supervised Learning (Training with Label)", "Coding", "Gaming", "Hardware"]'::jsonb, 0, 0);


  -- M11-L52: Types of ML
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '52. The ML Landscape: Supervised vs Unsupervised', 'ml-types', 2, 
  $markdown$
# Lesson 52: Types of Machine Learning

মেশিন লার্নিং মূলত ৩ প্রকার। কিন্তু আমরা ফোকাস করবো প্রথম ২টির ওপর।

### 1. Supervised Learning (তত্ত্বাবধানে শেখা)
এখানে মেশিনের একজন "শিক্ষক" থাকে। অর্থাৎ, আমাদের ডেটায় লেবেল (Label) বা সঠিক উত্তর দেওয়া থাকে।
- **Task:** ইনপুট (X) থেকে আউটপুট (Y) প্রেডিক্ট করা।
- **Examples:**
    - **Regression:** সংখ্যা প্রেডিক্ট করা (যেমন: আগামীকালের তাপমাত্রা ২৭°C)।
    - **Classification:** ক্যাটাগরি প্রেডিক্ট করা (যেমন: এই ইমেইলটি কি স্প্যাম? হ্যাঁ/না)।

*উদাহরণ:* ছোট বাচ্চাকে ফলের ছবি দেখিয়ে নাম বলে দেওয়া। পরে তাকে নতুন ফল দেখে নাম বলতে বলা।

### 2. Unsupervised Learning (একা একা শেখা)
এখানে কোনো শিক্ষক নেই। ডেটায় কোনো লেবেল নেই। মেশিনকে আমরা বলি, "দেখো তো এই ডেটার মধ্যে কোনো গ্রুপিং বা প্যাটার্ন পাও কিনা?"
- **Task:** ডেটার গঠন বোঝা।
- **Examples:**
    - **Clustering:** কাস্টমারদের কেনাকাটার ধরণ দেখে ৩টি গ্রুপে ভাগ করা (ধনী, মধ্যবিত্ত, স্টুডেন্ট)।
    - **Dimensionality Reduction:** বিশাল ডেটাকে ছোট করে আনা (PCA)।

*উদাহরণ:* বাচ্চাকে অনেকগুলো খেলনা দিয়ে বলা হলো সাজাতে। সে লালগুলো একপাশে, নীলগুলো একপাশে রাখলো। কেউ তাকে বলে দেয়নি, সে নিজে মিল খুঁজে পেয়েছে।

### 3. Reinforcement Learning (পুরস্কার ও শাস্তি)
এটি গেম খেলার মতো। ভালো কাজ করলে রিওয়ার্ড পয়েন্ট, খারাপ করলে পেনাল্টি। রোবোটিক্স এবং গেম এআই তে এটি প্রচুর ব্যবহৃত হয়।

### Comparison Table
| Type | Data Labeled? | Goal | Example |
| :--- | :--- | :--- | :--- |
| **Supervised** | Yes (With Answer) | Prediction | House Price, Disease Detection |
| **Unsupervised** | No (No Answer) | Pattern Finding | Customer Segmentation |
| **Reinforcement** | No (Action-based) | Strategy | Chess, Self-driving Car |

### End of Lesson Summary
- উত্তর জানা থাকলে **Supervised**।
- উত্তর না জানা থাকলে (প্যাটার্ন খুঁজলে) **Unsupervised**।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M11-L52
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Supervised Learning এর প্রধান বৈশিষ্ট্য কি?', 'Supervised Learning এর প্রধান বৈশিষ্ট্য কি?', '["ডেটায় কোনো লেবেল নেই", "ডেটায় লেবেল বা সঠিক উত্তর (Label/Target) থাকে", "কোনো ডেটা লাগে না", "রোবট ব্যবহার হয়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Classification কোন ধরণের লার্নিং?', 'Classification কোন ধরণের লার্নিং?', '["Unsupervised", "Reinforcement", "Supervised", "Manual"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Unsupervised Learning এর একটি উদাহরণ কোনটি?', 'Unsupervised Learning এর একটি উদাহরণ কোনটি?', '["Regression", "Clustering", "Spam Detection", "Weather Forecast"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'গেম খেলা বা রোবট হাঁটা শেখা কোন ধরণের লার্নিং?', 'গেম খেলা বা রোবট হাঁটা শেখা কোন ধরণের লার্নিং?', '["Supervised", "Unsupervised", "Reinforcement Learning", "Magic"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Regression এর কাজ কি?', 'Regression এর কাজ কি?', '["সংখ্যা প্রেডিক্ট করা (Predicting Numbers)", "ছবি আঁকা", "গ্রুপ করা", "কিছু না"]'::jsonb, 0, 0);


  -- M11-L53: The Great ML Workflow
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '53. The ML Workflow: From Raw Data to Deployment', 'ml-workflow', 3, 
  $markdown$
# Lesson 53: The Machine Learning Workflow

মেশিন লার্নিং মানেই শুধু `train_model()` কমান্ড দেওয়া নয়। এটি একটি বিশাল প্রসেস। একজন ভালো ডেটা সায়েন্টিস্ট এই ফ্লো মেনে চলেন।

### Step 1: Data Collection (ডেটা সংগ্রহ)
ভালো ডেটা ছাড়া ভালো মডেল অসম্ভব। "Garbage In, Garbage Out".

### Step 2: Data Cleaning & Preprocessing (পরিষ্কার করা)
- মিসিং ভ্যালু ঠিক করা।
- আউটলাইয়ার সরানো।
- টেক্সটকে নাম্বারে কনভার্ট করা (Feature Engineering)।

### Step 3: Train-Test Split (ভাগ করা)
ডেটাকে দুই ভাগে ভাগ করা:
- **Training Set (70-80%):** বই পড়ে শেখার জন্য।
- **Testing Set (20-30%):** পরীক্ষা দেওয়ার জন্য।

### Step 4: Model Training (মডেল ট্রেইনিং)
এখানে আমরা অ্যালগরিদম (যেমন Linear Regression, Random Forest) এর মধ্যে ট্রেনিং ডেটা ঢুকিয়ে দেই। মেশিন প্যাটার্ন শেখে।

### Step 5: Model Evaluation (পরীক্ষা)
টেস্টিং ডেটা দিয়ে চেক করি মডেলটি কত ভালো।
- Accuracy কত?
- Error (RMSE) কত?

### Step 6: Parameter Tuning (ফাইন টিউনিং)
মডেলের পারফরম্যান্স বাড়াতে সেটিংস চেঞ্জ করা। একে Hyperparameter Tuning বলে।

### Step 7: Prediction / Deployment
সবশেষে, নতুন ও অজানা ডেটার ওপর প্রেডিকশন করা।

**Visual Flow:**
`Raw Data` -> `Cleaning` -> `Splitting` -> `Training` -> `Testing` -> `Deploy`

### End of Lesson Summary
- কোড লেখার চেয়ে প্ল্যানিং এবং ক্লিনিং এ বেশি সময় যায়।
- এই ফ্লো চার্টটি মুখস্থ করে ফেলুন!

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M11-L53
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ML প্রজেক্টের প্রথম ধাপ কোনটি?', 'ML প্রজেক্টের প্রথম ধাপ কোনটি?', '["মডেল রান করা", "ডেটা কালেকশন", "ডিপ্লয়মেন্ট", "ঘুম"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '"Garbage In, Garbage Out" বলতে কি বোঝায়?', '"Garbage In, Garbage Out" বলতে কি বোঝায়?', '["খারাপ ডেটা দিলে মডেল খারাপ আউটপুট দিবে", "কম্পিউটার ময়লা পছন্দ করে", "ডেটা খুব দামী", "গারবেজ কালেক্টর"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Training Set এর কাজ কি?', 'Training Set এর কাজ কি?', '["মডেলকে পরীক্ষা নেওয়া", "মডেলকে শেখানো (Teach the model)", "ডেটা সেভ করা", "কিছু না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Testing Set দিয়ে আমরা কি করি?', 'Testing Set দিয়ে আমরা কি করি?', '["মডেল ট্রেইন করি", "মডেলের পারফরম্যান্স ইভালুয়েট বা যাচাই করি", "ডেটা ডিলিট করি", "নতুন ডেটা বানাই"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Hyperparameter Tuning কখন করা হয়?', 'Hyperparameter Tuning কখন করা হয়?', '["শুরুতে", "ডেটা কালেকশনের আগে", "মডেল ইভালুয়েশনের পর পারফরম্যান্স বাড়াতে", "Never"]'::jsonb, 2, 2);


  -- M11-L54: Feature Engineering
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '54. Feature Engineering: Computers Hate Text', 'feature-engineering', 4, 
  $markdown$
# Lesson 54: Feature Engineering

কম্পিউটার এবং মেশিন লার্নিং মডেল কিন্তু শুধু সংখ্যা চেনে (০ এবং ১)। সে "Male", "Female", "Dhaka", "Chittagong" এসব টেক্সট বোঝে না।
ডেটাকে মেশিনের উপযোগী করে তোলাই **Feature Engineering**।

### 1. Handling Categorical Data (One-Hot Encoding)
ধরুন আপনার ডেটায় আছে: `Color: Red, Green, Blue`.
মেশিনকে আপনি `Red=1, Green=2, Blue=3` বলতে পারেন না। কারণ মেশিন ভাববে `Blue` (3) কি `Red` (1) এর চেয়ে ৩ গুণ বড়? রঙে তো ছোট-বড় নেই!

সমাধান: **One-Hot Encoding (Dummy Variables)**
আমরা প্রতিটি রঙের জন্য আলাদা কলাম বানাবো:
- Is_Red: 1/0
- Is_Green: 1/0
- Is_Blue: 1/0

### 2. Scaling / Normalization (সবাই সমান)
ধরুন দুটি কলাম আছে:
- **Age:** 20 থেকে 80
- **Income:** 20,000 থেকে 100,000

ইনকামের সংখ্যাগুলো বয়সের চেয়ে অনেক অনেক বড়। মেশিন ভাববে ইনকাম বেশি গুরুত্বপূর্ণ। এটি ভুল।
আমরা সব ডেটাকে একই স্কেলে (যেমন ০ থেকে ১ এর মধ্যে) নিয়ে আসি। একে **Scaling** বলে।

### 3. Creating New Features
যেমন: `Date` কলাম থেকে `Month` বা `Weekday` বের করা। কারণ শুক্রবার বিক্রি বেশি হতে পারে, যা শুধু তারিখ দেখে বোঝা যায় না।

### End of Lesson Summary
- টেক্সট ডেটাকে নাম্বারে কনভার্ট করতে হবে (One-Hot Encoding)।
- রেঞ্জ ভিন্ন হলে স্কেলিং করতে হবে।
- ফিচার ইঞ্জিনিয়ারিং মডেলের অ্যাকুরেসি অনেক বাড়িয়ে দেয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M11-L54
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Feature Engineering এর আসল উদ্দেশ্য কি?', 'Feature Engineering এর আসল উদ্দেশ্য কি?', '["ডেটা ডিলিট করা", "ডেটাকে মেশিনের পড়ার উপযোগী এবং উন্নত করা", "কোডিং করা", "গ্রাফ আঁকা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '"Red, Green, Blue" কে নাম্বারে (1, 2, 3) কনভার্ট করলে কি সমস্যা?', '"Red, Green, Blue" কে নাম্বারে (1, 2, 3) কনভার্ট করলে কি সমস্যা?', '["মেশিন মনে করবে এদের মাঝে গাণিতিক ছোট-বড় সম্পর্ক আছে", "কোনো সমস্যা নেই", "এটি বেস্ট মেথড", "এরর দিবে"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Scale বা Normalize কেন করা হয়?', 'Scale বা Normalize কেন করা হয়?', '["সব ফিচারকে বা ভেরিয়েবলকে একই রেঞ্জে আনার জন্য", "ফাইল ছোট করার জন্য", "রঙ সুন্দর করার জন্য", "নাম্বার বড় করার জন্য"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Dummy Variable বা One-Hot Encoding কখন লাগে?', 'Dummy Variable বা One-Hot Encoding কখন লাগে?', '["নিউমেরিক ডেটায়", "ক্যাটাগরিকাল (টেক্সট) ডেটায়", "ছবিতে", "ভিডিওতে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'জন্মতারিখ (Date) থেকে \"বারের নাম\" (Friday) বের করা কিসের উদাহরণ?', 'জন্মতারিখ (Date) থেকে \"বারের নাম\" (Friday) বের করা কিসের উদাহরণ?', '["Data Cleaning", "Feature Engineering / Creation", "Deleting", "Scaling"]'::jsonb, 1, 1);


  -- M11-L55: Overfitting & Underfitting
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '55. Overfitting vs Underfitting: The Student Analogy', 'overfitting-underfitting', 5, 
  $markdown$
# Lesson 55: Overfitting vs Underfitting

মেশিন লার্নিংয়ের সবচেয়ে বড় চ্যালেঞ্জ এই দুটি। চলুন পরীক্ষার হলের উদাহরণ দিয়ে বুঝি।

### 1. Overfitting (মুখস্থ বিদ্যা)
একজন ছাত্র সারা বছর শুধু গাইড বইয়ের প্রশ্ন মুখস্থ করেছে। (Training Data তে ১০০% মার্কস)।
কিন্তু ফাইনাল পরীক্ষায় প্রশ্ন একটু ঘুরিয়ে আসতেই সে আর পারে না। (Testing Data তে ফেইল)।
- **মডেলের অবস্থা:** ট্রেইনিং ডেটায় খুব ভালো, কিন্তু নতুন ডেটায় খারাপ।
- **কারণ:** মডেল ডেটার অপ্রয়োজনীয় নয়েজ বা শব্দগুলোও মুখস্থ করে ফেলেছে।

### 2. Underfitting (পড়াশোনাই করেনি)
এই ছাত্র কিছুই পড়েনি। সে গাইড বইয়ের প্রশ্নও পারে না, ফাইনাল পরীক্ষার প্রশ্নও পারে না।
- **মডেলের অবস্থা:** ট্রেইনিং এও খারাপ, টেস্টিং এও খারাপ।
- **কারণ:** মডেলটি খুবই সরল (Simple), সে প্যাটার্ন শিখতেই পারেনি।

### 3. Good Fit (প্রকৃত মেধাবী)
যে কনসেপ্ট বুঝে পড়ে। সে কমন প্রশ্নও পারে, আবার নতুন প্রশ্ন আসলেও বুদ্ধি খাটিয়ে উত্তর দিতে পারে।
আমাদের লক্ষ্য হলো এই **Generalized Model** তৈরি করা।

### How to solve?
- **Overfitting হলে:** মডেল সিম্পল করুন, ডেটা বাড়ান, রেগুলারাইজেশন ব্যবহার করুন।
- **Underfitting হলে:** মডেল জটিল করুন, নতুন ফিচার যোগ করুন।

### Bias-Variance Tradeoff
- **High Bias = Underfitting**
- **High Variance = Overfitting**

### End of Lesson Summary
- আমরা চাই মডেল "শিখুক", "মুখস্থ" না করুক।
- Train এবং Test দুই জায়গাতেই ভালো রেজাল্ট করলে সেটি Good Model (Robust).

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M11-L55
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Overfitting এর লক্ষণ কি?', 'Overfitting এর লক্ষণ কি?', '["Train এ খারাপ, Test এ ভালো", "Train এ খুব ভালো, কিন্তু Test/New Data তে খারাপ", "দুই জায়গাতেই ভালো", "দুই জায়গাতেই খারাপ"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Underfitting মানে কি?', 'Underfitting মানে কি?', '["মডেলটি খুব জটিল", "মডেলটি ডেটার প্যাটার্ন শিখতে ব্যর্থ হয়েছে (খুব সরল)", "মডেলটি পারফেক্ট", "ওভারফিটিং"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'মুখস্থ বিদ্যা (Memorization) কোনটির সাথে তুলনা করা যায়?', 'মুখস্থ বিদ্যা (Memorization) কোনটির সাথে তুলনা করা যায়?', '["Good Fit", "Underfitting", "Overfitting", "Regression"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'High Bias বলতে কি বোঝায়?', 'High Bias বলতে কি বোঝায়?', '["Overfitting", "Underfitting", "Good Model", "Pro Model"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'আমরা কেমন মডেল চাই?', 'আমরা কেমন মডেল চাই?', '["Generalized & Robust (সব জায়গায় ভালো)", "Overfitted", "Underfitted", "Biased"]'::jsonb, 0, 0);

  -- ================================================================================================
  -- MODULE 12: SUPERVISED LEARNING ALGORITHMS
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 12: Supervised Learning in R', 'supervised-learning', 12, 'Mastering the Big 5: k-NN, Decision Trees, Random Forest, SVM, and Naive Bayes.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M12-L56: k-NN
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '56. k-Nearest Neighbors (The Lazy Learner)', 'knn-algorithm', 1, 
  $markdown$
# Lesson 56: k-Nearest Neighbors (k-NN)

এটি মেশিন লার্নিংয়ের সবচেয়ে সহজ অ্যালগরিদম। এর দর্শন হলো: "সৎ সঙ্গে স্বর্গবাস, অসৎ সঙ্গে সর্বনাশ"। অর্থাৎ, তোমার প্রতিবেশীরা যা, তুমিও তাই।

### How it works?
ধরুন একটি নতুন অজানা বিন্দু (Data Point) আসলো।
১. সে তার সবচেয়ে কাছের **k**-টি প্রতিবেশীকে খুঁজে বের করে।
২. প্রতিবেশীদের মধ্যে ভোট হয়।
৩. যদি ৫ জন প্রতিবেশীর মধ্যে ৩ জন হয় "Red" আর ২ জন হয় "Blue", তবে নতুন বিন্দুটি হবে **"Red"**।

**k এর মান কত হবে?**
- k খুব ছোট (যেমন ১) হলে আউটলাইয়ার দ্বারা প্রভাবিত হতে পারে (Overfitting)।
- k খুব বড় হলে মডেল খুব সাধারণ হয়ে যায় (Underfitting)।
- সাধারণত `k = 5` বা বিজোড় সংখ্যা ধরা হয় (টাই এড়াতে)।

**R Code (using `class` package):**
```r
library(class)
# ফিচারগুলো আগে Normalize করতে হয়!
# knn(train, test, cl, k = 3)
print("k-NN is simple usually needs scaled data.")
```

### End of Lesson Summary
- k-NN কে "Lazy Learner" বলা হয় কারণ সে ট্রেইনিং এর সময় কিছু শেখে না, শুধু ডেটা মুখস্থ রাখে।
- প্রেডিকশনের সময় সে দূরত্ব (Distance) মাপে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M12-L56
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'k-NN অ্যালগরিদমের মূল নীতি কি?', 'k-NN অ্যালগরিদমের মূল নীতি কি?', '["যে সবচেয়ে শক্তিশালী সে জিতবে", "তোমার কাছের প্রতিবেশীরা যা, তুমিও তাই (Majority Vote)", "লটারির মাধ্যমে", "গড় মান"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'k-NN কে Lazy Learner কেন বলা হয়?', 'k-NN কে Lazy Learner কেন বলা হয়?', '["কারণ এটি স্লো", "কারণ এটি ট্রেইনিং টাইমে কোনো মডেল তৈরি করে না (শুধু ডেটা রাখে)", "কারণ এটি অলস", "কারণ এটি কাজ করে না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'k এর মান সাধারণত কেমন নেওয়া হয়?', 'k এর মান সাধারণত কেমন নেওয়া হয়?', '["বিজোড় সংখ্যা (Odd Number)", "জোড় সংখ্যা", "১০০", "০"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'k-NN এর জন্য ডেটা কেমন হতে হয়?', 'k-NN এর জন্য ডেটা কেমন হতে হয়?', '["Text Data", "Scaled / Normalized Data", "Raw Data", "Videos"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'k=1 হলে কি সমস্যা হতে পারে?', 'k=1 হলে কি সমস্যা হতে পারে?', '["Underfitting", "Overfitting (Noise দ্বারা প্রভাবিত)", "Perfect Matching", "Fast Training"]'::jsonb, 1, 1);


  -- M12-L57: Decision Trees
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '57. Decision Trees (The Flowchart)', 'decision-trees', 2, 
  $markdown$
# Lesson 57: Decision Trees

আমরা যখন কোনো সিদ্ধান্ত নেই, তখন মনের অজান্তেই ডিসিশন ট্রি ব্যবহার করি।
উদাহরণ: "আজ কি বৃষ্টি হবে?"
- যদি **হ্যাঁ**: "ছাতা নাও"।
- যদি **না**: "বাইরে রোদ আছে?"
    - যদি **হ্যাঁ**: "সানগ্লাস নাও"।
    - যদি **না**: "এমনিই যাও"।

### How it works?
মেশিন পুরো ডেটাকে ধাপে ধাপে ভাগ করে (Splitting)।
- **Root Node:** শুরুর প্রশ্ন।
- **Leaf Node:** আর ভাগ করা যায় না (ফাইনাল সিদ্ধান্ত)।

**R Code (using `rpart` package):**
```r
library(rpart)
library(rpart.plot)

# মডেল তৈরি
tree_model <- rpart(Species ~ ., data = iris, method = "class")

# সুন্দর ছবি আঁকা
rpart.plot(tree_model, main="Iris Decision Tree")
```
*আউটপুট:* ছবিতে দেখবেন কন্ডিশন লেখা আছে, যেমন `Petal.Length < 2.4`।

### End of Lesson Summary
- ডিসিশন ট্রি ব্যাখ্যা করা খুব সহজ (Human Readable)।
- এটি ক্যাটাগরিকাল এবং নিউমেরিক দুই ডেটাতেই কাজ করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M12-L57
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Decision Tree দেখতে কিসের মতো?', 'Decision Tree দেখতে কিসের মতো?', '["নদীর মতো", "Flowchart বা উল্টো গাছের মতো", "বৃত্তের মতো", "বক্সের মতো"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Leaf Node দ্বারা কি বোঝায়?', 'Leaf Node দ্বারা কি বোঝায়?', '["শুরুর বিন্দু", "ফাইনাল সিদ্ধান্ত বা আউটপুট", "শাখা প্রশাখা", "শিকড়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ ডিসিশন ট্রি বানানোর প্যাকেজ কোনটি?', 'R এ ডিসিশন ট্রি বানানোর প্যাকেজ কোনটি?', '["randomForest", "rpart", "ggplot2", "dplyr"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Decision Tree এর বড় সুবিধা কি?', 'Decision Tree এর বড় সুবিধা কি?', '["খুব ফাস্ট", "ব্যাখ্যা করা সহজ (Interpretability)", "অল্প মেমোরি লাগে", "সবসময় সঠিক"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Root Node কোথায় থাকে?', 'Root Node কোথায় থাকে?', '["সবার নিচে", "সবার উপরে (শুরুর প্রশ্ন)", "মাঝখানে", "কোথাও না"]'::jsonb, 1, 1);


  -- M12-L58: Random Forest
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '58. Random Forest (The Power of Democracy)', 'random-forest', 3, 
  $markdown$
# Lesson 58: Random Forest

একটি ডিসিশন ট্রি মাঝে মাঝে ভুল করতে পারে (Overfitting)। কিন্তু যদি আমরা **১০০টি ট্রি** বানাই এবং তাদের ভোটের মাধ্যমে সিদ্ধান্ত নেই?
একে বলে **Random Forest**। এটি একটি **Ensemble Method**।

### How it works? (Bagging)
১. পুরো ডেটা থেকে র‍্যান্ডমলি ছোট ছোট স্যাম্পল নেওয়া হয়।
২. প্রতিটি স্যাম্পল দিয়ে আলাদা আলাদা ডিসিশন ট্রি বানানো হয়।
৩. প্রেডিকশনের সময় সব ট্রি ভোট দেয়।
৪. মেজরিটি যা বলে, সেটাই ফাইনাল উত্তর।

**R Code:**
```r
library(randomForest)

# মডেল তৈরি (৫০০ টি ট্রি ডিফল্ট থাকে)
rf_model <- randomForest(Species ~ ., data = iris, ntree = 100)

print(rf_model)
# Confusion Matrix এবং OOB Error দেখাবে
```

### End of Lesson Summary
- Random Forest = Many Decision Trees.
- এটি ট্রি এর চেয়ে অনেক বেশি শক্তিশালী এবং নির্ভুল।
- **Ensemble:** অনেকগুলো মডেলের সমষ্টি।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M12-L58
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Random Forest মুলত কি?', 'Random Forest মুলত কি?', '["একটি বড় গাছ", "অনেকগুলো Decision Tree এর সমষ্টি (Ensemble)", "একটি জঙ্গল", "র‍্যান্ডম নাম্বার"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Random Forest সিদ্ধান্ত কিভাবে নেয়?', 'Random Forest সিদ্ধান্ত কিভাবে নেয়?', '["লটারির মাধ্যমে", "Majority Vote এর মাধ্যমে (সব ট্রির উত্তর থেকে)", "প্রথম ট্রির কথা শোনে", "শেষ ট্রির কথা শোনে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Ensemble Method মানে কি?', 'Ensemble Method মানে কি?', '["একা কাজ করা", "একাধিক মডেলকে একত্রিত করে কাজ করা", "ডেটা ভাগ করা", "মডেল ডিলিট করা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Random Forest কোন সমস্যাটি কমায়?', 'Random Forest কোন সমস্যাটি কমায়?', '["Accuracy", "Underfitting", "Overfitting (সিংগেল ট্রির তুলনায়)", "Speed"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ntree = 100 মানে কি?', 'ntree = 100 মানে কি?', '["১০০ টি ডেটা", "১০০ টি গাছ বা সাব-মডেল", "১০০ জন মানুষ", "১০০ বার লুপ"]'::jsonb, 1, 1);


  -- M12-L59: SVM & Naive Bayes
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '59. SVM & Naive Bayes (Classics)', 'svm-naive-bayes', 4, 
  $markdown$
# Lesson 59: Support Vector Machines & Naive Bayes

### 1. Support Vector Machine (SVM)
SVM ডেটাকে আলাদা করার জন্য দুই গ্রুপের মাঝখান দিয়ে একটি রাস্তা (Hyperplane) তৈরি করে। সে চায় রাস্তাটি যেন সবচেয়ে চওড়া (Margin) হয়।
- **Kernel Trick:** ডেটা যদি সোজা লাইনে আলাদা করা না যায়, SVM সেটাকে ৩য় ডাইমেনশনে নিয়ে আলাদা করে ফেলে। খুব পাওয়ারফুল!

### 2. Naive Bayes
এটি **Probability** বা সম্ভাবনার ওপর ভিত্তি করে কাজ করে (Bayes Theorem)।
- এটি খুব ফাস্ট।
- টেক্সট ক্লাসিফিকেশন (যেমন স্প্যাম ফিল্টার) এর জন্য এটি বস।
- একে "Naive" (বোকা) বলা হয় কারণ সে মনে করে সব ফিচারের গুরুত্ব সমান (যা বাস্তবে হয় না), কিন্তু তবুও সে দারুণ কাজ করে।

**R Code (e1071 package):**
```r
library(e1071)

# SVM
svm_model <- svm(Species ~ ., data = iris)

# Naive Bayes
nb_model <- naiveBayes(Species ~ ., data = iris)
```

### End of Lesson Summary
- জটিল ডেটার জন্য SVM (Margin Maximization).
- টেক্সট বা দ্রুত ফলাফলের জন্য Naive Bayes (Probability).

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M12-L59
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'SVM এর প্রধান লক্ষ্য কি?', 'SVM এর প্রধান লক্ষ্য কি?', '["ডেটা ডিলিট করা", "দুই ক্লাসের মাঝে সর্বোচ্চ চওড়া রাস্তা (Maximum Margin) বা বাউন্ডারি তৈরি করা", "সব মিক্স করা", "দ্রুত কাজ করা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Kernel Trick কোন অ্যালগরিদমে ব্যবহৃত হয়?', 'Kernel Trick কোন অ্যালগরিদমে ব্যবহৃত হয়?', '["k-NN", "SVM", "Naive Bayes", "Linear Regression"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Naive Bayes কিসের ওপর ভিত্তি করে কাজ করে?', 'Naive Bayes কিসের ওপর ভিত্তি করে কাজ করে?', '["Calculus", "Probability (Bayes Theorem)", "Geometry", "Physics"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Spam E-mail ফিল্টারিং এ কোনটি খুব জনপ্রিয়?', 'Spam E-mail ফিল্টারিং এ কোনটি খুব জনপ্রিয়?', '["Linear Regression", "Naive Bayes", "k-Means", "None"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Naive Bayes কে Naive বা বোকা কেন বলা হয়?', 'Naive Bayes কে Naive বা বোকা কেন বলা হয়?', '["এটি ভুল করে", "এটি ধরে নেয় সব ফিচারের গুরুত্ব স্বাধীন ও সমান (Independence Assumption)", "এটি খুব স্লো", "এটি পুরনো"]'::jsonb, 1, 1);


  -- M12-L60: Tuning & Comparison
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '60. Model Tuning & Comparison (The Championship)', 'model-tuning', 5, 
  $markdown$
# Lesson 60: Hyperparameter Tuning & Comparison

কোন মডেলটি সেরা? k-NN নাকি Random Forest?
এটি বোঝার জন্য আমাদের সব মডেলকে একই মাঠে (Data) খেলাতে হবে।

### 1. Cross Validation (CV)
একবার পরীক্ষা না নিয়ে, ডেটাকে ৫ বার ঘুরিয়ে ফিরিয়ে পরীক্ষা নেওয়া (5-Fold CV)। এতে রেজাল্ট ফেয়ার হয়।

### 2. Hyperparameter Tuning
Random Forest এ ১০০টি গাছ ভালো নাকি ৫০০টি? k-NN এ k=3 ভালো নাকি k=7?
এই সেটিংসগুলো খুঁজে বের করার প্রসেসকে **Tuning** বলে।

**R Code (The `caret` way):**
```r
library(caret)

# কন্ট্রোল সেট করা (Repeated CV)
ctrl <- trainControl(method = "cv", number = 5)

# টিউনিং গ্রিড
grid <- expand.grid(k = c(3, 5, 7, 9))

# মডেল ট্রেনিং উইথ টিউনিং
knn_tuned <- train(Species ~ ., data = iris, 
                   method = "knn", 
                   trControl = ctrl, 
                   tuneGrid = grid)

print(knn_tuned)
```
*আউটপুট বলবে কোন k এর জন্য Accuracy সবচেয়ে বেশি ছিল।*

### End of Module Summary
অভিনন্দন! আপনি সুপারভাইজড লার্নিং এর বস হয়ে গেছেন। আপনি এখন জানেন কোন অস্ত্র কখন ব্যবহার করতে হয়! ⚔️🛡️

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M12-L60
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Cross Validation (CV) কেন করা হয়?', 'Cross Validation (CV) কেন করা হয়?', '["মডেলের একুরেসির ওপর বেশি কনফিডেন্স পেতে (Unbiased Estimate)", "ডেটা বড় করতে", "সময় নষ্ট করতে", "কিছুই না"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'k-NN এর k এর মান বা Random Forest এর গাছের সংখ্যা পরিবর্তন করাকে কি বলে?', 'k-NN এর k এর মান বা Random Forest এর গাছের সংখ্যা পরিবর্তন করাকে কি বলে?', '["Training", "Hyperparameter Tuning", "Testing", "Deployment"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'caret প্যাকেজে টিউনিং এর জন্য কোন আর্গুমেন্ট ব্যবহৃত হয়?', 'caret প্যাকেজে টিউনিং এর জন্য কোন আর্গুমেন্ট ব্যবহৃত হয়?', '["tuneGrid", "fixGrid", "setGrid", "noGrid"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '৫-ফোল্ড সিভি (5-Fold CV) মানে কি?', '৫-ফোল্ড সিভি (5-Fold CV) মানে কি?', '["ডেটাকে ৫ বার কপি করা", "ডেটাকে ৫ ভাগে ভাগ করে ৫ বার টেস্ট করা", "৫ টি মডেল বানানো", "৫ মিনিট অপেক্ষা করা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'মডিউল ১২ শেষে আমরা কি শিখলাম?', 'মডিউল ১২ শেষে আমরা কি শিখলাম?', '["শুধু কোড করা", "বিভিন্ন সুপারভাইজড অ্যালগরিদম এবং তাদের টিউনিং", "আর প্রোগ্রামিং এর ইতিহাস", "লুপ চালানো"]'::jsonb, 1, 1);

  -- ================================================================================================
  -- MODULE 13: UNSUPERVISED LEARNING
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 13: Unsupervised Learning', 'unsupervised-learning', 13, 'Finding hidden patterns without labels: Clustering, PCA, and Market Basket Analysis.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M13-L61: K-Means
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '61. K-Means Clustering (Finding Tribes)', 'kmeans-clustering', 1, 
  $markdown$
# Lesson 61: K-Means Clustering

সুপারভাইজড লার্নিংয়ে আমাদের লেবেল (উত্তর) জানা ছিল। কিন্তু আনসুপারভাইজড লার্নিংয়ে আমাদের কাছে কোনো লেবেল নেই।
আমাদের কাজ হলো ডেটার ভেতরের গ্রুপিং বা "Traibe" খুঁজে বের করা। এর সবচেয়ে জনপ্রিয় মেথড হলো **K-Means**।

### How it works?
১. আমরা বলে দেই কয়টি গ্রুপ চাই (K এর মান)। ধরুন K=3।
২. অ্যালগরিদম র‍্যান্ডমলি ৩টি কেন্দ্র (Centroid) বসায়।
৩. প্রতিটি ডেটা তার কাছের কেন্দ্রের দলে যোগ দেয়।
৪. কেন্দ্রগুলো আবার নতুন করে অ্যাডজাস্ট হয়।
৫. এই প্রসেসটি চলতে থাকে যতক্ষণ না গ্রুপগুলো স্টেবল হয়।

### The Elbow Method (K কত হবে?)
K এর মান কত হবে তা বোঝার জন্য আমরা **Elbow Plot** আঁকি। যেখানে গ্রাফটি হাতের কনুইয়ের মতো বাঁক নেয়, সেটাই পারফেক্ট K।

**R Code:**
```r
# আইরিস ডেটাসেটের লেবেল মুছে ফেলি (শুধু সংখ্যা রাখি)
data <- iris[, 1:4]

# K-Means মডেল (3 টি গ্রুপ)
set.seed(123)
km_model <- kmeans(data, centers = 3)

# রেজাল্ট দেখা
print(km_model)
```
*টিপ: `Cluster means` টেবিলটি দেখুন। এটি বলে দেয় কোন গ্রুপের বৈশিষ্ট্য কী।*

### End of Lesson Summary
- K-Means ডেটাকে K সংখ্যক গ্রুপে ভাগ করে।
- Elbow Method দিয়ে K এর মান বের করা হয়।
- এটি ফাস্ট এবং বড় ডেটায় ভালো কাজ করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M13-L61
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'K-Means Clustering কোন ধরণের লার্নিং?', 'K-Means Clustering কোন ধরণের লার্নিং?', '["Supervised", "Unsupervised", "Reinforcement", "Deep"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'K-Means এ K মানে কি?', 'K-Means এ K মানে কি?', '["ডেটার সাইজ", "গ্রুপ বা ক্লাস্টারের সংখ্যা", "মেমোরি সাইজ", "কিছুই না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কোন মেথড দিয়ে K এর সঠিক মান বের করা যায়?', 'কোন মেথড দিয়ে K এর সঠিক মান বের করা যায়?', '["Knee Method", "Elbow Method", "Hand Method", "Thumb Method"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Centroid কি?', 'Centroid কি?', '["একটি গ্রুপের কেন্দ্রবিন্দু", "সবচেয়ে দূরের বিন্দু", "আউটলাইয়ার", "এরর"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'K-Means অ্যালগরিদম কখন থামে?', 'K-Means অ্যালগরিদম কখন থামে?', '["যখন কারেন্ট চলে যায়", "যখন গ্রুপগুলো স্টেবল হয় (আর পরিবর্তন হয় না)", "১ মিনিট পর", "কখনই থামে না"]'::jsonb, 1, 1);


  -- M13-L62: Hierarchical Clustering
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '62. Hierarchical Clustering & Dendrograms', 'hierarchical-clustering', 2, 
  $markdown$
# Lesson 62: Hierarchical Clustering

K-Means এ আগেই K বলতে হয়। কিন্তু Hierarchical Clustering এ তার দরকার নেই। এটি একটি বিশাল ফ্যামিলি ট্রি (Family Tree) বা **Dendrogram** তৈরি করে।

### How it works? (Agglomerative)
১. শুরুতে প্রতিটি ডেটা একেকটি আলাদা গ্রুপ।
২. সবচেয়ে কাছের দুটি গ্রুপ মিলে বড় গ্রুপ হয়।
৩. এভাবে চলতে চলতে শেষে সবাই মিলে একটি বড় গ্রুপ হয়।

আমরা Dendrogram দেখে সিদ্ধান্ত নেই কোথায় "কাটবো" এবং কয়টি গ্রুপ নিবো।

**R Code:**
```r
# ১. দূরত্ব বের করা
dist_matrix <- dist(iris[, 1:4])

# ২. ক্লাস্টারিং করা (hclust)
hc_model <- hclust(dist_matrix)

# ৩. ডেন্ড্রোগ্রাম আঁকা
plot(hc_model, main = "Dendrogram of Iris")
rect.hclust(hc_model, k = 3, border = "red") # ৩ ভাগে ভাগ করা
```

### End of Lesson Summary
- **Dendrogram:** গাছের মতো ডায়াগ্রাম যা গ্রুপিং দেখায়।
- আগে থেকে K বলা লাগে না।
- ছোট ডেটাসেটে এটি খুব সুন্দর ভিজ্যুয়ালাইজেশন দেয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M13-L62
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Hierarchical Clustering এর আউটপুট ডায়াগ্রামকে কি বলে?', 'Hierarchical Clustering এর আউটপুট ডায়াগ্রামকে কি বলে?', '["Histogram", "Dendrogram", "Scatterplot", "Boxplot"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Hierarchical Clustering এর প্রধান সুবিধা কি?', 'Hierarchical Clustering এর প্রধান সুবিধা কি?', '["আগে থেকে K এর মান বলতে হয় না", "খুব ফাস্ট", "মেমোরি কম খায়", "কিছুই না"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Agglomerative মেথড কিভাবে কাজ করে?', 'Agglomerative মেথড কিভাবে কাজ করে?', '["বড় থেকে ছোট (Top-Down)", "ছোট থেকে বড় (Bottom-Up / জুড়ে দেওয়া)", "র‍্যান্ডম", "মিডল-আউট"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ ডিসটেন্স মেট্রিক্স বের করার ফাংশন কি?', 'R এ ডিসটেন্স মেট্রিক্স বের করার ফাংশন কি?', '["distance()", "dist()", "measure()", "gap()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Dendrogram দেখতে কিসের মতো?', 'Dendrogram দেখতে কিসের মতো?', '["পাহাড়ের মতো", "গাছের শেকড় বা ফ্যামিলি ট্রির মতো", "নদীর মতো", "রাস্তার মতো"]'::jsonb, 1, 1);


  -- M13-L63: PCA
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '63. PCA (Dimension Reduction)', 'pca-dimension-reduction', 3, 
  $markdown$
# Lesson 63: Principal Component Analysis (PCA)

আপনার ডেটায় যদি ১০০টি কলাম (Variable) থাকে, তবে কি গ্রাফ আঁকা সম্ভব? না, কারণ আমরা ৩ ডাইমেনশনের বেশি দেখতে পাই না।
আবার ১০০টি কলাম নিয়ে মডেল বানালে মডেল স্লো হয়ে যায় (Curse of Dimensionality)।

**PCA** এর কাজ হলো এই ১০০টি কলামকে কমিয়ে ২-৩টি সুপার-কলামে (Principal Components) নিয়ে আসা, কিন্তু তথ্যের খুব একটা ক্ষতি না করে।

### How PCA works?
এটি ডেটার ভেতরের ভেরিয়েশন (Variance) খুঁজে বের করে এবং নতুন অক্ষ (Axis) তৈরি করে।
- **PC1:** সবচেয়ে বেশি তথ্য ধারণ করে।
- **PC2:** দ্বিতীয় সর্বোচ্চ তথ্য ধারণ করে।

**R Code:**
```r
# prcomp ফাংশন (Scale করা জরুরি)
pca_result <- prcomp(iris[, 1:4], scale = TRUE)

summary(pca_result) 
# Proportion of Variance দেখুন। প্রথম ২টি PC কতটুকু ব্যাখ্যা করছে?

# নতুন ২ ডাইমেনশনে প্লট
biplot(pca_result)
```

### End of Lesson Summary
- **PCA:** বড় ডেটাকে ছোট করে (Compression)।
- এটি ডেটার নয়েজ কমায় এবং ভিজ্যুয়ালাইজেশন সম্ভব করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M13-L63
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'PCA এর পূর্ণরূপ কি?', 'PCA এর পূর্ণরূপ কি?', '["Primary Code Analysis", "Principal Component Analysis", "Prime Cluster Area", "Personal Computer Algorithm"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'PCA এর মূল কাজ কি?', 'PCA এর মূল কাজ কি?', '["ডেটা বাড়ানো", "Dimensionality Reduction (কলাম কমানো)", "ডেটা ডিলিট করা", "কালারিং করা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'সর্বাধিক তথ্য কোন কম্পোনেন্টে থাকে?', 'সর্বাধিক তথ্য কোন কম্পোনেন্টে থাকে?', '["PC1 (First Principal Component)", "PC100", "PC Last", "সবগুলো সমান"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'PCA করার আগে ডেটা কি করা উচিত?', 'PCA করার আগে ডেটা কি করা উচিত?', '["Shuffle", "Scale / Normalize", "Delete", "Copy"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'অনেক বেশি কলাম থাকলে কি সমস্যা হয়?', 'অনেক বেশি কলাম থাকলে কি সমস্যা হয়?', '["Curse of Dimensionality", "Blessing of Data", "Happy Problem", "No Problem"]'::jsonb, 0, 0);


  -- M13-L64: Interpreting Clusters
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '64. Cluster Interpretation (Profiling)', 'cluster-interpretation', 4, 
  $markdown$
# Lesson 64: Interpreting Your Custers

আমরা ক্লাস্টার তো বানালাম (যেমন: Group 1, Group 2, Group 3)। কিন্তু এই গ্রুপগুলোর মানে কি?
- Group 1 কারা? (হয়তো বড়লোক কাস্টমার)
- Group 2 কারা? (হয়তো স্টুডেন্ট)

এটি বোঝার জন্য আমাদের **Cluster Profiling** করতে হয়।

### Steps
১. ক্লাস্টার অ্যাসাইন করা।
২. প্রতি ক্লাস্টারের গড় (Mean) বের করা।
৩. তুলনা করা।

**R Code:**
```r
# ১. ক্লাস্টার আইডি যোগ করা
data <- iris[, 1:4]
km <- kmeans(data, centers = 3)
data$Cluster <- km$cluster

# ২. গ্রুপ অনুযায়ী গড় দেখা
aggregate(. ~ Cluster, data = data, mean)
```
*আউটপুট বাখ্যা:* হয়তো দেখবেন Cluster 1 এর `Petal.Length` অনেক কম, মানে এরা ছোট ফুল। Cluster 3 এর অনেক বেশি, মানে এরা বড় ফুল।

### End of Lesson Summary
- ক্লাস্টারিং এর পর প্রোফাইলিং জরুরি।
- `aggregate()` ফাংশন দিয়ে গড় বের করে বৈশিষ্ট্য বোঝা যায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M13-L64
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ক্লাস্টার প্রোফাইলিং কেন করা হয়?', 'ক্লাস্টার প্রোফাইলিং কেন করা হয়?', '["গ্রুপগুলোর বৈশিষ্ট্য বা অর্থ বোঝার জন্য", "সময় কাটানোর জন্য", "কোড বড় করার জন্য", "জানিনা"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ গ্রুপ অনুযায়ী গড় বের করার ফাংশন কোনটি?', 'R এ গ্রুপ অনুযায়ী গড় বের করার ফাংশন কোনটি?', '["mean()", "aggregate()", "sum()", "split()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'যদি দেখেন একটি গ্রুপের \"Income\" গড় অনেক বেশি, তাদের কি বলবেন?', 'যদি দেখেন একটি গ্রুপের \"Income\" গড় অনেক বেশি, তাদের কি বলবেন?', '["Low Value Customer", "High Value / Rich Customer", "Invalid Data", "Loss Project"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ক্লাস্টার ইন্টারপ্রিটেশন কার পার্ট?', 'ক্লাস্টার ইন্টারপ্রিটেশন কার পার্ট?', '["Modeling", "Post-Modeling Analysis", "Preprocessing", "Deployment"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'K-means এর আউটপুটে $cluster কি দেয়?', 'K-means এর আউটপুটে $cluster কি দেয়?', '["সেন্ট্রয়েড", "প্রতিটি ডেটা পয়েন্টের গ্রুপ আইডি (১, ২ বা ৩)", "এরর রেট", "কিছুই না"]'::jsonb, 1, 1);


  -- M13-L65: Association Rules
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '65. Market Basket Analysis (Beer & Diapers)', 'association-rules', 5, 
  $markdown$
# Lesson 65: Association Rules (Market Basket Analysis)

সুপারশপগুলো কিভাবে জানে যে **ব্রেড** কিনলে আপনি **বাটার** কিনবেন?
এটা তারা শেখে **Association Rules** দিয়ে। এটি **"If This -> Then That"** প্যাটার্ন খুঁজে বের করে।

### The Famous Example: Beer & Diapers
ওয়ালমার্ট দেখলো, শুক্রবার বিকেলে যারা ডায়াপার কেনে, তারা বিয়ারও কেনে! (তরুণ বাবারা)। তাই তারা দুটি পাশাপাশি রাখলো এবং বিক্রি বেড়ে গেল।

### Key Concepts
1.  **Support:** কত মানুষ এটি কেনে? (Popularity)
2.  **Confidence:** ক কিনলে খ কেনার সম্ভাবনা কত? (Reliability)
3.  **Lift:** সম্পর্কটি কি কাকতালীয় নাকি শক্তিশালী? (Lift > 1 হলে শক্তিশালী)।

**R Code (arules package):**
```r
# library(arules)
# rules <- apriori(transactions, parameter = list(supp = 0.001, conf = 0.8))
# inspect(rules[1:5])
```

### End of Lesson Summary
- **Apriori Algorithm** প্যাটার্ন খোঁজে।
- এটি রিটেইল বা সুপারশপের জন্য গেম চেঞ্জার।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M13-L65
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Market Basket Analysis এর জনপ্রিয় উদাহরণ কোনটি?', 'Market Basket Analysis এর জনপ্রিয় উদাহরণ কোনটি?', '["Tea & Coffee", "Beer & Diapers", "Rice & Curry", "Sun & Moon"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Association Rules কোন ধরণের সমস্যা সমাধান করে?', 'Association Rules কোন ধরণের সমস্যা সমাধান করে?', '["Recommendation (কি কিনলে কি সাজেস্ট করবো)", "Prediction", "Classification", "Cleaning"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ কোন প্যাকেজটি মার্কেট বাস্কেট এনালাইসিসে ব্যবহৃত হয়?', 'R এ কোন প্যাকেজটি মার্কেট বাস্কেট এনালাইসিসে ব্যবহৃত হয়?', '["ggplot2", "arules", "shiny", "caret"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Lift > 1 এর মানে কি?', 'Lift > 1 এর মানে কি?', '["সম্পর্কটি নেগেটিভ", "সম্পর্কটি শক্তিশালী (Strong Association)", "কোনো সম্পর্ক নেই", "ভুল"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Apriori অ্যালগরিদম কি খুঁজে বের করে?', 'Apriori অ্যালগরিদম কি খুঁজে বের করে?', '["Frequent Itemsets (যে জিনিসগুলো একসাথে কেনা হয়)", "Outliers", "Mean", "Regression Line"]'::jsonb, 0, 0);

  -- ================================================================================================
  -- MODULE 14: MODEL EVALUATION & VALIDATION
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 14: Model Evaluation', 'model-evaluation', 14, 'Beyond Accuracy: Confusion Matrix, ROC-AUC, Precision-Recall and the Bias-Variance Tradeoff.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M14-L66: Confusion Matrix
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '66. The Confusion Matrix (Not Confusing!)', 'confusion-matrix', 1, 
  $markdown$
# Lesson 66: The Confusion Matrix

মেশিন লার্নিংয়ে `Accuracy = 99%` দেখলেই খুশি হবেন না। এটি মিথ্যা বলতে পারে।
মডেল আসলে কোথায় ভুল করছে তা দেখার জন্য আমরা **Confusion Matrix** ব্যবহার করি। এটি একটি ২x২ টেবিল।

### The 4 Quadrants
ধরুন আমরা প্রেডিক্ট করছি: **"রোগীটির কি ক্যান্সার আছে?"** (Yes/No)

1.  **True Positive (TP):** মডেল বলেছে "Yes" এবং সত্যিই তার ক্যান্সার আছে। (সঠিক ✅)
2.  **True Negative (TN):** মডেল বলেছে "No" এবং সত্যিই তার ক্যান্সার নেই। (সঠিক ✅)
3.  **False Positive (FP):** মডেল বলেছে "Yes" কিন্তু তার ক্যান্সার নেই। (ভুল ❌ - **Type I Error**)। একে "False Alarm" ও বলা হয়। সুস্থ মানুষকে রোগী বলা।
4.  **False Negative (FN):** মডেল বলেছে "No" কিন্তু তার ক্যান্সার আছে। (ভুল ❌ - **Type II Error**)। এটি সবচেয়ে বিপজ্জনক! রোগীকে বাড়ি পাঠিয়ে দেওয়া।

### Why it matters?
শুধু ঠিক বলাটাই সব না, কোন ধরণের ভুল করছি সেটা জানাও জরুরি। ক্যান্সারের ক্ষেত্রে FN কমানো বেশি জরুরি, আবার স্প্যাম ডিটেকশনে FP কমানো জরুরি (ভালো মেইল যেন স্প্যাম না হয়)।

**R Code:**
```r
library(caret)
# confusionMatrix(predicted, actual)
# এটি একবারে সব মেট্রিক দিয়ে দেয়।
```

### End of Lesson Summary
- Confusion Matrix আমাদের ভুলের ধরণ দেখায়।
- Type I Error (False Alarm) vs Type II Error (Missed Opportunity).

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M14-L66
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Confusion Matrix মূলত কি?', 'Confusion Matrix মূলত কি?', '["একটি ২x২ টেবিল যা প্রেডিকশন এবং একচুয়াল ভ্যালুর তুলনা করে", "একটি গেম", "একটি ফর্মুলা", "কিছুই না"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'False Negative (FN) মানে কি?', 'False Negative (FN) মানে কি?', '["মডেল ঠিক বলেছে", "মডেল না বলেছে, কিন্তু আসলে হ্যাঁ (Missed Case)", "মডেল হ্যাঁ বলেছে, কিন্তু আসলে না", "কোনোটিই না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ক্যান্সার ডিটেকশনে কোনটি সবচেয়ে বিপজ্জনক?', 'ক্যান্সার ডিটেকশনে কোনটি সবচেয়ে বিপজ্জনক?', '["False Positive", "False Negative (রোগ আছে কিন্তু মডেল ধরতে পারেনি)", "True Positive", "True Negative"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Type I Error এর অপর নাম কি?', 'Type I Error এর অপর নাম কি?', '["True Positive", "False Positive (False Alarm)", "False Negative", "Accuracy"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ Confusion Matrix দেখার ফাংশন কোন প্যাকেজে থাকে?', 'R এ Confusion Matrix দেখার ফাংশন কোন প্যাকেজে থাকে?', '["dplyr", "caret", "ggplot2", "stats"]'::jsonb, 1, 1);


  -- M14-L67: Accuracy vs Precision vs Recall
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '67. Accuracy Paradox: Precision vs Recall', 'precision-recall', 2, 
  $markdown$
# Lesson 67: Accuracy, Precision, Recall

### The Accuracy Paradox (অ্যাকুরেসি কেন মিথ্যা বলে?)
ধরুন ১০০ জন রোগীর মধ্যে ৯৯ জন সুস্থ এবং ১ জন অসুস্থ।
আপনার মডেল যদি সবার জন্যই বলে "সুস্থ", তবুও তার **Accuracy 99%**! কিন্তু সে আসল রোগীকেই ধরতে পারেনি।
এইসব ক্ষেত্রে Accuracy অর্থহীন।

### 1. Precision (নির্ভুলতা)
`Precision = TP / (TP + FP)`
- মডেল যাদের "Yes" বলেছে, তাদের মধ্যে কতজন আসলেই "Yes"?
- *উদাহরণ:* ইমেইল স্প্যাম ফিল্টার। আমরা চাই না ইম্পরট্যান্ট মেইল স্প্যামে যাক। তাই এখানে Precision বেশি হওয়া চাই।

### 2. Recall / Sensitivity (স্মরণশক্তি)
`Recall = TP / (TP + FN)`
- আসলেই যারা "Yes", তাদের মধ্যে মডেল কতজনকে ধরতে পেরেছে?
- *উদাহরণ:* ক্যান্সার ডিটেকশন। আমরা একজন রোগীকেও মিস করতে চাই না। তাই এখানে Recall বেশি হওয়া জরুরি।

### The Trade-off
দুর্ভাগ্যবশত, আপনি Precision বাড়াতে গেলে Recall কমে যায়, আবার Recall বাড়াতে গেলে Precision কমে।

### End of Lesson Summary
- **Imbalanced Data** হলে Accuracy দেখবেন না।
- **Precision:** ভুলের ভয় থাকলে (False Positive কমাতে চাইলে)।
- **Recall:** মিস করার ভয় থাকলে (False Negative কমাতে চাইলে)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M14-L67
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Imbalanced Data (যেমন ৯৯% সুস্থ, ১% অসুস্থ) তে কোন মেট্রিকটি ব্যবহার করা উচিত নয়?', 'Imbalanced Data (যেমন ৯৯% সুস্থ, ১% অসুস্থ) তে কোন মেট্রিকটি ব্যবহার করা উচিত নয়?', '["Precision", "Recall", "Accuracy (এটি বিভ্রান্তিকর হতে পারে)", "F1 Score"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Precision এর সূত্র কি?', 'Precision এর সূত্র কি?', '["TP / (TP + FP)", "TP / (TP + FN)", "TP / Total", "TN / Total"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'আমরা স্প্যাম ফিল্টারে কোনটি বেশি চাই?', 'আমরা স্প্যাম ফিল্টারে কোনটি বেশি চাই?', '["High Recall", "High Precision (ভালো মেইল যেন স্প্যাম না হয়)", "Low Accuracy", "High Error"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Recall বা Sensitivity এর মানে কি?', 'Recall বা Sensitivity এর মানে কি?', '["কত দ্রুত মডেল চলে", "আসল পজিটিভ কেসগুলোর কতগুলো মডেল ধরতে পেরেছে", "মডেল কত নিখুঁত", "ভুলের হার"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Precision এবং Recall এর সম্পর্ক কেমন?', 'Precision এবং Recall এর সম্পর্ক কেমন?', '["ধ্রুবক", "সমানুপাতিক", "Trade-off বা বিপরীতমুখী (একটি বাড়লে অন্যটি কমতে পারে)", "কোনো সম্পর্ক নেই"]'::jsonb, 2, 2);


  -- M14-L68: F1 Score & ROC-AUC
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '68. F1 Score & ROC-AUC Curve', 'f1-roc-auc', 3, 
  $markdown$
# Lesson 68: F1 Score & ROC-AUC

Precision এবং Recall এর মারামারির সমাধান কি?

### 1. F1 Score
এটি Precision এবং Recall এর একটি ভারসাম্য (Harmonic Mean)।
- যদি Precision এবং Recall দুটোই ভালো হয়, তবেই F1 Score ভালো হবে।
- Imbalanced ডেটার জন্য এটি সেরা মেট্রিক।

### 2. ROC Curve & AUC
**ROC (Receiver Operating Characteristic)** একটি কার্ভ যা দেখায় মডেলটি বিভিন্ন থ্রেশহোল্ডে কেমন পারফর্ম করছে।
- **x-axis:** False Positive Rate
- **y-axis:** True Positive Rate

**AUC (Area Under the Curve):**
কার্ভের নিচের এরিয়া।
- AUC = 0.5 (কয়েন টস বা লটারির মতো মডেল) ❌
- AUC = 1.0 (পারফেক্ট মডেল) ✅
- সাধারণত AUC > 0.8 হলে মডেলটিকে ভালো বলা হয়।

**R Code:**
```r
library(pROC)
# plot(roc(response, predictor))
# auc(roc_obj)
```

### End of Lesson Summary
- **F1 Score:** এক কথায় মডেলের কোয়ালিটি বোঝার জন্য (Precision + Recall এর সংমিশ্রণ)।
- **AUC:** মডেলের ক্লাসিফিকেশন ক্ষমতা মাপার জন্য।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M14-L68
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'F1 Score কিসের সংমিশ্রণ?', 'F1 Score কিসের সংমিশ্রণ?', '["Accuracy & Loss", "Precision & Recall (Harmonic Mean)", "TP & TN", "Mean & Median"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'একটি পারফেক্ট মডেলের AUC কত?', 'একটি পারফেক্ট মডেলের AUC কত?', '["0.0", "0.5", "1.0", "100"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ROC Curve এ x এবং y অক্ষে কি থাকে?', 'ROC Curve এ x এবং y অক্ষে কি থাকে?', '["Price & Quantity", "FPR & TPR", "Precision & Recall", "Error & Accuracy"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'AUC = 0.5 এর মানে কি?', 'AUC = 0.5 এর মানে কি?', '["মডেলটি খুব ভালো", "মডেলটি র‍্যান্ডম গেস করছে (কোনো কাজের না)", "মডেলটি পারফেক্ট", "কিছুই না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Imbalanced ডেটার জন্য Accuracy এর পরিবর্তে কোনটি ব্যবহার করা ভালো?', 'Imbalanced ডেটার জন্য Accuracy এর পরিবর্তে কোনটি ব্যবহার করা ভালো?', '["Mean Squared Error", "F1 Score", "R-squared", "None"]'::jsonb, 1, 1);


  -- M14-L69: Cross Validation Deep Dive
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '69. Advanced Cross Validation techniques', 'advanced-cv', 4, 
  $markdown$
# Lesson 69: Advanced Cross Validation

আমরা আগে 5-Fold CV দেখেছি। এখন আরও গভীরে যাবো।

### 1. Why simple Train/Test Split fails?
একবার স্প্লিট করলে ভাগ্যক্রমে Test Set এ সহজ ডেটা পড়ে যেতে পারে। তখন Accuracy বেশি আসবে, যা মিথ্যা।
CV তে আমরা ডেটাকে বারবার ঘুরিয়ে টেস্ট করি।

### 2. Stratified K-Fold
ধরুন আপনার ডেটায় "Yes" আছে ১০% আর "No" আছে ৯০%।
র‍্যান্ডম স্প্লিট করলে এমন হতে পারে যে Test Set এ কোনো "Yes" ই পড়লো না!
**Stratified** মেথড নিশ্চিত করে যে প্রতিটি ফোল্ডে "Yes" এবং "No" এর অনুপাত যেন সমান থাকে। এটি সেরা মেথড।

### 3. LOOCV (Leave-One-Out CV)
যদি ডেটা খুব কম থাকে (যেমন ৫০টি), তবে আমরা k-fold করি না।
তখন একেকবারে ১টি ডেটা রেখে বাকি ৪৯টি দিয়ে ট্রেইন করি। এভাবে ৫০ বার লুপ চলে। এটি খুব একুরেট কিন্তু সময়সাপেক্ষ।

**R Code (caret):**
```r
trainControl(method = "LOOCV")
trainControl(method = "repeatedcv", number = 10, repeats = 3)
```

### End of Lesson Summary
- **Stratified:** অনুপাত ঠিক রাখে (Imbalanced ডেটার জন্য মাস্ট)।
- **LOOCV:** ছোট ডেটার জন্য।
- **k-Fold:** স্ট্যান্ডার্ড (বড় ডেটার জন্য)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M14-L69
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Stratified K-Fold এর বিশেষত্ব কি?', 'Stratified K-Fold এর বিশেষত্ব কি?', '["এটি দ্রুত", "এটি ক্লাসের অনুপাত (Class Proportion) বা ভারসাম্য বজায় রাখে", "এটি ডেটা ডিলিট করে", "এটি বারবার রিপিট করে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'LOOCV (Leave-One-Out) কখন ব্যবহার করা হয়?', 'LOOCV (Leave-One-Out) কখন ব্যবহার করা হয়?', '["বিশাল ডেটাসেটে", "খুব ছোট ডেটাসেটে যেখানে প্রতিটি ডেটা গুরুত্বপূর্ণ", "ইমেজ ডেটায়", "টেক্সট ডেটায়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'LOOCV এর একটি অসুবিধা কি?', 'LOOCV এর একটি অসুবিধা কি?', '["এটি খুব দ্রুত", "এটি খুব স্লো (Computational Expensive)", "এটি একুরেট না", "এটি সহজ"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Repeated CV মানে কি?', 'Repeated CV মানে কি?', '["CV প্রসেসটিই কয়েকবার রিপিট করা (যেমন ১০-ফোল্ড ৩ বার)", "মডেল কপি করা", "ডেটা কপি করা", "ভুল করা"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Simple Train/Test এর চেয়ে CV কেন ভালো?', 'Simple Train/Test এর চেয়ে CV কেন ভালো?', '["এটি মডেলের রেজাল্টের ভেরিয়েন্স কমায় এবং রিলায়েবল এস্টিমেট দেয়", "এটি সহজ", "এটি কোড কমায়", "এটি মেমোরি কমায়"]'::jsonb, 0, 0);


  -- M14-L70: Bias-Variance & Practical Examples
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '70. Bias-Variance Tradeoff: The Sweet Spot', 'bias-variance', 5, 
  $markdown$
# Lesson 70: Bias-Variance Tradeoff

মডেল ইভালুয়েশনের শেষ কথা হলো বায়াস এবং ভেরিয়েন্স এর ব্যালেন্স।

### 1. Bias (ভুল ধারণা)
- **High Bias:** মডেল ডেটার দিকে ভালোমত তাকায়নি। অনেক বেশি সরল।
- **ফলাফল:** Underfitting. (Accuracy কম)।

### 2. Variance (অস্থিরতা)
- **High Variance:** মডেল ডেটার প্রতিটি ছোটখাটো নয়েজও মুখস্থ করে ফেলেছে।
- **ফলাফল:** Overfitting. (Training এ ভালো, Testing এ খারাপ)।

### The Bullseye Analogy
একটি ডার্ট বোর্ডে ঢিল মারছেন:
- **Low Bias, Low Variance:** সব ঢিল মাঝখানে (বুলসআই) পড়ছে। (আমাদের লক্ষ্য ✅)
- **High Bias:** সব ঢিল বোর্ডের বাইরে বা এক কোণায় পড়ছে। ❌
- **High Variance:** ঢিলগুলো সব ছড়িয়ে ছিটিয়ে পড়ছে, কোনো ঠিক নেই। ❌

### Total Error Formula
`Total Error = Bias^2 + Variance + Irreducible Error`
আমরা চাই Bias এবং Variance দুটোর যোগফল যেন সর্বনিম্ন হয়।

### End of Module Summary
আপনারা এখন শুধু মডেল বানাতে পারেন না, আপনারা জানেন মডেলটি **কতটা ভালো** এবং **কেন ভালো বা খারাপ**। একজন প্রো ডাটা সায়েন্টিস্টের এটাই লক্ষণ!

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M14-L70
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'High Bias এর ফলাফল কি?', 'High Bias এর ফলাফল কি?', '["Overfitting", "Underfitting", "Good Fit", "None"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'High Variance এর ফলাফল কি?', 'High Variance এর ফলাফল কি?', '["Underfitting", "Overfitting (Training এ ভালো, Test এ খারাপ)", "Perfect Model", "Stable"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'আমরা কেমন মডেল চাই?', 'আমরা কেমন মডেল চাই?', '["High Bias, High Variance", "Low Bias, High Variance", "Low Bias, Low Variance (Balance)", "High Bias, Low Variance"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Total Error এর উপাদান কোনটি?', 'Total Error এর উপাদান কোনটি?', '["Bias + Variance + Irreducible Error", "Mean + Median", "Loss + Profit", "Train + Test"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'যদি দেখেন মডেল Train এ ৯৯% কিন্তু Test এ ৬০% একুরেসি পাচ্ছে, এটা কিসের লক্ষণ?', 'যদি দেখেন মডেল Train এ ৯৯% কিন্তু Test এ ৬০% একুরেসি পাচ্ছে, এটা কিসের লক্ষণ?', '["High Variance (Overfitting)", "High Bias (Underfitting)", "Good Fit", "Data Problem"]'::jsonb, 0, 0);

  -- ================================================================================================
  -- MODULE 15: INTRODUCTION TO NEURAL NETWORKS
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 15: Intro to Neural Networks', 'neural-networks-intro', 15, 'Building a Brain with R. From Biological Neurons to Artificial Neural Networks.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M15-L71: Neural Networks Explained
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '71. Neural Networks: Inspired by Biology', 'neural-networks-explained', 1, 
  $markdown$
# Lesson 71: Neural Networks: Inspired by Biology

আমরা জানি মানুষের মস্তিষ্ক (Brain) বিশ্বের সবচেয়ে শক্তিশালী কম্পিউটার। কিন্তু এটি কিভাবে কাজ করে?
ব্রেইনের মূল একক হলো **Neuron (নিউরন)**। আমাদের মাথায় প্রায় ৮৬ বিলিয়ন নিউরন আছে যারা একে অপরের সাথে ইলেকট্রিক সিগন্যাল দিয়ে কথা বলে।

### Artificial Neural Network (ANN)
কম্পিউটার সায়েন্টিস্টরা ভাবলেন, "আমরা যদি কম্পিউটারে এমন কৃত্রিম নিউরন বানাতে পারি?"
এখান থেকেই **Neural Network** এর জন্ম।

### Structure
১. **Input Layer:** যা ডেটা গ্রহণ করে (যেমন: চোখের রেটিনা ছবি দেখে)।
২. **Hidden Layers:** যারা প্রসেসিং বা চিন্তাভাবনা করে।
৩. **Output Layer:** যা সিদ্ধান্ত দেয় (যেমন: "এটি একটি বিড়াল")।

### End of Lesson Summary
- Neural Network মানুষের ব্রেইনের অনুকরণে তৈরি।
- এটি লেয়ার বাই লেয়ার প্রসেসিং করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M15-L71
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Neural Network এর ধারণা কোথা থেকে এসেছে?', 'Neural Network এর ধারণা কোথা থেকে এসেছে?', '["Human Brain (Biology)", "Car Engine", "Solar System", "Tree Structure"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Brain এর মূল একক কি যা তথ্য আদান প্রদান করে?', 'Brain এর মূল একক কি যা তথ্য আদান প্রদান করে?', '["Cell", "Neuron", "Bone", "Muscle"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Neural Network এর প্রথম লেয়ারকে কি বলে?', 'Neural Network এর প্রথম লেয়ারকে কি বলে?', '["Output Layer", "Hidden Layer", "Input Layer", "Brain Layer"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Deep Learning এ কোন লেয়ারটি মূলত \"Deep\" বা গভীর?', 'Deep Learning এ কোন লেয়ারটি মূলত \"Deep\" বা গভীর?', '["Input Layer", "Hidden Layers (একাধিক থাকে)", "Output Layer", "None"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ANN এর পূর্ণরূপ কি?', 'ANN এর পূর্ণরূপ কি?', '["Artificial Neural Network", "Automated Neural Node", "Active Net Network", "Nothing"]'::jsonb, 0, 0);


  -- M15-L72: The Perceptron
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '72. The Perceptron: The Single Neuron', 'perceptron', 2, 
  $markdown$
# Lesson 72: The Perceptron

সবচেয়ে সরল Neural Network হলো **Perceptron**। এটি মাত্র একটি নিউরন দিয়ে তৈরি।

### The Calculation
একটি নিউরন কিভাবে সিদ্ধান্ত নেয়?
`Output = (Input × Weight) + Bias`

১. **Input (x):** বাইরের তথ্য।
২. **Weight (w):** তথ্যটি কতটা জরুরি (গুরুত্ব)।
৩. **Bias (b):** নিউরনের নিজস্ব থ্রেশহোল্ড বা পক্ষপাত।

*উদাহরণ:* আপনি কি মুভি দেখতে যাবেন?
- ইনপুট ১: বন্ধু যাবে কি? (Weight: খুব বেশি)
- ইনপুট ২: মুভিটি কি অ্যাকশন? (Weight: কম)
- বায়াস: আপনার মুড।

সব মিলিয়ে যদি স্কোর একটি লেভেলের বেশি হয়, তবে নিউরন "ফায়ার" করবে (Output = 1), না হলে করবে না (Output = 0)।

### End of Lesson Summary
- Perceptron হলো নিউরাল নেটওয়ার্কের বিল্ডিং ব্লক।
- এটি মূলত একটি লিনিয়ার ইকুয়েশন `y = mx + c` এর মতোই।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M15-L72
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Perceptron কি?', 'Perceptron কি?', '["সবচেয়ে সরল নিউরাল নেটওয়ার্ক (Single Neuron)", "একটি রোবট", "একটি সফটওয়্যার", "একটি গেম"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Perceptron এর গাণিতিক সূত্র কোনটি?', 'Perceptron এর গাণিতিক সূত্র কোনটি?', '["Input + Output", "(Input * Weight) + Bias", "Input / Weight", "Bias - Input"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Weight (w) এর কাজ কি?', 'Weight (w) এর কাজ কি?', '["ইনপুটের গুরুত্ব নির্ধারণ করা", "নয়েজ তৈরি করা", "আউটপুট জিরো করা", "কিছুই না"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Bias (b) কেন যোগ করা হয়?', 'Bias (b) কেন যোগ করা হয়?', '["ক্যালকুলেশন কঠিন করতে", "মডেলকে শিফট বা ফ্লেক্সিবিলিটি দিতে", "ওয়েট কমাতে", "এরর বাড়াতে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Perceptron মূলত কোন ধরণের কাজ করতে পারে?', 'Perceptron মূলত কোন ধরণের কাজ করতে পারে?', '["Linear Classification (সরল রেখা দিয়ে ভাগ করা)", "Complex Image Recognition", "Translation", "Driving"]'::jsonb, 0, 0);


  -- M15-L73: Activation Functions
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '73. Activation Functions: The Decision Makers', 'activation-functions', 3, 
  $markdown$
# Lesson 73: Activation Functions

নিউরনের ক্যালকুলেশন শেষ হওয়ার পর একটি প্রশ্ন আসে: "আমি কি সিগন্যাল পাঠাবো (Fire) নাকি পাঠাবো না?"
এই সিদ্ধান্ত নেয় **Activation Function**।

### 1. Sigmoid Function
- এটি আউটপুটকে ০ এবং ১ এর মধ্যে স্কোয়াশ (Squash) করে দেয়।
- মূলত প্রোবাবিলিটি বা Yes/No সিদ্ধান্তের জন্য ব্যবহৃত হয়।

### 2. ReLU (Rectified Linear Unit)
- সূত্র: `max(0, x)`
- যদি ইনপুট পজিটিভ হয়, যা আছে তাই পাস করে। যদি নেগেটিভ হয়, তবে ০ করে দেয়।
- বর্তমানে ডিপ লার্নিংয়ে এটিই সবচেয়ে বেশি ব্যবহৃত হয় কারণ এটি খুব ফাস্ট।

### 3. Tanh (Hyperbolic Tangent)
- এটি আউটপুটকে -১ থেকে ১ এর মধ্যে রাখে।

### Why Non-linearity?
অ্যাক্টিভেশন ফাংশন ছাড়া নিউরাল নেটওয়ার্ক শুধুই একটি লিনিয়ার রিগ্রেশন। নন-লিনিয়ার (বাঁকা) প্যাটার্ন শেখার জন্যই এগুলো দরকার।

### End of Lesson Summary
- **Sigmoid:** 0 to 1.
- **ReLU:** 0 to Infinity (Negative is 0).
- অ্যাক্টিভেশন ফাংশন নেটওয়ার্ককে জটিল প্যাটার্ন শেখায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M15-L73
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Activation Function এর কাজ কি?', 'Activation Function এর কাজ কি?', '["ইনপুট ডিলিট করা", "ডিসিশন নেওয়া (Fire or Not) এবং নন-লিনিয়ারিটি যোগ করা", "কালার করা", "মেমোরি সেভ করা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ReLU এর পূর্ণরূপ কি?', 'ReLU এর পূর্ণরূপ কি?', '["Real Linear Unit", "Rectified Linear Unit", "Random Element List Unit", "None"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ReLU ফাংশন নেগেটিভ ইনপুট পেলে কি আউটপুট দেয়?', 'ReLU ফাংশন নেগেটিভ ইনপুট পেলে কি আউটপুট দেয়?', '["1", "-1", "0", "Same input"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Sigmoid ফাংশনের রেঞ্জ কত?', 'Sigmoid ফাংশনের রেঞ্জ কত?', '["0 থেকে 1", "-1 থেকে 1", "0 থেকে 100", "অসীম"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ডিপ লার্নিংয়ে বর্তমানে সবচেয়ে জনপ্রিয় ফাংশন কোনটি?', 'ডিপ লার্নিংয়ে বর্তমানে সবচেয়ে জনপ্রিয় ফাংশন কোনটি?', '["Sigmoid", "Step", "ReLU", "Cos"]'::jsonb, 2, 2);


  -- M15-L74: Forward & Backpropagation
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '74. Forward & Backpropagation: How it Learns', 'forward-backpropagation', 4, 
  $markdown$
# Lesson 74: Forward & Backpropagation

নিউরাল নেটওয়ার্ক কিভাবে শেখে? এটি একটি চক্রাকার প্রক্রিয়া।

### 1. Forward Propagation (পরীক্ষা দেওয়া)
ডেটা ইনপুট লেয়ার থেকে হিডেন লেয়ার হয়ে আউটপুটে যায়। নেটওয়ার্ক একটি প্রেডিকশন দেয় (মনে করুন এটি একটি গেস)।
*Error = Prediction - Actual*

### 2. Backpropagation (ভুল থেকে শেখা)
নেটওয়ার্ক দেখে তার ভুল কতটা হয়েছে (Loss)। এরপর সে পেছনের দিকে (Backwards) গিয়ে প্রতিটি নিউরনের **Weight** একটু একটু করে এডজাস্ট করে, যাতে পরের বার ভুল কম হয়।
এই এডজাস্টমেন্টের জন্য **Gradient Descent** মেথড ব্যবহার করা হয়।

### Epoch
একবার পুরো ডেটা দেখা = ১টি Epoch। এভাবে হাজার বার (Epochs) চলার পর মডেল পারফেক্ট হয়।

### End of Lesson Summary
- **Forward:** উত্তর দেওয়া।
- **Backprop:** ভুল শুধরানো (Updating Weights)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M15-L74
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Forward Propagation এ ডেটা কোন দিকে ফ্লো করে?', 'Forward Propagation এ ডেটা কোন দিকে ফ্লো করে?', '["Input -> Output", "Output -> Input", "Randomly", "Circular"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Backpropagation এর উদ্দেশ্য কি?', 'Backpropagation এর উদ্দেশ্য কি?', '["রেজাল্ট দেখানো", "Weight আপডেট করে এরর (Error) কমানো", "ডেটা বাড়ানো", "সময় নষ্ট করা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'মডেল শেখার সময় মূলত কি পরিবর্তন করে?', 'মডেল শেখার সময় মূলত কি পরিবর্তন করে?', '["Input Data", "Weights and Biases", "Neurons count", "Output"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Epoch মানে কি?', 'Epoch মানে কি?', '["১০ মিনিট", "একটি ভুল", "পুরো ডেটাসেট একবার মডেলের মধ্য দিয়ে পাস করা", "একটি লেয়ার"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Gradient Descent কিসের জন্য ব্যবহৃত হয়?', 'Gradient Descent কিসের জন্য ব্যবহৃত হয়?', '["লুডু খেলতে", "মিনিমাম এরর পয়েন্ট খুঁজে পেতে (Optimization)", "ছবি আঁকতে", "গান শুনতে"]'::jsonb, 1, 1);


  -- M15-L75: Deep Learning in R
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '75. Deep Learning in R: Keras & TensorFlow', 'deep-learning-r', 5, 
  $markdown$
# Lesson 75: Deep Learning in R

R এ ডিপ লার্নিং করার জন্য আমরা Python এর বিখ্যাত লাইব্রেরি **Keras** এবং **TensorFlow** ব্যবহার করি। R এর `keras` প্যাকেজটি মূলত Python এর সাথে ব্রিজ তৈরি করে।

### Installation
(এটি একটু ট্রিকি হতে পারে কারণ আপনার সিস্টেমে Python ইনস্টল থাকা লাগে)।
```r
# install.packages("keras")
# library(keras)
# install_keras() # এটি টেনসরফ্লো সেটআপ করে
```

### A Simple Neural Network in R
```r
model <- keras_model_sequential() %>%
  layer_dense(units = 16, activation = "relu", input_shape = c(4)) %>%
  layer_dense(units = 3, activation = "softmax") # Output

model %>% compile(
  loss = "categorical_crossentropy",
  optimizer = "adam",
  metrics = c("accuracy")
)
```

### End of Lesson Summary
- R দিয়েও ডিপ লার্নিং সম্ভব `keras` এর মাধ্যমে।
- এটি মূলত ব্যাকগ্রাউন্ডে Python/TensorFlow চালায়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M15-L75
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ ডিপ লার্নিং এর জন্য কোন প্যাকেজ জনপ্রিয়?', 'R এ ডিপ লার্নিং এর জন্য কোন প্যাকেজ জনপ্রিয়?', '["dplyr", "keras", "shiny", "forecast"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এর keras প্যাকেজটি ব্যাকগ্রাউন্ডে কোন ফ্রেমওয়ার্ক ব্যবহার করে?', 'R এর keras প্যাকেজটি ব্যাকগ্রাউন্ডে কোন ফ্রেমওয়ার্ক ব্যবহার করে?', '["PyTorch", "TensorFlow", "Scikit", "Java"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Softmax অ্যাক্টিভেশন ফাংশন সাধারণত কোথায় ব্যবহৃত হয়?', 'Softmax অ্যাক্টিভেশন ফাংশন সাধারণত কোথায় ব্যবহৃত হয়?', '["Input Layer", "Hidden Layer", "Output Layer (Multi-class Classification এর জন্য)", "Somewhere"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Dense Layer মানে কি?', 'Dense Layer মানে কি?', '["পাতলা লেয়ার", "Connected Layer (প্রতিটি নিউরন আগের লেয়ারের সবার সাথে কানেক্টেড)", "Blank Layer", "Error Layer"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Adam কি?', 'Adam কি?', '["একটি অ্যাক্টিভেশন ফাংশন", "একটি অপটিমাইজার (Optimizer)", "একটি লস ফাংশন", "একটি নিউরন"]'::jsonb, 1, 1);



  -- ================================================================================================
  -- MODULE 16: SPATIAL DATA HANDLING WITH R
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 16: Spatial Data Handling', 'spatial-data-handling', 16, 'Mastering the sf package, Shapefiles, and Raster data in R.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M16-L76: Vector Data & The sf Package
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '76. Vector Data & The sf Package', 'vector-data-sf', 1, 
  $markdown$
# Lesson 76: Vector Data & The sf Package

R এ ম্যাপ নিয়ে কাজ করার জন্য **`sf` (Simple Features)** হলো বর্তমানের স্ট্যান্ডার্ড প্যাকেজ।

### What makes `sf` special?
আগে `sp` প্যাকেজ ব্যবহার করা হতো যা বেশ জটিল ছিল।
`sf` প্যাকেজ স্পেশাল ডেটাকে একটি সাধারণ **Data Frame** এর মতোই ট্রিট করে। শুধু শেষে একটি `geometry` কলাম থাকে।
এর মানে আপনি `dplyr` (select, filter, mutate) এর সব ফাংশন ম্যাপের ওপর চালাতে পারবেন!

### Vector Data Types in R
১. **POINT:** একটি নির্দিষ্ট লোকেশন (যেমন: ঢাকা)।
২. **LINESTRING:** একটি রাস্তা বা নদী।
৩. **POLYGON:** একটি এলাকা (যেমন: রমনা পার্ক)।

### Creating a simple map
```r
library(sf)
# একটি পয়েন্ট তৈরি করা
point <- st_point(c(90.4125, 23.8103)) # Lon, Lat of Dhaka
```

### End of Lesson Summary
- **Vector Data:** Points, Lines, Polygons.
- **sf:** ম্যাপ ডেটাকে এক্সেল শিটের মতো সহজে হ্যান্ডেল করার টুল।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M16-L76
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '`sf` এর পূর্ণরূপ কি?', '`sf` এর পূর্ণরূপ কি?', '["Special File", "Simple Features", "Spatial Frame", "Super Fast"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '`sf` প্যাকেজের সবচেয়ে বড় সুবিধা কি?', '`sf` প্যাকেজের সবচেয়ে বড় সুবিধা কি?', '["এটি শুধু ছবি আঁকে", "এটি স্পেশাল ডেটাকে সাধারণ Data Frame হিসেবে ট্রিট করে", "এটি পাইথনের মতো", "কোনো সুবিধা নেই"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Vector Data তে জ্যামিতিক তথ্য কোথায় থাকে?', 'Vector Data তে জ্যামিতিক তথ্য কোথায় থাকে?', '["Header এ", "Geometry কলামে", "Row names এ", "আলাদা ফাইলে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'POLYGON দ্বারা কি বোঝানো হয়?', 'POLYGON দ্বারা কি বোঝানো হয়?', '["একটি বিন্দু", "একটি রেখা", "একটি আবদ্ধ এলাকা (Area)", "একটি ছবি"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, '`sf` এর আগে কোন প্যাকেজটি জনপ্রিয় ছিল?', '`sf` এর আগে কোন প্যাকেজটি জনপ্রিয় ছিল?', '["ggplot2", "sp", "terra", "raster"]'::jsonb, 1, 1);


  -- M16-L77: Import/Export Spatial Data
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '77. Working with Shapefiles (Import/Export)', 'shapefiles-import-export', 2, 
  $markdown$
# Lesson 77: Working with Shapefiles

GIS দুনিয়ায় সবচেয়ে কমন ফাইল ফরম্যাট হলো **Shapefile (.shp)**।

### Reading a Shapefile
`st_read()` ফাংশন দিয়ে আমরা শেপফাইল পড়ি।
```r
library(sf)
# বাংলাদেশ ম্যাপ লোড করা
bd_map <- st_read("bangladesh.shp")
```
এটি কনসোল আপনাকে দেখাবে:
- Geometry type (Polygon/Point etc)
- CRS (Coordinate Reference System)
- Bounding box (ম্যাপের সীমানা)

### Writing/Exporting a Shapefile
আপনি যদি ম্যাপে কোনো পরিবর্তন করেন (যেমন: শুধু ঢাকা বিভাগ ফিল্টার করলেন), তবে সেটি সেভ করতে `st_write()` ব্যবহার করবেন।
```r
# শুধু ঢাকা ফিল্টার করা
dhaka_only <- filter(bd_map, Division == "Dhaka")

# সেভ করা
st_write(dhaka_only, "dhaka_map.shp")
```

### Other Formats
`sf` প্যাকেজ **GeoJSON**, **KML** (Google Earth), এবং **Geopackage (.gpkg)** ও পড়তে পারে।

### End of Lesson Summary
- **st_read():** ফাইল ওপেন করা।
- **st_write():** ফাইল সেভ করা।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M16-L77
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Shapefile পড়ার জন্য কোন ফাংশন ব্যবহৃত হয়?', 'Shapefile পড়ার জন্য কোন ফাংশন ব্যবহৃত হয়?', '["read.csv()", "st_read()", "read_sf()", "get_map()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Shapefile সেভ করার জন্য কোন ফাংশন ব্যবহৃত হয়?', 'Shapefile সেভ করার জন্য কোন ফাংশন ব্যবহৃত হয়?', '["save()", "write.csv()", "st_write()", "export_map()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'st_read() ফাংশনটি লোড করার পর কি তথ্য দেখায়?', 'st_read() ফাংশনটি লোড করার পর কি তথ্য দেখায়?', '["শুধুমাত্র নাম", "Geometry Type, CRS, Bounding Box", "ফাইল সাইজ", "কালার"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'নিচের কোনটি একটি স্পেশাল ডেটা ফরম্যাট?', 'নিচের কোনটি একটি স্পেশাল ডেটা ফরম্যাট?', '["MP3", "GeoJSON", "MP4", "DOCX"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'GeoJSON কি?', 'GeoJSON কি?', '["একটি প্রোগ্রামিং ল্যাঙ্গুয়েজ", "ওয়েবে ম্যাপ ডেটা আদান-প্রদানের একটি জনপ্রিয় ফরম্যাট", "একটি সফটওয়্যার", "জানিনা"]'::jsonb, 1, 1);


  -- M16-L78: Attribute Tables
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '78. Attribute Tables: Data behind Maps', 'attribute-tables', 3, 
  $markdown$
# Lesson 78: Attribute Tables

ম্যাপ শুধু ছবি নয়, এর পেছনে বিশাল ডেটাবেজ থাকে। একে বলা হয় **Attribute Table**।
যেহেতু `sf` অবজেক্ট একটি `data.frame`, তাই আমরা মনের সুখে এখানে ডেটা অপারেশন চালাতে পারি।

### Common Operations
১. **Select:** নির্দিষ্ট কলাম রাখা।
   `select(bd_map, District_Name, Population)`
   *(নোট: জ্যামিতি কলামটি অটোমেটিক্যালি থেকে যাবে, ডিলিট হবে না!)*

2.  **Filter:** ম্যাপের অংশ বিশেষ নেওয়া।
    `filter(bd_map, Population > 1000000)`

3.  **Mutate:** নতুন তথ্য যোগ করা।
    `mutate(bd_map, Density = Population / Area)`

### Joining Data
ধরুন আপনার কাছে ম্যাপ আছে (Map Data) কিন্তু সেখানে জনসংখ্যার তথ্য নেই।
জনসংখ্যা আছে একটি এক্সেল ফাইলে (CSV)।
আপনি `left_join()` ব্যবহার করে এই দুটোকে জোড়া দিতে পারেন, ঠিক যেমন সাধারণ ডেটায় করেন!

### End of Lesson Summary
- **Attribute Table:** ম্যাপের পেছনের এক্সেল শিট।
- `sf` + `dplyr` = Superpower for GIS analysts.

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M16-L78
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Attribute Table কি?', 'Attribute Table কি?', '["ম্যাপের রঙের তালিকা", "ম্যাপের প্রতিটি শেপের সাথে যুক্ত তথ্যের টেবিল", "একটি ফার্নিচার", "কিছুই না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'sf অবজেক্টে select() ব্যবহার করলে geometry কলামের কি হয়?', 'sf অবজেক্টে select() ব্যবহার করলে geometry কলামের কি হয়?', '["ডিলিট হয়ে যায়", "থেকে যায় (Sticky Geometry)", "এরর দেয়", "হাইড হয়ে যায়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাপের সাথে এক্সেল ডেটা (CSV) যোগ করতে কোন ফাংশন ব্যবহার করবেন?', 'ম্যাপের সাথে এক্সেল ডেটা (CSV) যোগ করতে কোন ফাংশন ব্যবহার করবেন?', '["merge_map()", "left_join()", "connect()", "attach()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Filter কমান্ড দিয়ে ম্যাপে কি করা সম্ভব?', 'Filter কমান্ড দিয়ে ম্যাপে কি করা সম্ভব?', '["ম্যাপের রং বদলানো", "নির্দিষ্ট এলাকা (যেমন শুধু চট্টগ্রাম) আলাদা করা", "ম্যাপ জুম করা", "সেভ করা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'sf প্যাকেজ কোন প্যাকেজের সাথে সবচেয়ে ভালো কাজ করে?', 'sf প্যাকেজ কোন প্যাকেজের সাথে সবচেয়ে ভালো কাজ করে?', '["ggplot2", "dplyr (Tidyverse)", "shiny", "caret"]'::jsonb, 1, 1);


  -- M16-L79: CRS & Projections
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '79. CRS & Projections: Review & Usage', 'crs-projections-usage', 4, 
  $markdown$
# Lesson 79: CRS & Projections in Practice

আমরা থিওরি জেনেছি (কমলার খোসা প্রবলেম)। এখন দেখবো R এ এটি কিভাবে হ্যান্ডেল করা হয়।

### Checking CRS
`st_crs(bd_map)`
এটি আপনাকে ম্যাপের বর্তমান কোঅর্ডিনেট সিস্টেম দেখাবে। সাধারণত এটি **WGS84 (EPSG: 4326)** হয়।

### Why Reproject?
WGS84 এ একক হলো **ডিগ্রি (Degree)**। ডিগ্রি দিয়ে দূরত্ব মাপা কঠিন (১ ডিগ্রি কত কিলোমিটার?)।
দূরত্ব বা এরিয়া মাপতে হলে আমাদের ম্যাপকে **মিটারে (Meter)** কনভার্ট করতে হয়। এর জন্য আমরা **UTM (Universal Transverse Mercator)** প্রজেকশন ব্যবহার করি।

### Transforming (Reprojecting)
`st_transform()` ফাংশন দিয়ে এক CRS থেকে অন্য CRS এ যাওয়া যায়।
```r
# WGS84 থেকে UTM এ নেওয়া (Meter)
bd_metric <- st_transform(bd_map, crs = 32646) # EPSG for Bangladesh Zone
```

### End of Lesson Summary
- **st_crs():** চেক করা।
- **st_transform():** পরিবর্তন করা।
- এনালাইসিসের জন্য Projected CRS (Meter) ভালো, ডিসপ্লের জন্য Geographic (Lat/Lon) ভালো।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M16-L79
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাপের বর্তমান CRS চেক করার ফাংশন কোনটি?', 'ম্যাপের বর্তমান CRS চেক করার ফাংশন কোনটি?', '["check_crs()", "st_crs()", "get_proj()", "crs()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'এক CRS থেকে অন্য CRS এ পরিবর্তন করার ফাংশন কোনটি?', 'এক CRS থেকে অন্য CRS এ পরিবর্তন করার ফাংশন কোনটি?', '["st_change()", "st_transform()", "st_convert()", "st_proj()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'দূরত্ব বা এরিয়া মাপার জন্য কোন একক সুবিধাজনক?', 'দূরত্ব বা এরিয়া মাপার জন্য কোন একক সুবিধাজনক?', '["Degree", "Pixel", "Meter (Projected CRS)", "Inch"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Google Maps এবং GPS এর কমন EPSG কোড কোনটি?', 'Google Maps এবং GPS এর কমন EPSG কোড কোনটি?', '["3857", "4326 (WGS84)", "1234", "9000"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Reprojection কেন দরকার হয়?', 'Reprojection কেন দরকার হয়?', '["ম্যাপ সুন্দর করার জন্য", "সঠিক পরিমাপ (Measurement) এবং বিভিন্ন লেয়ারের সামঞ্জস্য (Alignment) এর জন্য", "ফাইল ছোট করার জন্য", "কিছুই না"]'::jsonb, 1, 1);


  -- M16-L80: Raster Data Basics
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '80. Raster Data Handling with terra', 'raster-data-terra', 5, 
  $markdown$
# Lesson 80: Raster Data Handling

ভেক্টর ডেটার জন্য `sf`, আর রাস্টার ডেটার (Satellite Image, Elevation) জন্য বস হলো **`terra`** প্যাকেজ।

### Raster Data Structure
রাস্টার হলো মূলত একটি ম্যাট্রিক্স বা গ্রিড।
প্রতিটি সেলে (Pixel) একটি ভ্যালু থাকে।

### Basic Operations
```r
library(terra)

# রাস্টার ফাইল লোড করা
r <- rast("elevation.tif")

# প্লট করা
plot(r)

# তথ্য দেখা
print(r) # Resolution, Extent, CRS ইত্যাদি দেখাবে
```

### Cropping & Masking
অনেক সময় আমাদের পুরো দুনিয়ার রাস্টার দরকার নেই, শুধু বাংলাদেশের অংশটুকু দরকার।
১. **Crop:** চারকোনা ভাবে কেটে নেওয়া।
2. **Mask:** শেপফাইলের আকৃতি অনুযায়ী কেটে নেওয়া (যেমন: বাংলাদেশের বর্ডার অনুযায়ী)।

### End of Lesson Summary
- **Vector:** `sf`
- **Raster:** `terra`
- **Crop/Mask:** ম্যাপ কেটে ছোট করা।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M16-L80
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'রাস্টার ডেটা প্রসেসিং এর জন্য সেরা প্যাকেজ কোনটি?', 'রাস্টার ডেটা প্রসেসিং এর জন্য সেরা প্যাকেজ কোনটি?', '["sf", "terra", "ggplot2", "dplyr"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'রাস্টার ফাইল পড়ার ফাংশন কোনটি (terra প্যাকেজে)?', 'রাস্টার ফাইল পড়ার ফাংশন কোনটি (terra প্যাকেজে)?', '["read_raster()", "rast()", "load_image()", "get_grid()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'রাস্টার ডেটা মূলত কি?', 'রাস্টার ডেটা মূলত কি?', '["Points", "Lines", "Grid of Pixels (Matrix)", "Database"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'একটি রাস্টারকে শেপফাইলের বাউন্ডারি অনুযায়ী কেটে নেওয়ার পদ্ধতিকে কি বলে?', 'একটি রাস্টারকে শেপফাইলের বাউন্ডারি অনুযায়ী কেটে নেওয়ার পদ্ধতিকে কি বলে?', '["Crop", "Mask", "Cut", "Both Crop & Mask"]'::jsonb, 3, 3);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'রাস্টারের একেকটি ঘরকে কি বলে?', 'রাস্টারের একেকটি ঘরকে কি বলে?', '["Pixel বা Cell", "Point", "Dot", "Box"]'::jsonb, 0, 0);



  -- ================================================================================================
  -- MODULE 17: SPATIAL VISUALIZATION
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 17: Spatial Visualization', 'spatial-visualization', 17, 'Creating stunning static and interactive maps using ggplot2 and tmap.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M17-L81: Mapping with ggplot2
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '81. Mapping with ggplot2 (geom_sf)', 'mapping-with-ggplot2', 1, 
  $markdown$
# Lesson 81: Mapping with `ggplot2`

আমরা জানি `ggplot2` গ্রাফ আঁকার জন্য সেরা। মজার ব্যাপার হলো, এটি ম্যাপ আঁকার জন্যও দুর্দান্ত!
কারণ `sf` অবজেক্ট মূলত একটি ডেটাফ্রেম।

### The `geom_sf()` Function
ম্যাপ আঁকার জন্য `ggplot2` এ একটি বিশেষ জ্যামিতি আছে: **`geom_sf()`**।
এটি অটোমেটিক্যালি কোঅর্ডিনেট সিস্টেম হ্যান্ডেল করে।

### Basic Map Plotting
```r
library(ggplot2)
library(sf)

# bd_map হলো আমাদের ম্যাপ ডেটা
ggplot(data = bd_map) +
  geom_sf() +
  ggtitle("Map of Bangladesh") +
  theme_minimal()
```

### Coloring by Region
আপনি যদি প্রতিটি বিভাগকে আলাদা রং দিতে চান:
```r
ggplot(data = bd_map) +
  geom_sf(aes(fill = Division)) # fill এর মধ্যে কলামের নাম দিন
```

### End of Lesson Summary
- **geom_sf()**: ম্যাপ আঁকার জাদুকরী ফাংশন।
- সাধারণ `ggplot` লেয়ার (title, theme) সব এখানেও কাজ করে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M17-L81
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ggplot2 এ ম্যাপ আঁকার জন্য কোন geome ব্যবহার করা হয়?', 'ggplot2 এ ম্যাপ আঁকার জন্য কোন geome ব্যবহার করা হয়?', '["geom_map()", "geom_sf()", "geom_point()", "geom_polygon()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাপে রং (Color) করার জন্য aesthetic এ কোনটি ব্যবহার করবেন?', 'ম্যাপে রং (Color) করার জন্য aesthetic এ কোনটি ব্যবহার করবেন?', '["col = Region", "fill = Region", "color = Region", "paint = Region"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'geom_sf() এর সুবিধা কি?', 'geom_sf() এর সুবিধা কি?', '["এটি অটোমেটিক কোঅর্ডিনেট হ্যান্ডেল করে", "এটি থ্রিডি ম্যাপ আঁকে", "এটি ভিডিও বানালে", "কিছুই না"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'sf অবজেক্ট আসলে কি?', 'sf অবজেক্ট আসলে কি?', '["Data Frame with geometry", "List", "Matrix", "Array"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাপের টাইটেল দিতে কোন ফাংশন ব্যবহার করবেন?', 'ম্যাপের টাইটেল দিতে কোন ফাংশন ব্যবহার করবেন?', '["labs() বা ggtitle()", "set_title()", "map_title()", "header()"]'::jsonb, 0, 0);


  -- M17-L82: tmap Basics
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '82. Simply Powerful: Intro to tmap', 'intro-to-tmap', 2, 
  $markdown$
# Lesson 82: Thematic Maps with `tmap`

`ggplot2` ভালো, তবে ম্যাপের জন্য ডেডিকেটেড বস হলো **`tmap`**।
এর সিনট্যাক্স খুব সহজ এবং `ggplot2` এর মতো লেয়ার স্টাইল।

### The Structure of tmap
- **tm_shape(obj):** প্রথমে ডেটা লোড করতে হয়।
- **tm_borders():** সীমানা বা বর্ডার আঁকতে।
- **tm_fill():** ভেতরটা ভরাট বা কালার করতে।
- **tm_polygons():** বর্ডার এবং ফিল একসাথে।

### Creating Your First tmap
```r
library(tmap)

tm_shape(bd_map) +
  tm_polygons(col = "blue", alpha = 0.5)
```
এটি খুব ক্লিন এবং প্রফেশনাল লুক দেয়। ম্যাপের ফ্রেম বা গ্রিড অটোমেটিক্যালি সুন্দর করে সাজানো থাকে।

### End of Lesson Summary
- **tm_shape:** ডেটা কল করা।
- **tm_polygons:** ম্যাপ আঁকা।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M17-L82
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'tmap এর পূর্ণরূপ কি?', 'tmap এর পূর্ণরূপ কি?', '["Thematic Map", "Topological Map", "Technical Map", "Tiny Map"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'tmap এ ডেটা লোড করার প্রথম ফাংশন কোনটি?', 'tmap এ ডেটা লোড করার প্রথম ফাংশন কোনটি?', '["tm_data()", "tm_shape()", "tm_load()", "tm_map()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'শুধু বর্ডার (Border) আঁকতে কোনটি ব্যবহার করবেন?', 'শুধু বর্ডার (Border) আঁকতে কোনটি ব্যবহার করবেন?', '["tm_fill()", "tm_borders()", "tm_lines()", "tm_outline()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বর্ডার এবং কালার ফিল (Fill) একসাথে করতে কোনটি সহজ?', 'বর্ডার এবং কালার ফিল (Fill) একসাথে করতে কোনটি সহজ?', '["tm_polygons()", "tm_group()", "tm_combine()", "tm_mix()"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'tmap এর সিনট্যাক্স কোন প্যাকেজের মতো?', 'tmap এর সিনট্যাক্স কোন প্যাকেজের মতো?', '["base R", "ggplot2 (Layer based +)", "lattice", "grid"]'::jsonb, 1, 1);


  -- M17-L83: Choropleth Maps
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '83. Choropleth Maps: Coloring with Data', 'choropleth-maps', 3, 
  $markdown$
# Lesson 83: Choropleth Maps

**Choropleth Map** হলো এমন ম্যাপ যেখানে এলাকার রং সেই এলাকার ডেটার ওপর নির্ভর করে (যেমন: জনসংখ্যা যত বেশি, রং তত গাঢ়)।

### Visualizing Population
ধরুন আমাদের কলামের নাম `Population`।
```r
tm_shape(bd_map) +
  tm_polygons(col = "Population",
              style = "quantile",  # কিভাবে ভাগ হবে
              palette = "Reds",    # কালার প্যালেট
              title = "Population 2024")
```

### Classification Styles
- **quantile:** সমান সংখ্যক এলাকা প্রতিটি গ্রুপে থাকবে।
- **jenks:** ন্যাচারাল ব্রেক বা গ্যাপ খুঁজে বের করে।
- **pretty:** রাউন্ড ফিগার বা সুন্দর সংখ্যা দিয়ে ভাগ করে।

### End of Lesson Summary
- **col = "Variable":** ভ্যারিয়েবল অনুযায়ী রং।
- **palette:** রঙের শেড (Greens, Blues, Spectral)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M17-L83
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Choropleth Map এর মূল বৈশিষ্ট্য কি?', 'Choropleth Map এর মূল বৈশিষ্ট্য কি?', '["রাস্তাঘাট দেখানো", "ভ্যারিয়েবলের মানের ওপর ভিত্তি করে এলাকার রং পরিবর্তন করা", "থ্রিডি বিল্ডিং", "স্যাটেলাইট ইমেজ"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'জনসংখ্যা অনুযায়ী ম্যাপ রং করতে tm_polygons এ কোন আর্গুমেন্ট ব্যবহার করবেন?', 'জনসংখ্যা অনুযায়ী ম্যাপ রং করতে tm_polygons এ কোন আর্গুমেন্ট ব্যবহার করবেন?', '["size", "col", "shape", "alpha"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কালার প্যালেট পরিবর্তন করতে কোন আর্গুমেন্ট লাগে?', 'কালার প্যালেট পরিবর্তন করতে কোন আর্গুমেন্ট লাগে?', '["color_list", "palette", "paint", "scheme"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ন্যাচারাল গ্যাপ বা ব্রেক খুঁজে বের করার স্টাইল কোনটি?', 'ন্যাচারাল গ্যাপ বা ব্রেক খুঁজে বের করার স্টাইল কোনটি?', '["quantile", "pretty", "jenks", "fixed"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Choropleth ম্যাপে সাধারণত কি দেখানো হয়?', 'Choropleth ম্যাপে সাধারণত কি দেখানো হয়?', '["Denstity, Population, Rates इत्यादी", "Trees", "Cars", "Photos"]'::jsonb, 0, 0);


  -- M17-L84: Interactive Maps
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '84. Interactive Maps: The "View" Mode', 'interactive-maps', 4, 
  $markdown$
# Lesson 84: Interactive Maps

R এর সবচেয়ে বড় ম্যাজিকগুলোর একটি হলো **Interactive Mapping**।
আপনি কোড লিখবেন, আর R আপনাকে জুম-ইন, জুম-আউট করা যায় এমন গুগল ম্যাপের মতো ম্যাপ বানিয়ে দেবে!

### The Magic Switch
`tmap` এর দুটি মোড আছে:
1.  **plot:** সাধারণ স্থির ছবি (প্রিন্ট করার জন্য)।
2.  **view:** ইন্টারঅ্যাক্টিভ ম্যাপ (ওয়েবসাইটের জন্য)।

```r
tmap_mode("view") # ম্যাজিক অন!

tm_shape(bd_map) +
  tm_polygons(col = "Population")
```
এখন আপনি মাউস দিয়ে ম্যাপ নাড়াতে পারবেন, ক্লিক করলে পপ-আপে তথ্য দেখাবে, ব্যাকগ্রাউন্ডে বেজ ম্যাপ (OpenStreetMap) চেঞ্জ করতে পারবেন!

### Switching Back
আবার সাধারণ মোডে ফিরতে:
`tmap_mode("plot")`

### End of Lesson Summary
- `tmap_mode("view")` দিলেই আপনার স্ট্যাটিক ম্যাপ জীবন্ত হয়ে যাবে!

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M17-L84
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'tmap এ ইন্টারঅ্যাক্টিভ মোড চালু করার কমান্ড কোনটি?', 'tmap এ ইন্টারঅ্যাক্টিভ মোড চালু করার কমান্ড কোনটি?', '["tmap_interactive()", "tmap_mode(''view'')", "tmap_on()", "map_view()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ইন্টারঅ্যাক্টিভ ম্যাপে কি করা যায়?', 'ইন্টারঅ্যাক্টিভ ম্যাপে কি করা যায়?', '["জুম ইন/আউট, প্যান, পপ-আপ দেখা", "ভিডিও এডিট করা", "গেম খেলা", "গান শোনা"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ব্যাকগ্রাউন্ডে OpenStreetMap বা Satellite Map দেখার জন্য কোন মোড দরকার?', 'ব্যাকগ্রাউন্ডে OpenStreetMap বা Satellite Map দেখার জন্য কোন মোড দরকার?', '["plot", "view", "static", "print"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'View মোড থেকে আবার সাধারণ মোডে ফিরতে কি কমান্ড দিবেন?', 'View মোড থেকে আবার সাধারণ মোডে ফিরতে কি কমান্ড দিবেন?', '["tmap_mode(''plot'')", "tmap_off()", "tmap_stop()", "tmap_exit()"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'View মোড আসলে ব্যাকগ্রাউন্ডে কোন জাভাস্ক্রিপ্ট লাইব্রেরি ব্যবহার করে?', 'View মোড আসলে ব্যাকগ্রাউন্ডে কোন জাভাস্ক্রিপ্ট লাইব্রেরি ব্যবহার করে?', '["React", "Leaflet", "D3", "ThreeJS"]'::jsonb, 1, 1);


  -- M17-L85: Adding Layers & Polish
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '85. Adding Layers: Compass, Scale Bar & Layouts', 'adding-layers-polish', 5, 
  $markdown$
# Lesson 85: Adding Layers & Polish

একটি প্রফেশনাল ম্যাপে শুধু বাউন্ডারি থাকলেই হয় না, দিক নির্দেশক (Compass) এবং স্কেল (Scale Bar) থাকতে হয়।

### Compositing Layers
আমরা একের অধিক লেয়ার যোগ করতে পারি। যেমন: প্রথমে বাংলাদেশের ম্যাপ, তার ওপর কিছু নির্দিষ্ট পয়েন্ট (যেমন: অফিস বা এয়ারপোর্ট)।

```r
# বেজ ম্যাপ + পয়েন্ট
tm_shape(bd_map) +
  tm_polygons() +
tm_shape(airports_sf) + # নতুন লেয়ার
  tm_dots(col = "red", size = 0.5)
```

### Scale Bar & Compass
```r
tm_shape(bd_map) +
  tm_polygons(col = "Population") +
  tm_compass(position = c("right", "top")) + # উত্তর দিক নির্দেশক
  tm_scale_bar(position = c("left", "bottom")) + # স্কেল
  tm_layout(title = "Professional Map of BD")
```

### End of Lesson Summary
- **Layers:** `+` চিহ্ন দিয়ে একাধিক `tm_shape` যোগ করা যায়।
- **Elements:** Compass, Scale Bar, Legend ম্যাপকে পূর্ণতা দেয়।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M17-L85
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাপে একাধিক লেয়ার (যেমন পলিগনের ওপর পয়েন্ট) যোগ করতে কি করতে হয়?', 'ম্যাপে একাধিক লেয়ার (যেমন পলিগনের ওপর পয়েন্ট) যোগ করতে কি করতে হয়?', '["নতুন ম্যাপ বানাতে হয়", "প্লাস (+) চিহ্ন দিয়ে নতুন tm_shape যোগ করতে হয়", "একসাথে মার্জ করতে হয়", "সম্ভব না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাপে উত্তর দিক দেখানোর জন্য কোন ফাংশন?', 'ম্যাপে উত্তর দিক দেখানোর জন্য কোন ফাংশন?', '["tm_north()", "tm_compass()", "tm_direction()", "tm_arrow()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাপের দূরত্ব বোঝানোর জন্য (যেমন: ০----৫০ কিমি) কি ব্যবহার করা হয়?', 'ম্যাপের দূরত্ব বোঝানোর জন্য (যেমন: ০----৫০ কিমি) কি ব্যবহার করা হয়?', '["tm_ruler()", "tm_scale_bar()", "tm_distance()", "tm_meter()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাপের টাইটেল বা লেআউট সাজাতে কোন ফাংশন?', 'ম্যাপের টাইটেল বা লেআউট সাজাতে কোন ফাংশন?', '["tm_design()", "tm_layout()", "tm_theme()", "tm_style()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বিন্দু বা পয়েন্ট দেখানোর জন্য কোনটি ব্যবহার করবেন?', 'বিন্দু বা পয়েন্ট দেখানোর জন্য কোনটি ব্যবহার করবেন?', '["tm_dots() বা tm_symbols()", "tm_polygons()", "tm_lines()", "tm_raster()"]'::jsonb, 0, 0);



  -- ================================================================================================
  -- MODULE 18: SPATIAL ANALYSIS
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 18: Spatial Analysis', 'spatial-analysis', 18, 'Advanced GIS operations: Buffers, Joins, and Raster Math.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M18-L86: Buffer Analysis
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '86. Buffer Analysis: The Safety Zone', 'buffer-analysis', 1, 
  $markdown$
# Lesson 86: Buffer Analysis

GIS এর সবচেয়ে কমন প্রশ্ন: "এই রাস্তার ৫০০ মিটারের মধ্যে কতগুলো স্কুল আছে?"
এর উত্তরের জন্য আমাদের **Buffer** তৈরি করতে হয়।

### What is a Buffer?
বাফার হলো কোনো পয়েন্ট, লাইন বা পলিগনের চারপাশে একটি নির্দিষ্ট দূরত্বের গোল বা আবদ্ধ এলাকা।

### Creating a Buffer
`st_buffer()` ফাংশন দিয়ে এটি করা হয়।
*(গুরুত্বপূর্ণ: বাফার করার জন্য ম্যাপ অবশ্যই মিটারে (Projected CRS) থাকতে হবে, ডিগ্রিতে নয়!)*

```r
library(sf)

# স্কুলের ১ কিলোমিটার (১০০০ মিটার) বাফার তৈরি
school_buffer <- st_buffer(schools_sf, dist = 1000)

# প্লট করে দেখা
plot(school_buffer)
plot(schools_sf, add = TRUE, col = "red")
```

### Use Cases
- নদীর ২০০ মিটারের মধ্যে বসতি নিষিদ্ধ করা।
- হাসপাতালের ১ কিমির মধ্যে ফার্মেসী খোঁজা।

### End of Lesson Summary
- **st_buffer():** চারপাশে সুরক্ষা বলয় তৈরি করা।
- একক অবশ্যই মিটারে হতে হবে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M18-L86
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বাফার (Buffer) কি?', 'বাফার (Buffer) কি?', '["একটি বৃত্ত", "একটি বস্তুর চারপাশে নির্দিষ্ট দূরত্বের এরিয়া", "একটি লাইন", "একটি গেম"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বাফার তৈরির ফাংশন কোনটি?', 'বাফার তৈরির ফাংশন কোনটি?', '["st_circle()", "st_buffer()", "st_area()", "st_zone()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বাফার করার আগে ম্যাপের CRS কিসে থাকা জরুরি?', 'বাফার করার আগে ম্যাপের CRS কিসে থাকা জরুরি?', '["Degree (Lat/Lon)", "Meter (Projected)", "Inch", "Pixel"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'নদীর ২০০ মিটারের মধ্যে স্থাপনা নিষিদ্ধ - এটি বের করতে কি করবেন?', 'নদীর ২০০ মিটারের মধ্যে স্থাপনা নিষিদ্ধ - এটি বের করতে কি করবেন?', '["বাফার করবেন", "ফিল্টার করবেন", "জুম করবেন", "কিছুই না"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বাফার কি শুধু পয়েন্টের হয়?', 'বাফার কি শুধু পয়েন্টের হয়?', '["হ্যাঁ", "না, পয়েন্ট, লাইন এবং পলিগন সবার হতে পারে", "শুধু লাইনের হয়", "জানিনা"]'::jsonb, 1, 1);


  -- M18-L87: Spatial Joins
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '87. Spatial Joins: Point in Polygon', 'spatial-joins', 2, 
  $markdown$
# Lesson 87: Spatial Joins

সাধারণ Join হয় কমন কলাম দিয়ে (যেমন: ID)।
**Spatial Join** হয় **লোকেশন** দিয়ে।

### Scenario
আপনার কাছে **Trees (Points)** আছে এবং **Parks (Polygons)** আছে।
আপনি জানতে চান: "প্রতিটি পার্কে কয়টি করে গাছ আছে?"
কিন্তু Trees ডেটাবেসে Park এর নাম লেখা নেই! শুধু লোকেশন আছে।

### The Solution: `st_join()`
`st_join` প্রতিটি গাছের লোকেশন চেক করে দেখবে সেটি কোন পার্কের পলিগনের ভেতরে পড়েছে এবং সেই পার্কের নাম গাছের ডেটায় জুড়ে দেবে।

```r
# গাছ এবং পার্ক জোড়া দেওয়া
trees_with_park_name <- st_join(trees_sf, parks_sf)

# এখন আমরা গুনতে পারি
trees_with_park_name %>%
  group_by(Park_Name) %>%
  count()
```

### End of Lesson Summary
- **st_join():** লোকেশনের ভিত্তিতে দুটি ডেটা জোড়া দেওয়া (Point in Polygon)।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M18-L87
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Spatial Join কিসের ভিত্তিতে হয়?', 'Spatial Join কিসের ভিত্তিতে হয়?', '["ID", "Name", "Location / Geometry", "Date"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Point in Polygon অপারেশন করতে কোন ফাংশন লাগে?', 'Point in Polygon অপারেশন করতে কোন ফাংশন লাগে?', '["merge()", "st_join()", "st_union()", "bind_rows()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'st_join() ব্যবহারের প্রধান শর্ত কি?', 'st_join() ব্যবহারের প্রধান শর্ত কি?', '["উভয় ডেটার CRS একই হতে হবে", "কালার একই হতে হবে", "নাম একই হতে হবে", "কোনো শর্ত নেই"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Spatial Join করে আমরা কি পাই?', 'Spatial Join করে আমরা কি পাই?', '["নতুন ম্যাপ", "এক ডেটার অ্যাট্রিবিউট অন্য ডেটায় (লোকেশন অনুযায়ী)", "শুধু সংখ্যা", "এরর"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'আপনার কাছে ঢাকার থানা (Polygon) এবং এটিএম বুথ (Point) আছে। কোন থানায় কয়টি বুথ আছে বের করবেন কিভাবে?', 'আপনার কাছে ঢাকার থানা (Polygon) এবং এটিএম বুথ (Point) আছে। কোন থানায় কয়টি বুথ আছে বের করবেন কিভাবে?', '["st_join এবং পরে count", "manually গুনে", "google করে", "st_buffer করে"]'::jsonb, 0, 0);


  -- M18-L88: Distance Analysis
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '88. Distance Analysis', 'distance-analysis', 3, 
  $markdown$
# Lesson 88: Distance Analysis

GIS এর আরেকটি মৌলিক কাজ হলো দূরত্ব মাপা।

### Measuring Distance
`st_distance()` আমাদের দুটি বস্তুর মধ্যে সরলকৌণিক দূরত্ব (Crow-fly distance) বলে দেয়।

```r
# দুটি পয়েন্টের দূরত্ব
dist <- st_distance(point_A, point_B)
```

### Distance Matrix
যদি আপনি এক সেট পয়েন্টের সাথে অন্য সেট পয়েন্টের দূরত্ব মাপেন, তবে এটি একটি ম্যাট্রিক্স রিটার্ন করে।
যেমন: ৫টি এটিএম বুথ এবং ১০টি বাড়ি। ১০x৫ এর একটি টেবিল পাবেন যেখানে সবার সাথে সবার দূরত্ব লেখা থাকবে।

### Nearest Neighbor
সবচেয়ে কাছে কে আছে?
`st_nearest_feature()` ফাংশন দিয়ে এটি বের করা যায়।

### End of Lesson Summary
- **st_distance:** দূরত্ব মাপার জন্য।
- অবশ্যই Projected CRS (Meter) ব্যবহার করবেন সঠিক ফলাফলের জন্য।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M18-L88
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'দূরত্ব মাপার ফাংশন কোনটি?', 'দূরত্ব মাপার ফাংশন কোনটি?', '["st_length()", "st_distance()", "st_far()", "st_gap()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'st_distance() কি রিটার্ন করে?', 'st_distance() কি রিটার্ন করে?', '["শুধু একক", "দূরত্বের মান (Matrix or Vector)", "একটি ম্যাপ", "সময়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'সবচেয়ে কাছের অবজেক্ট খুঁজে বের করতে কোনটি ব্যবহৃত হয়?', 'সবচেয়ে কাছের অবজেক্ট খুঁজে বের করতে কোনটি ব্যবহৃত হয়?', '["st_nearest_feature()", "st_close()", "st_buffer()", "st_filter()"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Geographic CRS (Degree) এ দূরত্ব মাপলে সমস্যা কি?', 'Geographic CRS (Degree) এ দূরত্ব মাপলে সমস্যা কি?', '["কোনো সমস্যা নেই", "ফলাফল ডিগ্রিতে আসবে যা বোঝা কঠিন এবং সঠিক নয়", "মেশিন হ্যাং করবে", "কালার নষ্ট হবে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Crow-fly distance মানে কি?', 'Crow-fly distance মানে কি?', '["আকাশ পথের বা সরলকৌণিক দূরত্ব", "রাস্তার দূরত্ব", "নদীর দূরত্ব", "পাখির দূরত্ব"]'::jsonb, 0, 0);


  -- M18-L89: Raster Calculations
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '89. Raster Calculations (Map Algebra)', 'raster-calculations', 4, 
  $markdown$
# Lesson 89: Raster Calculations

রাস্টার ডেটা হলো ম্যাট্রিক্সের মতো সংখ্যা। তাই আমরা এদের যোগ, বিয়োগ, গুণ, ভাগ করতে পারি। একে বলা হয় **Map Algebra**।

### Example: NDVI Calculation
NDVI (Normalized Difference Vegetation Index) দিয়ে গাছের স্বাস্থ্য মাপা হয়।
সূত্র: `(NIR - Red) / (NIR + Red)`

স্যাটেলাইট ইমেজে NIR এবং Red আলাদা ব্যান্ড (Layer) হিসেবে থাকে।

```r
library(terra)
img <- rast("satellite_image.tif")

# ব্যান্ড আলাদা করা
nir <- img[[4]] # ধরে নিচ্ছি ব্যান্ড ৪ হলো NIR
red <- img[[3]] # ধরে নিচ্ছি ব্যান্ড ৩ হলো Red

# সূত্র বসানো (সরাসরি ভ্যারিয়েবল দিয়ে!)
ndvi <- (nir - red) / (nir + red)

plot(ndvi)
```
R এ এটি সাধারণ গণিতের মতোই সহজ!

### Reclassification
আমরা রাস্টারের মান পরিবর্তন করতে পারি। যেমন: NDVI < 0.2 হলে "No Veg", নাহলে "Veg"।
`classify()` ফাংশন দিয়ে এটি করা হয়।

### End of Lesson Summary
- **Map Algebra:** রাস্টারের ওপর গাণিতিক অপারেশন।
- **NDVI:** উদ্ভিদের স্বাস্থ্য পরিমাপক।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M18-L89
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Map Algebra কি?', 'Map Algebra কি?', '["ম্যাপের ওপর গাণিতিক অপারেশন (যোগ, বিয়োগ ইত্যাদি)", "ম্যাপ আঁকা", "ম্যাপ সেভ করা", "ম্যাপ ডিলিট করা"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'NDVI কিসের জন্য ব্যবহৃত হয়?', 'NDVI কিসের জন্য ব্যবহৃত হয়?', '["পানির গভীরতা মাপতে", "উদ্ভিদ বা ফসলের স্বাস্থ্য মাপতে", "নদীর গতি মাপতে", "রাস্তা মাপতে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'terra প্যাকেজে রাস্টার ম্যাথ কিভাবে করা হয়?', 'terra প্যাকেজে রাস্টার ম্যাথ কিভাবে করা হয়?', '["খুব জটিল ফাংশন দিয়ে", "সাধারণ যোগ-বিয়োগ চিহ্নে (Direct Math)", "করা যায় না", "পাইথন দিয়ে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'রাস্টারের মান ক্যাটাগরিতে (যেমন High/Low) ভাগ করাকে কি বলে?', 'রাস্টারের মান ক্যাটাগরিতে (যেমন High/Low) ভাগ করাকে কি বলে?', '["Projecting", "Reclassifying", "Buffering", "Clipping"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'স্যাটেলাইট ইমেজের "Band" বলতে কি বুঝায়?', 'স্যাটেলাইট ইমেজের "Band" বলতে কি বুঝায়?', '["গানের ব্যান্ড", "আলোর বিভিন্ন তরঙ্গের লেয়ার (যেমন Red, Blue, Infrared)", "রিবন", "কিছুই না"]'::jsonb, 1, 1);


  -- M18-L90: Terrain Analysis
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '90. Terrain Analysis: Slope & Aspect', 'terrain-analysis', 5, 
  $markdown$
# Lesson 90: Terrain Analysis

আমাদের কাছে যদি ভূমির উচ্চতার ডেটা (**DEM** - Digital Elevation Model) থাকে, তবে আমরা অনেক কিছু বের করতে পারি।

`terra` প্যাকেজে `terrain()` ফাংশনটি খুব শক্তিশালী।

### 1. Slope (ঢাল)
জায়গাটি কতটা খাড়া?
```r
dem <- rast("elevation.tif")
slope_map <- terrain(dem, v = "slope", unit = "degrees")
plot(slope_map)
```

### 2. Aspect (দিক)
ঢালটি কোন দিকে মুখ করে আছে? (উত্তর, দক্ষিণ, পূর্ব, পশ্চিম?)
এটি সূর্যের আলো বা কৃষি কাজের জন্য গুরুত্বপূর্ণ।
```r
aspect_map <- terrain(dem, v = "aspect")
```

### 3. Hillshade (ছায়া)
ম্যাপকে থ্রিডি লুক দেওয়ার জন্য হিলশেড ব্যবহার করা হয়। এটি সূর্যের আলোর বিপরীতে ছায়া তৈরি করে।

### End of Lesson Summary
- **DEM:** উচ্চতার রাস্টার ডেটা।
- **terrain():** স্লোপ, অ্যাসপেক্ট বের করার ফাংশন।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M18-L90
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'DEM এর পূর্ণরূপ কি?', 'DEM এর পূর্ণরূপ কি?', '["Digital Elevation Model", "Direct Energy Method", "Daily Earth Map", "Digital Era Map"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Slope (ঢাল) কি নির্দেশ করে?', 'Slope (ঢাল) কি নির্দেশ করে?', '["উচ্চতা", "জায়গাটি কতটা খাড়া (Steepness)", "দিক", "আয়তন"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Aspect কি নির্দেশ করে?', 'Aspect কি নির্দেশ করে?', '["ঢালটি কোন দিকে মুখ করে আছে (Compass Direction)", "বাতাসের গতি", "বৃষ্টিপাত", "লবণাক্ততা"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাপে থ্রিডি ইফেক্ট দেওয়ার জন্য কোনটি ব্যবহৃত হয়?', 'ম্যাপে থ্রিডি ইফেক্ট দেওয়ার জন্য কোনটি ব্যবহৃত হয়?', '["Hillshade", "Contour", "Buffer", "Clip"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'terra প্যাকেজে এই কাজগুলো কোন ফাংশন দিয়ে করা হয়?', 'terra প্যাকেজে এই কাজগুলো কোন ফাংশন দিয়ে করা হয়?', '["analyze()", "terrain()", "surface()", "geo()"]'::jsonb, 1, 1);



  -- ================================================================================================
  -- MODULE 19: GIS + ML INTEGRATION
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 19: GIS + ML Integration', 'gis-ml-integration', 19, 'Merging Machine Learning with Spatial Data for predictive mapping and classification.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M19-L91: Intro to Spatial ML
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '91. Why Spatial ML? (Beyond i.i.d)', 'intro-spatial-ml', 1, 
  $markdown$
# Lesson 91: Why Spatial ML?

মেশিন লার্নিং এর একটি প্রধান শর্ত হলো **Introduction to Spatial ML (i.i.d)** - প্রতিটি ডেটা পয়েন্ট স্বাধীন।
কিন্তু ম্যাপ বা জিআইএস ডেটা স্বাধীন নয়।

### Spatial Autocorrelation
"কাছাকাছি জিনিসগুলো একে অপরের সাথে মিল থাকে, দূরের জিনিসের চেয়ে।" - এটিই ভূগোলের প্রথম সূত্র (Tobler's Law)।

![Global Land Cover](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Global_Land_Cover_2000.png/1280px-Global_Land_Cover_2000.png)
*(Image: Global Land Cover - notice how forests cluster together, they are not random)*

### The Challenge
আপনি যদি সাধারণ Linear Regression ম্যাপ ডেটা (যেমন: বাড়ির দাম) এর ওপর চালান, তবে মডেল ভুল করবে কারণ সে জানে না যে গুলশানের দাম বেশি হলে বনানীর দামও বেশি হতে পারে (Location Correlation)।

### The Solution
আমাদের মডেলে **Space** বা **Location** কে ফিচার হিসেবে ঢোকাতে হবে।
- X, Y Coordinate ব্যবহার করা।
- Distance to City Center ব্যবহার করা।
- Neighbor Information ব্যবহার করা।

### End of Lesson Summary
- **Spatial Autocorrelation:** কাছের জিনিসগুলোর মিল থাকার প্রবণতা।
- সাধারণ ML মডেল স্পেশাল ডেটায় বায়াসড হতে পারে।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M19-L91
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Tobler এর ভূগোলের প্রথম সূত্রটি কি?', 'Tobler এর ভূগোলের প্রথম সূত্রটি কি?', '["সবকিছুই স্বাধীন", "কাছাকাছি জিনিসের মিল থাকে বেশি", "দূরের জিনিসের মিল থাকে বেশি", "কোনোটিই নয়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'সাধারণ ML মডেলে ম্যাপ ডেটা ব্যবহার করলে কি সমস্যা হয়?', 'সাধারণ ML মডেলে ম্যাপ ডেটা ব্যবহার করলে কি সমস্যা হয়?', '["মডেল স্লো হয়ে যায়", "Spatial Autocorrelation এর কারণে মডেল বায়াসড হতে পারে", "র‍্যাম শেষ হয়ে যায়", "কালার নষ্ট হয়"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Spatial ML এ আমরা কোন অতিরিক্ত তথ্য ব্যবহার করি?', 'Spatial ML এ আমরা কোন অতিরিক্ত তথ্য ব্যবহার করি?', '["Audio", "Location / Distance / Neighbors", "Video", "Nothing"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'i.i.d এর পূর্ণরূপ কি (সহজ ভাষায়)?', 'i.i.d এর পূর্ণরূপ কি (সহজ ভাষায়)?', '["Independent and Identically Distributed", "International ID", "Internet Image Data", "Internal Issue"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'উপরের ছবিতে (Land Cover) বন বা জঙ্গলগুলো কিভাবে আছে?', 'উপরের ছবিতে (Land Cover) বন বা জঙ্গলগুলো কিভাবে আছে?', '["এলোমেলোভাবে ছড়ানো", "ক্লাস্টার (Cluster) বা গুচ্ছ আকারে", "লাইন আকারে", "বিন্দু আকারে"]'::jsonb, 1, 1);


  -- M19-L92: Hotspot Analysis
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '92. Hotspot Analysis: Finding the Heat', 'hotspot-analysis', 2, 
  $markdown$
# Lesson 92: Hotspot Analysis

কোথায় অপরাধ বেশি? কোথায় ডেঙ্গু বেশি? কোথায় ধনী মানুষ বেশি?
এটি বের করার জন্য আমরা **Hotspot Analysis** করি।

![Bangladesh Population Density](https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Population_density_of_Bangladesh_%282011%29.svg/800px-Population_density_of_Bangladesh_%282011%29.svg.png)
*(Image: Population Density Heatmap of Bangladesh - Darker areas are Hotspots)*

### Heatmap vs Hotspot
- **Heatmap:** শুধু ঘনত্ব দেখায় (Visual)।
- **Hotspot (Getis-Ord Gi*):** পরিসংখ্যান দিয়ে প্রমাণ করে যে এই ক্লাস্টারটি কাকতালীয় (Random) নয়, বরং স্ট্যাটিসটিকালি সিগনিফিকেন্ট।

### Steps in R
১. নেইবর (Neighbors) লিস্ট তৈরি করা।
২. ওয়েট ম্যাট্রিক্স (Weights Matrix) বানানো।
৩. `localG()` বা Moran's I টেস্ট চালানো।

### End of Lesson Summary
- **Hotspot:** স্ট্যাটিসটিকালি প্রমাণিত হাই ভ্যালুর ক্লাস্টার।
- **Coldspot:** লো ভ্যালুর ক্লাস্টার।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M19-L92
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Heatmap এবং Hotspot এর মূল পার্থক্য কি?', 'Heatmap এবং Hotspot এর মূল পার্থক্য কি?', '["কোনো পার্থক্য নেই", "Heatmap শুধু ভিজ্যুয়াল, Hotspot পরিসংখ্যান দ্বারা প্রমাণিত (Statistical)", "Hotspot শুধু গরমে কাজ করে", "Heatmap এ রং থাকে না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Hotspot বের করার জনপ্রিয় টেস্ট কোনটি?', 'Hotspot বের করার জনপ্রিয় টেস্ট কোনটি?', '["T-test", "Getis-Ord Gi*", "ANOVA", "Linear Regression"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Coldspot কি?', 'Coldspot কি?', '["ঠান্ডা জায়গা", "পরিসংখ্যানগতভাবে লো ভ্যালুর (Low Value) ক্লাস্টার", "যেখানে ডেটা নেই", "নদী"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'উপরের ম্যাপে বাংলাদেশের হটস্পট (সবচেয়ে বেশি মানুষ) কোথায়?', 'উপরের ম্যাপে বাংলাদেশের হটস্পট (সবচেয়ে বেশি মানুষ) কোথায়?', '["সুন্দরবনে", "ঢাকা ও চট্টগ্রামে", "সিলেটে", "রংপুরে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ক্লাস্টার র্যান্ডম নাকি সিগনিফিকেন্ট তা বোঝা কেন জরুরি?', 'ক্লাস্টার র্যান্ডম নাকি সিগনিফিকেন্ট তা বোঝা কেন জরুরি?', '["কারণ র্যান্ডম ক্লাস্টার আপনাআপনি হতে পারে, কিন্তু সিগনিফিকেন্ট ক্লাস্টারের কোনো কারণ আছে", "ম্যাপ সুন্দর করার জন্য", "মেমোরি বাঁচানোর জন্য", "জানিনা"]'::jsonb, 0, 0);


  -- M19-L93: Land Use Classification
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '93. Land Use Classification (Random Forest)', 'land-use-classification', 3, 
  $markdown$
# Lesson 93: Land Use Classification

স্যাটেলাইট ইমেজে শুধু রং থাকে (Red, Green, Blue, NIR)। কম্পিউটার কিভাবে বুঝবে কোনটা গাছ আর কোনটা পানি?
এখানে আমরা **Supervised Machine Learning (Random Forest)** ব্যবহার করি।

### The Workflow
1.  **Training Data:** আমরা ম্যাপে মাউস দিয়ে দেখিয়ে দিই - "এটা বন", "এটা পানি", "এটা শহর"। (একে বলা হয় Training Samples)।
2.  **Feature Extraction:** প্রতিটি স্যাম্পল পয়েন্টের জন্য আমরা বিভিন্ন ব্যান্ডের মান (B1, B2, NDVI) বের করি।
3.  **Model Training:** `randomForest` মডেল শিখিয়ে দিই।
4.  **Prediction:** মডেল এখন পুরো ইমেজের কোটি কোটি পিক্সেলকে ক্লাসিফাই করে নতুন ম্যাপ বানায়।

### Why Random Forest?
স্যাটেলাইট ডেটায় অনেক নয়েজ থাকে। র‍্যান্ডম ফরেস্ট এই নয়েজ হ্যান্ডেল করতে ওস্তাদ এবং এটি খুব অ্যাকুরেট।

### End of Lesson Summary
- **Classification:** পিক্সেলকে লেবেল (যেমন: Forest, Water) দেওয়া।
- **Random Forest:** জিআইএস এর জন্য খুবই জনপ্রিয় অ্যালগরিদম।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M19-L93
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'স্যাটেলাইট ইমেজ ক্লাসিফিকেশনের কাজ কি?', 'স্যাটেলাইট ইমেজ ক্লাসিফিকেশনের কাজ কি?', '["ছবি জুম করা", "প্রতিটি পিক্সেলকে একটি ক্যাটাগরি (যেমন: বন, পানি) দেওয়া", "ছবি সেভ করা", "রং বদলানো"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Training Samples কেন দরকার?', 'Training Samples কেন দরকার?', '["মডেলকে শেখানোর জন্য যে কোনটি কি", "ম্যাপ সুন্দর করার জন্য", "এরর কমানোর জন্য", "জানিনা"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'GIS এ ক্লাসিফিকেশনের জন্য কোন অ্যালগরিদম খুব জনপ্রিয়?', 'GIS এ ক্লাসিফিকেশনের জন্য কোন অ্যালগরিদম খুব জনপ্রিয়?', '["Linear Regression", "Random Forest", "K-Means", "PCA"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Feature Extraction ধাপে আমরা কি করি?', 'Feature Extraction ধাপে আমরা কি করি?', '["রং করি", "পিক্সেলের ভ্যালু (Bands, Indices) বের করি", "ছবি কাটি", "কিছুই না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Supervised Learning মানে কি?', 'Supervised Learning মানে কি?', '["কম্পিউটার একা শেখে", "আমরা কম্পিউটারকে উদাহরণ (Training Data) দিয়ে শিখিয়ে দিই", "ইন্টারনেট থেকে শেখে", "বই পড়ে শেখে"]'::jsonb, 1, 1);


  -- M19-L94: Predictive & Risk Mapping
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '94. Predictive & Risk Mapping', 'predictive-risk-mapping', 4, 
  $markdown$
# Lesson 94: Predictive Mapping

ভবিষ্যতে কোথায় ভূমিধস হতে পারে? বা কোথায় নতুন মার্কেট বানালে লাভ হবে?
এটি হলো **Predictive Mapping**।

![Seismic Hazard Map](https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Global_Seismic_Hazard_Map.jpg/1280px-Global_Seismic_Hazard_Map.jpg)
*(Image: Global Seismic Hazard Map - A classic example of Risk Mapping)*

### How it works?
এটি মূলত একটি **Regression** বা **Probability** সমস্যা।
- **Dependent Variable (Y):** অতীতে যেখানে ভূমিধস হয়েছে (1) অথবা হয়নি (0)।
- **Independent Variables (X):**
  - Slope (ঢাল)
  - Rainfall (বৃষ্টিপাত)
  - Soil Type (মাটি)
  - Distance to River (নদী থেকে দূরত্ব)

### Steps
1.  অতীতের ডেটা দিয়ে মডেল ট্রেইন করা (যেমন: Logistic Regression বা MaxEnt)।
2.  মডেল ব্যবহার করে পুরো ম্যাপের প্রতিটি পিক্সেলের জন্য **Probability** বের করা।
3.  রঙিন ম্যাপ তৈরি করা (High Risk = Red, Low Risk = Green)।

### End of Lesson Summary
- **Risk Map:** ভবিষ্যতে কোনো ঘটনা ঘটার সম্ভাবনার ম্যাপ।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M19-L94
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Predictive Mapping এর উদ্দেশ্য কি?', 'Predictive Mapping এর উদ্দেশ্য কি?', '["অতীত ইতিহাস জানা", "ভবিষ্যতে কোনো ঘটনা ঘটার সম্ভাবনা (Probability) ম্যাপ করা", "বর্তমান অবস্থা দেখা", "ছবি আঁকা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ভূমিধস (Landslide) প্রেডিকশনের জন্য কোন ভ্যারিয়েবলটি গুরুত্বপূর্ণ হতে পারে?', 'ভূমিধস (Landslide) প্রেডিকশনের জন্য কোন ভ্যারিয়েবলটি গুরুত্বপূর্ণ হতে পারে?', '["Slope (ঢাল)", "WiFi Speed", "Traffic Jam", "Shoe Size"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Risk Map এ সাধারণত লাল রং কি বোঝায়?', 'Risk Map এ সাধারণত লাল রং কি বোঝায়?', '["Low Risk", "High Risk / Danger", "Water", "Forest"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'এটি কোন ধরণের সমস্যা?', 'এটি কোন ধরণের সমস্যা?', '["Classification (Yes/No) or Regression (Probability)", "Clustering", "Cleaning", "Sorting"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'উপরের ম্যাপটি কিসের ঝুঁকির ম্যাপ?', 'উপরের ম্যাপটি কিসের ঝুঁকির ম্যাপ?', '["বন্যা", " ভূমিকম্প (Seismic Hazard)", "আগুন", "ঝড়"]'::jsonb, 1, 1);


  -- M19-L95: Case Study: Real Project
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '95. Case Study: Flood Risk in Sylhet', 'gis-ml-case-study', 5, 
  $markdown$
# Lesson 95: Case Study - Flood Risk in Sylhet

আমরা যা শিখলাম তা দিয়ে একটি রিয়েল প্রজেক্ট ডিজাইন করি।

### The Problem
সিলেটে প্রতি বছর বন্যা হয়। আমরা জানতে চাই আগামী বছর কোন গ্রামগুলো সবচেয়ে বেশি ঝুঁকিতে থাকবে।

### Data Collection
1.  **Elevation (DEM):** `terra` দিয়ে লোড করবো। নিচু এলাকা বেশি ঝুঁকিপূর্ণ।
2.  **Rainfall:** গত ১০ বছরের বৃষ্টির ডেটা।
3.  **River Distance:** নদী থেকে দূরত্ব (`st_distance`)।
4.  **Land Cover:** বিল বা হাওর এলাকা (`Random Forest` দিয়ে ক্লাসিফাইড)।

### Analysis Plan
1.  সবগুলো লেয়ারকে একই গ্রিডে (Raster) নিয়ে আসা (Resampling)।
2.  অতীতের বন্যার ডেটা দিয়ে মডেল ট্রেইন করা।
3.  **Weighted Overlay** বা **Machine Learning** দিয়ে রিস্ক স্কোর বের করা।
4.  ফাইনাল আউটপুট: একটি **Flood Susceptibility Map**।

### Conclusion
GIS এবং ML একসাথে ব্যবহার করলে আমরা শুধু "কি হচ্ছে" তা না, বরং "কি হতে পারে" তা বলতে পারি। This is the magic!

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M19-L95
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'বন্যা (Flood) রিস্ক ম্যাপিং এ কোন ডেটাটি সবচেয়ে গুরুত্বপূর্ণ?', 'বন্যা (Flood) রিস্ক ম্যাপিং এ কোন ডেটাটি সবচেয়ে গুরুত্বপূর্ণ?', '["Elevation (উচ্চতা/নিচু জমি)", "রাস্তার নাম", "বিল্ডিং এর রং", "গাছের সংখ্যা"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Weighted Overlay কি?', 'Weighted Overlay কি?', '["একটি ম্যাপের ওপর আরেকটি ম্যাপ রাখা", "বিভিন্ন ফ্যাক্টরকে গুরুত্ব (Weight) দিয়ে যোগ করে ফাইনাল স্কোর বের করা", "ওজন মাপা", "কিছুই না"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'রিয়েল লাইফ প্রজেক্টে প্রথম ধাপ কি?', 'রিয়েল লাইফ প্রজেক্টে প্রথম ধাপ কি?', '["কোড লেখা", "ডেটা কালেকশন এবং প্রবলেম ডিফাইন করা", "ম্যাপ প্রিন্ট করা", "ল্যাপটপ কেনা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'সিলেটের বন্যার কারণ বিশ্লেষণে কোনটি দরকার নেই?', 'সিলেটের বন্যার কারণ বিশ্লেষণে কোনটি দরকার নেই?', '["নদীর গভীরতা", "বৃষ্টিপাত", "মিউজিক কনসার্টের ডেটা", "হাওরের অবস্থান"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'এই কোর্সে আপনারা কি শিখলেন?', 'এই কোর্সে আপনারা কি শিখলেন?', '["How to integrate GIS and Machine Learning in R", "How to cook", "How to fly", "How to swim"]'::jsonb, 0, 0);



  -- ================================================================================================
  -- MODULE 20: TIME SERIES ANALYSIS
  -- ================================================================================================
  
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 20: Time Series Analysis', 'time-series-analysis', 20, 'Mastering temporal data, ARIMA modeling, and forecasting future trends.')
  RETURNING id INTO m2_id; -- Reusing variable name

  -- M20-L96: Time Series Basics
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '96. Time Series Basics: Dealing with Time', 'time-series-basics', 1, 
  $markdown$
# Lesson 96: Time Series Basics

সাধারণ ডেটা আর **Time Series** ডেটার মধ্যে পার্থক্য হলো "সময়"।
এখানে প্রতিটি ডেটা পয়েন্ট আগের পয়েন্টের ওপর নির্ভর করে (Autocorrelation)।

### The `ts` Object
R এ টাইম সিরিজ ডেটা হ্যান্ডেল করার জন্য `ts()` ফাংশন ব্যবহার করা হয়।

```r
# একটি ভেক্টরকে টাইম সিরিজে রূপান্তর
revenue <- c(100, 120, 130, 150, 160, 200)
revenue_ts <- ts(revenue, start = c(2020, 1), frequency = 12) # মাসিক ডেটা
plot(revenue_ts)
```

### Key Components
1.  **Frequency:** ডেটা কত ঘন ঘন? (১২ = মাসিক, ৪ = ত্রৈমাসিক, ৩৬৫ = দৈনিক)।
2.  **Start/End:** শুরু এবং শেষ সময়।

### Modern Packages
`ts` একটু পুরনো। আধুনিক কাজের জন্য আমরা **`xts`** বা **`tsibble`** ব্যবহার করি যা `tidyverse` এর সাথে ভালো কাজ করে।

### End of Lesson Summary
- **Time Series:** সময়ের সাথে পরিবর্তনশীল ডেটা।
- **ts():** বেসিক টাইম সিরিজ অবজেক্ট।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M20-L96
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Time Series ডেটার প্রধান বৈশিষ্ট্য কি?', 'Time Series ডেটার প্রধান বৈশিষ্ট্য কি?', '["রং", "সময় (Time Dependency)", "শব্দ", "মিউজিক"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'মাসিক (Monthly) ডেটার frequency কত হয়?', 'মাসিক (Monthly) ডেটার frequency কত হয়?', '["12", "4", "365", "1"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এর বেসিক টাইম সিরিজ ফাংশন কোনটি?', 'R এর বেসিক টাইম সিরিজ ফাংশন কোনটি?', '["time()", "ts()", "date()", "clock()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ত্রৈমাসিক (Quarterly) ডেটার frequency কত?', 'ত্রৈমাসিক (Quarterly) ডেটার frequency কত?', '["12", "4", "52", "7"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Autocorrelation মানে কি?', 'Autocorrelation মানে কি?', '["গাড়ির সম্পর্ক", "বর্তমান ডেটার সাথে অতীতের ডেটার সম্পর্ক", "অটোমেটিক সম্পর্ক", "জানিনা"]'::jsonb, 1, 1);


  -- M20-L97: Decomposition
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '97. Decomposition: Looking Under the Hood', 'decomposition', 2, 
  $markdown$
# Lesson 97: Decomposition

একটি টাইম সিরিজ ৩টি জিনিসের সমষ্টি:
1.  **Trend:** দীর্ঘমেয়াদী দিক (বাড়ছে না কমছে?)।
2.  **Seasonality:** ঋতুগত পরিবর্তন (যেমন: শীতে আইসক্রিম বিক্রি কমে)।
3.  **Noise/Remainder:** যা ব্যাখ্যা করা যায় না (Random)।

![Time Series Decomposition](https://upload.wikimedia.org/wikipedia/commons/e/e1/Mae.timeseries_decomposition.commonswiki.svg)
*(Image: A classic decomposition plot showing Observed, Trend, Seasonal, and Random parts)*

### Utilizing `stl()`
R এ `stl()` (Seasonal and Trend decomposition using Loess) ফাংশন খুব পাওয়ারফুল।

```r
fit <- stl(revenue_ts, s.window = "periodic")
plot(fit)
```
এই প্লটটি আপনাকে আলাদা করে ট্রেন্ড এবং সিজনালিটি দেখাবে।

### Additive vs Multiplicative
- **Additive:** Trend + Seasonality + Noise (যখন সিজনাল গ্যাপ ফিক্সড থাকে)।
- **Multiplicative:** Trend x Seasonality x Noise (যখন সময় বাড়ার সাথে সাথে গ্যাপ বাড়ে)।

### End of Lesson Summary
- **Decomposition:** পুরো জিনিসকে ভেঙে পার্টস দেখা।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M20-L97
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Time Series এর প্রধান ৩টি উপাদান কি কি?', 'Time Series এর প্রধান ৩টি উপাদান কি কি?', '["Trend, Seasonality, Noise", "Red, Green, Blue", "Mean, Median, Mode", "Input, Output, Process"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Seasonality বা ঋতুগত পরিবর্তন কিসের উদাহরণ?', 'Seasonality বা ঋতুগত পরিবর্তন কিসের উদাহরণ?', '["ঈদে কেনাকাটা বৃদ্ধি", "হঠাৎ ভূমিকম্প", "শেয়ার বাজারের পতন", "স্থায়ী বৃদ্ধি"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R এ ডিকম্পোজিশন করার ফাংশন কোনটি?', 'R এ ডিকম্পোজিশন করার ফাংশন কোনটি?', '["break()", "decompose() or stl()", "split()", "separate()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Additive মডেলে উপাদানগুলো কিভাবে থাকে?', 'Additive মডেলে উপাদানগুলো কিভাবে থাকে?', '["গুণ আকারে", "যোগ আকারে (Sum)", "ভাগ আকারে", "বর্গ আকারে"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Noise বা Remainder কি?', 'Noise বা Remainder কি?', '["শব্দ দূষণ", "অপ্রয়োজনীয় ডেটা", "র‍্যান্ডম ভ্যারিয়েশন যা ব্যাখ্যা করা যায় না", "ভুল ডেটা"]'::jsonb, 2, 2);


  -- M20-L98: ARIMA Modeling
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '98. ARIMA Modeling: The Gold Standard', 'arima-modeling', 3, 
  $markdown$
# Lesson 98: ARIMA Modeling

**ARIMA** (AutoRegressive Integrated Moving Average) হলো ফোরকাস্টিং এর গোল্ড স্ট্যান্ডার্ড।

### Components (p, d, q)
- **AR (p):** অতীত কি বর্তমানকে প্রভাবিত করছে? (Lag)।
- **I (d):** ডেটা কি স্টেশনারি? (Differencing needed?)।
- **MA (q):** এরর বা নয়েজ কি প্যাটার্ন ফলো করছে?

### The Holy Grail: `auto.arima()`
ম্যানুয়ালি p, d, q বের করা কঠিন। `forecast` প্যাকেজের `auto.arima()` ফাংশন নিজে নিজে সেরা প্যারামিটার খুঁজে বের করে!

```r
library(forecast)
fit <- auto.arima(revenue_ts)
summary(fit)
```
এটি আপনাকে সেরা মডেলটি রিটার্ন করবে (যেমন: ARIMA(1,1,1))।

### End of Lesson Summary
- **Stationarity:** ডেটার গড় এবং ভেরিয়েন্স সময়ের সাথে স্থির থাকা। ARIMA এর জন্য এটি জরুরি।
- **auto.arima:** আমাদের জীবন বাঁচানোর টুল।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M20-L98
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ARIMA এর পূর্ণরূপ কি?', 'ARIMA এর পূর্ণরূপ কি?', '["Automatic Ratio Integrated Math", "AutoRegressive Integrated Moving Average", "All R Image Analysis", "Active Return Low Risk"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'স্টেশনারি ডেটা (Stationary Data) মানে কি?', 'স্টেশনারি ডেটা (Stationary Data) মানে কি?', '["যে ডেটা নড়ে না", "যার গড় (Mean) এবং ভেরিয়েন্স সময়ের সাথে স্থির থাকে", "যে ডেটা স্টেশনে থাকে", "ভুল ডেটা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'সেরা ARIMA মডেল অটোমেটিক বের করার ফাংশন কোনটি?', 'সেরা ARIMA মডেল অটোমেটিক বের করার ফাংশন কোনটি?', '["best.arima()", "get.arima()", "auto.arima()", "find.arima()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'I (Integrated) বা d এর কাজ কি?', 'I (Integrated) বা d এর কাজ কি?', '["Difference করে ডেটাকে স্টেশনারি বানানো", "যোগ করা", "গুণ করা", "ফোরকাস্ট করা"]'::jsonb, 0, 0);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ARIMA মডেলে কয়টি প্রধান প্যারামিটার থাকে?', 'ARIMA মডেলে কয়টি প্রধান প্যারামিটার থাকে?', '["১টি", "২টি", "৩টি (p, d, q)", "১০টি"]'::jsonb, 2, 2);


  -- M20-L99: Forecasting
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '99. Forecasting: Seeing the Future', 'forecasting', 4, 
  $markdown$
# Lesson 99: Forecasting

মডেল বানানোর মূল উদ্দেশ্য হলো ভবিষ্যৎ বলা।

![ARIMA Forecast](https://upload.wikimedia.org/wikipedia/commons/e/ef/Previsione_arima_temperatura_media_italiana.png)
*(Image: An ARIMA forecast showing the predicted line and confidence intervals)*

### The `forecast()` Function
```r
# আগামী ২ বছরের (২৪ মাস) প্রেডিকশন
future <- forecast(fit, h = 24)

# প্লট করা
plot(future)
```

### Understanding the Plot
- **নীল লাইন:** আমাদের প্রেডিকশন।
- **ধূসর এরিয়া:** কনফিডেন্স ইন্টারভাল (৮০% এবং ৯৫%)। মানে, ভ্যালু এই রেঞ্জের মধ্যে থাকার সম্ভাবনা বেশি।

### Accuracy Check
`accuracy(fit)` ফাংশন দিয়ে আমরা RMSE বা MAPE দেখে বুঝতে পারি মডেল কতটা ভালো কাজ করছে।

### End of Lesson Summary
- **h:** Horizon (কত দিনের ফোরকাস্ট চাই)।
- **Confidence Interval:** আমরা কতটা নিশ্চিত।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M20-L99
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'আগামী ১২ মাসের ফোরকাস্ট করতে h এর মান কত হবে?', 'আগামী ১২ মাসের ফোরকাস্ট করতে h এর মান কত হবে?', '["1", "12", "365", "100"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ফোরকাস্ট প্লটে ধূসর এরিয়া (Grey Area) কি নির্দেশ করে?', 'ফোরকাস্ট প্লটে ধূসর এরিয়া (Grey Area) কি নির্দেশ করে?', '["ভুল ডেটা", "Confidence Interval (সম্ভাব্য রেঞ্জ)", "অতীত", "বৃষ্টি"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'মডেলের পারফরম্যান্স বা একুরেসি চেক করতে কোন ফাংশন ব্যবহার করা হয়?', 'মডেলের পারফরম্যান্স বা একুরেসি চেক করতে কোন ফাংশন ব্যবহার করা হয়?', '["performance()", "check()", "accuracy()", "validate()"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ভবিষ্যৎ অনিশ্চিত, তাই ফোরকাস্ট সবসময় একটি ____ দেয়।', 'ভবিষ্যৎ অনিশ্চিত, তাই ফোরকাস্ট সবসময় একটি ____ দেয়।', '["গ্যারান্টি", "রেঞ্জ বা সম্ভাবনা", "ভুল তথ্য", "টিকিট"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'forecast ফাংশনটি কোন প্যাকেজের অংশ?', 'forecast ফাংশনটি কোন প্যাকেজের অংশ?', '["ggplot2", "forecast", "dplyr", "shiny"]'::jsonb, 1, 1);


  -- M20-L100: Visualization
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m2_id, '100. Visualization with Dygraphs', 'visualization-dygraphs', 5, 
  $markdown$
# Lesson 100: Interactive Time Series Plots

স্ট্যাটিক প্লট বোরিং। টাইম সিরিজের জন্য **dygraphs** বা **highcharter** সেরা।
এগুলো ইন্টারেক্টিভ। মাউস ধরলেই ভ্যালু দেখায় এবং জুম করা যায়।

![Seasonality Plot](https://upload.wikimedia.org/wikipedia/commons/9/93/SeasonalplotUS.png)
*(Image: While this is static, imagine zooming into specific years like in a stock chart!)*

### Using `dygraphs`
```r
library(dygraphs)

dygraph(revenue_ts, main = "Revenue Trend") %>%
  dyRangeSelector() # জুম করার স্লাইডার
```
এটি একটি স্লাইডার যোগ করবে যা দিয়ে আপনি নির্দিষ্ট সময়কাল জুম করে দেখতে পারবেন। এটি ড্যাশবোর্ডের জন্য পারফেক্ট।

### Course Wrap-up
আমরা R এর একদম বেসিক থেকে শুরু করে মেশিন লার্নিং, জিআইএস এবং সবশেষে ফোরকাস্টিং পর্যন্ত এসেছি।
You now have the tools to analyze ANYTHING!

### End of Lesson Summary
- **dygraphs:** ইন্টারেক্টিভ টাইম সিরিজ প্লটের জন্য সেরা টুল।

$markdown$, NULL) RETURNING id INTO l_id;

  -- QUIZ M20-L100
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Time Series ডেটাকে ইন্টারেক্টিভ (Zoomable) ভাবে দেখানোর জন্য কোন প্যাকেজ ভালো?', 'Time Series ডেটাকে ইন্টারেক্টিভ (Zoomable) ভাবে দেখানোর জন্য কোন প্যাকেজ ভালো?', '["ggplot2", "dygraphs", "base plot", "maps"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'dyRangeSelector() কি কাজ করে?', 'dyRangeSelector() কি কাজ করে?', '["রং বদলায়", "ম্যাপ দেখায়", "ডেট বা সময় জুম করার জন্য স্লাইডার যোগ করে", "ডেটা ডিলিট করে"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Interactive প্লটের সুবিধা কি?', 'Interactive প্লটের সুবিধা কি?', '["দেখতে খারাপ", "নির্দিষ্ট পয়েন্টে মাউস নিলে ভ্যালু দেখা যায় এবং জুম করা যায়", "প্রিন্ট করা সহজ", "কোনো সুবিধা নেই"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'এই কোর্সে আমরা মোট কয়টি মডিউল শেষ করলাম?', 'এই কোর্সে আমরা মোট কয়টি মডিউল শেষ করলাম?', '["১০টি", "১৫টি", "২০টি", "৫০টি"]'::jsonb, 2, 2);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Time Series এনালাইসিস কোথায় কাজে লাগে?', 'Time Series এনালাইসিস কোথায় কাজে লাগে?', '["শেয়ার বাজার", "আবহাওয়া", "সেলস ফোরকাস্টিং", "সবগুলোতেই"]'::jsonb, 3, 3);

  -- ================================================================================================
  -- MODULE 21: INTERACTIVE WEB DASHBOARDS WITH R SHINY
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 21: Interactive Web Dashboards with R Shiny', 'r-shiny-dashboards', 21, 'Build reactive web apps, custom user interfaces, and deploy live data apps with Shiny.')
  RETURNING id INTO m4_id;

  -- M21-L101: Intro to Shiny
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id, '101. Introduction to R Shiny & Reactive Architecture', 'shiny-intro', 101, 
  $markdown$
# Module 21: Interactive Web Dashboards with R Shiny
> [!TIP]
> **R Shiny** হলো R-এর সবচেয়ে শক্তিশালী ফ্রেমওয়ার্ক যা দিয়ে যেকোনো সাধারণ ডেটা সেটকে একটি লাইভ, ইন্টারঅ্যাক্টিভ ওয়েব ড্যাশবোর্ডে রূপান্তর করা যায়।

## 1. What is R Shiny?
এক্সেলে বা সাধারণ R স্ক্রিপ্টে কোনো গ্রাফ বানালে তা স্থির (Static) থাকে। কিন্তু **Shiny** ব্যবহার করে আপনি এমন একটি ওয়েবসাইট বা অ্যাপ বানাতে পারবেন যেখানে ইউজার ড্রপডাউন মেনু বা স্লাইডার থেকে ক্যাটাগরি পরিবর্তন করলে গ্রাফটি সাথে সাথে **Live Update** হয়ে যাবে!

```r
library(shiny)

ui <- fluidPage(
  titlePanel("BAU Agricultural Data Dashboard"),
  sidebarLayout(
    sidebarPanel(
      selectInput("crop", "Select Crop Variety:", choices = c("BRRI Dhan 28", "BRRI Dhan 29", "BINA Dhan 7"))
    ),
    mainPanel(
      plotOutput("yieldPlot")
    )
  )
)

server <- function(input, output) {
  output$yieldPlot <- renderPlot({
    plot(1:10, main = paste("Yield Trend for:", input$crop), col = "emerald")
  })
}

shinyApp(ui = ui, server = server)
```
  $markdown$, 'https://www.youtube.com/watch?v=9kYUGMg_14s') RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R Shiny অ্যাপের দুটি প্রধান অংশ কি কি?', 'R Shiny অ্যাপের দুটি প্রধান অংশ কি কি?', '["input ও output", "ui ও server", "HTML ও CSS", "RStudio ও Chrome"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Shiny অ্যাপ চালু করার জন্য কোন ফাংশন ব্যবহার করা হয়?', 'Shiny অ্যাপ চালু করার জন্য কোন ফাংশন ব্যবহার করা হয়?', '["runApp()", "shinyApp()", "startShiny()", "launch()"]'::jsonb, 1, 1);

  -- ================================================================================================
  -- MODULE 22: AGRICULTURAL EXPERIMENTAL DESIGN & ANOVA
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 22: Experimental Design & ANOVA for Agricultural Research', 'agri-experimental-design-anova', 22, 'Master CRD, RCBD experimental design, 2-Way ANOVA in R, p-values, and Tukey HSD post-hoc testing.')
  RETURNING id INTO m7_id;

  -- M22-L102: ANOVA & RCBD
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m7_id, '102. RCBD Design, ANOVA & Tukey HSD Post-Hoc Test in R', 'anova-testing', 102, 
  $markdown$
# Module 22: Experimental Design & ANOVA for Agricultural Trials
> [!IMPORTANT]
> কৃষি গবেষণায় (Field Experiment) বিভিন্ন সার (Fertilizer Treatments) এবং জাতের (Crop Varieties) মধ্যে ফলনের পার্থক্যের তাৎপর্য (Statistical Significance) প্রমাণের জন্য **ANOVA (Analysis of Variance)** ও **Tukey HSD Test** হলো আন্তর্জাতিক স্ট্যান্ডার্ড।

```r
# Fit RCBD ANOVA Model in R
rcbd_model <- aov(yield_kg ~ fertilizer + block, data = agri_data)
summary(rcbd_model)

# Post-Hoc Tukey Test
tukey_result <- TukeyHSD(rcbd_model, "fertilizer")
print(tukey_result)
```
  $markdown$, 'https://www.youtube.com/watch?v=9kYUGMg_14s') RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কৃষি গবেষণায় ANOVA ফিট করার R ফাংশন কোনটি?', 'কৃষি গবেষণায় ANOVA ফিট করার R ফাংশন কোনটি?', '["lm()", "aov()", "anova_fit()", "rcbd()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ANOVA তে পার্থক্য তাৎপর্যপূর্ণ গণ্য করার জন্য p-value কত এর কম হতে হয়?', 'ANOVA তে পার্থক্য তাৎপর্যপূর্ণ গণ্য করার জন্য p-value কত এর কম হতে হয়?', '["0.50", "0.05", "0.10", "1.00"]'::jsonb, 1, 1);

END $$;
