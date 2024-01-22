const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'styles');
const newFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function applyStyles() {
  try {
    const files = await fs.readdir(folderPath);

    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    const cssFilesArray = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(folderPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
      }),
    );

    await fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    await fs.writeFile(newFilePath, cssFilesArray.join('\n'), 'utf-8');
  } catch (err) {
    console.error(`Error applying styles: ${err}`);
  }
}

applyStyles();
