const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const EPAPER_FILE = path.join(__dirname, '..', 'src', 'routes', 'epaper.js');
const OUT = path.join(__dirname, 'epaper_scan_results.json');
const BASE = process.env.BASE_URL || 'http://localhost:5001';

function extractKeysFromAllObjects(text) {
  const re = /const\s+([a-zA-Z0-9_]+)\s*=\s*\{([\s\S]*?)\};/g;
  const keys = new Set();
  let m;
  while ((m = re.exec(text)) !== null) {
    const body = m[2];
    const lineRe = /([a-zA-Z0-9_]+)\s*:\s*/g;
    let lm;
    while ((lm = lineRe.exec(body)) !== null) keys.add(lm[1]);
  }
  return Array.from(keys);
}

async function main() {
  const text = fs.readFileSync(EPAPER_FILE, 'utf8');
  const keys = new Set(extractKeysFromAllObjects(text));

  const ids = Array.from(keys).sort();
  console.log(`Found ${ids.length} paper ids to scan.`);

  const results = [];
  for (const id of ids) {
    try {
      const url = `${BASE}/api/epaper/${id}`;
      const res = await fetch(url, { timeout: 20000 });
      if (!res.ok) {
        results.push({ id, ok: false, status: res.status });
        console.log(id, 'status', res.status);
        continue;
      }
      const json = await res.json();
      const imagesCount = (json.images || []).length;
      const articlesCount = (json.articles || []).length;
      const record = { id, ok: true, source: json.source || null, images: imagesCount, articles: articlesCount };
      console.log(id, json.source || 'no-source', 'images=', imagesCount, 'articles=', articlesCount);

      // If no images but there are article URLs, try to fetch article pages and extract og:image
      if (imagesCount === 0 && articlesCount > 0) {
        const foundImages = [];
        for (const a of (json.articles || []).slice(0, 5)) {
          const au = a.url || a.link || a.urlToImage || '';
          if (!au) continue;
          try {
            const r = await fetch(au, { timeout: 10000 });
            if (!r.ok) continue;
            const html = await r.text();
            const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
              || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
            if (og && og[1]) { foundImages.push(og[1]); continue; }
            const img = html.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (img && img[1]) foundImages.push(img[1]);
          } catch (err) { /* ignore per-article errors */ }
        }
        if (foundImages.length > 0) {
          record.foundFallbackImages = Array.from(new Set(foundImages)).slice(0, 6);
          record.foundFallbackCount = record.foundFallbackImages.length;
          console.log('  -> found', record.foundFallbackCount, 'fallback images from article pages');
        }
      }

      results.push(record);
    } catch (err) {
      results.push({ id, ok: false, error: String(err) });
      console.log(id, 'error', err.message || err);
    }
  }

  fs.writeFileSync(OUT, JSON.stringify({ scannedAt: new Date().toISOString(), base: BASE, results }, null, 2));
  console.log('Saved results to', OUT);
}

main().catch(err => { console.error(err); process.exit(1); });
