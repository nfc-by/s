(function () {
'use strict';

/* ============================================================
   DOMOFON CHEAT  |  v1.0
   ============================================================ */
if (window.__DFC__) { try { window.__DFC__.destroy(); } catch(e){} }

const KEY              = 'cfgdqmjrka';
const DEFAULT_PASS     = 'Kojab777';
const DEFAULT_AUTHCODE = 'DQMJRKA';
const DELAY            = 500; // 0.5s
const LS_KEY           = 'dfc_config_v1';

/* ---------- helpers ---------- */
const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitFor(sel, timeout = 6000) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
        const el = document.querySelector(sel);
        if (el) return el;
        await sleep(40);
    }
    return null;
}

function setVal(el, value) {
    if (!el) return;
    const proto = el.tagName === 'TEXTAREA'
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
}

function randLetters(n = 4) {
    const a = 'abcdefghijklmnopqrstuvwxyz';
    let s = '';
    for (let i = 0; i < n; i++) s += a[(Math.random() * a.length) | 0];
    return s;
}
function randDigits(n = 4) {
    let s = '';
    for (let i = 0; i < n; i++) s += (Math.random() * 10) | 0;
    return s;
}
function genNick(pattern) {
    return (pattern || 'dq_%s%n')
        .replace(/%s/g, randLetters(4))
        .replace(/%n/g, randDigits(4));
}

/* ---------- default lists (auto + fallback) ---------- */
const DEFAULT_CASES = [
    'Starter Case', 'Common Case', 'Rare Case', 'Epic Case',
    'Legendary Case', 'Mythic Case', 'Domofon Case', 'Creator Case'
];
const DEFAULT_DOMOFONS = [
    'Domofon Raid vizit', 'Domofon Standard', 'Domofon Elite',
    'Domofon Premium', 'Domofon VIP', 'Domofon Prime',
    'Domofon Legend', 'Domofon Gold'
];

/* ---------- state ---------- */
const state = {
    autoUnban: false,
    autoUnbanTimer: null,
    running: false,
    stopFlag: false,
    cfg: {
        autoReg:      { count: 5,  pattern: 'dq_%s%n' },
        autoRegCode:  { count: 5,  pattern: 'dq_%s%n', code: DEFAULT_AUTHCODE },
        autoCase:     { caseName: DEFAULT_CASES[0], perBatch: 1, total: 10 },
        rp:           {} // domofon -> dataURL
    }
};

/* load saved */
try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (saved) Object.assign(state.cfg, saved);
} catch (e) {}

function saveLocal() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state.cfg)); } catch (e) {}
}

/* ============================================================
   CSS
   ============================================================ */
const CSS = `
#dfc-root, #dfc-root * { box-sizing: border-box; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
#dfc-splash {
    position: fixed; inset: 0; z-index: 2147483646;
    background: radial-gradient(circle at 50% 40%, #1a1030 0%, #05050a 70%);
    display: flex; align-items: center; justify-content: center;
    animation: dfcFade .3s ease;
}
@keyframes dfcFade { from { opacity: 0 } to { opacity: 1 } }
.dfc-splash-box {
    text-align: center; padding: 40px 50px; border-radius: 18px;
    background: rgba(15,15,25,.85);
    border: 1px solid rgba(140,90,255,.35);
    box-shadow: 0 0 60px rgba(140,90,255,.35), inset 0 0 30px rgba(140,90,255,.08);
    min-width: 360px;
}
.dfc-title {
    font-size: 34px; font-weight: 900; letter-spacing: 3px;
    background: linear-gradient(90deg, #b389ff, #7a4dff, #4dc9ff);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    margin-bottom: 6px;
    text-shadow: 0 0 30px rgba(140,90,255,.5);
    animation: dfcGlow 2.4s ease-in-out infinite alternate;
}
@keyframes dfcGlow {
    from { filter: drop-shadow(0 0 4px rgba(140,90,255,.5)); }
    to   { filter: drop-shadow(0 0 18px rgba(140,90,255,.9)); }
}
.dfc-sub { font-size: 12px; color: #8a8aa8; letter-spacing: 4px; margin-bottom: 26px; }
.dfc-splash-box input {
    width: 100%; padding: 12px 14px; border-radius: 10px;
    background: #0d0d16; border: 1px solid #2a2a44; color: #e8e8ff;
    outline: none; font-size: 14px; letter-spacing: 2px; text-align: center;
}
.dfc-splash-box input:focus { border-color: #7a4dff; box-shadow: 0 0 0 2px rgba(122,77,255,.25); }
.dfc-splash-box button {
    margin-top: 14px; width: 100%; padding: 12px;
    border: none; border-radius: 10px; cursor: pointer;
    background: linear-gradient(90deg, #7a4dff, #4dc9ff);
    color: #fff; font-weight: 700; letter-spacing: 1px;
    transition: transform .15s ease, box-shadow .15s ease;
}
.dfc-splash-box button:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(122,77,255,.4); }
.dfc-err { color: #ff5577; font-size: 12px; margin-top: 10px; min-height: 14px; }
.dfc-shake { animation: dfcShake .35s; }
@keyframes dfcShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }

/* panel */
#dfc-panel {
    position: fixed; top: 60px; right: 30px; width: 400px;
    background: linear-gradient(180deg, #101021 0%, #0a0a15 100%);
    border: 1px solid rgba(122,77,255,.35);
    border-radius: 14px; z-index: 2147483645;
    box-shadow: 0 20px 60px rgba(0,0,0,.7), 0 0 40px rgba(122,77,255,.15);
    color: #d9d9f2; user-select: none; overflow: hidden;
    animation: dfcFade .25s ease;
}
.dfc-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 14px; cursor: move;
    background: linear-gradient(90deg, rgba(122,77,255,.22), rgba(77,201,255,.10));
    border-bottom: 1px solid rgba(122,77,255,.25);
}
.dfc-head h2 {
    margin: 0; font-size: 15px; letter-spacing: 2px; font-weight: 800;
    background: linear-gradient(90deg, #b389ff, #4dc9ff);
    -webkit-background-clip: text; background-clip: text; color: transparent;
}
.dfc-head-btns button {
    background: transparent; border: 1px solid #2a2a44; color: #9a9ac0;
    width: 26px; height: 26px; border-radius: 7px; cursor: pointer; margin-left: 6px;
    transition: .15s;
}
.dfc-head-btns button:hover { background: #7a4dff; color: #fff; border-color: #7a4dff; }

.dfc-tabs { display: flex; padding: 8px 10px 0; gap: 6px; }
.dfc-tab {
    flex: 1; padding: 9px 0; text-align: center; cursor: pointer;
    border-radius: 9px 9px 0 0; font-size: 13px; font-weight: 700;
    color: #7a7a9c; letter-spacing: 1px;
    background: #12121f; border: 1px solid transparent; border-bottom: none;
    transition: .18s;
}
.dfc-tab:hover { color: #c2c2e8; }
.dfc-tab.active {
    color: #fff;
    background: linear-gradient(180deg, rgba(122,77,255,.35), rgba(122,77,255,.08));
    border-color: rgba(122,77,255,.45);
    box-shadow: inset 0 2px 0 #7a4dff;
}

.dfc-body { padding: 14px; min-height: 240px; max-height: 520px; overflow-y: auto; }
.dfc-body::-webkit-scrollbar { width: 8px; }
.dfc-body::-webkit-scrollbar-thumb { background: #2a2a44; border-radius: 8px; }

.dfc-pane { display: none; }
.dfc-pane.active { display: block; animation: dfcFade .2s ease; }

.dfc-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px;
    background: #12121f; border: 1px solid #1e1e33; border-radius: 10px; margin-bottom: 10px; }
.dfc-row .lbl { font-size: 13px; font-weight: 600; }
.dfc-row .desc { font-size: 11px; color: #6a6a8c; margin-top: 2px; }

/* toggle */
.dfc-switch { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
.dfc-switch input { display: none; }
.dfc-switch label { position: absolute; inset: 0; background: #2a2a44; border-radius: 24px; cursor: pointer; transition: .2s; }
.dfc-switch label::after { content:''; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
    background: #777; border-radius: 50%; transition: .2s; }
.dfc-switch input:checked + label { background: linear-gradient(90deg,#7a4dff,#4dc9ff); }
.dfc-switch input:checked + label::after { left: 23px; background: #fff; }

/* big buttons */
.dfc-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
.dfc-btn {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 16px; border-radius: 12px; cursor: pointer; border: 1px solid #23233c;
    background: linear-gradient(135deg, #15152a, #0f0f1e);
    color: #dcdcff; font-weight: 700; font-size: 13px; letter-spacing: .5px;
    transition: .18s; user-select: none;
}
.dfc-btn:hover { transform: translateY(-1px); border-color: rgba(122,77,255,.5); box-shadow: 0 8px 20px rgba(122,77,255,.18); }
.dfc-btn .sub { font-size: 10px; color: #6a6a8c; font-weight: 500; letter-spacing: 0; margin-top: 2px;}
.dfc-btn .state { font-size: 11px; padding: 3px 8px; border-radius: 6px; background: #23233c; color: #9a9ac0; }
.dfc-btn.running { border-color: #ff5577; }
.dfc-btn.running .state { background: #3a1020; color: #ff5577; }
.dfc-btn.stop { background: linear-gradient(135deg,#3a1020,#200a12); border-color: #ff5577; color: #ff9ab0; }

.dfc-note { font-size: 11px; color: #6a6a8c; text-align: center; margin-top: 8px; }

/* RP */
.dfc-rp-list { max-height: 340px; overflow-y: auto; padding-right: 4px; }
.dfc-rp-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; background: #12121f; border: 1px solid #1e1e33;
    border-radius: 10px; margin-bottom: 8px;
}
.dfc-rp-item .name { flex: 1; font-size: 12px; font-weight: 600; }
.dfc-rp-item .preview { width: 34px; height: 34px; border-radius: 8px; background: #0a0a15;
    border: 1px solid #23233c; object-fit: cover; flex-shrink: 0; }
.dfc-mini {
    padding: 6px 10px; border-radius: 8px; border: 1px solid #2a2a44;
    background: #181828; color: #c2c2e8; font-size: 11px; cursor: pointer;
    transition: .15s; white-space: nowrap;
}
.dfc-mini:hover { background: #7a4dff; border-color: #7a4dff; color: #fff; }
.dfc-mini.danger:hover { background: #ff5577; border-color: #ff5577; }

.dfc-io { display: flex; gap: 8px; margin-top: 12px; }
.dfc-io .dfc-mini { flex: 1; text-align: center; padding: 10px; }

/* modal */
.dfc-modal {
    position: fixed; inset: 0; z-index: 2147483647;
    background: rgba(0,0,0,.65); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    animation: dfcFade .18s ease;
}
.dfc-modal-box {
    width: 340px; background: linear-gradient(180deg,#12121f,#0a0a15);
    border: 1px solid rgba(122,77,255,.4); border-radius: 14px; padding: 18px;
    box-shadow: 0 20px 60px rgba(0,0,0,.8);
    color: #dcdcff;
}
.dfc-modal-box h3 {
    margin: 0 0 14px; font-size: 15px; letter-spacing: 1px;
    background: linear-gradient(90deg,#b389ff,#4dc9ff);
    -webkit-background-clip: text; background-clip: text; color: transparent;
}
.dfc-field { margin-bottom: 12px; }
.dfc-field label { display: block; font-size: 11px; color: #8a8aa8; margin-bottom: 5px; letter-spacing: .5px; }
.dfc-field input, .dfc-field select {
    width: 100%; padding: 9px 11px; border-radius: 9px;
    background: #0a0a15; border: 1px solid #23233c; color: #e8e8ff; font-size: 13px;
    outline: none; transition: .15s;
}
.dfc-field input:focus, .dfc-field select:focus { border-color: #7a4dff; box-shadow: 0 0 0 2px rgba(122,77,255,.2); }
.dfc-modal-actions { display: flex; gap: 8px; margin-top: 6px; }
.dfc-modal-actions button {
    flex: 1; padding: 10px; border-radius: 9px; cursor: pointer;
    border: 1px solid #2a2a44; background: #181828; color: #c2c2e8;
    font-weight: 700; font-size: 12px; transition: .15s;
}
.dfc-modal-actions button.primary {
    background: linear-gradient(90deg,#7a4dff,#4dc9ff); border-color: transparent; color: #fff;
}
.dfc-modal-actions button:hover { transform: translateY(-1px); }
`;

/* ============================================================
   SPLASH
   ============================================================ */
function showSplash() {
    return new Promise(resolve => {
        const s = document.createElement('div');
        s.id = 'dfc-splash';
        s.innerHTML = `
            <div class="dfc-splash-box">
                <div class="dfc-title">DOMOFON CHEAT</div>
                <div class="dfc-sub">ENTER ACCESS KEY</div>
                <input type="password" id="dfcKeyInput" placeholder="• • • • • • • • • •" autocomplete="off">
                <button id="dfcKeyBtn">ВОЙТИ</button>
                <div class="dfc-err" id="dfcKeyErr"></div>
            </div>
        `;
        document.body.appendChild(s);

        const input = $('#dfcKeyInput', s);
        const err   = $('#dfcKeyErr', s);
        const box   = $('.dfc-splash-box', s);
        input.focus();

        function tryKey() {
            if (input.value.trim() === KEY) {
                s.style.transition = 'opacity .25s';
                s.style.opacity = '0';
                setTimeout(() => { s.remove(); resolve(true); }, 260);
            } else {
                err.textContent = 'Неверный ключ доступа';
                box.classList.remove('dfc-shake');
                void box.offsetWidth;
                box.classList.add('dfc-shake');
                input.value = '';
                input.focus();
            }
        }
        $('#dfcKeyBtn', s).addEventListener('click', tryKey);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') tryKey(); });
    });
}

/* ============================================================
   PANEL
   ============================================================ */
function buildPanel() {
    const root = document.createElement('div');
    root.id = 'dfc-root';
    root.innerHTML = `
        <div id="dfc-panel">
            <div class="dfc-head" id="dfcHead">
                <h2>DOMOFON CHEAT</h2>
                <div class="dfc-head-btns">
                    <button id="dfcMin" title="Свернуть">—</button>
                    <button id="dfcClose" title="Закрыть">✕</button>
                </div>
            </div>
            <div class="dfc-tabs">
                <div class="dfc-tab active" data-tab="utils">Utils</div>
                <div class="dfc-tab" data-tab="auto">Auto</div>
                <div class="dfc-tab" data-tab="rp">RP</div>
            </div>
            <div class="dfc-body">

                <!-- UTILS -->
                <div class="dfc-pane active" data-pane="utils">
                    <div class="dfc-row">
                        <div>
                            <div class="lbl">Auto UnBan</div>
                            <div class="desc">Каждые 3 секунды удаляет окно блокировки</div>
                        </div>
                        <div class="dfc-switch">
                            <input type="checkbox" id="dfcUnban">
                            <label for="dfcUnban"></label>
                        </div>
                    </div>
                    <div class="dfc-note">ПКМ по кнопкам Auto — открыть настройки</div>
                </div>

                <!-- AUTO -->
                <div class="dfc-pane" data-pane="auto">
                    <div class="dfc-grid">
                        <div class="dfc-btn" data-action="autoreg">
                            <div>
                                <div>AutoReg</div>
                                <div class="sub">Регистрация аккаунтов</div>
                            </div>
                            <div class="state">5</div>
                        </div>
                        <div class="dfc-btn" data-action="autoregcode">
                            <div>
                                <div>AutoReg + Code</div>
                                <div class="sub">Регистрация + код автора</div>
                            </div>
                            <div class="state">5</div>
                        </div>
                        <div class="dfc-btn" data-action="autocase">
                            <div>
                                <div>AutoCase</div>
                                <div class="sub">Автооткрытие кейса</div>
                            </div>
                            <div class="state">×1</div>
                        </div>
                    </div>
                    <div class="dfc-note">Задержка действий: 0.5 сек</div>
                </div>

                <!-- RP -->
                <div class="dfc-pane" data-pane="rp">
                    <div class="dfc-rp-list" id="dfcRpList"></div>
                    <div class="dfc-io">
                        <button class="dfc-mini" id="dfcSaveCfg">💾 Сохранить конфиг</button>
                        <button class="dfc-mini" id="dfcLoadCfg">📂 Загрузить конфиг</button>
                    </div>
                    <input type="file" id="dfcFileTex" accept="image/*" style="display:none">
                    <input type="file" id="dfcFileCfg" accept="application/json,.json" style="display:none">
                </div>

            </div>
        </div>
    `;
    document.body.appendChild(root);

    /* ---------- tab switching ---------- */
    $$('.dfc-tab', root).forEach(t => {
        t.addEventListener('click', () => {
            $$('.dfc-tab', root).forEach(x => x.classList.remove('active'));
            $$('.dfc-pane', root).forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            $(`.dfc-pane[data-pane="${t.dataset.tab}"]`, root).classList.add('active');
        });
    });

    /* ---------- dragging ---------- */
    (function makeDraggable() {
        const head = $('#dfcHead', root);
        const panel = $('#dfc-panel', root);
        let dragging = false, ox = 0, oy = 0;
        head.addEventListener('mousedown', e => {
            if (e.target.tagName === 'BUTTON') return;
            dragging = true;
            const r = panel.getBoundingClientRect();
            ox = e.clientX - r.left; oy = e.clientY - r.top;
            panel.style.right = 'auto';
            panel.style.left = r.left + 'px';
            panel.style.top  = r.top  + 'px';
        });
        window.addEventListener('mousemove', e => {
            if (!dragging) return;
            panel.style.left = (e.clientX - ox) + 'px';
            panel.style.top  = (e.clientY - oy) + 'px';
        });
        window.addEventListener('mouseup', () => dragging = false);
    })();

    /* ---------- minimize / close ---------- */
    $('#dfcMin', root).addEventListener('click', () => {
        const body = $('.dfc-body', root);
        body.style.display = body.style.display === 'none' ? '' : 'none';
    });
    $('#dfcClose', root).addEventListener('click', () => destroy());

    /* ---------- Auto UnBan ---------- */
    const unban = $('#dfcUnban', root);
    unban.addEventListener('change', () => {
        state.autoUnban = unban.checked;
        if (state.autoUnban) startUnban(); else stopUnban();
    });

    /* ---------- Auto buttons ---------- */
    $$('.dfc-btn[data-action]', root).forEach(btn => {
        btn.addEventListener('click', e => {
            if (e.button !== 0) return;
            handleAuto(btn.dataset.action, btn);
        });
        btn.addEventListener('contextmenu', e => {
            e.preventDefault();
            openSettings(btn.dataset.action, btn);
        });
    });

    /* ---------- RP ---------- */
    renderRP(root);
    $('#dfcSaveCfg', root).addEventListener('click', saveConfigFile);
    $('#dfcLoadCfg', root).addEventListener('click', () => $('#dfcFileCfg', root).click());

    $('#dfcFileCfg', root).addEventListener('change', e => {
        const f = e.target.files[0]; if (!f) return;
        const r = new FileReader();
        r.onload = () => {
            try {
                const data = JSON.parse(r.result);
                Object.assign(state.cfg, data);
                saveLocal();
                refreshButtonStates(root);
                renderRP(root);
                toast('Конфиг загружен');
            } catch (err) { toast('Ошибка загрузки конфига', true); }
        };
        r.readAsText(f);
        e.target.value = '';
    });

    $('#dfcFileTex', root).addEventListener('change', e => {
        const f = e.target.files[0]; if (!f) return;
        const dom = e.target.dataset.domofon;
        const r = new FileReader();
        r.onload = () => {
            state.cfg.rp[dom] = r.result;
            saveLocal();
            renderRP(root);
            toast('Текстура загружена: ' + dom);
        };
        r.readAsDataURL(f);
        e.target.value = '';
    });

    refreshButtonStates(root);
    return root;
}

/* ============================================================
   AUTO UNBAN
   ============================================================ */
function startUnban() {
    stopUnban();
    state.autoUnbanTimer = setInterval(() => {
        const ov = document.getElementById('banScreenOverlay');
        if (ov) {
            ov.style.display = 'none';
            ov.remove();
            console.log('%c[DFC] Ban screen removed', 'color:#b389ff');
        }
    }, 3000);
}
function stopUnban() {
    if (state.autoUnbanTimer) clearInterval(state.autoUnbanTimer);
    state.autoUnbanTimer = null;
}

/* ============================================================
   AUTO HANDLERS
   ============================================================ */
async function handleAuto(action, btn) {
    if (state.running) {
        state.stopFlag = true;
        btn.classList.remove('running');
        return;
    }
    const stateEl = $('.state', btn);
    btn.classList.add('running');
    stateEl.textContent = 'STOP';
    state.running = true;
    state.stopFlag = false;

    try {
        if (action === 'autoreg')     await runAutoReg(false, btn, stateEl);
        if (action === 'autoregcode') await runAutoReg(true,  btn, stateEl);
        if (action === 'autocase')    await runAutoCase(btn, stateEl);
    } catch (e) {
        console.error('[DFC]', e);
    } finally {
        state.running = false;
        state.stopFlag = false;
        btn.classList.remove('running');
        refreshButtonStates(document);
    }
}

async function runAutoReg(withCode, btn, stateEl) {
    const c = withCode ? state.cfg.autoRegCode : state.cfg.autoReg;
    const total = c.count;

    for (let i = 1; i <= total; i++) {
        if (state.stopFlag) break;
        stateEl.textContent = `${i}/${total}`;

        const nick = genNick(c.pattern);

        // 1. open profile
        const openBtn = await waitFor('#openProfileBtn');
        if (!openBtn) throw new Error('openProfileBtn not found');
        openBtn.click();
        await sleep(DELAY);

        // 2. fill login & password
        const login = await waitFor('#authLoginInput');
        const pass  = await waitFor('#authPassInput');
        if (!login || !pass) throw new Error('auth inputs not found');
        setVal(login, nick);
        setVal(pass, DEFAULT_PASS);
        await sleep(120);

        // 3. register
        const regBtn = await waitFor('#registerSubmitBtn');
        if (!regBtn) throw new Error('registerSubmitBtn not found');
        regBtn.click();
        await sleep(DELAY);

        // 4. creator tab + code
        if (withCode) {
            const creatorTab = await waitFor('[data-tab="creator"]');
            if (creatorTab) creatorTab.click();
            await sleep(DELAY);

            const codeInput = await waitFor('#authorCodeInput');
            if (codeInput) {
                setVal(codeInput, c.code || DEFAULT_AUTHCODE);
                await sleep(80);
                const submit = await waitFor('#submitAuthorCodeBtn');
                if (submit) submit.click();
            }
            await sleep(DELAY);
        }

        // 5. open profile again
        const openBtn2 = await waitFor('#openProfileBtn');
        if (openBtn2) openBtn2.click();
        await sleep(DELAY);

        // 6. logout
        const logout = await waitFor('#logoutBtn');
        if (logout) logout.click();
        await sleep(DELAY);

        console.log(`%c[DFC] Аккаунт ${i}/${total}: ${nick} / ${DEFAULT_PASS}`, 'color:#4dc9ff');
    }
    toast('AutoReg завершён');
}

/* -------- AutoCase (best-effort generic) -------- */
async function runAutoCase(btn, stateEl) {
    const c = state.cfg.autoCase;
    let opened = 0;

    for (let round = 0; opened < c.total; round++) {
        if (state.stopFlag) break;

        // find & click case card
        const card = findCaseElement(c.caseName);
        if (card) {
            card.click();
            await sleep(DELAY);
        } else {
            console.warn('[DFC] Кейс не найден:', c.caseName);
        }

        for (let b = 0; b < c.perBatch && opened < c.total; b++) {
            if (state.stopFlag) break;
            const openBtn = findOpenButton();
            if (openBtn) {
                openBtn.click();
                opened++;
                stateEl.textContent = `${opened}/${c.total}`;
                await sleep(DELAY);
            } else {
                console.warn('[DFC] Кнопка открытия не найдена');
                await sleep(DELAY);
            }
        }
        await sleep(DELAY);
    }
    toast('AutoCase завершён');
}

function findCaseElement(name) {
    if (!name) return null;
    const all = $$('.case-card, .case-item, .case, [data-case], [data-case-id], [data-name]');
    for (const el of all) {
        const n = (el.dataset.case || el.dataset.caseId || el.dataset.name ||
                   (el.querySelector('h3,h4,.title,.case-name')?.textContent) ||
                   el.textContent || '').trim().toLowerCase();
        if (n.includes(name.toLowerCase())) return el;
    }
    return null;
}
function findOpenButton() {
    const sels = [
        '#openCaseBtn', '.open-case-btn', '[data-action="open"]',
        '.case-open-btn', '#caseOpenBtn', 'button.open-btn'
    ];
    for (const s of sels) {
        const el = $(s);
        if (el && !el.disabled) return el;
    }
    // fallback: any button with "открыть"
    const all = $$('button');
    for (const b of all) {
        if (/открыть|open/i.test(b.textContent) && !b.disabled) return b;
    }
    return null;
}

/* ============================================================
   SETTINGS MODALS
   ============================================================ */
function openSettings(action, btn) {
    const isReg   = action === 'autoreg' || action === 'autoregcode';
    const isCase  = action === 'autocase';

    const title =
        action === 'autoreg'     ? 'AutoReg — настройки' :
        action === 'autoregcode' ? 'AutoReg + Code — настройки' :
                                   'AutoCase — настройки';

    let html = `<h3>${title}</h3>`;

    if (isReg) {
        const c = action === 'autoreg' ? state.cfg.autoReg : state.cfg.autoRegCode;
        html += `
            <div class="dfc-field">
                <label>Сколько аккаунтов</label>
                <input type="number" id="dfcSetCount" value="${c.count}" min="1">
            </div>
            <div class="dfc-field">
                <label>Шаблон ника (%s — 4 буквы, %n — 4 цифры)</label>
                <input type="text" id="dfcSetPattern" value="${c.pattern}">
            </div>
        `;
        if (action === 'autoregcode') {
            html += `
                <div class="dfc-field">
                    <label>Код автора</label>
                    <input type="text" id="dfcSetCode" value="${c.code}">
                </div>
            `;
        }
    }

    if (isCase) {
        const c = state.cfg.autoCase;
        const cases = detectCases();
        const opts = cases.map(n =>
            `<option value="${n}" ${n === c.caseName ? 'selected' : ''}>${n}</option>`
        ).join('');
        html += `
            <div class="dfc-field">
                <label>Кейс</label>
                <select id="dfcSetCase">${opts}</select>
            </div>
            <div class="dfc-field">
                <label>Сколько за раз</label>
                <input type="number" id="dfcSetPerBatch" value="${c.perBatch}" min="1">
            </div>
            <div class="dfc-field">
                <label>Всего раз</label>
                <input type="number" id="dfcSetTotal" value="${c.total}" min="1">
            </div>
        `;
    }

    html += `
        <div class="dfc-modal-actions">
            <button id="dfcSetCancel">Отмена</button>
            <button class="primary" id="dfcSetOk">Сохранить</button>
        </div>
    `;

    const m = document.createElement('div');
    m.className = 'dfc-modal';
    m.innerHTML = `<div class="dfc-modal-box">${html}</div>`;
    document.body.appendChild(m);

    $('#dfcSetCancel', m).addEventListener('click', () => m.remove());
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });

    $('#dfcSetOk', m).addEventListener('click', () => {
        if (isReg) {
            const c = action === 'autoreg' ? state.cfg.autoReg : state.cfg.autoRegCode;
            c.count   = Math.max(1, parseInt($('#dfcSetCount', m).value)   || 1);
            c.pattern = $('#dfcSetPattern', m).value || 'dq_%s%n';
            if (action === 'autoregcode') {
                c.code = ($('#dfcSetCode', m).value || DEFAULT_AUTHCODE).toUpperCase();
            }
        }
        if (isCase) {
            state.cfg.autoCase.caseName = $('#dfcSetCase', m).value;
            state.cfg.autoCase.perBatch = Math.max(1, parseInt($('#dfcSetPerBatch', m).value) || 1);
            state.cfg.autoCase.total    = Math.max(1, parseInt($('#dfcSetTotal', m).value)    || 1);
        }
        saveLocal();
        refreshButtonStates(document);
        m.remove();
        toast('Настройки сохранены');
    });
}

function refreshButtonStates(root) {
    const r = root || document;
    const b1 = $('.dfc-btn[data-action="autoreg"]', r);
    const b2 = $('.dfc-btn[data-action="autoregcode"]', r);
    const b3 = $('.dfc-btn[data-action="autocase"]', r);
    if (b1 && !b1.classList.contains('running')) $('.state', b1).textContent = state.cfg.autoReg.count;
    if (b2 && !b2.classList.contains('running')) $('.state', b2).textContent = state.cfg.autoRegCode.count;
    if (b3 && !b3.classList.contains('running')) $('.state', b3).textContent = `×${state.cfg.autoCase.perBatch}`;
}

/* ============================================================
   RP TAB
   ============================================================ */
function detectCases() {
    const found = new Set(DEFAULT_CASES);
    const sels = ['.case-card', '.case-item', '.case', '[data-case]', '[data-case-id]', '.cases-grid > *'];
    sels.forEach(s => {
        $$(s).forEach(el => {
            const n = el.dataset.case || el.dataset.caseId || el.dataset.name ||
                      (el.querySelector('h3,h4,.title,.case-name')?.textContent) ||
                      el.textContent || '';
            const clean = n.trim().slice(0, 40);
            if (clean) found.add(clean);
        });
    });
    return Array.from(found);
}

function detectDomofons() {
    const found = new Set(DEFAULT_DOMOFONS);
    const sels = ['.domofon', '.domofon-card', '[data-domofon]', '[data-domofon-id]', '.rp-item'];
    sels.forEach(s => {
        $$(s).forEach(el => {
            const n = el.dataset.domofon || el.dataset.domofonId || el.dataset.name ||
                      (el.querySelector('h3,h4,.title,.name')?.textContent) ||
                      el.textContent || '';
            const clean = n.trim().slice(0, 40);
            if (clean) found.add(clean);
        });
    });
    return Array.from(found);
}

function renderRP(root) {
    const list = $('#dfcRpList', root);
    if (!list) return;
    list.innerHTML = '';
    const domofons = detectDomofons();

    domofons.forEach(name => {
        const img = state.cfg.rp[name];
        const row = document.createElement('div');
        row.className = 'dfc-rp-item';
        row.innerHTML = `
            ${img ? `<img class="preview" src="${img}">` : `<div class="preview"></div>`}
            <div class="name">${name}</div>
            <button class="dfc-mini" data-load="${name}">Загрузить</button>
            ${img ? `<button class="dfc-mini danger" data-clear="${name}">✕</button>` : ''}
        `;
        list.appendChild(row);
    });

    list.querySelectorAll('[data-load]').forEach(b => {
        b.addEventListener('click', () => {
            const fi = $('#dfcFileTex', root);
            fi.dataset.domofon = b.dataset.load;
            fi.click();
        });
    });
    list.querySelectorAll('[data-clear]').forEach(b => {
        b.addEventListener('click', () => {
            delete state.cfg.rp[b.dataset.clear];
            saveLocal();
            renderRP(root);
        });
    });

    applyRPTextures();
}

function applyRPTextures() {
    // try to apply saved textures to matching domofon images on the page
    Object.entries(state.cfg.rp).forEach(([name, data]) => {
        const imgs = $$('img');
        imgs.forEach(im => {
            const alt = (im.alt || '').toLowerCase();
            const src = (im.src || '').toLowerCase();
            const n   = name.toLowerCase();
            if (alt.includes(n) || src.includes(n.replace(/\s+/g, ''))) {
                im.src = data;
            }
        });
    });
}

/* ============================================================
   SAVE / LOAD CONFIG FILE
   ============================================================ */
function saveConfigFile() {
    const data = JSON.stringify(state.cfg, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'domofon-cheat-config.json';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Конфиг сохранён в файл');
}

/* ============================================================
   TOAST
   ============================================================ */
function toast(msg, isError) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
        position: 'fixed', bottom: '24px', right: '24px', zIndex: 2147483647,
        padding: '11px 16px', borderRadius: '10px',
        background: isError ? 'linear-gradient(90deg,#ff5577,#ff2255)' : 'linear-gradient(90deg,#7a4dff,#4dc9ff)',
        color: '#fff', fontWeight: '700', fontSize: '12px', letterSpacing: '.5px',
        boxShadow: '0 10px 30px rgba(0,0,0,.5)', transition: 'opacity .3s', opacity: '0'
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => t.style.opacity = '1');
    setTimeout(() => {
        t.style.opacity = '0';
        setTimeout(() => t.remove(), 320);
    }, 1800);
}

/* ============================================================
   DESTROY
   ============================================================ */
function destroy() {
    stopUnban();
    state.stopFlag = true;
    const r = document.getElementById('dfc-root');
    if (r) r.remove();
    const s = document.getElementById('dfc-splash');
    if (s) s.remove();
    window.__DFC__ = null;
}

/* ============================================================
   INIT
   ============================================================ */
(async function init() {
    // inject CSS
    const style = document.createElement('style');
    style.id = 'dfc-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    await showSplash();
    buildPanel();

    window.__DFC__ = { destroy, state };
    console.log('%c[DOMOFON CHEAT] loaded', 'color:#b389ff;font-weight:bold;font-size:14px');
})();

})();
