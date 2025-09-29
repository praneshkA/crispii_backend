const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'upload/images');

if (!fs.existsSync(imagesDir)) {
  console.error('Images directory not found:', imagesDir);
  process.exit(1);
}

const files = fs.readdirSync(imagesDir);
const changes = [];

for (const f of files) {
  const oldPath = path.join(imagesDir, f);
  // build normalized name: trim, replace multiple spaces with single, replace spaces with _, collapse duplicate underscores, lowercase
  const name = f.trim()
    .replace(/\s+/g, ' ')
    .replace(/ /g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();

  if (name === f) continue;

  const newPath = path.join(imagesDir, name);
  if (fs.existsSync(newPath)) {
    console.warn('Target already exists, skipping:', newPath);
    continue;
  }

  fs.renameSync(oldPath, newPath);
  changes.push({ from: f, to: name });
}

if (changes.length === 0) {
  console.log('No files needed renaming.');
} else {
  console.log('Renamed files:');
  changes.forEach(c => console.log(`${c.from} -> ${c.to}`));
}

console.log('Done.');
