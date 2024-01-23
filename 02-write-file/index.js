const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');

const filePath = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(filePath);

stdout.write('Hello, my friend! I wait a message from you:\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    writeStream.write(data);
  }
});

process.on('exit', () => stdout.write('Goodbye, my friend!\n'));
process.on('SIGINT', () => process.exit());
