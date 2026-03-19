let API_BASE = sessionStorage.getItem('api_base');
let USUARIO_LOGADO = sessionStorage.getItem('usuario');
let EMAIL_LOGADO = sessionStorage.getItem('userEmail');


let APIBASE = sessionStorage.getItem('api_base') || '';
let USUARIOLOGADO = sessionStorage.getItem('usuario');
let EMAILLOGADO = sessionStorage.getItem('userEmail');





async function openSidebarSafe() {
  try {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const usuarioId = sessionStorage.getItem('id') || '';


    if (!usuarioId) {
      console.warn('[Sidebar] Usuário não identificado na sessão.');
      alert('Usuário logado não identificado.');
      return;
    }

    const itensMenu = {
      home: document.querySelector('[data-page="home"]'),
      pedidos: document.querySelector('[data-page="secao-pedidos"]'),
      clientes: document.querySelector('[data-page="secao-clientes"]'),
      marketing: document.querySelector('[data-page="secao-marketing"]'),
      emailautomaticos: document.querySelector('[data-page="secao-emails-automaticos"]'),
      gestaousuarios: document.querySelector('[data-page="user-management"]'),
      estoque: document.querySelector('[data-page="inventory-control"]'),
      perfilacesso: document.querySelector('[data-page="secao-perfis"]')
    };

    Object.entries(itensMenu).forEach(([chave, el]) => {
      if (!el) return;

      if (chave === 'home') {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    const url = `${APIBASE}/api/permissoes/menu/${usuarioId}`;

    const resp = await fetch(url);
    const data = await resp.json();


    if (!resp.ok || !data.success) {
      console.warn('[Sidebar] Falha ao buscar permissões do menu.');
      alert(data?.message || 'Erro ao validar permissões do menu.');
      return;
    }

    const perm = data.item || {};

    if (Number(perm.pedidos) === 1) {
      itensMenu.pedidos?.classList.remove('hidden');
    }

    if (Number(perm.clientes) === 1) {
      itensMenu.clientes?.classList.remove('hidden');
    }

    if (Number(perm.marketing) === 1) {
      itensMenu.marketing?.classList.remove('hidden');
    }

    if (Number(perm.emailautomaticos) === 1) {
      itensMenu.emailautomaticos?.classList.remove('hidden');
    }

    if (Number(perm.gestaousuarios) === 1) {
      itensMenu.gestaousuarios?.classList.remove('hidden');
    }

    if (Number(perm.estoque) === 1) {
      itensMenu.estoque?.classList.remove('hidden');
    }

    if (Number(perm.perfilacesso) === 1) {
      itensMenu.perfilacesso?.classList.remove('hidden');
    }

    if (sidebar) sidebar.classList.add('is-open');
    if (overlay) overlay.classList.add('show');

    renderSidebarAvatar();

  } catch (err) {
    console.error('[Sidebar] Erro ao abrir menu com permissões:', err);
    alert('Erro ao validar permissões do menu.');
  }
}

window.openSidebarSafe = openSidebarSafe;

function closeSidebarSafe() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.remove('is-open');
  if (overlay) overlay.classList.remove('show');
}

document.getElementById('closeSidebarBtn')?.addEventListener('click', closeSidebarSafe);
document.getElementById('overlay')?.addEventListener('click', closeSidebarSafe);




function isNightHour(date = new Date()) {
  const hour = date.getHours();
  return hour < 6 || hour >= 18;
}

function getWeatherTheme(code, isNight) {
  if (code === 0 || code === 1) {
    return {
      image: isNight
        ? 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4936479d2848f48fc89032795fd05bebaa8a8b09.jpg'
        : 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/16cb707f86e30087a810fd2c2b6612f32ee9af52.jpg',
      icon: isNight ? 'fa-moon' : 'fa-sun'
    };
  }

  if ([2, 3].includes(code)) {
    return {
      image: isNight
        ? 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/a13b1b0ab6a1c30fcd9a7ed49c5c835f3d02b45c.jpg'
        : 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4484e5b2fb723ebaee6bb5d94f90047da3686e73.jpg',
      icon: isNight ? 'fa-cloud-moon' : 'fa-cloud-sun'
    };
  }

  if ([45, 48].includes(code)) {
    return {
      image: isNight
        ? 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/df98f38d416bdb564aeb75c8070444866b1aa5e7.jpg'
        : 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/0803f465e1140643fd68ccf9a17bd18f54e2e83c.jpg',
      icon: 'fa-smog'
    };
  }

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return {
      image: isNight
        ? 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4eb416b65d0aaa9502bba01ed7811e62c9fbf436.jpg'
        : 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4eb416b65d0aaa9502bba01ed7811e62c9fbf436.jpg',
      icon: 'fa-cloud-rain'
    };
  }

  if ([95, 96, 99].includes(code)) {
    return {
      image: isNight
        ? 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/d87e37837ad84e83f4dc4b3500f187952f8a40ff.jpg'
        : 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/d87e37837ad84e83f4dc4b3500f187952f8a40ff.jpg',
      icon: 'fa-cloud-bolt'
    };
  }

  return {
    image: isNight
      ? 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/747d2bfffda9ec2b1d42c19efcd0193134ddedf7.jpg'
      : 'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4484e5b2fb723ebaee6bb5d94f90047da3686e73.jpg',
    icon: isNight ? 'fa-moon' : 'fa-cloud-sun'
  };
}

function traduzirCodigoClima(code) {
  const mapa = {
    0: 'Céu limpo',
    1: 'Principalmente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Neblina densa',
    51: 'Garoa fraca',
    53: 'Garoa moderada',
    55: 'Garoa forte',
    61: 'Chuva fraca',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    71: 'Neve fraca',
    73: 'Neve moderada',
    75: 'Neve forte',
    80: 'Pancadas fracas',
    81: 'Pancadas moderadas',
    82: 'Pancadas fortes',
    95: 'Trovoadas',
    96: 'Trovoadas com granizo',
    99: 'Trovoadas fortes'
  };
  return mapa[code] || 'Condição atual';
}

async function carregarClimaHome() {
  try {
    const latitude = -12.092;
    const longitude = -45.787;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data?.current) throw new Error('Sem dados');

    const current = data.current;
    const agora = new Date();
    const noite = isNightHour(agora);
    const theme = getWeatherTheme(current.weather_code, noite);

    const tempEl = document.getElementById('weatherTemp');
    const descEl = document.getElementById('weatherDesc');
    const humEl = document.getElementById('weatherHumidity');
    const windEl = document.getElementById('weatherWind');
    const updEl = document.getElementById('weatherUpdatedAt');
    const bgEl = document.getElementById('weatherHeroBg');
    const iconEl = document.getElementById('weatherIconTop');

    if (tempEl) tempEl.textContent = `${Math.round(current.temperature_2m)}°C`;
    if (descEl) descEl.textContent = traduzirCodigoClima(current.weather_code);
    if (humEl) humEl.textContent = `Umidade ${current.relative_humidity_2m}%`;
    if (windEl) windEl.textContent = `Vento ${Math.round(current.wind_speed_10m)} km/h`;

    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (updEl) updEl.textContent = `Atualizado às ${hora}`;

    if (bgEl) bgEl.style.backgroundImage = `url('${theme.image}')`;
    if (iconEl) iconEl.className = `fas ${theme.icon} text-xs`;
  } catch (error) {
    const descEl = document.getElementById('weatherDesc');
    const humEl = document.getElementById('weatherHumidity');
    const windEl = document.getElementById('weatherWind');
    const updEl = document.getElementById('weatherUpdatedAt');
    const bgEl = document.getElementById('weatherHeroBg');

    if (descEl) descEl.textContent = 'Clima indisponível';
    if (humEl) humEl.textContent = 'Umidade --%';
    if (windEl) windEl.textContent = 'Vento -- km/h';
    if (updEl) updEl.textContent = 'Não foi possível atualizar';
    if (bgEl) {
      bgEl.style.backgroundImage = "url('https://pplx-res.cloudinary.com/image/upload/pplx_search_images/747d2bfffda9ec2b1d42c19efcd0193134ddedf7.jpg')";
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  resetHomePanelsDesktop();
  carregarClimaHome();
  iniciarLoopMarketingPainel({
    imgId: 'painelMarketingImg',
    fallbackSrc: 'imagens/PaginaPrincipal.jpg',
    intervalMs: 20000,
    refreshListEveryMs: 60000,
  });
});

function renderSidebarAvatar() {
  const elAvatar = document.getElementById('userAvatar');
  if (!elAvatar) return;

  const nomeCompleto = sessionStorage.getItem('usuario') || '';
  const fotoRel = sessionStorage.getItem('userFoto') || '';

  const { primeiro, ultimo } = ObterPrimeiroEUltimoNome(nomeCompleto);

  const inicial1 = primeiro ? primeiro[0].toUpperCase() : '';
  const inicial2 = ultimo ? ultimo[0].toUpperCase() : (primeiro ? primeiro[0].toUpperCase() : '');
  const iniciais = (inicial1 + inicial2) || 'U';

  const fotoAbs = fotoRel ? absUrlFromApiGestaoUsuarios(fotoRel) : '';

  elAvatar.className = 'w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-white bg-primary shadow shrink-0 cursor-pointer transform transition-all duration-200 hover:scale-110 hover:opacity-90';
  
  if (fotoAbs) {
    elAvatar.innerHTML = `
      <img
        src="${escapeHtml(fotoAbs)}"
        alt="${escapeHtml(nomeCompleto || 'Usuário')}"
        class="w-full h-full object-cover"
      />
    `;

    const img = elAvatar.querySelector('img');
    img?.addEventListener('error', () => {
      elAvatar.innerHTML = '';
      elAvatar.textContent = iniciais;
    });
  } else {
    elAvatar.innerHTML = '';
    elAvatar.textContent = iniciais;
  }
}


function getApiBase() {
  let raw =
    sessionStorage.getItem('api_base') ||
    sessionStorage.getItem('apibase') ||
    '';

  raw = String(raw || '').trim();

  if (!raw) return '';

  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`;
  }

  try {
    const url = new URL(raw);
    return url.href.replace(/\/+$/, '');
  } catch {
    return '';
  }
}


async function apiJson(url, options = {}) {
  const resp = await fetch(url, options);
  const texto = await resp.text();
  let data = {};

  try {
    data = texto ? JSON.parse(texto) : {};
  } catch {
    data = {};
  }

  if (!resp.ok || !data.success) {
    throw new Error(
      data.error
        ? `${data.message || 'Erro na requisição.'} Detalhe: ${data.error}`
        : (data.message || `Erro na requisição: ${url}`)
    );
  }

  return data;
}

function apiUrl(path) {
  const base = getApiBase();
  if (!path.startsWith('/')) path = `/${path}`;
  return `${base}${path}`;
}

function absUrlFromApiMarketing(relOrAbs, apiBase) {
  const s = String(relOrAbs || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;

  const base = String(apiBase || getApiBaseGestaoUsuarios() || '').trim();
  if (!base) return s;

  try {
    if (s.startsWith('/foto-usuario/')) {
      return new URL(`/anexos${s}`, `${base}/`).href;
    }

    if (s.startsWith('/marketing/')) {
      return new URL(`/anexos${s}`, `${base}/`).href;
    }

    return new URL(s, `${base}/`).href;
  } catch {
    return s;
  }
}

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
    renderSidebarAvatar();
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

    document.getElementById('userAvatar')?.addEventListener('click', () => {
      abrirModalTrocarFotoPerfil();
    });

    document.getElementById('AgendarCarro')?.addEventListener('click', () => {
      alert('A função de agendamento de carro está sendo implantada.');
    });


    document.getElementById('AgendarSalaReuniao')?.addEventListener('click', async () => {
      try {
        const usuarioLogado = sessionStorage.getItem('id') || '';
        const usuarioId = usuarioLogado;

        if (!usuarioId) {
          console.warn('[AgendarSalaReuniao] Usuário logado não identificado.');
          alert('Usuário logado não identificado.');
          return;
        }

        const url = `${API_BASE}/api/permissoes/agendar-sala/${usuarioId}`;

        const resp = await fetch(url);

        const data = await resp.json();

        if (!resp.ok || !data.success) {
          console.warn('[AgendarSalaReuniao] Falha na validação da permissão.', {
            ok: resp.ok,
            success: data?.success,
            message: data?.message
          });
          alert(data?.message || 'Erro ao validar permissão.');
          return;
        }

        if (Number(data?.item?.agendar_sala_reuniao) !== 1) {
          console.warn('[AgendarSalaReuniao] Usuário sem permissão para abrir o modal.');
          alert('Você não tem permissão para agendar sala de reunião.');
          return;
        }

        AbrirModalAgendamentoSala();
      } catch (err) {
        console.error('[AgendarSalaReuniao] Erro ao validar acesso ao agendamento de sala:', err);
        alert('Erro ao validar permissão de acesso.');
      }
    });


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
// GESTÃO DE USUÁRIOS - COMPLETO ATUALIZADO
// Com locais de trabalho dinâmicos (SF_LOCAL_TRABALHO)
// ===============================

function getApiBaseGestaoUsuarios() {
  let raw =
    sessionStorage.getItem('api_base') ||
    sessionStorage.getItem('apibase') ||
    '';

  raw = String(raw || '').trim();

  if (!raw) return '';

  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`;
  }

  try {
    const url = new URL(raw);
    return url.href.replace(/\/+$/, '');
  } catch {
    return '';
  }
}

function montarUrlApiGestao(path) {
  const base = getApiBaseGestaoUsuarios();
  if (!base) throw new Error('API base não configurada.');

  const p = String(path || '').trim();
  return p.startsWith('http://') || p.startsWith('https://')
    ? p
    : `${base}${p.startsWith('/') ? '' : '/'}${p}`;
}

function absUrlFromApiGestaoUsuarios(relOrAbs, apiBase) {
  const s = String(relOrAbs || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;

  const base = String(apiBase || getApiBaseGestaoUsuarios() || '').trim();
  if (!base) return s;

  try {
    if (s.startsWith('/foto-usuario/')) {
      return new URL(`/anexos${s}`, `${base}/`).href;
    }

    if (s.startsWith('/marketing/')) {
      return new URL(`/anexos${s}`, `${base}/`).href;
    }

    if (s.startsWith('/anexos/')) {
      return new URL(s, `${base}/`).href;
    }

    return new URL(s, `${base}/`).href;
  } catch {
    return s;
  }
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
    .map(w => w[0]?.toUpperCase() + w.slice(1))
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
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return n;
}

function formatarCPF(raw) {
  const n = somenteNumeros(raw).slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
  if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
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

function statusBadge(status) {
  const s = (status || '').trim();
  let cls = 'bg-info/15 text-info border-info/20';
  if (s === 'Ativo') cls = 'bg-success/15 text-success border-success/20';
  else if (s === 'Desativado') cls = 'bg-destructive/15 text-destructive border-destructive/20';

  return `<span class="inline-flex items-center px-3 py-1 rounded-full border ${cls} text-xs font-semibold">${escapeHtml(s || '—')}</span>`;
}

function avatarUsuarioHtml(u) {
  const fotoRel = u.FOTO ?? u.foto ?? '';
  const nome = (u.NOME ?? u.nome ?? '').toString().trim();
  const inicial = escapeHtml((nome[0] || 'U').toUpperCase());

  const fotoAbs = fotoRel ? absUrlFromApiGestaoUsuarios(fotoRel) : '';

  if (fotoAbs) {
    return `
      <div class="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0 border border-border">
        <img
          src="${escapeHtml(fotoAbs)}"
          alt="${escapeHtml(nome || 'Usuário')}"
          class="w-full h-full object-cover"
          onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=&quot;w-10 h-10 rounded-full bg-primary/15 text-primary shrink-0 border border-border flex items-center justify-center font-semibold&quot;>${inicial}</div>';"
        >
      </div>
    `;
  }

  return `
    <div class="w-10 h-10 rounded-full bg-primary/15 text-primary shrink-0 border border-border flex items-center justify-center font-semibold">
      ${inicial}
    </div>
  `;
}

function rowUsuario(u) {
  const nome = u.NOME ?? u.nome ?? '';
  const emailCorporativo = u.EMAIL ?? u.email ?? '';
  const setor = u.SETOR ?? u.setor ?? '';
  const perfil = u.PERFIL ?? u.perfil ?? '';
  const localTrabalho = u.LOCAL_TRABALHO ?? u.local_trabalho ?? u.LOCALTRABALHO ?? u.localtrabalho ?? '';
  const status = u.STATUS ?? u.status ?? '';
  const id = u.ID ?? u.id ?? '';

  return `
    <tr>
      <td class="px-4 py-3">
        <div class="flex items-center gap-3">
          ${avatarUsuarioHtml(u)}
          <div class="min-w-0">
            <div class="font-medium truncate">${escapeHtml(nome)}</div>
            <div class="text-xs text-muted-foreground truncate">${escapeHtml(emailCorporativo)}</div>
          </div>
        </div>
      </td>
      <td class="px-4 py-3">${escapeHtml(setor || '—')}</td>
      <td class="px-4 py-3">${escapeHtml(perfil || '—')}</td>
      <td class="px-4 py-3">${escapeHtml(localTrabalho || '—')}</td>
      <td class="px-4 py-3">${statusBadge(status)}</td>
      <td class="px-4 py-3">
        <div class="flex justify-end gap-2">
          <button
            class="btnViewUsuario w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all"
            data-id="${escapeHtml(id)}"
            aria-label="Visualizar usuário"
            title="Visualizar usuário"
          >
            <i class="fas fa-eye" aria-hidden="true"></i>
          </button>

          <button
            class="btnEditUsuario w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all"
            data-id="${escapeHtml(id)}"
            aria-label="Editar usuário"
            title="Editar usuário"
          >
            <i class="fas fa-pen" aria-hidden="true"></i>
          </button>

          <button
            class="btnDelUsuario w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all"
            data-id="${escapeHtml(id)}"
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
  const url = montarUrlApiGestao(path);

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
  const url = montarUrlApiGestao(path);

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

async function apiUploadFotoUsuarioBlob(blob, fileName = 'foto-usuario.jpg') {
  const base = getApiBaseGestaoUsuarios();
  if (!base) throw new Error('API base não configurada.');

  const url = `${base}/api/gestao-usuarios/foto`;
  const fd = new FormData();
  fd.append('foto', blob, fileName);

  const r = await fetch(url, {
    method: 'POST',
    body: fd,
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

function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.9) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Falha ao gerar imagem.'));
      resolve(blob);
    }, type, quality);
  });
}

function showPage(pageId) {
  document.querySelectorAll('.page-content').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(pageId);
  if (sec) sec.classList.add('active');
}

let cachePerfisGestao = [];
let cacheSetoresGestao = [];
let cacheLocaisTrabalhoGestao = [];

async function carregarGestaoUsuarios() {
  try {
    setGestaoUsuariosErro('');
    showPage('user-management');

    const tbody = document.getElementById('tbodyGestaoUsuarios');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-6 text-sm text-muted-foreground">Carregando usuários...</td></tr>`;
    }

    const [usuariosResp, perfisResp, setoresResp, locaisResp] = await Promise.all([
      apiGet('/api/gestao-usuarios'),
      apiGet('/api/gestao-usuarios-perfis'),
      apiGet('/api/gestao-usuarios-setores'),
      apiGet('/api/gestao-usuarios-locais-trabalho'),
    ]);

    const usuarios = Array.isArray(usuariosResp?.items) ? usuariosResp.items : [];
    const perfis = Array.isArray(perfisResp?.items) ? perfisResp.items : [];
    const setores = Array.isArray(setoresResp?.items) ? setoresResp.items : [];
    const locais = Array.isArray(locaisResp?.items) ? locaisResp.items : [];


    cachePerfisGestao = perfis;
    cacheSetoresGestao = setores;
    cacheLocaisTrabalhoGestao = locais;

    if (!tbody) return;

    if (!usuarios.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-6 text-sm text-muted-foreground">Nenhum usuário cadastrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = usuarios.map(rowUsuario).join('');
  } catch (err) {
    setGestaoUsuariosErro(err?.message || 'Erro ao carregar usuários.');
    const tbody = document.getElementById('tbodyGestaoUsuarios');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-6 text-sm text-destructive">Falha ao carregar usuários.</td></tr>`;
    }
  }
}

function removerModalGestaoUsuario() {
  document.getElementById('gestaoUsuarioOverlay')?.remove();
  document.getElementById('gestaoUsuarioModal')?.remove();
}

function optionsFromRows(rows, selectedValue, placeholder = 'Selecione...') {
  const sel = (selectedValue || '').toString().trim();

  const opts = (rows || []).map(r => {
    const nome = (r.NOME ?? r.nome ?? '').toString().trim();
    if (!nome) return '';
    const selected = nome === sel ? 'selected' : '';
    return `<option value="${escapeHtml(nome)}" ${selected}>${escapeHtml(nome)}</option>`;
  }).join('');

  return `<option value="" ${sel ? '' : 'selected'}>${escapeHtml(placeholder)}</option>` + opts;
}

function inputValue(id) {
  return document.getElementById(id)?.value ?? '';
}

function setAbaGestaoUsuario(nome) {
  const abaCorp = document.getElementById('guAbaCorporativo');
  const abaPess = document.getElementById('guAbaPessoal');
  const painelCorp = document.getElementById('guPainelCorporativo');
  const painelPess = document.getElementById('guPainelPessoal');

  const pessoalAtiva = nome === 'pessoal';

  if (abaCorp) {
    abaCorp.setAttribute('aria-selected', pessoalAtiva ? 'false' : 'true');
    abaCorp.className = pessoalAtiva
      ? 'px-4 py-2 rounded-xl text-sm font-medium border border-border bg-white/40 text-muted-foreground hover:bg-white/70 transition-all'
      : 'px-4 py-2 rounded-xl text-sm font-medium border border-border bg-white text-foreground shadow-sm transition-all';
  }

  if (abaPess) {
    abaPess.setAttribute('aria-selected', pessoalAtiva ? 'true' : 'false');
    abaPess.className = pessoalAtiva
      ? 'px-4 py-2 rounded-xl text-sm font-medium border border-border bg-white text-foreground shadow-sm transition-all'
      : 'px-4 py-2 rounded-xl text-sm font-medium border border-border bg-white/40 text-muted-foreground hover:bg-white/70 transition-all';
  }

  if (painelCorp) painelCorp.hidden = pessoalAtiva;
  if (painelPess) painelPess.hidden = !pessoalAtiva;
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
  const isView = modo === 'view';
  const isNew = modo === 'new';
  const u = usuario || {};

  const formDisabledAttr = isView ? 'disabled' : '';
  const inputReadonlyAttr = isView ? 'readonly' : '';
  const fileDisabledAttr = isView ? 'disabled' : '';

  const fotoAtualRel = u.FOTO ?? u.foto ?? '';
  let fotoAtualAbs = '';

  try {
    fotoAtualAbs = fotoAtualRel ? absUrlFromApiGestaoUsuarios(fotoAtualRel) : '';
  } catch (err) {
    console.error('Erro ao resolver fotoAtualAbs:', err);
    fotoAtualAbs = '';
  }

  let perfilOptions = '';
  let setorOptions = '';
  let localTrabalhoOptions = '';

  const perfilLogado = (sessionStorage.getItem('perfilacesso') || '').trim().toLowerCase();

  console.log(perfilLogado);

  const perfisPermitidos = Array.isArray(cachePerfisGestao)
    ? cachePerfisGestao.filter((p) => {
        const nomePerfil = String(p.NOME ?? p.nome ?? '').trim().toLowerCase();
        if (perfilLogado === 'administrador') return true;
        return nomePerfil !== 'administrador';
      })
    : [];

  try {
    perfilOptions = optionsFromRows(perfisPermitidos, u.PERFIL ?? u.perfil ?? '');
  } catch (err) {
    console.error('Erro ao gerar options de perfil:', err);
    perfilOptions = `<option value="" selected>Erro ao carregar perfis</option>`;
  }

  try {
    setorOptions = optionsFromRows(cacheSetoresGestao, (u.SETOR ?? u.setor ?? ''));
  } catch (err) {
    console.error('Erro ao gerar options de setor:', err);
    setorOptions = `<option value="" selected>Erro ao carregar setores</option>`;
  }

  try {
    localTrabalhoOptions = optionsFromRows(
      cacheLocaisTrabalhoGestao,
      (u.LOCAL_TRABALHO ?? u.local_trabalho ?? u.LOCALTRABALHO ?? u.localtrabalho ?? ''),
      'Selecione...'
    );
  } catch (err) {
    console.error('Erro ao gerar options de Centro de Custo:', err);
    localTrabalhoOptions = `<option value="" selected>Erro ao carregar locais</option>`;
  }

  const emailCorporativo = u.EMAIL ?? u.email ?? '';
  const telefoneCorporativo = formatarCelularBR(u.TELEFONE ?? u.telefone ?? '');
  const statusAtual = (u.STATUS ?? u.status ?? 'Ativo').toString().trim() || 'Ativo';

  const cpfAtual = formatarCPF(u.CPF ?? u.cpf ?? '');
  const rgAtual = u.RG ?? u.rg ?? '';
  const cnhAtual = u.CNH ?? u.cnh ?? '';
  const cnhCategoriaAtual = u.CNH_CATEGORIA ?? u.cnh_categoria ?? u.CNHCATEGORIA ?? u.cnhcategoria ?? '';
  const dataNascimentoAtual = String(u.DATA_NASCIMENTO ?? u.data_nascimento ?? u.DATANASCIMENTO ?? u.datanascimento ?? '').slice(0, 10);
  const estadoCivilAtual = u.ESTADO_CIVIL ?? u.estado_civil ?? u.ESTADOCIVIL ?? u.estadocivil ?? '';
  const telefonePessoalAtual = formatarCelularBR(u.TELEFONE_PESSOAL ?? u.telefone_pessoal ?? u.TELEFONEPESSOAL ?? u.telefonepessoal ?? '');
  const emailPessoalAtual = u.EMAIL_PESSOAL ?? u.email_pessoal ?? u.EMAILPESSOAL ?? u.emailpessoal ?? '';
  const cnhValidadeAtual = String(
    u.CNH_VALIDADE ??
    u.cnh_validade ??
    u.CNHVALIDADE ??
    u.cnhvalidade ??
    ''
  ).slice(0, 10);

  const cnhArquivoAtualRel =
    u.CNH_ARQUIVO ??
    u.cnh_arquivo ??
    u.CNHARQUIVO ??
    u.cnharquivo ??
    '';

  let cnhArquivoAtualAbs = '';

  try {
    cnhArquivoAtualAbs = cnhArquivoAtualRel
      ? absUrlFromApiGestaoUsuarios(cnhArquivoAtualRel)
      : '';
  } catch (err) {
    console.error('Erro ao resolver cnhArquivoAtualAbs:', err);
    cnhArquivoAtualAbs = '';
  }


  modal.innerHTML = `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-6xl mx-auto">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-foreground">
                  ${isView ? 'Visualizar usuário' : isEdit ? 'Editar usuário' : 'Novo usuário'}
                </h3>
                <p class="text-sm text-muted-foreground">
                  ${isView ? 'Consulta de dados do usuário' : 'Dados corporativos, pessoais e segurança'}
                </p>
              </div>

              <button id="btnFecharGestaoUsuario" type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                aria-label="Fechar" title="Fechar">
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <form id="formGestaoUsuario" class="px-6 py-6" autocomplete="off">
              <input type="text" name="fakeusernameremembered" autocomplete="username" class="hidden" tabindex="-1">
              <input type="password" name="fakepasswordremembered" autocomplete="new-password" class="hidden" tabindex="-1">

              <div class="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
                <div class="space-y-4">
                  <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-3">
                    <label class="text-sm font-medium block">Foto do usuário</label>

                    <div class="w-28 h-28 rounded-full overflow-hidden bg-muted flex items-center justify-center mx-auto border border-border">
                      <img id="guFotoPreview"
                           src="${escapeHtml(fotoAtualAbs)}"
                           alt="Foto do usuário"
                           class="w-full h-full object-cover ${fotoAtualAbs ? '' : 'hidden'}">
                      <span id="guFotoPlaceholder" class="text-xs text-muted-foreground ${fotoAtualAbs ? 'hidden' : ''}">
                        Sem foto
                      </span>
                    </div>

                    <canvas id="guFotoCanvas" class="hidden border border-dashed border-border rounded-xl w-full max-h-64 cursor-grab ${isView ? 'hidden' : ''}"></canvas>

                    ${isView ? '' : `
                    <div class="flex flex-col gap-2">
                      <input id="guFotoInput" type="file" accept="image/*" ${fileDisabledAttr}
                        class="w-full rounded-xl border border-border bg-white/70 px-4 py-2 text-sm"
                        autocomplete="off" />

                      <button id="btnRemoverFotoGU" type="button"
                        class="rounded-xl border border-border bg-white/60 px-4 py-2 text-sm hover:bg-white/90 transition-all">
                        Remover foto
                      </button>
                    </div>

                    <p class="text-xs text-muted-foreground">
                      Selecione uma imagem e use arraste/zoom para ajustar.
                    </p>
                    `}
                  </div>

                  ${isEdit && !isView ? `
                  <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-3">
                    <div>
                      <h4 class="text-sm font-semibold text-foreground">Segurança</h4>
                      <p class="text-xs text-muted-foreground">Troca de senha do usuário</p>
                    </div>

                    <div class="grid grid-cols-1 gap-2">
                      <button id="btnMostrarAlteracaoSenhaGU" type="button"
                        class="rounded-xl border border-border bg-white/70 px-4 py-3 text-sm font-medium hover:bg-white transition-all">
                        Alterar com senha atual
                      </button>
                    </div>

                    <div id="guBlocoAlteracaoSenha" class="hidden space-y-3">
                      <div class="space-y-2">
                        <label class="text-sm font-medium">Senha atual</label>
                        <input id="guSenhaAtual" type="password"
                          class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Informe a senha atual"
                          autocomplete="new-password"
                          data-lpignore="true">
                      </div>

                      <div class="space-y-2">
                        <label class="text-sm font-medium">Nova senha</label>
                        <input id="guNovaSenha" type="password" minlength="6"
                          class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Mínimo 6 caracteres"
                          autocomplete="new-password"
                          data-lpignore="true">
                      </div>

                      <div class="grid grid-cols-1 gap-2">
                        <button id="btnTrocarSenhaGU" type="button"
                          class="rounded-xl border border-border bg-white/70 px-4 py-3 text-sm font-medium hover:bg-white transition-all">
                          Salvar nova senha
                        </button>
                      </div>
                    </div>

                    <p id="guSenhaMsg" class="text-xs hidden whitespace-pre-line"></p>
                  </div>
                  ` : ''}

                  ${isNew ? `
                  <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-2">
                    <label class="text-sm font-medium">Senha inicial</label>
                    <input id="guSenha" type="password" minlength="6" required
                      class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Mínimo 6 caracteres"
                      autocomplete="new-password"
                      data-lpignore="true" />
                    <p class="text-xs text-muted-foreground">Será gravada com hash no banco.</p>
                  </div>
                  ` : ''}
                </div>

                <div class="space-y-4 min-w-0">
                  <div class="flex flex-wrap gap-2">
                    <button id="guAbaCorporativo" type="button" aria-selected="true"
                      class="px-4 py-2 rounded-xl text-sm font-medium border border-border bg-white text-foreground shadow-sm transition-all">
                      Corporativo
                    </button>

                    <button id="guAbaPessoal" type="button" aria-selected="false"
                      class="px-4 py-2 rounded-xl text-sm font-medium border border-border bg-white/40 text-muted-foreground hover:bg-white/70 transition-all">
                      Pessoal
                    </button>
                  </div>

                  <div id="guPainelCorporativo" class="space-y-4">
                    <div class="rounded-2xl border border-border bg-white/40 p-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2 md:col-span-2">
                          <label class="text-sm font-medium">Nome</label>
                          <input id="guNome" type="text" required ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(u.NOME ?? u.nome ?? '')}"
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">E-mail corporativo</label>
                          <input id="guEmailCorporativo" type="email" required ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(emailCorporativo)}"
                            autocomplete="off"
                            autocapitalize="off"
                            autocorrect="off"
                            spellcheck="false"
                            data-lpignore="true" />
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">Telefone corporativo</label>
                          <input id="guTelefoneCorporativo" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(telefoneCorporativo)}"
                            placeholder="(77) 9XXXX-XXXX"
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">Perfil</label>
                          <select id="guPerfil" required ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30">
                            ${perfilOptions}
                          </select>
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">Setor</label>
                          <div class="flex gap-2">
                            <select id="guSetor" required ${formDisabledAttr}
                              class="flex-1 rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 uppercase">
                              ${setorOptions}
                            </select>

                            ${isView ? '' : `
                            <button id="btnAddSetor" type="button"
                              class="w-12 h-12 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all flex items-center justify-center"
                              aria-label="Adicionar setor" title="Adicionar setor">
                              <i class="fas fa-plus" aria-hidden="true"></i>
                            </button>
                            `}
                          </div>
                        </div>


                        <div class="space-y-2">
                          <label class="text-sm font-medium">Centro de Custo</label>
                          <div class="flex gap-2">
                            <select id="guLocalTrabalho" ${formDisabledAttr}
                              class="flex-1 rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30">
                              ${localTrabalhoOptions}
                            </select>

                            ${isView ? '' : `
                            <button id="btnAddLocalTrabalho" type="button"
                              class="w-12 h-12 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all flex items-center justify-center"
                              aria-label="Adicionar Centro de Custo" title="Adicionar Centro de Custo">
                              <i class="fas fa-plus" aria-hidden="true"></i>
                            </button>
                            `}
                          </div>
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">Status</label>
                          <select id="guStatus" required ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30">
                            ${['Ativo', 'Desativado'].map(s => {
                              const selected = statusAtual === s ? 'selected' : '';
                              return `<option value="${escapeHtml(s)}" ${selected}>${escapeHtml(s)}</option>`;
                            }).join('')}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="guPainelPessoal" class="space-y-4" hidden>
                    <div class="rounded-2xl border border-border bg-white/40 p-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <label class="text-sm font-medium">CPF</label>
                          <input id="guCpf" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(cpfAtual)}"
                            placeholder="000.000.000-00"
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">RG</label>
                          <input id="guRg" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(rgAtual)}"
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">CNH</label>
                          <input id="guCnh" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(cnhAtual)}"
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">Categoria CNH</label>
                          <input id="guCnhCategoria" type="text" maxlength="5" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 uppercase"
                            value="${escapeHtml(cnhCategoriaAtual)}"
                            placeholder="A, B, AB..."
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">Validade da CNH</label>
                          <input id="guCnhValidade" type="date" ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(cnhValidadeAtual)}" />
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">Data de nascimento</label>
                          <input id="guDataNascimento" type="date" ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(dataNascimentoAtual)}" />
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">Estado civil</label>
                          <select id="guEstadoCivil" ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30">
                            ${[
                              '',
                              'Solteiro(a)',
                              'Casado(a)',
                              'Divorciado(a)',
                              'Viúvo(a)',
                              'União estável'
                            ].map(s => {
                              const selected = (estadoCivilAtual || '') === s ? 'selected' : '';
                              const label = s || 'Selecione...';
                              return `<option value="${escapeHtml(s)}" ${selected}>${escapeHtml(label)}</option>`;
                            }).join('')}
                          </select>
                        </div>

                        <div class="space-y-2">
                          <label class="text-sm font-medium">Telefone pessoal</label>
                          <input id="guTelefonePessoal" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(telefonePessoalAtual)}"
                            placeholder="(77) 9XXXX-XXXX"
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2 md:col-span-2">
                          <label class="text-sm font-medium">E-mail pessoal</label>
                          <input id="guEmailPessoal" type="email" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(emailPessoalAtual)}"
                            autocomplete="off"
                            autocapitalize="off"
                            autocorrect="off"
                            spellcheck="false"
                            data-lpignore="true" />
                        </div>

                        <div class="space-y-2 md:col-span-2">
                          <label class="text-sm font-medium">Arquivo da CNH</label>

                          ${isView ? `
                            ${
                              cnhArquivoAtualAbs
                                ? `<a href="${escapeHtml(cnhArquivoAtualAbs)}" target="_blank" rel="noopener noreferrer"
                                    class="inline-flex items-center gap-2 rounded-xl border border-border bg-white/70 px-4 py-3 text-sm hover:bg-white transition-all">
                                    <i class="fas fa-paperclip"></i>
                                    Ver arquivo anexado
                                  </a>`
                                : `<div class="rounded-xl border border-dashed border-border bg-white/40 px-4 py-3 text-sm text-muted-foreground">
                                    Nenhum arquivo anexado.
                                  </div>`
                            }
                          ` : `
                            <div class="flex flex-col gap-3">
                              <input id="guCnhArquivoInput" type="file" accept=".pdf,image/*"
                                class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm"
                                autocomplete="off" />

                              <div id="guCnhArquivoAtualWrap" class="${cnhArquivoAtualAbs ? '' : 'hidden'}">
                                <a id="guCnhArquivoAtualLink"
                                  href="${escapeHtml(cnhArquivoAtualAbs)}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="inline-flex items-center gap-2 rounded-xl border border-border bg-white/70 px-4 py-3 text-sm hover:bg-white transition-all">
                                  <i class="fas fa-paperclip"></i>
                                  Ver arquivo atual
                                </a>
                              </div>

                              <div id="guCnhArquivoNovoWrap" class="hidden rounded-xl border border-border bg-white/50 px-4 py-3 text-sm text-foreground"></div>

                              <button id="btnRemoverCnhArquivoGU" type="button"
                                class="rounded-xl border border-border bg-white/60 px-4 py-2 text-sm hover:bg-white/90 transition-all">
                                Remover arquivo da CNH
                              </button>

                              <p class="text-xs text-muted-foreground">
                                Aceita PDF, JPG, PNG, JPEG ou WEBP.
                              </p>
                            </div>
                          `}
                        </div>
                      </div>
                    </div>
                  </div>


                  <p id="guErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

                  <div class="pt-2 flex flex-col sm:flex-row gap-3">
                    ${isView ? `
                    <button id="btnCancelarGU" type="button"
                      class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all">
                      Fechar
                    </button>
                    ` : `
                    <button id="btnSalvarGU" type="submit"
                      class="sm:flex-1 rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                      Salvar
                    </button>

                    <button id="btnCancelarGU" type="button"
                      class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all">
                      Cancelar
                    </button>
                    `}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  let guFotoImage = null;
  let guFotoScale = 1;
  let guFotoOffsetX = 0;
  let guFotoOffsetY = 0;
  let guFotoIsDragging = false;
  let guFotoStartX = 0;
  let guFotoStartY = 0;
  let guFotoRemovida = false;

  const fileInput = document.getElementById('guFotoInput');
  const canvas = document.getElementById('guFotoCanvas');
  const previewImg = document.getElementById('guFotoPreview');
  const placeholder = document.getElementById('guFotoPlaceholder');
  const btnRemoverFoto = document.getElementById('btnRemoverFotoGU');
  const form = document.getElementById('formGestaoUsuario');
  const btnFechar = document.getElementById('btnFecharGestaoUsuario');
  const btnCancelar = document.getElementById('btnCancelarGU');
  const btnAddSetor = document.getElementById('btnAddSetor');
  const btnAddLocalTrabalho = document.getElementById('btnAddLocalTrabalho');
  const btnMostrarAlteracaoSenha = document.getElementById('btnMostrarAlteracaoSenhaGU');
  const blocoAlteracaoSenha = document.getElementById('guBlocoAlteracaoSenha');

  const inpTelCorp = document.getElementById('guTelefoneCorporativo');
  const inpTelPess = document.getElementById('guTelefonePessoal');
  const inpCpf = document.getElementById('guCpf');
  const btnAbaCorp = document.getElementById('guAbaCorporativo');
  const btnAbaPess = document.getElementById('guAbaPessoal');
  const btnTrocarSenha = document.getElementById('btnTrocarSenhaGU');
  const ctx = canvas?.getContext('2d');

  const cnhArquivoInput = document.getElementById('guCnhArquivoInput');
  const btnRemoverCnhArquivo = document.getElementById('btnRemoverCnhArquivoGU');
  const cnhArquivoAtualWrap = document.getElementById('guCnhArquivoAtualWrap');
  const cnhArquivoAtualLink = document.getElementById('guCnhArquivoAtualLink');
  const cnhArquivoNovoWrap = document.getElementById('guCnhArquivoNovoWrap');

  let guCnhArquivoFile = null;
  let guCnhArquivoRemovido = false;

  cnhArquivoInput?.addEventListener('change', e => {
    const file = e.target.files?.[0] || null;
    guCnhArquivoFile = file;
    guCnhArquivoRemovido = false;

    if (cnhArquivoNovoWrap) {
      if (file) {
        cnhArquivoNovoWrap.textContent = `Novo arquivo selecionado: ${file.name}`;
        cnhArquivoNovoWrap.classList.remove('hidden');
      } else {
        cnhArquivoNovoWrap.textContent = '';
        cnhArquivoNovoWrap.classList.add('hidden');
      }
    }
  });

  btnRemoverCnhArquivo?.addEventListener('click', () => {
    guCnhArquivoFile = null;
    guCnhArquivoRemovido = true;

    if (cnhArquivoInput) cnhArquivoInput.value = '';

    if (cnhArquivoNovoWrap) {
      cnhArquivoNovoWrap.textContent = '';
      cnhArquivoNovoWrap.classList.add('hidden');
    }

    if (cnhArquivoAtualWrap) {
      cnhArquivoAtualWrap.classList.add('hidden');
    }
  });



  function setErr(msg) {
    const el = document.getElementById('guErro');
    if (!el) return;
    if (!msg) {
      el.textContent = '';
      el.classList.add('hidden');
      return;
    }
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function setSenhaMsg(msg, tipo = 'ok') {
    const el = document.getElementById('guSenhaMsg');
    if (!el) return;
    if (!msg) {
      el.textContent = '';
      el.className = 'text-xs hidden whitespace-pre-line';
      return;
    }
    el.textContent = msg;
    el.className = `text-xs whitespace-pre-line ${tipo === 'erro' ? 'text-destructive' : 'text-success'}`;
  }

  function fechar() {
    removerModalGestaoUsuario();
  }

  overlay.addEventListener('click', fechar);
  btnFechar?.addEventListener('click', fechar);
  btnCancelar?.addEventListener('click', fechar);

  btnAbaCorp?.addEventListener('click', () => setAbaGestaoUsuario('corporativo'));
  btnAbaPess?.addEventListener('click', () => setAbaGestaoUsuario('pessoal'));
  setAbaGestaoUsuario('corporativo');

  if (isView) return;

  if (!canvas || !ctx) throw new Error('Canvas da foto não disponível.');

  const AVATAR_SIZE = 256;
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;

  function drawGuFoto() {
    if (!guFotoImage) return;

    ctx.clearRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(AVATAR_SIZE / 2, AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      guFotoImage,
      guFotoOffsetX,
      guFotoOffsetY,
      guFotoImage.width * guFotoScale,
      guFotoImage.height * guFotoScale
    );
    ctx.restore();

    previewImg.src = canvas.toDataURL('image/jpeg', 0.9);
    previewImg.classList.remove('hidden');
    placeholder.classList.add('hidden');
  }

  function resetFotoUI() {
    guFotoImage = null;
    guFotoScale = 1;
    guFotoOffsetX = 0;
    guFotoOffsetY = 0;
    guFotoIsDragging = false;

    if (fileInput) fileInput.value = '';
    canvas.classList.add('hidden');
    ctx.clearRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    canvas.style.cursor = 'default';

    if (fotoAtualAbs && !guFotoRemovida) {
      previewImg.src = fotoAtualAbs;
      previewImg.classList.remove('hidden');
      placeholder.classList.add('hidden');
    } else {
      previewImg.removeAttribute('src');
      previewImg.classList.add('hidden');
      placeholder.classList.remove('hidden');
    }
  }

  inpTelCorp?.addEventListener('input', () => {
    inpTelCorp.value = formatarCelularBR(inpTelCorp.value);
  });

  inpTelPess?.addEventListener('input', () => {
    inpTelPess.value = formatarCelularBR(inpTelPess.value);
  });

  inpCpf?.addEventListener('input', () => {
    inpCpf.value = formatarCPF(inpCpf.value);
  });

  btnMostrarAlteracaoSenha?.addEventListener('click', () => {
    blocoAlteracaoSenha?.classList.toggle('hidden');
  });

  fileInput?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file) return;

    guFotoRemovida = false;

    const reader = new FileReader();
    reader.onload = () => {
      guFotoImage = new Image();
      guFotoImage.onload = () => {
        guFotoScale = Math.max(
          AVATAR_SIZE / guFotoImage.width,
          AVATAR_SIZE / guFotoImage.height
        );
        guFotoOffsetX = (AVATAR_SIZE - guFotoImage.width * guFotoScale) / 2;
        guFotoOffsetY = (AVATAR_SIZE - guFotoImage.height * guFotoScale) / 2;
        canvas.classList.remove('hidden');
        placeholder.classList.add('hidden');
        previewImg.classList.remove('hidden');
        drawGuFoto();
        canvas.style.cursor = 'grab';
      };
      guFotoImage.onerror = err => console.error('Erro ao carregar imagem:', err);
      guFotoImage.src = reader.result;
    };
    reader.onerror = err => console.error('Erro no FileReader:', err);
    reader.readAsDataURL(file);
  });

  btnRemoverFoto?.addEventListener('click', () => {
    guFotoRemovida = true;
    resetFotoUI();
  });

  canvas.addEventListener('mousedown', e => {
    if (!guFotoImage) return;
    guFotoIsDragging = true;
    guFotoStartX = e.clientX;
    guFotoStartY = e.clientY;
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!guFotoIsDragging || !guFotoImage) return;
    const dx = e.clientX - guFotoStartX;
    const dy = e.clientY - guFotoStartY;
    guFotoStartX = e.clientX;
    guFotoStartY = e.clientY;
    guFotoOffsetX += dx;
    guFotoOffsetY += dy;
    drawGuFoto();
  });

  window.addEventListener('mouseup', () => {
    guFotoIsDragging = false;
    if (guFotoImage) canvas.style.cursor = 'grab';
  });

  canvas.addEventListener('wheel', e => {
    if (!guFotoImage) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    guFotoScale = Math.max(0.3, Math.min(4, guFotoScale + delta));
    drawGuFoto();
  }, { passive: false });

  btnAddSetor?.addEventListener('click', async () => {
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

  btnAddLocalTrabalho?.addEventListener('click', async () => {
    const nome = prompt('Nome do Centro de Custo:');
    if (!nome) return;

    try {
      await apiSend('/api/gestao-usuarios-locais-trabalho', 'POST', { nome });
      const locaisResp = await apiGet('/api/gestao-usuarios-locais-trabalho');
      cacheLocaisTrabalhoGestao = Array.isArray(locaisResp?.items) ? locaisResp.items : [];
      const sel = document.getElementById('guLocalTrabalho');
      if (sel) sel.innerHTML = optionsFromRows(cacheLocaisTrabalhoGestao, titleCaseNome(nome));
    } catch (err) {
      alert('Erro ao adicionar Centro de Custo: ' + (err?.message || err));
    }
  });

  btnTrocarSenha?.addEventListener('click', async () => {
    setSenhaMsg('');
    const userId = (u.ID ?? u.id);
    const senhaAtual = inputValue('guSenhaAtual').toString();
    const novaSenha = inputValue('guNovaSenha').toString();

    if (!senhaAtual) {
      setSenhaMsg('Informe a senha atual.', 'erro');
      return;
    }

    if (!novaSenha || novaSenha.length < 6) {
      setSenhaMsg('A nova senha deve ter no mínimo 6 caracteres.', 'erro');
      return;
    }

    try {
      btnTrocarSenha.disabled = true;
      await apiSend(`/api/gestao-usuarios/${userId}/senha`, 'PATCH', { senhaAtual, novaSenha });
      setSenhaMsg('Senha alterada com sucesso.', 'ok');
      const a = document.getElementById('guSenhaAtual');
      const b = document.getElementById('guNovaSenha');
      if (a) a.value = '';
      if (b) b.value = '';
      if (blocoAlteracaoSenha) blocoAlteracaoSenha.classList.add('hidden');
    } catch (err) {
      setSenhaMsg(err?.message || 'Erro ao alterar senha.', 'erro');
    } finally {
      btnTrocarSenha.disabled = false;
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setErr('');

    const nome = titleCaseNome(inputValue('guNome'));
    const email = normalizarEmail(inputValue('guEmailCorporativo'));
    const telefone = somenteNumeros(inputValue('guTelefoneCorporativo'));
    const perfil = inputValue('guPerfil').trim();
    const setor = inputValue('guSetor').trim();
    const local_trabalho = inputValue('guLocalTrabalho').trim();
    const status = inputValue('guStatus').trim();

    const cpf = somenteNumeros(inputValue('guCpf'));
    const rg = inputValue('guRg').trim();
    const cnh = inputValue('guCnh').trim();
    const cnh_categoria = inputValue('guCnhCategoria').trim().toUpperCase();
    const cnh_validade = inputValue('guCnhValidade').trim();
    const data_nascimento = inputValue('guDataNascimento').trim();
    const estado_civil = inputValue('guEstadoCivil').trim();
    const telefone_pessoal = somenteNumeros(inputValue('guTelefonePessoal'));
    const emailPessoalBruto = inputValue('guEmailPessoal').trim();
    const email_pessoal = emailPessoalBruto ? normalizarEmail(emailPessoalBruto) : '';

    if (!nome || !email || !perfil || !setor || !status) {
      setErr('Preencha todos os campos obrigatórios da aba corporativa.');
      return;
    }

    

    const btn = document.getElementById('btnSalvarGU');

    try {
      if (btn) {
        btn.disabled = true;
        btn.classList.add('opacity-70');
      }

      let fotoPayload = undefined;

      if (guFotoRemovida && fotoAtualRel) {
        fotoPayload = null;
      } else if (guFotoImage) {
        const blob = await canvasToBlob(canvas, 'image/jpeg', 0.9);
        const up = await apiUploadFotoUsuarioBlob(blob, 'foto-usuario.jpg');
        fotoPayload = up?.item?.url || null;
      }

      let cnhArquivoPayload = undefined;

      if (guCnhArquivoRemovido && cnhArquivoAtualRel) {
        cnhArquivoPayload = null;
      } else if (guCnhArquivoFile) {
        const upCnh = await apiUploadCnhUsuarioArquivo(guCnhArquivoFile);
        cnhArquivoPayload = upCnh?.item?.url || null;
      }

      const payload = {
        nome,
        email,
        telefone,
        perfil,
        setor,
        local_trabalho: local_trabalho || '',
        status,
        cpf: cpf || '',
        rg: rg || '',
        cnh: cnh || '',
        cnh_categoria: cnh_categoria || '',
        cnh_validade: cnh_validade || '',
        data_nascimento: data_nascimento || '',
        estado_civil: estado_civil || '',
        telefone_pessoal: telefone_pessoal || '',
        email_pessoal: email_pessoal || '',
      };

      if (fotoPayload !== undefined) payload.foto = fotoPayload;
      if (cnhArquivoPayload !== undefined) payload.cnh_arquivo = cnhArquivoPayload;

      if (isNew) {
        const senha = inputValue('guSenha').toString();
        if (!senha || senha.length < 6) {
          setErr('Senha inválida (mínimo 6).');
          return;
        }
        payload.senha = senha;
        await apiSend('/api/gestao-usuarios-adicionar', 'POST', payload);
      } else if (isEdit) {
        const userId = u.ID ?? u.id;
        await apiSend(`/api/gestao-usuarios/${userId}`, 'PUT', payload);
      }

      removerModalGestaoUsuario();
      await carregarGestaoUsuarios();
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      setErr(err?.message || 'Erro ao salvar.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('opacity-70');
      }
    }
  });
}

async function apiUploadCnhUsuarioArquivo(file) {
  const base = getApiBaseGestaoUsuarios();
  if (!base) throw new Error('API base não configurada.');

  const url = `${base}/api/gestao-usuarios/cnh`;
  const fd = new FormData();
  fd.append('arquivo', file, file?.name || 'cnh');

  const r = await fetch(url, {
    method: 'POST',
    body: fd,
  });

  const txt = await r.text();
  let data = null;

  try {
    data = txt ? JSON.parse(txt) : null;
  } catch {
    data = null;
  }

  if (!r.ok) {
    const msg = data?.message || data?.error || txt || `HTTP ${r.status}`;
    throw new Error(msg);
  }

  return data;
}

async function abrirModalTrocarFotoPerfil() {
  const userId = sessionStorage.getItem('id');
  if (!userId) {
    alert('Usuário não identificado.');
    return;
  }

  let fotoAtual = document.getElementById('userAvatar')?.dataset?.foto || '';

  try {
    const usuario = await apiGet(`api/gestao-usuarios/${encodeURIComponent(userId)}`);
    const fotoRel =
      usuario?.item?.FOTO ??
      usuario?.item?.foto ??
      usuario?.FOTO ??
      usuario?.foto ??
      '';

    if (fotoRel) {
      fotoAtual = absUrlFromApiGestaoUsuarios(fotoRel);
    }
  } catch (err) {
    console.error('Erro ao carregar foto atual do usuário:', err);
  }

  const overlay = document.createElement('div');
  overlay.id = 'trocarFotoOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]';

  const modal = document.createElement('div');
  modal.id = 'trocarFotoModal';
  modal.className = 'fixed inset-0 z-[100]';

  modal.innerHTML = `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex items-center justify-center p-4">
        <div class="w-full max-w-md glass rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-semibold text-foreground">Alterar foto</h3>
              <p class="text-sm text-muted-foreground">Selecione e ajuste sua foto de perfil.</p>
            </div>
            <button
              id="btnFecharTrocarFoto"
              type="button"
              class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
              aria-label="Fechar"
              title="Fechar">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>

          <form id="formTrocarFotoPerfil" class="px-6 py-6 space-y-4">
            <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-3">
              <label class="text-sm font-medium block">Foto do usuário</label>

              <div class="w-28 h-28 rounded-full overflow-hidden bg-muted flex items-center justify-center mx-auto border border-border">
                <img id="tfFotoPreview" src="${fotoAtual}" alt="Foto do usuário" class="w-full h-full object-cover ${fotoAtual ? '' : 'hidden'}">
                <span id="tfFotoPlaceholder" class="text-xs text-muted-foreground ${fotoAtual ? 'hidden' : ''}">Sem foto</span>
              </div>

              <canvas id="tfFotoCanvas" class="hidden border border-dashed border-border rounded-xl w-full max-h-64 cursor-grab"></canvas>

              <div class="flex flex-col gap-2">
                <input
                  id="tfFotoInput"
                  type="file"
                  accept="image/*"
                  class="w-full rounded-xl border border-border bg-white/70 px-4 py-2 text-sm"
                  autocomplete="off"
                />
                <button
                  id="btnRemoverFotoPerfil"
                  type="button"
                  class="rounded-xl border border-border bg-white/60 px-4 py-2 text-sm hover:bg-white/90 transition-all">
                  Remover foto
                </button>
              </div>

              <p class="text-xs text-muted-foreground">
                Selecione uma imagem e use arraste/zoom para ajustar.
              </p>
            </div>

            <p id="trocarFotoErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

            <div class="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                id="btnCancelarTrocarFoto"
                type="button"
                class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all">
                Cancelar
              </button>
              <button
                id="btnSalvarTrocarFoto"
                type="submit"
                class="sm:flex-1 rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                Salvar foto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  const fileInput = document.getElementById('tfFotoInput');
  const canvas = document.getElementById('tfFotoCanvas');
  const previewImg = document.getElementById('tfFotoPreview');
  const placeholder = document.getElementById('tfFotoPlaceholder');
  const btnRemover = document.getElementById('btnRemoverFotoPerfil');
  const btnFechar = document.getElementById('btnFecharTrocarFoto');
  const btnCancelar = document.getElementById('btnCancelarTrocarFoto');
  const form = document.getElementById('formTrocarFotoPerfil');
  const ctx = canvas?.getContext('2d');

  let fotoImage = null;
  let fotoScale = 1;
  let fotoOffsetX = 0;
  let fotoOffsetY = 0;
  let fotoIsDragging = false;
  let fotoStartX = 0;
  let fotoStartY = 0;
  let fotoRemovida = false;

  function fechar() {
    overlay.remove();
    modal.remove();
  }

  function setErr(msg) {
    const el = document.getElementById('trocarFotoErro');
    if (!el) return;
    el.textContent = msg || '';
    el.classList.toggle('hidden', !msg);
  }

  const AVATAR_SIZE = 256;
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;

  function drawFoto() {
    if (!fotoImage) return;
    ctx.clearRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(AVATAR_SIZE / 2, AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      fotoImage,
      fotoOffsetX,
      fotoOffsetY,
      fotoImage.width * fotoScale,
      fotoImage.height * fotoScale
    );
    ctx.restore();

    previewImg.src = canvas.toDataURL('image/jpeg', 0.9);
    previewImg.classList.remove('hidden');
    placeholder.classList.add('hidden');
  }

  function resetFotoUI() {
    fotoImage = null;
    fotoScale = 1;
    fotoOffsetX = 0;
    fotoOffsetY = 0;
    fotoIsDragging = false;
    if (fileInput) fileInput.value = '';
    canvas.classList.add('hidden');
    ctx.clearRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    canvas.style.cursor = 'default';

    if (fotoAtual && !fotoRemovida) {
      previewImg.src = fotoAtual;
      previewImg.classList.remove('hidden');
      placeholder.classList.add('hidden');
    } else {
      previewImg.removeAttribute('src');
      previewImg.classList.add('hidden');
      placeholder.classList.remove('hidden');
    }
  }

  overlay.addEventListener('click', fechar);
  btnFechar?.addEventListener('click', fechar);
  btnCancelar?.addEventListener('click', fechar);

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    fotoRemovida = false;
    const reader = new FileReader();

    reader.onload = () => {
      fotoImage = new Image();
      fotoImage.onload = () => {
        fotoScale = Math.max(
          AVATAR_SIZE / fotoImage.width,
          AVATAR_SIZE / fotoImage.height
        );
        fotoOffsetX = (AVATAR_SIZE - fotoImage.width * fotoScale) / 2;
        fotoOffsetY = (AVATAR_SIZE - fotoImage.height * fotoScale) / 2;

        canvas.classList.remove('hidden');
        previewImg.classList.remove('hidden');
        placeholder.classList.add('hidden');
        drawFoto();
        canvas.style.cursor = 'grab';
      };
      fotoImage.src = reader.result;
    };

    reader.readAsDataURL(file);
  });

  btnRemover?.addEventListener('click', () => {
    fotoRemovida = true;
    resetFotoUI();
  });

  canvas?.addEventListener('mousedown', (e) => {
    if (!fotoImage) return;
    fotoIsDragging = true;
    fotoStartX = e.clientX;
    fotoStartY = e.clientY;
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!fotoIsDragging || !fotoImage) return;
    const dx = e.clientX - fotoStartX;
    const dy = e.clientY - fotoStartY;
    fotoStartX = e.clientX;
    fotoStartY = e.clientY;
    fotoOffsetX += dx;
    fotoOffsetY += dy;
    drawFoto();
  });

  window.addEventListener('mouseup', () => {
    fotoIsDragging = false;
    if (fotoImage) canvas.style.cursor = 'grab';
  });

  canvas?.addEventListener('wheel', (e) => {
    if (!fotoImage) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    fotoScale = Math.max(0.3, Math.min(4, fotoScale + delta));
    drawFoto();
  }, { passive: false });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setErr('');

    const btn = document.getElementById('btnSalvarTrocarFoto');

    try {
      btn.disabled = true;
      btn.classList.add('opacity-70');

      let fotoPayload = null;

      if (fotoRemovida) {
        fotoPayload = null;
      } else if (fotoImage) {
        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, 'image/jpeg', 0.9)
        );
        const up = await apiUploadFotoUsuarioBlob(blob, 'foto-usuario.jpg');
        fotoPayload = up?.item?.url || null;
      } else {
        fotoPayload = fotoAtual || null;
      }

      await apiSend(`/api/gestao-usuarios/${userId}/foto`, 'PATCH', { foto: fotoPayload });

      if (fotoPayload) {
        sessionStorage.setItem('userFoto', fotoPayload);
      } else {
        sessionStorage.removeItem('userFoto');
      }

      const avatar = document.getElementById('userAvatar');
      if (avatar) {
        avatar.dataset.foto = fotoPayload || '';
      }

      renderSidebarAvatar();
      fechar();

    } catch (err) {
      console.error(err);
      setErr(err?.message || 'Erro ao salvar foto.');
    } finally {
      btn.disabled = false;
      btn.classList.remove('opacity-70');
    }
  });
}


// ===== LIGAÇÕES =====

document.addEventListener('click', (e) => {
  const item = e.target.closest('.menu-item[data-page]');
  if (!item) return;

  const page = item.dataset.page;
  if (page !== 'user-management') return;

  carregarGestaoUsuarios();
});

document.addEventListener('click', (e) => {
  const btn = e.target.closest('#btnNovoUsuario');
  if (!btn) return;

  abrirModalGestaoUsuario({ modo: 'new' });
});

document.addEventListener('click', async (e) => {
  const btnView = e.target.closest('.btnViewUsuario');
  const btnEdit = e.target.closest('.btnEditUsuario');
  const btnDel = e.target.closest('.btnDelUsuario');

  if (btnView) {
    const id = btnView.dataset.id;

    try {
      const resp = await apiGet(`/api/gestao-usuarios/${id}`);
      const dados = resp?.item || resp;
      abrirModalGestaoUsuario({ modo: 'view', usuario: dados });
    } catch (err) {
      console.error('Erro ao abrir visualização:', err);
      alert('Erro ao abrir visualização: ' + (err?.message || err));
    }

    return;
  }

  if (btnEdit) {
    const id = btnEdit.dataset.id;

    try {
      const resp = await apiGet(`/api/gestao-usuarios/${id}`);
      const dados = resp?.item || resp;
      abrirModalGestaoUsuario({ modo: 'edit', usuario: dados });
    } catch (err) {
      console.error('Erro ao abrir edição:', err);
      alert('Erro ao abrir edição: ' + (err?.message || err));
    }

    return;
  }

  if (btnDel) {
    const id = btnDel.dataset.id;

    if (!confirm('Confirma excluir este usuário?')) return;

    try {
      await apiSend(`/api/gestao-usuarios/${id}`, 'DELETE');
      await carregarGestaoUsuarios();
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir: ' + (err?.message || err));
    }
  }
});



// ===== Gestão de Pedido =====//

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

// Marketing

function absUrlFromApiMarketing(relOrAbs, apiBase) {
  const s = String(relOrAbs || '').trim();
  if (!s) return '';

  // Se já for absoluta (http/https), mantém
  if (/^https?:\/\//i.test(s)) return s;

  // Resolve relativo usando URL API (padrão correto)
  return new URL(s, apiBase + '/').href;
}

async function listarImagensMarketing() {
  try {
    const APIBASE = getApiBase();

    const grid = document.getElementById('gridMarketing');
    const vazio = document.getElementById('marketingVazio');

    if (!grid || !vazio) return;

    mostrarMsgMarketing('Carregando imagens...');

    const r = await fetch(`${APIBASE}/api/marketing/imagens`, { method: 'GET' });
    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      throw new Error(data?.message || 'Erro ao listar imagens.');
    }

    const itens = Array.isArray(data.items)
      ? data.items
      : Array.isArray(data)
        ? data
        : [];

    grid.innerHTML = '';

    if (!itens.length) {
      vazio.classList.remove('hidden');
      mostrarMsgMarketing('');
      return;
    }

    vazio.classList.add('hidden');

    grid.innerHTML = itens.map((it) => {
      const nome = it?.name || it?.nome || '';
      const urlRel = it?.url || it?.path || '';
      const urlAbs = absUrlFromApiMarketing(urlRel, APIBASE);

      return `
        <div class="rounded-2xl border border-border bg-white/60 overflow-hidden shadow-sm">
          <button
            type="button"
            class="w-full aspect-[4/3] bg-muted/30 overflow-hidden"
            title="Visualizar"
            onclick="abrirImagemMarketing('${escapeHtml(urlAbs)}')">
            <img
              src="${escapeHtml(urlAbs)}"
              alt="${escapeHtml(nome)}"
              class="w-full h-full object-cover" />
          </button>

          <div class="p-3 flex items-center justify-between gap-2">
            <div class="min-w-0">
              <div class="text-sm font-semibold truncate">${escapeHtml(nome)}</div>
            </div>

            <button
              type="button"
              class="w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-destructive hover:text-white transition-all flex items-center justify-center shrink-0"
              title="Remover"
              onclick="removerImagemMarketing('${escapeHtml(nome)}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    mostrarMsgMarketing('');
  } catch (e) {
    console.error('Erro em listarImagensMarketing:', e);
    mostrarMsgMarketing(e?.message || 'Erro ao carregar imagens.');
  }
}

function abrirImagemMarketing(urlAbs) {
  if (!urlAbs) return;
  window.open(urlAbs, '_blank', 'noopener,noreferrer');
}

async function enviarImagensMarketing(files) {
  const APIBASE = getApiBase();

  if (!files || !files.length) {
    console.warn('Nenhum arquivo recebido para upload.');
    return;
  }

  const fd = new FormData();

  for (const f of files) {

    fd.append('files', f);
  }

  for (const [key, value] of fd.entries()) {
    if (value instanceof File) {
    } else {
    }
  }

  mostrarMsgMarketing('Enviando...');


  const r = await fetch(`${APIBASE}/api/marketing/imagens`, {
    method: 'POST',
    body: fd
  });


  const data = await r.json().catch((err) => {
    console.error('Erro ao converter resposta para JSON:', err);
    return {};
  });


  if (!r.ok) {
    console.error('Erro no upload:', data);
    throw new Error(data?.message || 'Erro ao enviar imagens.');
  }

  mostrarMsgMarketing('Enviado com sucesso.');
  await listarImagensMarketing();
}


async function removerImagemMarketing(nomeArquivo) {
  const APIBASE = getApiBase();
  if (!nomeArquivo) return;

  if (!confirm(`Remover a imagem "${nomeArquivo}"?`)) return;

  mostrarMsgMarketing('Removendo...');

  const r = await fetch(`${APIBASE}/api/marketing/imagens/${encodeURIComponent(nomeArquivo)}`, {
    method: 'DELETE'
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || 'Erro ao remover imagem.');

  await listarImagensMarketing();
  mostrarMsgMarketing('');
}

document.getElementById('btnAtualizarMarketing')?.addEventListener('click', () => {
  listarImagensMarketing().catch(e => {
    console.error(e);
    alert(e.message || e);
  });
});

function inicializarUploadMarketing() {
  const btn = document.getElementById('btnAdicionarMarketing');
  const input = document.getElementById('inputImagensMarketing');

  if (!btn || !input) {
    console.warn('Botão ou input de marketing não encontrado.');
    return;
  }

  btn.addEventListener('click', () => {
    input.value = '';
    input.click();
  });

  input.addEventListener('change', async (e) => {
    const files = e.target.files;


    if (files?.length) {
      Array.from(files).forEach((f, i) => {
      });
    }

    try {
      await enviarImagensMarketing(files);
    } catch (err) {
      console.error('Erro no evento de upload:', err);
      alert(err.message || err);
    } finally {
      input.value = '';
    }
  });
}

document.addEventListener('DOMContentLoaded', inicializarUploadMarketing);

document.addEventListener('click', (e) => {
  const item = e.target.closest('.menu-item[data-page]');
  if (!item) return;

  if (item.dataset.page === 'secao-marketing') {
    listarImagensMarketing().catch(err => {
      console.error(err);
      mostrarMsgMarketing(err.message || 'Erro ao carregar imagens.');
    });
  }
});

let marketingProgressTimer = null;
let marketingLoopIndex = 0;
let marketingLoopUrls = [];
let marketingBirthdayItems = [];
let marketingLoopLastFetchMs = 0;
let marketingIntervalMsAtual = 20000;
let marketingTickStartedAt = 0;
let marketingMostrandoBirthdayCard = false;
let marketingBirthdayExpandedItem = null;
let marketingSlidePauseUntil = 0;
let marketingLoopTimer = null;
let marketingLoopIntervalMs = 20000;
let marketingLoopStartAt = 0;
let marketingLoopRemainingMs = 20000;
let marketingLoopPaused = false;
let marketingProgressFrame = null;

function aplicarCorBarraMarketingPorApiBase() {
  const apiBase = String(sessionStorage.getItem('api_base') || '').toLowerCase();
  const barra = document.getElementById('painelMarketingProgress');
  if (!barra) return;

  barra.style.backgroundColor = apiBase.includes('copy') ? '#dc2626' : '';
}

function obterBarraProgressoMarketing() {
  const barra = document.getElementById('painelMarketingProgress');
  if (!barra) return null;

  const apiBase = String(sessionStorage.getItem('api_base') || '').toLowerCase();

  if (apiBase.includes('copy')) {
    barra.style.backgroundColor = '#ff0000';
  } else {
    barra.style.backgroundColor = '';
  }

  return barra;
}

function pararAnimacaoBarraMarketing() {
  if (marketingProgressFrame) {
    cancelAnimationFrame(marketingProgressFrame);
    marketingProgressFrame = null;
  }
}

function atualizarBarraMarketingManual() {
  const barra = obterBarraProgressoMarketing();
  if (!barra) return;

  const decorrido = Date.now() - marketingLoopStartAt;
  const percentual = Math.max(0, Math.min(100, (decorrido / marketingLoopIntervalMs) * 100));
  barra.style.width = `${percentual}%`;
}

function iniciarAnimacaoBarraMarketing() {
  pararAnimacaoBarraMarketing();

  const barra = obterBarraProgressoMarketing();
  if (!barra) return;

  function frame() {
    if (marketingLoopPaused || marketingBirthdayExpandedItem) return;

    atualizarBarraMarketingManual();
    marketingProgressFrame = requestAnimationFrame(frame);
  }

  marketingProgressFrame = requestAnimationFrame(frame);
}

function resetarBarraMarketing() {
  const barra = obterBarraProgressoMarketing();
  if (!barra) return;
  barra.style.width = '0%';
}

function pausarLoopMarketingPainel() {
  if (marketingLoopPaused) return;

  marketingLoopPaused = true;

  const agora = Date.now();
  const decorrido = marketingLoopStartAt ? agora - marketingLoopStartAt : 0;
  marketingLoopRemainingMs = Math.max(0, marketingLoopRemainingMs - decorrido);

  limparTimerMarketing();
  pararAnimacaoBarraMarketing();
  pararAnimacaoProgressoMarketing(); // importante
  atualizarBarraMarketingManual();
}

function retomarLoopMarketingPainel() {
  marketingLoopPaused = false;

  const tempoRestante = marketingLoopRemainingMs > 0
    ? marketingLoopRemainingMs
    : marketingLoopIntervalMs;

  limparTimerMarketing();
  pararAnimacaoBarraMarketing();

  marketingLoopStartAt = Date.now() - (marketingLoopIntervalMs - tempoRestante);

  const barra = obterBarraProgressoMarketing();
  if (barra) {
    const percentualInicial = ((marketingLoopIntervalMs - tempoRestante) / marketingLoopIntervalMs) * 100;
    barra.style.width = `${Math.max(0, Math.min(100, percentualInicial))}%`;
  }

  iniciarAnimacaoBarraMarketing();

  marketingLoopTimer = setTimeout(() => {
    if (marketingBirthdayExpandedItem || marketingLoopPaused) return;
    proximoSlideMarketingPainel();
  }, tempoRestante);
}

function abrirBirthdayDetalhe(item) {
  if (!item) return;

  marketingBirthdayExpandedItem = item;
  pausarLoopMarketingPainel();

  renderBirthdayCardMarketing([item], {
    pagina: 1,
    totalPaginas: 1,
    expandido: true
  });
}

function fecharBirthdayDetalhe() {
  marketingBirthdayExpandedItem = null;

  pararAnimacaoProgressoMarketing();

  const infoAtual = obterSlidePorIndice(marketingLoopIndex);
  if (infoAtual?.slide?.tipo === 'birthday') {
    renderBirthdayCardMarketing(infoAtual.slide.items, {
      pagina: infoAtual.slide.pagina,
      totalPaginas: infoAtual.slide.totalPaginas,
      expandido: false
    });
  }

  retomarLoopMarketingPainel();
}

function limparTimerMarketing() {
  if (marketingLoopTimer) {
    clearTimeout(marketingLoopTimer);
    marketingLoopTimer = null;
  }
}

function agendarProximoSlideMarketingPainel(tempoMs = marketingLoopIntervalMs) {
  limparTimerMarketing();
  pararAnimacaoBarraMarketing();

  if (marketingBirthdayExpandedItem || marketingLoopPaused) return;

  marketingLoopRemainingMs = tempoMs;
  marketingLoopStartAt = Date.now();

  resetarBarraMarketing();
  iniciarAnimacaoBarraMarketing();

  marketingLoopTimer = setTimeout(() => {
    if (marketingBirthdayExpandedItem || marketingLoopPaused) return;
    proximoSlideMarketingPainel();
  }, tempoMs);
}


function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
}

async function proximoSlideMarketingPainel() {
  if (marketingBirthdayExpandedItem || marketingLoopPaused) return;

  try {
    await ensureListFresh();

    if (marketingBirthdayExpandedItem || marketingLoopPaused) return;

    limparTimerMarketing();
    pararAnimacaoBarraMarketing();
    resetarBarraMarketing();

    marketingLoopRemainingMs = marketingLoopIntervalMs;

    exibirSlideMarketing(marketingLoopIndex + 1, false);
    agendarProximoSlideMarketingPainel(marketingLoopIntervalMs);
  } catch (err) {
    console.error('Erro ao avançar slide do marketing:', err);

    marketingLoopRemainingMs = marketingLoopIntervalMs;
    agendarProximoSlideMarketingPainel(marketingLoopIntervalMs);
  }
}


function atualizarBarraProgressoMarketing(percentual) {
  const bar = document.getElementById('painelMarketingProgress');
  if (!bar) return;
  bar.style.width = `${Math.max(0, Math.min(100, percentual))}%`;
}

function obterTotalSlidesMarketing() {
  return marketingLoopUrls.length + (marketingBirthdayItems.length ? 1 : 0);
}

function slideAtualEhBirthdayCard() {
  return marketingBirthdayItems.length > 0 && marketingLoopIndex === 0;
}

function atualizarContadorMarketingPainel() {
  const contador = document.getElementById('painelMarketingContador');
  if (!contador) return;

  const total = obterTotalSlidesMarketing() || 1;
  const atual = total ? (marketingLoopIndex % total) + 1 : 1;
  contador.textContent = `${atual} / ${total}`;
}

function pararAnimacaoProgressoMarketing() {
  if (marketingProgressTimer) clearInterval(marketingProgressTimer);
  marketingProgressTimer = null;
}

function iniciarAnimacaoProgressoMarketing(onComplete) {
  pararAnimacaoProgressoMarketing();

  marketingTickStartedAt = Date.now();
  atualizarBarraProgressoMarketing(0);

  marketingProgressTimer = setInterval(() => {
    const decorrido = Date.now() - marketingTickStartedAt;
    const percentual = (decorrido / marketingIntervalMsAtual) * 100;

    atualizarBarraProgressoMarketing(percentual);

    if (percentual >= 100) {
      pararAnimacaoProgressoMarketing();
      atualizarBarraProgressoMarketing(100);

      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  }, 100);
}

function obterPrimeiroEUltimoNome(nomeCompleto) {
  const partes = String(nomeCompleto || '').trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return '';
  if (partes.length === 1) return partes[0];
  return `${partes[0]} ${partes[partes.length - 1]}`;
}

function obterIniciais(nomeCompleto) {
  const partes = String(nomeCompleto || '').trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return '??';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0] || ''}${partes[partes.length - 1][0] || ''}`.toUpperCase();
}

function parseDataNascimentoSeguro(valor) {
  if (!valor) return null;

  if (typeof valor === 'string') {
    const mysql = valor.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (mysql) {
      return {
        ano: Number(mysql[1]),
        mes: Number(mysql[2]),
        dia: Number(mysql[3])
      };
    }

    const br = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br) {
      return {
        ano: Number(br[3]),
        mes: Number(br[2]),
        dia: Number(br[1])
      };
    }
  }

  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return null;

  return {
    ano: d.getFullYear(),
    mes: d.getMonth() + 1,
    dia: d.getDate()
  };
}

function formatarDiaMes(dataNascimento) {
  const p = parseDataNascimentoSeguro(dataNascimento);
  if (!p) return '--/--';
  return `${String(p.dia).padStart(2, '0')}/${String(p.mes).padStart(2, '0')}`;
}

function isAniversarioHoje(dataNascimento) {
  const p = parseDataNascimentoSeguro(dataNascimento);
  if (!p) return false;
  const hoje = new Date();
  return p.dia === hoje.getDate() && p.mes === (hoje.getMonth() + 1);
}

function normalizarFotoAniversariante(foto, apiBase) {
  if (!foto) return '';

  const valor = String(foto).trim();
  if (!valor) return '';

  if (valor.startsWith('http://') || valor.startsWith('https://')) return valor;
  if (valor.startsWith('/')) return `${apiBase}${valor}`;
  return `${apiBase}/${valor.replace(/^\/+/, '')}`;
}

function esconderBirthdayCardMarketing() {
  const birthdayEl = document.getElementById('painelBirthdayCard');
  if (!birthdayEl) return;

  birthdayEl.style.opacity = '0';
  birthdayEl.style.pointerEvents = 'none';
  birthdayEl.style.display = 'none';
  birthdayEl.innerHTML = '';
}

function mostrarImagemMarketingArea() {
  const imgEl = document.getElementById('painelMarketingImg');
  if (!imgEl) return;

  imgEl.style.display = 'block';
  imgEl.style.pointerEvents = 'auto';
}

function esconderImagemMarketingArea() {
  const imgEl = document.getElementById('painelMarketingImg');
  if (!imgEl) return;

  imgEl.style.opacity = '0';
  imgEl.style.pointerEvents = 'none';

  setTimeout(() => {
    imgEl.style.display = 'none';
  }, 180);
}

function renderBirthdayCardMarketing(items, { pagina = 1, totalPaginas = 1, expandido = false } = {}) {
  const birthdayEl = document.getElementById('painelBirthdayCard');
  const imgEl = document.getElementById('painelMarketingImg');

  if (!birthdayEl || !imgEl) return;

  const total = Array.isArray(items) ? items.length : 0;

  if (!total) {
    esconderBirthdayCardMarketing();
    return;
  }

  const quantidadePorPagina = expandido ? 1 : obterQuantidadeAniversariantesPorPagina();
  const classeModoGrid = expandido ? 'modo-detalhe' : `modo-${quantidadePorPagina}`;

  marketingMostrandoBirthdayCard = true;

  imgEl.style.opacity = '0';
  imgEl.style.pointerEvents = 'none';

  setTimeout(() => {
    imgEl.style.display = 'none';

    birthdayEl.innerHTML = `
      <div class="painel-birthday-card elegante ${expandido ? 'is-expanded' : ''}">
        <div class="painel-birthday-paper"></div>
        <div class="painel-birthday-decor decor-1"></div>
        <div class="painel-birthday-decor decor-2"></div>
        <div class="painel-birthday-decor decor-3"></div>

        ${
          expandido ? `
            ${(() => {
              const item = items[0];
              const nome = obterPrimeiroEUltimoNome(item.nome);
              const data = formatarDiaMes(item.dataNascimento);
              const iniciais = obterIniciais(item.nome);
              const foto = item.foto
                ? `<img src="${item.foto}" alt="${nome}" onerror="this.closest('.painel-birthday-photo').innerHTML='<span class=&quot;painel-birthday-no-photo&quot;>${iniciais}</span>'" />`
                : `<span class="painel-birthday-no-photo">${iniciais}</span>`;

              return `
                <div class="painel-birthday-detail-wrap">
                  <button
                    type="button"
                    class="painel-birthday-detail-close"
                    onclick="fecharBirthdayDetalhe()"
                    aria-label="Fechar detalhe do aniversariante"
                    title="Fechar"
                  >
                    <i class="fas fa-times"></i>
                  </button>

                  <div class="painel-birthday-detail-card ${item.aniversarioHoje ? 'is-today' : ''}">
                    <div class="painel-birthday-detail-photo">
                      <div class="painel-birthday-photo painel-birthday-photo--detail">
                        ${foto}
                      </div>
                    </div>

                    <div class="painel-birthday-detail-content">
                      <div class="painel-birthday-mini-title">🎉 Aniversariante</div>
                      <div class="painel-birthday-detail-name">${nome || 'Sem nome'}</div>
                      <div class="painel-birthday-detail-date">🎂 ${data}</div>
                      <div class="painel-birthday-detail-meta">
                        <span><i class="fas fa-briefcase"></i> ${item.setor || '-'}</span>
                        <span><i class="fas fa-location-dot"></i> ${item.localTrabalho || '-'}</span>
                      </div>
                      <div class="painel-birthday-detail-message">
                        Desejamos um aniversário repleto de alegria, saúde, paz e muitas conquistas.
                      </div>
                    </div>
                  </div>
                </div>
              `;
            })()}
          `
          : `
            <div class="painel-birthday-layout">
              <div class="painel-birthday-left">
                <div class="painel-birthday-people-grid fixed-responsive ${classeModoGrid}">
                  ${items.map(item => {
                    const nome = obterPrimeiroEUltimoNome(item.nome);
                    const data = formatarDiaMes(item.dataNascimento);
                    const iniciais = obterIniciais(item.nome);
                    const foto = item.foto
                      ? `<img src="${item.foto}" alt="${nome}" onerror="this.closest('.painel-birthday-photo').innerHTML='<span class=&quot;painel-birthday-no-photo&quot;>${iniciais}</span>'" />`
                      : `<span class="painel-birthday-no-photo">${iniciais}</span>`;

                    const itemEscapado = encodeURIComponent(JSON.stringify(item));

                    return `
                      <button
                        type="button"
                        class="painel-birthday-person ${item.aniversarioHoje ? 'is-today' : ''}"
                        onclick="abrirBirthdayDetalhe(JSON.parse(decodeURIComponent('${itemEscapado}')))"
                      >
                        <div class="painel-birthday-photo-wrap">
                          <div class="painel-birthday-photo">
                            ${foto}
                          </div>
                        </div>

                        <div class="painel-birthday-person-info">
                          <div class="painel-birthday-person-name">${nome || 'Sem nome'}</div>
                          <div class="painel-birthday-person-date">🎂 ${data}</div>
                          <div class="painel-birthday-person-meta">${item.setor || '-'}</div>
                          <div class="painel-birthday-person-meta">${item.localTrabalho || '-'}</div>
                        </div>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>

              <div class="painel-birthday-right">
                <div class="painel-birthday-right-inner">
                  <div class="painel-birthday-mini-title">🎉 Aniversariantes do mês</div>
                  <div class="painel-birthday-big-title">
                    Feliz<br>
                    <span>Aniversário</span>
                  </div>
                  <div class="painel-birthday-line"></div>
                  <div class="painel-birthday-message">
                    Parabenizamos todos os aniversariantes deste mês e desejamos
                    muito sucesso, saúde, alegria e realizações. Que esta nova fase
                    seja repleta de conquistas e bons momentos.
                  </div>
                  <div class="painel-birthday-count">
                    Card ${pagina} de ${totalPaginas}
                  </div>
                </div>
              </div>
            </div>
          `
        }
      </div>
    `;

    birthdayEl.style.display = 'block';
    birthdayEl.style.pointerEvents = 'auto';

    requestAnimationFrame(() => {
      birthdayEl.style.opacity = '1';
    });

    atualizarContadorMarketingPainel();

    if (!expandido && !marketingBirthdayExpandedItem && !marketingLoopPaused) {
      agendarProximoSlideMarketingPainel(marketingLoopIntervalMs);
    }
  }, 180);
}

async function fetchMarketingUrls() {
  const APIBASE = getApiBase();
  const r = await fetch(`${APIBASE}/api/marketing/imagens`, { method: 'GET' });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || 'Erro ao listar imagens.');

  const itens = Array.isArray(data.items) ? data.items : [];
  return itens
    .map(it => absUrlFromApiMarketing(it.url, APIBASE))
    .filter(Boolean);
}

async function fetchAniversariantesMes() {
  const APIBASE = getApiBase();
  const r = await fetch(`${APIBASE}/api/aniversariantes/mes`, { method: 'GET' });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || 'Erro ao listar aniversariantes do mês.');

  const itens = Array.isArray(data.items) ? data.items : [];

  return itens.map(item => ({
    id: item.id,
    nome: item.nome || '',
    setor: item.setor || '',
    localTrabalho: item.localTrabalho || '',
    foto: normalizarFotoAniversariante(item.foto, APIBASE),
    dataNascimento: item.dataNascimento || null,
    aniversarioHoje: Boolean(item.aniversarioHoje) || isAniversarioHoje(item.dataNascimento)
  }));
}

function obterQuantidadeAniversariantesPorPagina() {
  const largura = window.innerWidth;
  const altura = window.innerHeight;

  if (largura <= 640) {
    return 4;
  }

  const desktopCompacto = altura <= 820 || window.devicePixelRatio >= 1.25;

  return desktopCompacto ? 6 : 8;
}

function agruparAniversariantesPorPagina(items) {
  const lista = Array.isArray(items) ? items : [];
  const tamanhoPagina = obterQuantidadeAniversariantesPorPagina();
  const grupos = [];

  for (let i = 0; i < lista.length; i += tamanhoPagina) {
    grupos.push(lista.slice(i, i + tamanhoPagina));
  }

  return grupos;
}

let resizeBirthdayTimer = null;

window.addEventListener('resize', () => {
  clearTimeout(resizeBirthdayTimer);

  resizeBirthdayTimer = setTimeout(() => {
    exibirSlideMarketing(marketingLoopIndex, { reiniciarTempo: true });
  }, 180);
});


function obterSlidePorIndice(index) {
  const slides = [];
  const gruposAniversariantes = agruparAniversariantesPorPagina(marketingBirthdayItems);

  gruposAniversariantes.forEach((grupo, grupoIndex) => {
    slides.push({
      tipo: 'birthday',
      items: grupo,
      pagina: grupoIndex + 1,
      totalPaginas: gruposAniversariantes.length
    });
  });

  marketingLoopUrls.forEach(url => {
    slides.push({
      tipo: 'imagem',
      url
    });
  });

  if (!slides.length) {
    slides.push({
      tipo: 'fallback',
      url: 'imagens/PaginaPrincipal.jpg'
    });
  }

  const indiceNormalizado = ((index % slides.length) + slides.length) % slides.length;

  return {
    slide: slides[indiceNormalizado],
    indexNormalizado: indiceNormalizado,
    total: slides.length
  };
}

function exibirSlideMarketing(index, { reiniciarTempo = true } = {}) {
  const imgEl = document.getElementById('painelMarketingImg');
  const birthdayEl = document.getElementById('painelBirthdayCard');

  if (!imgEl || !birthdayEl) return;

  const { slide, indexNormalizado } = obterSlidePorIndice(index);
  marketingLoopIndex = indexNormalizado;
  atualizarContadorMarketingPainel();

  if (slide.tipo === 'birthday') {
    renderBirthdayCardMarketing(
      slide.items,
      slide.pagina,
      slide.totalPaginas,
      false
    );
    return;
  }

  marketingMostrandoBirthdayCard = false;
  esconderBirthdayCardMarketing();
  mostrarImagemMarketingArea();

  const url = slide.url || 'imagens/PaginaPrincipal.jpg';

  preloadImage(url)
    .then(() => {
      imgEl.style.opacity = 0;

      setTimeout(() => {
        imgEl.style.display = 'block';
        imgEl.src = url;
        imgEl.dataset.currentUrl = url;
        imgEl.style.opacity = 1;

        atualizarContadorMarketingPainel();

        if (reiniciarTempo) {
          agendarProximoSlideMarketingPainel(marketingLoopIntervalMs);
        }
      }, 150);
    })
    .catch(() => {
      imgEl.style.display = 'block';
      imgEl.src = 'imagens/PaginaPrincipal.jpg';
      imgEl.dataset.currentUrl = 'imagens/PaginaPrincipal.jpg';
      imgEl.style.opacity = 1;

      atualizarContadorMarketingPainel();

      if (reiniciarTempo) {
        agendarProximoSlideMarketingPainel(marketingLoopIntervalMs);
      }
    });
}

async function iniciarLoopMarketingPainel({
  imgId = 'painelMarketingImg',
  fallbackSrc = 'imagens/PaginaPrincipal.jpg',
  intervalMs = 20000,
  refreshListEveryMs = 60000
} = {}) {
  marketingLoopIntervalMs = intervalMs;
  marketingLoopRemainingMs = intervalMs;

  const el = document.getElementById(imgId);
  const btnAnterior = document.getElementById('btnPainelAnterior');
  const btnProximo = document.getElementById('btnPainelProximo');

  if (!el) return;

  marketingIntervalMsAtual = intervalMs;
  el.dataset.currentUrl = el.src || fallbackSrc;

  el.onclick = () => {
    if (marketingMostrandoBirthdayCard) return;
    const url = el.dataset.currentUrl || el.src;
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  async function ensureListFresh() {
    const now = Date.now();

    if (
      now - marketingLoopLastFetchMs < refreshListEveryMs &&
      (marketingLoopUrls.length || marketingBirthdayItems.length)
    ) {
      return;
    }

    marketingLoopLastFetchMs = now;

    try {
      const [urlsNovas, aniversariantes] = await Promise.all([
        fetchMarketingUrls().catch(() => []),
        fetchAniversariantesMes().catch(() => [])
      ]);

      const slideAtual = obterSlidePorIndice(marketingLoopIndex);
      const slideAtualTipo = slideAtual.slide?.tipo;
      const slideAtualUrl = slideAtual.slide?.url || '';

      marketingLoopUrls = urlsNovas;
      marketingBirthdayItems = aniversariantes;

      const totalNovo = obterTotalSlidesMarketing() || 1;

      if (slideAtualTipo === 'birthday' && marketingBirthdayItems.length) {
        marketingLoopIndex = 0;
      } else if (slideAtualTipo === 'imagem' && slideAtualUrl) {
        const idxImagem = marketingLoopUrls.indexOf(slideAtualUrl);

        if (marketingBirthdayItems.length) {
          marketingLoopIndex = idxImagem >= 0 ? idxImagem + 1 : 0;
        } else {
          marketingLoopIndex = idxImagem >= 0 ? idxImagem : 0;
        }
      } else {
        marketingLoopIndex = 0;
      }

      if (marketingLoopIndex >= totalNovo) {
        marketingLoopIndex = 0;
      }

      atualizarContadorMarketingPainel();
    } catch (err) {
      console.error('Erro ao atualizar lista do marketing:', err);
      marketingLoopUrls = [];
      marketingBirthdayItems = [];
      marketingLoopIndex = 0;
      el.src = fallbackSrc;
      el.dataset.currentUrl = fallbackSrc;
      atualizarBarraProgressoMarketing(0);
      atualizarContadorMarketingPainel();
    }
  }

  async function proximoSlideMarketingPainel() {
    if (marketingBirthdayExpandedItem || marketingLoopPaused) return;

    try {
      await ensureListFresh();

      if (marketingBirthdayExpandedItem || marketingLoopPaused) return;

      limparTimerMarketing();
      pararAnimacaoBarraMarketing();
      resetarBarraMarketing();

      marketingLoopPaused = false;
      marketingBirthdayExpandedItem = null;
      marketingLoopRemainingMs = marketingLoopIntervalMs;

      exibirSlideMarketing(marketingLoopIndex + 1, { reiniciarTempo: true });
    } catch (err) {
      console.error('Erro ao avançar slide do marketing:', err);
      agendarProximoSlideMarketingPainel(marketingLoopIntervalMs);
    }
  }

  window.proximoSlideMarketingPainel = proximoSlideMarketingPainel;

  btnAnterior?.replaceWith(btnAnterior.cloneNode(true));
  btnProximo?.replaceWith(btnProximo.cloneNode(true));

  const btnAnteriorNovo = document.getElementById('btnPainelAnterior');
  const btnProximoNovo = document.getElementById('btnPainelProximo');

  btnAnteriorNovo?.addEventListener('click', async () => {
    await ensureListFresh();

    limparTimerMarketing();
    pararAnimacaoBarraMarketing();
    resetarBarraMarketing();

    marketingLoopPaused = false;
    marketingBirthdayExpandedItem = null;
    marketingLoopRemainingMs = marketingLoopIntervalMs;

    exibirSlideMarketing(marketingLoopIndex - 1, { reiniciarTempo: true });
  });

  btnProximoNovo?.addEventListener('click', async () => {
    await ensureListFresh();

    limparTimerMarketing();
    pararAnimacaoBarraMarketing();
    resetarBarraMarketing();

    marketingLoopPaused = false;
    marketingBirthdayExpandedItem = null;
    marketingLoopRemainingMs = marketingLoopIntervalMs;

    exibirSlideMarketing(marketingLoopIndex + 1, { reiniciarTempo: true });
  });

  await ensureListFresh();
  exibirSlideMarketing(marketingLoopIndex, { reiniciarTempo: true });
  agendarProximoSlideMarketingPainel(intervalMs);
}

function atualizarAmbienteLabel() {
  const el = document.getElementById('ambienteLabel');
  if (!el) return;

  const apiBase = String(sessionStorage.getItem('api_base') || '').toLowerCase();
  const isCopy = apiBase.includes('copy');

  el.textContent = isCopy ? 'Homologação' : 'Produção';
  el.style.color = isCopy ? '#ff0000' : 'hsl(var(--primary))';
}

function atualizarCorBotoesAgendamento() {
  const apiBase = String(sessionStorage.getItem('api_base') || '').toLowerCase();
  const isCopy = apiBase.includes('copy');
  const cor = isCopy ? '#ff0000' : 'hsl(var(--primary))';

  ['AgendarSalaReuniao', 'AgendarCarro'].forEach(id => {
    const botao = document.getElementById(id);
    if (!botao) return;
    botao.style.backgroundColor = cor;
    botao.style.borderColor = cor;
  });

  document.querySelectorAll('.home-mobile-tab-btn').forEach(botao => {
    const ativo = botao.classList.contains('active');

    if (isCopy) {
      if (ativo) {
        botao.style.backgroundColor = '#ff0000';
        botao.style.borderColor = '#ff0000';
        botao.style.color = '#ffffff';
      } else {
        botao.style.backgroundColor = 'rgba(255, 0, 0, 0.08)';
        botao.style.borderColor = '#ff0000';
        botao.style.color = '#ff0000';
      }
    } else {
      botao.style.backgroundColor = '';
      botao.style.borderColor = '';
      botao.style.color = '';
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  atualizarAmbienteLabel();
  atualizarCorBotoesAgendamento();

  const homeTabButtons = document.querySelectorAll('.home-mobile-tab-btn');
  const homePainelPanel = document.getElementById('homePainelPanel');
  const homeCalendarioPanel = document.getElementById('homeCalendarioPanel');

  function setHomeTab(tab) {
    homeTabButtons.forEach((btn) => {
      const active = btn.dataset.homeTab === tab;
      btn.classList.toggle('active', active);
      btn.classList.toggle('bg-white/70', active);
      btn.classList.toggle('text-foreground', active);
      btn.classList.toggle('bg-white/40', !active);
      btn.classList.toggle('text-muted-foreground', !active);
    });

    if (window.innerWidth < 1024) {
      if (tab === 'painel') {
        homePainelPanel.classList.add('active');
        homeCalendarioPanel.classList.remove('active');
      } else {
        homeCalendarioPanel.classList.add('active');
        homePainelPanel.classList.remove('active');
      }
    }

    atualizarCorBotoesAgendamento();
  }


  function resetHomePanelsDesktop() {
    if (window.innerWidth >= 1024) {
      homePainelPanel.classList.add('active');
      homeCalendarioPanel.classList.add('active');
    } else {
      const activeBtn = document.querySelector('.home-mobile-tab-btn.active');
      setHomeTab(activeBtn?.dataset.homeTab || 'painel');
    }
  }

  homeTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setHomeTab(btn.dataset.homeTab);
    });
  });

  resetHomePanelsDesktop();
  window.addEventListener('resize', resetHomePanelsDesktop);
});



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

// Emails Automáticos
let remetentesCache = [];
let destinatariosCache = [];
let remetentesParaSelect = [];

function statusBadgeEmails(status) {
  const s = (status || '').trim().toLowerCase();
  let cls = 'status-badge bg-info/15 text-info border-info/20';
  if (s === 'ativo') cls = 'status-badge status-ativo';
  else if (s === 'inativo') cls = 'status-badge status-inativo';
  return `<span class="${cls}">${escapeHtml(s)}</span>`;
}

function rowRemetente(rem, idx) {
  return `
    <tr>
      <td class="px-4 py-3 font-mono text-xs">${idx + 1}</td>
      <td class="px-4 py-3 font-medium">${escapeHtml(rem.EMAIL)}</td>
      <td class="px-4 py-3">${escapeHtml(rem.NOME || '')}</td>
      <td class="px-4 py-3">${statusBadgeEmails(rem.ATIVO ? 'Ativo' : 'Inativo')}</td>
      <td class="px-4 py-3">
        <div class="flex justify-end gap-2">
          <button class="btnEditRemetente w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all" data-id="${escapeHtml(rem.ID)}" title="Editar">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btnDelRemetente w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-destructive hover:text-white transition-all" data-id="${escapeHtml(rem.ID)}" title="Desativar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`;
}

function rowDestinatario(dest, idx) {
  return `
    <tr>
      <td class="px-4 py-3">${escapeHtml(dest.remetenteNome || 'N/D')}</td>
      <td class="px-4 py-3 font-medium">${escapeHtml(dest.EMAIL_DESTINATARIO)}</td>
      <td class="px-4 py-3">${escapeHtml(dest.NOME_DESTINATARIO || '')}</td>
      <td class="px-4 py-3">${statusBadgeEmails(dest.ATIVO ? 'Ativo' : 'Inativo')}</td>
      <td class="px-4 py-3">
        <div class="flex justify-end gap-2">
          <button class="btnEditDest w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all" data-id="${escapeHtml(dest.ID)}" title="Editar">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btnDelDest w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-destructive hover:text-white transition-all" data-id="${escapeHtml(dest.ID)}" title="Desativar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>`;
}

async function carregarEmailsAutomaticos() {
  try {
    const dataRem = await apiGet('/api/emails/remetentes');
    const dataDest = await apiGet('/api/emails/destinatarios');
    
    remetentesCache = Array.isArray(dataRem?.items) ? dataRem.items : [];
    destinatariosCache = Array.isArray(dataDest?.items) ? dataDest.items : [];
    remetentesParaSelect = remetentesCache.map(r => ({
      id: r.ID,
      nome: `${r.EMAIL}${r.NOME ? ` (${r.NOME})` : ''}`
    }));

    renderEmails();
  } catch (err) {
    mostrarEmailsMsg('Erro ao carregar: ' + err.message);
  }
}

function renderEmails() {
  const tbodyRem = document.getElementById('tbodyRemetentes');
  const tbodyDest = document.getElementById('tbodyDestinatarios');
  const selectRem = document.getElementById('selectRemetenteDest');
  const buscaRem = (document.getElementById('inputBuscaRemetentes')?.value || '').trim().toLowerCase();
  const buscaDest = (document.getElementById('inputBuscaDestinatarios')?.value || '').trim().toLowerCase();
  const remetenteSelecionado = String(selectRem?.value || '').trim();

  const remetentesFiltrados = remetentesCache.filter(r => {
    const email = String(r.EMAIL || '').toLowerCase();
    const nome = String(r.NOME || '').toLowerCase();
    return !buscaRem || email.includes(buscaRem) || nome.includes(buscaRem);
  });

  const destinatariosFiltrados = destinatariosCache.filter(d => {
    const email = String(d.EMAIL_DESTINATARIO || '').toLowerCase();
    const nome = String(d.NOME_DESTINATARIO || '').toLowerCase();
    const remNome = String(d.remetenteNome || '').toLowerCase();
    const remId = String(d.ID_REMETENTE || '').trim();

    const matchBusca = !buscaDest || email.includes(buscaDest) || nome.includes(buscaDest) || remNome.includes(buscaDest);
    const matchRem = !remetenteSelecionado || remId === remetenteSelecionado;

    return matchBusca && matchRem;
  });

  if (tbodyRem) {
    tbodyRem.innerHTML = !remetentesFiltrados.length
      ? '<tr><td colspan="5" class="px-4 py-6 text-sm text-muted-foreground text-center">Nenhum remetente cadastrado</td></tr>'
      : remetentesFiltrados.map((r, i) => rowRemetente(r, i)).join('');
  }

  if (tbodyDest) {
    tbodyDest.innerHTML = !destinatariosFiltrados.length
      ? '<tr><td colspan="5" class="px-4 py-6 text-sm text-muted-foreground text-center">Nenhum destinatário cadastrado</td></tr>'
      : destinatariosFiltrados.map((d, i) => rowDestinatario(d, i)).join('');
  }

  if (selectRem) {
    const valorAtual = remetenteSelecionado;
    selectRem.innerHTML =
      '<option value="">Selecione um remetente...</option>' +
      remetentesParaSelect.map(r => `<option value="${escapeHtml(r.id)}">${escapeHtml(r.nome)}</option>`).join('');
    selectRem.value = valorAtual;
  }
}


function ativarAbaEmails(nomeAba) {
  const abaRem = document.getElementById('abaRemetentes');
  const abaDest = document.getElementById('abaDestinatarios');
  const painelRem = document.getElementById('painelRemetentes');
  const painelDest = document.getElementById('painelDestinatarios');

  const mostrarDest = nomeAba === 'destinatarios';

  if (abaRem) {
    abaRem.setAttribute('aria-selected', mostrarDest ? 'false' : 'true');
    abaRem.className = mostrarDest
      ? 'px-4 py-2 rounded-lg text-sm font-medium transition-all text-muted-foreground hover:text-foreground'
      : 'px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white shadow text-foreground';
  }

  if (abaDest) {
    abaDest.setAttribute('aria-selected', mostrarDest ? 'true' : 'false');
    abaDest.className = mostrarDest
      ? 'px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white shadow text-foreground'
      : 'px-4 py-2 rounded-lg text-sm font-medium transition-all text-muted-foreground hover:text-foreground';
  }

  if (painelRem) {
    painelRem.hidden = mostrarDest;
    painelRem.style.display = mostrarDest ? 'none' : '';
  }

  if (painelDest) {
    painelDest.hidden = !mostrarDest;
    painelDest.style.display = mostrarDest ? '' : 'none';
  }

}



function mostrarEmailsMsg(msg) {
  const el = document.getElementById('emailsMsg');
  if (!el) return;
  if (!msg) {
    el.classList.add('hidden');
    return;
  }
  el.textContent = msg;
  el.classList.remove('hidden');
}

// =====================
// Emails Automáticos - Eventos
// =====================

// Botões/inputs diretos
document.getElementById('btnAtualizarEmailsAuto')?.addEventListener('click', () => {
  carregarEmailsAutomaticos().catch(err => mostrarEmailsMsg(err.message));
});

document.getElementById('inputBuscaRemetentes')?.addEventListener('input', () => {
  renderEmails();
});

document.getElementById('inputBuscaDestinatarios')?.addEventListener('input', () => {
  renderEmails();
});

document.getElementById('selectRemetenteDest')?.addEventListener('change', () => {
  renderEmails();
});

// Clique geral da seção
document.addEventListener('click', async (e) => {
  // Entrou pelo menu lateral
  const item = e.target.closest('[data-page="secao-emails-automaticos"]');
  if (item) {
    try {
      await carregarEmailsAutomaticos();
      ativarAbaEmails('remetentes');
    } catch (err) {
      mostrarEmailsMsg(err.message);
    }
    return;
  }

  // Aba Remetentes
  const abaRem = e.target.closest('#abaRemetentes');
  if (abaRem) {
    e.preventDefault();
    e.stopPropagation();
    ativarAbaEmails('remetentes');
    return;
  }

  // Aba Destinatários
  const abaDest = e.target.closest('#abaDestinatarios');
  if (abaDest) {
    e.preventDefault();
    e.stopPropagation();
    ativarAbaEmails('destinatarios');
    return;
  }

  // Novo remetente
  const btnNovoRem = e.target.closest('#btnNovoRemetente');
  if (btnNovoRem) {
    e.preventDefault();
    e.stopPropagation();
    abrirModalRemetente('new');
    return;
  }

  // Novo destinatário
  const btnNovoDest = e.target.closest('#btnNovoDestinatario');
  if (btnNovoDest) {
    e.preventDefault();
    e.stopPropagation();
    abrirModalDestinatario('new');
    return;
  }

  // Editar remetente
  const btnEditRem = e.target.closest('.btnEditRemetente');
  if (btnEditRem) {
    e.preventDefault();
    e.stopPropagation();
    const id = String(btnEditRem.dataset.id || '');
    const rem = remetentesCache.find(r => String(r.ID) === id);
    if (rem) abrirModalRemetente('edit', rem);
    return;
  }

  // Desativar remetente
  const btnDelRem = e.target.closest('.btnDelRemetente');
  if (btnDelRem) {
    e.preventDefault();
    e.stopPropagation();
    const id = String(btnDelRem.dataset.id || '');
    if (!id) return;

    if (!confirm('Deseja desativar este remetente?')) return;

    try {
      await apiSend(`/api/emails/remetentes/${id}`, 'DELETE');
      await carregarEmailsAutomaticos();
    } catch (err) {
      mostrarEmailsMsg('Erro: ' + err.message);
    }
    return;
  }

  // Editar destinatário
  const btnEditDest = e.target.closest('.btnEditDest');
  if (btnEditDest) {
    e.preventDefault();
    e.stopPropagation();
    const id = String(btnEditDest.dataset.id || '');
    const dest = destinatariosCache.find(d => String(d.ID) === id);
    if (dest) abrirModalDestinatario('edit', dest);
    return;
  }

  // Desativar destinatário
  const btnDelDest = e.target.closest('.btnDelDest');
  if (btnDelDest) {
    e.preventDefault();
    e.stopPropagation();
    const id = String(btnDelDest.dataset.id || '');
    if (!id) return;

    if (!confirm('Deseja desativar este destinatário?')) return;

    try {
      await apiSend(`/api/emails/destinatarios/${id}`, 'DELETE');
      await carregarEmailsAutomaticos();
    } catch (err) {
      mostrarEmailsMsg('Erro: ' + err.message);
    }
    return;
  }
});


// Modal Remetente
function removerModalRemetente() {
  document.getElementById('modalRemetenteOverlay')?.remove();
  document.getElementById('modalRemetente')?.remove();
}

function abrirModalRemetente(modo, remetente) {
  removerModalRemetente();
  
  const overlay = document.createElement('div');
  overlay.id = 'modalRemetenteOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'modalRemetente';
  modal.className = 'fixed inset-0 z-[100]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  
  const isEdit = modo === 'edit';
  const r = remetente || {};
  
  modal.innerHTML = `
    <div class="w-full h-full flex items-start justify-center p-4 md:p-8 overflow-auto">
      <div class="w-full max-w-md mx-auto">
        <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-semibold text-foreground">${isEdit ? 'Editar remetente' : 'Novo remetente'}</h3>
              <p class="text-sm text-muted-foreground">Preencha os dados abaixo</p>
            </div>
            <button id="btnFecharRemetente" type="button" class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center" aria-label="Fechar" title="Fechar">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form id="formRemetente" class="px-6 py-6 space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Email <span class="text-destructive">*</span></label>
              <input id="remEmail" type="email" required 
                class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-info/30" 
                value="${escapeHtml(r.EMAIL || '')}" placeholder="exemplo@fornecedor.com">
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium">Nome (opcional)</label>
              <input id="remNome" type="text" 
                class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-info/30" 
                value="${escapeHtml(r.NOME || '')}" placeholder="Nome do remetente">
            </div>
            
            <p id="remErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>
            
            <div class="pt-2 flex flex-col sm:flex-row gap-3">
              <button id="btnSalvarRemetente" type="submit" class="sm:flex-1 rounded-xl bg-info text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                Salvar
              </button>
              <button id="btnCancelarRemetente" type="button" class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);

  // Eventos
  const fechar = removerModalRemetente;
  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharRemetente')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarRemetente')?.addEventListener('click', fechar);

  // Submit
  document.getElementById('formRemetente')?.addEventListener('submit', async e => {
    e.preventDefault();
    
    const email = document.getElementById('remEmail').value.trim();
    const nome = document.getElementById('remNome').value.trim();
    
    if (!email) {
      setRemErro('Email é obrigatório.');
      return;
    }
    
    try {
      const btn = document.getElementById('btnSalvarRemetente');
      btn.disabled = true;
      btn.classList.add('opacity-70');
      
      if (isEdit) {
        await apiSend(`/api/emails/remetentes/${r.ID}`, 'PUT', { EMAIL: email, NOME: nome || null, ATIVO: 1 });
      } else {
        await apiSend('/api/emails/remetentes', 'POST', { EMAIL: email, NOME: nome || null });
      }
      
      removerModalRemetente();
      await carregarEmailsAutomaticos();
      
    } catch (err) {
      setRemErro(err.message);
    } finally {
      const btn = document.getElementById('btnSalvarRemetente');
      btn.disabled = false;
      btn.classList.remove('opacity-70');
    }
  });
}

function setRemErro(msg) {
  const el = document.getElementById('remErro');
  if (!el) return;
  if (!msg) {
    el.classList.add('hidden');
    return;
  }
  el.textContent = msg;
  el.classList.remove('hidden');
}

// Modal Destinatário
function removerModalDestinatario() {
  document.getElementById('modalDestOverlay')?.remove();
  document.getElementById('modalDest')?.remove();
}

function abrirModalDestinatario(modo, destinatario) {
  removerModalDestinatario();
  
  const overlay = document.createElement('div');
  overlay.id = 'modalDestOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'modalDest';
  modal.className = 'fixed inset-0 z-[100]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  
  const isEdit = modo === 'edit';
  const d = destinatario || {};
  
  modal.innerHTML = `
    <div class="w-full h-full flex items-start justify-center p-4 md:p-8 overflow-auto">
      <div class="w-full max-w-md mx-auto">
        <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
            <div>
              <h3 class="text-xl font-semibold text-foreground">${isEdit ? 'Editar destinatário' : 'Novo destinatário'}</h3>
              <p class="text-sm text-muted-foreground">Preencha os dados abaixo</p>
            </div>
            <button id="btnFecharDest" type="button" class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center" aria-label="Fechar" title="Fechar">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form id="formDestinatario" class="px-6 py-6 space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Remetente <span class="text-destructive">*</span></label>
              <select id="destRemetenteId" required class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-info/30">
                <option value="">Selecione...</option>
                ${remetentesParaSelect.map(r => `<option value="${r.id}" ${r.id == d.ID_REMETENTE ? 'selected' : ''}>${escapeHtml(r.nome)}</option>`).join('')}
              </select>
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium">Email Destinatário <span class="text-destructive">*</span></label>
              <input id="destEmail" type="email" required 
                class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-info/30" 
                value="${escapeHtml(d.EMAIL_DESTINATARIO || '')}">
            </div>
            
            <div class="space-y-2">
              <label class="text-sm font-medium">Nome Destinatário (opcional)</label>
              <input id="destNome" type="text" 
                class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-info/30" 
                value="${escapeHtml(d.NOME_DESTINATARIO || '')}">
            </div>
            
            <p id="destErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>
            
            <div class="pt-2 flex flex-col sm:flex-row gap-3">
              <button id="btnSalvarDest" type="submit" class="sm:flex-1 rounded-xl bg-info text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                Salvar
              </button>
              <button id="btnCancelarDest" type="button" class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);

  // Eventos
  const fechar = removerModalDestinatario;
  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharDest')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarDest')?.addEventListener('click', fechar);

  // Submit
  document.getElementById('formDestinatario')?.addEventListener('submit', async e => {
    e.preventDefault();
    
    const idRemetente = Number(document.getElementById('destRemetenteId').value);
    const email = document.getElementById('destEmail').value.trim();
    const nome = document.getElementById('destNome').value.trim();
    
    if (!idRemetente || !email) {
      setDestErro('Remetente e email são obrigatórios.');
      return;
    }
    
    try {
      const btn = document.getElementById('btnSalvarDest');
      btn.disabled = true;
      btn.classList.add('opacity-70');
      
      if (isEdit) {
        await apiSend(`/api/emails/destinatarios/${d.ID}`, 'PUT', { 
          ID_REMETENTE: idRemetente, 
          EMAIL_DESTINATARIO: email, 
          NOME_DESTINATARIO: nome || null 
        });
      } else {
        await apiSend('/api/emails/destinatarios', 'POST', { 
          ID_REMETENTE: idRemetente, 
          EMAIL_DESTINATARIO: email, 
          NOME_DESTINATARIO: nome || null 
        });
      }
      
      removerModalDestinatario();
      await carregarEmailsAutomaticos();
      
    } catch (err) {
      setDestErro(err.message);
    } finally {
      const btn = document.getElementById('btnSalvarDest');
      btn.disabled = false;
      btn.classList.remove('opacity-70');
    }
  });
}

function setDestErro(msg) {
  const el = document.getElementById('destErro');
  if (!el) return;
  if (!msg) {
    el.classList.add('hidden');
    return;
  }
  el.textContent = msg;
  el.classList.remove('hidden');
}

function getApiBaseGestaoUsuarios() {
  let raw =
    sessionStorage.getItem('api_base') ||
    sessionStorage.getItem('apibase') ||
    '';

  raw = String(raw || '').trim();
  if (!raw) return '';

  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`;
  }

  try {
    const url = new URL(raw);
    return url.href.replace(/\/+$/, '');
  } catch (err) {
    console.error('getApiBaseGestaoUsuarios base inválida:', raw, err);
    return '';
  }
}


function montarUrlApiGestao(path) {
  const base = getApiBaseGestaoUsuarios();
  if (!base) throw new Error('API base inválida ou não configurada.');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

// ===== Controle de Estoque ====== //
// ================================ //

let cacheEstoqueEscritorio = [];
let podeVerAlmoxarifado = false;

function setEstoqueEscritorioErro(msg) {
  const el = document.getElementById('estoqueEscritorioErro');
  if (!el) return;

  if (!msg) {
    el.textContent = '';
    el.classList.add('hidden');
    return;
  }

  el.textContent = msg;
  el.classList.remove('hidden');
}

function setAbaEstoque(nome) {
  const abaEscritorio = document.getElementById('abaEstoqueEscritorio');
  const abaCentroCusto = document.getElementById('abaEstoqueCentroCusto');

  const painelEscritorio = document.getElementById('painelEstoqueEscritorio');
  const painelCentroCusto = document.getElementById('painelEstoqueCentroCusto');
  const painelFazenda = document.getElementById('painelEstoqueFazenda');

  const escritorioAtiva = nome === 'escritorio';
  const centroCustoAtiva = nome === 'centro-custo';
  const fazendaAtiva = nome === 'fazenda';

  const classeAtiva =
    'px-4 py-2 rounded-xl text-sm font-medium border border-border bg-white text-foreground shadow-sm transition-all';

  const classeInativa =
    'px-4 py-2 rounded-xl text-sm font-medium border border-border bg-white/40 text-muted-foreground hover:bg-white/70 transition-all';

  // Centro de custo sempre funciona
  if (abaCentroCusto) {
    abaCentroCusto.setAttribute('aria-selected', centroCustoAtiva ? 'true' : 'false');
    abaCentroCusto.className = centroCustoAtiva ? classeAtiva : classeInativa;
  }

  if (painelCentroCusto) {
    painelCentroCusto.classList.toggle('hidden', !centroCustoAtiva);
  }

  // Almoxarifado só funciona se tiver permissão
  if (podeVerAlmoxarifado) {
    if (abaEscritorio) {
      abaEscritorio.setAttribute('aria-selected', escritorioAtiva ? 'true' : 'false');
      abaEscritorio.className = escritorioAtiva ? classeAtiva : classeInativa;
    }

    if (painelEscritorio) {
      painelEscritorio.classList.toggle('hidden', !escritorioAtiva);
    }

    if (escritorioAtiva && typeof carregarControleEstoque === 'function') {
      carregarControleEstoque();
    }
  } else {
    // Se não tem permissão, força esconder o almoxarifado
    if (abaEscritorio) {
      abaEscritorio.setAttribute('aria-selected', 'false');
      abaEscritorio.className = classeInativa;
    }
    if (painelEscritorio) {
      painelEscritorio.classList.add('hidden');
    }
  }

  // Fazenda
  if (painelFazenda) {
    painelFazenda.classList.toggle('hidden', !fazendaAtiva);
  }

  if (centroCustoAtiva && typeof carregarEstoqueCentroCusto === 'function') {
    carregarEstoqueCentroCusto();
  }
}



function rowEstoqueEscritorio(item) {


  const codigo =
    item.CODIGOITEM ??
    item.codigoitem ??
    item.CODIGO_ITEM ??
    item.codigo_item ??
    item.CODIGO ??
    item.codigo ??
    '—';

  const descricao =
    item.DESCRICAOITEM ??
    item.descricaoitem ??
    item.DESCRICAO_ITEM ??
    item.descricao_item ??
    item.DESCRICAO ??
    item.descricao ??
    '—';

  const unidade =
    item.UNIDADE ??
    item.unidade ??
    item.UN ??
    item.un ??
    '_';

  const qtdDisponivel =
    item.QTDDISPONIVEL ??
    item.qtddisponivel ??
    item.QTD_DISPONIVEL ??
    item.qtd_disponivel ??
    item.SALDO ??
    item.saldo ??
    0;

  const qtdPedido =
    item.QTDEMPEDIDO ??
    item.qtdempedido ??
    item.QTD_EM_PEDIDO ??
    item.qtd_em_pedido ??
    0;

  const id = item.ID ?? item.id ?? codigo;
  const idProduto =
    item.PRODUTO_SISTEMA_ID ??
    item.produto_sistema_id ??
    item.IDPRODUTO ??
    item.idproduto ??
    item.ID_PRODUTO ??
    item.id_produto ??
    id;

  const idLocal =
    item.ID_LOCAL_ALMOXARIFADO ??
    item.id_local_almoxarifado ??
    item.IDLOCALALMOXARIFADO ??
    item.idlocalalmoxarifado ??
    item.ID_LOCAL ??
    item.id_local ??
    '';

  const qtdDisponivelTexto = `${formatarMoedaBr(qtdDisponivel)} ${unidade}`;
  const qtdPedidoTexto = `${formatarMoedaBr(qtdPedido)} ${unidade}`;

  return `
    <tr class="border-b border-border last:border-b-0">
      <td class="px-4 py-3">${escapeHtml(codigo)}</td>
      <td class="px-4 py-3">${escapeHtml(descricao)}</td>
      <td class="px-4 py-3">${escapeHtml(qtdDisponivelTexto)}</td>
      <td class="px-4 py-3">${escapeHtml(qtdPedidoTexto)}</td>
      <td class="px-4 py-3">
        <div class="flex justify-end gap-2">
          <button
            class="btnEditarEntrada w-10 h-10 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all"
            data-id="${escapeHtml(String(id))}"
            aria-label="Editar entrada"
            title="Editar entradas"
          >
            <i class="fas fa-pen" aria-hidden="true"></i>
          </button>

          <button
            class="btnHistoricoEstoque w-10 h-10 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all"
            data-id="${escapeHtml(String(id))}"
            aria-label="Histórico"
            title="Histórico"
          >
            <i class="fas fa-clock-rotate-left" aria-hidden="true"></i>
          </button>

          <button
            class="btnTransferenciaEstoque w-10 h-10 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
            data-id="${escapeHtml(String(id))}"
            data-id-produto="${escapeHtml(String(idProduto))}"
            data-id-local="${escapeHtml(String(idLocal))}"
            data-unidade="${escapeHtml(String(unidade))}"
            aria-label="Transferência"
            title="Transferência"
          >
            <i class="fas fa-right-left" aria-hidden="true"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}


function renderEstoqueEscritorio(items = []) {
  const tbody = document.getElementById('tbodyEstoqueEscritorio');
  if (!tbody) return;

  if (!Array.isArray(items) || !items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-4 py-6 text-sm text-muted-foreground">
          Nenhum material do escritório encontrado.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map(rowEstoqueEscritorio).join('');
}


async function carregarEstoqueEscritorio() {
  const usuario = typeof obterUsuarioLogado === 'function'
    ? obterUsuarioLogado()
    : '';

  const resp = await apiJson(
    apiUrl(`/api/estoque/controle/escritorio?usuario=${encodeURIComponent(usuario)}`)
  );


  return Array.isArray(resp?.items) ? resp.items : [];
}

async function carregarControleEstoque() {
  const resp = await apiJson(
    apiUrlTr('/api/estoque/controle/escritorio')
  );

  cacheEstoqueEscritorio = Array.isArray(resp?.items) ? resp.items : [];
  renderEstoqueEscritorio(cacheEstoqueEscritorio);
}

document.addEventListener('click', async (e) => {
  const item = e.target.closest('.menu-item[data-page]');
  if (!item) return;

  const page = item.dataset.page;
  if (page !== 'inventory-control') return;

  const podeVerAlmoxarifado = await validarPermissaoEstoqueAlmoxarifado();
  
  // Força centro de custo como padrão se não tem permissão
  if (!podeVerAlmoxarifado) {
    setAbaEstoque('centro-custo');
  }
  
  carregarControleEstoque();
});


document.addEventListener('click', (e) => {
  if (e.target.closest('#abaEstoqueEscritorio')) {
    setAbaEstoque('escritorio');
    return;
  }

  if (e.target.closest('#abaEstoqueCentroCusto')) {
    setAbaEstoque('centro-custo');
    return;
  }
});

async function validarPermissaoEstoqueAlmoxarifado() {
  const usuarioId = sessionStorage.getItem('id');

  const btnNovoProdutoEstoque = document.getElementById('btnNovoProdutoEstoque');
  const btnImportarPdfEstoque = document.getElementById('btnImportarPdfEstoque');
  const abaEstoqueEscritorio = document.getElementById('abaEstoqueEscritorio');
  const painelEstoqueEscritorio = document.getElementById('painelEstoqueEscritorio');
  const abaEstoqueCentroCusto = document.getElementById('abaEstoqueCentroCusto');
  const painelEstoqueCentroCusto = document.getElementById('painelEstoqueCentroCusto');

  if (!usuarioId) {
    btnNovoProdutoEstoque?.classList.add('hidden');
    btnImportarPdfEstoque?.classList.add('hidden');
    abaEstoqueEscritorio?.classList.add('hidden');

    abaEstoqueCentroCusto?.setAttribute('aria-selected', 'true');
    abaEstoqueEscritorio?.setAttribute('aria-selected', 'false');

    painelEstoqueEscritorio?.classList.add('hidden');
    painelEstoqueCentroCusto?.classList.remove('hidden');
    return false;
  }

  try {
    const resp = await fetch(`${APIBASE}/api/permissoes/estoque-almoxarifado/${usuarioId}`);
    const data = await resp.json();

    if (!resp.ok || !data.success) {
      throw new Error(data?.message || 'Erro ao validar permissão do almoxarifado.');
    }

    const permitido = Number(data?.item?.estoque_almoxarifado) === 1;

    podeVerAlmoxarifado = permitido;  // ← ADICIONE ESTA LINHA

    if (permitido) {
      btnNovoProdutoEstoque?.classList.remove('hidden');
      btnImportarPdfEstoque?.classList.remove('hidden');
      abaEstoqueEscritorio?.classList.remove('hidden');
      return true;
    }

    btnNovoProdutoEstoque?.classList.add('hidden');
    btnImportarPdfEstoque?.classList.add('hidden');
    abaEstoqueEscritorio?.classList.add('hidden');

    abaEstoqueCentroCusto?.setAttribute('aria-selected', 'true');
    abaEstoqueEscritorio?.setAttribute('aria-selected', 'false');

    painelEstoqueEscritorio?.classList.add('hidden');
    painelEstoqueCentroCusto?.classList.remove('hidden');

    return false;
  } catch (err) {
    console.error('Erro ao validar permissão de estoque almoxarifado:', err);

    btnNovoProdutoEstoque?.classList.add('hidden');
    btnImportarPdfEstoque?.classList.add('hidden');
    abaEstoqueEscritorio?.classList.add('hidden');

    abaEstoqueCentroCusto?.setAttribute('aria-selected', 'true');
    abaEstoqueEscritorio?.setAttribute('aria-selected', 'false');

    painelEstoqueEscritorio?.classList.add('hidden');
    painelEstoqueCentroCusto?.classList.remove('hidden');

    return false;
  }
}


// ===== Importar PDF =======//

function normalizarTextoNfePdf(texto) {
  return String(texto || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function validarPdfComoNFe(texto) {
  const t = normalizarTextoNfePdf(texto).toUpperCase();

  const sinais = [
    'DANFE',
    'DOCUMENTO AUXILIAR',
    'NOTA FISCAL',
    'ELETRONICA',
    'CHAVE DE ACESSO',
    'DESTINATÁRIO/REMETENTE',
    'DADOS DO PRODUTO/SERVIÇO'
  ];

  return sinais.filter(s => t.includes(s)).length >= 4;
}

function extrairCampo(regex, texto, fallback = '') {
  const m = texto.match(regex);
  return m?.[1]?.trim?.() || fallback;
}

function limparNumero(str = '') {
  return String(str).replace(/[^\d]/g, '');
}

function extrairCnpjEmitenteDoTexto(textoOriginal) {
  const texto = normalizarTextoNfePdf(textoOriginal);

  const blocoEmitente =
    extrairCampo(/IDENTIFICAÇÃO DO EMITENTE\s+([\s\S]+?)\s+DANFE/i, texto) ||
    extrairCampo(/IDENTIFICAÇÃO DO EMITENTE\s+([\s\S]+?)\s+CHAVE DE ACESSO/i, texto) ||
    extrairCampo(/RECEBEMOS DE\s+([\s\S]+?)\s+OS PRODUTOS/i, texto) ||
    '';

  const cnpjFormatado =
    extrairCampo(/CNPJ[: ]*([0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2})/i, blocoEmitente) ||
    extrairCampo(/CNPJ[: ]*([0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2})/i, texto);

  if (cnpjFormatado) return cnpjFormatado;

  const cnpjNumericoNoBloco = extrairCampo(/CNPJ[: ]*([0-9]{14})/i, blocoEmitente);
  if (cnpjNumericoNoBloco) return cnpjNumericoNoBloco;

  const matchQualquerCnpjNoBloco = blocoEmitente.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14}/);
  if (matchQualquerCnpjNoBloco) return matchQualquerCnpjNoBloco[0];

  const matchQualquerCnpjNoTexto = texto.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14}/);
  if (matchQualquerCnpjNoTexto) return matchQualquerCnpjNoTexto[0];

  return '';
}

function detectarModeloDocumentoFiscal(textoOriginal) {
  const texto = normalizarTextoNfePdf(textoOriginal);
  const t = texto.toUpperCase();

  if (
    t.includes('SERVIÇOS DE COMUNICAÇÃO ELETRÔNICA') ||
    t.includes('NOTA FISCAL FATURA') ||
    t.includes('/NFCOM') ||
    t.includes('NFCOM')
  ) {
    return 'nfcom';
  }

  if (
    t.includes('DANFE') ||
    t.includes('NOTA FISCAL ELETRÔNICA') ||
    t.includes('CHAVE DE ACESSO')
  ) {
    return 'nfe';
  }

  return 'desconhecido';
}

function validarPdfComoDocumentoFiscal(textoOriginal) {
  return detectarModeloDocumentoFiscal(textoOriginal) !== 'desconhecido';
}

function parseDocumentoFiscalPdf(textoOriginal) {
  const modelo = detectarModeloDocumentoFiscal(textoOriginal);

  if (modelo === 'nfcom') {
    return parseNFComPdfTexto(textoOriginal);
  }

  if (modelo === 'nfe') {
    return parseNfePdfTextoRobusto(textoOriginal);
  }

  return {
    modelo: 'desconhecido',
    textoOriginal: normalizarTextoNfePdf(textoOriginal),
    itens: []
  };
}

function extrairRazaoSocialEmitente(textoOriginal) {
  const texto = normalizarTextoNfePdf(textoOriginal);

  const blocoEmitente =
    extrairCampo(/IDENTIFICAÇÃO DO EMITENTE\s+([\s\S]+?)\s+DANFE/i, texto) ||
    extrairCampo(/IDENTIFICAÇÃO DO EMITENTE\s+([\s\S]+?)\s+CHAVE DE ACESSO/i, texto) ||
    extrairCampo(/RECEBEMOS DE\s+(.+?)\s+OS PRODUTOS/i, texto) ||
    '';

  if (!blocoEmitente) return '';

  const blocoLimpo = blocoEmitente
    .replace(/\s+/g, ' ')
    .trim();

  const marcadoresEndereco = [
    ' R.',
    ' RUA ',
    ' AV.',
    ' AV ',
    ' AVENIDA ',
    ' ALAMEDA ',
    ' TRAVESSA ',
    ' TV. ',
    ' ESTRADA ',
    ' ROD.',
    ' RODOVIA ',
    ' FAZENDA ',
    ' SITIO ',
    ' SÍTIO ',
    ' CHACARA ',
    ' CHÁCARA ',
    ' PRAÇA ',
    ' PRACA ',
    ' QD ',
    ' QUADRA ',
    ' LOTE ',
    ' CEP ',
    ' FONE ',
    ' FONE/FAX ',
    ' CNPJ '
  ];

  let fim = blocoLimpo.length;

  for (const marcador of marcadoresEndereco) {
    const idx = blocoLimpo.toUpperCase().indexOf(marcador.toUpperCase());
    if (idx > 0 && idx < fim) fim = idx;
  }

  return blocoLimpo.slice(0, fim).trim().toUpperCase();
}

function parseNfePdfTextoRobusto(textoOriginal) {
  const texto = normalizarTextoNfePdf(textoOriginal);

  const emitente = extrairRazaoSocialEmitente(texto);

  const numeroNota =
    extrairCampo(/NF-e\s+N[º°.o]*\s*([0-9.\-\/]+)/i, texto) ||
    extrairCampo(/N[º°.o]*\s*([0-9.\-\/]+)\s+S[ÉE]RIE/i, texto) ||
    extrairCampo(/N[º°.o]*\.\s*([0-9.\-\/]+)/i, texto);

  const serie =
    extrairCampo(/S[ÉE]RIE[: ]\s*([0-9]+)/i, texto) ||
    extrairCampo(/S[ée]rie\s*([0-9]+)/i, texto);

  const chaveAcesso = extrairCampo(/CHAVE DE ACESSO\s+([0-9\s]{44,80})/i, texto)
    .replace(/\s+/g, '');

  const dataEmissao =
    extrairCampo(/DATA DA EMISS[ÃA]O\s+([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i, texto) ||
    extrairCampo(/DATA DE EMISS[ÃA]O\s+([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i, texto);

  const naturezaOperacao = extrairCampo(
    /NATUREZA DA OPERAÇÃO\s+([\s\S]+?)\s+PROTOCOLO DE AUTORIZAÇÃO DE USO/i,
    texto
  ).replace(/\n+/g, ' ').trim();

  const emitenteCnpj = extrairCnpjEmitenteDoTexto(texto);

  const destinatario = extrairCampo(
    /DESTINAT[ÁA]RIO\s*\/\s*REMETENTE\s+NOME\s*\/\s*RAZ[ÃA]O SOCIAL\s+([\s\S]+?)\s+CNPJ\s*\/\s*CPF/i,
    texto
  ).replace(/\n+/g, ' ').trim();

  const destinatarioCnpj = extrairCampo(
    /DESTINAT[ÁA]RIO\s*\/\s*REMETENTE[\s\S]*?CNPJ\s*\/\s*CPF\s+([0-9.\-\/]+)/i,
    texto
  );

  const enderecoDestinatario = extrairCampo(
    /DATA DA EMISS[ÃA]O\s+[0-9]{2}\/[0-9]{2}\/[0-9]{4}\s+ENDEREÇO\s+([\s\S]+?)\s+BAIRRO\s*\/\s*DISTRITO/i,
    texto
  ).replace(/\n+/g, ' ').trim();

  const bairroDestinatario = extrairCampo(
    /BAIRRO\s*\/\s*DISTRITO\s+([\s\S]+?)\s+CEP/i,
    texto
  ).replace(/\n+/g, ' ').trim();

  const municipioDestinatario = extrairCampo(
    /MUNIC[ÍI]PIO\s+([\s\S]+?)\s+UF/i,
    texto
  ).replace(/\n+/g, ' ').trim();

  const ufDestinatario = extrairCampo(/UF\s+([A-Z]{2})\s+FONE/i, texto) ||
    extrairCampo(/MUNIC[ÍI]PIO[\s\S]+?UF\s+([A-Z]{2})/i, texto);

  const valorTotalNota =
    extrairCampo(/V\. TOTAL DA NOTA\s+([\d.,]+)/i, texto) ||
    extrairCampo(/VALOR TOTAL DA NOTA\s+([\d.,]+)/i, texto);

  const itens = extrairItensNfePdfRobusto(texto);

  return {
    modelo: 'nfe',
    emitente,
    emitenteCnpj,
    numeroNota,
    serie,
    chaveAcesso,
    dataEmissao,
    naturezaOperacao,
    destinatario,
    destinatarioCnpj,
    enderecoDestinatario,
    bairroDestinatario,
    municipioDestinatario,
    ufDestinatario,
    valorTotalNota,
    itens,
    textoOriginal: texto
  };
}

function extrairItensNfePdfRobusto(textoOriginal) {
  const texto = normalizarTextoNfePdf(textoOriginal);
  const itens = [];

  const bloco = extrairCampo(
    /DADOS DOS PRODUTOS?\s*\/\s*SERVIÇOS\s+([\s\S]+?)\s+DADOS ADICIONAIS/i,
    texto
  ) || extrairCampo(
    /DADOS DO PRODUTO\s*\/\s*SERVIÇO\s+([\s\S]+?)\s+CALCULO DO ISSQN/i,
    texto
  ) || '';


  if (!bloco) {
    console.warn('[NFE PDF] Nenhum bloco de itens encontrado.');
    return itens;
  }

  const blocoLinear = bloco
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();


  const regexItem = /(\d{3,20})\s+(.+?)\s+(\d{8})\s+(\d{4})\s+(\d{4})\s+([A-Z]{1,6})\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)/g;

  let match;
  let contador = 0;

  while ((match = regexItem.exec(blocoLinear)) !== null) {
    contador++;

    const codigo = match[1] || '';
    let descricao = (match[2] || '').trim();
    const ncm = match[3] || '';
    const cst = match[4] || '';
    const cfop = match[5] || '';
    const unidade = match[6] || '';
    const quantidade = match[7] || '';
    const valorUnitario = match[8] || '';
    const valorTotal = match[9] || '';

    descricao = descricao
      .replace(/^\s*0,00\s+0,00\s+/i, '')
      .replace(/\s+Retido na compra:.*$/i, '')
      .replace(/\s+VALOR ICMS ST=0,00.*$/i, '')
      .replace(/\s+/g, ' ')
      .trim();

    const item = {
      codigo,
      descricao,
      ncm,
      cst,
      cfop,
      unidade,
      quantidade,
      valorUnitario,
      valorTotal
    };


    itens.push(item);
  }

  return itens;
}

function parseNFComPdfTexto(textoOriginal) {
  const texto = normalizarTextoNfePdf(textoOriginal);

  const emitente =
    extrairCampo(/DOCUMENTO AUXILIAR DA NOTA FISCAL FATURA DE SERVIÇOS DE COMUNICAÇÃO ELETRÔNICA\s+([\s\S]+?)\s+CNPJ:/i, texto)
      .replace(/\n+/g, ' ')
      .trim();

  const emitenteCnpj = extrairCampo(/CNPJ:\s*([0-9.\-\/]+)/i, texto);

  const numeroNota =
    extrairCampo(/NOTA FISCAL FATURA No\.\s*([0-9.\-\/]+)/i, texto) ||
    extrairCampo(/NOTA FISCAL FATURA N[ºo]\.?\s*([0-9.\-\/]+)/i, texto);

  const serie = extrairCampo(/S[ÉE]RIE:\s*([0-9]+)/i, texto);

  const chaveAcesso = extrairCampo(/CHAVE DE ACESSO:\s*([0-9\s]{44,80})/i, texto)
    .replace(/\s+/g, '');

  const dataEmissao = extrairCampo(/DATA DE EMISSÃO:\s*([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i, texto);

  const destinatarioCpfCnpj = extrairCampo(/CNPJ\/CPF:\s*([0-9.\-\/]+)/i, texto);

  const destinatario = extrairCampo(
    /BA\s+([A-ZÁÂÃÀÉÊÍÓÔÕÚÇa-záâãàéêíóôõúç ]+)\s+NOTA FISCAL FATURA/i,
    texto
  ).replace(/\n+/g, ' ').trim();

  const valorTotalNota =
    extrairCampo(/TOTAL A PAGAR:\s*([\d.,]+)/i, texto) ||
    extrairCampo(/VALOR TOTAL NFF\s+([\d.,]+)/i, texto);

  const itens = extrairItensNFComPdf(texto);

  return {
    modelo: 'nfcom',
    emitente,
    emitenteCnpj,
    numeroNota,
    serie,
    chaveAcesso,
    dataEmissao,
    destinatario,
    destinatarioCnpj: destinatarioCpfCnpj,
    enderecoDestinatario: '',
    municipioDestinatario: '',
    ufDestinatario: '',
    valorTotalNota,
    itens,
    textoOriginal: texto
  };
}

function extrairItensNFComPdf(textoOriginal) {
  const texto = normalizarTextoNfePdf(textoOriginal);
  const itens = [];

  const bloco = extrairCampo(
    /ITENS DA FATURA\s+([\s\S]+?)\s+INFORMAÇÕES COMPLEMENTARES/i,
    texto,
    ''
  );

  if (!bloco) return itens;

  const linhas = bloco
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

  for (let i = 0; i < linhas.length; i++) {
    const descricao = linhas[i];
    const prox = linhas.slice(i + 1, i + 8);

    if (
      descricao &&
      !/^(UN|QUANT|PREÇO UNIT|VALOR TOTAL|PIS\/COFINS|BC ICMS|ALÍQ|VALOR ICMS)$/i.test(descricao) &&
      prox.length >= 7 &&
      /^[A-Z0-9]{1,6}$/.test(prox[0]) &&
      /^[\d.,]+$/.test(prox[1]) &&
      /^[\d.,]+$/.test(prox[2]) &&
      /^[\d.,]+$/.test(prox[3])
    ) {
      itens.push({
        codigo: '',
        descricao,
        unidade: prox[0],
        quantidade: prox[1],
        valorUnitario: prox[2],
        valorTotal: prox[3],
        pisCofins: prox[4] || '',
        bcIcms: prox[5] || '',
        aliquotaIcms: prox[6] || '',
        valorIcms: prox[7] || ''
      });
    }
  }

  return itens;
}

function parseNfePdfTexto(textoOriginal) {
  const texto = normalizarTextoNfePdf(textoOriginal);

  const emitente = extrairCampo(
    /RECEBEMOS DE\s+(.+?)\s+OS PRODUTOS E SERVIÇOS CONSTANTES/i,
    texto
  ) || extrairCampo(
    /IDENTIFICAÇÃO DE ASSINATURA DO RECEBEDOR\s+(.+?)\s+DANFE/i,
    texto
  );

  const numeroNota =
    extrairCampo(/NF-e\s+Nº\s*([0-9.\-\/]+)/i, texto) ||
    extrairCampo(/N[º°o]\s*([0-9.\-\/]+)\s+S[ÉE]RIE/i, texto);

  const serie =
    extrairCampo(/S[ÉE]RIE[: ]\s*([0-9]+)/i, texto) ||
    extrairCampo(/N[º°o]\s*[0-9.\-\/]+\s+S[ÉE]RIE[: ]?\s*([0-9]+)/i, texto);

  const chaveAcesso = extrairCampo(/CHAVE DE ACESSO\s+([0-9\s]{44,60})/i, texto)
    .replace(/\s+/g, '');

  const dataEmissao = extrairCampo(/DATA DE EMISS[ÃA]O\s+([0-9]{2}\/[0-9]{2}\/[0-9]{4})/i, texto);

  const emitenteCnpj = extrairCnpjEmitenteDoTexto(texto);

  const destinatario = extrairCampo(
    /DESTINAT[ÁA]RIO\/REMETENTE\s+NOME\/RAZ[ÃA]O SOCIAL\s+(.+?)\s+CNPJ\/CPF/i,
    texto
  );

  const destinatarioCnpj = extrairCampo(
    /DESTINAT[ÁA]RIO\/REMETENTE[\s\S]*?CNPJ\/CPF\s+([0-9.\-\/]+)/i,
    texto
  );

  const enderecoDestinatario = extrairCampo(
    /DATA DE EMISS[ÃA]O\s+[0-9]{2}\/[0-9]{2}\/[0-9]{4}\s+ENDERE[ÇC]O\s+(.+?)\s+BAIRRO\/DISTRITO/i,
    texto
  );

  const municipioDestinatario = extrairCampo(
    /MUNIC[ÍI]PIO\s+(.+?)\s+FONE\/FAX/i,
    texto
  );

  const ufDestinatario = extrairCampo(/FONE\/FAX\s+UF\s+([A-Z]{2})/i, texto);

  const itens = extrairItensNfePdf(texto);

  return {
    emitente,
    emitenteCnpj,
    numeroNota,
    serie,
    chaveAcesso,
    dataEmissao,
    destinatario,
    destinatarioCnpj,
    enderecoDestinatario,
    municipioDestinatario,
    ufDestinatario,
    itens,
    textoOriginal: texto
  };
}

function extrairItensNfePdf(textoOriginal) {
  const texto = normalizarTextoNfePdf(textoOriginal);
  const itens = [];

  const bloco = extrairCampo(
    /DADOS DO PRODUTO\/SERVIÇO\s+([\s\S]+?)\s+CALCULO DO ISSQN/i,
    texto,
    ''
  );

  if (!bloco) return itens;

  const blocoLinear = bloco
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const regexItem = /(\d{6,20})\s+(.+?)\s+(\d{8})\s+(\d{4})\s+(\d{4})\s+([A-Z]{1,4})\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)\s+[\d.,]+\s+[\d.,]+\s+[\d.,]+\s+[\d.,]+/g;

  let match;
  while ((match = regexItem.exec(blocoLinear)) !== null) {
    itens.push({
      codigo: match[1] || '',
      descricao: (match[2] || '').trim(),
      ncm: match[3] || '',
      cst: match[4] || '',
      cfop: match[5] || '',
      unidade: match[6] || '',
      quantidade: match[7] || '',
      valorUnitario: match[8] || '',
      valorTotal: match[9] || ''
    });
  }

  return itens;
}

function removerModalImportacaoNfe() {
  document.getElementById('nfePdfOverlay')?.remove();
  document.getElementById('nfePdfModal')?.remove();
}

function normalizarTexto(v) {
  return String(v ?? '').trim();
}

let localArmazenagemSelecionadoId = '';

async function abrirModalImportacaoNfe(dados) {
  removerModalImportacaoNfe();

  const overlay = document.createElement('div');
  overlay.id = 'nfePdfOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'nfePdfModal';
  modal.className = 'fixed inset-0 z-[120]';

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }


  async function salvarAmarracaoItem(payload) {
    return apiJson(apiUrl('/api/estoque/produtos-amarracao'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  async function confirmarImportacaoPdf(payload) {
    return apiJson(apiUrl('/api/estoque/importacao-pdf/confirmar'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  async function criarProdutoRapido(item) {
    return new Promise(async (resolve, reject) => {
      try {
        const codigoResp = await apiJson(apiUrl('/api/estoque/produtos/proximo-codigo'));
        const codigoGerado = String(codigoResp?.codigo || '').trim();

        if (!codigoGerado) {
          throw new Error('Não foi possível gerar o código do produto.');
        }

        const overlayProduto = document.createElement('div');
        overlayProduto.id = 'produtoRapidoOverlay';
        overlayProduto.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

        const modalProduto = document.createElement('div');
        modalProduto.id = 'produtoRapidoModal';
        modalProduto.className = 'fixed inset-0 z-[140]';

        modalProduto.innerHTML = `
          <div class="w-full h-full overflow-auto">
            <div class="min-h-full flex items-center justify-center p-4">
              <div class="w-full max-w-xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
                <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-lg font-semibold text-foreground">Novo produto</h3>
                    <p class="text-sm text-muted-foreground">Cadastro rápido para vincular o item da nota.</p>
                  </div>

                  <button type="button" id="btnFecharProdutoRapido"
                    class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
                    <i class="fas fa-times" aria-hidden="true"></i>
                  </button>
                </div>

                <form id="formProdutoRapido" class="px-6 py-6 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">Código</label>
                    <input
                      id="produtoRapidoCodigo"
                      type="text"
                      class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                      value="${escapeHtml(codigoGerado)}"
                      readonly
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">Descrição</label>
                    <input
                      id="produtoRapidoDescricao"
                      type="text"
                      class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                      value="${escapeHtml(normalizarTexto(item?._descricao).toUpperCase())}"
                      required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">Unidade</label>
                    <input
                      id="produtoRapidoUnidade"
                      type="text"
                      class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                      value="${escapeHtml(normalizarTexto(item?._unidade).toUpperCase() || 'UN')}"
                      maxlength="10"
                      required
                    />
                  </div>

                  <div class="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      id="btnCancelarProdutoRapido"
                      class="rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all">
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      id="btnSalvarProdutoRapido"
                      class="rounded-xl bg-primary text-white px-4 py-3 text-sm font-medium hover:opacity-90 transition-all">
                      Salvar produto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        `;

        function fecharModalProduto() {
          overlayProduto.remove();
          modalProduto.remove();
        }

        function cancelar() {
          fecharModalProduto();
          resolve(null);
        }

        document.body.appendChild(overlayProduto);
        document.body.appendChild(modalProduto);

        overlayProduto.addEventListener('click', cancelar);
        modalProduto.querySelector('#btnFecharProdutoRapido')?.addEventListener('click', cancelar);
        modalProduto.querySelector('#btnCancelarProdutoRapido')?.addEventListener('click', cancelar);

        modalProduto.querySelector('#formProdutoRapido')?.addEventListener('submit', async (e) => {
          e.preventDefault();

          const btnSalvar = modalProduto.querySelector('#btnSalvarProdutoRapido');
          const codigo = normalizarTexto(modalProduto.querySelector('#produtoRapidoCodigo')?.value).toUpperCase();
          const descricao = normalizarTexto(modalProduto.querySelector('#produtoRapidoDescricao')?.value).toUpperCase();
          const unidade = normalizarTexto(modalProduto.querySelector('#produtoRapidoUnidade')?.value).toUpperCase();

          if (!descricao) {
            alert('Descrição é obrigatória.');
            return;
          }

          if (!unidade) {
            alert('Unidade é obrigatória.');
            return;
          }

          try {
            btnSalvar.disabled = true;
            btnSalvar.textContent = 'Salvando...';

            const data = await apiJson(apiUrl('/api/estoque/produtos'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                codigo,
                descricao,
                unidade
              })
            });

            fecharModalProduto();
            resolve(data.item || null);
          } catch (err) {
            btnSalvar.disabled = false;
            btnSalvar.textContent = 'Salvar produto';

            if ((err.message || '').includes('Já existe produto com esse código')) {
              alert('Esse código foi utilizado por outro usuário neste instante. Abra novamente o cadastro para gerar um novo código.');
              fecharModalProduto();
              resolve(null);
              return;
            }

            reject(err);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }


  let produtosSistema = [];
  let fornecedor = dados?._validacao?.fornecedor || null;
  const itensValidacao = Array.isArray(dados?._validacao?.itens) ? dados._validacao.itens : [];

  try {
    produtosSistema = await carregarProdutosSistema();
  } catch (err) {
    console.error('Erro ao carregar produtos do sistema:', err);
    produtosSistema = [];
  }

  const mapaItensValidacao = new Map(
    itensValidacao.map(item => [String(item.codigo ?? '').trim(), item])
  );

  const resultadoConsolidacao = consolidarItensNota(dados?.itens || []);

  if (resultadoConsolidacao.alertas.length) {
    alert(resultadoConsolidacao.alertas.join('\n'));
  }

  const itensTratadosBase = resultadoConsolidacao.itens.map((item, index) => {
    const codigoItem = normalizarTexto(item?.codigo);
    const validado = mapaItensValidacao.get(codigoItem);
    const produtosVinculados = Array.isArray(validado?.produtosVinculados) ? validado.produtosVinculados : [];
    const produtoPadrao = validado?.produto || (produtosVinculados.length === 1 ? produtosVinculados[0] : null);

    return {
      ...item,
      _index: index,
      _codigo: codigoItem,
      _descricao: normalizarTexto(item?.descricao),
      _unidade: normalizarTexto(item?.unidade),
      _quantidade: normalizarTexto(item?.quantidade),
      _valorUnitario: normalizarTexto(item?.valorUnitario),
      _valorTotal: normalizarTexto(item?.valorTotal),
      _amarrado: produtosVinculados.length > 0,
      _multiplosVinculos: produtosVinculados.length > 1,
      _produtosVinculados: produtosVinculados,
      _idAmarracaoSelecionada: String(produtoPadrao?.ID_AMARRACAO ?? ''),
      _produtoSelecionadoId: String(produtoPadrao?.ID ?? ''),
      _produtoSelecionadoCodigo: normalizarTexto(produtoPadrao?.CODIGO).toUpperCase(),
      _produtoSelecionadoDescricao: normalizarTexto(produtoPadrao?.DESCRICAO).toUpperCase()
    };
  });

  const itensTratados = itensTratadosBase;

  function gerarOpcoesProdutos(produtoSelecionadoId = '') {
    return produtosSistema.map(prod => {
      const id = String(prod.id ?? prod.ID ?? '');
      const codigo = escapeHtml(String(prod.codigo ?? prod.CODIGO ?? ''));
      const descricao = escapeHtml(String(prod.descricao ?? prod.DESCRICAO ?? ''));
      const selected = String(produtoSelecionadoId) === id ? 'selected' : '';
      return `<option value="${id}" ${selected}>${codigo} - ${descricao}</option>`;
    }).join('');
  }

  function badgeVinculo(item) {
    if (item._multiplosVinculos) {
      return `<span class="inline-flex rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Múltiplos vínculos</span>`;
    }

    if (item._amarrado) {
      return `<span class="inline-flex rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">Vinculado</span>`;
    }

    if (item._produtoSelecionadoId) {
      return `<span class="inline-flex rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">Selecionado</span>`;
    }

    return `<span class="inline-flex rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">Sem vínculo</span>`;
  }


  function renderizarLinhasItens() {
    const itensExibicao = montarItensTabelaComDesmembramentos(itensTratados);

    if (!itensExibicao.length) {
      return `
        <tr>
          <td colspan="9" class="px-4 py-6 text-sm text-muted-foreground text-center">
            Nenhum item identificado automaticamente no PDF.
          </td>
        </tr>
      `;
    }

    return itensExibicao.map((item) => {
      const itemBase = itensTratados.find(x => x._grupoId === item._parentGroupId) || item;
      const possuiVinculos = Array.isArray(item._produtosVinculados) && item._produtosVinculados.length > 0;
      const isSplit = !!item._isSplit;

      const htmlProdutoSistema = possuiVinculos
        ? `
          <select
            class="nfe-item-vinculo-select w-full rounded-xl border border-border bg-white/80 px-3 py-2"
            data-index="${itemBase._index}"
            data-split-id="${escapeHtml(String(item._splitId || ''))}"
          >
            <option value="">Selecione...</option>
            ${item._produtosVinculados.map(prod => `
              <option
                value="${escapeHtml(String(prod.ID ?? ''))}"
                data-amarracao-id="${escapeHtml(String(prod.ID_AMARRACAO ?? ''))}"
                ${String(item._produtoSelecionadoId) === String(prod.ID ?? '') ? 'selected' : ''}
              >
                ${escapeHtml(String(prod.CODIGO || ''))} - ${escapeHtml(String(prod.DESCRICAO || ''))}
              </option>
            `).join('')}
          </select>
        `
        : `
          <select
            class="nfe-item-produto-select w-full rounded-xl border border-border bg-white/80 px-3 py-2"
            data-index="${itemBase._index}"
            data-split-id="${escapeHtml(String(item._splitId || ''))}"
          >
            <option value="">Selecione...</option>
            ${gerarOpcoesProdutos(item._produtoSelecionadoId)}
          </select>
        `;

        const htmlAcao = `
          <div class="flex flex-wrap items-center gap-2">
            ${possuiVinculos ? `
              <button
                type="button"
                title="Editar vínculo"
                class="btnEditarVinculo w-9 h-9 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all flex items-center justify-center"
                data-index="${itemBase._index}"
                data-split-id="${escapeHtml(String(item._splitId || ''))}"
              >
                <i class="fas fa-pen"></i>
              </button>
            ` : ''}

            <button
              type="button"
              title="Adicionar vínculo"
              class="btnAdicionarVinculo w-9 h-9 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all flex items-center justify-center"
              data-index="${itemBase._index}"
              data-split-id="${escapeHtml(String(item._splitId || ''))}"
            >
              <i class="fas fa-link"></i>
            </button>

            <button
              type="button"
              title="Novo produto"
              class="btnNovoProdutoRapido w-9 h-9 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-all flex items-center justify-center"
              data-index="${itemBase._index}"
              data-split-id="${escapeHtml(String(item._splitId || ''))}"
            >
              <i class="fas fa-box-open"></i>
            </button>

            <button
              type="button"
              title="Desmembrar"
              class="btnDesmembrarItem w-9 h-9 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all flex items-center justify-center ${isSplit ? 'opacity-50 cursor-not-allowed' : ''}"
              data-index="${itemBase._index}"
              ${isSplit ? 'disabled' : ''}
            >
              <i class="fas fa-code-branch"></i>
            </button>
          </div>
        `;


      return `
        <tr class="border-b border-border last:border-b-0 hover:bg-white/30 transition-colors ${isSplit ? 'bg-amber-50/40' : ''}">
          <td class="px-4 py-3 text-sm">
            ${isSplit ? `<span class="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700 mr-2">DESMEMBRADO</span>` : ''}
            ${escapeHtml(item._codigo || '')}
          </td>
          <td class="px-4 py-3 text-sm">${escapeHtml(item._descricao || '')}</td>
          <td class="px-4 py-3 text-sm text-center">${escapeHtml(item._unidade || '')}</td>
          <td class="px-4 py-3 text-sm text-right">${escapeHtml(item._quantidade || '')}</td>
          <td class="px-4 py-3 text-sm text-right">${escapeHtml(item._valorUnitario || '')}</td>
          <td class="px-4 py-3 text-sm text-right font-semibold">${escapeHtml(item._valorTotal || '')}</td>
          <td class="px-4 py-3 text-sm">${badgeVinculo(item)}</td>
          <td class="px-4 py-3 text-sm min-w-[320px]">${htmlProdutoSistema}</td>
          <td class="px-4 py-3 text-sm whitespace-nowrap">${htmlAcao}</td>
        </tr>
      `;
    }).join('');
  }

  function localizarItemRenderizado(index, splitId = '') {
    const itemBase = itensTratados.find(x => x._index === Number(index));
    if (!itemBase) return null;

    if (!splitId) return { itemBase, itemAlvo: itemBase };

    const split = (itemBase._splits || []).find(x => String(x._splitId) === String(splitId));
    return { itemBase, itemAlvo: split || itemBase };
  }

  modal.innerHTML = `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex items-start justify-center p-4 md:p-6">
        <div class="w-[90vw] max-w-none mx-auto">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden bg-background">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-foreground">Importação de nota fiscal PDF</h3>
                <p class="text-sm text-muted-foreground">Validação e leitura inicial do DANFE/NF-e.</p>
              </div>

              <button id="btnFecharModalNfePdf" type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <div class="px-6 py-4 border-b border-border flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div class="flex flex-wrap gap-2">
                <button id="nfePdfAbaDetalhes" type="button" class="px-4 py-2 rounded-xl text-sm font-medium border border-border bg-white text-foreground shadow-sm transition-all">
                  <i class="fas fa-receipt mr-2"></i> Detalhes
                </button>

                <button id="nfePdfAbaItens" type="button" class="px-4 py-2 rounded-xl text-sm font-medium border border-border bg-white/60 text-muted-foreground hover:bg-white/90 transition-all">
                  <i class="fas fa-list mr-2"></i> Itens (${itensTratados.length})
                </button>
              </div>

              <div class="w-full lg:w-auto lg:min-w-[420px]">
                <label class="block text-sm font-medium text-foreground mb-2">
                  Local de armazenagem
                </label>

                <div class="flex flex-col sm:flex-row gap-2">
                  <select
                    id="nfePdfLocalArmazenagem"
                    class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm text-foreground"
                  >
                    <option value="">Selecione o local...</option>
                  </select>

                  <button
                    id="btnNovoLocalArmazenagem"
                    type="button"
                    class="w-10 h-10 rounded-xl border border-border bg-white/70 hover:bg-white transition-all flex items-center justify-center"
                    aria-label="Novo local"
                    title="Novo local"
                  >
                    <i class="fas fa-plus" aria-hidden="true"></i>
                  </button>

                </div>
              </div>
            </div>


            <div class="px-6 py-6">
              <div id="nfePdfConteudoDetalhes" class="space-y-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div class="rounded-2xl border border-border bg-white/50 p-5 shadow-sm space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div class="md:col-span-2 rounded-xl border border-border bg-white/70 px-4 py-3">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Emitente</div>
                        <div class="mt-1 text-sm font-semibold text-foreground break-words">${escapeHtml(dados.emitente || '—')}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 px-4 py-3">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Data emissão</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(dados.dataEmissao || '—')}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 px-4 py-3">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">CNPJ/CPF</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(formatarCpfCnpj(dados.emitenteCnpj))}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 px-4 py-3">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Número da nota</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(dados.numeroNota || '—')}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 px-4 py-3">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Série</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(dados.serie || '—')}</div>
                      </div>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-border bg-white/50 p-5 shadow-sm space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div class="md:col-span-2 rounded-xl border border-border bg-white/70 px-4 py-3">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Destinatário</div>
                        <div class="mt-1 text-sm font-semibold text-foreground break-words">${escapeHtml(dados.destinatario || '—')}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 px-4 py-3">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">CNPJ/CPF</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(formatarCpfCnpj(dados.destinatarioCnpj))}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 px-4 py-3">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">UF</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(dados.ufDestinatario || '—')}</div>
                      </div>

                      <div class="md:col-span-2 rounded-xl border border-border bg-white/70 px-4 py-3">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Fornecedor cadastrado</div>
                        <div class="mt-1 text-sm font-semibold text-foreground break-words">
                          ${fornecedor
                            ? escapeHtml(fornecedor.RAZAO_SOCIAL || fornecedor.razao_social || 'Fornecedor encontrado')
                            : 'Não encontrado automaticamente'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="nfePdfConteudoItens" class="hidden space-y-4">
                <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
                  <div class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                      <thead class="bg-white/50 border-b border-border sticky top-0">
                        <tr>
                          <th class="px-4 py-3 text-left font-semibold text-foreground">Código</th>
                          <th class="px-4 py-3 text-left font-semibold text-foreground">Descrição</th>
                          <th class="px-4 py-3 text-center font-semibold text-foreground">UN</th>
                          <th class="px-4 py-3 text-right font-semibold text-foreground">Qtd</th>
                          <th class="px-4 py-3 text-right font-semibold text-foreground">Vlr. Unit.</th>
                          <th class="px-4 py-3 text-right font-semibold text-foreground">Vlr. Total</th>
                          <th class="px-4 py-3 text-left font-semibold text-foreground">Status</th>
                          <th class="px-4 py-3 text-left font-semibold text-foreground">Produto sistema</th>
                          <th class="px-4 py-3 text-left font-semibold text-foreground">Ação</th>
                        </tr>
                      </thead>
                      <tbody id="nfePdfTabelaItensBody">
                        ${renderizarLinhasItens()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-6 py-4 border-t border-border flex justify-end gap-2">
              <button id="btnImportarNotaFiscalPdf" type="button"
                class="rounded-xl bg-primary text-white px-4 py-3 text-sm font-medium hover:opacity-90 transition-all">
                Importar
              </button>

              <button id="btnFecharRodapeModalNfePdf" type="button"
                class="rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all">
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  function formatarCpfCnpj(valor) {
    const doc = normalizarDocumentoPDF(valor);

    if (!doc) return '—';

    if (doc.length === 11) {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    if (doc.length === 14) {
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    return String(valor || '—');
  }



  document.body.appendChild(modal);
  await carregarLocaisArmazenagem(localArmazenagemSelecionadoId);

  document.getElementById('nfePdfLocalArmazenagem')?.addEventListener('change', (e) => {
    localArmazenagemSelecionadoId = e.target.value || '';
  });

  document.getElementById('btnNovoLocalArmazenagem')?.addEventListener('click', async () => {
    alert('Usuário sem permissão.');
    return;

    const novoLocal = await abrirModalNovoLocalArmazenagem();
    if (!novoLocal) return;

    localArmazenagemSelecionadoId = String(novoLocal.id || novoLocal.ID || '');
    await carregarLocaisArmazenagem(localArmazenagemSelecionadoId);
  });



  const btnDetalhes = document.getElementById('nfePdfAbaDetalhes');
  const btnItens = document.getElementById('nfePdfAbaItens');
  const conteudoDetalhes = document.getElementById('nfePdfConteudoDetalhes');
  const conteudoItens = document.getElementById('nfePdfConteudoItens');
  const tbodyItens = document.getElementById('nfePdfTabelaItensBody');
  const btnImportar = document.getElementById('btnImportarNotaFiscalPdf');

  function rerenderTabelaItens() {
    if (!tbodyItens) return;
    tbodyItens.innerHTML = renderizarLinhasItens();
    vincularEventosItens();
  }

  function mostrarAba(aba) {
    if (aba === 'detalhes') {
      conteudoDetalhes.classList.remove('hidden');
      conteudoItens.classList.add('hidden');
    } else {
      conteudoDetalhes.classList.add('hidden');
      conteudoItens.classList.remove('hidden');
    }
  }

  function fechar() {
    removerModalImportacaoNfe();
  }

  function vincularEventosItens() {
    document.querySelectorAll('.nfe-item-produto-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const splitId = String(e.currentTarget.dataset.splitId || '');
        const ref = localizarItemRenderizado(index, splitId);
        if (!ref) return;

        const { itemBase, itemAlvo } = ref;
        const value = String(e.currentTarget.value || '');

        const produto = produtosSistema.find(
          p => String(p.id ?? p.ID) === value
        );

        itemAlvo._produtoSelecionadoId = value;
        itemAlvo._idAmarracaoSelecionada = '';
        itemAlvo._produtoSelecionadoCodigo = produto
          ? normalizarTexto(produto.codigo ?? produto.CODIGO).toUpperCase()
          : '';
        itemAlvo._produtoSelecionadoDescricao = produto
          ? normalizarTexto(produto.descricao ?? produto.DESCRICAO).toUpperCase()
          : '';

        if (!splitId) {
          itemBase._produtoSelecionadoId = itemAlvo._produtoSelecionadoId;
          itemBase._idAmarracaoSelecionada = itemAlvo._idAmarracaoSelecionada;
          itemBase._produtoSelecionadoCodigo = itemAlvo._produtoSelecionadoCodigo;
          itemBase._produtoSelecionadoDescricao = itemAlvo._produtoSelecionadoDescricao;
        }
      });
    });

    document.querySelectorAll('.nfe-item-vinculo-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const splitId = String(e.currentTarget.dataset.splitId || '');
        const ref = localizarItemRenderizado(index, splitId);
        if (!ref) return;

        const { itemBase, itemAlvo } = ref;
        const option = e.currentTarget.selectedOptions?.[0];
        const idProduto = String(option?.value || '');
        const idAmarracao = String(option?.dataset?.amarracaoId || '');

        const produto = (itemAlvo._produtosVinculados || []).find(
          p => String(p.ID) === idProduto
        );

        itemAlvo._produtoSelecionadoId = idProduto;
        itemAlvo._idAmarracaoSelecionada = idAmarracao;
        itemAlvo._produtoSelecionadoCodigo = produto
          ? normalizarTexto(produto.CODIGO).toUpperCase()
          : '';
        itemAlvo._produtoSelecionadoDescricao = produto
          ? normalizarTexto(produto.DESCRICAO).toUpperCase()
          : '';
        itemAlvo._amarrado = Array.isArray(itemAlvo._produtosVinculados) && itemAlvo._produtosVinculados.length > 0;
        itemAlvo._multiplosVinculos = Array.isArray(itemAlvo._produtosVinculados) && itemAlvo._produtosVinculados.length > 1;

        if (!splitId) {
          itemBase._produtoSelecionadoId = itemAlvo._produtoSelecionadoId;
          itemBase._idAmarracaoSelecionada = itemAlvo._idAmarracaoSelecionada;
          itemBase._produtoSelecionadoCodigo = itemAlvo._produtoSelecionadoCodigo;
          itemBase._produtoSelecionadoDescricao = itemAlvo._produtoSelecionadoDescricao;
          itemBase._amarrado = itemAlvo._amarrado;
          itemBase._multiplosVinculos = itemAlvo._multiplosVinculos;
        }
      });
    });

    document.querySelectorAll('.btnNovoProdutoRapido').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const splitId = String(e.currentTarget.dataset.splitId || '');
        const ref = localizarItemRenderizado(index, splitId);
        if (!ref) return;

        const { itemBase, itemAlvo } = ref;

        try {
          const produtoCriado = await criarProdutoRapido(itemAlvo);
          if (!produtoCriado) return;

          const idCriado = String(produtoCriado.id ?? produtoCriado.ID ?? '');
          const jaExiste = produtosSistema.some(
            p => String(p.id ?? p.ID) === idCriado
          );

          if (!jaExiste) {
            produtosSistema.push(produtoCriado);
          }

          atualizarSelecaoItemPorProduto(itemAlvo, produtoCriado);

          if (!splitId) {
            itemBase._produtoSelecionadoId = itemAlvo._produtoSelecionadoId;
            itemBase._idAmarracaoSelecionada = itemAlvo._idAmarracaoSelecionada;
            itemBase._produtoSelecionadoCodigo = itemAlvo._produtoSelecionadoCodigo;
            itemBase._produtoSelecionadoDescricao = itemAlvo._produtoSelecionadoDescricao;
          }

          rerenderTabelaItens();
        } catch (err) {
          console.error(err);
          alert(err.message || 'Erro ao criar produto.');
        }
      });
    });

    document.querySelectorAll('.btnAdicionarVinculo').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const splitId = String(e.currentTarget.dataset.splitId || '');
        const ref = localizarItemRenderizado(index, splitId);
        if (!ref) return;

        const { itemBase, itemAlvo } = ref;

        if (!fornecedor?.id && !fornecedor?.ID) {
          alert('Fornecedor não encontrado para criar vínculo.');
          return;
        }

        try {
          const resultado = await abrirModalConfirmarNovoVinculo({
            item: itemAlvo,
            fornecedor
          });

          if (!resultado) return;

          const { id_produto, produto } = resultado;

          const resp = await adicionarAmarracaoItem({
            id_fornecedor: Number(fornecedor?.id ?? fornecedor?.ID),
            cod_produto_nf: itemAlvo._codigo,
            descricao_produto_nf: itemAlvo._descricao,
            id_produto: Number(id_produto),
            usuario: obterUsuarioLogado()
          });

          itemAlvo._produtosVinculados = Array.isArray(itemAlvo._produtosVinculados)
            ? itemAlvo._produtosVinculados
            : [];

          const jaExiste = itemAlvo._produtosVinculados.some(
            p => String(p.ID) === String(id_produto)
          );

          if (!jaExiste) {
            itemAlvo._produtosVinculados.push({
              ID_AMARRACAO: String(resp?.id || ''),
              ID: Number(id_produto),
              CODIGO: normalizarTexto(produto.codigo ?? produto.CODIGO).toUpperCase(),
              DESCRICAO: normalizarTexto(produto.descricao ?? produto.DESCRICAO).toUpperCase(),
              UNIDADE: normalizarTexto(produto.unidade ?? produto.UNIDADE).toUpperCase()
            });
          }

          itemAlvo._produtoSelecionadoId = String(id_produto);
          itemAlvo._produtoSelecionadoCodigo = normalizarTexto(produto.codigo ?? produto.CODIGO).toUpperCase();
          itemAlvo._produtoSelecionadoDescricao = normalizarTexto(produto.descricao ?? produto.DESCRICAO).toUpperCase();
          itemAlvo._amarrado = itemAlvo._produtosVinculados.length > 0;
          itemAlvo._multiplosVinculos = itemAlvo._produtosVinculados.length > 1;

          if (!splitId) {
            itemBase._produtosVinculados = itemAlvo._produtosVinculados;
            itemBase._produtoSelecionadoId = itemAlvo._produtoSelecionadoId;
            itemBase._produtoSelecionadoCodigo = itemAlvo._produtoSelecionadoCodigo;
            itemBase._produtoSelecionadoDescricao = itemAlvo._produtoSelecionadoDescricao;
            itemBase._amarrado = itemAlvo._amarrado;
            itemBase._multiplosVinculos = itemAlvo._multiplosVinculos;
          }

          rerenderTabelaItens();
        } catch (err) {
          console.error(err);
          alert(err.message || 'Erro ao adicionar vínculo.');
        }
      });
    });

    document.querySelectorAll('.btnEditarVinculo').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const splitId = String(e.currentTarget.dataset.splitId || '');
        const ref = localizarItemRenderizado(index, splitId);
        if (!ref) return;

        const { itemBase, itemAlvo } = ref;

        if (!itemAlvo._idAmarracaoSelecionada) {
          alert('Selecione na lista qual vínculo deseja editar.');
          return;
        }

        try {
          const resultado = await abrirModalEditarVinculo(itemAlvo);
          if (!resultado) return;

          const { novoProdutoId, produto } = resultado;

          const idx = (itemAlvo._produtosVinculados || []).findIndex(
            p => String(p.ID_AMARRACAO ?? '') === String(itemAlvo._idAmarracaoSelecionada)
          );

          if (idx >= 0 && produto) {
            itemAlvo._produtosVinculados[idx] = {
              ...itemAlvo._produtosVinculados[idx],
              ID: Number(novoProdutoId),
              CODIGO: normalizarTexto(produto.codigo ?? produto.CODIGO).toUpperCase(),
              DESCRICAO: normalizarTexto(produto.descricao ?? produto.DESCRICAO).toUpperCase(),
              UNIDADE: normalizarTexto(produto.unidade ?? produto.UNIDADE).toUpperCase()
            };
          }

          const produtoSelecionadoAtualizado = (itemAlvo._produtosVinculados || []).find(
            p => String(p.ID_AMARRACAO ?? '') === String(itemAlvo._idAmarracaoSelecionada)
          );

          if (produtoSelecionadoAtualizado) {
            itemAlvo._produtoSelecionadoId = String(produtoSelecionadoAtualizado.ID ?? '');
            itemAlvo._produtoSelecionadoCodigo = normalizarTexto(produtoSelecionadoAtualizado.CODIGO).toUpperCase();
            itemAlvo._produtoSelecionadoDescricao = normalizarTexto(produtoSelecionadoAtualizado.DESCRICAO).toUpperCase();
          }

          itemAlvo._amarrado = Array.isArray(itemAlvo._produtosVinculados) && itemAlvo._produtosVinculados.length > 0;
          itemAlvo._multiplosVinculos = Array.isArray(itemAlvo._produtosVinculados) && itemAlvo._produtosVinculados.length > 1;

          if (!splitId) {
            itemBase._produtosVinculados = itemAlvo._produtosVinculados;
            itemBase._produtoSelecionadoId = itemAlvo._produtoSelecionadoId;
            itemBase._produtoSelecionadoCodigo = itemAlvo._produtoSelecionadoCodigo;
            itemBase._produtoSelecionadoDescricao = itemAlvo._produtoSelecionadoDescricao;
            itemBase._amarrado = itemAlvo._amarrado;
            itemBase._multiplosVinculos = itemAlvo._multiplosVinculos;
          }

          rerenderTabelaItens();
        } catch (err) {
          console.error(err);
          alert(err.message || 'Erro ao editar vínculo.');
        }
      });
    });

    document.querySelectorAll('.btnDesmembrarItem').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const itemBase = itensTratados.find(x => x._index === index);
        if (!itemBase) return;

        const disponivel = calcularQuantidadeDisponivel(itemBase);

        if (disponivel <= 0) {
          alert('Não há quantidade disponível para novo desmembramento.');
          return;
        }

        try {
          const novoSplit = await abrirModalDesmembrarItem(itemBase);
          if (!novoSplit) return;

          itemBase._splits = Array.isArray(itemBase._splits) ? itemBase._splits : [];
          itemBase._splits.push(novoSplit);

          rerenderTabelaItens();
        } catch (err) {
          console.error(err);
          alert(err.message || 'Erro ao desmembrar item.');
        }
      });
    });
  }

  async function abrirModalEditarVinculo(item) {
    return new Promise((resolve, reject) => {
      try {
        if (!item?._idAmarracaoSelecionada) {
          resolve(null);
          return;
        }

        const overlayEdicao = document.createElement('div');
        overlayEdicao.id = 'editarVinculoOverlay';
        overlayEdicao.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

        const modalEdicao = document.createElement('div');
        modalEdicao.id = 'editarVinculoModal';
        modalEdicao.className = 'fixed inset-0 z-[140]';

        modalEdicao.innerHTML = `
          <div class="w-full h-full overflow-auto">
            <div class="min-h-full flex items-center justify-center p-4">
              <div class="w-full max-w-xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
                <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-lg font-semibold text-foreground">Editar vínculo</h3>
                    <p class="text-sm text-muted-foreground">Selecione o novo produto interno para este vínculo.</p>
                  </div>

                  <button
                    type="button"
                    id="btnFecharEditarVinculo"
                    class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                  >
                    <i class="fas fa-times" aria-hidden="true"></i>
                  </button>
                </div>

                <form id="formEditarVinculo" class="px-6 py-6 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">Código do item da nota</label>
                    <input
                      type="text"
                      class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                      value="${escapeHtml(item._codigo || '')}"
                      readonly
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-foreground mb-1">Descrição do item da nota</label>
                    <input
                      type="text"
                      class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                      value="${escapeHtml(item._descricao || '')}"
                      readonly
                    />
                  </div>

                  <div>
                    <div class="flex items-center justify-between gap-2 mb-1">
                      <label class="block text-sm font-medium text-foreground">Produto do sistema</label>

                      <button
                        type="button"
                        id="btnNovoProdutoRapidoEditarVinculo"
                        class="inline-flex items-center gap-2 rounded-xl border border-border bg-white/70 px-3 py-2 text-xs font-medium hover:bg-white transition-all"
                      >
                        <i class="fas fa-plus"></i>
                        Novo produto rápido
                      </button>
                    </div>

                    <select
                      id="editarVinculoProdutoSelect"
                      class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                      required
                    >
                      <option value="">Selecione...</option>
                      ${gerarOpcoesProdutos(item._produtoSelecionadoId)}
                    </select>
                  </div>

                  <div class="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      id="btnCancelarEditarVinculo"
                      class="rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      id="btnSalvarEditarVinculo"
                      class="rounded-xl bg-primary text-white px-4 py-3 text-sm font-medium hover:opacity-90 transition-all"
                    >
                      Salvar vínculo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        `;

        function fecharModalEdicao() {
          overlayEdicao.remove();
          modalEdicao.remove();
        }

        function cancelar() {
          fecharModalEdicao();
          resolve(null);
        }

        function preencherSelectProdutos(produtoSelecionadoId = '') {
          const select = modalEdicao.querySelector('#editarVinculoProdutoSelect');
          if (!select) return;

          select.innerHTML = `
            <option value="">Selecione...</option>
            ${gerarOpcoesProdutos(produtoSelecionadoId)}
          `;
        }

        document.body.appendChild(overlayEdicao);
        document.body.appendChild(modalEdicao);

        overlayEdicao.addEventListener('click', cancelar);
        modalEdicao.querySelector('#btnFecharEditarVinculo')?.addEventListener('click', cancelar);
        modalEdicao.querySelector('#btnCancelarEditarVinculo')?.addEventListener('click', cancelar);

        modalEdicao.querySelector('#btnNovoProdutoRapidoEditarVinculo')?.addEventListener('click', async () => {
          const btnNovo = modalEdicao.querySelector('#btnNovoProdutoRapidoEditarVinculo');

          try {
            btnNovo.disabled = true;
            btnNovo.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Criando...`;

            const produtoCriado = await criarProdutoRapido(item);
            if (!produtoCriado) {
              btnNovo.disabled = false;
              btnNovo.innerHTML = `<i class="fas fa-plus"></i> Novo produto rápido`;
              return;
            }

            const idCriado = String(produtoCriado.id ?? produtoCriado.ID ?? '');

            const jaExiste = produtosSistema.some(
              p => String(p.id ?? p.ID) === idCriado
            );

            if (!jaExiste) {
              produtosSistema.push(produtoCriado);
            }

            preencherSelectProdutos(idCriado);
          } catch (err) {
            console.error(err);
            alert(err.message || 'Erro ao criar produto.');
          } finally {
            btnNovo.disabled = false;
            btnNovo.innerHTML = `<i class="fas fa-plus"></i> Novo produto rápido`;
          }
        });

        modalEdicao.querySelector('#formEditarVinculo')?.addEventListener('submit', async (e) => {
          e.preventDefault();

          const btnSalvar = modalEdicao.querySelector('#btnSalvarEditarVinculo');
          const novoProdutoId = normalizarTexto(
            modalEdicao.querySelector('#editarVinculoProdutoSelect')?.value
          );

          if (!novoProdutoId) {
            alert('Selecione o produto do sistema.');
            return;
          }

          try {
            btnSalvar.disabled = true;
            btnSalvar.textContent = 'Salvando...';

            await editarAmarracaoItem(item._idAmarracaoSelecionada, {
              id_produto: Number(novoProdutoId),
              usuario: obterUsuarioLogado()
            });

            const produto = produtosSistema.find(
              p => String(p.id ?? p.ID) === String(novoProdutoId)
            );

            fecharModalEdicao();
            resolve({
              novoProdutoId,
              produto
            });
          } catch (err) {
            btnSalvar.disabled = false;
            btnSalvar.textContent = 'Salvar vínculo';
            reject(err);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async function abrirModalConfirmarNovoVinculo({ item, fornecedor }) {
    return new Promise((resolve, reject) => {
      try {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-[140]';

        modal.innerHTML = `
          <div class="w-full h-full overflow-auto">
            <div class="min-h-full flex items-center justify-center p-4">
              <div class="w-full max-w-2xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
                <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
                  <div>
                    <h3 class="text-lg font-semibold text-foreground">Confirmar novo vínculo</h3>
                    <p class="text-sm text-muted-foreground">Selecione o produto interno e confirme a amarração.</p>
                  </div>

                  <button
                    type="button"
                    id="btnFecharConfirmacaoVinculo"
                    class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                  >
                    <i class="fas fa-times" aria-hidden="true"></i>
                  </button>
                </div>

                <form id="formConfirmacaoVinculo" class="px-6 py-6 space-y-4">
                  <div class="rounded-2xl border border-border bg-white/60 p-4 space-y-3">
                    <div>
                      <div class="text-xs uppercase tracking-wide text-muted-foreground">Fornecedor</div>
                      <div class="text-sm font-medium text-foreground">
                        ${escapeHtml(fornecedor?.razao_social || fornecedor?.RAZAO_SOCIAL || '')}
                      </div>
                    </div>

                    <div>
                      <div class="text-xs uppercase tracking-wide text-muted-foreground">Produto da nota</div>
                      <div class="text-sm text-foreground"><strong>Código:</strong> ${escapeHtml(item._codigo || '')}</div>
                      <div class="text-sm text-foreground"><strong>Descrição:</strong> ${escapeHtml(item._descricao || '')}</div>
                    </div>
                  </div>

                  <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <label class="block text-sm font-medium text-foreground">Produto interno</label>

                      <button
                        type="button"
                        id="btnNovoProdutoRapidoConfirmacaoVinculo"
                        class="inline-flex items-center gap-2 rounded-xl border border-border bg-white/70 px-3 py-2 text-xs font-medium hover:bg-white transition-all"
                      >
                        <i class="fas fa-plus"></i>
                        Novo produto rápido
                      </button>
                    </div>

                    <select
                      id="confirmacaoVinculoProdutoSelect"
                      class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                      required
                    >
                      <option value="">Selecione...</option>
                      ${gerarOpcoesProdutos(item._produtoSelecionadoId || '')}
                    </select>
                  </div>

                  <div id="resumoProdutoSelecionado" class="rounded-2xl border border-border bg-white/60 p-4 space-y-2">
                    <div class="text-xs uppercase tracking-wide text-muted-foreground">Produto interno selecionado</div>
                    <div class="text-sm text-muted-foreground">Nenhum produto selecionado.</div>
                  </div>

                  <div class="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      id="btnCancelarConfirmacaoVinculo"
                      class="rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      id="btnConfirmarConfirmacaoVinculo"
                      class="rounded-xl bg-primary text-white px-4 py-3 text-sm font-medium hover:opacity-90 transition-all"
                    >
                      Salvar vínculo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        `;

        function fechar() {
          overlay.remove();
          modal.remove();
        }

        function cancelar() {
          fechar();
          resolve(null);
        }

        function preencherSelect(produtoSelecionadoId = '') {
          const select = modal.querySelector('#confirmacaoVinculoProdutoSelect');
          if (!select) return;

          select.innerHTML = `
            <option value="">Selecione...</option>
            ${gerarOpcoesProdutos(produtoSelecionadoId)}
          `;
        }

        function atualizarResumoProduto() {
          const select = modal.querySelector('#confirmacaoVinculoProdutoSelect');
          const resumo = modal.querySelector('#resumoProdutoSelecionado');
          if (!select || !resumo) return;

          const idSelecionado = String(select.value || '');
          const produto = produtosSistema.find(
            p => String(p.id ?? p.ID) === idSelecionado
          );

          if (!produto) {
            resumo.innerHTML = `
              <div class="text-xs uppercase tracking-wide text-muted-foreground">Produto interno selecionado</div>
              <div class="text-sm text-muted-foreground">Nenhum produto selecionado.</div>
            `;
            return;
          }

          resumo.innerHTML = `
            <div class="text-xs uppercase tracking-wide text-muted-foreground">Produto interno selecionado</div>
            <div class="text-sm text-foreground"><strong>ID:</strong> ${escapeHtml(String(produto.id ?? produto.ID ?? ''))}</div>
            <div class="text-sm text-foreground"><strong>Código:</strong> ${escapeHtml(String(produto.codigo ?? produto.CODIGO ?? ''))}</div>
            <div class="text-sm text-foreground"><strong>Descrição:</strong> ${escapeHtml(String(produto.descricao ?? produto.DESCRICAO ?? ''))}</div>
            <div class="text-sm text-foreground"><strong>Unidade:</strong> ${escapeHtml(String(produto.unidade ?? produto.UNIDADE ?? ''))}</div>
          `;
        }

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        overlay.addEventListener('click', cancelar);
        modal.querySelector('#btnFecharConfirmacaoVinculo')?.addEventListener('click', cancelar);
        modal.querySelector('#btnCancelarConfirmacaoVinculo')?.addEventListener('click', cancelar);

        modal.querySelector('#confirmacaoVinculoProdutoSelect')?.addEventListener('change', atualizarResumoProduto);

        modal.querySelector('#btnNovoProdutoRapidoConfirmacaoVinculo')?.addEventListener('click', async () => {
          const btnNovo = modal.querySelector('#btnNovoProdutoRapidoConfirmacaoVinculo');

          try {
            btnNovo.disabled = true;
            btnNovo.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Criando...`;

            const produtoCriado = await criarProdutoRapido(item);
            if (!produtoCriado) return;

            const idCriado = String(produtoCriado.id ?? produtoCriado.ID ?? '');

            const jaExiste = produtosSistema.some(
              p => String(p.id ?? p.ID) === idCriado
            );

            if (!jaExiste) {
              produtosSistema.push(produtoCriado);
            }

            preencherSelect(idCriado);
            atualizarResumoProduto();
          } catch (err) {
            console.error(err);
            alert(err.message || 'Erro ao criar produto.');
          } finally {
            btnNovo.disabled = false;
            btnNovo.innerHTML = `<i class="fas fa-plus"></i> Novo produto rápido`;
          }
        });

        modal.querySelector('#formConfirmacaoVinculo')?.addEventListener('submit', async (e) => {
          e.preventDefault();

          const btnSalvar = modal.querySelector('#btnConfirmarConfirmacaoVinculo');
          const idProdutoSelecionado = String(
            modal.querySelector('#confirmacaoVinculoProdutoSelect')?.value || ''
          );

          if (!idProdutoSelecionado) {
            alert('Selecione o produto interno.');
            return;
          }

          const produtoSelecionado = produtosSistema.find(
            p => String(p.id ?? p.ID) === idProdutoSelecionado
          );

          if (!produtoSelecionado) {
            alert('Produto selecionado não encontrado.');
            return;
          }

          try {
            btnSalvar.disabled = true;
            btnSalvar.textContent = 'Salvando...';

            fechar();
            resolve({
              id_produto: Number(idProdutoSelecionado),
              produto: produtoSelecionado
            });
          } catch (err) {
            btnSalvar.disabled = false;
            btnSalvar.textContent = 'Salvar vínculo';
            reject(err);
          }
        });

        atualizarResumoProduto();
      } catch (err) {
        reject(err);
      }
    });
  }



  btnDetalhes?.addEventListener('click', () => mostrarAba('detalhes'));
  btnItens?.addEventListener('click', () => mostrarAba('itens'));
  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharModalNfePdf')?.addEventListener('click', fechar);
  document.getElementById('btnFecharRodapeModalNfePdf')?.addEventListener('click', fechar);

  btnImportar?.addEventListener('click', async () => {
    try {
      btnImportar.disabled = true;
      btnImportar.textContent = 'Importando...';

      const selectLocal = document.getElementById('nfePdfLocalArmazenagem');
      const idLocalAlmoxarifado = String(selectLocal?.value || '');
      const local = selectLocal?.selectedOptions?.[0]?.textContent?.trim() || '';

      if (!idLocalAlmoxarifado) {
        throw new Error('Selecione o local de armazenagem.');
      }

      const itensImportacao = montarItensTabelaComDesmembramentos(itensTratados);

      if (!itensImportacao.length) {
        throw new Error('Nenhum item encontrado para importar.');
      }

      for (const item of itensImportacao) {
        if (!item._produtoSelecionadoId) {
          mostrarAba('itens');
          throw new Error(`Selecione o produto do sistema para o item ${item._codigo || item._descricao}.`);
        }
      }

      const idFornecedor = Number(fornecedor?.ID ?? fornecedor?.id ?? 0);

      for (const item of itensImportacao) {
        const itemBase = item._parentGroupId
          ? itensTratados.find(x => x._grupoId === item._parentGroupId)
          : itensTratados.find(x => x._index === item._index);

        if (!itemBase) continue;

        const jaExisteEntreVinculos = Array.isArray(itemBase._produtosVinculados)
          ? itemBase._produtosVinculados.some(
              p => String(p.ID) === String(item._produtoSelecionadoId)
            )
          : false;

        if (!jaExisteEntreVinculos && idFornecedor) {
          await adicionarAmarracaoItem({
            id_fornecedor: idFornecedor,
            cod_produto_nf: item._codigo,
            descricao_produto_nf: item._descricao,
            id_produto: Number(item._produtoSelecionadoId),
            usuario: obterUsuarioLogado()
          });
        }

        itemBase._amarrado = true;
      }

      const payloadImportacao = {
        emitente: dados.emitente || '',
        emitenteCnpj: dados.emitenteCnpj || '',
        destinatarioCnpj: dados.destinatarioCnpj || '',
        numeroNota: dados.numeroNota || '',
        serie: dados.serie || '',
        dataEmissao: dados.dataEmissao || '',
        usuarioRegistro: obterUsuarioLogado(),
        idLocalAlmoxarifado: Number(idLocalAlmoxarifado),
        local,
        itens: itensImportacao.map(item => ({
          codigo: item._codigo,
          descricao: item._descricao,
          unidade: item._unidade,
          quantidade: item._quantidade,
          valorUnitario: item._valorUnitario,
          valorTotal: item._valorTotal,
          id_produto: Number(item._produtoSelecionadoId),
          cod_produto_sistema: item._produtoSelecionadoCodigo,
          descricao_produto_sistema: item._produtoSelecionadoDescricao
        }))
      };

      await confirmarImportacaoPdf(payloadImportacao);

      alert('Importação realizada com sucesso.');
      fechar();
      carregarControleEstoque();

      if (typeof carregarEstoque === 'function') {
        try { await carregarEstoque(); } catch {}
      }
    } catch (err) {
      console.error('Erro ao importar nota PDF:', err);
      alert(err.message || 'Erro ao importar nota.');
    } finally {
      btnImportar.disabled = false;
      btnImportar.textContent = 'Importar';
    }
  });
  vincularEventosItens();
}

async function adicionarAmarracaoItem(payload) {
  return apiJson(apiUrl('/api/estoque/produtos-amarracao/adicionar'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function editarAmarracaoItem(id, payload) {
  return apiJson(apiUrl(`/api/estoque/produtos-amarracao/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

function atualizarSelecaoItemPorProduto(item, produto) {
  item._produtoSelecionadoId = String(produto?.ID ?? produto?.id ?? '');
  item._produtoSelecionadoCodigo = normalizarTexto(produto?.CODIGO ?? produto?.codigo).toUpperCase();
  item._produtoSelecionadoDescricao = normalizarTexto(produto?.DESCRICAO ?? produto?.descricao).toUpperCase();
  item._idAmarracaoSelecionada = String(produto?.ID_AMARRACAO ?? '');
}


async function extrairTextoPdfComPdfJs(file) {
  const pdfjs = ensurePdfJsLoaded();

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;

  let texto = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    texto += '\n' + pageText;
  }

  return texto;
}

async function processarImportacaoDocumentoFiscal(file) {
  if (!file) return;

  const nome = String(file.name || '').toLowerCase();
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(nome);
  const isXml =
    file.type === 'text/xml' ||
    file.type === 'application/xml' ||
    /\.xml$/i.test(nome);

  if (!isPdf && !isXml) {
    alert('Selecione um arquivo PDF ou XML válido.');
    return;
  }

  try {
    let dados;

    if (isPdf) {
      const texto = await extrairTextoPdfComPdfJs(file);

      if (!validarPdfComoDocumentoFiscal(texto)) {
        alert('O arquivo selecionado não parece ser um documento fiscal suportado.');
        return;
      }

      dados = parseDocumentoFiscalPdf(texto);
    } else {
      const xmlText = await file.text();
      dados = parseDocumentoFiscalXml(xmlText);

      if (!Array.isArray(dados?.itens) || !dados.itens.length) {
        throw new Error('Nenhum item foi encontrado no XML.');
      }
    }

    const validacao = await validarImportacaoAntesModal(dados);
    dados._validacao = validacao;

    await abrirModalImportacaoNfe(dados);
  } catch (err) {
    console.error('Erro ao processar documento fiscal:', err);
    alert(err?.message || 'Erro ao processar o arquivo.');
  }
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('#btnImportarPdfEstoque');
  if (!btn) return;

  document.getElementById('inputImportarPdfEstoque')?.click();
});

document.addEventListener('change', async (e) => {
  const input = e.target.closest('#inputImportarPdfEstoque');
  if (!input) return;

  const file = input.files?.[0];
  await processarImportacaoDocumentoFiscal(file);
  input.value = '';
});



function getPdfJsLibSafe() {
  return (
    window.pdfjsLib ||
    window['pdfjsLib'] ||
    window['pdfjs-dist/build/pdf'] ||
    window?.exports?.['pdfjs-dist/build/pdf'] ||
    null
  );
}

function ensurePdfJsLoaded() {
  const lib = getPdfJsLibSafe();

  if (!lib) {
    throw new Error('pdf.js não carregado na página.');
  }

  if (lib.GlobalWorkerOptions) {
    lib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';
  }

  return lib;
}

function formatarDecimalBr(valor, casas = 4) {
  const num = Number(valor || 0);
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  });
}

function formatarMoedaBr(valor) {
  const num = Number(valor || 0);
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function normalizarChaveAgrupamento(v) {
  return normalizarTexto(v).replace(/\s+/g, ' ').trim().toUpperCase();
}

function parseQuantidadeItem(v) {
  return parseDecimalBr(v);
}

function consolidarItensNota(originais = []) {
  const grupos = new Map();
  const alertas = [];
  let contador = 0;

  for (const bruto of Array.isArray(originais) ? originais : []) {
    const codigo = normalizarTexto(bruto?.codigo);
    const descricao = normalizarTexto(bruto?.descricao);
    const unidade = normalizarTexto(bruto?.unidade);
    const valorUnitario = parseDecimalBr(bruto?.valorUnitario);
    const quantidade = parseDecimalBr(bruto?.quantidade);
    const valorTotalOriginal = parseDecimalBr(bruto?.valorTotal);
    const valorTotalCalculado = quantidade * valorUnitario;
    const valorTotal = valorTotalOriginal || valorTotalCalculado;

    const chaveCodigo = normalizarChaveAgrupamento(codigo);
    const chaveDescricao = normalizarChaveAgrupamento(descricao);
    const chaveGrupo = `${chaveCodigo}|||${chaveDescricao}`;

    if (!grupos.has(chaveGrupo)) {
      grupos.set(chaveGrupo, {
        _grupoId: `grp_${++contador}`,
        codigo,
        descricao,
        unidade,
        quantidadeTotal: 0,
        valorUnitario,
        valorTotal: 0,
        _descricoesMesmoCodigo: new Set([chaveDescricao]),
        _codigoKey: chaveCodigo,
        _descricaoKey: chaveDescricao,
        _itensOriginais: [],
        _splits: []
      });
    }

    const grupo = grupos.get(chaveGrupo);
    grupo.quantidadeTotal += quantidade;
    grupo.valorTotal += valorTotal;
    grupo._itensOriginais.push({
      ...bruto,
      _quantidadeNum: quantidade,
      _valorUnitarioNum: valorUnitario,
      _valorTotalNum: valorTotal
    });
  }

  const gruposPorCodigo = new Map();

  for (const grupo of grupos.values()) {
    if (!gruposPorCodigo.has(grupo._codigoKey)) {
      gruposPorCodigo.set(grupo._codigoKey, []);
    }
    gruposPorCodigo.get(grupo._codigoKey).push(grupo);
  }

  for (const [codigoKey, lista] of gruposPorCodigo.entries()) {
    const descricoes = [...new Set(lista.map(x => x._descricaoKey))];
    if (codigoKey && descricoes.length > 1) {
      const codigoExibicao = lista[0]?.codigo || codigoKey;
      alertas.push(
        `O código ${codigoExibicao} apareceu com descrições diferentes na nota. Os itens serão mantidos separados.`
      );
    }
  }

  return {
    alertas,
    itens: [...grupos.values()].map((grupo, idx) => ({
      _indexBase: idx,
      _grupoId: grupo._grupoId,
      codigo: grupo.codigo,
      descricao: grupo.descricao,
      unidade: grupo.unidade,
      quantidade: formatarDecimalBr(grupo.quantidadeTotal, 2),
      valorUnitario: formatarMoedaBr(grupo.valorUnitario),
      valorTotal: formatarMoedaBr(grupo.valorTotal),
      _quantidadeTotalNum: grupo.quantidadeTotal,
      _valorUnitarioNum: grupo.valorUnitario,
      _valorTotalNum: grupo.valorTotal,
      _itensOriginais: grupo._itensOriginais,
      _splits: []
    }))
  };
}

function calcularQuantidadeJaDistribuida(item) {
  return (item._splits || []).reduce((acc, split) => {
    return acc + parseDecimalBr(split._quantidade || 0);
  }, 0);
}

function calcularQuantidadeDisponivel(item) {
  return Number(item._quantidadeTotalNum || 0) - calcularQuantidadeJaDistribuida(item);
}

function recalcularTotaisSplit(split, itemPai) {
  const qtd = parseDecimalBr(split._quantidade || 0);
  const unit = Number(itemPai._valorUnitarioNum || 0);
  split._valorUnitario = formatarMoedaBr(unit);
  split._valorTotal = formatarMoedaBr(qtd * unit);
}

function montarItensTabelaComDesmembramentos(listaBase = []) {
  const resultado = [];

  for (const item of listaBase) {
    resultado.push({
      ...item,
      _isSplit: false,
      _splitId: '',
      _parentGroupId: item._grupoId
    });

    for (const split of item._splits || []) {
      resultado.push({
        ...item,
        ...split,
        _isSplit: true,
        _parentGroupId: item._grupoId
      });
    }
  }

  return resultado;
}

function abrirModalDesmembrarItem(itemBase) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[140]';

    const qtdDisponivel = calcularQuantidadeDisponivel(itemBase);

    modal.innerHTML = `
      <div class="w-full h-full overflow-auto">
        <div class="min-h-full flex items-center justify-center p-4">
          <div class="w-full max-w-xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Desmembrar item</h3>
                <p class="text-sm text-muted-foreground">Crie uma nova linha para o mesmo produto da nota.</p>
              </div>

              <button type="button" id="btnFecharDesmembrar"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <form id="formDesmembrarItem" class="px-6 py-6 space-y-4">
              <div class="rounded-2xl border border-border bg-white/60 p-4 space-y-2">
                <div class="text-sm"><strong>Código:</strong> ${escapeHtml(itemBase._codigo || '')}</div>
                <div class="text-sm"><strong>Descrição:</strong> ${escapeHtml(itemBase._descricao || '')}</div>
                <div class="text-sm"><strong>Qtd total:</strong> ${escapeHtml(itemBase._quantidade || '')}</div>
                <div class="text-sm"><strong>Qtd disponível:</strong> ${escapeHtml(formatarDecimalBr(qtdDisponivel, 2))}</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Nova quantidade</label>
                <input
                  id="inputQuantidadeDesmembrar"
                  type="text"
                  class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                  placeholder="Ex.: 1,0000"
                  required
                />
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button type="button" id="btnCancelarDesmembrar"
                  class="rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all">
                  Cancelar
                </button>

                <button type="submit" id="btnSalvarDesmembrar"
                  class="rounded-xl bg-primary text-white px-4 py-3 text-sm font-medium hover:opacity-90 transition-all">
                  Gerar linha
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    function fechar() {
      overlay.remove();
      modal.remove();
    }

    function cancelar() {
      fechar();
      resolve(null);
    }

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    overlay.addEventListener('click', cancelar);
    modal.querySelector('#btnFecharDesmembrar')?.addEventListener('click', cancelar);
    modal.querySelector('#btnCancelarDesmembrar')?.addEventListener('click', cancelar);

    modal.querySelector('#formDesmembrarItem')?.addEventListener('submit', (e) => {
      e.preventDefault();

      const qtd = parseDecimalBr(
        modal.querySelector('#inputQuantidadeDesmembrar')?.value || 0
      );

      const disponivel = calcularQuantidadeDisponivel(itemBase);

      if (!qtd || qtd <= 0) {
        alert('Informe uma quantidade válida.');
        return;
      }

      if (qtd > disponivel) {
        alert(`A quantidade informada excede o disponível (${formatarDecimalBr(disponivel, 2)}).`);
        return;
      }

      const novoSplit = {
        _splitId: `split_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        _codigo: itemBase._codigo,
        _descricao: itemBase._descricao,
        _unidade: itemBase._unidade,
        _quantidade: formatarDecimalBr(qtd, 2),
        _quantidadeNum: qtd,
        _produtoSelecionadoId: itemBase._produtoSelecionadoId || '',
        _produtoSelecionadoCodigo: itemBase._produtoSelecionadoCodigo || '',
        _produtoSelecionadoDescricao: itemBase._produtoSelecionadoDescricao || '',
        _idAmarracaoSelecionada: itemBase._idAmarracaoSelecionada || '',
        _produtosVinculados: Array.isArray(itemBase._produtosVinculados) ? [...itemBase._produtosVinculados] : [],
        _amarrado: !!itemBase._amarrado,
        _multiplosVinculos: !!itemBase._multiplosVinculos
      };

      recalcularTotaisSplit(novoSplit, itemBase);

      fechar();
      resolve(novoSplit);
    });
  });
}

// ==== Botão para Importar e vlidar dados de nota PDF ======//

async function validarImportacaoAntesModal(dados) {

  const response = await fetch(apiUrl('/api/estoque/importacao-pdf/validar'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });

  const texto = await response.text();

  let result = {};

  try {
    result = texto ? JSON.parse(texto) : {};
  } catch (err) {
    result = {};
  }

  if (!response.ok || !result.success) {

    throw new Error(
      result.error
        ? `${result.message || 'Erro ao validar importação do PDF.'} Detalhe: ${result.error}`
        : (result.message || `Erro ao validar importação do PDF. HTTP ${response.status}`)
    );
  }
  return result;
}


async function carregarProdutosSistema() {
  const response = await fetch(apiUrl('/api/estoque/produtos'));
  const texto = await response.text();
  let result = {};

  try {
    result = texto ? JSON.parse(texto) : {};
  } catch {
    result = {};
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || 'Erro ao carregar produtos.');
  }

  return result.items || [];
}

function textoLivre(v) {
  return String(v ?? '').trim();
}

function normalizarDocumentoPDF(v) {
  return String(v ?? '').replace(/\D+/g, '').trim();
}

function parseDecimalBr(v) {
  const s = String(v ?? '').trim();
  if (!s) return 0;

  if (s.includes('.') && s.includes(',')) {
    return Number(s.replace(/\./g, '').replace(',', '.')) || 0;
  }

  if (s.includes(',')) {
    return Number(s.replace(',', '.')) || 0;
  }

  return Number(s) || 0;
}


function dataBrParaMysql(v) {
  const s = String(v ?? '').trim();
  if (!s) return null;

  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;

  const [, dd, mm, yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}

async function carregarLocaisArmazenagem(selectedId = '') {
  const select = document.getElementById('nfePdfLocalArmazenagem');
  if (!select) return;

  select.innerHTML = '<option value="">Carregando locais...</option>';

  try {
    const response = await fetch(apiUrl('/api/locais-almoxarifado'));
    const locais = await response.json();

    select.innerHTML = `
      <option value="">Selecione o local...</option>
      ${Array.isArray(locais) ? locais.map(local => `
        <option value="${local.ID}" ${String(local.ID) === String(selectedId) ? 'selected' : ''}>
          ${escapeHtml(local.NOME)}
        </option>
      `).join('') : ''}
    `;
  } catch (error) {
    console.error(error);
    select.innerHTML = '<option value="">Erro ao carregar locais</option>';
  }
}

function abrirModalNovoLocalArmazenagem() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[140]';

    modal.innerHTML = `
      <div class="w-full h-full overflow-auto">
        <div class="min-h-full flex items-center justify-center p-4">
          <div class="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Novo local de armazenagem</h3>
                <p class="text-sm text-muted-foreground">Cadastre um novo local para uso na entrada.</p>
              </div>

              <button id="btnFecharNovoLocalArmazenagem" type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <form id="formNovoLocalArmazenagem" class="px-6 py-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Nome do local</label>
                <input
                  id="novoLocalArmazenagemNome"
                  type="text"
                  maxlength="150"
                  class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm"
                  placeholder="Ex.: PRATELEIRA A1"
                  required
                />
              </div>

              <div class="flex justify-end gap-2">
                <button type="button" id="btnCancelarNovoLocalArmazenagem"
                  class="rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all">
                  Cancelar
                </button>

                <button type="submit"
                  class="rounded-xl bg-primary text-white px-4 py-3 text-sm font-medium hover:opacity-90 transition-all">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    function fechar(retorno = null) {
      overlay.remove();
      modal.remove();
      resolve(retorno);
    }

    overlay.addEventListener('click', () => fechar(null));
    modal.querySelector('#btnFecharNovoLocalArmazenagem')?.addEventListener('click', () => fechar(null));
    modal.querySelector('#btnCancelarNovoLocalArmazenagem')?.addEventListener('click', () => fechar(null));

    modal.querySelector('#formNovoLocalArmazenagem')?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = modal.querySelector('#novoLocalArmazenagemNome')?.value?.trim();

      if (!nome) {
        alert('Informe o nome do local.');
        return;
      }

      try {
        const response = await fetch(apiUrl('/api/locais-almoxarifado'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nome })
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data?.erro || 'Erro ao cadastrar local.');
          return;
        }

        fechar(data);
      } catch (error) {
        console.error(error);
        alert('Erro ao cadastrar local.');
      }
    });
  });
}

function abrirModalNovoCentrodeCusto() {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[140]';

    modal.innerHTML = `
      <div class="w-full h-full overflow-auto">
        <div class="min-h-full flex items-center justify-center p-4">
          <div class="w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Novo centro de custo</h3>
                <p class="text-sm text-muted-foreground">Cadastre um novo centro de custo.</p>
              </div>

              <button id="btnFecharNovoLocalArmazenagem" type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <form id="formNovoLocalArmazenagem" class="px-6 py-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Nome do local</label>
                <input
                  id="novoLocalArmazenagemNome"
                  type="text"
                  maxlength="150"
                  class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm"
                  placeholder="Ex.: PRATELEIRA A1"
                  required
                />
              </div>

              <div class="flex justify-end gap-2">
                <button type="button" id="btnCancelarNovoLocalArmazenagem"
                  class="rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all">
                  Cancelar
                </button>

                <button type="submit"
                  class="rounded-xl bg-primary text-white px-4 py-3 text-sm font-medium hover:opacity-90 transition-all">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    function fechar(retorno = null) {
      overlay.remove();
      modal.remove();
      resolve(retorno);
    }

    overlay.addEventListener('click', () => fechar(null));
    modal.querySelector('#btnFecharNovoLocalArmazenagem')?.addEventListener('click', () => fechar(null));
    modal.querySelector('#btnCancelarNovoLocalArmazenagem')?.addEventListener('click', () => fechar(null));

    modal.querySelector('#formNovoLocalArmazenagem')?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = modal.querySelector('#novoLocalArmazenagemNome')?.value?.trim();

      if (!nome) {
        alert('Informe o nome do local.');
        return;
      }

      try {
        const response = await fetch(apiUrl('/api/locais-centrocusto'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nome })
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data?.erro || 'Erro ao cadastrar local.');
          return;
        }

        fechar(data);
      } catch (error) {
        console.error(error);
        alert('Erro ao cadastrar local.');
      }
    });
  });
}

function getTagText(node, tagNames = []) {
  for (const tag of tagNames) {
    const el = node.getElementsByTagName(tag)[0];
    if (el?.textContent) return el.textContent.trim();
  }
  return '';
}

function getNode(parent, tagNames = []) {
  for (const tag of tagNames) {
    const el = parent.getElementsByTagName(tag)[0];
    if (el) return el;
  }
  return null;
}

function parseDocumentoFiscalXml(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

  const parserError = xmlDoc.getElementsByTagName('parsererror')[0];
  if (parserError) {
    throw new Error('XML inválido ou mal formatado.');
  }

  const modelo = detectarModeloDocumentoFiscalXml(xmlDoc);

  if (modelo === 'nfe') {
    return parseNfeXml(xmlDoc, xmlText);
  }

  if (modelo === 'nfcom') {
    return parseNFComXml(xmlDoc, xmlText);
  }

  throw new Error('XML fiscal não suportado. Estrutura infNFe/infNFCom não encontrada.');
}

function getXmlText(parent, tagNames = []) {
  if (!parent) return '';

  for (const tag of tagNames) {
    const el = parent.getElementsByTagName(tag)[0];
    if (el?.textContent) {
      return String(el.textContent).trim();
    }
  }

  return '';
}

function getXmlNode(parent, tagNames = []) {
  if (!parent) return null;

  for (const tag of tagNames) {
    const el = parent.getElementsByTagName(tag)[0];
    if (el) return el;
  }

  return null;
}

function formatarDataXmlParaBr(valor = '') {
  const s = String(valor || '').trim();
  if (!s) return '';

  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const [yyyy, mm, dd] = s.slice(0, 10).split('-');
    return `${dd}/${mm}/${yyyy}`;
  }

  return s;
}

function detectarModeloDocumentoFiscalXml(xmlDoc) {
  if (xmlDoc.getElementsByTagName('infNFe').length) return 'nfe';
  if (xmlDoc.getElementsByTagName('infNFCom').length) return 'nfcom';
  return 'desconhecido';
}

function parseNfeXml(xmlDoc, xmlText) {
  const infNFe = xmlDoc.getElementsByTagName('infNFe')[0];
  if (!infNFe) {
    throw new Error('Não foi encontrado o nó infNFe no XML.');
  }

  const ide = getXmlNode(infNFe, ['ide']);
  const emit = getXmlNode(infNFe, ['emit']);
  const dest = getXmlNode(infNFe, ['dest']);
  const total = getXmlNode(infNFe, ['total']);
  const icmsTot = getXmlNode(total, ['ICMSTot']);

  const enderDest = dest ? getXmlNode(dest, ['enderDest']) : null;

  const itens = Array
    .from(infNFe.getElementsByTagName('det'))
    .map(det => {
      const prod = getXmlNode(det, ['prod']);
      if (!prod) return null;

      return {
        codigo: getXmlText(prod, ['cProd']),
        descricao: getXmlText(prod, ['xProd']),
        ncm: getXmlText(prod, ['NCM']),
        cst:
          getXmlText(prod, ['CST']) ||
          getXmlText(prod, ['CSOSN']),
        cfop: getXmlText(prod, ['CFOP']),
        unidade:
          getXmlText(prod, ['uCom']) ||
          getXmlText(prod, ['uTrib']),
        quantidade:
          getXmlText(prod, ['qCom']) ||
          getXmlText(prod, ['qTrib']),
        valorUnitario:
          getXmlText(prod, ['vUnCom']) ||
          getXmlText(prod, ['vUnTrib']),
        valorTotal: getXmlText(prod, ['vProd'])
      };
    })
    .filter(Boolean);

  return {
    modelo: 'nfe',
    emitente:
      getXmlText(emit, ['xNome']) ||
      getXmlText(emit, ['xFant']),
    emitenteCnpj:
      getXmlText(emit, ['CNPJ']) ||
      getXmlText(emit, ['CPF']),
    numeroNota: getXmlText(ide, ['nNF']),
    serie: getXmlText(ide, ['serie']),
    chaveAcesso: String(infNFe.getAttribute('Id') || '').replace(/^NFe/, ''),
    dataEmissao: formatarDataXmlParaBr(
      getXmlText(ide, ['dhEmi']) || getXmlText(ide, ['dEmi'])
    ),
    naturezaOperacao: getXmlText(ide, ['natOp']),
    destinatario: getXmlText(dest, ['xNome']),
    destinatarioCnpj:
      getXmlText(dest, ['CNPJ']) ||
      getXmlText(dest, ['CPF']),
    enderecoDestinatario: [
      getXmlText(enderDest, ['xLgr']),
      getXmlText(enderDest, ['nro']),
      getXmlText(enderDest, ['xCpl'])
    ].filter(Boolean).join(', '),
    bairroDestinatario: getXmlText(enderDest, ['xBairro']),
    municipioDestinatario: getXmlText(enderDest, ['xMun']),
    ufDestinatario: getXmlText(enderDest, ['UF']),
    valorTotalNota: getXmlText(icmsTot, ['vNF']),
    itens,
    textoOriginal: xmlText
  };
}

function parseNFComXml(xmlDoc, xmlText) {
  const infNFCom = xmlDoc.getElementsByTagName('infNFCom')[0];
  if (!infNFCom) {
    throw new Error('Não foi encontrado o nó infNFCom no XML.');
  }

  const ide = getXmlNode(infNFCom, ['ide']);
  const emit = getXmlNode(infNFCom, ['emit']);
  const dest = getXmlNode(infNFCom, ['dest']);

  const itens = Array
    .from(infNFCom.getElementsByTagName('det'))
    .map(det => {
      const prod = getXmlNode(det, ['prod']);
      if (!prod) return null;

      return {
        codigo: getXmlText(prod, ['cProd']),
        descricao: getXmlText(prod, ['xProd']),
        unidade:
          getXmlText(prod, ['uCom']) ||
          getXmlText(prod, ['uTrib']),
        quantidade:
          getXmlText(prod, ['qCom']) ||
          getXmlText(prod, ['qTrib']),
        valorUnitario:
          getXmlText(prod, ['vUnCom']) ||
          getXmlText(prod, ['vUnTrib']),
        valorTotal: getXmlText(prod, ['vProd'])
      };
    })
    .filter(Boolean);

  return {
    modelo: 'nfcom',
    emitente:
      getXmlText(emit, ['xNome']) ||
      getXmlText(emit, ['xFant']),
    emitenteCnpj:
      getXmlText(emit, ['CNPJ']) ||
      getXmlText(emit, ['CPF']),
    numeroNota: getXmlText(ide, ['nNF']),
    serie: getXmlText(ide, ['serie']),
    chaveAcesso: String(infNFCom.getAttribute('Id') || '').replace(/^NFCom/, ''),
    dataEmissao: formatarDataXmlParaBr(
      getXmlText(ide, ['dhEmi']) || getXmlText(ide, ['dEmi'])
    ),
    destinatario: getXmlText(dest, ['xNome']),
    destinatarioCnpj:
      getXmlText(dest, ['CNPJ']) ||
      getXmlText(dest, ['CPF']),
    enderecoDestinatario: '',
    municipioDestinatario: '',
    ufDestinatario: '',
    valorTotalNota: '',
    itens,
    textoOriginal: xmlText
  };
}

// Editar Entrada de Notas 

async function listarEntradasProduto(produtoId) {
  return apiJson(apiUrl(`/api/estoque/produto-entrada/${produtoId}`));
}

async function salvarEdicaoEntrada(id, payload) {
  return apiJson(apiUrl(`/api/estoque/produto-entrada/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      usuario: obterUsuarioLogado()
    })
  });
}

async function excluirEntrada(id) {
  return apiJson(apiUrl(`/api/estoque/produto-entrada/${id}`), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuario: obterUsuarioLogado()
    })
  });
}

function abrirModalEditarEntradas(produtoId) {
  return new Promise(async (resolve, reject) => {
    try {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-[140]';

      let entradas = [];
      let filtro = '';

      function escapeHtml(str) {
        return String(str ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function formatarDecimalBr(valor, casas = 4) {
        const num = Number(valor || 0);
        return num.toLocaleString('pt-BR', {
          minimumFractionDigits: casas,
          maximumFractionDigits: casas
        });
      }

      function formatarMoedaBr(valor) {
        const num = Number(valor || 0);
        return num.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }

      function parseDecimalFlex(v) {
        const s = String(v ?? '').trim();
        if (!s) return 0;
        if (s.includes('.') && s.includes(',')) return Number(s.replace(/\./g, '').replace(',', '.')) || 0;
        if (s.includes(',')) return Number(s.replace(',', '.')) || 0;
        return Number(s) || 0;
      }

      function fechar(retorno = null) {
        overlay.remove();
        modal.remove();
        resolve(retorno);
      }

      function filtrarEntradas(lista) {
        const termo = filtro.trim().toLowerCase();
        if (!termo) return lista;

        return lista.filter(item =>
          Object.values(item || {}).some(v =>
            String(v ?? '').toLowerCase().includes(termo)
          )
        );
      }

      function renderTabela() {
        const tbody = modal.querySelector('#tbodyEditarEntradas');
        if (!tbody) return;

        const lista = filtrarEntradas(entradas);

        if (!lista.length) {
          tbody.innerHTML = `
            <tr>
              <td colspan="11" class="px-4 py-6 text-sm text-muted-foreground text-center">
                Nenhuma entrada encontrada.
              </td>
            </tr>
          `;
          return;
        }

        tbody.innerHTML = lista.map(item => `
          <tr class="border-b border-border last:border-b-0">
            <td class="px-4 py-3 text-sm">${escapeHtml(String(item.id))}</td>
            <td class="px-4 py-3 text-sm">${escapeHtml(item.fornecedor || '')}</td>
            <td class="px-4 py-3 text-sm">${escapeHtml(item.nota || '')}</td>
            <td class="px-4 py-3 text-sm">${escapeHtml(item.serie || '')}</td>
            <td class="px-4 py-3 text-sm">${escapeHtml(item.cod_produto_nf || '')}</td>
            <td class="px-4 py-3 text-sm">${escapeHtml(item.descricao_produto_nf || '')}</td>
            <td class="px-4 py-3 text-sm text-center">${escapeHtml(item.unidade_nf || '')}</td>
            <td class="px-4 py-3 text-sm text-right">
              <input
                type="text"
                class="inputQtdEntrada w-32 rounded-xl border border-border bg-white/80 px-3 py-2 text-right"
                data-id="${escapeHtml(String(item.id))}"
                value="${escapeHtml(formatarDecimalBr(item.qtd_nf, 2))}"
              />
            </td>
            <td class="px-4 py-3 text-sm text-right">
              <input
                type="text"
                class="inputValorUnitEntrada w-32 rounded-xl border border-border bg-white/80 px-3 py-2 text-right"
                data-id="${escapeHtml(String(item.id))}"
                value="${escapeHtml(formatarMoedaBr(item.valor_unitario_nf))}"
              />
            </td>
            <td class="px-4 py-3 text-sm text-right font-semibold">
              <span class="valorTotalEntrada" data-id="${escapeHtml(String(item.id))}">
                ${escapeHtml(formatarMoedaBr(item.valor_total_nf))}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">
              <div class="flex justify-end gap-2">
                <button
                  type="button"
                  class="btnSalvarEntrada w-9 h-9 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
                  data-id="${escapeHtml(String(item.id))}"
                  title="Salvar"
                >
                  <i class="fas fa-save" aria-hidden="true"></i>
                </button>

                <button
                  type="button"
                  class="btnExcluirEntradaModal w-9 h-9 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all"
                  data-id="${escapeHtml(String(item.id))}"
                  title="Excluir"
                >
                  <i class="fas fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            </td>
          </tr>
        `).join('');
      }

      function atualizarTotalLinha(id) {
        const inputQtd = modal.querySelector(`.inputQtdEntrada[data-id="${id}"]`);
        const inputValor = modal.querySelector(`.inputValorUnitEntrada[data-id="${id}"]`);
        const spanTotal = modal.querySelector(`.valorTotalEntrada[data-id="${id}"]`);
        if (!inputQtd || !inputValor || !spanTotal) return;

        const qtd = parseDecimalFlex(inputQtd.value);
        const valorUnit = parseDecimalFlex(inputValor.value);
        const total = qtd * valorUnit;

        spanTotal.textContent = formatarMoedaBr(total);
      }

      modal.innerHTML = `
        <div class="w-full h-full overflow-auto">
          <div class="min-h-full flex items-center justify-center p-4">
            <div class="w-[90vw] max-w-none rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
              <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-lg font-semibold text-foreground">Editar entradas</h3>
                  <p class="text-sm text-muted-foreground">Edite, filtre e exclua entradas do produto selecionado.</p>
                </div>

                <button
                  type="button"
                  id="btnFecharEditarEntradas"
                  class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                >
                  <i class="fas fa-times" aria-hidden="true"></i>
                </button>
              </div>

              <div class="px-6 py-4 border-b border-border">
                <input
                  id="inputFiltroEntradas"
                  type="text"
                  placeholder="Filtrar em qualquer campo..."
                  class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm"
                />
              </div>

              <div class="p-6">
                <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
                  <div class="overflow-auto max-h-[65vh]">
                    <table class="min-w-full text-sm">
                      <thead class="bg-white/60 border-b border-border sticky top-0">
                        <tr>
                          <th class="px-4 py-3 text-left">ID</th>
                          <th class="px-4 py-3 text-left">Fornecedor</th>
                          <th class="px-4 py-3 text-left">Nota</th>
                          <th class="px-4 py-3 text-left">Série</th>
                          <th class="px-4 py-3 text-left">Cód. NF</th>
                          <th class="px-4 py-3 text-left">Descrição</th>
                          <th class="px-4 py-3 text-center">UN</th>
                          <th class="px-4 py-3 text-right">Qtd</th>
                          <th class="px-4 py-3 text-right">Vlr. Unit.</th>
                          <th class="px-4 py-3 text-right">Vlr. Total</th>
                          <th class="px-4 py-3 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody id="tbodyEditarEntradas"></tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="px-6 py-4 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  id="btnFecharRodapeEditarEntradas"
                  class="rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.appendChild(modal);

      overlay.addEventListener('click', () => fechar(null));
      modal.querySelector('#btnFecharEditarEntradas')?.addEventListener('click', () => fechar(null));
      modal.querySelector('#btnFecharRodapeEditarEntradas')?.addEventListener('click', () => fechar(null));

      const resp = await listarEntradasProduto(produtoId);
      entradas = Array.isArray(resp?.items) ? resp.items : [];
      renderTabela();

      modal.querySelector('#inputFiltroEntradas')?.addEventListener('input', (e) => {
        filtro = e.currentTarget.value || '';
        renderTabela();
      });

      modal.addEventListener('input', (e) => {
        const qtd = e.target.closest('.inputQtdEntrada');
        const valor = e.target.closest('.inputValorUnitEntrada');
        if (!qtd && !valor) return;
        const id = e.target.dataset.id;
        atualizarTotalLinha(id);
      });

      modal.addEventListener('click', async (e) => {
        const btnSalvar = e.target.closest('.btnSalvarEntrada');
        if (btnSalvar) {
          const saldoResp = await obterSaldoProduto(produtoId);
          const qtdTranferida = Number(saldoResp?.qtdTransferida ?? 0);
          const id = btnSalvar.dataset.id;
          const inputQtd = modal.querySelector(`.inputQtdEntrada[data-id="${id}"]`);
          const inputValor = modal.querySelector(`.inputValorUnitEntrada[data-id="${id}"]`);

          const qtd_nf = parseDecimalFlex(inputQtd?.value);
          const valor_unitario_nf = parseDecimalFlex(inputValor?.value);

          if (!qtd_nf || qtd_nf <= 0) {
            alert('Informe uma quantidade válida.');
            return;
          }

          // ✅ NOVA VALIDAÇÃO: não permitir qtd_nf < qtdTransferida
          if (qtd_nf < qtdTranferida) {
            alert(`❌ Quantidade não pode ser menor que ${formatarDecimalBr(qtdTranferida, 4)} já transferida!`);
            inputQtd?.focus();
            inputQtd?.select();
            return;
          }

          btnSalvar.disabled = true;

          try {
            await salvarEdicaoEntrada(id, { qtd_nf, valor_unitario_nf });
            const item = entradas.find(x => String(x.id) === String(id));
            if (item) {
              item.qtd_nf = qtd_nf;
              item.valor_unitario_nf = valor_unitario_nf;
              item.valor_total_nf = qtd_nf * valor_unitario_nf;
            }
            renderTabela();
          } catch (err) {
            alert(err.message || 'Erro ao salvar entrada.');
          } finally {
            btnSalvar.disabled = false;
          }

          return;
        }

        const btnExcluir = e.target.closest('.btnExcluirEntradaModal');
        if (btnExcluir) {
          const id = btnExcluir.dataset.id;
          let saldoDepoisN = 0;
          let unidadeN = "";
          // Buscar dados da entrada
          const item = entradas.find(x => String(x.id) === String(id));
          if (!item) {
            alert('Entrada não encontrada.');
            return;
          }

          // Buscar saldo atual do produto
          try {
            const saldoResp = await obterSaldoProduto(produtoId);
            const saldoAtual = Number(saldoResp?.saldo ?? 0);
            const qtdEntrada = parseDecimalFlex(item.qtd_nf);
            saldoDepoisN = saldoAtual - qtdEntrada;
            unidadeN = saldoResp?.produto.unidade;

            if (saldoAtual < qtdEntrada) {
              alert(
                `Não é possível excluir esta entrada.\n` +
                `Estoque atual: ${formatarDecimalBr(saldoAtual)}\n` +
                `Qtd. da entrada: ${formatarDecimalBr(qtdEntrada)}\n\n` +
                `O saldo atual é inferior à quantidade desta entrada.`
              );
              return;
            }
          } catch (err) {
            console.error('Erro ao verificar saldo:', err);
            alert('Erro ao verificar saldo do produto. Tente novamente.');
            return;
          }

          if (!confirm(
            `Confirma a exclusão da entrada ${item.nota || ''}/${item.serie || ''}?\n\n` +
            `Qtd a ser excluída: ${formatarDecimalBr(item.qtd_nf)} ${unidadeN} | Estoque ficará: ${formatarDecimalBr(saldoDepoisN)} ${unidadeN}`
          )) return;

          btnExcluir.disabled = true;

          try {
            await excluirEntrada(id);
            entradas = entradas.filter(x => String(x.id) !== String(id));
            renderTabela();
          } catch (err) {
            alert(err.message || 'Erro ao excluir entrada.');
          } finally {
            btnExcluir.disabled = false;
          }
        }

      });
    } catch (err) {
      reject(err);
    }
  });
}


async function obterSaldoProduto(produtoId) {
  const idLocalAlmoxarifado = 7;
  return apiJson(apiUrl(`/api/estoque/produto/${produtoId}/saldo/${idLocalAlmoxarifado}`));
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btnEditarEntrada');
  if (!btn) return;

  const produtoId = btn.dataset.id;
  if (!produtoId) {
    alert('Produto não identificado.');
    return;
  }

  try {
    await abrirModalEditarEntradas(produtoId);
    await carregarControleEstoque();
  } catch (err) {
    console.error(err);
    alert(err.message || 'Erro ao abrir editor de entradas.');
  }
});

// Histórico de entrada de produtos

async function listarHistoricoEntradaProduto(produtoId) {
  return apiJson(apiUrl(`/api/estoque/produto-entrada-log/produto/${produtoId}`));
}

function abrirModalHistoricoEntradas(produtoId) {
  return new Promise(async (resolve, reject) => {
    try {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-[140]';

      function escapeHtml(str) {
        return String(str ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;');
      }

      function formatarDataHora(v) {
        if (!v) return '';

        if (v instanceof Date) {
          const dia = String(v.getDate()).padStart(2, '0');
          const mes = String(v.getMonth() + 1).padStart(2, '0');
          const ano = v.getFullYear();
          const hora = String(v.getHours()).padStart(2, '0');
          const minuto = String(v.getMinutes()).padStart(2, '0');
          const segundo = String(v.getSeconds()).padStart(2, '0');
          return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
        }

        const s = String(v).trim();
        if (!s) return '';

        const match = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
        if (match) {
          const [, ano, mes, dia, hora, minuto, segundo = '00'] = match;
          return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
        }

        return s;
      }


      function formatarNumero(v, casas = 2) {
        const num = Number(v);
        if (!Number.isFinite(num)) return '';
        return num.toLocaleString('pt-BR', {
          minimumFractionDigits: casas,
          maximumFractionDigits: casas
        });
      }

      function fechar() {
        overlay.remove();
        modal.remove();
        resolve(null);
      }

      modal.innerHTML = `
        <div class="w-full h-full overflow-auto">
          <div class="min-h-full flex items-center justify-center p-4">
            <div class="w-[90vw] max-w-none rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
              <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-lg font-semibold text-foreground">Histórico de entradas</h3>
                  <p class="text-sm text-muted-foreground">Alterações registradas para este produto.</p>
                </div>

                <button
                  type="button"
                  id="btnFecharHistoricoEntradas"
                  class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                >
                  <i class="fas fa-times" aria-hidden="true"></i>
                </button>
              </div>

              <div class="p-6">
                <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
                  <div class="overflow-auto max-h-[70vh]">
                    <table class="min-w-full text-sm">
                      <thead class="bg-white/60 border-b border-border sticky top-0">
                        <tr>
                          <th class="px-4 py-3 text-left">Data</th>
                          <th class="px-4 py-3 text-left">Usuário</th>
                          <th class="px-4 py-3 text-left">Ação</th>
                          <th class="px-4 py-3 text-left">Entrada</th>
                          <th class="px-4 py-3 text-left">Nota</th>
                          <th class="px-4 py-3 text-left">Produto NF</th>
                          <th class="px-4 py-3 text-right">Qtd antes</th>
                          <th class="px-4 py-3 text-right">Qtd depois</th>
                          <th class="px-4 py-3 text-right">Unit. antes (R$)</th>
                          <th class="px-4 py-3 text-right">Unit. depois (R$)</th>
                          <th class="px-4 py-3 text-right">Total antes (R$)</th>
                          <th class="px-4 py-3 text-right">Total depois (R$)</th>
                          <th class="px-4 py-3 text-left">Obs.</th>
                        </tr>
                      </thead>
                      <tbody id="tbodyHistoricoEntradas">
                        <tr>
                          <td colspan="13" class="px-4 py-6 text-sm text-muted-foreground text-center">
                            Carregando histórico...
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div class="px-6 py-4 border-t border-border flex justify-end">
                <button
                  type="button"
                  id="btnFecharRodapeHistoricoEntradas"
                  class="rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.appendChild(modal);

      overlay.addEventListener('click', fechar);
      modal.querySelector('#btnFecharHistoricoEntradas')?.addEventListener('click', fechar);
      modal.querySelector('#btnFecharRodapeHistoricoEntradas')?.addEventListener('click', fechar);

      const tbody = modal.querySelector('#tbodyHistoricoEntradas');
      const resp = await listarHistoricoEntradaProduto(produtoId);
      const items = Array.isArray(resp?.items) ? resp.items : [];

      if (!items.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="13" class="px-4 py-6 text-sm text-muted-foreground text-center">
              Nenhum histórico encontrado para este produto.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = items.map(item => `
        <tr class="border-b border-border last:border-b-0">
          <td class="px-4 py-3">${escapeHtml(formatarDataHora(item.DATA_ALTERACAO))}</td>
          <td class="px-4 py-3">${escapeHtml(item.USUARIO || '')}</td>
          <td class="px-4 py-3">
            <span class="inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
              item.ACAO === 'DELETE'
                ? 'border-red-300 bg-red-50 text-red-700'
                : item.ACAO === 'UPDATE'
                ? 'border-blue-300 bg-blue-50 text-blue-700'
                : 'border-zinc-300 bg-zinc-50 text-zinc-700'
            }">
              ${escapeHtml(item.ACAO || '')}
            </span>
          </td>
          <td class="px-4 py-3">${escapeHtml(String(item.ID_ENTRADA || ''))}</td>
          <td class="px-4 py-3">${escapeHtml(`${item.nota || ''} ${item.serie ? '/ ' + item.serie : ''}`)}</td>
          <td class="px-4 py-3">
            <div class="font-medium">${escapeHtml(item.cod_produto_nf || '')}</div>
            <div class="text-xs text-muted-foreground">${escapeHtml(item.descricao_produto_nf || '')}</div>
          </td>
          <td class="px-4 py-3 text-right">${escapeHtml(formatarNumero(item.QTD_NF_ANTES, 2))}</td>
          <td class="px-4 py-3 text-right">${escapeHtml(formatarNumero(item.QTD_NF_DEPOIS, 2))}</td>
          <td class="px-4 py-3 text-right">${escapeHtml(formatarNumero(item.VALOR_UNITARIO_NF_ANTES, 2))}</td>
          <td class="px-4 py-3 text-right">${escapeHtml(formatarNumero(item.VALOR_UNITARIO_NF_DEPOIS, 2))}</td>
          <td class="px-4 py-3 text-right">${escapeHtml(formatarNumero(item.VALOR_TOTAL_NF_ANTES, 2))}</td>
          <td class="px-4 py-3 text-right">${escapeHtml(formatarNumero(item.VALOR_TOTAL_NF_DEPOIS, 2))}</td>
          <td class="px-4 py-3">${escapeHtml(item.OBSERVACAO || '')}</td>
        </tr>
      `).join('');
    } catch (err) {
      reject(err);
    }
  });
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btnHistoricoEstoque');
  if (!btn) return;

  const produtoId = btn.dataset.id;
  if (!produtoId) {
    alert('Produto não identificado.');
    return;
  }

  try {
    await abrirModalHistoricoEntradas(produtoId);
  } catch (err) {
    console.error(err);
    alert(err.message || 'Erro ao carregar histórico.');
  }
});

function obterUsuarioLogado() {
  return (
    sessionStorage.getItem('usuarioNome') ||
    sessionStorage.getItem('usuario') ||
    sessionStorage.getItem('userName') ||
    sessionStorage.getItem('usuarioEmail') ||
    ''
  );
}


// Tranferencia de armazenamento (Centro de Custo)

document.addEventListener('click', async e => {
  const btn = e.target.closest('.btnTransferenciaEstoque');
  if (!btn) return;

  const id = String(btn.dataset.id || '');
  const idProduto = String(btn.dataset.idProduto || '');
  const idLocal = String(btn.dataset.idLocal || '');
  const unidade = String(btn.dataset.unidade || 'UN');

  const item = Array.isArray(cacheEstoqueEscritorio)
    ? cacheEstoqueEscritorio.find(x => {
        const xid = String(x.ID ?? x.id ?? '');
        const xprod = String(x.PRODUTO_SISTEMA_ID ?? x.produto_sistema_id ?? x.IDPRODUTO ?? x.idproduto ?? xid);
        return xid === id || xprod === idProduto;
      })
    : null;

  if (!item) {
    alert('Item não encontrado para transferência.');
    return;
  }

  await abrirModalTransferenciaEstoque({
    ...item,
    PRODUTO_SISTEMA_ID: item.PRODUTO_SISTEMA_ID ?? item.produto_sistema_id ?? idProduto,
    ID_LOCAL_ALMOXARIFADO: item.ID_LOCAL_ALMOXARIFADO ?? item.id_local_almoxarifado ?? idLocal,
    UNIDADE: item.UNIDADE ?? item.unidade ?? unidade
  });
});

function removerModalTransferenciaEstoque() {
  document.getElementById('transferenciaEstoqueOverlay')?.remove();
  document.getElementById('transferenciaEstoqueModal')?.remove();
}

function formatarDataHora(v) {
  if (!v) return '';

  if (v instanceof Date) {
    const dia = String(v.getDate()).padStart(2, '0');
    const mes = String(v.getMonth() + 1).padStart(2, '0');
    const ano = v.getFullYear();
    const hora = String(v.getHours()).padStart(2, '0');
    const minuto = String(v.getMinutes()).padStart(2, '0');
    const segundo = String(v.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
  }

  const s = String(v).trim();
  if (!s) return '';

  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (match) {
    const [, ano, mes, dia, hora, minuto, segundo = '00'] = match;
    return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
  }

  return s;
}

function normalizarTextoLivre(v) {
  return String(v ?? '').trim();
}

function renderTabelaTransferencias(items) {
  if (!Array.isArray(items) || !items.length) {
    return `
      <tr>
        <td colspan="10" class="px-4 py-6 text-sm text-muted-foreground text-center">
          Nenhuma transferência registrada.
        </td>
      </tr>
    `;
  }

  return items.map(item => {
    const status = String(
      item.STATUS_TRANSFERENCIA ??
      item.STATUSTRANSFERENCIA ??
      ''
    ).trim().toUpperCase();

    const podeEditarExcluir = status === 'AGUARDANDO_RECEBIMENTO';
    const podeReceber = status === 'EM_TRANSITO' || status === 'AGUARDANDO_RECEBIMENTO';

    return `
      <tr class="border-b border-border last:border-b-0 hover:bg-white/30 transition-colors">
        <td class="px-4 py-3 text-sm">${escapeHtml(item.LOCAL_DESTINO ?? item.LOCALDESTINO ?? '')}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(item.TIPO_TRANSFERENCIA ?? item.TIPOTRANSFERENCIA ?? '')}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(item.RESPONSAVEL_TRANSPORTE ?? item.RESPONSAVELTRANSPORTE ?? '')}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(item.RESPONSAVEL_ENTREGA ?? item.RESPONSAVELENTREGA ?? '')}</td>
        <td class="px-4 py-3 text-sm text-right">${escapeHtmlString(formatarDecimalBr(item.QUANTIDADE ?? 0, 2))}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(item.UNIDADE ?? '')}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(item.USUARIO_CADASTRO ?? item.USUARIOCADASTRO ?? '')}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(formatarDataHora(item.DATA_CADASTRO ?? item.DATACADASTRO))}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(item.STATUS_TRANSFERENCIA ?? item.STATUSTRANSFERENCIA ?? '')}</td>
        <td class="px-4 py-3 text-sm">
          <div class="flex justify-end gap-2">
            ${podeEditarExcluir ? `
              <button
                type="button"
                class="btnEditarTransferencia w-9 h-9 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
                data-id="${escapeHtmlString(item.ID)}"
                data-id-local-destino="${escapeHtmlString(item.ID_LOCAL_DESTINO ?? item.IDLOCALDESTINO ?? '')}"
                data-quantidade="${escapeHtmlString(item.QUANTIDADE)}"
                data-observacao="${escapeHtmlString(item.OBSERVACAO ?? '')}"
                data-tipo-transferencia="${escapeHtmlString(item.TIPO_TRANSFERENCIA ?? item.TIPOTRANSFERENCIA ?? 'LOCAL')}"
                data-responsavel-transporte="${escapeHtmlString(item.RESPONSAVEL_TRANSPORTE ?? item.RESPONSAVELTRANSPORTE ?? '')}"
                data-responsavel-entrega="${escapeHtmlString(item.RESPONSAVEL_ENTREGA ?? item.RESPONSAVELENTREGA ?? '')}"
                title="Editar transferência"
              >
                <i class="fas fa-pen"></i>
              </button>

              <button
                type="button"
                class="btnExcluirTransferencia w-9 h-9 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all"
                data-id="${escapeHtmlString(item.ID)}"
                title="Excluir transferência"
              >
                <i class="fas fa-trash"></i>
              </button>
            ` : ''}

            <button
              type="button"
              class="btnLogsTransferencia w-9 h-9 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all"
              data-id="${escapeHtmlString(item.ID)}"
              title="Ver logs"
            >
              <i class="fas fa-clock-rotate-left"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function removerModalLogsTransferencia() {
  document.getElementById('logsTransferenciaOverlay')?.remove();
  document.getElementById('logsTransferenciaModal')?.remove();
}

async function abrirModalLogsTransferencia(idTransferencia) {
  try {
    const result = await listarLogsTransferencia(idTransferencia);
    const items = Array.isArray(result?.items) ? result.items : [];

    removerModalLogsTransferencia();

    const overlay = document.createElement('div');
    overlay.id = 'logsTransferenciaOverlay';
    overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]';

    const modal = document.createElement('div');
    modal.id = 'logsTransferenciaModal';
    modal.className = 'fixed inset-0 z-[210]';

    const htmlTabela = !items.length
      ? `
        <div class="rounded-2xl border border-border bg-white/40 px-4 py-6 text-sm text-muted-foreground text-center">
          Nenhum log encontrado.
        </div>
      `
      : `
        <div class="max-h-[60vh] overflow-auto rounded-2xl border border-border bg-white/40">
          <table class="min-w-full text-sm">
            <thead class="bg-white/50 border-b border-border sticky top-0">
              <tr>
                <th class="px-4 py-3 text-left font-semibold">Ação</th>
                <th class="px-4 py-3 text-right font-semibold">Saldo antes</th>
                <th class="px-4 py-3 text-right font-semibold">Qtd.</th>
                <th class="px-4 py-3 text-right font-semibold">Saldo depois</th>
                <th class="px-4 py-3 text-left font-semibold">Usuário</th>
                <th class="px-4 py-3 text-left font-semibold">Data/Hora</th>
                <th class="px-4 py-3 text-left font-semibold">Observação</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(log => `
                <tr class="border-b border-border last:border-b-0 hover:bg-white/30 transition-colors">
                  <td class="px-4 py-3">${escapeHtml(log.ACAO ?? '')}</td>
                  <td class="px-4 py-3 text-right">${escapeHtmlString(formatarDecimalBr(log.SALDO_ANTES ?? 0, 2))}</td>
                  <td class="px-4 py-3 text-right">${escapeHtmlString(formatarDecimalBr(log.QUANTIDADE_TRANSFERIDA ?? 0, 2))}</td>
                  <td class="px-4 py-3 text-right">${escapeHtmlString(formatarDecimalBr(log.SALDO_DEPOIS ?? 0, 2))}</td>
                  <td class="px-4 py-3">${escapeHtml(log.USUARIO ?? '')}</td>
                  <td class="px-4 py-3">${escapeHtml(formatarDataHora(log.DATA_HORA ?? ''))}</td>
                  <td class="px-4 py-3">${escapeHtml(log.OBSERVACAO ?? '')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

    modal.innerHTML = `
      <div class="w-full h-full overflow-auto">
        <div class="min-h-full flex items-center justify-center p-4">
          <div class="w-full max-w-6xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Logs da transferência</h3>
                <p class="text-sm text-muted-foreground">Histórico de alterações da transferência selecionada.</p>
              </div>

              <button
                type="button"
                id="btnFecharModalLogsTransferencia"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="px-6 py-6 space-y-4">
              ${htmlTabela}
            </div>

            <div class="px-6 py-4 border-t border-border flex justify-end">
              <button
                type="button"
                id="btnFecharRodapeLogsTransferencia"
                class="rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const fechar = () => removerModalLogsTransferencia();

    overlay.addEventListener('click', fechar);
    document.getElementById('btnFecharModalLogsTransferencia')?.addEventListener('click', fechar);
    document.getElementById('btnFecharRodapeLogsTransferencia')?.addEventListener('click', fechar);
  } catch (err) {
    console.error(err);
    alert(err?.message || 'Erro ao carregar logs.');
  }
}

async function abrirModalTransferenciaEstoque(item) {


  removerModalTransferenciaEstoque();

  const overlay = document.createElement('div');
  overlay.id = 'transferenciaEstoqueOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

  const modal = document.createElement('div');
  modal.id = 'transferenciaEstoqueModal';
  modal.className = 'fixed inset-0 z-[140]';

  const id = item.ID ?? item.id ?? '';
  const idProduto = item.PRODUTO_SISTEMA_ID ?? item.produto_sistema_id ?? item.IDPRODUTO ?? item.idproduto ?? id;
  const idLocalOrigem = item.ID_LOCAL_ALMOXARIFADO ?? item.id_local_almoxarifado ?? item.IDLOCALALMOXARIFADO ?? item.idlocalalmoxarifado ?? '';
  const codigo =
    item.CODIGOITEM ??
    item.codigoitem ??
    item.CODIGO_ITEM ??
    item.codigo_item ??
    item.CODIGO ??
    item.codigo ??
    item.codproduto ??
    item.CODPRODUTO ??
    '—';

  const descricao =
    item.DESCRICAOITEM ??
    item.descricaoitem ??
    item.DESCRICAO_ITEM ??
    item.descricao_item ??
    item.DESCRICAO ??
    item.descricao ??
    item.descricaoproduto ??
    item.DESCRICAOPRODUTO ??
    '—';
  const unidade = item.UNIDADE ?? item.unidade ?? 'UN';
  const usuario = typeof obterUsuarioLogado === 'function' ? obterUsuarioLogado() : 'SISTEMA';

  let transferenciaEmEdicaoId = null;

  modal.innerHTML = `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex items-center justify-center p-4">
        <div class="w-[90vw] max-w-[90vw] rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-foreground">Transferência de material</h3>
              <p class="text-sm text-muted-foreground">Registre, edite ou exclua transferências deste item.</p>
            </div>
            <button type="button" id="btnFecharModalTransferencia" class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>

          <div class="px-6 py-6 space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div class="rounded-2xl border border-border bg-white/60 p-4">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Código</div>
                <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(codigo)}</div>
              </div>
              <div class="rounded-2xl border border-border bg-white/60 p-4 lg:col-span-2">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Descrição</div>
                <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(descricao)}</div>
              </div>
              <div class="rounded-2xl border border-border bg-white/60 p-4">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Unidade</div>
                <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(unidade)}</div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div class="rounded-2xl border border-border bg-white/60 p-4">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Saldo disponível</div>
                <div id="transferenciaSaldoDisponivel" class="mt-1 text-lg font-semibold text-primary">0,0000</div>
              </div>
              <div class="rounded-2xl border border-border bg-white/60 p-4">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Qtd. entrada</div>
                <div id="transferenciaQtdEntrada" class="mt-1 text-lg font-semibold text-foreground">0,0000</div>
              </div>
              <div class="rounded-2xl border border-border bg-white/60 p-4">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Qtd. já transferida</div>
                <div id="transferenciaQtdTransferida" class="mt-1 text-lg font-semibold text-foreground">0,0000</div>
              </div>
            </div>

            <form id="formTransferenciaEstoque" class="rounded-2xl border border-border bg-white/40 p-5 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">Centro de custo</label>
                  <div class="flex flex-col sm:flex-row gap-2">
                    <select id="transferenciaLocalDestino" class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm" required>
                      <option value="">Selecione o local...</option>
                    </select>

                    <button
                      type="button"
                      id="btnNovoLocalDestinoTransferencia"
                      class="w-10 h-10 rounded-xl border border-border bg-white/70 hover:bg-white transition-all flex items-center justify-center"
                      aria-label="Novo local"
                      title="Novo local"
                    >
                      <i class="fas fa-plus" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">Tipo da transferência</label>
                  <select id="transferenciaTipo" class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm" required>
                  <option value="Selecione...">Selecione...</option>  
                  <option value="LOCAL">Local</option>
                    <option value="EXTERNA">Externa</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">Quantidade</label>
                  <input id="transferenciaQuantidade" type="text" class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm" placeholder="Ex. 1,0000" required />
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">Usuário</label>
                  <input id="transferenciaUsuario" type="text" class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm" value="${escapeHtml(usuario)}" readonly />
                </div>
              </div>

              <div id="blocoTransferenciaExterna" class="hidden">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Responsável por levar</label>
                    <input
                      id="transferenciaResponsavelTransporte"
                      type="text"
                      maxlength="150"
                      class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm"
                      placeholder="Nome do responsável pelo transporte"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-foreground mb-2">Entregar para</label>
                    <input
                      id="transferenciaResponsavelEntrega"
                      type="text"
                      maxlength="150"
                      class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm"
                      placeholder="Nome de quem receberá a entrega"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Observação</label>
                <input id="transferenciaObservacao" type="text" maxlength="255" class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm" placeholder="Opcional" />
              </div>

              <div class="flex justify-end gap-2">
                <button type="button" id="btnCancelarEdicaoTransferencia" class="hidden rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all">
                  Cancelar edição
                </button>
                <button type="submit" id="btnSalvarTransferencia" class="rounded-xl bg-primary text-white px-4 py-3 text-sm font-medium hover:opacity-90 transition-all">
                  Salvar transferência
                </button>
              </div>
            </form>

            <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
              <div class="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-semibold text-foreground">Transferências registradas</h4>
                  <p class="text-xs text-muted-foreground">Edite, receba ou exclua uma transferência existente.</p>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                  <thead class="bg-white/50 border-b border-border">
                    <tr>
                      <th class="px-4 py-3 text-left font-semibold">Destino</th>
                      <th class="px-4 py-3 text-left font-semibold">Tipo</th>
                      <th class="px-4 py-3 text-left font-semibold">Quem leva</th>
                      <th class="px-4 py-3 text-left font-semibold">Quem recebe</th>
                      <th class="px-4 py-3 text-right font-semibold">Quantidade</th>
                      <th class="px-4 py-3 text-left font-semibold">UN</th>
                      <th class="px-4 py-3 text-left font-semibold">Usuário</th>
                      <th class="px-4 py-3 text-left font-semibold">Data/Hora</th>
                      <th class="px-4 py-3 text-left font-semibold">Status</th>
                      <th class="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody id="tbodyTransferenciasEstoque">
                    <tr>
                      <td colspan="10" class="px-4 py-6 text-sm text-muted-foreground text-center">Carregando transferências...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  function fechar() {
    removerModalTransferenciaEstoque();
  }

  function atualizarCamposTipoTransferencia() {
    const tipo = String(document.getElementById('transferenciaTipo')?.value || 'LOCAL').toUpperCase();
    const bloco = document.getElementById('blocoTransferenciaExterna');
    const inputTransporte = document.getElementById('transferenciaResponsavelTransporte');
    const inputEntrega = document.getElementById('transferenciaResponsavelEntrega');

    if (tipo === 'EXTERNA') {
      bloco?.classList.remove('hidden');
      if (inputTransporte) inputTransporte.required = true;
      if (inputEntrega) inputEntrega.required = true;
    } else {
      bloco?.classList.add('hidden');
      if (inputTransporte) {
        inputTransporte.required = false;
        inputTransporte.value = '';
      }
      if (inputEntrega) {
        inputEntrega.required = false;
        inputEntrega.value = '';
      }
    }
  }

  document.getElementById('transferenciaTipo')?.addEventListener('change', atualizarCamposTipoTransferencia);
  atualizarCamposTipoTransferencia();

  function limparFormulario() {
    transferenciaEmEdicaoId = null;

    const campoLocalDestino = document.getElementById('transferenciaLocalDestino');
    const campoTipo = document.getElementById('transferenciaTipo');
    const campoQuantidade = document.getElementById('transferenciaQuantidade');
    const campoObservacao = document.getElementById('transferenciaObservacao');
    const campoResponsavelTransporte = document.getElementById('transferenciaResponsavelTransporte');
    const campoResponsavelEntrega = document.getElementById('transferenciaResponsavelEntrega');
    const btnSalvar = document.getElementById('btnSalvarTransferencia');
    const btnCancelar = document.getElementById('btnCancelarEdicaoTransferencia');

    if (campoLocalDestino) campoLocalDestino.value = '';
    if (campoTipo) campoTipo.value = 'LOCAL';
    if (campoQuantidade) campoQuantidade.value = '';
    if (campoObservacao) campoObservacao.value = '';
    if (campoResponsavelTransporte) campoResponsavelTransporte.value = '';
    if (campoResponsavelEntrega) campoResponsavelEntrega.value = '';

    if (btnSalvar) btnSalvar.textContent = 'Salvar transferência';
    if (btnCancelar) btnCancelar.classList.add('hidden');

    atualizarCamposTipoTransferencia();
  }

  async function recarregarResumoETabela() {
    try {
      const [saldoResp, listaResp] = await Promise.all([
        obterSaldoTransferencia(idProduto, idLocalOrigem),
        listarTransferencias(idProduto, idLocalOrigem)
      ]);

      document.getElementById('transferenciaSaldoDisponivel').textContent = formatarDecimalBr(saldoResp?.saldo ?? 0, 2);
      document.getElementById('transferenciaQtdEntrada').textContent = formatarDecimalBr(saldoResp?.qtdEntrada ?? 0, 2);
      document.getElementById('transferenciaQtdTransferida').textContent = formatarDecimalBr(saldoResp?.qtdTransferida ?? 0, 2);

      document.getElementById('tbodyTransferenciasEstoque').innerHTML = renderTabelaTransferencias(listaResp?.items || []);
      vincularEventosTabela();
    } catch (err) {
      console.error(err);
      document.getElementById('tbodyTransferenciasEstoque').innerHTML = `
        <tr>
          <td colspan="10" class="px-4 py-6 text-sm text-danger text-center">
            ${escapeHtml(err?.message || 'Erro ao carregar transferências.')}
          </td>
        </tr>
      `;
    }
  }

  function vincularEventosTabela() {
    document.querySelectorAll('.btnEditarTransferencia').forEach(btn => {
      btn.addEventListener('click', async e => {
        const el = e.currentTarget;        
        transferenciaEmEdicaoId = String(el.dataset.id || '');
        document.getElementById('transferenciaLocalDestino').value = String(el.dataset.idLocalDestino || '');
        document.getElementById('transferenciaTipo').value = String(el.dataset.tipoTransferencia || 'LOCAL').toUpperCase();
        document.getElementById('transferenciaQuantidade').value = formatarDecimalBr(el.dataset.quantidade || 0, 2);
        document.getElementById('transferenciaObservacao').value = String(el.dataset.observacao || '');
        document.getElementById('transferenciaResponsavelTransporte').value = String(el.dataset.responsavelTransporte || '');
        document.getElementById('transferenciaResponsavelEntrega').value = String(el.dataset.responsavelEntrega || '');

        document.getElementById('btnSalvarTransferencia').textContent = 'Salvar alteração';
        document.getElementById('btnCancelarEdicaoTransferencia').classList.remove('hidden');

        atualizarCamposTipoTransferencia();
      });
    });


    document.querySelectorAll('.btnReceberTransferencia').forEach(btn => {
      btn.addEventListener('click', async e => {
        const idTransferencia = String(e.currentTarget.dataset.id || '');
        if (!idTransferencia) return;

        const usuario = typeof obterUsuarioLogado === 'function'
          ? obterUsuarioLogado()
          : 'SISTEMA';

        if (!confirm('Confirma o recebimento desta transferência?')) return;

        const dataHoraRecebimento = formatarDataHora(new Date());
        const observacao = `Recebimento confirmado por ${usuario} em ${dataHoraRecebimento}.`;

        try {
          await receberTransferencia(idTransferencia, {
            usuario,
            observacao
          });

          await recarregarResumoETabela();

          if (typeof carregarControleEstoque === 'function') {
            await carregarControleEstoque();
          }
        } catch (err) {
          console.error(err);
          alert(err?.message || 'Erro ao registrar recebimento da transferência.');
        }
      });
    });



    document.querySelectorAll('.btnExcluirTransferencia').forEach(btn => {
      btn.addEventListener('click', async e => {
        const idTransferencia = String(e.currentTarget.dataset.id || '');
        if (!idTransferencia) return;
        if (!confirm('Deseja realmente excluir esta transferência?')) return;

        try {
          await excluirTransferencia(idTransferencia, {
            usuario,
            observacao: 'Exclusão realizada pelo modal de transferência.'
          });

          limparFormulario();
          await recarregarResumoETabela();

          if (typeof carregarControleEstoque === 'function') {
            await carregarControleEstoque();
          }
        } catch (err) {
          console.error(err);
          alert(err?.message || 'Erro ao excluir transferência.');
        }
      });
    });

    document.querySelectorAll('.btnLogsTransferencia').forEach(btn => {
      btn.addEventListener('click', async e => {
        const idTransferencia = String(e.currentTarget.dataset.id || '');
        if (!idTransferencia) return;
        await abrirModalLogsTransferencia(idTransferencia);
      });
    });
  }

  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharModalTransferencia')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarEdicaoTransferencia')?.addEventListener('click', limparFormulario);

  document.getElementById('formTransferenciaEstoque')?.addEventListener('submit', async e => {
    e.preventDefault();

    const btnSalvar = document.getElementById('btnSalvarTransferencia');
    const idLocalDestino = document.getElementById('transferenciaLocalDestino')?.value;
    const tipoTransferencia = String(
      document.getElementById('transferenciaTipo')?.value || 'LOCAL'
    ).trim().toUpperCase();

    const quantidade = parseDecimalBr(document.getElementById('transferenciaQuantidade')?.value);
    const observacao = normalizarTextoLivre(document.getElementById('transferenciaObservacao')?.value);
    const responsavelTransporte = normalizarTextoLivre(
      document.getElementById('transferenciaResponsavelTransporte')?.value
    );
    const responsavelEntrega = normalizarTextoLivre(
      document.getElementById('transferenciaResponsavelEntrega')?.value
    );

    const saldoAtualTexto = document.getElementById('transferenciaSaldoDisponivel')?.textContent || '0';
    const saldoAtual = parseDecimalBr(saldoAtualTexto);

    if (!idLocalDestino) {
      alert('Selecione o local de destino.');
      return;
    }

    if (!['LOCAL', 'EXTERNA'].includes(tipoTransferencia)) {
      alert('Selecione um tipo de transferência válido.');
      return;
    }

    if (!(quantidade > 0)) {
      alert('Informe uma quantidade válida.');
      return;
    }

    if (tipoTransferencia === 'EXTERNA') {
      if (!responsavelTransporte) {
        alert('Informe o responsável por levar o material.');
        return;
      }

      if (!responsavelEntrega) {
        alert('Informe para quem o material será entregue.');
        return;
      }
    }

    if (!transferenciaEmEdicaoId && quantidade > saldoAtual) {
      alert(`A quantidade informada excede o saldo disponível (${formatarDecimalBr(saldoAtual, 2)}).`);
      return;
    }

    try {
      btnSalvar.disabled = true;
      btnSalvar.textContent = transferenciaEmEdicaoId ? 'Salvando alteração...' : 'Salvando...';

      const payload = {
        idProduto: Number(idProduto),
        idLocalOrigem: Number(idLocalOrigem),
        idLocalDestino: Number(idLocalDestino),
        quantidade,
        unidade,
        observacao,
        usuario,
        tipoTransferencia,
        responsavelTransporte: tipoTransferencia === 'EXTERNA' ? responsavelTransporte : '',
        responsavelEntrega: tipoTransferencia === 'EXTERNA' ? responsavelEntrega : ''
      };

      if (transferenciaEmEdicaoId) {
        await editarTransferencia(transferenciaEmEdicaoId, payload);
      } else {
        await criarTransferencia(payload);
      }

      limparFormulario();
      await recarregarResumoETabela();

      if (typeof carregarControleEstoque === 'function') {
        await carregarControleEstoque();
      }
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Erro ao salvar transferência.');
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.textContent = transferenciaEmEdicaoId ? 'Salvar alteração' : 'Salvar transferência';
    }
  });


  document.getElementById('btnNovoLocalDestinoTransferencia')?.addEventListener('click', async () => {
    try {
      const novoLocal = await abrirModalNovoCentrodeCusto();
      if (!novoLocal) return;

      const novoId = String(novoLocal.id ?? novoLocal.ID ?? '');
      await carregarLocaisArmazenagemTransferencia('transferenciaLocalDestino', novoId, idLocalOrigem);
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Erro ao cadastrar novo local.');
    }
  });


  await carregarLocaisArmazenagemTransferencia('transferenciaLocalDestino', '', idLocalOrigem);
  await recarregarResumoETabela();
}

async function receberTransferencia(id, payload) {
  return apiJson(apiUrlTr(`/api/estoque/transferencias/${encodeURIComponent(id)}/recebimento`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function carregarLocaisArmazenagemTransferencia(selectId, selectedId, idLocalOrigem) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = `<option value="">Carregando locais...</option>`;

  try {
    const response = await fetch(apiUrlTr('api/locais-centrocusto'));
    const texto = await response.text();

    let locais = [];
    try {
      locais = texto ? JSON.parse(texto) : [];
    } catch {
      throw new Error('Resposta inválida ao carregar locais.');
    }

    if (!response.ok) {
      throw new Error(locais?.message || 'Erro ao carregar locais.');
    }

    const options = Array.isArray(locais)
      ? locais
          .filter(local => String(local.ID ?? local.id ?? '') !== String(idLocalOrigem ?? ''))
          .map(local => {
            const localId = String(local.ID ?? local.id ?? '');
            const localNome = String(local.NOME ?? local.nome ?? '');
            return `
              <option value="${escapeHtmlString(localId)}" ${localId === String(selectedId) ? 'selected' : ''}>
                ${escapeHtml(localNome)}
              </option>
            `;
          })
          .join('')
      : '';

    select.innerHTML = `<option value="">Selecione o local...</option>${options}`;
  } catch (err) {
    console.error(err);
    select.innerHTML = `<option value="">Erro ao carregar locais</option>`;
  }
}

async function obterSaldoTransferencia(idProduto, idLocalOrigem) {
  return apiJson(
    apiUrlTr(`api/estoque/transferencias/saldo?idProduto=${encodeURIComponent(idProduto)}&idLocalOrigem=${encodeURIComponent(idLocalOrigem)}`)
  );
}

async function listarTransferencias(idProduto, idLocalOrigem) {
  return apiJson(
    apiUrlTr(`api/estoque/transferencias?idProduto=${encodeURIComponent(idProduto)}&idLocalOrigem=${encodeURIComponent(idLocalOrigem)}`)
  );
}

async function criarTransferencia(payload) {
  return apiJson(apiUrlTr('api/estoque/transferencias'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function editarTransferencia(id, payload) {
  return apiJson(apiUrlTr(`api/estoque/transferencias/${encodeURIComponent(id)}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function excluirTransferencia(id, payload) {
  return apiJson(apiUrlTr(`api/estoque/transferencias/${encodeURIComponent(id)}`), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {})
  });
}

async function listarLogsTransferencia(idTransferencia) {
  return apiJson(apiUrlTr(`api/estoque/transferencias/${encodeURIComponent(idTransferencia)}/logs`));
}

function apiUrlTr(path = '') {
  const baseSessao =
    sessionStorage.getItem('api_base') ||
    sessionStorage.getItem('API_BASE') ||
    sessionStorage.getItem('apiBase') ||
    '';

  const base = String(baseSessao || '').trim();

  if (!base) {
    console.error('api_base não encontrada na sessão.');
    return path.startsWith('http')
      ? path
      : `/${String(path || '').replace(/^\/+/, '')}`;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const baseNormalizada = base.replace(/\/+$/, '');
  const pathNormalizado = String(path || '').replace(/^\/+/, '');

  return `${baseNormalizada}/${pathNormalizado}`;
}

function escapeHtmlString(value) {
  return escapeHtml(String(value ?? ''));
}

// Centro de custo
let cacheEstoqueCentroCusto = [];
let cachePendenciasCentroCusto = [];
let pendenciasCentroCustoFechadas = false;

async function carregarEstoqueCentroCusto() {
  const usuario = typeof obterUsuarioLogado === 'function'
    ? obterUsuarioLogado()
    : 'SISTEMA';

  const resposta = await apiJson(
    apiUrlTr(`/api/estoque/centro-custo?usuario=${encodeURIComponent(usuario)}`)
  );
  cacheEstoqueCentroCusto = Array.isArray(resposta?.items) ? resposta.items : [];
  cachePendenciasCentroCusto = Array.isArray(resposta?.notificacoesPendentes)
    ? resposta.notificacoesPendentes
    : [];

  atualizarIndicadorPendenciasCentroCusto();
  renderizarEstoqueCentroCusto(cacheEstoqueCentroCusto);
}

function atualizarIndicadorPendenciasCentroCusto() {
  const btnAbrir = document.getElementById('btnAbrirPendenciasCentroCusto');
  const badge = document.getElementById('badgePendenciasCentroCusto');

  if (!btnAbrir || !badge) return;

  const total = Array.isArray(cachePendenciasCentroCusto)
    ? cachePendenciasCentroCusto.length
    : 0;

  if (!total) {
    btnAbrir.classList.add('hidden');
    badge.classList.add('hidden');
    badge.textContent = '0';
    return;
  }

  btnAbrir.classList.remove('hidden');
  badge.classList.remove('hidden');
  badge.textContent = String(total);
}

function renderizarEstoqueCentroCusto(items = []) {
  const tbody = document.getElementById('tbodyEstoqueCentroCusto');
  if (!tbody) return;

  if (!Array.isArray(items) || !items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="px-4 py-6 text-sm text-muted-foreground text-center">
          Nenhum material disponível no centro de custo.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const id = item.ID ?? item.ID_TRANSFERENCIA ?? '';
    const idProduto = item.ID_PRODUTO ?? item.IDPRODUTO ?? '';
    const idLocalOrigem =
      item.ID_LOCAL_DESTINO ??
      item.IDLOCALDESTINO ??
      item.ID_LOCAL_ORIGEM_ESTOQUE ??
      item.IDLOCALORIGEMESTOQUE ??
      '';

    const codigo = item.CODIGO_PRODUTO ?? item.CODIGOPRODUTO ?? '—';
    const descricao = item.DESCRICAO_PRODUTO ?? item.DESCRICAOPRODUTO ?? '—';
    const origem =
      item.LOCAL_ORIGEM ??
      item.LOCALORIGEM ??
      item.LOCAL_ORIGEM_ESTOQUE ??
      item.LOCALORIGEMESTOQUE ??
      item.CENTRO_CUSTO ??
      item.CENTROCUSTO ??
      '—';

    const destino =
      item.LOCAL_DESTINO ??
      item.LOCALDESTINO ??
      item.CENTRO_CUSTO ??
      item.CENTROCUSTO ??
      '—';

    const quantidade = Number(item.QUANTIDADE ?? 0);
    const quantidadeNaoRecebida = Number(item.QTD_TRANSFERIDA_NAO_RECEBIDA ?? 0);
    const unidade = item.UNIDADE ?? 'UN';
    const dataRecebimento =
      item.DATA_HORA_RECEBIMENTO ??
      item.DATAHORARECEBIMENTO ??
      item.DATA_CADASTRO ??
      item.DATACADASTRO ??
      '';

    return `
      <tr class="border-b border-border last:border-b-0 hover:bg-white/30 transition-colors">
        <td class="px-4 py-3 text-sm">${escapeHtml(String(codigo))}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(String(descricao))}</td>
        <td class="px-4 py-3 text-sm text-right">${escapeHtmlString(formatarDecimalBr(quantidade, 2))}</td>
        <td class="px-4 py-3 text-sm text-right">${escapeHtmlString(formatarDecimalBr(quantidadeNaoRecebida, 2))}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(String(unidade))}</td>
        <td class="px-4 py-3 text-sm text-right">
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="btnTransferenciaCentroCusto w-9 h-9 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
              data-id="${escapeHtmlString(String(id))}"
              data-id-produto="${escapeHtmlString(String(idProduto))}"
              data-id-local="${escapeHtmlString(String(idLocalOrigem))}"
              data-codigo="${escapeHtmlString(String(codigo))}"
              data-descricao="${escapeHtmlString(String(descricao))}"
              data-unidade="${escapeHtmlString(String(unidade))}"
              title="Transferir para outro centro de custo"
            >
              <i class="fas fa-right-left"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  vincularEventosTransferenciaCentroCusto();
  vincularEventosLogsTransferencia();

  document.addEventListener('click', async e => {
    const btnLogs = e.target.closest('.btnLogsTransferenciaCentroCusto');
    if (!btnLogs) return;

    const idTransferencia = String(btnLogs.dataset.id || '').trim();
    if (!idTransferencia) {
      alert('ID da transferência não encontrado.');
      return;
    }

    try {
      await abrirModalLogsTransferencia(idTransferencia);
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Erro ao carregar histórico da transferência.');
    }
  });

}


function vincularEventosLogsTransferencia() {
  document.querySelectorAll('.btnLogsTransferencia').forEach(btn => {
    if (btn.dataset.eventoVinculado === '1') return;

    btn.dataset.eventoVinculado = '1';
    btn.addEventListener('click', async e => {
      const idTransferencia = String(e.currentTarget.dataset.id || '');
      if (!idTransferencia) return;
      await abrirModalLogsTransferencia(idTransferencia);
    });
  });
}

function abrirModalPendenciasCentroCusto() {
  removerModalPendenciasCentroCusto();

  const items = Array.isArray(cachePendenciasCentroCusto)
    ? cachePendenciasCentroCusto
    : [];

  const overlay = document.createElement('div');
  overlay.id = 'pendenciasCentroCustoOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[180]';

  const modal = document.createElement('div');
  modal.id = 'pendenciasCentroCustoModal';
  modal.className = 'fixed inset-0 z-[190]';

  const htmlLista = !items.length
    ? `
      <div class="rounded-2xl border border-border bg-white/40 px-4 py-6 text-sm text-muted-foreground text-center">
        Nenhuma pendência de recebimento.
      </div>
    `
    : `
      <div class="space-y-3 max-h-[65vh] overflow-auto pr-1">
        ${items.map(item => {
          const id = item.ID ?? '';
          const codigo = item.CODIGO_PRODUTO ?? '—';
          const descricao = item.DESCRICAO_PRODUTO ?? '—';
          const origem = item.LOCAL_ORIGEM ?? '—';
          const destino = item.LOCAL_DESTINO ?? '—';
          const quantidade = item.QUANTIDADE ?? 0;
          const unidade = item.UNIDADE ?? 'UN';
          const status = item.STATUS_TRANSFERENCIA ?? '—';
          const dataCadastro = item.DATA_CADASTRO ?? '';

          return `
            <div class="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-1">
                  <div class="text-sm font-semibold text-foreground">
                    ${escapeHtml(String(codigo))} - ${escapeHtml(String(descricao))}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Origem: ${escapeHtml(String(origem))}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Destino: ${escapeHtml(String(destino))}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Quantidade: ${escapeHtmlString(formatarDecimalBr(quantidade, 2))} ${escapeHtml(String(unidade))}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Status: ${escapeHtml(String(status))}
                  </div>
                  <div class="text-sm text-muted-foreground">
                    Data: ${escapeHtml(formatarDataHora(dataCadastro))}
                  </div>
                </div>

                <div class="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    class="btnLogsTransferencia rounded-xl border border-amber-200 bg-white/80 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-white transition-all"
                    data-id="${escapeHtmlString(String(id))}"
                  >
                    <i class="fas fa-clock-rotate-left mr-2"></i>
                    Histórico
                  </button>

                  <button
                    type="button"
                    class="btnReceberMaterialCentroCusto rounded-xl bg-primary text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition-all"
                    data-id="${escapeHtmlString(String(id))}"
                  >
                    <i class="fas fa-box-open mr-2"></i>
                    Receber material
                  </button>

                  <button
                    type="button"
                    class="btnRecusarMaterialCentroCusto rounded-xl bg-destructive text-destructive-foreground px-4 py-2 text-sm font-medium hover:bg-destructive/90 transition-all"
                    data-id="${escapeHtmlString(String(id))}"
                  >
                    <i class="fas fa-ban mr-2"></i>
                    Recusar material
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

  modal.innerHTML = `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex items-center justify-center p-4">
        <div class="w-full max-w-5xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-foreground">Pendências de recebimento</h3>
              <p class="text-sm text-muted-foreground">
                Transferências que ainda precisam ser recebidas pelo seu centro de custo.
              </p>
            </div>

            <button
              type="button"
              id="btnFecharModalPendenciasCentroCusto"
              class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="px-6 py-6 space-y-4">
            ${htmlLista}
          </div>

          <div class="px-6 py-4 border-t border-border flex justify-end">
            <button
              type="button"
              id="btnFecharRodapePendenciasCentroCusto"
              class="rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  const fechar = () => removerModalPendenciasCentroCusto();

  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharModalPendenciasCentroCusto')?.addEventListener('click', fechar);
  document.getElementById('btnFecharRodapePendenciasCentroCusto')?.addEventListener('click', fechar);

  vincularEventosLogsTransferencia();
  vincularEventosRecebimentoCentroCusto();
  vincularEventosRecusaCentroCusto(); 
}

function removerModalPendenciasCentroCusto() {
  document.getElementById('pendenciasCentroCustoOverlay')?.remove();
  document.getElementById('pendenciasCentroCustoModal')?.remove();
}

function vincularEventosRecebimentoCentroCusto() {
  document.querySelectorAll('.btnReceberMaterialCentroCusto').forEach(btn => {
    if (btn.dataset.eventoVinculado === '1') return;

    btn.dataset.eventoVinculado = '1';
    btn.addEventListener('click', async e => {
      const idTransferencia = String(e.currentTarget.dataset.id || '');
      if (!idTransferencia) return;

      const usuario = typeof obterUsuarioLogado === 'function'
        ? obterUsuarioLogado()
        : 'SISTEMA';

      if (!confirm('Confirma o recebimento desta transferência?')) return;

      try {
        await receberTransferencia(idTransferencia, {
          usuario,
          observacao: 'Recebimento confirmado pelo usuário logado.'
        });

        await carregarEstoqueCentroCusto();
        abrirModalPendenciasCentroCusto();
      } catch (err) {
        console.error(err);
        alert(err?.message || 'Erro ao registrar recebimento da transferência.');
      }
    });
  });
}

function vincularEventosRecusaCentroCusto() {
  document.querySelectorAll('.btnRecusarMaterialCentroCusto').forEach(btn => {
    if (btn.dataset.eventoVinculado === '1') return;

    btn.dataset.eventoVinculado = '1';
    btn.addEventListener('click', async e => {
      const idTransferencia = String(e.currentTarget.dataset.id || '');
      if (!idTransferencia) return;

      const usuario = typeof obterUsuarioLogado === 'function'
        ? obterUsuarioLogado()
        : 'SISTEMA';

      if (!confirm('Confirmar a recusa desta transferência?')) return;

      try {
        await recusarTransferencia(idTransferencia, {
          usuario,
          observacao: 'Recusa confirmada pelo usuário logado.'
        });

        await carregarEstoqueCentroCusto();
        abrirModalPendenciasCentroCusto();
      } catch (err) {
        console.error(err);
        alert(err?.message || 'Erro ao registrar recebimento da transferência.');
      }
    });
  });
}

async function receberTransferencia(id, payload) {
  return apiJson(apiUrlTr(`/api/estoque/transferencias/${encodeURIComponent(id)}/recebimento`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

async function recusarTransferencia(id, payload) {
  return apiJson(apiUrlTr(`/api/estoque/transferencias/${encodeURIComponent(id)}/recusa`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

document.addEventListener('click', e => {
  const btnAbrir = e.target.closest('#btnAbrirPendenciasCentroCusto');
  if (btnAbrir) {
    abrirModalPendenciasCentroCusto();
    return;
  }
});

function vincularEventosTransferenciaCentroCusto() {
  document.querySelectorAll('.btnTransferenciaCentroCusto').forEach(btn => {
    if (btn.dataset.eventoVinculado === '1') return;

    btn.dataset.eventoVinculado = '1';
    btn.addEventListener('click', async e => {
      const el = e.currentTarget;

      const idProduto = String(el.dataset.idProduto || '');
      const idLocal = String(el.dataset.idLocal || '');
      const codigo = String(el.dataset.codigo || '');
      const descricao = String(el.dataset.descricao || '');
      const unidade = String(el.dataset.unidade || 'UN');

      if (!idProduto || !idLocal) {
        alert('Não foi possível identificar o produto ou o centro de custo de origem.');
        return;
      }

      await abrirModalTransferenciaCentroCusto({
        IDPRODUTO: idProduto,
        IDLOCALORIGEM: idLocal,
        CODIGOPRODUTO: codigo,
        DESCRICAOPRODUTO: descricao,
        UNIDADE: unidade
      });
    });
  });
}

function removerModalTransferenciaCentroCusto() {
  document.getElementById('transferenciaCentroCustoOverlay')?.remove();
  document.getElementById('transferenciaCentroCustoModal')?.remove();
}

async function abrirModalTransferenciaCentroCusto(item) {
  removerModalTransferenciaCentroCusto();

  const overlay = document.createElement('div');
  overlay.id = 'transferenciaCentroCustoOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

  const modal = document.createElement('div');
  modal.id = 'transferenciaCentroCustoModal';
  modal.className = 'fixed inset-0 z-[140]';

  const idProduto = item.IDPRODUTO ?? item.ID_PRODUTO ?? '';
  const idLocalOrigem = item.IDLOCALORIGEM ?? item.ID_LOCAL_ORIGEM ?? '';
  const codigo = item.CODIGOPRODUTO ?? item.CODIGO_PRODUTO ?? '';
  const descricao = item.DESCRICAOPRODUTO ?? item.DESCRICAO_PRODUTO ?? '';
  const unidade = item.UNIDADE ?? 'UN';
  const usuario = typeof obterUsuarioLogado === 'function' ? obterUsuarioLogado() : 'SISTEMA';

  let transferenciaEmEdicaoId = null;

  modal.innerHTML = `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex items-center justify-center p-4">
        <div class="w-full max-w-6xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-foreground">Transferência entre centros de custo</h3>
              <p class="text-sm text-muted-foreground">Registre, edite ou exclua transferências deste item.</p>
            </div>
            <button type="button" id="btnFecharModalTransferenciaCentroCusto"
              class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="px-6 py-6 space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div class="rounded-2xl border border-border bg-white/60 p-4">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Código</div>
                <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(String(codigo))}</div>
              </div>

              <div class="rounded-2xl border border-border bg-white/60 p-4 lg:col-span-2">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Descrição</div>
                <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(String(descricao))}</div>
              </div>

              <div class="rounded-2xl border border-border bg-white/60 p-4">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Unidade</div>
                <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(String(unidade))}</div>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div class="rounded-2xl border border-border bg-white/60 p-4">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Saldo disponível</div>
                <div id="transferenciaCentroCustoSaldoDisponivel" class="mt-1 text-lg font-semibold text-primary">0,0000</div>
              </div>

              <div class="rounded-2xl border border-border bg-white/60 p-4">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Qtd. entrada</div>
                <div id="transferenciaCentroCustoQtdEntrada" class="mt-1 text-lg font-semibold text-foreground">0,0000</div>
              </div>

              <div class="rounded-2xl border border-border bg-white/60 p-4">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Qtd. transferida</div>
                <div id="transferenciaCentroCustoQtdTransferida" class="mt-1 text-lg font-semibold text-foreground">0,0000</div>
              </div>
            </div>

            <form id="formTransferenciaCentroCusto" class="rounded-2xl border border-border bg-white/40 p-5 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">Centro de custo destino</label>
                  <div class="flex flex-col sm:flex-row gap-2">
                    <select id="transferenciaCentroCustoDestino"
                      class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm" required>
                      <option value="">Selecione o centro de custo...</option>
                    </select>

                    <button type="button" id="btnNovoDestinoCentroCusto"
                      class="w-10 h-10 rounded-xl border border-border bg-white/70 hover:bg-white transition-all flex items-center justify-center"
                      title="Novo centro de custo">
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">Quantidade</label>
                  <input id="transferenciaCentroCustoQuantidade" type="text"
                    class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm"
                    placeholder="Ex. 1,0000" required>
                </div>

                <div>
                  <label class="block text-sm font-medium text-foreground mb-2">Usuário</label>
                  <input id="transferenciaCentroCustoUsuario" type="text"
                    class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm"
                    value="${escapeHtml(String(usuario))}" readonly>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-foreground mb-2">Observação</label>
                <input id="transferenciaCentroCustoObservacao" type="text" maxlength="255"
                  class="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm"
                  placeholder="Opcional">
              </div>

              <div class="flex justify-end gap-2">
                <button type="button" id="btnCancelarEdicaoTransferenciaCentroCusto"
                  class="hidden rounded-xl border border-border bg-white/60 px-4 py-3 text-sm font-medium hover:bg-white/90 transition-all">
                  Cancelar edição
                </button>

                <button type="submit" id="btnSalvarTransferenciaCentroCusto"
                  class="rounded-xl bg-primary text-white px-4 py-3 text-sm font-medium hover:opacity-90 transition-all">
                  Salvar transferência
                </button>
              </div>
            </form>

            <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
              <div class="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-semibold text-foreground">Transferências registradas</h4>
                  <p class="text-xs text-muted-foreground">Edite, receba ou exclua uma transferência existente.</p>
                </div>
              </div>

              <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                  <thead class="bg-white/50 border-b border-border">
                    <tr>
                      <th class="px-4 py-3 text-left font-semibold">Destino</th>
                      <th class="px-4 py-3 text-right font-semibold">Quantidade</th>
                      <th class="px-4 py-3 text-left font-semibold">UN</th>
                      <th class="px-4 py-3 text-left font-semibold">Usuário</th>
                      <th class="px-4 py-3 text-left font-semibold">Data/Hora</th>
                      <th class="px-4 py-3 text-left font-semibold">Status</th>
                      <th class="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody id="tbodyTransferenciasCentroCusto">
                    <tr>
                      <td colspan="7" class="px-4 py-6 text-sm text-muted-foreground text-center">Carregando transferências...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  const fechar = () => removerModalTransferenciaCentroCusto();

  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharModalTransferenciaCentroCusto')?.addEventListener('click', fechar);

  async function carregarDestinos(selectedId = '') {
    const select = document.getElementById('transferenciaCentroCustoDestino');
    if (!select) return;

    select.innerHTML = '<option value="">Carregando centros de custo...</option>';

    try {
      const response = await fetch(apiUrlTr('/api/locais-centrocusto'));
      const texto = await response.text();
      const locais = texto ? JSON.parse(texto) : [];

      const options = Array.isArray(locais)
        ? locais
            .filter(local => String(local.ID ?? local.id ?? '') !== String(idLocalOrigem))
            .map(local => {
              const localId = String(local.ID ?? local.id ?? '');
              const localNome = String(local.NOME ?? local.nome ?? '');
              return `<option value="${escapeHtmlString(localId)}" ${localId === String(selectedId) ? 'selected' : ''}>${escapeHtml(localNome)}</option>`;
            }).join('')
        : '';

      select.innerHTML = `<option value="">Selecione o centro de custo...</option>${options}`;
    } catch (err) {
      console.error(err);
      select.innerHTML = '<option value="">Erro ao carregar centros de custo</option>';
    }
  }

  function limparFormulario() {
    transferenciaEmEdicaoId = null;
    document.getElementById('transferenciaCentroCustoDestino').value = '';
    document.getElementById('transferenciaCentroCustoQuantidade').value = '';
    document.getElementById('transferenciaCentroCustoObservacao').value = '';
    document.getElementById('btnSalvarTransferenciaCentroCusto').textContent = 'Salvar transferência';
    document.getElementById('btnCancelarEdicaoTransferenciaCentroCusto').classList.add('hidden');
  }

  async function recarregarResumoETabela() {
    try {
      const [saldoResp, listaResp] = await Promise.all([
        obterSaldoTransferenciaCentroCusto(idProduto, idLocalOrigem),
        listarTransferenciasCentroCusto(idProduto, idLocalOrigem)
      ]);

      document.getElementById('transferenciaCentroCustoSaldoDisponivel').textContent =
        formatarDecimalBr(saldoResp?.saldo ?? 0, 2);

      document.getElementById('transferenciaCentroCustoQtdEntrada').textContent =
        formatarDecimalBr(saldoResp?.qtdRecebida ?? saldoResp?.qtdEntrada ?? 0, 2);

      document.getElementById('transferenciaCentroCustoQtdTransferida').textContent =
        formatarDecimalBr(saldoResp?.qtdEnviada ?? saldoResp?.qtdTransferida ?? 0, 2);

      document.getElementById('tbodyTransferenciasCentroCusto').innerHTML =
        renderTabelaTransferenciasCentroCusto(listaResp?.items);

      vincularEventosTabelaCentroCusto();
    } catch (err) {
      console.error(err);
      document.getElementById('tbodyTransferenciasCentroCusto').innerHTML = `
        <tr>
          <td colspan="7" class="px-4 py-6 text-sm text-danger text-center">
            ${escapeHtml(err?.message || 'Erro ao carregar transferências.')}
          </td>
        </tr>
      `;
    }
  }


  function vincularEventosTabelaCentroCusto() {
    document.querySelectorAll('.btnEditarTransferencia').forEach(btn => {
      btn.addEventListener('click', e => {
        const el = e.currentTarget;
        transferenciaEmEdicaoId = String(el.dataset.id || '');
        document.getElementById('transferenciaCentroCustoDestino').value = String(el.dataset.idLocalDestino || '');
        document.getElementById('transferenciaCentroCustoQuantidade').value = formatarDecimalBr(el.dataset.quantidade || 0, 2);
        document.getElementById('transferenciaCentroCustoObservacao').value = String(el.dataset.observacao || '');
        document.getElementById('btnSalvarTransferenciaCentroCusto').textContent = 'Salvar alteração';
        document.getElementById('btnCancelarEdicaoTransferenciaCentroCusto').classList.remove('hidden');
      });
    });

    document.querySelectorAll('.btnReceberTransferencia').forEach(btn => {
      btn.addEventListener('click', async e => {
        const idTransferencia = String(e.currentTarget.dataset.id || '');
        if (!idTransferencia) return;

        if (!confirm('Confirma o recebimento desta transferência?')) return;

        try {
          await receberTransferencia(idTransferencia, {
            usuario,
            observacao: 'Recebimento confirmado pelo usuário logado.'
          });

          await recarregarResumoETabela();
          await carregarEstoqueCentroCusto();
        } catch (err) {
          console.error(err);
          alert(err?.message || 'Erro ao registrar recebimento da transferência.');
        }
      });
    });

    document.querySelectorAll('.btnExcluirTransferencia').forEach(btn => {
      btn.addEventListener('click', async e => {
        const idTransferencia = String(e.currentTarget.dataset.id || '');
        if (!idTransferencia) return;

        if (!confirm('Deseja realmente excluir esta transferência?')) return;

        try {
          await excluirTransferenciaCentroCusto(idTransferencia, {
            usuario,
            observacao: 'Exclusão realizada pelo modal de transferência.'
          });

          limparFormulario();
          await recarregarResumoETabela();
          await carregarEstoqueCentroCusto();
        } catch (err) {
          console.error(err);
          alert(err?.message || 'Erro ao excluir transferência.');
        }
      });
    });

    document.querySelectorAll('.btnLogsTransferencia').forEach(btn => {
      btn.addEventListener('click', async e => {
        const idTransferencia = String(e.currentTarget.dataset.id || '');
        if (!idTransferencia) return;
        await abrirModalLogsTransferencia(idTransferencia);
      });
    });
  }

  document.getElementById('btnCancelarEdicaoTransferenciaCentroCusto')?.addEventListener('click', limparFormulario);

  document.getElementById('btnNovoDestinoCentroCusto')?.addEventListener('click', async () => {
    try {
      const novoLocal = await abrirModalNovoCentrodeCusto();
      if (!novoLocal) return;
      await carregarDestinos(String(novoLocal.id ?? novoLocal.ID ?? ''));
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Erro ao cadastrar centro de custo.');
    }
  });

  document.getElementById('formTransferenciaCentroCusto')?.addEventListener('submit', async e => {
    e.preventDefault();

    const btnSalvar = document.getElementById('btnSalvarTransferenciaCentroCusto');
    const idLocalDestino = document.getElementById('transferenciaCentroCustoDestino')?.value;
    const quantidade = parseDecimalBr(document.getElementById('transferenciaCentroCustoQuantidade')?.value);
    const observacao = String(document.getElementById('transferenciaCentroCustoObservacao')?.value || '').trim();
    const saldoAtual = parseDecimalBr(document.getElementById('transferenciaCentroCustoSaldoDisponivel')?.textContent || '0');

    if (!idLocalDestino) {
      alert('Selecione o centro de custo de destino.');
      return;
    }

    if (!(quantidade > 0)) {
      alert('Informe uma quantidade válida.');
      return;
    }

    if (!transferenciaEmEdicaoId && quantidade > saldoAtual) {
      alert(`A quantidade informada excede o saldo disponível (${formatarDecimalBr(saldoAtual, 2)}).`);
      return;
    }

    try {
      btnSalvar.disabled = true;
      btnSalvar.textContent = transferenciaEmEdicaoId ? 'Salvando alteração...' : 'Salvando...';

      const payload = {
        idProduto: Number(idProduto),
        idLocalOrigem: Number(idLocalOrigem),
        idLocalDestino: Number(idLocalDestino),
        quantidade,
        unidade,
        observacao,
        usuario,
        tipoTransferencia: 'LOCAL'
      };

      if (transferenciaEmEdicaoId) {
        await editarTransferenciaCentroCusto(transferenciaEmEdicaoId, payload);
      } else {
        await criarTransferenciaCentroCusto(payload);
      }

      limparFormulario();
      await recarregarResumoETabela();
      await carregarEstoqueCentroCusto();
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Erro ao salvar transferência.');
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.textContent = transferenciaEmEdicaoId ? 'Salvar alteração' : 'Salvar transferência';
    }
  });

  await carregarDestinos();
  await recarregarResumoETabela();
}

async function obterSaldoTransferenciaCentroCusto(idProduto, idLocalOrigem) {
  return apiJson(
    apiUrlTr(`/api/estoque/centro-custo/saldo?idProduto=${encodeURIComponent(idProduto)}&idLocalOrigem=${encodeURIComponent(idLocalOrigem)}`)
  );
}

async function listarTransferenciasCentroCusto(idProduto, idLocalOrigem) {
  return apiJson(
    apiUrlTr(`/api/estoque/centro-custo/transferencias?idProduto=${encodeURIComponent(idProduto)}&idLocalOrigem=${encodeURIComponent(idLocalOrigem)}`)
  );
}

async function criarTransferenciaCentroCusto(payload) {
  return apiJson(apiUrlTr('/api/estoque/centro-custo/transferencias'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function editarTransferenciaCentroCusto(id, payload) {
  return apiJson(apiUrlTr(`/api/estoque/centro-custo/transferencias/${encodeURIComponent(id)}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function excluirTransferenciaCentroCusto(id, payload) {
  return apiJson(apiUrlTr(`/api/estoque/centro-custo/transferencias/${encodeURIComponent(id)}`), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

function renderTabelaTransferenciasCentroCusto(items = []) {
  if (!Array.isArray(items) || !items.length) {
    return `
      <tr>
        <td colspan="7" class="px-4 py-6 text-sm text-muted-foreground text-center">
          Nenhuma transferência registrada.
        </td>
      </tr>
    `;
  }

  return items.map(item => {
    const status = String(item.STATUS_TRANSFERENCIA ?? item.STATUSTRANSFERENCIA ?? '').trim().toUpperCase();
    const podeEditarExcluir = status === 'AGUARDANDO_RECEBIMENTO';
    const podeReceber = status === 'EM_TRANSITO' || status === 'AGUARDANDO_RECEBIMENTO';

    return `
      <tr class="border-b border-border last:border-b-0 hover:bg-white/30 transition-colors">
        <td class="px-4 py-3 text-sm">${escapeHtml(String(item.LOCAL_DESTINO ?? item.LOCALDESTINO ?? '—'))}</td>
        <td class="px-4 py-3 text-sm text-right">${escapeHtmlString(formatarDecimalBr(item.QUANTIDADE ?? 0, 2))}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(String(item.UNIDADE ?? 'UN'))}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(String(item.USUARIO_CADASTRO ?? item.USUARIOCADASTRO ?? '—'))}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(formatarDataHora(item.DATA_CADASTRO ?? item.DATACADASTRO ?? ''))}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(String(item.STATUS_TRANSFERENCIA ?? item.STATUSTRANSFERENCIA ?? '—'))}</td>
        <td class="px-4 py-3 text-sm">
          <div class="flex justify-end gap-2">
            ${podeEditarExcluir ? `
              <button
                type="button"
                class="btnEditarTransferencia w-9 h-9 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
                data-id="${escapeHtmlString(String(item.ID ?? ''))}"
                data-id-local-destino="${escapeHtmlString(String(item.ID_LOCAL_DESTINO ?? item.IDLOCALDESTINO ?? ''))}"
                data-quantidade="${escapeHtmlString(String(item.QUANTIDADE ?? 0))}"
                data-observacao="${escapeHtmlString(String(item.OBSERVACAO ?? ''))}"
                title="Editar transferência"
              >
                <i class="fas fa-pen"></i>
              </button>

              <button
                type="button"
                class="btnExcluirTransferencia w-9 h-9 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all"
                data-id="${escapeHtmlString(String(item.ID ?? ''))}"
                title="Excluir transferência"
              >
                <i class="fas fa-trash"></i>
              </button>
            ` : ''}

            <button
              type="button"
              class="btnLogsTransferencia w-9 h-9 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all"
              data-id="${escapeHtmlString(String(item.ID ?? ''))}"
              title="Ver logs"
            >
              <i class="fas fa-clock-rotate-left"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ===============================
// PERFIS
// ===============================

let perfisCache = [];

const PERFIL_FIELDS = [
  'pedidos',
  'pedidos_dashboard_geral',
  'pedidos_dashboard_minha',
  'pedidos_supervisor',
  'pedidos_incluir',
  'pedidos_editar',
  'pedidos_excluir',
  'clientes',
  'clientes_incluir',
  'clientes_editar',
  'clientes_excluir',
  'marketing',
  'email_automaticos',
  'agendar_sala_reuniao',
  'excluir_agendamento_sala_reuniao',
  'reservar_carro',
  'excluir_reserva_carro',
  'gestao_usuarios',
  'gestao_usuarios_cadastro',
  'gestao_usuarios_incluir',
  'gestao_usuarios_editar',
  'gestao_usuarios_excluir',
  'estoque',
  'estoque_almoxarifado',
  'estoque_fazenda',
  'estoque_cadastrar',
  'estoque_transferir',
  'estoque_receber',
  'perfil_acesso'
];


function setPerfisMsg(msg, tipo = '') {
  const el = document.getElementById('perfilMsg');
  if (!el) return;

  if (!msg) {
    el.textContent = '';
    el.className = 'text-sm text-muted-foreground hidden';
    return;
  }

  el.textContent = msg;
  el.className = `text-sm ${tipo === 'erro' ? 'text-destructive' : 'text-muted-foreground'}`;
  el.classList.remove('hidden');
}

function boolBadge(v) {
  return Number(v) === 1
    ? '<span class="inline-flex items-center px-2 py-1 rounded-full border bg-success/15 text-success border-success/20 text-xs font-semibold">Sim</span>'
    : '<span class="inline-flex items-center px-2 py-1 rounded-full border bg-muted/40 text-muted-foreground border-border text-xs font-semibold">Não</span>';
}

function resumirPermissoes(perfil) {
  const modulos = [];
  if (Number(perfil.pedidos) === 1) modulos.push('Pedidos');
  if (Number(perfil.clientes) === 1) modulos.push('Clientes');
  if (Number(perfil.marketing) === 1) modulos.push('Marketing');
  if (Number(perfil.email_automaticos) === 1) modulos.push('E-mails');
  if (Number(perfil.gestao_usuarios) === 1) modulos.push('Usuários');
  if (Number(perfil.estoque) === 1) modulos.push('Estoque');
  if (Number(perfil.perfil_acesso) === 1) modulos.push('Perfil de Acesso');
  return modulos.length ? modulos.join(', ') : 'Sem permissões';
}


function rowPerfil(item) {
  const id = item.id ?? item.ID ?? '';
  const nome = item.nome ?? item.NOME ?? '';
  const permissoes = resumirPermissoes(item);

  return `
    <tr class="hover:bg-white/40 transition-all">
      <td class="px-4 py-3 font-medium">${escapeHtml(nome)}</td>
      <td class="px-4 py-3 text-sm text-muted-foreground">${escapeHtml(permissoes)}</td>
      <td class="px-4 py-3">
        <span class="inline-flex items-center px-2 py-1 rounded-full border bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
          Cadastrado
        </span>
      </td>
      <td class="px-4 py-3">
        <div class="flex justify-end gap-2">
          <button
            class="btnEditPerfil w-10 h-10 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all"
            data-id="${escapeHtml(String(id))}"
            title="Editar perfil"
            aria-label="Editar perfil">
            <i class="fas fa-pen"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}


async function carregarPerfis() {
  const tbody = document.getElementById('tbodyPerfis');
  if (!tbody) return;

  try {
    setPerfisMsg('Carregando perfis...');
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-6 text-sm text-muted-foreground">
          Carregando perfis...
        </td>
      </tr>
    `;

    const data = await apiJson(apiUrl('/api/perfis'));

    let items = [];

    if (Array.isArray(data?.items)) {
      items = data.items;
    } else if (Array.isArray(data) && Array.isArray(data[0])) {
      items = data[0];
    } else if (Array.isArray(data)) {
      items = data;
    }

    perfisCache = items.filter(item => item && typeof item === 'object' && !Array.isArray(item));


    if (!perfisCache.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="px-4 py-6 text-sm text-muted-foreground">
            Nenhum perfil cadastrado.
          </td>
        </tr>
      `;
      setPerfisMsg('');
      return;
    }

    tbody.innerHTML = perfisCache.map(rowPerfil).join('');
    setPerfisMsg('');
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-6 text-sm text-destructive">
          Falha ao carregar perfis.
        </td>
      </tr>
    `;
    setPerfisMsg(err?.message || 'Erro ao carregar perfis.', 'erro');
  }
}


function removerModalPerfil() {
  document.getElementById('perfilOverlay')?.remove();
  document.getElementById('perfilModal')?.remove();
}

function getPerfilCheckboxValue(id) {
  return document.getElementById(id)?.checked ? 1 : 0;
}

function setPerfilCheckboxValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.checked = Number(value) === 1;
}

function montarPayloadPerfil() {
  const payload = {
    nome: (document.getElementById('perfilNome')?.value || '').trim()
  };

  PERFIL_FIELDS.forEach(field => {
    payload[field] = getPerfilCheckboxValue(field);
  });

  return payload;
}

function preencherFormPerfil(perfil = {}) {
  const idEl = document.getElementById('perfilId');
  const nomeEl = document.getElementById('perfilNome');

  if (idEl) idEl.value = perfil.id ?? perfil.ID ?? '';
  if (nomeEl) nomeEl.value = perfil.nome ?? perfil.NOME ?? '';

  PERFIL_FIELDS.forEach(field => {
    setPerfilCheckboxValue(field, perfil[field]);
  });
}

function abrirModalPerfil(modo = 'new', perfil = null) {
  removerModalPerfil();

  const overlay = document.createElement('div');
  overlay.id = 'perfilOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'perfilModal';
  modal.className = 'fixed inset-0 z-[100]';

  const isEdit = modo === 'edit';

  modal.innerHTML = `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-5xl mx-auto">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-foreground">${isEdit ? 'Editar perfil' : 'Novo perfil'}</h3>
                <p class="text-sm text-muted-foreground">Defina quais permissões este perfil terá acesso</p>
              </div>

              <button id="btnFecharPerfilModal" type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                aria-label="Fechar" title="Fechar">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <form id="formPerfilModal" class="px-6 py-6 space-y-6">
              <input type="hidden" id="perfilId" />

              <div class="space-y-2">
                <label class="text-sm font-medium">Nome do perfil</label>
                <input
                  id="perfilNome"
                  type="text"
                  required
                  class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Ex.: Supervisor Comercial" />
              </div>

              <div id="perfilTree" class="space-y-3">

                <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
                  <button type="button" class="tree-toggle w-full flex items-center justify-between px-4 py-3 hover:bg-white/40 transition" data-target="grupo-modulos">
                    <div class="flex items-center gap-3">
                      <span class="tree-icon text-xs transition-transform -rotate-90">▼</span>
                      <span class="font-semibold">Módulos</span>
                    </div>
                  </button>
                  <div id="grupo-modulos" class="tree-children hidden border-t border-border px-6 py-3 space-y-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="perfil_acesso"> <span>Perfil de Acesso</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="marketing"> <span>Marketing</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="email_automaticos"> <span>E-mails automáticos</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="agendar_sala_reuniao"> <span>Agendar sala de reunião</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="excluir_agendamento_sala_reuniao"> <span>Excluir agendamento de sala de reunião</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="reservar_carro"> <span>Reservar carro</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="excluir_reserva_carro"> <span>Excluir reserva de carro</span></label>
                  </div>
                </div>

                <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
                  <button type="button" class="tree-toggle w-full flex items-center justify-between px-4 py-3 hover:bg-white/40 transition" data-target="grupo-pedidos">
                    <div class="flex items-center gap-3">
                      <span class="tree-icon text-xs transition-transform -rotate-90">▼</span>
                      <label class="flex items-center gap-2 font-semibold cursor-pointer">
                        <input type="checkbox" id="pedidos" data-children="pedidos_dashboard_geral,pedidos_dashboard_minha,pedidos_supervisor,pedidos_incluir,pedidos_editar,pedidos_excluir">
                        <span>Pedidos</span>
                      </label>
                    </div>
                  </button>
                  <div id="grupo-pedidos" class="tree-children hidden border-t border-border px-6 py-3 space-y-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="pedidos_dashboard_geral" data-parent="pedidos"> <span>Dashboard geral</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="pedidos_dashboard_minha" data-parent="pedidos"> <span>Dashboard minha</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="pedidos_supervisor" data-parent="pedidos"> <span>Supervisor</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="pedidos_incluir" data-parent="pedidos"> <span>Incluir</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="pedidos_editar" data-parent="pedidos"> <span>Editar</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="pedidos_excluir" data-parent="pedidos"> <span>Excluir</span></label>
                  </div>
                </div>

                <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
                  <button type="button" class="tree-toggle w-full flex items-center justify-between px-4 py-3 hover:bg-white/40 transition" data-target="grupo-clientes">
                    <div class="flex items-center gap-3">
                      <span class="tree-icon text-xs transition-transform -rotate-90">▼</span>
                      <label class="flex items-center gap-2 font-semibold cursor-pointer">
                        <input type="checkbox" id="clientes" data-children="clientes_incluir,clientes_editar,clientes_excluir">
                        <span>Clientes</span>
                      </label>
                    </div>
                  </button>
                  <div id="grupo-clientes" class="tree-children hidden border-t border-border px-6 py-3 space-y-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="clientes_incluir" data-parent="clientes"> <span>Incluir</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="clientes_editar" data-parent="clientes"> <span>Editar</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="clientes_excluir" data-parent="clientes"> <span>Excluir</span></label>
                  </div>
                </div>

                <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
                  <button type="button" class="tree-toggle w-full flex items-center justify-between px-4 py-3 hover:bg-white/40 transition" data-target="grupo-gestao">
                    <div class="flex items-center gap-3">
                      <span class="tree-icon text-xs transition-transform -rotate-90">▼</span>
                      <label class="flex items-center gap-2 font-semibold cursor-pointer">
                        <input type="checkbox" id="gestao_usuarios" data-children="gestao_usuarios_cadastro,gestao_usuarios_incluir,gestao_usuarios_editar,gestao_usuarios_excluir">
                        <span>Gestão de usuários</span>
                      </label>
                    </div>
                  </button>
                  <div id="grupo-gestao" class="tree-children hidden border-t border-border px-6 py-3 space-y-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="gestao_usuarios_cadastro" data-parent="gestao_usuarios"> <span>Cadastro</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="gestao_usuarios_incluir" data-parent="gestao_usuarios"> <span>Incluir</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="gestao_usuarios_editar" data-parent="gestao_usuarios"> <span>Editar</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="gestao_usuarios_excluir" data-parent="gestao_usuarios"> <span>Excluir</span></label>
                  </div>
                </div>

                <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
                  <button type="button" class="tree-toggle w-full flex items-center justify-between px-4 py-3 hover:bg-white/40 transition" data-target="grupo-estoque">
                    <div class="flex items-center gap-3">
                      <span class="tree-icon text-xs transition-transform -rotate-90">▼</span>
                      <label class="flex items-center gap-2 font-semibold cursor-pointer">
                        <input type="checkbox" id="estoque" data-children="estoque_almoxarifado,estoque_fazenda,estoque_cadastrar,estoque_transferir,estoque_receber">
                        <span>Estoque</span>
                      </label>
                    </div>
                  </button>
                  <div id="grupo-estoque" class="tree-children hidden border-t border-border px-6 py-3 space-y-2">
                    <label class="flex items-center gap-2"><input type="checkbox" id="estoque_almoxarifado" data-parent="estoque"> <span>Almoxarifado</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="estoque_fazenda" data-parent="estoque"> <span>Fazenda</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="estoque_cadastrar" data-parent="estoque"> <span>Cadastrar</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="estoque_transferir" data-parent="estoque"> <span>Transferir</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="estoque_receber" data-parent="estoque"> <span>Receber</span></label>
                  </div>
                </div>

              </div>


              <p id="perfilErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

              <div class="pt-2 flex flex-col sm:flex-row gap-3">
                <button id="btnSalvarPerfilModal" type="submit"
                  class="sm:flex-1 rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                  Salvar
                </button>

                <button id="btnCancelarPerfilModal" type="button"
                  class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const form = document.getElementById('formPerfilModal');
  const btnFechar = document.getElementById('btnFecharPerfilModal');
  const btnCancelar = document.getElementById('btnCancelarPerfilModal');
  const btnSalvar = document.getElementById('btnSalvarPerfilModal');
  const erroEl = document.getElementById('perfilErro');

  function setErr(msg) {
    if (!erroEl) return;
    if (!msg) {
      erroEl.textContent = '';
      erroEl.classList.add('hidden');
      return;
    }
    erroEl.textContent = msg;
    erroEl.classList.remove('hidden');
  }

  function fechar() {
    removerModalPerfil();
  }

  function syncParent(parentId) {
    const parent = document.getElementById(parentId);
    if (!parent) return;

    const childrenIds = (parent.dataset.children || '')
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    const children = childrenIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (!children.length) return;

    const checkedCount = children.filter(el => el.checked).length;

    parent.checked = checkedCount > 0;
    parent.indeterminate = checkedCount > 0 && checkedCount < children.length;
  }

  function bindTree() {
    modal.querySelectorAll('.tree-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target.closest('input, label')) return;
        const targetId = btn.dataset.target;
        const box = document.getElementById(targetId);
        const icon = btn.querySelector('.tree-icon');
        if (!box) return;
        box.classList.toggle('hidden');
        icon?.classList.toggle('-rotate-90');
      });
    });

    modal.querySelectorAll('input[data-children]').forEach(parent => {
      parent.addEventListener('change', () => {
        const childrenIds = (parent.dataset.children || '')
          .split(',')
          .map(v => v.trim())
          .filter(Boolean);

        childrenIds.forEach(id => {
          const child = document.getElementById(id);
          if (child) child.checked = parent.checked;
        });

        parent.indeterminate = false;
      });
    });

    modal.querySelectorAll('input[data-parent]').forEach(child => {
      child.addEventListener('change', () => {
        syncParent(child.dataset.parent);
      });
    });
  }

  overlay.addEventListener('click', fechar);
  btnFechar?.addEventListener('click', fechar);
  btnCancelar?.addEventListener('click', fechar);

  bindTree();

  if (perfil) preencherFormPerfil(perfil);

  ['pedidos', 'clientes', 'gestao_usuarios', 'estoque'].forEach(syncParent);

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setErr('');

    const payload = montarPayloadPerfil();
    const id = document.getElementById('perfilId')?.value?.trim();

    if (!payload.nome) {
      setErr('Informe o nome do perfil.');
      return;
    }

    try {
      btnSalvar.disabled = true;
      btnSalvar.classList.add('opacity-70');

      if (isEdit && id) {
        await apiJson(apiUrl(`/api/perfis/${id}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await apiJson(apiUrl('/api/perfis'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      fechar();
      await carregarPerfis();
    } catch (err) {
      console.error(err);
      setErr(err?.message || 'Erro ao salvar perfil.');
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.classList.remove('opacity-70');
    }
  });
}


// eventos
document.addEventListener('click', (e) => {
  const item = e.target.closest('.menu-item[data-page]');
  if (!item) return;

  if (item.dataset.page === 'secao-perfis') {
    carregarPerfis().catch(console.error);
  }
});

document.addEventListener('click', (e) => {
  const btnNovo = e.target.closest('#btnNovoPerfil');
  if (btnNovo) {
    abrirModalPerfil('new');
    return;
  }

  const btnEdit = e.target.closest('.btnEditPerfil');
  if (btnEdit) {
    const id = String(btnEdit.dataset.id || '');
    const perfil = perfisCache.find(p => String(p.id ?? p.ID) === id);
    if (perfil) abrirModalPerfil('edit', perfil);
  }
});

let weatherCardState = 'weather';

function toggleWeatherCard(direction = 'next') {
  const weatherContent = document.querySelector('.home-weather-content');
  const heroCard = document.getElementById('weatherHeroCard');
  const gridContainer = document.querySelector('.weather-grid-container');
  
  if (weatherCardState === 'weather') {
    // Esconde clima, mostra 8 quadros
    weatherContent.classList.add('climate-hidden');
    heroCard.classList.add('blank-mode');
    gridContainer.classList.remove('hidden');
    gridContainer.classList.add('opacity-100');
    weatherCardState = 'blank';
  } else {
    // Esconde quadros, mostra clima
    weatherContent.classList.remove('climate-hidden');
    heroCard.classList.remove('blank-mode');
    gridContainer.classList.add('hidden');
    gridContainer.classList.remove('opacity-100');
    weatherCardState = 'weather';
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  const weatherPrevBtn = document.getElementById('weatherPrevBtn');
  const weatherNextBtn = document.getElementById('weatherNextBtn');

  if (weatherPrevBtn) {
    weatherPrevBtn.addEventListener('click', () => toggleWeatherCard('prev'));
  }
  
  if (weatherNextBtn) {
    weatherNextBtn.addEventListener('click', () => toggleWeatherCard('next'));
  }
});
