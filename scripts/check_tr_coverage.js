const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');
const localesDir = path.join(src, 'locales');
const trPath = path.join(localesDir, 'tr.json');

function walk(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const name of list) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (p === localesDir) continue; // skip locales inside src
      walk(p, files);
    } else {
      if (/\.(js|ts|jsx|tsx|json|md|tsx?)$/i.test(p)) files.push(p);
    }
  }
  return files;
}

const files = walk(src);
let tr = '{}';
let trObj = {};
try {
  tr = fs.readFileSync(trPath, 'utf8');
  trObj = JSON.parse(tr);
} catch (e) { console.error('Failed to read/parse tr.json', e.message); process.exit(2); }

// flatten tr.json values into a single searchable string (unescaped)
function flattenValues(obj) {
  const out = [];
  function walk(v) {
    if (v == null) return;
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (typeof v === 'object') Object.values(v).forEach(walk);
  }
  walk(obj);
  return out.join('\n');
}

const trFlat = flattenValues(trObj);
// regex to find quoted strings that include Turkish chars
const re = /(["'`])((?:\\.|(?!\1).)*?[çğıöşüÇĞİÖŞÜ](?:\\.|(?!\1).)*?)\1/gm;

const occurrences = [];
for (const f of files) {
  let s = '';
  try { s = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
  const lines = s.split(/\r?\n/);
  let m;
  while ((m = re.exec(s)) !== null) {
    const literal = m[2];
    // find line number by counting newlines up to match.index
    const prefix = s.slice(0, m.index);
    const lineNo = prefix.split(/\r?\n/).length;
    occurrences.push({ file: f.replace(root + path.sep, ''), line: lineNo, text: literal });
    if (re.lastIndex > 1e7) break; // safety
  }
}

// dedupe by text
const map = new Map();
for (const o of occurrences) {
  const key = o.text;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push({ file: o.file, line: o.line });
}

const results = [];
const normalTr = trFlat.replace(/\s+/g, ' ');
for (const [text, places] of map.entries()) {
  const normalText = text.replace(/\s+/g, ' ');
  const exists = trFlat.indexOf(text) !== -1 || normalTr.indexOf(normalText) !== -1;
  if (!exists) results.push({ text, places });
}

console.log(`scanned files: ${files.length}`);
console.log(`unique Turkish-literal strings found: ${map.size}`);
console.log(`missing in tr.json: ${results.length}`);
if (results.length > 0) {
  for (const r of results) {
    console.log('---');
    console.log('literal:', r.text);
    for (const p of r.places) console.log(`  at ${p.file}:${p.line}`);
  }
}

// exit code 0 even if missing, because user asked for the report
process.exit(0);
