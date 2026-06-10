const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');
const modalCode = lines.slice(232, 466).join('\n');
const insertIndex = content.lastIndexOf('</div>\n    </div>\n  );\n}');

const newContent = content.slice(0, insertIndex) + '\n' + modalCode + '\n' + content.slice(insertIndex);
fs.writeFileSync('src/App.tsx', newContent);
