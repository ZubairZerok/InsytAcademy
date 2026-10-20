const fs = require('fs');
const path = require('path');

const keywords = [
  'total_xp',
  'xp',
  'streak',
  'gamification',
  'calcLevel',
  'getTierForLevel',
  'leaderboard'
];

const results = [];

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    if (['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) continue;
    const p = path.join(dir, item);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      walk(p);
    } else if (/\.(tsx?|jsx?|sql)$/i.test(item)) {
      const text = fs.readFileSync(p, 'utf8');
      const found = [];
      for (const kw of keywords) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(text)) {
          found.push(kw);
        }
      }
      if (found.length > 0) {
        results.push({ file: p, keywords: found });
      }
    }
  }
}

walk('.');
console.log(`Found ${results.length} files.`);
for (const r of results) {
  console.log(`${r.file.replace(/\\/g, '/')} -> ${r.keywords.join(', ')}`);
}
