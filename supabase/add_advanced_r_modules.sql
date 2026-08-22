-- 0. SCHEMA GUARANTEE (Ensures quiz_questions table supports all schema column variations)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'quiz_id') THEN
        ALTER TABLE public.quiz_questions ALTER COLUMN quiz_id DROP NOT NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'question_text') THEN
        ALTER TABLE public.quiz_questions ALTER COLUMN question_text DROP NOT NULL;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'correct_option') THEN
        ALTER TABLE public.quiz_questions ALTER COLUMN correct_option DROP NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'lesson_id') THEN
        ALTER TABLE public.quiz_questions ADD COLUMN lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'question') THEN
        ALTER TABLE public.quiz_questions ADD COLUMN question TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'question_text') THEN
        ALTER TABLE public.quiz_questions ADD COLUMN question_text TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'options') THEN
        ALTER TABLE public.quiz_questions ADD COLUMN options JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'correct_answer') THEN
        ALTER TABLE public.quiz_questions ADD COLUMN correct_answer INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'correct_option') THEN
        ALTER TABLE public.quiz_questions ADD COLUMN correct_option INTEGER;
    END IF;
END $$;

DO $$
DECLARE
  r_cid UUID;
  m4_id UUID;
  m5_id UUID;
  m6_id UUID;
  m7_id UUID;
  l_id UUID;
BEGIN
  -- Get R Course ID
  SELECT id INTO r_cid FROM public.courses WHERE slug = 'r-agri-data-bau' OR title LIKE '%R for Agri%' LIMIT 1;

  IF r_cid IS NULL THEN
    RAISE NOTICE 'R Course not found. Please ensure course exists.';
    RETURN;
  END IF;

  -- ================================================================================================
  -- MODULE 4: INTERACTIVE WEB DASHBOARDS WITH R SHINY
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 4: Interactive Web Dashboards with R Shiny', 'r-shiny-dashboards', 4, 'Build reactive web apps, custom user interfaces, and deploy live data apps with Shiny.')
  RETURNING id INTO m4_id;

  -- M4-L1: Intro to Shiny
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id, '1. Introduction to R Shiny & Reactive Architecture', 'shiny-intro', 1,
  $markdown$
# Module 4: Interactive Web Dashboards with R Shiny
> [!TIP]
> **R Shiny** হলো R-এর সবচেয়ে শক্তিশালী ফ্রেমওয়ার্ক যা দিয়ে যেকোনো সাধারণ ডেটা সেটকে একটি লাইভ, ইন্টারঅ্যাক্টিভ ওয়েব ড্যাশবোর্ডে রূপান্তর করা যায়।

## 1. What is R Shiny?
এক্সেলে বা সাধারণ R স্ক্রিপ্টে কোনো গ্রাফ বানালে তা স্থির (Static) থাকে। কিন্তু **Shiny** ব্যবহার করে আপনি এমন একটি ওয়েবসাইট বা অ্যাপ বানাতে পারবেন যেখানে ইউজার ড্রপডাউন মেনু বা স্লাইডার থেকে ক্যাটাগরি পরিবর্তন করলে গ্রাফটি সাথে সাথে **Live Update** হয়ে যাবে!

## 2. Shiny App Structure (`ui` and `server`)
একটি Shiny অ্যাপের দুটি প্রধান অংশ থাকে:
1. **User Interface (`ui`):** অ্যাপের সামনের লেআউট (বাটন, স্লাইডার, ড্রপডাউন, গ্রাফের জায়গা)।
2. **Server Function (`server`):** অ্যাপের পেছনের মেধা বা ইঞ্জিন (যেখানে R কোড রান হয় এবং আউটপুট হিসাব করা হয়)।

```r
library(shiny)

# 1. UI Component
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

# 2. Server Component
server <- function(input, output) {
  output$yieldPlot <- renderPlot({
    plot(1:10, main = paste("Yield Trend for:", input$crop), col = "emerald")
  })
}

# 3. Launch App
shinyApp(ui = ui, server = server)
```

> [!NOTE]
> `shinyApp(ui, server)` কল করলে আপনার কম্পিউটারে একটি লাইভ ওয়েব সার্ভার চালু হয়ে যাবে!
  $markdown$, 'https://www.youtube.com/watch?v=9kYUGMg_14s') RETURNING id INTO l_id;

  -- QUIZ M4-L1
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'R Shiny অ্যাপের দুটি প্রধান অংশ কি কি?', 'R Shiny অ্যাপের দুটি প্রধান অংশ কি কি?', '["input ও output", "ui ও server", "HTML ও CSS", "RStudio ও Chrome"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'UI (User Interface) এর কাজ কি?', 'UI (User Interface) এর কাজ কি?', '["ডেটাবেজ কানেক্ট করা", "অ্যাপের লেআউট ও ড্রপডাউন ফিল্টার ফ্রন্টএন্ডে দেখানো", "কোড প্রসেস করা", "ফাইল ডিলিট করা"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Shiny অ্যাপ চালু করার জন্য কোন ফাংশন ব্যবহার করা হয়?', 'Shiny অ্যাপ চালু করার জন্য কোন ফাংশন ব্যবহার করা হয়?', '["runApp()", "shinyApp()", "startShiny()", "launch()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'renderPlot() ফাংশনের কাজ কি?', 'renderPlot() ফাংশনের কাজ কি?', '["গ্রাফ রেন্ডার করে আউটপুটে পাঠানো", "গ্রাফ ডিলিট করা", "ফাইল এক্সপোর্ট করা", "ভিডিও চালানো"]'::jsonb, 0, 0);

  -- M4-L2: Deploying Shiny
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m4_id, '2. Deploying Shiny Apps to the Web (shinyapps.io)', 'deploy-shiny', 2,
  $markdown$
# Lesson 2: Deploying Shiny Apps to shinyapps.io
গবেষণার ডেটা ড্যাশবোর্ড বানানোর পর শিক্ষক, তত্ত্বাবধায়ক (Supervisor), বা গ্লোবাল জার্নালের জন্য তা ইন্টারনেটে ফ্রিতে পাবলিশ করা যায়!

## Step 1: Install `rsconnect`
```r
install.packages("rsconnect")
library(rsconnect)
```

## Step 2: Publish with One Click
RStudio এর উপরে ডান কোণায় থাকা **Publish** বাটন প্রেস করে সহজেই **shinyapps.io** সার্ভারে আপনার এগ্রি-ড্যাশবোর্ড লাইভ করে দিন!
  $markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Shiny অ্যাপ বিনামূল্যে ফ্রিতে লাইভ হোস্ট করার প্ল্যাটফর্ম কোনটি?', 'Shiny অ্যাপ বিনামূল্যে ফ্রিতে লাইভ হোস্ট করার প্ল্যাটফর্ম কোনটি?', '["GitHub", "shinyapps.io", "Vercel", "Netlify"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Shiny অ্যাপ সার্ভারে আপলোড করার জন্য কোন R প্যাকেজটি দরকার?', 'Shiny অ্যাপ সার্ভারে আপলোড করার জন্য কোন R প্যাকেজটি দরকার?', '["ggplot2", "rsconnect", "dplyr", "shiny"]'::jsonb, 1, 1);

  -- ================================================================================================
  -- MODULE 5: INTERACTIVE GEOSPATIAL MAPPING WITH LEAFLET
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 5: Interactive Geospatial Mapping with Leaflet', 'leaflet-spatial-maps', 5, 'Master interactive GIS maps, GPS markers, satellite tile basemaps, and GeoJSON field plots.')
  RETURNING id INTO m5_id;

  -- M5-L1: Leaflet Basics
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m5_id, '1. Interactive Maps with Leaflet in R', 'leaflet-basics', 1,
  $markdown$
# Module 5: Interactive Geospatial Mapping with Leaflet
> [!IMPORTANT]
> **Leaflet** হলো বিশ্বের সবচেয়ে জনপ্রিয় ওপেন-সোর্স JavaScript ম্যাপ লাইব্রেরি, যা R-এ `leaflet` প্যাকেজ দিয়ে অত্যন্ত সহজে ব্যবহার করা যায়।

## 1. Creating Your First Satellite Map
জমির স্যাটেলাইট ইমেজ, বিএইউ (BAU) ক্যাম্পাস, বা মাটির নমুনা সংগ্রহের পয়েন্ট পিন করার জন্য **Leaflet** অপরিহার্য।

```r
library(leaflet)

# BAU Mymensingh Campus Coordinates (24.7257° N, 90.4371° E)
map <- leaflet() %>%
  addTiles() %>%  # Default OpenStreetMap Tile
  addMarkers(lng = 90.4371, lat = 24.7257, popup = "BAU Precision Ag Field Site")

# Display Map
map
```

> [!TIP]
> `addProviderTiles(providers$Esri.WorldImagery)` যোগ করলে আপনি আসল **High-Resolution Satellite View** দেখতে পাবেন!

```r
# Satellite Imagery Basemap
leaflet() %>%
  addProviderTiles(providers$Esri.WorldImagery) %>%
  addCircleMarkers(
    lng = c(90.437, 90.440, 90.442),
    lat = c(24.725, 24.728, 24.730),
    color = "green",
    radius = 8,
    popup = c("Sample Site A", "Sample Site B", "Sample Site C")
  )
```
  $markdown$, 'https://www.youtube.com/watch?v=9kYUGMg_14s') RETURNING id INTO l_id;

  -- QUIZ M5-L1
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Leaflet এ ম্যাপ ড্র করার পাইপলাইন চিহ্ন কোনটি?', 'Leaflet এ ম্যাপ ড্র করার পাইপলাইন চিহ্ন কোনটি?', '["+", "%>%", "->", "::"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'Satellite Imagery Basemap যোগ করার জন্য কোন ফাংশন ব্যবহৃত হয়?', 'Satellite Imagery Basemap যোগ করার জন্য কোন ফাংশন ব্যবহৃত হয়?', '["addTiles()", "addProviderTiles()", "addSatellite()", "addRaster()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ম্যাপে কোনো জিপিএস পয়েন্টে পপআপ টেক্সটসহ মার্কার বসাতে কোনটি লাগে?', 'ম্যাপে কোনো জিপিএস পয়েন্টে পপআপ টেক্সটসহ মার্কার বসাতে কোনটি লাগে?', '["addMarkers()", "addPin()", "addPoint()", "addLabel()"]'::jsonb, 0, 0);

  -- ================================================================================================
  -- MODULE 6: REPRODUCIBLE PUBLISHING WITH RMARKDOWN & QUARTO
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 6: Reproducible Publishing with RMarkdown & Quarto', 'rmarkdown-publishing', 6, 'Generate publication-ready PDF, HTML, and Word thesis reports directly from R code.')
  RETURNING id INTO m6_id;

  -- M6-L1: Intro to RMarkdown
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m6_id, '1. Reproducible Research Reports with RMarkdown', 'rmarkdown-basics', 1,
  $markdown$
# Module 6: Reproducible Publishing with RMarkdown
> [!NOTE]
> থিসিস বা সায়েন্টিফিক জার্নালের জন্য বারবার MS Word-এ ক্যাট-পেস্ট না করে **RMarkdown** দিয়ে ১ ক্লিকে অটোমেটিক PDF/Word রিপ্রোডিউসেবল রিপোর্ট জেনারেট করুন!

## 1. RMarkdown Header (YAML)
```markdown
---
title: "Boro Crop Yield Analysis Report — 2026"
author: "BAU Research Cadet"
output: pdf_document
---
```

## 2. R Code Chunks
```markdown
```{r yield_plot, echo=FALSE, fig.width=7, fig.height=4}
library(ggplot2)
ggplot(mtcars, aes(x=wt, y=mpg)) + geom_point(color="emerald") + theme_minimal()
```
```

> [!TIP]
> `echo=FALSE` দিলে রিপোর্টে শুধু সুন্দর গ্রাফটি প্রিন্ট হবে, কিন্তু পেছনের র কোডটি লুকিয়ে থাকবে!
  $markdown$, NULL) RETURNING id INTO l_id;

  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'RMarkdown ফাইলের প্রারম্ভিক মেটাডেটা ব্লককে কি বলা হয়?', 'RMarkdown ফাইলের প্রারম্ভিক মেটাডেটা ব্লককে কি বলা হয়?', '["JSON", "YAML Header", "HTML Meta", "Config"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'রিপোর্টে R কোড গোপন রেখে শুধু গ্রাফ দেখানোর জন্য কোড চাংক অপশন কোনটি?', 'রিপোর্টে R কোড গোপন রেখে শুধু গ্রাফ দেখানোর জন্য কোড চাংক অপশন কোনটি?', '["echo=FALSE", "include=FALSE", "warning=FALSE", "eval=FALSE"]'::jsonb, 0, 0);

  -- ================================================================================================
  -- MODULE 7: AGRICULTURAL EXPERIMENTAL DESIGN & ANOVA
  -- ================================================================================================
  INSERT INTO public.modules (course_id, title, slug, order_index, description)
  VALUES (r_cid, 'Module 7: Experimental Design & ANOVA for Agricultural Research', 'agri-experimental-design-anova', 7, 'Master CRD, RCBD experimental design, 2-Way ANOVA in R, p-values, and Tukey HSD post-hoc testing.')
  RETURNING id INTO m7_id;

  -- M7-L1: ANOVA & RCBD
  INSERT INTO public.lessons (module_id, title, slug, order_index, content, video_url) VALUES (m7_id, '1. RCBD Design, ANOVA & Tukey HSD Post-Hoc Test in R', 'anova-testing', 1,
  $markdown$
# Module 7: Experimental Design & ANOVA for Agricultural Trials
> [!IMPORTANT]
> কৃষি গবেষণায় (Field Experiment) বিভিন্ন সার (Fertilizer Treatments) এবং জাতের (Crop Varieties) মধ্যে ফলনের পার্থক্যের তাৎপর্য (Statistical Significance) প্রমাণের জন্য **ANOVA (Analysis of Variance)** ও **Tukey HSD Test** হলো আন্তর্জাতিক স্ট্যান্ডার্ড।

## 1. Randomized Complete Block Design (RCBD) ANOVA Model
কৃষি জমিতে ব্লকিং (Block) ধরে ২-ওয়ে অ্যানোভা চালানোর কোড:

```r
# Create Sample Agricultural Trial Data
set.seed(42)
fertilizer <- factor(rep(c("Control", "NPK Low", "NPK High", "Bio-Organic"), each = 6))
block <- factor(rep(1:6, times = 4))
yield_kg <- c(
  rnorm(6, mean=3500, sd=150),
  rnorm(6, mean=4200, sd=180),
  rnorm(6, mean=5100, sd=200),
  rnorm(6, mean=4800, sd=190)
)
agri_data <- data.frame(fertilizer, block, yield_kg)

# Fit RCBD ANOVA Model in R
rcbd_model <- aov(yield_kg ~ fertilizer + block, data = agri_data)
summary(rcbd_model)
```

> [!NOTE]
> `summary(rcbd_model)` রান করলে R আপনাকে $p$-value বা `Pr(>F)` মান দেখাবে। যদি $p$-value $< 0.05$ হয়, তবে সারের কার্যকারিতায় **পরিসংখ্যানগতভাবে অত্যন্ত তাৎপর্যপূর্ণ পার্থক্য** বিদ্যমান!

## 2. Tukey HSD Post-Hoc Test
কোন নির্দিষ্ট সারটি সবচেয়ে সেরা এবং কার সাথে কার পার্থক্য আছে তা সূক্ষ্মভাবে জানার জন্য:

```r
# Post-Hoc Tukey Test
tukey_result <- TukeyHSD(rcbd_model, "fertilizer")
print(tukey_result)

# Plot Tukey Confidence Intervals
plot(tukey_result, col="darkgreen")
```
  $markdown$, 'https://www.youtube.com/watch?v=9kYUGMg_14s') RETURNING id INTO l_id;

  -- QUIZ M7-L1
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'কৃষি গবেষণায় ANOVA (Analysis of Variance) ফিট করার R ফাংশন কোনটি?', 'কৃষি গবেষণায় ANOVA (Analysis of Variance) ফিট করার R ফাংশন কোনটি?', '["lm()", "aov()", "anova_fit()", "rcbd()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ANOVA তে পার্থক্য তাৎপর্যপূর্ণ (Significant) গণ্য করার জন্য p-value কত এর কম হতে হয়?', 'ANOVA তে পার্থক্য তাৎপর্যপূর্ণ (Significant) গণ্য করার জন্য p-value কত এর কম হতে হয়?', '["0.50", "0.05", "0.10", "1.00"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'ANOVA তে কোন সারের সাথে কোন সারের সুনির্দিষ্ট পার্থক্য আছে তা বের করতে কোন পোস্ট-হক টেস্ট ব্যবহৃত হয়?', 'ANOVA তে কোন সারের সাথে কোন সারের সুনির্দিষ্ট পার্থক্য আছে তা বের করতে কোন পোস্ট-হক টেস্ট ব্যবহৃত হয়?', '["t.test()", "TukeyHSD()", "cor.test()", "summary()"]'::jsonb, 1, 1);
  INSERT INTO public.quiz_questions (lesson_id, question, question_text, options, correct_answer, correct_option) VALUES (l_id, 'RCBD এর পূর্ণরূপ কি?', 'RCBD এর পূর্ণরূপ কি?', '["Randomized Complete Block Design", "Research Crop Basic Data", "Regional Complete Base Division", "Randomized Control Bio Design"]'::jsonb, 0, 0);

END $$;
