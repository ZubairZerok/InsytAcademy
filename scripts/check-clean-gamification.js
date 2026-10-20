const fs = require('fs');
const path = require('path');

const targetDirs = ['app', 'components', 'actions', 'lib'];
const keywords = ['total_xp', 'calcLevel', 'streak_count', 'streak_freezes', 'xp_reward', 'xp_earned'];

const issues = [];

function scan(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (['node_modules', '.next', 'dist'].includes(item)) continue;
      scan(full);
    } else if (/\.(tsx?|jsx?)$/.test(item)) {
      // Exclude legacy unmounted components in gamification folder if any
      if (full.includes('components\\gamification\\XPProgressBar.tsx') ||
          full.includes('components/gamification/XPProgressBar.tsx') ||
          full.includes('components\\gamification\\LeaderboardWidget.tsx') ||
          full.includes('components/gamification/LeaderboardWidget.tsx') ||
          full.includes('components\\gamification\\streak-hud.tsx') ||
          full.includes('components/gamification/streak-hud.tsx') ||
          full.includes('components\\gamification\\QuizWrapper.tsx') ||
          full.includes('components/gamification/QuizWrapper.tsx') ||
          full.includes('lib\\gamification') ||
          full.includes('lib/gamification') ||
          full.includes('actions\\gamification.ts') ||
          full.includes('actions/gamification.ts')) {
        continue;
      }
      const text = fs.readFileSync(full, 'utf8');
      for (const kw of keywords) {
        if (text.includes(kw)) {
          issues.push({ file: full.replace(/\\/g, '/'), keyword: kw });
        }
      }
    }
  }
}

targetDirs.forEach(d => scan(d));

console.log(`Active code scan finished. Found ${issues.length} active occurrences:`);
for (const iss of issues) {
  console.log(`  ${iss.file} -> ${iss.keyword}`);
}
