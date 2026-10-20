-- Update R Course Thumbnail URL
UPDATE public.courses
SET thumbnail_url = '/images/courses/r-agri-data-bau.png'
WHERE slug = 'r-agri-data-bau' OR title LIKE '%R for Agri%';

-- Update R Course Lesson 1 Video URL (slug: intro-r)
UPDATE public.lessons
SET video_url = 'https://www.youtube.com/watch?v=9kYUGMg_14s'
WHERE slug = 'intro-r' AND module_id IN (
    SELECT m.id FROM public.modules m
    JOIN public.courses c ON m.course_id = c.id
    WHERE c.slug = 'r-agri-data-bau' OR c.title LIKE '%R for Agri%'
);
