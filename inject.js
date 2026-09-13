/* ============================================================
   Domofon Visuals  |  by DQMJRKA
   Вставь этот код в консоль (F12 -> Console) и нажми Enter
   Ключ доступа: cfgdqmjrka
   ============================================================ */
(function () {
  'use strict';

  /* ================== КОНФИГ ================== */
  const ACCESS_KEY  = 'cfgdqmjrka';
  const AUTHOR_CODE = 'DQMJRKA';
  const LS_KEY      = 'domofon_visuals_state_v1';

  // если скрипт уже запущен — выключаем
  if (window.__DOMOFON_VISUALS__) {
    try { window.__DOMOFON_VISUALS__.destroy(); } catch (e) {}
    return;
  }

  /* ================== ДАННЫЕ ДЛЯ AUTO ================== */
  // ⚠️ Отредактируй списки под свои кейсы / домофоны
  const AUTO_GROUPS = [
    { title: 'Кейсы',     items: ['Обычный кейс', 'Редкий кейс', 'Эпический кейс', 'Легендарный кейс'] },
    { title: 'Домофоны',  items: ['Домофон Raid vizit', 'Домофон Classic', 'Домофон Neon', 'Домофон Cyber'] }
  ];

  /* ================== ДАННЫЕ ДЛЯ RP ================== */
  const RP_DOMOFONS = [
    'Domofon Raid vizit',
    'Domofon Classic',
    'Domofon Neon',
    'Domofon Cyber',
    'Domofon Gold'
  ];

  /* ================== СОСТОЯНИЕ ================== */
  const DEFAULT_STATE = {
    snow:      { enabled: false, perSecond: 25 },
    watermark: { enabled: true, showFps: true, showTime: true },
    auto:      { enabled: false, items: {} },
    rp:        { selected: null, textures: {} }
  };

  let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (saved) state = deepMerge(JSON.parse(JSON.stringify(DEFAULT_STATE)), saved);
  } catch (e) {}

  function deepMerge(base, add) {
    for (const k in add) {
      if (add[k] && typeof add[k] === 'object' && !Array.isArray(add[k])) {
        base[k] = deepMerge(base[k] || {}, add[k]);
      } else if (add[k] !== undefined) base[k] = add[k];
    }
    return base;
  }

  function save() {
    const copy = JSON.parse(JSON.stringify(state));
    copy.rp.textures = {}; // dataURL не пишем в localStorage
    try { localStorage.setItem(LS_KEY, JSON.stringify(copy)); } catch (e) {}
  }

  /* ================== СТИЛИ ================== */
  const css = `
  #dv-app, #dv-app *{box-sizing:border-box;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;}
  #dv-app{
    --bg:#0a0c11; --panel:#11141c; --panel2:#161a24;
    --line:rgba(255,255,255,.07); --txt:#e9edf6; --mut:#7f889c;
    --acc:#7c5cff; --acc2:#22d3ee; --ok:#22c55e; --err:#ef4444;
  }
  .dv-hidden{display:none !important;}

  /* ---------- OVERLAY ---------- */
  .dv-overlay{
    position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
    background:radial-gradient(circle at 50% 25%, #151b2d 0%, #06080d 65%);
    z-index:2147483000;opacity:1;transition:opacity .45s ease;
    overflow:hidden;
  }
  .dv-overlay:before{
    content:'';position:absolute;width:900px;height:900px;border-radius:50%;
    background:radial-gradient(circle, rgba(124,92,255,.16), transparent 62%);
    animation:dvFloat 9s ease-in-out infinite;
  }
  @keyframes dvFloat{0%,100%{transform:translate(-14%,-14%) scale(1)}50%{transform:translate(14%,10%) scale(1.15)}}
  .dv-overlay.dv-hide{opacity:0;pointer-events:none;visibility:hidden;}

  /* ---------- ЛОГО ---------- */
  .dv-logo{
    width:88px;height:88px;border-radius:26px;position:relative;
    background:linear-gradient(135deg,#7c5cff,#22d3ee);
    display:flex;align-items:center;justify-content:center;
    font-size:30px;font-weight:900;color:#fff;letter-spacing:-1px;
    box-shadow:0 0 46px rgba(124,92,255,.6), inset 0 2px 0 rgba(255,255,255,.25);
    animation:dvPulse 2.4s ease-in-out infinite;
  }
  .dv-logo:after{
    content:'';position:absolute;inset:-11px;border-radius:34px;
    border:2px solid transparent;border-top-color:#7c5cff;border-right-color:#22d3ee;
    animation:dvSpin 1.4s linear infinite;
  }
  .dv-logo-sm{width:66px;height:66px;border-radius:20px;font-size:22px;animation:none;}
  .dv-logo-sm:after{inset:-8px;border-radius:26px;animation:dvSpin 2.4s linear infinite;}
  @keyframes dvSpin{to{transform:rotate(360deg)}}
  @keyframes dvPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}

  /* ---------- ЗАГРУЗКА ---------- */
  .dv-loader{display:flex;flex-direction:column;align-items:center;gap:14px;z-index:2;}
  .dv-logo-title{
    margin-top:6px;font-size:28px;font-weight:800;letter-spacing:1px;
    background:linear-gradient(90deg,#fff,#a78bfa,#22d3ee);
    -webkit-background-clip:text;background-clip:text;color:transparent;
  }
  .dv-logo-sub{font-size:12px;color:#7f889c;letter-spacing:2px;text-transform:uppercase;}
  .dv-progress{width:300px;height:6px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden;margin-top:10px;}
  .dv-progress-fill{height:100%;width:0%;border-radius:99px;background:linear-gradient(90deg,#7c5cff,#22d3ee);box-shadow:0 0 16px rgba(124,92,255,.9);transition:width .22s ease;}
  .dv-percent{font-size:12px;color:#7f889c;font-weight:700;letter-spacing:1px;}

  /* ---------- КАРТОЧКИ ---------- */
  .dv-card{
    width:380px;max-width:92vw;padding:34px 28px 28px;border-radius:22px;z-index:2;
    background:linear-gradient(180deg, rgba(20,24,34,.96), rgba(11,13,19,.98));
    border:1px solid rgba(255,255,255,.08);
    box-shadow:0 40px 90px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.06);
    display:flex;flex-direction:column;align-items:center;text-align:center;
    animation:dvCardIn .45s cubic-bezier(.2,.9,.3,1.25);
  }
  @keyframes dvCardIn{from{opacity:0;transform:translateY(18px) scale(.95)}to{opacity:1;transform:none}}
  .dv-h1{font-size:24px;font-weight:800;margin:16px 0 4px;letter-spacing:.5px;
    background:linear-gradient(90deg,#fff,#a78bfa,#22d3ee);
    -webkit-background-clip:text;background-clip:text;color:transparent;}
  .dv-mut{font-size:13px;color:#7f889c;margin:0 0 18px;line-height:1.55;}
  .dv-mut b{color:#a78bfa;}

  /* ---------- ИНПУТ / КНОПКИ ---------- */
  .dv-input{
    width:100%;padding:13px 15px;border-radius:12px;font-size:13px;font-weight:600;
    background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.09);
    color:#e9edf6;outline:none;transition:.22s;letter-spacing:.5px;
  }
  .dv-input::placeholder{color:#5c6478;}
  .dv-input:focus{border-color:#7c5cff;background:rgba(124,92,255,.08);box-shadow:0 0 0 3px rgba(124,92,255,.16);}
  .dv-input.dv-shake{animation:dvShake .4s;border-color:#ef4444;}
  @keyframes dvShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}

  .dv-btn{
    border:0;border-radius:12px;padding:13px 20px;font-size:13px;font-weight:800;
    letter-spacing:.6px;cursor:pointer;transition:.22s;color:#fff;
    background:rgba(255,255,255,.07);
  }
  .dv-btn:hover{background:rgba(255,255,255,.13);transform:translateY(-1px);}
  .dv-btn:active{transform:translateY(0);}
  .dv-btn-primary{background:linear-gradient(135deg,#7c5cff,#22d3ee);box-shadow:0 12px 30px rgba(124,92,255,.4);}
  .dv-btn-primary:hover{box-shadow:0 16px 38px rgba(124,92,255,.58);}
  .dv-btn-block{width:100%;margin-top:12px;}
  .dv-btn-sm{padding:9px 13px;font-size:11px;border-radius:10px;}
  .dv-link{background:none;border:0;color:#5c6478;font-size:12px;margin-top:12px;cursor:pointer;transition:.2s;}
  .dv-link:hover{color:#a78bfa;}

  .dv-err{font-size:12px;color:#ef4444;height:16px;margin-top:8px;font-weight:700;}
  .dv-msg{font-size:12px;margin-top:10px;font-weight:700;min-height:16px;}
  .dv-msg-ok{color:#22c55e;} .dv-msg-err{color:#ef4444;}

  /* ---------- СНЕЖИНКИ ---------- */
  .dv-snow{position:fixed;inset:0;pointer-events:none;z-index:2147481000;overflow:hidden;}
  .dv-flake{
    position:absolute;top:-8vh;line-height:1;will-change:transform;
    animation-name:dvFall;animation-timing-function:linear;animation-fill-mode:forwards;
    text-shadow:0 0 10px rgba(180,220,255,.7);
  }
  @keyframes dvFall{
    from{transform:translate3d(0,-10vh,0) rotate(0deg);}
    to{transform:translate3d(var(--dx),115vh,0) rotate(var(--rot));}
  }

  /* ---------- WATERMARK (Dynamic Island) ---------- */
  .dv-wm{
    position:fixed;top:14px;left:50%;transform:translateX(-50%);
    display:flex;align-items:center;gap:11px;
    padding:9px 20px;border-radius:99px;
    background:rgba(10,12,18,.85);
    border:1px solid rgba(255,255,255,.09);
    color:#e9edf6;font-size:12.5px;font-weight:700;letter-spacing:.3px;
    backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
    box-shadow:0 12px 40px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.07);
    z-index:2147482000;user-select:none;cursor:context-menu;
    transition:transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s, border-radius .35s;
    white-space:nowrap;
  }
  .dv-wm:hover{transform:translateX(-50%) scale(1.05);border-radius:20px;box-shadow:0 16px 50px rgba(124,92,255,.35);}
  .dv-wm-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e;animation:dvBlink 2s infinite;}
  @keyframes dvBlink{0%,100%{opacity:1}50%{opacity:.35}}
  .dv-wm-brand{background:linear-gradient(90deg,#a78bfa,#22d3ee);-webkit-background-clip:text;background-clip:text;color:transparent;font-weight:800;}
  .dv-wm-sep{width:1px;height:12px;background:rgba(255,255,255,.18);}
  .dv-wm-fps{color:#22d3ee;}
  .dv-wm-time{color:#a78bfa;}

  /* ---------- ОКНО ---------- */
  .dv-win{
    position:fixed;top:88px;right:34px;width:404px;max-width:94vw;
    background:linear-gradient(180deg,#11141c,#0c0f16);
    border:1px solid rgba(255,255,255,.08);border-radius:18px;
    box-shadow:0 34px 90px rgba(0,0,0,.75), 0 0 0 1px rgba(124,92,255,.14), inset 0 1px 0 rgba(255,255,255,.05);
    z-index:2147482500;overflow:hidden;color:#e9edf6;font-size:13px;
    animation:dvWinIn .38s cubic-bezier(.2,.9,.3,1.2);
  }
  @keyframes dvWinIn{from{opacity:0;transform:translateY(-16px) scale(.95)}to{opacity:1;transform:none}}

  .dv-head{
    display:flex;align-items:center;justify-content:space-between;gap:8px;
    padding:13px 14px;background:rgba(255,255,255,.025);
    border-bottom:1px solid rgba(255,255,255,.06);cursor:move;user-select:none;
  }
  .dv-brand{display:flex;align-items:center;gap:9px;font-weight:800;font-size:13px;letter-spacing:.4px;}
  .dv-brand .dv-dot{width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#7c5cff,#22d3ee);box-shadow:0 0 12px rgba(124,92,255,.9);}
  .dv-head-actions{display:flex;gap:6px;}
  .dv-icon-btn{
    width:28px;height:28px;border-radius:8px;border:0;cursor:pointer;
    background:rgba(255,255,255,.06);color:#9aa3b8;font-size:13px;
    display:flex;align-items:center;justify-content:center;transition:.2s;padding:0;
  }
  .dv-icon-btn:hover{background:rgba(124,92,255,.28);color:#fff;}
  .dv-icon-btn.dv-close:hover{background:rgba(239,68,68,.85);}

  .dv-tabs{display:flex;gap:6px;padding:11px 12px 0;}
  .dv-tab{
    flex:1;padding:9px 0;border:0;border-radius:10px;cursor:pointer;
    background:rgba(255,255,255,.04);color:#7f889c;font-weight:800;font-size:11.5px;
    letter-spacing:.6px;transition:.22s;text-transform:uppercase;
  }
  .dv-tab:hover{background:rgba(255,255,255,.09);color:#e9edf6;}
  .dv-tab.dv-active{background:linear-gradient(135deg,#7c5cff,#22d3ee);color:#fff;box-shadow:0 8px 22px rgba(124,92,255,.38);}

  .dv-body{padding:14px;max-height:62vh;overflow-y:auto;}
  .dv-body::-webkit-scrollbar{width:6px;}
  .dv-body::-webkit-scrollbar-thumb{background:rgba(124,92,255,.45);border-radius:99px;}
  .dv-body::-webkit-scrollbar-track{background:transparent;}

  .dv-section{margin-bottom:16px;}
  .dv-section:last-child{margin-bottom:0;}
  .dv-section-title{
    font-size:10.5px;font-weight:900;letter-spacing:1.6px;text-transform:uppercase;
    color:#7c5cff;margin:0 0 10px 3px;
  }

  .dv-row{
    display:flex;align-items:center;justify-content:space-between;gap:12px;
    padding:12px 14px;border-radius:12px;margin-bottom:8px;
    background:#161a24;border:1px solid rgba(255,255,255,.06);
    transition:.22s;cursor:context-menu;
  }
  .dv-row:hover{border-color:rgba(124,92,255,.5);background:#1a1f2d;transform:translateX(2px);}
  .dv-row-name{font-weight:700;font-size:13px;}
  .dv-row-desc{font-size:11px;color:#7f889c;margin-top:3px;}
  .dv-row-desc b{color:#22d3ee;}

  .dv-switch{position:relative;display:inline-block;width:44px;height:24px;flex:0 0 auto;}
  .dv-switch input{opacity:0;width:0;height:0;}
  .dv-slider{position:absolute;inset:0;background:rgba(255,255,255,.13);border-radius:99px;transition:.25s;cursor:pointer;}
  .dv-slider:before{content:'';position:absolute;width:18px;height:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.25s;}
  .dv-switch input:checked + .dv-slider{background:linear-gradient(90deg,#7c5cff,#22d3ee);}
  .dv-switch input:checked + .dv-slider:before{transform:translateX(20px);}

  .dv-sub-row{
    display:flex;align-items:center;justify-content:space-between;gap:10px;
    padding:9px 12px;border-radius:10px;margin-bottom:6px;
    background:rgba(255,255,255,.028);border:1px solid rgba(255,255,255,.05);
    font-size:12.5px;font-weight:600;transition:.2s;
  }
  .dv-sub-row:hover{background:rgba(255,255,255,.06);border-color:rgba(124,92,255,.3);}
  .dv-check{width:16px;height:16px;accent-color:#7c5cff;cursor:pointer;}

  /* ---------- RP ---------- */
  .dv-rp-item{
    display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:12px;
    background:#161a24;border:1px solid rgba(255,255,255,.06);margin-bottom:8px;
    transition:.22s;cursor:pointer;
  }
  .dv-rp-item:hover{border-color:rgba(124,92,255,.45);background:#1a1f2d;}
  .dv-rp-item.dv-rp-active{border-color:#7c5cff;background:rgba(124,92,255,.12);box-shadow:0 0 0 1px rgba(124,92,255,.3);}
  .dv-rp-thumb{
    width:44px;height:44px;border-radius:10px;flex:0 0 auto;overflow:hidden;
    background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;
    font-size:19px;border:1px solid rgba(255,255,255,.07);
  }
  .dv-rp-thumb img{width:100%;height:100%;object-fit:cover;}
  .dv-rp-meta{flex:1;min-width:0;}
  .dv-rp-name{font-weight:700;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .dv-rp-sub{font-size:10.5px;color:#7f889c;margin-top:3px;}

  /* ---------- МОДАЛКИ ---------- */
  .dv-modal-wrap{
    position:fixed;inset:0;z-index:2147483200;display:flex;align-items:center;justify-content:center;
    background:rgba(4,6,10,.72);backdrop-filter:blur(5px);animation:dvFade .22s ease;
  }
  @keyframes dvFade{from{opacity:0}to{opacity:1}}
  .dv-modal{
    width:392px;max-width:92vw;border-radius:18px;overflow:hidden;
    background:linear-gradient(180deg,#141824,#0c0f16);
    border:1px solid rgba(255,255,255,.09);
    box-shadow:0 40px 90px rgba(0,0,0,.8);
    animation:dvCardIn .3s cubic-bezier(.2,.9,.3,1.25);
    color:#e9edf6;
  }
  .dv-modal-head{
    display:flex;align-items:center;justify-content:space-between;
    padding:13px 15px;border-bottom:1px solid rgba(255,255,255,.07);
    font-weight:800;font-size:13px;letter-spacing:.4px;
    background:linear-gradient(90deg, rgba(124,92,255,.16), transparent);
  }
  .dv-modal-body{padding:16px 16px 18px;}
  .dv-modal-body h3{margin:0 0 4px;font-size:15px;font-weight:800;}
  .dv-field{margin-bottom:12px;}
  .dv-field label{display:block;font-size:11.5px;color:#7f889c;margin-bottom:8px;font-weight:700;}
  .dv-field label b{color:#22d3ee;font-size:13px;}
  .dv-range{width:100%;accent-color:#7c5cff;cursor:pointer;}
  .dv-hint{font-size:11px;color:#5c6478;line-height:1.5;margin-top:6px;}

  /* ---------- TOAST ---------- */
  .dv-toast{
    position:fixed;bottom:26px;right:26px;z-index:2147483600;
    padding:12px 18px;border-radius:12px;font-size:12.5px;font-weight:700;color:#fff;
    background:linear-gradient(135deg,#7c5cff,#22d3ee);
    box-shadow:0 16px 40px rgba(124,92,255,.5);
    opacity:0;transform:translateY(14px);transition:.28s cubic-bezier(.2,.9,.3,1.3);
    pointer-events:none;letter-spacing:.3px;
  }
  .dv-toast.dv-toast-in{opacity:1;transform:translateY(0);}
  .dv-toast.dv-toast-err{background:linear-gradient(135deg,#ef4444,#f97316);box-shadow:0 16px 40px rgba(239,68,68,.5);}
  `;

  /* ================== РАЗМЕТКА ================== */
  const root = document.createElement('div');
  root.id = 'dv-app';
  root.innerHTML = `
  <style>${css}</style>

  <!-- ЗАГРУЗКА -->
  <div class="dv-overlay" id="dvLoader">
    <div class="dv-loader">
      <div class="dv-logo">DV</div>
      <div class="dv-logo-title">Domofon Visuals</div>
      <div class="dv-logo-sub" id="dvLoadSub">Инициализация…</div>
      <div class="dv-progress"><div class="dv-progress-fill" id="dvProgressFill"></div></div>
      <div class="dv-percent" id="dvPercent">0%</div>
    </div>
  </div>

  <!-- КЛЮЧ -->
  <div class="dv-overlay dv-hide" id="dvKeyScreen">
    <div class="dv-card">
      <div class="dv-logo dv-logo-sm">DV</div>
      <div class="dv-h1">Domofon Visuals</div>
      <p class="dv-mut">Введите ключ доступа, чтобы продолжить</p>
      <input type="text" class="dv-input" id="dvKeyInput" placeholder="КЛЮЧ ДОСТУПА" autocomplete="off" spellcheck="false">
      <div class="dv-err" id="dvKeyErr"></div>
      <button class="dv-btn dv-btn-primary dv-btn-block" id="dvKeyBtn">ВОЙТИ</button>
    </div>
  </div>

  <!-- ПОДДЕРЖКА -->
  <div class="dv-overlay dv-hide" id="dvSupportScreen">
    <div class="dv-card">
      <div class="dv-logo dv-logo-sm">❤</div>
      <div class="dv-h1">Domofon Visuals</div>
      <p class="dv-mut">Чтобы играть с визуалами —<br>поддержите автора <b>DQMJRKA</b></p>
      <button class="dv-btn dv-btn-primary dv-btn-block" id="dvSupportBtn">Поддержать</button>
      <button class="dv-link" id="dvSkipBtn">Пропустить</button>
    </div>
  </div>

  <!-- СНЕГ -->
  <div class="dv-snow" id="dvSnow"></div>

  <!-- WATERMARK -->
  <div class="dv-wm dv-hidden" id="dvWatermark">
    <span class="dv-wm-dot"></span>
    <span class="dv-wm-brand">DVisuals.ttdq.pro</span>
    <span class="dv-wm-sep" id="dvSep1"></span>
    <span class="dv-wm-time" id="dvWmTime">Time 12:34</span>
    <span class="dv-wm-sep" id="dvSep2"></span>
    <span class="dv-wm-fps" id="dvWmFps">FPS 123</span>
  </div>

  <!-- ОСНОВНОЕ ОКНО -->
  <div class="dv-win dv-hidden" id="dvWin">
    <div class="dv-head" id="dvHead">
      <div class="dv-brand"><span class="dv-dot"></span> Domofon Visuals</div>
      <div class="dv-head-actions">
        <button class="dv-icon-btn" id="dvCreatorBtn" title="Креаторам ⭐">⭐</button>
        <button class="dv-icon-btn" id="dvSaveCfg" title="Сохранить конфиг">💾</button>
        <button class="dv-icon-btn" id="dvLoadCfg" title="Загрузить конфиг">📂</button>
        <button class="dv-icon-btn dv-close" id="dvClose" title="Закрыть">✕</button>
      </div>
    </div>

    <div class="dv-tabs">
      <button class="dv-tab dv-active" data-tab="utils">Utils</button>
      <button class="dv-tab" data-tab="auto">Auto</button>
      <button class="dv-tab" data-tab="rp">RP</button>
    </div>

    <div class="dv-body">
      <!-- UTILS -->
      <div class="dv-page" data-page="utils">
        <div class="dv-section">
          <div class="dv-section-title">Visuals</div>

          <div class="dv-row" id="dvSnowRow">
            <div>
              <div class="dv-row-name">Снежинки</div>
              <div class="dv-row-desc">ПКМ — настройки · <b id="dvSnowInfo">25/сек</b></div>
            </div>
            <label class="dv-switch"><input type="checkbox" id="dvSnowToggle"><span class="dv-slider"></span></label>
          </div>

          <div class="dv-row" id="dvWmRow">
            <div>
              <div class="dv-row-name">WaterMark</div>
              <div class="dv-row-desc">ПКМ — настройки · Dynamic Island</div>
            </div>
            <label class="dv-switch"><input type="checkbox" id="dvWmToggle"><span class="dv-slider"></span></label>
          </div>
        </div>
      </div>

      <!-- AUTO -->
      <div class="dv-page dv-hidden" data-page="auto">
        <div class="dv-section">
          <div class="dv-section-title">AutoCase</div>
          <div class="dv-row">
            <div>
              <div class="dv-row-name">AutoCase</div>
              <div class="dv-row-desc">Автоматическое открытие кейсов и домофонов</div>
            </div>
            <label class="dv-switch"><input type="checkbox" id="dvAutoToggle"><span class="dv-slider"></span></label>
          </div>
          <div id="dvAutoList"></div>
        </div>
      </div>

      <!-- RP -->
      <div class="dv-page dv-hidden" data-page="rp">
        <div class="dv-section">
          <div class="dv-section-title">DomofonRP</div>
          <div id="dvRpList"></div>
        </div>
      </div>
    </div>
  </div>
  `;

  document.body.appendChild(root);

  /* ================== ХЕЛПЕРЫ ================== */
  const $ = (s, c) => (c || root).querySelector(s);

  function toast(text, isErr) {
    const t = document.createElement('div');
    t.className = 'dv-toast' + (isErr ? ' dv-toast-err' : '');
    t.textContent = text;
    root.appendChild(t);
    requestAnimationFrame(() => t.classList.add('dv-toast-in'));
    setTimeout(() => { t.classList.remove('dv-toast-in'); setTimeout(() => t.remove(), 320); }, 2200);
  }

  function openModal(title, buildBody) {
    const wrap = document.createElement('div');
    wrap.className = 'dv-modal-wrap';
    wrap.innerHTML = `
      <div class="dv-modal">
        <div class="dv-modal-head"><span>${title}</span><button class="dv-icon-btn dv-close">✕</button></div>
        <div class="dv-modal-body"></div>
      </div>`;
    const body = wrap.querySelector('.dv-modal-body');
    buildBody(body, () => wrap.remove());
    wrap.querySelector('.dv-close').onclick = () => wrap.remove();
    wrap.addEventListener('mousedown', e => { if (e.target === wrap) wrap.remove(); });
    root.appendChild(wrap);
    return wrap;
  }

  /* ================== ЗАГРУЗКА ================== */
  const loader    = $('#dvLoader');
  const keyScreen = $('#dvKeyScreen');
  const supScreen = $('#dvSupportScreen');
  const win       = $('#dvWin');

  const steps = ['Инициализация…', 'Загрузка модулей…', 'Подключение визуалов…', 'Проверка ключа…', 'Готово'];
  let progress = 0, stepIdx = 0;
  const fill = $('#dvProgressFill'), pct = $('#dvPercent'), sub = $('#dvLoadSub');

  const loadTimer = setInterval(() => {
    progress += Math.random() * 11 + 4;
    if (progress >= 100) { progress = 100; clearInterval(loadTimer); setTimeout(showKeyScreen, 420); }
    fill.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
    const ni = Math.min(Math.floor(progress / 21), steps.length - 1);
    if (ni !== stepIdx) { stepIdx = ni; sub.textContent = steps[ni]; }
  }, 135);

  function showKeyScreen() {
    loader.classList.add('dv-hide');
    setTimeout(() => { keyScreen.classList.remove('dv-hide'); $('#dvKeyInput').focus(); }, 300);
  }

  /* ================== ПРОВЕРКА КЛЮЧА ================== */
  const keyInput = $('#dvKeyInput'), keyErr = $('#dvKeyErr'), keyBtn = $('#dvKeyBtn');

  function tryKey() {
    const v = keyInput.value.trim().toLowerCase();
    if (v === ACCESS_KEY) {
      keyErr.textContent = '';
      keyScreen.classList.add('dv-hide');
      setTimeout(() => supScreen.classList.remove('dv-hide'), 300);
    } else {
      keyErr.textContent = 'Неверный ключ доступа';
      keyInput.classList.add('dv-shake');
      setTimeout(() => keyInput.classList.remove('dv-shake'), 420);
    }
  }
  keyBtn.onclick = tryKey;
  keyInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryKey(); });

  /* ================== ПОДДЕРЖКА ================== */
  $('#dvSupportBtn').onclick = () => { openCreatorPanel(); };
  $('#dvSkipBtn').onclick    = () => { enterMain(); };

  function enterMain() {
    supScreen.classList.add('dv-hide');
    setTimeout(() => { win.classList.remove('dv-hidden'); applyState(); }, 300);
  }

  /* ================== КРЕАТОРАМ ================== */
  function openCreatorPanel() {
    // если на сайте есть своя вкладка — кликаем её
    const siteTab = document.querySelector('.tab-btn[data-tab="creator"]');
    if (siteTab) { try { siteTab.click(); } catch (e) {} }

    openModal('Креаторам ⭐', (body) => {
      body.innerHTML = `
        <h3>Ввести код автора</h3>
        <p style="font-size:12px;color:#7f889c;margin:6px 0 14px;line-height:1.55;">
          При вводе кода автора вы мгновенно получите от 100 000 до 1 000 000 💰,
          а креатор получит +1 Creator Star!
        </p>
        <div class="dv-field">
          <input type="text" id="authorCodeInput" class="dv-input"
                 placeholder="КОД АВТОРА (НАПР: QWENIX)" style="text-transform:uppercase;">
        </div>
        <button class="dv-btn dv-btn-primary dv-btn-block" id="submitAuthorCodeBtn">ПОДДЕРЖАТЬ АВТОРА</button>
        <div class="dv-msg" id="dvAuthorMsg"></div>
      `;

      const inp = body.querySelector('#authorCodeInput');
      const msg = body.querySelector('#dvAuthorMsg');

      body.querySelector('#submitAuthorCodeBtn').onclick = () => {
        const code = (inp.value || '').trim().toUpperCase();
        if (!code) { msg.className = 'dv-msg dv-msg-err'; msg.textContent = 'Введите код автора'; return; }
        if (code !== AUTHOR_CODE) {
          msg.className = 'dv-msg dv-msg-err';
          msg.textContent = 'Неверный код автора';
          inp.classList.add('dv-shake');
          setTimeout(() => inp.classList.remove('dv-shake'), 420);
          return;
        }

        msg.className = 'dv-msg dv-msg-ok';
        msg.textContent = 'Успешно! +1 Creator Star ⭐  Начислено 100 000–1 000 000 💰';

        // через секунду — клик по профилю
        setTimeout(() => {
          const profileBtn = document.getElementById('openProfileBtn');
          if (profileBtn) {
            profileBtn.click();
          } else {
            toast('Профиль: asdasdasdasd');
          }
          setTimeout(enterMain, 700);
        }, 1000);
      };
    });
  }

  $('#dvCreatorBtn').onclick = openCreatorPanel;

  /* ================== СНЕЖИНКИ ================== */
  const snowLayer = $('#dvSnow');
  const MAX_FLAKES = 360;
  let snowRAF = null, snowLast = 0, snowAcc = 0;

  function spawnFlake() {
    const f = document.createElement('div');
    f.className = 'dv-flake';
    f.textContent = Math.random() > 0.45 ? '❄' : '✻';
    f.style.left = (Math.random() * 100) + 'vw';
    f.style.fontSize = (8 + Math.random() * 16).toFixed(1) + 'px';
    f.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
    f.style.color = Math.random() > 0.72 ? '#bfe9ff' : '#ffffff';
    f.style.setProperty('--dx', ((Math.random() * 2 - 1) * 150).toFixed(0) + 'px');
    f.style.setProperty('--rot', ((Math.random() * 2 - 1) * 560).toFixed(0) + 'deg');
    f.style.animationDuration = (5 + Math.random() * 7).toFixed(2) + 's';
    f.addEventListener('animationend', () => f.remove());
    snowLayer.appendChild(f);
  }

  function snowTick(now) {
    const dt = Math.min((now - snowLast) / 1000, 0.12);
    snowLast = now;
    snowAcc += state.snow.perSecond * dt;
    while (snowAcc >= 1) {
      snowAcc -= 1;
      if (snowLayer.childElementCount < MAX_FLAKES) spawnFlake();
    }
    snowRAF = requestAnimationFrame(snowTick);
  }

  function startSnow() {
    if (snowRAF) return;
    snowLast = performance.now(); snowAcc = 0;
    snowRAF = requestAnimationFrame(snowTick);
  }

  function stopSnow() {
    if (snowRAF) cancelAnimationFrame(snowRAF);
    snowRAF = null;
    snowLayer.innerHTML = '';
  }

  /* ================== WATERMARK ================== */
  const wm = $('#dvWatermark');
  const wmTimeEl = $('#dvWmTime'), wmFpsEl = $('#dvWmFps');
  const sep1 = $('#dvSep1'), sep2 = $('#dvSep2');
  let curFps = 0, frames = 0, fpsLast = performance.now(), fpsRAF = null;

  function fpsLoop(now) {
    frames++;
    if (now - fpsLast >= 500) {
      curFps = Math.round(frames * 1000 / (now - fpsLast));
      frames = 0; fpsLast = now;
      updateWatermark();
    }
    fpsRAF = requestAnimationFrame(fpsLoop);
  }
  fpsRAF = requestAnimationFrame(fpsLoop);

  const timeTimer = setInterval(() => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    wmTimeEl.textContent = 'Time ' + hh + ':' + mm;
  }, 1000);

  function updateWatermark() {
    if (!state.watermark.enabled) { wm.classList.add('dv-hidden'); return; }
    wm.classList.remove('dv-hidden');

    const st = state.watermark.showTime;
    const sf = state.watermark.showFps;

    wmTimeEl.style.display = st ? '' : 'none';
    wmFpsEl.style.display  = sf ? '' : 'none';
    wmFpsEl.textContent    = 'FPS ' + curFps;

    const d = new Date();
    wmTimeEl.textContent = 'Time ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');

    sep1.style.display = st ? '' : 'none';
    sep2.style.display = (st && sf) ? '' : 'none';
  }

  wm.addEventListener('contextmenu', e => { e.preventDefault(); openWatermarkSettings(); });

  /* ================== МОДАЛКА: СНЕЖИНКИ ================== */
  function openSnowSettings() {
    openModal('Настройки снежинок', (body) => {
      body.innerHTML = `
        <div class="dv-field">
          <label>Снежинок в секунду: <b id="dvSnowVal">${state.snow.perSecond}</b></label>
          <input type="range" min="5" max="100" step="1" value="${state.snow.perSecond}" id="dvSnowRange" class="dv-range">
        </div>
        <div class="dv-hint">Снежинки падают рандомно по всему экрану.<br>Максимум одновременно: ${MAX_FLAKES}.</div>
      `;
      const range = body.querySelector('#dvSnowRange');
      const val   = body.querySelector('#dvSnowVal');
      range.oninput = () => {
        state.snow.perSecond = +range.value;
        val.textContent = range.value;
        $('#dvSnowInfo').textContent = range.value + '/сек';
        save();
      };
    });
  }

  /* ================== МОДАЛКА: WATERMARK ================== */
  function openWatermarkSettings() {
    openModal('Настройки WaterMark', (body) => {
      body.innerHTML = `
        <div class="dv-sub-row">
          <span>Показывать Time</span>
          <input type="checkbox" class="dv-check" id="dvWmTimeChk" ${state.watermark.showTime ? 'checked' : ''}>
        </div>
        <div class="dv-sub-row">
          <span>Показывать FPS</span>
          <input type="checkbox" class="dv-check" id="dvWmFpsChk" ${state.watermark.showFps ? 'checked' : ''}>
        </div>
        <div class="dv-hint">Dynamic Island появляется по центру сверху.<br>ПКМ по нему — снова открыть эти настройки.</div>
      `;
      body.querySelector('#dvWmTimeChk').onchange = e => { state.watermark.showTime = e.target.checked; save(); updateWatermark(); };
      body.querySelector('#dvWmFpsChk').onchange  = e => { state.watermark.showFps  = e.target.checked; save(); updateWatermark(); };
    });
  }

  /* ================== AUTO ================== */
  const autoList = $('#dvAutoList');

  function renderAuto() {
    autoList.innerHTML = '';
    AUTO_GROUPS.forEach(g => {
      const t = document.createElement('div');
      t.style.cssText = 'font-size:10.5px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;color:#5c6478;margin:14px 0 8px 3px;';
      t.textContent = g.title;
      autoList.appendChild(t);

      g.items.forEach(name => {
        if (state.auto.items[name] === undefined) state.auto.items[name] = false;
        const row = document.createElement('div');
        row.className = 'dv-sub-row';
        row.innerHTML = `<span>${name}</span>`;
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.className = 'dv-check';
        chk.checked = !!state.auto.items[name];
        chk.onchange = () => { state.auto.items[name] = chk.checked; save(); };
        row.appendChild(chk);
        autoList.appendChild(row);
      });
    });
  }

  $('#dvAutoToggle').onchange = e => {
    state.auto.enabled = e.target.checked;
    save();
    toast(state.auto.enabled ? 'AutoCase включён' : 'AutoCase выключен');
  };

  /* ================== RP ================== */
  const rpList = $('#dvRpList');

  function renderRP() {
    rpList.innerHTML = '';
    RP_DOMOFONS.forEach(name => {
      const tex = state.rp.textures[name];
      const item = document.createElement('div');
      item.className = 'dv-rp-item' + (state.rp.selected === name ? ' dv-rp-active' : '');
      item.innerHTML = `
        <div class="dv-rp-thumb">${tex ? `<img src="${tex}" alt="">` : '🧊'}</div>
        <div class="dv-rp-meta">
          <div class="dv-rp-name">${name}</div>
          <div class="dv-rp-sub">${tex ? 'Текстура загружена' : 'Текстура не загружена'}</div>
        </div>
        <button class="dv-btn dv-btn-sm dv-rp-load">Загрузить текстуру</button>
      `;

      item.addEventListener('click', e => {
        if (e.target.closest('.dv-rp-load')) return;
        state.rp.selected = name;
        save(); renderRP();
        toast('Выбран: ' + name);
      });

      item.querySelector('.dv-rp-load').addEventListener('click', e => {
        e.stopPropagation();
        pickTexture(name);
      });

      rpList.appendChild(item);
    });
  }

  function pickTexture(name) {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*';
    inp.onchange = () => {
      const f = inp.files && inp.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        state.rp.textures[name] = r.result;
        state.rp.selected = name;
        save(); renderRP();
        toast('Текстура загружена: ' + name);
      };
      r.readAsDataURL(f);
    };
    inp.click();
  }

  /* ================== ВКЛАДКИ ================== */
  root.querySelectorAll('.dv-tab').forEach(tab => {
    tab.onclick = () => {
      root.querySelectorAll('.dv-tab').forEach(t => t.classList.remove('dv-active'));
      tab.classList.add('dv-active');
      const target = tab.dataset.tab;
      root.querySelectorAll('.dv-page').forEach(p => {
        p.classList.toggle('dv-hidden', p.dataset.page !== target);
      });
    };
  });

  /* ================== ПЕРЕТАСКИВАНИЕ ОКНА ================== */
  (function makeDraggable() {
    const handle = $('#dvHead');
    let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;

    handle.addEventListener('mousedown', e => {
      if (e.target.closest('button')) return;
      const r = win.getBoundingClientRect();
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = r.left; oy = r.top;
      win.style.right = 'auto';
      win.style.left = ox + 'px';
      win.style.top  = oy + 'px';
      win.style.animation = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      let nx = ox + e.clientX - sx;
      let ny = oy + e.clientY - sy;
      nx = Math.max(0, Math.min(window.innerWidth - 80, nx));
      ny = Math.max(0, Math.min(window.innerHeight - 40, ny));
      win.style.left = nx + 'px';
      win.style.top  = ny + 'px';
    });

    document.addEventListener('mouseup', () => { dragging = false; });
  })();

  /* ================== ПКМ ПО РЯДАМ ================== */
  $('#dvSnowRow').addEventListener('contextmenu', e => { e.preventDefault(); openSnowSettings(); });
  $('#dvWmRow').addEventListener('contextmenu',   e => { e.preventDefault(); openWatermarkSettings(); });

  /* ================== ПРИМЕНЕНИЕ СОСТОЯНИЯ ================== */
  const snowToggle = $('#dvSnowToggle');
  const wmToggle   = $('#dvWmToggle');
  const autoToggle = $('#dvAutoToggle');

  snowToggle.onchange = e => {
    state.snow.enabled = e.target.checked;
    save();
    state.snow.enabled ? startSnow() : stopSnow();
    toast(state.snow.enabled ? 'Снежинки включены' : 'Снежинки выключены');
  };

  wmToggle.onchange = e => {
    state.watermark.enabled = e.target.checked;
    save(); updateWatermark();
  };

  function applyState() {
    snowToggle.checked = state.snow.enabled;
    wmToggle.checked   = state.watermark.enabled;
    autoToggle.checked = state.auto.enabled;
    $('#dvSnowInfo').textContent = state.snow.perSecond + '/сек';

    state.snow.enabled ? startSnow() : stopSnow();
    updateWatermark();

    renderAuto();
    renderRP();
  }

  /* ================== КОНФИГ ================== */
  $('#dvSaveCfg').onclick = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'domofon-visuals-config.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('Конфиг сохранён');
  };

  $('#dvLoadCfg').onclick = () => {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json,application/json';
    inp.onchange = () => {
      const f = inp.files && inp.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          const data = JSON.parse(r.result);
          state = deepMerge(JSON.parse(JSON.stringify(DEFAULT_STATE)), data);
          if (!state.rp.textures) state.rp.textures = {};
          save();
          applyState();
          toast('Конфиг загружен');
        } catch (err) {
          toast('Ошибка чтения конфига', true);
        }
      };
      r.readAsText(f);
    };
    inp.click();
  };

  /* ================== ЗАКРЫТИЕ ================== */
  $('#dvClose').onclick = () => {
    stopSnow();
    root.classList.add('dv-hidden');
    toast('Панель скрыта (обнови страницу для возврата)');
  };

  /* ================== CLEANUP ================== */
  window.__DOMOFON_VISUALS__ = {
    destroy() {
      clearInterval(loadTimer);
      clearInterval(timeTimer);
      if (snowRAF) cancelAnimationFrame(snowRAF);
      if (fpsRAF) cancelAnimationFrame(fpsRAF);
      root.remove();
      window.__DOMOFON_VISUALS__ = null;
      console.log('%c[Domofon Visuals] выключено', 'color:#7c5cff;font-weight:bold');
    },
    state
  };

  console.log('%c[Domofon Visuals] %cзагружено · ключ: cfgdqmjrka',
    'color:#7c5cff;font-weight:bold', 'color:#22d3ee');
})();
