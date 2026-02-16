/* MindIslands: lightweight enhancer
   - Theme toggle wiring (works even if app has no theme)
   This file is intentionally tiny to avoid UI lag on local servers.
*/
(function(){
  const THEME_KEY = 'mind-islands-theme';

  function norm(t){ return (t === 'light') ? 'light' : 'dark'; }

  function getTheme(){
    try { return norm(localStorage.getItem(THEME_KEY) || document.documentElement.getAttribute('data-theme') || 'dark'); }
    catch (_) { return norm(document.documentElement.getAttribute('data-theme') || 'dark'); }
  }

  function themeLabel(theme){
    const lang = (document.documentElement.lang || 'fa').toLowerCase();
    if (lang.startsWith('fa')) return theme === 'light' ? '☀️ سفید' : '🌙 تیره';
    return theme === 'light' ? '☀️ Light' : '🌙 Dark';
  }

  function updateThemeLabels(){
    const theme = getTheme();
    document.querySelectorAll('[data-mi-themebtn="1"]').forEach(btn=>{
      btn.textContent = themeLabel(theme);
      const title = (document.documentElement.lang || 'fa').toLowerCase().startsWith('fa') ? 'تغییر تم' : 'Toggle theme';
      btn.setAttribute('title', title);
      btn.setAttribute('aria-label', title);
    });
  }

  function setTheme(t){
    const theme = norm(t);
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#fbfaf8' : '#070b14');

    updateThemeLabels();
  }

  function wireThemeButtons(){
    document.querySelectorAll('[data-mi-themebtn="1"]').forEach(btn=>{
      if (btn.dataset.miWired === '1') return;
      btn.dataset.miWired = '1';
      btn.addEventListener('click', function(){
        setTheme(getTheme() === 'light' ? 'dark' : 'light');
      });
    });
    updateThemeLabels();
  }

  // Dock quick links removed (user requested a clean dock: theme button only).
  function isFa(){
    const lang = (document.documentElement.getAttribute('lang') || 'fa').toLowerCase();
    return lang.startsWith('fa');
  }

  function updateDockLinkLabels(){
    const fa = isFa();
    document.querySelectorAll('[data-mi-docklink="1"]').forEach(el=>{
      const t = fa ? (el.getAttribute('data-fa')||'') : (el.getAttribute('data-en')||'');
      if(t) el.textContent = t;
    });
  }

  function ensureDockLinks(){
    // Intentionally disabled: keep dock minimal (theme button only).
    return;
  }

  // Early apply (in case inline boot was skipped)
  setTheme(getTheme());

  document.addEventListener('DOMContentLoaded', function(){
    wireThemeButtons();

    // Update labels if app toggles language or theme attributes
    const mo = new MutationObserver((muts)=>{
      for (const m of muts){
        if (m.type === 'attributes' && (m.attributeName === 'lang' || m.attributeName === 'dir' || m.attributeName === 'data-theme')){
          updateThemeLabels();
                return;
        }
      }
    });
    mo.observe(document.documentElement, { attributes:true });
  });
})();


/* =========================
   Mind Islands: smarter internal linking
   - Enrich Personality Result with "Likely Traps" linked to full trap pages
   - Reacts to language changes (mi-lang-change)
   ========================= */
(function(){
  const LANG_KEY = "mind-islands-lang";
  const PROGRESS_KEY = "mind-islands-progress";

  // Trap meta: { trapId: {fa,en} }
  const MI_TRAP_META = {"confirmation_bias": {"fa": "سوگیری تأیید", "en": "Confirmation Bias"}, "anchoring": {"fa": "لنگر انداختن", "en": "Anchoring"}, "analysis_paralysis": {"fa": "فلج تحلیل", "en": "Analysis Paralysis"}, "over_thinking": {"fa": "بیش‌تحلیلی", "en": "Over Thinking"}, "perfectionism": {"fa": "کمال‌گرایی", "en": "Perfectionism"}, "dunning_kruger": {"fa": "اثر دانینگ-کروگر", "en": "Dunning Kruger"}, "shiny_object": {"fa": "سندرم جذابیت نو", "en": "Shiny Object"}, "idea_hoarding": {"fa": "انبار ایده", "en": "Idea Hoarding"}, "novelty_bias": {"fa": "سوگیری تازگی", "en": "Novelty Bias"}, "all_or_nothing": {"fa": "همه یا هیچ", "en": "All Or Nothing"}, "cynicism": {"fa": "بدبینی", "en": "Cynicism"}, "nitpicking": {"fa": "موشکافی", "en": "Nitpicking"}, "false_dilemma": {"fa": "دوگانه دروغین", "en": "False Dilemma"}, "emotional_reasoning": {"fa": "استدلال احساسی", "en": "Emotional Reasoning"}, "empathy_overload": {"fa": "بیش‌همدلی", "en": "Empathy Overload"}, "projection": {"fa": "پروژکشن", "en": "Projection"}, "mind_reading": {"fa": "ذهن‌خوانی", "en": "Mind Reading"}, "complexity_bias": {"fa": "سوگیری پیچیدگی", "en": "Complexity Bias"}, "forest_for_trees": {"fa": "جنگل و درخت", "en": "Forest For Trees"}, "single_cause": {"fa": "تک‌علتی", "en": "Single Cause"}, "sunk_cost": {"fa": "هزینه غرق‌شده", "en": "Sunk Cost"}, "planning_fallacy": {"fa": "خطای برنامه‌ریزی", "en": "Planning Fallacy"}, "status_quo": {"fa": "سوگیری وضع موجود", "en": "Status Quo"}, "action_bias": {"fa": "سوگیری عمل", "en": "Action Bias"}, "outcome_bias": {"fa": "سوگیری نتیجه", "en": "Outcome Bias"}, "premature_optimization": {"fa": "بهینه‌سازی زودرس", "en": "Premature Optimization"}, "small_sample": {"fa": "نمونه کوچک", "en": "Small Sample"}, "groupthink": {"fa": "تفکر گروهی", "en": "Groupthink"}, "style_paralysis": {"fa": "فلج چندسبکی", "en": "Style Paralysis"}, "hindsight": {"fa": "گذشته‌نگری", "en": "Hindsight"}, "rumination": {"fa": "نشخوار فکری", "en": "Rumination"}, "self_blame": {"fa": "خودسرزنشی", "en": "Self Blame"}, "regret": {"fa": "پشیمانی", "en": "Regret"}, "overthinking_past": {"fa": "بیش‌فکری گذشته", "en": "Overthinking Past"}, "catastrophizing": {"fa": "فاجعه‌سازی", "en": "Catastrophizing"}, "loss_aversion": {"fa": "گریز از ضرر", "en": "Loss Aversion"}, "overconfidence": {"fa": "اعتماد بیش از حد", "en": "Overconfidence"}, "availability_heuristic": {"fa": "تداعی در دسترس", "en": "Availability Heuristic"}, "bandwagon": {"fa": "اثر گله‌ای", "en": "Bandwagon"}, "halo_effect": {"fa": "اثر هاله‌ای", "en": "Halo Effect"}, "fundamental_attribution": {"fa": "خطای نسبت‌دهی بنیادی", "en": "Fundamental Attribution"}, "ambiguity_effect": {"fa": "اثر ابهام", "en": "Ambiguity Effect"}, "cascade": {"fa": "نگرانی‌های زنجیره‌ای", "en": "Cascade"}, "devils_advocate_trap": {"fa": "تله مخالفت", "en": "Devils Advocate Trap"}, "echo_chamber": {"fa": "اتاق پژواک", "en": "Echo Chamber"}, "isolation_bias": {"fa": "سوگیری انزوا", "en": "Isolation Bias"}, "optimism_bias": {"fa": "سوگیری خوش‌بینی", "en": "Optimism Bias"}, "recency_bias": {"fa": "سوگیری تازگی", "en": "Recency Bias"}, "satisficing": {"fa": "رضایت زودهنگام", "en": "Satisficing"}, "survivorship_bias": {"fa": "سوگیری بازماندگان", "en": "Survivorship Bias"}, "tunnel_vision": {"fa": "دید تونلی", "en": "Tunnel Vision"}};

  // Island -> traps mapping (plus a few missing traps manually assigned)
  const MI_ISLANDS = {"analytical": {"fa": "تحلیلی", "en": "Analytical", "traps": ["confirmation_bias", "anchoring", "analysis_paralysis", "over_thinking", "perfectionism", "dunning_kruger", "ambiguity_effect", "availability_heuristic", "satisficing", "survivorship_bias", "tunnel_vision"]}, "creative": {"fa": "خلاق", "en": "Creative", "traps": ["shiny_object", "idea_hoarding", "novelty_bias", "optimism_bias", "all_or_nothing"]}, "critical": {"fa": "انتقادی", "en": "Critical", "traps": ["cynicism", "nitpicking", "confirmation_bias", "dunning_kruger", "false_dilemma", "ambiguity_effect", "availability_heuristic", "devils_advocate_trap", "echo_chamber", "survivorship_bias"]}, "empathetic": {"fa": "همدلانه", "en": "Empathetic", "traps": ["emotional_reasoning", "empathy_overload", "projection", "halo_effect", "mind_reading", "bandwagon", "catastrophizing", "fundamental_attribution", "isolation_bias"]}, "systemic": {"fa": "سیستمی", "en": "Systems", "traps": ["complexity_bias", "forest_for_trees", "analysis_paralysis", "single_cause", "bandwagon", "cascade", "echo_chamber", "fundamental_attribution"]}, "strategic": {"fa": "استراتژیک", "en": "Strategic", "traps": ["sunk_cost", "planning_fallacy", "status_quo", "optimism_bias", "loss_aversion", "recency_bias", "satisficing", "tunnel_vision"]}, "experimental": {"fa": "تجربی", "en": "Experimental", "traps": ["action_bias", "outcome_bias", "premature_optimization", "shiny_object", "small_sample", "recency_bias"]}, "combinatory": {"fa": "ترکیبی", "en": "Combinatory", "traps": ["analysis_paralysis", "overconfidence", "groupthink", "style_paralysis"]}, "reflective": {"fa": "بازنگرانه", "en": "Reflective", "traps": ["hindsight", "rumination", "self_blame", "regret", "overthinking_past", "catastrophizing", "isolation_bias"]}};

  // Expose minimal meta for other enhancers (safe, read-only)
  try{
    window.__MI_TRAP_META = MI_TRAP_META;
    window.__MI_ISLANDS_META = MI_ISLANDS;
  }catch(_){}

  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const normScore=(v)=>{
    if(v==null) return 0;
    const n = Number(v);
    if(!isFinite(n)) return 0;
    // app stores 0..100
    return n>1 ? clamp(n/100,0,1) : clamp(n,0,1);
  };

  function getLang(){
    try{ return (localStorage.getItem(LANG_KEY)==="en") ? "en" : "fa"; }
    catch(e){ return "fa"; }
  }

  function readProgress(){
    try{ return JSON.parse(localStorage.getItem(PROGRESS_KEY)||"{}"); }
    catch(e){ return {}; }
  }

  function computeLikelyTraps(scores){
    if(!scores || typeof scores!=="object") return [];
    const trapScores = new Map();

    // build from islands mapping
    Object.keys(MI_ISLANDS).forEach((islandId)=>{
      const s = normScore(scores[islandId]);
      if(!s) return;
      const traps = (MI_ISLANDS[islandId] && MI_ISLANDS[islandId].traps) || [];
      traps.forEach((tid)=>{
        if(!tid) return;
        const prev = trapScores.get(tid) || {score:0, islands: new Set()};
        prev.score += s;
        prev.islands.add(islandId);
        trapScores.set(tid, prev);
      });
    });

    // ensure ALL traps exist (even if score is 0) so we can still show something reasonable
    Object.keys(MI_TRAP_META).forEach((tid)=>{
      if(!trapScores.has(tid)) trapScores.set(tid, {score:0, islands:new Set()});
    });

    const arr = Array.from(trapScores.entries()).map(([id, v])=>({
      id,
      score: v.score,
      islands: Array.from(v.islands || [])
    }));

    // Sort by score desc; if tie, alphabetical to stay stable
    arr.sort((a,b)=> (b.score-a.score) || a.id.localeCompare(b.id));

    // Prefer traps with non-zero score, but fallback to top overall if everything is zero.
    const nonZero = arr.filter(x=>x.score>0.0001);
    const pick = (nonZero.length ? nonZero : arr).slice(0, 10);

    // Normalize to 0..1 for badges
    const max = Math.max(...pick.map(x=>x.score), 0.0001);
    return pick.map(x=>({
      ...x,
      rel: clamp(x.score / max, 0, 1)
    }));
  }

  function riskLabel(rel, lang){
    if(rel>=0.75) return lang==="fa" ? "ریسک بالا" : "High";
    if(rel>=0.45) return lang==="fa" ? "ریسک متوسط" : "Medium";
    return lang==="fa" ? "ریسک کم" : "Low";
  }

  function islandNames(ids, lang){
    const names = (ids||[]).map(id=>MI_ISLANDS[id] ? (lang==="fa" ? MI_ISLANDS[id].fa : MI_ISLANDS[id].en) : id);
    return names.filter(Boolean).slice(0,3);
  }

  function renderTrapSuggestions(container, items, lang){
    container.innerHTML = "";

    const header = document.createElement("div");
    header.className = "flex items-start justify-between gap-4 mb-4";

    const left = document.createElement("div");
    left.className = "flex-1";

    const h = document.createElement("h3");
    h.className = "text-lg font-bold text-white mb-1";
    h.textContent = lang==="fa" ? "تله‌های محتمل برای شما" : "Likely thinking traps for you";

    const p = document.createElement("p");
    p.className = "text-white/60 text-sm leading-relaxed";
    p.textContent = lang==="fa"
      ? "بر اساس امتیاز سبک‌های تفکر شما، این تله‌ها محتمل‌ترند. روی هر مورد بزنید تا صفحه کامل تله باز شود."
      : "Based on your thinking-style scores, these traps are more likely. Tap any item to open the full trap page.";

    left.appendChild(h);
    left.appendChild(p);

    const hint = document.createElement("div");
    hint.className = "text-white/40 text-xs mt-1";
    hint.textContent = lang==="fa"
      ? "نکته: این‌ها «تشخیص قطعی» نیستند؛ یک نقشه راه برای خودآگاهی‌اند."
      : "Note: not a diagnosis, just a self-awareness map.";

    left.appendChild(hint);

    header.appendChild(left);
    container.appendChild(header);

    const grid = document.createElement("div");
    grid.className = "grid md:grid-cols-2 gap-3";

    items.forEach((it, idx)=>{
      const meta = MI_TRAP_META[it.id] || {fa: it.id, en: it.id.replace(/_/g,' ')};
      const title = lang==="fa" ? meta.fa : meta.en;

      const a = document.createElement("a");
      a.href = `traps/${it.id}.html`;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.className = "group block rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-colors p-4";

      const top = document.createElement("div");
      top.className = "flex items-start justify-between gap-3 mb-2";

      const t = document.createElement("div");
      t.className = "text-white font-semibold leading-snug";
      t.textContent = title;

      const badge = document.createElement("span");
      badge.className = "shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs border border-white/10 bg-white/5 text-white/70";
      badge.textContent = riskLabel(it.rel, lang);

      top.appendChild(t);
      top.appendChild(badge);

      const sub = document.createElement("div");
      sub.className = "text-white/50 text-xs leading-relaxed";
      const islands = islandNames(it.islands, lang);
      sub.textContent = islands.length
        ? (lang==="fa" ? `ارتباط بیشتر با: ${islands.join("، ")}` : `Mostly linked to: ${islands.join(", ")}`)
        : (lang==="fa" ? "برای دیدن جزئیات کلیک کنید" : "Click for details");

      const barWrap = document.createElement("div");
      barWrap.className = "mt-3 h-2 rounded-full bg-white/5 overflow-hidden border border-white/10";
      const bar = document.createElement("div");
      bar.className = "h-full rounded-full bg-white/30";
      bar.style.width = `${Math.round(it.rel*100)}%`;
      barWrap.appendChild(bar);

      a.appendChild(top);
      a.appendChild(sub);
      a.appendChild(barWrap);

      grid.appendChild(a);
    });

    container.appendChild(grid);

    const footer = document.createElement("div");
    footer.className = "mt-4 flex flex-wrap gap-2";
    const btn1 = document.createElement("a");
    btn1.href = "traps/index.html";
    btn1.target = "_blank";
    btn1.rel = "noreferrer";
    btn1.className = "inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm border border-white/10 transition-colors";
    btn1.textContent = lang==="fa" ? "مشاهده همه تله‌ها" : "Browse all traps";

    const btn2 = document.createElement("button");
    btn2.type = "button";
    btn2.className = "inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-sm border border-white/10 transition-colors";
    btn2.textContent = lang==="fa" ? "باز کردن سبک غالب" : "Open dominant style";
    btn2.addEventListener("click", ()=>{
      // There's already an internal nav button in React for island detail via dominant style.
      // We can't call React directly, but we can gently guide the user.
      try{
        const el = document.querySelector('#root button, #root a');
        // no-op; leaving as just UI hint
      }catch(e){}
      // small toast
      toast(lang==="fa" ? "از داخل نتیجه تست، روی سبک غالب‌تان بزنید تا وارد جزیره‌اش شوید." : "From the result page, click your dominant style to open its island.");
    });

    footer.appendChild(btn1);
    footer.appendChild(btn2);
    container.appendChild(footer);
  }

  // tiny toast (non-invasive)
  let toastTimer=null;
  function toast(msg){
    try{
      let t=document.querySelector('[data-mi-toast]');
      if(!t){
        t=document.createElement('div');
        t.setAttribute('data-mi-toast','1');
        t.style.position='fixed';
        t.style.zIndex='9999';
        t.style.bottom='18px';
        t.style.left=(document.documentElement.dir==='rtl')?'18px':'auto';
        t.style.right=(document.documentElement.dir==='rtl')?'auto':'18px';
        t.style.maxWidth='min(480px, calc(100vw - 36px))';
        t.style.padding='10px 12px';
        t.style.borderRadius='14px';
        t.style.border='1px solid rgba(255,255,255,.12)';
        t.style.background='rgba(15, 23, 42, .85)';
        t.style.backdropFilter='blur(10px)';
        t.style.color='rgba(255,255,255,.85)';
        t.style.fontSize='12px';
        t.style.lineHeight='1.5';
        t.style.boxShadow='0 12px 30px rgba(0,0,0,.35)';
        t.style.opacity='0';
        t.style.transform='translateY(8px)';
        t.style.transition='opacity .18s ease, transform .18s ease';
        document.body.appendChild(t);
      }
      t.textContent=msg;
      clearTimeout(toastTimer);
      requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translateY(0)'; });
      toastTimer=setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(8px)'; }, 2800);
    }catch(e){}
  }

  function isPersonalityResultView(root){
    const span = root.querySelector("h1 .gradient-text");
    if(!span) return false;
    const txt = (span.textContent||"").trim();
    return txt.includes("نتیجه تست شخصیت") || txt.includes("Personality Test Result") || txt.includes("نتیجه تست");
  }

  function inject(){
    const root = document.getElementById("root");
    if(!root) return;
    if(!isPersonalityResultView(root)) return;

    const lang = getLang();
    const prog = readProgress();
    const scores = (prog.personalityResult && prog.personalityResult.scores) || prog.islandScores || null;
    if(!scores) return;

    const wrap = root.querySelector(".max-w-4xl");
    if(!wrap) return;

    const grid = wrap.querySelector(".grid.lg\\:grid-cols-2") || wrap.querySelector(".grid");
    if(!grid) return;

    // Remove old inject (re-render)
    const old = wrap.querySelector("[data-mi-trap-suggestions]");
    if(old) old.remove();

    const items = computeLikelyTraps(scores);
    if(!items || !items.length) return;

    const box = document.createElement("section");
    box.setAttribute("data-mi-trap-suggestions","1");
    box.className = "glass p-6 rounded-2xl mb-8 animate-slide-up stagger-3";
    renderTrapSuggestions(box, items, lang);

    wrap.insertBefore(box, grid);
  }

  let scheduled=false;
  function schedule() {
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(()=>{ scheduled=false; inject(); });
  }

  window.addEventListener("mi-lang-change", schedule);

  window.addEventListener("DOMContentLoaded", ()=>{
    const root = document.getElementById("root");
    if(!root) return;
    const obs = new MutationObserver(schedule);
    obs.observe(root, {childList:true, subtree:true});
    schedule();
  });
})();


/* =========================
   Mind Islands: Island detail enhancements
   - Adds "Main / Deep dive" jump links inside Island Detail view
   - Adds supplementary card-based (Show details) content per island
   - Makes "Related Traps" items clickable and links to trap pages
   ========================= */
(function(){
  const LANG_KEY = "mind-islands-lang";
  const OFFSET = 92;

  const ISLAND_SUPP = {
    analytical: {
      fa: {
        patterns: [
          "مسئله را به «فرضیه‌های قابل آزمون» تبدیل کن (نه یک بحث بی‌انتها).",
          "تعریف «معیار موفقیت» قبل از جمع‌آوری داده.",
          "جداکردن داده، تفسیر و حدس (سه ستون جدا).",
          "پیش‌فرض‌های شکننده را لیست کن: اگر غلط باشند، تصمیم می‌ریزد."
        ],
        checklist: [
          "مسئله در یک جمله + معیار موفقیت",
          "۳ فرض کلیدی + راه آزمون هرکدام",
          "حداقل ۲ گزینه واقعی (نه فقط یک پاسخ)",
          "ریسک بزرگ + برنامه کاهش ریسک",
          "قدم بعدی قابل انجام در ۲۴ ساعت"
        ],
        overuse: [
          "وقتی هر سؤال جدید باعث می‌شود تصمیم عقب بیفتد.",
          "وقتی برای «اطمینان ۱۰۰٪» دنبال داده‌ای می‌گردی که وجود ندارد.",
          "وقتی گزینه‌ها را می‌کُشی چون کامل نیستند."
        ],
        tools: [
          { title: "قالب ۳ ستونه", body: "داده / تفسیر / حدس. هر جمله را یکی از این سه تا کن. اگر نشد، مبهم است." },
          { title: "قانون توقف", body: "برای تصمیم‌های کم‌ریسک، سقف زمان بگذار. بعد از آن باید «انتخاب + معیار بازنگری» بنویسی." },
          { title: "حداقل آزمایش", body: "کوچک‌ترین تستی که فرض کلیدی را می‌شکند چیست؟ همان را اول انجام بده." }
        ]
      },
      en: {
        patterns: [
          "Turn the problem into testable hypotheses (not endless debate).",
          "Define success criteria before collecting more data.",
          "Separate data, interpretation, and guesses (three distinct buckets).",
          "List fragile assumptions: if wrong, the decision collapses."
        ],
        checklist: [
          "One-sentence problem + success metric",
          "3 key assumptions + how to test each",
          "At least 2 real options",
          "Biggest risk + mitigation",
          "Next action doable within 24 hours"
        ],
        overuse: [
          "Every new question delays the decision.",
          "You chase '100% certainty' where none exists.",
          "You kill options because they're not perfect."
        ],
        tools: [
          { title: "3-column template", body: "Data / Interpretation / Guess. Classify every statement. If you can't, it's vague." },
          { title: "Stop rule", body: "For low-risk decisions, set a time cap. After that: choose + define a review trigger." },
          { title: "Minimum test", body: "What's the smallest experiment that could invalidate the core assumption? Do that first." }
        ]
      }
    },

    creative: {
      fa: {
        patterns: [
          "به جای «راه‌حل»، اول ۱۰ «قاب‌بندی» متفاوت از مسئله بساز.",
          "ایده‌های بد را سریع تولید کن تا به ایده‌های خوب برسد (کم‌سانسور).",
          "از حوزه‌های دیگر استعاره بگیر: محصول مثل بازی؟ مثل سیستم صف؟",
          "برای هر ایده، یک نسخه «قابل تست در ۷ روز» تعریف کن."
        ],
        checklist: [
          "۱۰ ایده خام",
          "۳ ایده قابل تست",
          "۱ ایده کم‌هزینه/کم‌ریسک برای شروع",
          "معیار یادگیری (نه فقط معیار موفقیت)",
          "یک محدودیت را عمداً حذف کن و دوباره فکر کن"
        ],
        overuse: [
          "ایده زیاد است ولی هیچ‌کدام «تبدیل به اقدام» نمی‌شود.",
          "هر هفته مسیر عوض می‌شود چون چیز جدید جذاب‌تر است.",
          "واقعیت‌های پایه (زمان/بودجه) نادیده گرفته می‌شوند."
        ],
        tools: [
          { title: "۲ دقیقه ایده‌ریزی", body: "۲ دقیقه تایمر. هر چیزی به ذهن آمد بنویس. بعد فقط ۱ مورد را انتخاب کن برای تست." },
          { title: "بازقاب‌بندی", body: "مسئله را مثل: محدودیت، فرصت، بازی، سیستم، گفت‌وگو دوباره بنویس." },
          { title: "پل به واقعیت", body: "برای ایده انتخاب‌شده: کاربر؟ درد؟ ارزش؟ هزینه؟ یک جمله برای هرکدام." }
        ]
      },
      en: {
        patterns: [
          "Before solutions, create 10 different framings of the problem.",
          "Generate 'bad ideas' fast to reach good ones (low censorship).",
          "Borrow metaphors from other domains (game, queue system, etc.).",
          "For each idea, define a 7-day testable version."
        ],
        checklist: [
          "10 raw ideas",
          "3 testable ideas",
          "1 low-cost starting point",
          "Learning metric (not just success metric)",
          "Remove one constraint on purpose and re-think"
        ],
        overuse: [
          "Many ideas, zero execution.",
          "Constant direction changes due to novelty.",
          "Basic constraints (time/budget) get ignored."
        ],
        tools: [
          { title: "2-minute ideation", body: "Set a 2-minute timer. Write anything. Then pick ONE item to test." },
          { title: "Reframe", body: "Rewrite the problem as: constraint, opportunity, game, system, conversation." },
          { title: "Bridge to reality", body: "For the chosen idea: user, pain, value, cost. One sentence each." }
        ]
      }
    },

    critical: {
      fa: {
        patterns: [
          "حمله به ایده نیست، تست ایده است: «کجا می‌شکند؟»",
          "به جای رد کامل، شرط قبولی بگذار: «اگر X ثابت شد، می‌پذیرم.»",
          "خطاهای منطقی رایج را چک کن (دوگانه دروغین، تعمیم، حمله شخصی).",
          "همزمان یک «نسخه بهتر» پیشنهاد بده، نه فقط نقد."
        ],
        checklist: [
          "ادعای اصلی در یک جمله",
          "شواهد موافق/مخالف (هرکدام حداقل ۲ مورد)",
          "شرط پذیرش (چه چیزی نظرت را عوض می‌کند؟)",
          "نقطه شکست (worst-case) + احتمال تقریبی",
          "یک پیشنهاد اصلاحی کوچک"
        ],
        overuse: [
          "نقد تبدیل به بدبینی دائمی می‌شود.",
          "تیم حس می‌کند هیچ‌چیز کافی نیست.",
          "انرژی تولید راه‌حل پایین می‌آید."
        ],
        tools: [
          { title: "شرط تغییر نظر", body: "بنویس: «اگر این دو داده را ببینم، نظر من تغییر می‌کند.»" },
          { title: "نقد سازنده", body: "هر نقد باید یک پیشنهاد اصلاحی کوچک داشته باشد (حتی ۱۰٪ بهتر)." },
          { title: "قانون ۲ دقیقه", body: "۲ دقیقه نقد، ۲ دقیقه پیشنهاد جایگزین. تعادل." }
        ]
      },
      en: {
        patterns: [
          "You're testing the idea, not attacking the person: 'where does it break?'",
          "Instead of total rejection, set acceptance conditions: 'If X is shown, I'll accept.'",
          "Check common reasoning errors (false dilemma, overgeneralization, ad hominem).",
          "Offer an improved version, not only criticism."
        ],
        checklist: [
          "Core claim in one sentence",
          "Pros/cons evidence (at least 2 each)",
          "Acceptance condition (what would change your mind?)",
          "Failure point + rough likelihood",
          "One small improvement suggestion"
        ],
        overuse: [
          "Critique turns into constant cynicism.",
          "Team feels nothing is ever good enough.",
          "Solution-making energy drops."
        ],
        tools: [
          { title: "Mind-change condition", body: "Write: 'If I see these two data points, I'll change my view.'" },
          { title: "Constructive critique", body: "Every critique includes a small fix proposal (even 10% better)." },
          { title: "2-minute rule", body: "2 minutes critique, 2 minutes alternative. Balance." }
        ]
      }
    },

    empathetic: {
      fa: {
        patterns: [
          "اول احساس، بعد تحلیل: «الان برایت سخت است چون…؟»",
          "مرزگذاری: همدلی یعنی فهمیدن، نه حل‌کردن به جای طرف.",
          "از «نیت» به «اثر» هم نگاه کن: چه چیزی در عمل آسیب زده؟",
          "مراقب ذهن‌خوانی: سؤال بپرس، حدس نزن."
        ],
        checklist: [
          "چه چیزی برای طرف مهم است؟",
          "چه چیزی باعث ترس/دفاع شده؟",
          "حداقل یک درخواست واضح از او چیست؟",
          "مرز من کجاست؟ چه کاری نمی‌کنم؟",
          "قدم بعدی کم‌تنش"
        ],
        overuse: [
          "خستگی همدلی و فرسودگی.",
          "اولویت‌های خودت محو می‌شود.",
          "تصمیم‌های سخت مدام عقب می‌افتد."
        ],
        tools: [
          { title: "۳ سؤال همدلانه", body: "۱) الان دقیقاً چه حسی داری؟ ۲) بدترین بخشش چیه؟ ۳) از من چی می‌خوای؟" },
          { title: "مرز روشن", body: "«می‌تونم گوش کنم و کمک فکری کنم، ولی تصمیم/مسئولیت با توست.»" },
          { title: "بازگویی", body: "یک جمله خلاصه از حرفش بگو و تأیید بگیر که درست فهمیدی." }
        ]
      },
      en: {
        patterns: [
          "Feelings first, then analysis: 'This is hard because…?'",
          "Boundaries: empathy is understanding, not fixing it for them.",
          "Look at impact alongside intent: what actually hurt?",
          "Avoid mind-reading: ask, don't assume."
        ],
        checklist: [
          "What matters to them?",
          "What triggered fear/defensiveness?",
          "One clear request from them?",
          "Where is my boundary? What won't I do?",
          "Low-tension next step"
        ],
        overuse: [
          "Empathy fatigue and burnout.",
          "Your own priorities disappear.",
          "Hard decisions get postponed."
        ],
        tools: [
          { title: "3 empathy questions", body: "1) What are you feeling? 2) What's the hardest part? 3) What do you want from me?" },
          { title: "Clear boundary", body: "'I can listen and help think, but the decision/responsibility is yours.'" },
          { title: "Reflect back", body: "Summarize in one sentence and confirm you understood correctly." }
        ]
      }
    },

    systemic: {
      fa: {
        patterns: [
          "به جای افراد، روی ساختار تمرکز کن: ورودی، پردازش، خروجی، بازخورد.",
          "علت واحد نگرد: چند عامل کوچک می‌توانند همزمان اثر بگذارند.",
          "شاخص‌های پیشرو (Leading) را کنار شاخص‌های پسرو (Lagging) بگذار.",
          "به «اثر دومینو» و حلقه‌های بازخورد حساس باش."
        ],
        checklist: [
          "نقشه ساده سیستم (۴ باکس)",
          "۳ اهرم اثرگذار (Leverage points)",
          "یک شاخص پیشرو + یک شاخص پسرو",
          "ریسک اثر جانبی (Side effect)",
          "یک تغییر کوچک برای تست"
        ],
        overuse: [
          "در پیچیدگی غرق می‌شوی و اقدام متوقف می‌شود.",
          "همه‌چیز را به سیستم نسبت می‌دهی و مسئولیت فردی محو می‌شود.",
          "توضیح زیاد، نتیجه کم."
        ],
        tools: [
          { title: "نقشه ۴ باکس", body: "ورودی‌ها / قوانین / خروجی‌ها / بازخورد. بعد ۱ نقطه برای تغییر انتخاب کن." },
          { title: "اهرم‌ها", body: "کدام تغییر کوچک، اثر بزرگ دارد؟ سیاست؟ انگیزه؟ اطلاعات؟ اصطکاک؟" },
          { title: "آزمایش جانبی", body: "قبل از تغییر بزرگ، یک تست کوچک برای دیدن اثر جانبی طراحی کن." }
        ]
      },
      en: {
        patterns: [
          "Focus on structure, not people: inputs, process, outputs, feedback.",
          "Avoid single-cause stories: multiple small factors can co-create outcomes.",
          "Pair leading indicators with lagging indicators.",
          "Watch for second-order effects and feedback loops."
        ],
        checklist: [
          "Simple system map (4 boxes)",
          "3 leverage points",
          "One leading + one lagging metric",
          "Side-effect risk",
          "One small change to test"
        ],
        overuse: [
          "You drown in complexity and stop acting.",
          "Everything becomes 'the system' and individual responsibility fades.",
          "Lots of explanation, little outcome."
        ],
        tools: [
          { title: "4-box map", body: "Inputs / Rules / Outputs / Feedback. Then pick ONE place to intervene." },
          { title: "Leverage points", body: "Which small change yields big effects? Policy, incentives, information, friction?" },
          { title: "Side-effect probe", body: "Before big change, run a small test to detect second-order effects." }
        ]
      }
    },

    strategic: {
      fa: {
        patterns: [
          "هدف و محدودیت را واضح کن: «برد» یعنی چه؟",
          "ریسک بزرگ را زود آشکار کن (نه آخر کار).",
          "قیمت فرصت را حساب کن: انتخاب A یعنی حذف B.",
          "برای بازنگری زمان بگذار: تصمیم بدون بازنگری، تعصب می‌سازد."
        ],
        checklist: [
          "هدف نهایی + ۳ معیار",
          "گزینه‌ها + هزینه فرصت هرکدام",
          "ریسک اصلی + نقطه بازنگری",
          "تصمیم امروز + تصمیم‌های قابل تعویق",
          "قدم بعدی + مالک اجرا"
        ],
        overuse: [
          "فقط دوربرد می‌بینی و نیازهای فوری را جا می‌اندازی.",
          "روی برنامه قفل می‌کنی (هزینه غرق‌شده).",
          "ایجاد اضطراب به خاطر سناریوهای زیاد."
        ],
        tools: [
          { title: "نقطه بازنگری", body: "بنویس: «اگر تا تاریخ X این نشانه‌ها را دیدیم، تصمیم را عوض می‌کنیم.»" },
          { title: "سیاست تصمیم", body: "۳ خط قانون ثابت برای تصمیم‌های مشابه بساز تا دوباره‌کاری کم شود." },
          { title: "پرتفوی", body: "تصمیم‌ها را مثل سبد ببین: کم‌ریسک/پرریسک را متعادل کن." }
        ]
      },
      en: {
        patterns: [
          "Clarify goal and constraints: what does 'win' mean?",
          "Surface the biggest risk early, not at the end.",
          "Compute opportunity cost: choosing A removes B.",
          "Schedule review triggers; decisions without review breed bias."
        ],
        checklist: [
          "End goal + 3 criteria",
          "Options + opportunity cost",
          "Main risk + review trigger",
          "Decide now vs. decide later",
          "Next action + owner"
        ],
        overuse: [
          "You only see the long term and miss urgent needs.",
          "You lock into plans (sunk cost).",
          "Anxiety from too many scenarios."
        ],
        tools: [
          { title: "Review trigger", body: "Write: 'If by date X we see these signals, we revise the decision.'" },
          { title: "Decision policy", body: "Create 3 short rules for recurring decisions to reduce rework." },
          { title: "Portfolio view", body: "Balance low-risk and high-risk bets like a portfolio." }
        ]
      }
    },

    experimental: {
      fa: {
        patterns: [
          "به جای بحث، تست طراحی کن: سؤال، فرضیه، معیار، بازه.",
          "نمونه کوچک ولی دقیق بهتر از تست بزرگ و مبهم است.",
          "از شکست سریع استقبال کن (اطلاعات می‌دهد).",
          "نتیجه را با زمینه گزارش کن تا سوگیری نتیجه کمتر شود."
        ],
        checklist: [
          "فرضیه قابل رد شدن",
          "حداقل معیار موفقیت",
          "طراحی تست + گروه/شرط",
          "زمان پایان مشخص",
          "نتیجه + درس + اقدام بعدی"
        ],
        overuse: [
          "تست‌های زیاد بدون هدف بزرگ.",
          "نتیجه‌گیری با نمونه کوچک و تعمیم زیاد.",
          "دویدن به سمت عمل بدون فهم مسئله."
        ],
        tools: [
          { title: "فرضیه ردشدنی", body: "جمله‌ای بنویس که اگر رخ نداد، مجبور شوی نظر را عوض کنی." },
          { title: "دفترچه آزمایش", body: "هر تست: فرضیه، معیار، نتیجه، یادگیری، تصمیم." },
          { title: "کنترل سوگیری نتیجه", body: "قبل از دیدن نتیجه بنویس چه چیزی را موفقیت/شکست حساب می‌کنی." }
        ]
      },
      en: {
        patterns: [
          "Design a test instead of debating: question, hypothesis, metric, window.",
          "Small but precise beats big and vague.",
          "Embrace fast failure (it's information).",
          "Report results with context to reduce outcome bias."
        ],
        checklist: [
          "Falsifiable hypothesis",
          "Minimum success metric",
          "Test design + condition/group",
          "Clear end time",
          "Result + lesson + next action"
        ],
        overuse: [
          "Too many tests without a north-star goal.",
          "Overgeneralizing from tiny samples.",
          "Action-first without understanding the problem."
        ],
        tools: [
          { title: "Falsifiable statement", body: "Write a sentence that, if not observed, forces you to update your belief." },
          { title: "Experiment log", body: "Each test: hypothesis, metric, result, learning, decision." },
          { title: "Pre-commit criteria", body: "Before results, define what counts as success/failure." }
        ]
      }
    },

    combinatory: {
      fa: {
        patterns: [
          "ترکیب یعنی «ترتیب» و «هدف»، نه جمع کردن همه چیز.",
          "هر لنز یک خروجی می‌دهد. بدون خروجی، لنز را حذف کن.",
          "تعادل سرعت و دقت: ابتدا ساده، بعد پیچیده.",
          "برای جلوگیری از فلج چندسبکی، سقف لنزها را مشخص کن."
        ],
        checklist: [
          "هدف تصمیم چیست؟",
          "حداکثر ۳ لنز برای شروع",
          "خروجی هر لنز (یک جمله)",
          "چه چیزی اگر تغییر کند، ترتیب عوض می‌شود؟",
          "نسخه سبک‌تر اگر وقت کم بود"
        ],
        overuse: [
          "فلج چندسبکی: هر لنز را نیمه‌کاره انجام می‌دهی.",
          "حس می‌کنی «همه چیز لازم است» و هیچ چیز تمام نمی‌شود.",
          "تصمیم‌گیری تبدیل به تشریفات می‌شود."
        ],
        tools: [
          { title: "سقف لنز", body: "برای هر تصمیم یک سقف بگذار: ۲ لنز (ساده)، ۳ لنز (متوسط)، ۴+ (فقط موارد مهم)." },
          { title: "خروجی یک‌خطی", body: "بعد از هر لنز، فقط یک خط خروجی بنویس. اگر نمی‌شود، آن لنز مبهم اجرا شده." },
          { title: "نسخه سبک", body: "وقتی وقت کم است: فقط ۲ لنز را اجرا کن و یک معیار بازنگری بگذار." }
        ]
      },
      en: {
        patterns: [
          "Combining is about order and purpose, not stacking everything.",
          "Each lens must produce an output. No output, remove the lens.",
          "Balance speed and rigor: simple first, complex later.",
          "Prevent style paralysis by setting a lens cap."
        ],
        checklist: [
          "What's the goal of the decision?",
          "Start with max 3 lenses",
          "One-line output per lens",
          "What condition would change the order?",
          "A lighter version if time is tight"
        ],
        overuse: [
          "Style paralysis: you do each lens halfway.",
          "Everything feels 'necessary' and nothing completes.",
          "Decision-making becomes ceremony."
        ],
        tools: [
          { title: "Lens cap", body: "Set caps: 2 lenses (simple), 3 (medium), 4+ (only high-stakes)." },
          { title: "One-line output", body: "After each lens, write one line. If you can't, execution was fuzzy." },
          { title: "Light version", body: "When time is short: run only 2 lenses and add a review trigger." }
        ]
      }
    },

    reflective: {
      fa: {
        patterns: [
          "مرور گذشته برای یادگیری است، نه خودسرزنشی.",
          "از «روایت» جدا شو: چه چیزی واقعاً رخ داد؟ چه چیزی برداشت بود؟",
          "تله‌های گذشته‌نگری را چک کن: «واضح بود» اغلب توهم است.",
          "یک درس عملی و یک تغییر رفتاری کوچک استخراج کن."
        ],
        checklist: [
          "چه اتفاقی افتاد؟ (واقعیت)",
          "من چه فرضی داشتم؟",
          "چه چیزی را ندیدم؟ چرا؟",
          "درس ۱ جمله‌ای",
          "تغییر کوچک برای دفعه بعد"
        ],
        overuse: [
          "نشخوار فکری و گیرکردن در گذشته.",
          "کاهش اعتمادبه‌نفس به خاطر خودسرزنشی.",
          "عدم اقدام در زمان حال."
        ],
        tools: [
          { title: "دو ستون", body: "واقعیت / روایت. هر خاطره را دو تکه کن تا خطای تفسیر کمتر شود." },
          { title: "درس یک‌خطی", body: "اگر فقط یک جمله می‌توانستی یاد بگیری، آن چیست؟" },
          { title: "اقدام کوچک", body: "یک رفتار بسیار کوچک که دفعه بعد بهتر می‌کند را تعریف کن." }
        ]
      },
      en: {
        patterns: [
          "Review the past to learn, not to self-punish.",
          "Separate story from facts: what happened vs. what you inferred.",
          "Check hindsight bias: 'it was obvious' is often an illusion.",
          "Extract one practical lesson and one small behavior change."
        ],
        checklist: [
          "What happened? (facts)",
          "What assumption did I have?",
          "What did I miss and why?",
          "One-sentence lesson",
          "One small change for next time"
        ],
        overuse: [
          "Rumination and getting stuck in the past.",
          "Lower confidence due to self-blame.",
          "Less action in the present."
        ],
        tools: [
          { title: "Two columns", body: "Facts / Story. Split each memory to reduce interpretation errors." },
          { title: "One-line lesson", body: "If you could learn only one sentence, what is it?" },
          { title: "Small action", body: "Define one tiny behavior that improves next time." }
        ]
      }
    }
  };

  const COMBINER_LINKS = {
    analytical: [
      { href: "./combiners/dual/index.html#steps", fa: "مدل دوگانه: تحلیلی → خلاق", en: "Dual model: Analytical → Creative" },
      { href: "./combiners/problem/index.html#steps", fa: "مدل حل مسئله", en: "Problem-solving model" },
      { href: "./combiners/triple/index.html#steps", fa: "مدل سه‌گانه (برای تصمیم‌های جدی‌تر)", en: "Triple model (higher-stakes)" }
    ],
    creative: [
      { href: "./combiners/dual/index.html#steps", fa: "مدل دوگانه: خلاق → تحلیلی", en: "Dual model: Creative → Analytical" },
      { href: "./combiners/innovation/index.html#steps", fa: "مدل نوآوری", en: "Innovation model" },
      { href: "./combiners/quick/index.html#overview", fa: "مدل سریع (برای خروج از بن‌بست)", en: "Quick model (to unblock)" }
    ],
    critical: [
      { href: "./combiners/problem/index.html#steps", fa: "مدل حل مسئله", en: "Problem-solving model" },
      { href: "./combiners/quad/index.html#steps", fa: "مدل چهارگانه (تعادل نقد و اجرا)", en: "Quad model (balance critique & action)" },
      { href: "./combiners/full/index.html#overview", fa: "THINK-360+ (وقتی پیامدها زیاد است)", en: "THINK-360+ (high impact)" }
    ],
    empathetic: [
      { href: "./combiners/people/index.html#steps", fa: "مدل افراد/روابط", en: "People model" },
      { href: "./combiners/full/index.html#overview", fa: "THINK-360+ (برای تصمیم‌های انسانی-سیستمی)", en: "THINK-360+ (human + system)" },
      { href: "./combiners/triple/index.html#steps", fa: "مدل سه‌گانه (تعادل احساس/تحلیل/اقدام)", en: "Triple model (feel/think/do balance)" }
    ],
    systemic: [
      { href: "./combiners/quad/index.html#steps", fa: "مدل چهارگانه", en: "Quad model" },
      { href: "./combiners/full/index.html#overview", fa: "THINK-360+ (تصمیم‌های پیچیده)", en: "THINK-360+ (complex decisions)" },
      { href: "./combiners/problem/index.html#steps", fa: "مدل حل مسئله", en: "Problem-solving model" }
    ],
    strategic: [
      { href: "./combiners/full/index.html#overview", fa: "THINK-360+ (استراتژی)", en: "THINK-360+ (strategy)" },
      { href: "./combiners/quad/index.html#steps", fa: "مدل چهارگانه (ریسک/سیستم/اجرا)", en: "Quad model (risk/system/execution)" },
      { href: "./combiners/quick/index.html#quick", fa: "چک‌لیست سریع (تصمیم فوری)", en: "Quick checklist (urgent)" }
    ],
    experimental: [
      { href: "./combiners/innovation/index.html#steps", fa: "مدل نوآوری", en: "Innovation model" },
      { href: "./combiners/quick/index.html#overview", fa: "مدل سریع", en: "Quick model" },
      { href: "./combiners/problem/index.html#steps", fa: "مدل حل مسئله", en: "Problem-solving model" }
    ],
    combinatory: [
      { href: "./combiners/full/index.html#overview", fa: "THINK-360+ (ترکیب کامل)", en: "THINK-360+ (full combo)" },
      { href: "./combiners/quad/index.html#steps", fa: "مدل چهارگانه", en: "Quad model" },
      { href: "./combiners/triple/index.html#steps", fa: "مدل سه‌گانه", en: "Triple model" }
    ],
    reflective: [
      { href: "./combiners/people/index.html#overview", fa: "مدل افراد/روابط", en: "People model" },
      { href: "./combiners/full/index.html#overview", fa: "THINK-360+ (مرور و اصلاح)", en: "THINK-360+ (review & refine)" },
      { href: "./combiners/quick/index.html#overview", fa: "مدل سریع (وقتی گیر کردی)", en: "Quick model (when stuck)" }
    ]
  };

  const TRAP_META = {"action_bias":{"fa":"سوگیری عمل","en":"Action Bias"},"all_or_nothing":{"fa":"همه یا هیچ","en":"All-or-Nothing Thinking"},"ambiguity_effect":{"fa":"اثر ابهام","en":"Ambiguity Effect"},"analysis_paralysis":{"fa":"فلج تحلیل","en":"Analysis Paralysis"},"anchoring":{"fa":"لنگر انداختن","en":"Anchoring"},"availability_heuristic":{"fa":"تداعی در دسترس","en":"Availability Heuristic"},"bandwagon":{"fa":"اثر گله‌ای","en":"Bandwagon Effect"},"cascade":{"fa":"نگرانی‌های زنجیره‌ای","en":"Information Cascade"},"catastrophizing":{"fa":"فاجعه‌سازی","en":"Catastrophizing"},"complexity_bias":{"fa":"سوگیری پیچیدگی","en":"Complexity Bias"},"confirmation_bias":{"fa":"سوگیری تأیید","en":"Confirmation Bias"},"cynicism":{"fa":"بدبینی","en":"Cynicism Bias"},"devils_advocate_trap":{"fa":"تله مخالفت","en":"Devil's Advocate Trap"},"dunning_kruger":{"fa":"اثر دانینگ-کروگر","en":"Dunning–Kruger Effect"},"echo_chamber":{"fa":"اتاق پژواک","en":"Echo Chamber"},"emotional_reasoning":{"fa":"استدلال احساسی","en":"Emotional Reasoning"},"empathy_overload":{"fa":"بیش‌همدلی","en":"Empathy Overload"},"false_dilemma":{"fa":"دوگانه دروغین","en":"False Dilemma"},"forest_for_trees":{"fa":"جنگل و درخت","en":"Missing the Forest for the Trees"},"fundamental_attribution":{"fa":"خطای نسبت‌دهی بنیادی","en":"Fundamental Attribution Error"},"groupthink":{"fa":"تفکر گروهی","en":"Groupthink"},"halo_effect":{"fa":"اثر هاله‌ای","en":"Halo Effect"},"hindsight":{"fa":"گذشته‌نگری","en":"Hindsight Bias"},"idea_hoarding":{"fa":"انبار ایده","en":"Idea Hoarding"},"isolation_bias":{"fa":"سوگیری انزوا","en":"Isolation Bias"},"loss_aversion":{"fa":"گریز از ضرر","en":"Loss Aversion"},"mind_reading":{"fa":"ذهن‌خوانی","en":"Mind Reading"},"nitpicking":{"fa":"موشکافی","en":"Nitpicking"},"novelty_bias":{"fa":"سوگیری تازگی","en":"Novelty Bias"},"optimism_bias":{"fa":"سوگیری خوش‌بینی","en":"Optimism Bias"},"outcome_bias":{"fa":"سوگیری نتیجه","en":"Outcome Bias"},"over_thinking":{"fa":"بیش‌تحلیلی","en":"Overthinking"},"overconfidence":{"fa":"اعتماد بیش از حد","en":"Overconfidence Bias"},"overthinking_past":{"fa":"بیش‌فکری گذشته","en":"Ruminating on the Past"},"perfectionism":{"fa":"کمال‌گرایی","en":"Perfectionism"},"planning_fallacy":{"fa":"خطای برنامه‌ریزی","en":"Planning Fallacy"},"premature_optimization":{"fa":"بهینه‌سازی زودرس","en":"Premature Optimization"},"projection":{"fa":"پروژکشن","en":"Projection"},"recency_bias":{"fa":"سوگیری تازگی","en":"Recency Bias"},"regret":{"fa":"پشیمانی","en":"Regret Trap"},"rumination":{"fa":"نشخوار فکری","en":"Rumination"},"satisficing":{"fa":"رضایت زودهنگام","en":"Satisficing"},"self_blame":{"fa":"خودسرزنشی","en":"Self-Blame"},"shiny_object":{"fa":"سندرم جذابیت نو","en":"Shiny Object Syndrome"},"single_cause":{"fa":"تک‌علتی","en":"Single-Cause Fallacy"},"small_sample":{"fa":"نمونه کوچک","en":"Small Sample Bias"},"status_quo":{"fa":"سوگیری وضع موجود","en":"Status Quo Bias"},"style_paralysis":{"fa":"فلج چندسبکی","en":"Style Paralysis"},"sunk_cost":{"fa":"هزینه غرق‌شده","en":"Sunk Cost Fallacy"},"survivorship_bias":{"fa":"سوگیری بازماندگان","en":"Survivorship Bias"},"tunnel_vision":{"fa":"دید تونلی","en":"Tunnel Vision"}};
  try{ window.__MI_TRAP_META = TRAP_META; }catch(_){ }


  const $ = (sel, root=document)=>root.querySelector(sel);
  const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));

  function getLang(){
    try { return localStorage.getItem(LANG_KEY)==="en" ? "en" : "fa"; }
    catch(_) { return (document.documentElement.lang||"fa").toLowerCase().startsWith("en") ? "en" : "fa"; }
  }

  function normText(s){
    return (s||"").toString().trim().toLowerCase()
      .replace(/[\u200c\u200f]/g,'')
      .replace(/[^\w\u0600-\u06FF]+/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }

  function smoothScrollTo(el){
    if(!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function findIslandDetailPage(){
    const root = document.getElementById("root");
    if(!root) return null;

    // detect the IslandDetail view via its unique "Back to Islands" button and "Related Traps" heading
    const backBtn = Array.from(root.querySelectorAll("button")).find(b=>{
      const t = (b.textContent||"").trim();
      return t.includes("Back to Islands") || t.includes("بازگشت به جزایر");
    });
    if(!backBtn) return null;

    const page = backBtn.closest(".max-w-4xl") || root;
    const txt = page.textContent || "";
    if(!(txt.includes("Related Traps") || txt.includes("تله‌های مرتبط"))) return null;

    return page;
  }

  function getIslandId(page){
    const titleEl = $("h1", page);
    const title = titleEl ? titleEl.textContent.trim() : "";
    const islands = window.__MI_ISLANDS_META || {};
    const nt = normText(title);
    for(const id in islands){
      const fa = islands[id] && islands[id].fa;
      const en = islands[id] && islands[id].en;
      if(nt && (nt===normText(fa) || nt===normText(en))) return id;
    }
    // fallback: try match partial (e.g. "Systems" vs "Systemic")
    for(const id in islands){
      const fa = islands[id] && islands[id].fa;
      const en = islands[id] && islands[id].en;
      if(nt && (nt.includes(normText(fa)) || nt.includes(normText(en)))) return id;
    }
    return null;
  }

  function ensureStyle(){
    if(document.getElementById("mi-island-enhance-style")) return;
    const style = document.createElement("style");
    style.id="mi-island-enhance-style";
    style.textContent = `
      .mi-island-quicknav{
        display:flex; flex-wrap:wrap; gap:.5rem;
        padding:.75rem; border-radius:1rem;
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.09);
        margin: 0 0 1rem 0;
      }
      .mi-island-quicknav button, .mi-island-quicknav a{
        appearance:none; border:1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.03);
        color: rgba(255,255,255,.85);
        padding:.55rem .75rem;
        border-radius: .85rem;
        font: inherit;
        cursor:pointer;
        transition: transform .18s ease, background .18s ease, border-color .18s ease;
        text-decoration:none;
        display:inline-flex; align-items:center; gap:.5rem;
      }
      .mi-island-quicknav button:hover, .mi-island-quicknav a:hover{
        background: rgba(255,255,255,.06);
        border-color: rgba(255,255,255,.22);
        transform: translateY(-1px);
      }

      .mi-supp-grid{ display:grid; gap: .75rem; grid-template-columns: repeat(12, 1fr); margin-top:.75rem; }
      .mi-supp-grid .mi-supp-col{ grid-column: span 12; }
      @media (min-width: 640px){ .mi-supp-grid .mi-supp-col{ grid-column: span 6; } }
      @media (min-width: 1024px){ .mi-supp-grid .mi-supp-col{ grid-column: span 4; } }

      .mi-details{
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.10);
        border-radius: 1rem;
        overflow:hidden;
      }
      .mi-details summary{
        list-style:none;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:.75rem;
        padding: .85rem .95rem;
        cursor:pointer;
        user-select:none;
      }
      .mi-details summary::-webkit-details-marker{ display:none; }
      .mi-details-title{ font-weight: 800; color: rgba(255,255,255,.92); }
      .mi-details-btn{
        font-size: .85rem;
        padding: .35rem .6rem;
        border-radius: .7rem;
        border: 1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.03);
        color: rgba(255,255,255,.75);
        white-space:nowrap;
      }
      .mi-details[open] summary{ background: rgba(255,255,255,.03); }
      .mi-details-body{ padding: .0 .95rem .95rem .95rem; color: rgba(255,255,255,.78); }
      .mi-details-body ul{ margin: .75rem 0 0; padding: 0 1.25rem; }
      .mi-details-body li{ margin: .35rem 0; line-height: 1.6; }
      .mi-details-body p{ margin-top:.75rem; line-height:1.7; }

      .mi-miniLinks{ display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.75rem; }
      .mi-miniLinks a{
        border:1px solid rgba(255,255,255,.14);
        background: rgba(255,255,255,.03);
        color: rgba(255,255,255,.85);
        padding:.5rem .65rem;
        border-radius: .85rem;
        text-decoration:none;
        font-size: .9rem;
      }
      .mi-miniLinks a:hover{ background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.22); }

      .mi-openTrapLink{
        display:inline-flex; gap:.35rem; align-items:center;
        margin-top:.6rem;
        font-size:.85rem;
        color: rgba(34,211,238,.95);
        text-decoration:none;
      }
      .mi-openTrapLink:hover{ text-decoration:underline; }
    `;
    document.head.appendChild(style);
  }

  function buildDetailsCard(title, btnLabel, bodyNode){
    const d = document.createElement("details");
    d.className = "mi-details";
    const s = document.createElement("summary");
    const t = document.createElement("span");
    t.className = "mi-details-title";
    t.textContent = title;
    const b = document.createElement("span");
    b.className = "mi-details-btn";
    b.textContent = btnLabel;
    s.appendChild(t);
    s.appendChild(b);
    d.appendChild(s);

    const body = document.createElement("div");
    body.className = "mi-details-body";
    if(bodyNode) body.appendChild(bodyNode);
    d.appendChild(body);
    return d;
  }

  function buildList(items){
    const ul = document.createElement("ul");
    (items||[]).forEach(it=>{
      const li = document.createElement("li");
      li.textContent = it;
      ul.appendChild(li);
    });
    return ul;
  }

  function buildTools(tools){
    const wrap = document.createElement("div");
    const ul = document.createElement("ul");
    (tools||[]).forEach(t=>{
      const li = document.createElement("li");
      const b = document.createElement("b");
      b.textContent = t.title + ": ";
      li.appendChild(b);
      li.appendChild(document.createTextNode(t.body));
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    return wrap;
  }

  function buildCombinerLinks(islandId, lang){
    const items = COMBINER_LINKS[islandId] || [];
    const wrap = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = lang==="fa"
      ? "برای این جزیره، این مدل‌های ترکیبی معمولاً بهترین مکمل هستند (لینک مستقیم):"
      : "For this island, these combiner models are usually the best complements (direct links):";
    wrap.appendChild(p);

    const links = document.createElement("div");
    links.className = "mi-miniLinks";
    items.forEach(it=>{
      const a = document.createElement("a");
      a.href = it.href;
      a.textContent = lang==="fa" ? it.fa : it.en;
      links.appendChild(a);
    });
    wrap.appendChild(links);
    return wrap;
  }

  function injectIslandDetailEnhancements(){
    const page = findIslandDetailPage();
    if(!page) return;

    ensureStyle();

    const lang = getLang();
    const islandId = getIslandId(page);
    if(!islandId || !ISLAND_SUPP[islandId]) return;

    // Locate main cards by heading
    const cards = $$(".glass", page);
    const findCard = (faNeedle, enNeedle)=>{
      return cards.find(c=>{
        const h2 = c.querySelector("h2");
        const t = (h2 && h2.textContent || "").trim();
        return t===faNeedle || t===enNeedle;
      }) || null;
    };

    const whenCard = findCard("چه زمانی استفاده کنیم؟", "When to Use?");
    const exCard = findCard("تمرین‌ها", "Exercises");
    const trapsCard = findCard("تله‌های مرتبط", "Related Traps");

    if(whenCard) whenCard.id = "mi-main";
    if(exCard) exCard.id = "mi-exercises";
    if(trapsCard) trapsCard.id = "mi-related-traps";

    // Quick nav after the hero card (glass-strong)
    const hero = $(".glass-strong", page);
    if(hero && !page.querySelector("[data-mi-island-quicknav]")){
      const nav = document.createElement("div");
      nav.className = "mi-island-quicknav";
      nav.setAttribute("data-mi-island-quicknav","1");

      const mkBtn = (label, targetId)=>{
        const btn = document.createElement("button");
        btn.type="button";
        btn.textContent = label;
        btn.addEventListener("click", ()=>{
          const el = document.getElementById(targetId);
          if(el) smoothScrollTo(el);
        });
        return btn;
      };

      nav.appendChild(mkBtn(lang==="fa" ? "📌 اطلاعات اصلی" : "📌 Main info", "mi-main"));

      // placeholder for supp id (added below)
      nav.appendChild(mkBtn(lang==="fa" ? "✨ اطلاعات تکمیلی" : "✨ Deep dive", "mi-supp"));

      nav.appendChild(mkBtn(lang==="fa" ? "🧠 تله‌های مرتبط" : "🧠 Related traps", "mi-related-traps"));

      hero.insertAdjacentElement("afterend", nav);
    }

    // Insert supplementary section after Exercises card (before Related Traps)
    const existing = page.querySelector('[data-mi-island-supp="1"]');
    if(existing && existing.getAttribute("data-mi-for-island") !== islandId){
      existing.remove();
    }

    if(!page.querySelector('[data-mi-island-supp="1"]')){
      const supp = document.createElement("section");
      supp.id = "mi-supp";
      supp.setAttribute("data-mi-island-supp","1");
      supp.setAttribute("data-mi-for-island", islandId);
      supp.className = "glass p-6 rounded-2xl mb-8 animate-slide-up";

      const h2 = document.createElement("h2");
      h2.className = "text-xl font-bold text-white mb-4";
      h2.textContent = lang==="fa" ? "اطلاعات تکمیلی" : "Deep Dive";
      supp.appendChild(h2);

      const sub = document.createElement("p");
      sub.className = "text-white/60";
      sub.textContent = lang==="fa"
        ? "کارت‌های کوتاه و عملی. هر کارت یک Show details دارد و متن با زبان انتخابی هماهنگ است."
        : "Short practical cards. Each card has one Show details, aligned with the selected language.";
      supp.appendChild(sub);

      const grid = document.createElement("div");
      grid.className = "mi-supp-grid";

      const data = ISLAND_SUPP[islandId][lang];

      const btnLabel = lang==="fa" ? "نمایش جزئیات" : "Show details";

      // Patterns
      {
        const col = document.createElement("div");
        col.className = "mi-supp-col";
        col.appendChild(buildDetailsCard(
          lang==="fa" ? "الگوهای کلیدی" : "Key patterns",
          btnLabel,
          buildList(data.patterns)
        ));
        grid.appendChild(col);
      }

      // Checklist
      {
        const col = document.createElement("div");
        col.className = "mi-supp-col";
        col.appendChild(buildDetailsCard(
          lang==="fa" ? "چک‌لیست تصمیم‌گیری" : "Decision checklist",
          btnLabel,
          buildList(data.checklist)
        ));
        grid.appendChild(col);
      }

      // Overuse
      {
        const col = document.createElement("div");
        col.className = "mi-supp-col";
        col.appendChild(buildDetailsCard(
          lang==="fa" ? "نشانه‌های افراط" : "Overuse signals",
          btnLabel,
          buildList(data.overuse)
        ));
        grid.appendChild(col);
      }

      // Tools
      {
        const col = document.createElement("div");
        col.className = "mi-supp-col";
        col.style.gridColumn = "span 12";
        col.appendChild(buildDetailsCard(
          lang==="fa" ? "ابزارهای سریع" : "Quick tools",
          btnLabel,
          buildTools(data.tools)
        ));
        grid.appendChild(col);
      }

      // Related combiners (links)
      {
        const col = document.createElement("div");
        col.className = "mi-supp-col";
        col.style.gridColumn = "span 12";
        col.appendChild(buildDetailsCard(
          lang==="fa" ? "مدل‌های ترکیبی مرتبط" : "Related combiner models",
          btnLabel,
          buildCombinerLinks(islandId, lang)
        ));
        grid.appendChild(col);
      }

      supp.appendChild(grid);

      if(exCard && trapsCard){
        trapsCard.insertAdjacentElement("beforebegin", supp);
      }else if(exCard){
        exCard.insertAdjacentElement("afterend", supp);
      }else if(hero){
        hero.insertAdjacentElement("afterend", supp);
      }else{
        page.appendChild(supp);
      }
    }

    // Linkify related traps items
    try{
      const trapMeta = TRAP_META;
      const rev = new Map();
      Object.keys(trapMeta).forEach(id=>{
        const fa = trapMeta[id] && trapMeta[id].fa;
        const en = trapMeta[id] && trapMeta[id].en;
        if(fa) rev.set(normText(fa), id);
        if(en) rev.set(normText(en), id);
      });

      if(trapsCard){
        const items = $$('div[class*="bg-red-500/10"]', trapsCard);
        items.forEach(card=>{
          if(card.dataset.miTrapLinked === "1") return;
          const h3 = $("h3", card);
          const name = h3 ? h3.textContent.trim() : "";
          const tid = rev.get(normText(name));
          if(!tid) { card.dataset.miTrapLinked = "1"; return; }

          const a = document.createElement("a");
          a.className = "mi-openTrapLink";
          a.href = "./traps/" + tid + ".html";
          a.innerHTML = lang==="fa" ? "🔗 مشاهده صفحه تله" : "🔗 Open trap page";

          card.appendChild(a);
          card.dataset.miTrapLinked = "1";
        });
      }
    }catch(_){}
  }

  let scheduled = false;
  function schedule(){
    if(scheduled) return;
    scheduled = true;
    requestAnimationFrame(()=>{ scheduled=false; injectIslandDetailEnhancements(); });
  }

  window.addEventListener("mi-lang-change", ()=>{
    // remove injected widgets so they rebuild in the right language
    const oldNav = document.querySelector("[data-mi-island-quicknav]");
    if(oldNav) oldNav.remove();
    const oldSupp = document.querySelector('[data-mi-island-supp="1"]');
    if(oldSupp) oldSupp.remove();
    // remove existing related-trap links so they rebuild in correct language
    document.querySelectorAll('.mi-openTrapLink').forEach(el=>el.remove());
    document.querySelectorAll('[data-mi-trap-linked="1"]').forEach(card=>{
      try{ delete card.dataset.miTrapLinked; }catch(_){ card.removeAttribute('data-mi-trap-linked'); }
    });

    schedule();
  });

  window.addEventListener("DOMContentLoaded", ()=>{
    const root = document.getElementById("root");
    if(!root) return;
    const obs = new MutationObserver(schedule);
    obs.observe(root, {childList:true, subtree:true});
    schedule();
  });
})();
