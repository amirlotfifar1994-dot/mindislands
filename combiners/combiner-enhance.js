/* MindIslands Combiner Pages: add "On this page" links + scroll spy */
(function(){
  const dir = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
  const OFFSET = 92;

  const $ = (sel, root=document)=>root.querySelector(sel);
  const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));

  function smoothScrollTo(id){
    const el = document.getElementById(id);
    if(!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function buildOnThisPage(){
    const main = $('.co-main') || document.body;
    const sections = $$('.co-section[id]', main);
    if(!sections.length) return;

    const asideCard = $('.co-side .co-card');
    if(!asideCard) return;
    if(asideCard.querySelector('[data-mi-onpage]')) return;

    const wrap = document.createElement('div');
    wrap.setAttribute('data-mi-onpage','1');
    wrap.style.marginTop='1rem';
    wrap.innerHTML = `
      <div class="co-small" style="margin-bottom:.6rem">${dir==='rtl' ? 'در همین صفحه' : 'On this page'}</div>
      <nav class="co-nav" data-mi-onpage-nav></nav>
    `;
    const nav = wrap.querySelector('[data-mi-onpage-nav]');
    sections.forEach(sec=>{
      const h = sec.querySelector('h2, h3');
      const label = (h ? h.textContent : sec.id).trim();
      const a = document.createElement('a');
      a.href = '#' + encodeURIComponent(sec.id);
      a.textContent = label;
      nav.appendChild(a);
    });
    asideCard.appendChild(wrap);

    nav.addEventListener('click', (ev)=>{
      const a = ev.target.closest('a[href^="#"]');
      if(!a) return;
      const id = decodeURIComponent((a.getAttribute('href')||'').slice(1));
      if(!document.getElementById(id)) return;
      ev.preventDefault();
      history.replaceState(null,'','#'+encodeURIComponent(id));
      smoothScrollTo(id);
    });

    // Scroll spy
    const links = $$('a[href^="#"]', nav).map(a=>{
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      return {a, id, el: document.getElementById(id)};
    }).filter(x=>x.el);

    if(!links.length) return;

    let ticking=false;
    function update(){
      ticking=false;
      const y = window.scrollY + OFFSET + 10;
      let current = links[0];
      for(const it of links){
        if(it.el.offsetTop <= y) current = it;
        else break;
      }
      links.forEach(it=>it.a.classList.toggle('is-active', it===current));
    }
    window.addEventListener('scroll', ()=>{
      if(ticking) return;
      ticking=true;
      requestAnimationFrame(update);
    }, {passive:true});
    update();

    // Style
    const style=document.createElement('style');
    style.textContent = `
      [data-mi-onpage-nav] a.is-active{
        background: rgba(255,255,255,.08) !important;
        border-color: rgba(255,255,255,.18) !important;
      }
      .co-section{ scroll-margin-top:${OFFSET}px; }
    `;
    document.head.appendChild(style);
  }

  // safer hash scroll
  window.addEventListener('load', ()=>{
    if(location.hash && location.hash.length>1){
      const id = decodeURIComponent(location.hash.slice(1));
      setTimeout(()=>smoothScrollTo(id), 30);
    }
  });

  document.addEventListener('DOMContentLoaded', buildOnThisPage);
})();