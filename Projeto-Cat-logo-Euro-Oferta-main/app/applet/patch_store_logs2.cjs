const fs = require('fs');

let types = fs.readFileSync('src/types.ts', 'utf8');

if (!types.includes('logs?: SystemLog[]')) {
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

if (!store.includes('logs: parsed.logs || []')) {
  store = store.replace(
    /orders: parsed\.orders \|\| \[\],\n\s*users: parsed\.users/g,
    'orders: parsed.orders || [],\n        logs: parsed.logs || [],\n        users: parsed.users'
  );
}

if (!store.includes('logs: [],\n    users: [')) {
  store = store.replace(
    /orders: \[\],\n\s*users: \[/g,
    'orders: [],\n    logs: [],\n    users: ['
  );
}

const addLogImpl = `  const addLog = (action, details, user, type = 'system') => {
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
      logs: [newLog, ...(prev.logs || [])].slice(0, 500)
    }));
  };`;

// replace simple JS implementations
if (store.includes("addLog('Exclusão', , 'Sistema', 'delete');")) {
    store = store.replace(
      "addLog('Exclusão', , 'Sistema', 'delete');",
      "addLog('Exclusão', `Lead excluído: ${id}`, 'Sistema', 'delete');"
    );
}

if (!store.includes('const addLog =')) {
  store = store.replace(
    'const setUsers = (users: AdminUser[]) => {',
    addLogImpl + '\n  const setUsers = (users: AdminUser[]) => {'
  );
}

if (!store.includes('addLog,')) {
  store = store.replace(
    'updateUser, deleteUser',
    'updateUser, deleteUser, addLog' // context provider values
  );
}

if (!store.includes("addLog('Novo Lead', `Lead")) {
  store = store.replace('const newLead = { ...partialLead,', "addLog('Novo Lead', `Lead adicionado: ${partialLead.name}`, 'Sistema', 'create');" + '\n    const newLead = { ...partialLead,');
}

fs.writeFileSync('src/store.tsx', store);
