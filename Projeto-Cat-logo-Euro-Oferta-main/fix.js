import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace array
content = content.replace(/\[\s*quickViewProduct\.image,\s*"https:\/\/images\.unsplash\.com\/photo-1631679706909-1844bbd07221\?auto=format&fit=crop&w=600&q=80",\s*"https:\/\/images\.unsplash\.com\/photo-1584100936595-c0654b355040\?auto=format&fit=crop&w=600&q=80",?\s*\]/g, 
  '[quickViewProduct?.image, ...(quickViewProduct?.gallery || [])].filter(Boolean)');

// Replace activeImageIdx limits in Quick View
// 1. Math.min(2,
content = content.replace(/Math\.min\(2,/g, 'Math.min([quickViewProduct?.image, ...(quickViewProduct?.gallery || [])].filter(Boolean).length - 1,');

// 2. activeImageIdx < 2
content = content.replace(/activeImageIdx < 2/g, 'activeImageIdx < [quickViewProduct?.image, ...(quickViewProduct?.gallery || [])].filter(Boolean).length - 1');

// 3. activeImageIdx === 2
content = content.replace(/activeImageIdx === 2/g, 'activeImageIdx === [quickViewProduct?.image, ...(quickViewProduct?.gallery || [])].filter(Boolean).length - 1');

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log('Done!');
