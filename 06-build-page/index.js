const fs_promises = require('fs').promises;
const fs = require('fs');
const path = require('path');

const folderAssetsPath = path.join(__dirname, 'assets');
const folderPath = path.join(__dirname, 'styles');
const newFilePath = path.join(__dirname, 'project-dist', 'style.css');

async function buildProgram() {
  try {
    const templateHTMLPath = path.join(__dirname, 'template.html');
    const headerComponentPath = path.join(
      __dirname,
      'components',
      'header.html',
    );
    const articlesComponentPath = path.join(
      __dirname,
      'components',
      'articles.html',
    );
    const footerComponentPath = path.join(
      __dirname,
      'components',
      'footer.html',
    );

    const templateHTML = await fs_promises.readFile(templateHTMLPath, 'utf-8');
    const headerComponent = await fs_promises.readFile(
      headerComponentPath,
      'utf-8',
    );
    const articlesComponent = await fs_promises.readFile(
      articlesComponentPath,
      'utf-8',
    );
    const footerComponent = await fs_promises.readFile(
      footerComponentPath,
      'utf-8',
    );

    const modifiedTemplate = templateHTML
      .replace('{{header}}', headerComponent)
      .replace('{{articles}}', articlesComponent)
      .replace('{{footer}}', footerComponent);

    const outputDir = path.join(__dirname, 'project-dist');

    await fs_promises.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'index.html');

    await fs_promises.writeFile(outputPath, modifiedTemplate);

    const outputAssetsPath = path.join(__dirname, 'project-dist', 'assets');
    copyDir(folderAssetsPath, outputAssetsPath);

    await applyStyles();
  } catch (error) {
    console.error('Error reading or writing:', error);
  }
}

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

async function applyStyles() {
  try {
    const files = await fs_promises.readdir(folderPath);

    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    const cssFilesArray = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(folderPath, file);
        const content = await fs_promises.readFile(filePath, 'utf-8');
        return content;
      }),
    );

    await fs_promises.mkdir(path.join(__dirname, 'project-dist'), {
      recursive: true,
    });
    await fs_promises.writeFile(newFilePath, cssFilesArray.join('\n'), 'utf-8');
  } catch (err) {
    console.error(`Error applying styles: ${err}`);
  }
}

buildProgram();
