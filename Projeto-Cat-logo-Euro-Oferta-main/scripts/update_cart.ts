import fs from "fs";

let code = fs.readFileSync("src/App.tsx", "utf-8");

const oldAddToCart = `  const addToCart = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
      setCart(cart.map(item => item.name === product.name ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };`;

const newAddToCart = `  const addToCart = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const colorToUse = product.color || product.colors?.[0]?.name;
    const sizeToUse = product.size || product.sizes?.[0];
    const colorObj = product.colors?.find((c: any) => c.name === colorToUse);
    const priceToUse = colorObj?.price || product.price;

    const existingId = cart.findIndex(item => item.name === product.name && item.color === colorToUse && item.size === sizeToUse);
    
    if (existingId >= 0) {
      const newCart = [...cart];
      newCart[existingId] = { ...newCart[existingId], qty: (newCart[existingId].qty || 1) + 1 };
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, color: colorToUse, size: sizeToUse, price: priceToUse, qty: 1 }]);
    }
    setIsCartOpen(true);
  };`;

code = code.replace(oldAddToCart, newAddToCart);
fs.writeFileSync("src/App.tsx", code);
console.log("Updated addToCart");
