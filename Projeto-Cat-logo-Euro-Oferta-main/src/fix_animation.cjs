const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                  {hasDimensions && (
                    <div className="mb-5 md:mb-6 bg-white border border-gray-200 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden group hover:border-[#7591A6]/50 transition-all duration-300 transform origin-top " style={{ animationDuration: '0.4s' }}>
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-[#FAFAFA]/80 backdrop-blur-sm">`;

const replacement = `                  {hasDimensions && (
                    <div className="mb-5 md:mb-6 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden group hover:border-[#7591A6]/50 transition-colors">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-[#FAFAFA]/80 backdrop-blur-sm">`;

code = code.split(target).join(replacement);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed animation classes in App.tsx');
