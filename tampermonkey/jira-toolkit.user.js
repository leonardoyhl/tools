// ==UserScript==
// @name         Jira Toolkit
// @namespace    http://tampermonkey.net/
// @version      2024-08-18
// @description  Jira工具-支持子Filter直接修改数据
// @author       leonardoyhl
// @match        https://k-devdoc.atlassian.net/issues/?filter=***
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const REST_API = '/rest/api/3';
    const GRAPHQL_API = '/gateway/api/graphql/pq';

    // __typename __isJiraIssueField __isJiraIssueFieldConfiguration
    const GraphqlFieldType = {
        User: 'JiraSingleSelectUserPickerField',
        Number: 'JiraNumberField',
        RichTexxt: 'JiraRichTextField',
        Checkboxes: 'JiraCheckboxesField',
        Date: 'JiraDatePickerField',
        DateTime: 'JiraDateTimePickerField',
        IssueType: 'JiraIssueTypeField',
        ParentIssue: 'JiraParentIssueField',
        Labels: 'JiraLabelsField',
        Priority: 'JiraPriorityField',
    };

    // string,issuetype,issuelink,array,project,user,priority,date,number,option,option-with-child
    const RestFieldType = {
        User: 'user',
        Date: 'date',
        Number: 'number',
    };

    /**
     * @template T
     * @param {T} fn
     * @returns {T}
     */
    function memoize(fn) {
        let hadRun = false;
        let result;
        return function () {
            if (hadRun) return result;
            hadRun = true;
            result = fn.apply(this, arguments);
            return result;
        }
    }

    function getProjectKey(issueKey) {
        return issueKey.substring(0, issueKey.lastIndexOf('-'));
        // 从 SSR 数据中读取 projectKey 不靠谱，如 SPA 切换项目场景
        // /** @type {string} */
        // const ssrDataString = document.querySelector('[data-ssr-data]')?.innerText;
        // let projectKey = ssrDataString?.match(/\"projectKey\"\:\"(\w+)\"/)?.[1];
        // if (!projectKey) {
        //     const projectContext = window.SPA_STATE?.PROJECT_CONTEXT || {};
        //     const keys = Object.keys(projectContext).filter(key => key !== 'undefined');
        //     if (keys.length > 0) {
        //         projectKey = keys[0];
        //     }
        // }
        // return projectKey;
    }

    /**
     * 通过 GraphQL API 获取 Issue 数据
     * @param {string} projectKey
     * @param {string} issueKey
     * @returns
     */
    function getIssueByGraphQL(issueKey, projectKey) {
        const graphqlId = 'bf6d1d390e3bf3b7bb2181c7df0845ecf1a0c15976fcc736291aa5aead0e7ed8';
        const url = `/gateway/api/graphql/pq/${graphqlId}?operation=mainIssueAggQuery`;
        projectKey = projectKey || getProjectKey(issueKey);
        const data = {
            "operationName": "mainIssueAggQuery",
            "variables": {
                // "projectKey": "TOBC",
                // "issueKey": "TOBC-10066",
                "projectKey": projectKey,
                "issueKey": issueKey,
                "cloudId": "c27efac3-b9d5-4f9b-948e-302afc67d413",
                "issueViewRelayCascadingSelectFlag": false,
                "giraAGGMigrationIsArchivedFlag": false,
                "parentInIssueViewFlag": true,
                "isCompassComponentsEnabled": true,
                "giraAGGMigrationAttachmentsFlag": true,
                "isRelayReleaseVersionFieldIssueViewIntegrationEnabled": true,
                "issueViewRelayGoalsFlag": false,
                "isCMDBAttributeIdRemoved": true,
                "jsmSentimentCustomFieldFlag": true,
                "isJPDPanelEnabled": false,
                "giraAGGMigrationCommentsFlag": false,
                "commentTargetId": null,
                "issueViewRelayAssigneeFieldFlag": false,
                "issueViewRelayPriorityFieldFlag": true,
                "issueViewRelaySprintFieldFlag": false,
                "issueViewRelayAttachmentsFlag": false
            }
        };
        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
                // 'atl-xsrf-token': '68acda43c25f5d1adeee801ffbb336ec18169ee3_lin',
                'x-experimentalapi': 'ariGraph,boardCardMove,deleteCard,JiraJqlBuilder,SoftwareCardTypeTransitions,jira-releases-v0,JiraDevOps,JiraDevOpsProviders,createCustomFilter,updateCustomFilter,deleteCustomFilter,customFilters,PermissionScheme,JiraIssue,projectStyle,startSprintPrototype,AddIssuesToFixVersion,JiraVersionResult,JiraIssueConnectionJql,JiraFieldOptionSearching,JiraIssueFieldMutations,JiraIssueDevInfoDetails,JiraIssueDevSummaryCache,JiraVersionWarningConfig,JiraReleaseNotesConfiguration,JiraUpdateReleaseNotesConfiguration,ReleaseNotes,ReleaseNotesOptions,DeploymentsFeaturePrecondition,UpdateVersionWarningConfig,UpdateVersionName,UpdateVersionDescription,UpdateVersionStartDate,UpdateVersionReleaseDate,VersionsForProject,RelatedWork,SuggestedRelatedWorkCategories,setIssueMediaVisibility,toggleBoardFeature,DevOpsProvider,DevOpsSummarisedDeployments,virtual-agent-beta,JiraProject,DevOpsSummarisedEntities,RoadmapsMutation,RoadmapsQuery,JiraApplicationProperties,JiraIssueSearch,JiraFilter,featureGroups,setBoardEstimationType,devOps,softwareBoards,name,AddRelatedWorkToVersion,RemoveRelatedWorkFromVersion,admins,canAdministerBoard,jql,globalCardCreateAdditionalFields,GlobalTimeTrackingSettings,ReleaseNotesOptions,search-experience,MoveOrRemoveIssuesToFixVersion,compass-beta,JiraIssueSearchStatus,Townsquare,JiraNavigationItems,JiraVersionsForProjects,columnConfigs',
                // 'x-atlassian-capability': 'ISSUE_VIEW',
                // 'x-b3-spanid': 'af1e919a2b9d35a8',
                // 'x-b3-traceid': 'd2c0009b68bd43fbaf1e919a2b9d35a8',
            },
            body: JSON.stringify(data),
        }).then(res => res.json());
    }

    async function getIssueMetaByGraphQL(issueKey) {
        const res = await getIssueByGraphQL(issueKey);
    }

    /**
     * 通过 REST API 获取 Issue 数据
     * @param {string} issueKey
     * @returns
     */
    async function getIssue(issueKey) {
        const url = `/rest/api/3/issue/${issueKey}/`;
        return fetch(url, {
            method: 'GET',
            credentials: 'include',
        }).then(res => res.json());
    }

    /**
     * 通过 REST API 获取 Issue Meta
     * @param {string | string[]} projectKey
     * @returns
     */
    async function getIssueMeta(projectKey) {
        // if (Array.isArray(projectKey)) projectKey = projectKey.join(',');
        // &issuetypeNames=Bug
        const url = `/rest/api/3/issue/createmeta?projectKeys=${projectKey}&expand=projects.issuetypes.fields`;
        return fetch(url, {
            method: 'GET',
            credentials: 'include',
        }).then(res => res.json());
    }

    /**
     * 通过 REST API 获取 Issue Meta
     * @param {string} issueKey
     * @returns
     */
    function getIssueMetaByIssueKey(issueKey) {
        const projectKey = getProjectKey(issueKey);
        return getIssueMeta(projectKey);
    }

    async function getIssueFieldSchemas(issueKey) {
        const meta = await getIssueMetaByIssueKey(issueKey);
        const fields = {};
        const issuetypes = meta?.projects?.[0]?.issuetypes || [];
        issuetypes.forEach(item => {
            Object.entries((item.fields || {})).forEach(([key, value]) => {
                fields[key] = value;
            });
        });
        return fields;
    }

    /**
     * @typedef {Object} UpdateIssueData
     * @property {Record<string, any>} fields
     *
     * 更新 Issue
     * @param {string} issueKey
     * @param {UpdateIssueData} data
     */
    async function updateIssue(issueKey, data) {
        const url = `/rest/api/3/issue/${issueKey}/`;
        return fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }

    async function getFilterMeta(filterId) {
        const url = `/rest/api/3/filter/${filterId}/`;
        return await fetch(url, {
            method: 'GET',
            credentials: 'include',
        }).then(res => res.json());
    }

    async function getFilterIssues(filterId) {
        return await fetch(`/rest/api/3/search?jql=filter=${filterId}`, {
            method: 'GET',
            credentials: 'include',
        }).then(res => res.json());
    }

    function getColSchemas() {
        const jira = window.SPA_STATE?.['relay-cache/v2/AGG']?.responses?.[2]?.[1]?.payload?.data?.jira || {};
        /** @type {any[]} */
        const fields = (jira.issueSearchViewResult?.fieldSets?.edges || []).map(item => item.node);
        return fields;
    }

    function getIssues() {
        const jira = window.SPA_STATE?.['relay-cache/v2/AGG']?.responses?.[2]?.[1]?.payload?.data?.jira || {};
        const issues = (/** @type {any[]} */(jira.issueSearchStable?.edges || [])).map(item => {
            /** @type {any[]} */
            const fields = item.node?.fieldSetsForIssueSearchView?.edges || [];
            const fieldIdValueMap = {};
            const fieldSetIdValueMap = {};
            fields.forEach(item => {
                const node = item.node?.fields?.edges?.[0]?.node;
                const fieldSetId = item.node?.fieldSetId;
                if (!node) return;
                fieldIdValueMap[node.fieldId] = node;
                fieldSetIdValueMap[fieldSetId] = node;
            });
            return {
                fieldIdValueMap,
                fieldSetIdValueMap,
            };
        });
        return issues;
    }

    function refreshTable() {
        /** @type {HTMLButtonElement} */
        const btnRefresh = document.querySelector('[data-testid="issue-navigator.common.ui.refresh-button.refresh-button"]');
        btnRefresh?.click();
    }

    const memoized_getIssueFieldSchemas = memoize(getIssueFieldSchemas);

    let prevEl;
    document.addEventListener('click', async (e) => {
        const { target } = e;
        // blur 时移除元素
        if (!target.closest('.el-jira-toolkit-add')) {
            prevEl?.remove();
        }
        const td = target?.closest?.('td');
        const tr = target?.closest?.('tr');
        const tbody = target?.closest?.('tbody');
        if (!td || !tr || !tbody || td.querySelector('.el-jira-toolkit-add')) return;
        const trList = Array.from(tbody.querySelectorAll('tr'));
        const tdList = Array.from(tr.querySelectorAll('td'));
        const rowIdx = trList.indexOf(tr);
        const colIdx = tdList.indexOf(td);
        if (rowIdx < 0 || colIdx < 0) return;
        const colSchemas = getColSchemas();
        const issueKeyColIdx = colSchemas.findIndex(item => item.fieldSetId === 'issuekey');
        const curColSchema = colSchemas[colIdx];
        if (issueKeyColIdx < 0 || !curColSchema) return;
        const { type, fieldSetId, jqlTerm } = curColSchema;
        const issues = getIssues();
        const curRowIssue = issues[rowIdx];
        const curIssueKey = curRowIssue.fieldIdValueMap.issuekey?.text || curRowIssue.fieldSetIdValueMap.issuekey?.text;
        const fieldSchemas = await memoized_getIssueFieldSchemas(curIssueKey);
        // const curColFieldId = jqlTerm?.startsWith('cf[') ? `${jqlTerm.substring(3, jqlTerm.length - 1)}` : type;
        const curCellValueObj = curRowIssue.fieldSetIdValueMap[fieldSetId];
        const curColFieldId = curCellValueObj?.fieldId;
        const curCellValue = curCellValueObj.renderedFieldHtml?.trim();
        const curFieldSchema = fieldSchemas[curColFieldId];
        const fieldType = curFieldSchema?.schema?.type;
        if (!curColFieldId || !curFieldSchema || !fieldType) return;

        let el;
        const onChange = (newValue) => {
            updateIssue(curIssueKey, { fields: { [curColFieldId]: newValue } }).finally(refreshTable);
            el?.remove();
        };
        switch (fieldType) {
            case RestFieldType.Date: {
                const input = document.createElement('input');
                input.type = 'date';
                input.value = 
                // input.classList.add('el-jira-toolkit-add');
                input.onchange = () => {
                    const newValue = input.value;
                    onChange(newValue);
                };
                el = input;
                // input.onblur = () => input.remove();
                // prevEl = input;
                // td.appendChild(input);
                // input.click();
                break;
            }
            case RestFieldType.Number: {
                const input = document.createElement('input');
                input.type = 'number';
                // input.onchange = () => {
                //     // const newValue = Number(input.value);
                //     // onChange(newValue);
                // };
                input.onkeyup = (e) => {
                    if (e.key === 'Enter') {
                        const newValue = Number(input.value);
                        onChange(newValue);
                    }
                };
                el = input;
                break;
            }
            default:
                break;
        }
        if (el) {
            el.classList.add('el-jira-toolkit-add');
            el.onblur = () => el.remove();
            prevEl = el;
            td.appendChild(el);
            el.click?.();
        }
    });

    /**
     * @template {keyof HTMLElementTagNameMap} K
     * @template {keyof HTMLElementTagNameMap[K]} Attr
     * @param {K} tag 
     * @param {Record<Attr, HTMLElementTagNameMap[K][Attr]>} attrs 
     * @returns {HTMLElementTagNameMap[K]}
     */
    function createElement(tag, attrs) {
        const element = document.createElement(tag);
        for (const key in attrs) {
            if (Object.prototype.hasOwnProperty.call(attrs, key)) {
                element.setAttribute(key, attrs[key]);
            }
        }
        return element;
    }
    // createElement('input', { type: 'number', onchange: function () {
    //     this.value;
    // } });
})();