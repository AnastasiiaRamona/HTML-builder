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
    fs.readdir(src, (err, files) => {
      if (err) {
        console.error(`Error reading folder: ${err}`);
      } else {
        files.forEach((file) => {
          const srcPath = path.join(src, file);
          const destPath = path.join(dest, file);
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) {
              console.error(`Error copying file ${file}: ${err}`);
            }
          });
        });
      }
    });
  });
}

copyDir(folderPath, folderCopyPath);
