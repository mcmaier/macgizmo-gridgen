/**
 * Bundle files into a ZIP archive for download.
 * Uses JSZip loaded from CDN to keep bundle small.
 */

let JSZip = null;

async function loadJSZip() {
  if (JSZip) return JSZip;

  // Dynamic import from CDN
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  await new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  JSZip = window.JSZip;
  return JSZip;
}

/**
 * Create a ZIP file from a map of filename -> content
 * @param {Record<string, string>} files
 * @param {string} zipName
 */
export async function downloadAsZip(files, zipName = 'PPP-Gerber.zip') {
  const Zip = await loadJSZip();
  const zip = new Zip();

  for (const [name, content] of Object.entries(files)) {
    zip.file(name, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  a.click();
  URL.revokeObjectURL(url);
}
