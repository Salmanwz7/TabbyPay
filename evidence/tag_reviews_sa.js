/**
 * Multi-label coder for tabby-reviews.csv.
 * Usage: node tag_reviews.js [infile] [outfile]
 *
 * Prints the tag distribution + the 20 most substantive rejection/limit verbatims.
 * Writes tabby-reviews-tagged.csv carrying a matched_terms column, so every tag
 * is auditable back to the exact keyword that fired it.
 *
 * Method note: this is deterministic keyword coding, not a model. That is the
 * point -- it is reproducible and every decision is inspectable. It will carry
 * some false positives and misses; spot-check matched_terms before quoting a
 * number in public.
 */
const fs = require('fs');
const EOL = String.fromCharCode(10);
const IN = process.argv[2] || 'tabby-reviews.csv';
const OUT = process.argv[3] || 'tabby-reviews-tagged.csv';

// --- Arabic normalisation ---------------------------------------------------
// Without this, keyword matching silently under-counts: the same word appears
// with أ/إ/آ vs ا, ى vs ي, ة vs ه, and with or without diacritics.
const norm = s => (s || '')
  .replace(/[ً-ْٰـ]/g, '')      // diacritics + tatweel
  .replace(/[آأإٱ]/g, 'ا') // آ أ إ ٱ -> ا
  .replace(/ى/g, 'ي')                     // ى -> ي
  .replace(/ة/g, 'ه')                     // ة -> ه
  .replace(/ؤ/g, 'و')                     // ؤ -> و
  .replace(/ئ/g, 'ي')                     // ئ -> ي
  .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
  .replace(/\s+/g, ' ')
  .trim();

const any = (t, ws) => ws.filter(w => t.includes(w));
// Co-occurrence within one review. Median review length is ~19 chars, so
// same-review is a fair proxy for "these words are talking about each other".
const both = (t, a, b) => {
  const x = a.__tok ? tok(t, a) : any(t, a);
  const y = b.__tok ? tok(t, b) : any(t, b);
  return x.length && y.length ? [...x, ...y] : [];
};

// Arabic-letter boundary match. Plain substring matching is unsafe for the
// limit words: حدي sits inside تحديث ("update") and وحدي ("alone"), and الحد
// sits inside الحديث. Require a non-Arabic char (or string edge) before the
// token, allow one possessive suffix, and require a non-Arabic char after.
const A = '؀-ۿ';
const tok = (t, ws) => ws.filter(w =>
  new RegExp('(^|[^' + A + '])' + w + '(?:[يكه]|كم|ها)?(?![' + A + '])').test(t));

const LIMIT_N = ['الحد', 'حدي', 'حدك', 'السقف', 'سقف', 'الليمت', 'ليمت'];
LIMIT_N.__tok = true;  // use boundary matching, not substring
const LOW     = ['قليل', 'بسيط', 'ضعيف', 'صغير', 'منخفض', 'واطي', 'ناقص', 'محدود', 'زهيد'];
const RAISE   = ['زياده الحد', 'رفع الحد', 'زيدو', 'ارفعو', 'يزيد الحد', 'ترفع الحد'];
const CHANGED = ['نقص', 'انخفض', 'نزل', 'تغير', 'قلص', 'خفض', 'سحب', 'الغ', 'وقف', 'صفر', 'رجع'];
const PAY     = ['سداد', 'دفعه', 'دفعات', 'القسط', 'اقساط', 'خصم', 'استقطاع', 'تحصيل', 'مديوني'];
const LARGE_ITEMS = ['اثاث', 'ثلاجه', 'غساله', 'مكيف', 'لابتوب', 'ايفون',
                     'سياره', 'تذاكر', 'عرس', 'زواج', 'مجوهرات'];
LARGE_ITEMS.__tok = true;
const SHOP = ['متجر', 'متاجر', 'المتجر', 'المتاجر', 'محل', 'المحل'];
const UNAVAILABLE = ['غير مدعوم', 'غير متوفر', 'مو متوفر', 'ما يدعم', 'قليل', 'ما يقبل'];
const WHY = ['ليش', 'لماذا', 'وش السبب', 'ايش السبب', 'ما فهمت', 'غير مفهوم'];
const DECISION = ['رفض', 'مرفوض', 'الحد', 'حظر', 'محظور', 'ايقاف', 'موقوف', 'الطلب'];
const TROUBLE = ['مشكل', 'خطا', 'مرتين', 'غرامه', 'تاخير', 'تاخر', 'رغم', 'تكرار', 'بدون علم'];

const RULES = {
  'rejected/declined': t => any(t, [
    'رفض', 'مرفوض', 'يرفضون', 'الرفض', 'ترفض', 'رفضت', 'رفضو', 'لا يقبل طلب', 'ما تم قبول']),

  'limit too low': t => [...both(t, LIMIT_N, LOW), ...any(t, RAISE)],

  'limit changed unexpectedly': t => both(t, LIMIT_N, CHANGED),

  /* Contamination found on audit and removed:
       شاشه  matched 107 reviews -- almost all "الشاشة البيضاء", the white-screen
             bug in the Android app, not a TV purchase.
       جهاز / جوال  matched 32 -- "my device" / "my phone" in bug reports.
     What is left is unambiguous high-ticket vocabulary plus explicit
     large-amount phrases. ذهب is excluded too: as bare text it is equally
     the verb "went". The honest count is small; that is the point. */
  'wanted it for a large purchase': t =>
    [...any(t, ['مبلغ كبير', 'مبلغ عالي', 'طلب كبير', 'شراء كبير', 'مشتريات كبير']),
     ...tok(t, LARGE_ITEMS)],

  /* A bare "why" is any complaint at all. It only counts here when it is
     asked about a decision -- a refusal, a limit, a block. */
  'didnt understand why': t =>
    [...any(t, ['ما ادري السبب', 'بدون سبب', 'بلا سبب', 'ما اعرف السبب',
                'وش السبب', 'ايش السبب', 'بدون توضيح', 'بدون تفسير',
                'لا يوجد سبب', 'ما في سبب', 'ما يوضح']),
     ...both(t, WHY, DECISION)],

  /* 'ما يشتغل' ("does not work") matched 11 of 12 and meant the app, not a
     merchant. Generic unavailability now has to co-occur with a shop word. */
  'merchant not accepted': t =>
    [...any(t, ['المتجر غير', 'ما يقبل تابي', 'لا يقبلون تابي', 'ما يقبلون تابي']),
     ...both(t, SHOP, UNAVAILABLE)],

  'repayment problem': t => both(t, PAY, TROUBLE),

  'praise-convenience': t => any(t, [
    'سهل', 'سهوله', 'بساطه', 'سريع', 'سرعه', 'مريح', 'مرونه', 'مرن', 'سلس', 'يسر']),

  'praise-no fees': t => any(t, [
    'بدون فوائد', 'بلا فوائد', 'بدون رسوم', 'بلا رسوم', 'بدون فائده', 'لا فوائد',
    'ما في فوائد', 'بدون زياده', 'دون رسوم', 'بدون اي رسوم', 'بدون فايده']),
};

// Display labels (the CSV/console name for each rule key)
const LABEL = { 'didnt understand why': 'didn’t understand why' };
const show = c => LABEL[c] || c;

// --- CSV reader (RFC4180) ---------------------------------------------------
function parseCSV(txt) {
  txt = txt.replace(/^﻿/, '');
  const rows = [];
  let row = [], cur = '', q = false;
  for (let i = 0; i < txt.length; i++) {
    const c = txt[i];
    if (q) {
      if (c === '"' && txt[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift();
  return rows.filter(r => r.length === head.length)
             .map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

const cell = v => {
  const s = String(v == null ? '' : v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

// --- run --------------------------------------------------------------------
const reviews = parseCSV(fs.readFileSync(IN, 'utf8'));
const CATS = Object.keys(RULES);
const counts = Object.fromEntries(CATS.map(show).concat('other').map(c => [c, 0]));
const tagged = [];

for (const r of reviews) {
  const t = norm(r.review_text);
  const tags = [], terms = [];
  for (const c of CATS) {
    const hits = RULES[c](t);
    if (hits.length) {
      tags.push(show(c));
      terms.push(...hits.map(h => show(c) + ':' + h.trim()));
    }
  }
  if (!tags.length) tags.push('other');
  tags.forEach(c => counts[c]++);
  tagged.push({ ...r, tags, terms });
}

const N = reviews.length;
const applied = tagged.reduce((a, r) => a + (r.tags[0] === 'other' ? 0 : r.tags.length), 0);
const maxN = Math.max(...Object.values(counts));
const pct = n => (100 * n / N).toFixed(1).padStart(5) + '%';
const bar = n => '#'.repeat(Math.round(36 * n / maxN));

console.log('\nTagged ' + N + ' reviews - multi-label, ' + applied + ' tags applied\n');
console.log('CATEGORY                          COUNT   SHARE');
console.log('-'.repeat(74));
for (const [c, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(c.padEnd(32) + String(n).padStart(4) + '  ' + pct(n) + '  ' + bar(n));
}
const multi = tagged.filter(r => r.tags.length > 1 && r.tags[0] !== 'other').length;
console.log('-'.repeat(74));
console.log('reviews carrying >1 tag: ' + multi + ' (' + (100 * multi / N).toFixed(1) + '%)');

// --- same distribution among 1-2 star reviews -------------------------------
// The headline table is dominated by short generic praise, so it understates
// every complaint category. This is the complaint population on its own.
const neg = tagged.filter(r => Number(r.star_rating) <= 2);
const negC = {};
neg.forEach(r => r.tags.forEach(c => negC[c] = (negC[c] || 0) + 1));
console.log(EOL + 'Same categories among the ' + neg.length + ' reviews rated 1-2 stars:');
console.log('-'.repeat(74));
for (const [c, n] of Object.entries(negC).sort((a, b) => b[1] - a[1])) {
  console.log(c.padEnd(32) + String(n).padStart(4) + '  ' +
              (100 * n / neg.length).toFixed(1).padStart(5) + '%  ' +
              '#'.repeat(Math.round(36 * n / Math.max(...Object.values(negC)))));
}

// --- the rejection/limit cluster --------------------------------------------
const CLUSTER = ['rejected/declined', 'limit too low', 'limit changed unexpectedly'];
const cluster = tagged.filter(r => r.tags.some(t => CLUSTER.includes(t)));
const stars = {};
cluster.forEach(r => stars[r.star_rating] = (stars[r.star_rating] || 0) + 1);
const avgAll = (reviews.reduce((a, r) => a + Number(r.star_rating), 0) / N).toFixed(2);
const avgCl = (cluster.reduce((a, r) => a + Number(r.star_rating), 0) / cluster.length).toFixed(2);
console.log('\nrejection/limit cluster: ' + cluster.length + ' reviews (' + (100 * cluster.length / N).toFixed(1) + '%)');
console.log('  mean stars - cluster ' + avgCl + ' vs corpus ' + avgAll);
console.log('  star spread: ' + JSON.stringify(stars));

// --- 20 most substantive rejection/limit verbatims --------------------------
const top = cluster
  .map(r => ({ ...r, score: r.review_text.length + 40 * (r.tags.length - 1) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 20);

let md = '# 20 most substantive rejection / limit reviews\n\n';
md += 'Selected from ' + cluster.length + ' reviews tagged rejected/declined, limit too low, ';
md += 'or limit changed unexpectedly. Ranked by length plus a bonus per additional tag.\n';
md += 'Source corpus: ' + N + ' Arabic reviews, Saudi App Store + Google Play.\n\n';

console.log('\n' + '='.repeat(74));
console.log('20 MOST SUBSTANTIVE REJECTION / LIMIT VERBATIMS');
console.log('='.repeat(74));
top.forEach((r, i) => {
  console.log('\n' + (i + 1) + '. ' + r.star_rating + '* | ' + r.date + ' | ' + r.source);
  console.log('   tags: ' + r.tags.join(', '));
  console.log('   ' + r.review_text.replace(/\n+/g, '\n   '));
  md += '### ' + (i + 1) + '. ' + r.star_rating + ' stars - ' + r.date + ' - ' + r.source + '\n\n';
  md += '**Tags:** ' + r.tags.join(', ') + '\n\n';
  md += '> ' + r.review_text.replace(/\n+/g, '\n> ') + '\n\n';
});
fs.writeFileSync('tabby-verbatims.md', md, 'utf8');

const csv = ['review_text,star_rating,date,source,tags,matched_terms']
  .concat(tagged.map(r => [
    cell(r.review_text), r.star_rating, r.date, cell(r.source),
    cell(r.tags.join('|')), cell(r.terms.join('|')),
  ].join(',')))
  .join('\r\n');
fs.writeFileSync(OUT, '﻿' + csv, 'utf8');
console.log('\n\nwritten: ' + OUT + ', tabby-verbatims.md');
