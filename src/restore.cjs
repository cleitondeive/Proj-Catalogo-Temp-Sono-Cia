const cp = require('child_process');
cp.execSync('git checkout src/App.tsx');
console.log('Restored App.tsx');
