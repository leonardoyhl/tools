// ==UserScript==
// @name         Jest Coverage Differ
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  为本地Jest测试报告生成对比数据
// @author       leonardoyhl
// @match        */lcov-report/*
// @match        */coverage/lcov-report/*
// @match        https://check-web-node.sit.kucoin.net/test/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jestjs.io
// @updateURL    https://github.com/leonardoyhl/tools/raw/main/tampermonkey/jest-coverage-differ.user.js
// @downloadURL  https://github.com/leonardoyhl/tools/raw/main/tampermonkey/jest-coverage-differ.user.js
// @grant        none
// ==/UserScript==

/**
 * Features:
 * 1. 为本地Jest测试报告生成对比数据
 */
(async function () {
    'use strict';
    console.log('---------- Jest Coverage Differ ----------');

    const projects = [
        'marketing-growth-web',
        'public-web',
    ];

    async function getTargetBranchCoverage(project, branch = 'master') {
        // https://check-web-node.sit.kucoin.net/api/test/query-detail?branch=master&project=marketing-growth-web
        const url = `https://check-web-node.sit.kucoin.net/api/test/query-detail?project=${project}&branch=${branch}`;
        const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
        }).then(res => res.json());
        if (res.status !== 200 || !res.data || res.data.length < 1) {
            return;
        }
        const coverage = res.data[0];
        return {
            ...coverage,
            coverage: JSON.parse(coverage.coverage),
            coverage_detail: JSON.parse(coverage.coverage_detail),
        };
    }

    function isOnlineSite() {
        return location.host === 'check-web-node.sit.kucoin.net';
    }

    function waitForSelector(selector) {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (!!el) return resolve();
            const timerId = setInterval(() => {
                const el = document.querySelector(selector);
                if (!!el) {
                    resolve();
                    clearInterval(timerId);
                }
            }, 1000);
        });
    }

    function listenHistoryChange(callback) {
        const { pushState, replaceState } = history;
        let lastPath = location.pathname;
        history.pushState = function () {
            pushState.apply(history, arguments);
            const newUrl = arguments[2];
            const newPath = newUrl.substring(0, newUrl.indexOf('#') > 0 ? newUrl.indexOf('#') : newUrl.length);
            if (newPath !== lastPath) {
                callback();
            }
            lastPath = newPath;
        }
        history.replaceState = function () {
            replaceState.apply(history, arguments);
            const newUrl = arguments[2];
            const newPath = newUrl.substring(0, newUrl.indexOf('#') > 0 ? newUrl.indexOf('#') : newUrl.length);
            if (newPath !== lastPath) {
                callback();
            }
            lastPath = newPath;
        }
        window.addEventListener('popstate', (e) => {
            const newPath = location.pathname;
            if (newPath !== lastPath) {
                callback();
            }
            lastPath = newPath;
        });
    }

    function getBaseInfo() {
        if (isOnlineSite()) {
            const text = document.querySelector('.pad1 p .quiet')?.parentElement?.innerText || '';
            const matchResult = text.match(/Project\:\s*(.+)Branch\:\s*(.+)/);
            if (!matchResult) return { project: text.trim(), branch: null };
            const [_, project, branch] = matchResult;
            return { project: project.trim(), branch: branch.trim() };
        }
        const project = localStorage.getItem('project') || projects[0];
        return { project, branch: null };
    }

    function createProjectSelect(defaultValue) {
        const select = document.createElement('select');
        select.style.marginLeft = '2em';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project;
            option.innerText = project;
            select.appendChild(option);
        });
        select.value = defaultValue;
        select.onchange = function (e) {
            console.log('Differ: project change', e);
            localStorage.setItem('project', e.target.value);
            location.reload();
        };
        const host = document.querySelector('.pad1 h1');
        host.appendChild(select);
    }

    /**
     * 为单一覆盖率项元素增加对比信息
     * @param {HTMLElement} el 
     * @param {Object} coverage 
     */
    function addDiffInfo(el, coverage) {
        const pct = Number(el.firstElementChild.innerText.trim().substring(0, el.firstElementChild.innerText.indexOf('%')));
        const pctDiff = pct - coverage.pct;
        // 覆盖率下降标红，否则标绿
        const color = pctDiff < 0 ? '#c21f39' : '#4d9221';
        const pctDiffText = pctDiff <= 0 ? pctDiff.toFixed(2) : `+${pctDiff.toFixed(2)}`;
        el.firstElementChild.insertAdjacentHTML('afterend', `<span class="strong differ" style="color: ${color};">(${coverage.pct}%, ${pctDiffText}%)</span>`);
        el.lastElementChild.insertAdjacentHTML('afterend', `<span class="fraction differ" style="color: ${color}; margin-left: 2px;">(${coverage.covered}/${coverage.total})</span>`);
    }

    function getBasePath() {
        if (isOnlineSite()) {
            const els = Array.from(document.querySelectorAll('.pad1 h2 a'));
            return els.length > 1 ? els[1].nextElementSibling.innerText.trim() : '';
        }
        const el = document.querySelector('.pad1 h1 a');
        return el ? el.nextSibling?.textContent?.trim() || '' : '';
    }

    function addSummaryDiffInfo(coverage, coverage_detail) {
        const basePath = getBasePath();
        coverage = !basePath ? coverage : coverage_detail[basePath];
        if (!coverage) return;
        // const summaryEl = document.querySelector('.pad1 .clearfix');
        // const [statementEl, branchEl, functionEl, lineEl] = Array.from(document.querySelectorAll('.pad1 .clearfix .fl'));
        // const coverageEls = Array.from(document.querySelectorAll('.pad1 .clearfix .fl'));
        // const coverages = [coverage.statements, coverage.branches, coverage.functions, coverage.lines, coverage.branchesTrue];
        // coverageEls.forEach((item, idx) => {
        //     addDiffInfo(item, coverages[idx]);
        // });
        const coverageEls = Array.from(document.querySelectorAll('.pad1 .clearfix .fl'));
        coverageEls.forEach((item, idx) => {
            /** @type {string} */
            let coverageType = item.querySelector('.quiet').innerText.trim();
            coverageType = coverageType.substring(0, 1).toLowerCase() + coverageType.substring(1);
            addDiffInfo(item, coverage[coverageType]);
        });
    }

    function addFileDiffInfo(cols, colIdxMap, coverage) {
        ['Statements', 'Branches', 'Functions', 'Lines'].forEach(coverageType => {
            const lcoverageType = coverageType.substring(0, 1).toLowerCase() + coverageType.substring(1);
            if (!coverage[lcoverageType]) return;
            addColDiffInfo(cols[colIdxMap[coverageType]], coverage[lcoverageType]);
        });
    }

    function addColDiffInfo(col, coverage) {
        const pct = Number(col.innerText.trim().substring(0, col.innerText.trim().length - 1));
        const pctDiff = pct - coverage.pct;
        if (pctDiff === 0) return;
        // 覆盖率下降标红，否则标绿
        const color = pctDiff < 0 ? '#c21f39' : '#4d9221';
        const pctDiffText = pctDiff <= 0 ? pctDiff.toFixed(2) : `+${pctDiff.toFixed(2)}`;
        col.insertAdjacentHTML('beforeend', `<span class="strong differ" style="color: ${color}; margin-left: 2px;"><br />(${coverage.pct}%, ${pctDiffText}%)</span>`);
    }

    function addDetailDiffInfo(coverage_detail) {
        const thCols = Array.from(document.querySelectorAll('.coverage-summary thead th'));
        const colIdxMap = thCols.reduce((acc, th, idx) => {
            const name = th.innerText.trim();
            if (name) {
                acc[name] = idx;
            }
            return acc;
        }, {});
        const basePath = getBasePath();
        const rows = Array.from(document.querySelectorAll('.coverage-summary tbody tr'));
        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            const fileCol = cols[colIdxMap['File']];
            // const statementPctCol = cols[colIdxMap['Statements']];
            // const branchPctCol = cols[colIdxMap['Branches']];
            // const functionPctCol = cols[colIdxMap['Functions']];
            // const linePctCol = cols[colIdxMap['Lines']];
            const subPath = fileCol.innerText.trim();
            // const path = !basePath ? fileCol.innerText.trim() : `${basePath}/${fileCol.innerText.trim()}`;
            // const coverage = coverage_detail[path];
            const coverage = !basePath ? coverage_detail[subPath] : coverage_detail[basePath]?.childs?.find(item => {
                // const pathes = Object.entries(item).find(([key, value]) => key === subPath);
                return Object.keys(item).some(key => key === subPath);
            })?.[subPath];
            if (!coverage) return;
            // const statementPct = Number(statementPctCol.innerText.trim().substring(0, statementPctCol.innerText.trim().length - 1));
            // const branchPct = Number(branchPctCol.innerText.trim().substring(0, branchPctCol.innerText.trim().length - 1));
            // const functionPct = Number(functionPctCol.innerText.trim().substring(0, functionPctCol.innerText.trim().length - 1));
            // const linePct = Number(linePctCol.innerText.trim().substring(0, linePctCol.innerText.trim().length - 1));
            addFileDiffInfo(cols, colIdxMap, coverage);
        });
    }

    const { project, branch } = getBaseInfo();
    if (isOnlineSite()) {
        // 线上 master 分支覆盖率页面不需要生成对比数据
        if (branch === 'master') return;
    } else {
        // 本地场景不清楚项目，需要用户手动选择
        createProjectSelect(project);
    }
    // getTargetBranchCoverage('marketing-growth-web').then(console.log);
    const info = await getTargetBranchCoverage(project);
    console.log(info);
    const { coverage, coverage_detail } = info;
    const titleEl = document.querySelector('.pad1 h1');
    if (isOnlineSite()) {
        await waitForSelector('.pad1 .clearfix .fl');
        listenHistoryChange(() => {
            Array.from(document.querySelectorAll('.differ')).forEach(el => el.remove());
            setTimeout(() => {
                addSummaryDiffInfo(coverage, coverage_detail);
                addDetailDiffInfo(coverage_detail);
            }, 100);
        });
    }
    addSummaryDiffInfo(coverage, coverage_detail);
    addDetailDiffInfo(coverage_detail);
})();
