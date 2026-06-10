const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

let lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(')})}')) {
        lines[i] = lines[i].replace(')})} ', ')}');
        lines[i] = lines[i].replace(')})} ', ')}');
        lines[i] = lines[i].replace(')})} ', ')}');
        lines[i] = lines[i].replace(')})} ', ')}'); // try to catch all
        lines[i] = lines[i].replace(')})} ', ')}'); // try to catch all
        lines[i] = lines[i].replace(')})} ', ')}'); // try to catch all
    }
}

code = lines.join('\n');

code = code.replace(/\\n/g, '\n'); // fix any injected \n literals from my previous scripts 

fs.writeFileSync('src/App.tsx', code);
