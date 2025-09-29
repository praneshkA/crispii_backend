# Cloudinary upload workflow

Steps to upload product images to Cloudinary and update MongoDB product documents.

1. Install dependencies in backend:

```powershell
cd d:\crispii\backend
npm install cloudinary dotenv
```

2. Create a `.env` file in `d:\crispii\backend` with:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGO_URI=mongodb+srv://pranesh:123@demo.wfefywo.mongodb.net/snacksdb?retryWrites=true&w=majority
```

3. Run the uploader to upload all images from `upload/images`:

```powershell
node uploadToCloudinary.js
```

This writes `upload-results.json` containing mapping entries with `filename`, `public_id`, and `url`.

4. Review `upload-results.json` and ensure uploads are correct.

5. Run the updater to update Product documents in MongoDB:

```powershell
node updateProductImageUrls.js
```

6. Start your backend server and frontend, and verify images now load from Cloudinary URLs.

Notes
- The uploader defaults to the `crispii/products` folder in Cloudinary. Adjust `publicId` in `uploadToCloudinary.js` if you want a different path.
- `updateProductImageUrls.js` tries to match by the original filename first, then by product name. Review matches manually if necessary.
- Make backups or export your products collection before running the updater if you're concerned about accidental changes.