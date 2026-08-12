const fs = require('fs');

let appStr = fs.readFileSync('src/App.jsx', 'utf8');
appStr = appStr.replace('O = async (J) => {\n      try {\n        (await TC(J), s((ue) => ue.filter((he) => he.id !== J)));', `O = async (J) => {
      try {
        s((ue) => ue.filter((he) => he.id !== J));
        await TC(J);`);
fs.writeFileSync('src/App.jsx', appStr);
