function DefinirSidebarAberta(abrir){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const floatingMenuBtn = document.getElementById('floatingMenuBtn');

  sidebar?.classList.toggle('is-open', abrir);
  overlay?.classList.toggle('show', abrir);
  floatingMenuBtn?.classList.toggle('is-hidden', abrir);
}

function DefinirPaginaAtiva(pageId, itemClicado){
  document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('bg-secondary'));
  itemClicado?.classList.add('bg-secondary');

  document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId)?.classList.add('active');

  if (window.innerWidth <= 900) DefinirSidebarAberta(false);
}

function InicializarHoje(){
  const hoje = new Date();
  const yyyy = hoje.getFullYear();
  const mm = String(hoje.getMonth() + 1).padStart(2,'0');
  const dd = String(hoje.getDate()).padStart(2,'0');
  const iso = `${yyyy}-${mm}-${dd}`;

  const input = document.getElementById('calendarInput');
  if (input) input.value = iso;

  const label = document.getElementById('todayLabel');
  if (label) {
    const dataFormatada = hoje.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    label.textContent = `Hoje é ${dataFormatada}`;
  }

  const usuarioLogin = document.getElementById('helloTitleHome');
  if (usuarioLogin) {
    const nomeCompleto = (sessionStorage.getItem('usuario') || '').trim();

    if (!nomeCompleto) {
      usuarioLogin.textContent = 'Olá, Usuário';
    } else {
      const partes = nomeCompleto.split(/\s+/).filter(Boolean); // separa por 1+ espaços [web:122]
      const primeiro = partes[0];
      const ultimo = partes.length > 1 ? partes[partes.length - 1] : '';
      usuarioLogin.textContent = `Olá, ${ultimo ? `${primeiro} ${ultimo}` : primeiro}`;
    }
  }

}

function ObterPrimeiroEUltimoNome(nomeCompleto) {
  const limpo = (nomeCompleto || '').trim();
  if (!limpo) return { primeiro: '', ultimo: '', exibicao: '' };

  const partes = limpo.split(/\s+/).filter(Boolean); // split por espaços [web:122]
  const primeiro = partes[0] || '';
  const ultimo = (partes.length > 1) ? partes[partes.length - 1] : '';
  const exibicao = ultimo ? `${primeiro} ${ultimo}` : primeiro;

  return { primeiro, ultimo, exibicao };
}

function ObterDominioDoEmail(email) {
  const e = (email || '').trim();
  const at = e.indexOf('@');
  if (at === -1) return '';
  return e.substring(at + 1);
}


function FormatarDataHoraLocal(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

function RemoverModalAgendamentoSala() {
  document.getElementById('roomModalOverlay')?.remove();
  document.getElementById('roomModal')?.remove();
}

function AbrirModalAgendamentoSala() {
  RemoverModalAgendamentoSala();

  const overlay = document.createElement('div');
  overlay.id = 'roomModalOverlay';
  overlay.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm z-[70]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'roomModal';
  modal.className = 'fixed inset-0 z-[80]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'roomModalTitle');

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto md:overflow-hidden no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <!-- Card fixo: sem scroll no card -->
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden h-auto md:h-[92vh] flex flex-col">

            <!-- Header fixo -->
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4 shrink-0">
              <div>
                <h3 id="roomModalTitle" class="text-xl font-semibold text-foreground">Agendar sala de reunião</h3>
                <p class="text-sm text-muted-foreground">Selecione a sala, data, horário e participantes</p>
              </div>

              <button id="closeRoomModal" type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                aria-label="Fechar" title="Fechar">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <!-- Conteúdo: 1 col no mobile, 2 cols no md+ -->
            <div class="px-6 py-6 flex-1 overflow-hidden">
              <form id="roomForm" class="h-full">
                <div class="h-full grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">

                  <!-- COLUNA 1: dados do agendamento -->
                  <div class="h-full overflow-hidden flex flex-col">
                    <div class="space-y-4">
                      <div class="space-y-2">
                        <label for="roomName" class="text-sm font-medium">Sala de reunião</label>
                        <select id="roomName"
                          class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                          required>
                          <option value="" selected disabled hidden>Selecione uma sala...</option>
                          <option value="Sala 01">Sala 01</option>
                          <option value="Sala 02">Sala 02</option>
                          <option value="Sala Diretoria">Sala Diretoria</option>
                        </select>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <label for="roomStartDT" class="text-sm font-medium">Data e hora início</label>
                          <input id="roomStartDT" type="datetime-local"
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            required />
                        </div>

                        <div class="space-y-2">
                          <label for="roomEndDT" class="text-sm font-medium">Data e hora fim</label>
                          <input id="roomEndDT" type="datetime-local"
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            required />
                        </div>
                      </div>

                      <div class="space-y-2">
                        <label for="roomReason" class="text-sm font-medium">Motivo</label>
                        <input id="roomReason" type="text"
                          class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Ex.: Reunião de planejamento"
                          required />
                      </div>

                      <p id="roomFormErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>
                    </div>
                  </div>

                  <!-- COLUNA 2: participantes + botões -->
                  <div class="h-full overflow-hidden flex flex-col">
                    <div class="space-y-4 flex-1 overflow-hidden flex flex-col">

                      <!-- Participantes -->
                      <div class="space-y-2 flex-1 overflow-hidden flex flex-col">
                        <div class="flex items-center justify-between gap-3 flex-wrap">
                          <div class="flex items-center gap-3 flex-wrap">
                            <label class="text-sm font-medium">Participantes</label>
                            <span id="usersCount" class="text-xs text-muted-foreground"></span>
                          </div>

                          <div class="flex items-center gap-2 flex-wrap">
                            <select id="setorFilter"
                              class="rounded-xl border border-border bg-white/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                              title="Filtrar por setor">
                              <option value="">Todos os setores</option>
                            </select>

                            <button id="btnSelecionarTodosUsers" type="button"
                              class="text-xs px-3 py-2 rounded-xl border border-border bg-white/50 hover:bg-white/70 transition-all">
                              Selecionar todos
                            </button>

                            <button id="btnLimparUsers" type="button"
                              class="text-xs px-3 py-2 rounded-xl border border-border bg-white/50 hover:bg-white/70 transition-all">
                              Limpar
                            </button>
                          </div>
                        </div>

                        <input id="filtroUsers" type="text"
                          class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Buscar por nome ou email..." />

                        <!-- Aqui fica o ÚNICO scroll (lista de usuários) -->
                        <div id="usersBox"
                          class="rounded-xl border border-border bg-white/50 p-3 flex-1 overflow-auto no-scrollbar space-y-2 min-h-0">
                          <p id="usersLoading" class="text-sm text-muted-foreground">Carregando usuários...</p>
                        </div>
                      </div>

                      <!-- Botões -->
                      <div class="pt-2 flex flex-col sm:flex-row gap-3 shrink-0">
                        <button id="btnSalvarAgendamentoSala" type="submit"
                          class="sm:flex-1 rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                          Salvar
                        </button>

                        <button id="btnCancelarAgendamentoSala" type="button"
                          class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all">
                          Cancelar
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const inputInicio = document.getElementById('roomStartDT');
  const inputFim = document.getElementById('roomEndDT');

  const formulario = document.getElementById('roomForm');
  const btnSalvar = document.getElementById('btnSalvarAgendamentoSala');

  const usersBox = document.getElementById('usersBox');
  const usersLoading = document.getElementById('usersLoading');
  const filtroUsers = document.getElementById('filtroUsers');
  const setorFilter = document.getElementById('setorFilter');
  const btnSelTodos = document.getElementById('btnSelecionarTodosUsers');
  const btnLimpar = document.getElementById('btnLimparUsers');
  const usersCount = document.getElementById('usersCount');

  let usuariosCache = []; // {id,nome,email,setor}
  let setoresCache = [];

  const selectedIds = new Set();

  function FecharModalAgendamentoSala() {
    RemoverModalAgendamentoSala();
  }

  overlay.addEventListener('click', FecharModalAgendamentoSala);
  document.getElementById('closeRoomModal')?.addEventListener('click', FecharModalAgendamentoSala);
  document.getElementById('btnCancelarAgendamentoSala')?.addEventListener('click', FecharModalAgendamentoSala);

  btnSalvar?.addEventListener('click', () => {
    formulario?.requestSubmit?.(btnSalvar);
  });

  // -------- Helpers datetime-local --------
  function pad2(n) { return String(n).padStart(2, '0'); }
  function todayDateStr() {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function validateNotPastStart() {
    if (!inputInicio?.value) return true;
    const chosen = new Date(inputInicio.value);
    const min = new Date(`${todayDateStr()}T00:00`);
    return chosen >= min;
  }

  function validateEndAfterStart() {
    if (!inputInicio?.value || !inputFim?.value) return true;
    const ini = new Date(inputInicio.value);
    const fim = new Date(inputFim.value);
    return fim > ini;
  }

  (function initDefaults() {
    if (inputInicio) inputInicio.min = `${todayDateStr()}T00:00`;
    if (inputInicio) inputInicio.value = `${todayDateStr()}T07:10`;
    if (inputFim) inputFim.value = `${todayDateStr()}T17:30`;
  })();

  function escapeHtml(s) {
    return String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function setRoomFormError(msg) {
    const el = document.getElementById('roomFormErro');
    if (!el) return;
    if (!msg) { el.textContent = ''; el.classList.add('hidden'); return; }
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function setSalvarLoading(loading) {
    const btn = document.getElementById('btnSalvarAgendamentoSala');
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'Salvando...' : 'Salvar';
    btn.classList.toggle('opacity-70', loading);
  }

  function getVisibleUsers() {
    const q = (filtroUsers?.value || '').trim().toLowerCase();
    const setorSel = (setorFilter?.value || '').trim();

    return usuariosCache.filter(u => {
      const nome = (u.nome || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const setor = (u.setor || '').toLowerCase();

      const qMatch = !q || nome.includes(q) || email.includes(q);
      const setorMatch = !setorSel || (u.setor || '') === setorSel;

      return qMatch && setorMatch;
    });
  }

  function atualizarContador(visiveis) {
    if (!usersCount) return;
    usersCount.textContent = `${selectedIds.size} selecionado(s) • ${visiveis.length} visível(is)`;
  }

  function renderUsuarios() {
    if (!usersBox) return;

    const visiveis = getVisibleUsers();

    if (!visiveis.length) {
      usersBox.innerHTML = `<p class="text-sm text-muted-foreground">Nenhum usuário encontrado.</p>`;
      atualizarContador([]);
      return;
    }

    usersBox.innerHTML = visiveis.map(u => {
      const idNum = Number(u.id);
      const idStr = String(u.id);

      const nomeAlta = String(u.nome || '').toUpperCase();
      const emailBaixa = String(u.email || '').toLowerCase();
      const setor = u.setor || 'Sem setor';

      const checked = selectedIds.has(idNum) ? 'checked' : '';

      return `
        <label class="flex items-start gap-3 rounded-xl border border-border bg-white/60 hover:bg-white/80 transition-all px-3 py-2 cursor-pointer">
          <input type="checkbox" class="mt-1 checkbox-user" data-user-id="${escapeHtml(idStr)}" ${checked} />
          <div class="min-w-0 flex-1">
            <div class="text-sm font-semibold truncate">${escapeHtml(nomeAlta)}</div>
            <div class="text-xs text-muted-foreground truncate">${escapeHtml(emailBaixa)}</div>
            <div class="text-xs text-muted-foreground truncate">${escapeHtml(setor)}</div>
          </div>
        </label>
      `;
    }).join('');

    usersBox.querySelectorAll('input.checkbox-user').forEach(chk => {
      chk.addEventListener('change', () => {
        const id = Number(chk.getAttribute('data-user-id'));
        if (!Number.isFinite(id)) return;

        if (chk.checked) selectedIds.add(id);
        else selectedIds.delete(id);

        atualizarContador(visiveis);
      });
    });

    atualizarContador(visiveis);
  }

  function selecionarTodosVisiveis() {
    const visiveis = getVisibleUsers();
    visiveis.forEach(u => {
      const id = Number(u.id);
      if (Number.isFinite(id)) selectedIds.add(id);
    });
    renderUsuarios();
  }

  function limparVisiveis() {
    const visiveis = getVisibleUsers();
    visiveis.forEach(u => {
      const id = Number(u.id);
      if (Number.isFinite(id)) selectedIds.delete(id);
    });
    renderUsuarios();
  }

  function getParticipantesSelecionadosIds() {
    return Array.from(selectedIds.values());
  }

  filtroUsers?.addEventListener('input', renderUsuarios);
  setorFilter?.addEventListener('change', renderUsuarios);
  btnSelTodos?.addEventListener('click', selecionarTodosVisiveis);
  btnLimpar?.addEventListener('click', limparVisiveis);

  async function carregarSetores() {
    const API_BASE = sessionStorage.getItem('api_base') || '';
    if (!API_BASE) throw new Error('API_BASE não configurada (sessionStorage api_base).');

    const resp = await fetch(`${API_BASE}/api/setores`, { method: 'GET' });
    const json = await resp.json().catch(() => ({}));
    if (!resp.ok) throw new Error(json?.message || `Erro ao listar setores. Status: ${resp.status}`);

    setoresCache = Array.isArray(json.items)
      ? json.items.map(s => String(s.nome || '').trim()).filter(Boolean)
      : [];

    if (setorFilter) {
      setorFilter.innerHTML =
        `<option value="">Todos os setores</option>` +
        setoresCache.map(nome => `<option value="${escapeHtml(nome)}">${escapeHtml(nome)}</option>`).join('');
    }
  }

  async function carregarUsuarios() {
    try {
      const API_BASE = sessionStorage.getItem('api_base') || '';
      if (!API_BASE) throw new Error('API_BASE não configurada (sessionStorage api_base).');

      const resp = await fetch(`${API_BASE}/api/usuarios`, { method: 'GET' });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(json?.message || `Erro ao listar usuários. Status: ${resp.status}`);

      usuariosCache = Array.isArray(json.items) ? json.items : [];
      renderUsuarios();
    } catch (err) {
      if (usersBox) {
        usersBox.innerHTML = `<p class="text-sm text-destructive whitespace-pre-line">${escapeHtml(err?.message || 'Erro ao carregar usuários.')}</p>`;
      }
    } finally {
      usersLoading?.remove();
    }
  }

  (async () => {
    try { await carregarSetores(); } catch (e) { console.error('Setores:', e); }
    await carregarUsuarios();
  })();

  // -------- Modal de conflito (mantido) --------
  function RemoverModalConflito() {
    document.getElementById('conflitoOverlay')?.remove();
    document.getElementById('conflitoModal')?.remove();
  }

  function fmtBR(v) {
    if (!v) return '(não informado)';
    const s = String(v);
    const semZ = s.endsWith('Z') ? s.slice(0, -1) : s;
    const d = new Date(semZ);
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleString('pt-BR');
  }

  function AbrirModalConflito({ sala, detalhe }) {
    RemoverModalConflito();

    const overlayC = document.createElement('div');
    overlayC.id = 'conflitoOverlay';
    overlayC.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]';
    document.body.appendChild(overlayC);

    const modalC = document.createElement('div');
    modalC.id = 'conflitoModal';
    modalC.className = 'fixed inset-0 z-[100]';
    modalC.setAttribute('role', 'dialog');
    modalC.setAttribute('aria-modal', 'true');
    modalC.setAttribute('aria-labelledby', 'conflitoTitle');

    const c = detalhe || {};
    const agendadoPor = c.usuario_agendamento || '(não informado)';

    modalC.innerHTML = `
      <div class="w-full h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-xl mx-auto px-4 sm:px-6">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 id="conflitoTitle" class="text-xl font-semibold text-foreground">Conflito de agendamento</h3>
                <p class="text-sm text-muted-foreground">Já existe um agendamento nesse intervalo</p>
              </div>

              <button id="btnFecharConflito" type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                aria-label="Fechar" title="Fechar">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="px-6 py-6 space-y-3 text-sm">
              <div class="rounded-xl border border-border bg-white/60 p-4 space-y-2">
                <div><span class="text-muted-foreground">Sala:</span> <span class="font-semibold text-foreground">${escapeHtml(sala || '(não informado)')}</span></div>
                <div><span class="text-muted-foreground">Agendado por:</span> <span class="font-semibold text-foreground">${escapeHtml(agendadoPor)}</span></div>
                <div><span class="text-muted-foreground">Motivo:</span> <span class="font-semibold text-foreground">${escapeHtml(c.motivo || '(não informado)')}</span></div>
                <div><span class="text-muted-foreground">Início:</span> <span class="font-semibold text-foreground">${escapeHtml(fmtBR(c.inicio))}</span></div>
                <div><span class="text-muted-foreground">Fim:</span> <span class="font-semibold text-foreground">${escapeHtml(fmtBR(c.fim))}</span></div>
                <div><span class="text-muted-foreground">Registro:</span> <span class="font-semibold text-foreground">${escapeHtml(fmtBR(c.data_agendamento))}</span></div>
              </div>

              <div class="pt-2">
                <button id="btnOkConflito" type="button"
                  class="w-full rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalC);

    const fechar = () => RemoverModalConflito();
    overlayC.addEventListener('click', fechar);
    document.getElementById('btnFecharConflito')?.addEventListener('click', fechar);
    document.getElementById('btnOkConflito')?.addEventListener('click', fechar);
  }

  // -------- Submit --------
  formulario?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setRoomFormError('');

    if (!formulario.reportValidity()) return;

    if (!validateNotPastStart()) {
      setRoomFormError('Não é permitido selecionar dias anteriores a hoje para a data/hora início.');
      return;
    }

    if (!validateEndAfterStart()) {
      setRoomFormError('A data/hora fim deve ser maior que a data/hora início.');
      return;
    }

    const sala = document.getElementById('roomName')?.value;
    const inicio = document.getElementById('roomStartDT')?.value;
    const fim = document.getElementById('roomEndDT')?.value;
    const motivo = document.getElementById('roomReason')?.value?.trim();

    if (!sala || !inicio || !fim || !motivo) return;

    const usuarioLogin = sessionStorage.getItem('usuario') || 'desconhecido';
    const criadoEmISO = new Date().toISOString();

    const payload = {
      sala, inicio, fim, motivo,
      usuario: usuarioLogin,
      criadoEm: criadoEmISO,
      participantes: getParticipantesSelecionadosIds()
    };

    try {
      setSalvarLoading(true);

      const API_BASE = sessionStorage.getItem('api_base') || '';
      if (!API_BASE) throw new Error('API_BASE não configurada (sessionStorage api_base).');

      const URL_CHECK = `${API_BASE}/api/agendamentos/sala/verificar`;
      const URL_SAVE  = `${API_BASE}/api/agendamentos/sala`;

      const checkResp = await fetch(URL_CHECK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sala: payload.sala, inicio: payload.inicio, fim: payload.fim })
      });

      const checkJson = await checkResp.json().catch(() => ({}));
      if (!checkResp.ok) throw new Error(checkJson?.message || `Erro ao verificar. Status: ${checkResp.status}`);

      if (checkJson?.conflito) {
        const c = checkJson.conflitoDetalhe || checkJson.conflito || {};
        AbrirModalConflito({ sala: payload.sala, detalhe: c });
        return;
      }

      const resp = await fetch(URL_SAVE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const saveJson = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(saveJson?.message || `Falha ao salvar. Status: ${resp.status}`);

      FecharModalAgendamentoSala();
      alert(saveJson?.message || 'Agendamento salvo com sucesso!');
    } catch (err) {
      setRoomFormError(err?.message || 'Erro ao salvar o agendamento.');
    } finally {
      setSalvarLoading(false);
    }
  });
}


// ===== Sessão expira após 4h sem atividade =====
(function SessionInatividade4h() {
  const LIMITE_MS = 4 * 60 * 60 * 1000; // 4 horas
  const KEY_OPEN = 'sessao_aberta_em_ms';
  const KEY_LAST = 'sessao_ultima_atividade_ms';

  function agoraMs() { return Date.now(); }

  function marcarAberturaSePreciso() {
    const opened = Number(sessionStorage.getItem(KEY_OPEN) || 0);
    if (!opened) sessionStorage.setItem(KEY_OPEN, String(agoraMs()));
  }

  function marcarAtividade() {
    sessionStorage.setItem(KEY_LAST, String(agoraMs()));
  }

  function expirarSessao(motivo) {
    // mantenha se quiser guardar uma mensagem para a tela de login
    // sessionStorage.setItem('logout_reason', motivo);

    sessionStorage.clear();
    alert(motivo || 'Sessão expirada. Faça login novamente.');
    window.location.href = 'index.html'; // ajuste para sua página de login
  }

  function checarInatividade() {
    const last = Number(sessionStorage.getItem(KEY_LAST) || 0);
    const opened = Number(sessionStorage.getItem(KEY_OPEN) || 0);
    const base = last || opened || agoraMs();

    if (agoraMs() - base >= LIMITE_MS) {
      expirarSessao('Sessão expirada por inatividade (4 horas). Faça login novamente.');
    }
  }

  let _resumoIntervalId = null;

  function HomeEstaAtiva() {
    const home = document.getElementById('home');
    return !!home && home.classList.contains('active');
  }

  function IniciarAutoRefreshResumoDia() {
    if (_resumoIntervalId) return; // já iniciou

    // roda imediatamente ao entrar no home
    if (HomeEstaAtiva()) CarregarResumoDoDia();

    _resumoIntervalId = setInterval(() => {
      // opcional: evita rodar em aba oculta
      if (document.visibilityState !== 'visible') return;

      if (HomeEstaAtiva()) {
        CarregarResumoDoDia();
      }
    }, 10_000); // 10s [web:294]
  }

  function PararAutoRefreshResumoDia() {
    if (!_resumoIntervalId) return;
    clearInterval(_resumoIntervalId);
    _resumoIntervalId = null;
  }

  // Inicializa (quando a página abre)
  document.addEventListener('DOMContentLoaded', () => {

    // 1) CHECAGEM DE AUTENTICAÇÃO (PRIMEIRO)
    const apiBase = sessionStorage.getItem('api_base');
    const usuario = sessionStorage.getItem('usuario');
    const email = sessionStorage.getItem('userEmail');

    if (!apiBase || !usuario || !email) {
      // se qualquer um estiver vazio/null/undefined, redireciona para login
      window.location.href = 'index.html';
      return; // para o resto da função
    }

    marcarAberturaSePreciso();
    marcarAtividade(); // considera atividade na abertura

    IniciarAutoRefreshResumoDia();

    // se trocar de aba e voltar, atualiza na hora
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && HomeEstaAtiva()) {
        CarregarResumoDoDia();
      }
    });

    // Eventos que contam como atividade
    const eventos = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'];
    eventos.forEach((ev) => window.addEventListener(ev, marcarAtividade, { passive: true }));

    // Checa a cada 30s
    setInterval(checarInatividade, 30 * 1000); // setInterval [web:294]

    // Checa também quando o usuário volta para a aba
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checarInatividade();
    });
    DefinirSidebarAberta(false);

    const elAvatar = document.getElementById('userAvatar');
    const elNome = document.getElementById('userDisplayName');
    const elDominio = document.getElementById('userDomain');

    const nomeCompleto = sessionStorage.getItem('usuario') || '';

    const { primeiro, ultimo, exibicao } = ObterPrimeiroEUltimoNome(nomeCompleto);
    const dominio = ObterDominioDoEmail(email);

    // Nome (primeiro + último)
    if (elNome) elNome.textContent = exibicao || 'Usuário'; // textContent [web:147]

    // Domínio (depois do @)
    if (elDominio) elDominio.textContent = dominio || 'Domínio';

    // Iniciais (primeiro + último)
    const inicial1 = primeiro ? primeiro[0].toUpperCase() : '';
    const inicial2 = ultimo ? ultimo[0].toUpperCase() : (primeiro ? primeiro[0].toUpperCase() : '');
    const iniciais = (inicial1 + inicial2) || 'U';

    if (elAvatar) elAvatar.textContent = iniciais;

    CarregarResumoDoDia();
    document.getElementById('calendarInput')?.addEventListener('change', CarregarResumoDoDia);
    document.getElementById('floatingMenuBtn')?.addEventListener('click', () => DefinirSidebarAberta(true));
    document.getElementById('closeSidebarBtn')?.addEventListener('click', () => DefinirSidebarAberta(false));
    document.getElementById('overlay')?.addEventListener('click', () => DefinirSidebarAberta(false));

    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', function () {
        const page = this.dataset.page;

        DefinirPaginaAtiva(page, this);

        // Se abriu a seção de clientes, carrega automaticamente
        if (page === 'secao-clientes') {
          carregarClientes();
        }
      });
    });


    document.getElementById('logoutBtn')?.addEventListener('click', function(){
      if (confirm('Deseja sair do sistema?')){
        sessionStorage.clear();
        window.location.href = 'index.html';
      }
    });

    document.getElementById('AgendarSalaReuniao')?.addEventListener('click', AbrirModalAgendamentoSala);

    InicializarHoje();
    iniciarLoopMarketingPainel().catch(console.error);

    document.getElementById('btnAtualizarClientes')?.addEventListener('click', carregarClientes);
    document.getElementById('btnNovoCliente')?.addEventListener('click', () => abrirModalCliente({ modo: 'new', cliente: null }));
    document.getElementById('inputBuscaClientes')?.addEventListener('input', () => renderTabelaClientes());

    document.addEventListener('click', async (e) => {
      const btnEdit = e.target.closest('.btnEditarCliente');
      const btnDel = e.target.closest('.btnExcluirCliente');

      if (btnEdit) {
        const id = btnEdit.getAttribute('data-id');
        const cli = clientesCache.find(x => String(x.ID) === String(id));
        if (!cli) return;
        abrirModalCliente({ modo: 'edit', cliente: cli });
      }

      if (btnDel) {
        const id = btnDel.getAttribute('data-id');
        if (!confirm('Desativar este cliente?')) return;
        try {
          await apiSend(`/api/clientes/${encodeURIComponent(id)}`, 'DELETE');
          await carregarClientes();
        } catch (err) {
          alert(err?.message || 'Erro ao desativar.');
        }
      }
    });


  });
})();



function fmtDataHora(v) {
  if (v == null) return '';
  const s = String(v);
  const semZ = s.endsWith('Z') ? s.slice(0, -1) : s;
  const d = new Date(semZ);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function fmtDataHoraCompleta(v) {
  if (v == null) return '';
  const s = String(v);
  const semZ = s.endsWith('Z') ? s.slice(0, -1) : s;
  const d = new Date(semZ);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString('pt-BR');
}


function RemoverModalDetalheAgendamento() {
  document.getElementById('agDetalheOverlay')?.remove();
  document.getElementById('agDetalheModal')?.remove();
}

function AbrirModalDetalheAgendamento(item) {
  RemoverModalDetalheAgendamento();

  const overlay = document.createElement('div');
  overlay.id = 'agDetalheOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'agDetalheModal';
  modal.className = 'fixed inset-0 z-[100]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  modal.innerHTML = `
    <div class="w-full h-full flex items-start justify-center p-4 md:p-8">
      <div class="w-full max-w-xl mx-auto px-4 sm:px-6">
        <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-semibold text-foreground">Detalhes do agendamento</h3>
            </div>
            <button id="btnFecharAgDetalhe" type="button"
              class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
              aria-label="Fechar" title="Fechar">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="px-6 py-6 space-y-2 text-sm">
            <div><span class="text-muted-foreground">Sala:</span> <span class="font-semibold text-foreground">${item.sala}</span></div>
            <div><span class="text-muted-foreground">Início:</span> <span class="font-semibold text-foreground">${fmtDataHoraCompleta(item.inicio)}</span></div>
            <div><span class="text-muted-foreground">Fim:</span> <span class="font-semibold text-foreground">${fmtDataHoraCompleta(item.fim)}</span></div>
            <div><span class="text-muted-foreground">Motivo:</span> <span class="font-semibold text-foreground">${item.motivo || '(não informado)'}</span></div>
            <div><span class="text-muted-foreground">Agendado por:</span> <span class="font-semibold text-foreground">${item.usuario_agendamento || '(não informado)'}</span></div>
            <div><span class="text-muted-foreground">Registro:</span> <span class="font-semibold text-foreground">${fmtDataHoraCompleta(item.data_agendamento)}</span></div>

            <div class="pt-4">
              <button id="btnOkAgDetalhe" type="button"
                class="w-full rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const fechar = () => RemoverModalDetalheAgendamento();
  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharAgDetalhe')?.addEventListener('click', fechar);
  document.getElementById('btnOkAgDetalhe')?.addEventListener('click', fechar);
}

async function CarregarResumoDoDia() {
  const lista = document.getElementById('resumoDiaLista');
  const vazio = document.getElementById('resumoDiaVazio');
  const calendar = document.getElementById('calendarInput');

  if (!lista || !vazio) return;

  const API_BASE = sessionStorage.getItem('api_base') || '';
  if (!API_BASE) {
    vazio.textContent = 'API base não configurada.';
    vazio.classList.remove('hidden');
    return;
  }

  const data = calendar?.value || ''; // YYYY-MM-DD
  const url = `${API_BASE}/api/agendamentos/sala/dia?data=${encodeURIComponent(data)}`;

  const resp = await fetch(url, { method: 'GET' });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    vazio.textContent = json?.message || 'Erro ao carregar resumo do dia.';
    vazio.classList.remove('hidden');
    return;
  }

  const items = json?.items || [];
  lista.innerHTML = '';

  if (!items.length) {
    vazio.textContent = 'Nenhum evento cadastrado.';
    vazio.classList.remove('hidden');
    return;
  }

  vazio.classList.add('hidden');

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between gap-2 rounded-xl border border-border bg-white/60 hover:bg-white/80 transition-all px-3 py-2';

    // esquerda (clicável)
    const left = document.createElement('button');
    left.type = 'button';
    left.className = 'flex-1 text-left min-w-0';
    left.innerHTML = `
      <div class="flex items-center justify-between gap-2">
        <div class="min-w-0">
          <div class="text-sm font-semibold truncate">${item.sala}</div>
          <div class="text-xs text-muted-foreground truncate">
            ${fmtDataHora(item.inicio)} - ${fmtDataHora(item.fim)}
          </div>
        </div>
      </div>
    `;
    left.addEventListener('click', () => AbrirModalDetalheAgendamento(item));

    // direita (ícone excluir)
    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'w-9 h-9 rounded-xl border border-border bg-white/60 hover:bg-destructive hover:text-white transition-all flex items-center justify-center shrink-0';
    del.title = 'Excluir agendamento';
    del.innerHTML = `<i class="fas fa-trash"></i>`;
    del.addEventListener('click', async (ev) => {
      ev.stopPropagation();

      if (!confirm('Deseja excluir (cancelar) este agendamento?')) return;

      const usuario = sessionStorage.getItem('usuario') || '';
      if (!usuario) {
        alert('Usuário não identificado. Faça login novamente.');
        return;
      }

      const delResp = await fetch(`${API_BASE}/api/cancelar-agendamentos/sala/${item.id}`, {
        method: 'DELETE',
        headers: {
          'x-usuario': usuario
        }
      });

      const delJson = await delResp.json().catch(() => ({}));

      if (!delResp.ok) {
        alert(delJson?.message || 'Erro ao excluir agendamento.');
        return;
      }

      alert(delJson?.message || 'Agendamento cancelado com sucesso.');
      await CarregarResumoDoDia();
    });

    row.appendChild(left);
    row.appendChild(del);
    lista.appendChild(row);
  });
}

// ===============================
// GESTÃO DE USUÁRIOS (completo) - ATUALIZADO API_BASE
// ===============================

function getApiBase() {
  const API_BASE = sessionStorage.getItem('api_base') || '';
  if (!API_BASE) throw new Error('API_BASE não configurada (sessionStorage api_base).');
  return API_BASE.replace(/\/+$/, '');
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function titleCaseNome(nome) {
  return (nome || '')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

function normalizarEmail(email) {
  return (email || '').trim().toLowerCase();
}

function somenteNumeros(v) {
  return (v || '').toString().replace(/\D+/g, '');
}

function formatarCelularBR(raw) {
  const n = somenteNumeros(raw);
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 3)}${n.slice(3, 7)}-${n.slice(7)}`;
  return n;
}

function setGestaoUsuariosErro(msg) {
  const el = document.getElementById('gestaoUsuariosErro');
  if (!el) return;
  if (!msg) {
    el.textContent = '';
    el.classList.add('hidden');
    return;
  }
  el.textContent = msg;
  el.classList.remove('hidden');
}

// Cores do status: Ativo = verde, Desativado = vermelho, outros = azul
function statusBadge(status) {
  const s = (status || '').trim();
  let cls = 'bg-info/15 text-info border-info/20';
  if (s === 'Ativo') cls = 'bg-success/15 text-success border-success/20';
  else if (s === 'Desativado') cls = 'bg-destructive/15 text-destructive border-destructive/20';

  return `<span class="inline-flex items-center px-3 py-1 rounded-full border ${cls} text-xs font-semibold">${escapeHtml(s || '—')}</span>`;
}

function rowUsuario(u) {
  return `
    <tr>
      <td class="px-4 py-3 font-medium">${escapeHtml(u.nome ?? '')}</td>
      <td class="px-4 py-3 text-muted-foreground">${escapeHtml(u.email ?? '')}</td>
      <td class="px-4 py-3">${escapeHtml(u.setor ?? '')}</td>
      <td class="px-4 py-3">${statusBadge(u.status)}</td>
      <td class="px-4 py-3">
        <div class="flex justify-end gap-2">
          <button
            class="btnEditUsuario w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all"
            data-id="${escapeHtml(u.id)}"
            aria-label="Editar usuário"
            title="Editar usuário"
          >
            <i class="fas fa-pen" aria-hidden="true"></i>
          </button>

          <button
            class="btnDelUsuario w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all"
            data-id="${escapeHtml(u.id)}"
            aria-label="Excluir usuário"
            title="Excluir usuário"
          >
            <i class="fas fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

async function apiGet(path) {
  const base = getApiBase();
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const r = await fetch(url);
  const txt = await r.text();

  let data = null;
  try { data = txt ? JSON.parse(txt) : null; } catch { data = null; }

  if (!r.ok) {
    const msg = data?.message || data?.error || txt || `HTTP ${r.status}`;
    throw new Error(msg);
  }

  return data;
}

async function apiSend(path, method, body) {
  const base = getApiBase();
  const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;

  const r = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const txt = await r.text();

  let data = null;
  try { data = txt ? JSON.parse(txt) : null; } catch { data = null; }

  if (!r.ok) {
    const msg = data?.message || data?.error || txt || `HTTP ${r.status}`;
    throw new Error(msg);
  }

  return data;
}

function showPage(pageId) {
  document.querySelectorAll('.page-content').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(pageId);
  if (sec) sec.classList.add('active');
}

// caches para selects
let cachePerfisGestao = [];
let cacheSetoresGestao = [];

async function carregarGestaoUsuarios() {
  setGestaoUsuariosErro('');
  showPage('user-management');

  const [usuariosResp, perfisResp, setoresResp] = await Promise.all([
    apiGet('/api/gestao-usuarios'),
    apiGet('/api/gestao-usuarios-perfis'),
    apiGet('/api/gestao-usuarios-setores'),
  ]);

  const usuarios = Array.isArray(usuariosResp?.items) ? usuariosResp.items : [];
  const perfis = Array.isArray(perfisResp?.items) ? perfisResp.items : [];
  const setores = Array.isArray(setoresResp?.items) ? setoresResp.items : [];

  cachePerfisGestao = perfis;
  cacheSetoresGestao = setores;

  const tbody = document.getElementById('tbodyGestaoUsuarios');
  if (!tbody) return;

  if (!usuarios.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-6 text-sm text-muted-foreground">Nenhum usuário cadastrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = usuarios.map(rowUsuario).join('');
}


// ===== Modal (criar/editar) =====
function removerModalGestaoUsuario() {
  document.getElementById('gestaoUsuarioOverlay')?.remove();
  document.getElementById('gestaoUsuarioModal')?.remove();
}

function optionsFromRows(rows, selectedValue) {
  const sel = (selectedValue || '').toString().trim();

  const opts = (rows || []).map(r => {
    const nome = (r.NOME ?? r.nome ?? '').toString().trim();
    if (!nome) return '';
    const selected = (nome === sel) ? 'selected' : '';
    return `<option value="${escapeHtml(nome)}" ${selected}>${escapeHtml(nome)}</option>`;
  }).join('');

  return `<option value="" disabled ${sel ? '' : 'selected'}>Selecione...</option>` + opts;
}

function abrirModalGestaoUsuario({ modo, usuario }) {
  removerModalGestaoUsuario();

  const overlay = document.createElement('div');
  overlay.id = 'gestaoUsuarioOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'gestaoUsuarioModal';
  modal.className = 'fixed inset-0 z-[100]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  const isEdit = modo === 'edit';
  const u = usuario || {};

  modal.innerHTML = `
    <div class="w-full h-full flex items-start justify-center p-4 md:p-8 overflow-auto">
      <div class="w-full max-w-2xl mx-auto">
        <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-semibold text-foreground">${isEdit ? 'Editar usuário' : 'Novo usuário'}</h3>
              <p class="text-sm text-muted-foreground">Preencha os dados abaixo</p>
            </div>
            <button id="btnFecharGestaoUsuario" type="button"
              class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
              aria-label="Fechar" title="Fechar">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>

          <form id="formGestaoUsuario" class="px-6 py-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium">Nome</label>
                <input id="guNome" type="text" required
                  class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(u.NOME ?? u.nome ?? '')}" />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Email</label>
                <input id="guEmail" type="email" required
                  class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(u.EMAIL ?? u.email ?? '')}" />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Telefone</label>
                <input id="guTelefone" type="text"
                  class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(formatarCelularBR(u.TELEFONE ?? u.telefone ?? ''))}"
                  placeholder="(77) 9XXXX-XXXX" />
                <p class="text-xs text-muted-foreground">Será salvo apenas com números.</p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Status</label>
                <select id="guStatus" required
                  class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30">
                  ${['Ativo', 'Desativado'].map(s => {
                    const cur = (u.STATUS ?? u.status ?? '').toString().trim();
                    const selected = (cur ? (cur === s) : (s === 'Ativo')) ? 'selected' : '';
                    return `<option value="${escapeHtml(s)}" ${selected}>${escapeHtml(s)}</option>`;
                  }).join('')}
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Perfil</label>
                <select id="guPerfil" required
                  class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30">
                  ${optionsFromRows(cachePerfisGestao, (u.PERFIL ?? u.perfil ?? ''))}
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium">Setor</label>
                <div class="flex gap-2">
                  <select id="guSetor" required
                    class="flex-1 rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30">
                    ${optionsFromRows(cacheSetoresGestao, (u.SETOR ?? u.setor ?? ''))}
                  </select>

                  <button id="btnAddSetor" type="button"
                    class="w-12 h-12 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all flex items-center justify-center"
                    aria-label="Adicionar setor" title="Adicionar setor">
                    <i class="fas fa-plus" aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              ${isEdit ? '' : `
              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium">Senha</label>
                <input id="guSenha" type="password" minlength="6" required
                  class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Mínimo 6 caracteres" />
                <p class="text-xs text-muted-foreground">Será gravada com hash no banco.</p>
              </div>
              `}
            </div>

            <p id="guErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

            <div class="pt-2 flex flex-col sm:flex-row gap-3">
              <button id="btnSalvarGU" type="submit"
                class="sm:flex-1 rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                Salvar
              </button>
              <button id="btnCancelarGU" type="button"
                class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const setErr = (msg) => {
    const el = document.getElementById('guErro');
    if (!el) return;
    if (!msg) { el.textContent = ''; el.classList.add('hidden'); return; }
    el.textContent = msg;
    el.classList.remove('hidden');
  };

  const fechar = () => removerModalGestaoUsuario();

  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharGestaoUsuario')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarGU')?.addEventListener('click', fechar);

  const tel = document.getElementById('guTelefone');
  tel?.addEventListener('input', () => { tel.value = formatarCelularBR(tel.value); });

  document.getElementById('btnAddSetor')?.addEventListener('click', async () => {
    const nome = prompt('Nome do setor:');
    if (!nome) return;
    try {
      await apiSend('/api/gestao-usuarios-setores', 'POST', { nome });
      const setoresResp = await apiGet('/api/gestao-usuarios-setores');
      cacheSetoresGestao = Array.isArray(setoresResp?.items) ? setoresResp.items : [];
      const sel = document.getElementById('guSetor');
      if (sel) sel.innerHTML = optionsFromRows(cacheSetoresGestao, titleCaseNome(nome));
    } catch (err) {
      alert('Erro ao adicionar setor: ' + (err?.message || err));
    }
  });

  document.getElementById('formGestaoUsuario')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setErr('');

    const nome = titleCaseNome(document.getElementById('guNome')?.value);
    const email = normalizarEmail(document.getElementById('guEmail')?.value);
    const telefone = somenteNumeros(document.getElementById('guTelefone')?.value);
    const perfil = (document.getElementById('guPerfil')?.value || '').trim();
    const setor = (document.getElementById('guSetor')?.value || '').trim();
    const status = (document.getElementById('guStatus')?.value || '').trim();

    if (!nome || !email || !perfil || !setor || !status) {
      setErr('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const btn = document.getElementById('btnSalvarGU');
      if (btn) { btn.disabled = true; btn.classList.add('opacity-70'); }

      if (!isEdit) {
        const senha = (document.getElementById('guSenha')?.value || '').toString();
        if (!senha || senha.length < 6) { setErr('Senha inválida (mínimo 6).'); return; }

        await apiSend('/api/gestao-usuarios-adicionar', 'POST', {
          nome, email, senha, telefone, perfil, setor, status
        });
      } else {
        const userId = (u.ID ?? u.id);
          await apiSend(`/api/gestao-usuarios/${userId}`, 'PUT', {
          nome, email, telefone, perfil, setor, status
        });
      }

      removerModalGestaoUsuario();
      await carregarGestaoUsuarios();
    } catch (err) {
      setErr(err?.message || 'Erro ao salvar.');
    } finally {
      const btn = document.getElementById('btnSalvarGU');
      if (btn) { btn.disabled = false; btn.classList.remove('opacity-70'); }
    }
  });
}

// ===== LIGAÇÕES (menu / botões / ações tabela) =====

// 1) Quando clicar no menu Gestão Usuários, carrega e renderiza
document.addEventListener('click', (e) => {
  const item = e.target.closest('.menu-item[data-page]');
  if (!item) return;

  const page = item.dataset.page;
  if (page !== 'user-management') return;

  carregarGestaoUsuarios().catch(err => setGestaoUsuariosErro('Erro ao carregar usuários:\n' + (err?.message || err)));
});

// 2) Botão "Novo usuário"
document.addEventListener('click', (e) => {
  const btn = e.target.closest('#btnNovoUsuario');
  if (!btn) return;

  abrirModalGestaoUsuario({ modo: 'new' });
});

// 3) Botões da tabela (editar/excluir)
document.addEventListener('click', async (e) => {
  const btnEdit = e.target.closest('.btnEditUsuario');
  const btnDel = e.target.closest('.btnDelUsuario');

  if (btnEdit) {
    const id = btnEdit.dataset.id;
    try {
      const resp = await apiGet(`/api/gestao-usuarios/${id}`);
      const dados = resp?.item || resp; // fallback se você retornar direto sem wrapper
      abrirModalGestaoUsuario({ modo: 'edit', usuario: dados });
    } catch (err) {
      alert('Erro ao abrir edição: ' + (err?.message || err));
    }
  }

  if (btnDel) {
    const id = btnDel.dataset.id;
    if (!confirm('Confirma excluir este usuário?')) return;
    try {
      await apiSend(`/api/gestao-usuarios/${id}`, 'DELETE');
      await carregarGestaoUsuarios();
    } catch (err) {
      alert('Erro ao excluir: ' + (err?.message || err));
    }
  }
});

function ativarAbaPedidos(nomeAba) {
  const abaDash = document.getElementById('abaPedidosDashboard');
  const abaTab = document.getElementById('abaPedidosTabela');
  const painelDash = document.getElementById('painelPedidosDashboard');
  const painelTab = document.getElementById('painelPedidosTabela');
  const btnNovo = document.getElementById('btnNovoPedido');

  const isTabela = nomeAba === 'tabela';

  // aria-selected
  abaDash?.setAttribute('aria-selected', isTabela ? 'false' : 'true');
  abaTab?.setAttribute('aria-selected', isTabela ? 'true' : 'false');

  // classes (estilo ativo/inativo)
  if (abaDash && abaTab) {
    if (!isTabela) {
      abaDash.className = "px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white shadow text-foreground";
      abaTab.className  = "px-4 py-2 rounded-lg text-sm font-medium transition-all text-muted-foreground hover:text-foreground";
    } else {
      abaTab.className  = "px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white shadow text-foreground";
      abaDash.className = "px-4 py-2 rounded-lg text-sm font-medium transition-all text-muted-foreground hover:text-foreground";
    }
  }

  // painéis
  if (painelDash) painelDash.hidden = isTabela;
  if (painelTab)  painelTab.hidden  = !isTabela;

  // botão novo pedido (só na tabela)
  if (btnNovo) btnNovo.classList.toggle('hidden', !isTabela);
}

document.getElementById('abaPedidosDashboard')?.addEventListener('click', () => ativarAbaPedidos('dashboard'));
document.getElementById('abaPedidosTabela')?.addEventListener('click', () => ativarAbaPedidos('tabela'));

// estado inicial
ativarAbaPedidos('dashboard');

function mostrarMsgMarketing(msg) {
  const el = document.getElementById('marketingMsg');
  if (!el) return;
  if (!msg) { el.classList.add('hidden'); el.textContent = ''; return; }
  el.textContent = msg;
  el.classList.remove('hidden');
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// Normaliza API base e garante URL absoluta para links/imagens
function getApiBase() {
  const raw = sessionStorage.getItem('api_base') || sessionStorage.getItem('apibase');
  if (!raw) throw new Error('API base não configurada.');

  // remove barra final para não duplicar
  return String(raw).replace(/\/+$/, '');
}

// Converte "/publicidade/..." em "https://seuapp.up.railway.app/publicidade/..."
function absUrlFromApi(relOrAbs, apiBase) {
  const s = String(relOrAbs || '').trim();
  if (!s) return '';

  // Se já for absoluta (http/https), mantém
  if (/^https?:\/\//i.test(s)) return s;

  // Resolve relativo usando URL API (padrão correto)
  return new URL(s, apiBase + '/').href;
}

async function listarImagensMarketing() {
  const APIBASE = getApiBase();

  mostrarMsgMarketing('Carregando imagens...');
  const r = await fetch(`${APIBASE}/api/marketing/imagens`, { method: 'GET' });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || 'Erro ao listar imagens.');

  const itens = Array.isArray(data.items) ? data.items : [];

  const grid = document.getElementById('gridMarketing');
  const vazio = document.getElementById('marketingVazio');
  if (!grid || !vazio) return;

  grid.innerHTML = '';
  if (!itens.length) {
    vazio.classList.remove('hidden');
    mostrarMsgMarketing('');
    return;
  }
  vazio.classList.add('hidden');

  grid.innerHTML = itens.map((it) => {
    // it: { name, url } (url vem relativa da API)
    const urlAbs = absUrlFromApi(it.url, APIBASE);

    return `
      <div class="rounded-2xl border border-border bg-white/60 overflow-hidden shadow-sm">
        <button type="button"
          class="w-full aspect-[4/3] bg-muted/30 overflow-hidden"
          title="Visualizar"
          onclick="abrirImagemMarketing('${escapeHtml(urlAbs)}')">
          <img src="${escapeHtml(urlAbs)}" alt="${escapeHtml(it.name)}" class="w-full h-full object-cover" />
        </button>

        <div class="p-3 flex items-center justify-between gap-2">
          <div class="min-w-0">
            <div class="text-sm font-semibold truncate">${escapeHtml(it.name)}</div>
          </div>

          <button type="button"
            class="w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-destructive hover:text-white transition-all
                   flex items-center justify-center shrink-0"
            title="Remover"
            onclick="removerImagemMarketing('${escapeHtml(it.name)}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  mostrarMsgMarketing('');
}

// visualização (nova aba) — agora recebe URL absoluta
function abrirImagemMarketing(urlAbs) {
  if (!urlAbs) return;
  window.open(urlAbs, '_blank', 'noopener,noreferrer');
}

async function enviarImagensMarketing(files) {
  const APIBASE = getApiBase();
  if (!files || !files.length) return;

  const fd = new FormData();
  for (const f of files) fd.append('files', f);

  mostrarMsgMarketing('Enviando...');
  const r = await fetch(`${APIBASE}/api/marketing/imagens`, { method: 'POST', body: fd });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || 'Erro ao enviar imagens.');

  mostrarMsgMarketing('Enviado com sucesso.');
  await listarImagensMarketing();
}

async function removerImagemMarketing(nomeArquivo) {
  const APIBASE = getApiBase();
  if (!nomeArquivo) return;

  if (!confirm(`Remover a imagem "${nomeArquivo}"?`)) return;

  mostrarMsgMarketing('Removendo...');
  const r = await fetch(`${APIBASE}/api/marketing/imagens/${encodeURIComponent(nomeArquivo)}`, { method: 'DELETE' });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || 'Erro ao remover imagem.');

  await listarImagensMarketing();
  mostrarMsgMarketing('');
}

document.getElementById('btnAtualizarMarketing')?.addEventListener('click', () => {
  listarImagensMarketing().catch(e => alert(e.message || e));
});

document.getElementById('inputImagensMarketing')?.addEventListener('change', async (e) => {
  try {
    const files = e.target.files ? Array.from(e.target.files) : [];
    await enviarImagensMarketing(files);
  } catch (err) {
    alert(err?.message || err);
  } finally {
    e.target.value = '';
  }
});

function getApiBase() {
  const raw = sessionStorage.getItem('api_base') || sessionStorage.getItem('apibase');
  if (!raw) throw new Error('API base não configurada.');
  return String(raw).replace(/\/+$/, '');
}

function absUrlFromApi(relOrAbs, apiBase) {
  const s = String(relOrAbs || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  return new URL(s, apiBase + '/').href; // resolve relativo corretamente [web:694]
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
}

let marketingLoopTimer = null;
let marketingLoopIndex = 0;
let marketingLoopUrls = [];
let marketingLoopLastFetchMs = 0;

async function fetchMarketingUrls() {
  const APIBASE = getApiBase();
  const r = await fetch(`${APIBASE}/api/marketing/imagens`, { method: 'GET' });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || 'Erro ao listar imagens.');

  const itens = Array.isArray(data.items) ? data.items : [];
  return itens
    .map(it => absUrlFromApi(it.url, APIBASE))
    .filter(Boolean);
}

async function iniciarLoopMarketingPainel({
  imgId = 'painelMarketingImg',
  fallbackSrc = 'imagens/PaginaPrincipal.jpg',
  intervalMs = 20000,
  refreshListEveryMs = 60000,
} = {}) {
  const el = document.getElementById(imgId);
  if (!el) return;

  // Estado: URL que está aparecendo AGORA (para clique)
  el.dataset.currentUrl = el.src || fallbackSrc;

  // Clique: abre a imagem atual em nova aba
  el.addEventListener('click', () => {
    const url = el.dataset.currentUrl || el.src;
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  async function ensureListFresh() {
    const now = Date.now();
    if (now - marketingLoopLastFetchMs < refreshListEveryMs && marketingLoopUrls.length) return;

    marketingLoopLastFetchMs = now;
    try {
      marketingLoopUrls = await fetchMarketingUrls();
      marketingLoopIndex = 0;
    } catch {
      marketingLoopUrls = [];
    }
  }

  async function tick() {
    await ensureListFresh();

    // Sem imagens => fica na fixa
    if (!marketingLoopUrls.length) {
      el.style.opacity = '1';
      el.src = fallbackSrc;
      el.dataset.currentUrl = fallbackSrc; // clique abre a fixa
      return;
    }

    const url = marketingLoopUrls[marketingLoopIndex % marketingLoopUrls.length];
    marketingLoopIndex++;

    try {
      await preloadImage(url);

      // fade suave sem mexer no tamanho do quadro
      el.style.opacity = '0';
      setTimeout(() => {
        el.src = url;
        el.dataset.currentUrl = url; // clique abre a atual
        el.style.opacity = '1';
      }, 150);
    } catch {
      // se falhar, tenta próxima na próxima rodada
    }
  }

  await tick();

  if (marketingLoopTimer) clearInterval(marketingLoopTimer);
  marketingLoopTimer = setInterval(tick, intervalMs); // troca a cada 10s [web:705]
}


// =====================
// CLIENTES + FILIAIS (MySQL API)
// =====================
let clientesCache = [];
let filiaisForm = [];

function setMsgClientes(msg) {
  const el = document.getElementById('clientesMsg');
  if (!el) return;
  if (!msg) { el.classList.add('hidden'); el.textContent = ''; return; }
  el.textContent = msg;
  el.classList.remove('hidden');
}

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function somenteNumeros(v) {
  return (v ?? '').toString().replace(/\D+/g, '');
}

function getFiltroClientes() {
  const qRaw = (document.getElementById('inputBuscaClientes')?.value || '').trim();
  const q = qRaw.toLowerCase();
  if (!q) return clientesCache;

  const qNum = somenteNumeros(qRaw);

  return clientesCache.filter(c => {
    const razao = String(c.RAZAOSOCIAL ?? c.RAZAO_SOCIAL ?? '').toLowerCase();
    const doc = String(c.DOCUMENTO ?? '').toLowerCase();

    return razao.includes(q) || (qNum && doc.includes(qNum));
  });
}

async function carregarClientes() {
  try {
    setMsgClientes('Carregando clientes...');
    const q = (document.getElementById('inputBuscaClientes')?.value || '').trim();
    const data = await apiGet(`/api/clientes?q=${encodeURIComponent(q)}`);
    clientesCache = Array.isArray(data?.items) ? data.items : [];
    renderTabelaClientes();
    setMsgClientes('');
  } catch (err) {
    console.error(err);
    setMsgClientes(err?.message || 'Erro ao carregar clientes.');
  }
}

function somenteDigitos(v) {
  return String(v ?? '').replace(/\D/g, '');
}

function formatarTelefoneBR(v) {
  const d = somenteDigitos(v);

  // Se vier com DDI 55 na frente, remove (bem comum em cadastros)
  const num = d.startsWith('55') && d.length > 11 ? d.slice(2) : d;

  // Esperado: 10 (fixo) ou 11 (celular) com DDD
  if (num.length === 11) {
    // (xx) xxxxx-xxxx
    return num.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (num.length === 10) {
    // (xx) xxxx-xxxx
    return num.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  // Se não bater (ex.: ramal, número curto, etc.), devolve o original
  return String(v ?? '');
}

// CPF (11) => 000.000.000-00 | CNPJ (14) => 00.000.000/0000-00
function formatarCpfCnpj(v) {
  const d = somenteDigitos(v);

  if (d.length === 11) {
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (d.length === 14) {
    return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return String(v ?? '');
}

function tipoDoc(c) {
  const d = somenteDigitos(c?.DOCUMENTO);
  if (d.length === 11) return 'CPF';
  if (d.length === 14) return 'CNPJ';
  return '';
}

function renderTabelaClientes() {
  const tbody = document.getElementById('tbodyClientes');
  if (!tbody) return;

  const itens = getFiltroClientes();

  if (!itens.length) {
    tbody.innerHTML = `
      <tr>
        <td class="px-4 py-6 text-sm text-muted-foreground" colspan="5">Nenhum cliente encontrado.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = itens.map(c => {
    const cidadeUf = `${c.CIDADE || '-'} / ${c.UF || '-'}`;
    const contatoNome = c.CONTATO_NOME ? escapeHtml(c.CONTATO_NOME) : '-';
    const telFmt = formatarTelefoneBR(c.CONTATO_TELEFONE);
    const docFmt = c.DOCUMENTO ? formatarCpfCnpj(c.DOCUMENTO) : '';

    const tipo = tipoDoc(c);

    // escolha dos ícones
    const iconClass = tipo === 'CNPJ'
      ? 'fas fa-building'     // empresa
      : tipo === 'CPF'
        ? 'fas fa-id-card'    // pessoa
        : 'fas fa-file-lines';// fallback (se tiver FA6) ou troque por outro

    const badge = tipo
      ? `<span class="text-[10px] px-2 py-0.5 rounded-full border border-border bg-white/60 text-muted-foreground">${tipo}</span>`
      : '';

    return `
      <tr class="hover:bg-white/40 transition-all">
        <td class="px-4 py-3 font-medium">
          <div class="flex items-center gap-2">
            <i class="${iconClass} text-muted-foreground" aria-hidden="true"></i>
            <span>${escapeHtml(c.RAZAO_SOCIAL || '')}</span>
            ${badge}
          </div>
        </td>
        <td class="px-4 py-3 text-muted-foreground">${escapeHtml(docFmt)}</td>
        <td class="px-4 py-3">${escapeHtml(cidadeUf)}</td>
        <td class="px-4 py-3">${contatoNome}</td>
        <td class="px-4 py-3">${escapeHtml(telFmt)}</td>
        <td class="px-4 py-3">
          <div class="flex justify-end gap-2">
            <button class="btnEditarCliente w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all"
              data-id="${escapeHtml(c.ID)}" title="Editar">
              <i class="fas fa-pen"></i>
            </button>
            <button class="btnExcluirCliente w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-destructive hover:text-white transition-all"
              data-id="${escapeHtml(c.ID)}" title="Desativar">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ===== Modal Cliente (criado no DOM, igual seu padrão) =====
function removerModalCliente() {
  document.getElementById('clienteOverlay')?.remove();
  document.getElementById('clienteModal')?.remove();
}

async function buscarFiliaisCliente(idCliente) {
  const data = await apiGet(`/api/clientes/${encodeURIComponent(idCliente)}/filiais`);
  return Array.isArray(data?.items) ? data.items : [];
}

function abrirModalCliente({ modo, cliente }) {
  removerModalCliente();

  const overlay = document.createElement('div');
  overlay.id = 'clienteOverlay';
  overlay.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm z-90';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'clienteModal';
  modal.className = 'fixed inset-0 z-100';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  const isEdit = modo === 'edit';

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar flex items-start justify-center p-4 md:p-8">
      <div class="w-full max-w-4xl mx-auto">
        <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-foreground">${isEdit ? 'Editar cliente' : 'Cadastrar cliente'}</h3>
              <p class="text-xs text-muted-foreground">Dados do cliente e filiais</p>
            </div>
            <button id="btnFecharClienteModal" type="button"
              class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
              aria-label="Fechar" title="Fechar">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form id="formClienteModal" class="px-6 py-6 space-y-4 text-sm">
            <input type="hidden" id="cliId" value="${escapeHtml(cliente?.ID || '')}" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-sm font-medium">CNPJ/CPF *</label>
                <input id="cliDocumento" required inputmode="numeric"
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(cliente?.DOCUMENTO || '')}" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">Razão social *</label>
                <input id="cliRazao" required
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(cliente?.RAZAO_SOCIAL || '')}" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium">Grupo econômico</label>
              <input id="cliGrupo"
                class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                value="${escapeHtml(cliente?.GRUPO_ECONOMICO || '')}" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-sm font-medium">UF *</label>
                <select id="cliUF" required
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="" selected disabled>Selecione...</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium">Cidade *</label>
                <select id="cliCidade" required disabled
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="" selected disabled>Selecione a UF primeiro...</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-sm font-medium">Contato</label>
                <input id="cliContato"
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(cliente?.CONTATO_NOME || '')}" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">Telefone</label>
                <input id="cliTelefone"
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(cliente?.CONTATO_TELEFONE || '')}" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-sm font-medium">Email</label>
                <input id="cliEmail" type="email"
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(cliente?.CONTATO_EMAIL || '')}" />
              </div>
              <div class="space-y-1">
                <label class="text-sm font-medium">Cultura principal</label>
                <select id="cliCultura"
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="" ${!cliente?.CULTURA_PRINCIPAL ? 'selected' : ''}>Selecione...</option>
                  <option value="soja" ${cliente?.CULTURA_PRINCIPAL === 'soja' ? 'selected' : ''}>Soja</option>
                  <option value="algodao" ${cliente?.CULTURA_PRINCIPAL === 'algodao' ? 'selected' : ''}>Algodão</option>
                  <option value="forrageira" ${cliente?.CULTURA_PRINCIPAL === 'forrageira' ? 'selected' : ''}>Forrageira</option>
                </select>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium">Hectares estimados</label>
              <input id="cliHectares" type="number" min="0" step="1"
                class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                value="${escapeHtml((cliente?.HECTARES_ESTIMADOS ?? '') + '')}" />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium">Observações</label>
              <textarea id="cliObs" rows="2"
                class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30">${escapeHtml(cliente?.OBSERVACOES || '')}</textarea>
            </div>

            <hr class="border-border" />

            <div class="space-y-3">
              <div class="flex items-center justify-between gap-3 flex-wrap">
                <div class="flex items-center gap-2">
                  <i class="fas fa-code-branch text-muted-foreground"></i>
                  <h4 class="font-semibold text-sm">Filiais</h4>
                </div>
                <button id="btnAddFilial" type="button"
                  class="rounded-xl border border-border bg-white/60 hover:bg-white/90 px-3 py-2 text-sm font-semibold transition-all">
                  <i class="fas fa-plus mr-2"></i>Adicionar filial
                </button>
              </div>

              <div id="filiaisVazio" class="text-sm text-muted-foreground text-center py-2">Nenhuma filial cadastrada</div>
              <div id="boxFiliais" class="space-y-3"></div>
            </div>

            <p id="cliErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

            <div class="flex justify-end gap-3 pt-2">
              <button id="btnCancelarClienteModal" type="button"
                class="rounded-xl border border-border bg-white/60 hover:bg-white/90 px-4 py-2 font-semibold transition-all">
                Cancelar
              </button>
              <button id="btnSalvarClienteModal" type="submit"
                class="rounded-xl bg-primary text-white px-4 py-2 font-semibold hover:opacity-90 transition-all">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const setErr = (msg) => {
    const el = document.getElementById('cliErro');
    if (!el) return;
    if (!msg) { el.textContent = ''; el.classList.add('hidden'); return; }
    el.textContent = msg;
    el.classList.remove('hidden');
  };

  function fechar() { removerModalCliente(); }

  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharClienteModal')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarClienteModal')?.addEventListener('click', fechar);

  // =========================
  // CPF/CNPJ máscara
  // =========================
  function apenasDigitos(s) { return (s ?? '').toString().replace(/\D+/g, ''); }

  function formatCPF(d) {
    const v = apenasDigitos(d).slice(0, 11);
    return v
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  }

  function formatCNPJ(d) {
    const v = apenasDigitos(d).slice(0, 14);
    return v
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
      .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
  }

  function formatDocAuto(raw) {
    const d = apenasDigitos(raw);
    if (d.length <= 11) return formatCPF(d);
    return formatCNPJ(d);
  }

  function maskDocumentoInput(inp) {
    const before = inp.value;
    const after = formatDocAuto(before);
    if (before !== after) inp.value = after;
  }

  const inpDoc = document.getElementById('cliDocumento');
  inpDoc?.addEventListener('input', () => maskDocumentoInput(inpDoc));
  inpDoc?.addEventListener('blur', () => maskDocumentoInput(inpDoc));

  // =========================
  // IBGE UF/Cidade (cache)
  // =========================
  const IBGE_BASE = 'https://servicodados.ibge.gov.br/api/v1/localidades'; // [web:805]
  let cacheUFs = null;
  const cacheMunicipiosPorUF = new Map();

  async function ibgeGetJson(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`IBGE falhou (HTTP ${r.status})`);
    return await r.json();
  }

  async function garantirUFsCache() {
    if (cacheUFs) return cacheUFs;
    const estados = await ibgeGetJson(`${IBGE_BASE}/estados?orderBy=nome`); // [web:805]
    cacheUFs = estados.map(e => ({ sigla: e.sigla, nome: e.nome }));
    return cacheUFs;
  }

  async function getMunicipiosPorUF(uf) {
    const ufUp = (uf || '').toUpperCase().trim();
    if (!ufUp) return [];
    if (cacheMunicipiosPorUF.has(ufUp)) return cacheMunicipiosPorUF.get(ufUp);

    const municipios = await ibgeGetJson(`${IBGE_BASE}/estados/${encodeURIComponent(ufUp)}/municipios?orderBy=nome`); // [web:805]
    const cidades = municipios.map(m => m.nome);
    cacheMunicipiosPorUF.set(ufUp, cidades);
    return cidades;
  }

  function preencherSelectUF(selectEl, ufSelecionada) {
    const atual = (ufSelecionada || '').toUpperCase().trim();
    selectEl.innerHTML =
      `<option value="" disabled ${!atual ? 'selected' : ''}>Selecione...</option>` +
      (cacheUFs || []).map(e => `
        <option value="${escapeHtml(e.sigla)}" ${e.sigla === atual ? 'selected' : ''}>
          ${escapeHtml(`${e.sigla} - ${e.nome}`)}
        </option>
      `).join('');
  }

  function preencherSelectCidade(selectEl, cidades, cidadeSelecionada) {
    const atual = (cidadeSelecionada || '').toString().trim();
    selectEl.innerHTML =
      `<option value="" disabled ${!atual ? 'selected' : ''}>Selecione...</option>` +
      cidades.map(nome => `
        <option value="${escapeHtml(nome)}" ${nome === atual ? 'selected' : ''}>
          ${escapeHtml(nome)}
        </option>
      `).join('');
  }

  async function carregarUFsSelectCliente(ufSelecionada) {
    await garantirUFsCache();
    const selUF = document.getElementById('cliUF');
    if (!selUF) return;
    preencherSelectUF(selUF, ufSelecionada);
  }

  async function carregarCidadesDaUF(uf, cidadeSelecionada) {
    const selCidade = document.getElementById('cliCidade');
    if (!selCidade) return;

    const ufUp = (uf || '').toUpperCase().trim();
    if (!ufUp) {
      selCidade.disabled = true;
      selCidade.innerHTML = `<option value="" selected disabled>Selecione a UF primeiro...</option>`;
      return;
    }

    selCidade.disabled = true;
    selCidade.innerHTML = `<option value="" selected disabled>Carregando cidades...</option>`;

    const cidades = await getMunicipiosPorUF(ufUp);
    preencherSelectCidade(selCidade, cidades, cidadeSelecionada);
    selCidade.disabled = false;
  }

  async function inicializarUfCidade(cli) {
    const ufInicial = (cli?.UF || '').toString().trim().toUpperCase();
    const cidadeInicial = (cli?.CIDADE || '').toString().trim();

    await carregarUFsSelectCliente(ufInicial);

    if (ufInicial) await carregarCidadesDaUF(ufInicial, cidadeInicial);
    else await carregarCidadesDaUF('', '');

    document.getElementById('cliUF')?.addEventListener('change', async (e) => {
      await carregarCidadesDaUF(e.target.value, '');
    });
  }

  // =========================
  // CNPJ -> BrasilAPI -> confirmação
  // =========================
  function removerModalConfirmCNPJ() {
    document.getElementById('cnpjFillOverlay')?.remove();
    document.getElementById('cnpjFillModal')?.remove();
  }

  function abrirModalConfirmCNPJ({ titulo, html, onConfirm }) {
    removerModalConfirmCNPJ();

    const ov = document.createElement('div');
    ov.id = 'cnpjFillOverlay';
    ov.className = 'fixed inset-0 bg-black/35 backdrop-blur-sm z-[110]';
    document.body.appendChild(ov);

    const m = document.createElement('div');
    m.id = 'cnpjFillModal';
    m.className = 'fixed inset-0 z-[120] flex items-start justify-center p-4 md:p-8';
    m.innerHTML = `
      <div class="w-full max-w-xl glass rounded-2xl shadow-2xl border border-border overflow-hidden">
        <div class="px-5 py-4 border-b border-border">
          <h3 class="text-lg font-semibold">${escapeHtml(titulo || 'Encontramos dados para este CNPJ')}</h3>
          <p class="text-sm text-muted-foreground">Deseja preencher automaticamente? Você ainda poderá editar depois.</p>
        </div>
        <div class="px-5 py-4 text-sm space-y-3">
          <div class="rounded-xl border border-border bg-white/50 p-4">
            ${html || ''}
          </div>
          <div class="flex gap-2 justify-end">
            <button id="btnCnpjFillCancelar" type="button"
              class="rounded-xl border border-border bg-white/60 hover:bg-white/90 px-4 py-2 font-semibold transition-all">
              Não
            </button>
            <button id="btnCnpjFillOk" type="button"
              class="rounded-xl bg-primary text-white px-4 py-2 font-semibold hover:opacity-90 transition-all">
              Sim, preencher
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(m);

    const fechar = () => removerModalConfirmCNPJ();
    ov.addEventListener('click', fechar);
    document.getElementById('btnCnpjFillCancelar')?.addEventListener('click', fechar);
    document.getElementById('btnCnpjFillOk')?.addEventListener('click', async () => {
      try { await onConfirm?.(); } finally { fechar(); }
    });
  }

  function setIfEmpty(inputId, value) {
    const el = document.getElementById(inputId);
    if (!el) return;
    const cur = (el.value || '').trim();
    if (cur) return;
    el.value = value ?? '';
  }

  let ultimoCnpjConsultado = null;

  async function consultarCNPJ_BrasilAPI(cnpj14) {
    const url = `https://brasilapi.com.br/api/cnpj/v1/${encodeURIComponent(cnpj14)}`; // [web:848]
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Consulta CNPJ falhou (HTTP ${r.status})`);
    return await r.json();
  }

  async function tentarAutopreencherPorCNPJ() {
    const doc = apenasDigitos(document.getElementById('cliDocumento')?.value);
    if (doc.length !== 14) return;

    if (ultimoCnpjConsultado === doc) return;
    ultimoCnpjConsultado = doc;

    let dados;
    try {
      dados = await consultarCNPJ_BrasilAPI(doc); // [web:848]
    } catch (e) {
      console.warn('CNPJ lookup:', e?.message || e);
      return;
    }

    const nome = dados?.razao_social || dados?.nome || '';
    const fantasia = dados?.nome_fantasia || '';
    const municipio = dados?.municipio || '';
    const uf = (dados?.uf || '').toUpperCase();
    const email = dados?.email || '';
    const telefone = dados?.ddd_telefone_1 || dados?.telefone || '';

    const preview = `
      <div><span class="text-muted-foreground">Razão Social:</span> <span class="font-semibold">${escapeHtml(nome || '-')}</span></div>
      <div><span class="text-muted-foreground">Fantasia:</span> <span class="font-semibold">${escapeHtml(fantasia || '-')}</span></div>
      <div><span class="text-muted-foreground">Cidade/UF:</span> <span class="font-semibold">${escapeHtml(municipio || '-')}/${escapeHtml(uf || '-')}</span></div>
      <div><span class="text-muted-foreground">Email:</span> <span class="font-semibold">${escapeHtml(email || '-')}</span></div>
      <div><span class="text-muted-foreground">Telefone:</span> <span class="font-semibold">${escapeHtml(telefone || '-')}</span></div>
    `;

    abrirModalConfirmCNPJ({
      titulo: 'CNPJ encontrado',
      html: preview,
      onConfirm: async () => {
        setIfEmpty('cliRazao', nome);
        setIfEmpty('cliEmail', email);
        setIfEmpty('cliTelefone', telefone);

        const selUF = document.getElementById('cliUF');
        if (selUF && uf) {
          selUF.value = uf;
          await carregarCidadesDaUF(uf, municipio);
        }
      }
    });
  }

  inpDoc?.addEventListener('blur', () => {
    tentarAutopreencherPorCNPJ().catch(console.error);
  });
  inpDoc?.addEventListener('input', () => {
    const d = apenasDigitos(inpDoc.value);
    if (d.length === 14) tentarAutopreencherPorCNPJ().catch(console.error);
  });

  // =========================
  // Filiais render + UF/Cidade por linha
  // =========================
  async function inicializarUfCidadeFiliais() {
    await garantirUFsCache();

    for (let idx = 0; idx < filiaisForm.length; idx++) {
      const selUF = document.getElementById(`filialUF_${idx}`);
      const selCidade = document.getElementById(`filialCidade_${idx}`);
      if (!selUF || !selCidade) continue;

      preencherSelectUF(selUF, filiaisForm[idx]?.uf);

      const ufAtual = (selUF.value || '').toUpperCase().trim();
      if (ufAtual) {
        selCidade.disabled = true;
        selCidade.innerHTML = `<option value="" disabled selected>Carregando cidades...</option>`;
        const cidades = await getMunicipiosPorUF(ufAtual);
        preencherSelectCidade(selCidade, cidades, filiaisForm[idx]?.cidade);
        selCidade.disabled = false;
      } else {
        selCidade.disabled = true;
        selCidade.innerHTML = `<option value="" disabled selected>Selecione a UF primeiro...</option>`;
      }

      selUF.onchange = async () => {
        const ufNova = selUF.value;
        filiaisForm[idx] = { ...filiaisForm[idx], uf: ufNova, cidade: '' };

        selCidade.disabled = true;
        selCidade.innerHTML = `<option value="" disabled selected>Carregando cidades...</option>`;
        const cidades = await getMunicipiosPorUF(ufNova);
        preencherSelectCidade(selCidade, cidades, '');
        selCidade.disabled = false;
      };

      selCidade.onchange = () => {
        filiaisForm[idx] = { ...filiaisForm[idx], cidade: selCidade.value };
      };
    }
  }

  function renderFiliais() {
    const box = document.getElementById('boxFiliais');
    const vazio = document.getElementById('filiaisVazio');
    if (!box || !vazio) return;

    if (!filiaisForm.length) {
      vazio.classList.remove('hidden');
      box.innerHTML = '';
      return;
    }
    vazio.classList.add('hidden');

    box.innerHTML = filiaisForm.map((f, idx) => `
      <div class="border rounded-lg p-4 space-y-3 bg-white/40 text-sm">
        <div class="flex items-center justify-between">
          <span class="font-medium text-sm">Filial ${idx + 1}</span>
          <button type="button"
            class="w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-destructive hover:text-white transition-all"
            title="Remover filial" data-idx="${idx}">
            <i class="fas fa-trash"></i>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="text-sm font-medium">Nome *</label>
            <input class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              data-field="nome" data-idx="${idx}" value="${escapeHtml(f.nome || '')}" required />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">Endereço</label>
            <input class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              data-field="endereco" data-idx="${idx}" value="${escapeHtml(f.endereco || '')}" />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">UF *</label>
            <select id="filialUF_${idx}"
              class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              data-idx="${idx}" required>
              <option value="" disabled selected>Selecione...</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">Cidade *</label>
            <select id="filialCidade_${idx}"
              class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              data-idx="${idx}" required disabled>
              <option value="" disabled selected>Selecione a UF primeiro...</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">Contato</label>
            <input class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              data-field="contato_nome" data-idx="${idx}" value="${escapeHtml(f.contato_nome || '')}" />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">Telefone</label>
            <input class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              data-field="contato_telefone" data-idx="${idx}" value="${escapeHtml(f.contato_telefone || '')}" />
          </div>
        </div>
      </div>
    `).join('');

    box.querySelectorAll('button[data-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        filiaisForm = filiaisForm.filter((_, i) => i !== idx);
        renderFiliais();
      });
    });

    box.querySelectorAll('input[data-field]').forEach(inp => {
      inp.addEventListener('input', () => {
        const idx = Number(inp.getAttribute('data-idx'));
        const field = inp.getAttribute('data-field');
        if (!Number.isFinite(idx) || !field) return;
        filiaisForm[idx] = { ...filiaisForm[idx], [field]: inp.value };
      });
    });

    inicializarUfCidadeFiliais().catch(err => console.error('UF/Cidade filiais:', err));
  }

  async function carregarFiliaisSeEdicao() {
    const id = document.getElementById('cliId')?.value;
    if (!id) { filiaisForm = []; renderFiliais(); return; }

    try {
      const rows = await buscarFiliaisCliente(id);
      filiaisForm = rows.map(r => ({
        id: r.ID,
        nome: r.NOME,
        endereco: r.ENDERECO,
        cidade: r.CIDADE,
        uf: r.UF,
        contato_nome: r.CONTATO_NOME,
        contato_telefone: r.CONTATO_TELEFONE,
      }));
      renderFiliais();
    } catch (e) {
      console.error(e);
      filiaisForm = [];
      renderFiliais();
    }
  }

  document.getElementById('btnAddFilial')?.addEventListener('click', () => {
    const telCli = document.getElementById('cliTelefone')?.value || '';
    filiaisForm.push({
      id: null,
      nome: '',
      endereco: '',
      cidade: '',
      uf: '',
      contato_nome: '',
      contato_telefone: telCli,
    });
    renderFiliais();
  });

  // =========================
  // Submit
  // =========================
  document.getElementById('formClienteModal')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setErr('');

    const btn = document.getElementById('btnSalvarClienteModal');
    btn.disabled = true;
    btn.classList.add('opacity-70');
    btn.textContent = 'Salvando...';

    try {
      const id = (document.getElementById('cliId')?.value || '').trim();

      const payload = {
        cliente: {
          id: id || null,
          razao_social: document.getElementById('cliRazao')?.value,
          documento: document.getElementById('cliDocumento')?.value, // vem mascarado
          grupo_economico: document.getElementById('cliGrupo')?.value,
          uf: document.getElementById('cliUF')?.value,
          cidade: document.getElementById('cliCidade')?.value,
          contato_nome: document.getElementById('cliContato')?.value,
          contato_telefone: document.getElementById('cliTelefone')?.value,
          contato_email: document.getElementById('cliEmail')?.value,
          cultura_principal: document.getElementById('cliCultura')?.value,
          hectares_estimados: document.getElementById('cliHectares')?.value,
          observacoes: document.getElementById('cliObs')?.value,
        },
        filiais: filiaisForm.map(f => ({
          id: f.id,
          nome: f.nome,
          endereco: f.endereco,
          uf: f.uf,
          cidade: f.cidade,
          contato_nome: f.contato_nome,
          contato_telefone: f.contato_telefone,
        }))
      };

      await apiSend('/api/clientes/salvar', 'POST', payload);

      removerModalCliente();
      await carregarClientes();
    } catch (err) {
      setErr(err?.message || 'Erro ao salvar.');
    } finally {
      btn.disabled = false;
      btn.classList.remove('opacity-70');
      btn.textContent = 'Salvar';
    }
  });

  // init
  carregarFiliaisSeEdicao();
  inicializarUfCidade(cliente).catch(err => console.error('UF/Cidade:', err));
}

// ====== UF/Cidade (IBGE) ======
const IBGE_BASE = 'https://servicodados.ibge.gov.br/api/v1/localidades'; // [web:805]
let cacheUFs = null;                 // [{ sigla, nome }]
const cacheMunicipiosPorUF = new Map(); // 'BA' -> ['Salvador', '...']

async function ibgeGetJson(url) {
  const r = await fetch(url, { method: 'GET' });
  // padrão fetch: checar ok e só então parsear [web:793]
  if (!r.ok) throw new Error(`IBGE falhou (HTTP ${r.status})`);
  return await r.json(); // [web:794]
}

function option(text, value, selected = false) {
  const sel = selected ? 'selected' : '';
  return `<option value="${escapeHtml(value)}" ${sel}>${escapeHtml(text)}</option>`;
}

async function carregarUFsSelect(valorSelecionado) {
  const selUF = document.getElementById('cliUF');
  if (!selUF) return;

  if (!cacheUFs) {
    const estados = await ibgeGetJson(`${IBGE_BASE}/estados?orderBy=nome`); // [web:805]
    cacheUFs = estados.map(e => ({ sigla: e.sigla, nome: e.nome }));
  }

  const atual = (valorSelecionado || '').toUpperCase();

  selUF.innerHTML =
    `<option value="" disabled ${!atual ? 'selected' : ''}>Selecione...</option>` +
    cacheUFs.map(e => option(`${e.sigla} - ${e.nome}`, e.sigla, e.sigla === atual)).join('');
}

async function carregarCidadesDaUF(uf, cidadeSelecionada) {
  const selCidade = document.getElementById('cliCidade');
  if (!selCidade) return;

  const ufUp = (uf || '').toUpperCase().trim();
  if (!ufUp) {
    selCidade.disabled = true;
    selCidade.innerHTML = `<option value="" selected disabled>Selecione a UF primeiro...</option>`;
    return;
  }

  selCidade.disabled = true;
  selCidade.innerHTML = `<option value="" selected disabled>Carregando cidades...</option>`;

  let cidades = cacheMunicipiosPorUF.get(ufUp);
  if (!cidades) {
    const municipios = await ibgeGetJson(`${IBGE_BASE}/estados/${encodeURIComponent(ufUp)}/municipios?orderBy=nome`); // [web:805]
    cidades = municipios.map(m => m.nome);
    cacheMunicipiosPorUF.set(ufUp, cidades);
  }

  const cidadeCur = (cidadeSelecionada || '').toString().trim();

  selCidade.innerHTML =
    `<option value="" disabled ${!cidadeCur ? 'selected' : ''}>Selecione...</option>` +
    cidades.map(nome => option(nome, nome, nome === cidadeCur)).join('');

  selCidade.disabled = false;
}

async function inicializarUfCidade(cliente) {
  const ufInicial = (cliente?.UF || '').toString().trim().toUpperCase();
  const cidadeInicial = (cliente?.CIDADE || '').toString().trim();

  await carregarUFsSelect(ufInicial);

  // carregue cidades se já tiver UF (edição)
  if (ufInicial) {
    await carregarCidadesDaUF(ufInicial, cidadeInicial);
  } else {
    await carregarCidadesDaUF('', '');
  }

  // quando muda UF, limpa cidade e recarrega
  document.getElementById('cliUF')?.addEventListener('change', async (e) => {
    const uf = e.target.value;
    await carregarCidadesDaUF(uf, '');
  });
}


async function garantirUFsCache() {
  if (cacheUFs) return cacheUFs;
  const estados = await ibgeGetJson(`${IBGE_BASE}/estados?orderBy=nome`); // [web:805]
  cacheUFs = estados.map(e => ({ sigla: e.sigla, nome: e.nome }));
  return cacheUFs;
}

async function getMunicipiosPorUF(uf) {
  const ufUp = (uf || '').toUpperCase().trim();
  if (!ufUp) return [];
  if (cacheMunicipiosPorUF.has(ufUp)) return cacheMunicipiosPorUF.get(ufUp);

  const municipios = await ibgeGetJson(`${IBGE_BASE}/estados/${encodeURIComponent(ufUp)}/municipios?orderBy=nome`); // [web:805]
  const cidades = municipios.map(m => m.nome);
  cacheMunicipiosPorUF.set(ufUp, cidades);
  return cidades;
}

function preencherSelectUF(selectEl, ufSelecionada) {
  const atual = (ufSelecionada || '').toUpperCase().trim();
  selectEl.innerHTML =
    `<option value="" disabled ${!atual ? 'selected' : ''}>Selecione...</option>` +
    cacheUFs.map(e => `
      <option value="${escapeHtml(e.sigla)}" ${e.sigla === atual ? 'selected' : ''}>
        ${escapeHtml(`${e.sigla} - ${e.nome}`)}
      </option>
    `).join('');
}

function preencherSelectCidade(selectEl, cidades, cidadeSelecionada) {
  const atual = (cidadeSelecionada || '').toString().trim();
  selectEl.innerHTML =
    `<option value="" disabled ${!atual ? 'selected' : ''}>Selecione...</option>` +
    cidades.map(nome => `
      <option value="${escapeHtml(nome)}" ${nome === atual ? 'selected' : ''}>
        ${escapeHtml(nome)}
      </option>
    `).join('');
}
