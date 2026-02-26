/**
 * Bundle files into a ZIP archive for download.
 * Uses local package of JSZip
 */

import JSZip from 'jszip';

export async function downloadAsZip(files, zipName = 'GridGenGizmo-Gerber.zip') {
  const zip = new JSZip();

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