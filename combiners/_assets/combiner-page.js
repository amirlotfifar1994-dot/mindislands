(function(){
  'use strict';
  const root = document.documentElement;

  const THEME_KEY = 'mind-islands-theme';
  const LEGACY_THEME_KEY = 'mi_theme';
  const LANG_KEY  = 'mind-islands-lang';

  const MODELS_EN = {
  "dual": {
    "name": "Dual Model",
    "lead": "Balance two opposing lenses for a clear decision."
  },
  "triple": {
    "name": "Triple Model",
    "lead": "Analysis, creativity, then evaluation."
  },
  "quad": {
    "name": "Quad Model",
    "lead": "Analysis, creativity, empathy, and critique."
  },
  "full": {
    "name": "Full THINK-360+ Model",
    "lead": "All 7 lenses, in order."
  },
  "quick": {
    "name": "Quick Model",
    "lead": "Two lenses for when you are in a hurry."
  },
  "people": {
    "name": "Human-Centered Model",
    "lead": "Empathy, creativity, and systems thinking."
  },
  "innovation": {
    "name": "Innovation Model",
    "lead": "Creativity, experimentation, and strategy."
  },
  "problem": {
    "name": "Problem-Solving Model",
    "lead": "Analysis, systems, and critical thinking."
  }
};

  const UI = {
    fa: {
      home: 'خانه',
      combiners: 'ترکیب‌گران',
      combinersTitle: 'ترکیب‌گران (مدل‌های ترکیبی)',
      combinersLead: 'هر مدل ترکیبی، چند لنز را با یک ترتیب پیشنهادی کنار هم می‌گذارد تا سریع‌تر و دقیق‌تر خروجی بگیری.',
      modelNav: 'ناوبری مدل',
      backToApp: 'می‌خوای برگردی داخل اپ؟',
      mainPage: 'صفحه اصلی',
      copy: 'کپی لینک',
      copied: 'کپی شد',
      theme: 'تم',
      searchPlaceholder: 'جستجو: نام مدل، English, یا id ...',
      modelList: 'فهرست مدل‌ها',
      modelListLead: 'جستجو کن، مدل را باز کن، زیرصفحه‌ها را بخوان، و بعد واقعاً ازش استفاده کن.',
      tocTitle: 'راهنمای صفحه',
      contents: 'فهرست',
      close: 'بستن',
      summaryTitle: 'خلاصهٔ این بخش',
      showDetails: 'نمایش جزئیات',
      hideDetails: 'بستن جزئیات',
      nav: {
        index: 'نمای کلی',
        workflow: 'گام‌ها و جریان',
        examples: 'سناریوها',
        templates: 'قالب‌ها',
        faq: 'اشتباهات و FAQ',
        related: 'مدل‌های مرتبط',
      },
      btn: {
        modelPage: '📘 صفحه مدل',
        workflow: '🧭 گام‌ها',
        examples: '📚 سناریوها',
        templates: '🧩 قالب‌ها',
      },
    },
    en: {
      home: 'Home',
      combiners: 'Combiners',
      combinersTitle: 'Combiners (hybrid models)',
      combinersLead: 'Each hybrid model combines multiple lenses in a suggested order so you can reach a better outcome faster.',
      modelNav: 'Model navigation',
      backToApp: 'Back to the app?',
      mainPage: 'Home',
      copy: 'Copy link',
      copied: 'Copied',
      theme: 'Theme',
      searchPlaceholder: 'Search: model name, English, or id ...',
      modelList: 'Model list',
      modelListLead: 'Search, open a model, read its subpages, then actually use it in real life.',
      tocTitle: 'On this page',
      contents: 'Contents',
      close: 'Close',
      summaryTitle: 'Summary',
      showDetails: 'Show details',
      hideDetails: 'Hide details',
      nav: {
        index: 'Overview',
        workflow: 'Workflow',
        examples: 'Scenarios',
        templates: 'Templates',
        faq: 'Mistakes & FAQ',
        related: 'Related models',
      },
      btn: {
        modelPage: '📘 Model page',
        workflow: '🧭 Workflow',
        examples: '📚 Scenarios',
        templates: '🧩 Templates',
      },
    }
  };

  const H2_MAP = {
    'نمای کلی': 'Overview',
    'ترتیب لنزها': 'Lens order',
    'چک‌لیست سریع': 'Quick checklist',
    'نمونه‌ی سریع': 'Quick example',
    'مدل‌های مرتبط': 'Related models',
    'گام‌ها و جریان': 'Workflow',
    'سناریوها': 'Scenarios',
    'قالب‌ها': 'Templates',
    'اشتباهات و FAQ': 'Mistakes & FAQ',
    'پرسش‌های متداول': 'FAQ',
  };

  function normLang(x){
    x = (x || '').toString().toLowerCase().trim();
    return x.startsWith('en') ? 'en' : 'fa';
  }

  function cleanFaMixed(s){
    s = (s || '').trim();
    // Remove parenthesis that contain Latin (e.g., " (Dual Model)")
    s = s.replace(/\s*\((?=[^)]*[A-Za-z])[^)]*\)\s*/g, ' ')
         .replace(/\s{2,}/g,' ')
         .trim();
    return s;
  }


  function getLang(){
    try{ return normLang(localStorage.getItem(LANG_KEY) || root.lang || 'fa'); }
    catch(e){ return normLang(root.lang || 'fa'); }
  }

  function t(path, lang){
    lang = lang || getLang();
    let cur = UI[lang] || UI.fa;
    for(const p of path.split('.')){
      if(cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
      else return path;
    }
    return cur;
  }

  function remember(el){
    if(!el) return;
    if(!el.dataset.miFaText) el.dataset.miFaText = el.textContent || '';
  }

  function modelIdFromPath(){
    const segs = location.pathname.split('/').filter(Boolean);
    const idx = segs.lastIndexOf('combiners');
    if(idx === -1) return null;
    const next = segs[idx + 1] || '';
    if(!next || next.endsWith('.html')) return null;
    if(next === '_assets') return null;
    return next;
  }

  // -----------------------
  // Language
  // -----------------------
  function applyLang(lang){
    lang = normLang(lang);
    const isFa = lang === 'fa';
    root.lang = lang;
    root.dir  = isFa ? 'rtl' : 'ltr';
    root.setAttribute('data-lang', lang);

    // Optional bilingual blocks
    const hasLangBlocks = !!document.querySelector('[data-mi-lang]');
    if(hasLangBlocks){
      document.querySelectorAll('[data-mi-lang]').forEach(el => {
        el.hidden = el.getAttribute('data-mi-lang') !== lang;
      });
    }

    // Update lang buttons
    document.querySelectorAll('[data-mi-langbtn="1"]').forEach(btn => {
      btn.textContent = isFa ? 'EN' : 'FA';
      const tt = isFa ? 'English' : 'فارسی';
      btn.setAttribute('title', tt);
      btn.setAttribute('aria-label', tt);
    });

    const mid = modelIdFromPath();

    // Breadcrumbs
    document.querySelectorAll('.co-breadcrumbs a, .co-breadcrumbs span').forEach(node => {
      if(node.nodeType !== 1) return;
      const tag = node.tagName.toLowerCase();
      const txt = (node.textContent || '').trim();
      if(tag === 'a' || tag === 'span'){
        if(!node.dataset.miFaText) node.dataset.miFaText = txt;
        if(isFa){ node.textContent = node.dataset.miFaText; return; }
        if(txt === 'خانه' || node.dataset.miFaText === 'خانه') node.textContent = t('home', lang);
        else if(txt === 'ترکیب‌گران' || node.dataset.miFaText === 'ترکیب‌گران') node.textContent = t('combiners', lang);
        else if(mid && MODELS_EN[mid] && tag === 'span' && node.dataset.miFaText && node.dataset.miFaText !== '›') node.textContent = MODELS_EN[mid].name;
      }
    });

    const h1 = document.querySelector('.co-h1');
    const lead = document.querySelector('.co-lead');

    if(h1){ remember(h1); if(!h1.dataset.miFaClean) h1.dataset.miFaClean = cleanFaMixed(h1.dataset.miFaText); }
    if(lead){ remember(lead); }

    if(isFa){
      if(h1) h1.textContent = (h1.dataset.miFaClean || cleanFaMixed(h1.dataset.miFaText));
      if(lead) lead.textContent = lead.dataset.miFaText;
    } else {
      if(mid && MODELS_EN[mid]){
        const pageId = (document.body && document.body.getAttribute('data-page') || 'index').trim();
        if(h1) h1.textContent = MODELS_EN[mid].name;
        if(lead) lead.textContent = (typeof PAGE_LEAD_EN !== 'undefined' && PAGE_LEAD_EN[pageId]) ? PAGE_LEAD_EN[pageId] : MODELS_EN[mid].lead;
      } else {
        // Combiners index
        if(h1 && (h1.dataset.miFaText || '').includes('ترکیب‌گران')) h1.textContent = t('combinersTitle', lang);
        if(lead && (lead.dataset.miFaText || '').length) lead.textContent = t('combinersLead', lang);
      }
    }


    // Hero chips (model label + time) + combiners index chips
    document.querySelectorAll('.co-hero .co-ctaRow .co-chip').forEach((chip, i) => {
      if(!chip.dataset.miFaHtml) chip.dataset.miFaHtml = chip.innerHTML;
      if(isFa){ chip.innerHTML = chip.dataset.miFaHtml; return; }

      const text = (chip.textContent || '').trim();
      if(mid && MODELS_EN[mid]){
        // Model label chip uses spans
        if(i === 0 && chip.querySelectorAll('span').length >= 2){
          const spans = chip.querySelectorAll('span');
          spans[1].textContent = MODELS_EN[mid].name;
        } else if(text.includes('⏱️') && typeof MODEL_META_EN !== 'undefined' && MODEL_META_EN[mid]) {
          chip.textContent = MODEL_META_EN[mid].time;
        }
      } else {
        if(text.includes('مدل') && text.includes('8')) chip.textContent = '🧠 8 models';
        if(text.includes('صفحه') || text.includes('زیرصفحه')) chip.textContent = '📄 Pages + subpages';
      }
    });

    // Translate model cards on combiners/index.html (full bilingual cards)
    const LENS_WORD_EN = {
      'تحلیلی':'Analytical','خلاق':'Creative','همدلانه':'Empathetic','انتقادی':'Critical',
      'سیستمی':'Systems','استراتژیک':'Strategic','تجربی':'Experimental'
    };
    document.querySelectorAll('[data-card][data-id]').forEach(card => {
      const id = (card.getAttribute('data-id') || '').trim();
      if(!id || !MODELS_EN[id]) return;

      const title = card.querySelector('h3');
      const lead2 = card.querySelector('.co-small');

      if(title){
        remember(title);
        if(!title.dataset.miFaClean) title.dataset.miFaClean = cleanFaMixed(title.dataset.miFaText);
        title.textContent = isFa ? title.dataset.miFaClean : MODELS_EN[id].name;
      }
      if(lead2){
        remember(lead2);
        lead2.textContent = isFa ? lead2.dataset.miFaText : MODELS_EN[id].lead;
      }

      card.querySelectorAll('.co-ctaRow .co-badge2').forEach(b => {
        remember(b);
        if(isFa){ b.textContent = b.dataset.miFaText; return; }
        const fa = (b.dataset.miFaText || '').trim();
        const parts = fa.split(/\s+/);
        const emoji = parts[0] || '';
        const word = parts.slice(1).join(' ');
        if(LENS_WORD_EN[word]) b.textContent = emoji + ' ' + LENS_WORD_EN[word];
      });
    });


    // Sidebar label + "back to app"
    document.querySelectorAll('.co-side .co-small').forEach((el, i) => {
      remember(el);
      if(isFa){ el.textContent = el.dataset.miFaText; return; }
      const txt = el.dataset.miFaText.trim();
      if(i === 0 && (txt === 'ناوبری مدل' || txt.includes('ناوبری'))){
        el.textContent = t('modelNav', lang);
      } else if(txt.startsWith('می‌خوای برگردی')) {
        // Keep link text handled below
        el.childNodes.forEach(n => {
          if(n.nodeType === 3) n.textContent = t('backToApp', lang) + ' ';
        });
      }
    });

    document.querySelectorAll('.co-side a.tp-link').forEach(a => {
      remember(a);
      if(isFa){ a.textContent = a.dataset.miFaText; return; }
      if((a.dataset.miFaText || '').includes('صفحه اصلی')) a.textContent = t('mainPage', lang);
    });

    // Model subnav
    document.querySelectorAll('[data-subnav] a').forEach(a => {
      const p = (a.getAttribute('data-page') || '').trim();
      if(!p) return;
      // store full original including badge text
      if(!a.dataset.miFaHtml) a.dataset.miFaHtml = a.innerHTML;
      if(isFa){ a.innerHTML = a.dataset.miFaHtml; return; }

      // If this is a "page nav" within a model folder (index/workflow/...)
      if(UI.en.nav[p]){
        const badge = a.querySelector('.co-badge2');
        const badgeHTML = badge ? badge.outerHTML : '';
        a.innerHTML = UI.en.nav[p] + badgeHTML;
        return;
      }

      // If this is a model list nav (dual/triple/...)
      if(MODELS_EN[p]){
        const badge = a.querySelector('.co-badge2');
        const badgeHTML = badge ? badge.outerHTML : '';
        // Keep emoji prefix if present
        const emoji = (a.textContent || '').trim().split(' ')[0];
        a.innerHTML = emoji + ' ' + MODELS_EN[p].name + badgeHTML;
      }
    });

    // Translate common h2 headings (non-destructive)
    document.querySelectorAll('.co-section h2').forEach(h2 => {
      remember(h2);
      if(isFa){ h2.textContent = h2.dataset.miFaText; return; }
      const fa = h2.dataset.miFaText.trim();
      if(H2_MAP[fa]) h2.textContent = H2_MAP[fa];
    });

    // Search input + headings on combiners index
    const q = document.getElementById('q');
    if(q) q.setAttribute('placeholder', t('searchPlaceholder', lang));

    // Model list mini card (only on combiners/index.html)
    document.querySelectorAll('.co-card .co-section h2').forEach(h2 => {
      const fa = (h2.dataset.miFaText || h2.textContent || '').trim();
      if(!fa) return;
      if(!h2.dataset.miFaText) h2.dataset.miFaText = h2.textContent || '';
      if(isFa){ h2.textContent = h2.dataset.miFaText; return; }
      if(fa === 'فهرست مدل‌ها') h2.textContent = t('modelList', lang);
    });
    document.querySelectorAll('.co-card .co-section p.co-small').forEach(p => {
      remember(p);
      if(isFa){ p.textContent = p.dataset.miFaText; return; }
      if((p.dataset.miFaText || '').includes('جستجو کن، مدل را باز کن')) p.textContent = t('modelListLead', lang);
    });

    // Translate action buttons (cards and CTAs)
    document.querySelectorAll('a.co-btn').forEach(a => {
      remember(a);
      if(isFa){ a.textContent = a.dataset.miFaText; return; }
      const fa = a.dataset.miFaText.trim();
      if(fa.startsWith('📘')) a.textContent = t('btn.modelPage', lang);
      else if(fa.startsWith('🧭')) a.textContent = t('btn.workflow', lang);
      else if(fa.startsWith('📚')) a.textContent = t('btn.examples', lang);
      else if(fa.startsWith('🧩')) a.textContent = t('btn.templates', lang);
      else if(fa === 'نمای کلی') a.textContent = 'Overview';
      else if(fa === 'گام‌ها') a.textContent = 'Workflow';
    });

    // Tooltips for icon buttons
    const cbtn = document.querySelector('[data-copy-link]');
    if(cbtn){
      cbtn.title = isFa ? 'کپی لینک' : 'Copy link';
      cbtn.setAttribute('aria-label', cbtn.title);
    }
    const tbtn = document.querySelector('[data-theme-toggle]');
    if(tbtn){
      tbtn.title = isFa ? 'تم' : 'Theme';
      tbtn.setAttribute('aria-label', tbtn.title);
    }

    // Document title
    if(!document.body.dataset.miFaTitle){ document.body.dataset.miFaTitle = cleanFaMixed(document.title); }
    if(isFa) document.title = document.body.dataset.miFaTitle;
    else {
      if(mid && MODELS_EN[mid]) document.title = MODELS_EN[mid].name + ' | Mind Islands';
      else document.title = 'Combiners | Mind Islands';
    }

    syncBilingualMode(lang);
    syncMobileToc(lang);

    // Persist
    try{ localStorage.setItem(LANG_KEY, lang); }catch(e){}
  }

  function ensureLangButton(){
    const actions = document.querySelector('.co-actions')
      || document.querySelector('.tp-nav')
      || document.querySelector('.tp-hero__actions');

    if(!actions) return;
    if(actions.querySelector('[data-mi-langbtn="1"]')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-mi-langbtn', '1');

    // Icon style on combiner pages
    if(actions.classList.contains('co-actions')) btn.className = 'tp-iconBtn tp-iconBtn--lang';
    else btn.className = 'tp-btn';

    btn.textContent = 'EN';
    actions.appendChild(btn);
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
        const old = cbtn.textContent || '🔗';
        cbtn.textContent = '✅';
        cbtn.title = (lang === 'fa') ? 'کپی شد' : 'Copied';
        setTimeout(() => {
          cbtn.textContent = old;
          cbtn.title = (lang === 'fa') ? 'کپی لینک' : 'Copy link';
        }, 1200);
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
  // Active nav
  // -----------------------
  function initActiveNav(){
    const cur = (document.body.getAttribute('data-page') || 'index').trim();
    document.querySelectorAll('[data-subnav] a').forEach(a => {
      const p = (a.getAttribute('data-page') || '').trim();
      if(p && p === cur) a.setAttribute('aria-current', 'page');
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
  // Reveal
  // -----------------------
  function initReveal(){
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sel = [
      '.co-card',
      '.co-section',
      '.co-step',
      '.co-kv',
      '.co-btn',
      '.tp-btn',
      '.tp-iconBtn',
      '.co-nav a'
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
  // Bilingual details mode (combiners)
  // -----------------------
  const PAGE_LEAD_EN = {
    index: 'Overview + quick usage',
    workflow: 'Step-by-step workflow + ready prompts',
    examples: 'Real scenarios to practice the model',
    templates: 'Copy-ready templates for fast output',
    faq: 'Common mistakes + FAQ',
    related: 'Comparison and nearby models'
  };

  const MODEL_META_EN = {
    dual: { time: '⏱️ 10–20 min (simple, clear decisions)' },
    triple: { time: '⏱️ 20–35 min (decisions that need evaluation)' },
    quad: { time: '⏱️ 30–45 min (higher stakes, people involved)' },
    full: { time: '⏱️ 45–90 min (complex, high-stakes situations)' },
    quick: { time: '⏱️ 5–10 min (urgent, low-risk calls)' },
    people: { time: '⏱️ 25–40 min (human-heavy situations)' },
    innovation: { time: '⏱️ 30–50 min (new ideas + experiments)' },
    problem: { time: '⏱️ 25–45 min (root-cause + system impact)' }
  };

  const MODEL_PURPOSE_EN = {
    dual: 'Balance a rigorous analytical pass with a creative pass so you don’t get trapped in either over-analysis or pure vibes.',
    triple: 'Add a critical evaluation lens to filter ideas into a decision you can defend.',
    quad: 'Bring empathy into the loop when people are affected, then evaluate options critically.',
    full: 'Run the full THINK-360+ sequence when the situation is complex, systemic, and expensive to get wrong.',
    quick: 'Make a fast call: clarify constraints, choose a move, and set a review trigger.',
    people: 'Start with empathy, design options creatively, then check system-level effects.',
    innovation: 'Generate options, test them cheaply, then choose a strategic direction.',
    problem: 'Define the problem precisely, map the system causes, then stress-test fixes before rollout.'
  };

  const MODEL_LENSES = {
    dual: ['Analytical','Creative'],
    triple: ['Analytical','Creative','Critical'],
    quad: ['Analytical','Creative','Empathetic','Critical'],
    full: ['Empathetic','Analytical','Creative','Critical','Systems','Strategic','Experimental'],
    quick: ['Analytical','Strategic'],
    people: ['Empathetic','Creative','Systems'],
    innovation: ['Creative','Experimental','Strategic'],
    problem: ['Analytical','Systems','Critical']
  };

  const RELATED_MODELS = {
    dual: ['quick','triple','quad','full'],
    triple: ['dual','quad','full','problem'],
    quad: ['triple','people','full','problem'],
    full: ['quad','people','problem','innovation'],
    quick: ['dual','triple','problem','people'],
    people: ['quad','full','dual','problem'],
    innovation: ['dual','triple','full','problem'],
    problem: ['triple','quad','full','quick']
  };

  const LENS_META = {
    Analytical:   { emoji:'🔍', color:'#3b82f6', bg:'#3b82f622', border:'#3b82f655', desc:'Clarify the problem, constraints, and success criteria.' },
    Creative:     { emoji:'🎨', color:'#ec4899', bg:'#ec489922', border:'#ec489955', desc:'Generate multiple options and reframes, not just one “solution”.' },
    Empathetic:   { emoji:'❤️', color:'#f43f5e', bg:'#f43f5e22', border:'#f43f5e55', desc:'Understand people: needs, emotions, incentives, and context.' },
    Critical:     { emoji:'⚖️', color:'#f59e0b', bg:'#f59e0b22', border:'#f59e0b55', desc:'Challenge assumptions, find risks, and define what could fail.' },
    Systems:      { emoji:'🔗', color:'#10b981', bg:'#10b98122', border:'#10b98155', desc:'Map causes, feedback loops, dependencies, and second-order effects.' },
    Strategic:    { emoji:'♟️', color:'#8b5cf6', bg:'#8b5cf622', border:'#8b5cf655', desc:'Choose a direction, tradeoffs, and sequencing; define what you will NOT do.' },
    Experimental: { emoji:'🧪', color:'#06b6d4', bg:'#06b6d422', border:'#06b6d455', desc:'Design fast tests to turn uncertainty into evidence.' }
  };

  const LENS_Q_EN = {
    Analytical: [
      'What exactly is the decision/problem in one sentence?',
      'What does success look like, and how will we measure it?',
      'What constraints are non‑negotiable (time, budget, rules, resources)?',
      'Which assumptions would break the outcome if they were wrong?'
    ],
    Creative: [
      'What are 10 different options (including “weird” ones)?',
      'How would we solve this if one big constraint disappeared?',
      'What’s a reframing that makes the problem easier or smaller?',
      'What patterns from other industries might transfer here?'
    ],
    Empathetic: [
      'Who is affected and what do they care about most?',
      'What pain/friction are they experiencing right now?',
      'What would a “good experience” feel like for them?',
      'What incentives or fears might shape their behavior?'
    ],
    Critical: [
      'What is the best argument against this plan?',
      'What could go wrong first, and what would it cost?',
      'What evidence would make us change our mind?',
      'What’s the smallest safe version of this decision?'
    ],
    Systems: [
      'What are the main components and dependencies in this situation?',
      'Where are the bottlenecks and feedback loops?',
      'If we change X, what breaks downstream/upstream?',
      'What second‑order effects might show up in 2–4 weeks?'
    ],
    Strategic: [
      'What’s the single priority for the next 1–4 weeks?',
      'What tradeoff are we explicitly accepting?',
      'What will we stop doing to make space for this?',
      'What is the next action within 24 hours, and who owns it?'
    ],
    Experimental: [
      'What is the riskiest assumption we should test first?',
      'What is the cheapest test that generates evidence?',
      'What data is the minimum we need to decide?',
      'What is the pass/fail threshold and the review date?'
    ]
  };

  const LENS_OUT_EN = {
    Analytical: ['Problem statement + success metrics', 'Constraints + known facts', 'Assumptions + unknowns list'],
    Creative: ['10+ options list', 'Top 3 testable ideas', 'One reframing that unlocks progress'],
    Empathetic: ['Stakeholder map', 'Top needs/pains', 'A “definition of good” in plain language'],
    Critical: ['Top risks + mitigations', 'Kill criteria / red flags', 'Smallest safe next step'],
    Systems: ['System map (components + links)', 'Bottlenecks + leverage points', '2nd‑order effects to watch'],
    Strategic: ['Chosen direction + tradeoffs', 'Sequence of next steps', 'Stop‑doing list'],
    Experimental: ['Test plan', 'Metrics + threshold', 'Learning summary + next iteration']
  };

  function renderBullets(items){
    return '<ul class="co-bullets">' + (items||[]).map(s => '<li>' + s + '</li>').join('') + '</ul>';
  }

  function enStepCard(i, lens, extraSmall, withPrompt){
    const m = LENS_META[lens] || {emoji:'•', bg:'#ffffff12', border:'#ffffff22', desc:''};
    const qs = LENS_Q_EN[lens] || [];
    const outs = LENS_OUT_EN[lens] || [];
    const title = 'Step ' + i + ': ' + lens;
    const sub = extraSmall || (m.desc || '');
    const prompt = withPrompt ? (
      '<div class="co-surface"><b>Ready prompt</b>'
      + '<div class="co-template" style="margin-top:.4rem">'
      + 'Step ' + i + ' (' + lens + '):<br>'
      + '- Goal: ...<br>'
      + '- Inputs (facts/constraints): ...<br>'
      + '- Output (3 bullets): ...<br>'
      + '- Open questions: ...'
      + '</div></div>'
    ) : '';
    return (
      '<div class="co-step">'
      + '<div class="co-step__head">'
      + ' <div class="co-step__badge" style="background:'+m.bg+';border-color:'+m.border+'">'+m.emoji+'</div>'
      + ' <div><div class="co-step__title">'+title+'</div>'
      + ' <div class="co-small">'+sub+'</div></div>'
      + '</div>'
      + '<div class="co-kvs">'
      + ' <div class="co-kv"><b>Key questions</b>' + renderBullets(qs) + '</div>'
      + ' <div class="co-kv"><b>Tangible outputs</b>' + renderBullets(outs) + '</div>'
      + '</div>'
      + prompt
      + '</div>'
    );
  }

  function enLensOrderBlock(mid, withPrompt){
    const lenses = MODEL_LENSES[mid] || [];
    if(!lenses.length) return '';
    const steps = lenses.map((l, idx) => enStepCard(idx+1, l, null, withPrompt)).join('');
    return '<div class="co-steps">' + steps + '</div>';
  }

  function enOverviewDetails(mid){
    const purpose = MODEL_PURPOSE_EN[mid] || 'A practical model that combines multiple lenses into one workflow.';
    const lenses = (MODEL_LENSES[mid] || []).join(' → ');
    const time = (MODEL_META_EN[mid] && MODEL_META_EN[mid].time) ? MODEL_META_EN[mid].time : '';
    const use = [
      'You need a decision you can explain in 2 minutes.',
      'You feel stuck in one mode (only analysis, only creativity, only feelings).',
      'You need a small next step with a clear review trigger.'
    ];
    const avoid = [
      'The decision is irreversible or extremely high risk (use Full THINK-360+).',
      'You lack basic facts; run a short discovery step first.',
      'Stakeholders are in conflict and trust is low (add Empathy + Systems).'
    ];
    const deliver = [
      'Chosen option + 3 reasons',
      'Top risk + mitigation',
      'Next action within 24h + review date/condition'
    ];

    return {
      summary: [purpose],
      details:
        '<div class="co-kvs">'
        + '<div class="co-kv"><b>Recommended lens order</b><div class="co-small">' + lenses + '</div></div>'
        + (time ? '<div class="co-kv"><b>Suggested time</b><div class="co-small">' + time + '</div></div>' : '')
        + '</div>'
        + '<div class="co-kvs" style="margin-top:.6rem">'
        + '<div class="co-kv"><b>When to use</b>' + renderBullets(use) + '</div>'
        + '<div class="co-kv"><b>When it’s NOT ideal</b>' + renderBullets(avoid) + '</div>'
        + '</div>'
        + '<div class="co-kvs" style="margin-top:.6rem">'
        + '<div class="co-kv"><b>Expected deliverable</b>' + renderBullets(deliver) + '</div>'
        + '</div>'
    };
  }

  function enQuickChecklist(mid){
    const lenses = MODEL_LENSES[mid] || [];
    const items = [
      'Problem stated in one sentence.',
      'At least 2 real options (not “A vs A-lite”).',
      'One explicit tradeoff written down.',
      'One major risk + mitigation.',
      'Next action + owner + review trigger.'
    ];
    if(lenses.includes('Experimental')) items.splice(3,0,'One cheap test to reduce uncertainty.');
    return { summary:['A fast quality check before you commit.'], details: renderBullets(items) };
  }

  function enQuickExample(mid){
    const example =
      'Example (product/ops):<br>'
      + '1) Run the first lens for 5 minutes and write 3 bullets.<br>'
      + '2) Run the next lens for 5 minutes and write 3 bullets.<br>'
      + '3) Pick the option that survives both passes and define a tiny next step.<br><br>'
      + '<b>Final output</b>: decision + why + risk + next action + review date.';
    return {
      summary:['A 10-minute worked example you can copy.'],
      details: '<div class="co-surface"><div class="co-template">' + example + '</div></div>'
    };
  }

  function enWorkflowIntro(mid){
    const time = (MODEL_META_EN[mid] && MODEL_META_EN[mid].time) ? MODEL_META_EN[mid].time : 'Timebox hard.';
    return {
      summary:['A practical flow: each step must produce a small deliverable. No deliverable = you’re still thinking in circles.'],
      details:
        '<div class="co-kvs">'
        + '<div class="co-kv"><b>Golden rule</b><div class="co-small">Each step = 1 main question + 3 bullets.</div></div>'
        + '<div class="co-kv"><b>Suggested time</b><div class="co-small">' + time + '</div></div>'
        + '</div>'
    };
  }

  function enDecisionBlock(){
    const t =
      'Final decision/plan:<br>'
      + 'Why this option? (3 reasons):<br>1)<br>2)<br>3)<br>'
      + 'Main risk + mitigation:<br>'
      + 'Next action (within 24h):<br>'
      + 'Review trigger (date/condition):';
    return {
      summary:['Close the loop. If you can’t write this, you’re not done.'],
      details: '<div class="co-surface"><div class="co-template">' + t + '</div></div>'
    };
  }

  function enScenarios(mid){
    const base = [
      {title:'Scenario 1: The default use case', small:'A clean, basic example to build muscle memory.',
       body:'Pick a real decision you’re currently avoiding. Run the lenses in order, timeboxed, and write 3 bullets per step.'},
      {title:'Scenario 2: Team/process tweak', small:'Fix a small bottleneck without over-engineering.',
       body:'Define the bottleneck, propose 3 low-cost changes, pick one, and set a 1-week metric.'},
      {title:'Scenario 3: Content/product choice', small:'Choose among multiple directions quickly.',
       body:'Clarify goal + audience, generate options, evaluate, then ship one small artifact (outline/prototype).'}
    ];

    // light customization
    if(mid === 'innovation'){
      base[1].title = 'Scenario 2: Design a cheap experiment';
      base[1].small = 'Turn a bold idea into evidence fast.';
      base[1].body = 'Pick the riskiest assumption, design a quick test, set a pass/fail threshold, and schedule a review.';
    }
    if(mid === 'people'){
      base[2].title = 'Scenario 3: Handle a sensitive conversation';
      base[2].small = 'Keep empathy, clarity, and system impact in one plan.';
      base[2].body = 'Map needs, propose options, consider downstream effects, then choose the smallest respectful next step.';
    }
    if(mid === 'problem'){
      base[1].title = 'Scenario 2: Root-cause a recurring issue';
      base[1].small = 'Stop patching symptoms.';
      base[1].body = 'Define the problem precisely, map causes, pick the leverage point, and stress-test the fix.';
    }

    const cards = base.map((s, idx) => (
      '<div class="co-step"><div class="co-step__head">'
      + '<div class="co-step__badge" style="background:#3b82f622;border-color:#3b82f655">'+(idx+1)+'</div>'
      + '<div><div class="co-step__title">'+s.title+'</div><div class="co-small">'+s.small+'</div></div>'
      + '</div>'
      + '<ul class="co-bullets"><li>'+s.body+'</li></ul>'
      + '<div class="co-surface"><div class="co-template">'
      + 'Final output:<br>- Decision/plan: ...<br>- Why: ...<br>- Next step: ...<br>- Review trigger: ...'
      + '</div></div></div>'
    )).join('');
    return { summary:['Practice with time limits. Treat output as a habit, not homework.'], details:'<div class="co-steps">'+cards+'</div>' };
  }

  function enPractice7(){
    const items = [
      'Day 1: One small real decision with this model.',
      'Day 2: Run the same decision with a faster model and compare.',
      'Day 3: A work scenario.',
      'Day 4: A personal scenario.',
      'Day 5: Write 3 lessons learned.',
      'Day 6: Create your personal template.',
      'Day 7: Simplify the model into a 5-minute version for yourself.'
    ];
    return { summary:['A simple 7-day routine to make the model automatic.'], details: renderBullets(items) };
  }

  function enTemplates(){
    const blocks = [
      {title:'Decision brief', body:'Problem (1 sentence):<br>Options (3):<br>Criteria (3):<br>Decision:<br>Why (3 bullets):<br>Main risk:<br>Next action:<br>Review trigger:'},
      {title:'Option matrix', body:'Options: A / B / C<br>Criterion 1:<br>Criterion 2:<br>Criterion 3:<br>Total score:<br>Risk/unknown notes:'},
      {title:'Assumptions & tests', body:'Assumption 1:<br>Why it matters:<br>How to test:<br>Pass/Fail threshold:<br><br>Assumption 2:<br>...'},
      {title:'Mini experiment', body:'Hypothesis:<br>Method:<br>Minimum data needed:<br>Success metric:<br>Risks:<br>Timebox:<br>Result/Learning:'}
    ];
    const cards = blocks.map((b) => (
      '<div class="co-step"><div class="co-step__head">'
      + '<div class="co-step__badge" style="background:#3b82f622;border-color:#3b82f655">🧩</div>'
      + '<div><div class="co-step__title">'+b.title+'</div><div class="co-small">Copy and fill.</div></div>'
      + '</div><div class="co-surface"><div class="co-template">'+b.body+'</div></div></div>'
    )).join('');
    return { summary:['Good templates beat endless thinking. Copy, fill, decide.'], details:'<div class="co-steps">'+cards+'</div>' };
  }

  function enExecutionChecklist(){
    const items = [
      'At least 2 real options.',
      'One critical assumption + one test (if uncertainty is high).',
      'One clear next action.',
      'A measurable review trigger.',
      'Decision is written in one paragraph max.'
    ];
    return { summary:['A checklist that keeps the model honest.'], details: renderBullets(items) };
  }

  function enMistakes(){
    const items = [
      'Skipping steps without producing outputs (progress illusion).',
      'Fake options that are basically the same thing.',
      'Ignoring an obvious risk because it feels inconvenient.',
      'Overloading the team with unnecessary detail.',
      'No review trigger, so the decision never gets validated.'
    ];
    return { summary:['The usual ways humans sabotage good methods.'], details: renderBullets(items) };
  }

  function enFaq(){
    const qa = [
      {q:'I ran the model but didn’t reach a decision. Why?', a:'Your problem statement or criteria are still vague, or your options are not real. Re-do Step 1 and force 2–3 concrete options.'},
      {q:'I’m stuck between two options.', a:'Add a tie-break criterion or define a cheap test that generates evidence within a week.'},
      {q:'It takes too long.', a:'Timebox harder. Each step is 3 bullets. Stop polishing.'},
      {q:'I feel like I’m rationalizing my favorite option.', a:'Write the strongest critique against it, then ask one other person to challenge your assumptions.'}
    ];
    const cards = qa.map(x => (
      '<div class="co-step"><div class="co-step__head">'
      + '<div class="co-step__badge" style="background:#3b82f622;border-color:#3b82f655">❓</div>'
      + '<div><div class="co-step__title">'+x.q+'</div><div class="co-small">'+x.a+'</div></div>'
      + '</div></div>'
    )).join('');
    return { summary:['Quick answers to common failure modes.'], details:'<div class="co-steps">'+cards+'</div>' };
  }

  function enPersonalVersion(){
    const t =
      'My short version of this model:<br>'
      + 'Step 1: ...<br>'
      + 'Step 2: ...<br>'
      + 'Step 3: ...<br><br>'
      + 'If risk increases → switch to a fuller model.';
    return { summary:['Make it yours. The best model is the one you actually use.'], details:'<div class="co-surface"><div class="co-template">'+t+'</div></div>' };
  }

  function enRelated(mid){
    const picks = (RELATED_MODELS[mid] || []).slice(0,4);
    const cards = picks.map(id => {
      const name = (MODELS_EN[id] && MODELS_EN[id].name) ? MODELS_EN[id].name : id;
      const lead = (MODELS_EN[id] && MODELS_EN[id].lead) ? MODELS_EN[id].lead : '';
      return (
        '<div class="co-step"><div class="co-step__head">'
        + '<div class="co-step__badge" style="background:#ffffff12;border-color:#ffffff22">↗</div>'
        + '<div><div class="co-step__title">'+name+'</div><div class="co-small">'+lead+'</div></div>'
        + '</div><div class="co-ctaRow">'
        + '<a class="co-btn" href="../'+id+'/index.html">Overview</a>'
        + '<a class="co-btn" href="../'+id+'/workflow.html">Workflow</a>'
        + '</div></div>'
      );
    }).join('');
    return { summary:['If this model feels too light or too heavy, try a nearby one.'], details:'<div class="co-steps">'+cards+'</div>' };
  }

  function enRelatedHowToPick(){
    const kvs = [
      {k:'High risk', v:'Quad or Full.'},
      {k:'Low time', v:'Quick or Dual.'},
      {k:'Human-heavy', v:'Human-Centered or Quad.'},
      {k:'Innovation', v:'Innovation (then add Critical/Systems if needed).'}
    ];
    const html =
      '<div class="co-kvs">'
      + kvs.map(x => '<div class="co-kv"><b>'+x.k+'</b><div class="co-small">'+x.v+'</div></div>').join('')
      + '</div>';
    return { summary:['Pick the smallest model that still covers your main risks.'], details: html };
  }

  function enLearningPath(){
    const items = [
      'Quick → Triple → Quad/Human-Centered → Full',
      'For technical issues: Problem-Solving, then add Systems/Critical depth if needed'
    ];
    return { summary:['A sane progression that doesn’t waste your time.'], details: renderBullets(items) };
  }

  function enContentForSection(mid, page, h2fa){
    const tfa = (h2fa || '').trim();

    // INDEX
    if(page === 'index'){
      if(tfa === 'نمای کلی') return enOverviewDetails(mid);
      if(tfa === 'ترتیب لنزها') return { summary:['Recommended order. Adjust if your context demands it.'], details: enLensOrderBlock(mid, false) };
      if(tfa === 'چک‌لیست سریع') return enQuickChecklist(mid);
      if(tfa === 'نمونه‌ی سریع') return enQuickExample(mid);
      if(tfa === 'مدل‌های مرتبط') return enRelated(mid);
    }

    // WORKFLOW
    if(page === 'workflow'){
      if(tfa === 'جریان اجرای مدل') return enWorkflowIntro(mid);
      if(tfa === 'گام‌ها') return { summary:['Run each lens, produce outputs, then move on.'], details: enLensOrderBlock(mid, true) };
      if(tfa === 'جمع‌بندی و تصمیم') return enDecisionBlock();
    }

    // EXAMPLES
    if(page === 'examples'){
      if(tfa === 'سناریوهای تمرینی') return { summary:['Practice the workflow with a hard timebox and real stakes.'], details: '<p class="co-enP">Pick one scenario, set a timer, and write the outputs. You’re training execution, not writing a novel.</p>' };
      if(tfa === 'سناریوها') return enScenarios(mid);
      if(tfa === 'تمرین ۷ روزه') return enPractice7();
    }

    // TEMPLATES
    if(page === 'templates'){
      if(tfa === 'قالب‌ها و چک‌لیست‌ها') return { summary:['Templates give you speed and consistency.'], details: '<p class="co-enP">Use these as your default notes. Replace “thinking” with “filling”.</p>' };
      if(tfa === 'قالب‌ها') return enTemplates();
      if(tfa === 'چک‌لیست اجرای خوب') return enExecutionChecklist();
    }

    // FAQ
    if(page === 'faq'){
      if(tfa === 'اشتباهات رایج') return enMistakes();
      if(tfa === 'FAQ' || tfa === 'پرسش‌های متداول') return enFaq();
      if(tfa === 'نسخه شخصی‌سازی') return enPersonalVersion();
    }

    // RELATED page
    if(page === 'related'){
      if(tfa.startsWith('چطور مدل مناسب')) return enRelatedHowToPick();
      if(tfa === 'مدل‌های نزدیک') return enRelated(mid);
      if(tfa === 'مسیر پیشنهادی یادگیری') return enLearningPath();
    }

    // Fallback
    return {
      summary: ['English version is available here. Open Persian text if you need the exact original wording.'],
      details: '<p class="co-enP">Tip: keep outputs short. One paragraph beats five screens of text.</p>'
    };
  }

  function setEnParagraphs(container, lines){
    if(!container) return;
    container.innerHTML = '';
    (lines || []).filter(Boolean).forEach(line => {
      const p = document.createElement('p');
      p.className = 'co-enP';
      p.textContent = line;
      container.appendChild(p);
    });
  }


  function faSummaryForSection(faWrap, fallbackTitle){
    // Extract a short, readable Persian summary from the existing section body.
    // This keeps the “card + hidden details” feel consistent in FA too.
    try{
      const raw = (faWrap && faWrap.textContent) ? faWrap.textContent : '';
      let s = raw.replace(/\s+/g,' ').trim();
      if(!s){
        const t0 = (fallbackTitle || '').trim();
        if(t0) return ['این بخش دربارهٔ «' + t0 + '» است. برای جزئیات، «نمایش جزئیات» را بزنید.'];
        return ['برای مشاهدهٔ جزئیات، «نمایش جزئیات» را بزنید.'];
      }
      // Prefer first sentence-ish chunk
      let m = s.match(/^(.{35,170}?)([\.\!\؟\n]|$)/);
      let out = (m ? m[1] : s).trim();
      if(out.length > 185) out = out.slice(0, 182).trim() + '…';
      // If it’s extremely short, add a bit of context
      if(out.length < 30){
        const t0 = (fallbackTitle || '').trim();
        if(t0) out = 'این بخش دربارهٔ «' + t0 + '» است: ' + out;
      }
      return [out];
    }catch(e){
      return ['برای مشاهدهٔ جزئیات، «نمایش جزئیات» را بزنید.'];
    }
  }

  function ensureBilingualBlocks(){
    const mid0 = modelIdFromPath();
    if(!mid0) return;
    if(!document.body || document.body.dataset.miCoEnBuilt === '1') return;

    const sections = Array.from(document.querySelectorAll('.co-section'));
    sections.forEach(sec => {
      if(sec.dataset.miWrapped === '1') return;
      const h2 = sec.querySelector('h2');
      if(!h2) return;
      sec.dataset.miWrapped = '1';

      if(!h2.dataset.miFaText) h2.dataset.miFaText = h2.textContent || '';

      // capture all nodes after h2
      const nodes = [];
      let n = h2.nextSibling;
      while(n){
        const nxt = n.nextSibling;
        nodes.push(n);
        n = nxt;
      }

      const enBox = document.createElement('div');
      enBox.className = 'co-enBox';
      enBox.innerHTML =
        '<div class="co-enBox__head">'
        + '<div class="co-enBox__title"></div>'
        + '<div class="co-enBox__toggles">'
        + '<button type="button" class="co-enBox__toggle" data-co-toggle-details="1"></button>'
        + '</div>'
        + '</div>'
        + '<div class="co-enBox__summary"></div>'
        + '<div class="co-enBox__details" data-co-en-details="1"></div>';

      const faWrap = document.createElement('div');
      faWrap.className = 'co-faWrap';
      nodes.forEach(node => faWrap.appendChild(node));

      h2.insertAdjacentElement('afterend', enBox);
      enBox.insertAdjacentElement('afterend', faWrap);

      // defaults: FA open, EN closed (can be toggled by the single button below)
      if(!faWrap.dataset.open) faWrap.dataset.open = '1';
      if(!enBox.dataset.enOpen) enBox.dataset.enOpen = '0';

      const btn = enBox.querySelector('[data-co-toggle-details="1"]');
      if(btn){
        btn.addEventListener('click', () => {
          const lang = getLang();
          const isFa = lang === 'fa';
          if(isFa){
            const open = (faWrap.dataset.open || '0') === '1';
            faWrap.dataset.open = open ? '0' : '1';
          } else {
            const open = (enBox.dataset.enOpen || '0') === '1';
            enBox.dataset.enOpen = open ? '0' : '1';
          }
          syncBilingualMode(lang);

          // Smooth focus to the section when opening details
          const nowOpen = isFa ? ((faWrap.dataset.open || '0') === '1') : ((enBox.dataset.enOpen || '0') === '1');
          if(nowOpen){
            try{ sec.scrollIntoView({behavior:'smooth', block:'start'}); }catch(e){}
          }
        });
      }
    });

    document.body.dataset.miCoEnBuilt = '1';
  }

  function syncBilingualMode(lang){
    lang = normLang(lang);
    const isFa = lang === 'fa';
    const mid = modelIdFromPath();
    if(!mid) return;
    const page = (document.body && document.body.getAttribute('data-page') || 'index').trim();

    ensureBilingualBlocks();
    if(!document.body) return;

    document.querySelectorAll('.co-section').forEach(sec => {
      const h2 = sec.querySelector('h2');
      const enBox = sec.querySelector('.co-enBox');
      const faWrap = sec.querySelector('.co-faWrap');
      if(!h2 || !enBox || !faWrap) return;

      // defaults if missing
      if(!faWrap.dataset.open) faWrap.dataset.open = '1';
      if(!enBox.dataset.enOpen) enBox.dataset.enOpen = '0';

      const openFa = (faWrap.dataset.open || '0') === '1';
      const openEn = (enBox.dataset.enOpen || '0') === '1';

      // title
      const title = enBox.querySelector('.co-enBox__title');
      if(title) title.textContent = t('summaryTitle', lang);

      // content (summary + details)
      const payload = enContentForSection(mid, page, h2.dataset.miFaText || h2.textContent);
      const summaryEl = enBox.querySelector('.co-enBox__summary');
      const faSum = faSummaryForSection(faWrap, (h2.dataset.miFaText || h2.textContent || '').trim());
      setEnParagraphs(summaryEl, isFa ? faSum : (payload.summary || []));

      const detailsEl = enBox.querySelector('[data-co-en-details="1"]');
      if(detailsEl){
        if(isFa){
          // EN details should not show in FA mode
          detailsEl.innerHTML = '';
          detailsEl.hidden = true;
        } else {
          detailsEl.innerHTML = payload.details || '';
          detailsEl.hidden = !openEn;
        }
      }

      // single button (language-aware)
      const btn = enBox.querySelector('[data-co-toggle-details="1"]');
      if(btn){
        const open = isFa ? openFa : openEn;
        btn.textContent = open ? t('hideDetails', lang) : t('showDetails', lang);
      }

      // visibility rules:
      // - Card (enBox) is ALWAYS visible
      // - Details are shown only for the active language (FA -> faWrap, EN -> enBox details)
      enBox.hidden = false;
      if(isFa){
        faWrap.hidden = !openFa;
      } else {
        faWrap.hidden = true;
      }
    });
  }


  // -----------------------
  // Mobile TOC (bottom sheet)
  // -----------------------
  function ensureSectionIds(){
    const sections = Array.from(document.querySelectorAll('.co-section'));
    sections.forEach((sec, i) => {
      if(!sec.id) sec.id = 'co-sec-' + String(i+1);
    });
  }

  function ensureMobileTocUI(){
    if(document.getElementById('mi-co-toc-open')) return;
    ensureSectionIds();

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'mi-co-toc-open';
    btn.className = 'co-mtocBtn';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="co-mtocBtn__icon">☰</span><span class="co-mtocBtn__label"></span>';
    document.body.appendChild(btn);

    const sheet = document.createElement('div');
    sheet.id = 'mi-co-toc-sheet';
    sheet.className = 'co-sheet';
    sheet.innerHTML =
      '<div class="co-sheet__backdrop" data-co-sheet-close="1"></div>'
      + '<div class="co-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="mi-co-toc-title">'
      + ' <div class="co-sheet__head">'
      + '  <div class="co-sheet__title" id="mi-co-toc-title"></div>'
      + '  <button class="co-sheet__close" type="button" data-co-sheet-close="1" aria-label="Close">✕</button>'
      + ' </div>'
      + ' <div class="co-sheet__body">'
      + '  <nav class="co-sheet__nav" id="mi-co-toc-links"></nav>'
      + ' </div>'
      + '</div>';
    document.body.appendChild(sheet);

    function close(){
      sheet.classList.remove('is-open');
      document.body.classList.remove('co-noscroll');
      btn.setAttribute('aria-expanded','false');
    }
    function open(){
      syncMobileToc(getLang());
      sheet.classList.add('is-open');
      document.body.classList.add('co-noscroll');
      btn.setAttribute('aria-expanded','true');
    }

    btn.addEventListener('click', open);
    sheet.querySelectorAll('[data-co-sheet-close="1"]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });
    sheet.addEventListener('click', (e) => { if(e.target === sheet) close(); });

    // Expose close for click handlers
    sheet.dataset.closeFn = '1';
    sheet._close = close;
  }

  function syncMobileToc(lang){
    lang = normLang(lang);
    ensureSectionIds();

    const btn = document.getElementById('mi-co-toc-open');
    const sheet = document.getElementById('mi-co-toc-sheet');
    if(!btn || !sheet) return;

    const label = btn.querySelector('.co-mtocBtn__label');
    if(label) label.textContent = t('contents', lang);

    const title = sheet.querySelector('#mi-co-toc-title');
    if(title) title.textContent = t('tocTitle', lang);

    const nav = sheet.querySelector('#mi-co-toc-links');
    if(!nav) return;
    nav.innerHTML = '';

    const sections = Array.from(document.querySelectorAll('.co-section'));
    sections.forEach(sec => {
      const h2 = sec.querySelector('h2');
      if(!h2) return;
      const a = document.createElement('a');
      a.href = '#' + sec.id;
      a.textContent = (h2.textContent || '').trim() || ('Section ' + sec.id);
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        const el = document.getElementById(sec.id);
        if(el){
          try{ el.scrollIntoView({behavior:'smooth', block:'start'}); }catch(e){}
          history.replaceState(null, '', '#' + sec.id);
        }
        if(sheet._close) sheet._close();
      });
      nav.appendChild(a);
    });
  }

  // -----------------------
  // Boot
  // -----------------------
  initTheme();
  ensureLangButton();
  ensureMobileTocUI();
  wireLang();
  applyLang(getLang());
  initProgress();
  initCopy();
  initActiveNav();
  initAnchors();
  initReveal();
})();
