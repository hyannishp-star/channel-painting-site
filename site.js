// Painting Channel Plus · nav, comparador, ampliação e validação dos formulários
(function () {
  // navegação discreta: esconde ao descer, volta ao subir
  var nav = document.querySelector('.nav'), ultimo = 0;
  if (nav) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      nav.classList.toggle('esconde', y > ultimo && y > 240 && !nav.contains(document.activeElement));
      ultimo = y;
    }, { passive: true });
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
