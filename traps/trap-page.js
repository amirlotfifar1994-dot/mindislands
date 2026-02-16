(function(){
  'use strict';
  const root = document.documentElement;

  const THEME_KEY = 'mind-islands-theme';
  const LEGACY_THEME_KEY = 'mi_theme';
  const LANG_KEY  = 'mind-islands-lang';

  const TRAPS_EN = {
  "action_bias": {
    "title": "Action Bias",
    "lead": "Doing something just to feel in control"
  },
  "all_or_nothing": {
    "title": "All-or-Nothing Thinking",
    "lead": "Seeing only extremes, no gray"
  },
  "ambiguity_effect": {
    "title": "Ambiguity Effect",
    "lead": "Avoiding options with unknown probabilities"
  },
  "analysis_paralysis": {
    "title": "Analysis Paralysis",
    "lead": "Overanalyzing until you can't decide"
  },
  "anchoring": {
    "title": "Anchoring",
    "lead": "Letting the first number steer your judgment"
  },
  "availability_heuristic": {
    "title": "Availability Heuristic",
    "lead": "Judging likelihood by what comes to mind"
  },
  "bandwagon": {
    "title": "Bandwagon Effect",
    "lead": "Believing it because everyone does"
  },
  "cascade": {
    "title": "Information Cascade",
    "lead": "Following others' choices despite your doubts"
  },
  "catastrophizing": {
    "title": "Catastrophizing",
    "lead": "Jumping to the worst-case scenario"
  },
  "complexity_bias": {
    "title": "Complexity Bias",
    "lead": "Preferring complicated explanations or solutions"
  },
  "confirmation_bias": {
    "title": "Confirmation Bias",
    "lead": "Seeking evidence that confirms prior beliefs"
  },
  "cynicism": {
    "title": "Cynicism Bias",
    "lead": "Assuming bad intentions, dismissing positives"
  },
  "devils_advocate_trap": {
    "title": "Devil's Advocate Trap",
    "lead": "Contradicting for sport, not for truth"
  },
  "dunning_kruger": {
    "title": "Dunning–Kruger Effect",
    "lead": "Low skill, high confidence"
  },
  "echo_chamber": {
    "title": "Echo Chamber",
    "lead": "Hearing only what matches your views"
  },
  "emotional_reasoning": {
    "title": "Emotional Reasoning",
    "lead": "Treating feelings as facts"
  },
  "empathy_overload": {
    "title": "Empathy Overload",
    "lead": "Too much empathy, not enough boundaries"
  },
  "false_dilemma": {
    "title": "False Dilemma",
    "lead": "Seeing only two options"
  },
  "forest_for_trees": {
    "title": "Missing the Forest for the Trees",
    "lead": "Stuck in details, losing the big picture"
  },
  "fundamental_attribution": {
    "title": "Fundamental Attribution Error",
    "lead": "Blaming people, ignoring situations"
  },
  "groupthink": {
    "title": "Groupthink",
    "lead": "Chasing harmony over accuracy"
  },
  "halo_effect": {
    "title": "Halo Effect",
    "lead": "One good trait colors everything"
  },
  "hindsight": {
    "title": "Hindsight Bias",
    "lead": "Thinking you 'knew it all along'"
  },
  "idea_hoarding": {
    "title": "Idea Hoarding",
    "lead": "Collecting ideas without executing"
  },
  "isolation_bias": {
    "title": "Isolation Bias",
    "lead": "Deciding alone, missing context"
  },
  "loss_aversion": {
    "title": "Loss Aversion",
    "lead": "Losses feel bigger than gains"
  },
  "mind_reading": {
    "title": "Mind Reading",
    "lead": "Assuming you know what others think"
  },
  "nitpicking": {
    "title": "Nitpicking",
    "lead": "Zooming in on minor flaws"
  },
  "novelty_bias": {
    "title": "Novelty Bias",
    "lead": "Preferring new just because it's new"
  },
  "optimism_bias": {
    "title": "Optimism Bias",
    "lead": "Underestimating risks, overestimating outcomes"
  },
  "outcome_bias": {
    "title": "Outcome Bias",
    "lead": "Judging decisions by results, not process"
  },
  "over_thinking": {
    "title": "Overthinking",
    "lead": "Spinning thoughts without movement"
  },
  "overconfidence": {
    "title": "Overconfidence Bias",
    "lead": "Being more sure than warranted"
  },
  "overthinking_past": {
    "title": "Ruminating on the Past",
    "lead": "Replaying the past instead of acting now"
  },
  "perfectionism": {
    "title": "Perfectionism",
    "lead": "Waiting for perfect before starting"
  },
  "planning_fallacy": {
    "title": "Planning Fallacy",
    "lead": "Underestimating time and effort"
  },
  "premature_optimization": {
    "title": "Premature Optimization",
    "lead": "Optimizing too early, before clarity"
  },
  "projection": {
    "title": "Projection",
    "lead": "Assuming others feel what you feel"
  },
  "recency_bias": {
    "title": "Recency Bias",
    "lead": "Overweighting the most recent info"
  },
  "regret": {
    "title": "Regret Trap",
    "lead": "Getting stuck in 'if only'"
  },
  "rumination": {
    "title": "Rumination",
    "lead": "Repetitive negative thinking loops"
  },
  "satisficing": {
    "title": "Satisficing",
    "lead": "Settling for 'good enough' too early"
  },
  "self_blame": {
    "title": "Self-Blame",
    "lead": "Taking responsibility for everything"
  },
  "shiny_object": {
    "title": "Shiny Object Syndrome",
    "lead": "Chasing novelty, abandoning focus"
  },
  "single_cause": {
    "title": "Single-Cause Fallacy",
    "lead": "Reducing complex problems to one cause"
  },
  "small_sample": {
    "title": "Small Sample Bias",
    "lead": "Overgeneralizing from too little data"
  },
  "status_quo": {
    "title": "Status Quo Bias",
    "lead": "Preferring things to stay the same"
  },
  "style_paralysis": {
    "title": "Style Paralysis",
    "lead": "Stuck polishing style, not substance"
  },
  "sunk_cost": {
    "title": "Sunk Cost Fallacy",
    "lead": "Continuing because you already invested"
  },
  "survivorship_bias": {
    "title": "Survivorship Bias",
    "lead": "Seeing only the winners"
  },
  "tunnel_vision": {
    "title": "Tunnel Vision",
    "lead": "Fixating on one path and ignoring others"
  }
};

  const UI = {
    fa: {
      app: '🏝️ اپ',
      list: '📚 فهرست تله‌ها',
      chip: '🗺️ تله شناختی',
      copy: '🔗 کپی لینک',
      copied: '✅ کپی شد',
      quick: '⚡ تشخیص سریع',
      fixes: '🛠️ راهکارها',
      tocTitle: 'راهنمای صفحه',
      backList: '⬅️ برگشت به فهرست',
      backApp: '🏝️ برگشت به اپ',
      id: 'شناسه:',
      readTime: 'زمان مطالعه:',
      about: 'حدود',
      min: 'دقیقه',
      themeDark: 'تم تیره',
      themeLight: 'تم روشن',
      openToc: 'فهرست',
      close: 'بستن',
      enSummary: 'English summary',
      showDetails: 'نمایش متن فارسی',
      hideDetails: 'پنهان کردن متن فارسی'
    },
    en: {
      app: '🏝️ App',
      list: '📚 Traps',
      chip: '🗺️ Cognitive trap',
      copy: '🔗 Copy link',
      copied: '✅ Copied',
      quick: '⚡ Quick check',
      fixes: '🛠️ Fixes',
      tocTitle: 'On this page',
      backList: '⬅️ Back to list',
      backApp: '🏝️ Back to app',
      id: 'ID:',
      readTime: 'Read time:',
      about: 'about',
      min: 'min',
      themeDark: 'Dark theme',
      themeLight: 'Light theme',
      openToc: 'Contents',
      close: 'Close',
      enSummary: 'English summary',
      showDetails: 'Show Persian details',
      hideDetails: 'Hide Persian details'
    }
  };

  const SECTIONS = {
    what:     { fa: 'تعریف و مکانیزم',             en: 'Definition & mechanism' },
    cost:     { fa: 'هزینه‌ها و نشانه‌ها',           en: 'Costs & signs' },
    scenarios:{ fa: 'سناریوهای واقعی',             en: 'Real scenarios' },
    quick:    { fa: 'تشخیص سریع',                  en: 'Quick check' },
    fix:      { fa: 'راهکارهای عملی',              en: 'Practical fixes' },
    practice: { fa: 'تمرین‌ها و برنامه ۷ روزه',     en: 'Practice & 7-day plan' },
    journal:  { fa: 'پرسش‌های ژورنالینگ',           en: 'Journaling prompts' },
    related:  { fa: 'تله‌های نزدیک',               en: 'Related traps' },
  };

  // Sub-section (H3) titles that appear inside cards.
  // We don't translate every long paragraph, but we must avoid mixed UI language.
  const H3_MAP = {
    'چرا رخ می‌دهد؟': 'Why it happens',
    'چرخهٔ تله': 'Trap loop',
    'چرخه تله': 'Trap loop',
    'هزینه‌های پنهان': 'Hidden costs',
    'نشانه‌های رایج': 'Common signs',
    'تمرین‌های کاربردی': 'Useful exercises',
    'برنامه ۷ روزه': '7-day plan',
    'برنامه 7 روزه': '7-day plan',
    'راه‌حل پیشنهادی (خلاصه)': 'Suggested fix (summary)',
    'راه حل پیشنهادی (خلاصه)': 'Suggested fix (summary)',
    'ضد-حرکت‌ها (Antidotes)': 'Antidotes',
    'ضد-حرکت‌ها': 'Antidotes',
    'اشتباهات رایج در مقابله': 'Common mistakes',
  };

  function cleanFaTitle(txt){
    // Remove trailing English parenthetical (e.g., "(Antidotes)") in FA mode.
    return (txt || '').replace(/\s*\(([A-Za-z0-9\s\-\u2010-\u2015'’]+)\)\s*/g, ' ').replace(/\s{2,}/g,' ').trim();
  }

  function h3EnTitle(faTitle){
    const base = cleanFaTitle((faTitle || '').trim());
    if(H3_MAP[base]) return H3_MAP[base];
    const m = base.match(/^سناریو\s*(\d+)/);
    if(m) return 'Scenario ' + m[1];
    return base; // fallback: keep the Persian title (better than random wrong translation)
  }

  const MINI_KEYS = {
    'در یک جمله': 'One-liner',
    'سؤال کلیدی': 'Key question',
    'پادزهر اصلی': 'Main antidote',
  };

  function normLang(x){
    x = (x || '').toString().toLowerCase().trim();
    return x.startsWith('en') ? 'en' : 'fa';
  }

  function getLang(){
    try {
      return normLang(localStorage.getItem(LANG_KEY) || root.lang || 'fa');
    } catch(e) {
      return normLang(root.lang || 'fa');
    }
  }

  function t(key, lang){
    lang = lang || getLang();
    return (UI[lang] && UI[lang][key]) || (UI.fa[key] || key);
  }

  function rememberText(el){
    if(!el) return;
    if(!el.dataset.miFaText) el.dataset.miFaText = el.textContent || '';
  }
  function setText(el, text){
    if(!el) return;
    el.textContent = text;
  }

  function toggleLangBlocks(lang){
    // Some bilingual blocks are injected at runtime (hero minis, etc.).
    // Keep this idempotent and cheap.
    document.querySelectorAll('[data-mi-lang]').forEach(el => {
      el.hidden = el.getAttribute('data-mi-lang') !== lang;
    });
  }

  function trapId(){
    return (document.body && document.body.dataset && document.body.dataset.trapId) ||
      (location.pathname.split('/').pop() || '').replace(/\.html$/,'') || '';
  }

  function trapEnTitle(id){
    const it = TRAPS_EN[id];
    return it ? it.title : (id || '').replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  function trapEnLead(id){
    const it = TRAPS_EN[id];
    return it ? it.lead : '';
  }

  // -----------------------
  // Theme
  // -----------------------
  function applyTheme(theme){
    root.setAttribute('data-theme', theme);
    try{
      localStorage.setItem(THEME_KEY, theme);
      localStorage.setItem(LEGACY_THEME_KEY, theme);
    }catch(e){}

    const meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', theme === 'light' ? '#fbfaf8' : '#070b14');

    const btn = document.querySelector('[data-theme-toggle]');
    if(btn){
      btn.textContent = theme === 'light' ? '☀️' : '🌙';
      const lang = getLang();
      btn.title = theme === 'light' ? t('themeLight', lang) : t('themeDark', lang);
      btn.setAttribute('aria-label', btn.title);
    }
  }

  function initTheme(){
    let theme = 'dark';
    try{
      let saved = localStorage.getItem(THEME_KEY);
      if(!saved) saved = localStorage.getItem(LEGACY_THEME_KEY);
      if(saved === 'light' || saved === 'dark') theme = saved;
      else {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        theme = prefersLight ? 'light' : 'dark';
      }
      // migrate legacy -> new key (best effort)
      if(!localStorage.getItem(THEME_KEY) && (saved === 'light' || saved === 'dark')){
        try{ localStorage.setItem(THEME_KEY, saved); }catch(e){}
      }
    }catch(e){}

    applyTheme(theme);

    const tbtn = document.querySelector('[data-theme-toggle]');
    if(tbtn){
      tbtn.addEventListener('click', () => {
        const cur = root.getAttribute('data-theme') || 'dark';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
      });
    }
  }

  // -----------------------
  // Theme button (for consistency with main app)
  // -----------------------
  function ensureThemeButton(){
    const nav = document.querySelector('.tp-nav') || document.querySelector('.tp-hero__actions');
    if(!nav) return;
    if(nav.querySelector('[data-theme-toggle]')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tp-btn';
    btn.setAttribute('data-theme-toggle', '1');
    btn.textContent = '🌙';

    const langBtn = nav.querySelector('[data-mi-langbtn="1"]');
    if(langBtn) langBtn.insertAdjacentElement('beforebegin', btn);
    else nav.appendChild(btn);
  }

  // -----------------------
  // Language toggle button
  // -----------------------
  function ensureLangButton(){
    const nav = document.querySelector('.tp-nav') || document.querySelector('.tp-hero__actions');
    if(!nav) return;
    if(nav.querySelector('[data-mi-langbtn="1"]')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tp-btn';
    btn.setAttribute('data-mi-langbtn', '1');
    btn.textContent = 'EN';

    const themeBtn = nav.querySelector('[data-theme-toggle]');
    if(themeBtn && themeBtn.parentElement === nav){
      themeBtn.insertAdjacentElement('afterend', btn);
    } else {
      nav.appendChild(btn);
    }
  }

  function wireLang(){
    document.querySelectorAll('[data-mi-langbtn="1"]').forEach(btn => {
      if(btn.dataset.miWired === '1') return;
      btn.dataset.miWired = '1';
      btn.addEventListener('click', () => {
        applyLang(getLang() === 'fa' ? 'en' : 'fa');
      });
    });
  }

  // -----------------------
  // Apply language (UI + title/lead)
  // -----------------------
  function applyLang(lang){
    lang = normLang(lang);
    const isFa = lang === 'fa';

    root.lang = lang;
    root.dir = isFa ? 'rtl' : 'ltr';
    root.setAttribute('data-lang', lang);

    // NOTE: bilingual blocks may be injected later (hero minis, section summaries).
    // So we toggle again at the end of applyLang.

    // Update language buttons
    document.querySelectorAll('[data-mi-langbtn="1"]').forEach(btn => {
      btn.textContent = isFa ? 'EN' : 'FA';
      const tt = isFa ? 'English' : 'فارسی';
      btn.setAttribute('title', tt);
      btn.setAttribute('aria-label', tt);
    });

    // Nav labels
    const nav = document.querySelector('.tp-nav');
    if(nav){
      nav.querySelectorAll('a.tp-btn').forEach(a => {
        const href = a.getAttribute('href') || '';
        rememberText(a);
        if(href.includes('../index.html')) setText(a, t('app', lang));
        else if(href.includes('./index.html')) setText(a, t('list', lang));
      });
    }

    // Chip + title + lead
    const chip = document.querySelector('.tp-chip');
    if(chip){ rememberText(chip); setText(chip, isFa ? chip.dataset.miFaText : t('chip', lang)); }

    const h1 = document.querySelector('.tp-h1');
    if(h1){ rememberText(h1); setText(h1, isFa ? h1.dataset.miFaText : trapEnTitle(trapId())); }

    const lead = document.querySelector('.tp-lead');
    if(lead){
      rememberText(lead);
      setText(lead, isFa ? lead.dataset.miFaText : (trapEnLead(trapId()) || lead.dataset.miFaText));
    }

    // Meta badges
    document.querySelectorAll('.tp-meta .tp-badge').forEach(b => {
      rememberText(b);
      if(isFa){ setText(b, b.dataset.miFaText); return; }
      const txt = (b.dataset.miFaText || '').trim();
      if(txt.startsWith('شناسه:')) {
        setText(b, txt.replace('شناسه:', t('id', lang)));
      } else if(txt.startsWith('زمان مطالعه:')) {
        // "زمان مطالعه: حدود 3 دقیقه"
        let out = txt.replace('زمان مطالعه:', t('readTime', lang))
          .replace('حدود', t('about', lang))
          .replace('دقیقه', t('min', lang));
        setText(b, out);
      }
    });

    // Hero actions
    const copyBtn = document.querySelector('[data-copy-link]');
    if(copyBtn){ rememberText(copyBtn); setText(copyBtn, isFa ? copyBtn.dataset.miFaText : t('copy', lang)); }

    document.querySelectorAll('.tp-hero__actions a.tp-btn').forEach(a => {
      const href = a.getAttribute('href') || '';
      rememberText(a);
      if(href === '#quick') setText(a, isFa ? a.dataset.miFaText : t('quick', lang));
      if(href === '#fix')   setText(a, isFa ? a.dataset.miFaText : t('fixes', lang));
    });

    // TOC
    const tocTitle = document.querySelector('.tp-toc__title');
    if(tocTitle){ rememberText(tocTitle); setText(tocTitle, isFa ? tocTitle.dataset.miFaText : t('tocTitle', lang)); }
    document.querySelectorAll('.tp-toc__item').forEach(a => {
      const href = (a.getAttribute('href')||'').replace('#','');
      rememberText(a);
      if(isFa){ setText(a, a.dataset.miFaText); return; }
      if(SECTIONS[href]) setText(a, SECTIONS[href].en);
    });

    syncMobileToc(lang);

    // Section headings
    Object.keys(SECTIONS).forEach(id => {
      const sec = document.getElementById(id);
      if(!sec) return;
      const h2 = sec.querySelector('.tp-h2');
      if(!h2) return;
      rememberText(h2);
      setText(h2, isFa ? h2.dataset.miFaText : SECTIONS[id].en + (id === 'quick' ? ' (30s)' : ''));
    });

    // Sub-section headings (H3) inside cards/subcards
    document.querySelectorAll('.tp-h3').forEach(h3 => {
      rememberText(h3);
      if(isFa){
        setText(h3, cleanFaTitle(h3.dataset.miFaText));
      } else {
        setText(h3, h3EnTitle(h3.dataset.miFaText));
      }
    });

    // Mini keys
    document.querySelectorAll('.tp-mini__k').forEach(k => {
      rememberText(k);
      if(isFa){ setText(k, k.dataset.miFaText); return; }
      const faKey = (k.dataset.miFaText || '').trim();
      if(MINI_KEYS[faKey]) setText(k, MINI_KEYS[faKey]);
    });

    // Callout title
    const coTitle = document.querySelector('.tp-callout__title');
    if(coTitle){ 
      rememberText(coTitle);
      if(!isFa) setText(coTitle, 'Fast exit');
      else setText(coTitle, coTitle.dataset.miFaText);
    }

    // Footer buttons
    document.querySelectorAll('.tp-footer .tp-btn').forEach(a => {
      rememberText(a);
      const href = a.getAttribute('href') || '';
      if(href.includes('./index.html')) setText(a, isFa ? a.dataset.miFaText : t('backList', lang));
      else if(href.includes('../index.html')) setText(a, isFa ? a.dataset.miFaText : t('backApp', lang));
    });

    // Document title
    const titleEl = document.querySelector('title');
    if(titleEl) {
      if(!titleEl.dataset.miFaText) titleEl.dataset.miFaText = document.title;
      document.title = isFa ? titleEl.dataset.miFaText : ('Cognitive trap: ' + trapEnTitle(trapId()) + ' | Mind Islands');
    }

    // Update theme toggle label after lang switch
    const curTheme = root.getAttribute('data-theme') || 'dark';
    applyTheme(curTheme);

    syncBilingualDetails(lang);

    // Toggle any bilingual blocks (including ones injected by syncBilingualDetails)
    toggleLangBlocks(lang);

    try{ localStorage.setItem(LANG_KEY, lang); }catch(e){}
  }

  // -----------------------
  // Accent
  // -----------------------
  function initAccent(){
    const body = document.body;
    const h = parseInt(getComputedStyle(body).getPropertyValue('--accent-h')) || 210;
    body.style.setProperty('--accent-h', String(h));
  }

  // -----------------------
  // Progress
  // -----------------------
  function initProgress(){
    const bar = document.querySelector('.tp-progress__bar');
    function onScroll(){
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const p = (doc.scrollTop / max) * 100;
      if(bar) bar.style.width = p.toFixed(2) + '%';
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
  }

  // -----------------------
  // Copy link
  // -----------------------
  function initCopy(){
    const cbtn = document.querySelector('[data-copy-link]');
    if(!cbtn) return;

    cbtn.addEventListener('click', async () => {
      const lang = getLang();
      const done = () => {
        const old = cbtn.textContent || t('copy', lang);
        cbtn.textContent = t('copied', lang);
        setTimeout(() => { cbtn.textContent = old; }, 1200);
      };

      try{
        await navigator.clipboard.writeText(location.href);
        done();
      }catch(e){
        const tmp = document.createElement('input');
        tmp.value = location.href;
        document.body.appendChild(tmp);
        tmp.select();
        try{ document.execCommand('copy'); }catch(_){ }
        tmp.remove();
        done();
      }
    });
  }

  // -----------------------
  // Smooth anchors
  // -----------------------
  function initAnchors(){
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (ev) => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if(el){
          ev.preventDefault();
          el.scrollIntoView({behavior:'smooth', block:'start'});
          history.replaceState(null, '', '#' + id);
        }
      });
    });
  }

  // -----------------------
  // Reveal animations
  // -----------------------
  function initReveal(){
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sel = [
      '.tp-hero__titlebox',
      '.tp-mini',
      '.tp-card',
      '.tp-subcard',
      '.tp-linkcard',
      '.tp-toc'
    ].join(',');

    const els = Array.from(document.querySelectorAll(sel));
    if(!els.length) return;

    if(!('IntersectionObserver' in window)){
      els.forEach(el => el.classList.add('is-in'));
      return;
    }

    els.forEach((el, i) => {
      el.classList.add('mi-reveal');
      el.style.setProperty('--mi-delay', (Math.min(8, i % 9) * 45) + 'ms');
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if(en.isIntersecting){
          en.target.classList.add('is-in');
          obs.unobserve(en.target);
        }
      });
    }, {threshold: 0.14, rootMargin: '0px 0px -12% 0px'});

    els.forEach(el => obs.observe(el));
  }

  // -----------------------
// Bilingual details (summary box + details in current language)
// -----------------------

// A small per-trap "antidote" & "key question" layer to make EN feel real,
// without translating every Persian paragraph.
const ANTIDOTE_EN = {
  action_bias: 'Pause for 2 minutes. Ask: “What happens if I wait, and what data do I gain?” Then pick the smallest reversible step.',
  all_or_nothing: 'Replace extremes with a 0–100 scale. Aim for the next 10%, not perfection.',
  ambiguity_effect: 'Turn unknowns into a quick experiment. Get one datapoint before you reject the option.',
  analysis_paralysis: 'Timebox the analysis. Decide with a “good enough + next check” plan.',
  anchoring: 'Re-anchor with ranges and independent estimates before you look at the first number again.',
  availability_heuristic: 'Ask for base rates and a second example that contradicts the first vivid story.',
  bandwagon: 'Separate popularity from evidence. Ask: “If nobody was doing this, would I still choose it?”',
  cascade: 'Write your view before you hear others. Then compare and state your uncertainty explicitly.',
  catastrophizing: 'Name the worst case, then compute the most likely case and a coping plan.',
  complexity_bias: 'Prefer the simplest explanation that fits the facts. Start with the cheap test.',
  confirmation_bias: 'Actively seek disconfirming evidence. Write the strongest counter‑argument first.',
  cynicism: 'Look for alternative motives and one positive explanation that could also be true.',
  devils_advocate_trap: 'Critique with a goal: improve the idea. Offer a concrete alternative or stop.',
  dunning_kruger: 'Calibrate confidence. Use feedback, benchmarks, and “what would I need to be wrong?”',
  echo_chamber: 'Add one high‑quality opposing source. Summarize it fairly before responding.',
  emotional_reasoning: 'Treat feelings as signals, not proofs. Ask: “What would I believe if I felt calm?”',
  empathy_overload: 'Set boundaries: define what you can do, what you can’t, and a recovery window.',
  false_dilemma: 'Generate a third option. Then a fourth. Options break the trap.',
  forest_for_trees: 'Zoom out: restate the goal in one sentence, then pick the 1–2 details that matter.',
  fundamental_attribution: 'Check the situation. Ask: “What constraints would make anyone act this way?”',
  groupthink: 'Invite dissent. Assign a “red team” and reward the best objection.',
  halo_effect: 'Rate traits separately. One strength is not a full character reference.',
  hindsight: 'Log predictions before outcomes. Judge decisions by process, not memory.',
  idea_hoarding: 'Ship one tiny thing. Turn ideas into a 48‑hour micro‑prototype.',
  isolation_bias: 'Get one outside perspective. A 5‑minute sanity check beats a week of solo looping.',
  loss_aversion: 'Reframe as “expected value.” Ask: “What’s the cost of not acting?”',
  mind_reading: 'Ask instead of guessing. Replace assumptions with a direct question.',
  nitpicking: 'Set a quality bar and stop. Fix what moves outcomes, not what scratches the ego.',
  novelty_bias: 'Ask what problem it solves. Keep the old tool until the new one proves value.',
  optimism_bias: 'Run a premortem. List 3 ways it fails and one mitigation each.',
  outcome_bias: 'Judge the decision by information available at the time, not the result.',
  over_thinking: 'Move from thinking to testing. One action that creates feedback.',
  overconfidence: 'Use ranges and error bars. Ask for a counterexample.',
  overthinking_past: 'Extract the lesson, then close the loop with one present‑day action.',
  perfectionism: 'Define “done.” Ship at 80% and iterate.',
  planning_fallacy: 'Use reference class forecasting: compare with similar past tasks.',
  premature_optimization: 'Make it work, then make it fast. Measure before optimizing.',
  projection: 'Separate “me” from “them.” Verify with a question, not a story.',
  recency_bias: 'Average over time. Check longer windows before concluding.',
  regret: 'Shift from “if only” to “next time.” Pick one controllable change.',
  rumination: 'Schedule worry time. Then redirect to a small task.',
  satisficing: 'Define minimum criteria. Don’t stop at the first acceptable option without checking 1 alternative.',
  self_blame: 'Separate responsibility from blame. List controllables vs uncontrollables.',
  shiny_object: 'Create a “parking lot.” Don’t switch until the current goal hits a milestone.',
  single_cause: 'List at least 3 contributing factors. Complex problems rarely have one cause.',
  small_sample: 'Collect more data or widen the sample. Ask what you might be missing.',
  status_quo: 'Consider the cost of staying. Run a small change experiment.',
  style_paralysis: 'Timebox polish. Prioritize clarity over aesthetics, then ship.',
  sunk_cost: 'Ignore past cost. Decide based on future value and current evidence.',
  survivorship_bias: 'Look for the silent failures. Ask: “Who isn’t in my dataset?”',
  tunnel_vision: 'Generate alternatives. If you can’t name 3 options, you’re tunneling.'
};

const KEYQ_EN = {
  confirmation_bias: 'Am I trying to be right or to be accurate?',
  anchoring: 'If I never saw the first number, what would I estimate?',
  analysis_paralysis: 'What decision would I make with 70% certainty?',
  perfectionism: 'What does “done” look like, in one sentence?',
  planning_fallacy: 'What happened the last time I thought this would be quick?',
  sunk_cost: 'If I started today, would I still continue?',
  groupthink: 'What is the best argument against our favorite option?',
  echo_chamber: 'What would a smart person who disagrees say?',
  catastrophizing: 'What is the most likely outcome, not the loudest fear?',
};

function antidoteEn(trap){
  return ANTIDOTE_EN[trap] || 'Name it. Widen options. Run a small test that creates feedback.';
}
function keyQEn(trap){
  return KEYQ_EN[trap] || 'What would change my mind, and what is the smallest test I can run?';
}

function heroEnValue(kind, trap){
  const title = trapEnTitle(trap);
  const lead  = trapEnLead(trap);

  if(kind === 'one'){
    // A clean, professional one-liner.
    return (title ? (title + ' is ') : '') + (lead ? lead.toLowerCase() : 'a common thinking trap') + '.';
  }
  if(kind === 'q'){
    return keyQEn(trap);
  }
  return antidoteEn(trap);
}

function ensureHeroBilingual(){
  if(!document.body || document.body.dataset.miHeroEnBuilt === '1') return;

  const trap = trapId();
  const cards = Array.from(document.querySelectorAll('.tp-hero__minicards .tp-mini'));
  cards.forEach((card, i) => {
    const v = card.querySelector('.tp-mini__v');
    if(!v || v.dataset.miBilingual === '1') return;
    v.dataset.miBilingual = '1';

    const faText = (v.textContent || '').trim();
    const kind = i === 0 ? 'one' : (i === 1 ? 'q' : 'anti');
    const enText = heroEnValue(kind, trap);

    v.textContent = '';
    const fa = document.createElement('div');
    fa.setAttribute('data-mi-lang', 'fa');
    fa.textContent = faText;

    const en = document.createElement('div');
    en.setAttribute('data-mi-lang', 'en');
    en.textContent = enText;

    v.appendChild(fa);
    v.appendChild(en);
  });

  document.body.dataset.miHeroEnBuilt = '1';
}

function el(tag, className, text){
  const e = document.createElement(tag);
  if(className) e.className = className;
  if(text != null) e.textContent = text;
  return e;
}

function list(tag, cls, items){
  const u = el(tag, cls);
  (items || []).forEach(it => u.appendChild(el('li', '', it)));
  return u;
}

function buildRelatedEn(faWrap){
  const grid = faWrap.querySelector('.tp-linkgrid');
  if(!grid) return null;
  const clone = grid.cloneNode(true);
  clone.querySelectorAll('a.tp-linkcard').forEach(a => {
    const href = a.getAttribute('href') || '';
    const id = (href.split('/').pop() || '').replace(/\.html$/,'');
    const titleEl = a.querySelector('.tp-linkcard__title');
    if(titleEl){
      rememberText(titleEl);
      titleEl.textContent = trapEnTitle(id);
    }
  });
  return clone;
}

function buildEnDetails(sectionId, trap, faWrap){
  const frag = document.createDocumentFragment();
  const title = trapEnTitle(trap);
  const lead  = trapEnLead(trap);

  if(sectionId === 'what'){
    frag.appendChild(el('p', 'tp-p', (lead ? (lead + '. ') : '') + 'This trap feels like clarity, but it quietly filters information and narrows options.'));
    const g = el('div', 'tp-grid2');

    const why = el('div', 'tp-subcard');
    why.appendChild(el('h3', 'tp-h3', 'Why it happens'));
    why.appendChild(el('p', 'tp-p', 'Your brain prefers fast certainty. Under time pressure, stress, or identity threats, it chooses the easiest story.'));
    why.appendChild(el('p', 'tp-p', 'The short-term reward is relief. The long-term cost is repeating the same errors with higher confidence.'));
    g.appendChild(why);

    const loop = el('div', 'tp-subcard');
    loop.appendChild(el('h3', 'tp-h3', 'Trap loop'));
    loop.appendChild(list('ol', 'tp-ol', [
      'Trigger: pressure, uncertainty, or a high-stakes choice.',
      'Automatic thought: "' + keyQEn(trap) + '" (usually answered too quickly).',
      'Behavior: narrow the evidence, pick the familiar frame, dismiss frictions.',
      'Short-term result: “I feel sure.”',
      'Long-term result: avoidable mistakes, repair work, and friction.',
      'Reinforcement: because it felt good short-term, the pattern repeats.'
    ]));
    g.appendChild(loop);

    frag.appendChild(g);

    const det = el('details', 'tp-details');
    det.appendChild(el('summary', '', 'Base notes (condensed)'));
    const body = el('div', 'tp-details__body');
    const p = el('p', 'tp-p tp-preline');
    p.textContent =
      'Definition: ' + (title || trap) + '.\n'
      + 'How it traps you: it swaps careful checking for a quick story.\n'
      + 'Common signs:\n'
      + '• You feel very certain very fast.\n'
      + '• Counter‑evidence feels “irrelevant” or “annoying.”\n'
      + '• You defend the decision before testing it.\n'
      + 'Examples:\n'
      + '• You cherry-pick comments that support your view.\n'
      + '• You ignore uncomfortable metrics.\n'
      + 'Fast exit:\n'
      + '• ' + antidoteEn(trap) + '\n';
    body.appendChild(p);
    det.appendChild(body);
    frag.appendChild(det);
    return frag;
  }

  if(sectionId === 'cost'){
    const g = el('div', 'tp-grid2');
    const costs = el('div', 'tp-subcard');
    costs.appendChild(el('h3','tp-h3','Hidden costs'));
    costs.appendChild(list('ul','tp-ul',[
      'Lower decision quality (blind spots stay hidden).',
      'Wasted time (you fix what you could have prevented).',
      'More stress (because reality keeps “surprising” you).',
      'Relationship friction (others feel unheard or overridden).'
    ]));
    g.appendChild(costs);

    const signs = el('div','tp-subcard');
    signs.appendChild(el('h3','tp-h3','Common signs'));
    signs.appendChild(list('ul','tp-ul',[
      'You dismiss objections quickly instead of exploring them.',
      'You use one story to explain everything.',
      'You seek reassurance more than information.',
      'You make decisions when tired/stressed and call it “intuition.”',
      'You feel attacked when asked for evidence.',
      'You struggle to name what would change your mind.'
    ]));
    g.appendChild(signs);

    frag.appendChild(g);
    return frag;
  }

  if(sectionId === 'scenarios'){
    const g = el('div','tp-grid2');

    const s1 = el('div','tp-subcard');
    s1.appendChild(el('h3','tp-h3','Scenario 1 (work)'));
    const p1 = el('p','tp-p tp-preline');
    p1.textContent =
      'Scenario:\n'
      + 'You feel confident about a decision. You selectively notice signals that support it and downplay warnings.\n'
      + 'Fast exit:\n'
      + 'Write one “failure story” in 3 lines, then find one datapoint that could falsify your plan.';
    s1.appendChild(p1);
    g.appendChild(s1);

    const s2 = el('div','tp-subcard');
    s2.appendChild(el('h3','tp-h3','Scenario 2 (daily life)'));
    const p2 = el('p','tp-p tp-preline');
    p2.textContent =
      'Scenario:\n'
      + 'Online or in conversations, you consume mostly confirming inputs. Disagreement feels like ignorance, not information.\n'
      + 'Fast exit:\n'
      + 'Spend 2 minutes with a reputable opposing source. Summarize it fairly before you respond.';
    s2.appendChild(p2);
    g.appendChild(s2);

    frag.appendChild(g);
    return frag;
  }

  if(sectionId === 'quick'){
    frag.appendChild(el('p','tp-p','Answer quickly. If 3+ are “yes”, this trap is probably active.'));
    const q = [
      'Am I “decided” before I’ve looked at data?',
      'Are my information sources mostly similar?',
      'Did I label the disagreeing person instead of checking the claim?',
      'Am I hunting for a single reassuring sentence?',
      'Do I feel irritated by negative data?',
      'Am I tired or stressed while deciding?',
      'Can I state exactly what would change my mind?',
      'Would a neutral person endorse my process?'
    ];
    const ul = el('ul','tp-ul tp-checklist');
    q.forEach(txt=>{
      const li = document.createElement('li');
      const lab = document.createElement('label');
      const inp = document.createElement('input'); inp.type='checkbox';
      const sp = document.createElement('span'); sp.textContent = txt;
      lab.appendChild(inp); lab.appendChild(document.createTextNode(' ')); lab.appendChild(sp);
      li.appendChild(lab);
      ul.appendChild(li);
    });
    frag.appendChild(ul);

    const call = el('div','tp-callout');
    call.appendChild(el('div','tp-callout__icon','⚡'));
    const inner = document.createElement('div');
    inner.appendChild(el('div','tp-callout__title','Fast exit'));
    inner.appendChild(el('div','tp-callout__text','3 slow breaths. Then ask: “What evidence would prove the opposite?” Find one such datapoint.'));
    call.appendChild(inner);
    frag.appendChild(call);

    return frag;
  }

  if(sectionId === 'fix'){
    const summary = el('div','tp-subcard');
    summary.appendChild(el('h3','tp-h3','Suggested fix (summary)'));
    const p = el('p','tp-p tp-preline');
    p.textContent = antidoteEn(trap) + '\n\n✅ 30‑second move: write one counter‑evidence item and pick one reversible next step.';
    summary.appendChild(p);
    frag.appendChild(summary);

    const g = el('div','tp-grid2 mt-4');
    const a1 = el('div','tp-subcard');
    a1.appendChild(el('h3','tp-h3','Antidotes'));
    a1.appendChild(list('ul','tp-ul',[
      'Golden question: “If I’m wrong, what would show it?”',
      'Rule of 3: gather 3 independent signals (not 3 similar opinions).',
      'Ask for the best objection and just listen.',
      'Turn arguments into hypotheses and tests.',
      'Avoid final decisions when exhausted or emotional.',
      'Log your reasoning so you can learn, not rewrite history.'
    ]));
    g.appendChild(a1);

    const a2 = el('div','tp-subcard');
    a2.appendChild(el('h3','tp-h3','Common mistakes'));
    a2.appendChild(list('ul','tp-ul',[
      'Doing “positive thinking” instead of collecting evidence.',
      'Debating people instead of testing assumptions.',
      'Trying to solve it once and forever, not by small reps.',
      'Optimizing details before you validate direction.'
    ]));
    g.appendChild(a2);

    frag.appendChild(g);
    return frag;
  }

  if(sectionId === 'practice'){
    const g = el('div','tp-grid2');

    const ex = el('div','tp-subcard');
    ex.appendChild(el('h3','tp-h3','Useful exercises'));
    ex.appendChild(list('ul','tp-ul',[
      '30 seconds: write “I might be wrong because…” and list one counter‑signal.',
      '5 minutes: write 3 alternatives and one strong reason each could be better.',
      '15 minutes: run a premortem: assume failure and list 3 plausible causes.'
    ]));
    g.appendChild(ex);

    const plan = el('div','tp-subcard');
    plan.appendChild(el('h3','tp-h3','7-day plan'));
    plan.appendChild(list('ol','tp-ol',[
      'Day 1: name the trap when you notice it.',
      'Day 2: identify your common trigger (time, people, topic).',
      'Day 3: create a 3‑question pre‑decision checklist.',
      'Day 4: deliberately seek one counter‑evidence item.',
      'Day 5: practice asking questions instead of defending.',
      'Day 6: run a tiny test (A/B or small trial).',
      'Day 7: review: what improved, where did you slip, why?'
    ]));
    g.appendChild(plan);

    frag.appendChild(g);
    return frag;
  }

  if(sectionId === 'journal'){
    frag.appendChild(el('p','tp-p','Pick one and write for 5 minutes. The goal is pattern‑spotting, not perfect analysis.'));
    frag.appendChild(list('ul','tp-ul',[
      'What story am I telling myself right now?',
      'What are two alternative explanations?',
      'What evidence would change my mind?',
      'What is the real probability of the worst case?',
      'Which part of this is tied to my identity?',
      'What tiny experiment could clarify this within 24 hours?'
    ]));
    return frag;
  }

  if(sectionId === 'related'){
    frag.appendChild(el('p','tp-p','These traps often show up together. Spot the combo to prevent double‑trapping yourself.'));
    const rel = buildRelatedEn(faWrap);
    if(rel) frag.appendChild(rel);
    return frag;
  }

  // fallback: nothing
  return frag;
}

function setSumBody(container, lines){
  if(!container) return;
  container.innerHTML = '';
  (lines || []).filter(Boolean).forEach(line => {
    const p = el('p','tp-enP', line);
    container.appendChild(p);
  });
}

function faSummaryLines(sectionId){
  if(sectionId === 'what') return ['خلاصه: تعریف کوتاه + مکانیزم فعال شدن تله.', 'اگر جزئیات را می‌خواهی، بخش زیر را ببین.'];
  if(sectionId === 'cost') return ['خلاصه: هزینه‌های پنهان + نشانه‌های رایج.', 'برای جزئیات، لیست‌های زیر را مرور کن.'];
  if(sectionId === 'scenarios') return ['خلاصه: دو سناریوی واقعی (کار/زندگی) برای دیدن تله در عمل.'];
  if(sectionId === 'quick') return ['خلاصه: چک سریع ۳۰ ثانیه‌ای. اگر ۳ مورد یا بیشتر “بله” شد، تله فعال است.'];
  if(sectionId === 'fix') return ['خلاصه: چند ضد-حرکت ساده برای خروج از تله.'];
  if(sectionId === 'practice') return ['خلاصه: تمرین‌های کوتاه + برنامه ۷ روزه برای تثبیت تغییر.'];
  if(sectionId === 'journal') return ['خلاصه: پرسش‌ها برای ژورنالینگ و دیدن الگوها.'];
  if(sectionId === 'related') return ['خلاصه: تله‌های نزدیک که معمولاً با هم ظاهر می‌شوند.'];
  return [''];
}

function enSummaryLines(sectionId, trap){
  const title = trapEnTitle(trap);
  if(sectionId === 'what') return ['Summary: what it is and how it biases your judgment.', 'Key question: ' + keyQEn(trap)];
  if(sectionId === 'cost') return ['Summary: typical costs and the most common signs.', 'If it keeps repeating, this section explains why.'];
  if(sectionId === 'scenarios') return ['Summary: two realistic scenarios so you can recognize the pattern quickly.'];
  if(sectionId === 'quick') return ['Summary: a 30‑second checklist. 3+ “yes” usually means it’s active.'];
  if(sectionId === 'fix') return ['Summary: practical moves to exit the trap today.', 'Main antidote: ' + antidoteEn(trap)];
  if(sectionId === 'practice') return ['Summary: short exercises + a 7‑day plan to make it stick.'];
  if(sectionId === 'journal') return ['Summary: prompts to reveal the story your mind is running.'];
  if(sectionId === 'related') return ['Summary: traps that often co‑occur with ' + title + '.'];
  return [''];
}

function ensureBilingualSections(){
  if(!document.body || document.body.dataset.miDetailsBuilt === '1') return;

  const sections = Array.from(document.querySelectorAll('.tp-card[id]'));
  sections.forEach(sec => {
    if(sec.dataset.miWrapped === '1') return;
    sec.dataset.miWrapped = '1';

    const h2 = sec.querySelector('.tp-h2');
    if(!h2) return;

    // Collect everything after H2 as FA details
    const nodes = [];
    let n = h2.nextSibling;
    while(n){
      const nxt = n.nextSibling;
      nodes.push(n);
      n = nxt;
    }

    const sumBox = document.createElement('div');
    sumBox.className = 'tp-sumBox';
    sumBox.innerHTML =
      '<div class="tp-sumBox__head">'
      + '<div class="tp-sumBox__title"></div>'
      + '<button type="button" class="tp-sumBox__toggle" data-mi-toggle-details="1"></button>'
      + '</div>'
      + '<div class="tp-sumBox__body"></div>';

    const faWrap = document.createElement('div');
    faWrap.className = 'tp-detailWrap';
    faWrap.setAttribute('data-mi-detail-lang','fa');
    nodes.forEach(node => faWrap.appendChild(node));

    const enWrap = document.createElement('div');
    enWrap.className = 'tp-detailWrap';
    enWrap.setAttribute('data-mi-detail-lang','en');

    // Populate EN details from template, using what we already have in faWrap for related links
    const trap = trapId();
    enWrap.appendChild(buildEnDetails(sec.id, trap, faWrap));

    h2.insertAdjacentElement('afterend', sumBox);
    sumBox.insertAdjacentElement('afterend', enWrap);
    enWrap.insertAdjacentElement('afterend', faWrap);

    const btn = sumBox.querySelector('[data-mi-toggle-details="1"]');
    if(btn){
      btn.addEventListener('click', () => {
        const open = (sec.dataset.miOpen || '0') === '1';
        sec.dataset.miOpen = open ? '0' : '1';
        syncBilingualDetails(getLang());
        if(!open){
          try{ sec.scrollIntoView({behavior:'smooth', block:'start'}); }catch(e){}
        }
      });
    }
  });

  document.body.dataset.miDetailsBuilt = '1';
}

function syncBilingualDetails(lang){
  lang = normLang(lang);
  const isFa = lang === 'fa';
  ensureHeroBilingual();
  ensureBilingualSections();

  const trap = trapId();

  document.querySelectorAll('.tp-card[id]').forEach(sec => {
    const sum = sec.querySelector('.tp-sumBox');
    const faWrap = sec.querySelector('.tp-detailWrap[data-mi-detail-lang="fa"]');
    const enWrap = sec.querySelector('.tp-detailWrap[data-mi-detail-lang="en"]');
    if(!sum || !faWrap || !enWrap) return;

    // Default behavior: FA shows details, EN shows summary first.
    if(!sec.dataset.miOpen){
      sec.dataset.miOpen = isFa ? '1' : '0';
    }
    const open = (sec.dataset.miOpen || '0') === '1';

    const title = sum.querySelector('.tp-sumBox__title');
    if(title) title.textContent = isFa ? 'خلاصه' : 'Summary';

    const body = sum.querySelector('.tp-sumBox__body');
    setSumBody(body, isFa ? faSummaryLines(sec.id) : enSummaryLines(sec.id, trap));

    const tbtn = sum.querySelector('[data-mi-toggle-details="1"]');
    if(tbtn){
      tbtn.textContent = open ? (isFa ? 'پنهان کردن جزئیات' : 'Hide details') : (isFa ? 'نمایش جزئیات' : 'Show details');
    }

    // Show only the current language details, and only when open
    faWrap.hidden = !(isFa && open);
    enWrap.hidden = !(!isFa && open);
  });

  // Related trap titles: translate link cards in EN (avoid mixed language)
  document.querySelectorAll('.tp-linkcard__title').forEach(tt => {
    rememberText(tt);
    if(isFa) tt.textContent = tt.dataset.miFaText;
    else {
      // Read id from sibling meta or href
      const card = tt.closest('a.tp-linkcard');
      const href = card ? (card.getAttribute('href')||'') : '';
      const id = (href.split('/').pop() || '').replace(/\.html$/,'');
      tt.textContent = trapEnTitle(id);
    }
  });

  toggleLangBlocks(lang);
}

// -----------------------
  // Mobile TOC (bottom sheet)
  // -----------------------
  function ensureMobileTocUI(){
    if(document.getElementById('mi-toc-open')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'mi-toc-open';
    btn.className = 'tp-mtocBtn';
    btn.innerHTML = '<span class="tp-mtocBtn__icon">☰</span><span class="tp-mtocBtn__label"></span>';
    document.body.appendChild(btn);

    const sheet = document.createElement('div');
    sheet.id = 'mi-toc-sheet';
    sheet.className = 'tp-sheet';
    sheet.innerHTML = `
      <div class="tp-sheet__backdrop" data-sheet-close="1"></div>
      <div class="tp-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="mi-toc-title">
        <div class="tp-sheet__head">
          <div class="tp-sheet__title" id="mi-toc-title"></div>
          <button class="tp-iconBtn tp-sheet__close" type="button" data-sheet-close="1" aria-label="Close">✕</button>
        </div>
        <div class="tp-sheet__body">
          <nav class="tp-toc tp-toc--sheet">
            <div class="tp-toc__links" id="mi-toc-links"></div>
          </nav>
        </div>
      </div>`;
    document.body.appendChild(sheet);

    function close(){
      sheet.classList.remove('is-open');
      document.body.classList.remove('tp-noscroll');
      btn.setAttribute('aria-expanded','false');
    }
    function open(){
      syncMobileToc(getLang());
      sheet.classList.add('is-open');
      document.body.classList.add('tp-noscroll');
      btn.setAttribute('aria-expanded','true');
      // focus close
      const c = sheet.querySelector('[data-sheet-close="1"]');
      if(c) setTimeout(()=>c.focus(), 20);
    }

    btn.addEventListener('click', () => {
      if(sheet.classList.contains('is-open')) close();
      else open();
    });

    sheet.addEventListener('click', (ev) => {
      const t = ev.target;
      if(t && t.getAttribute && t.getAttribute('data-sheet-close') === '1') close();
    });

    sheet.addEventListener('click', (ev) => {
      const a = ev.target && ev.target.closest ? ev.target.closest('a[href^="#"]') : null;
      if(!a) return;
      close();
    });

    document.addEventListener('keydown', (ev) => {
      if(ev.key === 'Escape' && sheet.classList.contains('is-open')) close();
    });
  }

  function syncMobileToc(lang){
    const btn = document.getElementById('mi-toc-open');
    const title = document.getElementById('mi-toc-title');
    const linksWrap = document.getElementById('mi-toc-links');
    if(!btn || !title || !linksWrap) return;

    // label
    btn.querySelector('.tp-mtocBtn__label').textContent = t('openToc', lang);
    title.textContent = t('tocTitle', lang);

    // rebuild links from desktop toc (already translated)
    linksWrap.innerHTML = '';
    const srcLinks = Array.from(document.querySelectorAll('.tp-toc__links .tp-toc__item'));
    srcLinks.forEach(a => {
      const b = document.createElement('a');
      b.className = 'tp-toc__item';
      b.href = a.getAttribute('href') || '#';
      b.textContent = a.textContent || '';
      linksWrap.appendChild(b);
    });
  }

  // -----------------------
  // Scrollspy (active section)
  // -----------------------
  function initScrollSpy(){
    const linkMap = new Map();
    document.querySelectorAll('.tp-toc__item[href^="#"]').forEach(a => {
      const id = (a.getAttribute('href')||'').slice(1);
      if(!id) return;
      if(!linkMap.has(id)) linkMap.set(id, []);
      linkMap.get(id).push(a);
    });

    const ids = Object.keys(SECTIONS);
    const secs = ids.map(id => document.getElementById(id)).filter(Boolean);
    if(!secs.length) return;

    function setActive(id){
      document.querySelectorAll('.tp-toc__item.is-active').forEach(x => x.classList.remove('is-active'));
      const arr = linkMap.get(id) || [];
      arr.forEach(a => a.classList.add('is-active'));
      // also sheet links
      document.querySelectorAll('#mi-toc-links .tp-toc__item').forEach(a => {
        if((a.getAttribute('href')||'') === ('#'+id)) a.classList.add('is-active');
        else a.classList.remove('is-active');
      });
    }

    // initial by hash
    const initial = (location.hash || '').slice(1);
    if(initial && document.getElementById(initial)) setActive(initial);

    if(!('IntersectionObserver' in window)){
      // fallback: simple scroll handler
      window.addEventListener('scroll', () => {
        let cur = secs[0].id;
        const top = window.scrollY + 120;
        secs.forEach(s => { if(s.offsetTop <= top) cur = s.id; });
        setActive(cur);
      }, {passive:true});
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter(e => e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio);
      if(vis[0]) setActive(vis[0].target.id);
    }, {threshold:[0.12,0.2,0.35,0.55], rootMargin:'-10% 0px -70% 0px'});

    secs.forEach(s => obs.observe(s));
  }


  // -----------------------
  // Boot
  // -----------------------
  ensureThemeButton();
  initTheme();
  initAccent();
  ensureLangButton();
  ensureMobileTocUI();
  ensureHeroBilingual();
  wireLang();
  applyLang(getLang());
  initProgress();
  initCopy();
  initAnchors();
  initScrollSpy();
  initReveal();
})();
