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
      organograma: document.querySelector('[data-page="secao-organograma"]'),
      estoque: document.querySelector('[data-page="inventory-control"]'),
      perfilacesso: document.querySelector('[data-page="secao-perfis"]'),
      agendamentoveiculos: document.querySelector('[data-page="secao-meus-agendamentos"]'),
      monitorping: document.querySelector('[data-page="secao-ping-monitor"]')
    };

    Object.entries(itensMenu).forEach(([chave, el]) => {
      if (!el) return;

      if (chave === 'home') {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    document.querySelectorAll('.menu-group').forEach(grupo => {
      grupo.classList.add('hidden');
      grupo.classList.remove('open');
      grupo.querySelector('.menu-group-toggle')?.classList.remove('active');
    });

    const url = `${APIBASE}/api/permissoes/menu/${usuarioId}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (!resp.ok || !data.success) {
      alert(data?.message || 'Erro ao validar permissões do menu.');
      return;
    }

    const perm = data.item || {};

    console.log(perm);

    if (Number(perm.pedidos) === 1) {
      itensMenu.pedidos?.classList.remove('hidden');
    }

    if (Number(perm.monitorping) === 1) {
      itensMenu.monitorping?.classList.remove('hidden');
    }

    if (Number(perm.reservarcarro) === 1) {
      itensMenu.agendamentoveiculos?.classList.remove('hidden');
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
      itensMenu.organograma?.classList.remove('hidden');
    }

    if (Number(perm.estoque) === 1) {
      itensMenu.estoque?.classList.remove('hidden');
    }

    if (Number(perm.perfilacesso) === 1) {
      itensMenu.perfilacesso?.classList.remove('hidden');
    }

    document.querySelectorAll('.menu-group').forEach(grupo => {
      const subitemsVisiveis = Array.from(
        grupo.querySelectorAll('.menu-item[data-page]')
      ).some(el => !el.classList.contains('hidden'));

      grupo.classList.toggle('hidden', !subitemsVisiveis);
    });

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

function resetHomePanelsDesktop() {
  const painel = document.getElementById('homePainelPanel');
  const calendario = document.getElementById('homeCalendarioPanel');
  const botoes = document.querySelectorAll('.home-mobile-tab-btn');
  const isDesktop = window.innerWidth >= 1024;

  if (isDesktop) {
    painel?.classList.add('active');
    calendario?.classList.add('active');
    botoes.forEach(btn => btn.classList.remove('active'));
    return;
  }

  if (!painel?.classList.contains('active') && !calendario?.classList.contains('active')) {
    painel?.classList.add('active');
  }

  botoes.forEach(btn => {
    const tab = btn.dataset.homeTab;
    const ativo =
      (tab === 'painel' && painel?.classList.contains('active')) ||
      (tab === 'calendario' && calendario?.classList.contains('active'));

    btn.classList.toggle('active', !!ativo);
  });
}

function agendarProximoSlideMarketingPainel(delayMs = marketingLoopIntervalMs) {
  limparTimerMarketing();
  pararAnimacaoBarraMarketing();
  pararAnimacaoProgressoMarketing();

  if (marketingBirthdayExpandedItem || marketingLoopPaused) return;

  marketingLoopIntervalMs = Math.max(1000, Number(delayMs) || 20000);
  marketingLoopRemainingMs = marketingLoopIntervalMs;
  marketingLoopStartAt = Date.now();

  resetarBarraMarketing();
  iniciarAnimacaoBarraMarketing();

  marketingLoopTimer = setTimeout(() => {
    if (marketingBirthdayExpandedItem || marketingLoopPaused) return;
    proximoSlideMarketingPainel();
  }, marketingLoopIntervalMs);
}

function getApiBasePing() {
  return (
    sessionStorage.getItem('api_base') ||
    sessionStorage.getItem('apibase') ||
    sessionStorage.getItem('APIBASE') ||
    ''
  ).trim();
}

document.addEventListener('DOMContentLoaded', () => {
  resetHomePanelsDesktop();

  document.querySelectorAll('.home-mobile-tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      ativarHomeMobileTab(this.dataset.homeTab);
    });
  });

  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function () {
      const page = this.dataset.page;

      if (page === 'home') {
        window.location.reload();
        return;
      }

      DefinirPaginaAtiva(page, this);

      if (page === 'secao-clientes') carregarClientes();
      if (page === 'secao-ping-monitor') carregarPingMonitores();
    });
  });

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

function DefinirPaginaAtiva(pageId, itemClicado) {
  document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('bg-secondary', 'active'));
  itemClicado?.classList.add('bg-secondary', 'active');

  document.querySelectorAll('.menu-group-toggle').forEach(btn => btn.classList.remove('active'));

  const grupo = itemClicado?.closest('.menu-group');
  if (grupo) {
    grupo.classList.add('open');
    grupo.querySelector('.menu-group-toggle')?.classList.add('active');
  }

  document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId)?.classList.add('active');

  if (window.innerWidth < 900) DefinirSidebarAberta(false);
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
                <h3 id="roomModalTitle" class="form-title-sm font-semibold text-foreground">Agendar sala de reunião</h3>
                <p class="form-subtitle-sm">Selecione a sala, data, horário e participantes</p>
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
                        <label for="roomName" class="form-label-sm">Sala de reunião</label>
                        <select id="roomName"
                          class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                          required>
                          <option value="" selected disabled hidden>Selecione uma sala...</option>
                          <option value="Sala 01">Sala 01</option>
                          <option value="Sala 02">Sala 02</option>
                          <option value="Sala Diretoria">Sala Diretoria</option>
                        </select>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <label for="roomStartDT" class="form-label-sm">Data e hora início</label>
                          <input id="roomStartDT" type="datetime-local"
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            required />
                        </div>

                        <div class="space-y-2">
                          <label for="roomEndDT" class="form-label-sm">Data e hora fim</label>
                          <input id="roomEndDT" type="datetime-local"
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            required />
                        </div>
                      </div>

                      <div class="space-y-2">
                        <label for="roomReason" class="form-label-sm">Motivo</label>
                        <input id="roomReason" type="text"
                          class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
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
                            <label class="form-label-sm">Participantes</label>
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
                          class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Buscar por nome ou email..." />

                        <!-- Aqui fica o ÚNICO scroll (lista de usuários) -->
                        <div id="usersBox"
                          class="rounded-xl border border-border bg-white/50 p-3 flex-1 overflow-auto no-scrollbar space-y-2 min-h-0">
                          <p id="usersLoading" class="form-subtitle-sm">Carregando usuários...</p>
                        </div>
                      </div>

                      <!-- Botões -->
                      <div class="pt-2 flex flex-col sm:flex-row gap-3 shrink-0">
                        <button id="btnSalvarAgendamentoSala" type="submit"
                          class="sm:flex-1 rounded-xl bg-primary text-white form-control-sm font-medium hover:opacity-90 transition-all">
                          Salvar
                        </button>

                        <button id="btnCancelarAgendamentoSala" type="button"
                          class="sm:flex-1 rounded-xl border border-border bg-white/50 form-control-sm font-medium hover:bg-white/70 transition-all">
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
      usersBox.innerHTML = `<p class="form-subtitle-sm">Nenhum usuário encontrado.</p>`;
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
                <h3 id="conflitoTitle" class="form-title-sm font-semibold text-foreground">Conflito de agendamento</h3>
                <p class="form-subtitle-sm">Já existe um agendamento nesse intervalo</p>
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
                  class="w-full rounded-xl bg-primary text-white form-control-sm font-medium hover:opacity-90 transition-all">
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

        if (page === 'home') {
          window.location.reload();
          return;
        }

        DefinirPaginaAtiva(page, this);

        if (page === 'secao-clientes') carregarClientes();
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
      AbrirModalReservaCarro();
    });

    document.getElementById('AgendarSalaReuniao')?.addEventListener('click', async () => {
      try {
        const usuarioLogado = sessionStorage.getItem('id') || '';
        const usuarioId = usuarioLogado;

        if (!usuarioId) {
          alert('Usuário logado não identificado.');
          return;
        }

        const url = `${API_BASE}/api/permissoes/agendar-sala/${usuarioId}`;

        const resp = await fetch(url);

        const data = await resp.json();

        if (!resp.ok || !data.success) {
          alert(data?.message || 'Erro ao validar permissão.');
          return;
        }

        if (Number(data?.item?.agendar_sala_reuniao) !== 1) {
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

    document.addEventListener('click', function (e) {
      const toggle = e.target.closest('.menu-group-toggle');
      if (toggle) {
        const grupo = toggle.closest('.menu-group');
        const estavaAberto = grupo?.classList.contains('open');

        document.querySelectorAll('.menu-group').forEach(g => {
          g.classList.remove('open');
          g.querySelector('.menu-group-toggle')?.classList.remove('active');
        });

        if (!estavaAberto && grupo) {
          grupo.classList.add('open');
          toggle.classList.add('active');
        }
        return;
      }

      const item = e.target.closest('.menu-item[data-page]');
      if (!item) return;

      const page = item.dataset.page;
      if (page === 'home') {
        window.location.reload();
        return;
      }

      DefinirPaginaAtiva(page, item);

      const grupo = item.closest('.menu-group');
      if (grupo) {
        grupo.classList.add('open');
        grupo.querySelector('.menu-group-toggle')?.classList.add('active');
      }

      if (page === 'secao-clientes') carregarClientes();
      if (page === 'secao-perfis') carregarPerfis?.().catch(console.error);

      carregarClimaHome();
      iniciarLoopMarketingPainel({
        imgId: 'painelMarketingImg',
        fallbackSrc: 'imagens/PaginaPrincipal.jpg',
        intervalMs: 20000,
        refreshListEveryMs: 60000,
      });
    });

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
    left.addEventListener('click', () => abrirDetalhesAgendamento(item));

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

let cacheUsuariosGestao = [];
let termoFiltroGestaoUsuarios = '';
let colunaOrdenacaoGestaoUsuarios = 'nome';
let direcaoOrdenacaoGestaoUsuarios = 'asc';

function obterValorOrdenacaoUsuario(u, coluna) {
  switch (coluna) {
    case 'nome':
      return u.NOME ?? u.nome ?? '';
    case 'setor':
      return u.SETOR ?? u.setor ?? '';
    case 'perfil':
      return u.PERFIL ?? u.perfil ?? '';
    case 'centroCusto':
      return u.LOCAL_TRABALHO ?? u.local_trabalho ?? u.LOCALTRABALHO ?? u.localtrabalho ?? '';
    case 'unidadeTrabalho':
      return u.UNIDADETRABALHO ?? u.unidadetrabalho ?? u.UNIDADE_TRABALHO ?? u.unidade_trabalho ?? '';
    case 'status':
      return u.STATUS ?? u.status ?? '';
    default:
      return '';
  }
}

function compararValoresOrdenacao(a, b) {
  const va = normalizarTextoFiltro(a);
  const vb = normalizarTextoFiltro(b);
  return va.localeCompare(vb, 'pt-BR', { numeric: true, sensitivity: 'base' });
}

function ordenarUsuariosGestao(lista) {
  const itens = Array.isArray(lista) ? [...lista] : [];

  itens.sort((a, b) => {
    const valorA = obterValorOrdenacaoUsuario(a, colunaOrdenacaoGestaoUsuarios);
    const valorB = obterValorOrdenacaoUsuario(b, colunaOrdenacaoGestaoUsuarios);

    const comparacao = compararValoresOrdenacao(valorA, valorB);
    return direcaoOrdenacaoGestaoUsuarios === 'asc' ? comparacao : -comparacao;
  });

  return itens;
}

function alternarOrdenacaoGestao(coluna) {
  if (colunaOrdenacaoGestaoUsuarios === coluna) {
    direcaoOrdenacaoGestaoUsuarios = direcaoOrdenacaoGestaoUsuarios === 'asc' ? 'desc' : 'asc';
  } else {
    colunaOrdenacaoGestaoUsuarios = coluna;
    direcaoOrdenacaoGestaoUsuarios = 'asc';
  }

  atualizarCabecalhoOrdenacaoGestao();
  renderizarTabelaGestaoUsuarios();
}

function obterIconeOrdenacaoGestao(coluna) {
  if (colunaOrdenacaoGestaoUsuarios !== coluna) {
    return '<i class="fas fa-sort text-xs opacity-50" aria-hidden="true"></i>';
  }

  return direcaoOrdenacaoGestaoUsuarios === 'asc'
    ? '<i class="fas fa-sort-up text-xs" aria-hidden="true"></i>'
    : '<i class="fas fa-sort-down text-xs" aria-hidden="true"></i>';
}

function atualizarCabecalhoOrdenacaoGestao() {
  document.querySelectorAll('[data-sort-gestao]').forEach((el) => {
    const coluna = el.getAttribute('data-sort-gestao');
    const icone = el.querySelector('[data-sort-icon]');
    const ativo = coluna === colunaOrdenacaoGestaoUsuarios;

    el.classList.toggle('text-foreground', ativo);
    el.classList.toggle('text-muted-foreground', !ativo);

    if (icone) {
      icone.innerHTML = obterIconeOrdenacaoGestao(coluna);
    }

    el.setAttribute(
      'aria-sort',
      ativo ? (direcaoOrdenacaoGestaoUsuarios === 'asc' ? 'ascending' : 'descending') : 'none'
    );
  });
}

function normalizarTextoFiltro(valor) {
  return String(valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function obterTextoFiltroUsuario(u) {
  const nome = u.NOME ?? u.nome ?? '';
  const email = u.EMAIL ?? u.email ?? '';
  const setor = u.SETOR ?? u.setor ?? '';
  const perfil = u.PERFIL ?? u.perfil ?? '';
  const localTrabalho = u.LOCAL_TRABALHO ?? u.local_trabalho ?? u.LOCALTRABALHO ?? u.localtrabalho ?? '';
  const unidadeTrabalho = u.UNIDADETRABALHO ?? u.unidadetrabalho ?? u.UNIDADE_TRABALHO ?? u.unidade_trabalho ?? '';
  const status = u.STATUS ?? u.status ?? '';

  return normalizarTextoFiltro([
    nome,
    email,
    setor,
    perfil,
    localTrabalho,
    unidadeTrabalho,
    status
  ].join(' '));
}

function filtrarUsuariosGestao(lista, termo) {
  const termoNormalizado = normalizarTextoFiltro(termo);
  if (!termoNormalizado) return Array.isArray(lista) ? lista : [];

  return (Array.isArray(lista) ? lista : []).filter((u) =>
    obterTextoFiltroUsuario(u).includes(termoNormalizado)
  );
}

function atualizarResumoFiltroGestao(total, filtrados) {
  const el = document.getElementById('gestaoUsuariosFiltroResumo');
  if (!el) return;

  if (!total) {
    el.textContent = 'Nenhum usuário cadastrado.';
    return;
  }

  if (!termoFiltroGestaoUsuarios) {
    el.textContent = `${total} usuário(s) encontrado(s).`;
    return;
  }

  el.textContent = `${filtrados} de ${total} usuário(s) exibido(s).`;
}

function renderizarTabelaGestaoUsuarios() {
  const tbody = document.getElementById('tbodyGestaoUsuarios');
  if (!tbody) return;

  const usuariosFiltrados = ordenarUsuariosGestao(
    filtrarUsuariosGestao(cacheUsuariosGestao, termoFiltroGestaoUsuarios)
  );

  atualizarResumoFiltroGestao(cacheUsuariosGestao.length, usuariosFiltrados.length);

  if (!cacheUsuariosGestao.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-6 form-subtitle-sm">Nenhum usuário cadastrado.</td></tr>`;
    return;
  }

  if (!usuariosFiltrados.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-6 form-subtitle-sm">Nenhum usuário encontrado para o filtro informado.</td></tr>`;
    return;
  }

  tbody.innerHTML = usuariosFiltrados.map(rowUsuario).join('');
}

function configurarFiltroGestaoUsuarios() {
  const input = document.getElementById('inputFiltroGestaoUsuarios');
  const btnLimpar = document.getElementById('btnLimparFiltroGestaoUsuarios');

  if (!input) return;
  if (input.dataset.bound === 'true') return;

  input.dataset.bound = 'true';

  input.addEventListener('input', (e) => {
    termoFiltroGestaoUsuarios = e.target.value || '';
    if (btnLimpar) {
      btnLimpar.classList.toggle('hidden', !termoFiltroGestaoUsuarios.trim());
    }
    renderizarTabelaGestaoUsuarios();
  });

  btnLimpar?.addEventListener('click', () => {
    input.value = '';
    termoFiltroGestaoUsuarios = '';
    btnLimpar.classList.add('hidden');
    input.focus();
    renderizarTabelaGestaoUsuarios();
  });
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
  const unidadeTrabalho = u.UNIDADETRABALHO ?? u.unidadetrabalho ?? u.UNIDADE_TRABALHO ?? u.unidade_trabalho ?? '';
  const status = u.STATUS ?? u.status ?? '';
  const id = u.ID ?? u.id ?? '';

  return `
    <tr>
      <td class="form-control-sm">
        <div class="flex items-center gap-3">
          ${avatarUsuarioHtml(u)}
          <div class="min-w-0">
            <div class="font-medium truncate">${escapeHtml(nome)}</div>
            <div class="text-xs text-muted-foreground truncate">${escapeHtml(emailCorporativo)}</div>
          </div>
        </div>
      </td>
      <td class="form-control-sm">${escapeHtml(setor || '—')}</td>
      <td class="form-control-sm">${escapeHtml(perfil || '—')}</td>
      <td class="form-control-sm">${escapeHtml(localTrabalho || '—')}</td>
      <td class="form-control-sm">${escapeHtml(unidadeTrabalho || '—')}</td>
      <td class="form-control-sm">${statusBadge(status)}</td>
      <td class="form-control-sm">
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
let cacheFuncoesGestao = [];
let cacheLocaisTrabalhoGestaoUnidade = [];


async function carregarGestaoUsuarios() {
  try {
    setGestaoUsuariosErro('');
    showPage('user-management');

    const tbody = document.getElementById('tbodyGestaoUsuarios');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-6 form-subtitle-sm">Carregando usuários...</td></tr>`;
    }

    configurarFiltroGestaoUsuarios();

    const [
      usuariosResp,
      perfisResp,
      setoresResp,
      locaisResp,
      funcoesResp,
      unidadesResp
    ] = await Promise.all([
      apiGet('/api/gestao-usuarios'),
      apiGet('/api/gestao-usuarios-perfis'),
      apiGet('/api/gestao-usuarios-setores'),
      apiGet('/api/gestao-usuarios-centro-custo'),
      apiGet('/api/gestao-usuarios-funcoes'),
      apiGet('/api/gestao-usuarios-locais-trabalho')
    ]);

    const usuarios = Array.isArray(usuariosResp?.items) ? usuariosResp.items : [];
    const perfis = Array.isArray(perfisResp?.items) ? perfisResp.items : [];
    const setores = Array.isArray(setoresResp?.items) ? setoresResp.items : [];
    const locais = Array.isArray(locaisResp?.items) ? locaisResp.items : [];
    const funcoes = Array.isArray(funcoesResp?.items) ? funcoesResp.items : [];
    const unidades = Array.isArray(unidadesResp?.items) ? unidadesResp.items : [];

    cacheUsuariosGestao = usuarios;
    cachePerfisGestao = perfis;
    cacheSetoresGestao = setores;
    cacheLocaisTrabalhoGestao = locais;
    cacheFuncoesGestao = funcoes;
    cacheLocaisTrabalhoGestaoUnidade = unidades;

    renderizarTabelaGestaoUsuarios();
    atualizarCabecalhoOrdenacaoGestao();
  } catch (err) {
    setGestaoUsuariosErro(err?.message || 'Erro ao carregar usuários.');

    const tbody = document.getElementById('tbodyGestaoUsuarios');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-6 text-sm text-destructive">Falha ao carregar usuários.</td></tr>`;
    }

    atualizarResumoFiltroGestao(0, 0);
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
  const abaAdic = document.getElementById('guAbaDadosAdicionais');

  const painelCorp = document.getElementById('guPainelCorporativo');
  const painelPess = document.getElementById('guPainelPessoal');
  const painelAdic = document.getElementById('guPainelDadosAdicionais');

  if (!painelCorp || !painelPess || !painelAdic) {
    console.error('Abas de gestão não encontradas.');
    return;
  }

  const ativa = String(nome || 'corporativo').trim().toLowerCase();

  const estiloAtivo = 'px-4 py-2 rounded-xl form-label-sm border border-border bg-white text-foreground shadow-sm transition-all';
  const estiloInativo = 'px-4 py-2 rounded-xl form-label-sm border border-border bg-white/40 text-muted-foreground hover:bg-white/70 transition-all';

  if (abaCorp) {
    abaCorp.setAttribute('aria-selected', ativa === 'corporativo' ? 'true' : 'false');
    abaCorp.className = ativa === 'corporativo' ? estiloAtivo : estiloInativo;
  }

  if (abaPess) {
    abaPess.setAttribute('aria-selected', ativa === 'pessoal' ? 'true' : 'false');
    abaPess.className = ativa === 'pessoal' ? estiloAtivo : estiloInativo;
  }

  if (abaAdic) {
    abaAdic.setAttribute('aria-selected', ativa === 'dados-adicionais' ? 'true' : 'false');
    abaAdic.className = ativa === 'dados-adicionais' ? estiloAtivo : estiloInativo;
  }

  painelCorp.hidden = ativa !== 'corporativo';
  painelPess.hidden = ativa !== 'pessoal';
  painelAdic.hidden = ativa !== 'dados-adicionais';

  painelCorp.classList.toggle('hidden', ativa !== 'corporativo');
  painelPess.classList.toggle('hidden', ativa !== 'pessoal');
  painelAdic.classList.toggle('hidden', ativa !== 'dados-adicionais');
}


// gerar crachar

let LOGO_FRANCIOSI_URL = 'imagens/Logo Sementes.png';
let LOGO_SF_URL = 'imagens/Logo Sociedade.png';

const ICONE_TELEFONE = '<i class="fas fa-phone-alt"></i>';
const ICONE_EMAIL = '<i class="fas fa-envelope"></i>';
const ICONE_LOCAL = '<i class="fas fa-map-marker-alt"></i>';

async function abrirModalAssinatura(usuario = {}) {
  const u = usuario || {};

  const fotoAtualRel = u.FOTO ?? u.foto ?? '';
  let fotoAtualAbs = '';

  try {
    fotoAtualAbs = fotoAtualRel ? absUrlFromApiGestaoUsuarios(fotoAtualRel) : '';
  } catch (err) {
    console.error('Erro ao resolver foto da assinatura:', err);
    fotoAtualAbs = '';
  }

  const nome = String(u.NOME ?? u.nome ?? '').trim();
  const funcao = String(u.FUNCAO ?? u.funcao ?? '').trim();
  const setor = String(u.SETOR ?? u.setor ?? '').trim();
  const email = String(u.EMAIL ?? u.email ?? '').trim();
  const telefone = String(u.TELEFONE ?? u.telefone ?? '').trim();

  const unidadeTrabalhoValor = String(
    u.UNIDADETRABALHO ??
    u.unidadetrabalho ??
    ''
  ).trim();

  let enderecoLocal = '';
  let nomeLocal = unidadeTrabalhoValor;
  let telefoneLocal = '';

  try {
    const listaUnidades = Array.isArray(cacheLocaisTrabalhoGestaoUnidade)
      ? cacheLocaisTrabalhoGestaoUnidade
      : [];

    const unidadeEncontrada = listaUnidades.find((item) => {
      const idItem = String(item.ID ?? item.id ?? '').trim();
      const codigoItem = String(item.CODIGO ?? item.codigo ?? '').trim();
      const nomeItem = String(item.NOME ?? item.nome ?? '').trim();

      return (
        idItem === unidadeTrabalhoValor ||
        codigoItem === unidadeTrabalhoValor ||
        nomeItem.toLowerCase() === unidadeTrabalhoValor.toLowerCase()
      );
    });

    if (unidadeEncontrada) {
      nomeLocal = String(
        unidadeEncontrada.NOME ??
        unidadeEncontrada.nome ??
        unidadeTrabalhoValor
      ).trim();

      enderecoLocal = String(
        unidadeEncontrada.ENDERECO ??
        unidadeEncontrada.endereco ??
        ''
      ).trim();

      telefoneLocal = String(
        unidadeEncontrada.TELEFONE ??
        unidadeEncontrada.telefone ??
        ''
      ).trim();
    }
  } catch (err) {
    console.error('Erro ao localizar unidade/endereço/telefone em cacheLocaisTrabalhoGestaoUnidade:', err);
  }

  const overlayExistente = document.getElementById('assinaturaEmailOverlay');
  const modalExistente = document.getElementById('assinaturaEmailModal');
  if (overlayExistente) overlayExistente.remove();
  if (modalExistente) modalExistente.remove();

  const overlay = document.createElement('div');
  overlay.id = 'assinaturaEmailOverlay';
  overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[120]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'assinaturaEmailModal';
  modal.className = 'fixed inset-0 z-[130] flex items-center justify-center p-4';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  function escaparHtml(valor) {
    return String(valor ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatarTelefoneAssinatura(valor) {
    const numeros = String(valor ?? '').replace(/\D/g, '');
    if (!numeros) return '';
    if (typeof formatarCelularBR === 'function') return formatarCelularBR(numeros);
    return valor;
  }

  function somenteNumeros(valor) {
    return String(valor ?? '').replace(/\D/g, '');
  }

  function gerarLinkMaps(local, endereco) {
    const texto = [local, endereco].filter(Boolean).join(', ');
    if (!texto) return '';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(texto)}`;
  }

  function perguntarPercentualReducao() {
    const resposta = window.prompt(
      'Quantos % menor você quer a imagem PNG?\n\nExemplo: 50 para reduzir 50%\n0 = tamanho original',
      '50'
    );

    if (resposta === null) return null;

    const percentual = Number(String(resposta).replace(',', '.').trim());

    if (!Number.isFinite(percentual) || percentual < 0 || percentual >= 100) {
      alert('Informe um percentual válido entre 0 e 99.');
      return null;
    }

    return percentual;
  }

  async function imageUrlToDataUrl(url) {
    const resp = await fetch(url, { mode: 'cors' });
    if (!resp.ok) throw new Error(`Falha ao carregar imagem: ${resp.status}`);
    const blob = await resp.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function esperarImagens(container) {
    const imagens = Array.from(container.querySelectorAll('img'));
    await Promise.all(
      imagens.map((img) => new Promise((resolve) => {
        if (img.complete && img.naturalWidth > 0) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }))
    );
  }

  const LARGURA_ASSINATURA = 750;
  const SCALE_EXPORT = Math.max(2, Math.min(4, window.devicePixelRatio || 2));

  let logoSfRender = typeof LOGO_SF_URL !== 'undefined' ? LOGO_SF_URL : '';
  let logoFranciosiRender = typeof LOGO_FRANCIOSI_URL !== 'undefined' ? LOGO_FRANCIOSI_URL : '';

  try {
    if (logoSfRender) logoSfRender = await imageUrlToDataUrl(logoSfRender);
  } catch (err) {
  }

  try {
    if (logoFranciosiRender) logoFranciosiRender = await imageUrlToDataUrl(logoFranciosiRender);
  } catch (err) {
  }

  function gerarHtmlAssinatura(opcoes = {}) {
    const { modo = 'preview' } = opcoes;
    const isPng = modo === 'png';

    const nomeEsc = escaparHtml(nome || 'Nome do usuário');
    const funcaoEsc = escaparHtml(funcao);
    const emailEsc = escaparHtml(email);

    const telefoneFmt = escaparHtml(formatarTelefoneAssinatura(telefone));
    const telefoneNum = somenteNumeros(telefone);

    const telefoneLocalFmt = escaparHtml(formatarTelefoneAssinatura(telefoneLocal));
    const telefoneLocalNum = somenteNumeros(telefoneLocal);

    const enderecoEsc = escaparHtml(enderecoLocal);
    const nomeLocalEsc = escaparHtml(nomeLocal);
    const mapsUrl = gerarLinkMaps(nomeLocal, enderecoLocal);

    const siteEmpresa = 'franciosisementes.com.br';
    const siteEmpresaEsc = escaparHtml(siteEmpresa);

    const linhaTelefonesHref = `
      ${telefoneLocalFmt ? `<a href="tel:${escaparHtml(telefoneLocalNum)}" style="color:#25348D; text-decoration:none; font-weight:700;">${telefoneLocalFmt}</a>` : ''}
      ${telefoneLocalFmt && telefoneFmt ? `<span style="color:#25348D; font-weight:700;"> | </span>` : ''}
      ${telefoneFmt ? `<a href="tel:${escaparHtml(telefoneNum)}" style="color:#25348D; text-decoration:none;">${telefoneFmt}</a>` : ''}
    `;

    const paddingCargoBottom = isPng ? '0 0 6px 0' : '0 0 2px 0';
    const marginBlocoFuncao = isPng ? '0 0 12px 0' : '0 0 10px 0';
    const lineHeightCargo = isPng ? '1.10' : '1.15';
    const unidadeMarginTop = isPng ? '6px' : '0';

    const unidadeLineHeight = isPng ? '1' : '1.15';

    // CONTROLE DO TEXTO DENTRO DO QUADRO AZUL NO PNG:
    // para subir o texto -> diminua o padding-top e/ou aumente o padding-bottom
    // para descer o texto -> aumente o padding-top e/ou diminua o padding-bottom
    const unidadePadding = isPng ? '0px 10px 13px 10px' : '4px 10px';

    const unidadeVerticalAlign = isPng ? 'middle' : 'baseline';

    const blocoFuncaoEUnidade = (funcaoEsc || nomeLocalEsc) ? `
      <table cellpadding="0" cellspacing="0" border="0" style="margin:${marginBlocoFuncao}; border-collapse:collapse; border-spacing:0;">
        ${funcaoEsc ? `
          <tr>
            <td style="padding:${paddingCargoBottom};">
              <div
                style="
                  font-size:14px;
                  line-height:${lineHeightCargo};
                  font-weight:600;
                  color:#9AC43C;
                  margin:0;
                  display:block;
                "
              >
                ${funcaoEsc}
              </div>
            </td>
          </tr>
        ` : ''}
        ${nomeLocalEsc ? `
          <tr>
            <td style="padding:0;">
              ${mapsUrl ? `
                <a
                  href="${escaparHtml(mapsUrl)}"
                  target="_blank"
                  style="
                    display:inline-block;
                    background:#25348D;
                    color:#ffffff;
                    font-size:14px;
                    line-height:${unidadeLineHeight};
                    font-weight:600;
                    margin:${unidadeMarginTop} 0 0 0;
                    padding:${unidadePadding};
                    border-radius:999px;
                    text-decoration:none;
                    white-space:nowrap;
                    vertical-align:${unidadeVerticalAlign};
                  "
                >
                  ${nomeLocalEsc}
                </a>
              ` : `
                <span
                  style="
                    display:inline-block;
                    background:#25348D;
                    color:#ffffff;
                    font-size:14px;
                    line-height:${unidadeLineHeight};
                    font-weight:600;
                    margin:${unidadeMarginTop} 0 0 0;
                    padding:${unidadePadding};
                    border-radius:999px;
                    text-decoration:none;
                    white-space:nowrap;
                    vertical-align:${unidadeVerticalAlign};
                  "
                >
                  ${nomeLocalEsc}
                </span>
              `}
            </td>
          </tr>
        ` : ''}
      </table>
    ` : '';

    return `
<table cellpadding="0" cellspacing="0" border="0"
  style="
    width:${LARGURA_ASSINATURA}px;
    max-width:${LARGURA_ASSINATURA}px;
    font-family:'Barlow', Arial, sans-serif;
    border-collapse:collapse;
    border-spacing:0;
    background:#ffffff;
  ">
  <tr>
    <td style="padding:18px 20px; background:#ffffff;">
      <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse:collapse; border-spacing:0;">
        <tr>
          <td width="210" style="width:210px; vertical-align:middle; padding-right:16px;">
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse:collapse; border-spacing:0;">
              <tr>
                <td style="padding:0 0 18px 0; text-align:center;">
                  <img
                    src="${escaparHtml(logoSfRender || LOGO_SF_URL)}"
                    crossorigin="anonymous"
                    alt="Sociedade Franciosi"
                    style="max-width:190px; width:100%; height:auto; display:block; margin:0 auto;"
                  />
                </td>
              </tr>
              <tr>
                <td style="text-align:center;">
                  <img
                    src="${escaparHtml(logoFranciosiRender || LOGO_FRANCIOSI_URL)}"
                    crossorigin="anonymous"
                    alt="Franciosi Sementes"
                    style="max-width:165px; width:100%; height:auto; display:block; margin:0 auto;"
                  />
                </td>
              </tr>
            </table>
          </td>

          <td width="12" style="width:12px; vertical-align:top; padding-right:14px;">
            <div
              style="
                width:4px;
                height:210px;
                margin:0 auto;
                border-radius:999px;
                background:#79A81E;
                background:linear-gradient(to bottom, #79A81E 0%, #25348D 100%);
              "
            ></div>
          </td>

          <td style="vertical-align:top;">
            <div
              style="
                font-size:20px;
                line-height:1.08;
                font-family:'Barlow', Arial, sans-serif;
                font-weight:700;
                color:#25348D;
                margin:0 0 2px 0;
              "
            >
              ${nomeEsc}
            </div>

            ${blocoFuncaoEUnidade}

            ${linhaTelefonesHref.trim() ? `
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 6px 0; border-collapse:collapse; border-spacing:0;">
                <tr>
                  <td style="padding:0 8px 0 0; vertical-align:top; color:#25348D; font-size:16px; line-height:1;">
                    ${ICONE_TELEFONE}
                  </td>
                  <td style="padding:0; font-size:13px; line-height:1.35; color:#25348D;">
                    ${linhaTelefonesHref}
                  </td>
                </tr>
              </table>
            ` : ''}

            ${emailEsc ? `
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 6px 0; border-collapse:collapse; border-spacing:0;">
                <tr>
                  <td style="padding:0 8px 0 0; vertical-align:top; color:#25348D; font-size:15px; line-height:1;">
                    ${ICONE_EMAIL}
                  </td>
                  <td style="padding:0; font-size:13px; line-height:1.35;">
                    <a href="mailto:${emailEsc}" style="color:#25348D; text-decoration:none;">
                      ${emailEsc}
                    </a>
                  </td>
                </tr>
              </table>
            ` : ''}

            ${(enderecoEsc || nomeLocalEsc) ? `
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 6px 0; border-collapse:collapse; border-spacing:0;">
                <tr>
                  <td style="padding:0 8px 0 0; vertical-align:top; color:#25348D; font-size:16px; line-height:1;">
                    ${ICONE_LOCAL}
                  </td>
                  <td style="padding:0; font-size:13px; line-height:1.4; color:#25348D;">
                    ${mapsUrl ? `<a href="${escaparHtml(mapsUrl)}" target="_blank" style="color:#25348D; text-decoration:none;">` : ''}
                      ${enderecoEsc || nomeLocalEsc}
                    ${mapsUrl ? `</a>` : ''}
                  </td>
                </tr>
              </table>
            ` : ''}

            <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; border-spacing:0;">
              <tr>
                <td style="padding:0 8px 0 0; vertical-align:top; color:#25348D; font-size:16px; line-height:1;">
                  <i class="fas fa-globe"></i>
                </td>
                <td style="padding:0; font-size:13px; line-height:1.35;">
                  <a href="https://${siteEmpresaEsc}" target="_blank" style="color:#25348D; text-decoration:none;">
                    ${siteEmpresaEsc}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `.trim();
  }

  function gerarDocumentoHtmlAssinatura() {
    const assinatura = gerarHtmlAssinatura({ modo: 'preview' });
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Assinatura</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    html, body, table, td, div, span, a, p {
      font-family: 'Barlow', Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: geometricPrecision;
    }
    body {
      margin: 0;
      padding: 20px;
      background: #ffffff;
    }
  </style>
</head>
<body>
  ${assinatura}
</body>
</html>
    `.trim();
  }

  function atualizarPreview() {
    const preview = modal.querySelector('#assinaturaPreview');
    if (!preview) return;
    preview.innerHTML = gerarHtmlAssinatura({ modo: 'preview' });
  }

  function fecharModalAssinatura() {
    overlay.remove();
    modal.remove();
  }

  modal.innerHTML = `
    <div class="w-full max-w-5xl glass rounded-2xl shadow-2xl border border-border overflow-hidden">
      <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
        <div>
          <h3 class="form-title-sm font-semibold text-foreground">Gerar assinatura de e-mail</h3>
          <p class="form-subtitle-sm">Baixe a assinatura em HTML ou PNG.</p>
        </div>

        <button id="btnFecharAssinaturaEmail" type="button"
          class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
          aria-label="Fechar" title="Fechar">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>

      <div class="px-6 py-5 border-b border-border space-y-3">
        <label class="form-label-sm block">Pré-visualização</label>

        <div class="rounded-2xl border border-border bg-[#f7f7f7] p-5 overflow-auto flex justify-center">
          <div
            id="assinaturaCaptureWrap"
            style="
              width:${LARGURA_ASSINATURA}px;
              min-width:${LARGURA_ASSINATURA}px;
              max-width:${LARGURA_ASSINATURA}px;
              overflow:hidden;
              display:inline-block;
              background:#ffffff;
            "
          >
            <div id="assinaturaPreview"></div>
          </div>
        </div>
      </div>

      <div class="px-6 py-5 flex flex-col sm:flex-row gap-3">
        <button id="btnBaixarHtmlAssinatura" type="button"
          class="sm:flex-1 rounded-xl bg-primary text-white form-control-sm font-medium hover:opacity-90 transition-all">
          Baixar .htm
        </button>

        <button id="btnBaixarPngAssinatura" type="button"
          class="sm:flex-1 rounded-xl border border-border bg-white/70 form-control-sm font-medium hover:bg-white transition-all">
          Baixar PNG
        </button>

        <button id="btnFecharAssinaturaEmailRodape" type="button"
          class="sm:flex-1 rounded-xl border border-border bg-white/50 form-control-sm font-medium hover:bg-white/70 transition-all">
          Fechar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  function renderizarTudo() {
    atualizarPreview();
  }

  overlay.addEventListener('click', fecharModalAssinatura);
  modal.querySelector('#btnFecharAssinaturaEmail')?.addEventListener('click', fecharModalAssinatura);
  modal.querySelector('#btnFecharAssinaturaEmailRodape')?.addEventListener('click', fecharModalAssinatura);

  modal.querySelector('#btnBaixarHtmlAssinatura')?.addEventListener('click', () => {
    try {
      const html = gerarDocumentoHtmlAssinatura();
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `assinatura-${(nome || 'usuario').toLowerCase().replace(/\s+/g, '-')}.htm`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar HTML da assinatura:', err);
      alert('Não foi possível baixar o arquivo .htm');
    }
  });

  modal.querySelector('#btnBaixarPngAssinatura')?.addEventListener('click', async () => {
    let tempWrap = null;

    try {
      if (typeof html2canvas !== 'function') {
        alert('Para baixar PNG, carregue a biblioteca html2canvas no projeto.');
        return;
      }

      const percentualReducao = perguntarPercentualReducao();
      if (percentualReducao === null) return;

      const fatorReducao = Math.max(0.01, (100 - percentualReducao) / 100);

      tempWrap = document.createElement('div');
      tempWrap.style.position = 'fixed';
      tempWrap.style.left = '-100000px';
      tempWrap.style.top = '0';
      tempWrap.style.width = `${LARGURA_ASSINATURA}px`;
      tempWrap.style.minWidth = `${LARGURA_ASSINATURA}px`;
      tempWrap.style.maxWidth = `${LARGURA_ASSINATURA}px`;
      tempWrap.style.background = '#ffffff';
      tempWrap.style.padding = '0';
      tempWrap.style.margin = '0';
      tempWrap.style.boxSizing = 'border-box';
      tempWrap.style.zIndex = '-1';
      tempWrap.innerHTML = gerarHtmlAssinatura({ modo: 'png' });

      document.body.appendChild(tempWrap);

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await esperarImagens(tempWrap);

      const canvas = await html2canvas(tempWrap, {
        backgroundColor: '#ffffff',
        scale: SCALE_EXPORT,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: LARGURA_ASSINATURA,
        windowWidth: LARGURA_ASSINATURA
      });

      const canvasReduzido = document.createElement('canvas');
      canvasReduzido.width = Math.max(1, Math.round(canvas.width * fatorReducao));
      canvasReduzido.height = Math.max(1, Math.round(canvas.height * fatorReducao));

      const ctx = canvasReduzido.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(
        canvas,
        0, 0, canvas.width, canvas.height,
        0, 0, canvasReduzido.width, canvasReduzido.height
      );

      canvasReduzido.toBlob((blob) => {
        if (!blob) {
          alert('Não foi possível gerar o PNG.');
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `assinatura-${(nome || 'usuario').toLowerCase().replace(/\s+/g, '-')}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error('Erro ao gerar PNG da assinatura:', err);
      alert('Não foi possível gerar o PNG da assinatura.');
    } finally {
      if (tempWrap) tempWrap.remove();
    }
  });

  renderizarTudo();
}

async function abrirModalCrachaRetrato(usuario = {}) {
  const u = usuario || {};

  const nomeCompleto = String(u.NOME ?? u.nome ?? '').trim();
  const setor = String(u.SETOR ?? u.setor ?? '').trim();
  const unidadeTrabalhoValor = String(
    u.UNIDADETRABALHO ?? u.unidadetrabalho ?? u.LOCALTRABALHO ?? u.localtrabalho ?? ''
  ).trim();

  const partesNome = nomeCompleto.split(/\s+/).filter(Boolean);
  const nomeCracha = (() => {
    if (!partesNome.length) return '';
    if (partesNome.length === 1) return partesNome[0];
    return `${partesNome[0]} ${partesNome[partesNome.length - 1]}`;
  })();

  let unidadeTrabalho = unidadeTrabalhoValor;

  try {
    const listaUnidades = Array.isArray(cacheLocaisTrabalhoGestaoUnidade)
      ? cacheLocaisTrabalhoGestaoUnidade
      : [];

    const unidadeEncontrada = listaUnidades.find((item) => {
      const idItem = String(item?.ID ?? item?.id ?? '').trim();
      const codigoItem = String(item?.CODIGO ?? item?.codigo ?? '').trim();
      const nomeItem = String(item?.NOME ?? item?.nome ?? '').trim().toLowerCase();

      return (
        (unidadeTrabalhoValor && idItem === unidadeTrabalhoValor) ||
        (unidadeTrabalhoValor && codigoItem === unidadeTrabalhoValor) ||
        (unidadeTrabalhoValor && nomeItem === unidadeTrabalhoValor.toLowerCase())
      );
    });

    if (unidadeEncontrada) {
      unidadeTrabalho = String(
        unidadeEncontrada.NOME ?? unidadeEncontrada.nome ?? unidadeTrabalhoValor
      ).trim();
    }
  } catch (err) {
    console.error('Erro ao resolver unidade de trabalho do crachá:', err);
  }

  unidadeTrabalho = String(unidadeTrabalho || '')
    .replace(/\bFAZENDA\b/gi, 'FAZ.')
    .trim();

  const fotoAtualRel = u.FOTO ?? u.foto ?? '';
  let fotoAtualAbs = '';

  try {
    fotoAtualAbs = fotoAtualRel ? absUrlFromApiGestaoUsuarios(fotoAtualRel) : '';
  } catch (err) {
    console.error('Erro ao resolver foto do crachá:', err);
    fotoAtualAbs = '';
  }

  function escaparHtml(valor) {
    return String(valor ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function imageUrlToDataUrl(url) {
    if (!url) return '';
    const resp = await fetch(url, { mode: 'cors' });
    if (!resp.ok) throw new Error(`Falha ao carregar imagem: ${resp.status}`);
    const blob = await resp.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  let logoPrincipal = typeof LOGO_FRANCIOSI_URL !== 'undefined'
    ? LOGO_FRANCIOSI_URL
    : (typeof LOGOFRANCIOSIURL !== 'undefined' ? LOGOFRANCIOSIURL : '');

  let logoSecundaria = typeof LOGO_SF_URL !== 'undefined'
    ? LOGO_SF_URL
    : (typeof LOGOSFURL !== 'undefined' ? LOGOSFURL : '');

  let fundoCracha = typeof FUNDO_CRACHA_URL !== 'undefined'
    ? FUNDO_CRACHA_URL
    : (typeof FUNDOCRACHAURL !== 'undefined' ? FUNDOCRACHAURL : 'imagens/fundo-cracha.png');

  try {
    if (logoPrincipal) logoPrincipal = await imageUrlToDataUrl(logoPrincipal);
  } catch (err) {
  }

  try {
    if (logoSecundaria) logoSecundaria = await imageUrlToDataUrl(logoSecundaria);
  } catch (err) {
  }

  try {
    if (fundoCracha) fundoCracha = await imageUrlToDataUrl(fundoCracha);
  } catch (err) {
    fundoCracha = '';
  }

  const iniciais = (() => {
    if (!partesNome.length) return 'US';
    if (partesNome.length === 1) return partesNome[0].slice(0, 2).toUpperCase();
    return `${partesNome[0][0] || ''}${partesNome[partesNome.length - 1][0] || ''}`.toUpperCase();
  })();

  const textoEmergencia = 'Em caso de perda ou emergência, entrar em contato pelo número abaixo:';
  const telefoneEmergencia = '(77) 9910-0660';

  const overlayExistente = document.getElementById('crachaPreviewOverlay');
  const modalExistente = document.getElementById('crachaPreviewModal');
  if (overlayExistente) overlayExistente.remove();
  if (modalExistente) modalExistente.remove();

  const overlay = document.createElement('div');
  overlay.id = 'crachaPreviewOverlay';
  overlay.className = 'fixed inset-0 bg-black/55 backdrop-blur-sm z-[140]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'crachaPreviewModal';
  modal.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  function gerarHtmlCrachaRetrato() {
    return `
      <div class="cracha-sheet">
        <div class="cracha-card cracha-frente">
          <div class="cracha-frente-fundo"></div>

          <div class="cracha-front-logos-wrap">
            <div class="cracha-front-logos">
              ${logoSecundaria ? `<img src="${escaparHtml(logoSecundaria)}" alt="Logo Sociedade Franciosi" class="cracha-logo-top">` : ''}
              ${logoPrincipal ? `<img src="${escaparHtml(logoPrincipal)}" alt="Logo Franciosi" class="cracha-logo-main">` : ''}
            </div>
          </div>

          <div class="cracha-front-panel">
            <div class="cracha-photo-wrap">
              ${
                fotoAtualAbs
                  ? `<img src="${escaparHtml(fotoAtualAbs)}" alt="${escaparHtml(nomeCracha)}" class="cracha-photo">`
                  : `<div class="cracha-photo-placeholder">${escaparHtml(iniciais)}</div>`
              }
            </div>

            <div class="cracha-front-content">
              <div class="cracha-nome">${escaparHtml(nomeCracha || 'Nome do colaborador')}</div>
              <div class="cracha-setor">${escaparHtml(setor || 'Setor')}</div>
              <div class="cracha-unidade">${escaparHtml(unidadeTrabalho || '')}</div>
            </div>
          </div>
        </div>

        <div class="cracha-card cracha-verso">
          <div class="cracha-verso-faixa-topo"></div>

          <div class="cracha-verso-header">
            <div class="cracha-front-logos cracha-front-logos-verso">
              ${logoSecundaria ? `<img src="${escaparHtml(logoSecundaria)}" alt="Logo Sociedade Franciosi" class="cracha-logo-top">` : ''}
              ${logoPrincipal ? `<img src="${escaparHtml(logoPrincipal)}" alt="Logo Franciosi" class="cracha-logo-main">` : ''}
            </div>
          </div>

          <div class="cracha-verso-conteudo">
            <div class="cracha-verso-texto">${escaparHtml(textoEmergencia)}</div>
            <div class="cracha-verso-telefone">${escaparHtml(telefoneEmergencia)}</div>
          </div>

          <div class="cracha-verso-footer"></div>
        </div>
      </div>
    `;
  }

  function gerarDocumentoImpressaoCracha() {
    return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Crachá Retrato - ${escaparHtml(nomeCracha || 'Colaborador')}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      @page {
        size: 54mm 85.6mm;
        margin: 0;
      }

      * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      html, body {
        width: 54mm;
        margin: 0;
        padding: 0;
        background: #fff;
        font-family: 'Barlow', Arial, sans-serif;
      }

      body {
        display: block;
      }

      .print-page {
        width: 54mm;
        height: 85.6mm;
        position: relative;
        overflow: hidden;
        page-break-after: always;
        break-after: page;
      }

      .print-page:last-child {
        page-break-after: auto;
        break-after: auto;
      }

      .cracha-card {
        position: relative;
        width: 54mm;
        height: 85.6mm;
        overflow: hidden;
        background: #ffffff;
      }

      .cracha-frente-fundo {
        position: absolute;
        inset: 0;
        background-color: #ffffff;
        background-image: ${fundoCracha ? `url('${escaparHtml(fundoCracha)}')` : 'none'};
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        z-index: 1;
      }

      .cracha-front-logos-wrap {
        position: absolute;
        left: 4mm;
        right: 4mm;
        bottom: 6mm;
        z-index: 3;
        display: flex;
        justify-content: center;
      }

      .cracha-front-logos {
        min-width: 42mm;
        max-width: 47mm;
        min-height: 10.5mm;
        padding: 1.8mm 2.2mm;
        border-radius: 3.4mm;
        background: #ffffff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 3mm;
      }

      .cracha-logo-top {
        width: 23mm;
        max-width: 23mm;
        max-height: 10mm;
        object-fit: contain;
        display: block;
      }

      .cracha-logo-main {
        width: 21mm;
        max-width: 21mm;
        max-height: 9mm;
        object-fit: contain;
        display: block;
      }

      .cracha-front-panel {
        position: absolute;
        left: 4mm;
        right: 4mm;
        top: 5mm;
        bottom: 25mm;
        z-index: 3;
        background: #ffffff;
        border-radius: 4mm;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 4.4mm 3mm 3.2mm 3mm;
      }

      .cracha-photo-wrap {
        width: 34mm;
        height: 34mm;
        border-radius: 50%;
        overflow: hidden;
        padding: 1.2mm;
        background: #ffffff;
        margin-bottom: 3.2mm;
        flex: 0 0 auto;
      }

      .cracha-photo,
      .cracha-photo-placeholder {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        display: block;
        background: #e8edf8;
      }

      .cracha-photo-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #25348D;
        font-size: 7.6mm;
        font-weight: 800;
      }

      .cracha-front-content {
        width: 100%;
        text-align: center;
      }

      .cracha-nome {
        color: #123b9c;
        font-size: 3.55mm;
        line-height: 1.02;
        font-weight: 900;
        text-transform: uppercase;
        margin-bottom: 1.2mm;
        word-break: break-word;
      }

      .cracha-setor {
        color: #79A81E;
        font-size: 2.75mm;
        line-height: 1.02;
        font-weight: 900;
        text-transform: uppercase;
        word-break: break-word;
        margin-bottom: 0.8mm;
        text-align: center;
      }

      .cracha-unidade {
        color: #25348D;
        font-size: 2.05mm;
        line-height: 1.08;
        font-weight: 700;
        text-transform: uppercase;
        word-break: break-word;
        text-align: center;
      }

      .cracha-verso-faixa-topo {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 22mm;
        background-color: #ffffff;
        background-image: ${fundoCracha ? `url('${escaparHtml(fundoCracha)}')` : 'none'};
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        z-index: 1;
      }

      .cracha-verso-header {
        position: relative;
        z-index: 2;
        padding: 5mm 3.5mm 2.5mm 3.5mm;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .cracha-verso-conteudo {
        position: absolute;
        top: 29mm;
        left: 4.5mm;
        right: 4.5mm;
        bottom: 11mm;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .cracha-verso-texto {
        color: #123b9c;
        font-size: 2.15mm;
        line-height: 1.22;
        font-weight: 700;
        text-align: center;
      }

      .cracha-verso-telefone {
        margin-top: 2.2mm;
        color: #79A81E;
        font-size: 2.95mm;
        line-height: 1.05;
        font-weight: 900;
        text-align: center;
      }

      .cracha-verso-footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 8mm;
        background-color: #ffffff;
        background-image: ${fundoCracha ? `url('${escaparHtml(fundoCracha)}')` : 'none'};
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        z-index: 2;
      }

      @media print {
        html, body {
          width: 54mm;
          height: auto;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      }
    </style>
  </head>
  <body>
    <section class="print-page">
      <div class="cracha-card cracha-frente">
        <div class="cracha-frente-fundo"></div>

        <div class="cracha-front-logos-wrap">
          <div class="cracha-front-logos">
            ${logoSecundaria ? `<img src="${escaparHtml(logoSecundaria)}" alt="Logo Sociedade Franciosi" class="cracha-logo-top">` : ''}
            ${logoPrincipal ? `<img src="${escaparHtml(logoPrincipal)}" alt="Logo Franciosi" class="cracha-logo-main">` : ''}
          </div>
        </div>

        <div class="cracha-front-panel">
          <div class="cracha-photo-wrap">
            ${
              fotoAtualAbs
                ? `<img src="${escaparHtml(fotoAtualAbs)}" alt="${escaparHtml(nomeCracha)}" class="cracha-photo">`
                : `<div class="cracha-photo-placeholder">${escaparHtml(iniciais)}</div>`
            }
          </div>

          <div class="cracha-front-content">
            <div class="cracha-nome">${escaparHtml(nomeCracha || 'Nome do colaborador')}</div>
            <div class="cracha-setor">${escaparHtml(setor || 'Setor')}</div>
            <div class="cracha-unidade">${escaparHtml(unidadeTrabalho || '')}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="print-page">
      <div class="cracha-card cracha-verso">
        <div class="cracha-verso-faixa-topo"></div>

        <div class="cracha-verso-header">
          <div class="cracha-front-logos cracha-front-logos-verso">
            ${logoSecundaria ? `<img src="${escaparHtml(logoSecundaria)}" alt="Logo Sociedade Franciosi" class="cracha-logo-top">` : ''}
            ${logoPrincipal ? `<img src="${escaparHtml(logoPrincipal)}" alt="Logo Franciosi" class="cracha-logo-main">` : ''}
          </div>
        </div>

        <div class="cracha-verso-conteudo">
          <div class="cracha-verso-texto">${escaparHtml(textoEmergencia)}</div>
          <div class="cracha-verso-telefone">${escaparHtml(telefoneEmergencia)}</div>
        </div>

        <div class="cracha-verso-footer"></div>
      </div>
    </section>

    <script>
      window.onload = () => {
        setTimeout(() => window.print(), 300);
      };
    </script>
  </body>
  </html>
    `.trim();
  }

  function abrirImpressao() {
    const html = gerarDocumentoImpressaoCracha();
    const win = window.open('', '_blank', 'width=1200,height=900');

    if (!win) {
      alert('Não foi possível abrir a janela de impressão. Verifique se o navegador bloqueou o pop-up.');
      return;
    }

    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  function fecharModalCracha() {
    overlay.remove();
    modal.remove();
  }

  modal.innerHTML = `
    <div class="w-full max-w-6xl glass rounded-2xl border border-border overflow-hidden">
      <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
        <div>
          <h3 class="form-title-sm font-semibold text-foreground">Gerar crachá retrato</h3>
          <p class="form-subtitle-sm">Pré-visualização vertical frente e verso.</p>
        </div>

        <button id="btnFecharCracha" type="button"
          class="w-10 h-10 rounded-xl bg-white border border-border hover:bg-white transition-all flex items-center justify-center"
          aria-label="Fechar" title="Fechar">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>

      <div class="px-6 py-6 bg-[#f6f7fb]">
        <div id="previewCrachaArea" class="flex flex-wrap gap-6 justify-center"></div>
      </div>

      <div class="px-6 py-5 flex flex-col sm:flex-row gap-3 border-t border-border">
        <button id="btnImprimirCracha" type="button"
          class="sm:flex-1 rounded-xl bg-primary text-white form-control-sm font-medium hover:opacity-90 transition-all">
          Imprimir crachá
        </button>

        <button id="btnFecharCrachaRodape" type="button"
          class="sm:flex-1 rounded-xl border border-border bg-white form-control-sm font-medium hover:bg-white transition-all">
          Fechar
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const previewArea = modal.querySelector('#previewCrachaArea');
  if (previewArea) {
    previewArea.innerHTML = `
      <style>
        .mini-cracha-sheet {
          display:flex;
          flex-wrap:wrap;
          gap:24px;
          justify-content:center;
        }

        .mini-cracha {
          width:204px;
          height:323px;
          border-radius:16px;
          overflow:hidden;
          box-shadow:none;
          border:1px solid rgba(37,52,141,.08);
          background:#fff;
          position:relative;
          font-family:'Barlow', Arial, sans-serif;
        }

        .mini-frente,
        .mini-verso {
          background:#fff;
        }

        .mini-frente-fundo {
          position:absolute;
          inset:0;
          background-color:#ffffff;
          background-image:${fundoCracha ? `url('${escaparHtml(fundoCracha)}')` : 'none'};
          background-repeat:no-repeat;
          background-position:center;
          background-size:cover;
          z-index:1;
        }

        .mini-front-logos-wrap {
          position:absolute;
          left:14px;
          right:14px;
          bottom:16px;
          z-index:3;
          display:flex;
          justify-content:center;
        }

        .mini-front-logos {
          min-width:162px;
          max-width:186px;
          min-height:40px;
          padding:6px 10px;
          border-radius:14px;
          background:#ffffff;
          box-shadow:none;
          display:flex;
          flex-direction:row;
          align-items:center;
          justify-content:center;
          gap:12px;
        }

        .mini-front-logos-verso {
          margin-bottom:6px;
        }

        .mini-logo-top {
          width:90px;
          max-width:90px;
          max-height:34px;
          object-fit:contain;
        }

        .mini-logo-main {
          width:82px;
          max-width:82px;
          max-height:30px;
          object-fit:contain;
        }

        .mini-front-panel {
          position:absolute;
          left:16px;
          right:16px;
          top:14px;
          bottom:86px;
          z-index:3;
          background:#ffffff;
          border-radius:18px;
          box-shadow:none;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-start;
          padding:16px 12px 12px 12px;
        }

        .mini-photo-wrap {
          position: relative;
          width: 124px;
          height: 124px;
          border-radius: 50%;
          overflow: hidden;
          padding: 4px;
          background: #ffffff;
          box-shadow: none;
          margin-bottom: 12px;
          flex: 0 0 auto;
          border: 0 !important;
          outline: none !important;
        }

        .mini-photo,
        .mini-photo-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          background: #e8edf8;
          border: 0 !important;
          outline: none !important;
          box-shadow: none !important;
          display: block;
        }

        .mini-photo-placeholder {
          display:flex;
          align-items:center;
          justify-content:center;
          color:#25348D;
          font-size:28px;
          font-weight:800;
        }

        .mini-front-content {
          width:100%;
          text-align:center;
        }

        .mini-nome {
          color:#123b9c;
          font-size:14px;
          line-height:1.02;
          font-weight:900;
          text-transform:uppercase;
          margin-bottom:6px;
          word-break:break-word;
        }

        .mini-setor {
          display:block;
          padding:0;
          border:0;
          background:transparent;
          color:#79A81E;
          font-size:10px;
          line-height:1.02;
          font-weight:900;
          text-transform:uppercase;
          word-break:break-word;
          margin-bottom:3px;
        }

        .mini-unidade {
          display:block;
          padding:0;
          border:0;
          background:transparent;
          color:#25348D;
          font-size:8px;
          line-height:1.08;
          font-weight:700;
          text-transform:uppercase;
          word-break:break-word;
        }

        .mini-verso-faixa-topo {
          position:absolute;
          top:0;
          left:0;
          right:0;
          height:75px;
          background-color:#ffffff;
          background-image:${fundoCracha ? `url('${escaparHtml(fundoCracha)}')` : 'none'};
          background-repeat:no-repeat;
          background-position:center;
          background-size:cover;
          z-index:1;
        }

        .mini-verso-header {
          position:relative;
          z-index:2;
          padding:14px 12px 8px 12px;
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:5px;
          text-align:center;
        }

        .mini-verso-conteudo {
          position:absolute;
          top:108px;
          left:16px;
          right:16px;
          bottom:32px;
          z-index:2;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          text-align:center;
        }

        .mini-verso-texto {
          color:#123b9c;
          font-size:8px;
          line-height:1.2;
          font-weight:700;
          text-align:center;
        }

        .mini-verso-telefone {
          margin-top:8px;
          color:#79A81E;
          font-size:11px;
          line-height:1.05;
          font-weight:900;
          text-align:center;
        }

        .mini-verso-footer {
          position:absolute;
          left:0;
          right:0;
          bottom:0;
          height:24px;
          background-color:#ffffff;
          background-image:${fundoCracha ? `url('${escaparHtml(fundoCracha)}')` : 'none'};
          background-repeat:no-repeat;
          background-position:center;
          background-size:cover;
          z-index:2;
        }
      </style>

      <div class="mini-cracha-sheet">
        <div class="mini-cracha mini-frente">
          <div class="mini-frente-fundo"></div>

          <div class="mini-front-logos-wrap">
            <div class="mini-front-logos">
              ${logoSecundaria ? `<img src="${escaparHtml(logoSecundaria)}" class="mini-logo-top" alt="Logo">` : ''}
              ${logoPrincipal ? `<img src="${escaparHtml(logoPrincipal)}" class="mini-logo-main" alt="Logo">` : ''}
            </div>
          </div>

          <div class="mini-front-panel">
            <div class="mini-photo-wrap">
              ${
                fotoAtualAbs
                  ? `<img src="${escaparHtml(fotoAtualAbs)}" class="mini-photo" alt="${escaparHtml(nomeCracha)}">`
                  : `<div class="mini-photo-placeholder">${escaparHtml(iniciais)}</div>`
              }
            </div>

            <div class="mini-front-content">
              <div class="mini-nome">${escaparHtml(nomeCracha || 'Nome do colaborador')}</div>
              <div class="mini-setor">${escaparHtml(setor || 'Setor')}</div>
              <div class="mini-unidade">${escaparHtml(unidadeTrabalho || '')}</div>
            </div>
          </div>
        </div>

        <div class="mini-cracha mini-verso">
          <div class="mini-verso-faixa-topo"></div>

          <div class="mini-verso-header">
            <div class="mini-front-logos mini-front-logos-verso">
              ${logoSecundaria ? `<img src="${escaparHtml(logoSecundaria)}" class="mini-logo-top" alt="Logo">` : ''}
              ${logoPrincipal ? `<img src="${escaparHtml(logoPrincipal)}" class="mini-logo-main" alt="Logo">` : ''}
            </div>
          </div>

          <div class="mini-verso-conteudo">
            <div class="mini-verso-texto">${escaparHtml(textoEmergencia)}</div>
            <div class="mini-verso-telefone">${escaparHtml(telefoneEmergencia)}</div>
          </div>

          <div class="mini-verso-footer"></div>
        </div>
      </div>
    `;
  }

  overlay.addEventListener('click', fecharModalCracha);
  modal.querySelector('#btnFecharCracha')?.addEventListener('click', fecharModalCracha);
  modal.querySelector('#btnFecharCrachaRodape')?.addEventListener('click', fecharModalCracha);
  modal.querySelector('#btnImprimirCracha')?.addEventListener('click', abrirImpressao);
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
  let funcaoOptions = '';
  let unidadeTrabalhoOptions = '';

  const perfilLogado = (sessionStorage.getItem('perfilacesso') || '').trim().toLowerCase();

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
    localTrabalhoOptions = `<option value="" selected>Erro ao carregar centros de custo</option>`;
  }

  try {
    funcaoOptions = optionsFromRows(
      cacheFuncoesGestao || [],
      u.FUNCAO ?? u.funcao ?? '',
      'Selecione...'
    );
  } catch (err) {
    console.error('Erro ao gerar options de função:', err);
    funcaoOptions = `<option value="" selected>Erro ao carregar funções</option>`;
  }

  try {
    unidadeTrabalhoOptions = optionsFromRows(
      cacheLocaisTrabalhoGestaoUnidade || [],
      u.UNIDADE_TRABALHO ?? u.unidade_trabalho ?? u.UNIDADETRABALHO ?? u.unidadetrabalho ?? '',
      'Selecione...'
    );
  } catch (err) {
    console.error('Erro ao gerar options de unidade de trabalho:', err);
    unidadeTrabalhoOptions = `<option value="" selected>Erro ao carregar unidades</option>`;
  }

  const dataAdmissaoAtual = String(
    u.DATA_ADMISSAO ?? u.data_admissao ?? u.DATAADMISSAO ?? u.dataadmissao ?? ''
  ).slice(0, 10);

  const emailCorporativo = u.EMAIL ?? u.email ?? '';
  const telefoneCorporativo = formatarCelularBR(u.TELEFONE ?? u.telefone ?? '');
  const statusAtual = (u.STATUS ?? u.status ?? 'Ativo').toString().trim() || 'Ativo';

  const cpfAtual = formatarCPF(u.CPF ?? u.cpf ?? '');
  const rgAtual = u.RG ?? u.rg ?? '';
  const cnhAtual = u.CNH ?? u.cnh ?? '';
  const cnhCategoriaAtual = u.CNH_CATEGORIA ?? u.cnh_categoria ?? u.CNHCATEGORIA ?? u.cnhcategoria ?? '';
  const dataNascimentoAtual = String(
    u.DATA_NASCIMENTO ?? u.data_nascimento ?? u.DATANASCIMENTO ?? u.datanascimento ?? ''
  ).slice(0, 10);
  const estadoCivilAtual = u.ESTADO_CIVIL ?? u.estado_civil ?? u.ESTADOCIVIL ?? u.estadocivil ?? '';
  const telefonePessoalAtual = formatarCelularBR(
    u.TELEFONE_PESSOAL ?? u.telefone_pessoal ?? u.TELEFONEPESSOAL ?? u.telefonepessoal ?? ''
  );
  const emailPessoalAtual = u.EMAIL_PESSOAL ?? u.email_pessoal ?? u.EMAILPESSOAL ?? u.emailpessoal ?? '';
  const cnhValidadeAtual = String(
    u.CNH_VALIDADE ??
    u.cnh_validade ??
    u.CNHVALIDADE ??
    u.cnhvalidade ??
    ''
  ).slice(0, 10);

  const apelidoAtual = u.APELIDO ?? u.apelido ?? '';
  const numeroCalcadoAtual = u.NUMERO_CALCADO ?? u.numero_calcado ?? u.NUMEROCALCADO ?? u.numerocalcado ?? '';
  const tamanhoCamisaAtual = String(
    u.TAMANHO_CAMISA ?? u.tamanho_camisa ?? u.TAMANHOCAMISA ?? u.tamanhocamisa ?? ''
  ).trim().toUpperCase();
  const tamanhoCalcaAtual = u.TAMANHO_CALCA ?? u.tamanho_calca ?? u.TAMANHOCALCA ?? u.tamanhocalca ?? '';
  const sexoAtual = String(u.SEXO ?? u.sexo ?? '').trim().toUpperCase();
  const temFilhosAtual = String(u.TEM_FILHOS ?? u.tem_filhos ?? u.TEMFILHOS ?? u.temfilhos ?? 'NÃO').trim().toUpperCase();
  const quantidadeFilhosAtual = String(
    u.QUANTIDADE_FILHOS ?? u.quantidade_filhos ?? u.QUANTIDADEFILHOS ?? u.quantidadefilhos ?? ''
  ).trim();

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
                <h3 class="form-title-sm font-semibold text-foreground">
                  ${isView ? 'Visualizar usuário' : isEdit ? 'Editar usuário' : 'Novo usuário'}
                </h3>
                <p class="form-subtitle-sm">
                  ${isView ? 'Consulta de dados do usuário' : 'Dados corporativos, pessoais e adcionais (*Abas obrigatórias | **Campos Obrigatórios)'}
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
                    <label class="form-label-sm block">Foto do usuário</label>

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
                        class="rounded-xl border border-border bg-white/70 form-control-sm form-label-sm hover:bg-white transition-all">
                        Alterar com senha atual
                      </button>
                    </div>

                    <div id="guBlocoAlteracaoSenha" class="hidden space-y-3">
                      <div class="space-y-2">
                        <label class="form-label-sm">Senha atual</label>
                        <input id="guSenhaAtual" type="password"
                          class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Informe a senha atual"
                          autocomplete="new-password"
                          data-lpignore="true">
                      </div>

                      <div class="space-y-2">
                        <label class="form-label-sm">Nova senha</label>
                        <input id="guNovaSenha" type="password" minlength="6"
                          class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Mínimo 6 caracteres"
                          autocomplete="new-password"
                          data-lpignore="true">
                      </div>

                      <div class="grid grid-cols-1 gap-2">
                        <button id="btnTrocarSenhaGU" type="button"
                          class="rounded-xl border border-border bg-white/70 form-control-sm form-label-sm hover:bg-white transition-all">
                          Salvar nova senha
                        </button>
                      </div>
                    </div>

                    <p id="guSenhaMsg" class="text-xs hidden whitespace-pre-line"></p>
                  </div>
                  ` : ''}

                  ${isNew ? `
                  <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-2">
                    <label class="form-label-sm">Senha inicial</label>
                    <input id="guSenha" type="password" minlength="6"
                      class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
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
                      class="px-4 py-2 rounded-xl form-label-sm border border-border bg-white text-foreground shadow-sm transition-all">
                      Corporativo*
                    </button>

                    <button id="guAbaPessoal" type="button" aria-selected="false"
                      class="px-4 py-2 rounded-xl form-label-sm border border-border bg-white/40 text-muted-foreground hover:bg-white/70 transition-all">
                      Pessoal*
                    </button>

                    <button id="guAbaDadosAdicionais" type="button" aria-selected="false"
                      class="px-4 py-2 rounded-xl form-label-sm border border-border bg-white/40 text-muted-foreground hover:bg-white/70 transition-all">
                      Dados adicionais
                    </button>
                  </div>

                  <div id="guPainelCorporativo" class="space-y-4">
                    <div class="rounded-2xl border border-border bg-white/40 p-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2 md:col-span-2">
                          <label class="form-label-sm">Nome **</label>
                          <input id="guNome" type="text" required ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(u.NOME ?? u.nome ?? '')}" autocomplete="off">
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">E-mail corporativo</label>
                          <input id="guEmailCorporativo" type="email" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(emailCorporativo)}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Telefone corporativo</label>
                          <input id="guTelefoneCorporativo" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(telefoneCorporativo)}" placeholder="77 9XXXX-XXXX" autocomplete="off">
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Perfil **</label>
                          <select id="guPerfil" required ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30">
                            ${perfilOptions}
                          </select>
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Data admissão **</label>
                          <input id="guDataAdmissao" type="date" required ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(dataAdmissaoAtual)}">
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Função **</label>
                          <div class="flex items-stretch gap-2">
                            <select id="guFuncao" required ${formDisabledAttr}
                              class="flex-1 min-w-0 h-12 rounded-xl border border-border bg-white/70 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30">
                              ${funcaoOptions}
                            </select>

                            ${isView ? '' : `
                              <button id="btnAddFuncao" type="button"
                                class="h-12 w-12 shrink-0 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all flex items-center justify-center"
                                aria-label="Adicionar função" title="Adicionar função">
                                <i class="fas fa-plus" aria-hidden="true"></i>
                              </button>
                            `}
                          </div>

                          </div>
                            <div class="space-y-2">
                            <label class="form-label-sm">Setor **</label>
                            <div class="flex items-stretch gap-2">
                              <select id="guSetor" required ${formDisabledAttr}
                                class="flex-1 min-w-0 h-12 rounded-xl border border-border bg-white/70 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30">
                                ${setorOptions}
                              </select>

                              ${isView ? '' : `
                                <button id="btnAddSetor" type="button"
                                  class="h-12 w-12 shrink-0 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all flex items-center justify-center"
                                  aria-label="Adicionar setor" title="Adicionar setor">
                                  <i class="fas fa-plus" aria-hidden="true"></i>
                                </button>
                              `}
                            </div>
                          </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Centro de Custo</label>
                          <div class="flex items-stretch gap-2">
                            <select id="guLocalTrabalho" ${formDisabledAttr}
                              class="flex-1 min-w-0 h-12 rounded-xl border border-border bg-white/70 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30">
                              ${localTrabalhoOptions}
                            </select>

                            ${isView ? '' : `
                              <button id="btnAddLocalTrabalho" type="button"
                                class="h-12 w-12 shrink-0 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all flex items-center justify-center"
                                aria-label="Adicionar Centro de Custo" title="Adicionar Centro de Custo">
                                <i class="fas fa-plus" aria-hidden="true"></i>
                              </button>
                            `}
                          </div>
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Unidade de trabalho **</label>
                          <div class="flex items-stretch gap-2">
                            <select id="guUnidadeTrabalho" required ${formDisabledAttr}
                              class="flex-1 min-w-0 h-12 rounded-xl border border-border bg-white/70 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30">
                              ${unidadeTrabalhoOptions}
                            </select>

                            ${isView ? '' : `
                              <button id="btnAddUnidadeTrabalho" type="button"
                                class="h-12 w-12 shrink-0 rounded-xl border border-border bg-white/60 hover:bg-white/90 transition-all flex items-center justify-center"
                                aria-label="Adicionar Unidade de Trabalho" title="Adicionar Unidade de Trabalho">
                                <i class="fas fa-plus" aria-hidden="true"></i>
                              </button>
                            `}
                          </div>
                        </div>

                        <!-- Status + Botão Assinatura -->
                        <div class="space-y-2 md:col-span-2">
                          <label class="form-label-sm block">Status</label>

                          <div class="grid grid-cols-1 lg:grid-cols-[minmax(220px,1fr)_auto_auto] gap-2">
                            <select id="guStatus" required ${formDisabledAttr}
                              class="w-full min-w-[220px] h-12 rounded-xl border border-border bg-white/70 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30">
                              ${['Ativo', 'Desativado'].map((s) => {
                                const selected = statusAtual === s ? 'selected' : '';
                                return `<option value="${escapeHtml(s)}" ${selected}>${escapeHtml(s)}</option>`;
                              }).join('')}
                            </select>

                            <button id="btnGerarAssinatura" type="button"
                              class="h-12 px-4 rounded-xl border border-border bg-white/60 hover:bg-white transition-all flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap"
                              title="Gerar assinatura de e-mail">
                              <i class="fas fa-signature" aria-hidden="true"></i>
                              <span class="hidden sm:inline">Assinatura de e-mail</span>
                            </button>

                            <button id="btnGerarCrachar" type="button"
                              class="h-12 px-4 rounded-xl border border-border bg-white/60 hover:bg-white transition-all flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap"
                              title="Gerar crachá">
                              <i class="fas fa-id-card" aria-hidden="true"></i>
                              <span class="hidden sm:inline">Gerar crachá</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="guPainelPessoal" class="space-y-4 hidden">
                    <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-4">
                      <div>
                        <h4 class="text-sm font-semibold text-foreground">Dados pessoais</h4>
                        <p class="text-xs text-muted-foreground">Informações civis e de contato pessoal do usuário</p>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <label class="form-label-sm">CPF **</label>
                          <input id="guCpf" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(cpfAtual)}"
                            placeholder="000.000.000-00"
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">RG</label>
                          <input id="guRg" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(rgAtual)}"
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Data de nascimento **</label>
                          <input id="guDataNascimento" type="date" required  ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(dataNascimentoAtual)}" />
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Estado civil</label>
                          <select id="guEstadoCivil" ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30">
                            ${['', 'Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União estável']
                              .map((s) => {
                                const selected = estadoCivilAtual === s ? 'selected' : '';
                                const label = s || 'Selecione...';
                                return `<option value="${escapeHtml(s)}" ${selected}>${escapeHtml(label)}</option>`;
                              }).join('')}
                          </select>
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Telefone pessoal</label>
                          <input id="guTelefonePessoal" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(telefonePessoalAtual)}"
                            placeholder="(77) 9XXXX-XXXX"
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">E-mail pessoal</label>
                          <input id="guEmailPessoal" type="email" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(emailPessoalAtual)}"
                            autocomplete="off"
                            autocapitalize="off"
                            autocorrect="off"
                            spellcheck="false"
                            data-lpignore="true" />
                        </div>
                      </div>
                    </div>

                    <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-4">
                      <div>
                        <h4 class="text-sm font-semibold text-foreground">CNH</h4>
                        <p class="text-xs text-muted-foreground">Dados da carteira e arquivo anexado</p>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <label class="form-label-sm">CNH</label>
                          <input id="guCnh" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(cnhAtual)}"
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Categoria CNH</label>
                          <input id="guCnhCategoria" type="text" maxlength="5" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30 uppercase"
                            value="${escapeHtml(cnhCategoriaAtual)}"
                            placeholder="A, B, AB..."
                            autocomplete="off" />
                        </div>

                        <div class="space-y-2 md:col-span-2">
                          <label class="form-label-sm">Validade da CNH</label>
                          <input id="guCnhValidade" type="date" ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(cnhValidadeAtual)}" />
                        </div>

                        <div class="space-y-2 md:col-span-2">
                          <label class="form-label-sm">Arquivo da CNH</label>

                          ${isView
                            ? (cnhArquivoAtualAbs
                                ? `
                                <a href="${escapeHtml(cnhArquivoAtualAbs)}" target="_blank" rel="noopener noreferrer"
                                  class="inline-flex items-center gap-2 rounded-xl border border-border bg-white/70 form-control-sm text-sm hover:bg-white transition-all">
                                  <i class="fas fa-paperclip"></i>
                                  Visualizar CNH
                                </a>
                              `
                                : `
                                <div class="rounded-xl border border-dashed border-border bg-white/40 form-control-sm form-subtitle-sm">
                                  Nenhum arquivo anexado.
                                </div>
                              `)
                            : `
                              <div class="space-y-3">
                                <div class="flex flex-col lg:flex-row gap-2 lg:items-center">
                                  <input id="guCnhArquivoInput" type="file" accept=".pdf,image/*"
                                    class="flex-1 min-w-0 rounded-xl border border-border bg-white/70 form-control-sm text-sm"
                                    autocomplete="off" />

                                  <div id="guCnhArquivoAtualWrap" class="${cnhArquivoAtualAbs ? '' : 'hidden'} shrink-0">
                                    <a id="guCnhArquivoAtualLink" href="${escapeHtml(cnhArquivoAtualAbs)}" target="_blank" rel="noopener noreferrer"
                                      class="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white/70 form-control-sm text-sm hover:bg-white transition-all whitespace-nowrap">
                                      <i class="fas fa-paperclip"></i>
                                      Visualizar CNH
                                    </a>
                                  </div>

                                  <button id="btnRemoverCnhArquivoGU" type="button"
                                    class="shrink-0 rounded-xl border border-border bg-white/60 form-control-sm text-sm hover:bg-white/90 transition-all whitespace-nowrap">
                                    Remover CNH
                                  </button>
                                </div>

                                <div id="guCnhArquivoNovoWrap"
                                  class="hidden rounded-xl border border-border bg-white/50 form-control-sm text-sm text-foreground"></div>

                                <p class="text-xs text-muted-foreground">
                                  Aceita PDF, JPG, PNG, JPEG ou WEBP.
                                </p>
                              </div>
                            `}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div id="guPainelDadosAdicionais" class="space-y-4 hidden">
                    <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-4">
                      <div>
                        <h4 class="text-sm font-semibold text-foreground">Dados adicionais</h4>
                        <p class="text-xs text-muted-foreground">Informações complementares do usuário.</p>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-2">
                          <label class="form-label-sm">Apelido</label>
                          <input id="guApelido" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(apelidoAtual)}" autocomplete="off">
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Sexo</label>
                          <select id="guSexo" ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30">
                            ${['', 'MASCULINO', 'FEMININO', 'OUTRO', 'PREFIRO NÃO INFORMAR'].map(s => {
                              const selected = sexoAtual === s ? 'selected' : '';
                              const label = s || 'Selecione...';
                              return `<option value="${escapeHtml(s)}" ${selected}>${escapeHtml(label)}</option>`;
                            }).join('')}
                          </select>
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Número do calçado</label>
                          <input id="guNumeroCalcado" type="number" min="0" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(numeroCalcadoAtual)}">
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Tamanho camisa</label>
                          <select id="guTamanhoCamisa" ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30">
                            ${['', 'PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'].map(s => {
                              const selected = tamanhoCamisaAtual === s ? 'selected' : '';
                              const label = s || 'Selecione...';
                              return `<option value="${escapeHtml(s)}" ${selected}>${escapeHtml(label)}</option>`;
                            }).join('')}
                          </select>
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Tamanho calça</label>
                          <input id="guTamanhoCalca" type="text" ${inputReadonlyAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                            value="${escapeHtml(tamanhoCalcaAtual)}">
                        </div>

                        <div class="space-y-2">
                          <label class="form-label-sm">Tem filhos?</label>
                          <select id="guTemFilhos" ${formDisabledAttr}
                            class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30">
                            ${['NÃO', 'SIM'].map(s => {
                              const selected = temFilhosAtual === s ? 'selected' : '';
                              return `<option value="${escapeHtml(s)}" ${selected}>${escapeHtml(s)}</option>`;
                            }).join('')}
                          </select>
                        </div>
                      </div>

                      <div id="guBlocoQtdFilhos" class="space-y-2 ${temFilhosAtual === 'SIM' ? '' : 'hidden'}">
                        <label class="form-label-sm">Quantidade de filhos</label>
                        <input id="guQuantidadeFilhos" type="number" min="1" step="1" ${inputReadonlyAttr}
                          class="w-full md:w-14 rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                          value="${escapeHtml(quantidadeFilhosAtual)}">
                      </div>

                      <div id="guBlocoTabelaFilhos" class="space-y-3 hidden">
                        <div>
                          <h5 class="text-sm font-semibold text-foreground">Filhos</h5>
                          <p class="text-xs text-muted-foreground">Informe nome completo e data de nascimento.</p>
                        </div>

                        <div class="overflow-auto rounded-2xl border border-border bg-white/50">
                          <table class="min-w-full text-sm">
                            <thead class="bg-muted/40 text-muted-foreground">
                              <tr>
                                <th class="text-left font-semibold form-control-sm">#</th>
                                <th class="text-left font-semibold form-control-sm">Nome completo</th>
                                <th class="text-left font-semibold form-control-sm">Data de nascimento</th>
                              </tr>
                            </thead>
                            <tbody id="guTabelaFilhosBody"></tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p id="guErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

                  <div class="pt-2 flex flex-col sm:flex-row gap-3">
                    ${isView ? `
                    <button id="btnCancelarGU" type="button"
                      class="sm:flex-1 rounded-xl border border-border bg-white/50 form-control-sm font-medium hover:bg-white/70 transition-all">
                      Fechar
                    </button>
                    ` : `
                    <button id="btnSalvarGU" type="submit"
                      class="sm:flex-1 rounded-xl bg-primary text-white form-control-sm font-medium hover:opacity-90 transition-all">
                      Salvar
                    </button>

                    <button id="btnCancelarGU" type="button"
                      class="sm:flex-1 rounded-xl border border-border bg-white/50 form-control-sm font-medium hover:bg-white/70 transition-all">
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

  document.getElementById('btnGerarAssinatura')?.addEventListener('click', () => {
    abrirModalAssinatura(u); 
  });

  document.getElementById('btnGerarCrachar')?.addEventListener('click', () => {
    abrirModalCrachaRetrato(u); 
  });

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
  const btnAddFuncao = document.getElementById('btnAddFuncao');
  const btnAddUnidadeTrabalho = document.getElementById('btnAddUnidadeTrabalho');
  const btnMostrarAlteracaoSenha = document.getElementById('btnMostrarAlteracaoSenhaGU');
  const blocoAlteracaoSenha = document.getElementById('guBlocoAlteracaoSenha');

  const inpTelCorp = document.getElementById('guTelefoneCorporativo');
  const inpTelPess = document.getElementById('guTelefonePessoal');
  const inpCpf = document.getElementById('guCpf');
  const btnAbaCorp = document.getElementById('guAbaCorporativo');
  const btnAbaPess = document.getElementById('guAbaPessoal');
  const btnAbaAdic = document.getElementById('guAbaDadosAdicionais');
  const btnTrocarSenha = document.getElementById('btnTrocarSenhaGU');
  const ctx = canvas?.getContext('2d');

  const cnhArquivoInput = document.getElementById('guCnhArquivoInput');
  const btnRemoverCnhArquivo = document.getElementById('btnRemoverCnhArquivoGU');
  const cnhArquivoAtualWrap = document.getElementById('guCnhArquivoAtualWrap');
  const cnhArquivoNovoWrap = document.getElementById('guCnhArquivoNovoWrap');

  let guCnhArquivoFile = null;
  let guCnhArquivoRemovido = false;

  const inpTemFilhos = document.getElementById('guTemFilhos');
  const inpQuantidadeFilhos = document.getElementById('guQuantidadeFilhos');
  const blocoQtdFilhos = document.getElementById('guBlocoQtdFilhos');
  const blocoTabelaFilhos = document.getElementById('guBlocoTabelaFilhos');
  const tabelaFilhosBody = document.getElementById('guTabelaFilhosBody');

  let filhosAtuais = [];
  try {
    const bruto = u.FILHOS ?? u.filhos ?? '[]';
    filhosAtuais = Array.isArray(bruto) ? bruto : JSON.parse(bruto || '[]');
    if (!Array.isArray(filhosAtuais)) filhosAtuais = [];
  } catch (_) {
    filhosAtuais = [];
  }

  function setAbaLocal(nome) {
    const abaCorp = document.getElementById('guAbaCorporativo');
    const abaPess = document.getElementById('guAbaPessoal');
    const abaAdic = document.getElementById('guAbaDadosAdicionais');
    const painelCorp = document.getElementById('guPainelCorporativo');
    const painelPess = document.getElementById('guPainelPessoal');
    const painelAdic = document.getElementById('guPainelDadosAdicionais');

    const ativa = String(nome || 'corporativo').trim().toLowerCase();
    const estiloAtivo = 'px-4 py-2 rounded-xl form-label-sm border border-border bg-white text-foreground shadow-sm transition-all';
    const estiloInativo = 'px-4 py-2 rounded-xl form-label-sm border border-border bg-white/40 text-muted-foreground hover:bg-white/70 transition-all';

    if (abaCorp) {
      abaCorp.setAttribute('aria-selected', ativa === 'corporativo' ? 'true' : 'false');
      abaCorp.className = ativa === 'corporativo' ? estiloAtivo : estiloInativo;
    }

    if (abaPess) {
      abaPess.setAttribute('aria-selected', ativa === 'pessoal' ? 'true' : 'false');
      abaPess.className = ativa === 'pessoal' ? estiloAtivo : estiloInativo;
    }

    if (abaAdic) {
      abaAdic.setAttribute('aria-selected', ativa === 'dados-adicionais' ? 'true' : 'false');
      abaAdic.className = ativa === 'dados-adicionais' ? estiloAtivo : estiloInativo;
    }

    if (painelCorp) {
      painelCorp.hidden = ativa !== 'corporativo';
      painelCorp.classList.toggle('hidden', ativa !== 'corporativo');
    }

    if (painelPess) {
      painelPess.hidden = ativa !== 'pessoal';
      painelPess.classList.toggle('hidden', ativa !== 'pessoal');
    }

    if (painelAdic) {
      painelAdic.hidden = ativa !== 'dados-adicionais';
      painelAdic.classList.toggle('hidden', ativa !== 'dados-adicionais');
    }
  }

  function montarLinhasFilhos(qtd) {
    if (!tabelaFilhosBody) return;

    const quantidade = Math.max(0, Number(qtd) || 0);

    tabelaFilhosBody.innerHTML = Array.from({ length: quantidade }).map((_, idx) => {
      const filho = filhosAtuais[idx] || {};
      const nome = filho.nome ?? filho.NOME ?? '';
      const dataNascimento = String(
        filho.dataNascimento ?? filho.DATA_NASCIMENTO ?? filho.data_nascimento ?? ''
      ).slice(0, 10);

      return `
        <tr class="border-t border-border/70">
          <td class="px-4 py-3 font-semibold">${idx + 1}</td>
          <td class="px-4 py-3">
            <input
              type="text"
              class="gu-filho-nome w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
              data-index="${idx}"
              value="${escapeHtml(nome)}"
              ${inputReadonlyAttr}
              placeholder="Nome completo">
          </td>
          <td class="px-4 py-3">
            <input
              type="date"
              class="gu-filho-data w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
              data-index="${idx}"
              value="${escapeHtml(dataNascimento)}"
              ${formDisabledAttr}>
          </td>
        </tr>
      `;
    }).join('');
  }

  function atualizarBlocoFilhos() {
    const temFilhos = String(inpTemFilhos?.value || 'NÃO').toUpperCase() === 'SIM';
    const qtd = Math.max(0, Number(inpQuantidadeFilhos?.value) || 0);

    blocoQtdFilhos?.classList.toggle('hidden', !temFilhos);
    blocoTabelaFilhos?.classList.toggle('hidden', !temFilhos || qtd <= 0);

    if (temFilhos && qtd > 0) {
      montarLinhasFilhos(qtd);
    } else if (tabelaFilhosBody) {
      tabelaFilhosBody.innerHTML = '';
    }
  }

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

  btnAbaCorp?.addEventListener('click', () => setAbaLocal('corporativo'));
  btnAbaPess?.addEventListener('click', () => setAbaLocal('pessoal'));
  btnAbaAdic?.addEventListener('click', () => setAbaLocal('dados-adicionais'));

  inpTemFilhos?.addEventListener('change', atualizarBlocoFilhos);
  inpQuantidadeFilhos?.addEventListener('input', atualizarBlocoFilhos);
  inpQuantidadeFilhos?.addEventListener('change', atualizarBlocoFilhos);

  setAbaLocal('corporativo');
  atualizarBlocoFilhos();

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

  btnAddFuncao?.addEventListener('click', async () => {
    const nome = prompt('Nome da função:');
    if (!nome) return;

    try {
      await apiSend('/api/gestao-usuarios-funcoes', 'POST', { nome });
      const funcoesResp = await apiGet('/api/gestao-usuarios-funcoes');
      cacheFuncoesGestao = Array.isArray(funcoesResp?.items) ? funcoesResp.items : [];
      const sel = document.getElementById('guFuncao');
      if (sel) sel.innerHTML = optionsFromRows(cacheFuncoesGestao, titleCaseNome(nome), 'Selecione...');
    } catch (err) {
      alert('Erro ao adicionar função: ' + (err?.message || err));
    }
  });

  btnAddLocalTrabalho?.addEventListener('click', async () => {
    const nome = prompt('Nome do Centro de Custo:');
    if (!nome) return;

    try {
      await apiSend('/api/gestao-usuarios-centro-custo', 'POST', { nome });
      const locaisResp = await apiGet('/api/gestao-usuarios-centro-custo');
      cacheLocaisTrabalhoGestao = Array.isArray(locaisResp?.items) ? locaisResp.items : [];
      const sel = document.getElementById('guLocalTrabalho');
      if (sel) sel.innerHTML = optionsFromRows(cacheLocaisTrabalhoGestao, titleCaseNome(nome), 'Selecione...');
    } catch (err) {
      alert('Erro ao adicionar Centro de Custo: ' + (err?.message || err));
    }
  });

  btnAddUnidadeTrabalho?.addEventListener('click', async () => {
    try {
      await abrirModalUnidadeTrabalho();
    } catch (err) {
      alert('Erro ao abrir gerenciamento de Unidade de Trabalho: ' + (err?.message || err));
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
    const funcao = inputValue('guFuncao').trim();
    const data_admissao = inputValue('guDataAdmissao').trim();
    const local_trabalho = inputValue('guLocalTrabalho').trim();
    const unidade_trabalho = inputValue('guUnidadeTrabalho').trim();
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

    const apelido = inputValue('guApelido').trim();
    const numero_calcado = inputValue('guNumeroCalcado').trim();
    const tamanho_camisa = inputValue('guTamanhoCamisa').trim();
    const tamanho_calca = inputValue('guTamanhoCalca').trim();
    const sexo = inputValue('guSexo').trim();
    const tem_filhos = inputValue('guTemFilhos').trim().toUpperCase();
    const quantidade_filhos = inputValue('guQuantidadeFilhos').trim();

    const filhos = Array.from(document.querySelectorAll('#guTabelaFilhosBody tr')).map(tr => {
      const nome = tr.querySelector('.gu-filho-nome')?.value?.trim() || '';
      const data_nascimento = tr.querySelector('.gu-filho-data')?.value?.trim() || '';
      return { nome, data_nascimento };
    }).filter(f => f.nome || f.data_nascimento);

    if (!nome || !perfil || !setor || !status || !data_admissao) {
      setErr('Preencha os campos obrigatórios da aba Corporativa: nome, perfil, setor, status e data admmissão.');
      return;
    }

    if (!data_nascimento || !cpf) {
      setErr('Preencha os campos obrigatórios da aba Pessoal: data de nascimento e CPF.');
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
        funcao: funcao || '',
        data_admissao: data_admissao || '',
        local_trabalho: local_trabalho || '',
        unidade_trabalho: unidade_trabalho || '',
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

        apelido: apelido || '',
        numero_calcado: numero_calcado || '',
        tamanho_camisa: tamanho_camisa || '',
        tamanho_calca: tamanho_calca || '',
        sexo: sexo || '',
        tem_filhos: tem_filhos || 'NÃO',
        quantidade_filhos: tem_filhos === 'SIM' ? (quantidade_filhos || '') : '',
        filhos: tem_filhos === 'SIM' ? filhos : []
      };

      if (fotoPayload !== undefined) payload.foto = fotoPayload;
      if (cnhArquivoPayload !== undefined) payload.cnh_arquivo = cnhArquivoPayload;

      if (isNew) {
        const senha = inputValue('guSenha').toString();
        payload.senha = '123456';
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

function normalizarTelefoneUnidade(valor) {
  return String(valor || '').trim();
}

async function recarregarUnidadesTrabalho(selectValue = '') {
  const unidadesResp = await apiGet('/api/gestao-usuarios-locais-trabalho');
  cacheLocaisTrabalhoGestaoUnidade = Array.isArray(unidadesResp?.items) ? unidadesResp.items : [];

  const sel = document.getElementById('guUnidadeTrabalho');
  if (sel) {
    sel.innerHTML = optionsFromRows(
      cacheLocaisTrabalhoGestaoUnidade,
      selectValue || '',
      'Selecione...'
    );
  }
}

function fecharModalUnidadeTrabalho() {
  document.getElementById('guUnidadeOverlay')?.remove();
  document.getElementById('guUnidadeModal')?.remove();
}

async function abrirModalUnidadeTrabalho() {
  fecharModalUnidadeTrabalho();

  const overlay = document.createElement('div');
  overlay.id = 'guUnidadeOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[160]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'guUnidadeModal';
  modal.className = 'fixed inset-0 z-[170]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-4 md:p-6">
        <div class="w-[92vw] max-w-[92vw] glass rounded-2xl border border-border shadow-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
            <div>
              <h3 class="form-title-sm font-semibold text-foreground">Gerenciar Unidade de Trabalho</h3>
              <p class="form-subtitle-sm">Cadastre, edite e exclua unidades de trabalho.</p>
            </div>
            <button id="btnFecharModalUnidadeTrabalho" type="button"
              class="w-10 h-10 rounded-xl bg-white60 border border-border hover:bg-white transition-all flex items-center justify-center"
              aria-label="Fechar" title="Fechar">
              <i class="fas fa-times" aria-hidden="true"></i>
            </button>
          </div>

          <div class="p-6 grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
            <div class="rounded-2xl border border-border bg-white50 p-4 space-y-4">
              <div>
                <h4 id="guUnidadeFormTitulo" class="text-sm font-semibold text-foreground">Nova unidade</h4>
                <p class="text-xs text-muted-foreground mt-1">Preencha nome, endereço e telefone.</p>
              </div>

              <input type="hidden" id="guUnidadeId" />

              <div class="space-y-2">
                <label class="form-label-sm block">Nome</label>
                <input id="guUnidadeNome" type="text"
                  class="w-full rounded-xl border border-border bg-white70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Nome da unidade" />
              </div>

              <div class="space-y-2">
                <label class="form-label-sm block">Endereço</label>
                <input id="guUnidadeEndereco" type="text"
                  class="w-full rounded-xl border border-border bg-white70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Endereço completo" />
              </div>

              <div class="space-y-2">
                <label class="form-label-sm block">Telefone</label>
                <input id="guUnidadeTelefone" type="text"
                  class="w-full rounded-xl border border-border bg-white70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="(77) 99999-9999" />
              </div>

              <p id="guUnidadeMsg"
                class="hidden text-sm rounded-xl px-3 py-2 border whitespace-pre-line"></p>

              <div class="flex flex-col sm:flex-row gap-3">
                <button id="btnSalvarUnidadeTrabalho" type="button"
                  class="sm:flex-1 rounded-xl bg-primary text-white form-control-sm font-medium hover:opacity-90 transition-all">
                  Salvar
                </button>

                <button id="btnNovaUnidadeTrabalho" type="button"
                  class="sm:flex-1 rounded-xl border border-border bg-white60 form-control-sm font-medium hover:bg-white transition-all">
                  Novo
                </button>
              </div>
            </div>

            <div class="rounded-2xl border border-border bg-white50 p-4 space-y-4 min-w-0">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h4 class="text-sm font-semibold text-foreground">Unidades cadastradas</h4>
                  <p class="text-xs text-muted-foreground">Clique em editar para carregar no formulário.</p>
                </div>

                <button id="btnAtualizarListaUnidadeTrabalho" type="button"
                  class="w-10 h-10 rounded-xl border border-border bg-white60 hover:bg-white transition-all flex items-center justify-center"
                  title="Atualizar lista" aria-label="Atualizar lista">
                  <i class="fas fa-rotate-right" aria-hidden="true"></i>
                </button>
              </div>

              <div class="overflow-auto rounded-2xl border border-border bg-white40">
                <table class="min-w-full text-sm">
                  <thead class="bg-muted/40 text-muted-foreground">
                    <tr>
                      <th class="text-left font-semibold form-control-sm">Nome</th>
                      <th class="text-left font-semibold form-control-sm">Endereço</th>
                      <th class="text-left font-semibold form-control-sm">Telefone</th>
                      <th class="text-right font-semibold form-control-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody id="tbodyUnidadesTrabalho"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;


  document.body.appendChild(modal);

  const elId = modal.querySelector('#guUnidadeId');
  const elNome = modal.querySelector('#guUnidadeNome');
  const elEndereco = modal.querySelector('#guUnidadeEndereco');
  const elTelefone = modal.querySelector('#guUnidadeTelefone');
  const elMsg = modal.querySelector('#guUnidadeMsg');
  const tbody = modal.querySelector('#tbodyUnidadesTrabalho');

  function setMsg(msg = '', tipo = '') {
    if (!elMsg) return;
    if (!msg) {
      elMsg.textContent = '';
      elMsg.className = 'hidden text-sm rounded-xl px-3 py-2 border whitespace-pre-line';
      return;
    }

    elMsg.textContent = msg;
    elMsg.className = `text-sm rounded-xl px-3 py-2 border whitespace-pre-line ${
      tipo === 'erro'
        ? 'bg-red-50 text-red-700 border-red-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }`;
  }

  function limparFormulario() {
    elId.value = '';
    elNome.value = '';
    elEndereco.value = '';
    elTelefone.value = '';
    modal.querySelector('#guUnidadeFormTitulo').textContent = 'Nova unidade';
    setMsg('', '');
    elNome.focus();
  }

  function renderTabela() {
    const items = Array.isArray(cacheLocaisTrabalhoGestaoUnidade)
      ? cacheLocaisTrabalhoGestaoUnidade
      : [];

    if (!items.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="px-4 py-6 form-subtitle-sm text-center">
            Nenhuma unidade cadastrada.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(item => {
      const id = item.ID ?? item.id ?? '';
      const nome = escapeHtml(item.NOME ?? item.nome ?? '');
      const endereco = escapeHtml(item.ENDERECO ?? item.endereco ?? '');
      const telefone = escapeHtml(item.TELEFONE ?? item.telefone ?? '');

      return `
        <tr class="border-t border-border/70">
          <td class="px-4 py-3 font-medium">${nome}</td>
          <td class="px-4 py-3">${endereco || '-'}</td>
          <td class="px-4 py-3">${telefone || '-'}</td>
          <td class="px-4 py-3">
            <div class="flex justify-end gap-2">
              <button class="btnEditarUnidadeTrabalho w-10 h-10 rounded-xl border border-border bg-white60 hover:bg-white transition-all"
                data-id="${escapeHtml(String(id))}" title="Editar" aria-label="Editar">
                <i class="fas fa-pen" aria-hidden="true"></i>
              </button>

              <button class="btnExcluirUnidadeTrabalho w-10 h-10 rounded-xl border border-border bg-white60 hover:bg-red-500 hover:text-white transition-all"
                data-id="${escapeHtml(String(id))}" title="Excluir" aria-label="Excluir">
                <i class="fas fa-trash" aria-hidden="true"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  

  async function carregarLista() {
    try {
      const unidadesResp = await apiGet('/api/gestao-usuarios-locais-trabalho');
      cacheLocaisTrabalhoGestaoUnidade = Array.isArray(unidadesResp?.items) ? unidadesResp.items : [];
      renderTabela();
    } catch (err) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="px-4 py-6 text-sm text-destructive text-center">
            Erro ao carregar unidades de trabalho.
          </td>
        </tr>
      `;
      setMsg(err?.message || 'Erro ao carregar unidades.', 'erro');
    }
  }

  overlay.addEventListener('click', fecharModalUnidadeTrabalho);
  modal.querySelector('#btnFecharModalUnidadeTrabalho')?.addEventListener('click', fecharModalUnidadeTrabalho);
  modal.querySelector('#btnNovaUnidadeTrabalho')?.addEventListener('click', limparFormulario);
  modal.querySelector('#btnAtualizarListaUnidadeTrabalho')?.addEventListener('click', carregarLista);

  elTelefone?.addEventListener('input', () => {
    elTelefone.value = formatarCelularBR(elTelefone.value);
  });

  modal.querySelector('#btnSalvarUnidadeTrabalho')?.addEventListener('click', async () => {
    const id = String(elId.value || '').trim();
    const nome = titleCaseNome(elNome.value || '');
    const endereco = String(elEndereco.value || '').trim();
    const telefone = normalizarTelefoneUnidade(elTelefone.value || '');

    if (!nome) {
      setMsg('Informe o nome da unidade de trabalho.', 'erro');
      elNome.focus();
      return;
    }

    try {
      setMsg('', '');

      if (id) {
        await apiSend(`/api/gestao-usuarios-locais-trabalho/${encodeURIComponent(id)}`, 'PUT', {
          nome,
          endereco,
          telefone
        });
        setMsg('Unidade de trabalho atualizada com sucesso.', 'ok');
      } else {
        await apiSend('/api/gestao-usuarios-locais-trabalho', 'POST', {
          nome,
          endereco,
          telefone
        });
        setMsg('Unidade de trabalho cadastrada com sucesso.', 'ok');
      }

      await carregarLista();
      await recarregarUnidadesTrabalho(nome);
      limparFormulario();
      const sel = document.getElementById('guUnidadeTrabalho');
      if (sel) sel.value = nome;
    } catch (err) {
      setMsg(err?.message || 'Erro ao salvar unidade de trabalho.', 'erro');
    }
  });

  tbody.addEventListener('click', async (e) => {
    const btnEdit = e.target.closest('.btnEditarUnidadeTrabalho');
    const btnDel = e.target.closest('.btnExcluirUnidadeTrabalho');

    if (btnEdit) {
      const id = String(btnEdit.dataset.id || '');
      const item = (cacheLocaisTrabalhoGestaoUnidade || []).find(x => String(x.ID ?? x.id) === id);
      if (!item) return;

      elId.value = String(item.ID ?? item.id ?? '');
      elNome.value = String(item.NOME ?? item.nome ?? '');
      elEndereco.value = String(item.ENDERECO ?? item.endereco ?? '');
      elTelefone.value = String(item.TELEFONE ?? item.telefone ?? '');
      modal.querySelector('#guUnidadeFormTitulo').textContent = 'Editar unidade';
      setMsg('', '');
      elNome.focus();
      return;
    }

    if (btnDel) {
      const id = String(btnDel.dataset.id || '');
      const item = (cacheLocaisTrabalhoGestaoUnidade || []).find(x => String(x.ID ?? x.id) === id);
      const nome = String(item?.NOME ?? item?.nome ?? '');

      if (!confirm(`Deseja excluir a unidade de trabalho "${nome}"?`)) return;

      try {
        await apiSend(`/api/gestao-usuarios-locais-trabalho/${encodeURIComponent(id)}`, 'DELETE');
        setMsg('Unidade de trabalho excluída com sucesso.', 'ok');
        await carregarLista();
        await recarregarUnidadesTrabalho('');
      } catch (err) {
        setMsg(err?.message || 'Erro ao excluir unidade de trabalho.', 'erro');
      }
    }
  });

  await carregarLista();
  limparFormulario();
}

function gerarTemplateExcelUsuarios() {
  try {
    // Definir os dados do template com as novas colunas
    const templateData = [
      [
        'NOME',
        'CPF',
        'DATA NASCIMENTO',
        'DATA ADMISSÃO',
        'FUNÇÃO',
        'SETOR',
        'PERFIL',
        'STATUS',
        'CENTRO CUSTO',
        'UNIDADE TRABALHO'
      ],
      [
        'João Silva',
        '123.456.789-00',
        '01/01/1990',
        '15/01/2024',
        'Analista de TI',
        'Administrativo',
        'Usuário',
        'Ativo',
        'Almoxarifado',
        'Fazenda Santa Lucia'
      ],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '']
    ];

    // Criar workbook
    const ws = XLSX.utils.aoa_to_sheet(templateData);

    // Definir largura das colunas
    ws['!cols'] = [
      { wch: 25 }, // NOME
      { wch: 18 }, // CPF
      { wch: 18 }, // DATA NASCIMENTO
      { wch: 18 }, // DATA ADMISSÃO
      { wch: 20 }, // FUNÇÃO
      { wch: 20 }, // SETOR
      { wch: 18 }, // PERFIL
      { wch: 15 }, // STATUS
      { wch: 20 }, // CENTRO CUSTO
      { wch: 25 }  // UNIDADE TRABALHO
    ];

    // Estilo do header
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, size: 12 },
      fill: { fgColor: { rgb: '25348D' } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } }
      }
    };

    // Estilo do exemplo
    const exemploStyle = {
      font: { color: { rgb: '000000' }, italic: false },
      fill: { fgColor: { rgb: 'E8F0FF' } },
      alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
      border: {
        top: { style: 'thin', color: { rgb: 'CCCCCC' } },
        bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
        left: { style: 'thin', color: { rgb: 'CCCCCC' } },
        right: { style: 'thin', color: { rgb: 'CCCCCC' } }
      }
    };

    // Estilo das linhas vazias
    const linhaVaziaStyle = {
      border: {
        top: { style: 'thin', color: { rgb: 'CCCCCC' } },
        bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
        left: { style: 'thin', color: { rgb: 'CCCCCC' } },
        right: { style: 'thin', color: { rgb: 'CCCCCC' } }
      },
      alignment: { horizontal: 'left', vertical: 'center', wrapText: true }
    };

    // Aplicar estilos às células
    const numColunas = 10; // 10 colunas agora

    for (let col = 0; col < numColunas; col++) {
      // Header (linha 1)
      const cellHeader = XLSX.utils.encode_col(col) + '1';
      if (ws[cellHeader]) {
        ws[cellHeader].s = headerStyle;
      }

      // Exemplo (linha 2)
      const cellExemplo = XLSX.utils.encode_col(col) + '2';
      if (ws[cellExemplo]) {
        ws[cellExemplo].s = exemploStyle;
      }

      // Linhas vazias (3 a 6)
      for (let row = 3; row <= 6; row++) {
        const cellVazia = XLSX.utils.encode_col(col) + row;
        if (!ws[cellVazia]) {
          ws[cellVazia] = { v: '', s: linhaVaziaStyle };
        } else {
          ws[cellVazia].s = linhaVaziaStyle;
        }
      }
    }

    // Congelar a linha do header
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Criar workbook e adicionar sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuários');

    // Adicionar instrução em outra aba
    const wsInstrucoes = XLSX.utils.aoa_to_sheet([
      ['INSTRUÇÕES PARA PREENCHIMENTO DO TEMPLATE'],
      [''],
      ['Campos obrigatórios (marcados com *):'],
      ['- NOME: Nome completo do usuário'],
      ['- DATA NASCIMENTO: Data no formato DD/MM/YYYY'],
      ['- SETOR: Nome do setor (deve existir no sistema)'],
      ['- PERFIL: Perfil de acesso (Admin, Usuário, etc)'],
      ['- STATUS: Ativo ou Inativo'],
      [''],
      ['Campos opcionais:'],
      ['- CPF: Número do CPF (com ou sem máscara)'],
      ['- DATA ADMISSÃO: Data de admissão (DD/MM/YYYY)'],
      ['- FUNÇÃO: Cargo/Função do usuário'],
      ['- CENTRO CUSTO: Centro de custo (almoxarifado, etc)'],
      ['- UNIDADE TRABALHO: Localidade de trabalho'],
      [''],
      ['Observações:'],
      ['- A senha inicial será 123456 para todos os novos usuários'],
      ['- Cada linha será um novo usuário no sistema'],
      ['- Verifique se todos os setores e perfis existem antes de importar']
    ]);

    XLSX.utils.book_append_sheet(wb, wsInstrucoes, 'Instruções');

    // Baixar arquivo
    XLSX.writeFile(wb, `template-usuarios-${new Date().toISOString().split('T')[0]}.xlsx`);

  } catch (err) {
    console.error('Erro ao gerar template de usuários:', err);
    alert('Não foi possível gerar o template. Verifique a biblioteca SheetJS.');
  }
}

// Vincular o botão
document.addEventListener('DOMContentLoaded', () => {
  const btnBaixar = document.getElementById('btnBaixarTemplateUsuario');
  if (btnBaixar) {
    btnBaixar.addEventListener('click', gerarTemplateExcelUsuarios);
  }
});

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('#btnAddUnidadeTrabalhoExterno');
  if (!btn) return;

  e.preventDefault();

  try {
    await abrirModalUnidadeTrabalho();
  } catch (err) {
    alert('Erro ao abrir gerenciamento de Unidade de Trabalho: ' + (err?.message || err));
  }
});


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

  return;
  
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
              <h3 class="form-title-sm font-semibold text-foreground">Alterar foto</h3>
              <p class="form-subtitle-sm">Selecione e ajuste sua foto de perfil.</p>
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
              <label class="form-label-sm block">Foto do usuário</label>

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
                class="sm:flex-1 rounded-xl border border-border bg-white/50 form-control-sm font-medium hover:bg-white/70 transition-all">
                Cancelar
              </button>
              <button
                id="btnSalvarTrocarFoto"
                type="submit"
                class="sm:flex-1 rounded-xl bg-primary text-white form-control-sm font-medium hover:opacity-90 transition-all">
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

// =========================
// MARKETING
// =========================

let marketingCardsCache = [];
let marketingEditandoId = null;
let marketingImagemAtual = '';

function absUrlFromApiMarketing(relOrAbs, apiBase = getApiBase()) {
  const s = String(relOrAbs || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;

  try {
    const base = String(apiBase || '').replace(/\/$/, '');
    return new URL(s.replace(/^\/+/, ''), `${base}/`).href;
  } catch {
    return s;
  }
}

function obterFallbackMarketing() {
  return absUrlFromApiMarketing('anexos/marketing/imagensPaginaPrincipal.jpg', getApiBase());
}

function mostrarMsgMarketing(msg) {
  const el = document.getElementById('marketingMsg');
  if (!el) return;
  el.textContent = msg || '';
  el.classList.toggle('hidden', !msg);
}

function abrirModalMarketing() {
  document.getElementById('modalMarketingOverlay')?.classList.remove('hidden');
  document.getElementById('modalMarketing')?.classList.remove('hidden');
}

function fecharModalMarketing() {
  document.getElementById('modalMarketingOverlay')?.classList.add('hidden');
  document.getElementById('modalMarketing')?.classList.add('hidden');
}

function limparFormularioMarketing() {
  marketingEditandoId = null;
  marketingImagemAtual = '';

  document.getElementById('modalMarketingTitulo').textContent = 'Novo card de marketing';
  document.getElementById('mkTitulo').value = '';
  document.getElementById('mkDescricao').value = '';
  document.getElementById('mkCard').value = 'principal';
  document.getElementById('mkDataInicio').value = '';
  document.getElementById('mkDataFim').value = '';
  document.getElementById('mkOrdem').value = '0';
  document.getElementById('mkRecorrencia').value = 'once';
  document.getElementById('mkAtivo').value = '1';
  document.getElementById('mkExibirPainel').checked = true;
  document.getElementById('mkApenasUmaVez').checked = false;
  document.getElementById('mkArquivo').value = '';

  const preview = document.getElementById('mkPreview');
  const vazio = document.getElementById('mkPreviewVazio');

  if (preview) {
    preview.src = '';
    preview.classList.add('hidden');
  }
  if (vazio) vazio.classList.remove('hidden');
}

function abrirModalMarketingParaNovo() {
  limparFormularioMarketing();
  abrirModalMarketing();
}

async function salvarCardMarketing() {
  const APIBASE = getApiBase();
  const formData = new FormData();

  formData.append('titulo', document.getElementById('mkTitulo').value.trim());
  formData.append('descricao', document.getElementById('mkDescricao').value.trim());
  formData.append('card', document.getElementById('mkCard').value);
  formData.append('dataInicio', document.getElementById('mkDataInicio').value);
  formData.append('dataFim', document.getElementById('mkDataFim').value);
  formData.append('ordem', document.getElementById('mkOrdem').value || 0);
  formData.append('recorrencia', document.getElementById('mkRecorrencia').value);
  formData.append('ativo', document.getElementById('mkAtivo').value);
  formData.append('exibirNoPainel', document.getElementById('mkExibirPainel').checked ? 1 : 0);
  formData.append('apenasUmaVez', document.getElementById('mkApenasUmaVez').checked ? 1 : 0);

  const arquivo = document.getElementById('mkArquivo')?.files?.[0];
  if (!marketingEditandoId && !arquivo) {
    alert('Selecione uma imagem.');
    return;
  }

  if (arquivo) formData.append('file', arquivo);

  const url = marketingEditandoId
    ? `${APIBASE}/api/marketing/cards/${marketingEditandoId}`
    : `${APIBASE}/api/marketing/cards`;

  const method = marketingEditandoId ? 'PUT' : 'POST';

  const resp = await fetch(url, { method, body: formData });
  const data = await resp.json().catch(() => ({}));

  if (!resp.ok || !data?.success) {
    throw new Error(data?.message || 'Erro ao salvar card.');
  }

  fecharModalMarketing();
  limparFormularioMarketing();
  await listarCardsMarketing();
  mostrarMsgMarketing('Card salvo com sucesso.');
}

async function listarCardsMarketing() {
  const APIBASE = getApiBase();
  const resp = await fetch(`${APIBASE}/api/marketing/cards`);
  const data = await resp.json().catch(() => ({}));

  if (!resp.ok || !data?.success) {
    throw new Error(data?.message || 'Erro ao listar cards.');
  }

  marketingCardsCache = Array.isArray(data.items) ? data.items : [];
  renderizarCardsMarketing();
}

function obterCardsMarketingFiltrados() {
  const busca = (document.getElementById('inputBuscaMarketing')?.value || '').trim().toLowerCase();
  const status = document.getElementById('filtroStatusMarketing')?.value || '';
  const recorrencia = document.getElementById('filtroRecorrenciaMarketing')?.value || '';

  return marketingCardsCache.filter(item => {
    const titulo = String(item.TITULO || item.titulo || '').toLowerCase();
    const card = String(item.CARD || item.card || '').toLowerCase();
    const rec = String(item.RECORRENCIA || item.recorrencia || '').toLowerCase();
    const ativo = String(item.ATIVO ?? item.ativo ?? '');

    const passouBusca = !busca || titulo.includes(busca) || card.includes(busca) || rec.includes(busca);
    const passouStatus = !status || ativo === status;
    const passouRecorrencia = !recorrencia || rec === recorrencia;

    return passouBusca && passouStatus && passouRecorrencia;
  });
}

function atualizarPaineisMarketing(lista = marketingCardsCache) {
  const total = lista.length;
  const ativosPainel = lista.filter(x =>
    Number(x.ATIVO ?? x.ativo ?? 0) === 1 &&
    Number(x.EXIBIRNOPAINEL ?? x.exibirNoPainel ?? 0) === 1
  ).length;
  const agendados = lista.filter(x => (x.DATAINICIO || x.dataInicio || x.DATAFIM || x.dataFim)).length;
  const recorrentes = lista.filter(x => {
    const r = String(x.RECORRENCIA || x.recorrencia || '').toLowerCase();
    return r && r !== 'once';
  }).length;

  const elTotal = document.getElementById('marketingTotalCards');
  const elAtivos = document.getElementById('marketingTotalAtivos');
  const elAgendados = document.getElementById('marketingTotalAgendados');
  const elRecorrentes = document.getElementById('marketingTotalRecorrentes');

  if (elTotal) elTotal.textContent = total;
  if (elAtivos) elAtivos.textContent = ativosPainel;
  if (elAgendados) elAgendados.textContent = agendados;
  if (elRecorrentes) elRecorrentes.textContent = recorrentes;
}

function criarCardMarketing(item) {
  const el = document.createElement('div');
  const id = item.ID || item.id;
  const titulo = item.TITULO || item.titulo || 'Sem título';
  const descricao = item.DESCRICAO || item.descricao || '';
  const APIBASE = getApiBase();
  const url = absUrlFromApiMarketing(item.URL || item.url || '', APIBASE);
  const card = item.CARD || item.card || '-';
  const recorrencia = item.RECORRENCIA || item.recorrencia || '-';
  const ativo = Number(item.ATIVO ?? item.ativo ?? 1);

  el.className = 'rounded-xl border border-border bg-white/70 p-3 shadow-sm';
  el.innerHTML = `
    <div class="rounded-lg overflow-hidden border border-border bg-muted/30 mb-2">
      <img src="${escapeHtml(url)}" alt="${escapeHtml(titulo)}" class="w-full h-28 object-cover">
    </div>

    <div class="space-y-1">
      <div class="text-sm font-semibold text-foreground truncate">${escapeHtml(titulo)}</div>
      <div class="text-xs text-muted-foreground min-h-[32px]">${escapeHtml(descricao || 'Sem descrição')}</div>

      <div class="flex flex-wrap gap-1 pt-1">
        <span class="text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">${escapeHtml(card)}</span>
        <span class="text-[11px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">${escapeHtml(recorrencia)}</span>
        <span class="text-[11px] px-2 py-1 rounded-full ${ativo ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}">
          ${ativo ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div class="flex items-center gap-2 pt-2">
        <button type="button" class="btn-editar-marketing flex-1 rounded-lg border border-border bg-white hover:bg-white/90 px-3 py-2 text-xs font-medium transition-all" data-id="${id}">
          <i class="fas fa-pen mr-1"></i> Editar
        </button>
      </div>
    </div>
  `;
  return el;
}

function renderizarCardsMarketing() {
  const grid = document.getElementById('gridMarketing');
  const vazio = document.getElementById('marketingVazio');
  if (!grid || !vazio) return;

  const filtrados = obterCardsMarketingFiltrados();
  grid.innerHTML = '';

  atualizarPaineisMarketing(marketingCardsCache);

  if (!filtrados.length) {
    vazio.classList.remove('hidden');
    return;
  }

  vazio.classList.add('hidden');
  filtrados.forEach(item => grid.appendChild(criarCardMarketing(item)));
  vincularEventosCardsMarketing(filtrados);
}

function abrirModalMarketingParaEditar(item) {
  marketingEditandoId = item.ID || item.id || null;
  marketingImagemAtual = absUrlFromApiMarketing(item.URL || item.url || '', getApiBase()) || '';

  document.getElementById('modalMarketingTitulo').textContent = 'Editar card de marketing';
  document.getElementById('mkTitulo').value = item.TITULO || item.titulo || '';
  document.getElementById('mkDescricao').value = item.DESCRICAO || item.descricao || '';
  document.getElementById('mkCard').value = item.CARD || item.card || 'principal';
  document.getElementById('mkDataInicio').value = String(item.DATAINICIO || item.dataInicio || '').slice(0, 10);
  document.getElementById('mkDataFim').value = String(item.DATAFIM || item.dataFim || '').slice(0, 10);
  document.getElementById('mkOrdem').value = item.ORDEM ?? item.ordem ?? 0;
  document.getElementById('mkRecorrencia').value = item.RECORRENCIA || item.recorrencia || 'once';
  document.getElementById('mkAtivo').value = String(item.ATIVO ?? item.ativo ?? 1);
  document.getElementById('mkExibirPainel').checked = Number(item.EXIBIRNOPAINEL ?? item.exibirNoPainel ?? 1) === 1;
  document.getElementById('mkApenasUmaVez').checked = Number(item.APENASUMAVEZ ?? item.apenasUmaVez ?? 0) === 1;

  const preview = document.getElementById('mkPreview');
  const vazio = document.getElementById('mkPreviewVazio');

  if (marketingImagemAtual) {
    preview.src = marketingImagemAtual;
    preview.classList.remove('hidden');
    vazio.classList.add('hidden');
  } else {
    preview.src = '';
    preview.classList.add('hidden');
    vazio.classList.remove('hidden');
  }

  abrirModalMarketing();
}

function vincularEventosCardsMarketing(lista) {
  document.querySelectorAll('.btn-editar-marketing').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = String(btn.dataset.id);
      const item = lista.find(x => String(x.ID || x.id) === id);
      if (item) abrirModalMarketingParaEditar(item);
    });
  });
}

function inicializarMarketingCards() {
  document.getElementById('btnNovoCardMarketing')?.addEventListener('click', abrirModalMarketingParaNovo);
  document.getElementById('btnNovoCardMarketingVazio')?.addEventListener('click', abrirModalMarketingParaNovo);
  document.getElementById('btnCancelarModalMarketing')?.addEventListener('click', fecharModalMarketing);
  document.getElementById('btnFecharModalMarketing')?.addEventListener('click', fecharModalMarketing);
  document.getElementById('btnSalvarModalMarketing')?.addEventListener('click', salvarCardMarketing);

  document.getElementById('btnAtualizarMarketing')?.addEventListener('click', () => {
    listarCardsMarketing().catch(err => {
      console.error(err);
      mostrarMsgMarketing(err?.message || 'Erro ao listar cards.');
    });
  });

  document.getElementById('inputBuscaMarketing')?.addEventListener('input', renderizarCardsMarketing);
  document.getElementById('filtroStatusMarketing')?.addEventListener('change', renderizarCardsMarketing);
  document.getElementById('filtroRecorrenciaMarketing')?.addEventListener('change', renderizarCardsMarketing);

  document.getElementById('mkArquivo')?.addEventListener('change', function () {
    const file = this.files?.[0];
    const preview = document.getElementById('mkPreview');
    const vazio = document.getElementById('mkPreviewVazio');
    if (!file || !preview || !vazio) return;

    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.classList.remove('hidden');
      vazio.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  });

  document.addEventListener('click', e => {
    const item = e.target.closest('.menu-item[data-page]');
    if (!item) return;

    if (item.dataset.page === 'secao-marketing') {
      listarCardsMarketing().catch(err => {
        console.error(err);
        mostrarMsgMarketing(err?.message || 'Erro ao listar cards.');
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', inicializarMarketingCards);

// =========================
// MARKETING - PAINEL HOME
// =========================

let marketingProgressTimer = null;
let marketingLoopIndex = 0;
let marketingLoopCards = [];
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
  const barra = document.getElementById('painelMarketingProgress');
  if (!barra) return;

  barra.style.backgroundColor = isHomologacaoAmbiente() ? '#dc2626' : '';
}

function obterBarraProgressoMarketing() {
  return document.getElementById('painelMarketingProgress');
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

function limparTimerMarketing() {
  if (marketingLoopTimer) {
    clearTimeout(marketingLoopTimer);
    marketingLoopTimer = null;
  }
}

function atualizarBarraProgressoMarketing(percentual) {
  const bar = document.getElementById('painelMarketingProgress');
  if (!bar) return;
  bar.style.width = `${Math.max(0, Math.min(100, percentual))}%`;
}

function pararAnimacaoProgressoMarketing() {
  if (marketingProgressTimer) clearInterval(marketingProgressTimer);
  marketingProgressTimer = null;
}

function obterTotalSlidesMarketing() {
  const gruposAniversariantes = agruparAniversariantesPorPagina(marketingBirthdayItems);
  return gruposAniversariantes.length + marketingLoopCards.length || 1;
}

function atualizarContadorMarketingPainel() {
  const contador = document.getElementById('painelMarketingContador');
  if (!contador) return;

  const total = obterTotalSlidesMarketing() || 1;
  const atual = total ? (marketingLoopIndex % total) + 1 : 1;
  contador.textContent = `${atual} / ${total}`;
}

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
}

async function fetchMarketingPainelCards() {
  const APIBASE = getApiBase();
  const r = await fetch(`${APIBASE}/api/marketing/painel`, { method: 'GET' });
  const data = await r.json().catch(() => null);

  if (!r.ok || !data?.success) {
    throw new Error(data?.message || 'Erro ao listar cards do painel.');
  }

  const itens = Array.isArray(data.items) ? data.items : [];

  return itens.map(item => ({
    id: item.id,
    titulo: item.titulo || '',
    descricao: item.descricao || '',
    card: item.card || 'principal',
    url: absUrlFromApiMarketing(item.url, APIBASE),
    recorrencia: item.recorrencia || 'once',
    apenasUmaVez: Number(item.apenasUmaVez || 0)
  }));
}

async function marcarCardMarketingComoExibido(id) {
  const APIBASE = getApiBase();
  await fetch(`${APIBASE}/api/marketing/cards/${id}/exibido`, { method: 'PATCH' });
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
      return { ano: Number(mysql[1]), mes: Number(mysql[2]), dia: Number(mysql[3]) };
    }

    const br = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br) {
      return { ano: Number(br[3]), mes: Number(br[2]), dia: Number(br[1]) };
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

function obterQuantidadeAniversariantesPorPagina() {
  const largura = window.innerWidth;
  const altura = window.innerHeight;

  if (largura <= 640) return 4;

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

function pausarLoopMarketingPainel() {
  if (marketingLoopPaused) return;

  marketingLoopPaused = true;

  const agora = Date.now();
  const decorrido = marketingLoopStartAt ? agora - marketingLoopStartAt : 0;
  marketingLoopRemainingMs = Math.max(0, marketingLoopRemainingMs - decorrido);

  limparTimerMarketing();
  pararAnimacaoBarraMarketing();
  pararAnimacaoProgressoMarketing();
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

window.fecharBirthdayDetalhe = fecharBirthdayDetalhe;
window.abrirBirthdayDetalhe = abrirBirthdayDetalhe;

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

  marketingLoopCards.forEach(card => {
    slides.push({
      tipo: 'imagem',
      ...card
    });
  });

  if (!slides.length) {
    slides.push({
      tipo: 'fallback',
      url: obterFallbackMarketing()
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
    renderBirthdayCardMarketing(slide.items, {
      pagina: slide.pagina,
      totalPaginas: slide.totalPaginas,
      expandido: false
    });
    return;
  }

  marketingMostrandoBirthdayCard = false;
  esconderBirthdayCardMarketing();
  mostrarImagemMarketingArea();

  const url = slide.url || obterFallbackMarketing();

  preloadImage(url)
    .then(async () => {
      imgEl.style.opacity = 0;

      setTimeout(async () => {
        imgEl.style.display = 'block';
        imgEl.src = url;
        imgEl.dataset.currentUrl = url;
        imgEl.style.opacity = 1;

        if (slide.tipo === 'imagem' && Number(slide.apenasUmaVez) === 1 && slide.id) {
          try {
            await marcarCardMarketingComoExibido(slide.id);
          } catch (err) {
            console.error('Erro ao marcar card exibido:', err);
          }
        }

        atualizarContadorMarketingPainel();

        if (reiniciarTempo) {
          agendarProximoSlideMarketingPainel(marketingLoopIntervalMs);
        }
      }, 150);
    })
    .catch(() => {
      const fallback = obterFallbackMarketing();
      imgEl.style.display = 'block';
      imgEl.src = fallback;
      imgEl.dataset.currentUrl = fallback;
      imgEl.style.opacity = 1;
      atualizarContadorMarketingPainel();

      if (reiniciarTempo) {
        agendarProximoSlideMarketingPainel(marketingLoopIntervalMs);
      }
    });
}

let resizeBirthdayTimer = null;

window.addEventListener('resize', () => {
  clearTimeout(resizeBirthdayTimer);

  resizeBirthdayTimer = setTimeout(() => {
    exibirSlideMarketing(marketingLoopIndex, { reiniciarTempo: true });
  }, 180);
});

async function proximoSlideMarketingPainel() {
  if (marketingBirthdayExpandedItem || marketingLoopPaused) return;

  try {
    await ensureListFreshGlobal();

    if (marketingBirthdayExpandedItem || marketingLoopPaused) return;

    limparTimerMarketing();
    pararAnimacaoBarraMarketing();
    resetarBarraMarketing();

    marketingLoopRemainingMs = marketingLoopIntervalMs;

    exibirSlideMarketing(marketingLoopIndex + 1, { reiniciarTempo: false });
    agendarProximoSlideMarketingPainel(marketingLoopIntervalMs);
  } catch (err) {
    console.error('Erro ao avançar slide do marketing:', err);
    marketingLoopRemainingMs = marketingLoopIntervalMs;
    agendarProximoSlideMarketingPainel(marketingLoopIntervalMs);
  }
}

async function ensureListFreshGlobal(refreshListEveryMs = 60000, fallbackSrc = obterFallbackMarketing()) {
  const now = Date.now();

  if (
    now - marketingLoopLastFetchMs < refreshListEveryMs &&
    (marketingLoopCards.length || marketingBirthdayItems.length)
  ) {
    return;
  }

  marketingLoopLastFetchMs = now;

  try {
    const slideAtualInfo = obterSlidePorIndice(marketingLoopIndex);
    const slideAtualTipo = slideAtualInfo?.slide?.tipo;
    const slideAtualId = slideAtualInfo?.slide?.id || null;
    const slideAtualBirthdayPagina = slideAtualInfo?.slide?.pagina || 1;

    const [cardsPainel, aniversariantes] = await Promise.all([
      fetchMarketingPainelCards().catch(() => []),
      fetchAniversariantesMes().catch(() => [])
    ]);

    marketingLoopCards = Array.isArray(cardsPainel) ? cardsPainel : [];
    marketingBirthdayItems = Array.isArray(aniversariantes) ? aniversariantes : [];

    const gruposAnivers = agruparAniversariantesPorPagina(marketingBirthdayItems);

    if (slideAtualTipo === 'birthday' && gruposAnivers.length) {
      marketingLoopIndex = Math.max(0, Math.min(slideAtualBirthdayPagina - 1, gruposAnivers.length - 1));
    } else if (slideAtualTipo === 'imagem' && slideAtualId != null) {
      const idxImagem = marketingLoopCards.findIndex(x => String(x.id) === String(slideAtualId));
      marketingLoopIndex = idxImagem >= 0 ? gruposAnivers.length + idxImagem : 0;
    } else {
      marketingLoopIndex = 0;
    }

    const totalNovo = obterTotalSlidesMarketing() || 1;
    if (marketingLoopIndex >= totalNovo) {
      marketingLoopIndex = 0;
    }

    atualizarContadorMarketingPainel();
  } catch (err) {
    console.error('Erro ao atualizar lista do marketing:', err);
    marketingLoopCards = [];
    marketingBirthdayItems = [];
    marketingLoopIndex = 0;

    const el = document.getElementById('painelMarketingImg');
    if (el) {
      el.src = fallbackSrc;
      el.dataset.currentUrl = fallbackSrc;
    }

    atualizarBarraProgressoMarketing(0);
    atualizarContadorMarketingPainel();
  }
}

async function iniciarLoopMarketingPainel({
  imgId = 'painelMarketingImg',
  fallbackSrc = obterFallbackMarketing(),
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
    return ensureListFreshGlobal(refreshListEveryMs, fallbackSrc);
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
}

function isHomologacaoAmbiente() {
  const apiBase = String(
    sessionStorage.getItem('api_base') ||
    sessionStorage.getItem('apibase') ||
    ''
  ).toLowerCase();

  return (
    apiBase.includes('copy') ||
    apiBase.includes('homolog') ||
    apiBase.includes('hml')
  );
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarAmbienteLabel();
  atualizarCorBotoesAgendamento();
  aplicarCorBarraMarketingPorApiBase();
});

function atualizarAmbienteLabel() {
  const el = document.getElementById('ambienteLabel');
  if (!el) return;

  const isHomolog = isHomologacaoAmbiente();
  el.textContent = isHomolog ? 'Homologação' : 'Produção';
  el.style.color = isHomolog ? '#dc2626' : '#16a34a';
  el.style.fontWeight = '700';
}

function atualizarCorBotoesAgendamento() {
  const isHomolog = isHomologacaoAmbiente();
  const bg = isHomolog ? '#dc2626' : '';
  const border = isHomolog ? '#dc2626' : '';
  const color = isHomolog ? '#ffffff' : '';

  ['AgendarSalaReuniao', 'AgendarCarro', 'btnPainelAnterior', 'btnPainelProximo'].forEach(id => {
    const botao = document.getElementById(id);
    if (!botao) return;

    botao.style.backgroundColor = bg;
    botao.style.borderColor = border;
    botao.style.color = color;
  });

  document.querySelectorAll('.home-mobile-tab-btn').forEach(botao => {
    botao.style.backgroundColor = bg;
    botao.style.borderColor = border;
    botao.style.color = color;
  });
}

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
      abaDash.className = "px-4 py-2 rounded-lg form-label-sm transition-all bg-white shadow text-foreground";
      abaTab.className  = "px-4 py-2 rounded-lg form-label-sm transition-all text-muted-foreground hover:text-foreground";
    } else {
      abaTab.className  = "px-4 py-2 rounded-lg form-label-sm transition-all bg-white shadow text-foreground";
      abaDash.className = "px-4 py-2 rounded-lg form-label-sm transition-all text-muted-foreground hover:text-foreground";
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
    .replaceAll("'", '&#39;');
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
        <td class="px-4 py-6 form-subtitle-sm" colspan="5">Nenhum cliente encontrado.</td>
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
        <td class="form-control-sm font-medium">
          <div class="flex items-center gap-2">
            <i class="${iconClass} text-muted-foreground" aria-hidden="true"></i>
            <span>${escapeHtml(c.RAZAO_SOCIAL || '')}</span>
            ${badge}
          </div>
        </td>
        <td class="form-control-sm text-muted-foreground">${escapeHtml(docFmt)}</td>
        <td class="form-control-sm">${escapeHtml(cidadeUf)}</td>
        <td class="form-control-sm">${contatoNome}</td>
        <td class="form-control-sm">${escapeHtml(telFmt)}</td>
        <td class="form-control-sm">
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
                <label class="form-label-sm">CNPJ/CPF *</label>
                <input id="cliDocumento" required inputmode="numeric"
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(cliente?.DOCUMENTO || '')}" />
              </div>
              <div class="space-y-1">
                <label class="form-label-sm">Razão social *</label>
                <input id="cliRazao" required
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(cliente?.RAZAO_SOCIAL || '')}" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="form-label-sm">Grupo econômico</label>
              <input id="cliGrupo"
                class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                value="${escapeHtml(cliente?.GRUPO_ECONOMICO || '')}" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="form-label-sm">UF *</label>
                <select id="cliUF" required
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="" selected disabled>Selecione...</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="form-label-sm">Cidade *</label>
                <select id="cliCidade" required disabled
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="" selected disabled>Selecione a UF primeiro...</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="form-label-sm">Contato</label>
                <input id="cliContato"
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(cliente?.CONTATO_NOME || '')}" />
              </div>
              <div class="space-y-1">
                <label class="form-label-sm">Telefone</label>
                <input id="cliTelefone"
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(cliente?.CONTATO_TELEFONE || '')}" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="form-label-sm">Email</label>
                <input id="cliEmail" type="email"
                  class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                  value="${escapeHtml(cliente?.CONTATO_EMAIL || '')}" />
              </div>
              <div class="space-y-1">
                <label class="form-label-sm">Cultura principal</label>
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
              <label class="form-label-sm">Hectares estimados</label>
              <input id="cliHectares" type="number" min="0" step="1"
                class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                value="${escapeHtml((cliente?.HECTARES_ESTIMADOS ?? '') + '')}" />
            </div>

            <div class="space-y-1">
              <label class="form-label-sm">Observações</label>
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

              <div id="filiaisVazio" class="form-subtitle-sm text-center py-2">Nenhuma filial cadastrada</div>
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
          <p class="form-subtitle-sm">Deseja preencher automaticamente? Você ainda poderá editar depois.</p>
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
            <label class="form-label-sm">Nome *</label>
            <input class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              data-field="nome" data-idx="${idx}" value="${escapeHtml(f.nome || '')}" required />
          </div>

          <div class="space-y-1">
            <label class="form-label-sm">Endereço</label>
            <input class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              data-field="endereco" data-idx="${idx}" value="${escapeHtml(f.endereco || '')}" />
          </div>

          <div class="space-y-1">
            <label class="form-label-sm">UF *</label>
            <select id="filialUF_${idx}"
              class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              data-idx="${idx}" required>
              <option value="" disabled selected>Selecione...</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="form-label-sm">Cidade *</label>
            <select id="filialCidade_${idx}"
              class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              data-idx="${idx}" required disabled>
              <option value="" disabled selected>Selecione a UF primeiro...</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="form-label-sm">Contato</label>
            <input class="w-full rounded-xl border border-border bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
              data-field="contato_nome" data-idx="${idx}" value="${escapeHtml(f.contato_nome || '')}" />
          </div>

          <div class="space-y-1">
            <label class="form-label-sm">Telefone</label>
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
      <td class="form-control-sm font-mono text-xs">${idx + 1}</td>
      <td class="form-control-sm font-medium">${escapeHtml(rem.EMAIL)}</td>
      <td class="form-control-sm">${escapeHtml(rem.NOME || '')}</td>
      <td class="form-control-sm">${statusBadgeEmails(rem.ATIVO ? 'Ativo' : 'Inativo')}</td>
      <td class="form-control-sm">
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
      <td class="form-control-sm">${escapeHtml(dest.remetenteNome || 'N/D')}</td>
      <td class="form-control-sm font-medium">${escapeHtml(dest.EMAIL_DESTINATARIO)}</td>
      <td class="form-control-sm">${escapeHtml(dest.NOME_DESTINATARIO || '')}</td>
      <td class="form-control-sm">${statusBadgeEmails(dest.ATIVO ? 'Ativo' : 'Inativo')}</td>
      <td class="form-control-sm">
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
      ? '<tr><td colspan="5" class="px-4 py-6 form-subtitle-sm text-center">Nenhum remetente cadastrado</td></tr>'
      : remetentesFiltrados.map((r, i) => rowRemetente(r, i)).join('');
  }

  if (tbodyDest) {
    tbodyDest.innerHTML = !destinatariosFiltrados.length
      ? '<tr><td colspan="5" class="px-4 py-6 form-subtitle-sm text-center">Nenhum destinatário cadastrado</td></tr>'
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
      ? 'px-4 py-2 rounded-lg form-label-sm transition-all text-muted-foreground hover:text-foreground'
      : 'px-4 py-2 rounded-lg form-label-sm transition-all bg-white shadow text-foreground';
  }

  if (abaDest) {
    abaDest.setAttribute('aria-selected', mostrarDest ? 'true' : 'false');
    abaDest.className = mostrarDest
      ? 'px-4 py-2 rounded-lg form-label-sm transition-all bg-white shadow text-foreground'
      : 'px-4 py-2 rounded-lg form-label-sm transition-all text-muted-foreground hover:text-foreground';
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
              <h3 class="form-title-sm font-semibold text-foreground">${isEdit ? 'Editar remetente' : 'Novo remetente'}</h3>
              <p class="form-subtitle-sm">Preencha os dados abaixo</p>
            </div>
            <button id="btnFecharRemetente" type="button" class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center" aria-label="Fechar" title="Fechar">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form id="formRemetente" class="px-6 py-6 space-y-4">
            <div class="space-y-2">
              <label class="form-label-sm">Email <span class="text-destructive">*</span></label>
              <input id="remEmail" type="email" required 
                class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-info/30" 
                value="${escapeHtml(r.EMAIL || '')}" placeholder="exemplo@fornecedor.com">
            </div>
            
            <div class="space-y-2">
              <label class="form-label-sm">Nome (opcional)</label>
              <input id="remNome" type="text" 
                class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-info/30" 
                value="${escapeHtml(r.NOME || '')}" placeholder="Nome do remetente">
            </div>
            
            <p id="remErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>
            
            <div class="pt-2 flex flex-col sm:flex-row gap-3">
              <button id="btnSalvarRemetente" type="submit" class="sm:flex-1 rounded-xl bg-info text-white form-control-sm font-medium hover:opacity-90 transition-all">
                Salvar
              </button>
              <button id="btnCancelarRemetente" type="button" class="sm:flex-1 rounded-xl border border-border bg-white/50 form-control-sm font-medium hover:bg-white/70 transition-all">
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
              <h3 class="form-title-sm font-semibold text-foreground">${isEdit ? 'Editar destinatário' : 'Novo destinatário'}</h3>
              <p class="form-subtitle-sm">Preencha os dados abaixo</p>
            </div>
            <button id="btnFecharDest" type="button" class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center" aria-label="Fechar" title="Fechar">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form id="formDestinatario" class="px-6 py-6 space-y-4">
            <div class="space-y-2">
              <label class="form-label-sm">Remetente <span class="text-destructive">*</span></label>
              <select id="destRemetenteId" required class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-info/30">
                <option value="">Selecione...</option>
                ${remetentesParaSelect.map(r => `<option value="${r.id}" ${r.id == d.ID_REMETENTE ? 'selected' : ''}>${escapeHtml(r.nome)}</option>`).join('')}
              </select>
            </div>
            
            <div class="space-y-2">
              <label class="form-label-sm">Email Destinatário <span class="text-destructive">*</span></label>
              <input id="destEmail" type="email" required 
                class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-info/30" 
                value="${escapeHtml(d.EMAIL_DESTINATARIO || '')}">
            </div>
            
            <div class="space-y-2">
              <label class="form-label-sm">Nome Destinatário (opcional)</label>
              <input id="destNome" type="text" 
                class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-info/30" 
                value="${escapeHtml(d.NOME_DESTINATARIO || '')}">
            </div>
            
            <p id="destErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>
            
            <div class="pt-2 flex flex-col sm:flex-row gap-3">
              <button id="btnSalvarDest" type="submit" class="sm:flex-1 rounded-xl bg-info text-white form-control-sm font-medium hover:opacity-90 transition-all">
                Salvar
              </button>
              <button id="btnCancelarDest" type="button" class="sm:flex-1 rounded-xl border border-border bg-white/50 form-control-sm font-medium hover:bg-white/70 transition-all">
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
    'px-4 py-2 rounded-xl form-label-sm border border-border bg-white text-foreground shadow-sm transition-all';

  const classeInativa =
    'px-4 py-2 rounded-xl form-label-sm border border-border bg-white/40 text-muted-foreground hover:bg-white/70 transition-all';

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
      <td class="form-control-sm">${escapeHtml(codigo)}</td>
      <td class="form-control-sm">${escapeHtml(descricao)}</td>
      <td class="form-control-sm">${escapeHtml(qtdDisponivelTexto)}</td>
      <td class="form-control-sm">${escapeHtml(qtdPedidoTexto)}</td>
      <td class="form-control-sm">
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
        <td colspan="5" class="px-4 py-6 form-subtitle-sm">
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
  const btnLancamentoManualEstoque = document.getElementById('btnLancamentoManualEstoque');

  if (!usuarioId) {
    btnNovoProdutoEstoque?.classList.add('hidden');
    btnImportarPdfEstoque?.classList.add('hidden');
    abaEstoqueEscritorio?.classList.add('hidden');
    btnLancamentoManualEstoque?.classList.add('hidden');

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

    podeVerAlmoxarifado = permitido;

    if (permitido) {
      btnNovoProdutoEstoque?.classList.remove('hidden');
      btnImportarPdfEstoque?.classList.remove('hidden');
      abaEstoqueEscritorio?.classList.remove('hidden');
      btnLancamentoManualEstoque?.classList.remove('hidden');
      return true;
    }

    btnNovoProdutoEstoque?.classList.add('hidden');
    btnImportarPdfEstoque?.classList.add('hidden');
    abaEstoqueEscritorio?.classList.add('hidden');
    btnLancamentoManualEstoque?.classList.add('hidden');

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
    btnLancamentoManualEstoque?.classList.add('hidden');

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
          <td colspan="9" class="px-4 py-6 form-subtitle-sm text-center">
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
          <td class="form-control-sm text-sm">
            ${isSplit ? `<span class="inline-flex rounded-full border border-amber-300 bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700 mr-2">DESMEMBRADO</span>` : ''}
            ${escapeHtml(item._codigo || '')}
          </td>
          <td class="form-control-sm text-sm">${escapeHtml(item._descricao || '')}</td>
          <td class="form-control-sm text-sm text-center">${escapeHtml(item._unidade || '')}</td>
          <td class="form-control-sm text-sm text-right">${escapeHtml(item._quantidade || '')}</td>
          <td class="form-control-sm text-sm text-right">${escapeHtml(item._valorUnitario || '')}</td>
          <td class="form-control-sm text-sm text-right font-semibold">${escapeHtml(item._valorTotal || '')}</td>
          <td class="form-control-sm text-sm">${badgeVinculo(item)}</td>
          <td class="form-control-sm text-sm min-w-[320px]">${htmlProdutoSistema}</td>
          <td class="form-control-sm text-sm whitespace-nowrap">${htmlAcao}</td>
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
                <h3 class="form-title-sm font-semibold text-foreground">Importação de nota fiscal PDF</h3>
                <p class="form-subtitle-sm">Validação e leitura inicial do DANFE/NF-e.</p>
              </div>

              <button id="btnFecharModalNfePdf" type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <div class="px-6 py-4 border-b border-border flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div class="flex flex-wrap gap-2">
                <button id="nfePdfAbaDetalhes" type="button" class="px-4 py-2 rounded-xl form-label-sm border border-border bg-white text-foreground shadow-sm transition-all">
                  <i class="fas fa-receipt mr-2"></i> Detalhes
                </button>

                <button id="nfePdfAbaItens" type="button" class="px-4 py-2 rounded-xl form-label-sm border border-border bg-white/60 text-muted-foreground hover:bg-white/90 transition-all">
                  <i class="fas fa-list mr-2"></i> Itens (${itensTratados.length})
                </button>
              </div>

              <div class="w-full lg:w-auto lg:min-w-[420px]">
                <label class="block form-label-sm text-foreground mb-2">
                  Local de armazenagem
                </label>

                <div class="flex flex-col sm:flex-row gap-2">
                  <select
                    id="nfePdfLocalArmazenagem"
                    class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm text-foreground"
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
                      <div class="md:col-span-2 rounded-xl border border-border bg-white/70 form-control-sm">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Emitente</div>
                        <div class="mt-1 text-sm font-semibold text-foreground break-words">${escapeHtml(dados.emitente || '—')}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 form-control-sm">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Data emissão</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(dados.dataEmissao || '—')}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 form-control-sm">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">CNPJ/CPF</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(formatarCpfCnpj(dados.emitenteCnpj))}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 form-control-sm">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Número da nota</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(dados.numeroNota || '—')}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 form-control-sm">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Série</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(dados.serie || '—')}</div>
                      </div>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-border bg-white/50 p-5 shadow-sm space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div class="md:col-span-2 rounded-xl border border-border bg-white/70 form-control-sm">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Destinatário</div>
                        <div class="mt-1 text-sm font-semibold text-foreground break-words">${escapeHtml(dados.destinatario || '—')}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 form-control-sm">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">CNPJ/CPF</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(formatarCpfCnpj(dados.destinatarioCnpj))}</div>
                      </div>

                      <div class="rounded-xl border border-border bg-white/70 form-control-sm">
                        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">UF</div>
                        <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtml(dados.ufDestinatario || '—')}</div>
                      </div>

                      <div class="md:col-span-2 rounded-xl border border-border bg-white/70 form-control-sm">
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
                          <th class="form-control-sm text-left font-semibold text-foreground">Código</th>
                          <th class="form-control-sm text-left font-semibold text-foreground">Descrição</th>
                          <th class="form-control-sm text-center font-semibold text-foreground">UN</th>
                          <th class="form-control-sm text-right font-semibold text-foreground">Qtd</th>
                          <th class="form-control-sm text-right font-semibold text-foreground">Vlr. Unit.</th>
                          <th class="form-control-sm text-right font-semibold text-foreground">Vlr. Total</th>
                          <th class="form-control-sm text-left font-semibold text-foreground">Status</th>
                          <th class="form-control-sm text-left font-semibold text-foreground">Produto sistema</th>
                          <th class="form-control-sm text-left font-semibold text-foreground">Ação</th>
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
                class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all">
                Importar
              </button>

              <button id="btnFecharRodapeModalNfePdf" type="button"
                class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all">
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
                    <p class="form-subtitle-sm">Selecione o novo produto interno para este vínculo.</p>
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
                    <label class="block form-label-sm text-foreground mb-1">Código do item da nota</label>
                    <input
                      type="text"
                      class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                      value="${escapeHtml(item._codigo || '')}"
                      readonly
                    />
                  </div>

                  <div>
                    <label class="block form-label-sm text-foreground mb-1">Descrição do item da nota</label>
                    <input
                      type="text"
                      class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                      value="${escapeHtml(item._descricao || '')}"
                      readonly
                    />
                  </div>

                  <div>
                    <div class="flex items-center justify-between gap-2 mb-1">
                      <label class="block form-label-sm text-foreground">Produto do sistema</label>

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
                      class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      id="btnSalvarEditarVinculo"
                      class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all"
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
                    <p class="form-subtitle-sm">Selecione o produto interno e confirme a amarração.</p>
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
                      <div class="form-label-sm text-foreground">
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
                      <label class="block form-label-sm text-foreground">Produto interno</label>

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
                    <div class="form-subtitle-sm">Nenhum produto selecionado.</div>
                  </div>

                  <div class="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      id="btnCancelarConfirmacaoVinculo"
                      class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      id="btnConfirmarConfirmacaoVinculo"
                      class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all"
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
              <div class="form-subtitle-sm">Nenhum produto selecionado.</div>
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
                  <p class="form-subtitle-sm">Cadastro rápido para vincular o item da nota.</p>
                </div>

                <button type="button" id="btnFecharProdutoRapido"
                  class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
                  <i class="fas fa-times" aria-hidden="true"></i>
                </button>
              </div>

              <form id="formProdutoRapido" class="px-6 py-6 space-y-4">
                <div>
                  <label class="block form-label-sm text-foreground mb-1">Código</label>
                  <input
                    id="produtoRapidoCodigo"
                    type="text"
                    class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                    value="${escapeHtml(codigoGerado)}"
                    readonly
                  />
                </div>

                <div>
                  <label class="block form-label-sm text-foreground mb-1">Descrição</label>
                  <input
                    id="produtoRapidoDescricao"
                    type="text"
                    class="w-full rounded-xl border border-border bg-white/80 px-3 py-2"
                    value="${escapeHtml(normalizarTexto(item?._descricao).toUpperCase())}"
                    required
                  />
                </div>

                <div>
                  <label class="block form-label-sm text-foreground mb-1">Unidade</label>
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
                    class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all">
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    id="btnSalvarProdutoRapido"
                    class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all">
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
                <p class="form-subtitle-sm">Crie uma nova linha para o mesmo produto da nota.</p>
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
                <label class="block form-label-sm text-foreground mb-1">Nova quantidade</label>
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
                  class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all">
                  Cancelar
                </button>

                <button type="submit" id="btnSalvarDesmembrar"
                  class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all">
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
                <p class="form-subtitle-sm">Cadastre um novo local para uso na entrada.</p>
              </div>

              <button id="btnFecharNovoLocalArmazenagem" type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <form id="formNovoLocalArmazenagem" class="px-6 py-6 space-y-4">
              <div>
                <label class="block form-label-sm text-foreground mb-2">Nome do local</label>
                <input
                  id="novoLocalArmazenagemNome"
                  type="text"
                  maxlength="150"
                  class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                  placeholder="Ex.: PRATELEIRA A1"
                  required
                />
              </div>

              <div class="flex justify-end gap-2">
                <button type="button" id="btnCancelarNovoLocalArmazenagem"
                  class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all">
                  Cancelar
                </button>

                <button type="submit"
                  class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all">
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
                <p class="form-subtitle-sm">Cadastre um novo centro de custo.</p>
              </div>

              <button id="btnFecharNovoLocalArmazenagem" type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <form id="formNovoLocalArmazenagem" class="px-6 py-6 space-y-4">
              <div>
                <label class="block form-label-sm text-foreground mb-2">Nome do local</label>
                <input
                  id="novoLocalArmazenagemNome"
                  type="text"
                  maxlength="150"
                  class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                  placeholder="Ex.: PRATELEIRA A1"
                  required
                />
              </div>

              <div class="flex justify-end gap-2">
                <button type="button" id="btnCancelarNovoLocalArmazenagem"
                  class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all">
                  Cancelar
                </button>

                <button type="submit"
                  class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all">
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

function abrirModalConfirmacaoLancamentoManual(dados) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]';

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[160]';

    function escapeHtml(str) {
      return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    }

    function fechar(retorno = false) {
      overlay.remove();
      modal.remove();
      resolve(retorno);
    }

    modal.innerHTML = `
      <div class="w-full h-full overflow-auto">
        <div class="min-h-full flex items-center justify-center p-4">
          <div class="w-full max-w-xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Confirmar lançamento manual</h3>
                <p class="form-subtitle-sm">Revise os dados antes de salvar no estoque.</p>
              </div>

              <button
                type="button"
                id="btnFecharConfirmacaoLancamentoManual"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
              >
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <div class="px-6 py-6 space-y-4">
              <div class="rounded-2xl border border-border bg-white/60 p-4 space-y-3">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Resumo do lançamento</div>
                <div class="text-sm text-foreground"><strong>Código:</strong> ${escapeHtml(dados.codprodutosistema)}</div>
                <div class="text-sm text-foreground"><strong>Descrição:</strong> ${escapeHtml(dados.descricaoprodutosistema)}</div>
                <div class="text-sm text-foreground"><strong>Unidade:</strong> ${escapeHtml(dados.unidade)}</div>
                <div class="text-sm text-foreground"><strong>Quantidade:</strong> ${escapeHtml(formatarNumero(dados.quantidade, 4))}</div>
                <div class="text-sm text-foreground"><strong>Origem:</strong> MANUAL</div>
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  id="btnCancelarConfirmacaoLancamentoManual"
                  class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  id="btnConfirmarLancamentoManual"
                  class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all"
                >
                  Confirmar e salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    overlay.addEventListener('click', () => fechar(false));
    modal.querySelector('#btnFecharConfirmacaoLancamentoManual')?.addEventListener('click', () => fechar(false));
    modal.querySelector('#btnCancelarConfirmacaoLancamentoManual')?.addEventListener('click', () => fechar(false));
    modal.querySelector('#btnConfirmarLancamentoManual')?.addEventListener('click', () => fechar(true));
  });
}

function abrirModalLancamentoManualEstoque() {
  return new Promise(async (resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[140]';

    function fechar(retorno = null) {
      overlay.remove();
      modal.remove();
      resolve(retorno);
    }

    let produtosSistema = [];
    try {
      produtosSistema = await carregarProdutosSistema();
    } catch (error) {
      console.error('[Lançamento Manual] Erro ao carregar produtos:', error);
      alert(error?.message || 'Erro ao carregar produtos do sistema.');
      return resolve(null);
    }

    function escapeHtml(str) {
      return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
    }

    function gerarOpcoesProdutos(produtos = produtosSistema) {
      return produtos.map(prod => {
        const id = String(prod.id ?? prod.ID ?? '');
        const codigo = String(prod.codigo ?? prod.CODIGO ?? '');
        const descricao = String(prod.descricao ?? prod.DESCRICAO ?? '');
        const unidade = String(prod.unidade ?? prod.UNIDADE ?? '');

        return `
          <option value="${escapeHtml(id)}"
                  data-codigo="${escapeHtml(codigo)}"
                  data-descricao="${escapeHtml(descricao)}"
                  data-unidade="${escapeHtml(unidade)}">
            ${escapeHtml(codigo)} - ${escapeHtml(descricao)}
          </option>
        `;
      }).join('');
    }

    modal.innerHTML = `
      <div class="w-full h-full overflow-auto">
        <div class="min-h-full flex items-center justify-center p-4">
          <div class="w-full max-w-2xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Lançamento manual de item</h3>
                <p class="form-subtitle-sm">Informe os dados mínimos para entrada manual no estoque.</p>
              </div>

              <button
                type="button"
                id="btnFecharModalLancamentoManual"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
              >
                <i class="fas fa-times" aria-hidden="true"></i>
              </button>
            </div>

            <form id="formLancamentoManualEstoque" class="px-6 py-6 space-y-4">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <label class="block form-label-sm text-foreground">Produto sistema *</label>

                  <button
                    type="button"
                    id="btnNovoProdutoRapidoLancamentoManual"
                    title="Novo produto"
                    class="w-9 h-9 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-all flex items-center justify-center shrink-0"
                  >
                    <i class="fas fa-box-open" aria-hidden="true"></i>
                  </button>
                </div>

                <select
                  id="manualProdutoSistema"
                  class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                  required
                >
                  <option value="">Selecione...</option>
                  ${gerarOpcoesProdutos()}
                </select>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block form-label-sm text-foreground mb-2">Unidade de medida *</label>
                  <input
                    id="manualUnidadeMedida"
                    type="text"
                    maxlength="10"
                    class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                    placeholder="Ex. UN"
                    required
                  />
                </div>

                <div>
                  <label class="block form-label-sm text-foreground mb-2">Quantidade *</label>
                  <input
                    id="manualQuantidade"
                    type="text"
                    class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                    placeholder="Ex. 1,0000"
                    required
                  />
                </div>
              </div>

              <div id="resumoLancamentoManual" class="rounded-2xl border border-border bg-white/60 p-4 space-y-2">
                <div class="text-xs uppercase tracking-wide text-muted-foreground">Resumo</div>
                <div class="form-subtitle-sm">Selecione um produto para visualizar os dados.</div>
              </div>

              <div class="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  id="btnCancelarLancamentoManual"
                  class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  id="btnSalvarLancamentoManual"
                  class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all"
                >
                  Salvar lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const selectProduto = modal.querySelector('#manualProdutoSistema');
    const inputUnidade = modal.querySelector('#manualUnidadeMedida');
    const resumo = modal.querySelector('#resumoLancamentoManual');
    const btnNovoProdutoRapido = modal.querySelector('#btnNovoProdutoRapidoLancamentoManual');

    function atualizarSelectProdutos(produtoSelecionadoId = '') {
      if (!selectProduto) return;

      selectProduto.innerHTML = `
        <option value="">Selecione...</option>
        ${gerarOpcoesProdutos(produtosSistema)}
      `;

      if (produtoSelecionadoId) {
        selectProduto.value = String(produtoSelecionadoId);
      }
    }

    function atualizarResumo() {
      const option = selectProduto?.selectedOptions?.[0];
      const codigo = option?.dataset?.codigo || '';
      const descricao = option?.dataset?.descricao || '';
      const unidade = option?.dataset?.unidade || '';

      if (inputUnidade && unidade && !inputUnidade.value.trim()) {
        inputUnidade.value = unidade;
      }

      if (!selectProduto?.value) {
        resumo.innerHTML = `
          <div class="text-xs uppercase tracking-wide text-muted-foreground">Resumo</div>
          <div class="form-subtitle-sm">Selecione um produto para visualizar os dados.</div>
        `;
        return;
      }

      resumo.innerHTML = `
        <div class="text-xs uppercase tracking-wide text-muted-foreground">Resumo</div>
        <div class="text-sm text-foreground"><strong>Código:</strong> ${escapeHtml(codigo)}</div>
        <div class="text-sm text-foreground"><strong>Descrição:</strong> ${escapeHtml(descricao)}</div>
        <div class="text-sm text-foreground"><strong>Unidade padrão:</strong> ${escapeHtml(unidade)}</div>
      `;
    }

    overlay.addEventListener('click', () => fechar(null));
    modal.querySelector('#btnFecharModalLancamentoManual')?.addEventListener('click', () => fechar(null));
    modal.querySelector('#btnCancelarLancamentoManual')?.addEventListener('click', () => fechar(null));
    selectProduto?.addEventListener('change', atualizarResumo);

    btnNovoProdutoRapido?.addEventListener('click', async () => {
      try {
        btnNovoProdutoRapido.disabled = true;

        const itemBase = {
          _descricao: '',
          _unidade: inputUnidade?.value || 'UN'
        };


        const novoProduto = await criarProdutoRapido(itemBase);
        if (!novoProduto) return;


        produtosSistema = await carregarProdutosSistema();

        const novoId = String(novoProduto?.id ?? novoProduto?.ID ?? '');
        const novaUnidade = String(novoProduto?.unidade ?? novoProduto?.UNIDADE ?? '');

        atualizarSelectProdutos(novoId);

        if (inputUnidade && novaUnidade) {
          inputUnidade.value = novaUnidade;
        }

        atualizarResumo();
      } catch (error) {
        console.error('[Lançamento Manual] Erro ao cadastrar produto rápido:', error);
        alert(error?.message || 'Erro ao cadastrar produto rápido.');
      } finally {
        btnNovoProdutoRapido.disabled = false;
      }
    });

    modal.querySelector('#formLancamentoManualEstoque')?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnSalvar = modal.querySelector('#btnSalvarLancamentoManual');
      const option = selectProduto?.selectedOptions?.[0];

      const idproduto = String(selectProduto?.value || '').trim();
      const unidade = String(inputUnidade?.value || '').trim().toUpperCase();
      const quantidade = String(modal.querySelector('#manualQuantidade')?.value || '').trim();

      if (!idproduto) {
        alert('Selecione o produto do sistema.');
        return;
      }

      if (!unidade) {
        alert('Informe a unidade de medida.');
        return;
      }

      if (!quantidade || parseDecimalBr(quantidade) <= 0) {
        alert('Informe uma quantidade válida.');
        return;
      }

      try {
        btnSalvar.disabled = true;
        btnSalvar.textContent = 'Salvando...';

        const dadosLancamento = {
          idproduto: Number(idproduto),
          codprodutosistema: String(option?.dataset?.codigo || '').trim(),
          descricaoprodutosistema: String(option?.dataset?.descricao || '').trim(),
          unidade,
          quantidade: parseDecimalBr(quantidade)
        };


        fechar(dadosLancamento);
      } catch (error) {
        console.error('[Lançamento Manual] Erro ao preparar lançamento manual:', error);
        btnSalvar.disabled = false;
        btnSalvar.textContent = 'Salvar lançamento';
        alert(error?.message || 'Erro ao preparar lançamento manual.');
      }
    });

    atualizarResumo();
  });
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('#btnLancamentoManualEstoque');
  if (!btn) return;

  try {
    const dados = await abrirModalLancamentoManualEstoque();
    if (!dados) return;


    const payload = {
      usuarioRegistro: obterUsuarioLogado(),
      origem: 'MANUAL',
      itens: [
        {
          idproduto: dados.idproduto,
          codprodutosistema: dados.codprodutosistema,
          descricaoprodutosistema: dados.descricaoprodutosistema,
          unidade: dados.unidade,
          quantidade: dados.quantidade
        }
      ]
    };

    const url = apiUrl('/api/estoque/importacao-manual');


    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });


    const result = await response.json();


    if (!response.ok || !result?.success) {
      throw new Error(result?.message || 'Erro ao salvar lançamento manual.');
    }

    alert('Lançamento manual realizado com sucesso.');

    if (typeof carregarControleEstoque === 'function') {
      await carregarControleEstoque();
    }

    if (typeof carregarEstoque === 'function') {
      await carregarEstoque();
    }
  } catch (error) {
    console.error('[Lançamento Manual] Erro ao realizar lançamento manual:', error);
    alert(error?.message || 'Erro ao realizar lançamento manual.');
  }
});

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
              <td colspan="11" class="px-4 py-6 form-subtitle-sm text-center">
                Nenhuma entrada encontrada.
              </td>
            </tr>
          `;
          return;
        }

        tbody.innerHTML = lista.map(item => `
          <tr class="border-b border-border last:border-b-0">
            <td class="form-control-sm text-sm">${escapeHtml(String(item.id))}</td>
            <td class="form-control-sm text-sm">${escapeHtml(item.fornecedor || '')}</td>
            <td class="form-control-sm text-sm">${escapeHtml(item.nota || '')}</td>
            <td class="form-control-sm text-sm">${escapeHtml(item.serie || '')}</td>
            <td class="form-control-sm text-sm">${escapeHtml(item.cod_produto_nf || '')}</td>
            <td class="form-control-sm text-sm">${escapeHtml(item.descricao_produto_nf || '')}</td>
            <td class="form-control-sm text-sm text-center">${escapeHtml(item.unidade_nf || '')}</td>
            <td class="form-control-sm text-sm text-right">
              <input
                type="text"
                class="inputQtdEntrada w-32 rounded-xl border border-border bg-white/80 px-3 py-2 text-right"
                data-id="${escapeHtml(String(item.id))}"
                value="${escapeHtml(formatarDecimalBr(item.qtd_nf, 2))}"
              />
            </td>
            <td class="form-control-sm text-sm text-right">
              <input
                type="text"
                class="inputValorUnitEntrada w-32 rounded-xl border border-border bg-white/80 px-3 py-2 text-right"
                data-id="${escapeHtml(String(item.id))}"
                value="${escapeHtml(formatarMoedaBr(item.valor_unitario_nf))}"
              />
            </td>
            <td class="form-control-sm text-sm text-right font-semibold">
              <span class="valorTotalEntrada" data-id="${escapeHtml(String(item.id))}">
                ${escapeHtml(formatarMoedaBr(item.valor_total_nf))}
              </span>
            </td>
            <td class="form-control-sm text-sm">
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
                  <p class="form-subtitle-sm">Edite, filtre e exclua entradas do produto selecionado.</p>
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
                  class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                />
              </div>

              <div class="p-6">
                <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
                  <div class="overflow-auto max-h-[65vh]">
                    <table class="min-w-full text-sm">
                      <thead class="bg-white/60 border-b border-border sticky top-0">
                        <tr>
                          <th class="form-control-sm text-left">ID</th>
                          <th class="form-control-sm text-left">Fornecedor</th>
                          <th class="form-control-sm text-left">Nota</th>
                          <th class="form-control-sm text-left">Série</th>
                          <th class="form-control-sm text-left">Cód. NF</th>
                          <th class="form-control-sm text-left">Descrição</th>
                          <th class="form-control-sm text-center">UN</th>
                          <th class="form-control-sm text-right">Qtd</th>
                          <th class="form-control-sm text-right">Vlr. Unit.</th>
                          <th class="form-control-sm text-right">Vlr. Total</th>
                          <th class="form-control-sm text-right">Ações</th>
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
                  class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all"
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
                  <p class="form-subtitle-sm">Alterações registradas para este produto.</p>
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
                          <th class="form-control-sm text-left">Data</th>
                          <th class="form-control-sm text-left">Usuário</th>
                          <th class="form-control-sm text-left">Ação</th>
                          <th class="form-control-sm text-left">Entrada</th>
                          <th class="form-control-sm text-left">Nota</th>
                          <th class="form-control-sm text-left">Produto NF</th>
                          <th class="form-control-sm text-right">Qtd antes</th>
                          <th class="form-control-sm text-right">Qtd depois</th>
                          <th class="form-control-sm text-right">Unit. antes (R$)</th>
                          <th class="form-control-sm text-right">Unit. depois (R$)</th>
                          <th class="form-control-sm text-right">Total antes (R$)</th>
                          <th class="form-control-sm text-right">Total depois (R$)</th>
                          <th class="form-control-sm text-left">Obs.</th>
                        </tr>
                      </thead>
                      <tbody id="tbodyHistoricoEntradas">
                        <tr>
                          <td colspan="13" class="px-4 py-6 form-subtitle-sm text-center">
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
                  class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all"
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
            <td colspan="13" class="px-4 py-6 form-subtitle-sm text-center">
              Nenhum histórico encontrado para este produto.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = items.map(item => `
        <tr class="border-b border-border last:border-b-0">
          <td class="form-control-sm">${escapeHtml(formatarDataHora(item.DATA_ALTERACAO))}</td>
          <td class="form-control-sm">${escapeHtml(item.USUARIO || '')}</td>
          <td class="form-control-sm">
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
          <td class="form-control-sm">${escapeHtml(String(item.ID_ENTRADA || ''))}</td>
          <td class="form-control-sm">${escapeHtml(`${item.nota || ''} ${item.serie ? '/ ' + item.serie : ''}`)}</td>
          <td class="form-control-sm">
            <div class="font-medium">${escapeHtml(item.cod_produto_nf || '')}</div>
            <div class="text-xs text-muted-foreground">${escapeHtml(item.descricao_produto_nf || '')}</div>
          </td>
          <td class="form-control-sm text-right">${escapeHtml(formatarNumero(item.QTD_NF_ANTES, 2))}</td>
          <td class="form-control-sm text-right">${escapeHtml(formatarNumero(item.QTD_NF_DEPOIS, 2))}</td>
          <td class="form-control-sm text-right">${escapeHtml(formatarNumero(item.VALOR_UNITARIO_NF_ANTES, 2))}</td>
          <td class="form-control-sm text-right">${escapeHtml(formatarNumero(item.VALOR_UNITARIO_NF_DEPOIS, 2))}</td>
          <td class="form-control-sm text-right">${escapeHtml(formatarNumero(item.VALOR_TOTAL_NF_ANTES, 2))}</td>
          <td class="form-control-sm text-right">${escapeHtml(formatarNumero(item.VALOR_TOTAL_NF_DEPOIS, 2))}</td>
          <td class="form-control-sm">${escapeHtml(item.OBSERVACAO || '')}</td>
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
    sessionStorage.getItem('usuario') ||
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
        <td colspan="10" class="px-4 py-6 form-subtitle-sm text-center">
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
        <td class="form-control-sm text-sm">${escapeHtml(item.LOCAL_DESTINO ?? item.LOCALDESTINO ?? '')}</td>
        <td class="form-control-sm text-sm">${escapeHtml(item.TIPO_TRANSFERENCIA ?? item.TIPOTRANSFERENCIA ?? '')}</td>
        <td class="form-control-sm text-sm">${escapeHtml(item.RESPONSAVEL_TRANSPORTE ?? item.RESPONSAVELTRANSPORTE ?? '')}</td>
        <td class="form-control-sm text-sm">${escapeHtml(item.RESPONSAVEL_ENTREGA ?? item.RESPONSAVELENTREGA ?? '')}</td>
        <td class="form-control-sm text-sm text-right">${escapeHtmlString(formatarDecimalBr(item.QUANTIDADE ?? 0, 2))}</td>
        <td class="form-control-sm text-sm">${escapeHtml(item.UNIDADE ?? '')}</td>
        <td class="form-control-sm text-sm">${escapeHtml(item.USUARIO_CADASTRO ?? item.USUARIOCADASTRO ?? '')}</td>
        <td class="form-control-sm text-sm">${escapeHtml(formatarDataHora(item.DATA_CADASTRO ?? item.DATACADASTRO))}</td>
        <td class="form-control-sm text-sm">${escapeHtml(item.STATUS_TRANSFERENCIA ?? item.STATUSTRANSFERENCIA ?? '')}</td>
        <td class="form-control-sm text-sm">
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
        <div class="rounded-2xl border border-border bg-white/40 px-4 py-6 form-subtitle-sm text-center">
          Nenhum log encontrado.
        </div>
      `
      : `
        <div class="max-h-[60vh] overflow-auto rounded-2xl border border-border bg-white/40">
          <table class="min-w-full text-sm">
            <thead class="bg-white/50 border-b border-border sticky top-0">
              <tr>
                <th class="form-control-sm text-left font-semibold">Ação</th>
                <th class="form-control-sm text-right font-semibold">Saldo antes</th>
                <th class="form-control-sm text-right font-semibold">Qtd.</th>
                <th class="form-control-sm text-right font-semibold">Saldo depois</th>
                <th class="form-control-sm text-left font-semibold">Usuário</th>
                <th class="form-control-sm text-left font-semibold">Data/Hora</th>
                <th class="form-control-sm text-left font-semibold">Observação</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(log => `
                <tr class="border-b border-border last:border-b-0 hover:bg-white/30 transition-colors">
                  <td class="form-control-sm">${escapeHtml(log.ACAO ?? '')}</td>
                  <td class="form-control-sm text-right">${escapeHtmlString(formatarDecimalBr(log.SALDO_ANTES ?? 0, 2))}</td>
                  <td class="form-control-sm text-right">${escapeHtmlString(formatarDecimalBr(log.QUANTIDADE_TRANSFERIDA ?? 0, 2))}</td>
                  <td class="form-control-sm text-right">${escapeHtmlString(formatarDecimalBr(log.SALDO_DEPOIS ?? 0, 2))}</td>
                  <td class="form-control-sm">${escapeHtml(log.USUARIO ?? '')}</td>
                  <td class="form-control-sm">${escapeHtml(formatarDataHora(log.DATA_HORA ?? ''))}</td>
                  <td class="form-control-sm">${escapeHtml(log.OBSERVACAO ?? '')}</td>
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
                <p class="form-subtitle-sm">Histórico de alterações da transferência selecionada.</p>
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
                class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all"
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
              <p class="form-subtitle-sm">Registre, edite ou exclua transferências deste item.</p>
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
                  <label class="block form-label-sm text-foreground mb-2">Centro de custo</label>
                  <div class="flex flex-col sm:flex-row gap-2">
                    <select id="transferenciaLocalDestino" class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm" required>
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
                  <label class="block form-label-sm text-foreground mb-2">Tipo da transferência</label>
                  <select id="transferenciaTipo" class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm" required>
                  <option value="Selecione...">Selecione...</option>  
                  <option value="LOCAL">Local</option>
                    <option value="EXTERNA">Externa</option>
                  </select>
                </div>

                <div>
                  <label class="block form-label-sm text-foreground mb-2">Quantidade</label>
                  <input id="transferenciaQuantidade" type="text" class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm" placeholder="Ex. 1,0000" required />
                </div>

                <div>
                  <label class="block form-label-sm text-foreground mb-2">Usuário</label>
                  <input id="transferenciaUsuario" type="text" class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm" value="${escapeHtml(usuario)}" readonly />
                </div>
              </div>

              <div id="blocoTransferenciaExterna" class="hidden">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block form-label-sm text-foreground mb-2">Responsável por levar</label>
                    <input
                      id="transferenciaResponsavelTransporte"
                      type="text"
                      maxlength="150"
                      class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                      placeholder="Nome do responsável pelo transporte"
                    />
                  </div>

                  <div>
                    <label class="block form-label-sm text-foreground mb-2">Entregar para</label>
                    <input
                      id="transferenciaResponsavelEntrega"
                      type="text"
                      maxlength="150"
                      class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                      placeholder="Nome de quem receberá a entrega"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label class="block form-label-sm text-foreground mb-2">Observação</label>
                <input id="transferenciaObservacao" type="text" maxlength="255" class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm" placeholder="Opcional" />
              </div>

              <div class="flex justify-end gap-2">
                <button type="button" id="btnCancelarEdicaoTransferencia" class="hidden rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all">
                  Cancelar edição
                </button>
                <button type="submit" id="btnSalvarTransferencia" class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all">
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
                      <th class="form-control-sm text-left font-semibold">Destino</th>
                      <th class="form-control-sm text-left font-semibold">Tipo</th>
                      <th class="form-control-sm text-left font-semibold">Quem leva</th>
                      <th class="form-control-sm text-left font-semibold">Quem recebe</th>
                      <th class="form-control-sm text-right font-semibold">Quantidade</th>
                      <th class="form-control-sm text-left font-semibold">UN</th>
                      <th class="form-control-sm text-left font-semibold">Usuário</th>
                      <th class="form-control-sm text-left font-semibold">Data/Hora</th>
                      <th class="form-control-sm text-left font-semibold">Status</th>
                      <th class="form-control-sm text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody id="tbodyTransferenciasEstoque">
                    <tr>
                      <td colspan="10" class="px-4 py-6 form-subtitle-sm text-center">Carregando transferências...</td>
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

function renderizarEstoqueCentroCusto(items) {
  const tbody = document.getElementById('tbodyEstoqueCentroCusto');
  if (!tbody) return;

  if (!Array.isArray(items) || !items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="px-4 py-6 form-subtitle-sm text-center">
          Nenhum material disponível no centro de custo.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = items.map(item => {
    const id = item.ID ?? item.IDTRANSFERENCIA ?? '';
    const idProduto = item.IDPRODUTO ?? '';
    const idLocalOrigem =
      item.IDLOCALDESTINO ??
      item.IDLOCALORIGEMESTOQUE ??
      '';

    const codigo = item.CODIGOPRODUTO ?? '';
    const descricao = item.DESCRICAOPRODUTO ?? '';
    const unidade = item.UNIDADE ?? 'UN';

    const quantidadeNaoRecebida = Number(item.QTDTRANSFERIDANAORECEBIDA ?? 0);

    const quantidadeSaida = Number(
      item.QTDSAIDA ??
      item.QUANTIDADESAIDA ??
      item.QTDSAIDACENTROCUSTO ??
      0
    );

    const quantidadeDevolvida = Number(
      item.QTDDEVOLVIDA ??
      item.QUANTIDADEDEVOLVIDA ??
      item.QTDDEVOLUCAO ??
      0
    );

    const quantidadeSaidaLiquida = Number(
      item.QTDSAIDALIQUIDA ??
      (quantidadeSaida - quantidadeDevolvida) ??
      0
    );

    const saldo = Number(
      item.QUANTIDADE ??
      item.SALDO ??
      item.SALDOCENTROCUSTO ??
      0
    );

    return `
      <tr class="border-b border-border last:border-b-0 hover:bg-white/30 transition-colors">
        <td class="form-control-sm text-sm">${escapeHtmlString(codigo)}</td>
        <td class="form-control-sm text-sm">${escapeHtmlString(descricao)}</td>
        <td class="form-control-sm text-sm">${escapeHtmlString(unidade)}</td>
        <td class="form-control-sm text-sm text-right">${escapeHtmlString(formatarDecimalBr(saldo, 2))}</td>
        <td class="form-control-sm text-sm text-right">${escapeHtmlString(formatarDecimalBr(quantidadeNaoRecebida, 2))}</td>
        <td class="form-control-sm text-sm text-right">${escapeHtmlString(formatarDecimalBr(quantidadeSaida - quantidadeDevolvida, 2))}</td>
        <td class="form-control-sm text-sm text-right">
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="btnSaidaCentroCusto w-9 h-9 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all"
              data-id="${escapeHtmlString(String(id))}"
              data-id-produto="${escapeHtmlString(String(idProduto))}"
              data-id-local="${escapeHtmlString(String(idLocalOrigem))}"
              data-codigo="${escapeHtmlString(String(codigo))}"
              data-descricao="${escapeHtmlString(String(descricao))}"
              data-unidade="${escapeHtmlString(String(unidade))}"
              data-quantidade="${escapeHtmlString(String(saldo))}"
              title="Dar saída do produto"
            >
              <i class="fas fa-arrow-up-from-bracket"></i>
            </button>

            <button
              type="button"
              class="btnLogsSaidaCentroCusto w-9 h-9 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all"
              data-id-produto="${escapeHtmlString(String(idProduto))}"
              data-id-local="${escapeHtmlString(String(idLocalOrigem))}"
              title="Ver histórico de saídas"
            >
              <i class="fas fa-clock-rotate-left"></i>
            </button>

            <button
              type="button"
              class="btnTransferenciaCentroCusto w-9 h-9 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
              data-id="${escapeHtmlString(String(id))}"
              data-id-produto="${escapeHtmlString(String(idProduto))}"
              data-id-local="${escapeHtmlString(String(idLocalOrigem))}"
              data-codigo="${escapeHtmlString(String(codigo))}"
              data-descricao="${escapeHtmlString(String(descricao))}"
              data-unidade="${escapeHtmlString(String(unidade))}"
              data-quantidade="${escapeHtmlString(String(saldo))}"
              title="Transferir para outro centro de custo"
            >
              <i class="fas fa-right-left"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  vincularEventosSaidaCentroCusto();
  vincularEventosLogsSaidaCentroCusto();
  vincularEventosTransferenciaCentroCusto();
  vincularEventosLogsTransferencia();
}

function vincularEventosSaidaCentroCusto() {
  document.querySelectorAll('.btnSaidaCentroCusto').forEach(btn => {
    if (btn.dataset.eventoVinculado === '1') return;
    btn.dataset.eventoVinculado = '1';

    btn.addEventListener('click', async e => {
      const el = e.currentTarget;

      const idProduto = String(el.dataset.idProduto || '').trim();
      const idLocal = String(el.dataset.idLocal || '').trim();
      const codigo = String(el.dataset.codigo || '').trim();
      const descricao = String(el.dataset.descricao || '').trim();
      const unidade = String(el.dataset.unidade || 'UN').trim();

      if (!idProduto || !idLocal) {
        alert('Não foi possível identificar o produto ou o centro de custo.');
        return;
      }

      await abrirModalSaidaCentroCusto({
        IDPRODUTO: idProduto,
        IDLOCALORIGEM: idLocal,
        CODIGOPRODUTO: codigo,
        DESCRICAOPRODUTO: descricao,
        UNIDADE: unidade
      });
    });
  });
}

function removerModalSaidaCentroCusto() {
  document.getElementById('saidaCentroCustoOverlay')?.remove();
  document.getElementById('saidaCentroCustoModal')?.remove();
}

async function abrirModalSaidaCentroCusto(item) {
  removerModalSaidaCentroCusto();

  const overlay = document.createElement('div');
  overlay.id = 'saidaCentroCustoOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[130]';

  const modal = document.createElement('div');
  modal.id = 'saidaCentroCustoModal';
  modal.className = 'fixed inset-0 z-[140]';

  const idProduto = item.IDPRODUTO ?? '';
  const idLocalOrigem = item.IDLOCALORIGEM ?? '';
  const codigo = item.CODIGOPRODUTO ?? '—';
  const descricao = item.DESCRICAOPRODUTO ?? '—';
  const unidade = item.UNIDADE ?? 'UN';
  const usuarioRegistro = typeof obterUsuarioLogado === 'function' ? obterUsuarioLogado() : 'SISTEMA';

  modal.innerHTML = `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex items-center justify-center p-2 sm:p-4">
        <div class="w-[95vw] lg:w-[80vw] max-w-[80vw] max-h-[90vh] rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col">
          
          <div class="px-4 sm:px-5 py-4 border-b border-border flex items-start justify-between gap-3 shrink-0">
            <div class="min-w-0">
              <h3 class="text-base sm:text-lg font-semibold text-foreground">Saída de material</h3>
              <p class="text-xs text-muted-foreground">Registre a utilização do material neste centro de custo.</p>
            </div>
            <button
              type="button"
              id="btnFecharModalSaidaCentroCusto"
              class="w-9 h-9 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center shrink-0"
            >
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
            
            <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3">
              <div class="rounded-xl border border-border bg-white/60 p-3">
                <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Código</div>
                <div class="mt-1 text-sm font-semibold text-foreground leading-tight break-words">${escapeHtmlString(String(codigo))}</div>
              </div>

              <div class="rounded-xl border border-border bg-white/60 p-3 md:col-span-2 xl:col-span-2">
                <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Descrição</div>
                <div class="mt-1 text-sm font-semibold text-foreground leading-tight break-words">${escapeHtmlString(String(descricao))}</div>
              </div>

              <div class="rounded-xl border border-border bg-white/60 p-3">
                <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Unidade</div>
                <div class="mt-1 text-sm font-semibold text-foreground">${escapeHtmlString(String(unidade))}</div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div class="rounded-xl border border-border bg-white/60 p-3">
                <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Saldo disponível</div>
                <div id="saidaCentroCustoSaldoDisponivel" class="mt-1 text-base sm:text-lg font-semibold text-primary">0,00</div>
              </div>

              <div class="rounded-xl border border-border bg-white/40 p-3 sm:col-span-1 lg:col-span-3">
                <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Usuário do registro</div>
                <div class="mt-1 text-sm font-medium text-foreground break-words">${escapeHtmlString(usuarioRegistro)}</div>
              </div>
            </div>

            <form id="formSaidaCentroCusto" class="rounded-xl border border-border bg-white/40 p-4 space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-medium text-foreground mb-1">Quantidade utilizada</label>
                  <input
                    id="saidaCentroCustoQuantidade"
                    type="text"
                    class="w-full h-10 rounded-lg border border-border bg-white/80 px-3 text-sm"
                    placeholder="Ex. 1,00"
                    required
                  >
                </div>

                <div>
                  <label class="block text-xs font-medium text-foreground mb-1">Usuário solicitante</label>
                  <input
                    id="saidaCentroCustoSolicitante"
                    type="text"
                    maxlength="150"
                    class="w-full h-10 rounded-lg border border-border bg-white/80 px-3 text-sm"
                    placeholder="Nome do solicitante"
                    required
                  >
                </div>

                <div class="md:col-span-2 xl:col-span-1">
                  <label class="block text-xs font-medium text-foreground mb-1">Finalidade</label>
                  <input
                    id="saidaCentroCustoFinalidade"
                    type="text"
                    maxlength="255"
                    class="w-full h-10 rounded-lg border border-border bg-white/80 px-3 text-sm"
                    placeholder="Ex.: manutenção, instalação..."
                    required
                  >
                </div>
              </div>

              <div class="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-3">
                <div>
                  <label class="block text-xs font-medium text-foreground mb-1">Observação</label>
                  <input
                    id="saidaCentroCustoObservacao"
                    type="text"
                    maxlength="255"
                    class="w-full h-10 rounded-lg border border-border bg-white/80 px-3 text-sm"
                    placeholder="Opcional"
                  >
                </div>

                <div>
                  <label class="block text-xs font-medium text-foreground mb-1">Usuário do registro</label>
                  <input
                    id="saidaCentroCustoUsuarioRegistro"
                    type="text"
                    class="w-full h-10 rounded-lg border border-border bg-white/80 px-3 text-sm"
                    value="${escapeHtmlString(usuarioRegistro)}"
                    readonly
                  >
                </div>
              </div>

              <div class="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  id="btnCancelarSaidaCentroCusto"
                  class="h-10 rounded-lg border border-border bg-white/60 px-4 text-sm font-medium hover:bg-white/90 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btnSalvarSaidaCentroCusto"
                  class="h-10 rounded-lg bg-primary text-white px-4 text-sm font-medium hover:opacity-90 transition-all"
                >
                  Registrar saída
                </button>
              </div>
            </form>

            <div class="rounded-xl border border-border bg-white/40 overflow-hidden">
              <div class="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <h4 class="text-sm font-semibold text-foreground">Saídas registradas</h4>
                  <p class="text-[11px] text-muted-foreground">Histórico de utilização, devoluções e saldo pendente deste material.</p>
                </div>
              </div>

              <div class="overflow-auto max-h-[42vh]">
                <table class="min-w-full text-xs sm:text-sm">
                  <thead class="bg-white/60 border-b border-border sticky top-0 z-10">
                    <tr>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">Finalidade</th>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">Solicitante</th>
                      <th class="px-2 py-2 text-right font-semibold whitespace-nowrap">Qtd. saída</th>
                      <th class="px-2 py-2 text-right font-semibold whitespace-nowrap">Qtd. devolvida</th>
                      <th class="px-2 py-2 text-right font-semibold whitespace-nowrap">Saldo pendente</th>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">UN</th>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">Status</th>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">Usuário</th>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">Data/Hora</th>
                      <th class="px-2 py-2 text-right font-semibold whitespace-nowrap">Ações</th>
                    </tr>
                  </thead>
                  <tbody id="tbodySaidasCentroCusto">
                    <tr>
                      <td colspan="10" class="px-3 py-5 text-xs sm:text-sm text-center text-muted-foreground">
                        Carregando saídas...
                      </td>
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

  const fechar = removerModalSaidaCentroCusto;
  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharModalSaidaCentroCusto')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarSaidaCentroCusto')?.addEventListener('click', fechar);

  async function recarregarResumoETabela() {
    try {
      const [saldoResp, listaResp] = await Promise.all([
        obterSaldoCentroCusto(idProduto, idLocalOrigem),
        listarSaidasCentroCusto(idProduto, idLocalOrigem)
      ]);

      document.getElementById('saidaCentroCustoSaldoDisponivel').textContent =
        formatarDecimalBr(saldoResp?.saldo ?? 0, 2);

      document.getElementById('tbodySaidasCentroCusto').innerHTML =
        renderTabelaSaidasCentroCusto(listaResp?.items);

      vincularEventosTabelaSaidaCentroCusto();
    } catch (err) {
      console.error(err);
      document.getElementById('tbodySaidasCentroCusto').innerHTML = `
        <tr>
          <td colspan="10" class="px-3 py-5 text-xs sm:text-sm text-danger text-center">
            ${escapeHtml(err?.message || 'Erro ao carregar saídas.')}
          </td>
        </tr>
      `;
    }
  }

  document.getElementById('formSaidaCentroCusto')?.addEventListener('submit', async e => {
    e.preventDefault();

    const btnSalvar = document.getElementById('btnSalvarSaidaCentroCusto');
    const quantidade = parseDecimalBr(document.getElementById('saidaCentroCustoQuantidade')?.value);
    const solicitante = String(document.getElementById('saidaCentroCustoSolicitante')?.value || '').trim();
    const finalidade = String(document.getElementById('saidaCentroCustoFinalidade')?.value || '').trim();
    const observacao = String(document.getElementById('saidaCentroCustoObservacao')?.value || '').trim();
    const saldoAtual = parseDecimalBr(document.getElementById('saidaCentroCustoSaldoDisponivel')?.textContent || '0');

    if (!quantidade || quantidade <= 0) {
      alert('Informe uma quantidade válida.');
      return;
    }

    if (quantidade > saldoAtual) {
      alert(`A quantidade informada excede o saldo disponível (${formatarDecimalBr(saldoAtual, 2)}).`);
      return;
    }

    if (!solicitante) {
      alert('Informe o usuário solicitante.');
      return;
    }

    if (!finalidade) {
      alert('Informe a finalidade da utilização.');
      return;
    }

    try {
      btnSalvar.disabled = true;
      btnSalvar.textContent = 'Registrando...';

      await criarSaidaCentroCusto({
        idProduto: Number(idProduto),
        idLocalOrigem: Number(idLocalOrigem),
        quantidade,
        unidade,
        finalidade,
        usuarioSolicitante: solicitante,
        usuario: usuarioRegistro,
        observacao
      });

      await recarregarResumoETabela();
      await carregarEstoqueCentroCusto();

      document.getElementById('saidaCentroCustoQuantidade').value = '';
      document.getElementById('saidaCentroCustoSolicitante').value = '';
      document.getElementById('saidaCentroCustoFinalidade').value = '';
      document.getElementById('saidaCentroCustoObservacao').value = '';
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Erro ao registrar saída.');
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.textContent = 'Registrar saída';
    }
  });

  await recarregarResumoETabela();
}

function removerModalHistoricoSaidasCentroCusto() {
  document.getElementById('historicoSaidasCentroCustoOverlay')?.remove();
  document.getElementById('historicoSaidasCentroCustoModal')?.remove();
}

async function abrirModalHistoricoSaidasCentroCusto(idProduto, idLocalOrigem) {
  removerModalHistoricoSaidasCentroCusto();

  const overlay = document.createElement('div');
  overlay.id = 'historicoSaidasCentroCustoOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[170]';

  const modal = document.createElement('div');
  modal.id = 'historicoSaidasCentroCustoModal';
  modal.className = 'fixed inset-0 z-[180]';

  modal.innerHTML = `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex items-center justify-center p-2 sm:p-4">
        <div class="w-[95vw] lg:w-[88vw] max-w-[88vw] max-h-[90vh] rounded-2xl border border-border bg-background shadow-2xl overflow-hidden flex flex-col">
          
          <div class="px-4 sm:px-5 py-4 border-b border-border flex items-start justify-between gap-3 shrink-0">
            <div class="min-w-0">
              <h3 class="text-base sm:text-lg font-semibold text-foreground">Histórico de saídas</h3>
              <p class="text-xs text-muted-foreground">Eventos separados por saída e devolução.</p>
            </div>
            <button
              type="button"
              id="btnFecharModalHistoricoSaidasCentroCusto"
              class="w-9 h-9 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center shrink-0"
            >
              <i class="fas fa-times text-sm"></i>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-4 sm:px-5 py-4">
            <div class="rounded-xl border border-border bg-white/40 overflow-hidden">
              <div class="overflow-auto max-h-[72vh]">
                <table class="min-w-full text-xs sm:text-sm">
                  <thead class="bg-white/60 border-b border-border sticky top-0 z-10">
                    <tr>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">Tipo</th>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">Finalidade / Motivo</th>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">Observação</th>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">Solicitante / Usuário</th>
                      <th class="px-2 py-2 text-right font-semibold whitespace-nowrap">Quantidade</th>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">UN</th>
                      <th class="px-2 py-2 text-left font-semibold whitespace-nowrap">Data/Hora</th>
                      <th class="px-2 py-2 text-right font-semibold whitespace-nowrap">Ações</th>
                    </tr>
                  </thead>
                  <tbody id="tbodyHistoricoSaidasCentroCusto">
                    <tr>
                      <td colspan="8" class="px-3 py-5 text-xs sm:text-sm text-center text-muted-foreground">
                        Carregando histórico de saídas...
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="px-4 sm:px-5 py-3 border-t border-border flex justify-end shrink-0">
            <button
              type="button"
              id="btnFecharRodapeHistoricoSaidasCentroCusto"
              class="h-10 rounded-lg border border-border bg-white/60 px-4 text-sm font-medium hover:bg-white/90 transition-all"
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

  const fechar = removerModalHistoricoSaidasCentroCusto;
  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharModalHistoricoSaidasCentroCusto')?.addEventListener('click', fechar);
  document.getElementById('btnFecharRodapeHistoricoSaidasCentroCusto')?.addEventListener('click', fechar);

  try {
    const resposta = await listarSaidasCentroCusto(idProduto, idLocalOrigem);
    const items = Array.isArray(resposta?.items) ? resposta.items : [];

    const tbody = document.getElementById('tbodyHistoricoSaidasCentroCusto');
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-3 py-5 text-xs sm:text-sm text-center text-muted-foreground">
            Nenhuma saída registrada para este item.
          </td>
        </tr>
      `;
      return;
    }

    const linhas = [];

    items.forEach(item => {
      const idSaida = String(item.ID ?? '');
      const qtdSaida = Number(item.QUANTIDADE ?? 0);
      const unidade = String(item.UNIDADE ?? 'UN');
      const devolucoes = Array.isArray(item.devolucoes) ? item.devolucoes : [];

      const qtdDevolvida = devolucoes.reduce((acc, d) => acc + Number(d.QUANTIDADE ?? 0), 0);
      const saldoPendente = Math.max(qtdSaida - qtdDevolvida, 0);

      linhas.push(`
        <tr class="border-b border-red-100 bg-red-50/50 hover:bg-red-50/80 transition-colors align-top">
          <td class="px-2 py-2">
            <span class="inline-flex items-center rounded-md border border-red-200 bg-red-100 px-2 py-1 text-[11px] font-semibold text-red-700">
              SAÍDA
            </span>
          </td>
          <td class="px-2 py-2 text-xs sm:text-sm">
            <div class="font-medium text-red-700">${escapeHtmlString(item.FINALIDADE ?? '—')}</div>
            <div class="mt-1 text-[11px] text-red-600">
              Saldo pendente: ${escapeHtmlString(formatarDecimalBr(saldoPendente, 2))} ${escapeHtmlString(unidade)}
            </div>
          </td>
          <td class="px-2 py-2 text-xs sm:text-sm text-red-700 max-w-[260px] break-words">
            ${escapeHtmlString(item.OBSERVACAO ?? '—')}
          </td>
          <td class="px-2 py-2 text-xs sm:text-sm">
            <div class="text-red-700 font-medium">${escapeHtmlString(item.USUARIO_SOLICITANTE ?? item.USUARIOSOLICITANTE ?? '—')}</div>
            <div class="mt-1 text-[11px] text-red-600">Registro: ${escapeHtmlString(item.USUARIO_CADASTRO ?? item.USUARIOCADASTRO ?? '—')}</div>
          </td>
          <td class="px-2 py-2 text-xs sm:text-sm text-right font-semibold text-red-700 whitespace-nowrap">
            ${escapeHtmlString(formatarDecimalBr(qtdSaida, 2))}
          </td>
          <td class="px-2 py-2 text-xs sm:text-sm text-red-700 whitespace-nowrap">
            ${escapeHtmlString(unidade)}
          </td>
          <td class="px-2 py-2 text-xs sm:text-sm text-red-700 whitespace-nowrap">
            ${escapeHtml(formatarDataHora(item.DATA_CADASTRO ?? item.DATACADASTRO ?? ''))}
          </td>
          <td class="px-2 py-2 text-right">
            <div class="flex justify-end gap-2">
              ${
                saldoPendente > 0
                  ? `
                    <button
                      type="button"
                      class="btnDevolverSaidaCentroCustoHistorico w-8 h-8 rounded-lg border border-red-200 bg-white text-red-700 hover:bg-red-100 transition-all"
                      data-id="${escapeHtmlString(idSaida)}"
                      data-saldo-pendente="${escapeHtmlString(String(saldoPendente))}"
                      data-unidade="${escapeHtmlString(unidade)}"
                      title="Devolver saída"
                    >
                      <i class="fas fa-rotate-left text-xs"></i>
                    </button>
                  `
                  : ''
              }
            </div>
          </td>
        </tr>
      `);

      devolucoes.forEach(dev => {
        linhas.push(`
          <tr class="border-b border-blue-100 bg-blue-50/50 hover:bg-blue-50/80 transition-colors align-top">
            <td class="px-2 py-2">
              <span class="inline-flex items-center rounded-md border border-blue-200 bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-700">
                DEVOLUÇÃO
              </span>
            </td>
            <td class="px-2 py-2 text-xs sm:text-sm text-blue-700">
              <div class="font-medium">Devolução vinculada à saída #${escapeHtmlString(idSaida || '—')}</div>
            </td>
            <td class="px-2 py-2 text-xs sm:text-sm text-blue-700 max-w-[260px] break-words">
              ${escapeHtmlString(dev.OBSERVACAO ?? '—')}
            </td>
            <td class="px-2 py-2 text-xs sm:text-sm text-blue-700">
              ${escapeHtmlString(dev.USUARIO_DEVOLUCAO ?? dev.USUARIODEVOLUCAO ?? '—')}
            </td>
            <td class="px-2 py-2 text-xs sm:text-sm text-right font-semibold text-blue-700 whitespace-nowrap">
              ${escapeHtmlString(formatarDecimalBr(Number(dev.QUANTIDADE ?? 0), 2))}
            </td>
            <td class="px-2 py-2 text-xs sm:text-sm text-blue-700 whitespace-nowrap">
              ${escapeHtmlString(unidade)}
            </td>
            <td class="px-2 py-2 text-xs sm:text-sm text-blue-700 whitespace-nowrap">
              ${escapeHtml(formatarDataHora(dev.DATA_CADASTRO ?? dev.DATADEVOLUCAO ?? dev.DATA_CADASTRO_DEVOLUCAO ?? ''))}
            </td>
            <td class="px-2 py-2 text-right">
              <span class="text-[11px] text-blue-500">—</span>
            </td>
          </tr>
        `);
      });
    });

    tbody.innerHTML = linhas.join('');

    document.querySelectorAll('.btnLogsItemSaidaCentroCustoHistorico').forEach(btn => {
      if (btn.dataset.eventoVinculado === '1') return;
      btn.dataset.eventoVinculado = '1';

      btn.addEventListener('click', async e => {
        const idSaida = String(e.currentTarget.dataset.id || '').trim();
        if (!idSaida) return;
        await abrirModalLogsSaidaCentroCusto(idSaida);
      });
    });

    document.querySelectorAll('.btnDevolverSaidaCentroCustoHistorico').forEach(btn => {
      if (btn.dataset.eventoVinculado === '1') return;
      btn.dataset.eventoVinculado = '1';

      btn.addEventListener('click', async e => {
        const el = e.currentTarget;
        const idSaida = String(el.dataset.id || '').trim();
        const saldoPendente = Number(el.dataset.saldoPendente || 0);
        const unidade = String(el.dataset.unidade || 'UN');

        if (!idSaida) {
          alert('Saída não identificada.');
          return;
        }

        await abrirModalDevolucaoSaidaCentroCusto({ idSaida, saldoPendente, unidade });
      });
    });
  } catch (err) {
    console.error(err);

    document.getElementById('tbodyHistoricoSaidasCentroCusto').innerHTML = `
      <tr>
        <td colspan="8" class="px-3 py-5 text-xs sm:text-sm text-danger text-center">
          ${escapeHtml(err?.message || 'Erro ao carregar histórico de saídas.')}
        </td>
      </tr>
    `;
  }
}

function renderTabelaSaidasCentroCusto(items) {
  if (!Array.isArray(items) || !items.length) {
    return `
      <tr>
        <td colspan="10" class="px-4 py-6 form-subtitle-sm text-center">
          Nenhuma saída registrada.
        </td>
      </tr>
    `;
  }

  return items.map(item => {
    const qtdSaida = Number(item.QUANTIDADE ?? 0);
    const qtdDevolvida = Number(item.QUANTIDADE_DEVOLVIDA ?? item.QUANTIDADEDEVOLVIDA ?? 0);
    const saldoPendente = Math.max(qtdSaida - qtdDevolvida, 0);

    let status = 'ATIVA';
    if (qtdDevolvida > 0 && saldoPendente > 0) {
      status = 'PARCIALMENTE DEVOLVIDA';
    } else if (saldoPendente === 0) {
      status = 'DEVOLVIDA TOTALMENTE';
    }

    return `
      <tr class="border-b border-border last:border-b-0 hover:bg-white/30 transition-colors">
        <td class="form-control-sm text-sm">${escapeHtmlString(item.FINALIDADE ?? '')}</td>
        <td class="form-control-sm text-sm">${escapeHtmlString(item.USUARIO_SOLICITANTE ?? item.USUARIOSOLICITANTE ?? '')}</td>
        <td class="form-control-sm text-sm text-right">${escapeHtmlString(formatarDecimalBr(qtdSaida, 2))}</td>
        <td class="form-control-sm text-sm text-right">${escapeHtmlString(formatarDecimalBr(qtdDevolvida, 2))}</td>
        <td class="form-control-sm text-sm text-right">${escapeHtmlString(formatarDecimalBr(saldoPendente, 2))}</td>
        <td class="form-control-sm text-sm">${escapeHtmlString(item.UNIDADE ?? 'UN')}</td>
        <td class="form-control-sm text-sm">${escapeHtmlString(item.STATUS_SAIDA ?? status)}</td>
        <td class="form-control-sm text-sm">${escapeHtmlString(item.USUARIO_CADASTRO ?? item.USUARIOCADASTRO ?? '')}</td>
        <td class="form-control-sm text-sm">${escapeHtml(formatarDataHora(item.DATA_CADASTRO ?? item.DATACADASTRO ?? ''))}</td>
        <td class="form-control-sm text-sm text-right">
          <div class="flex justify-end gap-2">
            ${
              saldoPendente > 0
                ? `
                  <button
                    type="button"
                    class="btnDevolverSaidaCentroCusto w-9 h-9 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
                    data-id="${escapeHtmlString(String(item.ID ?? ''))}"
                    data-saldo-pendente="${escapeHtmlString(String(saldoPendente))}"
                    data-unidade="${escapeHtmlString(String(item.UNIDADE ?? 'UN'))}"
                    title="Devolver saída"
                  >
                    <i class="fas fa-rotate-left"></i>
                  </button>
                `
                : ''
            }
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function vincularEventosLogsSaidaCentroCusto() {
  document.querySelectorAll('.btnLogsSaidaCentroCusto').forEach(btn => {
    if (btn.dataset.eventoVinculado === '1') return;
    btn.dataset.eventoVinculado = '1';

    btn.addEventListener('click', async e => {
      const el = e.currentTarget;
      const idProduto = String(el.dataset.idProduto || '').trim();
      const idLocal = String(el.dataset.idLocal || '').trim();

      if (!idProduto || !idLocal) {
        alert('Produto ou local não identificado.');
        return;
      }

      await abrirModalHistoricoSaidasCentroCusto(idProduto, idLocal);
    });
  });
}

function vincularEventosTabelaSaidaCentroCusto() {
  document.querySelectorAll('.btnDevolverSaidaCentroCusto').forEach(btn => {
    if (btn.dataset.eventoVinculado === '1') return;
    btn.dataset.eventoVinculado = '1';

    btn.addEventListener('click', async e => {
      const el = e.currentTarget;
      const idSaida = String(el.dataset.id || '').trim();
      const saldoPendente = Number(el.dataset.saldoPendente || 0);
      const unidade = String(el.dataset.unidade || 'UN');

      if (!idSaida) {
        alert('Saída não identificada.');
        return;
      }

      await abrirModalDevolucaoSaidaCentroCusto({ idSaida, saldoPendente, unidade });
    });
  });

  document.querySelectorAll('.btnLogsItemSaidaCentroCusto').forEach(btn => {
    if (btn.dataset.eventoVinculado === '1') return;
    btn.dataset.eventoVinculado = '1';

    btn.addEventListener('click', async e => {
      const idSaida = String(e.currentTarget.dataset.id || '').trim();
      if (!idSaida) return;
      await abrirModalLogsSaidaCentroCusto(idSaida);
    });
  });
}

function removerModalDevolucaoSaidaCentroCusto() {
  document.getElementById('devolucaoSaidaCentroCustoOverlay')?.remove();
  document.getElementById('devolucaoSaidaCentroCustoModal')?.remove();
}

async function abrirModalDevolucaoSaidaCentroCusto({ idSaida, saldoPendente, unidade }) {
  removerModalDevolucaoSaidaCentroCusto();

  const usuario = typeof obterUsuarioLogado === 'function' ? obterUsuarioLogado() : 'SISTEMA';

  const overlay = document.createElement('div');
  overlay.id = 'devolucaoSaidaCentroCustoOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]';

  const modal = document.createElement('div');
  modal.id = 'devolucaoSaidaCentroCustoModal';
  modal.className = 'fixed inset-0 z-[160]';

  modal.innerHTML = `
    <div class="w-full h-full overflow-auto">
      <div class="min-h-full flex items-center justify-center p-4">
        <div class="w-full max-w-2xl rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
          <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-foreground">Devolução de saída</h3>
              <p class="form-subtitle-sm">Você pode devolver parcialmente ou totalmente a saída registrada.</p>
            </div>
            <button type="button" id="btnFecharModalDevolucaoSaidaCentroCusto"
              class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form id="formDevolucaoSaidaCentroCusto" class="px-6 py-6 space-y-4">
            <div class="rounded-2xl border border-border bg-white/60 p-4">
              <div class="text-xs uppercase tracking-wide text-muted-foreground">Saldo pendente para devolução</div>
              <div class="mt-1 text-lg font-semibold text-primary">${formatarDecimalBr(saldoPendente, 2)} ${escapeHtmlString(unidade)}</div>
            </div>

            <div>
              <label class="block form-label-sm text-foreground mb-2">Quantidade a devolver</label>
              <input id="devolucaoSaidaQuantidade" type="text"
                class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                placeholder="Ex. 1,00" required>
            </div>

            <div class="flex gap-2">
              <button type="button" id="btnDevolverTotalSaidaCentroCusto"
                class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 form-label-sm text-emerald-700 hover:bg-emerald-100 transition-all">
                Devolver tudo
              </button>
            </div>

            <div>
              <label class="block form-label-sm text-foreground mb-2">Observação</label>
              <input id="devolucaoSaidaObservacao" type="text" maxlength="255"
                class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                placeholder="Motivo da devolução">
            </div>

            <div>
              <label class="block form-label-sm text-foreground mb-2">Usuário</label>
              <input type="text"
                class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                value="${escapeHtmlString(usuario)}" readonly>
            </div>

            <div class="flex justify-end gap-2">
              <button type="button" id="btnCancelarDevolucaoSaidaCentroCusto"
                class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all">
                Cancelar
              </button>
              <button type="submit" id="btnSalvarDevolucaoSaidaCentroCusto"
                class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all">
                Registrar devolução
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  const fechar = removerModalDevolucaoSaidaCentroCusto;
  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharModalDevolucaoSaidaCentroCusto')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarDevolucaoSaidaCentroCusto')?.addEventListener('click', fechar);

  document.getElementById('btnDevolverTotalSaidaCentroCusto')?.addEventListener('click', () => {
    document.getElementById('devolucaoSaidaQuantidade').value = formatarDecimalBr(saldoPendente, 2);
  });

  document.getElementById('formDevolucaoSaidaCentroCusto')?.addEventListener('submit', async e => {
    e.preventDefault();

    const btnSalvar = document.getElementById('btnSalvarDevolucaoSaidaCentroCusto');
    const quantidade = parseDecimalBr(document.getElementById('devolucaoSaidaQuantidade')?.value);
    const observacao = String(document.getElementById('devolucaoSaidaObservacao')?.value || '').trim();

    if (!quantidade || quantidade <= 0) {
      alert('Informe uma quantidade válida para devolução.');
      return;
    }

    if (quantidade > saldoPendente) {
      alert(`A quantidade de devolução não pode ser maior que o saldo pendente (${formatarDecimalBr(saldoPendente, 2)}).`);
      return;
    }

    try {
      btnSalvar.disabled = true;
      btnSalvar.textContent = 'Registrando...';

      await criarDevolucaoSaidaCentroCusto(idSaida, {
        quantidade,
        usuario,
        observacao
      });

      removerModalDevolucaoSaidaCentroCusto();
      await carregarEstoqueCentroCusto();
    } catch (err) {
      console.error(err);
      alert(err?.message || 'Erro ao registrar devolução.');
    } finally {
      btnSalvar.disabled = false;
      btnSalvar.textContent = 'Registrar devolução';
    }
  });
}

async function obterSaldoCentroCusto(idProduto, idLocalOrigem) {
  return apiJson(
    apiUrlTr(`/api/estoque/centro-custo/saldo?idProduto=${encodeURIComponent(idProduto)}&idLocalOrigem=${encodeURIComponent(idLocalOrigem)}`)
  );
}

async function criarDevolucaoSaidaCentroCusto(idSaida, payload) {
  return apiJson(
    apiUrlTr(`/api/estoque/centro-custo/saidas/${encodeURIComponent(idSaida)}/devolucoes`),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  );
}

async function listarDevolucoesSaidaCentroCusto(idSaida) {
  return apiJson(
    apiUrlTr(`/api/estoque/centro-custo/saidas/${encodeURIComponent(idSaida)}/devolucoes`)
  );
}


async function listarSaidasCentroCusto(idProduto, idLocalOrigem) {
  return apiJson(
    apiUrlTr(`/api/estoque/centro-custo/saidas?idProduto=${encodeURIComponent(idProduto)}&idLocalOrigem=${encodeURIComponent(idLocalOrigem)}`)
  );
}

async function criarSaidaCentroCusto(payload) {
  return apiJson(apiUrlTr('/api/estoque/centro-custo/saidas'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function listarLogsSaidaCentroCusto(idSaida) {
  return apiJson(
    apiUrlTr(`/api/estoque/centro-custo/saidas/${encodeURIComponent(idSaida)}/logs`)
  );
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
      <div class="rounded-2xl border border-border bg-white/40 px-4 py-6 form-subtitle-sm text-center">
        Nenhuma pendência de recebimento.
      </div>
    `
    : `
      <div class="space-y-3 max-h-[65vh] overflow-auto pr-1">
        ${items.map(item => {
          const id = item.ID ?? '';
          const codigo = item.CODIGOPRODUTO ?? '—';
          const descricao = item.DESCRICAOPRODUTO ?? '—';
          const origem = item.LOCALORIGEM ?? '—';
          const destino = item.LOCALDESTINO ?? '—';
          const quantidade = item.QUANTIDADE ?? 0;
          const unidade = item.UNIDADE ?? 'UN';
          const status = item.STATUSTRANSFERENCIA ?? '—';
          const dataCadastro = item.DATACADASTRO ?? '';

          return `
            <div class="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
              <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-1">
                  <div class="text-sm font-semibold text-foreground">
                    ${escapeHtml(String(codigo))} - ${escapeHtml(String(descricao))}
                  </div>
                  <div class="form-subtitle-sm">
                    Origem: ${escapeHtml(String(origem))}
                  </div>
                  <div class="form-subtitle-sm">
                    Destino: ${escapeHtml(String(destino))}
                  </div>
                  <div class="form-subtitle-sm">
                    Quantidade: ${escapeHtmlString(formatarDecimalBr(quantidade, 2))} ${escapeHtml(String(unidade))}
                  </div>
                  <div class="form-subtitle-sm">
                    Status: ${escapeHtml(String(status))}
                  </div>
                  <div class="form-subtitle-sm">
                    Data: ${escapeHtml(formatarDataHora(dataCadastro))}
                  </div>
                </div>

                <div class="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    class="btnLogsTransferencia rounded-xl border border-amber-200 bg-white/80 px-4 py-2 form-label-sm text-amber-700 hover:bg-white transition-all"
                    data-id="${escapeHtmlString(String(id))}"
                  >
                    <i class="fas fa-clock-rotate-left mr-2"></i>
                    Histórico
                  </button>

                  <button
                    type="button"
                    class="btnReceberMaterialCentroCusto rounded-xl bg-primary text-white px-4 py-2 form-label-sm hover:opacity-90 transition-all"
                    data-id="${escapeHtmlString(String(id))}"
                  >
                    <i class="fas fa-box-open mr-2"></i>
                    Receber material
                  </button>

                  <button
                    type="button"
                    class="btnRecusarMaterialCentroCusto rounded-xl bg-destructive text-destructive-foreground px-4 py-2 form-label-sm hover:bg-destructive/90 transition-all"
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
              <p class="form-subtitle-sm">
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
              class="rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all"
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
              <p class="form-subtitle-sm">Registre, edite ou exclua transferências deste item.</p>
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
                  <label class="block form-label-sm text-foreground mb-2">Centro de custo destino</label>
                  <div class="flex flex-col sm:flex-row gap-2">
                    <select id="transferenciaCentroCustoDestino"
                      class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm" required>
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
                  <label class="block form-label-sm text-foreground mb-2">Quantidade</label>
                  <input id="transferenciaCentroCustoQuantidade" type="text"
                    class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                    placeholder="Ex. 1,0000" required>
                </div>

                <div>
                  <label class="block form-label-sm text-foreground mb-2">Usuário</label>
                  <input id="transferenciaCentroCustoUsuario" type="text"
                    class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                    value="${escapeHtml(String(usuario))}" readonly>
                </div>
              </div>

              <div>
                <label class="block form-label-sm text-foreground mb-2">Observação</label>
                <input id="transferenciaCentroCustoObservacao" type="text" maxlength="255"
                  class="w-full rounded-xl border border-border bg-white/80 form-control-sm text-sm"
                  placeholder="Opcional">
              </div>

              <div class="flex justify-end gap-2">
                <button type="button" id="btnCancelarEdicaoTransferenciaCentroCusto"
                  class="hidden rounded-xl border border-border bg-white/60 form-control-sm form-label-sm hover:bg-white/90 transition-all">
                  Cancelar edição
                </button>

                <button type="submit" id="btnSalvarTransferenciaCentroCusto"
                  class="rounded-xl bg-primary text-white form-control-sm form-label-sm hover:opacity-90 transition-all">
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
                      <th class="form-control-sm text-left font-semibold">Destino</th>
                      <th class="form-control-sm text-right font-semibold">Quantidade</th>
                      <th class="form-control-sm text-left font-semibold">UN</th>
                      <th class="form-control-sm text-left font-semibold">Usuário</th>
                      <th class="form-control-sm text-left font-semibold">Data/Hora</th>
                      <th class="form-control-sm text-left font-semibold">Status</th>
                      <th class="form-control-sm text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody id="tbodyTransferenciasCentroCusto">
                    <tr>
                      <td colspan="7" class="px-4 py-6 form-subtitle-sm text-center">Carregando transferências...</td>
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
        <td colspan="7" class="px-4 py-6 form-subtitle-sm text-center">
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
        <td class="form-control-sm text-sm">${escapeHtml(String(item.LOCAL_DESTINO ?? item.LOCALDESTINO ?? '—'))}</td>
        <td class="form-control-sm text-sm text-right">${escapeHtmlString(formatarDecimalBr(item.QUANTIDADE ?? 0, 2))}</td>
        <td class="form-control-sm text-sm">${escapeHtml(String(item.UNIDADE ?? 'UN'))}</td>
        <td class="form-control-sm text-sm">${escapeHtml(String(item.USUARIO_CADASTRO ?? item.USUARIOCADASTRO ?? '—'))}</td>
        <td class="form-control-sm text-sm">${escapeHtml(formatarDataHora(item.DATA_CADASTRO ?? item.DATACADASTRO ?? ''))}</td>
        <td class="form-control-sm text-sm">${escapeHtml(String(item.STATUS_TRANSFERENCIA ?? item.STATUSTRANSFERENCIA ?? '—'))}</td>
        <td class="form-control-sm text-sm">
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
  'aprovar_reserva_carro',
  'aprovar_reserva_carro_gestor',
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
  'perfil_acesso',
  'monitor_ping'
];


function setPerfisMsg(msg, tipo = '') {
  const el = document.getElementById('perfilMsg');
  if (!el) return;

  if (!msg) {
    el.textContent = '';
    el.className = 'form-subtitle-sm hidden';
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
  if (Number(perfil.monitor_ping) === 1) modulos.push('Monitor Ping');
  return modulos.length ? modulos.join(', ') : 'Sem permissões';
}

function rowPerfil(item) {
  const id = item.id ?? item.ID ?? '';
  const nome = item.nome ?? item.NOME ?? '';
  const permissoes = resumirPermissoes(item);

  return `
    <tr class="hover:bg-white/40 transition-all">
      <td class="form-control-sm font-medium">${escapeHtml(nome)}</td>
      <td class="form-control-sm form-subtitle-sm">${escapeHtml(permissoes)}</td>
      <td class="form-control-sm">
        <span class="inline-flex items-center px-2 py-1 rounded-full border bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
          Cadastrado
        </span>
      </td>
      <td class="form-control-sm">
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
        <td colspan="4" class="px-4 py-6 form-subtitle-sm">
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
          <td colspan="4" class="px-4 py-6 form-subtitle-sm">
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
                <h3 class="form-title-sm font-semibold text-foreground">${isEdit ? 'Editar perfil' : 'Novo perfil'}</h3>
                <p class="form-subtitle-sm">Defina quais permissões este perfil terá acesso</p>
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
                <label class="form-label-sm">Nome do perfil</label>
                <input
                  id="perfilNome"
                  type="text"
                  required
                  class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Ex.: Supervisor Comercial" />
              </div>

              <div id="perfilTree" class="space-y-3">

                <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
                  <button type="button" class="tree-toggle w-full flex items-center justify-between form-control-sm hover:bg-white/40 transition" data-target="grupo-modulos">
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
                    <label class="flex items-center gap-2"><input type="checkbox" id="aprovar_reserva_carro"> <span>Aprovar reserva de carro (Frota)</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="aprovar_reserva_carro_gestor"> <span>Aprovar reserva de carro (Gestor)</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="excluir_reserva_carro"> <span>Excluir reserva de carro</span></label>
                    <label class="flex items-center gap-2"><input type="checkbox" id="monitor_ping"><span>Monitor de Ping</span></label>
                  </div>
                </div>

                <div class="rounded-2xl border border-border bg-white/40 overflow-hidden">
                  <button type="button" class="tree-toggle w-full flex items-center justify-between form-control-sm hover:bg-white/40 transition" data-target="grupo-pedidos">
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
                  <button type="button" class="tree-toggle w-full flex items-center justify-between form-control-sm hover:bg-white/40 transition" data-target="grupo-clientes">
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
                  <button type="button" class="tree-toggle w-full flex items-center justify-between form-control-sm hover:bg-white/40 transition" data-target="grupo-gestao">
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
                  <button type="button" class="tree-toggle w-full flex items-center justify-between form-control-sm hover:bg-white/40 transition" data-target="grupo-estoque">
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
                  class="sm:flex-1 rounded-xl bg-primary text-white form-control-sm font-medium hover:opacity-90 transition-all">
                  Salvar
                </button>

                <button id="btnCancelarPerfilModal" type="button"
                  class="sm:flex-1 rounded-xl border border-border bg-white/50 form-control-sm font-medium hover:bg-white/70 transition-all">
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

let weatherCardState = 'blank';

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


// ===============================
// RESERVA DE CARRO + Agendamento Veículos
// ===============================

let agendamentosCache = [];
let filtroStatusAgendamento = 'TODOS';
let filtroBuscaAgendamento = '';

function normalizarTextoBusca(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function montarTextoPesquisaAgendamento(item) {
  const campos = [
    item?.id,
    item?.usuariosolicitante,
    item?.usuarioSolicitante,
    item?.tipoveiculo,
    item?.tipoVeiculo,
    item?.datanecessaria,
    item?.dataNecessaria,
    formatarDataHoraBR(item?.datanecessaria ?? item?.dataNecessaria ?? ''),
    item?.previsaodevolucao,
    item?.previsaoDevolucao,
    formatarDataHoraBR(item?.previsaodevolucao ?? item?.previsaoDevolucao ?? ''),
    item?.destinos,
    item?.statussolicitacao,
    item?.statusSolicitacao,
    item?.urgencia,
    item?.observacoes
  ];

  return normalizarTextoBusca(campos.filter(v => v !== null && v !== undefined).join(' '));
}

function filtrarAgendamentosPorBusca(items, termo) {
  if (!Array.isArray(items)) return [];
  const busca = normalizarTextoBusca(termo);
  if (!busca) return [...items];

  return items.filter(item => montarTextoPesquisaAgendamento(item).includes(busca));
}

function atualizarEstadoBuscaAgendamentos() {
  const input = document.getElementById('inputFiltroBuscaAgendamentos');
  const btnLimpar = document.getElementById('btnLimparBuscaAgendamentos');

  if (input && input.value !== filtroBuscaAgendamento) {
    input.value = filtroBuscaAgendamento;
  }

  if (btnLimpar) {
    btnLimpar.classList.toggle('hidden', !String(filtroBuscaAgendamento || '').trim());
  }
}

function bindBuscaAgendamentos() {
  const input = document.getElementById('inputFiltroBuscaAgendamentos');
  const btnLimpar = document.getElementById('btnLimparBuscaAgendamentos');

  if (input && input.dataset.bindBuscaAgendamento !== '1') {
    input.dataset.bindBuscaAgendamento = '1';

    input.addEventListener('input', () => {
      filtroBuscaAgendamento = input.value || '';
      atualizarEstadoBuscaAgendamentos();
      renderTabelaAgendamentos();
    });
  }

  if (btnLimpar && btnLimpar.dataset.bindBuscaAgendamento !== '1') {
    btnLimpar.dataset.bindBuscaAgendamento = '1';

    btnLimpar.addEventListener('click', () => {
      filtroBuscaAgendamento = '';
      atualizarEstadoBuscaAgendamentos();
      renderTabelaAgendamentos();
      input?.focus();
    });
  }

  atualizarEstadoBuscaAgendamentos();
}


async function usuarioEhCriadorReserva(item) {
  const usuarioLogado = String(obterUsuarioLogado?.() ?? '').trim().toUpperCase();
  const usuarioReserva = String(
    item?.usuariosolicitante ??
    item?.usuario_solicitante ??
    item?.nome_colaborador ??
    item?.nomecolaborador ??
    ''
  ).trim().toUpperCase();

  if (!usuarioLogado || !usuarioReserva) return false;

  const reservaFormulario =
    usuarioReserva.includes('FORMULÁRIO') ||
    usuarioReserva.includes('FORMULARIO');

  if (!reservaFormulario) {
    return usuarioLogado === usuarioReserva;
  }

  try {
    const usuarioId = Number(obterUsuarioIdLogado?.() ?? obterUsuarioIdSessao?.() ?? 0);
    const status = String(
      item?.status_solicitacao ??
      item?.statussolicitacao ??
      'PENDENTE'
    ).trim().toUpperCase();

    if (!usuarioId) return false;

    const APIBASE = obterApiBase?.();
    if (!APIBASE) return false;

    const resp = await fetch(
      `${APIBASE}/api/permissoes/aprovar-reserva-carro/${encodeURIComponent(usuarioId)}/${encodeURIComponent(status)}`,
      { method: 'GET' }
    );

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok || !json?.success) {
      return false;
    }

    return Number(json?.item?.permissaovalida) === 1;
  } catch (err) {
    console.error('Erro ao validar usuário da reserva formulário:', err);
    return false;
  }
}

function usuarioPodeAprovarReservaCarro() {
  const valor =
    sessionStorage.getItem('aprovarreservacarro') ??
    sessionStorage.getItem('reservarcarro') ??
    0;

  return Number(valor || 0) === 1;
}

function podeSolicitarDevolucaoReserva(item) {
  const status = String(item?.statussolicitacao ?? item?.status_solicitacao ?? '').trim().toUpperCase();
  return status === 'APROVADA' && usuarioEhCriadorReserva(item);
}

function podeConfirmarDevolucaoReserva(item) {
  const status = String(
    item?.statussolicitacao ?? item?.status_solicitacao ?? ''
  ).trim().toUpperCase();

  return ['AGUARDANDO_CONFIRMACAO', 'AGUARDANDO CONFIRMACAO'].includes(status);
}

function normalizarStatusAgendamento(status) {
  return String(status || '').trim().toUpperCase();
}

function ordemStatusAgendamento(status) {
  const s = normalizarStatusAgendamento(status);

  if (String(s).includes('PENDENTE')) return 1;
  if (['AGUARDANDO_CONFIRMACAO', 'AGUARDANDO CONFIRMACAO', 'AGUARDANDO CONFIRMAÇÃO'].includes(s)) return 2;
  if (s === 'APROVADA') return 3;
  if (['RECUSADA', 'CANCELADA'].includes(s)) return 4;
  if (['DEVOLVIDA', 'DEVOLVIDO', 'CONCLUIDA', 'CONCLUÍDA'].includes(s)) return 5;

  return 99;
}

function filtrarAgendamentosPorStatus(items, filtro) {

  if (!Array.isArray(items)) return [];
  if (!filtro || filtro === 'TODOS') return [...items];

  return items.filter(item => {
    const s = String(normalizarStatusAgendamento(item?.status_solicitacao) || '').toUpperCase();

    if (filtro === 'PENDENTE') {
      return s.includes('PENDENTE');
    }

    if (filtro === 'AGUARDANDO_CONFIRMACAO') {
      return [
        'AGUARDANDO_CONFIRMACAO',
        'AGUARDANDO CONFIRMACAO',
        'AGUARDANDO CONFIRMAÇÃO'
      ].includes(s);
    }

    if (filtro === 'RECUSADA') {
      return ['RECUSADA', 'CANCELADA'].some(x => s.includes(x));
    }

    if (filtro === 'DEVOLVIDA') {
      return ['DEVOLVIDA', 'DEVOLVIDO', 'CONCLUIDA', 'CONCLUÍDA'].some(x => s.includes(x));
    }

    return s === String(filtro).toUpperCase();
  });
}

function ordenarAgendamentos(items) {
  return [...items].sort((a, b) => {
    const ordemA = ordemStatusAgendamento(a?.status_solicitacao);
    const ordemB = ordemStatusAgendamento(b?.status_solicitacao);

    if (ordemA !== ordemB) return ordemA - ordemB;

    return Number(b?.id || 0) - Number(a?.id || 0);
  });
}

function atualizarEstadoCardsFiltro() {
  document.querySelectorAll('.card-filtro-agendamento').forEach(card => {
    const ativo = card.getAttribute('data-status') === filtroStatusAgendamento;

    card.classList.toggle('ring-2', ativo);
    card.classList.toggle('ring-primary', ativo);
    card.classList.toggle('bg-white', ativo);
    card.classList.toggle('shadow-md', ativo);
  });
}

function bindCardsFiltroAgendamento() {
  document.querySelectorAll('.card-filtro-agendamento').forEach(card => {
    if (card.dataset.bindFiltro === '1') return;

    card.dataset.bindFiltro = '1';
    card.addEventListener('click', () => {
      filtroStatusAgendamento = card.getAttribute('data-status') || 'TODOS';
      atualizarEstadoCardsFiltro();
      renderTabelaAgendamentos();
    });
  });

  atualizarEstadoCardsFiltro();
}

function removerMenuAcoesAgendamentoPortal() {
  document.getElementById('menuAcoesAgendamentoPortal')?.remove();

  document.querySelectorAll('.btn-menu-acoes-agendamento').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
  });
}

function reposicionarMenuAcoesAgendamentoPortal() {
  const menu = document.getElementById('menuAcoesAgendamentoPortal');
  if (!menu) return;

  const botaoId = menu.getAttribute('data-botao-id');
  const botao = document.getElementById(botaoId);
  if (!botao) {
    removerMenuAcoesAgendamentoPortal();
    return;
  }

  const rect = botao.getBoundingClientRect();
  const larguraMenu = 220;
  const margem = 12;

  let left = window.scrollX + rect.right - larguraMenu;
  let top = window.scrollY + rect.bottom + 8;

  if (left < margem) left = margem;
  if (left + larguraMenu > window.scrollX + window.innerWidth - margem) {
    left = window.scrollX + window.innerWidth - larguraMenu - margem;
  }

  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

function abrirMenuAcoesAgendamentoPortal(idReserva, htmlAcoes, botaoId) {
  const menuExistente = document.getElementById('menuAcoesAgendamentoPortal');
  const mesmoBotao = menuExistente?.getAttribute('data-botao-id') === botaoId;

  removerMenuAcoesAgendamentoPortal();

  if (mesmoBotao) return;

  const menu = document.createElement('div');
  menu.id = 'menuAcoesAgendamentoPortal';
  menu.setAttribute('data-botao-id', botaoId);
  menu.className = 'fixed z-[9999] min-w-[220px] overflow-hidden rounded-2xl border border-border bg-white shadow-2xl';

  menu.innerHTML = htmlAcoes || `
    <div class="px-4 py-3 text-sm text-muted-foreground">
      Sem ações disponíveis
    </div>
  `;

  document.body.appendChild(menu);
  reposicionarMenuAcoesAgendamentoPortal();

  const botao = document.getElementById(botaoId);
  botao?.setAttribute('aria-expanded', 'true');
}

function toggleMenuAcoesAgendamentoPortal(idReserva, botaoId) {
  const htmlAcoes = menusAcoesAgendamentoCache[String(idReserva)] || '';
  abrirMenuAcoesAgendamentoPortal(idReserva, htmlAcoes, botaoId);
}

document.addEventListener('click', (event) => {
  const clicouNoBotao = event.target.closest('.btn-menu-acoes-agendamento');
  const clicouNoMenu = event.target.closest('#menuAcoesAgendamentoPortal');

  if (!clicouNoBotao && !clicouNoMenu) {
    removerMenuAcoesAgendamentoPortal();
  }
});

window.addEventListener('resize', removerMenuAcoesAgendamentoPortal);
window.addEventListener('scroll', removerMenuAcoesAgendamentoPortal, true);

const menusAcoesAgendamentoCache = {};


function renderTabelaAgendamentos() {
  const tbody = document.getElementById('tbodyMeusAgendamentos');
  if (!tbody) return;

  removerMenuAcoesAgendamentoPortal();

  const itemsPorStatus = filtrarAgendamentosPorStatus(agendamentosCache, filtroStatusAgendamento);
  const itemsFiltrados = filtrarAgendamentosPorBusca(itemsPorStatus, filtroBuscaAgendamento);

  if (!itemsFiltrados.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="px-4 py-6 form-subtitle-sm text-center">
          Nenhum agendamento encontrado para o filtro selecionado.
        </td>
      </tr>
    `;
    return;
  }

  Object.keys(menusAcoesAgendamentoCache).forEach(k => delete menusAcoesAgendamentoCache[k]);

  tbody.innerHTML = itemsFiltrados.map(item => {
    const id = Number(item.id) || 0;
    const podeEditar = podeEditarReserva(item);
    const statusReserva = String(item?.status_solicitacao || item?.statussolicitacao || '').trim();
    const statusReservaJs = JSON.stringify(statusReserva);
    const podeAprovarRecusar = podeAprovarOuRecusarReserva(item);
    const podeExcluirItem = podeExcluirReserva(item);
    const podeSolicitarDevolucao = podeSolicitarDevolucaoReserva(item);
    const podeConfirmarDevolucao = podeConfirmarDevolucaoReserva(item);

    const htmlAcoes = [
      `
        <button
          type="button"
          onclick="removerMenuAcoesAgendamentoPortal(); abrirDetalhesAgendamento(${id});"
          class="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 transition-all flex items-center gap-3">
          <i class="fas fa-eye w-4 text-slate-500"></i>
          <span>Ver detalhes</span>
        </button>
      `,
      podeEditar ? `
        <button
          type="button"
          onclick="removerMenuAcoesAgendamentoPortal(); editarReservaCarro(${id});"
          class="w-full px-4 py-3 text-left text-sm hover:bg-blue-50 text-blue-700 transition-all flex items-center gap-3">
          <i class="fas fa-pen w-4"></i>
          <span>Editar reserva</span>
        </button>
      ` : '',
      podeAprovarRecusar ? `
        <button
          type="button"
          onclick="removerMenuAcoesAgendamentoPortal(); acaoAprovarReservaCarroMenu(${id});"
          class="w-full px-4 py-3 text-left text-sm hover:bg-green-50 text-green-700 transition-all flex items-center gap-3">
          <i class="fas fa-check w-4"></i>
          <span>Aprovar reserva</span>
        </button>
      ` : '',
      podeAprovarRecusar ? `
        <button
          type="button"
          onclick="removerMenuAcoesAgendamentoPortal(); acaoRecusarReservaCarroMenu(${id});"
          class="w-full px-4 py-3 text-left text-sm hover:bg-amber-50 text-amber-700 transition-all flex items-center gap-3">
          <i class="fas fa-ban w-4"></i>
          <span>Recusar reserva</span>
        </button>
      ` : '',
      podeExcluirItem ? `
        <button
          type="button"
          onclick="removerMenuAcoesAgendamentoPortal(); excluirReservaCarro(${id});"
          class="w-full px-4 py-3 text-left text-sm hover:bg-red-50 text-red-700 transition-all flex items-center gap-3">
          <i class="fas fa-trash w-4"></i>
          <span>Excluir reserva</span>
        </button>
      ` : '',
      podeSolicitarDevolucao ? `
        <button
          type="button"
          onclick="removerMenuAcoesAgendamentoPortal(); acaoSolicitarDevolucaoReservaCarro(${id});"
          class="w-full px-4 py-3 text-left text-sm hover:bg-indigo-50 text-indigo-700 transition-all flex items-center gap-3">
          <i class="fas fa-undo w-4"></i>
          <span>Fazer devolução</span>
        </button>
      ` : '',
      podeConfirmarDevolucao ? `
        <button
          type="button"
          onclick="removerMenuAcoesAgendamentoPortal(); acaoConfirmarDevolucaoReservaCarroMenu(${id});"
          class="w-full px-4 py-3 text-left text-sm hover:bg-emerald-50 text-emerald-700 transition-all flex items-center gap-3">
          <i class="fas fa-clipboard-check w-4"></i>
          <span>Confirmar devolução</span>
        </button>
      ` : ''
    ].filter(Boolean).join('');

    menusAcoesAgendamentoCache[String(id)] = htmlAcoes;

    const botaoId = `btnMenuAcoesAgendamento-${id}`;

    return `
      <tr class="border-t border-border/70">
        <td class="px-4 py-3 font-semibold">#${id || '-'}</td>
        <td class="px-4 py-3">${escapeHtml(item.usuario_solicitante || item.usuariosolicitante || '-')}</td>
        <td class="px-4 py-3">${escapeHtml(item.tipo_veiculo || item.tipoveiculo || '-')}</td>
        <td class="px-4 py-3">${escapeHtml(formatarDataHoraBR(item.data_necessaria || item.datanecessaria))}</td>
        <td class="px-4 py-3">${escapeHtml(formatarDataHoraBR(item.previsao_devolucao || item.previsaodevolucao))}</td>
        <td class="px-4 py-3">${escapeHtml(item.destinos || '-')}</td>
        <td class="px-4 py-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${classeStatusAgendamento(item.status_solicitacao || item.statussolicitacao)}">
            ${escapeHtml(item.status_solicitacao || item.statussolicitacao || 'PENDENTE')}
          </span>
        </td>
        <td class="px-4 py-3">
          <div class="flex justify-end">
            <button
              id="${botaoId}"
              type="button"
              onclick="toggleMenuAcoesAgendamentoPortal(${id}, '${botaoId}')"
              class="btn-menu-acoes-agendamento w-10 h-10 rounded-xl border border-border bg-white/70 text-foreground hover:bg-white transition-all flex items-center justify-center"
              title="Ações"
              aria-label="Abrir ações"
              aria-expanded="false">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function solicitarDevolucaoReservaCarro(idReserva, payload) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const usuario = obterUsuarioLogado?.();
  if (!usuario) throw new Error('Usuário logado não identificado.');


  const resp = await fetch(`${APIBASE}/api/reservas-carro/${encodeURIComponent(idReserva)}/devolucao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuarioDevolucao: usuario,
      ...payload
    })
  });

  const json = await resp.json().catch(() => ({}));
  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao solicitar devolução da reserva.');
  }

  return json;
}

function removerModalDevolucaoReservaCarro() {
  document.getElementById('devolucaoReservaOverlay')?.remove();
  document.getElementById('devolucaoReservaModal')?.remove();
}

async function acaoSolicitarDevolucaoReservaCarro(idReserva) {
  try {
    const item = await buscarReservaCarroPorId(idReserva);

    const status = String(item?.statussolicitacao ?? item?.status_solicitacao ?? '')
      .trim()
      .toUpperCase();

    const usuarioLogado = String(obterUsuarioLogado?.() ?? '')
      .trim()
      .toUpperCase();

    const usuarioReserva = String(item?.usuariosolicitante ?? item?.usuario_solicitante ?? '')
      .trim()
      .toUpperCase();

    const ehCriador = !!usuarioLogado && !!usuarioReserva && usuarioLogado === usuarioReserva;

    if (status !== 'APROVADA') {
      alert('Somente reservas aprovadas podem ser devolvidas.');
      return;
    }

    if (!ehCriador) {
      alert('Você não tem permissão para devolver esta reserva.');
      return;
    }

    await abrirModalDevolucaoReservaCarro(idReserva);
  } catch (err) {
    alert(err?.message || 'Erro ao iniciar devolução da reserva.');
  }
}

async function abrirModalDevolucaoReservaCarro(idReserva) {
  removerModalDevolucaoReservaCarro();

  const mobile = isMobileDevice();

  const overlay = document.createElement('div');
  overlay.id = 'devolucaoReservaOverlay';
  overlay.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm z-[230]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'devolucaoReservaModal';
  modal.className = 'fixed inset-0 z-[240]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Fazer devolução do veículo</h3>
                <p class="text-sm text-muted-foreground">
                  Preencha o checklist de devolução e registre as fotos obrigatórias do veículo.
                </p>
              </div>
              <button
                id="closeDevolucaoReservaModal"
                type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                aria-label="Fechar"
                title="Fechar"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <form id="formDevolucaoReservaCarro" class="px-6 py-6 space-y-5">
              <div id="resumoDevolucaoReserva" class="grid grid-cols-1 md:grid-cols-3 gap-4"></div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="kmDevolucaoReservaCarro" class="text-sm font-medium">KM de devolução</label>
                  <input
                    id="kmDevolucaoReservaCarro"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Informe a quilometragem final"
                  />
                </div>

                <div class="space-y-2">
                  <label for="nivelCombustivelDevolucaoReservaCarro" class="text-sm font-medium">Nível de combustível</label>
                  <select
                    id="nivelCombustivelDevolucaoReservaCarro"
                    class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Selecione...</option>
                    <option value="VAZIO">Vazio</option>
                    <option value="1/4">1/4</option>
                    <option value="1/2">1/2</option>
                    <option value="3/4">3/4</option>
                    <option value="CHEIO">Cheio</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-4 py-3 cursor-pointer">
                  <input id="chkDevolucaoDocumento" type="checkbox">
                  <span class="text-sm">Documento do veículo devolvido</span>
                </label>

                <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-4 py-3 cursor-pointer">
                  <input id="chkDevolucaoPneu" type="checkbox">
                  <span class="text-sm">Pneus conferidos</span>
                </label>

                <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-4 py-3 cursor-pointer">
                  <input id="chkDevolucaoLataria" type="checkbox">
                  <span class="text-sm">Lataria sem novas avarias</span>
                </label>

                <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-4 py-3 cursor-pointer">
                  <input id="chkDevolucaoLuzes" type="checkbox">
                  <span class="text-sm">Luzes conferidas</span>
                </label>

                <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-4 py-3 cursor-pointer">
                  <input id="chkDevolucaoLimpeza" type="checkbox">
                  <span class="text-sm">Limpeza conferida</span>
                </label>

                <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-4 py-3 cursor-pointer">
                  <input id="chkDevolucaoCombustivel" type="checkbox">
                  <span class="text-sm">Combustível conferido</span>
                </label>
              </div>

              <div class="space-y-2">
                <label for="observacaoChecklistDevolucaoReservaCarro" class="text-sm font-medium">Observações da devolução</label>
                <textarea
                  id="observacaoChecklistDevolucaoReservaCarro"
                  rows="4"
                  class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Descreva avarias, sujeira, itens faltando, combustível, condições gerais, etc."
                ></textarea>
              </div>

              <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-4">
                <div class="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div class="text-sm font-semibold text-foreground">Fotos obrigatórias da devolução</div>
                    <div class="text-xs text-muted-foreground">
                      ${mobile
                        ? 'No celular, toque em cada campo para abrir a câmera como anexo.'
                        : 'No computador, use a câmera ao vivo para tirar as fotos da devolução.'}
                    </div>
                  </div>
                  ${!mobile ? `
                    <button
                      id="btnIniciarCameraDevolucaoReserva"
                      type="button"
                      class="rounded-xl border border-border bg-white/70 px-4 py-2 text-sm font-medium hover:bg-white transition-all"
                    >
                      Iniciar câmera
                    </button>
                  ` : ''}
                </div>

                ${mobile ? `
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${montarCampoFotoMobile('Frente', 'frente')}
                    ${montarCampoFotoMobile('Traseira', 'traseira')}
                    ${montarCampoFotoMobile('Lateral esquerda', 'lateralEsquerda')}
                    ${montarCampoFotoMobile('Lateral direita', 'lateralDireita')}
                    <div class="md:col-span-2">
                      ${montarCampoFotoMobile('Painel de instrumentos', 'painel')}
                    </div>
                  </div>
                ` : `
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div class="rounded-xl border border-border bg-black/80 overflow-hidden">
                      <video
                        id="cameraPreviewDevolucaoReserva"
                        autoplay
                        playsinline
                        muted
                        webkit-playsinline
                        class="w-full h-[320px] object-cover rounded-xl bg-black"
                      ></video>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      ${montarCardFotoDesktop('Frente', 'frente')}
                      ${montarCardFotoDesktop('Traseira', 'traseira')}
                      ${montarCardFotoDesktop('Lateral esquerda', 'lateralEsquerda')}
                      ${montarCardFotoDesktop('Lateral direita', 'lateralDireita')}
                      <div class="sm:col-span-2">
                        ${montarCardFotoDesktop('Painel de instrumentos', 'painel')}
                      </div>
                    </div>
                  </div>
                  <canvas id="canvasCapturaDevolucaoReserva" class="hidden"></canvas>
                `}
              </div>

              <p id="devolucaoReservaErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

              <div class="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  id="btnConfirmarDevolucaoReserva"
                  type="submit"
                  class="sm:flex-1 rounded-xl bg-blue-600 text-white px-4 py-3 font-medium hover:opacity-90 transition-all"
                >
                  Confirmar devolução
                </button>
                <button
                  id="btnCancelarDevolucaoReserva"
                  type="button"
                  class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all"
                >
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

  const form = document.getElementById('formDevolucaoReservaCarro');
  const btnConfirmar = document.getElementById('btnConfirmarDevolucaoReserva');
  const resumo = document.getElementById('resumoDevolucaoReserva');
  const video = document.getElementById('cameraPreviewDevolucaoReserva');
  const canvas = document.getElementById('canvasCapturaDevolucaoReserva');
  const btnIniciarCamera = document.getElementById('btnIniciarCameraDevolucaoReserva');

  let reserva = null;
  let streamCamera = null;

  const fotos = {
    frente: '',
    traseira: '',
    lateralEsquerda: '',
    lateralDireita: '',
    painel: ''
  };

  function fechar() {
    pararCamera();
    removerModalDevolucaoReservaCarro();
  }

  function setErro(msg) {
    const el = document.getElementById('devolucaoReservaErro');
    if (!el) return;
    if (!msg) {
      el.textContent = '';
      el.classList.add('hidden');
      return;
    }
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function setLoading(loading) {
    if (!btnConfirmar) return;
    btnConfirmar.disabled = loading;
    btnConfirmar.textContent = loading ? 'Confirmando devolução...' : 'Confirmar devolução';
    btnConfirmar.classList.toggle('opacity-70', loading);
  }

  function renderResumo() {
    if (!resumo || !reserva) return;

    const idReservaTexto =
      reserva?.id ??
      reserva?.ID ??
      '-';

    const modeloTexto =
      reserva?.veiculo_modelo ??
      reserva?.veiculomodelo ??
      reserva?.veiculoModelo ??
      reserva?.tipo_veiculo ??
      reserva?.tipoveiculo ??
      reserva?.tipoVeiculo ??
      '-';

    const placaTexto =
      reserva?.veiculo_placa ??
      reserva?.veiculoplaca ??
      reserva?.veiculoPlaca ??
      '-';

    const marcaTexto =
      reserva?.veiculo_marca ??
      reserva?.veiculomarca ??
      reserva?.veiculoMarca ??
      '-';

    const corTexto =
      reserva?.veiculo_cor ??
      reserva?.veiculocor ??
      reserva?.veiculoCor ??
      '-';

    const kmSaidaTexto =
      reserva?.km_saida ??
      reserva?.kmsaida ??
      reserva?.kmSaida ??
      '-';

    const combustivelSaidaTexto =
      reserva?.nivel_combustivel_saida ??
      reserva?.nivelcombustivelsaida ??
      reserva?.nivelCombustivelSaida ??
      '-';

    const dataNecessariaTexto =
      reserva?.data_necessaria ??
      reserva?.datanecessaria ??
      reserva?.dataNecessaria ??
      '-';

    const previsaoDevolucaoTexto =
      reserva?.previsao_devolucao ??
      reserva?.previsaodevolucao ??
      reserva?.previsaoDevolucao ??
      '-';

    const aprovadoPorTexto =
      reserva?.usuario_aprovacao ??
      reserva?.usuarioaprovacao ??
      reserva?.usuarioAprovacao ??
      '-';

    const dataAprovacaoTexto =
      reserva?.data_aprovacao ??
      reserva?.dataaprovacao ??
      reserva?.dataAprovacao ??
      '-';

    resumo.innerHTML = `
      <div class="rounded-xl border border-border bg-white/60 p-4">
        <div class="text-xs text-muted-foreground">Reserva</div>
        <div class="mt-1 font-semibold">#${escapeHtml(idReservaTexto)}</div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4">
        <div class="text-xs text-muted-foreground">Veículo</div>
        <div class="mt-1 font-semibold">${escapeHtml(modeloTexto)}</div>
        <div class="mt-1 text-sm text-muted-foreground">${escapeHtml(placaTexto)}</div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4">
        <div class="text-xs text-muted-foreground">Período</div>
        <div class="mt-1 font-semibold">${escapeHtml(formatarTextoDataHora(dataNecessariaTexto))}</div>
        <div class="mt-1 text-sm text-muted-foreground">
          Prev. devolução: ${escapeHtml(formatarTextoDataHora(previsaoDevolucaoTexto))}
        </div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4">
        <div class="text-xs text-muted-foreground">Marca</div>
        <div class="mt-1 font-semibold">${escapeHtml(marcaTexto)}</div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4">
        <div class="text-xs text-muted-foreground">Cor</div>
        <div class="mt-1 font-semibold">${escapeHtml(corTexto)}</div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4">
        <div class="text-xs text-muted-foreground">KM na saída</div>
        <div class="mt-1 font-semibold">${escapeHtml(kmSaidaTexto)}</div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4">
        <div class="text-xs text-muted-foreground">Combustível na saída</div>
        <div class="mt-1 font-semibold">${escapeHtml(combustivelSaidaTexto)}</div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4 md:col-span-2">
        <div class="text-xs text-muted-foreground">Aprovado por</div>
        <div class="mt-1 font-semibold">${escapeHtml(aprovadoPorTexto)}</div>
        <div class="mt-1 text-sm text-muted-foreground">${escapeHtml(formatarTextoDataHora(dataAprovacaoTexto))}</div>
      </div>
    `;
  }



  function atualizarPreviewFoto(tipo, dataUrl, fileName = 'Foto capturada') {
    const mapa = {
      frente: ['previewFotoFrente', 'placeholderFotoFrente', 'nomeFotoFrente'],
      traseira: ['previewFotoTraseira', 'placeholderFotoTraseira', 'nomeFotoTraseira'],
      lateralEsquerda: ['previewFotoLateralEsquerda', 'placeholderFotoLateralEsquerda', 'nomeFotoLateralEsquerda'],
      lateralDireita: ['previewFotoLateralDireita', 'placeholderFotoLateralDireita', 'nomeFotoLateralDireita'],
      painel: ['previewFotoPainel', 'placeholderFotoPainel', 'nomeFotoPainel']
    };

    const ids = mapa[tipo];
    if (!ids) return;

    const [imgId, placeholderId, nomeId] = ids;
    const img = document.getElementById(imgId);
    const placeholder = document.getElementById(placeholderId);
    const nomeEl = document.getElementById(nomeId);

    if (img) {
      img.src = dataUrl;
      img.classList.remove('hidden');
    }
    if (placeholder) placeholder.classList.add('hidden');
    if (nomeEl) nomeEl.textContent = fileName;
  }

  async function iniciarCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Este navegador não suporta acesso à câmera.');
    }

    pararCamera();

    const tentativas = [
      { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { width: { ideal: 640 }, height: { ideal: 480 } }, audio: false }
    ];

    let ultimoErro = null;

    for (const constraints of tentativas) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamCamera = stream;
        if (video) {
          video.setAttribute('autoplay', '');
          video.setAttribute('muted', '');
          video.setAttribute('playsinline', '');
          video.setAttribute('webkit-playsinline', '');
          video.srcObject = stream;
          await video.play().catch(() => {});
        }
        return;
      } catch (err) {
        ultimoErro = err;
      }
    }

    throw ultimoErro || new Error('Não foi possível iniciar a câmera.');
  }

  function pararCamera() {
    if (streamCamera) {
      streamCamera.getTracks().forEach(track => track.stop());
      streamCamera = null;
    }
    if (video) {
      video.pause?.();
      video.srcObject = null;
    }
  }

  function capturarFoto(tipo) {
    if (!streamCamera || !video || !canvas) {
      throw new Error('Inicie a câmera antes de tirar a foto.');
    }

    const largura = video.videoWidth || 1280;
    const altura = video.videoHeight || 720;
    canvas.width = largura;
    canvas.height = altura;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, largura, altura);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    fotos[tipo] = dataUrl;
    atualizarPreviewFoto(tipo, dataUrl, 'Foto capturada na câmera');
  }

  function validarFotosObrigatorias() {
    return !!(
      fotos.frente &&
      fotos.traseira &&
      fotos.lateralEsquerda &&
      fotos.lateralDireita &&
      fotos.painel
    );
  }

  function bindInputFoto(tipo) {
    const mapa = {
      frente: 'inputFotoFrente',
      traseira: 'inputFotoTraseira',
      lateralEsquerda: 'inputFotoLateralEsquerda',
      lateralDireita: 'inputFotoLateralDireita',
      painel: 'inputFotoPainel'
    };

    const input = document.getElementById(mapa[tipo]);
    if (!input) return;

    input.addEventListener('change', async () => {
      try {
        setErro('');
        const file = input.files?.[0];
        if (!file) return;

        if (!String(file.type || '').startsWith('image/')) {
          input.value = '';
          throw new Error('Arquivo de imagem inválido.');
        }

        const base64 = await fileToBase64(file);
        fotos[tipo] = base64;
        atualizarPreviewFoto(tipo, base64, file.name || 'Imagem anexada');
      } catch (err) {
        setErro(err?.message || 'Erro ao processar foto.');
      }
    });
  }

  async function carregarDados() {
    const APIBASE = obterApiBase();
    if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

    const resp = await fetch(`${APIBASE}/api/reservas-carro/${encodeURIComponent(idReserva)}`);
    const json = await resp.json().catch(() => ({}));

    if (!resp.ok || !json?.success) {
      throw new Error(json?.message || 'Erro ao carregar dados da devolução.');
    }

    reserva = json?.item ?? null;
    renderResumo();
  }

  overlay.addEventListener('click', fechar);
  document.getElementById('closeDevolucaoReservaModal')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarDevolucaoReserva')?.addEventListener('click', fechar);

  if (mobile) {
    ['frente', 'traseira', 'lateralEsquerda', 'lateralDireita', 'painel'].forEach(bindInputFoto);
  } else {
    btnIniciarCamera?.addEventListener('click', async () => {
      try {
        setErro('');
        validarAmbienteCamera();
        await iniciarCamera();
      } catch (err) {
        setErro(err?.message || 'Não foi possível iniciar a câmera.');
      }
    });

    modal.querySelectorAll('.btnCapturarFoto').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          setErro('');
          if (!streamCamera) {
            validarAmbienteCamera();
            await iniciarCamera();
          }
          const tipo = btn.getAttribute('data-tipo');
          capturarFoto(tipo);
        } catch (err) {
          setErro(err?.message || 'Erro ao tirar foto.');
        }
      });
    });
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setErro('');

    const kmDevolucao = document.getElementById('kmDevolucaoReservaCarro')?.value;
    const nivelCombustivelDevolucao = document.getElementById('nivelCombustivelDevolucaoReservaCarro')?.value;

    if (!kmDevolucao) {
      return setErro('Informe o KM de devolução.');
    }

    const kmSaidaReserva = Number(
      reserva?.km_saida ??
      reserva?.kmsaida ??
      reserva?.kmSaida ??
      0
    );

    const kmDevolucaoNumero = Number(kmDevolucao);

    if (Number.isNaN(kmDevolucaoNumero)) {
      return setErro('Informe um KM de devolução válido.');
    }

    if (kmDevolucaoNumero < kmSaidaReserva) {
      return setErro(`O KM de devolução não pode ser menor que o KM de saída (${kmSaidaReserva}).`);
    }

    if (!nivelCombustivelDevolucao) {
      return setErro('Selecione o nível de combustível na devolução.');
    }

    if (!validarFotosObrigatorias()) {
      return setErro('É obrigatório informar as 5 fotos do veículo na devolução.');
    }

    const payload = {
      kmDevolucao,
      nivelCombustivelDevolucao,
      checklistDevolucao: {
        documentoOk: !!document.getElementById('chkDevolucaoDocumento')?.checked,
        pneuOk: !!document.getElementById('chkDevolucaoPneu')?.checked,
        latariaOk: !!document.getElementById('chkDevolucaoLataria')?.checked,
        luzesOk: !!document.getElementById('chkDevolucaoLuzes')?.checked,
        limpezaOk: !!document.getElementById('chkDevolucaoLimpeza')?.checked,
        combustivelConferido: !!document.getElementById('chkDevolucaoCombustivel')?.checked,
        observacoes: document.getElementById('observacaoChecklistDevolucaoReservaCarro')?.value?.trim() || ''
      },
      fotoFrente: fotos.frente,
      fotoTraseira: fotos.traseira,
      fotoLateralEsquerda: fotos.lateralEsquerda,
      fotoLateralDireita: fotos.lateralDireita,
      fotoPainel: fotos.painel
    };

    try {
      setLoading(true);
      const json = await solicitarDevolucaoReservaCarro(idReserva, payload);
      fechar();
      await carregarMeusAgendamentos();
      alert(json?.message || 'Devolução enviada com sucesso.');
    } catch (err) {
      setErro(err?.message || 'Erro ao solicitar devolução.');
    } finally {
      setLoading(false);
    }
  });

  try {
    await carregarDados();
  } catch (err) {
    setErro(err?.message || 'Erro ao carregar dados da devolução.');
  }
}

async function confirmarDevolucaoReservaCarro(idReserva) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const usuario = obterUsuarioLogado?.();
  if (!usuario) throw new Error('Usuário logado não identificado.');

  const resp = await fetch(`${APIBASE}/api/reservas-carro/${encodeURIComponent(idReserva)}/confirmar-devolucao`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuarioConfirmacao: usuario
    })
  });

  const json = await resp.json().catch(() => ({}));
  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao confirmar devolução.');
  }

  return json;
}

async function acaoConfirmarDevolucaoReservaCarro(idReserva, statusRecebido = '') {
  try {
    const APIBASE = obterApiBase();
    const usuarioId = sessionStorage.getItem('id');

    if (!usuarioId) {
      alert('Usuário logado não identificado.');
      return;
    }

    const statusAtual = String(statusRecebido || '').trim().toUpperCase();

    if (!statusAtual) {
      alert('Status da reserva não informado.');
      return;
    }

    const resp = await fetch(
      `${APIBASE}/api/permissoes/aprovar-reserva-carro/${usuarioId}/${encodeURIComponent(statusAtual)}`
    );

    const data = await resp.json();

    if (!resp.ok || !data?.success) {
      alert(data?.message || 'Erro ao validar permissão.');
      return;
    }

    if (Number(data?.item?.aprovarreservacarro || 0) !== 1) {
      if (statusAtual === 'DEVOLUCAO_SOLICITADA') {
        alert('Você não tem permissão para confirmar devoluções solicitadas.');
      } else if (statusAtual === 'AGUARDANDO_DEVOLUCAO') {
        alert('Você não tem permissão para confirmar devoluções nesta etapa.');
      } else {
        alert('Você não tem permissão para confirmar a devolução desta reserva.');
      }
      return;
    }

    if (statusAtual === 'AGUARDANDO_CONFIRMACAO') {
      await abrirModalConfirmacaoDevolucaoReservaCarro(idReserva);
      return;
    }

    alert('Esta reserva não está disponível para confirmação de devolução.');
  } catch (err) {
    alert(err?.message || 'Erro ao validar permissão.');
  }
}

function removerModalConfirmacaoDevolucaoReservaCarro() {
  document.getElementById('confirmacaoDevolucaoOverlay')?.remove();
  document.getElementById('confirmacaoDevolucaoModal')?.remove();
}

async function abrirModalConfirmacaoDevolucaoReservaCarro(idReserva) {
  removerModalConfirmacaoDevolucaoReservaCarro();

  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const resp = await fetch(`${APIBASE}/api/reservas-carro/${encodeURIComponent(idReserva)}`);
  const json = await resp.json().catch(() => ({}));


  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao carregar dados da devolução.');
  }

  const item = json.item || {};

  const statusAtual = String(
    item?.status_solicitacao ??
    item?.statussolicitacao ??
    ''
  ).trim().toUpperCase();


  if (!['AGUARDANDO_CONFIRMACAO', 'AGUARDANDO CONFIRMACAO'].includes(statusAtual)) {
    throw new Error('A reserva não está aguardando confirmação de devolução.');
  }

  const checklist =
    item?.checklist_devolucao && typeof item.checklist_devolucao === 'object'
      ? item.checklist_devolucao
      : item?.checklistdevolucao && typeof item.checklistdevolucao === 'object'
        ? item.checklistdevolucao
        : item?.checklist_saida && typeof item.checklist_saida === 'object'
          ? item.checklist_saida
          : item?.checklistsaida && typeof item.checklistsaida === 'object'
            ? item.checklistsaida
            : {};

  const fotos = [
    { label: 'Frente', value: item?.foto_devolucao_frente ?? item?.fotodevolucaofrente ?? item?.foto_frente ?? item?.fotofrente },
    { label: 'Traseira', value: item?.foto_devolucao_traseira ?? item?.fotodevolucaotraseira ?? item?.foto_traseira ?? item?.fototraseira },
    { label: 'Lateral esquerda', value: item?.foto_devolucao_lateral_esquerda ?? item?.fotodevolucaolateralesquerda ?? item?.foto_lateral_esquerda ?? item?.fotolateralesquerda },
    { label: 'Lateral direita', value: item?.foto_devolucao_lateral_direita ?? item?.fotodevolucaolateraldireita ?? item?.foto_lateral_direita ?? item?.fotolateraldireita },
    { label: 'Painel', value: item?.foto_devolucao_painel ?? item?.fotodevolucaopainel ?? item?.foto_painel ?? item?.fotopainel }
  ].filter(f => !!String(f.value || '').trim());

  const checklistItens = [
    { label: 'Documento do veículo devolvido', value: checklist.documentoOk },
    { label: 'Pneus conferidos', value: checklist.pneuOk },
    { label: 'Lataria sem novas avarias', value: checklist.latariaOk },
    { label: 'Luzes conferidas', value: checklist.luzesOk },
    { label: 'Limpeza conferida', value: checklist.limpezaOk },
    { label: 'Combustível conferido', value: checklist.combustivelConferido }
  ];

  const overlay = document.createElement('div');
  overlay.id = 'confirmacaoDevolucaoOverlay';
  overlay.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm z-[230]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'confirmacaoDevolucaoModal';
  modal.className = 'fixed inset-0 z-[240]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Confirmar devolução da reserva #${escapeHtml(item?.id ?? '-')}</h3>
                <p class="text-sm text-muted-foreground">Revise os dados enviados antes de confirmar a devolução.</p>
              </div>
              <button
                id="closeConfirmacaoDevolucaoModal"
                type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                aria-label="Fechar"
                title="Fechar"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="px-6 py-6 space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">Reserva</div>
                  <div class="mt-1 font-semibold">#${escapeHtml(item?.id ?? '-')}</div>
                </div>

                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">Veículo</div>
                  <div class="mt-1 font-semibold">${escapeHtml(item?.veiculo_modelo ?? item?.veiculomodelo ?? '-')}</div>
                  <div class="mt-1 text-sm text-muted-foreground">${escapeHtml(item?.veiculo_placa ?? item?.veiculoplaca ?? '-')}</div>
                </div>

                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">Usuário da devolução</div>
                  <div class="mt-1 font-semibold">${escapeHtml(item?.usuario_devolucao ?? item?.usuariodevolucao ?? item?.usuario_solicitante ?? item?.usuariosolicitante ?? '-')}</div>
                  <div class="mt-1 text-sm text-muted-foreground">${escapeHtml(formatarTextoDataHora(item?.data_devolucao ?? item?.datadevolucao ?? item?.data_aprovacao ?? '-'))}</div>
                </div>

                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">KM na saída</div>
                  <div class="mt-1 font-semibold">${escapeHtml(item?.km_saida ?? item?.kmsaida ?? '-')}</div>
                </div>

                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">KM na devolução</div>
                  <div class="mt-1 font-semibold">${escapeHtml(item?.km_devolucao ?? item?.kmdevolucao ?? '-')}</div>
                </div>

                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">Combustível na devolução</div>
                  <div class="mt-1 font-semibold">${escapeHtml(item?.nivel_combustivel_devolucao ?? item?.nivelcombustiveldevolucao ?? item?.nivel_combustivel_saida ?? item?.nivelcombustivelsaida ?? '-')}</div>
                </div>
              </div>

              <div class="rounded-2xl border border-border bg-white/60 p-5 space-y-4">
                <div>
                  <div class="text-sm font-semibold text-foreground">Checklist da devolução</div>
                  <div class="text-xs text-muted-foreground">Informações carregadas da reserva.</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${checklistItens.map(check => `
                    <div class="rounded-xl border border-border bg-white/70 px-4 py-3 flex items-center justify-between gap-3">
                      <span class="text-sm">${escapeHtml(check.label)}</span>
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${check.value ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}">
                        ${check.value ? 'OK' : 'Não'}
                      </span>
                    </div>
                  `).join('')}
                </div>

                <div class="rounded-xl border border-border bg-white/70 p-4">
                  <div class="text-xs text-muted-foreground">Observações</div>
                  <div class="mt-2 text-sm whitespace-pre-line">${escapeHtml(
                    checklist?.observacoes ||
                    item?.observacoes_devolucao ||
                    item?.observacoesdevolucao ||
                    item?.observacoes ||
                    '-'
                  )}</div>
                </div>
              </div>

              <div class="rounded-2xl border border-border bg-white/60 p-5 space-y-4">
                <div>
                  <div class="text-sm font-semibold text-foreground">Fotos</div>
                  <div class="text-xs text-muted-foreground">Imagens disponíveis na reserva.</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  ${fotos.length ? fotos.map(foto => `
                    <div class="rounded-xl border border-border bg-white/70 p-3 space-y-2">
                      <div class="text-sm font-medium">${escapeHtml(foto.label)}</div>
                      <a href="${escapeHtml(foto.value)}" target="_blank" rel="noopener noreferrer" class="block">
                        <img src="${escapeHtml(foto.value)}" alt="${escapeHtml(foto.label)}" class="w-full h-52 object-cover rounded-lg border border-border bg-slate-100 hover:opacity-95 transition-all">
                      </a>
                    </div>
                  `).join('') : `
                    <div class="md:col-span-2 lg:col-span-3 rounded-xl border border-border bg-white/70 p-4 text-sm text-muted-foreground">
                      Nenhuma foto disponível.
                    </div>
                  `}
                </div>
              </div>

              <p id="confirmacaoDevolucaoErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

              <div class="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  id="btnExecutarConfirmacaoDevolucao"
                  type="button"
                  class="sm:flex-1 rounded-xl bg-emerald-600 text-white px-4 py-3 font-medium hover:opacity-90 transition-all"
                >
                  Confirmar devolução
                </button>
                <button
                  id="btnCancelarConfirmacaoDevolucao"
                  type="button"
                  class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  function fechar() {
    removerModalConfirmacaoDevolucaoReservaCarro();
  }

  function setErro(msg) {
    const el = document.getElementById('confirmacaoDevolucaoErro');
    if (!el) return;
    if (!msg) {
      el.textContent = '';
      el.classList.add('hidden');
      return;
    }
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function setLoading(loading) {
    const btn = document.getElementById('btnExecutarConfirmacaoDevolucao');
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'Confirmando devolução...' : 'Confirmar devolução';
    btn.classList.toggle('opacity-70', loading);
  }

  overlay.addEventListener('click', fechar);
  document.getElementById('closeConfirmacaoDevolucaoModal')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarConfirmacaoDevolucao')?.addEventListener('click', fechar);

  document.getElementById('btnExecutarConfirmacaoDevolucao')?.addEventListener('click', async () => {
    try {
      setErro('');
      setLoading(true);
      const json = await confirmarDevolucaoReservaCarro(idReserva);
      fechar();
      await carregarMeusAgendamentos();
      alert(json?.message || 'Devolução confirmada com sucesso.');
    } catch (err) {
      setErro(err?.message || 'Erro ao confirmar devolução.');
    } finally {
      setLoading(false);
    }
  });
}

function atualizarCardsAgendamentos(items) {
  const total = items.length;
  const pendente = items.filter(x =>
    normalizarStatusAgendamento(x?.status_solicitacao).includes('PENDENTE')
  ).length;
  const aguardandoConfirmacao = items.filter(x =>
    ['AGUARDANDO_CONFIRMACAO', 'AGUARDANDO CONFIRMACAO', 'AGUARDANDO CONFIRMAÇÃO'].includes(normalizarStatusAgendamento(x?.status_solicitacao))
  ).length;
  const aprovada = items.filter(x => normalizarStatusAgendamento(x?.status_solicitacao) === 'APROVADA').length;
  const recusada = items.filter(x =>
    ['RECUSADA', 'CANCELADA'].includes(normalizarStatusAgendamento(x?.status_solicitacao))
  ).length;
  const devolvida = items.filter(x =>
    ['DEVOLVIDA', 'DEVOLVIDO', 'CONCLUIDA', 'CONCLUÍDA'].includes(normalizarStatusAgendamento(x?.status_solicitacao))
  ).length;

  const cardTotal = document.getElementById('cardAgendamentoTotal');
  const cardPendente = document.getElementById('cardAgendamentoPendente');
  const cardAguardandoConfirmacao = document.getElementById('cardAgendamentoAguardandoConfirmacao');
  const cardAprovada = document.getElementById('cardAgendamentoAprovada');
  const cardRecusada = document.getElementById('cardAgendamentoRecusada');
  const cardDevolvida = document.getElementById('cardAgendamentoDevolvida');

  if (cardTotal) cardTotal.textContent = total;
  if (cardPendente) cardPendente.textContent = pendente;
  if (cardAguardandoConfirmacao) cardAguardandoConfirmacao.textContent = aguardandoConfirmacao;
  if (cardAprovada) cardAprovada.textContent = aprovada;
  if (cardRecusada) cardRecusada.textContent = recusada;
  if (cardDevolvida) cardDevolvida.textContent = devolvida;
}

function removerModalReservaCarro() {
  document.getElementById('carroModalOverlay')?.remove();
  document.getElementById('carroModal')?.remove();
}

function removerModalDetalhesAgendamento() {
  document.getElementById('detalhesAgendamentoOverlay')?.remove();
  document.getElementById('detalhesAgendamentoModal')?.remove();
}

function removerModalRecusaReservaCarro() {
  document.getElementById('recusaReservaOverlay')?.remove();
  document.getElementById('recusaReservaModal')?.remove();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function todayDateTimeLocalPlus(minutesToAdd = 0) {
  const d = new Date(Date.now() + minutesToAdd * 60000);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function formatarDataHoraBR(value) {
  if (!value) return '-';

  const s = String(value).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})/);

  if (!m) return s;

  const [, ano, mes, dia, hora, minuto] = m;
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

function formatarTextoDataHora(value) {
  return formatarDataHoraBR(value);
}

function obterApiBase() {
  return (
    sessionStorage.getItem('apibase') ||
    sessionStorage.getItem('api_base') ||
    localStorage.getItem('apibase') ||
    localStorage.getItem('api_base') ||
    ''
  ).trim().replace(/\/+$/, '');
}

function classeStatusAgendamento(status) {
  const s = String(status || '').trim().toUpperCase();

  if (s === 'APROVADA') return 'bg-green-100 text-green-700 border border-green-200';
  if (s === 'AGUARDANDO_CONFIRMACAO' || s === 'AGUARDANDO CONFIRMACAO' || s === 'AGUARDANDO CONFIRMAÇÃO') {
    return 'bg-orange-100 text-orange-700 border border-orange-200';
  }
  if (s === 'RECUSADA' || s === 'CANCELADA') {
    return 'bg-red-100 text-red-700 border border-red-200';
  }
  if (s === 'DEVOLVIDA' || s === 'DEVOLVIDO' || s === 'CONCLUIDA' || s === 'CONCLUÍDA') {
    return 'bg-blue-100 text-blue-700 border border-blue-200';
  }

  return 'bg-amber-100 text-amber-700 border border-amber-200';
}

function normalizarLista(json) {
  if (Array.isArray(json?.items)) return json.items;
  if (Array.isArray(json)) return json;
  return [];
}

function podeEditarReserva(item) {
  const status = String(item?.status_solicitacao ?? item?.statussolicitacao ?? '')
    .trim()
    .toUpperCase();

  const usuarioLogado = String(obterUsuarioLogado?.() ?? '')
    .trim()
    .toUpperCase();

  const usuarioReserva = String(item?.usuario_solicitante ?? item?.usuariosolicitante ?? '')
    .trim()
    .toUpperCase();

  const ehCriador = !!usuarioLogado && !!usuarioReserva && usuarioLogado === usuarioReserva;

  return String(status || '').includes('PENDENTE') && ehCriador;
}

function podeAprovarOuRecusarReserva(item) {
  const status = String(item?.status_solicitacao || '').toUpperCase();
  return String(status || '').includes('PENDENTE');
}

function usuarioPodeExcluirReservaCarro() {
  return Number(sessionStorage.getItem('excluirreservacarro') || 0) === 1;
}

function podeExcluirReserva(item) {
  const status = String(item?.status_solicitacao || '').toUpperCase();
  const usuarioLogado = String(obterUsuarioLogado?.() || '').trim().toUpperCase();
  const usuarioReserva = String(item?.usuario_solicitante || '').trim().toUpperCase();

  const ehCriador = !!usuarioLogado && !!usuarioReserva && usuarioLogado === usuarioReserva;
  const ehMasterExclusao = usuarioPodeExcluirReservaCarro();

  if (ehCriador) {
    return String(status || '').includes('PENDENTE');
  }

  if (ehMasterExclusao) {
    const s = String(status || '').toUpperCase();
    return ['PENDENTE', 'RECUSADA', 'CANCELADA'].some(x => s.includes(x));
  }

  return false;
}

function podeVerAprovacaoRecusa() {
  const valor =
    sessionStorage.getItem('aprovarreservacarro') ??
    sessionStorage.getItem('reservarcarro') ??
    '0';

  return Number(valor || 0) === 1;
}

function botaoAcaoIcone({
  title = '',
  ariaLabel = '',
  onClick = '',
  colorClass = 'border-border bg-white/70 text-foreground hover:bg-white',
  iconClass = 'fa-solid fa-circle'
} = {}) {
  return `
    <button
      type="button"
      class="w-9 h-9 rounded-xl border ${colorClass} transition-all flex items-center justify-center"
      title="${escapeHtml(title)}"
      aria-label="${escapeHtml(ariaLabel || title)}"
      onclick="${escapeHtml(onClick)}">
      <i class="${escapeHtml(iconClass)} text-sm" aria-hidden="true"></i>
    </button>
  `;
}

async function buscarReservaCarroPorId(id) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const resp = await fetch(`${APIBASE}/api/reservas-carro/${encodeURIComponent(id)}`);
  const json = await resp.json().catch(() => ({}));

  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao buscar reserva.');
  }

  return json.item || {};
}

async function salvarReservaCarro(payload, idEdicao = null) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');
    

  const isEdit = !!idEdicao;
  const url = isEdit
    ? `${APIBASE}/api/reservas-carro/${encodeURIComponent(idEdicao)}`
    : `${APIBASE}/api/reservas-carro`;

  const response = await fetch(url, {
    method: isEdit ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || 'Erro ao salvar reserva.');
  }

  await carregarMeusAgendamentos();
  return data;
}

async function recusarReservaCarro(idReserva, motivo) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const usuario = obterUsuarioLogado?.() || '';
  if (!usuario) throw new Error('Usuário logado não identificado.');

  const resp = await fetch(`${APIBASE}/api/reservas-carro/${encodeURIComponent(idReserva)}/recusar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuarioRecusa: usuario,
      motivoRecusa: motivo
    })
  });

  const json = await resp.json().catch(() => ({}));

  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao recusar reserva.');
  }

  return json;
}

async function excluirReservaCarro(idReserva) {
  try {
    const APIBASE = obterApiBase();
    if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

    const usuario = obterUsuarioLogado?.();
    if (!usuario) throw new Error('Usuário logado não identificado.');

    const confirmar = confirm('Deseja realmente excluir esta reserva?');
    if (!confirmar) return;

    const resp = await fetch(`${APIBASE}/api/reservas-carro/${encodeURIComponent(idReserva)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuarioExclusao: usuario,
        observacaoExclusao: 'Exclusão realizada pela tela de reservas.'
      })
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok || !json?.success) {
      throw new Error(json?.message || 'Erro ao excluir reserva.');
    }

    await carregarMeusAgendamentos();
    alert(json?.message || 'Reserva excluída com sucesso.');
  } catch (err) {
    alert(err?.message || 'Erro ao excluir reserva.');
  }
}

async function abrirModalReservaCarro(reserva = null) {
  removerModalReservaCarro();
  

  const is_edit = !!(reserva && (reserva.id || reserva.ID));
  const reserva_id = Number(reserva?.id ?? reserva?.ID ?? 0) || null;

  const overlay = document.createElement('div');
  overlay.id = 'carroModalOverlay';
  overlay.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm z-[170]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'carroModal';
  modal.className = 'fixed inset-0 z-[180]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'carroModalTitle');

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-3 md:p-6">
        <div class="w-full max-w-7xl mx-auto px-2 sm:px-4">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div class="px-5 py-4 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 id="carroModalTitle" class="text-lg font-semibold text-foreground">
                  ${is_edit ? 'Editar solicitação de reserva de carro' : 'Solicitação de reserva de carro'}
                </h3>
                <p class="text-sm text-muted-foreground">
                  ${is_edit
                    ? 'Atualize os dados da reserva e consulte a disponibilidade da frota.'
                    : 'Preencha os dados da solicitação e veja os carros disponíveis ao lado.'}
                </p>
              </div>

              <button
                id="closeCarroModal"
                type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                aria-label="Fechar"
                title="Fechar"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
              <form id="carroForm" class="px-5 py-5 space-y-4 xl:border-r border-border">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="space-y-2">
                    <label for="carroTipoVeiculo" class="text-sm font-medium">Tipo de veículo</label>
                    <select
                      id="carroTipoVeiculo"
                      class="w-full rounded-xl border border-border bg-white/70 px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    >
                      <option value="" disabled>Selecione...</option>
                      <option value="SEM PREFERÊNCIA">Sem preferência</option>
                      <option value="ABERTO">Aberto</option>
                      <option value="FECHADO">Fechado</option>
                    </select>
                  </div>

                  <div class="space-y-2">
                    <label for="carroUrgencia" class="text-sm font-medium">Grau de urgência</label>
                    <select
                      id="carroUrgencia"
                      class="w-full rounded-xl border border-border bg-white/70 px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    >
                      <option value="" disabled>Selecione...</option>
                      <option value="BAIXA">Baixa</option>
                      <option value="MEDIA">Média</option>
                      <option value="ALTA">Alta</option>
                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="space-y-2">
                    <label for="carroDataNecessaria" class="text-sm font-medium">Data e hora necessária</label>
                    <input
                      id="carroDataNecessaria"
                      type="datetime-local"
                      class="w-full rounded-xl border border-border bg-white/70 px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    >
                  </div>

                  <div class="space-y-2">
                    <label for="carroPrevisaoDevolucao" class="text-sm font-medium">Previsão de devolução</label>
                    <input
                      id="carroPrevisaoDevolucao"
                      type="datetime-local"
                      class="w-full rounded-xl border border-border bg-white/70 px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    >
                  </div>
                </div>

                <div id="carroResumoFrota" class="hidden rounded-2xl border border-border bg-white/50 px-4 py-3">
                  <div class="flex flex-wrap items-center gap-2 text-xs">
                    <span class="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 border border-emerald-200">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span id="carroResumoDisponiveis">0 disponíveis</span>
                    </span>

                    <span class="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 px-3 py-1 border border-amber-200">
                      <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span id="carroResumoEmUso">0 indisponível</span>
                    </span>

                    <span class="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 px-3 py-1 border border-sky-200">
                      <span class="w-2 h-2 rounded-full bg-sky-500"></span>
                      <span id="carroResumoSemVeiculo">0 sem veículo</span>
                    </span>
                  </div>
                </div>

                <div class="space-y-2">
                  <div class="flex items-center justify-between gap-3 flex-wrap">
                    <label class="text-sm font-medium">Destinos</label>
                    <span id="carroDestinosCount" class="text-xs text-muted-foreground">0 selecionado(s)</span>
                  </div>

                  <div
                    id="carroDestinosBox"
                    class="rounded-xl border border-border bg-white/50 p-3 max-h-52 overflow-auto no-scrollbar space-y-2"
                  >
                    <p id="carroDestinosLoading" class="text-sm text-muted-foreground">Carregando destinos...</p>
                  </div>
                </div>

                <div class="space-y-2">
                  <label for="carroObservacoes" class="text-sm font-medium">Finalizadade da reserva</label>
                  <textarea
                    id="carroObservacoes"
                    rows="3"
                    required
                    class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    placeholder="Informe a finalidade da reserva."
                  ></textarea>
                </div>

                <p id="carroFormErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

                <div class="pt-1 flex flex-col sm:flex-row gap-3">
                  <button
                    id="btnSalvarReservaCarro"
                    type="submit"
                    class="sm:flex-1 rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90 transition-all"
                  >
                    ${is_edit ? 'Salvar alterações' : 'Salvar'}
                  </button>

                  <button
                    id="btnCancelarReservaCarro"
                    type="button"
                    class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>

              <aside class="px-5 py-5 bg-white/20 space-y-4">
                <div class="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h4 class="text-base font-semibold text-foreground">Frota e reservas ativas</h4>
                    <p class="text-xs text-muted-foreground">
                      Mostra veículos disponíveis, veículos ocupados e solicitações ainda sem veículo.
                    </p>
                  </div>

                  <button
                    id="btnAtualizarFrotaCarro"
                    type="button"
                    class="rounded-xl border border-border bg-white/60 px-3 py-2 text-sm font-medium hover:bg-white/80 transition-all"
                  >
                    Atualizar
                  </button>
                </div>

                <div class="rounded-2xl border border-border bg-white/40 p-3">
                  <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div class="rounded-xl bg-white/70 border border-border px-3 py-2">
                      <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Disponíveis</div>
                      <div id="carroQtdDisponiveis" class="text-lg font-semibold text-emerald-700">-</div>
                    </div>

                    <div class="rounded-xl bg-white/70 border border-border px-3 py-2">
                      <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Indisponível</div>
                      <div id="carroQtdEmUso" class="text-lg font-semibold text-amber-700">-</div>
                    </div>

                    <div class="rounded-xl bg-white/70 border border-border px-3 py-2">
                      <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Sem veículo</div>
                      <div id="carroQtdSemVeiculo" class="text-lg font-semibold text-sky-700">-</div>
                    </div>

                    <div class="rounded-xl bg-white/70 border border-border px-3 py-2">
                      <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Total</div>
                      <div id="carroQtdTotal" class="text-lg font-semibold text-foreground">-</div>
                    </div>
                  </div>
                </div>

                <div id="carroSolicitacoesSemVeiculoBox" class="space-y-3"></div>
                <div id="carroFrotaBox" class="space-y-3 max-h-[52vh] overflow-auto no-scrollbar">
                  <p class="text-sm text-muted-foreground">Carregando frota...</p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const input_tipo_veiculo = document.getElementById('carroTipoVeiculo');
  const input_urgencia = document.getElementById('carroUrgencia');
  const input_data_necessaria = document.getElementById('carroDataNecessaria');
  const input_previsao_devolucao = document.getElementById('carroPrevisaoDevolucao');
  const input_observacoes = document.getElementById('carroObservacoes');
  const destinos_box = document.getElementById('carroDestinosBox');
  const destinos_count = document.getElementById('carroDestinosCount');
  const destinos_loading = document.getElementById('carroDestinosLoading');
  const frota_box = document.getElementById('carroFrotaBox');
  const solicitacoes_sem_veiculo_box = document.getElementById('carroSolicitacoesSemVeiculoBox');
  const form = document.getElementById('carroForm');
  const btn_salvar = document.getElementById('btnSalvarReservaCarro');
  const btn_atualizar_frota = document.getElementById('btnAtualizarFrotaCarro');
  const resumo_frota = document.getElementById('carroResumoFrota');
  const resumo_disponiveis = document.getElementById('carroResumoDisponiveis');
  const resumo_em_uso = document.getElementById('carroResumoEmUso');
  const resumo_sem_veiculo = document.getElementById('carroResumoSemVeiculo');
  const qtd_disponiveis = document.getElementById('carroQtdDisponiveis');
  const qtd_em_uso = document.getElementById('carroQtdEmUso');
  const qtd_sem_veiculo = document.getElementById('carroQtdSemVeiculo');
  const qtd_total = document.getElementById('carroQtdTotal');

  const selected_destinos = new Set();
  let destinos_cache = [];
  let frota_cache = [];
  let solicitacoes_sem_veiculo_cache = [];
  let carro_selecionado_id = String(
    reserva?.veiculo_id ?? reserva?.carro_id ?? reserva?.veiculoId ?? ''
  ).trim();

  function fechar() {
    removerModalReservaCarro();
  }

  function set_erro(msg) {
    const el = document.getElementById('carroFormErro');
    if (!el) return;

    if (!msg) {
      el.textContent = '';
      el.classList.add('hidden');
      return;
    }

    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function set_salvar_loading(loading) {
    if (!btn_salvar) return;

    btn_salvar.disabled = !!loading;
    btn_salvar.textContent = loading
      ? (is_edit ? 'Salvando alterações...' : 'Salvando...')
      : (is_edit ? 'Salvar alterações' : 'Salvar');

    btn_salvar.classList.toggle('opacity-70', !!loading);
  }

  function escape_safe(v) {
    if (typeof escape_html === 'function') return escape_html(v ?? '');
    return String(v ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function fmt_data_hora(valor) {
    if (!valor) return '-';
    try {
      const d = new Date(valor);
      if (Number.isNaN(d.getTime())) return String(valor);
      return d.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } catch (_) {
      return String(valor);
    }
  }

  function is_data_atrasada(valor) {
    if (!valor) return false;
    try {
      const data = new Date(valor);
      if (Number.isNaN(data.getTime())) return false;
      return data.getTime() < Date.now();
    } catch (_) {
      return false;
    }
  }

  function get_classe_previsao_devolucao(valor) {
    return is_data_atrasada(valor)
      ? 'text-red-700 bg-red-50 border-red-200'
      : 'text-blue-700 bg-blue-50 border-blue-200';
  }

  function get_texto_status_previsao(valor) {
    return is_data_atrasada(valor) ? 'Devolução atrasada' : 'Devolução no prazo';
  }

  function atualizar_contador() {
    if (destinos_count) {
      destinos_count.textContent = `${selected_destinos.size} selecionado(s)`;
    }
  }

  function carro_esta_disponivel(carro) {
    const disponibilidade = String(carro?.disponibilidade ?? '').trim().toUpperCase();
    return disponibilidade === 'DISPONIVEL';
  }

  function get_status_reserva_atual(carro) {
    return String(
      carro?.status_solicitacao_atual ??
      carro?.status_reserva_atual ??
      carro?.status_reserva ??
      carro?.status_solicitacao ??
      ''
    ).trim().toUpperCase();
  }

  function get_timestamp_ordenacao_frota(carro) {
    const valor =
      carro?.data_reserva_atual ??
      carro?.data_reserva ??
      carro?.previsao_devolucao ??
      '';

    if (!valor) return Number.MAX_SAFE_INTEGER;

    const d = new Date(valor);
    if (Number.isNaN(d.getTime())) return Number.MAX_SAFE_INTEGER;

    return d.getTime();
  }

  function atualizar_resumo_frota() {
    const totalFrota = Array.isArray(frota_cache) ? frota_cache.length : 0;

    const disponiveis = (frota_cache || []).filter((item) => {
      return carro_esta_disponivel(item);
    }).length;

    const emUso = (frota_cache || []).filter((item) => {
      return !carro_esta_disponivel(item);
    }).length;

    const semVeiculo = Array.isArray(solicitacoes_sem_veiculo_cache)
      ? solicitacoes_sem_veiculo_cache.length
      : 0;

    if (qtd_disponiveis) qtd_disponiveis.textContent = String(disponiveis);
    if (qtd_em_uso) qtd_em_uso.textContent = String(emUso);
    if (qtd_sem_veiculo) qtd_sem_veiculo.textContent = String(semVeiculo);
    if (qtd_total) qtd_total.textContent = String(totalFrota + semVeiculo);

    if (resumo_disponiveis) resumo_disponiveis.textContent = `${disponiveis} disponíveis`;
    if (resumo_em_uso) resumo_em_uso.textContent = `${emUso} indisponível`;
    if (resumo_sem_veiculo) resumo_sem_veiculo.textContent = `${semVeiculo} sem veículo`;

    resumo_frota?.classList.toggle('hidden', totalFrota + semVeiculo <= 0);
  }

  function render_destinos() {
    if (!destinos_box) return;

    if (!Array.isArray(destinos_cache) || !destinos_cache.length) {
      destinos_box.innerHTML = `<p class="text-sm text-muted-foreground">Nenhum destino encontrado.</p>`;
      atualizar_contador();
      return;
    }

    destinos_box.innerHTML = destinos_cache.map((item) => {
      const id = String(item.id ?? item.ID ?? '').trim();
      const nome = String(item.nome ?? item.NOME ?? '').trim();
      const checked = selected_destinos.has(id) ? 'checked' : '';

      return `
        <label class="flex items-start gap-3 rounded-xl border border-border bg-white/60 hover:bg-white/80 transition-all px-3 py-2 cursor-pointer">
          <input
            type="checkbox"
            class="mt-1 carro-destino-checkbox"
            data-id="${escape_safe(id)}"
            ${checked}
          >
          <div class="min-w-0 flex-1">
            <div class="text-sm font-semibold text-foreground truncate">${escape_safe(nome || 'Sem nome')}</div>
            <div class="text-xs text-muted-foreground">ID: ${escape_safe(id)}</div>
          </div>
        </label>
      `;
    }).join('');

    destinos_box.querySelectorAll('.carro-destino-checkbox').forEach((chk) => {
      chk.addEventListener('change', () => {
        const id = String(chk.getAttribute('data-id') || '').trim();
        if (!id) return;

        if (chk.checked) selected_destinos.add(id);
        else selected_destinos.delete(id);

        atualizar_contador();
      });
    });

    atualizar_contador();
  }

  function get_tipo_frota(carro) {
    return String(
      carro?.tipo_veiculo ??
      carro?.tipoVeiculo ??
      carro?.tipo ??
      carro?.categoria ??
      ''
    ).trim();
  }

  function get_nome_destinos(detalhe) {
    if (!Array.isArray(detalhe?.destinos)) return '-';

    const nomes = detalhe.destinos
      .map((d) => String(d?.nome ?? d?.NOME ?? d?.descricao ?? '').trim())
      .filter(Boolean);

    return nomes.length ? nomes.join(', ') : '-';
  }

  function parse_api_date_sem_timezone(valor) {
    if (!valor) return null;

    if (valor instanceof Date) {
      return Number.isNaN(valor.getTime()) ? null : valor;
    }

    const str = String(valor).trim();
    if (!str) return null;

    const match = str.match(
      /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?Z?$/
    );

    if (match) {
      const [, ano, mes, dia, hora, minuto, segundo = '00'] = match;
      return new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia),
        Number(hora),
        Number(minuto),
        Number(segundo)
      );
    }

    const d = new Date(str);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function fmt_data_hora(valor) {
    if (!valor) return '-';

    try {
      const d = parse_api_date_sem_timezone(valor);
      if (!d) return String(valor);

      return d.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } catch (_) {
      return String(valor);
    }
  }

  function is_data_atrasada(valor) {
    if (!valor) return false;

    try {
      const data = parse_api_date_sem_timezone(valor);
      if (!data) return false;
      return data.getTime() < Date.now();
    } catch (_) {
      return false;
    }
  }

  function get_timestamp_ordenacao_frota(carro) {
    const valor =
      carro?.data_reserva_atual ??
      carro?.data_reserva ??
      carro?.previsao_devolucao ??
      '';

    if (!valor) return Number.MAX_SAFE_INTEGER;

    const d = parse_api_date_sem_timezone(valor);
    if (!d) return Number.MAX_SAFE_INTEGER;

    return d.getTime();
  }

  function render_solicitacoes_sem_veiculo() {
    if (!solicitacoes_sem_veiculo_box) return;

    if (!Array.isArray(solicitacoes_sem_veiculo_cache) || !solicitacoes_sem_veiculo_cache.length) {
      solicitacoes_sem_veiculo_box.innerHTML = '';
      return;
    }

    solicitacoes_sem_veiculo_box.innerHTML = `
      <div class="rounded-2xl border border-sky-200 bg-sky-50/70 p-3 space-y-3">
        <div>
          <h5 class="text-sm font-semibold text-sky-800">Solicitações sem veículo</h5>
          <p class="text-xs text-sky-700/90">
            Reservas ativas que ainda não foram vinculadas a um carro.
          </p>
        </div>

        <div class="space-y-2">
          ${solicitacoes_sem_veiculo_cache.map((item) => {
            const solicitante = String(
              item?.solicitante ??
              item?.nome_colaborador ??
              item?.usuario_solicitante ??
              '-'
            ).trim();

            const tipo = String(item?.tipo_veiculo ?? 'Não informado').trim() || 'Não informado';
            const status = String(item?.status_solicitacao ?? '-').trim() || '-';
            const dataNec = item?.data_necessaria ?? null;
            const prevDev = item?.previsao_devolucao ?? null;

            const destinos = Array.isArray(item?.destinos) ? item.destinos : [];

            const destinosTexto = destinos.length
              ? destinos
                  .map((dest) => String(dest?.nome ?? '').trim())
                  .filter(Boolean)
                  .join(', ')
              : 'Nenhum destino informado';

            return `
              <div class="rounded-xl border border-sky-200 bg-white/80 p-3 space-y-2">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <div class="text-sm font-semibold text-foreground">${escape_safe(solicitante)}</div>
                    <div class="text-xs text-muted-foreground">Tipo: ${escape_safe(tipo)}</div>
                  </div>

                  <span class="shrink-0 rounded-full border border-sky-200 bg-sky-100 text-sky-700 px-2.5 py-1 text-[11px] font-semibold">
                    ${escape_safe(status)}
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div class="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2">
                    <div class="uppercase tracking-wide text-muted-foreground">Data necessária</div>
                    <div class="text-foreground font-medium">${escape_safe(fmt_data_hora(dataNec))}</div>
                  </div>

                  <div class="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2">
                    <div class="uppercase tracking-wide text-muted-foreground">Previsão devolução</div>
                    <div class="text-foreground font-medium">${escape_safe(fmt_data_hora(prevDev))}</div>
                  </div>

                  <div class="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-2 md:col-span-2">
                    <div class="uppercase tracking-wide text-muted-foreground">Destinos</div>
                    <div class="text-foreground font-medium whitespace-pre-line">
                      ${escape_safe(destinosTexto)}
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function render_frota() {
    if (!frota_box) return;

    const filtro_tipo = String(input_tipo_veiculo?.value || '').trim().toUpperCase();
    let lista = Array.isArray(frota_cache) ? [...frota_cache] : [];

    if (filtro_tipo && filtro_tipo !== 'SEM PREFERÊNCIA') {
      lista = lista.filter((item) => {
        const tipo = get_tipo_frota(item).toUpperCase();
        return !tipo || tipo === filtro_tipo || tipo === 'SEM PREFERÊNCIA';
      });
    }

    lista.sort((a, b) => {
      const prioridadeA = carro_esta_disponivel(a) ? 1 : 0;
      const prioridadeB = carro_esta_disponivel(b) ? 1 : 0;

      if (prioridadeA !== prioridadeB) {
        return prioridadeA - prioridadeB;
      }

      const dataA = get_timestamp_ordenacao_frota(a);
      const dataB = get_timestamp_ordenacao_frota(b);

      if (dataA !== dataB) {
        return dataA - dataB;
      }

      const placaA = String(a?.placa || '').trim();
      const placaB = String(b?.placa || '').trim();

      return placaA.localeCompare(placaB, 'pt-BR');
    });

    if (!lista.length) {
      frota_box.innerHTML = `
        <div class="rounded-2xl border border-border bg-white/60 p-4">
          <p class="text-sm text-muted-foreground">
            Nenhum carro encontrado para o filtro/período informado.
          </p>
        </div>
      `;
      atualizar_resumo_frota();
      return;
    }

    frota_box.innerHTML = lista.map((item) => {
      const id = String(item?.id ?? '').trim();
      const veiculoId = String(item?.veiculo_id ?? item?.id ?? '').trim();
      const placa = String(item?.placa ?? 'Sem placa').trim();
      const modelo = String(item?.modelo ?? 'Sem modelo').trim();
      const marca = String(item?.marca ?? '').trim();
      const tipo = get_tipo_frota(item) || 'Não informado';
      const disponivel = carro_esta_disponivel(item);
      const devolucao = item?.previsao_devolucao ?? '';
      const data_reserva = item?.data_reserva_atual ?? '';
      const reserva_id_atual = item?.reserva_id_atual ?? null;
      const km_atual = item?.km_atual ?? '';
      const selecionado = disponivel && carro_selecionado_id && String(carro_selecionado_id) === veiculoId;
      const classePrevisao = get_classe_previsao_devolucao(devolucao);
      const textoStatusPrevisao = get_texto_status_previsao(devolucao);
      const solicitanteAtual = String(item?.solicitante_atual ?? '').trim();
      const statusReservaAtual = get_status_reserva_atual(item);

      return `
        <div
          class="rounded-2xl border ${selecionado ? 'border-primary ring-2 ring-primary/20' : 'border-border'} bg-white/70 p-3 space-y-2"
          data-carro-card="${escape_safe(veiculoId || id)}"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="text-sm font-semibold text-foreground truncate">${escape_safe(placa)}</div>
              <div class="text-xs text-muted-foreground truncate">${escape_safe(modelo)}${marca ? ` • ${escape_safe(marca)}` : ''}</div>
              <div class="text-[11px] text-muted-foreground">Tipo: ${escape_safe(tipo)} • KM: ${escape_safe(km_atual || '-')}</div>
            </div>

            <span class="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
              disponivel
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                : 'bg-amber-100 text-amber-700 border border-amber-200'
            }">
              ${disponivel ? 'DISPONÍVEL' : escape_safe(statusReservaAtual || 'EM USO')}
            </span>
          </div>

          ${
            disponivel
              ? ``
              : `
                <button
                  type="button"
                  class="btn-detalhe-carro w-full text-left rounded-xl border border-border bg-white/60 px-3 py-2.5 hover:bg-white transition-all"
                  data-id="${escape_safe(veiculoId)}"
                  data-reserva-id-atual="${escape_safe(reserva_id_atual || '')}"
                >
                
                  <div class="flex items-center justify-between gap-3 mt-2">
                    <div class="min-w-0">
                      <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Previsão devolução</div>
                      <div class="text-sm font-medium ${is_data_atrasada(devolucao) ? 'text-red-700' : 'text-blue-700'}">
                        ${escape_safe(fmt_data_hora(devolucao))}
                      </div>
                    </div>

                    <span class="shrink-0 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${classePrevisao}">
                      ${escape_safe(textoStatusPrevisao)}
                    </span>
                  </div>

                  <div class="mt-2 text-[11px] text-muted-foreground">
                    Reserva: ${escape_safe(fmt_data_hora(data_reserva))}
                  </div>
                </button>

                <div id="detalhe-carro-${escape_safe(veiculoId)}" class="hidden"></div>
              `
          }
        </div>
      `;
    }).join('');

    bind_eventos_frota();
    atualizar_resumo_frota();
  }

  async function carregar_destinos() {
    try {
      const APIBASE = obterApiBase();
      if (!APIBASE) {
        throw new Error('APIBASE não configurada na sessão.');
      }

      const resp = await fetch(`${APIBASE}/api/local-trabalho`, { method: 'GET' });
      const json = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        throw new Error(json?.message || `Erro ao listar destinos. Status ${resp.status}`);
      }

      destinos_cache = typeof normalizarLista === 'function'
        ? normalizarLista(json)
        : (Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : []));

      const destinos_existentes = Array.isArray(reserva?.destinos)
        ? reserva.destinos
        : [];

      destinos_existentes.forEach((dest) => {
        const id = String(dest?.id ?? dest?.ID ?? '').trim();
        if (id) selected_destinos.add(id);
      });

      render_destinos();
    } catch (err) {
      destinos_box.innerHTML = `
        <p class="text-sm text-destructive whitespace-pre-line">
          ${escape_safe(err?.message || 'Erro ao carregar destinos.')}
        </p>
      `;
    } finally {
      destinos_loading?.remove();
    }
  }

  async function carregar_frota() {
    try {
      const APIBASE = obterApiBase();
      if (!APIBASE) {
        throw new Error('APIBASE não configurada na sessão.');
      }

      const inicio = input_data_necessaria?.value || '';
      const fim = input_previsao_devolucao?.value || '';
      const tipo = input_tipo_veiculo?.value || '';
      const usuarioLogado = String(obterUsuarioLogado?.() || '').trim();

      frota_box.innerHTML = `<p class="text-sm text-muted-foreground">Carregando frota...</p>`;
      if (solicitacoes_sem_veiculo_box) {
        solicitacoes_sem_veiculo_box.innerHTML = '';
      }

      const params = new URLSearchParams();
      if (inicio) params.set('inicio', inicio);
      if (fim) params.set('fim', fim);
      if (tipo && tipo !== 'SEM PREFERÊNCIA') params.set('tipo_veiculo', tipo);
      if (usuarioLogado) params.set('usuario_logado', usuarioLogado);

      const url = `${APIBASE}/api/frota-carros-disponibilidade?${params.toString()}`;


      const resp = await fetch(url, { method: 'GET' });
      const json = await resp.json().catch(() => ({}));


      if (!resp.ok) {
        throw new Error(json?.message || `Erro ao carregar frota. Status ${resp.status}`);
      }

      frota_cache = Array.isArray(json?.items)
        ? json.items.map((item) => ({
            id: item?.id ?? null,
            veiculo_id: item?.veiculo_id ?? item?.id ?? null,
            placa: item?.placa ?? '',
            modelo: item?.modelo ?? '',
            marca: item?.marca ?? '',
            cor: item?.cor ?? '',
            ano: item?.ano ?? null,
            km_atual: item?.km_atual ?? null,
            status_veiculo: item?.status_veiculo ?? '',
            ativo: item?.ativo ?? 0,
            tipo_veiculo: item?.tipo_veiculo ?? '',
            disponibilidade: String(item?.disponibilidade ?? '').trim().toUpperCase(),
            previsao_devolucao: item?.previsao_devolucao ?? null,
            reserva_id_atual: item?.reserva_id_atual ?? null,
            status_solicitacao_atual: item?.status_solicitacao_atual ?? null,
            usuario_solicitante: item?.usuario_solicitante ?? null,
            nome_colaborador: item?.nome_colaborador ?? null,
            solicitante_atual: item?.solicitante_atual ?? null,
            data_reserva_atual: item?.data_reserva_atual ?? null
          }))
        : [];

      solicitacoes_sem_veiculo_cache = Array.isArray(json?.solicitacoes_sem_veiculo)
        ? json.solicitacoes_sem_veiculo.map((item) => ({
            id: item?.id ?? null,
            usuario_solicitante: item?.usuario_solicitante ?? null,
            nome_colaborador: item?.nome_colaborador ?? null,
            solicitante: item?.solicitante ?? item?.nome_colaborador ?? item?.usuario_solicitante ?? null,
            tipo_veiculo: item?.tipo_veiculo ?? '',
            status_solicitacao: item?.status_solicitacao ?? '',
            data_necessaria: item?.data_necessaria ?? null,
            previsao_devolucao: item?.previsao_devolucao ?? null,
            observacoes: item?.observacoes ?? null,
            data_solicitacao: item?.data_solicitacao ?? null,
            destinos: Array.isArray(item?.destinos)
              ? item.destinos.map((dest) => ({
                  id: dest?.id ?? null,
                  nome: dest?.nome ?? ''
                }))
              : []
          }))
        : [];


      render_solicitacoes_sem_veiculo();
      render_frota();
      atualizar_resumo_frota();
    } catch (err) {
      console.error('[FROTA] erro:', err);
      frota_cache = [];
      solicitacoes_sem_veiculo_cache = [];

      frota_box.innerHTML = `
        <div class="rounded-2xl border border-border bg-white/60 p-4">
          <p class="text-sm text-destructive whitespace-pre-line">
            ${escape_safe(err?.message || 'Erro ao carregar frota.')}
          </p>
        </div>
      `;

      if (solicitacoes_sem_veiculo_box) {
        solicitacoes_sem_veiculo_box.innerHTML = '';
      }

      atualizar_resumo_frota();
    }
  }

  function frotabox_inner_loading() {
    frota_box.innerHTML = `<p class="text-sm text-muted-foreground">Carregando frota...</p>`;
  }

  async function buscar_detalhe_reserva_ativa_carro(carro_id) {
    const APIBASE = obterApiBase();
    if (!APIBASE) {
      throw new Error('APIBASE não configurada na sessão.');
    }

    const resp = await fetch(`${APIBASE}/api/frota-carros/${encodeURIComponent(carro_id)}/reserva-ativa`, {
      method: 'GET'
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      throw new Error(json?.message || `Erro ao buscar detalhes da reserva ativa. Status ${resp.status}`);
    }

    return json?.data || json;
  }

  function marcar_carro_selecionado() {
    document.querySelectorAll('[data-carro-card]').forEach((card) => {
      const id = String(card.getAttribute('data-carro-card') || '').trim();
      const ativo = !!(carro_selecionado_id && id === carro_selecionado_id);

      card.classList.toggle('border-primary', ativo);
      card.classList.toggle('ring-2', ativo);
      card.classList.toggle('ring-primary/20', ativo);

      if (!ativo) card.classList.remove('border-primary');

      const btn = card.querySelector('.btn-selecionar-carro');
      if (btn) {
        btn.textContent = ativo ? 'Carro selecionado' : 'Selecionar este carro';
      }
    });
  }

  function bind_eventos_frota() {
    document.querySelectorAll('.btn-selecionar-carro').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = String(btn.getAttribute('data-id') || '').trim();
        if (!id) return;

        carro_selecionado_id = id;
        marcar_carro_selecionado();
      });
    });

    document.querySelectorAll('.btn-detalhe-carro').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const veiculoId = String(btn.getAttribute('data-id') || '').trim();
        if (!veiculoId) return;

        const box = document.getElementById(`detalhe-carro-${veiculoId}`);
        if (!box) return;

        if (!box.classList.contains('hidden')) {
          box.classList.add('hidden');
          box.innerHTML = '';
          return;
        }

        document.querySelectorAll('[id^="detalhe-carro-"]').forEach((el) => {
          if (el !== box) {
            el.classList.add('hidden');
            el.innerHTML = '';
          }
        });

        box.classList.remove('hidden');
        box.innerHTML = `
          <div class="rounded-xl border border-border bg-slate-50/80 px-3 py-3">
            <p class="text-sm text-muted-foreground">Carregando detalhes da reserva...</p>
          </div>
        `;

        try {
          const detalhe = await buscar_detalhe_reserva_ativa_carro(veiculoId);

          const solicitante = String(
            detalhe?.solicitante ??
            detalhe?.usuario_solicitante ??
            detalhe?.nome_colaborador ??
            '-'
          ).trim() || '-';

          const data_reserva = detalhe?.data_reserva ?? detalhe?.data_solicitacao ?? '';
          const previsao = detalhe?.previsao_devolucao ?? '';
          const destinos = get_nome_destinos(detalhe);

          box.innerHTML = `
            <div class="rounded-xl border border-border bg-slate-50/80 px-3 py-3 space-y-3">
              <div>
                <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Solicitante</div>
                <div class="text-sm font-medium text-foreground">${escape_safe(solicitante)}</div>
              </div>

              <div>
                <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Data da reserva</div>
                <div class="text-sm text-foreground">${escape_safe(fmt_data_hora(data_reserva))}</div>
              </div>

              <div>
                <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Previsão de devolução</div>
                <div class="text-sm text-foreground">${escape_safe(fmt_data_hora(previsao))}</div>
              </div>

              <div>
                <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Destinos</div>
                <div class="text-sm text-foreground whitespace-pre-line">${escape_safe(destinos)}</div>
              </div>
            </div>
          `;
        } catch (err) {
          box.innerHTML = `
            <div class="rounded-xl border border-border bg-white/70 px-3 py-3">
              <p class="text-sm text-destructive whitespace-pre-line">
                ${escape_safe(err?.message || 'Erro ao carregar detalhes da reserva.')}
              </p>
            </div>
          `;
        }
      });
    });

    marcar_carro_selecionado();
  }

  overlay.addEventListener('click', fechar);
  document.getElementById('closeCarroModal')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarReservaCarro')?.addEventListener('click', fechar);
  btn_atualizar_frota?.addEventListener('click', carregar_frota);

  if (is_edit) {
    if (input_tipo_veiculo) {
      input_tipo_veiculo.value = String(
        reserva?.tipo_veiculo ??
        reserva?.tipoVeiculo ??
        ''
      ).trim();
    }

    if (input_urgencia) {
      input_urgencia.value = String(reserva?.urgencia ?? '').trim();
    }

    if (input_data_necessaria) {
      input_data_necessaria.value = String(
        reserva?.data_necessaria ??
        reserva?.dataNecessaria ??
        ''
      ).slice(0, 16);
    }

    if (input_previsao_devolucao) {
      input_previsao_devolucao.value = String(
        reserva?.previsao_devolucao ??
        reserva?.previsaoDevolucao ??
        ''
      ).slice(0, 16);
    }

    if (input_observacoes) {
      input_observacoes.value = String(reserva?.observacoes ?? '').trim();
    }
  } else {
    const agora = todayDateTimeLocalPlus(10);
    const depois = todayDateTimeLocalPlus(130);

    if (input_data_necessaria) {
      input_data_necessaria.min = todayDateTimeLocalPlus(0);
      input_data_necessaria.value = agora;
    }

    if (input_previsao_devolucao) {
      input_previsao_devolucao.min = agora;
      input_previsao_devolucao.value = depois;
    }
  }

  input_data_necessaria?.addEventListener('change', () => {
    if (!input_previsao_devolucao) return;

    input_previsao_devolucao.min = input_data_necessaria.value || todayDateTimeLocalPlus(0);

    if (
      input_previsao_devolucao.value &&
      input_data_necessaria.value &&
      input_previsao_devolucao.value <= input_data_necessaria.value
    ) {
      input_previsao_devolucao.value = input_data_necessaria.value;
    }

    carregar_frota();
  });

  input_previsao_devolucao?.addEventListener('change', carregar_frota);
  input_tipo_veiculo?.addEventListener('change', carregar_frota);

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    set_erro('');

    if (!form.reportValidity()) return;

    const tipo_veiculo = document.getElementById('carroTipoVeiculo')?.value?.trim();
    const urgencia = document.getElementById('carroUrgencia')?.value?.trim();
    const data_necessaria = document.getElementById('carroDataNecessaria')?.value;
    const previsao_devolucao = document.getElementById('carroPrevisaoDevolucao')?.value;
    const observacoes = document.getElementById('carroObservacoes')?.value?.trim() || '';
    const destinos = Array.from(selected_destinos.values());
    const usuario_solicitante = obterUsuarioLogado?.();

    if (!tipo_veiculo) return set_erro('Selecione o tipo de veículo.');
    if (!urgencia) return set_erro('Selecione o grau de urgência.');
    if (!data_necessaria) return set_erro('Informe a data e hora necessária.');
    if (!previsao_devolucao) return set_erro('Informe a previsão de devolução.');
    if (previsao_devolucao <= data_necessaria) {
      return set_erro('A previsão de devolução deve ser maior que a data e hora necessária.');
    }
    if (!destinos.length) return set_erro('Selecione pelo menos um destino.');
    if (!usuario_solicitante) return set_erro('Usuário logado não identificado.');

    try {
      set_salvar_loading(true);

      const dados_solicitante = await buscar_dados_solicitante_reserva_carro(usuario_solicitante);

      const aceite_termo = await abrir_modal_termo_responsabilidade_carro({
        nome: dados_solicitante?.nome || usuario_solicitante,
        matricula: dados_solicitante?.matricula || '',
        cpf: dados_solicitante?.cpf || '',
        cnh: dados_solicitante?.cnh || '',
        categoria_cnh: dados_solicitante?.categoria_cnh || '',
        validade_cnh: dados_solicitante?.validade_cnh || ''
      });

      if (!aceite_termo?.aceito) {
        return set_erro('É necessário ler e aceitar o termo para concluir a solicitação.');
      }

      const payload = {
        tipo_veiculo,
        data_necessaria,
        previsao_devolucao,
        destinos,
        observacoes,
        urgencia,
        usuario_solicitante,
        termo_aceito: 1,
        foto_aceite_termo: aceite_termo.foto_aceite_termo,
        termo_versao: aceite_termo.termo_versao || '2026-04',
        nome_colaborador: dados_solicitante?.nome || usuario_solicitante,
        matricula_colaborador: dados_solicitante?.matricula || '',
        cpf_colaborador: dados_solicitante?.cpf || '',
        cnh_colaborador: dados_solicitante?.cnh || '',
        categoria_cnh: dados_solicitante?.categoria_cnh || '',
        validade_cnh: dados_solicitante?.validade_cnh || ''
      };

      if (carro_selecionado_id) {
        payload.veiculo_id = Number(carro_selecionado_id) || carro_selecionado_id;
      }

      const json = await salvar_reserva_carro(payload, reserva_id);

      fechar();
      await carregarMeusAgendamentos();

      alert(
        json?.message ||
        (is_edit
          ? 'Reserva atualizada com sucesso.'
          : 'Solicitação de reserva de carro salva com sucesso.')
      );
    } catch (err) {
      set_erro(err?.message || 'Erro ao salvar a solicitação.');
    } finally {
      set_salvar_loading(false);
    }
  });

  await Promise.all([
    carregar_destinos(),
    carregar_frota()
  ]);
}

function abrirModalRecusaReservaCarro(idReserva) {
  removerModalRecusaReservaCarro();

  const overlay = document.createElement('div');
  overlay.id = 'recusaReservaOverlay';
  overlay.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm z-[210]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'recusaReservaModal';
  modal.className = 'fixed inset-0 z-[220]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-xl mx-auto px-4 sm:px-6">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Recusar agendamento</h3>
                <p class="text-sm text-muted-foreground">Informe o motivo da recusa da solicitação.</p>
              </div>
              <button id="closeRecusaReservaModal" type="button" class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center" aria-label="Fechar" title="Fechar">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <form id="formRecusaReservaCarro" class="px-6 py-6 space-y-4">
              <div class="space-y-2">
                <label for="motivoRecusaReservaCarro" class="text-sm font-medium">Motivo da recusa</label>
                <textarea
                  id="motivoRecusaReservaCarro"
                  rows="5"
                  maxlength="500"
                  class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Descreva o motivo da recusa..."
                  required
                ></textarea>
              </div>

              <p id="recusaReservaErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

              <div class="pt-2 flex flex-col sm:flex-row gap-3">
                <button id="btnConfirmarRecusaReserva" type="submit" class="sm:flex-1 rounded-xl bg-destructive text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                  Confirmar recusa
                </button>
                <button id="btnCancelarRecusaReserva" type="button" class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all">
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

  const form = document.getElementById('formRecusaReservaCarro');
  const btnConfirmar = document.getElementById('btnConfirmarRecusaReserva');

  function fechar() {
    removerModalRecusaReservaCarro();
  }

  function setErro(msg) {
    const el = document.getElementById('recusaReservaErro');
    if (!el) return;

    if (!msg) {
      el.textContent = '';
      el.classList.add('hidden');
      return;
    }

    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function setLoading(loading) {
    if (!btnConfirmar) return;
    btnConfirmar.disabled = loading;
    btnConfirmar.textContent = loading ? 'Recusando...' : 'Confirmar recusa';
    btnConfirmar.classList.toggle('opacity-70', loading);
  }

  overlay.addEventListener('click', fechar);
  document.getElementById('closeRecusaReservaModal')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarRecusaReserva')?.addEventListener('click', fechar);

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setErro('');

    const motivo = document.getElementById('motivoRecusaReservaCarro')?.value?.trim();

    if (!motivo) {
      return setErro('Informe o motivo da recusa.');
    }

    try {
      setLoading(true);
      const json = await recusarReservaCarro(idReserva, motivo);
      fechar();
      await carregarMeusAgendamentos();
      alert(json?.message || 'Agendamento recusado com sucesso.');
    } catch (err) {
      setErro(err?.message || 'Erro ao recusar agendamento.');
    } finally {
      setLoading(false);
    }
  });
}

async function carregarMeusAgendamentos() {
  const tbody = document.getElementById('tbodyMeusAgendamentos');
  const msg = document.getElementById('meusAgendamentosMsg');

  if (!tbody) return;

  const usuario = obterUsuarioLogado?.();

  if (!usuario) {
    if (msg) {
      msg.textContent = 'Usuário logado não identificado.';
      msg.classList.remove('hidden');
    }

    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-4 py-6 form-subtitle-sm text-center">
          Usuário logado não identificado.
        </td>
      </tr>
    `;
    return;
  }

  try {
    if (msg) {
      msg.textContent = '';
      msg.classList.add('hidden');
    }

    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-4 py-6 form-subtitle-sm text-center">
          Carregando agendamentos...
        </td>
      </tr>
    `;

    const APIBASE = obterApiBase();
    if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

    const usuarioId = sessionStorage.getItem('id');
    const response = await fetch(`${APIBASE}/api/reservas-carro/usuario/${encodeURIComponent(usuario)}?usuarioId=${encodeURIComponent(usuarioId)}`);
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data?.success) {
      throw new Error(data?.message || 'Erro ao carregar agendamentos.');
    }

    const items = normalizarLista(data);
    agendamentosCache = ordenarAgendamentos(items);

    atualizarCardsAgendamentos(agendamentosCache);
    bindCardsFiltroAgendamento();
    bindBuscaAgendamentos();
    atualizarEstadoBuscaAgendamentos();

    if (!agendamentosCache.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="px-4 py-6 form-subtitle-sm text-center">
            Nenhum agendamento encontrado.
          </td>
        </tr>
      `;
      return;
    }

    renderTabelaAgendamentos();
  } catch (err) {
    console.error('Erro ao carregar Agendamento Veículos:', err);

    if (msg) {
      msg.textContent = err?.message || 'Erro ao carregar agendamentos.';
      msg.classList.remove('hidden');
    }

    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-4 py-6 text-sm text-red-600 text-center">
          Erro ao carregar agendamentos.
        </td>
      </tr>
    `;
  }
}

async function editarReservaCarro(idReserva) {
  try {
    const item = await buscarReservaCarroPorId(idReserva);
    await abrirModalReservaCarro(item);
  } catch (err) {
    alert(err?.message || 'Erro ao abrir edição da reserva.');
  }
}

function removerModalAprovacaoGestorReservaCarro() {
  document.getElementById('aprovacaoGestorReservaOverlay')?.remove();
  document.getElementById('aprovacaoGestorReservaModal')?.remove();
}

async function acaoAprovarReservaCarro(idReserva, statusRecebido = '') {

  try {
    const APIBASE = obterApiBase();
    const usuarioId = sessionStorage.getItem('id');

    if (!usuarioId) {
      alert('Usuário logado não identificado.');
      return;
    }

    const statusAtual = String(statusRecebido || '').trim().toUpperCase();

    if (!statusAtual) {
      alert('Status da reserva não informado.');
      return;
    }

    const resp = await fetch(
      `${APIBASE}/api/permissoes/aprovar-reserva-carro/${usuarioId}/${encodeURIComponent(statusAtual)}`
    );

    const data = await resp.json();

    if (!resp.ok || !data?.success) {
      alert(data?.message || 'Erro ao validar permissão.');
      return;
    }

    if (Number(data?.item?.permissaovalida || 0) !== 1) {
      if (statusAtual === 'PENDENTE GESTOR') {
        alert('Você não tem permissão para aprovar reservas de carro como gestor.');
      } else {
        alert('Você não tem permissão para aprovar reservas de carro na etapa da frota.');
      }
      return;
    }

    if (statusAtual === 'PENDENTE GESTOR') {
      const reserva = await buscarReservaCarroPorId(idReserva);
      await abrirModalAprovacaoGestorReservaCarro(idReserva, reserva);
      return;
    }

    if (statusAtual === 'PENDENTE FROTA' || statusAtual === 'PENDENTE') {
      await abrirModalAprovacaoReservaCarro(idReserva);
      return;
    }

    alert('Esta reserva não está pendente para aprovação.');
  } catch (err) {
    alert(err?.message || 'Erro ao validar permissão.');
  }
}

async function abrirModalAprovacaoGestorReservaCarro(idReserva, reservaParam = null) {
  removerModalAprovacaoGestorReservaCarro();

  const reserva = reservaParam || await buscarReservaCarroPorId(idReserva);
  const status = String(reserva?.status_solicitacao || '').trim().toUpperCase();

  if (status !== 'PENDENTE GESTOR') {
    throw new Error('Esta reserva não está com status PENDENTE GESTOR.');
  }

  const overlay = document.createElement('div');
  overlay.id = 'aprovacaoGestorReservaOverlay';
  overlay.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm z-[230]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'aprovacaoGestorReservaModal';
  modal.className = 'fixed inset-0 z-[240]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  const destinosHtml = Array.isArray(reserva?.destinos) && reserva.destinos.length
    ? reserva.destinos.map(dest => {
        const nome = dest?.nome || dest?.NOME || dest?.localtrabalho || '-';
        return `
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-border bg-white/80">
            ${escapeHtml(nome)}
          </span>
        `;
      }).join('')
    : `<span class="text-sm text-muted-foreground">Nenhum destino informado.</span>`;

  const checklistTermo = [
    ['Nome do colaborador', reserva?.nome_colaborador || reserva?.nomeColaborador || reserva?.usuariosolicitante || '-'],
    ['Matrícula', reserva?.matricula_colaborador || reserva?.matriculaColaborador || '-'],
    ['CPF', reserva?.cpf_colaborador || reserva?.cpfColaborador || '-'],
    ['CNH', reserva?.cnh_colaborador || reserva?.cnhColaborador || '-'],
    ['Categoria CNH', reserva?.categoria_cnh || reserva?.categoriaCnh || '-'],
    ['Validade CNH', formatarTextoDataHora((reserva?.validade_cnh || reserva?.validadeCnh || '')).replace(' ', ' às ') || '-'],
    ['Termo aceito', Number(reserva?.termo_aceito || reserva?.termoAceito || 0) === 1 ? 'Sim' : 'Não'],
    ['Data do aceite', formatarTextoDataHora(reserva?.data_aceite_termo || reserva?.dataAceiteTermo || '-')],
    ['Versão do termo', reserva?.termo_versao || reserva?.termoVersao || '-']
  ];

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Aprovação do gestor</h3>
                <p class="text-sm text-muted-foreground">
                  Revise os dados da solicitação e a aceitação do termo antes de aprovar.
                </p>
              </div>
              <button id="closeAprovacaoGestorReservaModal" type="button" class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center" aria-label="Fechar" title="Fechar">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="px-6 py-6 space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">Reserva</div>
                  <div class="mt-1 font-semibold">#${escapeHtml(reserva?.id || '-')}</div>
                </div>

                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">Solicitante</div>
                  <div class="mt-1 font-semibold">${escapeHtml(reserva?.usuario_solicitante || '-')}</div>
                </div>

                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">Tipo de veículo</div>
                  <div class="mt-1 font-semibold">${escapeHtml(reserva?.tipo_veiculo || '-')}</div>
                </div>

                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">Urgência</div>
                  <div class="mt-1 font-semibold">${escapeHtml(reserva?.urgencia || '-')}</div>
                </div>

                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">Data necessária</div>
                  <div class="mt-1 font-semibold">${escapeHtml(formatarTextoDataHora(reserva?.data_necessaria || reserva?.dataNecessaria || '-'))}</div>
                </div>

                <div class="rounded-xl border border-border bg-white/60 p-4">
                  <div class="text-xs text-muted-foreground">Previsão de devolução</div>
                  <div class="mt-1 font-semibold">${escapeHtml(formatarTextoDataHora(reserva?.previsao_devolucao || reserva?.previsaoDevolucao || '-'))}</div>
                </div>
              </div>

              <div class="rounded-2xl border border-border bg-white/50 p-5 space-y-3">
                <div>
                  <div class="text-sm font-semibold text-foreground">Destinos</div>
                  <div class="text-xs text-muted-foreground">Locais informados na solicitação.</div>
                </div>
                <div class="flex flex-wrap gap-2">
                  ${destinosHtml}
                </div>
              </div>

              <div class="rounded-2xl border border-border bg-white/50 p-5 space-y-3">
                <div>
                  <div class="text-sm font-semibold text-foreground">Observações da solicitação</div>
                  <div class="text-xs text-muted-foreground">Informações preenchidas pelo solicitante.</div>
                </div>
                <div class="rounded-xl border border-border bg-white/70 p-4 text-sm whitespace-pre-line">
                  ${escapeHtml(reserva?.observacoes || '-')}
                </div>
              </div>

              <div class="rounded-2xl border border-border bg-white/50 p-5 space-y-4">
                <div>
                  <div class="text-sm font-semibold text-foreground">Dados do termo aceito</div>
                  <div class="text-xs text-muted-foreground">Dados capturados no momento do aceite da solicitação.</div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${checklistTermo.map(([label, valor]) => `
                    <div class="rounded-xl border border-border bg-white/70 px-4 py-3">
                      <div class="text-xs text-muted-foreground">${escapeHtml(label)}</div>
                      <div class="mt-1 text-sm font-medium text-foreground">${escapeHtml(valor || '-')}</div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="rounded-2xl border border-border bg-white/50 p-5 space-y-4">
                <div>
                  <div class="text-sm font-semibold text-foreground">Foto do aceite do termo</div>
                  <div class="text-xs text-muted-foreground">Imagem registrada no momento da aceitação.</div>
                </div>

                ${
                  String(reserva?.foto_aceite_termo || reserva?.fotoAceiteTermo || '').trim()
                    ? `
                      <a href="${escapeHtml(reserva?.foto_aceite_termo || reserva?.fotoAceiteTermo)}" target="_blank" rel="noopener noreferrer" class="block">
                        <img
                          src="${escapeHtml(reserva?.foto_aceite_termo || reserva?.fotoAceiteTermo)}"
                          alt="Foto do aceite do termo"
                          class="w-full max-h-[420px] object-contain rounded-xl border border-border bg-slate-100"
                        >
                      </a>
                    `
                    : `
                      <div class="rounded-xl border border-border bg-white/70 p-4 text-sm text-amber-700">
                        Nenhuma foto de aceite foi encontrada nesta reserva.
                      </div>
                    `
                }
              </div>

              <p id="aprovacaoGestorReservaErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

              <div class="pt-2 flex flex-col sm:flex-row gap-3">
                <button id="btnConfirmarAprovacaoGestorReserva" type="button" class="sm:flex-1 rounded-xl bg-green-600 text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                  Aprovar solicitação
                </button>
                <button id="btnCancelarAprovacaoGestorReserva" type="button" class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  function fechar() {
    removerModalAprovacaoGestorReservaCarro();
  }

  function setErro(msg) {
    const el = document.getElementById('aprovacaoGestorReservaErro');
    if (!el) return;

    if (!msg) {
      el.textContent = '';
      el.classList.add('hidden');
      return;
    }

    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function setLoading(loading) {
    const btn = document.getElementById('btnConfirmarAprovacaoGestorReserva');
    if (!btn) return;
    btn.disabled = !!loading;
    btn.textContent = loading ? 'Aprovando...' : 'Aprovar solicitação';
    btn.classList.toggle('opacity-70', !!loading);
  }

  overlay.addEventListener('click', fechar);
  document.getElementById('closeAprovacaoGestorReservaModal')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarAprovacaoGestorReserva')?.addEventListener('click', fechar);

  document.getElementById('btnConfirmarAprovacaoGestorReserva')?.addEventListener('click', async () => {
    try {
      setErro('');

      if (Number(reserva?.termo_aceito || reserva?.termoAceito || 0) !== 1) {
        return setErro('Esta reserva ainda não possui termo aceito.');
      }

      setLoading(true);
      const json = await aprovarReservaGestorCarro(idReserva);
      fechar();
      await carregarMeusAgendamentos();
      alert(json?.message || 'Reserva aprovada pelo gestor com sucesso.');
    } catch (err) {
      setErro(err?.message || 'Erro ao aprovar solicitação do gestor.');
    } finally {
      setLoading(false);
    }
  });
}

async function aprovarReservaGestorCarro(idReserva) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const usuario = obterUsuarioLogado?.();
  if (!usuario) throw new Error('Usuário logado não identificado.');

  const resp = await fetch(`${APIBASE}/api/reservas-carro/${encodeURIComponent(idReserva)}/aprovar-gestor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      usuarioAprovacaoGestor: usuario
    })
  });

  const json = await resp.json().catch(() => ({}));

  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao aprovar reserva pelo gestor.');
  }

  return json;
}

async function aprovarReservaCarro(idReserva, payload = {}) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const usuario = obterUsuarioLogado?.() || '';
  if (!usuario) throw new Error('Usuário logado não identificado.');

  const nomeColaborador = String(
    payload?.nome_colaborador ||
    payload?.usuario_solicitante ||
    payload?.nome_completo ||
    ''
  );

  const ehFormulario = nomeColaborador.toUpperCase().includes('FORMULÁRIO')
    || nomeColaborador.toUpperCase().includes('FORMULARIO');

  const rotaAprovacao = ehFormulario
    ? `/api/reservas-carro-formulario/${encodeURIComponent(idReserva)}/aprovar`
    : `/api/reservas-carro/${encodeURIComponent(idReserva)}/aprovar`;

  const resp = await fetch(`${APIBASE}${rotaAprovacao}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuarioAprovacao: usuario,
      ...payload
    })
  });

  const json = await resp.json().catch(() => ({}));

  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao aprovar reserva.');
  }

  return json;
}

async function listarVeiculosDisponiveisReserva(idReserva) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const resp = await fetch(`${APIBASE}/api/reservas-carro/${encodeURIComponent(idReserva)}/veiculos-disponiveis`);
  const json = await resp.json().catch(() => ({}));

  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao listar veículos disponíveis.');
  }

  return json;
}

function removerModalAprovacaoReservaCarro() {
  document.getElementById('aprovacaoReservaOverlay')?.remove();
  document.getElementById('aprovacaoReservaModal')?.remove();
}

function classeDisponibilidadeVeiculo(status) {
  const s = String(status || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');

  if (s === 'DISPONIVEL') return 'bg-green-100 text-green-700 border border-green-200';
  if (s === 'EM_USO' || s === 'EMUSO') return 'bg-amber-100 text-amber-700 border border-amber-200';
  if (s === 'MANUTENCAO') return 'bg-red-100 text-red-700 border border-red-200';
  if (s === 'INATIVO') return 'bg-slate-100 text-slate-700 border border-slate-200';

  return 'bg-slate-100 text-slate-700 border border-slate-200';
}

function normalizarCategoriasCnh(valor) {
  const bruto = String(valor ?? '').trim().toUpperCase();
  if (!bruto) return [];

  const partes = bruto
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const categorias = [];

  partes.forEach((parte) => {
    if (parte.includes(' ')) {
      parte.split(/\s+/).map((s) => s.trim()).filter(Boolean).forEach((item) => categorias.push(item));
      return;
    }
    categorias.push(parte);
  });

  return [...new Set(categorias)];
}

function descreverCategoriaCnh(categoria) {
  const c = String(categoria ?? '').trim().toUpperCase();

  const mapa = {
    A: 'Categoria A - Motocicletas, motonetas e triciclos',
    B: 'Categoria B - Automóveis e utilitários de até 3.500 kg',
    C: 'Categoria C - Veículos de carga acima de 3.500 kg',
    D: 'Categoria D - Veículos para transporte de passageiros',
    E: 'Categoria E - Combinações de veículos / carretas',
    AB: 'Categoria AB - Motocicletas e automóveis',
    AC: 'Categoria AC - Motocicletas e veículos de carga',
    AD: 'Categoria AD - Motocicletas e transporte de passageiros',
    AE: 'Categoria AE - Motocicletas e combinações de veículos'
  };

  return mapa[c] || `Categoria ${c}`;
}

function analisarValidadeCnh(valor) {
  const texto = String(valor ?? '').trim();
  if (!texto) {
    return {
      possuiData: false,
      diasRestantes: null,
      status: 'SEM_DATA',
      label: 'Não informada',
      classe: 'bg-slate-100 text-slate-700 border-slate-200'
    };
  }

  const data = new Date(`${texto.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(data.getTime())) {
    return {
      possuiData: false,
      diasRestantes: null,
      status: 'INVALIDA',
      label: texto,
      classe: 'bg-slate-100 text-slate-700 border-slate-200'
    };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const base = new Date(data);
  base.setHours(0, 0, 0, 0);

  const diffMs = base.getTime() - hoje.getTime();
  const diasRestantes = Math.ceil(diffMs / 86400000);

  if (diasRestantes < 0) {
    return {
      possuiData: true,
      diasRestantes,
      status: 'VENCIDA',
      label: `Vencida há ${Math.abs(diasRestantes)} dia(s)`,
      classe: 'bg-red-100 text-red-700 border-red-200'
    };
  }

  if (diasRestantes <= 5) {
    return {
      possuiData: true,
      diasRestantes,
      status: 'CRITICA',
      label: `Vence em ${diasRestantes} dia(s)`,
      classe: 'bg-red-100 text-red-700 border-red-200'
    };
  }

  if (diasRestantes <= 30) {
    return {
      possuiData: true,
      diasRestantes,
      status: 'ATENCAO',
      label: `Vence em ${diasRestantes} dia(s)`,
      classe: 'bg-orange-100 text-orange-700 border-orange-200'
    };
  }

  return {
    possuiData: true,
    diasRestantes,
    status: 'OK',
    label: `Válida por mais ${diasRestantes} dia(s)`,
    classe: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };
}

async function abrirModalAprovacaoReservaCarro(idReserva) {
  removerModalAprovacaoReservaCarro();

  const mobile = isMobileDevice();
  const fotos = {
    frente: '',
    traseira: '',
    lateralEsquerda: '',
    lateralDireita: '',
    painel: ''
  };

  let reserva = null;
  let veiculos = [];
  let veiculoSelecionado = null;
  let streamCamera = null;

  const overlay = document.createElement('div');
  overlay.id = 'aprovacaoReservaOverlay';
  overlay.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm z-[230]';

  const modal = document.createElement('div');
  modal.id = 'aprovacaoReservaModal';
  modal.className = 'fixed inset-0 z-[240]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  function montarCampoFotoMobile(label, tipo) {
    const mapa = {
      frente: ['previewFotoFrente', 'placeholderFotoFrente', 'nomeFotoFrente', 'inputFotoFrente'],
      traseira: ['previewFotoTraseira', 'placeholderFotoTraseira', 'nomeFotoTraseira', 'inputFotoTraseira'],
      lateralEsquerda: ['previewFotoLateralEsquerda', 'placeholderFotoLateralEsquerda', 'nomeFotoLateralEsquerda', 'inputFotoLateralEsquerda'],
      lateralDireita: ['previewFotoLateralDireita', 'placeholderFotoLateralDireita', 'nomeFotoLateralDireita', 'inputFotoLateralDireita'],
      painel: ['previewFotoPainel', 'placeholderFotoPainel', 'nomeFotoPainel', 'inputFotoPainel']
    };

    const [imgId, placeholderId, nomeId, inputId] = mapa[tipo] || [];

    return `
      <label class="rounded-xl border border-border bg-white/70 p-3 space-y-3 cursor-pointer block">
        <div class="flex items-center justify-between gap-2">
          <div class="text-sm font-semibold text-foreground">${escapeHtml(label)}</div>
          <span class="text-xs text-muted-foreground">Toque para anexar</span>
        </div>

        <div class="rounded-lg border border-dashed border-border bg-slate-50 overflow-hidden h-[130px] flex items-center justify-center">
          <img id="${imgId}" alt="${escapeHtml(label)}" class="hidden w-full h-full object-cover">
          <div id="${placeholderId}" class="text-xs text-muted-foreground px-3 text-center">
            Nenhuma foto enviada
          </div>
        </div>

        <div id="${nomeId}" class="text-[11px] text-muted-foreground truncate">
          Aguardando imagem
        </div>

        <input id="${inputId}" type="file" accept="image/*" capture="environment" class="hidden">
      </label>
    `;
  }

  function montarCardFotoDesktopCompacto(label, tipo) {
    const mapa = {
      frente: ['previewFotoFrente', 'placeholderFotoFrente', 'nomeFotoFrente'],
      traseira: ['previewFotoTraseira', 'placeholderFotoTraseira', 'nomeFotoTraseira'],
      lateralEsquerda: ['previewFotoLateralEsquerda', 'placeholderFotoLateralEsquerda', 'nomeFotoLateralEsquerda'],
      lateralDireita: ['previewFotoLateralDireita', 'placeholderFotoLateralDireita', 'nomeFotoLateralDireita'],
      painel: ['previewFotoPainel', 'placeholderFotoPainel', 'nomeFotoPainel']
    };

    const [imgId, placeholderId, nomeId] = mapa[tipo] || [];

    return `
      <div class="rounded-xl border border-border bg-white/70 p-3 space-y-3">
        <div class="flex items-center justify-between gap-2">
          <div class="text-sm font-semibold text-foreground">${escapeHtml(label)}</div>
          <button
            type="button"
            class="btnCapturarFoto inline-flex items-center justify-center rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium hover:bg-slate-50 transition-all"
            data-tipo="${escapeHtml(tipo)}"
          >
            Capturar
          </button>
        </div>

        <div class="rounded-lg border border-dashed border-border bg-slate-50 overflow-hidden h-[120px] md:h-[130px] flex items-center justify-center">
          <img id="${imgId}" alt="${escapeHtml(label)}" class="hidden w-full h-full object-cover">
          <div id="${placeholderId}" class="text-xs text-muted-foreground px-3 text-center">
            Nenhuma foto capturada
          </div>
        </div>

        <div id="${nomeId}" class="text-[11px] text-muted-foreground truncate">
          Aguardando captura
        </div>
      </div>
    `;
  }

  const fotosHtml = mobile
    ? `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${montarCampoFotoMobile('Frente', 'frente')}
        ${montarCampoFotoMobile('Traseira', 'traseira')}
        ${montarCampoFotoMobile('Lateral esquerda', 'lateralEsquerda')}
        ${montarCampoFotoMobile('Lateral direita', 'lateralDireita')}
        <div class="sm:col-span-2">
          ${montarCampoFotoMobile('Painel', 'painel')}
        </div>
      </div>
    `
    : `
      <div class="space-y-4">
        <div class="rounded-xl border border-border bg-white/60 p-3">
          <div class="flex items-center justify-between gap-3 flex-wrap mb-3">
            <div>
              <div class="text-sm font-semibold text-foreground">Câmera ao vivo</div>
              <div class="text-xs text-muted-foreground">
                Use a câmera apenas para capturar as imagens abaixo.
              </div>
            </div>

            <button
              id="btnIniciarCameraReserva"
              type="button"
              class="rounded-xl border border-border bg-white/80 px-3 py-2 text-sm font-medium hover:bg-white transition-all"
            >
              Iniciar câmera
            </button>
          </div>

          <div class="rounded-xl border border-border bg-black/90 overflow-hidden">
            <video
              id="cameraPreviewReserva"
              autoplay
              playsinline
              muted
              webkit-playsinline
              class="w-full h-[140px] md:h-[150px] object-cover bg-black"
            ></video>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          ${montarCardFotoDesktopCompacto('Frente', 'frente')}
          ${montarCardFotoDesktopCompacto('Traseira', 'traseira')}
          ${montarCardFotoDesktopCompacto('Lateral esquerda', 'lateralEsquerda')}
          ${montarCardFotoDesktopCompacto('Lateral direita', 'lateralDireita')}
          ${montarCardFotoDesktopCompacto('Painel', 'painel')}
        </div>
      </div>

      <canvas id="canvasCapturaReserva" class="hidden"></canvas>
    `;

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-3 md:p-6">
        <div class="w-full max-w-5xl mx-auto px-2 sm:px-4">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div class="px-5 py-4 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-base md:text-lg font-semibold text-foreground">Aprovar agendamento</h3>
                <p class="text-xs md:text-sm text-muted-foreground">
                  Selecione o veículo, valide a saída e registre as fotos obrigatórias.
                </p>
              </div>

              <button
                id="closeAprovacaoReservaModal"
                type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                aria-label="Fechar"
                title="Fechar"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <form id="formAprovacaoReservaCarro" class="px-5 py-4 space-y-4">
              <div id="resumoAprovacaoReserva" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"></div>

              <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-3">
                <div class="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div class="text-sm font-semibold text-foreground">Veículos disponíveis</div>
                    <div class="text-xs text-muted-foreground">Selecione apenas veículo com status DISPONIVEL.</div>
                  </div>
                  <span id="veiculosDisponiveisCount" class="text-xs text-muted-foreground">Carregando...</span>
                </div>

                <div id="veiculosDisponiveisBox" class="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[280px] overflow-auto no-scrollbar pr-1">
                  <div class="rounded-xl border border-border bg-white/70 p-4 text-sm text-muted-foreground">
                    Carregando veículos...
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-3">
                  <div class="text-sm font-semibold text-foreground">Saída do veículo</div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="space-y-2">
                      <label for="kmAtualVeiculoReservaCarro" class="text-sm font-medium">KM atual do veículo</label>
                      <input
                        id="kmAtualVeiculoReservaCarro"
                        type="text"
                        class="w-full rounded-xl border border-border bg-slate-100 px-4 py-3 outline-none"
                        placeholder="Selecione um veículo"
                        readonly
                      >
                    </div>

                    <div class="space-y-2">
                      <label for="kmSaidaReservaCarro" class="text-sm font-medium">KM de saída</label>
                      <input
                        id="kmSaidaReservaCarro"
                        type="number"
                        min="0"
                        class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Informe a quilometragem"
                      >
                    </div>

                    <div class="space-y-2 sm:col-span-2">
                      <label for="nivelCombustivelReservaCarro" class="text-sm font-medium">Nível de combustível</label>
                      <select
                        id="nivelCombustivelReservaCarro"
                        class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="">Selecione...</option>
                        <option value="VAZIO">Vazio</option>
                        <option value="1/4">1/4</option>
                        <option value="1/2">1/2</option>
                        <option value="3/4">3/4</option>
                        <option value="CHEIO">Cheio</option>
                      </select>
                    </div>
                  </div>

                  <p class="text-xs text-muted-foreground">
                    O KM de saída não pode ser menor que o KM atual do veículo selecionado.
                  </p>
                </div>

                <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-3">
                  <div class="text-sm font-semibold text-foreground">Checklist de saída</div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-3 py-2.5 cursor-pointer">
                      <input id="chkDocumento" type="checkbox">
                      <span class="text-sm">Documento OK</span>
                    </label>

                    <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-3 py-2.5 cursor-pointer">
                      <input id="chkPneu" type="checkbox">
                      <span class="text-sm">Pneus OK</span>
                    </label>

                    <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-3 py-2.5 cursor-pointer">
                      <input id="chkLataria" type="checkbox">
                      <span class="text-sm">Lataria OK</span>
                    </label>

                    <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-3 py-2.5 cursor-pointer">
                      <input id="chkLuzes" type="checkbox">
                      <span class="text-sm">Luzes OK</span>
                    </label>

                    <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-3 py-2.5 cursor-pointer">
                      <input id="chkLimpeza" type="checkbox">
                      <span class="text-sm">Limpeza OK</span>
                    </label>

                    <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-3 py-2.5 cursor-pointer">
                      <input id="chkCombustivel" type="checkbox">
                      <span class="text-sm">Combustível conferido</span>
                    </label>
                  </div>

                  <div class="space-y-2">
                    <label for="observacaoChecklistReservaCarro" class="text-sm font-medium">Observações</label>
                    <textarea
                      id="observacaoChecklistReservaCarro"
                      rows="3"
                      class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                      placeholder="Avarias, acessórios, ressalvas, observações gerais..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl border border-border bg-white/40 p-4 space-y-3">
                <div>
                  <div class="text-sm font-semibold text-foreground">Fotos obrigatórias</div>
                  <div class="text-xs text-muted-foreground">
                    ${mobile
                      ? 'No celular, toque em cada campo para abrir a câmera ou anexar a imagem.'
                      : 'Capture as 5 imagens obrigatórias do veículo usando os quadros abaixo.'}
                  </div>
                </div>

                ${fotosHtml}
              </div>

              <p id="aprovacaoReservaErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

              <div class="pt-1 flex flex-col sm:flex-row gap-3">
                <button
                  id="btnConfirmarAprovacaoReserva"
                  type="submit"
                  class="sm:flex-1 rounded-xl bg-green-600 text-white px-4 py-3 font-medium hover:opacity-90 transition-all"
                >
                  Confirmar aprovação
                </button>
                <button
                  id="btnCancelarAprovacaoReserva"
                  type="button"
                  class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  const $ = (id) => document.getElementById(id);

  const form = $('formAprovacaoReservaCarro');
  const btnConfirmar = $('btnConfirmarAprovacaoReserva');
  const boxVeiculos = $('veiculosDisponiveisBox');
  const resumo = $('resumoAprovacaoReserva');
  const countEl = $('veiculosDisponiveisCount');
  const video = $('cameraPreviewReserva');
  const canvas = $('canvasCapturaReserva');
  const btnIniciarCamera = $('btnIniciarCameraReserva');
  const inputKmAtual = $('kmAtualVeiculoReservaCarro');
  const inputKmSaida = $('kmSaidaReservaCarro');

  const getReservaCampo = (...keys) => {
    for (const k of keys) {
      const valor = reserva?.[k];
      if (valor !== undefined && valor !== null && valor !== '') return valor;
    }
    return undefined;
  };

  const getVeiculoCampo = (veiculo, ...keys) => {
    for (const k of keys) {
      const valor = veiculo?.[k];
      if (valor !== undefined && valor !== null && valor !== '') return valor;
    }
    return undefined;
  };

  function normalizarStatusVeiculo(valor) {
    return String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_');
  }

  function veiculoEstaDisponivel(veiculo) {
    const status = getVeiculoCampo(
      veiculo,
      'status_veiculo',
      'statusveiculo',
      'statusVeiculo',
      'disponibilidade',
      'STATUS_VEICULO'
    );

    return normalizarStatusVeiculo(status) === 'DISPONIVEL';
  }

  function fechar() {
    pararCamera();
    removerModalAprovacaoReservaCarro();
  }

  function setErro(msg) {
    const el = $('aprovacaoReservaErro');
    if (!el) return;
    if (!msg) {
      el.textContent = '';
      el.classList.add('hidden');
      return;
    }
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function setLoading(loading) {
    if (!btnConfirmar) return;
    btnConfirmar.disabled = !!loading;
    btnConfirmar.textContent = loading ? 'Aprovando...' : 'Confirmar aprovação';
    btnConfirmar.classList.toggle('opacity-70', !!loading);
  }

  function renderResumo() {
    if (!resumo || !reserva) return;

    const idReservaTexto = getReservaCampo('id', 'ID') ?? '-';
    const usuarioTexto = getReservaCampo('usuariosolicitante', 'usuarioSolicitante', 'usuario_solicitante') ?? '-';
    const tipoTexto = getReservaCampo('tipoveiculo', 'tipoVeiculo', 'tipo_veiculo') ?? '-';
    const urgenciaTexto = getReservaCampo('urgencia') ?? '-';
    const dataNecessariaTexto = getReservaCampo('datanecessaria', 'dataNecessaria', 'data_necessaria') ?? '-';
    const previsaoDevolucaoTexto = getReservaCampo('previsaodevolucao', 'previsaoDevolucao', 'previsao_devolucao') ?? '-';

    const termoAceito = Number(getReservaCampo('termoaceito', 'termoAceito', 'termo_aceito') || 0) === 1;
    const dataAceite = getReservaCampo('dataaceitetermo', 'dataAceiteTermo', 'data_aceite_termo') ?? '-';
    const termoVersao = getReservaCampo('termoversao', 'termoVersao', 'termo_versao') ?? '-';
    const nomeColaborador = getReservaCampo('nomecolaborador', 'nomeColaborador', 'nome_colaborador') ?? usuarioTexto;
    const matriculaColaborador = getReservaCampo('matriculacolaborador', 'matriculaColaborador', 'matricula_colaborador') ?? '-';
    const cpfColaborador = getReservaCampo('cpfcolaborador', 'cpfColaborador', 'cpf_colaborador') ?? '-';
    const cnhColaborador = getReservaCampo('cnhcolaborador', 'cnhColaborador', 'cnh_colaborador') ?? '-';
    const categoriaCnhBruta = getReservaCampo('categoriacnh', 'categoriaCnh', 'categoria_cnh') ?? '';
    const validadeCnh = getReservaCampo('validadecnh', 'validadeCnh', 'validade_cnh') ?? '';

    const categorias = normalizarCategoriasCnh(categoriaCnhBruta);
    const categoriasHtml = categorias.length
      ? categorias.map((cat) => `
          <div class="rounded-lg border border-border bg-white/80 px-3 py-2">
            <div class="text-xs font-semibold text-foreground">${escapeHtml(cat)}</div>
            <div class="text-[11px] text-muted-foreground">${escapeHtml(descreverCategoriaCnh(cat))}</div>
          </div>
        `).join('')
      : `<div class="text-sm text-muted-foreground">Categoria não informada.</div>`;

    const validadeInfo = analisarValidadeCnh(validadeCnh);

    resumo.innerHTML = `
      <div class="rounded-xl border border-border bg-white/60 p-4">
        <div class="text-xs text-muted-foreground">Reserva</div>
        <div class="mt-1 font-semibold">${escapeHtml(idReservaTexto)}</div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4">
        <div class="text-xs text-muted-foreground">Solicitante</div>
        <div class="mt-1 font-semibold">${escapeHtml(usuarioTexto)}</div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4">
        <div class="text-xs text-muted-foreground">Tipo solicitado</div>
        <div class="mt-1 font-semibold">${escapeHtml(tipoTexto)}</div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4">
        <div class="text-xs text-muted-foreground">Urgência</div>
        <div class="mt-1 font-semibold">${escapeHtml(urgenciaTexto)}</div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4 sm:col-span-2">
        <div class="text-xs text-muted-foreground">Data necessária</div>
        <div class="mt-1 font-semibold">${escapeHtml(formatarTextoDataHora(dataNecessariaTexto))}</div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4 sm:col-span-2">
        <div class="text-xs text-muted-foreground">Previsão de devolução</div>
        <div class="mt-1 font-semibold">${escapeHtml(formatarTextoDataHora(previsaoDevolucaoTexto))}</div>
      </div>

      <div class="rounded-xl border ${termoAceito ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'} p-4 sm:col-span-2 xl:col-span-4">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div class="text-sm font-semibold text-foreground">Aceite do termo</div>
            <div class="text-xs text-muted-foreground">Dados gravados na solicitação de reserva.</div>
          </div>

          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${termoAceito ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}">
            ${termoAceito ? 'Termo aceito' : 'Termo não aceito'}
          </span>
        </div>

        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
          <div class="rounded-lg border border-border bg-white/80 px-3 py-3">
            <div class="text-xs text-muted-foreground">Colaborador</div>
            <div class="mt-1 font-semibold">${escapeHtml(nomeColaborador)}</div>
          </div>

          <div class="rounded-lg border border-border bg-white/80 px-3 py-3">
            <div class="text-xs text-muted-foreground">Matrícula</div>
            <div class="mt-1 font-semibold">${escapeHtml(matriculaColaborador)}</div>
          </div>

          <div class="rounded-lg border border-border bg-white/80 px-3 py-3">
            <div class="text-xs text-muted-foreground">CPF</div>
            <div class="mt-1 font-semibold">${escapeHtml(cpfColaborador)}</div>
          </div>

          <div class="rounded-lg border border-border bg-white/80 px-3 py-3">
            <div class="text-xs text-muted-foreground">Versão do termo</div>
            <div class="mt-1 font-semibold">${escapeHtml(termoVersao)}</div>
          </div>

          <div class="rounded-lg border border-border bg-white/80 px-3 py-3 md:col-span-2 xl:col-span-4">
            <div class="text-xs text-muted-foreground">Data do aceite</div>
            <div class="mt-1 font-semibold">${escapeHtml(formatarTextoDataHora(dataAceite))}</div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-border bg-white/60 p-4 sm:col-span-2 xl:col-span-4">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div class="text-sm font-semibold text-foreground">CNH do colaborador</div>
            <div class="text-xs text-muted-foreground">Validação visual da categoria e da validade antes da aprovação.</div>
          </div>

          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${validadeInfo.classe}">
            ${escapeHtml(validadeInfo.label)}
          </span>
        </div>

        <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="rounded-lg border border-border bg-white/80 px-4 py-3">
            <div class="text-xs text-muted-foreground">Número da CNH</div>
            <div class="mt-1 font-semibold">${escapeHtml(cnhColaborador || '-')}</div>
          </div>

          <div class="rounded-lg border border-border bg-white/80 px-4 py-3">
            <div class="text-xs text-muted-foreground">Validade</div>
            <div class="mt-2 flex items-center gap-2 flex-wrap">
              <span class="font-semibold">${escapeHtml(validadeCnh ? String(validadeCnh).slice(0, 10).split('-').reverse().join('/') : '-')}</span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${validadeInfo.classe}">
                ${escapeHtml(validadeInfo.label)}
              </span>
            </div>
          </div>

          <div class="rounded-lg border border-border bg-white/80 px-4 py-3">
            <div class="text-xs text-muted-foreground">Categorias recebidas</div>
            <div class="mt-1 font-semibold">${escapeHtml(categoriaCnhBruta || '-')}</div>
          </div>

          <div class="rounded-lg border border-border bg-white/80 px-4 py-3 lg:col-span-3">
            <div class="text-xs text-muted-foreground mb-2">Categorias identificadas</div>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
              ${categoriasHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function obterKmAtualVeiculo(veiculo) {
    const valor = getVeiculoCampo(veiculo, 'kmatual', 'kmAtual', 'km_atual', 'quilometragemAtual');
    const numero = Number(valor);
    return Number.isFinite(numero) ? numero : 0;
  }

  function atualizarCamposVeiculoSelecionado() {
    if (!inputKmAtual) return;

    if (!veiculoSelecionado) {
      inputKmAtual.value = '';
      inputKmSaida?.removeAttribute('min');
      return;
    }

    const kmAtual = obterKmAtualVeiculo(veiculoSelecionado);
    inputKmAtual.value = String(kmAtual);
    inputKmSaida?.setAttribute('min', String(kmAtual));
  }

  function renderVeiculos() {
    if (!boxVeiculos) return;

    if (!Array.isArray(veiculos) || !veiculos.length) {
      boxVeiculos.innerHTML = `
        <div class="rounded-xl border border-border bg-white/70 p-4 text-sm text-muted-foreground">
          Nenhum veículo disponível para esta reserva.
        </div>
      `;
      if (countEl) countEl.textContent = '0 disponíveis';
      return;
    }

    const veiculosDisponiveis = veiculos.filter(veiculoEstaDisponivel);
    if (countEl) countEl.textContent = `${veiculosDisponiveis.length} disponível(is)`;

    boxVeiculos.innerHTML = veiculos.map((item) => {
      const id = getVeiculoCampo(item, 'id', 'ID');
      const modelo = getVeiculoCampo(item, 'modelo', 'MODELO') ?? '-';
      const placa = getVeiculoCampo(item, 'placa', 'PLACA') ?? '-';
      const marca = getVeiculoCampo(item, 'marca', 'MARCA') ?? '-';
      const cor = getVeiculoCampo(item, 'cor', 'COR') ?? '-';
      const kmAtual = getVeiculoCampo(item, 'kmatual', 'kmAtual', 'km_atual') ?? '-';
      const disponibilidade = getVeiculoCampo(item, 'status_veiculo', 'statusveiculo', 'statusVeiculo', 'disponibilidade', 'STATUS_VEICULO') ?? 'INDEFINIDO';
      const previsaoRetorno = getVeiculoCampo(item, 'previsaoretorno', 'previsaoRetorno', 'previsao_retorno');

      const disponivel = veiculoEstaDisponivel(item);
      const checked = disponivel && Number(id) === Number(getVeiculoCampo(veiculoSelecionado, 'id', 'ID')) ? 'checked' : '';
      const disabled = !disponivel ? 'disabled' : '';

      return `
        <label class="rounded-xl border ${disponivel ? 'border-border bg-white/70 hover:bg-white cursor-pointer' : 'border-slate-200 bg-slate-100/80 opacity-70 cursor-not-allowed'} transition-all p-4">
          <div class="flex items-start gap-3">
            <input
              type="radio"
              name="veiculoAprovacaoReserva"
              value="${escapeHtml(id)}"
              class="mt-1"
              ${checked}
              ${disabled}
            >

            <div class="min-w-0 flex-1 space-y-2">
              <div class="flex items-center justify-between gap-3 flex-wrap">
                <div class="font-semibold text-foreground">${escapeHtml(modelo)}</div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${classeDisponibilidadeVeiculo(disponibilidade)}">
                  ${escapeHtml(disponibilidade)}
                </span>
              </div>

              <div class="text-sm text-muted-foreground">${escapeHtml(placa)}</div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                <div>Marca: ${escapeHtml(marca)}</div>
                <div>Cor: ${escapeHtml(cor)}</div>
                <div>KM atual: ${escapeHtml(kmAtual)}</div>
              </div>

              ${previsaoRetorno ? `
                <div class="text-xs text-amber-700">
                  Previsão de retorno: <span class="font-semibold">${escapeHtml(formatarTextoDataHora(previsaoRetorno))}</span>
                </div>
              ` : ''}

              ${!disponivel ? `
                <div class="text-xs text-red-600 font-medium">
                  Este veículo não pode ser selecionado porque está com status ${escapeHtml(disponibilidade)}.
                </div>
              ` : ''}
            </div>
          </div>
        </label>
      `;
    }).join('');

    boxVeiculos.querySelectorAll('input[name="veiculoAprovacaoReserva"]:not(:disabled)').forEach((radio) => {
      radio.addEventListener('change', () => {
        const idSelecionado = Number(radio.value || 0);
        const candidato = veiculos.find((v) => Number(getVeiculoCampo(v, 'id', 'ID')) === idSelecionado) || null;

        if (!candidato || !veiculoEstaDisponivel(candidato)) {
          veiculoSelecionado = null;
          atualizarCamposVeiculoSelecionado();
          return setErro('Selecione apenas veículo com status DISPONIVEL.');
        }

        veiculoSelecionado = candidato;
        atualizarCamposVeiculoSelecionado();
      });
    });
  }

  function atualizarPreviewFoto(tipo, dataUrl, fileName = 'Foto capturada') {
    const mapa = {
      frente: ['previewFotoFrente', 'placeholderFotoFrente', 'nomeFotoFrente'],
      traseira: ['previewFotoTraseira', 'placeholderFotoTraseira', 'nomeFotoTraseira'],
      lateralEsquerda: ['previewFotoLateralEsquerda', 'placeholderFotoLateralEsquerda', 'nomeFotoLateralEsquerda'],
      lateralDireita: ['previewFotoLateralDireita', 'placeholderFotoLateralDireita', 'nomeFotoLateralDireita'],
      painel: ['previewFotoPainel', 'placeholderFotoPainel', 'nomeFotoPainel']
    };

    const ids = mapa[tipo];
    if (!ids) return;

    const [imgId, placeholderId, nomeId] = ids;
    const img = $(imgId);
    const placeholder = $(placeholderId);
    const nomeEl = $(nomeId);

    if (img) {
      img.src = dataUrl;
      img.classList.remove('hidden');
    }

    if (placeholder) {
      placeholder.classList.add('hidden');
    }

    if (nomeEl) {
      nomeEl.textContent = fileName;
    }
  }

  async function iniciarCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Este navegador não suporta acesso à câmera.');
    }

    pararCamera();

    const tentativas = [
      { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
      { video: { width: { ideal: 640 }, height: { ideal: 480 } }, audio: false }
    ];

    let ultimoErro = null;

    for (const constraints of tentativas) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamCamera = stream;

        if (video) {
          video.setAttribute('autoplay', '');
          video.setAttribute('muted', '');
          video.setAttribute('playsinline', '');
          video.setAttribute('webkit-playsinline', '');
          video.srcObject = stream;
          await video.play().catch(() => {});
        }

        return;
      } catch (err) {
        ultimoErro = err;
      }
    }

    throw ultimoErro || new Error('Não foi possível iniciar a câmera.');
  }

  function pararCamera() {
    if (streamCamera) {
      streamCamera.getTracks().forEach((track) => track.stop());
      streamCamera = null;
    }

    if (video) {
      video.pause?.();
      video.srcObject = null;
    }
  }

  function capturarFoto(tipo) {
    if (!streamCamera || !video || !canvas) {
      throw new Error('Inicie a câmera antes de tirar a foto.');
    }

    const largura = video.videoWidth || 1280;
    const altura = video.videoHeight || 720;

    canvas.width = largura;
    canvas.height = altura;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, largura, altura);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    fotos[tipo] = dataUrl;
    atualizarPreviewFoto(tipo, dataUrl, 'Foto capturada na câmera');
  }

  function validarFotosObrigatorias() {
    return !!(
      fotos.frente &&
      fotos.traseira &&
      fotos.lateralEsquerda &&
      fotos.lateralDireita &&
      fotos.painel
    );
  }

  function bindInputFoto(tipo) {
    const mapa = {
      frente: 'inputFotoFrente',
      traseira: 'inputFotoTraseira',
      lateralEsquerda: 'inputFotoLateralEsquerda',
      lateralDireita: 'inputFotoLateralDireita',
      painel: 'inputFotoPainel'
    };

    const input = $(mapa[tipo]);
    if (!input) return;

    input.addEventListener('change', async () => {
      try {
        setErro('');
        const file = input.files?.[0];
        if (!file) return;

        if (!String(file.type || '').startsWith('image/')) {
          input.value = '';
          throw new Error('Arquivo de imagem inválido.');
        }

        const base64 = await fileToBase64(file);
        fotos[tipo] = base64;
        atualizarPreviewFoto(tipo, base64, file.name || 'Imagem anexada');
      } catch (err) {
        setErro(err?.message || 'Erro ao processar foto.');
      }
    });
  }

  async function carregarDados() {
    const [reservaItem, jsonVeiculos] = await Promise.all([
      buscarReservaCarroPorId(idReserva),
      listarVeiculosDisponiveisReserva(idReserva)
    ]);

    reserva = reservaItem || null;
    veiculos = Array.isArray(jsonVeiculos?.items)
      ? jsonVeiculos.items
      : Array.isArray(jsonVeiculos)
        ? jsonVeiculos
        : [];

    renderResumo();
    renderVeiculos();

    const disponiveis = veiculos.filter(veiculoEstaDisponivel);
    if (disponiveis.length === 1) {
      veiculoSelecionado = disponiveis[0];
      renderVeiculos();
      atualizarCamposVeiculoSelecionado();
    }
  }

  overlay.addEventListener('click', fechar);
  $('closeAprovacaoReservaModal')?.addEventListener('click', fechar);
  $('btnCancelarAprovacaoReserva')?.addEventListener('click', fechar);

  if (mobile) {
    ['frente', 'traseira', 'lateralEsquerda', 'lateralDireita', 'painel'].forEach(bindInputFoto);
  } else {
    btnIniciarCamera?.addEventListener('click', async () => {
      try {
        setErro('');
        validarAmbienteCamera();
        await iniciarCamera();
      } catch (err) {
        setErro(err?.message || 'Não foi possível iniciar a câmera.');
      }
    });

    modal.querySelectorAll('.btnCapturarFoto').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          setErro('');
          if (!streamCamera) {
            validarAmbienteCamera();
            await iniciarCamera();
          }

          const tipo = btn.getAttribute('data-tipo');
          capturarFoto(tipo);
        } catch (err) {
          setErro(err?.message || 'Erro ao tirar foto.');
        }
      });
    });
  }

  inputKmSaida?.addEventListener('input', () => {
    if (!veiculoSelecionado) return;

    const kmAtual = obterKmAtualVeiculo(veiculoSelecionado);
    const kmSaidaNumero = Number(inputKmSaida.value || 0);

    if (!Number.isNaN(kmSaidaNumero) && kmSaidaNumero < kmAtual) {
      inputKmSaida.setCustomValidity(`O KM de saída não pode ser menor que ${kmAtual}.`);
    } else {
      inputKmSaida.setCustomValidity('');
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setErro('');

    try {
      if (!veiculoSelecionado) {
        return setErro('Selecione um veículo para aprovar a reserva.');
      }

      if (!veiculoEstaDisponivel(veiculoSelecionado)) {
        return setErro('Somente veículos com status DISPONIVEL podem ser selecionados.');
      }

      const validadeCnh = getReservaCampo('validadecnh', 'validadeCnh', 'validade_cnh') ?? '';
      const validadeInfo = analisarValidadeCnh(validadeCnh);

      if (validadeInfo.status === 'VENCIDA') {
        alert(`A CNH do colaborador está vencida (${validadeInfo.label}). Não é possível aprovar esta reserva.`);
        return setErro('A CNH do colaborador está vencida. A aprovação foi bloqueada.');
      }

      const kmSaida = $('kmSaidaReservaCarro')?.value;
      const nivelCombustivelSaida = $('nivelCombustivelReservaCarro')?.value;

      if (!kmSaida) {
        return setErro('Informe o KM de saída.');
      }

      const kmAtualVeiculo = obterKmAtualVeiculo(veiculoSelecionado);
      const kmSaidaNumero = Number(kmSaida);

      if (Number.isNaN(kmSaidaNumero)) {
        return setErro('Informe um KM de saída válido.');
      }

      if (kmSaidaNumero < kmAtualVeiculo) {
        return setErro(`O KM de saída não pode ser menor que o KM atual do veículo (${kmAtualVeiculo}).`);
      }

      if (!nivelCombustivelSaida) {
        return setErro('Selecione o nível de combustível.');
      }

      if (!validarFotosObrigatorias()) {
        return setErro('É obrigatório informar as 5 fotos do veículo.');
      }

      const nomeColaborador = getReservaCampo(
        'nomecolaborador',
        'nomeColaborador',
        'nome_colaborador'
      ) || getReservaCampo(
        'usuariosolicitante',
        'usuarioSolicitante',
        'usuario_solicitante'
      ) || '';

      const origemSolicitacao = getReservaCampo(
        'origemsolicitacao',
        'origemSolicitacao',
        'origem_solicitacao'
      ) || '';

      const payload = {
        nome_colaborador: nomeColaborador,
        origem_solicitacao: origemSolicitacao,
        veiculoId: Number(getVeiculoCampo(veiculoSelecionado, 'id', 'ID')),
        kmSaida: kmSaidaNumero,
        nivelCombustivelSaida,
        checklistSaida: {
          documentoOk: !!$('chkDocumento')?.checked,
          pneuOk: !!$('chkPneu')?.checked,
          latariaOk: !!$('chkLataria')?.checked,
          luzesOk: !!$('chkLuzes')?.checked,
          limpezaOk: !!$('chkLimpeza')?.checked,
          combustivelConferido: !!$('chkCombustivel')?.checked,
          observacoes: $('observacaoChecklistReservaCarro')?.value?.trim() || ''
        },
        fotoFrente: fotos.frente,
        fotoTraseira: fotos.traseira,
        fotoLateralEsquerda: fotos.lateralEsquerda,
        fotoLateralDireita: fotos.lateralDireita,
        fotoPainel: fotos.painel
      };

      setLoading(true);
      const json = await aprovarReservaCarro(idReserva, payload);

      fechar();
      await carregarMeusAgendamentos();
      alert(json?.message || 'Reserva aprovada com sucesso.');
    } catch (err) {
      setErro(err?.message || 'Erro ao aprovar reserva.');
    } finally {
      setLoading(false);
    }
  });

  try {
    await carregarDados();
  } catch (err) {
    console.error('[Reserva Carro] Erro ao carregar dados do modal de aprovação:', err);
    setErro(err?.message || 'Erro ao carregar dados da aprovação.');
  }
}

function validarAmbienteCamera() {
  const isSecure =
    window.isSecureContext ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1';

  if (!isSecure) {
    throw new Error('Para usar a câmera no iPhone e Android, acesse o sistema por HTTPS.');
  }
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
}

function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent || '');
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function acaoConfirmarDevolucaoReservaCarroMenu(idReserva) {
  const item = agendamentosCache.find(x => Number(x?.id) === Number(idReserva));
  const status = String(item?.status_solicitacao || item?.statussolicitacao || '').trim();
  return acaoConfirmarDevolucaoReservaCarro(idReserva, status);
}


function acaoAprovarReservaCarroMenu(idReserva) {
  const item = agendamentosCache.find(x => Number(x?.id) === Number(idReserva));
  const status = String(item?.status_solicitacao || item?.statussolicitacao || '').trim();
  return acaoAprovarReservaCarro(idReserva, status);
}

function acaoRecusarReservaCarroMenu(idReserva) {
  const item = agendamentosCache.find(x => Number(x?.id) === Number(idReserva));
  const status = String(item?.status_solicitacao || item?.statussolicitacao || '').trim();
  return acaoRecusarReservaCarro(idReserva, status);
}

async function acaoRecusarReservaCarro(idReserva, statusRecebido = '') {
  try {
    const APIBASE = obterApiBase();
    const usuarioId = sessionStorage.getItem('id');

    if (!usuarioId) {
      alert('Usuário logado não identificado.');
      return;
    }

    const statusAtual = String(statusRecebido || '').trim().toUpperCase();

    if (!statusAtual) {
      alert('Status da reserva não informado.');
      return;
    }

    const resp = await fetch(
      `${APIBASE}/api/permissoes/aprovar-reserva-carro/${usuarioId}/${encodeURIComponent(statusAtual)}`
    );

    const data = await resp.json();

    if (!resp.ok || !data?.success) {
      alert(data?.message || 'Erro ao validar permissão.');
      return;
    }

    if (Number(data?.item?.permissaovalida || 0) !== 1) {
      if (statusAtual === 'PENDENTE GESTOR') {
        alert('Você não tem permissão para recusar reservas de carro na etapa do gestor.');
      } else {
        alert('Você não tem permissão para recusar reservas de carro na etapa da frota.');
      }
      return;
    }

    await abrirModalRecusaReservaCarro(idReserva, statusAtual);
  } catch (err) {
    alert(err?.message || 'Erro ao validar permissão.');
  }
}

async function abrirDetalhesAgendamento(idReserva) {
  try {
    const id = Number(idReserva);
    if (!id) throw new Error('ID da reserva inválido.');

    removerModalDetalhesAgendamento();

    const APIBASE = obterApiBase();
    if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

    const resp = await fetch(`${APIBASE}/api/reservas-carro/${id}`);
    const json = await resp.json().catch(() => ({}));

    if (!resp.ok || !json?.success) {
      throw new Error(json?.message || 'Erro ao buscar detalhes da reserva.');
    }

    const item = json.item || {};
    const destinos = Array.isArray(item.destinos) ? item.destinos : [];

    const checklistSaida =
      item.checklist_saida && typeof item.checklist_saida === 'object'
        ? item.checklist_saida
        : item.checklistsaida && typeof item.checklistsaida === 'object'
          ? item.checklistsaida
          : {};

    const checklistDevolucao =
      item.checklist_devolucao && typeof item.checklist_devolucao === 'object'
        ? item.checklist_devolucao
        : item.checklistdevolucao && typeof item.checklistdevolucao === 'object'
          ? item.checklistdevolucao
          : {};

    const statusAtual = String(item.status_solicitacao || item.statussolicitacao || '')
      .trim()
      .toUpperCase();

    const mostrarBlocoVeiculo = [
      'APROVADA',
      'AGUARDANDO_CONFIRMACAO',
      'AGUARDANDO CONFIRMACAO',
      'AGUARDANDO CONFIRMAÇÃO',
      'DEVOLVIDA',
      'DEVOLVIDO',
      'CONCLUIDA',
      'CONCLUÍDA'
    ].includes(statusAtual);

    const mostrarBlocoDevolucao = [
      'DEVOLVIDA',
      'DEVOLVIDO',
      'CONCLUIDA',
      'CONCLUÍDA'
    ].includes(statusAtual);

    const termoAceito = Number(item.termo_aceito ?? item.termoaceito ?? 0) === 1;
    const dataAceiteTermo = item.data_aceite_termo || item.dataaceitetermo || null;
    const fotoAceiteTermo = item.foto_aceite_termo || item.fotoaceitetermo || '';
    const termoVersao = item.termo_versao || item.termoversao || '-';

    const nomeColaborador = item.nome_colaborador || item.nomecolaborador || '-';
    const matriculaColaborador = item.matricula_colaborador || item.matriculacolaborador || '-';
    const cpfColaborador = item.cpf_colaborador || item.cpfcolaborador || '-';
    const cnhColaborador = item.cnh_colaborador || item.cnhcolaborador || '-';
    const categoriaCnh = item.categoria_cnh || item.categoriacnh || '-';
    const validadeCnh = item.validade_cnh || item.validadecnh || null;

    const aprovadorGestor =
      item.aprovador_gestor ||
      item.usuario_aprovacao_gestor ||
      item.usuariogestoraprovacao ||
      '-';

    const dataAprovacaoGestor =
      item.data_aprovacao_gestor ||
      item.data_gestor_aprovacao ||
      item.datagestoraprovacao ||
      null;

    const fotos = [
      { label: 'Frente', value: item.foto_frente || item.fotofrente },
      { label: 'Traseira', value: item.foto_traseira || item.fototraseira },
      { label: 'Lateral esquerda', value: item.foto_lateral_esquerda || item.fotolateralesquerda },
      { label: 'Lateral direita', value: item.foto_lateral_direita || item.fotolateraldireita },
      { label: 'Painel', value: item.foto_painel || item.fotopainel }
    ].filter(f => !!String(f.value || '').trim());

    const fotosDevolucao = [
      { label: 'Frente', value: item.foto_devolucao_frente || item.fotodevolucaofrente },
      { label: 'Traseira', value: item.foto_devolucao_traseira || item.fotodevolucaotraseira },
      { label: 'Lateral esquerda', value: item.foto_devolucao_lateral_esquerda || item.fotodevolucaolateralesquerda },
      { label: 'Lateral direita', value: item.foto_devolucao_lateral_direita || item.fotodevolucaolateraldireita },
      { label: 'Painel', value: item.foto_devolucao_painel || item.fotodevolucaopainel }
    ].filter(f => !!String(f.value || '').trim());

    const checklistItensSaida = [
      { label: 'Documento', value: checklistSaida.documentoOk },
      { label: 'Pneus', value: checklistSaida.pneuOk },
      { label: 'Lataria', value: checklistSaida.latariaOk },
      { label: 'Luzes', value: checklistSaida.luzesOk },
      { label: 'Limpeza', value: checklistSaida.limpezaOk },
      { label: 'Combustível', value: checklistSaida.combustivelConferido }
    ];

    const checklistItensDevolucao = [
      { label: 'Documento', value: checklistDevolucao.documentoOk },
      { label: 'Pneus', value: checklistDevolucao.pneuOk },
      { label: 'Lataria', value: checklistDevolucao.latariaOk },
      { label: 'Luzes', value: checklistDevolucao.luzesOk },
      { label: 'Limpeza', value: checklistDevolucao.limpezaOk },
      { label: 'Combustível', value: checklistDevolucao.combustivelConferido }
    ];

    const formatarDataBR = (value) => {
      if (!value) return '-';
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return String(value);
      return d.toLocaleDateString('pt-BR');
    };

    const infoItem = (label, valor, extraClass = '') => `
      <div class="rounded-2xl border border-border/70 bg-white/70 px-4 py-3 ${extraClass}">
        <div class="text-[11px] uppercase tracking-wide text-muted-foreground">${escapeHtml(label)}</div>
        <div class="mt-1 text-sm font-medium text-foreground leading-snug break-words">${escapeHtml(valor ?? '-')}</div>
      </div>
    `;

    const badgeBoolean = (value) => `
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
        value
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
          : 'bg-rose-100 text-rose-700 border border-rose-200'
      }">
        ${value ? 'OK' : 'Não'}
      </span>
    `;

    const secaoTitulo = (titulo, subtitulo = '') => `
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-sm font-semibold text-foreground">${escapeHtml(titulo)}</div>
          ${subtitulo ? `<div class="text-[12px] text-muted-foreground mt-0.5">${escapeHtml(subtitulo)}</div>` : ''}
        </div>
      </div>
    `;

    const overlay = document.createElement('div');
    overlay.id = 'detalhesAgendamentoOverlay';
    overlay.className = 'fixed inset-0 bg-black/25 backdrop-blur-sm z-[190]';
    document.body.appendChild(overlay);

    const modal = document.createElement('div');
    modal.id = 'detalhesAgendamentoModal';
    modal.className = 'fixed inset-0 z-[200]';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'tituloDetalhesAgendamento');

    modal.innerHTML = `
      <div class="w-full h-full overflow-y-auto no-scrollbar">
        <div class="min-h-full flex items-start justify-center p-3 md:p-6">
          <div class="w-full max-w-6xl mx-auto">
            <div class="glass rounded-[28px] shadow-2xl border border-border/70 overflow-hidden bg-[rgba(255,255,255,0.72)] backdrop-blur-xl">
              <div class="px-5 md:px-6 py-4 border-b border-border/70 flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <h3 id="tituloDetalhesAgendamento" class="text-base md:text-lg font-semibold text-foreground tracking-tight">
                    Reserva #${escapeHtml(item.id ?? '-')}
                  </h3>
                  <p class="text-[12px] md:text-sm text-muted-foreground mt-1">
                    Visualização compacta da solicitação, aceite do termo e andamento da reserva.
                  </p>
                </div>

                <button
                  id="closeDetalhesAgendamento"
                  type="button"
                  class="shrink-0 w-10 h-10 rounded-2xl bg-white/80 border border-border/80 hover:bg-white transition-all flex items-center justify-center"
                  aria-label="Fechar"
                  title="Fechar"
                >
                  <i class="fas fa-times text-sm"></i>
                </button>
              </div>

              <div class="px-5 md:px-6 py-5 space-y-4">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  ${infoItem('Tipo', item.tipo_veiculo || item.tipoveiculo || '-')}
                  <div class="rounded-2xl border border-border/70 bg-white/70 px-4 py-3">
                    <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Status</div>
                    <div class="mt-1">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${classeStatusAgendamento(item.status_solicitacao || item.statussolicitacao)}">
                        ${escapeHtml(item.status_solicitacao || item.statussolicitacao || 'PENDENTE')}
                      </span>
                    </div>
                  </div>
                  ${infoItem('Necessária em', formatarTextoDataHora(item.data_necessaria || item.datanecessaria))}
                  ${infoItem('Prev. devolução', formatarTextoDataHora(item.previsao_devolucao || item.previsaodevolucao))}
                  ${infoItem('Urgência', item.urgencia || '-', 'col-span-2 lg:col-span-1')}
                  ${infoItem('Solicitante', item.usuario_solicitante || item.usuariosolicitante || '-', 'col-span-2 lg:col-span-3')}
                </div>

                <div class="rounded-[24px] border border-border/70 bg-white/60 p-4 space-y-3">
                  ${secaoTitulo('Destinos')}
                  <div class="flex flex-wrap gap-2">
                    ${
                      destinos.length
                        ? destinos.map(dest => `
                            <span class="inline-flex items-center rounded-full border border-border/70 bg-white/80 px-3 py-1.5 text-[12px] text-foreground">
                              ${escapeHtml(dest.nome || dest.NOME || '-')}
                            </span>
                          `).join('')
                        : `<span class="text-sm text-muted-foreground">Nenhum destino informado.</span>`
                    }
                  </div>
                </div>

                <div class="rounded-[24px] border border-border/70 bg-white/60 p-4 space-y-3">
                  ${secaoTitulo('Observações')}
                  <div class="text-sm text-foreground/90 whitespace-pre-line leading-6">
                    ${escapeHtml(item.observacoes || '-')}
                  </div>
                </div>

                <div class="rounded-[24px] border border-border/70 bg-white/60 p-4 space-y-4">
                  ${secaoTitulo('Aceite do termo', 'Dados capturados no momento do aceite.')}
                  
                  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div class="rounded-2xl border border-border/70 bg-white/75 px-4 py-3">
                      <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Status do termo</div>
                      <div class="mt-1">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          termoAceito
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-100 text-rose-700 border border-rose-200'
                        }">
                          ${termoAceito ? 'Aceito' : 'Não aceito'}
                        </span>
                      </div>
                    </div>

                    ${infoItem('Aceite em', formatarTextoDataHora(dataAceiteTermo))}
                    ${infoItem('Versão', termoVersao)}
                    ${infoItem('Colaborador', nomeColaborador)}
                    ${infoItem('Matrícula', matriculaColaborador || '-')}
                    ${infoItem('CPF', cpfColaborador || '-')}
                    ${infoItem('CNH', cnhColaborador || '-')}
                    ${infoItem('Categoria CNH', categoriaCnh || '-')}
                    ${infoItem('Validade CNH', formatarDataBR(validadeCnh), 'col-span-2 lg:col-span-1')}
                    ${infoItem('Aprovador gestor', aprovadorGestor || '-', 'col-span-2 lg:col-span-2')}
                    ${infoItem('Aprovação gestor', formatarTextoDataHora(dataAprovacaoGestor), 'col-span-2 lg:col-span-1')}
                  </div>

                  ${
                    fotoAceiteTermo
                      ? `
                        <div class="rounded-[22px] border border-border/70 bg-white/75 p-3">
                          <div class="flex items-center justify-between gap-3 mb-3">
                            <div class="text-sm font-medium text-foreground">Foto do aceite</div>
                            <a
                              href="${escapeHtml(fotoAceiteTermo)}"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="text-[12px] text-primary hover:underline"
                            >
                              Abrir imagem
                            </a>
                          </div>

                          <a href="${escapeHtml(fotoAceiteTermo)}" target="_blank" rel="noopener noreferrer" class="block">
                            <img
                              src="${escapeHtml(fotoAceiteTermo)}"
                              alt="Foto do aceite do termo"
                              class="w-full max-h-[320px] object-contain rounded-[18px] border border-border/70 bg-slate-50"
                            />
                          </a>
                        </div>
                      `
                      : `
                        <div class="rounded-[22px] border border-border/70 bg-white/75 p-4 text-sm text-muted-foreground">
                          Nenhuma foto de aceite disponível.
                        </div>
                      `
                  }
                </div>

                ${item.motivo_recusa || item.motivorecusa ? `
                  <div class="rounded-[24px] border border-rose-200 bg-rose-50/90 p-4 space-y-2">
                    <div class="text-sm font-semibold text-rose-800">Motivo da recusa</div>
                    <div class="text-sm whitespace-pre-line text-rose-700 leading-6">
                      ${escapeHtml(item.motivo_recusa || item.motivorecusa)}
                    </div>
                  </div>
                ` : ''}

                ${mostrarBlocoVeiculo ? `
                  <div class="rounded-[24px] border border-border/70 bg-white/60 p-4 space-y-4">
                    ${secaoTitulo('Veículo utilizado', 'Dados associados após a aprovação.')}

                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      ${infoItem('Modelo', item.veiculo_modelo || item.veiculomodelo || '-')}
                      ${infoItem('Placa', item.veiculo_placa || item.veiculoplaca || '-')}
                      ${infoItem('Marca', item.veiculo_marca || item.veiculomarca || '-')}
                      ${infoItem('Cor', item.veiculo_cor || item.veiculocor || '-')}
                      ${infoItem('KM saída', item.km_saida ?? item.kmsaida ?? '-', 'col-span-2 lg:col-span-1')}
                      ${infoItem('Combustível saída', item.nivel_combustivel_saida || item.nivelcombustivelsaida || '-', 'col-span-2 lg:col-span-1')}
                      ${infoItem('Aprovado por', item.usuario_aprovacao || item.usuarioaprovacao || '-', 'col-span-2 lg:col-span-1')}
                      ${infoItem('Data aprovação', formatarTextoDataHora(item.data_aprovacao || item.dataaprovacao), 'col-span-2 lg:col-span-1')}
                    </div>
                  </div>
                ` : ''}

                ${mostrarBlocoVeiculo ? `
                  <div class="rounded-[24px] border border-border/70 bg-white/60 p-4 space-y-4">
                    ${secaoTitulo('Checklist de saída')}

                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      ${checklistItensSaida.map(itemChecklist => `
                        <div class="rounded-2xl border border-border/70 bg-white/75 px-4 py-3 flex items-center justify-between gap-3">
                          <span class="text-sm text-foreground">${escapeHtml(itemChecklist.label)}</span>
                          ${badgeBoolean(itemChecklist.value)}
                        </div>
                      `).join('')}
                    </div>

                    <div class="rounded-2xl border border-border/70 bg-white/75 px-4 py-3">
                      <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Observações do checklist</div>
                      <div class="mt-1 text-sm text-foreground/90 whitespace-pre-line leading-6">
                        ${escapeHtml(checklistSaida.observacoes || '-')}
                      </div>
                    </div>
                  </div>
                ` : ''}

                ${mostrarBlocoVeiculo ? `
                  <div class="rounded-[24px] border border-border/70 bg-white/60 p-4 space-y-4">
                    ${secaoTitulo('Fotos do veículo', 'Imagens registradas na aprovação.')}

                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      ${
                        fotos.length
                          ? fotos.map(foto => `
                              <div class="rounded-[20px] border border-border/70 bg-white/75 p-3 space-y-2">
                                <div class="text-[12px] font-medium text-foreground">${escapeHtml(foto.label)}</div>
                                <a href="${escapeHtml(foto.value)}" target="_blank" rel="noopener noreferrer" class="block">
                                  <img
                                    src="${escapeHtml(foto.value)}"
                                    alt="${escapeHtml(foto.label)}"
                                    class="w-full h-40 object-cover rounded-[16px] border border-border/70 bg-slate-100"
                                  />
                                </a>
                              </div>
                            `).join('')
                          : `
                              <div class="col-span-2 lg:col-span-3 rounded-2xl border border-border/70 bg-white/75 p-4 text-sm text-muted-foreground">
                                Nenhuma foto disponível.
                              </div>
                            `
                      }
                    </div>
                  </div>
                ` : ''}

                ${mostrarBlocoDevolucao ? `
                  <div class="rounded-[24px] border border-border/70 bg-white/60 p-4 space-y-4">
                    ${secaoTitulo('Dados da devolução', 'Informações registradas no retorno.')}

                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      ${infoItem('Usuário devolução', item.usuario_devolucao || item.usuariodevolucao || '-')}
                      ${infoItem('Data devolução', formatarTextoDataHora(item.data_devolucao || item.datadevolucao))}
                      ${infoItem('KM devolução', item.km_devolucao ?? item.kmdevolucao ?? '-')}
                      ${infoItem('Combustível devolução', item.nivel_combustivel_devolucao || item.nivelcombustiveldevolucao || '-')}
                      ${infoItem('Confirmado por', item.usuario_confirmacao_devolucao || item.usuarioconfirmacaodevolucao || '-')}
                      ${infoItem('Data confirmação', formatarTextoDataHora(item.data_confirmacao_devolucao || item.dataconfirmacaodevolucao))}
                    </div>
                  </div>
                ` : ''}

                ${mostrarBlocoDevolucao ? `
                  <div class="rounded-[24px] border border-border/70 bg-white/60 p-4 space-y-4">
                    ${secaoTitulo('Checklist da devolução')}

                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      ${checklistItensDevolucao.map(itemChecklist => `
                        <div class="rounded-2xl border border-border/70 bg-white/75 px-4 py-3 flex items-center justify-between gap-3">
                          <span class="text-sm text-foreground">${escapeHtml(itemChecklist.label)}</span>
                          ${badgeBoolean(itemChecklist.value)}
                        </div>
                      `).join('')}
                    </div>

                    <div class="rounded-2xl border border-border/70 bg-white/75 px-4 py-3">
                      <div class="text-[11px] uppercase tracking-wide text-muted-foreground">Observações da devolução</div>
                      <div class="mt-1 text-sm text-foreground/90 whitespace-pre-line leading-6">
                        ${escapeHtml(
                          checklistDevolucao.observacoes ||
                          item.observacoes_devolucao ||
                          item.observacoesdevolucao ||
                          '-'
                        )}
                      </div>
                    </div>
                  </div>
                ` : ''}

                ${mostrarBlocoDevolucao ? `
                  <div class="rounded-[24px] border border-border/70 bg-white/60 p-4 space-y-4">
                    ${secaoTitulo('Fotos da devolução')}

                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      ${
                        fotosDevolucao.length
                          ? fotosDevolucao.map(foto => `
                              <div class="rounded-[20px] border border-border/70 bg-white/75 p-3 space-y-2">
                                <div class="text-[12px] font-medium text-foreground">${escapeHtml(foto.label)}</div>
                                <a href="${escapeHtml(foto.value)}" target="_blank" rel="noopener noreferrer" class="block">
                                  <img
                                    src="${escapeHtml(foto.value)}"
                                    alt="${escapeHtml(foto.label)}"
                                    class="w-full h-40 object-cover rounded-[16px] border border-border/70 bg-slate-100"
                                  />
                                </a>
                              </div>
                            `).join('')
                          : `
                              <div class="col-span-2 lg:col-span-3 rounded-2xl border border-border/70 bg-white/75 p-4 text-sm text-muted-foreground">
                                Nenhuma foto de devolução disponível.
                              </div>
                            `
                      }
                    </div>
                  </div>
                ` : ''}

                <div class="pt-1 flex justify-end">
                  <button
                    id="btnFecharDetalhesAgendamento"
                    type="button"
                    class="rounded-2xl border border-border/80 bg-white/80 px-4 py-2.5 text-sm font-medium hover:bg-white transition-all"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    function fechar() {
      removerModalDetalhesAgendamento();
    }

    overlay.addEventListener('click', fechar);
    document.getElementById('closeDetalhesAgendamento')?.addEventListener('click', fechar);
    document.getElementById('btnFecharDetalhesAgendamento')?.addEventListener('click', fechar);
  } catch (err) {
    alert(err?.message || 'Erro ao abrir detalhes do agendamento.');
  }
}

function abrirFormularioAgendamentoCarro() {
  const secao = document.getElementById('secao-meus-agendamentos');

  if (typeof showPage === 'function') {
    showPage('secao-meus-agendamentos');
  } else {
    document.querySelectorAll('.page-content').forEach(el => el.classList.remove('active'));
    if (secao) secao.classList.add('active');
  }

  abrirModalReservaCarro();
}

async function acaoGerenciarVeiculos() {
  try {
    const APIBASE = obterApiBase();
    const usuarioId = sessionStorage.getItem('id');

    if (!usuarioId) {
      alert('Usuário logado não identificado.');
      return;
    }

    const resp = await fetch(`${APIBASE}/api/permissoes/aprovar-reserva-carro/${usuarioId}/${encodeURIComponent('PENDENTE FROTA')}`);
    const data = await resp.json();

    if (!resp.ok || !data?.success) {
      alert(data?.message || 'Erro ao validar permissão.');
      return;
    }

    if (Number(data?.item?.aprovarreservacarro || 0) !== 1) {
      alert('Você não tem permissão para gerenciar veículos.');
      return;
    }

    await abrirModalGestaoVeiculos();
  } catch (err) {
    alert(err?.message || 'Erro ao validar permissão.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btnHomeAgendarCarro = document.getElementById('AgendarCarro');
  const btnNovoAgendamentoCarro = document.getElementById('btnNovoAgendamentoCarro');
  const btnAtualizarMeusAgendamentos = document.getElementById('btnAtualizarMeusAgendamentos');
  const btnGerenciarVeiculos = document.getElementById('btnGerenciarVeiculos');

  if (btnHomeAgendarCarro) {
    btnHomeAgendarCarro.addEventListener('click', abrirFormularioAgendamentoCarro);
  }

  if (btnNovoAgendamentoCarro) {
    btnNovoAgendamentoCarro.addEventListener('click', abrirFormularioAgendamentoCarro);
  }

  if (btnAtualizarMeusAgendamentos) {
    btnAtualizarMeusAgendamentos.addEventListener('click', carregarMeusAgendamentos);
  }

  if (btnGerenciarVeiculos) btnGerenciarVeiculos.addEventListener('click', acaoGerenciarVeiculos);

  document.querySelectorAll('.menu-item[data-page="secao-meus-agendamentos"]').forEach(item => {
    item.addEventListener('click', () => {
      setTimeout(() => {
        carregarMeusAgendamentos();
      }, 100);
    });
  });
});

function montarCardFotoDesktop(label, tipo) {
  const mapa = {
    frente: ['previewFotoFrente', 'placeholderFotoFrente'],
    traseira: ['previewFotoTraseira', 'placeholderFotoTraseira'],
    lateralEsquerda: ['previewFotoLateralEsquerda', 'placeholderFotoLateralEsquerda'],
    lateralDireita: ['previewFotoLateralDireita', 'placeholderFotoLateralDireita'],
    painel: ['previewFotoPainel', 'placeholderFotoPainel']
  };

  const [imgId, placeholderId] = mapa[tipo] || [];

  return `
    <div class="rounded-xl border border-border bg-white/60 p-3 space-y-2">
      <div class="text-sm font-medium">${escapeHtml(label)}</div>
      <div class="aspect-video rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
        <img id="${imgId}" class="w-full h-full object-cover hidden" alt="${escapeHtml(label)}">
        <span id="${placeholderId}" class="text-xs text-muted-foreground">Sem foto</span>
      </div>
      <div id="nome${imgId.charAt(0).toUpperCase() + imgId.slice(1).replace('preview', '')}" class="text-xs text-muted-foreground truncate">Nenhuma foto capturada</div>
      <button type="button" class="btnCapturarFoto rounded-xl border border-border bg-white/70 px-3 py-2 text-sm w-full" data-tipo="${escapeHtml(tipo)}">Tirar foto</button>
    </div>
  `;
}

function montarCampoFotoMobile(label, tipo) {
  const mapa = {
    frente: {
      inputId: 'inputFotoFrente',
      imgId: 'previewFotoFrente',
      placeholderId: 'placeholderFotoFrente',
      nomeId: 'nomeFotoFrente'
    },
    traseira: {
      inputId: 'inputFotoTraseira',
      imgId: 'previewFotoTraseira',
      placeholderId: 'placeholderFotoTraseira',
      nomeId: 'nomeFotoTraseira'
    },
    lateralEsquerda: {
      inputId: 'inputFotoLateralEsquerda',
      imgId: 'previewFotoLateralEsquerda',
      placeholderId: 'placeholderFotoLateralEsquerda',
      nomeId: 'nomeFotoLateralEsquerda'
    },
    lateralDireita: {
      inputId: 'inputFotoLateralDireita',
      imgId: 'previewFotoLateralDireita',
      placeholderId: 'placeholderFotoLateralDireita',
      nomeId: 'nomeFotoLateralDireita'
    },
    painel: {
      inputId: 'inputFotoPainel',
      imgId: 'previewFotoPainel',
      placeholderId: 'placeholderFotoPainel',
      nomeId: 'nomeFotoPainel'
    }
  };

  const ids = mapa[tipo];

  return `
    <div class="rounded-xl border border-border bg-white/60 p-3 space-y-3">
      <label for="${ids.inputId}" class="flex items-center justify-between gap-3 rounded-xl border border-border bg-white/70 px-4 py-3 cursor-pointer hover:bg-white transition-all">
        <div class="min-w-0">
          <div class="text-sm font-medium">${escapeHtml(label)}</div>
          <div id="${ids.nomeId}" class="text-xs text-muted-foreground truncate">Toque para tirar/anexar a foto</div>
        </div>
        <i class="fas fa-paperclip text-muted-foreground"></i>
      </label>

      <input
        id="${ids.inputId}"
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden"
      />

      <div class="aspect-video rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
        <img id="${ids.imgId}" class="w-full h-full object-cover hidden" alt="${escapeHtml(label)}">
        <span id="${ids.placeholderId}" class="text-xs text-muted-foreground">Sem foto</span>
      </div>
    </div>
  `;
}

function escape_html(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatar_data_br(valor) {
  if (!valor) return '';
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return String(valor);
  return data.toLocaleDateString('pt-BR');
}

async function file_to_base64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function buscar_dados_solicitante_reserva_carro(usuario_solicitante) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');
  if (!usuario_solicitante) throw new Error('Usuário logado não identificado.');

  const resp = await fetch(
    `${APIBASE}/api/reservas-carro/solicitante/${encodeURIComponent(usuario_solicitante)}`,
    { method: 'GET' }
  );

  const json = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    throw new Error(json?.message || `Erro ao buscar dados do solicitante. Status ${resp.status}`);
  }

  return json?.item || {};
}

async function salvar_reserva_carro(payload, reserva_id = null) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const is_edit = !!reserva_id;
  const url = is_edit
    ? `${APIBASE}/api/reservas-carro/${reserva_id}`
    : `${APIBASE}/api/reservas-carro`;

  const payloadFinal = {
    tipo_veiculo: payload?.tipo_veiculo,
    data_necessaria: payload?.data_necessaria,
    previsao_devolucao: payload?.previsao_devolucao,
    destinos: Array.isArray(payload?.destinos) ? payload.destinos : [],
    observacoes: payload?.observacoes || '',
    urgencia: payload?.urgencia,
    usuario_solicitante: payload?.usuario_solicitante,
    termo_aceito: Number(payload?.termo_aceito) === 1 ? 1 : 0,
    foto_aceite_termo: payload?.foto_aceite_termo || '',
    termo_versao: payload?.termo_versao || '2026-04',
    nome_colaborador: payload?.nome_colaborador || payload?.usuario_solicitante || '',
    matricula_colaborador: payload?.matricula_colaborador || ''
  };

  const resp = await fetch(url, {
    method: is_edit ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadFinal)
  });

  const json = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    throw new Error(json?.message || `Erro ao salvar reserva. Status ${resp.status}`);
  }

  return json;
}

async function abrir_modal_termo_responsabilidade_carro(dados = {}) {
  return new Promise((resolve) => {
    let stream_camera = null;
    let foto_aceite_termo = '';

    const overlay = document.createElement('div');
    overlay.id = 'termoReservaCarroOverlay';
    overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[190]';

    const modal = document.createElement('div');
    modal.id = 'termoReservaCarroModal';
    modal.className = 'fixed inset-0 z-[200]';

    modal.innerHTML = `
      <div class="w-full h-full overflow-y-auto no-scrollbar">
        <div class="min-h-full flex items-start justify-center p-4 md:p-8">
          <div class="w-full max-w-4xl mx-auto">
            <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden bg-white">
              <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-lg font-semibold text-foreground">Termo de responsabilidade</h3>
                  <p class="text-sm text-muted-foreground">
                    Leia o termo abaixo, tire a foto no momento do aceite e confirme para concluir a solicitação.
                  </p>
                </div>

                <button
                  id="closeTermoReservaCarro"
                  type="button"
                  class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                  aria-label="Fechar"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <div class="px-6 py-6 space-y-5">
                <div class="rounded-2xl border border-border bg-white/60 p-5 max-h-[55vh] overflow-auto no-scrollbar text-sm leading-6 text-foreground">
                  <h4 class="text-base font-semibold mb-4">TERMO DE RESPONSABILIDADE – USO DE VEÍCULO</h4>

                  <p><strong>1. Identificação</strong></p>
                  <p>Colaborador: ${escape_html(dados.nome || '')}</p>

                  <br>
                  <p><strong>2. Declaração</strong></p>
                  <p>Pelo presente Termo, declaro, para todos os fins, que ao me credenciar como condutor de veículo ou motocicleta da Sociedade Franciosi, comprometo-me a cumprir integralmente as seguintes condições:</p>

                  <br>
                  <p><strong>3. Responsabilidades do Condutor</strong></p>
                  <p><strong>1. Legislação e Normas Internas</strong><br> Cumprir rigorosamente o Código de Trânsito Brasileiro (CTB), legislação complementar e normas internas da empresa, assumindo total responsabilidade por infrações ou condutas inadequadas.</p>
                  <p><strong>2. Multas, Danos e Acidentes</strong><br> Responsabilizar-me pelo pagamento de multas, danos materiais ou pessoais causados a terceiros por dolo ou culpa, autorizando desde já o desconto em folha, inclusive valores de franquia de seguro.</p>
                  <p><strong>3. Guarda e Estacionamento do Veículo</strong><br> Garantir que o veículo seja estacionado nas dependências da empresa ao término da jornada, até às 17h30. Situações excepcionais devem ser previamente autorizadas pelo gestor imediato ou registradas via sistema pela gestão de frotas.</p>
                  <p><strong>4. Documentação Obrigatória</strong><br> Dirigir sempre portando CNH válida e compatível com o veículo, documentos pessoais, funcionais e do veículo, conforme exigido pelo CTB.</p>
                  <p><strong>5. Condições do Veículo</strong><br> Verificar diariamente as condições de uso e segurança do veículo, incluindo itens como pneus, freios, combustível, sistema elétrico, entre outros, mantendo-o em perfeito estado até devolução.</p>
                  <p><strong>6. Procedimentos em Caso de Acidente</strong><br> Não retirar o veículo do local (exceto para socorro); acionar autoridades competentes; comunicar imediatamente a empresa; não realizar acordos com terceiros; coletar informações e testemunhas.</p>
                  <p><strong>6.1. Reconhecimento de Culpa de Terceiros</strong><br> Obter Termo de Compromisso assinado pelo envolvido, quando aplicável.</p>
                  <p><strong>7. Conservação e Responsabilidade</strong><br> Zelar pelo veículo sob sua guarda, comunicando qualquer irregularidade à gestão de frotas.</p>
                  <p><strong>8. Conduta do Condutor</strong><br> Não dirigir sob efeito de álcool ou substâncias ilícitas; não utilizar o veículo para fins particulares; não transportar pessoas não autorizadas; respeitar rotas e finalidades definidas.</p>
                  <p><strong>9. Situação da CNH</strong><br> Comunicar imediatamente qualquer suspensão, cassação ou irregularidade na CNH.</p>

                  <br>
                  <p><strong>4. Devolução do Veículo</strong><br> A responsabilidade do condutor permanece ativa até a devolução formal da chave à gestão de frotas; a vistoria de devolução deverá ser realizada pelo condutor, com registro fotográfico no sistema; a conferência e validação da vistoria são de responsabilidade da gestão de frotas, também via registro fotográfico.</p>

                  <br>
                  <p><strong>5. Validade do Termo e Liberação do Veículo</strong><br> A reserva do veículo não garante sua disponibilidade no dia solicitado; este termo somente terá validade após aprovação do setor de logística; a validade se inicia exclusivamente com a liberação das chaves pela gestão de frotas.</p>

                  <br>
                  <p><strong>6. Proteção de Dados – LGPD</strong><br> Ao assinar este termo, o colaborador declara estar ciente de que seus dados pessoais serão tratados pela Sociedade Franciosi, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), exclusivamente para fins administrativos, operacionais e de segurança, podendo ser compartilhados com terceiros quando necessário para cumprimento de obrigações legais ou contratuais.</p>

                  <br>
                  <p><strong>7. Disposições Finais</strong><br> O presente termo permanecerá vigente durante todo o período em que o veículo estiver sob responsabilidade do condutor, encerrando-se somente após a devolução formal e validação pela gestão de frotas.</p>
                </div>

                <div class="space-y-4">
                  <label class="flex items-start gap-3 rounded-xl border border-border bg-white/60 px-4 py-3 cursor-pointer">
                    <input id="aceiteTermoReservaCarro" type="checkbox" class="mt-1">
                    <span class="text-sm text-foreground">
                      Declaro que li e aceito integralmente o termo de responsabilidade acima.
                    </span>
                  </label>

                  <div class="rounded-2xl border border-border bg-white/60 p-4 space-y-3">
                    <div class="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <h4 class="text-sm font-semibold text-foreground">Foto obrigatória no momento do aceite</h4>
                        <p class="text-xs text-muted-foreground">
                          A foto deve ser tirada agora pela câmera do dispositivo. Não é permitido enviar arquivo da galeria ou do computador.
                        </p>
                      </div>
                    </div>

                    <div id="cameraIndisponivelBox" class="hidden rounded-xl border border-amber-300 bg-amber-50 text-amber-800 px-4 py-3 text-sm whitespace-pre-line"></div>

                    <div class="rounded-2xl overflow-hidden border border-border bg-black/90 relative">
                      <video
                        id="videoAceiteTermoReservaCarro"
                        class="w-full max-h-80 object-contain bg-black"
                        autoplay
                        playsinline
                        muted
                      ></video>

                      <canvas id="canvasAceiteTermoReservaCarro" class="hidden"></canvas>

                      <img
                        id="imgPreviewFotoAceiteTermoReservaCarro"
                        alt="Foto capturada no aceite"
                        class="hidden w-full max-h-80 object-contain bg-black"
                      >
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3">
                      <button
                        id="btnIniciarCameraAceite"
                        type="button"
                        class="sm:flex-1 rounded-xl border border-border bg-white/80 px-4 py-3 font-medium hover:bg-white transition-all"
                      >
                        Iniciar câmera
                      </button>

                      <button
                        id="btnCapturarFotoAceite"
                        type="button"
                        class="sm:flex-1 rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90 transition-all"
                        disabled
                      >
                        Tirar foto
                      </button>

                      <button
                        id="btnRefazerFotoAceite"
                        type="button"
                        class="sm:flex-1 rounded-xl border border-border bg-white/80 px-4 py-3 font-medium hover:bg-white transition-all hidden"
                      >
                        Refazer foto
                      </button>
                    </div>

                    <p id="statusCameraAceite" class="text-xs text-muted-foreground">
                      Clique em "Iniciar câmera" para registrar a foto do aceite.
                    </p>
                  </div>

                  <p id="erroTermoReservaCarro" class="text-sm text-destructive hidden whitespace-pre-line"></p>
                </div>

                <div class="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    id="confirmarTermoReservaCarro"
                    type="button"
                    class="sm:flex-1 rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90 transition-all"
                  >
                    Aceitar e continuar
                  </button>

                  <button
                    id="cancelarTermoReservaCarro"
                    type="button"
                    class="sm:flex-1 rounded-xl border border-border bg-white/50 px-4 py-3 font-medium hover:bg-white/70 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    async function parar_camera() {
      try {
        if (stream_camera) {
          stream_camera.getTracks().forEach((track) => track.stop());
        }
      } catch {}
      stream_camera = null;
    }

    async function fechar(resultado = null) {
      await parar_camera();
      overlay.remove();
      modal.remove();
      resolve(resultado);
    }

    function set_erro(msg) {
      const el = document.getElementById('erroTermoReservaCarro');
      if (!el) return;
      el.textContent = msg || '';
      el.classList.toggle('hidden', !msg);
    }

    function set_status_camera(msg) {
      const el = document.getElementById('statusCameraAceite');
      if (!el) return;
      el.textContent = msg || '';
    }

    function set_camera_indisponivel(msg = '') {
      const el = document.getElementById('cameraIndisponivelBox');
      if (!el) return;
      el.textContent = msg;
      el.classList.toggle('hidden', !msg);
    }

    async function iniciar_camera() {
      const video = document.getElementById('videoAceiteTermoReservaCarro');
      const img = document.getElementById('imgPreviewFotoAceiteTermoReservaCarro');
      const btn_capturar = document.getElementById('btnCapturarFotoAceite');
      const btn_refazer = document.getElementById('btnRefazerFotoAceite');

      set_erro('');
      set_camera_indisponivel('');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        set_camera_indisponivel(
          'Este dispositivo ou navegador não permite acesso à câmera por este recurso.\nFaça a solicitação usando um celular com câmera.'
        );
        set_status_camera('Câmera indisponível neste dispositivo.');
        return;
      }

      try {
        await parar_camera();

        foto_aceite_termo = '';

        if (img) {
          img.src = '';
          img.classList.add('hidden');
        }

        if (video) {
          video.classList.remove('hidden');
        }

        if (btn_refazer) {
          btn_refazer.classList.add('hidden');
        }

        stream_camera = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        if (video) {
          video.srcObject = stream_camera;
          await video.play().catch(() => {});
        }

        if (btn_capturar) {
          btn_capturar.disabled = false;
        }

        set_status_camera('Câmera pronta. Posicione o rosto e clique em "Tirar foto".');
      } catch (err) {
        console.error('Erro ao iniciar câmera do aceite.', err);

        let mensagem = 'Não foi possível acessar a câmera deste dispositivo.';

        if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
          mensagem = 'O acesso à câmera foi negado. Permita o uso da câmera no navegador ou faça a solicitação pelo celular.';
        } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
          mensagem = 'Nenhuma câmera foi encontrada neste computador. Faça a solicitação pelo celular.';
        } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError') {
          mensagem = 'A câmera está ocupada por outro aplicativo. Feche o aplicativo que está usando a câmera ou faça a solicitação pelo celular.';
        } else if (err?.name === 'OverconstrainedError' || err?.name === 'ConstraintNotSatisfiedError') {
          mensagem = 'A câmera disponível não atende aos requisitos mínimos. Faça a solicitação pelo celular.';
        }

        set_camera_indisponivel(mensagem);
        set_status_camera('Não foi possível iniciar a câmera.');

        const btn_capturar = document.getElementById('btnCapturarFotoAceite');
        if (btn_capturar) btn_capturar.disabled = true;
      }
    }

    async function capturar_foto() {
      const video = document.getElementById('videoAceiteTermoReservaCarro');
      const canvas = document.getElementById('canvasAceiteTermoReservaCarro');
      const img = document.getElementById('imgPreviewFotoAceiteTermoReservaCarro');
      const btn_capturar = document.getElementById('btnCapturarFotoAceite');
      const btn_refazer = document.getElementById('btnRefazerFotoAceite');

      set_erro('');

      if (!video || !canvas || !img) {
        return set_erro('Não foi possível preparar a captura da foto.');
      }

      if (!stream_camera) {
        return set_erro('Inicie a câmera antes de tirar a foto.');
      }

      const largura = video.videoWidth || 1280;
      const altura = video.videoHeight || 720;

      if (!largura || !altura) {
        return set_erro('A câmera ainda não ficou pronta. Aguarde um instante e tente novamente.');
      }

      canvas.width = largura;
      canvas.height = altura;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return set_erro('Não foi possível processar a foto.');
      }

      ctx.drawImage(video, 0, 0, largura, altura);
      foto_aceite_termo = canvas.toDataURL('image/jpeg', 0.92);

      img.src = foto_aceite_termo;
      img.classList.remove('hidden');
      video.classList.add('hidden');

      if (btn_capturar) btn_capturar.disabled = true;
      if (btn_refazer) btn_refazer.classList.remove('hidden');

      set_status_camera('Foto capturada com sucesso.');
      await parar_camera();
    }

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    const btn_close = document.getElementById('closeTermoReservaCarro');
    const btn_cancelar = document.getElementById('cancelarTermoReservaCarro');
    const btn_confirmar = document.getElementById('confirmarTermoReservaCarro');
    const chk_aceite = document.getElementById('aceiteTermoReservaCarro');
    const btn_iniciar_camera = document.getElementById('btnIniciarCameraAceite');
    const btn_capturar_foto = document.getElementById('btnCapturarFotoAceite');
    const btn_refazer_foto = document.getElementById('btnRefazerFotoAceite');

    overlay.addEventListener('click', () => fechar(null));
    btn_close?.addEventListener('click', () => fechar(null));
    btn_cancelar?.addEventListener('click', () => fechar(null));

    btn_iniciar_camera?.addEventListener('click', async () => {
      await iniciar_camera();
    });

    btn_capturar_foto?.addEventListener('click', async () => {
      await capturar_foto();
    });

    btn_refazer_foto?.addEventListener('click', async () => {
      const video = document.getElementById('videoAceiteTermoReservaCarro');
      const img = document.getElementById('imgPreviewFotoAceiteTermoReservaCarro');

      foto_aceite_termo = '';

      if (img) {
        img.src = '';
        img.classList.add('hidden');
      }

      if (video) {
        video.classList.remove('hidden');
      }

      btn_refazer_foto.classList.add('hidden');
      await iniciar_camera();
    });

    btn_confirmar?.addEventListener('click', async () => {
      try {
        set_erro('');

        if (!chk_aceite?.checked) {
          return set_erro('Você precisa aceitar o termo para continuar.');
        }

        if (!foto_aceite_termo) {
          return set_erro('A foto do aceite é obrigatória e deve ser tirada pela câmera neste momento.');
        }

        await fechar({
          aceito: true,
          foto_aceite_termo,
          termo_versao: '2026-04'
        });
      } catch (err) {
        set_erro(err?.message || 'Erro ao processar o aceite do termo.');
      }
    });
  });
}

// cadastro de veiculos

async function listarVeiculosGestao() {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const resp = await fetch(`${APIBASE}/api/veiculos`);
  const json = await resp.json().catch(() => ({}));

  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao listar veículos.');
  }

  return Array.isArray(json?.items) ? json.items : [];
}

async function buscarVeiculoPorId(idVeiculo) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const resp = await fetch(`${APIBASE}/api/veiculos/${encodeURIComponent(idVeiculo)}`);
  const json = await resp.json().catch(() => ({}));

  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao buscar veículo.');
  }

  return json.item || null;
}

async function salvarVeiculo(payload, idEdicao = null) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const isEdit = !!idEdicao;
  const url = isEdit
    ? `${APIBASE}/api/veiculos/${encodeURIComponent(idEdicao)}`
    : `${APIBASE}/api/veiculos`;

  const resp = await fetch(url, {
    method: isEdit ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const json = await resp.json().catch(() => ({}));

  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao salvar veículo.');
  }

  return json;
}

async function excluirVeiculo(idVeiculo) {
  const APIBASE = obterApiBase();
  if (!APIBASE) throw new Error('APIBASE não configurada na sessão.');

  const usuario = obterUsuarioLogado?.();
  if (!usuario) throw new Error('Usuário logado não identificado.');

  const resp = await fetch(`${APIBASE}/api/veiculos/${encodeURIComponent(idVeiculo)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usuarioExclusao: usuario
    })
  });

  const json = await resp.json().catch(() => ({}));

  if (!resp.ok || !json?.success) {
    throw new Error(json?.message || 'Erro ao excluir veículo.');
  }

  return json;
}

function removerModalGestaoVeiculos() {
  document.getElementById('gestaoVeiculosOverlay')?.remove();
  document.getElementById('gestaoVeiculosModal')?.remove();
}

function badgeStatusVeiculo(status) {
  const s = String(status || '').trim().toUpperCase();

  if (s === 'DISPONIVEL') return 'bg-green-100 text-green-700 border border-green-200';
  if (s === 'EM_USO') return 'bg-amber-100 text-amber-700 border border-amber-200';
  if (s === 'MANUTENCAO') return 'bg-red-100 text-red-700 border border-red-200';

  return 'bg-slate-100 text-slate-700 border border-slate-200';
}

async function abrirModalGestaoVeiculos() {
  removerModalGestaoVeiculos();

  const overlay = document.createElement('div');
  overlay.id = 'gestaoVeiculosOverlay';
  overlay.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm z-[230]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'gestaoVeiculosModal';
  modal.className = 'fixed inset-0 z-[240]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Gestão de veículos</h3>
                <p class="text-sm text-muted-foreground">Cadastre e atualize os veículos disponíveis.</p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  id="btnNovoVeiculo"
                  type="button"
                  class="h-10 rounded-xl bg-primary text-white hover:opacity-90 px-4 flex items-center gap-2 transition-all" title="Novo veículo">
                  <i class="fas fa-plus"></i>
                </button>

                <button
                  id="btnFecharGestaoVeiculos"
                  type="button"
                  class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                  aria-label="Fechar"
                  title="Fechar">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>

            <div class="px-6 py-6 space-y-4">
              <p id="gestaoVeiculosErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

              <div class="overflow-auto rounded-2xl border border-border bg-white/50">
                <table class="min-w-full text-sm">
                  <thead class="bg-muted/40 text-muted-foreground">
                    <tr>
                      <th class="text-left font-semibold form-control-sm">ID</th>
                      <th class="text-left font-semibold form-control-sm">Modelo</th>
                      <th class="text-left font-semibold form-control-sm">Placa</th>
                      <th class="text-left font-semibold form-control-sm">Marca</th>
                      <th class="text-left font-semibold form-control-sm">Cor</th>
                      <th class="text-left font-semibold form-control-sm">KM</th>
                      <th class="text-left font-semibold form-control-sm">Status</th>
                      <th class="text-right font-semibold form-control-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody id="tbodyGestaoVeiculos">
                    <tr>
                      <td colspan="8" class="px-4 py-6 form-subtitle-sm text-center">
                        Carregando veículos...
                      </td>
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

  document.body.appendChild(modal);

  const tbody = document.getElementById('tbodyGestaoVeiculos');
  const erroEl = document.getElementById('gestaoVeiculosErro');

  function fechar() {
    removerModalGestaoVeiculos();
  }

  function setErro(msg) {
    if (!erroEl) return;

    if (!msg) {
      erroEl.textContent = '';
      erroEl.classList.add('hidden');
      return;
    }

    erroEl.textContent = msg;
    erroEl.classList.remove('hidden');
  }

  function renderTabela(items) {
    if (!tbody) return;

    if (!Array.isArray(items) || !items.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-4 py-6 form-subtitle-sm text-center">
            Nenhum veículo cadastrado.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = items.map(item => `
      <tr class="border-t border-border/70">
        <td class="px-4 py-3 font-semibold">${escapeHtml(item.id ?? '-')}</td>
        <td class="px-4 py-3">${escapeHtml(item.modelo ?? '-')}</td>
        <td class="px-4 py-3">${escapeHtml(item.placa ?? '-')}</td>
        <td class="px-4 py-3">${escapeHtml(item.marca ?? '-')}</td>
        <td class="px-4 py-3">${escapeHtml(item.cor ?? '-')}</td>
        <td class="px-4 py-3">${escapeHtml(item.km_atual ?? '-')}</td>
        <td class="px-4 py-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeStatusVeiculo(item.status_veiculo)}">
            ${escapeHtml(item.status_veiculo ?? '-')}
          </span>
        </td>
        <td class="px-4 py-3">
          <div class="flex justify-end gap-2">
            ${
                ['DISPONIVEL', 'MANUTENCAO'].includes(
                  String(item.status_veiculo || '')
                    .trim()
                    .toUpperCase()
                    .replace(/\s+/g, '_')
                )
                  ? `
                    <button
                      type="button"
                      class="btnEditarVeiculo w-10 h-10 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
                      data-id="${escapeHtml(item.id)}"
                      title="Editar veículo">
                      <i class="fas fa-pen"></i>
                    </button>
                  `
                  : ''
              }
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.btnEditarVeiculo').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          const id = btn.getAttribute('data-id');
          const item = await buscarVeiculoPorId(id);
          await abrirModalVeiculo('edit', item);
          await carregar();
        } catch (err) {
          setErro(err?.message || 'Erro ao abrir edição do veículo.');
        }
      });
    });
  }

  async function carregar() {
    try {
      setErro('');
      const items = await listarVeiculosGestao();
      renderTabela(items);
    } catch (err) {
      setErro(err?.message || 'Erro ao carregar veículos.');
      tbody.innerHTML = `
        <tr>
          <td colspan="8" class="px-4 py-6 text-sm text-destructive text-center">
            Erro ao carregar veículos.
          </td>
        </tr>
      `;
    }
  }

  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharGestaoVeiculos')?.addEventListener('click', fechar);

  document.getElementById('btnNovoVeiculo')?.addEventListener('click', async () => {
    try {
      await abrirModalVeiculo('new');
      await carregar();
    } catch (err) {
      setErro(err?.message || 'Erro ao abrir cadastro de veículo.');
    }
  });

  await carregar();
}


function removerModalVeiculo() {
  document.getElementById('veiculoOverlay')?.remove();
  document.getElementById('veiculoModal')?.remove();
}

async function abrirModalVeiculo(modo = 'new', veiculo = null) {
  removerModalVeiculo();

  const isEdit = modo === 'edit';

  const overlay = document.createElement('div');
  overlay.id = 'veiculoOverlay';
  overlay.className = 'fixed inset-0 bg-black/30 backdrop-blur-sm z-[250]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'veiculoModal';
  modal.className = 'fixed inset-0 z-[260]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-2xl mx-auto px-4 sm:px-6">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">
                  ${isEdit ? 'Editar veículo' : 'Novo veículo'}
                </h3>
                <p class="text-sm text-muted-foreground">
                  ${isEdit ? 'Atualize os dados do veículo.' : 'Informe os dados do novo veículo.'}
                </p>
              </div>

              <button
                id="btnFecharVeiculoModal"
                type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                aria-label="Fechar"
                title="Fechar">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <form id="formVeiculo" class="px-6 py-6 space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="veiculoModelo" class="text-sm font-medium">Modelo</label>
                  <input
                    id="veiculoModelo"
                    type="text"
                    class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Ex.: Hilux SRX"
                    required>
                </div>

                <div class="space-y-2">
                  <label for="veiculoPlaca" class="text-sm font-medium">Placa</label>
                  <input
                    id="veiculoPlaca"
                    type="text"
                    class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 uppercase"
                    placeholder="ABC1D23"
                    required>
                </div>

                <div class="space-y-2">
                  <label for="veiculoMarca" class="text-sm font-medium">Marca</label>
                  <input
                    id="veiculoMarca"
                    type="text"
                    class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Ex.: Toyota">
                </div>

                <div class="space-y-2">
                  <label for="veiculoCor" class="text-sm font-medium">Cor</label>
                  <input
                    id="veiculoCor"
                    type="text"
                    class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Ex.: Branca">
                </div>

                <div class="space-y-2">
                  <label for="veiculoKmAtual" class="text-sm font-medium">KM atual</label>
                  <input
                    id="veiculoKmAtual"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="0">
                </div>

                <div class="space-y-2">
                  <label for="veiculoStatus" class="text-sm font-medium">Status</label>
                  <select
                    id="veiculoStatus"
                    class="w-full rounded-xl border border-border bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="DISPONIVEL">DISPONIVEL</option>
                    <option value="EM_USO">EM_USO</option>
                    <option value="MANUTENCAO">MANUTENCAO</option>
                  </select>
                </div>
              </div>

              <label class="flex items-center gap-3 rounded-xl border border-border bg-white/60 px-4 py-3 cursor-pointer">
                <input id="veiculoAtivo" type="checkbox" checked>
                <span class="text-sm">Veículo ativo</span>
              </label>

              <p id="veiculoErro" class="text-sm text-destructive hidden whitespace-pre-line"></p>

              <div class="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  id="btnSalvarVeiculo"
                  type="submit"
                  class="sm:flex-1 rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90 transition-all">
                  ${isEdit ? 'Salvar alterações' : 'Salvar veículo'}
                </button>

                <button
                  id="btnCancelarVeiculo"
                  type="button"
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

  const form = document.getElementById('formVeiculo');
  const btnSalvar = document.getElementById('btnSalvarVeiculo');

  function fechar() {
    removerModalVeiculo();
  }

  function setErro(msg) {
    const el = document.getElementById('veiculoErro');
    if (!el) return;

    if (!msg) {
      el.textContent = '';
      el.classList.add('hidden');
      return;
    }

    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function setLoading(loading) {
    if (!btnSalvar) return;
    btnSalvar.disabled = loading;
    btnSalvar.textContent = loading
      ? (isEdit ? 'Salvando alterações...' : 'Salvando...')
      : (isEdit ? 'Salvar alterações' : 'Salvar veículo');
    btnSalvar.classList.toggle('opacity-70', loading);
  }

  if (isEdit && veiculo) {
    document.getElementById('veiculoModelo').value = veiculo.modelo ?? '';
    document.getElementById('veiculoPlaca').value = veiculo.placa ?? '';
    document.getElementById('veiculoMarca').value = veiculo.marca ?? '';
    document.getElementById('veiculoCor').value = veiculo.cor ?? '';
    document.getElementById('veiculoKmAtual').value = veiculo.km_atual ?? '';
    document.getElementById('veiculoStatus').value = veiculo.status_veiculo ?? 'DISPONIVEL';
    document.getElementById('veiculoAtivo').checked = Number(veiculo.ativo ?? 1) === 1;
  }

  overlay.addEventListener('click', fechar);
  document.getElementById('btnFecharVeiculoModal')?.addEventListener('click', fechar);
  document.getElementById('btnCancelarVeiculo')?.addEventListener('click', fechar);

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    setErro('');

    const payload = {
      modelo: document.getElementById('veiculoModelo')?.value?.trim(),
      placa: document.getElementById('veiculoPlaca')?.value?.trim().toUpperCase(),
      marca: document.getElementById('veiculoMarca')?.value?.trim(),
      cor: document.getElementById('veiculoCor')?.value?.trim(),
      kmAtual: Number(document.getElementById('veiculoKmAtual')?.value || 0),
      statusVeiculo: document.getElementById('veiculoStatus')?.value?.trim(),
      ativo: document.getElementById('veiculoAtivo')?.checked ? 1 : 0
    };

    if (!payload.modelo) return setErro('Informe o modelo do veículo.');
    if (!payload.placa) return setErro('Informe a placa do veículo.');
    if (!payload.statusVeiculo) return setErro('Informe o status do veículo.');

    try {
      setLoading(true);
      const json = await salvarVeiculo(payload, isEdit ? veiculo?.id : null);
      fechar();
      alert(json?.message || (isEdit ? 'Veículo atualizado com sucesso.' : 'Veículo cadastrado com sucesso.'));
      abrirModalGestaoVeiculos();
    } catch (err) {
      setErro(err?.message || 'Erro ao salvar veículo.');
    } finally {
      setLoading(false);
    }
  });
}


// --------------- Fim Reserva Carro ----------------

function ativarHomeMobileTab(tab) {
  const painel = document.getElementById('homePainelPanel');
  const calendario = document.getElementById('homeCalendarioPanel');
  const botoes = document.querySelectorAll('.home-mobile-tab-btn');

  if (!painel || !calendario) return;

  const isDesktop = window.innerWidth >= 1024;

  if (isDesktop) {
    painel.classList.add('active');
    calendario.classList.add('active');
    botoes.forEach(btn => btn.classList.remove('active'));
    return;
  }

  if (tab === 'calendario') {
    painel.classList.remove('active');
    calendario.classList.add('active');
  } else {
    painel.classList.add('active');
    calendario.classList.remove('active');
  }

  botoes.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.homeTab === tab);
  });
}

window.addEventListener('resize', resetHomePanelsDesktop);


/* =========================
   Cadastro Organograma
========================= */

let organogramaState = {
  unidades: [],
  setores: [],
  vinculos: [],
  editandoId: null
};

function getApiBaseOrganograma() {
  const base = sessionStorage.getItem('api_base') || sessionStorage.getItem('apibase');
  if (!base) throw new Error('APIBASE não configurada.');
  return String(base).trim().replace(/\/$/, '');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizarListaResposta(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

function normalizarItemUnidade(item) {
  return {
    id: item?.id ?? item?.ID ?? '',
    nome: item?.nome ?? item?.NOME ?? ''
  };
}

function normalizarItemSetor(item) {
  return {
    id: item?.id ?? item?.ID ?? '',
    nome: item?.nome ?? item?.NOME ?? '',
    descricao: item?.descricao ?? item?.DESCRICAO ?? '',
    status: Number(item?.status ?? item?.STATUS ?? 1) ? 1 : 0
  };
}

function mostrarMsgOrganograma(msg, erro = false) {
  const el = document.getElementById('organogramaMsg');
  if (!el) return;

  el.textContent = msg || '';
  el.classList.remove('hidden', 'text-destructive', 'text-emerald-700');

  if (!msg) {
    el.classList.add('hidden');
    return;
  }

  el.classList.add(erro ? 'text-destructive' : 'text-emerald-700');
}

function limparFormularioOrganograma() {
  organogramaState.editandoId = null;

  const setorPai = document.getElementById('orgSetorPai');
  const setorFilho = document.getElementById('orgSetorFilho');
  const btnSalvar = document.getElementById('btnSalvarVinculoOrganograma');
  const btnLimpar = document.getElementById('btnLimparVinculoOrganograma');

  if (setorPai) setorPai.value = '';
  if (setorFilho) setorFilho.value = '';

  if (btnSalvar) btnSalvar.textContent = 'Salvar vínculo';
  if (btnLimpar) btnLimpar.classList.remove('hidden');
}

async function carregarUnidadesTrabalhoOrganograma() {
  const resp = await fetch(`${APIBASE}/api/local-trabalho`);
  if (!resp.ok) throw new Error('Falha ao carregar unidades de trabalho.');

  const data = await resp.json();
  organogramaState.unidades = Array.isArray(data?.items) ? data.items : [];

  preencherSelectUnidadesOrganograma();
}

async function carregarSetoresOrganograma() {
  const resp = await fetch(`${APIBASE}/api/organograma-setores`);
  if (!resp.ok) throw new Error('Falha ao carregar setores do organograma.');

  const data = await resp.json();
  organogramaState.setores = Array.isArray(data?.items) ? data.items : [];

  preencherSelectSetoresOrganograma();
}

async function carregarVinculosOrganograma(idLocalTrabalho = '') {
  const APIBASE = getApiBaseOrganograma();

  const url = idLocalTrabalho
    ? `${APIBASE}/api/organograma?id_local_trabalho=${encodeURIComponent(idLocalTrabalho)}`
    : `${APIBASE}/api/organograma`;

  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error('Falha ao carregar vínculos do organograma.');
  }

  const data = await resp.json();
  organogramaState.vinculos = normalizarListaResposta(data);

  renderTabelaOrganograma();
  renderArvoreOrganograma();
}

function preencherSelectUnidadesOrganograma() {
  const select = document.getElementById('orgFiltroUnidade');
  if (!select) return;

  const options = ['<option value="">Selecione...</option>'].concat(
    organogramaState.unidades.map(item => {
      const id = item.id ?? item.ID;
      const nome = item.nome ?? item.NOME;
      return `<option value="${id}">${escapeHtml(nome)}</option>`;
    })
  );

  select.innerHTML = options.join('');
}

function preencherSelectSetoresOrganograma() {
  const ids = ['orgSetorPai', 'orgSetorFilho'];

  ids.forEach(idSelect => {
    const select = document.getElementById(idSelect);
    if (!select) return;

    const options = ['<option value="">Selecione...</option>'].concat(
      organogramaState.setores.map(item => {
        const id = item.id ?? item.ID;
        const nome = item.nome ?? item.NOME;
        return `<option value="${id}">${escapeHtml(nome)}</option>`;
      })
    );

    select.innerHTML = options.join('');
  });
}

async function salvarVinculoOrganograma() {
  try {
    mostrarMsgOrganograma('');

    const APIBASE = getApiBaseOrganograma();
    const idLocalTrabalho = document.getElementById('orgFiltroUnidade')?.value;
    const idSetorPai = document.getElementById('orgSetorPai')?.value;
    const idSetorFilho = document.getElementById('orgSetorFilho')?.value;

    if (!idLocalTrabalho) {
      return mostrarMsgOrganograma('Selecione a unidade de trabalho.', true);
    }

    if (!idSetorPai || !idSetorFilho) {
      return mostrarMsgOrganograma('Selecione o setor pai e o setor filho.', true);
    }

    if (String(idSetorPai) === String(idSetorFilho)) {
      return mostrarMsgOrganograma('O setor pai não pode ser igual ao setor filho.', true);
    }

    const payload = {
      id_local_trabalho: Number(idLocalTrabalho),
      id_setor_pai: Number(idSetorPai),
      id_setor_filho: Number(idSetorFilho)
    };


    const editandoId = organogramaState.editandoId;

    const resp = await fetch(
      editandoId
        ? `${APIBASE}/api/organograma/${editandoId}`
        : `${APIBASE}/api/organograma`,
      {
        method: editandoId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      throw new Error(data?.message || data?.error || data?.erro || 'Não foi possível salvar o vínculo.');
    }

    organogramaState.editandoId = null;
    limparFormularioOrganograma();
    mostrarMsgOrganograma('Vínculo salvo com sucesso.');

    await carregarVinculosOrganograma(idLocalTrabalho);
  } catch (err) {
    mostrarMsgOrganograma(err?.message || 'Erro ao salvar vínculo.', true);
  }
}

async function excluirVinculoOrganograma(id) {
  try {
    if (!confirm('Deseja realmente excluir este vínculo?')) return;

    const APIBASE = getApiBaseOrganograma();
    const idLocal = document.getElementById('orgFiltroUnidade')?.value;

    const resp = await fetch(`${APIBASE}/api/organograma/${id}`, {
      method: 'DELETE'
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      throw new Error(data?.message || data?.error || data?.erro || 'Erro ao excluir vínculo.');
    }

    mostrarMsgOrganograma(data?.message || 'Vínculo excluído com sucesso.');
    limparFormularioOrganograma();
    await carregarVinculosOrganograma(idLocal);
  } catch (err) {
    mostrarMsgOrganograma(err?.message || 'Erro ao excluir vínculo.', true);
  }
}

function editarVinculoOrganograma(id) {
  const item = organogramaState.vinculos.find(x => String(x.id) === String(id));
  if (!item) return;

  organogramaState.editandoId = item.id;

  const unidade = document.getElementById('orgFiltroUnidade');
  const setorPai = document.getElementById('orgSetorPai');
  const setorFilho = document.getElementById('orgSetorFilho');
  const btnSalvar = document.getElementById('btnSalvarVinculoOrganograma');

  if (unidade) unidade.value = item.id_local_trabalho ?? '';
  if (setorPai) setorPai.value = item.id_setor_pai ?? '';
  if (setorFilho) setorFilho.value = item.id_setor_filho ?? '';

  if (btnSalvar) btnSalvar.textContent = 'Salvar alterações';

  mostrarMsgOrganograma('Modo de edição ativado.');
}

function renderTabelaOrganograma() {
  const tbody = document.getElementById('tbodyOrganograma');
  if (!tbody) return;

  const itens = (Array.isArray(organogramaState.vinculos) ? organogramaState.vinculos : []).filter(item =>
    Number(item?.id) > 0 &&
    Number(item?.id_local_trabalho) > 0 &&
    Number(item?.id_setor_pai) > 0 &&
    Number(item?.id_setor_filho) > 0
  );

  if (!itens.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-6 form-subtitle-sm text-center">Nenhum vínculo cadastrado.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = itens.map(item => `
    <tr>
      <td class="px-4 py-3">${escapeHtml(item?.nomelocaltrabalho ?? '-')}</td>
      <td class="px-4 py-3">${escapeHtml(item?.nomesetorpai ?? '-')}</td>
      <td class="px-4 py-3">${escapeHtml(item?.nomesetorfilho ?? '-')}</td>
      <td class="px-4 py-3 text-right">
        <div class="inline-flex items-center gap-2">
          <button type="button" class="w-9 h-9 rounded-lg border border-border bg-white/70 hover:bg-white transition-all"
            onclick="editarVinculoOrganograma(${Number(item.id)})" title="Editar">
            <i class="fas fa-pen"></i>
          </button>
          <button type="button" class="w-9 h-9 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all"
            onclick="excluirVinculoOrganograma(${Number(item.id)})" title="Excluir">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function montarArvoreOrganograma(vinculos) {
  const filhosPorPai = new Map();
  const todosFilhos = new Set();
  const todosNos = new Map();

  const lista = Array.isArray(vinculos) ? vinculos : [];

  lista.forEach(item => {
    const paiId = Number(item?.id_setor_pai);
    const filhoId = Number(item?.id_setor_filho);
    const nomePai = String(item?.nomesetorpai ?? '').trim();
    const nomeFilho = String(item?.nomesetorfilho ?? '').trim();

    if (!Number.isFinite(paiId) || paiId <= 0) return;
    if (!Number.isFinite(filhoId) || filhoId <= 0) return;
    if (!nomePai || !nomeFilho) return;
    if (paiId === filhoId) return;

    if (!todosNos.has(paiId)) {
      todosNos.set(paiId, { id: paiId, nome: nomePai });
    }

    if (!todosNos.has(filhoId)) {
      todosNos.set(filhoId, { id: filhoId, nome: nomeFilho });
    }

    if (!filhosPorPai.has(paiId)) {
      filhosPorPai.set(paiId, []);
    }

    const filhos = filhosPorPai.get(paiId);
    if (!filhos.includes(filhoId)) {
      filhos.push(filhoId);
    }

    todosFilhos.add(filhoId);
  });

  const raizes = [...todosNos.values()].filter(no => !todosFilhos.has(no.id));

  return { raizes, filhosPorPai, todosNos };
}

function renderNoOrganograma(noId, filhosPorPai, todosNos, visitados = new Set()) {
  if (visitados.has(noId)) {
    return `
      <li>
        <div class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Ciclo detectado
        </div>
      </li>
    `;
  }

  const novoVisitados = new Set(visitados);
  novoVisitados.add(noId);

  const no = todosNos.get(noId);
  const filhos = filhosPorPai.get(noId) || [];

  return `
    <li class="relative pl-6">
      <div class="rounded-xl border border-border bg-white80 px-4 py-3 shadow-sm inline-flex items-center gap-2">
        <i class="fas fa-building text-primary"></i>
        <span class="font-medium">${escapeHtml(no?.nome ?? 'Sem nome')}</span>
      </div>

      ${
        filhos.length
          ? `
            <ul class="mt-3 space-y-3 border-l border-border70 ml-4 pl-4">
              ${filhos.map(filhoId => renderNoOrganograma(filhoId, filhosPorPai, todosNos, novoVisitados)).join('')}
            </ul>
          `
          : ''
      }
    </li>
  `;
}

function renderArvoreOrganograma() {
  const container = document.getElementById('organogramaArvore');
  const idLocalTrabalho = document.getElementById('orgFiltroUnidade')?.value;

  if (!container) return;

  if (!idLocalTrabalho) {
    container.innerHTML = `
      <div class="rounded-2xl border border-dashed border-border bg-white/40 p-8 text-center form-subtitle-sm">
        Selecione uma unidade de trabalho para visualizar o organograma.
      </div>
    `;
    return;
  }

  const vinculos = (Array.isArray(organogramaState.vinculos) ? organogramaState.vinculos : [])
    .filter(v => String(v?.id_local_trabalho) === String(idLocalTrabalho))
    .filter(v =>
      Number(v?.id_setor_pai) > 0 &&
      Number(v?.id_setor_filho) > 0 &&
      String(v?.nomesetorpai ?? '').trim() &&
      String(v?.nomesetorfilho ?? '').trim()
    );

  if (!vinculos.length) {
    container.innerHTML = `
      <div class="rounded-2xl border border-dashed border-border bg-white/40 p-8 text-center form-subtitle-sm">
        Nenhum vínculo cadastrado para esta unidade.
      </div>
    `;
    return;
  }

  const { raizes, filhosPorPai, todosNos } = montarArvoreOrganograma(vinculos);

  if (!raizes.length) {
    container.innerHTML = `
      <div class="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-8 text-center form-subtitle-sm text-amber-800">
        Não foi possível montar a árvore do organograma. Verifique se os vínculos cadastrados possuem uma raiz válida.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="organograma-classico-wrap overflow-auto py-6">
      <div class="organograma-classico">
        ${raizes.map(raiz => renderNoClassico(raiz.id, filhosPorPai, todosNos)).join('')}
      </div>
    </div>
  `;
}

function renderNoClassico(noId, filhosPorPai, todosNos, visitados = new Set()) {
  if (visitados.has(noId)) {
    return `
      <div class="org-group">
        <div class="org-card !bg-red-500">Ciclo detectado</div>
      </div>
    `;
  }

  const novoVisitados = new Set(visitados);
  novoVisitados.add(noId);

  const no = todosNos.get(noId);
  if (!no) return '';

  const filhos = filhosPorPai.get(noId) || [];

  return `
    <div class="org-group">
      <div class="org-card">${escapeHtml(no.nome)}</div>

      ${filhos.length ? `
        <div class="org-children-wrap">
          <div class="org-parent-line"></div>
          <div class="org-children">
            ${filhos.map(filhoId => `
              <div class="org-child">
                ${renderNoClassico(filhoId, filhosPorPai, todosNos, novoVisitados)}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/* =========================
   Modal de Setores Organograma
========================= */

function removerModalSetoresOrganograma() {
  document.getElementById('organogramaSetoresOverlay')?.remove();
  document.getElementById('organogramaSetoresModal')?.remove();
}

async function abrirModalSetoresOrganograma() {
  removerModalSetoresOrganograma();

  const APIBASE = getApiBaseOrganograma();

  const overlay = document.createElement('div');
  overlay.id = 'organogramaSetoresOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[220]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'organogramaSetoresModal';
  modal.className = 'fixed inset-0 z-[230]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden bg-white">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Gerenciar setores do organograma</h3>
                <p class="text-sm text-muted-foreground">Cadastre, edite e exclua os setores usados no organograma.</p>
              </div>

              <button
                id="btnFecharModalSetoresOrganograma"
                type="button"
                class="w-10 h-10 rounded-xl bg-white60 border border-border hover:bg-white transition-all flex items-center justify-center"
                aria-label="Fechar"
                title="Fechar"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="px-6 py-6 space-y-5">
              <div class="rounded-2xl border border-border bg-white/60 p-4 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="form-label-sm block">Nome do setor</label>
                    <input
                      id="orgModalSetorNome"
                      type="text"
                      class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none"
                      placeholder="Informe o nome do setor"
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="form-label-sm block">Status</label>
                    <select
                      id="orgModalSetorStatus"
                      class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none"
                    >
                      <option value="1">Ativo</option>
                      <option value="0">Inativo</option>
                    </select>
                  </div>

                  <div class="space-y-2 md:col-span-2">
                    <label class="form-label-sm block">Descrição</label>
                    <textarea
                      id="orgModalSetorDescricao"
                      rows="3"
                      class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none resize-none"
                      placeholder="Descrição do setor (opcional)"
                    ></textarea>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-2">
                  <button
                    id="btnSalvarSetorOrganogramaModal"
                    type="button"
                    class="sm:flex-1 rounded-xl bg-primary text-white form-control-sm font-medium hover:opacity-90 transition-all"
                  >
                    Salvar setor
                  </button>

                  <button
                    id="btnLimparSetorOrganogramaModal"
                    type="button"
                    class="sm:flex-1 rounded-xl border border-border bg-white/60 form-control-sm font-medium hover:bg-white transition-all"
                  >
                    Limpar
                  </button>
                </div>

                <p id="orgModalSetorMsg" class="form-subtitle-sm hidden"></p>
              </div>

              <div class="rounded-2xl border border-border bg-white/50 overflow-hidden">
                <div class="overflow-auto">
                  <table class="min-w-full text-sm">
                    <thead class="bg-muted/40 text-muted-foreground">
                      <tr>
                        <th class="text-left font-semibold form-control-sm px-4 py-3">ID</th>
                        <th class="text-left font-semibold form-control-sm px-4 py-3">Nome</th>
                        <th class="text-left font-semibold form-control-sm px-4 py-3">Descrição</th>
                        <th class="text-left font-semibold form-control-sm px-4 py-3">Status</th>
                        <th class="text-right font-semibold form-control-sm px-4 py-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody id="tbodySetoresOrganogramaModal">
                      <tr>
                        <td colspan="5" class="px-4 py-6 form-subtitle-sm text-center">Carregando setores...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="px-6 py-5 border-t border-border flex justify-end">
              <button
                id="btnFecharRodapeModalSetoresOrganograma"
                type="button"
                class="rounded-xl border border-border bg-white/60 form-control-sm px-4 hover:bg-white transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  let editandoSetorId = null;
  let cacheSetores = [];

  const tbody = document.getElementById('tbodySetoresOrganogramaModal');
  const inputNome = document.getElementById('orgModalSetorNome');
  const inputDescricao = document.getElementById('orgModalSetorDescricao');
  const inputStatus = document.getElementById('orgModalSetorStatus');
  const btnSalvar = document.getElementById('btnSalvarSetorOrganogramaModal');

  function setMsg(msg, erro = false) {
    const el = document.getElementById('orgModalSetorMsg');
    if (!el) return;

    el.textContent = msg || '';
    el.classList.remove('hidden', 'text-destructive', 'text-emerald-700');

    if (!msg) {
      el.classList.add('hidden');
      return;
    }

    el.classList.add(erro ? 'text-destructive' : 'text-emerald-700');
  }

  function limparFormularioModalSetor() {
    editandoSetorId = null;
    if (inputNome) inputNome.value = '';
    if (inputDescricao) inputDescricao.value = '';
    if (inputStatus) inputStatus.value = '1';
    if (btnSalvar) btnSalvar.textContent = 'Salvar setor';
    setMsg('');
  }

  function badgeStatusSetor(status) {
    return Number(status) === 1
      ? '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700">Ativo</span>'
      : '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 bg-slate-100 text-slate-700">Inativo</span>';
  }

  function renderTabelaSetores() {
    if (!tbody) return;

    if (!cacheSetores.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="px-4 py-6 form-subtitle-sm text-center">
            Nenhum setor cadastrado.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = cacheSetores.map(item => `
      <tr class="border-t border-border/70">
        <td class="px-4 py-3 font-semibold">${escapeHtml(item.id)}</td>
        <td class="px-4 py-3">${escapeHtml(item.nome)}</td>
        <td class="px-4 py-3">${escapeHtml(item.descricao || '-')}</td>
        <td class="px-4 py-3">${badgeStatusSetor(item.status)}</td>
        <td class="px-4 py-3 text-right">
          <div class="inline-flex items-center gap-2">
            <button
              type="button"
              class="w-9 h-9 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
              data-editar-id="${escapeHtml(item.id)}"
              title="Editar"
            >
              <i class="fas fa-pen"></i>
            </button>

            <button
              type="button"
              class="w-9 h-9 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all"
              data-excluir-id="${escapeHtml(item.id)}"
              title="Excluir"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-editar-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-editar-id');
        const item = cacheSetores.find(x => String(x.id) === String(id));
        if (!item) return;

        editandoSetorId = item.id;
        if (inputNome) inputNome.value = item.nome || '';
        if (inputDescricao) inputDescricao.value = item.descricao || '';
        if (inputStatus) inputStatus.value = String(Number(item.status) ? 1 : 0);
        if (btnSalvar) btnSalvar.textContent = 'Salvar alterações';
        setMsg('Modo de edição ativado.');
        inputNome?.focus();
      });
    });

    tbody.querySelectorAll('[data-excluir-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-excluir-id');
        const item = cacheSetores.find(x => String(x.id) === String(id));

        if (!item) return;
        if (!confirm(`Deseja realmente excluir o setor "${item.nome}"?`)) return;

        try {
          setMsg('');

          const resp = await fetch(`${APIBASE}/api/organograma-setores/${id}`, {
            method: 'DELETE'
          });

          const data = await resp.json().catch(() => null);

          if (!resp.ok) {
            throw new Error(data?.message || data?.error || 'Erro ao excluir setor.');
          }

          setMsg(data?.message || 'Setor excluído com sucesso.');
          await carregarListaSetoresModal();
          await carregarSetoresOrganograma();
        } catch (err) {
          setMsg(err?.message || 'Erro ao excluir setor.', true);
        }
      });
    });
  }

  async function carregarListaSetoresModal() {
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="px-4 py-6 form-subtitle-sm text-center">
            Carregando setores...
          </td>
        </tr>
      `;
    }

    const resp = await fetch(`${APIBASE}/api/organograma-setores`);
    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      throw new Error(data?.message || data?.error || 'Erro ao carregar setores.');
    }

    cacheSetores = normalizarListaResposta(data).map(normalizarItemSetor);
    renderTabelaSetores();
  }

  async function salvarSetorModal() {
    try {
      setMsg('');

      const nome = String(inputNome?.value ?? '').trim();
      const descricao = String(inputDescricao?.value ?? '').trim();
      const status = Number(inputStatus?.value ?? 1) ? 1 : 0;

      if (!nome) {
        return setMsg('Informe o nome do setor.', true);
      }

      const payload = {
        nome,
        descricao,
        status
      };

      const resp = await fetch(
        editandoSetorId
          ? `${APIBASE}/api/organograma-setores/${editandoSetorId}`
          : `${APIBASE}/api/organograma-setores`,
        {
          method: editandoSetorId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        throw new Error(data?.message || data?.error || 'Erro ao salvar setor.');
      }

      setMsg(editandoSetorId ? 'Setor atualizado com sucesso.' : 'Setor cadastrado com sucesso.');
      limparFormularioModalSetor();
      await carregarListaSetoresModal();
      await carregarSetoresOrganograma();
    } catch (err) {
      setMsg(err?.message || 'Erro ao salvar setor.', true);
    }
  }

  function fecharModal() {
    removerModalSetoresOrganograma();
  }

  overlay.addEventListener('click', fecharModal);
  document.getElementById('btnFecharModalSetoresOrganograma')?.addEventListener('click', fecharModal);
  document.getElementById('btnFecharRodapeModalSetoresOrganograma')?.addEventListener('click', fecharModal);
  document.getElementById('btnLimparSetorOrganogramaModal')?.addEventListener('click', limparFormularioModalSetor);
  document.getElementById('btnSalvarSetorOrganogramaModal')?.addEventListener('click', salvarSetorModal);

  await carregarListaSetoresModal();
}

function removerModalUsuariosOrganograma() {
  document.getElementById('organogramaUsuariosOverlay')?.remove();
  document.getElementById('organogramaUsuariosModal')?.remove();
}

async function abrirModalUsuariosOrganograma() {
  removerModalUsuariosOrganograma();

  const APIBASE = getApiBaseOrganograma();

  const overlay = document.createElement('div');
  overlay.id = 'organogramaUsuariosOverlay';
  overlay.className = 'fixed inset-0 bg-black/40 backdrop-blur-sm z-[220]';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'organogramaUsuariosModal';
  modal.className = 'fixed inset-0 z-[230]';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  modal.innerHTML = `
    <div class="w-full h-full overflow-y-auto no-scrollbar">
      <div class="min-h-full flex items-start justify-center p-4 md:p-8">
        <div class="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden bg-white">
            <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h3 class="text-lg font-semibold text-foreground">Vincular usuário ao setor do organograma</h3>
                <p class="text-sm text-muted-foreground">Cadastre, edite e exclua vínculos de usuários com setores do organograma.</p>
              </div>

              <button
                id="btnFecharModalUsuariosOrganograma"
                type="button"
                class="w-10 h-10 rounded-xl bg-white/60 border border-border hover:bg-white transition-all flex items-center justify-center"
                aria-label="Fechar"
                title="Fechar"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="px-6 py-6 space-y-5">
              <div class="rounded-2xl border border-border bg-white/60 p-4 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="form-label-sm block">Usuário</label>
                    <select
                      id="orgUsuarioVinculoSelect"
                      class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none"
                    >
                      <option value="">Selecione...</option>
                    </select>
                  </div>

                  <div class="space-y-2">
                    <label class="form-label-sm block">Setor do organograma</label>
                    <select
                      id="orgSetorUsuarioVinculoSelect"
                      class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none"
                    >
                      <option value="">Selecione...</option>
                    </select>
                  </div>

                  <div class="space-y-2">
                    <label class="form-label-sm block">Precisa aprovação para reservar carro?</label>
                    <select
                      id="orgUsuarioPrecisaAprovacaoReservaCarro"
                      class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none"
                    >
                      <option value="sim">Sim</option>
                      <option value="nao">Não</option>
                    </select>
                  </div>

                  <div class="space-y-2">
                    <label class="form-label-sm block">Status</label>
                    <select
                      id="orgUsuarioVinculoStatus"
                      class="w-full rounded-xl border border-border bg-white/70 form-control-sm outline-none"
                    >
                      <option value="1">Ativo</option>
                      <option value="0">Inativo</option>
                    </select>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-2">
                  <button
                    id="btnSalvarUsuarioVinculoOrganogramaModal"
                    type="button"
                    class="sm:flex-1 rounded-xl bg-primary text-white form-control-sm font-medium hover:opacity-90 transition-all"
                  >
                    Salvar vínculo
                  </button>

                  <button
                    id="btnLimparUsuarioVinculoOrganogramaModal"
                    type="button"
                    class="sm:flex-1 rounded-xl border border-border bg-white/60 form-control-sm font-medium hover:bg-white transition-all"
                  >
                    Limpar
                  </button>
                </div>

                <p id="orgUsuarioVinculoMsg" class="form-subtitle-sm hidden"></p>
              </div>

              <div class="rounded-2xl border border-border bg-white/50 overflow-hidden">
                <div class="overflow-auto">
                  <table class="min-w-full text-sm">
                    <thead class="bg-muted/40 text-muted-foreground">
                      <tr>
                        <th class="text-left font-semibold form-control-sm px-4 py-3">Usuário</th>
                        <th class="text-left font-semibold form-control-sm px-4 py-3">E-mail</th>
                        <th class="text-left font-semibold form-control-sm px-4 py-3">Setor</th>
                        <th class="text-left font-semibold form-control-sm px-4 py-3">Precisa aprovação</th>
                        <th class="text-left font-semibold form-control-sm px-4 py-3">Status</th>
                        <th class="text-right font-semibold form-control-sm px-4 py-3">Ações</th>
                      </tr>
                    </thead>
                    <tbody id="tbodyUsuariosVinculosOrganogramaModal">
                      <tr>
                        <td colspan="5" class="px-4 py-6 form-subtitle-sm text-center">Carregando vínculos...</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="px-6 py-5 border-t border-border flex justify-end">
              <button
                id="btnFecharRodapeModalUsuariosOrganograma"
                type="button"
                class="rounded-xl border border-border bg-white/60 form-control-sm px-4 hover:bg-white transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  let editandoId = null;
  let cacheVinculos = [];
  let cacheUsuarios = [];

  const tbody = document.getElementById('tbodyUsuariosVinculosOrganogramaModal');
  const selectUsuario = document.getElementById('orgUsuarioVinculoSelect');
  const selectSetor = document.getElementById('orgSetorUsuarioVinculoSelect');
  const selectStatus = document.getElementById('orgUsuarioVinculoStatus');
  const btnSalvar = document.getElementById('btnSalvarUsuarioVinculoOrganogramaModal');
  const selectPrecisaAprovacao = document.getElementById('orgUsuarioPrecisaAprovacaoReservaCarro');

  function setMsg(msg, erro = false) {
    const el = document.getElementById('orgUsuarioVinculoMsg');
    if (!el) return;

    el.textContent = msg || '';
    el.classList.remove('hidden', 'text-destructive', 'text-emerald-700');

    if (!msg) {
      el.classList.add('hidden');
      return;
    }

    el.classList.add(erro ? 'text-destructive' : 'text-emerald-700');
  }

  function limparFormulario() {
    editandoId = null;
    if (selectUsuario) selectUsuario.value = '';
    if (selectSetor) selectSetor.value = '';
    if (selectPrecisaAprovacao) selectPrecisaAprovacao.value = 'sim';
    if (selectStatus) selectStatus.value = '1';
    if (btnSalvar) btnSalvar.textContent = 'Salvar vínculo';
    setMsg('');
  }

  function badgeStatus(status) {
    return Number(status) === 1
      ? '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 bg-emerald-50 text-emerald-700">Ativo</span>'
      : '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 bg-slate-100 text-slate-700">Inativo</span>';
  }

  async function carregarUsuarios() {
    const resp = await fetch(`${APIBASE}/api/usuarios`);
    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      throw new Error(data?.message || data?.error || 'Erro ao carregar usuários.');
    }

    cacheUsuarios = normalizarListaResposta(data);

    if (selectUsuario) {
      selectUsuario.innerHTML = ['<option value="">Selecione...</option>'].concat(
        cacheUsuarios.map(item => `
          <option value="${item.id ?? item.ID}">
            ${escapeHtml(item.nome ?? item.NOME ?? 'Sem nome')}
          </option>
        `)
      ).join('');
    }
  }

  async function carregarSetores() {
    const resp = await fetch(`${APIBASE}/api/organograma-setores`);
    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      throw new Error(data?.message || data?.error || 'Erro ao carregar setores.');
    }

    const setores = normalizarListaResposta(data);

    if (selectSetor) {
      selectSetor.innerHTML = ['<option value="">Selecione...</option>'].concat(
        setores.map(item => `
          <option value="${item.id ?? item.ID}">
            ${escapeHtml(item.nome ?? item.NOME ?? 'Sem nome')}
          </option>
        `)
      ).join('');
    }
  }

  function badgePrecisaAprovacao(value) {
    const v = String(value || '').trim().toLowerCase();
    return v === 'sim'
      ? '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-amber-200 bg-amber-50 text-amber-700">Sim</span>'
      : '<span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 bg-slate-100 text-slate-700">Não</span>';
  }

  function renderTabela() {
    if (!tbody) return;

    if (!cacheVinculos.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="px-4 py-6 form-subtitle-sm text-center">
            Nenhum vínculo cadastrado.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = cacheVinculos.map(item => `
      <tr class="border-t border-border/70">
        <td class="px-4 py-3">${escapeHtml(item.NOME_USUARIO ?? item.nomeusuario ?? '-')}</td>
        <td class="px-4 py-3">${escapeHtml(item.EMAIL_USUARIO ?? item.emailusuario ?? '-')}</td>
        <td class="px-4 py-3">${escapeHtml(item.NOME_SETOR ?? item.nomesetor ?? '-')}</td>
        <td class="px-4 py-3">${badgePrecisaAprovacao(item.PRECISA_APROCAVAO ?? item.precisaaprocavao ?? item.PRECISA_APROVACAO ?? item.precisaaprovacao ?? 'nao')}</td>
        <td class="px-4 py-3">${badgeStatus(item.STATUS ?? item.status)}</td>
        <td class="px-4 py-3 text-right">
          <div class="inline-flex items-center gap-2">
            <button
              type="button"
              class="w-9 h-9 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
              data-editar-id="${escapeHtml(item.ID ?? item.id)}"
              title="Editar"
            >
              <i class="fas fa-pen"></i>
            </button>

            <button
              type="button"
              class="w-9 h-9 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all"
              data-excluir-id="${escapeHtml(item.ID ?? item.id)}"
              title="Excluir"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-editar-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-editar-id');
        const item = cacheVinculos.find(x => String(x.ID ?? x.id) === String(id));
        if (!item) return;

        editandoId = item.ID ?? item.id;
        if (selectUsuario) selectUsuario.value = String(item.ID_USUARIO ?? item.idusuario ?? '');
        if (selectSetor) selectSetor.value = String(item.ID_SETOR_ORGANOGRAMA ?? item.idsetororganograma ?? '');
        if (selectPrecisaAprovacao) {
          selectPrecisaAprovacao.value = String(
            item.PRECISA_APROCAVAO ??
            item.precisaaprocavao ??
            item.PRECISA_APROVACAO ??
            item.precisaaprovacao ??
            'sim'
          ).toLowerCase();
        }
        if (selectStatus) selectStatus.value = String(Number(item.STATUS ?? item.status) ? 1 : 0);
        if (btnSalvar) btnSalvar.textContent = 'Salvar alterações';
        setMsg('Modo de edição ativado.');
      });
    });

    tbody.querySelectorAll('[data-excluir-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-excluir-id');
        if (!confirm('Deseja realmente excluir este vínculo?')) return;

        try {
          setMsg('');

          const resp = await fetch(`${APIBASE}/api/organograma-usuarios-vinculos/${id}`, {
            method: 'DELETE'
          });

          const data = await resp.json().catch(() => null);

          if (!resp.ok) {
            throw new Error(data?.message || data?.error || 'Erro ao excluir vínculo.');
          }

          setMsg(data?.message || 'Vínculo excluído com sucesso.');
          await carregarLista();
        } catch (err) {
          setMsg(err?.message || 'Erro ao excluir vínculo.', true);
        }
      });
    });
  }

  async function carregarLista() {
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="px-4 py-6 form-subtitle-sm text-center">
            Carregando vínculos...
          </td>
        </tr>
      `;
    }

    const resp = await fetch(`${APIBASE}/api/organograma-usuarios-vinculos`);
    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      throw new Error(data?.message || data?.error || 'Erro ao carregar vínculos.');
    }

    cacheVinculos = normalizarListaResposta(data);
    renderTabela();
  }

  async function salvar() {
    try {
      setMsg('');

      const idusuario = Number(selectUsuario?.value || 0);
      const idsetororganograma = Number(selectSetor?.value || 0);
      const precisaaprocavao = String(selectPrecisaAprovacao?.value || 'sim').trim().toLowerCase();
      const status = Number(selectStatus?.value ?? 1) ? 1 : 0;

      if (!idusuario) {
        return setMsg('Selecione o usuário.', true);
      }

      if (!idsetororganograma) {
        return setMsg('Selecione o setor do organograma.', true);
      }

      const payload = {
        idusuario,
        idsetororganograma,
        precisaaprocavao,
        status
      };

      const resp = await fetch(
        editandoId
          ? `${APIBASE}/api/organograma-usuarios-vinculos/${editandoId}`
          : `${APIBASE}/api/organograma-usuarios-vinculos`,
        {
          method: editandoId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        throw new Error(data?.message || data?.error || 'Erro ao salvar vínculo.');
      }

      setMsg(editandoId ? 'Vínculo atualizado com sucesso.' : 'Vínculo cadastrado com sucesso.');
      limparFormulario();
      await carregarLista();
    } catch (err) {
      setMsg(err?.message || 'Erro ao salvar vínculo.', true);
    }
  }

  function fecharModal() {
    removerModalUsuariosOrganograma();
  }

  overlay.addEventListener('click', fecharModal);
  document.getElementById('btnFecharModalUsuariosOrganograma')?.addEventListener('click', fecharModal);
  document.getElementById('btnFecharRodapeModalUsuariosOrganograma')?.addEventListener('click', fecharModal);
  document.getElementById('btnLimparUsuarioVinculoOrganogramaModal')?.addEventListener('click', limparFormulario);
  document.getElementById('btnSalvarUsuarioVinculoOrganogramaModal')?.addEventListener('click', salvar);

  await carregarUsuarios();
  await carregarSetores();
  await carregarLista();
}

/* =========================
   Init
========================= */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await carregarUnidadesTrabalhoOrganograma();
    await carregarSetoresOrganograma();
    await carregarVinculosOrganograma();

    document.getElementById('orgFiltroUnidade')?.addEventListener('change', async e => {
      await carregarVinculosOrganograma(e.target.value);
    });

    document.getElementById('btnSalvarVinculoOrganograma')?.addEventListener('click', salvarVinculoOrganograma);

    document.getElementById('btnLimparVinculoOrganograma')?.addEventListener('click', () => {
      limparFormularioOrganograma();
      mostrarMsgOrganograma('');
    });

    document.getElementById('btnAtualizarOrganograma')?.addEventListener('click', async () => {
      const idLocal = document.getElementById('orgFiltroUnidade')?.value;
      await carregarVinculosOrganograma(idLocal);
    });

    document.getElementById('btnGerenciarSetoresOrganogramaPai')?.addEventListener('click', async () => {
      try {
        await abrirModalSetoresOrganograma();
      } catch (err) {
        alert(`Erro ao abrir gerenciamento de setores: ${err?.message || err}`);
      }
    });

    document.getElementById('btnGerenciarUsuariosOrganograma')?.addEventListener('click', async () => {
      try {
        await abrirModalUsuariosOrganograma();
      } catch (err) {
        alert(`Erro ao abrir vínculo de usuários: ${err?.message || err}`);
      }
    });

    document.getElementById('btnGerenciarSetoresOrganogramaFilho')?.addEventListener('click', async () => {
      try {
        await abrirModalSetoresOrganograma();
      } catch (err) {
        alert(`Erro ao abrir gerenciamento de setores: ${err?.message || err}`);
      }
    });
  } catch (err) {
    console.error('Erro ao inicializar organograma:', err);
    mostrarMsgOrganograma(err?.message || 'Erro ao inicializar organograma.', true);
  }
});


// importar usuarios

let arquivoImportacaoUsuarios = null;
let previewImportacaoUsuarios = [];

function getRefs() {
  return {
    modalPreviewImportacao: document.getElementById('modalPreviewImportacaoUsuarios'),
    previewImportacaoResumo: document.getElementById('previewImportacaoResumo'),
    previewImportacaoTabelaWrapper: document.getElementById('previewImportacaoTabelaWrapper'),
    resultadoImportacaoWrapper: document.getElementById('resultadoImportacaoWrapper'),
    resultadoImportacaoLista: document.getElementById('resultadoImportacaoLista'),
    btnConfirmarImportacaoUsuarios: document.getElementById('btnConfirmarImportacaoUsuarios'),
    inputImportarTemplateUsuarios: document.getElementById('inputImportarTemplateUsuarios')
  };
}

function abrirModalPreviewImportacao() {
  const { modalPreviewImportacao } = getRefs();

  if (!modalPreviewImportacao) {
    console.error('[IMPORTAÇÃO USUÁRIOS] Modal não encontrado.');
    alert('Modal de pré-visualização não encontrado.');
    return;
  }

  modalPreviewImportacao.classList.remove('hidden');
  modalPreviewImportacao.classList.add('flex');
  document.body.classList.add('overflow-hidden');
}

function fecharModalPreviewImportacao() {
  const { modalPreviewImportacao } = getRefs();
  modalPreviewImportacao?.classList.add('hidden');
  modalPreviewImportacao?.classList.remove('flex');
  document.body.classList.remove('overflow-hidden');
}

function escaparHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function limparEstadoImportacaoUsuarios() {
  const {
    inputImportarTemplateUsuarios,
    previewImportacaoResumo,
    previewImportacaoTabelaWrapper,
    resultadoImportacaoWrapper,
    resultadoImportacaoLista
  } = getRefs();

  arquivoImportacaoUsuarios = null;
  previewImportacaoUsuarios = [];

  if (inputImportarTemplateUsuarios) inputImportarTemplateUsuarios.value = '';
  if (previewImportacaoResumo) previewImportacaoResumo.textContent = '';
  if (previewImportacaoTabelaWrapper) previewImportacaoTabelaWrapper.innerHTML = '';
  if (resultadoImportacaoLista) resultadoImportacaoLista.innerHTML = '';
  resultadoImportacaoWrapper?.classList.add('hidden');
}

function somenteNumerosImportar(valor) {
  return String(valor ?? '').replace(/\D+/g, '');
}

function renderizarPreviewImportacao(dados) {
  const {
    previewImportacaoResumo,
    previewImportacaoTabelaWrapper
  } = getRefs();

  const linhas = Array.isArray(dados) ? dados : [];

  if (!previewImportacaoResumo || !previewImportacaoTabelaWrapper) {
    console.error('[IMPORTAÇÃO USUÁRIOS] Elementos do modal não encontrados.');
    alert('Estrutura do modal de importação não foi encontrada na página.');
    return;
  }

  previewImportacaoResumo.textContent =
    `${linhas.length} registro(s) encontrado(s) na planilha. Confira antes de confirmar.`;

  if (!linhas.length) {
    previewImportacaoTabelaWrapper.innerHTML = `
      <div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
        Nenhum dado válido foi encontrado na planilha.
      </div>
    `;
    return;
  }

  const ordemPreferencial = [
    'NOME',
    'EMAIL',
    'TELEFONE',
    'CPF',
    'DATA NASCIMENTO',
    'DATA ADMISSÃO',
    'DATA ADMISSAO',
    'FUNÇÃO',
    'FUNCAO',
    'SETOR',
    'PERFIL',
    'STATUS',
    'CENTRO CUSTO',
    'UNIDADE TRABALHO'
  ];

  const colunasEncontradas = Array.from(
    new Set(linhas.flatMap(linha => Object.keys(linha || {})))
  );

  const colunasOrdenadas = [
    ...ordemPreferencial.filter(col => colunasEncontradas.includes(col)),
    ...colunasEncontradas.filter(col => !ordemPreferencial.includes(col))
  ];

  const formatarTextoSeguro = (valor) => {
    if (valor === null || valor === undefined) return '-';

    const texto = String(valor).trim();
    return texto ? escaparHtml(texto) : '-';
  };

  const formatarValorColuna = (coluna, valor, linha) => {
    const texto = String(valor ?? '').trim();

    if (coluna === 'EMAIL' || coluna === 'E-MAIL') {
      if (!texto) {
        const cpf = String(linha['CPF'] ?? '').replace(/\D+/g, '');
        if (cpf) {
          return escaparHtml(`${cpf}@temp.local (automático)`);
        }
        return 'Será gerado automaticamente';
      }
    }

    if ((coluna === 'TELEFONE' || coluna === 'CELULAR' || coluna === 'TELEFONE 1') && !texto) {
      return '-';
    }

    return formatarTextoSeguro(valor);
  };

  previewImportacaoTabelaWrapper.innerHTML = `
    <div class="rounded-2xl border border-border bg-white40 overflow-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-muted/40 sticky top-0 z-10">
          <tr>
            <th class="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">#</th>
            ${colunasOrdenadas.map(col => `
              <th class="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase whitespace-nowrap">
                ${escaparHtml(col)}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${linhas.map((linha, index) => `
            <tr class="border-t border-border/70 hover:bg-white60">
              <td class="px-3 py-2 text-sm text-muted-foreground whitespace-nowrap">
                ${index + 1}
              </td>
              ${colunasOrdenadas.map(col => {
                const valorFormatado = formatarValorColuna(col, linha[col], linha);
                return `
                  <td
                    class="px-3 py-2 text-sm text-foreground max-w-[220px] whitespace-nowrap overflow-hidden text-ellipsis"
                    title="${valorFormatado}"
                  >
                    ${valorFormatado}
                  </td>
                `;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderizarResultadoImportacao(retorno) {
  const itens = [];

  if (Array.isArray(retorno?.sucessos)) {
    retorno.sucessos.forEach(item => {
      itens.push({
        tipo: 'sucesso',
        linha: item?.linha,
        nome: item?.nome || '',
        cpf: item?.cpf || '',
        mensagem: item?.message || 'Usuário importado com sucesso.'
      });
    });
  }

  if (Array.isArray(retorno?.ignoradosDetalhes)) {
    retorno.ignoradosDetalhes.forEach(item => {
      itens.push({
        tipo: 'ignorado',
        linha: item?.linha,
        nome: item?.nome || '',
        cpf: item?.cpf || '',
        mensagem: item?.message || 'Registro ignorado.'
      });
    });
  }

  if (Array.isArray(retorno?.erros)) {
    retorno.erros.forEach(item => {
      itens.push({
        tipo: 'erro',
        linha: item?.linha,
        nome: item?.nome || '',
        cpf: item?.cpf || '',
        mensagem: item?.erro || item?.message || 'Erro ao processar registro.'
      });
    });
  }

  itens.sort((a, b) => (a.linha || 0) - (b.linha || 0));

  resultadoImportacaoLista.innerHTML = itens.map(item => {
    const mapa = {
      sucesso: {
        card: 'border-emerald-200 bg-emerald-50',
        titulo: 'text-emerald-800',
        texto: 'text-emerald-700',
        badge: 'bg-emerald-100 text-emerald-700',
        rotulo: 'Importado'
      },
      ignorado: {
        card: 'border-amber-200 bg-amber-50',
        titulo: 'text-amber-800',
        texto: 'text-amber-700',
        badge: 'bg-amber-100 text-amber-700',
        rotulo: 'Ignorado'
      },
      erro: {
        card: 'border-red-200 bg-red-50',
        titulo: 'text-red-800',
        texto: 'text-red-700',
        badge: 'bg-red-100 text-red-700',
        rotulo: 'Erro'
      }
    };

    const cfg = mapa[item.tipo] || mapa.erro;

    return `
      <div class="rounded-xl border px-4 py-3 ${cfg.card}">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-sm font-semibold ${cfg.titulo}">
              Linha ${item.linha || '-'}${item.nome ? ` - ${escaparHtml(item.nome)}` : ''}
            </div>
            <div class="text-xs mt-1 ${cfg.texto}">
              ${item.cpf ? `CPF: ${escaparHtml(item.cpf)}` : ''}
            </div>
            <div class="mt-1 text-sm ${cfg.texto}">
              ${escaparHtml(item.mensagem)}
            </div>
          </div>

          <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}">
            ${cfg.rotulo}
          </span>
        </div>
      </div>
    `;
  }).join('');

  resultadoImportacaoWrapper.classList.remove('hidden');
}

async function lerArquivoExcelUsuarios(file) {
  if (!window.XLSX) {
    throw new Error('A biblioteca XLSX não foi carregada.');
  }

  if (!file) {
    throw new Error('Nenhum arquivo foi informado.');
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  if (!workbook?.SheetNames?.length) {
    throw new Error('A planilha não possui abas válidas.');
  }

  const primeiraAba = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[primeiraAba];

  if (!worksheet) {
    throw new Error('Não foi possível localizar a primeira aba da planilha.');
  }

  return XLSX.utils.sheet_to_json(worksheet, {
    defval: '',
    raw: false
  });
}

document.addEventListener('click', async (e) => {
  const btnImportar = e.target.closest('#btnImportarTemplateUsuarios');
  if (btnImportar) {
    e.preventDefault();

    const { inputImportarTemplateUsuarios } = getRefs();

    if (!inputImportarTemplateUsuarios) {
      console.error('[IMPORTAÇÃO USUÁRIOS] inputImportarTemplateUsuarios não encontrado.');
      alert('Campo de seleção de arquivo não encontrado.');
      return;
    }

    inputImportarTemplateUsuarios.click();
    return;
  }

  const btnFechar = e.target.closest('#btnFecharModalPreviewImportacao, #btnCancelarPreviewImportacao');
  if (btnFechar) {
    fecharModalPreviewImportacao();
    return;
  }

  const { modalPreviewImportacao } = getRefs();

  if (e.target === modalPreviewImportacao) {
    fecharModalPreviewImportacao();
    return;
  }

  const btnConfirmarClick = e.target.closest('#btnConfirmarImportacaoUsuarios');
  if (btnConfirmarClick) {
    if (!arquivoImportacaoUsuarios) {
      alert('Nenhum arquivo selecionado para importação.');
      return;
    }

    try {
      btnConfirmarClick.disabled = true;
      btnConfirmarClick.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Importando...';

      const formData = new FormData();
      formData.append('arquivo', arquivoImportacaoUsuarios);

      const apiBase = sessionStorage.getItem('api_base') || '';
      if (!apiBase) {
        throw new Error('API base não encontrada na sessão.');
      }

      const resp = await fetch(`${apiBase}/api/gestao-usuarios-importar`, {
        method: 'POST',
        body: formData
      });

      const json = await resp.json().catch(() => null);

      if (!resp.ok || !json?.success) {
        throw new Error(json?.message || 'Erro ao importar planilha.');
      }

      const {
        previewImportacaoResumo,
        resultadoImportacaoWrapper,
        resultadoImportacaoLista,
        inputImportarTemplateUsuarios
      } = getRefs();

      if (previewImportacaoResumo) {
        previewImportacaoResumo.textContent =
          `Importação concluída. Inseridos: ${json.inseridos ?? 0} | Ignorados: ${json.ignorados ?? 0} | Erros: ${json.erros?.length || 0}`;
      }

      renderizarResultadoImportacao(json);
      await carregarGestaoUsuarios();

      if (inputImportarTemplateUsuarios) inputImportarTemplateUsuarios.value = '';
      arquivoImportacaoUsuarios = null;
    } catch (err) {
      const { resultadoImportacaoWrapper, resultadoImportacaoLista } = getRefs();

      if (resultadoImportacaoWrapper && resultadoImportacaoLista) {
        resultadoImportacaoWrapper.classList.remove('hidden');
        resultadoImportacaoLista.innerHTML = `
          <div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 whitespace-pre-line">
            ${escaparHtml(err?.message || 'Erro ao importar usuários.')}
          </div>
        `;
      } else {
        alert(err?.message || 'Erro ao importar usuários.');
      }
    } finally {
      const { btnConfirmarImportacaoUsuarios, inputImportarTemplateUsuarios } = getRefs();

      if (btnConfirmarImportacaoUsuarios) {
        btnConfirmarImportacaoUsuarios.disabled = false;
        btnConfirmarImportacaoUsuarios.innerHTML = 'Confirmar importação';
      }

      if (inputImportarTemplateUsuarios) {
        inputImportarTemplateUsuarios.value = '';
      }
    }
  }
});

document.addEventListener('keydown', (e) => {
  const { modalPreviewImportacao } = getRefs();

  if (e.key === 'Escape' && modalPreviewImportacao && !modalPreviewImportacao.classList.contains('hidden')) {
    fecharModalPreviewImportacao();
  }
});

document.addEventListener('change', async (e) => {
  const input = e.target.closest('#inputImportarTemplateUsuarios');
  if (!input) return;

  const file = input.files?.[0];
  if (!file) return;

  try {
    arquivoImportacaoUsuarios = file;
    previewImportacaoUsuarios = [];

    const { resultadoImportacaoWrapper, resultadoImportacaoLista } = getRefs();
    resultadoImportacaoWrapper?.classList.add('hidden');
    if (resultadoImportacaoLista) resultadoImportacaoLista.innerHTML = '';

    const dados = await lerArquivoExcelUsuarios(file);
    previewImportacaoUsuarios = dados;

    renderizarPreviewImportacao(dados);
    abrirModalPreviewImportacao();
  } catch (err) {
    console.error('[IMPORTAÇÃO USUÁRIOS] Erro ao ler planilha:', err);
    alert(err?.message || 'Erro ao ler a planilha.');
    input.value = '';
    arquivoImportacaoUsuarios = null;
  }
});


// Monitor de Ping 

function removerModalPingMonitor() {
  document.getElementById('pingMonitorOverlay')?.remove();
  document.getElementById('pingMonitorModal')?.remove();
}

function abrirModalPingMonitor(modo, monitor = null) {
  removerModalPingMonitor();

  const isEdit = modo === 'edit';

  const overlay = document.createElement('div');
  overlay.id = 'pingMonitorOverlay';
  overlay.className = 'fixed inset-0 bg-black40 backdrop-blur-sm z-90';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'pingMonitorModal';
  modal.className = 'fixed inset-0 z-100 flex items-start justify-center p-4 md:p-8 overflow-auto';
  modal.innerHTML = `
    <div class="w-full max-w-4xl mx-auto">
      <div class="glass rounded-2xl shadow-2xl border border-border overflow-hidden">
        <div class="px-6 py-5 border-b border-border flex items-start justify-between gap-4">
          <div>
            <h3 class="form-title-sm font-semibold text-foreground">${isEdit ? 'Editar monitor' : 'Novo monitor'}</h3>
            <p class="form-subtitle-sm">Cadastre IP, equipamento, local e contatos de alerta.</p>
          </div>
          <button id="btnFecharPingMonitor" type="button" class="w-10 h-10 rounded-xl bg-white60 border border-border hover:bg-white transition-all flex items-center justify-center">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <form id="formPingMonitor" class="p-6 space-y-5">
          <input type="hidden" id="pingId" value="${monitor?.ID ?? ''}">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="form-label-sm">IP</label>
              <input id="pingIp" class="w-full rounded-xl border border-border bg-white70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary30" value="${escapeHtml(monitor?.IP ?? '')}" required>
            </div>
            <div class="space-y-1">
              <label class="form-label-sm">Equipamento</label>
              <input id="pingEquipamento" class="w-full rounded-xl border border-border bg-white70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary30" value="${escapeHtml(monitor?.EQUIPAMENTO ?? '')}" required>
            </div>
            <div class="space-y-1">
              <label class="form-label-sm">Local</label>
              <input id="pingLocalizacao" class="w-full rounded-xl border border-border bg-white70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary30" value="${escapeHtml(monitor?.LOCALIZACAO ?? '')}" required>
            </div>
            <div class="space-y-1">
              <label class="form-label-sm">Intervalo em minutos</label>
              <input id="pingIntervalo" type="number" min="1" class="w-full rounded-xl border border-border bg-white70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary30" value="${escapeHtml(String(monitor?.INTERVALO_MINUTOS ?? 5))}" required>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label class="flex items-center gap-3 rounded-2xl border border-border bg-white60 p-4">
              <input id="pingAtivo" type="checkbox" ${String(monitor?.ATIVO ?? '1') === '1' ? 'checked' : ''} class="w-4 h-4">
              <div>
                <div class="font-medium text-sm">Ativo</div>
                <div class="text-xs text-muted-foreground">Executa a verificação automática.</div>
              </div>
            </label>

            <label class="flex items-center gap-3 rounded-2xl border border-border bg-white60 p-4">
              <input id="pingWhatsApp" type="checkbox" ${String(monitor?.ENVIAR_WHATSAPP ?? '1') === '1' ? 'checked' : ''} class="w-4 h-4">
              <div>
                <div class="font-medium text-sm">Enviar WhatsApp</div>
                <div class="text-xs text-muted-foreground">Notifica na mudança de status.</div>
              </div>
            </label>
          </div>

          <div class="space-y-2">
            <label class="form-label-sm">Observação</label>
            <textarea id="pingObs" rows="3" class="w-full rounded-xl border border-border bg-white70 px-3 py-2 outline-none focus:ring-2 focus:ring-primary30">${escapeHtml(monitor?.OBSERVACAO ?? '')}</textarea>
          </div>

          <div class="rounded-2xl border border-border bg-white60 p-4 space-y-3">
            <div class="flex items-center justify-between gap-3">
              <h4 class="font-semibold">Contatos de alerta</h4>
              <div class="flex items-center gap-2">
                <button id="btnAddContatoUsuario" type="button" class="px-3 py-2 rounded-xl border border-border bg-white70 text-sm hover:bg-white">
                  + Usuário
                </button>
                <button id="btnAddContatoManual" type="button" class="px-3 py-2 rounded-xl border border-border bg-white70 text-sm hover:bg-white">
                  + Manual
                </button>
              </div>
            </div>

            <div id="pingContatosBox" class="space-y-3"></div>
          </div>

          <div id="pingMonitorErro" class="hidden text-sm text-destructive whitespace-pre-line"></div>

          <div class="flex flex-col sm:flex-row gap-3">
            <button id="btnSalvarPingMonitor" type="submit" class="sm:flex-1 rounded-xl bg-primary text-white px-4 py-3 font-medium hover:opacity-90">
              Salvar
            </button>
            <button id="btnCancelarPingMonitor" type="button" class="sm:flex-1 rounded-xl border border-border bg-white60 px-4 py-3 font-medium hover:bg-white70">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const fechar = () => removerModalPingMonitor();
  overlay.addEventListener('click', fechar);
  modal.querySelector('#btnFecharPingMonitor')?.addEventListener('click', fechar);
  modal.querySelector('#btnCancelarPingMonitor')?.addEventListener('click', fechar);
}

function adicionarLinhaContatoManual(container, dados = {}) {
  const row = document.createElement('div');
  row.className = 'grid grid-cols-1 md:grid-cols-12 gap-2 rounded-xl border border-border bg-white70 p-3';

  row.innerHTML = `
    <div class="md:col-span-4">
      <label class="text-xs font-semibold text-muted-foreground">Tipo</label>
      <select class="ping-tipo w-full rounded-xl border border-border bg-white px-3 py-2">
        <option value="MANUAL" ${dados.tipoContato === 'MANUAL' ? 'selected' : ''}>Manual</option>
        <option value="USUARIO" ${dados.tipoContato === 'USUARIO' ? 'selected' : ''}>Usuário</option>
      </select>
    </div>
    <div class="md:col-span-3">
      <label class="text-xs font-semibold text-muted-foreground">Nome</label>
      <input class="ping-nome w-full rounded-xl border border-border bg-white px-3 py-2" value="${escapeHtml(dados.nomeContato ?? '')}">
    </div>
    <div class="md:col-span-3">
      <label class="text-xs font-semibold text-muted-foreground">Telefone</label>
      <input class="ping-telefone w-full rounded-xl border border-border bg-white px-3 py-2" value="${escapeHtml(dados.telefone ?? '')}">
    </div>
    <div class="md:col-span-2 flex items-end">
      <button type="button" class="btn-remover-contato w-full rounded-xl border border-border bg-white60 px-3 py-2 hover:bg-white90">
        Remover
      </button>
    </div>
  `;

  container.appendChild(row);

  row.querySelector('.btn-remover-contato')?.addEventListener('click', () => row.remove());
}

async function adicionarLinhaContatoUsuario(container, contato = null) {
  const base = sessionStorage.getItem("apibase");
  const resp = await fetch(`${base}/api/usuarios`);
  const json = await resp.json().catch(() => null);

  if (!resp.ok) {
    throw new Error(json?.message || "Erro ao carregar usuários.");
  }

  const usuarios = Array.isArray(json?.items) ? json.items : [];
  const usersValidos = usuarios.filter(u => String(u.TELEFONE || "").trim());

  const row = document.createElement("div");
  row.className = "grid grid-cols-1 md:grid-cols-12 gap-2 rounded-xl border border-border bg-white/70 p-3";

  row.innerHTML = `
    <div class="md:col-span-5">
      <label class="text-xs font-semibold text-muted-foreground">Usuário</label>
      <select class="ping-usuario w-full rounded-xl border border-border bg-white px-3 py-2">
        <option value="">Selecione...</option>
        ${usersValidos.map(u => `
          <option
            value="${u.id}"
            data-nome="${escapeHtml(u.nome || "")}"
            data-telefone="${escapeHtml(u.TELEFONE || "")}"
          >
            ${escapeHtml(u.nome || "")} - ${escapeHtml(u.TELEFONE || "")}
          </option>
        `).join("")}
      </select>
    </div>

    <div class="md:col-span-3">
      <label class="text-xs font-semibold text-muted-foreground">Nome</label>
      <input class="ping-nome w-full rounded-xl border border-border bg-white px-3 py-2" readonly />
    </div>

    <div class="md:col-span-2">
      <label class="text-xs font-semibold text-muted-foreground">Telefone</label>
      <input class="ping-telefone w-full rounded-xl border border-border bg-white px-3 py-2" readonly />
    </div>

    <div class="md:col-span-2 flex items-end">
      <button type="button" class="btn-remover-contato w-full rounded-xl border border-border bg-white/60 px-3 py-2 hover:bg-white/90">
        Remover
      </button>
    </div>
  `;

  container.appendChild(row);

  const select = row.querySelector(".ping-usuario");
  const inputNome = row.querySelector(".ping-nome");
  const inputTel = row.querySelector(".ping-telefone");

  const atualizarCampos = () => {
    const opt = select.selectedOptions[0];
    inputNome.value = opt?.dataset?.nome || "";
    inputTel.value = opt?.dataset?.telefone || "";
  };

  select.addEventListener("change", atualizarCampos);

  if (contato?.USUARIO_ID) {
    select.value = String(contato.USUARIO_ID);
    atualizarCampos();
  }

  row.querySelector(".btn-remover-contato")?.addEventListener("click", () => row.remove());

  return row;
}

function coletarContatosDoModal() {
  const linhas = Array.from(document.querySelectorAll('#pingContatosBox > div'));
  return linhas.map(row => {
    const tipoContato = row.querySelector('.ping-tipo')?.value || 'MANUAL';
    const usuarioId = row.querySelector('.ping-usuario')?.value || null;
    const nomeContato = row.querySelector('.ping-nome')?.value || '';
    const telefone = row.querySelector('.ping-telefone')?.value || '';

    return {
      tipoContato,
      usuarioId: usuarioId ? Number(usuarioId) : null,
      nomeContato,
      telefone
    };
  }).filter(x => String(x.telefone || '').trim());
}

document.addEventListener('submit', async e => {
  const form = e.target.closest('#formPingMonitor');
  if (!form) return;

  e.preventDefault();

  const btn = document.getElementById('btnSalvarPingMonitor');
  const erro = document.getElementById('pingMonitorErro');

  const setErro = msg => {
    if (!erro) return;
    if (!msg) {
      erro.classList.add('hidden');
      erro.textContent = '';
      return;
    }
    erro.textContent = msg;
    erro.classList.remove('hidden');
  };

  try {
    btn.disabled = true;
    btn.textContent = 'Salvando...';
    setErro('');

    const payload = {
      ip: document.getElementById('pingIp')?.value?.trim(),
      equipamento: document.getElementById('pingEquipamento')?.value?.trim(),
      localizacao: document.getElementById('pingLocalizacao')?.value?.trim(),
      intervaloMinutos: Number(document.getElementById('pingIntervalo')?.value || 5),
      ativo: document.getElementById('pingAtivo')?.checked ? '1' : '0',
      enviarWhatsApp: document.getElementById('pingWhatsApp')?.checked ? '1' : '0',
      observacao: document.getElementById('pingObs')?.value?.trim(),
      usuarioCadastro: sessionStorage.getItem('usuario') || 'SISTEMA'
    };

    const id = document.getElementById('pingId')?.value?.trim();
    const base = sessionStorage.getItem('api_base');

    const resp = await fetch(`${base}/api/ping-monitor${id ? `/${id}` : ''}`, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await resp.json().catch(() => null);

    if (!resp.ok) {
      throw new Error(json?.message || 'Erro ao salvar monitor.');
    }

    const monitorId = id || json.id;

    const contatos = coletarContatosDoModal();
    if (contatos.length) {
      const respContatos = await fetch(`${base}/api/ping-monitor/${monitorId}/contatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contatos })
      });

      const jsonContatos = await respContatos.json().catch(() => null);
      if (!respContatos.ok) {
        throw new Error(jsonContatos?.message || 'Erro ao salvar contatos.');
      }
    }

    removerModalPingMonitor();
    await carregarPingMonitores();
    alert(json.message || 'Monitor salvo com sucesso.');
  } catch (err) {
    setErro(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Salvar';
  }
});

async function carregarPingMonitores() {
  const tbody = document.getElementById('tbodyPingMonitor');
  const msg = document.getElementById('pingMonitorMsg');
  const base = getApiBasePing();

  if (!tbody) return;

  if (msg) {
    msg.classList.add('hidden');
    msg.textContent = '';
  }

  try {
    if (!base) {
      throw new Error('API base não configurada na sessão.');
    }

    tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-6 form-subtitle-sm text-center">Carregando...</td></tr>`;

    const resp = await fetch(`${base}/api/ping-monitor`);
    const json = await resp.json().catch(() => null);

    if (!resp.ok) {
      throw new Error(json?.message || `Erro ao buscar monitores. HTTP ${resp.status}`);
    }

    const items = Array.isArray(json?.items) ? json.items : [];

    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-6 form-subtitle-sm text-center">Nenhum monitor cadastrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map(item => `
      <tr>
        <td class="px-4 py-3">${escapeHtml(item.EQUIPAMENTO)}</td>
        <td class="px-4 py-3 font-mono">${escapeHtml(item.IP)}</td>
        <td class="px-4 py-3">${escapeHtml(item.LOCALIZACAO)}</td>
        <td class="px-4 py-3">${escapeHtml(String(item.INTERVALO_MINUTOS || 0))} min</td>
        <td class="px-4 py-3">
          <span class="inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
            item.STATUS_ATUAL === "UP"
              ? "bg-success/15 text-success border border-success/20"
              : item.STATUS_ATUAL === "DOWN"
              ? "bg-destructive/15 text-destructive border border-destructive/20"
              : "bg-info/15 text-info border border-info/20"
          }">
            ${escapeHtml(item.STATUS_ATUAL || "UNKNOWN")}
          </span>
        </td>
        <td class="px-4 py-3 text-right">
          <button class="btnPingEditar px-3 py-2 rounded-xl border border-border bg-white/60 hover:bg-white/90 mr-2" data-id="${item.ID}">
            Editar
          </button>
          <button class="btnPingExcluir px-3 py-2 rounded-xl border border-border bg-white/60 hover:bg-white/90" data-id="${item.ID}">
            Excluir
          </button>
        </td>
      </tr>
    `).join("");
  } catch (err) {
    console.error('Erro ao carregar monitores:', err);

    if (msg) {
      msg.textContent = err.message;
      msg.classList.remove('hidden');
    }

    tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-6 text-center text-destructive">Falha ao carregar monitores.</td></tr>`;
  }
}

document.addEventListener('click', async e => {
  const btnNovo = e.target.closest('#btnNovoPingMonitor');
  if (!btnNovo) return;

  abrirModalPingMonitor('new', null);

  const box = document.getElementById('pingContatosBox');
  document.getElementById('btnAddContatoManual')?.addEventListener('click', () => adicionarLinhaContatoManual(box));
  document.getElementById('btnAddContatoUsuario')?.addEventListener('click', () => adicionarLinhaContatoUsuario(box));

  adicionarLinhaContatoManual(box, { tipoContato: 'MANUAL' });
});

document.addEventListener("click", async (e) => {
  const btnAtualizar = e.target.closest("#btnAtualizarPingMonitor");
  if (btnAtualizar) {
    await carregarPingMonitores();
  }
});

document.addEventListener('click', async e => {
  const btnVerificar = e.target.closest('.btnPingVerificar');
  const btnEditar = e.target.closest('.btnPingEditar');
  const btnExcluir = e.target.closest('.btnPingExcluir');

  if (btnVerificar) {
    const id = Number(btnVerificar.dataset.id);
    const base = sessionStorage.getItem('api_base');
    const resp = await fetch(`${base}/api/ping-monitor/verificar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idMonitor: id })
    });
    const json = await resp.json();
    alert(json.message || `Status: ${json.statusNovo}`);
    await carregarPingMonitores();
    return;
  }

  if (btnEditar) {
    const id = Number(btnEditar.dataset.id);
    const base = sessionStorage.getItem("api_base");

    const resp = await fetch(`${base}/api/ping-monitor`);
    const json = await resp.json().catch(() => null);

    if (!resp.ok) {
      alert(json?.message || "Erro ao carregar monitor.");
      return;
    }

    const monitor = (Array.isArray(json?.items) ? json.items : []).find(x => Number(x.ID) === id);
    if (!monitor) {
      alert("Monitor não encontrado.");
      return;
    }

    abrirModalPingMonitor("edit", monitor);

    const box = document.getElementById("pingContatosBox");
    if (box) box.innerHTML = "";

    const contatosResp = await fetch(`${base}/api/ping-monitor/${id}/contatos`);
    const contatosJson = await contatosResp.json().catch(() => null);

    if (!contatosResp.ok) {
      alert(contatosJson?.message || "Erro ao carregar contatos do monitor.");
      return;
    }

    const contatos = Array.isArray(contatosJson?.items) ? contatosJson.items : [];

    if (!contatos.length) {
      adicionarLinhaContatoManual(box, { tipoContato: "MANUAL" });
    } else {
      for (const c of contatos) {
        if (String(c.TIPO_CONTATO).toUpperCase() === "USUARIO") {
          await adicionarLinhaContatoUsuario(box, c);
        } else {
          adicionarLinhaContatoManual(box, {
            tipoContato: c.TIPO_CONTATO || "MANUAL",
            nomeContato: c.NOME_CONTATO || "",
            telefone: c.TELEFONE || ""
          });
        }
      }
    }

    document.getElementById("btnAddContatoManual")?.addEventListener("click", () => {
      adicionarLinhaContatoManual(box, { tipoContato: "MANUAL" });
    });

    document.getElementById("btnAddContatoUsuario")?.addEventListener("click", async () => {
      await adicionarLinhaContatoUsuario(box);
    });

    return;
  }


  if (btnExcluir) {
    const id = Number(btnExcluir.dataset.id);
    if (!confirm('Deseja excluir este monitor?')) return;

    const base = sessionStorage.getItem('api_base');
    const resp = await fetch(`${base}/api/ping-monitor/${id}`, { method: 'DELETE' });
    const json = await resp.json().catch(() => null);

    if (!resp.ok) {
      alert(json?.message || 'Erro ao excluir monitor.');
      return;
    }

    alert(json.message || 'Monitor excluído.');
    await carregarPingMonitores();
  }
});

