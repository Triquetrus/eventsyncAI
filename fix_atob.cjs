const fs = require('fs');

let dbStr = fs.readFileSync('src/lib/db.js', 'utf8');
dbStr = dbStr.replace(/const mm = t.base64Data.match\(\/\^data:\(\[\^;\]\+\);base64,\(\.\*\)\$\/\);\s*if \(mm\) \{\s*const mime = mm\[1\], bin = atob\(mm\[2\]\);\s*const bytes = new Uint8Array\(bin.length\);\s*for \(let i = 0; i < bin.length; i\+\+\) bytes\[i\] = bin.charCodeAt\(i\);\s*const ext = mime.split\("\/"\)\[1\] \|\| "bin";/, `const mm = t.base64Data.match(/^data:([^;]+);base64,(.*)$/);
        if (mm) {
          const mime = mm[1];
          const res = await fetch(t.base64Data);
          const blob = await res.blob();
          const ext = mime.split("/")[1] || "bin";`);
dbStr = dbStr.replace(/new Blob\(\[bytes\], { type: mime }\)/, `blob`);
fs.writeFileSync('src/lib/db.js', dbStr);

let veoStr = fs.readFileSync('src/components/VeoMergeTool.jsx', 'utf8');
veoStr = veoStr.replace(/const binary = atob\(data.videoBase64\);\s*const bytes = new Uint8Array\(binary.length\);\s*for \(let i = 0; i < binary.length; i\+\+\) bytes\[i\] = binary.charCodeAt\(i\);\s*const blob = new Blob\(\[bytes\], \{\s*type: data.mimeType \|\| "video\/mp4",\s*\}\);/, `const res2 = await fetch("data:" + (data.mimeType || "video/mp4") + ";base64," + data.videoBase64);
      const blob = await res2.blob();`);
fs.writeFileSync('src/components/VeoMergeTool.jsx', veoStr);
