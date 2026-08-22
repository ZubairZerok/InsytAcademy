-- Update R Course Thumbnail URL
UPDATE public.courses
SET thumbnail_url = 'https://www.computerworld.com/wp-content/uploads/2024/09/1534430-0-41575800-1726249957-r_programming_language_abstract_programming_background_thinkstock_3x2_1200x800-100703503-orig.jpg?quality=50&strip=all&w=1024'
WHERE slug = 'r-agri-data-bau' OR title LIKE '%R for Agri%';

-- Update R Course Lesson 1 Video URL (slug: intro-r)
UPDATE public.lessons
SET video_url = 'https://www.youtube.com/watch?v=9kYUGMg_14s'
WHERE slug = 'intro-r' AND module_id IN (
    SELECT m.id FROM public.modules m
    JOIN public.courses c ON m.course_id = c.id
    WHERE c.slug = 'r-agri-data-bau' OR c.title LIKE '%R for Agri%'
);
