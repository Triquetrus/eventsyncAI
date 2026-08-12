const fs = require('fs');

let capStr = fs.readFileSync('src/components/CaptionStudioTab.jsx', 'utf8');
capStr = capStr.replace('  const he = r.find((Ie) => Ie.id === c);', `  React.useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.stream) {
        mediaRecorder.stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [mediaRecorder]);
  const he = r.find((Ie) => Ie.id === c);`);
fs.writeFileSync('src/components/CaptionStudioTab.jsx', capStr);

let galStr = fs.readFileSync('src/components/MediaGalleryTab.jsx', 'utf8');
galStr = galStr.replace('      } catch (e) {\n        console.warn(e.message || e);\n      }', `      } catch (e) {
        console.warn(e.message || e);
        alert("Camera failed to start. Please grant camera and microphone permissions, or open in a new tab.");
        E(!1);
      }`);
fs.writeFileSync('src/components/MediaGalleryTab.jsx', galStr);
