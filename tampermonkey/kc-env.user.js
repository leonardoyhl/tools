// ==UserScript==
// @name         KuCoin Env
// @namespace    kucoin
// @version      0.0.1
// @author       herin.yao@kupotech.com
// @description  Collect and display env information of KuCoin website
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kucoin.com
// @updateURL    https://bitbucket.kucoin.net/users/herin.yao_kupotech.com/repos/tools/raw/tampermonkey/kc-env.user.js
// @downloadURL  https://bitbucket.kucoin.net/users/herin.yao_kupotech.com/repos/tools/raw/tampermonkey/kc-env.user.js
// @match        https://www.kucoin.com/*
// @match        https://www.kucoin.plus/*
// @match        https://*.dev.kucoin.net/*
// @match        https://*.sit.kucoin.net/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const _fetch = window.fetch;

    const patterns = {
        apiColoring: new RegExp('/_api/anonymous/coloring'),
        importMap: new RegExp('/(.*)/.*import-map\\.json', 'i'),
    };

    window.fetch = async function rewritedFetch(input, init, ...rest) {
        const res = await _fetch(input, init, ...rest);
        if (typeof input === 'string') {
            const cloned = res.clone();
            const url = input;
            console.warn('KuCoin Env: url', url);
            if (url.match(patterns.apiColoring)) {
                const data = await cloned.json();
                const { projectVersions } = env;
                delete env.projectVersions;
                // 保证当前灰度信息在前
                updateEnv({ gray: data.data, projectVersions: projectVersions });
            } else if (url.match(patterns.importMap)) {
                const path = URL.canParse(url) ? new URL(url).pathname : url;
                const result = patterns.importMap.exec(path);
                if (result) {
                    const project = result[1];
                    const data = await cloned.json();
                    updateProjectVersion(project, data);
                }
            }
        }
        return res;
    }

    /**
     * @typedef {Object} Env
     * @property {boolean} useSSG
     * @property {boolean} isMobileSSG
     * @property {boolean} isAppSSG
     * @property {string} ssgTime
     * @property {"light" | "dark"} ssgTheme
     * @property {boolean} gUseSSG
     * @property {string} natashaVersion
     * @property {Object} gray
     * @property {Object} projectVersions
     */

    /**
     * @type {Env}
     */
    let env = {};
    /** @type {HTMLPreElement} */
    let pre;

    /**
     * @param {Env} info 
     */
    function updateEnv(info) {
        Object.assign(env, info);
        // trigger env change
        console.warn('KuCoin Env:', env);
        if (pre) {
            pre.innerText = JSON.stringify(env, null, 4);
        }
    }

    function updateProjectVersion(project, info) {
        updateEnv({
            projectVersions: {
                ...env.projectVersions,
                [project]: info,
            },
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        // 提取SSG注释标识
        const headSSGMark = /\-\-.*\[SSG\].*at\s*(.*)\s*\-\-/.exec(document.head.innerHTML);
        let ssgTime;
        if (!!headSSGMark) {
            const ssgTimeStr = headSSGMark[1]?.trim();
            ssgTime = !!ssgTimeStr ? new Date(ssgTimeStr).toLocaleString() : undefined;
        }
        // 提取HTML中的版本信息
        const projectVersions = Array.from(document.querySelectorAll('[data-importmap-ssg]')).reduce((acc, item) => {
            const project = item.getAttribute('data-importmap-ssg');
            const importMap = JSON.parse(item.innerText);
            acc[project] = importMap;
            return acc;
        }, {});

        env = {
            useSSG: window._useSSG || !!headSSGMark,
            ssgTime,
            isMobileSSG: window.SSG_isMobile,
            isAppSSG: window.SSG_isApp,
            ssgTheme: window.SSG_theme,
            gUseSSG: window.g_useSSR || false,
            natashaVersion: window._natasha_version_,
            ...env,
            projectVersions: {
                ...projectVersions, // 保证当前主项目信息在前
                ...env.projectVersions,
            },
        };

        const host = document.createElement('div');
        host.style.display = 'block';
        host.style.position = 'fixed';
        host.style.zIndex = 10000;
        host.style.top = '8px';
        host.style.left = '8px';
        host.style.color = '#000';
        host.style.backgroundColor = '#fff';
        host.onmouseenter = () => {
            pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
        };
        host.onmouseleave = () => {
            pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
        };
        const btnSwitch = document.createElement('span');
        btnSwitch.innerText = 'KC Env';
        btnSwitch.style.padding = '2px 4px';
        btnSwitch.style.backgroundColor = '#01bc8d';
        btnSwitch.style.cursor = 'pointer';
        btnSwitch.ontouchend = () => {
            pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
        };
        host.appendChild(btnSwitch);
        pre = document.createElement('pre');
        pre.innerText = JSON.stringify(env, null, 4);
        pre.style.display = 'none';
        pre.style.maxWidth = 'calc(100vw - 16px)';
        pre.style.maxHeight = '70vh';
        pre.style.overflow = 'auto';
        pre.style.backgroundColor = '#efefef';
        host.appendChild(pre);
        document.body.appendChild(host);
    });
})();
