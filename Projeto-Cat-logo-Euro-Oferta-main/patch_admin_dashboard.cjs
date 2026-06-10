const fs = require('fs');
let code = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');

if (!code.includes("import Team from './pages/Team';")) {
  code = code.replace("import SettingsPage from './pages/Settings';", "import SettingsPage from './pages/Settings';\nimport Team from './pages/Team';");
}

code = code.replace(/useState<'dashboard' \| 'crm' \| 'products' \| 'orders' \| 'settings'>\('dashboard'\);/g, "useState<'dashboard' | 'crm' | 'products' | 'team' | 'orders' | 'settings'>('dashboard');");

const navTarget = `{hasAccess('products') && <NavItem active={activeTab === 'products'} onClick={() => {setActiveTab('products'); setIsSidebarOpen(false);}} icon={<Package />} label="Produtos" />}`;
const navReplace = `{hasAccess('products') && <NavItem active={activeTab === 'products'} onClick={() => {setActiveTab('products'); setIsSidebarOpen(false);}} icon={<Package />} label="Produtos" />}
          {currentUser?.role === 'admin' && <NavItem active={activeTab === 'team' as any} onClick={() => {setActiveTab('team' as any); setIsSidebarOpen(false);}} icon={<Users />} label="Equipe & Acessos" />}`;
code = code.replace(navTarget, navReplace);

const routeTarget = `{activeTab === 'products' && <ProductsManager />}`;
const routeReplace = `{activeTab === 'products' && <ProductsManager />}
        {activeTab === 'team' as any && <Team currentUser={currentUser!} />}`;
code = code.replace(routeTarget, routeReplace);

fs.writeFileSync('src/admin/AdminDashboard.tsx', code);
console.log('patched admin dashboard');
