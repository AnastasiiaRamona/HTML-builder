const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(`Can't reading ${file}: ${err.message}`);
        return;
      }

      if (stats.isFile()) {
        const extFile = path.extname(file);
        stdout.write(`${file}-${extFile}-${stats.size / 1000}kb\n`);
      }
    });
  });
});
