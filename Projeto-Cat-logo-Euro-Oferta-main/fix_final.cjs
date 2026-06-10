const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/const actualLength = activeColorObj\?\.length \|\| quickViewProduct\.length;\n\s+const actualWidth = activeColorObj\?\.width \|\| quickViewProduct\.width;\n\s+const actualHeight = activeColorObj\?\.height \|\| quickViewProduct\.height;\n\s+const actualWeight = activeColorObj\?\.weight \|\| quickViewProduct\.weight;\n\s+\n\s+/g, "");

fs.writeFileSync('src/App.tsx', content);
