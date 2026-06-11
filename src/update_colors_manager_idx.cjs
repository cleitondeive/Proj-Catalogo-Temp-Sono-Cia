const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/ColorsManager.tsx', 'utf8');

const regexEditingIdx = /const \[editingIdx, setEditingIdx\] = useState<number \| null>\(null\);/;
const replacementEditingIdx = `const [editingIdx, setEditingIdx] = useState<number | null>(colors.length === 1 ? 0 : null);`;

if(code.match(regexEditingIdx)) {
    code = code.replace(regexEditingIdx, replacementEditingIdx);
    fs.writeFileSync('src/admin/pages/ColorsManager.tsx', code);
    console.log("Updated ColorsManager default editingIdx");
} else {
    console.log("Regex not found for editingIdx");
}
