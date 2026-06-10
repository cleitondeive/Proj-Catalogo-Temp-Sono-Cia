const { execSync } = require('child_process');
execSync('git checkout src/admin/pages/CRM.tsx');
console.log('Restored');
