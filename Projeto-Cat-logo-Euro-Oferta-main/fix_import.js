import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("Layers, ProductCard } from './components/ProductCard';", "ProductCard } from './components/ProductCard';");
content = content.replace("} from \"lucide-react\";", "  Layers,\n} from \"lucide-react\";");

fs.writeFileSync('src/App.tsx', content, 'utf8');
