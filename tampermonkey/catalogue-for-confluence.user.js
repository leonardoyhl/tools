// ==UserScript==
// @name         Catalogue for Confluence
// @namespace    http://tampermonkey.net/
// @version      2024-08-04
// @description  为 Confluence 文档生成目录
// @author       leonardoyhl
// @match        https://*.atlassian.net/wiki/*
// @icon         https://wac-cdn.atlassian.com/misc-assets/webp-images/confluence-logo.svg
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @updateURL    https://github.com/leonardoyhl/tools/raw/main/tampermonkey/catalogue-for-confluence.user.js
// @downloadURL  https://github.com/leonardoyhl/tools/raw/main/tampermonkey/catalogue-for-confluence.user.js
// @grant        none
// ==/UserScript==

/**
 * Features:
 * 1. 支持刷新&路由切换场景生成目录
 * 2. 支持新版编辑器阅读态&编辑态、旧版编辑器阅读态生成目录
 * 3. 支持点击目录跳转至对应内容位置
 * 4. 支持目录折叠&展开
 * 5. 支持自动折叠目录——旧版文档、全宽模式（空白区域较窄，难以容纳目录）时自动折叠目录
 */
(function () {
    'use strict';
    console.log('---------- Catalogue for Confluence ----------');

    const icons = {
        collapse: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTcuOTg3IDEzLjIyOEwzLjc2IDlsNC40NTctNC40NTguNjI3LS42M0EuNzUuNzUgMCAxMDcuNzggMi44NThsLS40OTguNUwyLjE3IDguNDdhLjc1Ljc1IDAgMDAwIDEuMDZsNC44NTQgNC44NTUuNzU5Ljc2YS43NS43NSAwIDAwMS4wNjItMS4wNTdsLS44NTctLjg2eiIgZmlsbD0iIzY0NkE3MyIvPjxwYXRoIGQ9Ik0xNC42NjggMTMuMjI4TDEwLjQ0IDlsNC40NTctNC40NTguNjI3LS42M2EuNzUuNzUgMCAxMC0xLjA2NC0xLjA1NmwtLjQ5OC41TDguODUgOC40N2EuNzUuNzUgMCAwMDAgMS4wNmw0Ljg1NCA0Ljg1NS43NTguNzZhLjc1Ljc1IDAgMDAxLjA2Mi0xLjA1N2wtLjg1Ni0uODZ6IiBmaWxsPSIjNjQ2QTczIi8+PC9zdmc+',
        expand: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xLjUgMy4zNzVjMC0uMjA3LjE2OC0uMzc1LjM3NS0uMzc1aDE0LjI1Yy4yMDcgMCAuMzc1LjE2OC4zNzUuMzc1di43NWEuMzc1LjM3NSAwIDAxLS4zNzUuMzc1SDEuODc1YS4zNzUuMzc1IDAgMDEtLjM3NS0uMzc1di0uNzV6bTAgNS4yNWMwLS4yMDcuMTY4LS4zNzUuMzc1LS4zNzVoMTQuMjVjLjIwNyAwIC4zNzUuMTY4LjM3NS4zNzV2Ljc1YS4zNzUuMzc1IDAgMDEtLjM3NS4zNzVIMS44NzVhLjM3NS4zNzUgMCAwMS0uMzc1LS4zNzV2LS43NXptLjM3NSA0Ljg3NWEuMzc1LjM3NSAwIDAwLS4zNzUuMzc1di43NWMwIC4yMDcuMTY4LjM3NS4zNzUuMzc1aDkuNzVhLjM3NS4zNzUgMCAwMC4zNzUtLjM3NXYtLjc1YS4zNzUuMzc1IDAgMDAtLjM3NS0uMzc1aC05Ljc1eiIgZmlsbD0iIzY0NkE3MyIvPjwvc3ZnPg==',
    };

    function applyStyle(style) {
        const el = document.createElement('style');
        el.innerHTML = style;
        document.body.appendChild(el);
    }

    function applyCatalogueStyle() {
        console.log('Catalogue: applying style');
        const style = `
            .catalogue {
                display: block;
                height: 0;
                padding: 0;
                position: sticky;
                // left: 4px;
                top: 0px;
                /* 层级需低于 图片/附件预览 弹窗层级520 */
                z-index: 400;
            }
            .catalogue.editing {
                top: 100px;
            }
            .catalogue-inner {
                position: absolute;
                left: 2px;
                top: 60px;
                max-width: calc((100vw - 240px - 760px - 64px) / 2);
                max-height: calc(100vh - 115px - 20px);
                padding-top: 20px;
                padding-left: 14px;
                /* 为滚动条留位置 */
                padding-right: 10px;
                overflow: auto;
            }
            .catalogue.collapsed.visible .catalogue-inner {
                background-color: #fff;
            }
            
            .catalogue-icon {
                display: inline-block;
                width: 18px;
                height: 18px;
                cursor: pointer;
            }
            .catalogue-icon.collapse {
                background-image: url(${icons.collapse});
            }
            .catalogue-icon.expand {
                background-image: url(${icons.expand});
                display: none;
            }
            .catalogue.collapsed .catalogue-icon.collapse {
                display: none;
            }
            .catalogue.collapsed .catalogue-icon.expand {
                display: inline-block;
            }
            
            .catalogue-list {
                padding: 0;
            }
            .catalogue.collapsed .catalogue-list {
                display: none;
            }
            // .catalogue.collapsed:hover .catalogue-list {
            //     display: block;
            // }
            .catalogue.collapsed.visible .catalogue-list {
                display: block;
            }
            
            .catalogue-item {
                margin-bottom: 8px;
                list-style-type: none;
            }
            .catalogue-item a {
                color: var(--ds-text, var(--ds-text, #172B4D));
                color: #646a73;
            }
            ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(indentLevel => {
                return `.catalogue-item.indent-level-${indentLevel} {
                            padding-left: ${14 * indentLevel}px;
                        }`;
            }).join('\n')}
        `;
        applyStyle(style);
    }

    function isInReadMode() {
        return !!document.querySelector('#title-text');
    }

    function isFullWidthMdoe() {
        return !!document.querySelector('.is-full-width');
    }

    function isOldEditor() {
        return isInReadMode() && !document.querySelector('.ak-renderer-document')
            || !isInReadMode() && !document.querySelector('.ak-editor-content-area');
    }

    function createCatalogue() {
        if (document.querySelector('.catalogue')) {
            console.log('Catalogue: catalogue existed');
            return;
        }
        console.log('Catalogue: creating catalogue');
        const isReadMode = isInReadMode();
        const title = isReadMode ? document.querySelector('#title-text').innerText : document.querySelector('textarea').value;
        const contentEl = isReadMode ? document.querySelector('#content') : document.querySelector('#ak-editor-textarea');
        const headingEls = contentEl.querySelectorAll('h1,h2,h3,h4,h5,h6,h7,h8,h9');
        // console.log('Catalogue:', title, headingEls);
        console.log('Catalogue:', title);
        const headings = Array.from(headingEls).map(heading => {
            return {
                id: heading.id,
                text: heading.innerText,
                level: Number(heading.tagName.substring(1)),
            };
        });
        const allLevels = headings.map(item => item.level).filter((item, idx, arr) => arr.indexOf(item) === idx).sort((a, b) => a - b);
        const titleFragment = `<li class="catalogue-item catalogue-item-title indent-level-0"><a href="#">${title}</a></li>`;
        const itemFragments = [titleFragment, ...headings.map(item => {
            const { id, level, text } = item;
            const indentLevel = allLevels.indexOf(level);
            return `<li class="catalogue-item indent-level-${indentLevel}"><a href="#${encodeURIComponent(id)}">${text}</a></li>`;
        })];
        const iconFragment = '<div class="catalogue-icons"><span class="catalogue-icon collapse" title="Collapse"></span><span class="catalogue-icon expand" title="Expand"></span></div>';
        const html = `<div class="catalogue"><div class="catalogue-inner">${iconFragment}<ul class="catalogue-list">${itemFragments.join('')}</ul><div><div>`;
        const host = document.querySelector('#AkMainContent');
        host.insertAdjacentHTML('afterbegin', html);

        const catalogueEl = document.querySelector('.catalogue');
        // 老版本编辑器内容居左而非居中、全宽模式，没有空白区域用于展示目录，故默认折叠
        if (isOldEditor() || isFullWidthMdoe()) {
            catalogueEl.classList.add('collapsed');
        }
        if (!isInReadMode()) {
            catalogueEl.classList.add('editing');
        }
        catalogueEl.addEventListener('mouseenter', (e) => {
            // console.log('Catalogue: mouseenter', e);
            const catalogueEl = document.querySelector('.catalogue');
            catalogueEl.classList.add('visible');
        });
        catalogueEl.addEventListener('mouseleave', (e) => {
            // console.log('Catalogue: mouseleave', e);
            const catalogueEl = document.querySelector('.catalogue');
            catalogueEl.classList.remove('visible');
        });
    }

    function removeCatalogue() {
        /** @type {HTMLDivElement} */
        const catalogueEl = document.querySelector('.catalogue');
        if (catalogueEl) {
            catalogueEl.remove();
        }
    }

    function listenHistoryChange(callback) {
        const { pushState, replaceState } = history;
        let lastPath = location.pathname;
        history.pushState = function () {
            console.log('Catalogue: pushState', arguments, 'location.pathname', location.pathname);
            pushState.apply(history, arguments);
            const newUrl = arguments[2];
            const newPath = newUrl.substring(0, newUrl.indexOf('#') > 0 ? newUrl.indexOf('#') : newUrl.length);
            if (newPath !== lastPath) {
                callback();
            }
            lastPath = newPath;
        }
        history.replaceState = function () {
            console.log('Catalogue: replaceState', arguments, 'location.pathname', location.pathname);
            replaceState.apply(history, arguments);
            const newUrl = arguments[2];
            const newPath = newUrl.substring(0, newUrl.indexOf('#') > 0 ? newUrl.indexOf('#') : newUrl.length);
            if (newPath !== lastPath) {
                callback();
            }
            lastPath = newPath;
        }
        window.addEventListener('popstate', (e) => {
            console.log('Catalogue: popstate', e);
            const newPath = location.pathname;
            if (newPath !== lastPath) {
                callback();
            }
            lastPath = newPath;
        });
    }

    applyCatalogueStyle();

    // 页面加载完成后生成目录
    document.addEventListener('readystatechange', (e) => {
        console.log('Catalogue: readystatechange', e);
        if (document.readyState === 'complete') {
            // 在页面加载完成前，若点击空间文档目录树跳转至新页面（通过history），会尝试生成新文档的目录
            // 当这里触发时机较晚时，实际上目录已生成，故仅当没有时生成
            if (!document.querySelector('.catalogue')) {
                createCatalogue();
            }
        }
    });
    // 路由切换时重新生成目录
    listenHistoryChange(() => {
        // 移除原目录
        removeCatalogue();
        setTimeout(createCatalogue, 5000);
    });

    // 支持固定目录
    document.addEventListener('scroll', (e) => {
        // console.log('Catalogue: scroll', e);
        /** @type {HTMLDivElement} */
        const catalogueEl = document.querySelector('.catalogue');
        if (!catalogueEl) return;
        const offsetTop = window.scrollY > 0 ? 56 : 0;
        catalogueEl.style.top = `${offsetTop}px`;
    });
    document.addEventListener('click', (e) => {
        // console.log('Catalogue: click', e);
        /** @type {HTMLElement} */
        const target = e.target;
        if (isInReadMode() && target.closest('.catalogue-item-title')) {
            // 支持点击目录中的标题跳转至顶部
            window.scrollTo({
                top: 0,
                // behavior: 'smooth',
            });
        } else if (target.closest('.catalogue-icon')) {
            // 支持目录折叠/展开
            const catalogueEl = document.querySelector('.catalogue');
            const iconEl = target.closest('.catalogue-icon');
            if (iconEl.classList.contains('collapse')) {
                catalogueEl.classList.remove('visible');
                catalogueEl.classList.add('collapsed');
            } else {
                catalogueEl.classList.remove('collapsed');
            }
        } else if (!isInReadMode() && target.closest('.catalogue-item')) {
            const idx = Array.from(document.querySelector('.catalogue-list').children).indexOf(target.closest('.catalogue-item'));
            const contentEl = document.querySelector('#ak-editor-textarea');
            const headingEls = contentEl.querySelectorAll('h1,h2,h3,h4,h5,h6,h7,h8,h9');
            const targetHeading = Array.from(headingEls)[idx - 1];
            targetHeading.scrollIntoView();
            // const scroller = document.querySelector('.fabric-editor-popup-scroll-parent');
            // const scrollerRect = scroller.getBoundingClientRect();
            // const targetRect = targetHeading.getBoundingClientRect();
            // const scrollY = targetRect.top - scrollerRect.top + scroller.scrollTop;
            // scroller.scrollTo({ top: scrollY });
        }
    });
})();
