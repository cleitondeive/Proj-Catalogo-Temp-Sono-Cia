const fs = require('fs');
let code = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');

code = code.replace(
  "{activeTab === 'dashboard' && <Metrics leads={data.leads} products={data.products} />}",
  "{activeTab === 'dashboard' && <Metrics leads={data.leads} products={data.products} onNavigate={(t) => setActiveTab(t)} />}"
);

fs.writeFileSync('src/admin/AdminDashboard.tsx', code);
