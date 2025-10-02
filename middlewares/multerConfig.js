   const multer = require('multer');
   const path = require('path');

   // Store files in upload/images
   const storage = multer.diskStorage({
     destination: (req, file, cb) => {
       cb(null, 'upload/images');
     },
     filename: (req, file, cb) => {
       cb(null, Date.now() + path.extname(file.originalname));
     },
   });

   const upload = multer({
     storage,
     limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit
     fileFilter: (req, file, cb) => {
       if (file.mimetype.startsWith('image/')) {
         cb(null, true);
       } else {
         cb(new Error('Only images allowed'), false);
       }
     },
   });

   module.exports = upload;
   