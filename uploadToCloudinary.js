/**
 * Upload all images from backend/upload/images to Cloudinary.
 *
 * Usage:
 * 1. Install deps in backend folder: npm install cloudinary dotenv
 * 2. Create a .env in backend with CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * 3. Run: node uploadToCloudinary.js
 *
 * The script writes upload-results.json in the backend folder with mapping { filename, public_id, url }
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('Missing Cloudinary credentials. Please create a .env with CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  process.exit(1);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const imagesDir = path.join(__dirname, 'upload/images');
const outFile = path.join(__dirname, 'upload-results.json');

async function run() {
  if (!fs.existsSync(imagesDir)) {
    console.error('Images directory not found:', imagesDir);
    process.exit(1);
  }

  const files = fs.readdirSync(imagesDir).filter(f => /\.(jpe?g|png|gif|webp|jpeg)$/i.test(f));
  if (files.length === 0) {
    console.log('No image files found in', imagesDir);
    return;
  }

  const results = [];

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const name = path.parse(file).name;
    // build a safe public id (folder + normalized name)
    const normalized = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_\-]/g, '').toLowerCase();
    const publicId = `crispii/products/${normalized}`;

    try {
      console.log('Uploading', file, '-> public_id:', publicId);
      const res = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        folder: 'crispii/products',
        overwrite: false,
        resource_type: 'image',
      });

      results.push({ filename: file, public_id: res.public_id, url: res.secure_url });
      console.log('Uploaded:', file, '->', res.secure_url);
    } catch (err) {
      console.error('Failed to upload', file, err.message || err);
      results.push({ filename: file, error: err.message || String(err) });
    }
  }

  fs.writeFileSync(outFile, JSON.stringify(results, null, 2), 'utf8');
  console.log('\nDone. Results written to', outFile);
}

run().catch(err => {
  console.error('Uploader error:', err);
  process.exit(1);
});
