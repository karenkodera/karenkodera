const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const thesisUrl = 'https://karenkodera.com/thesis';

const knownThesisImages = [
  { url: 'https://framerusercontent.com/images/2TieXjM5ufkozZ2D7pZO9dXGvA.jpg', name: 'thesis-hero.jpg' },
];

function get(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return get(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    lib.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return download(res.headers.location, filepath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  const outDir = path.join(__dirname, '..', 'public', 'thesis');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  try {
    const html = await get(thesisUrl);
    const framerMatches = html.match(/https:\/\/framerusercontent\.com\/[^"'\s)]+/g);
    if (framerMatches) {
      const seen = new Set([knownThesisImages[0].url.split('?')[0]]);
      framerMatches.forEach((u) => {
        const clean = (u.split('"')[0].split("'")[0].split(')')[0] || '').trim();
        if (!clean) return;
        const base = clean.split('?')[0];
        if (base.match(/\.(jpg|jpeg|png|webp)$/i) && !seen.has(base)) {
          seen.add(base);
          const ext = (base.match(/\.(jpg|jpeg|png|webp)$/i) || [''])[0].toLowerCase() || '.jpg';
          knownThesisImages.push({ url: clean, name: `thesis-${knownThesisImages.length}${ext}` });
        }
      });
    }
  } catch (e) {
    console.warn('Could not fetch page for extra URLs:', e.message);
  }

  for (const { url, name } of knownThesisImages) {
    const filepath = path.join(outDir, name);
    try {
      await download(url, filepath);
      console.log('Saved:', name);
    } catch (e) {
      console.error('Failed', name, e.message);
    }
  }
}

main();
