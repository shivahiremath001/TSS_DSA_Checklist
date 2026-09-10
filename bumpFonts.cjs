const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/fontSize:\s*["']0\.5\d*rem["']/g, 'fontSize: "0.7rem"')
                   .replace(/fontSize:\s*["']0\.6\d*rem["']/g, 'fontSize: "0.75rem"');
  fs.writeFileSync(file, content);
});
console.log('Done replacing font sizes!');
