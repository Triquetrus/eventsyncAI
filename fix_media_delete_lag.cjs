const fs = require('fs');
let appStr = fs.readFileSync('src/App.jsx', 'utf8');
appStr = appStr.replace('M = async (J) => {\n      try {\n        (await NC(J), u((ue) => ue.filter((he) => he.id !== J)));', `M = async (J) => {
      try {
        u((ue) => ue.filter((he) => he.id !== J));
        await NC(J);`);
fs.writeFileSync('src/App.jsx', appStr);
