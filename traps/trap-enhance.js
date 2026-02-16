/* MindIslands Trap Pages: link + section navigation enhancer */
(function(){
  const dir = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
  const OFFSET = 88;

  const $ = (sel, root=document)=>root.querySelector(sel);
  const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));

  function smoothScrollTo(id){
    const el = document.getElementById(id);
    if(!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function handleHashClick(ev){
    const a = ev.target.closest('a[href^="#"]');
    if(!a) return;
    const href = a.getAttribute('href') || '';
    if(href === '#' || href.length < 2) return;
    const id = decodeURIComponent(href.slice(1));
    if(!document.getElementById(id)) return;
    ev.preventDefault();
    history.replaceState(null, '', '#' + encodeURIComponent(id));
    smoothScrollTo(id);
  }

  function applyScrollSpy(){
    const toc = $('.tp-toc');
    if(!toc) return;
    const links = $$('a[href^="#"]', toc);
    const items = links.map(a=>{
      const id = decodeURIComponent((a.getAttribute('href')||'').slice(1));
      return { a, id, el: document.getElementById(id) };
    }).filter(x=>x.el);

    if(!items.length) return;

    let ticking = false;
    function update(){
      ticking = false;
      const y = window.scrollY + OFFSET + 10;
      let current = items[0];
      for(const it of items){
        if(it.el.offsetTop <= y) current = it;
        else break;
      }
      items.forEach(it=>it.a.classList.toggle('is-active', it===current));
    }

    window.addEventListener('scroll', ()=>{
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  function makeBackToTop(){
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '⬆';
    btn.setAttribute('aria-label', 'Back to top');
    btn.style.position = 'fixed';
    btn.style.bottom = '18px';
    btn.style[dir==='rtl' ? 'left' : 'right'] = '18px';
    btn.style.width = '44px';
    btn.style.height = '44px';
    btn.style.borderRadius = '14px';
    btn.style.border = '1px solid rgba(255,255,255,.12)';
    btn.style.background = 'rgba(15, 23, 42, .75)';
    btn.style.backdropFilter = 'blur(10px)';
    btn.style.color = 'rgba(255,255,255,.85)';
    btn.style.boxShadow = '0 12px 30px rgba(0,0,0,.35)';
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(10px)';
    btn.style.transition = 'opacity .18s ease, transform .18s ease';
    btn.style.zIndex = '9999';
    btn.style.pointerEvents = 'none';

    btn.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));

    document.body.appendChild(btn);

    function onScroll(){
      const show = window.scrollY > 420;
      btn.style.opacity = show ? '1' : '0';
      btn.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
      btn.style.pointerEvents = show ? 'auto' : 'none';
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  async function copyText(text){
    try{
      await navigator.clipboard.writeText(text);
      return true;
    }catch(e){
      try{
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position='fixed';
        ta.style.opacity='0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        return true;
      }catch(_){
        return false;
      }
    }
  }

  function toast(msg){
    let t = document.querySelector('[data-mi-toast]');
    if(!t){
      t = document.createElement('div');
      t.setAttribute('data-mi-toast','1');
      t.style.position='fixed';
      t.style.zIndex='9999';
      t.style.bottom='18px';
      t.style[dir==='rtl' ? 'right' : 'left'] = '18px';
      t.style.maxWidth='min(520px, calc(100vw - 36px))';
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
    t.textContent = msg;
    requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translateY(0)'; });
    clearTimeout(t._timer);
    t._timer=setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(8px)'; }, 2200);
  }

  function addHeadingPermalinks(){
    const headings = $$('.tp-section h2[id], .tp-section h3[id]');
    if(!headings.length) return;

    headings.forEach(h=>{
      if(h.querySelector('[data-mi-permalink]')) return;
      const id = h.getAttribute('id');
      const btn = document.createElement('button');
      btn.type='button';
      btn.textContent='🔗';
      btn.setAttribute('data-mi-permalink','1');
      btn.style.marginInlineStart='8px';
      btn.style.fontSize='12px';
      btn.style.opacity='.75';
      btn.style.border='1px solid rgba(255,255,255,.10)';
      btn.style.background='rgba(255,255,255,.04)';
      btn.style.borderRadius='10px';
      btn.style.padding='4px 8px';
      btn.style.cursor='pointer';
      btn.addEventListener('click', async ()=>{
        const url = location.origin + location.pathname + '#' + encodeURIComponent(id);
        const ok = await copyText(url);
        toast(ok ? (dir==='rtl' ? 'لینک کپی شد' : 'Link copied') : (dir==='rtl' ? 'کپی نشد' : 'Copy failed'));
      });
      h.appendChild(btn);
    });
  }

  function patchTocStyles(){
    const style = document.createElement('style');
    style.textContent = `
      .tp-toc a.is-active{
        background: rgba(255,255,255,.08) !important;
        border-color: rgba(255,255,255,.18) !important;
      }
      html{ scroll-behavior:smooth; }
      .tp-section h2, .tp-section h3{ scroll-margin-top:${OFFSET}px; }
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('click', handleHashClick);
  patchTocStyles();
  applyScrollSpy();
  addHeadingPermalinks();
  makeBackToTop();

  // If opened with a hash, apply a safer scroll (after layout)
  window.addEventListener('load', ()=>{
    if(location.hash && location.hash.length>1){
      const id = decodeURIComponent(location.hash.slice(1));
      setTimeout(()=>smoothScrollTo(id), 30);
    }
  });
})();