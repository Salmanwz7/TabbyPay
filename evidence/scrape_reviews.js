/**
 * Tabby review scraper, with a country switch (spec §13.1).
 * Adapted from submission 1's scraper, which was hard-coded to Saudi + Arabic.
 *
 * Usage:  COUNTRY=ae LANGS=en,ar MONTHS=12 node scrape_reviews.js ae-reviews.csv
 *
 *   COUNTRY  store country code (App Store RSS + Google Play)     default sa
 *   LANGS    Google Play review languages, and the text filter     default ar
 *            ("ar" keeps Arabic-majority text, "en" keeps Latin-majority)
 *   MONTHS   drop reviews older than this                          default 6
 *
 * Output CSV: review_text, star_rating, date (YYYY-MM-DD), source, lang
 */
const fs = require('fs');
const gplay = require('google-play-scraper').default || require('google-play-scraper');

const APP_STORE_ID = '1528022364';
const PLAY_ID = 'app.tabby.client';
const COUNTRY = (process.env.COUNTRY || 'sa').toLowerCase();
const LANGS = (process.env.LANGS || 'ar').split(',').map(s => s.trim()).filter(Boolean);
const MONTHS = Number(process.env.MONTHS || 6);
const OUT = process.argv[2] || `${COUNTRY}-reviews.csv`;
const CC = COUNTRY.toUpperCase();

const cutoff = new Date();
cutoff.setMonth(cutoff.getMonth() - MONTHS);

// --- Language detection: which script dominates --------------------------
const AR = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/g;
const LA = /[A-Za-z]/g;
const langOf = t => {
  if (!t) return null;
  const a = (t.match(AR) || []).length;
  const l = (t.match(LA) || []).length;
  if (a >= 2 && a > l) return 'ar';
  if (l >= 2 && l >= a) return 'en';
  return null;
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

// --- Source 1: Apple RSS (50/page, 10 pages max, all languages) ----------
async function appStore() {
  const out = [];
  for (let page = 1; page <= 10; page++) {
    const url = `https://itunes.apple.com/${COUNTRY}/rss/customerreviews/page=${page}/id=${APP_STORE_ID}/sortby=mostrecent/json`;
    let entries;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) { console.error(`  [as] page ${page}: HTTP ${res.status}, stopping`); break; }
      const j = await res.json();
      entries = j.feed && j.feed.entry;
    } catch (e) { console.error(`  [as] page ${page}: ${e.message}, stopping`); break; }
    if (!entries || !entries.length) { console.error(`  [as] page ${page}: empty, stopping`); break; }

    let kept = 0;
    for (const e of entries) {
      if (!e['im:rating']) continue;               // skip app-metadata entry
      const title = (e.title && e.title.label) || '';
      const body = (e.content && e.content.label) || '';
      out.push({
        id: (e.id && e.id.label) || '',
        text: [title, body].filter(Boolean).join(' — ').trim(),
        rating: Number(e['im:rating'].label),
        date: new Date(e.updated.label).toISOString(),
        source: `App Store (${CC})`,
      });
      kept++;
    }
    console.error(`  [as] page ${page}: ${kept} reviews`);
    await sleep(400);
  }
  return out;
}

// --- Source 2: Google Play, one pass per language -------------------------
async function googlePlay(lang, target = Number(process.env.GP_TARGET || 3000)) {
  const out = [];
  let token, round = 0;
  while (out.length < target && round < 40) {
    let res;
    try {
      res = await gplay.reviews({
        appId: PLAY_ID, country: COUNTRY, lang,
        sort: gplay.sort.NEWEST, num: Math.min(target, 500),
        ...(token ? { nextPaginationToken: token } : {}),
      });
    } catch (e) { console.error(`  [gp:${lang}] round ${round}: ${e.message}, stopping`); break; }
    const data = res.data || res;
    if (!data || !data.length) { console.error(`  [gp:${lang}] round ${round}: empty, stopping`); break; }
    let old = 0;
    for (const r of data) {
      const date = new Date(r.date);
      if (date < cutoff) old++;
      out.push({
        id: r.id, text: (r.text || '').trim(), rating: Number(r.score),
        date: date.toISOString(), source: `Google Play (${CC})`,
      });
    }
    console.error(`  [gp:${lang}] round ${round}: +${data.length} (total ${out.length})`);
    // NEWEST order: once a whole page is past the cutoff, later pages are too.
    if (old === data.length) { console.error(`  [gp:${lang}] past cutoff, stopping`); break; }
    token = res.nextPaginationToken;
    round++;
    if (!token) { console.error(`  [gp:${lang}] no further pages`); break; }
    await sleep(600);
  }
  return out;
}

// --- CSV (RFC4180; BOM so Excel on Windows renders Arabic) ---------------
const cell = v => {
  const s = String(v == null ? '' : v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

(async () => {
  console.error(`Country ${CC} · languages ${LANGS.join('+')} · cutoff ${cutoff.toISOString().slice(0, 10)} (last ${MONTHS} months)\n`);
  console.error('App Store:');
  const a = await appStore();
  const g = [];
  for (const lang of LANGS) {
    console.error(`\nGoogle Play (${lang}):`);
    g.push(...await googlePlay(lang));
  }

  const all = [...a, ...g];
  const seen = new Set();
  const rows = [];
  const stats = { total: all.length, dupe: 0, otherLang: 0, tooOld: 0, empty: 0 };

  for (const r of all) {
    if (r.id && seen.has(r.id)) { stats.dupe++; continue; }
    if (r.id) seen.add(r.id);
    if (!r.text) { stats.empty++; continue; }
    const lang = langOf(r.text);
    if (!LANGS.includes(lang)) { stats.otherLang++; continue; }
    if (new Date(r.date) < cutoff) { stats.tooOld++; continue; }
    rows.push({ ...r, lang });
  }
  rows.sort((x, y) => new Date(y.date) - new Date(x.date));

  const csv = ['review_text,star_rating,date,source,lang']
    .concat(rows.map(r => [cell(r.text), r.rating, r.date.slice(0, 10), cell(r.source), r.lang].join(',')))
    .join('\r\n');
  fs.writeFileSync(OUT, '﻿' + csv, 'utf8');

  const bySrc = {}, byLang = {};
  rows.forEach(r => { bySrc[r.source] = (bySrc[r.source] || 0) + 1; byLang[r.lang] = (byLang[r.lang] || 0) + 1; });

  console.error(`\n${'='.repeat(52)}`);
  console.error(`fetched ${stats.total} → kept ${rows.length}`);
  console.error(`  dropped: ${stats.otherLang} other language, ${stats.tooOld} older than cutoff, ${stats.dupe} duplicate, ${stats.empty} empty`);
  console.error(`  by source: ${JSON.stringify(bySrc)}`);
  console.error(`  by language: ${JSON.stringify(byLang)}`);
  if (rows.length) console.error(`  date range: ${rows[rows.length - 1].date.slice(0, 10)} .. ${rows[0].date.slice(0, 10)}`);
  console.error(`  written: ${OUT}`);
})();
