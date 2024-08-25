// ==UserScript==
// @name         KuCoin Event Tracker
// @namespace    kucoin
// @version      0.0.2
// @author       herin.yao@kupotech.com
// @description  Track and log event in KuCoin website
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kucoin.com
// @downloadURL  https://bitbucket.kucoin.net/users/herin.yao_kupotech.com/repos/tools/raw/tampermonkey/kc-event-tracker.user.js
// @updateURL    https://bitbucket.kucoin.net/users/herin.yao_kupotech.com/repos/tools/raw/tampermonkey/kc-event-tracker.user.js
// @match        https://www.kucoin.com/*
// @match        https://*.dev.kucoin.net/*
// @match        https://*.sit.kucoin.net/*
// @match        http://localhost*
// @require      https://cdn.jsdelivr.net/npm/preact@10.22.0/dist/preact.min.js
// @require      https://cdn.jsdelivr.net/npm/preact/hooks@0.1.0/hooks/dist/hooks.umd.js
// @grant        none
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" #kc_event_tracker{position:relative;z-index:100000;font-size:14px;line-height:1.3;color:#000000a6}#kc_event_tracker select,#kc_event_tracker input{outline:none;border:1px solid #8b8b8b;border-radius:4px;padding:2px 4px;color:#000000a6}#kc_event_tracker select{cursor:pointer}#kc_event_tracker input{width:200px;cursor:text}#kc_event_tracker .kcet-switch{color:#fff;background-color:#01bc8d;border:none;padding:6px 8px;border-radius:4px;position:fixed;right:0;bottom:60px;cursor:pointer}#kc_event_tracker .kcet-close,#kc_event_tracker .kcet-expand,#kc_event_tracker .kcet-collapse{position:absolute;top:6px;right:2px;cursor:pointer}#kc_event_tracker .kcet-expand,#kc_event_tracker .kcet-collapse{top:50%;right:-4px;transform:translateY(-50%)}#kc_event_tracker .kcet-clear{cursor:pointer}#kc_event_tracker .kcet-drag-line{position:absolute;top:-4px;width:100%;height:2px;border-top:3px solid transparent;border-bottom:3px solid transparent;box-sizing:content-box;cursor:ns-resize}#kc_event_tracker .kcet-drag-line:hover,#kc_event_tracker .kcet-drag-line.dragging{background-color:#01bc8d}#kc_event_tracker .kcet-panel{position:fixed;width:100%;height:500px;bottom:0;background-color:#fff;border-top:1px solid #c5c5c5}#kc_event_tracker .kcet-form{padding:6px;border-bottom:1px solid #c5c5c5}#kc_event_tracker .kcet-form-item{margin-right:12px}#kc_event_tracker .kcet-form-item,#kc_event_tracker .kcet-clear{vertical-align:middle}#kc_event_tracker .kcet-event-list{height:calc(100% - 33px);overflow-y:auto}#kc_event_tracker .kcet-event-item{padding:6px;border-bottom:1px solid #e3e3e3}#kc_event_tracker .kcet-event-item .summary{display:flex;align-items:baseline;position:relative;cursor:pointer}#kc_event_tracker .kcet-event-item .summary .col{margin-right:8px}#kc_event_tracker .kcet-event-item .summary .event{min-width:150px}#kc_event_tracker .kcet-event-item .summary .page_id{min-width:180px}#kc_event_tracker .kcet-event-item .detail{padding-left:2em}#kc_event_tracker .kcet-event-item .detail pre{background-color:#efefef}#kc_event_tracker .kcet-event-item .highlight{background-color:#abf5d1} ");

(function (preact, hooks) {
  'use strict';

  var f = 0;
  function u(e, t, n, o, i, u2) {
    t || (t = {});
    var a, c, p = t;
    if ("ref" in p) for (c in p = {}, t) "ref" == c ? a = t[c] : p[c] = t[c];
    var l = { type: e, props: p, key: n, ref: a, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --f, __i: -1, __u: 0, __source: i, __self: u2 };
    if ("function" == typeof e && (a = e.defaultProps)) for (c in a) void 0 === p[c] && (p[c] = a[c]);
    return preact.options.vnode && preact.options.vnode(l), l;
  }
  function IconExpand(props) {
    return /* @__PURE__ */ u("svg", { class: "kcet-expand", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", "p-id": "5560", width: "24", height: "24", ...props, children: /* @__PURE__ */ u("path", { d: "M368 416L320 464l194.24 194.24 194.24-194.24-48-48-146.24 146.24L368 416z", fill: "#000000", "fill-opacity": ".87", "p-id": "5561" }) });
  }
  function IconCollapse(props) {
    return /* @__PURE__ */ u("svg", { class: "kcet-collapse", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", "p-id": "6586", width: "24", height: "24", ...props, children: /* @__PURE__ */ u("path", { d: "M514.24 384L320 578.24l48 48L514.24 480l146.24 146.24 48-48L514.24 384z", fill: "#000000", "fill-opacity": ".87", "p-id": "6587" }) });
  }
  function IconClear(props) {
    return /* @__PURE__ */ u("svg", { class: "kcet-clear", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", "p-id": "7600", width: "24", height: "24", ...props, children: /* @__PURE__ */ u("path", { d: "M916.138667 198.4 919.296 195.242667 828.757333 104.704 825.6 107.861333C738.901333 40.533333 630.272 0 512 0 229.205333 0 0 229.290667 0 512 0 630.272 40.448 738.901333 107.861333 825.6L104.704 828.757333 195.157333 919.296 198.4 916.053333C285.013333 983.466667 393.642667 1024 512 1024 794.709333 1024 1024 794.709333 1024 512 1024 393.728 983.466667 285.098667 916.138667 198.4ZM73.130667 512C73.130667 269.994667 269.994667 73.130667 512 73.130667 606.634667 73.130667 721.578667 112.725333 793.344 163.84L177.493333 779.52C126.378667 707.84 73.130667 606.634667 73.130667 512ZM512 950.869333C417.365333 950.869333 307.029333 897.536 235.178667 846.421333L855.637333 226.133333C906.666667 297.898667 950.869333 417.365333 950.869333 512 950.869333 754.005333 754.005333 950.869333 512 950.869333Z", fill: "#272636", "p-id": "7601" }) });
  }
  function formatDate(date, format) {
    if (typeof date === "number" || typeof date === "string") {
      date = new Date(date);
    }
    const map = {
      "M": date.getMonth() + 1,
      "d": date.getDate(),
      "h": date.getHours(),
      "m": date.getMinutes(),
      "s": date.getSeconds(),
      "S": date.getMilliseconds()
    };
    format = format.replace(/(y+|Y+)/g, (p) => {
      return date.getFullYear().toString().slice(-p.length);
    });
    format = format.replace(/(S+)/g, (p) => {
      const v = date.getMilliseconds().toString();
      return p.length > v.length ? ("00" + v).slice(-p.length) : v;
    });
    return format.replace(/(M+|d+|h+|m+|s+)/g, (p) => {
      return ((p.length > 1 ? "0" : "") + map[p.slice(-1)]).slice(-2);
    });
  }
  function HighlightSearchText({ text, search }) {
    const fragments = hooks.useMemo(() => {
      if (!text || !search) return [[text, false]];
      const fragments2 = [];
      let str = text;
      let lstr = str.toLowerCase();
      const lsearch = search.toLowerCase();
      let endIdx = lstr.indexOf(lsearch);
      while (endIdx >= 0 && endIdx < str.length) {
        fragments2.push([str.substring(0, endIdx), false], [str.substring(endIdx, endIdx + search.length), true]);
        str = str.substring(endIdx + search.length);
        lstr = lstr.substring(endIdx + search.length);
        endIdx = lstr.indexOf(lsearch);
      }
      fragments2.push([str, false]);
      return fragments2.filter(Boolean);
    }, [text, search]);
    return /* @__PURE__ */ u(preact.Fragment, { children: fragments.map(([item, matched], idx) => matched ? /* @__PURE__ */ u("span", { class: "highlight", children: item }, idx) : item) });
  }
  function EventItemView(props) {
    var _a, _b;
    const { data: item, type, category, pageId, spmId } = props;
    const [expanded, setExpanded] = hooks.useState(false);
    return /* @__PURE__ */ u("div", { class: "kcet-event-item", children: [
      /* @__PURE__ */ u("div", { class: "summary", onClick: (e) => {
        setExpanded(!expanded);
        e.stopPropagation();
      }, children: [
        /* @__PURE__ */ u("span", { class: "col time", children: formatDate(item.time, "hh:mm:ss.SSS") }),
        " ",
        /* @__PURE__ */ u("span", { class: "col type", children: /* @__PURE__ */ u(HighlightSearchText, { text: item.type, search: type }) }),
        " ",
        /* @__PURE__ */ u("span", { class: "col event", children: /* @__PURE__ */ u(HighlightSearchText, { text: item.event, search: category }) }),
        " ",
        /* @__PURE__ */ u("span", { class: "col page_id", children: /* @__PURE__ */ u(HighlightSearchText, { text: (_a = item.properties) == null ? void 0 : _a.page_id, search: pageId }) }),
        " ",
        /* @__PURE__ */ u("span", { class: "col spm_id", children: /* @__PURE__ */ u(HighlightSearchText, { text: (_b = item.properties) == null ? void 0 : _b.spm_id, search: spmId }) }),
        !expanded ? /* @__PURE__ */ u(IconExpand, {}) : /* @__PURE__ */ u(IconCollapse, {})
      ] }),
      expanded && /* @__PURE__ */ u("div", { class: "detail", children: /* @__PURE__ */ u("pre", { children: JSON.stringify(item, null, 4) }) })
    ] });
  }
  function useTapToDrag(options2) {
    const onDragStart = hooks.useRef(options2.onDragStart);
    const onDragMove = hooks.useRef(options2.onDragMove);
    const onDragEnd = hooks.useRef(options2.onDragEnd);
    onDragStart.current = options2.onDragStart;
    onDragMove.current = options2.onDragMove;
    onDragEnd.current = options2.onDragEnd;
    const handleTapStart = hooks.useCallback((e) => {
      var _a;
      document.addEventListener("mousemove", hanldeTapMove);
      document.addEventListener("mouseup", hanldeTapEnd);
      (_a = onDragStart.current) == null ? void 0 : _a.call(onDragStart, e);
      e.stopPropagation();
    }, []);
    const hanldeTapMove = hooks.useCallback((e) => {
      var _a;
      (_a = onDragMove.current) == null ? void 0 : _a.call(onDragMove, e);
      e.stopPropagation();
    }, []);
    const hanldeTapEnd = hooks.useCallback((e) => {
      var _a;
      document.removeEventListener("mousemove", hanldeTapMove);
      document.removeEventListener("mouseup", hanldeTapEnd);
      (_a = onDragEnd.current) == null ? void 0 : _a.call(onDragEnd, e);
      e.stopPropagation();
    }, []);
    return handleTapStart;
  }
  function useDragOffset() {
    const [dragging, setDragging] = hooks.useState(false);
    const [offsetX, setOffsetX] = hooks.useState(0);
    const [offsetY, setOffsetY] = hooks.useState(0);
    const [relativeOffsetX, setRelativeOffsetX] = hooks.useState(0);
    const [relativeOffsetY, setRelativeOffsetY] = hooks.useState(0);
    const startX = hooks.useRef(0);
    const startY = hooks.useRef(0);
    const lastX = hooks.useRef(0);
    const lastY = hooks.useRef(0);
    const onTapStart = useTapToDrag({
      onDragStart: (e) => {
        startX.current = e.clientX;
        startY.current = e.clientY;
        lastX.current = e.clientX;
        lastY.current = e.clientY;
        setDragging(true);
      },
      onDragMove: (e) => {
        const offsetX2 = e.clientX - startX.current;
        const offsetY2 = e.clientY - startY.current;
        const relativeOffsetX2 = e.clientX - lastX.current;
        const relativeOffsetY2 = e.clientY - lastY.current;
        setOffsetX(offsetX2);
        setOffsetY(offsetY2);
        setRelativeOffsetX(relativeOffsetX2);
        setRelativeOffsetY(relativeOffsetY2);
        lastX.current = e.clientX;
        lastY.current = e.clientY;
      },
      onDragEnd: (e) => {
        const offsetX2 = e.clientX - startX.current;
        const offsetY2 = e.clientY - startY.current;
        const relativeOffsetX2 = e.clientX - lastX.current;
        const relativeOffsetY2 = e.clientY - lastY.current;
        setOffsetX(offsetX2);
        setOffsetY(offsetY2);
        setRelativeOffsetX(relativeOffsetX2);
        setRelativeOffsetY(relativeOffsetY2);
        setDragging(false);
        lastX.current = e.clientX;
        lastY.current = e.clientY;
      }
    });
    return {
      dragging,
      offsetX,
      offsetY,
      relativeOffsetX,
      relativeOffsetY,
      onTapStart
    };
  }
  function DragLine({ target, direction = "vertical" }) {
    const { dragging, relativeOffsetY, onTapStart } = useDragOffset();
    hooks.useEffect(() => {
      if (!target.current) return;
      const { width, height } = target.current.getBoundingClientRect();
      if (direction === "vertical") {
        target.current.style.height = `${height - relativeOffsetY}px`;
      } else {
        target.current.style.width = `${width - relativeOffsetY}px`;
      }
    }, [direction, relativeOffsetY]);
    return /* @__PURE__ */ u(
      "div",
      {
        class: "kcet-drag-line " + (dragging ? "dragging" : ""),
        onMouseDown: onTapStart
      }
    );
  }
  function decodeTrackData(str) {
    const startIdx = "data=".length;
    const endIdx = str.lastIndexOf("&ext=");
    if (endIdx < 0 || str.length <= startIdx) return null;
    str = str.substring(startIdx, endIdx);
    str = atob(decodeURIComponent(str));
    str = Array.prototype.map.call(str, function(c) {
      const code = c.charCodeAt(0);
      if ([33, 45, 46, 95, 126].includes(code) || code >= 39 && code <= 42 || code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122) {
        return c;
      }
      return "%" + ("00" + code.toString(16)).slice(-2);
    }).join("");
    str = decodeURIComponent(str);
    return JSON.parse(str);
  }
  function isTrackEvent(data) {
    return typeof data === "object" && data !== null && "_track_id" in data && "event" in data && "properties" in data;
  }
  const originalSendBeacon = navigator.sendBeacon;
  function useEventCollector(panelVisible) {
    const [datas, setDatas] = hooks.useState([]);
    const [types, setTypes] = hooks.useState([]);
    const [categories, setCategories] = hooks.useState([]);
    const clearData = hooks.useCallback(() => {
      setDatas([]);
    }, []);
    hooks.useEffect(() => {
      navigator.sendBeacon = (url, data, ...rest) => {
        const result = originalSendBeacon.call(navigator, url, data, ...rest);
        if (typeof url === "string" && url.startsWith("https://bigdata-scfx-push.kucoin.plus/sa.gif") && typeof data === "string") {
          try {
            const obj = decodeTrackData(data);
            if (isTrackEvent(obj)) {
              const { type, event } = obj;
              setTypes((types2) => {
                if (!type || types2.includes(type)) return types2;
                return [...types2, type];
              });
              setCategories((categories2) => {
                if (!event || categories2.includes(event)) return categories2;
                return [...categories2, event];
              });
              setDatas((datas2) => [obj, ...datas2]);
            }
          } catch (e) {
            console.error("[KCET] decodeTrackData error:", e);
          }
        }
        return result;
      };
      return () => {
        navigator.sendBeacon = originalSendBeacon;
      };
    }, []);
    return {
      datas,
      types,
      categories,
      clearData
    };
  }
  function App() {
    const [panelVisible, setPanelVisible] = hooks.useState(false);
    const [mode, setMode] = hooks.useState("Filter");
    const [type, setType] = hooks.useState("");
    const [category, setCategory] = hooks.useState("");
    const [pageId, setPageId] = hooks.useState("");
    const [spmId, setSpmId] = hooks.useState("");
    const panelRef = hooks.useRef(null);
    const { datas, types, categories, clearData } = useEventCollector();
    const filteredDatas = hooks.useMemo(() => {
      if (mode === "Highlight" || !type && !category && !pageId && !spmId) return datas;
      return datas.filter((item) => {
        var _a, _b, _c, _d;
        return (!type || item.type === type) && (!category || item.event === category) && (!pageId || !!((_b = (_a = item.properties) == null ? void 0 : _a.page_id) == null ? void 0 : _b.includes(pageId))) && (!spmId || !!((_d = (_c = item.properties) == null ? void 0 : _c.spm_id) == null ? void 0 : _d.includes(spmId)));
      });
    }, [datas, mode, type, category, pageId, spmId]);
    return /* @__PURE__ */ u(preact.Fragment, { children: [
      !panelVisible && /* @__PURE__ */ u("button", { class: "kcet-switch", onClick: () => setPanelVisible(true), children: "KC Event Tracker" }),
      panelVisible && /* @__PURE__ */ u("div", { class: "kcet-panel", ref: panelRef, children: [
        /* @__PURE__ */ u(DragLine, { target: panelRef }),
        /* @__PURE__ */ u("div", { class: "kcet-form", children: [
          /* @__PURE__ */ u("select", { class: "kcet-form-item", placeholder: "mode", value: mode, onChange: (e) => setMode(e.target.value), children: ["Filter", "Highlight"].map((item) => /* @__PURE__ */ u("option", { value: item, children: item })) }),
          /* @__PURE__ */ u("select", { class: "kcet-form-item", placeholder: "type", value: type, onChange: (e) => setType(e.target.value), children: ["All", ...types].map((item) => /* @__PURE__ */ u("option", { value: item === "All" ? "" : item, children: item })) }),
          /* @__PURE__ */ u("select", { class: "kcet-form-item", placeholder: "event", value: category, onChange: (e) => setCategory(e.target.value), children: ["All", ...categories].map((item) => /* @__PURE__ */ u("option", { value: item === "All" ? "" : item, children: item })) }),
          /* @__PURE__ */ u("input", { type: "text", class: "kcet-form-item", placeholder: "page_id (支持模糊搜索)", value: pageId, onInput: (e) => {
            var _a;
            return setPageId((_a = e.target) == null ? void 0 : _a.value);
          } }),
          /* @__PURE__ */ u("input", { type: "text", class: "kcet-form-item", placeholder: "spm_id (支持模糊搜索)", value: spmId, onInput: (e) => {
            var _a;
            return setSpmId((_a = e.target) == null ? void 0 : _a.value);
          } }),
          /* @__PURE__ */ u(IconClear, { width: "1.3em", height: "1.3em", title: "清空数据", onClick: clearData })
        ] }),
        /* @__PURE__ */ u("div", { class: "kcet-event-list", children: filteredDatas.map((item) => {
          return /* @__PURE__ */ u(EventItemView, { data: item, type, category, pageId, spmId }, item._track_id);
        }) }),
        /* @__PURE__ */ u("svg", { class: "kcet-close", onClick: () => setPanelVisible(false), viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", "p-id": "4555", width: "24", height: "24", children: /* @__PURE__ */ u("path", { d: "M504.224 470.288l207.84-207.84a16 16 0 0 1 22.608 0l11.328 11.328a16 16 0 0 1 0 22.624l-207.84 207.824 207.84 207.84a16 16 0 0 1 0 22.608l-11.328 11.328a16 16 0 0 1-22.624 0l-207.824-207.84-207.84 207.84a16 16 0 0 1-22.608 0l-11.328-11.328a16 16 0 0 1 0-22.624l207.84-207.824-207.84-207.84a16 16 0 0 1 0-22.608l11.328-11.328a16 16 0 0 1 22.624 0l207.824 207.84z", fill: "#000000", "p-id": "4556" }) })
      ] })
    ] });
  }
  if (/^nginx-web-.*\.(dev|sit).kucoin.net|www\.kucoin\.com|localhost\:?[0-9]*$/i.test(location.host)) {
    preact.render(
      /* @__PURE__ */ u(App, {}),
      (() => {
        console.warn("______ KuCoin Event Tracker ______");
        const app = document.createElement("div");
        app.id = "kc_event_tracker";
        app.dir = "ltr";
        document.body.appendChild(app);
        return app;
      })()
    );
  }

})(preact, preact);