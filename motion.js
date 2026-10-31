// Assinatura de movimento da Paris. Abaixo dela, a base comum (_base/motion-base.js).
window.assinatura = ({ gsap, ScrollTrigger, mobile }) => {
  const $ = s => document.querySelector(s);

  // Abertura: a cozinha abre de baixo para cima, o título sobe linha a linha, depois a frase e o menu.
  gsap.timeline({ defaults: { ease: 'power4.out' } })
    .fromTo('.hero-img', { clipPath: 'inset(100% 0 0 0)', scale: 1.18 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.4, ease: 'power4.inOut' })
    .fromTo('.hero .ln > span', { yPercent: 110, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 1.1, stagger: .14 }, '-=.55')
    .fromTo('.hero-line', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .9 }, '-=.6')
    .from('.nav > *', { y: -20, opacity: 0, duration: .7, stagger: .08 }, '-=.8')
    .from('.hero-cta', { y: 30, opacity: 0, duration: .7 }, '-=.6');

  // Rolando: a cozinha dá zoom e o título sobe mais rápido e some, como entrando no ambiente.
  const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 };
  gsap.to('.hero-img', { scale: 1.15, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero-text', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { ...heroST, end: '70% top' } });

  // Ambientes: as abas entram em cascata e cada troca revela as fotos como uma porta abrindo.
  gsap.from('.room-tabs button', { y: 30, opacity: 0, stagger: .07, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.room-tabs', start: 'top 88%', once: true } });
  const revelaAmbiente = () => {
    gsap.fromTo('.room-stage figure', { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: .9, ease: 'power4.inOut', stagger: .12 });
    gsap.fromTo('.room-stage .text', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: .7, delay: .3, ease: 'power3.out' });
  };
  let primeira = true;
  const onAmbiente = () => { if (primeira) { primeira = false; return; } revelaAmbiente(); };
  document.addEventListener('paris:ambiente', onAmbiente);
  ScrollTrigger.create({ trigger: '.room-stage', start: 'top 80%', once: true, onEnter: revelaAmbiente });

  // Do projeto à montagem: as três fotos sobem em velocidades diferentes, reforçando a diagonal.
  [['.s1 img', -6], ['.s2 img', -22], ['.s3 img', -12]].forEach(([sel, y]) => {
    gsap.fromTo(sel, { yPercent: mobile ? 0 : -y / 2 }, { yPercent: mobile ? 0 : y, ease: 'none',
      scrollTrigger: { trigger: '.how', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    gsap.from(sel, { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power4.inOut', scrollTrigger: { trigger: sel, start: 'top 85%', once: true } });
  });

  // Faixa de fotos: a do meio corre para um lado e as das pontas para o outro.
  gsap.utils.toArray('.strip img').forEach((im, i) => {
    gsap.fromTo(im, { xPercent: i === 1 ? -6 : 6, scale: 1.12 }, { xPercent: i === 1 ? 6 : -6, scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: '.strip', start: 'top bottom', end: 'bottom top', scrub: 1 } });
  });

  // Orçamento: as opções aparecem em sequência e a ficha desliza da direita.
  gsap.from('.quote .chips button', { y: 16, opacity: 0, stagger: .025, duration: .5, ease: 'power2.out', scrollTrigger: { trigger: '.quote-form', start: 'top 80%', once: true } });
  gsap.from('.slip', { x: mobile ? 0 : 80, y: mobile ? 40 : 0, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.quote-band', start: 'top 75%', once: true } });

  // Lojas: a foto se move devagar por trás do cartão.
  gsap.fromTo('.stores-img', { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.stores', start: 'top bottom', end: 'bottom top', scrub: 1 } });

  // Rodapé: os números do WhatsApp sobem um a um.
  const phone = $('.footer-phone');
  if (phone && !phone.querySelector('.d')) phone.innerHTML = [...phone.textContent].map(c => `<span class="d">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  gsap.from('.footer-phone .d', { yPercent: 100, opacity: 0, stagger: .04, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.footer', start: 'top 70%', once: true } });

  return () => document.removeEventListener('paris:ambiente', onAmbiente);
};

// Movimento padrão dos sites-demo (estilo TAL): GSAP + ScrollTrigger.
// Como usar: site/motion.js = `window.assinatura = ({ gsap, ScrollTrigger, mobile }) => { ... }` + este arquivo.
// A assinatura roda dentro do gsap.matchMedia (só com movimento permitido) e cuida da abertura (.intro) do site.
// No index.html, antes de app.js:
//   gsap.min.js e ScrollTrigger.min.js do cdnjs (versão 3.12.5), com defer
// e depois deles, motion.js também com defer (roda depois do app.js do fim do body).
// No <head>, um script que marca html.no-motion se o GSAP não carregar em 2,5s, e no CSS:
//   html.js:not(.no-motion) .reveal, html.js:not(.no-motion) .intro { opacity: 0; }
//   @media (prefers-reduced-motion: reduce) { html.js .reveal, html.js .intro { opacity: 1; } }
//   .backtype { position:absolute; font-size:22vw; white-space:nowrap; pointer-events:none; line-height:.8; }
// Marcações: .reveal (entra ao rolar), .intro (entra na abertura, pela assinatura), [data-parallax] (foto com
// parallax), [data-count] (número que conta), .backtype (palavra gigante).
(() => {
  if (!window.gsap || !window.ScrollTrigger) return; // sem GSAP o site fica como está
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('motion');
  const $$ = s => gsap.utils.toArray(s);

  const mm = gsap.matchMedia();
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)', mobile: '(max-width: 860px)' }, ctx => {
    const { motion, mobile } = ctx.conditions;
    if (!motion) { gsap.set('.reveal, .intro', { opacity: 1, y: 0 }); return; }

    // Revelar ao rolar, em cascata
    gsap.set('.reveal', { opacity: 0, y: 26 });
    ScrollTrigger.batch('.reveal', {
      start: 'top 94%', once: true,
      onEnter: els => gsap.to(els, { opacity: 1, y: 0, duration: .85, ease: 'power3.out', stagger: .08, overwrite: true }),
    });

    // Fotos com parallax
    $$('[data-parallax]').forEach(img => {
      gsap.fromTo(img, { scale: 1.08, yPercent: -4 }, {
        scale: 1, yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });

    // Números que contam até o valor (data-count="447", data-dec="1" para 4,9)
    $$('[data-count]').forEach(el => {
      const fim = parseFloat(el.dataset.count), dec = Number(el.dataset.dec || 0), o = { v: 0 };
      const fmt = v => v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      gsap.to(o, { v: fim, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        onUpdate: () => { el.textContent = fmt(o.v); }, onStart: () => { el.textContent = fmt(0); } });
    });

    // Palavras gigantes atravessando a seção
    $$('.backtype').forEach(el => {
      gsap.fromTo(el, { xPercent: mobile ? 5 : 10 }, {
        xPercent: mobile ? -45 : -30, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });

    // A assinatura pode devolver uma função de limpeza (ex.: remover ouvintes de eventos).
    if (typeof window.assinatura === 'function') return window.assinatura({ gsap, ScrollTrigger, mobile });
  });

  // Recalcula as posições quando fontes e fotos terminam de carregar
  const refresh = () => ScrollTrigger.refresh();
  document.fonts && document.fonts.ready.then(refresh);
  $$('img').forEach(i => { if (!i.complete) i.addEventListener('load', refresh, { once: true }); });
})();
