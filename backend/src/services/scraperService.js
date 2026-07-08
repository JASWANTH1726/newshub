const puppeteer = require('puppeteer-core');

// Find Chrome executable — local Windows paths + Render/Lambda
function getChromePath() {
  if (process.env.CHROME_EXECUTABLE_PATH) return process.env.CHROME_EXECUTABLE_PATH;
  if (process.platform === 'win32') {
    const paths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    ];
    const fs = require('fs');
    for (const p of paths) {
      try { if (fs.existsSync(p)) return p; } catch { /* skip */ }
    }
  }
  // Linux (Render)
  return '/usr/bin/google-chrome-stable';
}

let _browser = null;

async function getBrowser() {
  if (_browser && _browser.isConnected()) return _browser;
  const executablePath = getChromePath();
  _browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  return _browser;
}

async function scrapeGoogleNews(query, maxResults = 10) {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', req => {
      ['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())
        ? req.abort() : req.continue();
    });

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
    );

    const encoded = encodeURIComponent(query);
    await page.goto(
      `https://news.google.com/search?q=${encoded}&hl=en-IN&gl=IN&ceid=IN:en`,
      { waitUntil: 'domcontentloaded', timeout: 15000 }
    );

    const articles = await page.evaluate((max) => {
      const results = [];
      const items = document.querySelectorAll('article');
      for (let i = 0; i < Math.min(items.length, max); i++) {
        const el = items[i];
        const titleEl = el.querySelector('h3, h4');
        const linkEl = el.querySelector('a[href]');
        const timeEl = el.querySelector('time');
        const sourceEl = el.querySelector('[data-n-tid]') || el.querySelector('cite');
        const title = titleEl?.innerText?.trim() || '';
        const relUrl = linkEl?.getAttribute('href') || '';
        const url = relUrl.startsWith('.')
          ? 'https://news.google.com/' + relUrl.replace(/^\.\//, '')
          : relUrl;
        if (title && url) results.push({
          title, url,
          publishedAt: timeEl?.getAttribute('datetime') || '',
          source: { name: sourceEl?.innerText?.trim() || 'Google News' },
          description: '', urlToImage: null,
        });
      }
      return results;
    }, maxResults);

    await page.close();
    return articles;
  } catch (err) {
    console.error('[Scraper] Error:', err.message);
    return [];
  }
}

async function scrapeNewspaperHomepage(url, sourceName, maxResults = 10) {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', req => {
      ['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())
        ? req.abort() : req.continue();
    });

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    const articles = await page.evaluate((max, name) => {
      const results = [];
      const seen = new Set();
      const links = Array.from(document.querySelectorAll('a[href]')).filter(a => {
        const text = a.innerText?.trim();
        return text && text.length > 30 && text.length < 200;
      });
      for (const a of links) {
        if (results.length >= max) break;
        const title = a.innerText.trim();
        if (!seen.has(title) && a.href.startsWith('http')) {
          seen.add(title);
          results.push({ title, url: a.href, description: '', urlToImage: null, publishedAt: '', source: { name } });
        }
      }
      return results;
    }, maxResults, sourceName);

    await page.close();
    return articles;
  } catch (err) {
    console.error('[Scraper] Homepage error:', err.message);
    return [];
  }
}

process.on('exit', async () => { try { if (_browser) await _browser.close(); } catch { /* ignore */ } });

module.exports = { scrapeGoogleNews, scrapeNewspaperHomepage };
