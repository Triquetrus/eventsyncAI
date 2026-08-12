const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace("import ffmpeg from 'fluent-ffmpeg';\nffmpeg.setFfmpegPath('/usr/bin/ffmpeg');", "import ffmpeg from 'fluent-ffmpeg';\nimport ffmpegStatic from 'ffmpeg-static';\nffmpeg.setFfmpegPath(ffmpegStatic);");
fs.writeFileSync('server.ts', code);
