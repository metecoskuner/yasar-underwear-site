const fs = require('fs');
const path = require('path');
const locales = ['en','fr','ru','ar','tr'];
function typeOf(x){ if (x === undefined) return 'missing'; if (Array.isArray(x)) return 'array'; return typeof x; }
function arrType(x){ if (x === undefined) return 'missing'; if (!Array.isArray(x)) return typeof x; if (x.length===0) return 'array(empty)'; const el=x[0]; if (typeof el === 'string') return 'array<string>'; if (typeof el === 'object') return 'array<object>'; return 'array<other>'; }
function checkLocale(l){ const p = path.resolve(__dirname,'..','src','locales', l + '.json'); let raw; try{ raw = fs.readFileSync(p,'utf8'); }catch(e){ return {locale:l, error:'file-not-found'}; } let j; try{ j = JSON.parse(raw); }catch(e){ return {locale:l, error:'json-parse-error'}; }
 const root = j.sustainability;
 const pages = j.pages && j.pages.sustainability;
 const out = { locale: l };
 out.root = typeOf(root);
 out.pages = typeOf(pages);
 out.pillars_root = arrType(root && root.pillars);
 out.cards_root = arrType(root && root.cards);
 out.how_root = (root && root.how && Array.isArray(root.how.bullets)) ? 'array' : 'missing-or-not-array';
 out.pillars_pages = arrType(pages && pages.pillars);
 out.cards_pages = arrType(pages && pages.cards);
 out.how_pages = (pages && pages.how && Array.isArray(pages.how.bullets)) ? 'array' : 'missing-or-not-array';
 return out;
}
const results = locales.map(checkLocale);
console.log(JSON.stringify(results,null,2));
// exit code 0
