const { execSync } = require('child_process');
try {
  execSync('git checkout src/admin/pages/CRM.tsx');
  console.log('Restored');
} catch (e) {
  console.log(e.message);
}
