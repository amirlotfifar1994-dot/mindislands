(function(){
  'use strict';
  const root = document.documentElement;
  const LANG_KEY = 'mind-islands-lang';

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
      title: 'فهرست تله‌های شناختی | جزیره‌های ذهن',
      h1: 'فهرست تله‌های شناختی',
      lead: 'روی هر تله کلیک کن تا وارد صفحهٔ کاملش بشی. هر صفحه یک تم UI محور اختصاصی دارد و کلی جزئیات + سناریو + تمرین.',
      search: 'جستجو: مثلا «کمال‌گرایی» یا confirmation',
      clear: 'پاک کردن',
      empty: 'هیچی پیدا نشد. یا خیلی خاص دنبال می‌گردی، یا داری اسم تله را با اسم یک گروه متال اشتباه می‌گیری.',
      app: '🏝️ اپ',
      traps: '🧠 بخش تله‌ها'
    },
    en: {
      title: 'Cognitive traps | Mind Islands',
      h1: 'Cognitive traps',
      lead: 'Click any trap to open its full page. Each one has a dedicated UI theme plus details, scenarios, and practice.',
      search: 'Search: e.g. "Perfectionism" or confirmation',
      clear: 'Clear',
      empty: 'Nothing found. Either you are very specific, or you are mixing trap names with a metal band.',
      app: '🏝️ App',
      traps: '🧠 Traps'
    }
  };

  function normLang(x){
    x = (x||'').toString().toLowerCase().trim();
    return x.startsWith('en') ? 'en' : 'fa';
  }

  function getLang(){
    try { return normLang(localStorage.getItem(LANG_KEY) || root.lang || 'fa'); }
    catch(e) { return normLang(root.lang || 'fa'); }
  }

  function setLang(lang){
    lang = normLang(lang);
    const isFa = lang === 'fa';
    root.lang = lang;
    root.dir  = isFa ? 'rtl' : 'ltr';
    root.setAttribute('data-lang', lang);

    // Update lang button
    document.querySelectorAll('[data-mi-langbtn="1"]').forEach(btn => {
      btn.textContent = isFa ? 'EN' : 'FA';
      const tt = isFa ? 'English' : 'فارسی';
      btn.setAttribute('title', tt);
      btn.setAttribute('aria-label', tt);
    });

    // Nav labels
    document.querySelectorAll('.tp-nav a.tp-btn').forEach(a => {
      if(!a.dataset.miFaText) a.dataset.miFaText = a.textContent || '';
      const href = a.getAttribute('href') || '';
      if(href.includes('../index.html')) a.textContent = UI[lang].app;
      else if(href.includes('../index.html#traps')) a.textContent = UI[lang].traps;
    });

    // Headings + UI
    const h1 = document.querySelector('.ti-h1');
    if(h1){ if(!h1.dataset.miFaText) h1.dataset.miFaText = h1.textContent || ''; h1.textContent = UI[lang].h1; }
    const lead = document.querySelector('.ti-lead');
    if(lead){ if(!lead.dataset.miFaText) lead.dataset.miFaText = lead.textContent || ''; lead.textContent = UI[lang].lead; }

    const q = document.getElementById('q');
    if(q) q.setAttribute('placeholder', UI[lang].search);

    const clearBtn = document.getElementById('clear');
    if(clearBtn){ if(!clearBtn.dataset.miFaText) clearBtn.dataset.miFaText = clearBtn.textContent || ''; clearBtn.textContent = UI[lang].clear; }

    const empty = document.getElementById('empty');
    if(empty){ if(!empty.dataset.miFaText) empty.dataset.miFaText = empty.textContent || ''; empty.textContent = UI[lang].empty; }

    // Cards
    document.querySelectorAll('.ti-card').forEach(card => {
      const idEl = card.querySelector('.ti-meta');
      const id = idEl ? (idEl.textContent || '').trim() : '';
      const en = TRAPS_EN[id];
      const titleEl = card.querySelector('.ti-title');
      const descEl  = card.querySelector('.ti-desc');

      if(titleEl){
        if(!titleEl.dataset.miFaText) titleEl.dataset.miFaText = titleEl.textContent || '';
        titleEl.textContent = isFa ? titleEl.dataset.miFaText : (en ? en.title : titleEl.dataset.miFaText);
      }
      if(descEl){
        if(!descEl.dataset.miFaText) descEl.dataset.miFaText = descEl.textContent || '';
        descEl.textContent = isFa ? descEl.dataset.miFaText : (en ? en.lead : descEl.dataset.miFaText);
      }
    });

    // Document title
    if(!document.title) document.title = UI[lang].title;
    if(!document.body.dataset.miFaTitle) document.body.dataset.miFaTitle = document.title;
    document.title = isFa ? document.body.dataset.miFaTitle : UI[lang].title;

    try { localStorage.setItem(LANG_KEY, lang); } catch(e) {}
  }

  function wireLang(){
    document.querySelectorAll('[data-mi-langbtn="1"]').forEach(btn => {
      if(btn.dataset.miWired === '1') return;
      btn.dataset.miWired = '1';
      btn.addEventListener('click', ()=> setLang(getLang()==='fa' ? 'en' : 'fa'));
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    wireLang();
    setLang(getLang());
  });
})();
