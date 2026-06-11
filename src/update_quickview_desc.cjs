const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regexDesc = /<p className="text-\[#475569\] text-xs md:text-sm mb-4 md:mb-5 leading-relaxed whitespace-pre-line">\s*\{quickViewProduct\.description \|\| "Design escandinavo em madeira de carvalho maciço\. Perfeito para salas minimalistas com um toque de elegância e sofisticação atemporal\."\}\s*<\/p>/g;

const replacementDesc = `<p className="text-[#475569] text-xs md:text-sm mb-4 md:mb-5 leading-relaxed whitespace-pre-line">
                {quickViewProduct.colors?.find((c: any) => c.name === (quickViewProduct.color || quickViewProduct.colors?.[0]?.name))?.description || quickViewProduct.description || "Design escandinavo em madeira de carvalho maciço. Perfeito para salas minimalistas com um toque de elegância e sofisticação atemporal."}
              </p>`;

if(code.match(regexDesc)) {
    code = code.replace(regexDesc, replacementDesc);
    console.log("Replaced description");
}

const regexColorClick = /onClick=\{\(\) => setQuickViewProduct\(\{ \.\.\.quickViewProduct, color: c\.name, \.\.\.\(c\.image && \{ image: c\.image \}\) \}\)\}/g;
const replacementColorClick = `onClick={() => { setQuickViewProduct({ ...quickViewProduct, color: c.name, ...(c.image && { image: c.image }) }); setActiveImageIdx(0); }}`;

if(code.match(regexColorClick)) {
    code = code.replace(regexColorClick, replacementColorClick);
    console.log("Replaced color click");
}

fs.writeFileSync('src/App.tsx', code);
