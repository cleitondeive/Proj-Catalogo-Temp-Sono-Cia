const fs = require('fs');
let data = fs.readFileSync('src/initialData.ts', 'utf8');

data = data.replace(/category: "(.*?)",/g, (match, p1) => {
  let l = "2.10";
  let w = "0.90";
  let h = "1.00";
  let wt = "45";
  if (p1 === "Camas") {
    l = "2.00"; w = "1.60"; h = "1.20"; wt = "80";
  } else if (p1 === "Colchões") {
    l = "1.98"; w = "1.58"; h = "0.30"; wt = "25";
  } else if (p1 === "Mesas") {
    l = "2.20"; w = "1.10"; h = "0.75"; wt = "60";
  } else if (p1 === "Poltronas") {
    l = "0.90"; w = "0.85"; h = "1.05"; wt = "30";
  }

  return `${match}
    length: "${l}",
    width: "${w}",
    height: "${h}",
    weight: "${wt}",`;
});

fs.writeFileSync('src/initialData.ts', data);
