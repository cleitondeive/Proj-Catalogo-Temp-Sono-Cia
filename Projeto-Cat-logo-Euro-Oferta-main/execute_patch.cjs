const fs = require('fs');

let code = fs.readFileSync('src/admin/pages/CRM.tsx', 'utf8');

if(!code.includes('Printer')) {
  code = code.replace(
    /import \{ Search, Filter, MoreHorizontal, MessageCircle, Clock, Star, MapPin, Tag, DollarSign, Package, ShoppingBag, X, Mail, Trash2 \} from 'lucide-react';/,
    "import { Search, Filter, MoreHorizontal, MessageCircle, Clock, Star, MapPin, Tag, DollarSign, Package, ShoppingBag, X, Mail, Trash2, Printer, Download } from 'lucide-react';"
  );
}

const startIndex = code.indexOf('const LeadDetailsModal =');

if(startIndex !== -1) {
  const modalCode = fs.readFileSync('modal_patch.txt', 'utf8');
  const newCode = code.substring(0, startIndex) + modalCode + '\n';
  fs.writeFileSync('src/admin/pages/CRM.tsx', newCode);
  console.log('Successfully patched CRM.tsx');
} else {
  console.log('Could not patch, could not find bounds.');
}
