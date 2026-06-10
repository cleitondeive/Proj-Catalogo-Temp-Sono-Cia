const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import confetti")) {
  code = code.replace(/import (.*) from 'lucide-react';/, "import $1 from 'lucide-react';\nimport confetti from 'canvas-confetti';");
}

let triggerReplacement = `              setOrderSentState(true);
              setCart([]);
              
              // Cereja do bolo: Confetti
              confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#015294', '#00b873', '#ffffff']
              });`;

code = code.replace(/setOrderSentState\(true\);\s*setCart\(\[\]\);/, triggerReplacement);

fs.writeFileSync('src/App.tsx', code);
