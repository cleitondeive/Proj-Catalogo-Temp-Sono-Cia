const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /              <\/div>\n            <\/div>\n\n      \{\/\* Lightbox for zooming \*\/\}/g,
  '              </div>\n            </div>\n          </div>\n        </div>\n      )}\n\n      {/* Lightbox for zooming */}'
);

fs.writeFileSync('src/App.tsx', code);
