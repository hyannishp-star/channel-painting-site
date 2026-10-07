// Painting Channel Plus · nav, comparador, ampliação e validação dos formulários
(function () {
  // MENU: fonte única da navegação de todas as páginas (o HTML só tem 3 links de reserva sem JavaScript)
  var WHATSAPP = 'https://wa.me/15082801573?text=' + encodeURIComponent('Olá! Vim pelo Painting Channel Plus (paintingchannel.com). Meu nome: ___ . Minha sugestão ou crítica: ___');
  var MENU = [
    { rot: 'Painters', pag: 'mural.html', itens: [
      ['Mural dos Pintores', 'mural.html', 'Veja o trabalho de outros pintores'],
      ['Mostrar meu trabalho', 'mural.html#enviar', 'Mande a foto do seu projeto'] ] },
    { rot: 'Questions', pag: 'dicas.html', itens: [
      ['Trim podre', 'dicas.html#cat-trim'], ['Troca de madeira', 'dicas.html#cat-troca'],
      ['Casa pintada', 'dicas.html#cat-casa'], ['Erros comuns', 'dicas.html#cat-erros'],
      ['Projetos de pintores', 'dicas.html#cat-projetos'], ['Antes e depois', 'dicas.html#antes-depois'],
      ['Mande sua pergunta', 'dicas.html#pergunta', '', 'forte'], ['Perguntas frequentes', 'dicas.html#perguntas', '', 'forte'] ] },
    { rot: 'Contact', pag: 'contato.html', itens: [
      ['Sua opinião', 'contato.html#fale', 'Sugestão ou crítica'],
      ['WhatsApp', WHATSAPP, 'Áudio, foto ou texto', 'externo'],
      ['Receber por e-mail', 'contato.html#receber', 'Uma dica por semana'] ] }
  ];
  var menuNav = document.querySelector('.nav .menu');
  if (menuNav) {
    var aqui = (location.pathname.split('/').pop() || 'index.html');
    var html = '<button class="hamb" type="button" aria-expanded="false" aria-controls="menu-lista"><span class="hamb-ic" aria-hidden="true"><i></i><i></i><i></i></span><span class="hamb-txt">Menu</span></button><ul class="menu-lista" id="menu-lista">';
    MENU.forEach(function (g, i) {
      html += '<li class="grupo' + (g.pag === aqui ? ' atual' : '') + '"><button class="grupo-btn" type="button" aria-expanded="false" aria-controls="sub-' + i + '"' + (g.pag === aqui ? ' aria-current="page"' : '') + '>' + g.rot + '<span class="seta" aria-hidden="true"></span></button><ul class="sub" id="sub-' + i + '">';
      g.itens.forEach(function (it) {
        var ext = it[3] === 'externo';
        html += '<li class="' + (it[3] || '') + '"><a href="' + it[1] + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + it[0] + (it[2] ? '<small>' + it[2] + '</small>' : '') + '</a></li>';
      });
      html += '</ul></li>';
    });
    menuNav.innerHTML = html + '</ul>';
    var header = document.querySelector('.nav'), hamb = menuNav.querySelector('.hamb'),
        grupos = Array.prototype.slice.call(menuNav.querySelectorAll('.grupo')),
        mouseFino = window.matchMedia('(hover: hover) and (pointer: fine)'), largo = window.matchMedia('(min-width: 900px)');
    var abre = function (g, sim) { g.classList.toggle('aberto', sim); g.querySelector('.grupo-btn').setAttribute('aria-expanded', sim ? 'true' : 'false'); };
    var fechaTodos = function (exceto) { grupos.forEach(function (g) { if (g !== exceto) abre(g, false); }); };
    var fechaPainel = function () { header.classList.remove('menu-aberto'); hamb.setAttribute('aria-expanded', 'false'); fechaTodos(); };
    grupos.forEach(function (g) {
      var btn = g.querySelector('.grupo-btn'), timer;
      btn.addEventListener('click', function () {
        var sim = !g.classList.contains('aberto');
        if (!sim && Date.now() - (g._hover || 0) < 600) sim = true; // acabou de abrir pelo mouse: o clique confirma, não fecha
        if (largo.matches) fechaTodos(g); abre(g, sim);
      });
      g.addEventListener('mouseenter', function () { if (!largo.matches || !mouseFino.matches) return; clearTimeout(timer); if (!g.classList.contains('aberto')) g._hover = Date.now(); fechaTodos(g); abre(g, true); });
      g.addEventListener('mouseleave', function () { if (!largo.matches || !mouseFino.matches) return; timer = setTimeout(function () { abre(g, false); }, 180); });
      g.addEventListener('focusout', function (e) { if (largo.matches && !g.contains(e.relatedTarget)) abre(g, false); });
    });
    hamb.addEventListener('click', function () {
      var sim = !header.classList.contains('menu-aberto');
      header.classList.toggle('menu-aberto', sim); hamb.setAttribute('aria-expanded', sim ? 'true' : 'false');
      if (!sim) fechaTodos();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var aberto = grupos.filter(function (g) { return g.classList.contains('aberto'); })[0];
      if (aberto) { abre(aberto, false); aberto.querySelector('.grupo-btn').focus(); }
      else if (header.classList.contains('menu-aberto')) { fechaPainel(); hamb.focus(); }
    });
    document.addEventListener('click', function (e) { if (!header.contains(e.target)) fechaPainel(); });
    menuNav.addEventListener('click', function (e) { if (e.target.closest('.sub a')) fechaPainel(); });
    largo.addEventListener('change', fechaPainel);
    var rolou = function () { header.classList.toggle('rolou', window.scrollY > 8); };
    window.addEventListener('scroll', rolou, { passive: true }); rolou();
  }

  // comparador antes e depois
  document.querySelectorAll('.comp input[type=range]').forEach(function (r) {
    var comp = r.closest('.comp');
    var set = function () {
      comp.style.setProperty('--pos', r.value + '%');
      r.setAttribute('aria-valuetext', r.value + '% mostrando o depois');
    };
    r.addEventListener('input', set); set();
  });


  // portal: as três fitas ligam o círculo do logo às três portas
  var portal = document.querySelector('.portal');
  if (portal) {
    var svg = portal.querySelector('.fitas'), caminhos = portal.querySelectorAll('.fita-linha'),
        circ = portal.querySelector('.circulo'), portas = portal.querySelectorAll('.porta a'),
        quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var desenha = function () {
      var base = portal.querySelector('.portal-in').getBoundingClientRect(), c = circ.getBoundingClientRect();
      var cx = c.left + c.width / 2 - base.left, cy = c.top + c.height / 2 - base.top, raio = c.width / 2,
          lado = window.matchMedia('(min-width: 900px)').matches;
      portas.forEach(function (a, i) {
        var r = a.getBoundingClientRect(), ex = r.left + r.width / 2 - base.left, ey = r.top - base.top + 18, d;
        if (lado && i !== 1) {
          // Painters e Contact saem da lateral do círculo, na linha do meio, e descem em curva
          var sx = cx + (i === 0 ? -raio : raio), dir = i === 0 ? -1 : 1, dy = ey - cy;
          d = 'M' + sx + ',' + cy + ' C' + (sx + dir * Math.abs(ex - sx) * 0.75) + ',' + cy + ' ' + ex + ',' + (ey - dy * 0.55) + ' ' + ex + ',' + ey;
        } else {
          var sy = cy + raio * 0.94, dy2 = ey - sy;
          d = 'M' + cx + ',' + sy + ' C' + cx + ',' + (sy + dy2 * 0.55) + ' ' + ex + ',' + (ey - dy2 * 0.45) + ' ' + ex + ',' + ey;
        }
        caminhos[i].setAttribute('d', d);
      });
    };
    desenha();
    if (!quieto) {
      portal.classList.add('anima');
      caminhos.forEach(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        portal.classList.add('vai'); caminhos.forEach(function (p) { p.style.strokeDashoffset = 0; });
      }); });
      setTimeout(function () { caminhos.forEach(function (p) { p.style.strokeDasharray = 'none'; }); }, 2000);
    }
    var t; window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(desenha, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(desenha);
    window.addEventListener('load', desenha);
  }

  // REDES DO CANAL: YouTube e Instagram ainda não existem. Ponto único para ligar depois:
  // preencher as URLs abaixo e criar os botões no rodapé (index.html, mural.html, obrigado.html).
  var REDES = { youtube: '', instagram: '' };

  // validação dos formulários, mensagens em português perto do campo; envio normal (não AJAX)
  function erroDe(campo) {
    if (campo.type === 'file') {
      if (!campo.files || !campo.files.length) return campo.dataset.erro;
      var f = campo.files[0], max = +campo.dataset.max || Infinity;
      if (!/^image\/(jpeg|png)$/.test(f.type)) return 'A foto precisa ser JPG ou PNG.';
      if (f.size > max) return 'A foto tem ' + (f.size / 1048576).toFixed(1) + ' MB. O limite é 8 MB.';
      return '';
    }
    if (campo.type === 'checkbox') return campo.checked ? '' : campo.dataset.erro;
    if (campo.validity.valid) return '';
    if (campo.validity.typeMismatch && campo.type === 'url') return 'Cole o link completo, começando com https://';
    return campo.dataset.erro || 'Preencha este campo.';
  }
  function mostraErro(campo, msg) {
    var bloco = campo.closest('.campo'), alvo = bloco && bloco.querySelector('.erro');
    if (bloco) bloco.classList.toggle('invalido', !!msg);
    if (alvo) alvo.textContent = msg || '';
    if (alvo && !alvo.id) alvo.id = (campo.id || 'c') + '-erro';
    if (msg) { campo.setAttribute('aria-invalid', 'true'); campo.setAttribute('aria-describedby', alvo ? alvo.id : ''); }
    else campo.removeAttribute('aria-invalid');
  }
  document.querySelectorAll('form.valida').forEach(function (form) {
    var campos = form.querySelectorAll('[data-erro]');
    campos.forEach(function (c) {
      var ev = (c.type === 'file' || c.type === 'checkbox' || c.tagName === 'SELECT') ? 'change' : 'blur';
      c.addEventListener(ev, function () { mostraErro(c, erroDe(c)); });
      c.addEventListener('input', function () { if (c.closest('.invalido')) mostraErro(c, erroDe(c)); });
    });
    var txt = form.querySelector('textarea[maxlength]'), cont = form.querySelector('.contador');
    if (txt && cont) {
      var conta = function () { var n = txt.value.length, m = +txt.maxLength; cont.textContent = n + ' de ' + m + ' caracteres'; cont.classList.toggle('perto', n > m - 30); };
      txt.addEventListener('input', conta); conta();
    }
    form.addEventListener('submit', function (e) {
      var primeiro = null;
      campos.forEach(function (c) { var m = erroDe(c); mostraErro(c, m); if (m && !primeiro) primeiro = c; });
      if (primeiro) { e.preventDefault(); primeiro.focus(); return; }
      var email = form.querySelector('input[type=email]'), rt = form.querySelector('.replyto');
      if (email && rt) rt.value = email.value;
      var b = form.querySelector('button[type=submit]'); if (b) { b.disabled = true; b.textContent = 'Enviando...'; }
    });
  });

  // ao voltar pelo botão do navegador, reativa o botão de enviar
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('form.valida button[type=submit]').forEach(function (b) { if (b.disabled) { b.disabled = false; b.textContent = b.dataset.texto || 'Enviar'; } });
  });
  document.querySelectorAll('form.valida button[type=submit]').forEach(function (b) { b.dataset.texto = b.textContent; });

  // ampliação (lightbox) com <dialog>: Esc fecha, setas navegam, foco volta
  var caixa = document.getElementById('caixa');
  var botoes = Array.prototype.slice.call(document.querySelectorAll('.abrir'));
  if (!caixa || !botoes.length) return;
  var img = caixa.querySelector('img'), leg = caixa.querySelector('figcaption'),
      cont = caixa.querySelector('.cont'), atual = 0, origem = null;
  function mostra(i) {
    atual = (i + botoes.length) % botoes.length;
    var b = botoes[atual], mini = b.querySelector('img');
    img.src = b.dataset.grande; img.alt = mini.alt;
    leg.textContent = b.dataset.legenda || '';
    cont.textContent = 'Foto ' + (atual + 1) + ' de ' + botoes.length;
  }
  botoes.forEach(function (b, i) {
    b.addEventListener('click', function () { origem = b; mostra(i); caixa.showModal(); caixa.querySelector('.fecha').focus(); });
  });
  caixa.querySelector('.ant').addEventListener('click', function () { mostra(atual - 1); });
  caixa.querySelector('.prox').addEventListener('click', function () { mostra(atual + 1); });
  caixa.querySelector('.fecha').addEventListener('click', function () { caixa.close(); });
  caixa.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); mostra(atual - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); mostra(atual + 1); }
  });
  caixa.addEventListener('click', function (e) { if (e.target === caixa) caixa.close(); });
  caixa.addEventListener('close', function () { if (origem) origem.focus(); });
})();
