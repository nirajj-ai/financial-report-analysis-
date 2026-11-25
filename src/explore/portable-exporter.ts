import type { Day, Fact, StoryPlan, Transaction } from '../../contracts/index.js';

export interface PortableExportOptions {
  plan: StoryPlan;
  facts: readonly Fact[];
  days: readonly Day[];
  transactions: readonly Transaction[];
}

function escapeJsonForScriptTag(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function escapeHtmlAttr(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Generates a 100% self-contained, zero-dependency, offline-executable HTML file
 * containing the active Finance Story (Chapters, 53x7 Explorer Grid, Receipts Drawer,
 * Deterministic Ask Query Engine, and Built-in Offline CSV/JSON Importer) formatted
 * exclusively in Indian Rupees (₹).
 */
export class PortableExporter {
  public static buildStandaloneHtml(options: PortableExportOptions): string {
    const { plan, facts, days, transactions } = options;

    const compactTxns = transactions.map((t) => ({
      id: t.id,
      date: t.date,
      amount_minor: t.amount_minor,
      direction: t.direction,
      merchant: t.merchant,
      category: t.category,
      category_label: t.category_label ?? null,
      is_transfer: t.is_transfer,
      is_refund: t.is_refund,
    }));

    const payload = {
      currencySymbol: '₹',
      plan,
      facts,
      days,
      transactions: compactTxns,
    };

    const pageTitle = `${plan.person_name} · ${plan.business_meta?.fiscal_period_label ?? plan.year} · Finance Story (₹)`;
    const jsonPayload = escapeJsonForScriptTag(payload);

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtmlAttr(pageTitle)}</title>
<style>
:root{
  --ink:#111111;--bone:#F3F0E6;--paper:#E6E4DE;--c1:#F4F03A;--c2:#FFA8E4;
  --c3:#B9B744;--c4:#FF5A14;--c5:#E3A83C;--c6:#FF6B57;--lav:#A9A2E0;
  --mint:#B9F0C6;--blue:#6E8BFF;--ghost:#1C1C1B;--rule:#3A3A38;--muted:#B8B4A9;
  --sans:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--ink);color:var(--bone);font-family:var(--sans);min-height:100vh;-webkit-font-smoothing:antialiased}
button,input,select{font:inherit;color:inherit;background:none;border:0}
button{cursor:pointer}
.mono,.lab{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:600}
header.topbar{position:sticky;top:0;z-index:30;display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;padding:12px 20px;background:var(--paper);color:var(--ink);border-bottom:2px solid var(--ink)}
.brand{margin-right:auto;display:flex;flex-direction:column;gap:2px}
.brand b{font-size:18px;letter-spacing:-0.02em}
.brand span{font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;opacity:.78}
.nav-tabs{display:flex;border:1.5px solid var(--ink);flex-wrap:wrap}
.nav-tabs button{font-family:var(--mono);font-size:11px;letter-spacing:.09em;text-transform:uppercase;padding:8px 13px;font-weight:600}
.nav-tabs button+button{border-left:1.5px solid var(--ink)}
.nav-tabs button[aria-current="true"]{background:var(--ink);color:var(--c1)}
.btn{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;font-weight:600;padding:8px 13px;border:1.5px solid currentColor;display:inline-flex;align-items:center;gap:6px}
.btn.solid{background:var(--ink);color:var(--bone);border-color:var(--ink)}
.btn.solar{background:var(--c1);color:var(--ink);border-color:var(--c1)}
main{max-width:1380px;margin:0 auto;padding:22px 20px 64px}
.progress{display:flex;gap:4px;margin-bottom:18px}
.progress button{flex:1;height:6px;background:#2A2A29;padding:0}
.progress button.done,.progress button.active{background:var(--c1)}
.hero-stack{margin-bottom:20px}
.hero-headline{font-size:clamp(32px,4.5vw,60px);font-weight:300;letter-spacing:-0.04em;line-height:1.05;margin-top:8px}
.hero-body{margin-top:12px;font-size:16px;line-height:1.45;color:var(--bone);background:var(--ghost);border-left:4px solid var(--c1);padding:12px 16px;max-width:980px}
.blocks-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:18px}
.blk{padding:22px;color:var(--ink);display:flex;flex-direction:column;justify-content:space-between;min-height:190px;position:relative}
.blk .blk-head{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.blk .big-num{font-size:clamp(34px,4.2vw,62px);font-weight:300;letter-spacing:-0.045em;line-height:1;margin:18px 0 8px;display:flex;align-items:flex-start;font-variant-numeric:tabular-nums;word-break:break-word}
.blk .big-num sup{font-family:var(--mono);font-size:0.34em;font-weight:600;margin:0.25em 0.14em 0 0}
.blk .rc-btn{font-family:var(--mono);font-size:10px;padding:4px 8px;border:1.5px solid var(--ink);background:transparent;color:var(--ink);white-space:nowrap}
.blk .rc-btn:hover{background:var(--ink);color:var(--bone)}
.chapter-footer{display:flex;justify-content:space-between;align-items:center;margin-top:24px;padding-top:16px;border-top:1px solid var(--rule);flex-wrap:wrap;gap:12px}
.panel{background:var(--ghost);border:1.5px solid var(--rule);padding:20px;margin-top:16px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
.chip{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:7px 11px;border:1.5px solid var(--bone);color:var(--bone);display:inline-flex;align-items:center;gap:7px}
.chip i{width:9px;height:9px;display:inline-block}
.chip[aria-pressed="true"]{background:var(--bone);color:var(--ink)}
.grid-scroll{overflow-x:auto;padding-bottom:8px}
.cal-grid{display:grid;grid-template-columns:repeat(53,16px);grid-template-rows:repeat(7,16px);grid-auto-flow:column;gap:3px;width:max-content;margin-top:10px}
.cal-cell{width:16px;height:16px;background:#262624;transition:transform .1s}
.cal-cell:hover{transform:scale(1.25);outline:1.5px solid var(--bone);z-index:2}
.cal-cell.selected{outline:2px solid var(--c1);z-index:3}
.ask-box{display:flex;background:var(--bone);color:var(--ink);border:2px solid var(--ink)}
.ask-box input{flex:1;padding:16px 18px;font-size:22px;font-weight:300;outline:none;min-width:0}
.ask-box button{padding:0 24px;background:var(--ink);color:var(--c1);font-family:var(--mono);font-size:13px;letter-spacing:.12em;font-weight:600}
.ask-result{display:grid;grid-template-columns:1.2fr 1fr;gap:16px;margin-top:18px}
@media(max-width:860px){.ask-result{grid-template-columns:1fr}}
.bar-row{display:grid;grid-template-columns:130px 1fr 110px;gap:10px;align-items:center;padding:6px 0;font-family:var(--mono);font-size:12px}
.bar-track{height:16px;background:#2A2A29;position:relative}
.bar-fill{height:100%;background:var(--c1)}
.receipt-table{width:100%;border-collapse:collapse;font-family:var(--mono);font-size:12.5px;margin-top:12px}
.receipt-table th,.receipt-table td{padding:9px 10px;border-bottom:1px solid var(--rule);text-align:left}
.receipt-table th{color:var(--c1);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase}
.receipt-table td.amt{text-align:right;font-weight:600;white-space:nowrap}
.drawer-backdrop{position:fixed;inset:0;background:rgba(17,17,17,.7);z-index:80;display:none;justify-content:flex-end}
.drawer-backdrop.open{display:flex}
.drawer{width:min(540px,100vw);height:100%;background:var(--bone);color:var(--ink);border-left:2px solid var(--ink);display:flex;flex-direction:column}
.drawer-head{padding:20px;background:var(--c1);border-bottom:2px solid var(--ink)}
.drawer-list{flex:1;overflow-y:auto;padding:12px 20px 24px}
.drawer-row{display:flex;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid #C9C5BA;font-family:var(--mono);font-size:12.5px}
.hidden{display:none !important}
</style>
</head>
<body>
<header class="topbar">
  <div class="brand">
    <b id="brand-title">Finance Story (₹)</b>
    <span id="brand-sub">Portable Offline Edition · Indian Rupees (₹)</span>
  </div>
  <nav class="nav-tabs" aria-label="Views">
    <button type="button" data-view="story" aria-current="true">Story</button>
    <button type="button" data-view="explore">Explore Grid</button>
    <button type="button" data-view="ask">Ask (₹)</button>
    <button type="button" data-view="receipts">All Receipts</button>
  </nav>
  <label class="btn solid" title="Load any CSV or JSON ledger offline in Indian Rupees">
    + Load CSV/JSON
    <input id="offline-file-input" type="file" accept=".csv,.tsv,.json,.txt" class="hidden" />
  </label>
</header>

<main>
  <section id="view-story"></section>
  <section id="view-explore" class="hidden"></section>
  <section id="view-ask" class="hidden"></section>
  <section id="view-receipts" class="hidden"></section>
</main>

<div id="drawer-backdrop" class="drawer-backdrop">
  <aside class="drawer" role="dialog" aria-label="Traceable Receipts">
    <div class="drawer-head">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span class="lab">VERIFIED RECEIPTS</span>
        <button type="button" id="drawer-close" class="btn solid" style="padding:5px 10px">CLOSE ✕</button>
      </div>
      <h2 id="drawer-title" style="font-size:24px;font-weight:400;margin-top:8px"></h2>
      <div id="drawer-summary" class="mono" style="margin-top:8px;font-size:12px"></div>
    </div>
    <div id="drawer-list" class="drawer-list"></div>
  </aside>
</div>

<script id="portable-finance-data" type="application/json">${jsonPayload}</script>
<script>
(function(){
  const CAT_COLORS = {
    'shopping':'#F4F03A','eating out':'#FFA8E4','groceries':'#B9B744','travel':'#6E8BFF',
    'coffee':'#E3A83C','takeaway':'#FF6B57','subscriptions':'#A9A2E0','transport':'#6BE8F2',
    'health':'#B9F0C6','fun':'#D7F246','gifts':'#FFB58A','rent':'#8E8A7F','bills':'#7A7870',
    'fees':'#FF5A14','savings':'#B9F0C6','transfers':'#555550','income':'#FF5A14'
  };
  const BLOCK_BG = ['#F4F03A','#FFA8E4','#FF5A14','#A9A2E0','#B9F0C6','#6E8BFF'];
  const STEP_COLORS = ['#262624','#5B5926','#9E992F','#D5CF36','#F4F03A'];

  let STATE = JSON.parse(document.getElementById('portable-finance-data').textContent);
  let factMap = new Map();
  let txnMap = new Map();
  let currentView = 'story';
  let currentChapter = 0;
  let activeCatFilter = '';
  let selectedDayDate = '';

  function rebuildIndexes(){
    factMap = new Map((STATE.facts || []).map(f => [f.id, f]));
    txnMap = new Map((STATE.transactions || []).map(t => [t.id, t]));
  }

  function esc(v){
    return String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function fmtINR(minor, showPaise){
    const abs = Math.abs(Math.round(minor || 0));
    const rupees = Math.floor(abs / 100);
    const paise = abs % 100;
    const dec = showPaise === undefined ? (paise !== 0) : showPaise;
    const body = rupees.toLocaleString('en-IN');
    return dec ? '₹' + body + '.' + String(paise).padStart(2,'0') : '₹' + body;
  }

  function stripCurr(str){
    return String(str ?? '').replace(/^(?:US\\$|€|£|¥|₹|CA\\$|A\\$|CHF\\s*|\\$)/, '');
  }

  function hasCurr(str){
    return /^(?:US\\$|€|£|¥|₹|CA\\$|A\\$|CHF|\\$)/.test(String(str ?? ''));
  }

  function resolveCopy(tpl){
    return String(tpl || '').replace(/\\{fact:([a-zA-Z0-9_]+)\\}/g, function(_, id){
      const f = factMap.get(id);
      if (!f) return '';
      return hasCurr(f.formatted) ? '₹' + stripCurr(f.formatted) : f.formatted;
    });
  }

  function openDrawer(title, ids){
    const list = (ids || []).map(id => txnMap.get(id)).filter(Boolean).sort((a,b) => b.amount_minor - a.amount_minor);
    const totalOut = list.filter(t => t.direction === 'out').reduce((s,t) => s + t.amount_minor, 0);
    const totalIn = list.filter(t => t.direction === 'in').reduce((s,t) => s + t.amount_minor, 0);
    document.getElementById('drawer-title').textContent = title;
    document.getElementById('drawer-summary').textContent =
      list.length + ' TRANSACTIONS · ' + (totalOut > 0 || totalIn === 0 ? fmtINR(totalOut, true) : '+' + fmtINR(totalIn, true));
    document.getElementById('drawer-list').innerHTML = list.length ? list.map(t => (
      '<div class="drawer-row">' +
      '<div><strong>' + esc(t.merchant) + '</strong><div style="opacity:.68;font-size:11px;margin-top:3px">' +
      esc(t.date) + ' · ' + esc(t.category_label || t.category) + '</div></div>' +
      '<div style="font-weight:700;white-space:nowrap">' + (t.direction === 'in' ? '+' : '') + fmtINR(t.amount_minor, true) + '</div>' +
      '</div>'
    )).join('') : '<div class="mono" style="padding:20px 0;opacity:.7">No matching transactions.</div>';
    document.getElementById('drawer-backdrop').classList.add('open');
  }

  document.getElementById('drawer-close').addEventListener('click', () => {
    document.getElementById('drawer-backdrop').classList.remove('open');
  });
  document.getElementById('drawer-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'drawer-backdrop') e.target.classList.remove('open');
  });

  function updateHeader(){
    const plan = STATE.plan;
    const period = plan.business_meta?.fiscal_period_label || String(plan.year);
    document.getElementById('brand-title').textContent = plan.person_name + ' · ' + period + ' (₹)';
    document.getElementById('brand-sub').textContent =
      STATE.transactions.length.toLocaleString('en-IN') + ' Transactions · Portable Offline Finance Story · INR (₹)';
  }

  function renderStory(){
    const chapters = STATE.plan.chapters || [];
    if (!chapters.length) return;
    currentChapter = Math.max(0, Math.min(chapters.length - 1, currentChapter));
    const ch = chapters[currentChapter];
    const headline = resolveCopy(ch.headline);
    const body = resolveCopy(ch.body);
    const kicker = ch.params?.kicker || ('CHAPTER ' + (currentChapter + 1));

    const blocks = (ch.params?.blocks && ch.params.blocks.length)
      ? ch.params.blocks.map(b => ({ label: b.label, fact: factMap.get(b.fact_id), sub: b.sublabel_template ? resolveCopy(b.sublabel_template) : '' })).filter(x => x.fact)
      : (ch.fact_ids || []).slice(0, 4).map(id => factMap.get(id)).filter(Boolean).map(f => ({ label: f.label, fact: f, sub: '' }));

    const progressHtml = chapters.map((c, idx) =>
      '<button type="button" class="' + (idx < currentChapter ? 'done' : idx === currentChapter ? 'active' : '') +
      '" data-jump-ch="' + idx + '" title="' + esc(c.params?.kicker || c.id) + '"></button>'
    ).join('');

    const blocksHtml = blocks.map((b, idx) => {
      const f = b.fact;
      const isMoney = hasCurr(f.formatted) || f.unit === 'usd_cents' || f.unit === 'usd';
      const digits = stripCurr(f.formatted);
      const bg = BLOCK_BG[idx % BLOCK_BG.length];
      return '<div class="blk" style="background:' + bg + '">' +
        '<div class="blk-head"><span class="lab">' + esc(b.label) + '</span>' +
        '<button type="button" class="rc-btn" data-fact-rc="' + esc(f.id) + '">Receipts (' + (f.txn_ids?.length || 0) + ')</button></div>' +
        '<div class="big-num">' + (isMoney ? '<sup>₹</sup>' : '') + '<span>' + esc(digits) + '</span></div>' +
        '<div class="lab" style="opacity:.82">' + esc(b.sub || f.label) + '</div>' +
      '</div>';
    }).join('');

    const catBreakdownHtml = ch.type === 'shatter' ? renderCategoryBarsHtml() : '';

    const el = document.getElementById('view-story');
    el.innerHTML =
      '<div class="progress">' + progressHtml + '</div>' +
      '<div class="hero-stack">' +
        '<div class="lab" style="color:var(--c1)">' + esc(kicker) + ' · ' + (currentChapter + 1) + ' / ' + chapters.length + '</div>' +
        '<h1 class="hero-headline">' + esc(headline) + '</h1>' +
        '<div class="hero-body">' + esc(body) + '</div>' +
      '</div>' +
      '<div class="blocks-grid">' + blocksHtml + '</div>' +
      catBreakdownHtml +
      '<div class="chapter-footer">' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<button type="button" class="btn" id="ch-prev" ' + (currentChapter === 0 ? 'disabled style="opacity:.4"' : '') + '>← Prev</button>' +
          '<button type="button" class="btn solar" id="ch-next">' + (currentChapter === chapters.length - 1 ? 'Explore Grid →' : 'Next Chapter →') + '</button>' +
        '</div>' +
        '<button type="button" class="btn" id="ch-all-rc">Inspect Chapter Receipts (' + (ch.txn_ids?.length || 0) + ')</button>' +
      '</div>';

    el.querySelectorAll('[data-jump-ch]').forEach(btn => {
      btn.addEventListener('click', () => { currentChapter = Number(btn.dataset.jumpCh); renderStory(); });
    });
    el.querySelectorAll('[data-fact-rc]').forEach(btn => {
      btn.addEventListener('click', () => {
        const f = factMap.get(btn.dataset.factRc);
        if (f) openDrawer(f.label + ' (' + (hasCurr(f.formatted) ? '₹' + stripCurr(f.formatted) : f.formatted) + ')', f.txn_ids);
      });
    });
    el.querySelector('#ch-prev')?.addEventListener('click', () => { if (currentChapter > 0) { currentChapter--; renderStory(); } });
    el.querySelector('#ch-next')?.addEventListener('click', () => {
      if (currentChapter < chapters.length - 1) { currentChapter++; renderStory(); }
      else switchView('explore');
    });
    el.querySelector('#ch-all-rc')?.addEventListener('click', () => openDrawer(headline, ch.txn_ids));
  }

  function renderCategoryBarsHtml(){
    const totals = new Map();
    for (const t of STATE.transactions) {
      if (t.direction !== 'out' || t.is_transfer) continue;
      const cur = totals.get(t.category) || { key: t.category, label: t.category_label || t.category, minor: 0, ids: [] };
      cur.minor += t.amount_minor;
      cur.ids.push(t.id);
      totals.set(t.category, cur);
    }
    const sorted = Array.from(totals.values()).sort((a,b) => b.minor - a.minor).slice(0, 10);
    const maxM = Math.max(1, sorted[0]?.minor || 1);
    return '<div class="panel"><div class="lab" style="color:var(--c1);margin-bottom:10px">CATEGORY BREAKDOWN (₹)</div>' +
      sorted.map(c =>
        '<div class="bar-row">' +
          '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(c.label) + '</span>' +
          '<div class="bar-track"><div class="bar-fill" style="width:' + Math.max(2, Math.round(c.minor / maxM * 100)) + '%;background:' + (CAT_COLORS[c.key] || '#F4F03A') + '"></div></div>' +
          '<span style="text-align:right;font-weight:700">' + fmtINR(c.minor, false) + '</span>' +
        '</div>'
      ).join('') + '</div>';
  }

  function renderExplore(){
    const el = document.getElementById('view-explore');
    const cats = Array.from(new Set(STATE.transactions.filter(t => t.direction === 'out' && !t.is_transfer).map(t => t.category)));
    const matchingTxns = STATE.transactions.filter(t =>
      t.direction === 'out' && !t.is_transfer && (!activeCatFilter || t.category === activeCatFilter)
    );
    const byDate = new Map();
    for (const t of matchingTxns) {
      const arr = byDate.get(t.date) || [];
      arr.push(t);
      byDate.set(t.date, arr);
    }
    const dayTotals = (STATE.days || []).map(d => {
      const list = byDate.get(d.date) || [];
      return { day: d, txns: list, minor: list.reduce((s,t) => s + t.amount_minor, 0) };
    });
    const maxDay = Math.max(100, ...dayTotals.map(x => x.minor));
    const grandTotal = matchingTxns.reduce((s,t) => s + t.amount_minor, 0);

    const chipsHtml =
      '<button type="button" class="chip" data-cat="" aria-pressed="' + (activeCatFilter === '') + '"><i style="background:var(--bone)"></i>All (' + fmtINR(grandTotal, false) + ')</button>' +
      cats.map(c => '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (activeCatFilter === c) + '"><i style="background:' + (CAT_COLORS[c] || '#F4F03A') + '"></i>' + esc(c) + '</button>').join('');

    const cellsHtml = dayTotals.map(item => {
      let bg = '#262624';
      if (item.day.is_payday && !activeCatFilter) bg = '#FF5A14';
      else if (item.minor > 0) {
        if (activeCatFilter) bg = CAT_COLORS[activeCatFilter] || '#F4F03A';
        else {
          const r = Math.min(1, Math.sqrt(item.minor / maxDay));
          bg = STEP_COLORS[r < .2 ? 1 : r < .45 ? 2 : r < .75 ? 3 : 4];
        }
      }
      const cls = 'cal-cell' + (selectedDayDate === item.day.date ? ' selected' : '');
      return '<button type="button" class="' + cls + '" data-day="' + esc(item.day.date) + '" style="background:' + bg + '" title="' + esc(item.day.date + ' · ' + fmtINR(item.minor, true) + ' (' + item.txns.length + ' items)') + '"></button>';
    }).join('');

    const selItem = dayTotals.find(x => x.day.date === selectedDayDate);
    const selHtml = selItem ? (
      '<div class="panel" style="background:var(--c1);color:var(--ink)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
          '<div><span class="lab">SELECTED DAY</span><div style="font-size:32px;font-weight:300">' + esc(selItem.day.date) + ' · ' + fmtINR(selItem.minor, true) + '</div></div>' +
          '<button type="button" class="btn solid" id="open-day-rc">Inspect ' + selItem.txns.length + ' Receipts</button>' +
        '</div>' +
      '</div>'
    ) : '';

    el.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px">' +
        '<div><div class="lab" style="color:var(--c1)">EXPLORE YEAR GRID</div><h2 style="font-size:38px;font-weight:300;letter-spacing:-0.03em">Every square is a day · ' + fmtINR(grandTotal, false) + '</h2></div>' +
        '<button type="button" class="btn solar" id="explore-all-rc">Receipts (' + matchingTxns.length + ')</button>' +
      '</div>' +
      '<div class="chips">' + chipsHtml + '</div>' +
      '<div class="panel"><div class="lab" style="color:var(--muted)">53 WEEKS × 7 DAYS · CLICK ANY SQUARE TO INSPECT IN ₹</div><div class="grid-scroll"><div class="cal-grid">' + cellsHtml + '</div></div></div>' +
      selHtml;

    el.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => { activeCatFilter = btn.dataset.cat; renderExplore(); });
    });
    el.querySelectorAll('[data-day]').forEach(btn => {
      btn.addEventListener('click', () => { selectedDayDate = btn.dataset.day; renderExplore(); });
    });
    el.querySelector('#explore-all-rc')?.addEventListener('click', () => openDrawer((activeCatFilter || 'All Spending') + ' (' + fmtINR(grandTotal, false) + ')', matchingTxns.map(t => t.id)));
    el.querySelector('#open-day-rc')?.addEventListener('click', () => {
      if (selItem) openDrawer(selItem.day.date + ' (' + fmtINR(selItem.minor, true) + ')', selItem.txns.map(t => t.id));
    });
  }

  function runOfflineAsk(question){
    const q = (question || '').trim().toLowerCase();
    const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    const monthShort = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    let monthFilter = -1;
    months.forEach((m, i) => { if (q.includes(m)) monthFilter = i + 1; });
    if (monthFilter < 0) monthShort.forEach((m, i) => { if (new RegExp('\\\\b' + m + '\\\\b').test(q)) monthFilter = i + 1; });

    const cats = Object.keys(CAT_COLORS);
    const matchedCats = cats.filter(c => q.includes(c));
    const minMatch = q.match(/(?:over|above|more than)\\s*(?:₹|rs\\.?|inr|\\$)?\\s*(\\d+(?:\\.\\d+)?)/i);
    const maxMatch = q.match(/(?:under|below|less than)\\s*(?:₹|rs\\.?|inr|\\$)?\\s*(\\d+(?:\\.\\d+)?)/i);
    const minMinor = minMatch ? Math.round(parseFloat(minMatch[1]) * 100) : null;
    const maxMinor = maxMatch ? Math.round(parseFloat(maxMatch[1]) * 100) : null;
    const isCount = /how many|count|number of|visits/.test(q);
    const isMax = /biggest|largest|highest|most expensive|max/.test(q);
    const isAvg = /average|avg|mean/.test(q);
    const isWeekend = /weekend|saturday|sunday/.test(q);
    const dir = /income|salary|revenue|inflow|deposit/.test(q) ? 'in' : 'out';

    const allMerchants = Array.from(new Set(STATE.transactions.map(t => t.merchant))).sort((a,b) => b.length - a.length);
    const matchedMerchant = allMerchants.find(m => m.length >= 3 && q.includes(m.toLowerCase()));

    const rows = STATE.transactions.filter(t => {
      if (t.direction !== dir || t.is_transfer || t.is_refund) return false;
      if (monthFilter > 0 && Number(t.date.slice(5,7)) !== monthFilter) return false;
      if (matchedMerchant && t.merchant !== matchedMerchant) return false;
      if (!matchedMerchant && matchedCats.length && !matchedCats.includes(t.category)) return false;
      if (minMinor !== null && t.amount_minor < minMinor) return false;
      if (maxMinor !== null && t.amount_minor > maxMinor) return false;
      if (isWeekend) {
        const wd = new Date(t.date + 'T00:00:00Z').getUTCDay();
        if (wd !== 0 && wd !== 6) return false;
      }
      return true;
    }).sort((a,b) => b.amount_minor - a.amount_minor);

    let answer = '₹0';
    let label = 'Total';
    if (isCount) { answer = rows.length.toLocaleString('en-IN') + ' items'; label = 'Count'; }
    else if (isMax) { answer = fmtINR(rows[0]?.amount_minor || 0, true); label = rows[0] ? ('Biggest · ' + rows[0].merchant + ' (' + rows[0].date + ')') : 'Biggest'; }
    else if (isAvg) { answer = fmtINR(rows.length ? Math.round(rows.reduce((s,t)=>s+t.amount_minor,0)/rows.length) : 0, true); label = 'Average'; }
    else { answer = fmtINR(rows.reduce((s,t)=>s+t.amount_minor,0), true); label = 'Total Spend'; }

    return { question, answer, label, rows };
  }

  function renderAsk(initialQ){
    const samples = (STATE.plan.sample_questions && STATE.plan.sample_questions.length)
      ? STATE.plan.sample_questions
      : ['Biggest purchase?', 'How much did I spend on coffee?', 'Eating out on weekends', 'Purchases over ₹500', 'Total income'];

    const el = document.getElementById('view-ask');
    el.innerHTML =
      '<div class="lab" style="color:var(--c1);margin-bottom:8px">OFFLINE ASK STUDIO · DETERMINISTIC QUERY ENGINE (₹)</div>' +
      '<div class="ask-box"><input id="ask-input" type="text" placeholder="Ask about any category, merchant, month, or ₹ threshold..." value="' + esc(initialQ || '') + '" /><button type="button" id="ask-go">ASK ↵</button></div>' +
      '<div class="chips">' + samples.map(s => '<button type="button" class="chip" data-sample-q="' + esc(s) + '">' + esc(s) + '</button>').join('') + '</div>' +
      '<div id="ask-out"></div>';

    function exec(qStr){
      const res = runOfflineAsk(qStr);
      document.getElementById('ask-out').innerHTML =
        '<div class="ask-result">' +
          '<div class="blk" style="background:var(--c4);min-height:220px">' +
            '<span class="lab">' + esc(res.label) + '</span>' +
            '<div class="big-num" style="font-size:clamp(42px,6vw,84px)">' + esc(res.answer) + '</div>' +
            '<span class="lab">' + res.rows.length + ' MATCHING TRANSACTIONS · COMPUTED OFFLINE</span>' +
          '</div>' +
          '<div class="blk" style="background:var(--c1);min-height:220px">' +
            '<div class="blk-head"><span class="lab">TOP MATCHING RECEIPTS</span><button type="button" class="rc-btn" id="ask-open-rc">Open All (' + res.rows.length + ')</button></div>' +
            '<div style="margin-top:12px">' + res.rows.slice(0,6).map(t =>
              '<div style="display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid rgba(17,17,17,.2);font-family:var(--mono);font-size:12px"><span>' + esc(t.date) + ' · ' + esc(t.merchant) + '</span><strong>' + fmtINR(t.amount_minor, true) + '</strong></div>'
            ).join('') + '</div>' +
          '</div>' +
        '</div>';
      document.getElementById('ask-open-rc')?.addEventListener('click', () => openDrawer('Ask: ' + qStr, res.rows.map(t => t.id)));
    }

    const inp = el.querySelector('#ask-input');
    el.querySelector('#ask-go').addEventListener('click', () => exec(inp.value));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') exec(inp.value); });
    el.querySelectorAll('[data-sample-q]').forEach(btn => {
      btn.addEventListener('click', () => { inp.value = btn.dataset.sampleQ; exec(btn.dataset.sampleQ); });
    });
    if (initialQ) exec(initialQ);
    else exec(samples[0]);
  }

  function renderReceiptsView(){
    const el = document.getElementById('view-receipts');
    el.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">' +
        '<div><div class="lab" style="color:var(--c1)">FULL LEDGER</div><h2 style="font-size:34px;font-weight:300">' + STATE.transactions.length.toLocaleString('en-IN') + ' Verified Transactions (₹)</h2></div>' +
        '<input id="rc-filter" type="search" placeholder="Filter merchant, category, date..." style="padding:10px 14px;border:1.5px solid var(--bone);min-width:260px;font-family:var(--mono);font-size:12px" />' +
      '</div>' +
      '<div id="rc-table-wrap"></div>';

    function draw(q){
      const term = (q || '').trim().toLowerCase();
      const rows = STATE.transactions.filter(t => !term ||
        t.merchant.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.date.includes(term)
      ).slice(0, 400);
      document.getElementById('rc-table-wrap').innerHTML =
        '<table class="receipt-table"><thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th style="text-align:right">Amount (₹)</th></tr></thead><tbody>' +
        rows.map(t => '<tr><td>' + esc(t.date) + '</td><td>' + esc(t.merchant) + '</td><td>' + esc(t.category_label || t.category) + '</td><td class="amt">' + (t.direction === 'in' ? '+' : '') + fmtINR(t.amount_minor, true) + '</td></tr>').join('') +
        '</tbody></table>';
    }
    el.querySelector('#rc-filter').addEventListener('input', e => draw(e.target.value));
    draw('');
  }

  function switchView(view){
    currentView = view;
    document.querySelectorAll('.nav-tabs button').forEach(b => b.setAttribute('aria-current', String(b.dataset.view === view)));
    ['story','explore','ask','receipts'].forEach(v => {
      document.getElementById('view-' + v).classList.toggle('hidden', v !== view);
    });
    if (view === 'story') renderStory();
    if (view === 'explore') renderExplore();
    if (view === 'ask') renderAsk();
    if (view === 'receipts') renderReceiptsView();
  }

  document.querySelectorAll('.nav-tabs button').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight' && currentView === 'story') { currentChapter = Math.min((STATE.plan.chapters?.length || 1) - 1, currentChapter + 1); renderStory(); }
    if (e.key === 'ArrowLeft' && currentView === 'story') { currentChapter = Math.max(0, currentChapter - 1); renderStory(); }
    if (e.key.toLowerCase() === 'e') switchView('explore');
    if (e.key.toLowerCase() === 'a') switchView('ask');
  });

  // Built-in Offline CSV / JSON Re-loader so this single HTML file works on new ledgers anywhere!
  document.getElementById('offline-file-input').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    let parsedTxns = [];
    if (file.name.toLowerCase().endsWith('.json')) {
      const json = JSON.parse(text);
      const arr = Array.isArray(json) ? json : (json.transactions || json.rows || json.data || []);
      parsedTxns = arr.map((r, i) => {
        const amt = parseFloat(String(r.amount ?? r.amount_minor ?? 0).replace(/[^0-9.-]/g, '')) || 0;
        const minor = r.amount_minor !== undefined ? Math.abs(Math.round(r.amount_minor)) : Math.abs(Math.round(amt * 100));
        return {
          id: String(r.id || ('ROW-' + (i + 1))),
          date: String(r.date || '2025-01-01').slice(0, 10),
          amount_minor: minor,
          direction: r.direction || (amt >= 0 ? 'in' : 'out'),
          merchant: String(r.merchant || r.description || r.vendor || 'Entry'),
          category: String(r.category || 'shopping').toLowerCase(),
          category_label: r.category_label || r.category || null,
          is_transfer: Boolean(r.is_transfer),
          is_refund: Boolean(r.is_refund),
        };
      });
    } else {
      const lines = text.split(/\\r?\\n/).filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g,'').toLowerCase());
      const dIdx = headers.findIndex(h => /date/.test(h));
      const mIdx = headers.findIndex(h => /merchant|desc|vendor|payee|name/.test(h));
      const aIdx = headers.findIndex(h => /amount|total|value|spend|cost/.test(h));
      const cIdx = headers.findIndex(h => /cat|dept|type/.test(h));
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].match(/(".*?"|[^",]+)(?=\\s*,|\\s*$)/g)?.map(c => c.replace(/^"|"$/g,'').trim()) || lines[i].split(',');
        const rawAmt = parseFloat(String(cols[aIdx] || '0').replace(/[^0-9.-]/g, '')) || 0;
        if (!rawAmt) continue;
        parsedTxns.push({
          id: 'CSV-' + i,
          date: (cols[dIdx] || '2025-01-01').slice(0, 10),
          amount_minor: Math.abs(Math.round(rawAmt * 100)),
          direction: rawAmt > 0 ? 'in' : 'out',
          merchant: cols[mIdx] || 'Merchant',
          category: (cols[cIdx] || 'shopping').toLowerCase(),
          category_label: cols[cIdx] || null,
          is_transfer: false,
          is_refund: false,
        });
      }
    }
    if (!parsedTxns.length) return;
    const outTxns = parsedTxns.filter(t => t.direction === 'out');
    const inTxns = parsedTxns.filter(t => t.direction === 'in');
    const totalOut = outTxns.reduce((s,t) => s + t.amount_minor, 0);
    const totalIn = inTxns.reduce((s,t) => s + t.amount_minor, 0);
    const big = outTxns.slice().sort((a,b) => b.amount_minor - a.amount_minor)[0];
    const year = Number((parsedTxns[0].date || '2025').slice(0, 4)) || 2025;
    const dayMap = new Map();
    for (const t of parsedTxns) {
      const d = dayMap.get(t.date) || { date: t.date, discretionary_out_minor: 0, all_out_minor: 0, in_minor: 0, txn_ids: [], is_payday: false };
      if (t.direction === 'out') { d.discretionary_out_minor += t.amount_minor; d.all_out_minor += t.amount_minor; }
      else { d.in_minor += t.amount_minor; d.is_payday = true; }
      d.txn_ids.push(t.id);
      dayMap.set(t.date, d);
    }
    const entity = file.name.replace(/\\.[^.]+$/, '');
    STATE = {
      currencySymbol: '₹',
      transactions: parsedTxns,
      days: Array.from(dayMap.values()).sort((a,b) => a.date.localeCompare(b.date)),
      facts: [
        { id: 'total_spend_usd', label: 'Total Outflow', value: totalOut, unit: 'usd_cents', formatted: fmtINR(totalOut, false), txn_ids: outTxns.map(t=>t.id) },
        { id: 'total_income_usd', label: 'Total Inflow', value: totalIn, unit: 'usd_cents', formatted: fmtINR(totalIn, false), txn_ids: inTxns.map(t=>t.id) },
        { id: 'total_transactions_count', label: 'Transactions', value: parsedTxns.length, unit: 'count', formatted: parsedTxns.length.toLocaleString('en-IN'), txn_ids: parsedTxns.map(t=>t.id) },
        { id: 'big_one_spend', label: 'Biggest Payment', value: big?.amount_minor || 0, unit: 'usd_cents', formatted: fmtINR(big?.amount_minor || 0, true), txn_ids: big ? [big.id] : [] },
      ],
      plan: {
        person_name: entity,
        year,
        one_line: entity + ': ' + fmtINR(totalOut, false) + ' outflow and ' + fmtINR(totalIn, false) + ' inflow across ' + parsedTxns.length + ' entries.',
        chapters: [
          {
            id: 'overview',
            type: 'pour',
            headline: entity + ' · ' + fmtINR(totalOut, false) + ' in ' + year + '.',
            body: 'Loaded offline directly inside this portable HTML app. All values displayed in Indian Rupees (₹).',
            fact_ids: ['total_spend_usd','total_income_usd','total_transactions_count','big_one_spend'],
            txn_ids: parsedTxns.map(t=>t.id),
            params: { kicker: '01 · OFFLINE SUMMARY' }
          },
          {
            id: 'categories',
            type: 'shatter',
            headline: 'Where ' + fmtINR(totalOut, false) + ' went.',
            body: 'Full category breakdown computed locally in your browser.',
            fact_ids: ['total_spend_usd','big_one_spend'],
            txn_ids: outTxns.map(t=>t.id),
            params: { kicker: '02 · CATEGORY SHATTER' }
          }
        ]
      }
    };
    rebuildIndexes();
    updateHeader();
    currentChapter = 0;
    switchView('story');
  });

  rebuildIndexes();
  updateHeader();
  switchView('story');
})();
</script>
</body>
</html>`;
  }

  public static downloadStandaloneHtml(
    options: PortableExportOptions,
    filename?: string
  ): string {
    const html = this.buildStandaloneHtml(options);
    const slug =
      options.plan.person_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'finance-story';
    const dlName = filename ?? `${slug}-${options.plan.year}-portable-inr.html`;

    if (typeof document !== 'undefined' && typeof Blob !== 'undefined') {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = dlName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2500);
    }
    return html;
  }
}
