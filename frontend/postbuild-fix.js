const fs = require('fs');
const p = 'dist/frontend/browser/index.html';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/ rel="stylesheet" href="styles-[^"]+\.css" media="print" onload="this\.media='all'"/g, ' rel="stylesheet"');
fs.writeFileSync(p, c);
fs.copyFileSync(p, 'dist/frontend/browser/404.html');
