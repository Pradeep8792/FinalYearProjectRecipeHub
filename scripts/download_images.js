// download_images.js
// Node.js script to fetch a website, extract all image URLs, and download them.
// Usage: node download_images.js <baseUrl> <outputDir>

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const cheerio = require('cheerio');

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadImage(imgUrl, outputDir) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(imgUrl);
    const client = urlObj.protocol === 'https:' ? https : http;
    const filename = path.basename(urlObj.pathname);
    const filePath = path.join(outputDir, filename);
    client.get(imgUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to get ${imgUrl}: ${res.statusCode}`));
      }
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(filePath)));
    }).on('error', reject);
  });
}

async function main() {
  const [baseUrl, outputDir] = process.argv.slice(2);
  if (!baseUrl || !outputDir) {
    console.error('Usage: node download_images.js <baseUrl> <outputDir>');
    process.exit(1);
  }
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Fetching ${baseUrl}...`);
  const html = await fetchPage(baseUrl);
  const $ = cheerio.load(html);
  const imgUrls = [];
  $('img').each((_, el) => {
    let src = $(el).attr('src');
    if (!src) return;
    // Resolve relative URLs
    const fullUrl = new URL(src, baseUrl).href;
    imgUrls.push(fullUrl);
  });
  console.log(`Found ${imgUrls.length} images. Downloading to ${outputDir}...`);
  for (const imgUrl of imgUrls) {
    try {
      const savedPath = await downloadImage(imgUrl, outputDir);
      console.log(`Saved: ${savedPath}`);
    } catch (e) {
      console.error(`Error downloading ${imgUrl}: ${e.message}`);
    }
  }
  console.log('Done.');
}

main();
