const fs = require('fs');
let types = fs.readFileSync('src/types.ts', 'utf8');

if (!types.includes('logs: SystemLog[]')) {
  // We already ran a TSX script to add SystemLog
  types = types.replace('users: AdminUser[];', 'users: AdminUser[];\n  logs?: SystemLog[];');
  fs.writeFileSync('src/types.ts', types);
}

let store = fs.readFileSync('src/store.tsx', 'utf8');

const actionLogType = "addLog: (action: string, details: string, user: string, type?: 'auth'|'create'|'update'|'delete'|'system') => void;";

if (!store.includes('addLog:')) {
  store = store.replace(
    'deleteUser: (id: string) => void;',
    'deleteUser: (id: string) => void;\n  ' + actionLogType
  );
}

// Inside getInitialLocalData
if (!store.includes('logs: parsed.logs || []')) {
  store = store.replace(
    /orders: parsed\.orders \|\| \[\],\n\s*users: parsed\.users/g,
    'orders: parsed.orders || [],\n        logs: parsed.logs || [],\n        users: parsed.users'
  );
}

// Inside default fallback
if (!store.includes('logs: [],\n    users: [')) {
  store = store.replace(
    /orders: \[\],\n\s*users: \[/g,
    'orders: [],\n    logs: [],\n    users: ['
  );
}

const addLogImpl = `
  const addLog = (action: string, details: string, user: string, type: 'auth'|'create'|'update'|'delete'|'system' = 'system') => {
    const newLog = {
      id: Math.random().toString(36).substring(2, 9),
      action,
      details,
      user,
      type,
      timestamp: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      logs: [newLog, ...(prev.logs || [])].slice(0, 500) // limit to 500 logs
    }));
  };
`;

if (!store.includes('const addLog =')) {
  store = store.replace(
    'const setUsers = (users: AdminUser[]) => {',
    addLogImpl + '\n  const setUsers = (users: AdminUser[]) => {'
  );
}

if (!store.includes('addLog,')) {
  store = store.replace(
    'updateUser, deleteUser',
    'updateUser, deleteUser, addLog'
  );
}

// Inject some automatic logs into specific actions
// e.g. addLead, updateLead, deleteLead
const addLeadPatch = "addLog('Novo Lead', `Lead adicionado: ${partialLead.name}`, 'Sistema', 'create');";
if (!store.includes("addLog('Novo Lead'")) {
    store = store.replace('const newLead = { ...partialLead,', addLeadPatch + '\n    const newLead = { ...partialLead,');
}

if (!store.includes("addLog('Exclusão'")) {
    store = store.replace(
        'const deleteLead = (id: string) => {',
        'const deleteLead = (id: string) => {\n    addLog(\'Exclusão\', `Lead excluído ID: ${id}`, \'Sistema\', \'delete\');'
    );
}

fs.writeFileSync('src/store.tsx', store);
