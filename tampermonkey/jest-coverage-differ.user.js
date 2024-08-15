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

    function getBaseInfo() {
        if (isOnlineSite()) {
            const branchEl = document.querySelector('.pad1 p .quiet').nextElementSibling;
            const project = branchEl.previousSibling.textContent.trim();
            const branch = branchEl.parentElement.lastChild.textContent.trim();
            return { project, branch };
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
        el.firstElementChild.insertAdjacentHTML('afterend', `<span class="strong" style="color: ${color};">(${coverage.pct}%, ${pctDiff.toFixed(2)}%)</span>`);
        el.lastElementChild.insertAdjacentHTML('afterend', `<span class="fraction" style="color: ${color}; margin-left: 2px;">(${coverage.covered}/${coverage.total})</span>`);
    }

    function addSummaryDiffInfo(coverage) {
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
    }
    addSummaryDiffInfo(coverage);
})();
