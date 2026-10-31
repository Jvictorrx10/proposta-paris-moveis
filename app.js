(() => {
  const D = window.PARIS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&fm=webp&q=70`;

  // ---------- Avisos ----------
  const toastEl = $('[data-toast]');
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 4200);
  }
  const wa = text => `https://wa.me/${D.whatsapp.numero}?text=${encodeURIComponent(text)}`;
  const pageUrl = () => location.href.split('#')[0];

  // ---------- Ambientes ----------
  const tabs = $('[data-tabs]');
  const stage = $('[data-stage]');
  let amb = D.ambientes[0];
  tabs.innerHTML = D.ambientes.map(a =>
    `<button type="button" role="tab" id="tab-${a.id}" data-amb="${a.id}" aria-selected="false">${a.nome}</button>`).join('');
  function renderAmb() {
    $$('button', tabs).forEach(b => b.setAttribute('aria-selected', String(b.dataset.amb === amb.id)));
    const [f1, f2] = amb.fotos;
    stage.innerHTML = `
      <figure class="main"><img src="${img(f1, 1400, 875)}" width="1400" height="875" alt="${amb.nome} planejada (imagem ilustrativa)"><figcaption>Imagem ilustrativa</figcaption></figure>
      ${f2 ? `<figure class="side"><img src="${img(f2, 700, 525)}" width="700" height="525" alt="" loading="lazy"></figure>` : ''}
      <div class="text"><p>${amb.texto}</p><a href="#orcamento" data-pick="${amb.id}">Orçar ${amb.nome.toLowerCase()}</a></div>`;
  }
  tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-amb]'); if (!b) return;
    amb = D.ambientes.find(a => a.id === b.dataset.amb); renderAmb();
  });
  tabs.addEventListener('keydown', e => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    const i = D.ambientes.indexOf(amb);
    amb = D.ambientes[(i + (e.key === 'ArrowRight' ? 1 : -1) + D.ambientes.length) % D.ambientes.length];
    renderAmb(); $(`#tab-${amb.id}`).focus();
  });

  // ---------- Orçamento guiado ----------
  const opcoes = {
    ambientes: [...D.ambientes.map(a => a.nome), 'Churrasqueira', 'Casa completa'],
    imovel: ['Na planta', 'Em reforma', 'Pronto para mobiliar'],
    quando: ['O quanto antes', 'Em até 3 meses', 'Em até 6 meses', 'Só pesquisando'],
    loja: D.lojas.map(l => l.nome),
  };
  const rotulos = { ambientes: 'Ambientes', imovel: 'Imóvel', quando: 'Prazo', loja: 'Loja' };
  const escolha = { ambientes: [], imovel: '', quando: '', loja: '' };

  $$('[data-q]').forEach(box => {
    const q = box.dataset.q;
    box.innerHTML = opcoes[q].map(o => `<button type="button" aria-pressed="false" data-opt="${o}">${o}</button>`).join('');
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-opt]'); if (!b) return;
      toggle(q, b.dataset.opt);
    });
  });
  function toggle(q, o, force) {
    if (Array.isArray(escolha[q])) {
      const has = escolha[q].includes(o);
      if (o === 'Casa completa' && !has) escolha[q] = [];
      else escolha[q] = escolha[q].filter(x => x !== 'Casa completa');
      if (has && !force) escolha[q] = escolha[q].filter(x => x !== o);
      else if (!has) escolha[q].push(o);
    } else {
      escolha[q] = escolha[q] === o && !force ? '' : o;
    }
    renderQuote(q);
  }
  function renderQuote(changed) {
    $$('[data-q]').forEach(box => {
      const q = box.dataset.q;
      $$('button', box).forEach(b => {
        const v = b.dataset.opt;
        b.setAttribute('aria-pressed', String(Array.isArray(escolha[q]) ? escolha[q].includes(v) : escolha[q] === v));
      });
    });
    $('[data-slip]').innerHTML = Object.keys(rotulos).map(q => {
      const v = Array.isArray(escolha[q]) ? escolha[q].join(', ') : escolha[q];
      return `<dt>${rotulos[q]}</dt><dd class="${v ? '' : 'empty'}${q === changed ? ' flash' : ''}">${v || 'a escolher'}</dd>`;
    }).join('');
    setTimeout(() => $$('.slip dd.flash').forEach(d => d.classList.remove('flash')), 500);
  }
  function quoteMessage() {
    const nome = $('[data-nome]').value.trim();
    const linhas = [
      `Oi, Paris!${nome ? ` Aqui é ${nome}.` : ''} Quero um orçamento de móveis planejados.`,
      `Ambientes: ${escolha.ambientes.join(', ')}`,
      escolha.imovel && `Imóvel: ${escolha.imovel.toLowerCase()}`,
      escolha.quando && `Prazo: ${escolha.quando.toLowerCase()}`,
      escolha.loja && `Loja: ${escolha.loja}`,
      'Como fazemos para medir e começar o projeto?',
      pageUrl(),
    ];
    return linhas.filter(Boolean).join('\n');
  }
  $('[data-send]').addEventListener('click', () => {
    if (!escolha.ambientes.length) {
      toast('Escolha pelo menos um ambiente.');
      $('[data-q="ambientes"] button').focus();
      return;
    }
    window.open(wa(quoteMessage()), '_blank', 'noopener');
  });
  // "Orçar cozinha" na galeria já marca o ambiente.
  stage.addEventListener('click', e => {
    const a = e.target.closest('[data-pick]'); if (!a) return;
    toggle('ambientes', D.ambientes.find(x => x.id === a.dataset.pick).nome, true);
  });

  // ---------- Lojas ----------
  const storeTabs = $('[data-store-tabs]');
  let loja = D.lojas[0];
  storeTabs.innerHTML = D.lojas.map(l =>
    `<button type="button" role="tab" data-loja="${l.id}" aria-selected="false">${l.nome}</button>`).join('');
  function renderLoja() {
    $$('button', storeTabs).forEach(b => b.setAttribute('aria-selected', String(b.dataset.loja === loja.id)));
    const destino = encodeURIComponent(`${loja.endereco} - ${loja.bairro}`);
    $('[data-store]').innerHTML = `
      <address>${loja.endereco}<br>${loja.bairro}${loja.cep ? ` · CEP ${loja.cep}` : ''}</address>
      <dl class="hours">${loja.horario.map(([d, h]) => `<dt>${d}</dt><dd>${h}</dd>`).join('')}</dl>
      <p class="links"><a href="tel:${loja.tel}">${loja.telefone}</a><a href="https://www.google.com/maps/dir/?api=1&amp;destination=${destino}" target="_blank" rel="noopener">Como chegar</a></p>
      <a class="btn btn-wide" href="#orcamento">Agendar uma visita</a>`;
  }
  storeTabs.addEventListener('click', e => {
    const b = e.target.closest('[data-loja]'); if (!b) return;
    loja = D.lojas.find(l => l.id === b.dataset.loja); renderLoja();
  });

  // ---------- Entradas ----------
  const io = 'IntersectionObserver' in window && new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => {
    const sib = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = `${sib.indexOf(el) * 80}ms`;
    if (io) io.observe(el); else el.classList.add('is-in');
  });

  renderAmb();
  renderQuote();
  renderLoja();
})();
