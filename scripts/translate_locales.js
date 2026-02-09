#!/usr/bin/env node
/*
Translate locale JSON files using an external translation API.

Supported providers (auto-selected):
 - DeepL (recommended): set DEEPL_API_KEY
 - LibreTranslate (self-hosted or public): set LIBRE_TRANSLATE_URL (and optionally LIBRE_TRANSLATE_KEY)

Behavior:
 - Reads `src/locales/tr.json` as source-of-truth (Turkish).
 - For each target locale (en, fr, ru, ar) it finds string-valued keys in the Turkish tree.
 - If the target locale is missing a key or the value is identical to the Turkish placeholder, the script requests a translation and replaces it.
 - Preserves existing translations when present and different from Turkish.
 - Writes updated locale files to `src/locales/<lang>.json` (overwrites after a dry-run unless --apply is passed).

Usage:
  # Dry-run -> will write result JSON into /tmp and print stats
  DEEPL_API_KEY=xxxx node scripts/translate_locales.js --dry

  # Apply changes in-place
  DEEPL_API_KEY=xxxx node scripts/translate_locales.js --apply

  # Use LibreTranslate (example public instance or your own)
  LIBRE_TRANSLATE_URL=https://libretranslate.com LIBRE_TRANSLATE_KEY=xxxx node scripts/translate_locales.js --apply

Notes:
 - This script sends untranslated strings to the provider; ensure you comply with your org's policy on sending content to external APIs.
 - Review the output before committing.
*/

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const SOURCE = path.join(process.cwd(), 'src', 'locales', 'tr.json');
const TARGET_LANGS = ['en','fr','ru','ar'];
const TARGET_DEEPL = { en: 'EN', fr: 'FR', ru: 'RU', ar: 'AR' };

function readJson(p){ return JSON.parse(fs.readFileSync(p,'utf8')); }
function writeJson(p,j){ fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n','utf8'); }

function flatten(obj, prefix=''){
  const out = {};
  if (obj === null || obj === undefined) return out;
  if (typeof obj === 'string') { out[prefix] = obj; return out; }
  if (Array.isArray(obj)){
    obj.forEach((v,i)=>{
      const key = prefix ? `${prefix}[${i}]` : `[${i}]`;
      if (typeof v === 'string') out[key] = v;
      else Object.assign(out, flatten(v, key));
    });
    return out;
  }
  if (typeof obj === 'object'){
    for(const k of Object.keys(obj)){
      const key = prefix ? `${prefix}.${k}` : k;
      const v = obj[k];
      if (typeof v === 'string') out[key] = v;
      else Object.assign(out, flatten(v, key));
    }
    return out;
  }
  return out;
}

function setByPath(obj, pathKey, value){
  // pathKey like 'a.b.c' or 'arr[0].x'
  const parts = [];
  let cur = '';
  for(let i=0;i<pathKey.length;i++){
    const ch = pathKey[i];
    if (ch === '.') { if (cur) { parts.push(cur); cur=''; } }
    else if (ch === '[') { if (cur) { parts.push(cur); cur=''; } let end = pathKey.indexOf(']', i); const idx = pathKey.slice(i+1,end); parts.push(Number(idx)); i = end; }
    else cur += ch;
  }
  if (cur) parts.push(cur);
  let node = obj;
  for(let i=0;i<parts.length-1;i++){
    const p = parts[i];
    if (typeof p === 'number') {
      node[p] = node[p] || {};
      node = node[p];
    } else {
      node[p] = node[p] || {};
      node = node[p];
    }
  }
  const last = parts[parts.length-1];
  node[last] = value;
}

async function translateDeepL(texts, target){
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) throw new Error('DEEPL_API_KEY not set');
  const form = new URLSearchParams();
  for(const t of texts) form.append('text', t);
  form.append('target_lang', target);
  const url = 'https://api-free.deepl.com/v2/translate';
  return new Promise((resolve,reject)=>{
    const req = https.request(url, { method: 'POST', headers: { 'Authorization': `DeepL-Auth-Key ${apiKey}`, 'Content-Type': 'application/x-www-form-urlencoded' } }, (res)=>{
      let body=''; res.on('data',c=>body+=c); res.on('end',()=>{
        try { const j = JSON.parse(body); const out = j.translations.map(x=>x.text); resolve(out); } catch(e){ reject(new Error('DeepL response parse error: '+e.message+' body:'+body)); }
      });
    });
    req.on('error', reject);
    req.write(form.toString()); req.end();
  });
}

async function translateLibre(texts, target){
  const base = process.env.LIBRE_TRANSLATE_URL || 'https://libretranslate.com';
  const key = process.env.LIBRE_TRANSLATE_KEY || '';
  const results = [];
  for(const t of texts){
    const body = JSON.stringify({ q: t, source: 'tr', target: target.toLowerCase(), format: 'text', api_key: key });
    const url = new URL('/translate', base);
    const libreq = url.protocol === 'https:' ? https.request : http.request;
     
    const r = await new Promise((resolve,reject)=>{
      const req = libreq(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (res)=>{
        let b=''; res.on('data',c=>b+=c); res.on('end',()=>{ try{ const j=JSON.parse(b); resolve(j.translatedText || j.translations?.[0]?.text || ''); }catch(e){ reject(new Error('Libre parse error '+e.message+' body:'+b)); } });
      });
      req.on('error', reject); req.write(body); req.end();
    });
    results.push(r);
  }
  return results;
}

async function main(){
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const dry = args.includes('--dry');
  if (!apply && !dry) { console.log('Use --dry for dry-run or --apply to write changes.'); }

  const tr = readJson(SOURCE);
  const trFlat = flatten(tr);

  for(const lang of TARGET_LANGS){
  const p = path.join(process.cwd(),'src','locales',`${lang}.json`);
  let cur = {};
  try { cur = readJson(p); } catch(err) { void err; console.warn('Could not read',p,'creating new'); cur = {}; }
    const curFlat = flatten(cur);

    // build list of keys needing translation
    const keysToTranslate = [];
    const texts = [];
    for(const [k,txt] of Object.entries(trFlat)){
      const existing = curFlat[k];
      if (typeof existing === 'undefined' || existing === txt){
        keysToTranslate.push(k);
        texts.push(txt);
      }
    }

    console.log(`lang=${lang} total_keys=${Object.keys(trFlat).length} need=${keysToTranslate.length}`);
    if (keysToTranslate.length === 0){ console.log('nothing to do for',lang); continue; }

    // translate in batches to avoid very large requests (DeepL supports multiple texts)
    const batchSize = 25;
    const translated = [];
    for(let i=0;i<texts.length;i+=batchSize){
      const batch = texts.slice(i,i+batchSize);
      console.log(`translating batch ${i}-${i+batch.length-1} (${batch.length}) for ${lang}`);
      let out = [];
      try{
        if (process.env.DEEPL_API_KEY){
          const targetCode = TARGET_DEEPL[lang] || 'EN';
          out = await translateDeepL(batch, targetCode);
        } else if (process.env.LIBRE_TRANSLATE_URL){
          out = await translateLibre(batch, lang);
        } else {
          throw new Error('No translation provider configured. Set DEEPL_API_KEY or LIBRE_TRANSLATE_URL');
        }
      } catch(e){ console.error('Translation error',e.message); process.exit(1); }
      translated.push(...out);
    }

    // create a copy of cur and set translated values by path
    const outObj = JSON.parse(JSON.stringify(cur));
    for(let i=0;i<keysToTranslate.length;i++){
      setByPath(outObj, keysToTranslate[i], translated[i]);
    }

    if (dry){
      const outPath = path.join('/tmp', `${lang}.translated.json`);
      writeJson(outPath, outObj);
      console.log('Dry-run wrote',outPath);
    }
    if (apply){
      writeJson(p, outObj);
      console.log('Applied translations to',p);
    }
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });
