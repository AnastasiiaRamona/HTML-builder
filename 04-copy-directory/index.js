const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const folderCopyPath = path.join(__dirname, 'files-copy');

function copyDir(src, dest) {
  fs.access(dest, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdir(dest, { recursive: true }, (err) => {
        if (err) {
          console.error(`Error creating folder: ${err}`);
        }
      });
    }
    fs.readdir(src, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(`Error reading folder: ${err}`);
      } else {
        files.forEach((file) => {
          if (!file.isDirectory()) {
            const srcPath = path.join(src.name ?? src, file.name);
            const destPath = path.join(dest.name ?? dest, file.name);
            fs.copyFile(srcPath, destPath, (err) => {
              if (err) {
                console.error(`Error copying file ${file}: ${err}`);
              }
            });
          } else if (file.isDirectory()) {
            copyDir(
              path.join(src.name ?? src, file.name),
              path.join(dest.name ?? dest, file.name),
            );
          }
        });
      }
    });
  });
}

copyDir(folderPath, folderCopyPath);
