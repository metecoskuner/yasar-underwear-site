import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const LOCALE = path.join(SRC, 'locales', 'ru.json');

function readAllFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx']){
  const out = [];
  for(const name of fs.readdirSync(dir)){
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if(stat.isDirectory()) out.push(...readAllFiles(full, exts));
    else if(exts.includes(path.extname(name))) out.push(full);
  }
  return out;
}

function extractKeysFromFile(file){
  const src = fs.readFileSync(file,'utf8');
  const re = /(?:\btr|\bt)\(\s*['\"]([a-zA-Z0-9_.-]+)['\"]\s*(?:,|\))/g;
  const keys = new Set();
  let m;
  while((m = re.exec(src))){ keys.add(m[1]); }
  return Array.from(keys);
}

function hasKey(obj, key){
  const parts = key.split('.');
  let cur = obj;
  for(const p of parts){
    if(cur && typeof cur === 'object' && p in cur){ cur = cur[p]; }
    else return false;
  }
  return true;
}

async function main(){
  const files = readAllFiles(SRC);
  const allKeys = new Set();
  for(const f of files){
    extractKeysFromFile(f).forEach(k => allKeys.add(k));
  }

  let ru = {};
  try { ru = JSON.parse(fs.readFileSync(LOCALE,'utf8')); } catch (e){ console.error('Failed to load ru.json', e); process.exit(2); }

  const missing = [];
  const nonString = [];
  for(const k of Array.from(allKeys).sort()){
    if(!hasKey(ru,k)) missing.push(k);
    else {
      // check if it's a string
      const parts = k.split('.');
      let cur = ru;
      for(const p of parts) cur = cur[p];
      if(typeof cur !== 'string') nonString.push({ key: k, type: typeof cur });
    }
  }

  console.log('Scanned files:', files.length);
  console.log('Found translation keys:', allKeys.size);
  console.log('Missing keys in ru.json:', missing.length);
  missing.forEach(k => console.log('  MISSING:', k));
  console.log('Non-string keys in ru.json (t expects string):', nonString.length);
  nonString.forEach(n => console.log('  NONSTRING:', n.key, 'type=', n.type));
}

main().catch(e=>{ console.error(e); process.exit(1); });
