const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regexColorClick = /onClick=\{\(\) => \{ setQuickViewProduct\(\{ \.\.\.quickViewProduct, color: c\.name, \.\.\.\(c\.image && \{ image: c\.image \}\) \}\); setActiveImageIdx\(0\); \}\}/g;
const replacementColorClick = `onClick={() => { setQuickViewProduct({ ...quickViewProduct, color: c.name }); setActiveImageIdx(0); }}`;

if(code.match(regexColorClick)) {
    code = code.replace(regexColorClick, replacementColorClick);
    console.log("Replaced color click mutations");
} else {
    console.log("Regex not found for color click");
}

fs.writeFileSync('src/App.tsx', code);
