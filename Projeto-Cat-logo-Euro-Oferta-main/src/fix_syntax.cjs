const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// target to replace
const badStr = 'className="md:w-1/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4"';
const goodStr = badStr + '>';

// Because we used string concatenation, let's just find the exact places where the syntax error is.
// it looks like:
// <div className="md:w-1/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4"
//               <div className="flex items-center gap-1 mb-2">

code = code.replace(/<div className="md:w-1\/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4"\n              <div/g, '<div className="md:w-1/2 p-5 lg:p-8 flex flex-col bg-white overflow-y-auto custom-scrollbar md:pr-4">\n              <div');

fs.writeFileSync('src/App.tsx', code);
