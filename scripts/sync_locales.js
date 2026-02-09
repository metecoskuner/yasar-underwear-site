const fs = require('fs');
const path = require('path');
const masterPath = path.join('src','locales','tr.json');
const locales = ['en','fr','ar','ru'].map(l=>path.join('src','locales', l + '.json'));

function deepSync(master, target, prefix=''){
  const added = [];
  for(const k of Object.keys(master)){
    const p = prefix ? `${prefix}.${k}` : k;
    if(!(k in target)){
      target[k] = master[k];
      added.push(p);
    } else {
      if(master[k] && typeof master[k] === 'object' && !Array.isArray(master[k]) && target[k] && typeof target[k] === 'object' && !Array.isArray(target[k])){
        const childAdded = deepSync(master[k], target[k], p);
        added.push(...childAdded);
      }
    }
  }
  return added;
}

const master = JSON.parse(fs.readFileSync(masterPath,'utf8'));
let totalAdded = {};
for(const locPath of locales){
  const data = JSON.parse(fs.readFileSync(locPath,'utf8'));
  const added = deepSync(master, data);
  if(added.length){
    fs.writeFileSync(locPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
  totalAdded[locPath] = added;
}
console.log('Sync complete. Added keys per locale:');
for(const [k,v] of Object.entries(totalAdded)){
  console.log(k + ': ' + (v.length? '\n  ' + v.join('\n  '): '(none)'));
}
