const fs = require('fs');
let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

const anchor = '{lead.orders.length > 0 && (';
const tagInjection = `
      {lead.tags && lead.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 z-10 relative pointer-events-none">
          {lead.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-[8px] font-bold uppercase tracking-widest text-[#0F172A] bg-gray-100 border border-gray-200/50 px-1.5 py-0.5 rounded shadow-sm">
              {tag}
            </span>
          ))}
          {lead.tags.length > 3 && (
            <span className="text-[8px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">+{lead.tags.length - 3}</span>
          )}
        </div>
      )}
`;

if (!code.includes("lead.tags.slice(0, 3)")) {
  code = code.replace(anchor, tagInjection + "\n      " + anchor);
}

fs.writeFileSync('src/admin/pages/CRM.tsx', code);
