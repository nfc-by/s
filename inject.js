(function () {
    'use strict';
    if (window.__dfCheat) { console.log('Domofon Cheat уже запущен'); return; }
    window.__dfCheat = true;

    const KEY = 'cfgdqmjrka';
    const PASSWORD = 'Kojab777';

    // ============ СТИЛИ ============
    const style = document.createElement('style');
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    .dfu, .dfu * { font-family: 'Inter', -apple-system, sans-serif !important; box-sizing: border-box; }
    .dfu { position: fixed; z-index: 2147483647; color: #fff; }
    #dfLoader, #dfKey { top:0; left:0; width:100vw; height:100vh; display:flex; align-items:center; justify-content:center; flex-direction:column;
        background: radial-gradient(circle at 50% 30%, #12121c 0%, #050508 100%); animation: dfFade .4s ease; }
    .df-logo { font-size: 56px; font-weight: 900; letter-spacing: -2px;
        background: linear-gradient(135deg, #00e676 0%, #00b0ff 50%, #b388ff 100%);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 30px rgba(0,230,118,.4)); animation: dfPulse 2.4s ease-in-out infinite; }
    .df-sub { font-size: 11px; color: #555; letter-spacing: 8px; text-transform: uppercase; margin-top: 4px; }
    .df-bar { width: 340px; height: 3px; background: #17171f; border-radius: 3px; overflow: hidden; margin-top: 40px; }
    .df-bar-fill { height:100%; width:0%; background: linear-gradient(90deg,#00e676,#00b0ff,#b388ff);
        border-radius: 3px; box-shadow: 0 0 16px #00e676; transition: width .3s ease; }
    .df-bar-text { margin-top: 14px; font-size: 11px; color: #444; font-family: monospace; letter-spacing: 1px; min-height: 14px; }
    @keyframes dfFade { from { opacity:0 } to { opacity:1 } }
    @keyframes dfPulse { 0%,100% { filter: drop-shadow(0 0 20px rgba(0,230,118,.5)); } 50% { filter: drop-shadow(0 0 40px rgba(0,176,255,.7)); } }
    @keyframes dfUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }

    .df-box { background: rgba(14,14,20,.95); border: 1px solid #1e1e28; border-radius: 18px;
        padding: 36px; width: 400px; box-shadow: 0 30px 80px rgba(0,0,0,.9), 0 0 60px rgba(0,230,118,.06); backdrop-filter: blur(20px); }
    .df-box h2 { margin: 0 0 6px; font-size: 20px; font-weight: 800; }
    .df-box p { margin: 0 0 22px; font-size: 12px; color: #666; }
    .df-in { width: 100%; background: #08080e; border: 1px solid #23232f; color: #fff; padding: 14px 16px;
        border-radius: 10px; font-size: 13px; font-family: 'Courier New', monospace; outline: none;
        letter-spacing: 3px; transition: all .2s; text-transform: lowercase; }
    .df-in:focus { border-color: #00e676; box-shadow: 0 0 0 3px rgba(0,230,118,.12); }
    .df-btn { background: linear-gradient(135deg, #00e676, #00b0ff); color: #041208; border: none;
        padding: 14px 20px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer;
        width: 100%; margin-top: 14px; letter-spacing: 1.5px; text-transform: uppercase; transition: all .2s; }
    .df-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(0,230,118,.4); }
    .df-btn:active { transform: translateY(0); }
    .df-btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
    .df-btn-sec { background: #1a1a24; color: #fff; }
    .df-btn-sec:hover { background: #23232f; box-shadow: none; }
    .df-err { color: #ff5252; font-size: 11px; margin-top: 12px; text-align: center; min-height: 14px; font-weight: 600; }

    /* Main Panel */
    #dfPanel { top: 20px; right: 20px; width: 400px; background: rgba(12,12,18,.96);
        border: 1px solid #1e1e28; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,.85), 0 0 40px rgba(0,230,118,.06);
        backdrop-filter: blur(20px); overflow: hidden; display: none; flex-direction: column; animation: dfUp .3s ease; }
    .df-head { padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;
        border-bottom: 1px solid #1e1e28; cursor: move; user-select: none;
        background: linear-gradient(135deg, rgba(0,230,118,.06), rgba(179,136,255,.06)); }
    .df-head-title { font-size: 15px; font-weight: 900; letter-spacing: -.3px;
        background: linear-gradient(135deg, #00e676, #b388ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .df-head-dot { display:inline-block; width:7px; height:7px; border-radius:50%; background:#00e676; margin-right:8px;
        box-shadow: 0 0 10px #00e676; animation: dfPulse 2s infinite; vertical-align: middle; }
    .df-x { background: transparent; border: none; color: #555; font-size: 22px; cursor: pointer; padding: 0 6px; line-height: 1; transition: color .2s; }
    .df-x:hover { color: #ff5252; }
    .df-tabs { display: flex; background: #0a0a10; border-bottom: 1px solid #1e1e28; }
    .df-tab { flex: 1; background: transparent; border: none; color: #555; padding: 13px 0; font-size: 11px;
        font-weight: 800; cursor: pointer; position: relative; letter-spacing: 1px; text-transform: uppercase; transition: color .2s; }
    .df-tab:hover { color: #999; }
    .df-tab.on { color: #00e676; }
    .df-tab.on::after { content:''; position: absolute; bottom: 0; left: 18%; right: 18%; height: 2px;
        background: linear-gradient(90deg, #00e676, #b388ff); border-radius: 2px 2px 0 0; }
    .df-body { padding: 14px; max-height: 480px; overflow-y: auto; }
    .df-body::-webkit-scrollbar { width: 5px; }
    .df-body::-webkit-scrollbar-thumb { background: #23232f; border-radius: 3px; }
    .df-sec { display: none; } .df-sec.on { display: block; }
    .df-card { background: #101018; border: 1px solid #1c1c26; border-radius: 12px; padding: 12px 14px; margin-bottom: 8px; transition: all .2s; }
    .df-card:hover { border-color: #2a2a38; }
    .df-card-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .df-card-t { font-size: 13px; font-weight: 700; color: #fff; }
    .df-card-d { font-size: 10.5px; color: #666; margin-top: 3px; line-height: 1.5; }
    .df-sw { position: relative; width: 38px; height: 22px; background: #1e1e28; border-radius: 22px; cursor: pointer; transition: all .3s; flex-shrink: 0; }
    .df-sw::after { content:''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: #fff;
        border-radius: 50%; transition: all .3s; box-shadow: 0 2px 4px rgba(0,0,0,.4); }
    .df-sw.on { background: linear-gradient(135deg, #00e676, #00b0ff); }
    .df-sw.on::after { transform: translateX(16px); }

    .df-act { display: flex; align-items: center; gap: 12px; padding: 12px 14px; background: #101018;
        border: 1px solid #1c1c26; border-radius: 12px; margin-bottom: 8px; cursor: pointer; transition: all .2s; user-select: none; }
    .df-act:hover { background: #15151f; border-color: #2a2a38; transform: translateX(2px); }
    .df-act.run { border-color: #00e676; box-shadow: 0 0 0 2px rgba(0,230,118,.15); }
    .df-act-ic { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
        font-size: 15px; flex-shrink: 0;
        background: linear-gradient(135deg, rgba(0,230,118,.12), rgba(179,136,255,.12)); }
    .df-act-info { flex: 1; min-width: 0; }
    .df-act-t { font-size: 13px; font-weight: 700; }
    .df-act-s { font-size: 10px; color: #666; margin-top: 2px; }
    .df-act-r { font-size: 10px; color: #555; font-family: monospace; text-align: right; line-height: 1.4; }
    .df-hint { font-size: 10px; color: #444; text-align: center; margin: 8px 0; font-style: italic; }

    .df-log { background: #07070b; border: 1px solid #1c1c26; border-radius: 10px; padding: 10px;
        height: 110px; overflow-y: auto; font-family: 'Courier New', monospace; font-size: 10px;
        color: #777; margin-top: 8px; line-height: 1.6; }
    .df-log::-webkit-scrollbar { width: 4px; }
    .df-log::-webkit-scrollbar-thumb { background: #23232f; border-radius: 2px; }
    .df-log .ok { color: #00e676; } .df-log .er { color: #ff5252; }
    .df-log .in { color: #00b0ff; } .df-log .tm { color: #333; }

    /* Modal */
    #dfModal { top: 0; left: 0; width: 100vw; height: 100vh; display: none; align-items: center; justify-content: center;
        background: rgba(0,0,0,.75); backdrop-filter: blur(6px); z-index: 2147483646; animation: dfFade .2s; }
    .df-mb { background: #12121a; border: 1px solid #23232f; border-radius: 16px; padding: 24px; width: 380px;
        box-shadow: 0 30px 80px rgba(0,0,0,.9); animation: dfUp .25s ease; }
    .df-mb h3 { margin: 0 0 18px; font-size: 14px; font-weight: 800; color: #00e676; letter-spacing: .5px; text-transform: uppercase; }
    .df-f { margin-bottom: 12px; }
    .df-f label { display: block; font-size: 10px; color: #777; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .8px; font-weight: 700; }
    .df-f input, .df-f select { width: 100%; background: #08080e; border: 1px solid #23232f; color: #fff;
        padding: 10px 12px; border-radius: 8px; font-size: 12px; outline: none; font-family: inherit; transition: border .2s; }
    .df-f input:focus, .df-f select:focus { border-color: #00e676; box-shadow: 0 0 0 3px rgba(0,230,118,.1); }
    .df-mb-actions { display: flex; gap: 8px; margin-top: 18px; }
    .df-mb-actions .df-btn { margin-top: 0; }

    .df-rp-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: #101018;
        border: 1px solid #1c1c26; border-radius: 8px; margin-bottom: 5px; font-size: 11px; }
    .df-rp-name { flex: 1; color: #ccc; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .df-rp-thumb { width: 30px; height: 30px; border-radius: 6px; background: #08080e; border: 1px solid #23232f;
        object-fit: cover; flex-shrink: 0; display: none; }
    .df-rp-thumb.show { display: block; }
    .df-rp-btn { background: #1a1a24; color: #00e676; border: 1px solid #23232f; padding: 5px 10px;
        border-radius: 6px; font-size: 10px; cursor: pointer; font-weight: 700; transition: all .2s; }
    .df-rp-btn:hover { background: #23232f; }
    .df-rp-btn.set { background: rgba(0,230,118,.15); border-color: #00e676; }
    .df-rp-rm { background: transparent; border: none; color: #ff5252; font-size: 15px; cursor: pointer; padding: 0 4px; line-height: 1; }

    .df-save-row { display: flex; gap: 8px; margin-top: 10px; }
    .df-save-row .df-btn { margin-top: 0; font-size: 11px; padding: 10px; }
    `;
    document.head.appendChild(style);

    const $ = s => document.querySelector(s);
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function log(id, msg, type = '') {
        const el = document.getElementById(id);
        if (!el) return;
        const t = new Date().toLocaleTimeString();
        el.innerHTML += `<div><span class="tm">[${t}]</span> <span class="${type}">${msg}</span></div>`;
        el.scrollTop = el.scrollHeight;
    }

    function waitForEl(sel, timeout = 8000) {
        return new Promise((res, rej) => {
            const start = Date.now();
            const iv = setInterval(() => {
                const el = document.querySelector(sel);
                if (el && el.offsetParent !== null) { clearInterval(iv); res(el); }
                else if (Date.now() - start > timeout) { clearInterval(iv); rej(new Error('Нет: ' + sel)); }
            }, 100);
        });
    }

    function setVal(el, val) {
        try {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(el, val);
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        } catch (e) { el.value = val; }
    }

    function rand(len, chars) {
        let s = '';
        for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
        return s;
    }

    function genNick(p) {
        let r = p;
        if (r.includes('%s')) r = r.replace(/%s/g, rand(4, 'abcdefghijklmnopqrstuvwxyz'));
        if (r.includes('%n')) r = r.replace(/%n/g, rand(4, '0123456789'));
        return r;
    }

    function download(filename, text) {
        const a = document.createElement('a');
        a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(text);
        a.download = filename;
        a.click();
    }

    // ============ ДАННЫЕ ============
    const CASES = [
        { id: 'daily_case', name: 'Ежедневный Кейс' },
        { id: 'common_case', name: 'Common Case' },
        { id: 'premium', name: 'Premium Case' },
        { id: 'rare_case', name: 'Rare Case' },
        { id: 'ip_stream_case', name: 'IP-Stream Case' },
        { id: 'black_flagman_case', name: 'Black Flagman Case' },
        { id: 'case_og', name: 'Новый OG' },
        { id: 'quantum_vault', name: 'Quantum Vault' },
        { id: 'ultra_case', name: 'ULTRA Case' }
    ];

    const DOMOFONS = [
        'Domofon Metakom display', 'Domofon Sputnik', 'Domofon Old Cyfral', 'Domofon Raid vizit',
        'Domofon AO-3000', 'Domofon Pozor vizit', 'Domofon Vizit', 'Domofon Vizit display',
        'Domofon Metakom buttons', 'Domofon cyfral tablet', 'Domofon Danil raid', 'Domofon Buttons',
        'Domofon Laskomex', 'Domofon TexKom', 'Domofon Premiu Cyfral', 'Domofon Beward IP Pro',
        'Domofon True IP Master', 'Domofon Broken cyfral', 'Domofon Flagman', 'Domofon Cyber-Key Elite',
        'Domofon ELTIS black', 'Domofon Golden Vizit', 'chease raid', 'Domofon Custom Vizit',
        'Yandex Alisa', 'Domofon Stroy Master'
    ];

    // ============ СОСТОЯНИЕ ============
    const state = {
        autoUnban: false,
        autoUnbanIv: null,
        autoRegRunning: false,
        autoRegCodeRunning: false,
        autoCaseRunning: false,
        config: {
            autoReg: { count: 5, pattern: 'dq_%s%n' },
            autoRegCode: { count: 5, pattern: 'dq_%s%n', code: 'DQMJRKA' },
            autoCase: { caseId: 'common_case', perBatch: 1, total: 10, delay: 800 },
            rp: {}
        }
    };

    // ============ ЗАГРУЗКА ============
    function showLoader(cb) {
        const el = document.createElement('div');
        el.id = 'dfLoader';
        el.className = 'dfu';
        el.innerHTML = `
            <div class="df-logo">Domofon Cheat</div>
            <div class="df-sub">Loading System</div>
            <div class="df-bar"><div class="df-bar-fill" id="dfBarFill"></div></div>
            <div class="df-bar-text" id="dfBarText">Инициализация...</div>
        `;
        document.body.appendChild(el);

        const steps = ['Инициализация...', 'Подключение модулей...', 'Загрузка конфига...', 'Проверка обновлений...', 'Готово!'];
        let i = 0;
        const fill = el.querySelector('#dfBarFill');
        const txt = el.querySelector('#dfBarText');

        const iv = setInterval(() => {
            i++;
            const p = Math.min(100, i * 22);
            fill.style.width = p + '%';
            txt.textContent = steps[Math.min(i - 1, steps.length - 1)];
            if (i >= steps.length) {
                clearInterval(iv);
                setTimeout(() => {
                    el.style.transition = 'opacity .4s';
                    el.style.opacity = '0';
                    setTimeout(() => { el.remove(); cb(); }, 400);
                }, 400);
            }
        }, 350);
    }

    // ============ ЭКРАН КЛЮЧА ============
    function showKeyScreen(onSuccess) {
        const el = document.createElement('div');
        el.id = 'dfKey';
        el.className = 'dfu';
        el.innerHTML = `
            <div class="df-box">
                <h2>🔒 Активация</h2>
                <p>Введите ключ доступа для продолжения</p>
                <input class="df-in" type="password" id="dfKeyInput" placeholder="••••••••••" autocomplete="off">
                <button class="df-btn" id="dfKeyBtn">Активировать</button>
                <div class="df-err" id="dfKeyErr"></div>
            </div>
        `;
        document.body.appendChild(el);

        const inp = el.querySelector('#dfKeyInput');
        const btn = el.querySelector('#dfKeyBtn');
        const err = el.querySelector('#dfKeyErr');

        const check = () => {
            const v = inp.value.trim().toLowerCase();
            if (v === KEY) {
                err.style.color = '#00e676';
                err.textContent = '✓ Доступ разрешён';
                btn.disabled = true;
                setTimeout(() => { el.remove(); onSuccess(); }, 500);
            } else {
                err.textContent = '✗ Неверный ключ';
                inp.style.borderColor = '#ff5252';
                setTimeout(() => inp.style.borderColor = '', 500);
            }
        };

        btn.addEventListener('click', check);
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
        inp.addEventListener('input', () => err.textContent = '');
        setTimeout(() => inp.focus(), 100);
    }

    // ============ ГЛАВНАЯ ПАНЕЛЬ ============
    function showMainPanel() {
        const panel = document.createElement('div');
        panel.id = 'dfPanel';
        panel.className = 'dfu';
        panel.innerHTML = `
            <div class="df-head" id="dfHead">
                <div class="df-head-title"><span class="df-head-dot"></span>Domofon Cheat</div>
                <button class="df-x" id="dfClose">×</button>
            </div>
            <div class="df-tabs">
                <button class="df-tab on" data-tab="utils">Utils</button>
                <button class="df-tab" data-tab="auto">Auto</button>
                <button class="df-tab" data-tab="rp">RP</button>
            </div>
            <div class="df-body">
                <!-- UTILS -->
                <div class="df-sec on" data-sec="utils">
                    <div class="df-card">
                        <div class="df-card-row">
                            <div>
                                <div class="df-card-t">🛡️ Auto UnBan</div>
                                <div class="df-card-d">Автоматически снимает бан-экран каждые 3 секунды</div>
                            </div>
                            <div class="df-sw" id="swUnban"></div>
                        </div>
                    </div>
                    <div class="df-hint">Совет: ПКМ по вкладке Auto — настройка аккаунтов и кейсов</div>
                </div>

                <!-- AUTO -->
                <div class="df-sec" data-sec="auto">
                    <div class="df-act" data-act="autoReg">
                        <div class="df-act-ic">👤</div>
                        <div class="df-act-info">
                            <div class="df-act-t">AutoReg</div>
                            <div class="df-act-s">Автоматическая регистрация аккаунтов</div>
                        </div>
                        <div class="df-act-r" id="stAutoReg">IDLE</div>
                    </div>

                    <div class="df-act" data-act="autoRegCode">
                        <div class="df-act-ic">🎁</div>
                        <div class="df-act-info">
                            <div class="df-act-t">AutoReg + Code</div>
                            <div class="df-act-s">Регистрация + ввод кода автора</div>
                        </div>
                        <div class="df-act-r" id="stAutoRegCode">IDLE</div>
                    </div>

                    <div class="df-act" data-act="autoCase">
                        <div class="df-act-ic">📦</div>
                        <div class="df-act-info">
                            <div class="df-act-t">AutoCase</div>
                            <div class="df-act-s">Авто-открытие выбранного кейса</div>
                        </div>
                        <div class="df-act-r" id="stAutoCase">IDLE</div>
                    </div>

                    <div class="df-log" id="dfLog"></div>
                </div>

                <!-- RP -->
                <div class="df-sec" data-sec="rp">
                    <div id="dfRpList"></div>
                    <div class="df-save-row">
                        <button class="df-btn df-btn-sec" id="dfSaveCfg">💾 Сохранить</button>
                        <button class="df-btn df-btn-sec" id="dfLoadCfg">📁 Загрузить</button>
                    </div>
                    <input type="file" id="dfLoadFile" accept=".json" style="display:none">
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        panel.style.display = 'flex';

        // — Перемещение панели
        (function drag() {
            const head = panel.querySelector('#dfHead');
            let dragging = false, sx, sy, ox, oy;
            head.addEventListener('mousedown', e => {
                if (e.target.id === 'dfClose') return;
                dragging = true;
                const r = panel.getBoundingClientRect();
                panel.style.right = 'auto';
                panel.style.left = r.left + 'px';
                panel.style.top = r.top + 'px';
                sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top;
            });
            document.addEventListener('mousemove', e => {
                if (!dragging) return;
                panel.style.left = (ox + e.clientX - sx) + 'px';
                panel.style.top = (oy + e.clientY - sy) + 'px';
            });
            document.addEventListener('mouseup', () => dragging = false);
        })();

        panel.querySelector('#dfClose').addEventListener('click', () => {
            panel.remove();
            window.__dfCheat = false;
        });

        // — Табы
        panel.querySelectorAll('.df-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                panel.querySelectorAll('.df-tab').forEach(t => t.classList.remove('on'));
                panel.querySelectorAll('.df-sec').forEach(s => s.classList.remove('on'));
                tab.classList.add('on');
                panel.querySelector(`.df-sec[data-sec="${tab.dataset.tab}"]`).classList.add('on');
            });
        });

        // — Auto UnBan
        const swUnban = panel.querySelector('#swUnban');
        swUnban.addEventListener('click', () => {
            state.autoUnban = !state.autoUnban;
            swUnban.classList.toggle('on', state.autoUnban);
            if (state.autoUnban) {
                state.autoUnbanIv = setInterval(() => {
                    const ban = document.getElementById('banScreenOverlay');
                    if (ban) {
                        ban.style.display = 'none';
                        ban.remove();
                        log('dfLog', '🛡️ Бан-экран удалён', 'ok');
                    }
                }, 3000);
                log('dfLog', '🛡️ Auto UnBan включен', 'ok');
            } else {
                clearInterval(state.autoUnbanIv);
                log('dfLog', '🛡️ Auto UnBan выключен', 'in');
            }
        });

        // — RP список
        renderRp(panel);

        // — Save/Load
        panel.querySelector('#dfSaveCfg').addEventListener('click', () => {
            download('domofon-cheat-config.json', JSON.stringify(state.config, null, 2));
            log('dfLog', '💾 Конфиг сохранён', 'ok');
        });

        const loadFile = panel.querySelector('#dfLoadFile');
        panel.querySelector('#dfLoadCfg').addEventListener('click', () => loadFile.click());
        loadFile.addEventListener('change', e => {
            const f = e.target.files[0];
            if (!f) return;
            const reader = new FileReader();
            reader.onload = ev => {
                try {
                    const data = JSON.parse(ev.target.result);
                    Object.assign(state.config, data);
                    renderRp(panel);
                    log('dfLog', '📁 Конфиг загружен', 'ok');
                } catch (err) { log('dfLog', '❌ Ошибка конфига: ' + err.message, 'er'); }
            };
            reader.readAsText(f);
            loadFile.value = '';
        });

        // — Настройки (ПКМ)
        panel.querySelectorAll('.df-act').forEach(act => {
            act.addEventListener('contextmenu', e => {
                e.preventDefault();
                openSettings(act.dataset.act, panel);
            });
        });

        // — Запуск действий
        panel.querySelector('#stAutoReg').parentElement.addEventListener('click', () => runAutoReg(panel));
        panel.querySelector('#stAutoRegCode').parentElement.addEventListener('click', () => runAutoRegCode(panel));
        panel.querySelector('#stAutoCase').parentElement.addEventListener('click', () => runAutoCase(panel));
    }

    // ============ РЕНДЕР RP ============
    function renderRp(panel) {
        const list = panel.querySelector('#dfRpList');
        list.innerHTML = '';
        DOMOFONS.forEach(name => {
            const item = document.createElement('div');
            item.className = 'df-rp-item';
            const saved = state.config.rp[name];
            item.innerHTML = `
                <img class="df-rp-thumb ${saved ? 'show' : ''}" src="${saved || ''}" alt="">
                <div class="df-rp-name">${name}</div>
                <button class="df-rp-btn ${saved ? 'set' : ''}">${saved ? 'ЗАМЕНИТЬ' : 'ЗАГРУЗИТЬ'}</button>
                ${saved ? '<button class="df-rp-rm">×</button>' : ''}
            `;
            const fileInp = document.createElement('input');
            fileInp.type = 'file'; fileInp.accept = 'image/*'; fileInp.style.display = 'none';
            item.appendChild(fileInp);

            item.querySelector('.df-rp-btn').addEventListener('click', () => fileInp.click());
            fileInp.addEventListener('change', e => {
                const f = e.target.files[0];
                if (!f) return;
                const r = new FileReader();
                r.onload = ev => {
                    state.config.rp[name] = ev.target.result;
                    renderRp(panel);
                    log('dfLog', `🎨 Текстура загружена: ${name}`, 'ok');
                };
                r.readAsDataURL(f);
            });

            const rm = item.querySelector('.df-rp-rm');
            if (rm) rm.addEventListener('click', () => {
                delete state.config.rp[name];
                renderRp(panel);
            });

            list.appendChild(item);
        });
    }

    // ============ НАСТРОЙКИ ============
    function openSettings(type, panel) {
        let title = '', fields = [];
        if (type === 'autoReg') {
            title = 'Настройки AutoReg';
            const c = state.config.autoReg;
            fields = [
                { k: 'count', l: 'Кол-во аккаунтов', v: c.count, t: 'number' },
                { k: 'pattern', l: 'Шаблон ника (%s буквы, %n цифры)', v: c.pattern, t: 'text' }
            ];
        } else if (type === 'autoRegCode') {
            title = 'Настройки AutoReg + Code';
            const c = state.config.autoRegCode;
            fields = [
                { k: 'count', l: 'Кол-во аккаунтов', v: c.count, t: 'number' },
                { k: 'pattern', l: 'Шаблон ника', v: c.pattern, t: 'text' },
                { k: 'code', l: 'Код автора', v: c.code, t: 'text' }
            ];
        } else if (type === 'autoCase') {
            title = 'Настройки AutoCase';
            const c = state.config.autoCase;
            fields = [
                { k: 'caseId', l: 'Кейс', v: c.caseId, t: 'select', opts: CASES.map(x => ({ v: x.id, l: x.name })) },
                { k: 'perBatch', l: 'За раз (штук)', v: c.perBatch, t: 'number' },
                { k: 'total', l: 'Всего (раз)', v: c.total, t: 'number' },
                { k: 'delay', l: 'Задержка (мс)', v: c.delay, t: 'number' }
            ];
        }

        const el = document.createElement('div');
        el.id = 'dfModal';
        el.className = 'dfu';
        el.style.display = 'flex';
        el.innerHTML = `
            <div class="df-mb">
                <h3>${title}</h3>
                ${fields.map(f => `
                    <div class="df-f">
                        <label>${f.l}</label>
                        ${f.t === 'select'
                            ? `<select data-k="${f.k}">${f.opts.map(o => `<option value="${o.v}" ${o.v === f.v ? 'selected' : ''}>${o.l}</option>`).join('')}</select>`
                            : `<input type="${f.t}" data-k="${f.k}" value="${f.v}">`}
                    </div>
                `).join('')}
                <div class="df-mb-actions">
                    <button class="df-btn df-btn-sec" id="dfCancel">Отмена</button>
                    <button class="df-btn" id="dfSave">Сохранить</button>
                </div>
            </div>
        `;
        document.body.appendChild(el);

        el.querySelector('#dfCancel').addEventListener('click', () => el.remove());
        el.addEventListener('click', e => { if (e.target === el) el.remove(); });
        el.querySelector('#dfSave').addEventListener('click', () => {
            const data = {};
            el.querySelectorAll('[data-k]').forEach(inp => {
                let v = inp.value;
                if (inp.type === 'number') v = parseInt(v) || 0;
                data[inp.dataset.k] = v;
            });
            Object.assign(state.config[type], data);
            log('dfLog', `⚙️ Настройки ${type} обновлены`, 'in');
            el.remove();
        });
    }

    // ============ ДЕЙСТВИЯ ============
    async function doRegister(nick) {
        const openBtn = await waitForEl('#openProfileBtn');
        openBtn.click();
        await sleep(300);
        const loginInp = await waitForEl('#authLoginInput');
        const passInp = await waitForEl('#authPassInput');
        setVal(loginInp, nick);
        setVal(passInp, PASSWORD);
        await sleep(200);
        const regBtn = await waitForEl('#registerSubmitBtn');
        regBtn.click();
        await sleep(500);
    }

    async function doAuthorCode(code) {
        const creatorTab = await waitForEl('.tab-btn[data-tab="creator"]');
        creatorTab.click();
        await sleep(400);
        const codeInp = await waitForEl('#authorCodeInput');
        setVal(codeInp, code.toUpperCase());
        await sleep(200);
        const submit = await waitForEl('#submitAuthorCodeBtn');
        submit.click();
        await sleep(500);
    }

    async function doLogout() {
        const openBtn = await waitForEl('#openProfileBtn');
        openBtn.click();
        await sleep(300);
        const logoutBtn = await waitForEl('#logoutBtn');
        logoutBtn.click();
        await sleep(500);
    }

    // AutoReg
    async function runAutoReg(panel) {
        if (state.autoRegRunning) { state.autoRegRunning = false; return; }
        state.autoRegRunning = true;
        const act = panel.querySelector('.df-act[data-act="autoReg"]');
        const st = panel.querySelector('#stAutoReg');
        act.classList.add('run');
        const c = state.config.autoReg;
        log('dfLog', `▶ AutoReg запущен (${c.count} шт.)`, 'in');

        for (let i = 1; i <= c.count; i++) {
            if (!state.autoRegRunning) break;
            const nick = genNick(c.pattern);
            st.textContent = `${i}/${c.count}`;
            log('dfLog', `👤 [${i}/${c.count}] ${nick}`, '');
            try {
                await doRegister(nick);
                await doLogout();
                log('dfLog', `✓ ${nick} готов`, 'ok');
                await sleep(300);
            } catch (e) {
                log('dfLog', `❌ ${e.message}`, 'er');
                await sleep(500);
            }
        }
        state.autoRegRunning = false;
        act.classList.remove('run');
        st.textContent = 'IDLE';
        log('dfLog', '■ AutoReg завершён', 'in');
    }

    // AutoReg + Code
    async function runAutoRegCode(panel) {
        if (state.autoRegCodeRunning) { state.autoRegCodeRunning = false; return; }
        state.autoRegCodeRunning = true;
        const act = panel.querySelector('.df-act[data-act="autoRegCode"]');
        const st = panel.querySelector('#stAutoRegCode');
        act.classList.add('run');
        const c = state.config.autoRegCode;
        log('dfLog', `▶ AutoReg+Code запущен (${c.count} шт., код: ${c.code})`, 'in');

        for (let i = 1; i <= c.count; i++) {
            if (!state.autoRegCodeRunning) break;
            const nick = genNick(c.pattern);
            st.textContent = `${i}/${c.count}`;
            log('dfLog', `🎁 [${i}/${c.count}] ${nick}`, '');
            try {
                await doRegister(nick);
                await doAuthorCode(c.code);
                await doLogout();
                log('dfLog', `✓ ${nick} + код готов`, 'ok');
                await sleep(300);
            } catch (e) {
                log('dfLog', `❌ ${e.message}`, 'er');
                await sleep(500);
            }
        }
        state.autoRegCodeRunning = false;
        act.classList.remove('run');
        st.textContent = 'IDLE';
        log('dfLog', '■ AutoReg+Code завершён', 'in');
    }

    // AutoCase
    async function runAutoCase(panel) {
        if (state.autoCaseRunning) { state.autoCaseRunning = false; return; }
        state.autoCaseRunning = true;
        const act = panel.querySelector('.df-act[data-act="autoCase"]');
        const st = panel.querySelector('#stAutoCase');
        act.classList.add('run');
        const c = state.config.autoCase;
        log('dfLog', `▶ AutoCase запущен (${c.caseId}, ${c.total} раз)`, 'in');

        for (let i = 1; i <= c.total; i++) {
            if (!state.autoCaseRunning) break;
            st.textContent = `${i}/${c.total}`;
            try {
                for (let b = 0; b < c.perBatch; b++) {
                    if (typeof window.openCaseConfig === 'function') {
                        window.openCaseConfig(c.caseId);
                    } else {
                        const btn = document.querySelector(`[onclick*="openCaseConfig('${c.caseId}')"]`);
                        if (btn) btn.click();
                    }
                    await sleep(200);
                }
                log('dfLog', `📦 [${i}/${c.total}] открытие`, '');
                await sleep(c.delay);
            } catch (e) {
                log('dfLog', `❌ ${e.message}`, 'er');
                await sleep(500);
            }
        }
        state.autoCaseRunning = false;
        act.classList.remove('run');
        st.textContent = 'IDLE';
        log('dfLog', '■ AutoCase завершён', 'in');
    }

    // ============ СТАРТ ============
    showLoader(() => {
        showKeyScreen(() => {
            showMainPanel();
        });
    });

})();
