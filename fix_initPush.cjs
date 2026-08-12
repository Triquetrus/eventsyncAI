const fs = require('fs');
let mainStr = fs.readFileSync('src/main.tsx', 'utf8');

mainStr = mainStr.replace('__initPush?: () => Promise<void>;', '__initPush?: (token: string) => Promise<void>;');
mainStr = mainStr.replace('const initPush = async () => {', 'const initPush = async (token?: string) => {\n  if (!token) return;');
mainStr = mainStr.replace("headers: { 'Content-Type': 'application/json' },", "headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },");

fs.writeFileSync('src/main.tsx', mainStr);
