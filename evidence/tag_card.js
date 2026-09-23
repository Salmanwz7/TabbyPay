/**
 * Card-theme coder for spec §13.1. Two modes:
 *
 *   node tag_card.js sa sa-reviews.csv   Run B: Saudi reviews asking for a card
 *   node tag_card.js ae ae-reviews.csv   Run A: UAE card / split confusion
 *
 * Deterministic keyword coding, reused from submission 1's tagger (same Arabic
 * normalisation, same boundary matching, same CSV reader) so every count is
 * reproducible and every hit is auditable via matched_terms.
 *
 * It prints EVERY hit. Keyword hits are candidates, not findings: in Saudi
 * reviews "بطاقة" mostly means the customer's own bank card (linking it,
 * a declined payment), not a request for a Tabby card. Only hand-audited
 * counts go into EVIDENCE.md.
 */
const fs = require('fs');
const [MODE, IN] = process.argv.slice(2);
if (!['sa', 'ae'].includes(MODE) || !IN) {
  console.error('usage: node tag_card.js <sa|ae> <file.csv>');
  process.exit(1);
}
const OUT = IN.replace(/\.csv$/, '-card-tagged.csv');

// --- Arabic normalisation (verbatim from submission 1) -------------------
const norm = s => (s || '')
  .replace(/[ً-ْٰـ]/g, '')
  .replace(/[آأإٱ]/g, 'ا')
  .replace(/ى/g, 'ي')
  .replace(/ة/g, 'ه')
  .replace(/ؤ/g, 'و')
  .replace(/ئ/g, 'ي')
  .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

const any = (t, ws) => ws.filter(w => t.includes(w));
const re = (t, rs) => rs.filter(r => r.test(t)).map(r => r.source);

// --- Vocabulary ------------------------------------------------------------
const CARD_AR = ['بطاقه تابي', 'بطاقة تابي', 'كرت تابي', 'كارت تابي', 'بطاقه', 'كارت', 'كرت', 'فيزا'];
const IN_STORE_AR = ['في المحل', 'بالمحل', 'في المحلات', 'بالمحلات', 'المحلات', 'الكاشير', 'نقاط البيع', 'الشبكه'];
const WALLET_AR = ['ابل باي', 'آبل باي', 'apple pay', 'applepay', 'مدى باي'];
// Asking / wishing for something: the demand signal.
const WANT_AR = ['ياليت', 'يا ليت', 'اتمنى', 'نتمنى', 'اقترح', 'نقترح', 'نبي', 'نبغى', 'ابغى', 'ابي',
                 'متى ', 'وفرو', 'توفير', 'تنزلون', 'تطلقون', 'تضيفون', 'اضافه', 'يا ريت', 'ياريت', 'لو في', 'لو يكون'];

const RULES_SA = {
  'mentions a card': t => any(t, CARD_AR),
  'mentions paying in store': t => any(t, IN_STORE_AR),
  'mentions Apple Pay / wallet': t => any(t, WALLET_AR),
  // Candidate demand: card/in-store/wallet word AND a wish word in one review.
  'candidate: asks for card or in-store': t => {
    const x = [...any(t, CARD_AR), ...any(t, IN_STORE_AR), ...any(t, WALLET_AR)];
    const y = any(t, WANT_AR);
    return x.length && y.length ? [...x, ...y] : [];
  },
};

const CARD_EN = [/\btabby card\b/, /\bvirtual card\b/, /\bphysical card\b/, /\bthe card\b/, /\bcard purchases?\b/, /\bcard transactions?\b/, /\bcard\b/];
const SPLIT_EN = [/\bsplit/, /\binstal+ments?\b/, /\bpay in 4\b/, /\bpay in four\b/, /\bpay in 3\b/];
const SPLIT_AR = ['تقسيط', 'تقسيم', 'اقساط', 'قسط', 'دفعات', '4 دفعات', 'اربع دفعات'];
const MANUAL_EN = [/\bmanual(ly)?\b/, /\bautomatic(ally)?\b/, /\bauto[- ]?split/, /\bby myself\b/, /\bone by one\b/];
const MANUAL_AR = ['يدوي', 'تلقائي', 'اوتوماتيك', 'بنفسي'];
const STATEMENT_EN = [/\bstatement\b/];
const STATEMENT_AR = ['كشف الحساب', 'كشف حساب', 'الكشف'];
const PLUS_EN = [/\btabby plus\b/, /\bplus subscription\b/, /\bplus\b/];
const PLUS_AR = ['تابي بلس', 'بلس', 'اشتراك'];
const CONFUSED_EN = [/confus/, /\bdidn'?t know\b/, /\bdid not know\b/, /\bno idea\b/, /\bunclear\b/, /\bwhy (wasn'?t|was not|isn'?t|is not|can'?t|cannot)\b/, /\bnot (split|converted)\b/, /\bno longer\b/, /\bused to\b/, /\bsuddenly\b/, /\bwithout (notice|informing|telling)\b/];
const CONFUSED_AR = ['مو واضح', 'غير واضح', 'ما عرفت', 'ما اعرف', 'محتار', 'لخبط', 'فجاه', 'بدون اشعار', 'بدون علم', 'كان يقسم', 'ما يقسم', 'ما تقسم', 'ليش ما'];

const cardHits = t => [...re(t, CARD_EN), ...any(t, CARD_AR)];
const withCard = (t, hits) => {
  const c = cardHits(t);
  return c.length && hits.length ? [...c, ...hits] : [];
};

const RULES_AE = {
  'mentions a card': t => cardHits(t),
  'card + split': t => withCard(t, [...re(t, SPLIT_EN), ...any(t, SPLIT_AR)]),
  'card + manual/automatic': t => withCard(t, [...re(t, MANUAL_EN), ...any(t, MANUAL_AR)]),
  'card + statement': t => withCard(t, [...re(t, STATEMENT_EN), ...any(t, STATEMENT_AR)]),
  'card + Plus': t => withCard(t, [...re(t, PLUS_EN), ...any(t, PLUS_AR)]),
  'card + confused/didn\'t know': t => withCard(t, [...re(t, CONFUSED_EN), ...any(t, CONFUSED_AR)]),
};

// --- CSV (verbatim from submission 1) ----------------------------------------
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

// --- run ---------------------------------------------------------------------
const RULES = MODE === 'sa' ? RULES_SA : RULES_AE;
const reviews = parseCSV(fs.readFileSync(IN, 'utf8'));
const counts = Object.fromEntries(Object.keys(RULES).map(k => [k, 0]));
const hits = [];

for (const r of reviews) {
  const t = norm(r.review_text);
  const tags = [], terms = [];
  for (const [k, f] of Object.entries(RULES)) {
    const h = f(t);
    if (h.length) { tags.push(k); terms.push(...h.map(x => `${k}:${x}`)); counts[k]++; }
  }
  if (tags.length) hits.push({ ...r, tags, terms });
}

const dates = reviews.map(r => r.date).filter(Boolean).sort();
console.log(`${MODE.toUpperCase()} · n=${reviews.length} · ${dates[0]} .. ${dates[dates.length - 1]}`);
for (const [k, v] of Object.entries(counts)) console.log(`  ${String(v).padStart(5)}  ${k}`);

fs.writeFileSync(OUT, '﻿' + ['review_text,star_rating,date,source,tags,matched_terms']
  .concat(hits.map(h => [cell(h.review_text), h.star_rating, h.date, cell(h.source),
    cell(h.tags.join('|')), cell(h.terms.join('|'))].join(',')))
  .join('\r\n'), 'utf8');
console.log(`  written: ${OUT} (${hits.length} rows with any tag)`);
