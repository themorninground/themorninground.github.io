import { chromium } from 'playwright';
import fs from 'fs';
const dir = 'brand/drafts';
const browser = await chromium.launch();
const only = fs.readdirSync(dir).filter(f => f.startsWith('p-') && f.endsWith('.html'));
const list = only.length ? only : fs.readdirSync(dir).filter(f => f.endsWith('.html'));
for (const f of list) {
  const wide = f.startsWith('p-');
  const page = await browser.newPage({ viewport: wide ? { width: 1920, height: 1080 } : { width: 1440, height: 900 }, deviceScaleFactor: wide ? 1.5 : 2 });
  await page.goto('file://' + process.cwd() + '/' + dir + '/' + f, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  const fonts = await page.evaluate(() => [...document.fonts].map(x => x.family + ' ' + x.weight + ' ' + x.status));
  const bad = fonts.filter(x => !x.endsWith('loaded') && !x.endsWith('unloaded'));
  console.log(f, 'loaded:', fonts.filter(x => x.endsWith(' loaded')).length, 'bad:', bad);
  if (bad.length) process.exitCode = 1;
  const el = await page.$('body > div');
  await el.screenshot({ path: dir + '/' + f.replace('.html', '.png') });
  await page.close();
}
await browser.close();
