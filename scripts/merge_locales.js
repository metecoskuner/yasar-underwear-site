/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
function isObject(v){return v && typeof v === 'object' && !Array.isArray(v);} 
function merge(template, target){
  if(isObject(template)){
    const out = {};
    const keys = new Set([...Object.keys(template), ...(isObject(target)?Object.keys(target):[])]);
    for(const k of keys){
      if(k in (target||{})){
        out[k] = merge(template[k], target[k]);
      } else {
        out[k] = template[k];
      }
    }
    return out;
  }
  // arrays or primitives: if target is undefined use template else keep target
  if(typeof target === 'undefined') return template;
  return target;
}

const base = path.join(process.cwd(), 'src', 'locales', 'tr.json');
const langs = ['en','fr','ru','ar'];
const tr = JSON.parse(fs.readFileSync(base,'utf8'));
for(const l of langs){
  const p = path.join(process.cwd(),'src','locales',`${l}.json`);
  let cur = {};
  try{ cur = JSON.parse(fs.readFileSync(p,'utf8')); }catch(e){ console.error('read error',p,e.message); }
  const merged = merge(tr, cur);
  const outPath = `/tmp/${l}.merged.json`;
  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2)+'\n','utf8');
  console.log('WROTE', outPath);
}
