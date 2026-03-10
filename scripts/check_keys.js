/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const locales = ['tr','en','fr','ar','ru'];
const master = JSON.parse(fs.readFileSync(path.join('src','locales','tr.json'),'utf8'));

function keys(obj,prefix=''){const out=[]; for(const k of Object.keys(obj)){const p=prefix?`${prefix}.${k}`:k; if(obj[k] && typeof obj[k]==='object' && !Array.isArray(obj[k])) out.push(...keys(obj[k],p)); else out.push(p)} return out}
for(const loc of locales){
	const data = JSON.parse(fs.readFileSync(path.join('src','locales',loc+'.json'),'utf8'));
	const missing = keys(master).filter(k=>!keys(data).includes(k));
	if(missing.length) console.log(`${loc} missing ${missing.length} keys`);
}

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const tr = JSON.parse(fs.readFileSync('src/locales/tr.json','utf8'));
const keys = `components.media.title
nav.contact
nav.corporate.description
nav.language
nav.production.description
pages.about.collab.cta
pages.about.contactPrompt
pages.about.headings.countries
pages.about.headings.global
pages.about.headings.milestones
pages.about.headings.mission
pages.about.headings.values
pages.about.headings.vision
pages.about.hero.desc
pages.about.hero.title
pages.about.intro.p1
pages.about.intro.p2
pages.about.intro.p3
pages.about.milestones.1992
pages.about.milestones.2005
pages.about.milestones.2017
pages.about.milestones.2023
pages.about.mission
pages.about.quick.labels.certificates
pages.about.quick.labels.foundation
pages.about.quick.labels.location
pages.about.quick.title
pages.about.stats.exports
pages.about.stats.facilities
pages.about.stats.production
pages.about.title
pages.about.values.design.body
pages.about.values.design.title
pages.about.values.facilities.body
pages.about.values.facilities.title
pages.about.values.human.body
pages.about.values.human.title
pages.about.values.responsibility.body
pages.about.values.responsibility.title
pages.about.vision
uretim.tesis.applications.items.0
uretim.tesis.applications.items.1
uretim.tesis.applications.items.2
uretim.tesis.applications.lead
uretim.tesis.applications.summary
uretim.tesis.applications.title
uretim.tesis.energy.body
uretim.tesis.energy.lead
uretim.tesis.energy.title
uretim.tesis.how.lead
uretim.tesis.how.title
uretim.tesis.infrastructure.items.0
uretim.tesis.infrastructure.items.1
uretim.tesis.infrastructure.items.2
uretim.tesis.infrastructure.title
uretim.tesis.lead
uretim.tesis.quality.bullets.0
uretim.tesis.quality.bullets.1
uretim.tesis.quality.lead
uretim.tesis.quality.title
uretim.tesis.tags.energy
uretim.tesis.tags.iso
uretim.tesis.tags.spc
uretim.tesis.title
uretim.tesis.training.body
uretim.tesis.training.heading
uretim.tesis.training.items.0
uretim.tesis.training.items.1
uretim.tesis.training.items.2
uretim.tesis.training.lead
uretim.tesis.training.title`.split('\n');
function has(obj,path){const parts=path.split('.');let cur=obj;for(const p of parts){if(cur && typeof cur==='object' && p in cur) cur=cur[p]; else return false;} return true}
const missing = keys.filter(k=>!has(tr,k));
console.log('missing in tr.json:\n'+(missing.length?missing.join('\n'):'(none)'));
