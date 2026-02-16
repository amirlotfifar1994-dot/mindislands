(function(){
  'use strict';

  const root = document.documentElement;
  const LANG_KEY = 'mind-islands-lang';
  const THEME_KEY = 'mind-islands-theme';

  const ISLANDS = {
    analytical: { hue:210, icon:'🧠',
      fa:{ title:'جزیره تحلیلی', lead:'ساختاردهی و تصمیم‌گیری مرحله‌به‌مرحله' },
      en:{ title:'Analytical Island', lead:'Structured, step-by-step reasoning' }
    },
    creative: { hue:28, icon:'🎨',
      fa:{ title:'جزیره خلاق', lead:'ایده‌پردازی و دیدن امکانات تازه' },
      en:{ title:'Creative Island', lead:'Ideation and possibility thinking' }
    },
    critical: { hue:350, icon:'🧯',
      fa:{ title:'جزیره انتقادی', lead:'سنجش ادعاها و پیدا کردن خطاها' },
      en:{ title:'Critical Island', lead:'Stress-test claims and spot flaws' }
    },
    empathetic: { hue:142, icon:'🤝',
      fa:{ title:'جزیره همدل', lead:'فهم نیازها، احساسات و زمینه انسانی' },
      en:{ title:'Empathetic Island', lead:'Understand people, needs, and context' }
    },
    systemic: { hue:265, icon:'🕸️',
      fa:{ title:'جزیره سیستمی', lead:'دیدن ارتباط‌ها، حلقه‌ها و پیامدها' },
      en:{ title:'Systemic Island', lead:'See connections, loops, and effects' }
    },
    strategic: { hue:88, icon:'♟️',
      fa:{ title:'جزیره استراتژیک', lead:'هدف‌گذاری، اولویت و مسیر' },
      en:{ title:'Strategic Island', lead:'Goals, priorities, and pathways' }
    },
    experimental: { hue:200, icon:'🧪',
      fa:{ title:'جزیره تجربی', lead:'آزمون سریع، نمونه‌سازی و یادگیری' },
      en:{ title:'Experimental Island', lead:'Rapid testing and learning' }
    },
    combinatory: { hue:165, icon:'🧩',
      fa:{ title:'جزیره ترکیبی', lead:'چندلنزی فکر کردن و تعادل دیدگاه‌ها' },
      en:{ title:'Combinatory Island', lead:'Multi-lens thinking and balance' }
    },
    reflective: { hue:312, icon:'🪞',
      fa:{ title:'جزیره بازتابی', lead:'خودآگاهی، بازنگری و اصلاح مسیر' },
      en:{ title:'Reflective Island', lead:'Self-awareness and calibration' }
    },
  };

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


    document.querySelectorAll('[data-mi-lang]').forEach(el => {
      el.hidden = el.getAttribute('data-mi-lang') !== lang;
    });

    document.querySelectorAll('[data-mi-langbtn="1"]').forEach(btn => {
      btn.textContent = isFa ? 'EN' : 'FA';
      btn.title = isFa ? 'English' : 'فارسی';
      btn.setAttribute('aria-label', btn.title);
    });

    // Title + lead
    const id = (document.body && document.body.dataset && document.body.dataset.islandId) || '';
    const it = ISLANDS[id];
    if(it){
      root.style.setProperty('--accent-h', String(it.hue));
      const title = document.querySelector('[data-island-title]');
      const lead = document.querySelector('[data-island-lead]');
      if(title) title.textContent = it[lang].title;
      if(lead) lead.textContent = it[lang].lead;
      document.title = (lang === 'fa')
        ? (it.fa.title + ' | جزیره‌ها')
        : (it.en.title + ' | Islands');
    }
  }

  function applyTheme(theme){
    theme = (theme === 'light') ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    try{ localStorage.setItem(THEME_KEY, theme); }catch(e){}
    const meta = document.querySelector('meta[name=\"theme-color\"]');
    if(meta) meta.setAttribute('content', theme === 'light' ? '#fbfaf8' : '#070b14');
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

  function wireLangButton(){
    document.querySelectorAll('[data-mi-langbtn="1"]').forEach(btn=>{
      if(btn.dataset.miWired === '1') return;
      btn.dataset.miWired = '1';
      btn.addEventListener('click', ()=> applyLang(getLang()==='fa' ? 'en' : 'fa'));
    });
  }

  initTheme();
  applyLang(getLang());
  wireLangButton();
  reveal();
})();
