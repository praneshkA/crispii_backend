const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "../frontend/src/assets");
const destDir = path.join(__dirname, "upload/images");

// Create destination folder if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdir(srcDir, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);

    fs.copyFile(srcFile, destFile, (err) => {
      if (err) throw err;
      console.log(`${file} copied!`);
    });
  });
});
