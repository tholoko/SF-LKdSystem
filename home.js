
let loginMsgTimer = null;
let fpToken = null;
let fpEmail = null;

function showLoginMessage(text, type = 'error', ms = 5000) {
  const messageEl = document.getElementById('loginMessage');
  if (!messageEl) return;

  if (loginMsgTimer) clearTimeout(loginMsgTimer);

  messageEl.textContent = text || '';
  messageEl.className = `login-message ${type}`;

  loginMsgTimer = setTimeout(() => {
    messageEl.classList.add('hide');
    setTimeout(() => {
      messageEl.className = 'login-message';
      messageEl.textContent = '';
    }, 300);
  }, ms);
}

function getApiBaseFromEnv() {
  const env = document.getElementById('environmentSelect')?.value;
  if (env === 'producao') return 'https://sf-link.up.railway.app';
  if (env === 'homologacao') return 'https://sf-link-copy.up.railway.app';
  return '';
}

function atualizarBadgeEnv() {
  const select = document.getElementById('environmentSelect');
  const badge = document.getElementById('badgeEnv');
  const badgeText = document.getElementById('badgeEnvText');

  const isProd = select.value === 'producao';
  badgeText.textContent = isProd ? 'Produção' : 'Homologação';
  badge.className = `badge-env ${select.value}`;
}

function parseBirthDateParts(value) {
  if (!value) return null;

  if (typeof value === 'string') {
    const s = value.trim();

    const mysql = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (mysql) {
      return { mes: Number(mysql[2]), dia: Number(mysql[3]) };
    }

    const br = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br) {
      return { mes: Number(br[2]), dia: Number(br[1]) };
    }
  }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  return {
    mes: d.getMonth() + 1,
    dia: d.getDate()
  };
}

function isBirthdayToday(dataNascimento) {
  const parts = parseBirthDateParts(dataNascimento);
  if (!parts) return false;

  const hoje = new Date();
  const dia = hoje.getDate();
  const mes = hoje.getMonth() + 1;

  return parts.dia === dia && parts.mes === mes;
}

function normalizarFotoUsuario(foto, apiBase) {
  if (!foto) return 'imagens/sem-foto.png';

  const valor = String(foto).trim();
  if (!valor) return 'imagens/sem-foto.png';

  if (valor.startsWith('http://') || valor.startsWith('https://')) return valor;
  if (valor.startsWith('/')) return `${apiBase}${valor}`;
  return `${apiBase}/${valor.replace(/^\/+/, '')}`;
}

function goToDashboard() {
  window.location.href = 'dashboard.html';
}

function showBirthdayScreen({ nome, foto }) {
  const loginCard = document.getElementById('loginCard');
  const changePassCard = document.getElementById('changePassCard');
  const successScreen = document.getElementById('successScreen');
  const birthdayScreen = document.getElementById('birthdayScreen');
  const birthdayName = document.getElementById('birthdayName');
  const birthdayPhoto = document.getElementById('birthdayPhoto');
  const birthdayText = document.getElementById('birthdayText');

  if (loginCard) loginCard.style.display = 'none';
  if (changePassCard) changePassCard.style.display = 'none';
  if (successScreen) successScreen.classList.remove('show');

  if (birthdayName) birthdayName.textContent = nome || 'Parabéns!';
  if (birthdayPhoto) {
    birthdayPhoto.src = foto;
    birthdayPhoto.onerror = () => {
      birthdayPhoto.onerror = null;
      birthdayPhoto.src = 'imagens/sem-foto.png';
    };
  }

  if (birthdayText) {
    birthdayText.textContent = `Hoje é um dia especial! Desejamos um feliz aniversário para você, ${nome || ''}, com muita alegria, saúde, paz e sucesso.`;
  }

  if (birthdayScreen) birthdayScreen.classList.add('show');
}

function showNormalSuccess(nome) {
  const loginCard = document.getElementById('loginCard');
  const birthdayScreen = document.getElementById('birthdayScreen');
  const successScreen = document.getElementById('successScreen');
  const successEmail = document.getElementById('successEmail');

  if (successEmail) successEmail.textContent = nome || '';
  if (birthdayScreen) birthdayScreen.classList.remove('show');
  if (loginCard) loginCard.style.display = 'none';
  if (successScreen) successScreen.classList.add('show');
}

function fpShowError(msg) {
  const el = document.getElementById('fpError');
  if (!el) return;
  if (!msg) {
    el.style.display = 'none';
    el.textContent = '';
    return;
  }
  el.style.display = 'block';
  el.textContent = msg;
}

function fpOpen() {
  fpShowError('');
  document.getElementById('fpOverlay').style.display = 'block';
  document.getElementById('fpModal').style.display = 'flex';
  document.getElementById('fpStepEmail').style.display = 'block';
  document.getElementById('fpStepCode').style.display = 'none';
  document.getElementById('fpStepNewPass').style.display = 'none';
  document.getElementById('fpDone').style.display = 'none';
  document.getElementById('fpEmail').value = document.getElementById('username').value.trim() || '';
  document.getElementById('fpCode').value = '';
  document.getElementById('fpPass1').value = '';
  document.getElementById('fpPass2').value = '';
}

function fpClose() {
  document.getElementById('fpOverlay').style.display = 'none';
  document.getElementById('fpModal').style.display = 'none';
}

function getApiBaseForLogin() {
  return getApiBaseFromEnv();
}

async function fpFetch(path, body) {
  const base = getApiBaseForLogin();
  const r = await fetch(`${base}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body || {})
  });

  const txt = await r.text();
  let data = {};
  try { data = txt ? JSON.parse(txt) : {}; } catch { data = { raw: txt }; }

  if (!r.ok) throw new Error(data?.message || data?.error || txt || `HTTP ${r.status}`);
  return data;
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarBadgeEnv();

  document.getElementById('username')?.addEventListener('input', (e) => {
    const input = e.currentTarget;
    input.setCustomValidity('');
  });

  document.getElementById('birthdayProceedBtn')?.addEventListener('click', goToDashboard);

  document.getElementById('btnForgot')?.addEventListener('click', fpOpen);
  document.getElementById('fpClose')?.addEventListener('click', fpClose);
  document.getElementById('fpOverlay')?.addEventListener('click', fpClose);

  document.getElementById('fpSendCode')?.addEventListener('click', async () => {
    fpShowError('');
    const email = (document.getElementById('fpEmail').value || '').trim().toLowerCase();
    if (!email) return fpShowError('Informe o email.');

    try {
      await fpFetch('/api/password-reset/request', { email });
      fpEmail = email;
      document.getElementById('fpStepEmail').style.display = 'none';
      document.getElementById('fpStepCode').style.display = 'block';
    } catch (e) {
      fpShowError(e.message || String(e));
    }
  });

  document.getElementById('fpBackToEmail')?.addEventListener('click', () => {
    fpShowError('');
    document.getElementById('fpStepEmail').style.display = 'block';
    document.getElementById('fpStepCode').style.display = 'none';
  });

  document.getElementById('fpVerifyCode')?.addEventListener('click', async () => {
    fpShowError('');
    const code = (document.getElementById('fpCode').value || '').trim();
    if (!code) return fpShowError('Informe o código.');

    try {
      const resp = await fpFetch('/api/password-reset/verify', { email: fpEmail, code });
      fpToken = resp.token;
      document.getElementById('fpStepCode').style.display = 'none';
      document.getElementById('fpStepNewPass').style.display = 'block';
    } catch (e) {
      fpShowError(e.message || String(e));
    }
  });

  document.getElementById('fpUpdatePass')?.addEventListener('click', async () => {
    fpShowError('');
    const p1 = (document.getElementById('fpPass1').value || '');
    const p2 = (document.getElementById('fpPass2').value || '');

    if (!p1 || p1.length < 6) return fpShowError('A nova senha deve ter no mínimo 6 caracteres.');
    if (p1 !== p2) return fpShowError('As senhas não conferem.');

    try {
      await fpFetch('/api/password-reset/confirm', { email: fpEmail, token: fpToken, newPassword: p1 });
      document.getElementById('fpStepNewPass').style.display = 'none';
      document.getElementById('fpDone').style.display = 'block';
      setTimeout(fpClose, 1800);
    } catch (e) {
      fpShowError(e.message || String(e));
    }
  });

  document.getElementById('btnCancelNewPass')?.addEventListener('click', () => {
    const changePassCard = document.getElementById('changePassCard');
    const loginCard = document.getElementById('loginCard');

    if (changePassCard) changePassCard.style.display = 'none';
    if (loginCard) loginCard.style.display = 'block';

    const p1 = document.getElementById('newPass1');
    const p2 = document.getElementById('newPass2');
    if (p1) p1.value = '';
    if (p2) p2.value = '';

    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('userFoto');
    sessionStorage.removeItem('userDataNascimento');
  });

  document.getElementById('changePassForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const API_BASE_URL = getApiBaseFromEnv();
    const email = sessionStorage.getItem('userEmail') || '';
    const p1 = (document.getElementById('newPass1')?.value || '').toString();
    const p2 = (document.getElementById('newPass2')?.value || '').toString();

    const msg = document.getElementById('changePassMessage');
    const setMsg = (text, type = 'error') => {
      if (!msg) return;
      msg.textContent = text;
      msg.className = `login-message ${type}`;
    };

    if (!email) return setMsg('Sessão inválida. Faça login novamente.');
    if (!p1 || p1.length < 6) return setMsg('A senha deve ter no mínimo 6 caracteres.');
    if (p1 !== p2) return setMsg('As senhas não conferem.');

    try {
      const r = await fetch(`${API_BASE_URL}/api/usuarios/primeiro-acesso/senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email, newPassword: p1 })
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) return setMsg(data.message || 'Erro ao atualizar senha.');

      setMsg('Senha atualizada com sucesso! Entrando...', 'success');

      const changePassCard = document.getElementById('changePassCard');
      const successScreen = document.getElementById('successScreen');
      const birthdayScreen = document.getElementById('birthdayScreen');
      const successEmail = document.getElementById('successEmail');

      if (successEmail) successEmail.textContent = sessionStorage.getItem('usuario') || '';
      if (changePassCard) changePassCard.style.display = 'none';
      if (birthdayScreen) birthdayScreen.classList.remove('show');
      if (successScreen) successScreen.classList.add('show');

      setTimeout(() => {
        goToDashboard();
      }, 1200);
    } catch (err) {
      setMsg(err?.message || 'Falha de conexão.');
    }
  });

  document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const messageEl = document.getElementById('loginMessage');
    const loginCard = document.getElementById('loginCard');
    const successScreen = document.getElementById('successScreen');
    const birthdayScreen = document.getElementById('birthdayScreen');

    const API_BASE_URL = getApiBaseFromEnv();

    const emailInput = document.getElementById('username');
    if (!emailInput.checkValidity()) {
      emailInput.reportValidity();
      return;
    }

    if (!email || !password) {
      showLoginMessage('Preencha todos os campos!', 'error', 5000);
      return;
    }

    loginBtn.textContent = 'Verificando...';
    loginBtn.classList.add('loading');
    messageEl.className = 'login-message';

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          senha: password
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        showLoginMessage(result.message || 'Falha no login.', 'error', 5000);
        return;
      }

      if (result.success) {
        sessionStorage.setItem('userEmail', result.email || '');
        sessionStorage.setItem('usuario', result.nome || '');
        sessionStorage.setItem('id', result.id || '');
        sessionStorage.setItem('api_base', API_BASE_URL);
        sessionStorage.setItem('userFoto', result.foto || '');
        sessionStorage.setItem('userDataNascimento', result.dataNascimento || '');
        sessionStorage.setItem('perfilacesso', result.perfil || '');

        // Exemplo no login
        sessionStorage.setItem('usuarioData', JSON.stringify({
          id: result.id || '', // ID do usuário logado
          perfil: result.perfil || '' // ou outro perfil
        }));

        const mustChange = !!result.mustChangePassword;

        if (mustChange) {
          const changePassCard = document.getElementById('changePassCard');
          loginCard.style.display = 'none';
          successScreen.classList.remove('show');
          birthdayScreen.classList.remove('show');
          if (changePassCard) changePassCard.style.display = 'block';
          return;
        }

        const nomeUsuario = result.nome || '';
        const fotoUsuario = normalizarFotoUsuario(result.foto, API_BASE_URL);
        const aniversarioHoje = isBirthdayToday(result.dataNascimento);

        if (aniversarioHoje) {
          showBirthdayScreen({
            nome: nomeUsuario,
            foto: fotoUsuario
          });
          return;
        }

        showNormalSuccess(nomeUsuario);

        setTimeout(() => {
          goToDashboard();
        }, 2000);
      } else {
        messageEl.textContent = result.message || 'Email ou senha incorretos!';
        messageEl.className = 'login-message error';
      }
    } catch (error) {
      messageEl.textContent = 'Erro de conexão. Verifique sua internet.';
      messageEl.className = 'login-message error';
      console.error('Erro API:', error);
    } finally {
      loginBtn.textContent = 'Entrar';
      loginBtn.classList.remove('loading');
    }
  });
});
