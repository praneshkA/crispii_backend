/**
 * Update Product documents in MongoDB with Cloudinary URLs produced by uploadToCloudinary.js
 *
 * Usage:
 * 1. Ensure upload-results.json exists in backend (produced by uploadToCloudinary.js)
 * 2. Set MONGO_URI env or edit the script to match your DB
 * 3. Run: node updateProductImageUrls.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://pranesh:123@demo.wfefywo.mongodb.net/snacksdb?retryWrites=true&w=majority';
const mappingFile = path.join(__dirname, 'upload-results.json');

if (!fs.existsSync(mappingFile)) {
  console.error('Mapping file not found:', mappingFile);
  console.error('Run uploadToCloudinary.js first to produce upload-results.json');
  process.exit(1);
}

const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));

// Product model
const Product = require('./models/Product');

async function run() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  for (const m of mapping) {
    if (m.error) continue;
    // Try to find product by filename match: either the original filename or normalized name
    const filename = m.filename;
    const nameOnly = filename.replace(/\.[^.]+$/, '');
    const normalized = nameOnly.replace(/\s+/g, ' ').trim().toLowerCase();

    // Try a few queries: image contains filename, name matches normalized name
    // Update product.image to the Cloudinary secure URL

    const byImage = await Product.findOne({ image: { $regex: filename, $options: 'i' } });
    if (byImage) {
      console.log('Updating by image match:', filename, '->', m.url);
      byImage.image = m.url;
      await byImage.save();
      continue;
    }

    // fallback: try by product name (normalize both sides)
    const byName = await Product.findOne({
      name: { $regex: `^${normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, $options: 'i' }
    });
    if (byName) {
      console.log('Updating by name match:', byName.name, '->', m.url);
      byName.image = m.url;
      await byName.save();
      continue;
    }

    console.warn('No matching product found for', filename);
  }

  console.log('Done updating products');
  mongoose.disconnect();
}

run().catch(err => {
  console.error('Updater error:', err);
  process.exit(1);
});
