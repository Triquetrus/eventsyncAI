const fs = require('fs');
let mainStr = fs.readFileSync('src/main.tsx', 'utf8');

mainStr = mainStr.replace("import './index.css';", "import './index.css';\nimport { supabase } from './lib/db';");
mainStr = mainStr.replace("const initPush = async (token?: string) => {", "const initPush = async () => {\n  const { data } = await supabase.auth.getSession();\n  const token = data?.session?.access_token;\n  if (!token) return;");
mainStr = mainStr.replace("if (!token) return;", "");

fs.writeFileSync('src/main.tsx', mainStr);
