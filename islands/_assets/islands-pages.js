(function(){
  'use strict';

  const root = document.documentElement;
  const LANG_KEY = 'mind-islands-lang';
  const THEME_KEY = 'mind-islands-theme';

  const SECTION_LABELS = {
    fa: {
      open: 'صفحه جزیره',
      overview: 'شروع',
      framework: 'چارچوب',
      exercises: 'تمرین‌ها',
      traps: 'تله‌ها',
      checklist: 'چک‌لیست',
      combiners: 'ترکیبی‌ها'
    },
    en: {
      open: 'Island page',
      overview: 'Start',
      framework: 'Framework',
      exercises: 'Exercises',
      traps: 'Traps',
      checklist: 'Checklist',
      combiners: 'Combiners'
    }
  };

  const STAGE_LABELS = {
    fa: {
      1: 'اسکلت',
      2: 'محتوا (گسترش‌یافته)',
    },
    en: {
      1: 'Skeleton',
      2: 'Expanded content',
    }
  };

  const ISLANDS = [
    {
      id:'analytical', icon:'🧠', hue:210, stage:2,
      fa:{ title:'جزیره تحلیلی', lead:'ساختاردهی، مدل‌سازی، بررسی قدم‌به‌قدم' },
      en:{ title:'Analytical Island', lead:'Structure, models, step-by-step reasoning' },
      tags:{ fa:['منطق','مدل','وضوح'], en:['logic','models','clarity'] },
      quick:['open','overview','framework','exercises','traps','checklist']
    },
    {
      id:'creative', icon:'🎨', hue: 28, stage:1,
      fa:{ title:'جزیره خلاق', lead:'ایده‌پردازی، ترکیب‌های تازه، جسارت در امکانات' },
      en:{ title:'Creative Island', lead:'Ideation, novel combinations, possibility thinking' },
      tags:{ fa:['ایده','خلاقیت','نوآوری'], en:['ideas','creativity','innovation'] },
      quick:['open','overview','exercises','traps','combiners']
    },
    {
      id:'critical', icon:'🧯', hue: 350, stage:1,
      fa:{ title:'جزیره انتقادی', lead:'سنجش ادعاها، یافتن خطاها، دفاع از کیفیت' },
      en:{ title:'Critical Island', lead:'Stress-test claims, spot flaws, protect quality' },
      tags:{ fa:['دقت','ریسک','کیفیت'], en:['rigor','risk','quality'] },
      quick:['open','overview','exercises','traps','combiners']
    },
    {
      id:'empathetic', icon:'🤝', hue: 142, stage:1,
      fa:{ title:'جزیره همدل', lead:'فهم انسان‌ها، نیازها، احساسات و زمینه‌ها' },
      en:{ title:'Empathetic Island', lead:'Understand people, needs, emotions, and context' },
      tags:{ fa:['انسان','تعامل','احساس'], en:['people','rapport','emotion'] },
      quick:['open','overview','exercises','traps','combiners']
    },
    {
      id:'systemic', icon:'🕸️', hue: 265, stage:1,
      fa:{ title:'جزیره سیستمی', lead:'دیدن ارتباط‌ها، حلقه‌ها، پیامدهای ناخواسته' },
      en:{ title:'Systemic Island', lead:'See connections, loops, and unintended consequences' },
      tags:{ fa:['سیستم','پیامد','شبکه'], en:['systems','effects','networks'] },
      quick:['open','overview','exercises','traps','combiners']
    },
    {
      id:'strategic', icon:'♟️', hue: 88, stage:1,
      fa:{ title:'جزیره استراتژیک', lead:'هدف، اولویت، مسیر، و تصمیم‌های بلندمدت' },
      en:{ title:'Strategic Island', lead:'Goals, priorities, pathways, long-term decisions' },
      tags:{ fa:['هدف','اولویت','مسیر'], en:['goals','priorities','roadmap'] },
      quick:['open','overview','exercises','traps','combiners']
    },
    {
      id:'experimental', icon:'🧪', hue: 200, stage:1,
      fa:{ title:'جزیره تجربی', lead:'آزمون سریع، نمونه‌سازی، یادگیری از داده' },
      en:{ title:'Experimental Island', lead:'Rapid tests, prototyping, learning from evidence' },
      tags:{ fa:['آزمایش','پروتوتایپ','یادگیری'], en:['testing','prototyping','learning'] },
      quick:['open','overview','exercises','traps','combiners']
    },
    {
      id:'combinatory', icon:'🧩', hue: 165, stage:1,
      fa:{ title:'جزیره ترکیبی', lead:'چندلنزی فکر کردن، ترکیب دیدگاه‌ها، تعادل' },
      en:{ title:'Combinatory Island', lead:'Multi-lens thinking, combining perspectives, balance' },
      tags:{ fa:['ترکیب','تعادل','چندلنزی'], en:['combine','balance','multi-lens'] },
      quick:['open','overview','exercises','traps','combiners']
    },
    {
      id:'reflective', icon:'🪞', hue: 312, stage:1,
      fa:{ title:'جزیره بازتابی', lead:'خودآگاهی، بازنگری، اصلاح مسیر و عادت‌ها' },
      en:{ title:'Reflective Island', lead:'Self-awareness, review, calibration, habit change' },
      tags:{ fa:['خودآگاهی','بازنگری','عادت'], en:['self-awareness','review','habits'] },
      quick:['open','overview','exercises','traps','combiners']
    },
  ];

  function normLang(x){ return (x === 'en') ? 'en' : 'fa'; }
  function getLang(){
    try{ return normLang(localStorage.getItem(LANG_KEY) || root.lang || 'fa'); }
    catch(e){ return normLang(root.lang || 'fa'); }
  }

  function applyLang(lang){
    lang = normLang(lang);
    const isFa = lang === 'fa';
    root.lang = lang;
    root.dir = isFa ? 'rtl' : 'ltr';
    root.setAttribute('data-lang', lang);
    try{ localStorage.setItem(LANG_KEY, lang); }catch(e){}

    // Notify other modules (e.g., enhancements) about language change
    try{ window.dispatchEvent(new CustomEvent('mi-lang-change', { detail:{ lang } })); }catch(e){ try{ window.dispatchEvent(new Event('mi-lang-change')); }catch(_e){} }


    document.querySelectorAll('[data-mi-lang]').forEach(el=>{
      el.hidden = el.getAttribute('data-mi-lang') !== lang;
    });

    document.querySelectorAll('[data-mi-langbtn="1"]').forEach(btn=>{
      btn.textContent = isFa ? 'EN' : 'FA';
      btn.title = isFa ? 'English' : 'فارسی';
      btn.setAttribute('aria-label', btn.title);
    });

    const q = document.getElementById('q');
    if(q) q.placeholder = isFa ? 'جستجو: مثلا «تحلیلی» یا analytical' : 'Search: e.g. analytical or «تحلیلی»';

    // re-render to swap text
    render();
  }

  function applyTheme(theme){
    theme = (theme === 'light') ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    try{ localStorage.setItem(THEME_KEY, theme); }catch(e){}
    const btn = document.querySelector('[data-theme-toggle]');
    if(btn) btn.textContent = (theme === 'light') ? '☀️' : '🌙';
  }

  function initTheme(){
    let theme = 'dark';
    try{
      const saved = localStorage.getItem(THEME_KEY);
      if(saved === 'light' || saved === 'dark') theme = saved;
      else {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        theme = prefersLight ? 'light' : 'dark';
      }
    }catch(e){}
    applyTheme(theme);

    const btn = document.querySelector('[data-theme-toggle]');
    if(btn){
      btn.addEventListener('click', ()=>{
        const cur = root.getAttribute('data-theme') || 'dark';
        applyTheme(cur === 'dark' ? 'light' : 'dark');
      });
    }
  }

  function reveal(){
    if(!('IntersectionObserver' in window)) return;
    const els = Array.from(document.querySelectorAll('.mi-reveal'));
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(el=>io.observe(el));
  }

  function qv(){
    const q = document.getElementById('q');
    return (q && q.value ? q.value.trim().toLowerCase() : '');
  }

  function matchIsland(it, query){
    if(!query) return true;
    const blob = [
      it.id,
      it.fa.title, it.fa.lead,
      it.en.title, it.en.lead,
      (it.tags.fa||[]).join(' '),
      (it.tags.en||[]).join(' ')
    ].join(' ').toLowerCase();
    return blob.includes(query);
  }

  function escapeHtml(s){
    return String(s||'').replace(/[&<>"']/g, (ch)=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[ch]));
  }

  function stageLabel(lang, n){
    const map = STAGE_LABELS[lang] || STAGE_LABELS.fa;
    return map[n] || map[1];
  }

  function actionHref(it, key){
    const base = './' + it.id + '/index.html';
    if(key === 'open') return base;
    return base + '#' + key;
  }

  function actionLabel(lang, key){
    const map = SECTION_LABELS[lang] || SECTION_LABELS.fa;
    return map[key] || key;
  }

  function islandCard(it, lang){
    const t = it[lang];
    const tags = (it.tags && it.tags[lang]) ? it.tags[lang] : [];
    const href = './' + it.id + '/index.html';

    const quick = Array.isArray(it.quick) ? it.quick : ['open'];
    const actions = quick.map((k, idx)=>{
      const aHref = actionHref(it, k);
      const label = escapeHtml(actionLabel(lang, k));
      const cls = (k === 'open') ? 'is-act is-act--primary' : 'is-act';
      return `<a class="${cls}" href="${aHref}">${label}</a>`;
    }).join('');

    return `
      <article class="is-card mi-reveal" data-href="${href}" style="--accent-h:${it.hue}" tabindex="0" role="link" aria-label="${escapeHtml(t.title)}">
        <div class="is-card__top">
          <div class="is-chip" aria-hidden="true">${it.icon}</div>
          <div class="is-head">
            <div class="is-title">${escapeHtml(t.title)}</div>
            <div class="is-stage">
              <span class="is-badge">${escapeHtml(stageLabel(lang, it.stage || 1))}</span>
              <span class="is-id">${escapeHtml(it.id)}</span>
            </div>
          </div>
          <div class="is-arrow" aria-hidden="true">↗</div>
        </div>
        <div class="is-desc">${escapeHtml(t.lead)}</div>
        <div class="is-actions">${actions}</div>
        <div class="is-tags">${tags.map(x=>`<span class="is-tag">${escapeHtml(x)}</span>`).join('')}</div>
      </article>
    `;
  }

  function wireCardClicks(){
    if(document.body.dataset.miCardsWired === '1') return;
    document.body.dataset.miCardsWired = '1';

    // Click on card navigates, but don't hijack actual links/buttons.
    document.addEventListener('click', (ev)=>{
      const t = ev.target;
      if(!(t instanceof Element)) return;
      if(t.closest('a, button, input, summary')) return;
      const card = t.closest('.is-card');
      if(!card) return;
      const href = card.getAttribute('data-href');
      if(href) window.location.href = href;
    });

    // Keyboard: Enter / Space open main page
    document.addEventListener('keydown', (ev)=>{
      const t = ev.target;
      if(!(t instanceof Element)) return;
      if(!t.classList.contains('is-card')) return;
      const k = ev.key;
      if(k !== 'Enter' && k !== ' ') return;
      ev.preventDefault();
      const href = t.getAttribute('data-href');
      if(href) window.location.href = href;
    });
  }

  function render(){
    const lang = getLang();
    const grid = document.getElementById('grid');
    const emptyFa = document.getElementById('empty');
    const emptyEn = document.getElementById('empty_en');
    if(!grid) return;

    const query = qv();
    const items = ISLANDS.filter(it=>matchIsland(it, query));
    grid.innerHTML = items.map(it=>islandCard(it, lang)).join('');

    const has = items.length > 0;
    if(emptyFa) emptyFa.style.display = (!has && lang==='fa') ? 'block' : 'none';
    if(emptyEn) emptyEn.style.display = (!has && lang==='en') ? 'block' : 'none';

    wireCardClicks();
    requestAnimationFrame(reveal);
  }

  function wire(){
    const btn = document.querySelector('[data-mi-langbtn="1"]');
    if(btn){
      btn.addEventListener('click', ()=>{
        applyLang(getLang()==='fa' ? 'en' : 'fa');
      });
    }

    const q = document.getElementById('q');
    if(q){
      q.addEventListener('input', render);
    }

    const clearFa = document.getElementById('clear');
    const clearEn = document.getElementById('clear_en');
    function clear(){
      if(q) q.value='';
      render();
      if(q) q.focus();
    }
    if(clearFa) clearFa.addEventListener('click', clear);
    if(clearEn) clearEn.addEventListener('click', clear);
  }

  // init
  initTheme();
  applyLang(getLang());
  wire();
  render();
})();
