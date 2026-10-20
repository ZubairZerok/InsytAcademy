const fs = require('fs');

const text = fs.readFileSync('supabase/seeds/r_course_seeds.sql', 'utf8');

const quizMatches = text.split(/INSERT INTO public\.quiz_questions/i);
console.log('Quiz questions count:', quizMatches.length - 1);

// Sample quiz insert line
const sample = text.match(/INSERT INTO public\.quiz_questions[^\n]+/i);
console.log('Sample quiz line:', sample ? sample[0] : 'None');
