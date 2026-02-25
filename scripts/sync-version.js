#!/usr/bin/env node
/**
 * sync-version.js
 * Reads version from package.json and writes it into the
 * WordPress plugin header in protogrid.php.
 */

import { readFileSync, writeFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const phpPath = '../wordpress-plugin/protogrid.php';

let php = readFileSync(phpPath, 'utf8');

// Replace "Version: x.y.z" in the plugin header comment
const updated = php.replace(
  /^(\s*\*?\s*Version:\s*).+$/m,
  `$1${pkg.version}`
);

// Replace define('PROTOGRID_VERSION', 'x.y.z')
const updated2 = updated.replace(
  /(define\s*\(\s*'PROTOGRID_VERSION'\s*,\s*').+?('\s*\))/,
  `$1${pkg.version}$2`
);

if (updated2 === php) {
  console.warn('⚠ No version markers found in', phpPath);
  process.exit(1);
}

writeFileSync(phpPath, updated2);
console.log(`✓ Synced plugin version to ${pkg.version}`);