/**
 * Basit görsel indirici
 * Kullanım: node scripts/download_yasar_images.js
 * Açıklama: Aşağıdaki `pagesToCrawl` dizisine Yasar sayfa URL'lerini ekleyin.
 * Script sayfaları fetch ile çeker, <img> etiketlerinden src alır, aynı domainden (yasarunderwear.com) olanları public/imported/yasar/ içine kaydeder.
 * UYARI: Telif haklarına dikkat edin. Bu script yalnızca teknik kolaylık sağlar; içerik kullanım izinleri size aittir.
 */

import fs from 'fs';
import path from 'path';
import { URL } from 'url';

const outDir = path.join(process.cwd(), 'public', 'imported', 'yasar');
const pagesToCrawl = [
  'https://yasarunderwear.com/',
  'https://yasarunderwear.com/kadin-urunleri/',
  'https://yasarunderwear.com/erkek-urunleri/',
  'https://yasarunderwear.com/hakkimizda/',
];

async function ensureOut() {
  await fs.promises.mkdir(outDir, { recursive: true });
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'yasar-importer/1.0' } });
  if (!res.ok) throw new Error(`Fetch failed ${url} ${res.status}`);
  return await res.text();
}

function extractImgSrcs(html, baseUrl) {
  const imgs = [];
  const re = /<img[^>]+src=["']?([^"' >]+)["']?/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let src = m[1];
    try {
      const u = new URL(src, baseUrl).toString();
      imgs.push(u);
    } catch (e) {
      // skip invalid
    }
  }
  return imgs;
}

function filenameFromUrl(u) {
  try {
    const parsed = new URL(u);
    const base = path.basename(parsed.pathname) || 'image';
    return base.split('?')[0];
  } catch {
    return 'image';
  }
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'yasar-importer/1.0' } });
  if (!res.ok) throw new Error(`Failed to download ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  await fs.promises.writeFile(dest, Buffer.from(arrayBuffer));
}

async function main() {
  console.log('Ensure out dir', outDir);
  await ensureOut();

  const seen = new Set();
  for (const page of pagesToCrawl) {
    console.log('Fetching', page);
    try {
      const html = await fetchText(page);
      const imgs = extractImgSrcs(html, page);
      console.log(` Found ${imgs.length} images on ${page}`);
      for (const img of imgs) {
        // Only fetch images from yasarunderwear domain to avoid hotlinking other hosts
        try {
          const u = new URL(img);
          if (!u.hostname.includes('yasarunderwear')) continue;
          const name = filenameFromUrl(img);
          let dest = path.join(outDir, name);
          // avoid duplicates
          if (seen.has(dest)) continue;
          seen.add(dest);
          console.log('  Downloading', img, '->', dest);
          await download(img, dest);
        } catch (e) {
          console.warn('  Skipping', img, e.message);
        }
      }
    } catch (e) {
      console.error('Error fetching page', page, e.message);
    }
  }
  console.log('Done. Images saved to', outDir);
}

if (typeof fetch === 'undefined') {
  console.error('This script requires Node 18+ (global fetch).');
  process.exit(1);
}

main().catch(err => { console.error(err); process.exit(1); });
