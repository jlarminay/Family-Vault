// get all files at the location of C:\Users\Josh\Downloads\videos
import fs from 'fs';
import path from 'path';

const directory = 'C:\\Users\\Josh\\Downloads\\videos';
const files = fs.readdirSync(directory);
const file = files[0];

function main() {
  // check if first character is uppercase
  const firstChar = file.charAt(0);
  if (firstChar !== firstChar.toUpperCase()) {
    console.log('First character is not uppercase');
    return;
  }

  const key = Math.random().toString(36).substring(2, 12);
  const originalFileName = file;
  const newFileName =
    key +
    '_' +
    file
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_.\/]/g, '');

  // rename file
  fs.renameSync(path.join(directory, originalFileName), path.join(directory, newFileName));

  // create new json file
  const jsonFilePath = newFileName.replace('.mp4', '.json');
  fs.writeFileSync(
    path.join(directory, jsonFilePath),
    JSON.stringify({
      videoId: 0,
      key: key,
      name: file,
      targetVideo: `/.tmp/${newFileName}`,
    }),
  );
}

main();
