// ==UserScript==
// @name         KuCoin Event Tracker
// @namespace    kucoin
// @version      0.0.3
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
// @grant        none
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const t=document.createElement("style");t.textContent=e,document.head.append(t)})(" #kc_event_tracker{position:relative;z-index:100000;font-size:14px;line-height:1.3;color:#000000a6}#kc_event_tracker select,#kc_event_tracker input{outline:none;border:1px solid #8b8b8b;border-radius:4px;padding:2px 4px;color:#000000a6}#kc_event_tracker select{cursor:pointer}#kc_event_tracker input{width:200px;cursor:text}#kc_event_tracker .kcet-switch{color:#fff;background-color:#01bc8d;border:none;padding:6px 8px;border-radius:4px;position:fixed;right:0;bottom:60px;cursor:pointer}#kc_event_tracker .kcet-close,#kc_event_tracker .kcet-expand,#kc_event_tracker .kcet-collapse{position:absolute;top:6px;right:2px;cursor:pointer}#kc_event_tracker .kcet-expand,#kc_event_tracker .kcet-collapse{top:50%;right:-4px;transform:translateY(-50%)}#kc_event_tracker .kcet-clear{cursor:pointer}#kc_event_tracker .kcet-drag-line{position:absolute;top:-4px;width:100%;height:2px;border-top:3px solid transparent;border-bottom:3px solid transparent;box-sizing:content-box;cursor:ns-resize}#kc_event_tracker .kcet-drag-line:hover,#kc_event_tracker .kcet-drag-line.dragging{background-color:#01bc8d}#kc_event_tracker .kcet-panel{position:fixed;width:100%;height:500px;bottom:0;background-color:#fff;border-top:1px solid #c5c5c5}#kc_event_tracker .kcet-form{padding:6px;border-bottom:1px solid #c5c5c5}#kc_event_tracker .kcet-form-item{margin-right:12px}#kc_event_tracker .kcet-form-item,#kc_event_tracker .kcet-clear{vertical-align:middle}#kc_event_tracker .kcet-event-list{height:calc(100% - 33px);overflow-y:auto}#kc_event_tracker .kcet-event-item{padding:6px;border-bottom:1px solid #e3e3e3}#kc_event_tracker .kcet-event-item .summary{display:flex;align-items:baseline;position:relative;cursor:pointer}#kc_event_tracker .kcet-event-item .summary .col{margin-right:8px}#kc_event_tracker .kcet-event-item .summary .event{min-width:150px}#kc_event_tracker .kcet-event-item .summary .page_id{min-width:180px}#kc_event_tracker .kcet-event-item .detail{padding-left:2em}#kc_event_tracker .kcet-event-item .detail pre{background-color:#efefef}#kc_event_tracker .kcet-event-item .highlight{background-color:#abf5d1} ");

(function (preact) {
  'use strict';

  var f$1 = 0;
  function u$1(e2, t2, n, o2, i2, u2) {
    t2 || (t2 = {});
    var a2, c2, p2 = t2;
    if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
    var l2 = { type: e2, props: p2, key: n, ref: a2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --f$1, __i: -1, __u: 0, __source: i2, __self: u2 };
    if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
    return preact.options.vnode && preact.options.vnode(l2), l2;
  }
  var t, r, u, i, o = 0, f = [], c = [], e = preact.options, a = e.__b, v = e.__r, l = e.diffed, m = e.__c, s = e.unmount, d = e.__;
  function h(n, t2) {
    e.__h && e.__h(r, n, o || t2), o = 0;
    var u2 = r.__H || (r.__H = { __: [], __h: [] });
    return n >= u2.__.length && u2.__.push({ __V: c }), u2.__[n];
  }
  function p(n) {
    return o = 1, y(D, n);
  }
  function y(n, u2, i2) {
    var o2 = h(t++, 2);
    if (o2.t = n, !o2.__c && (o2.__ = [D(void 0, u2), function(n2) {
      var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n2);
      t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
    }], o2.__c = r, !r.u)) {
      var f2 = function(n2, t2, r2) {
        if (!o2.__c.__H) return true;
        var u3 = o2.__c.__H.__.filter(function(n3) {
          return !!n3.__c;
        });
        if (u3.every(function(n3) {
          return !n3.__N;
        })) return !c2 || c2.call(this, n2, t2, r2);
        var i3 = false;
        return u3.forEach(function(n3) {
          if (n3.__N) {
            var t3 = n3.__[0];
            n3.__ = n3.__N, n3.__N = void 0, t3 !== n3.__[0] && (i3 = true);
          }
        }), !(!i3 && o2.__c.props === n2) && (!c2 || c2.call(this, n2, t2, r2));
      };
      r.u = true;
      var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
      r.componentWillUpdate = function(n2, t2, r2) {
        if (this.__e) {
          var u3 = c2;
          c2 = void 0, f2(n2, t2, r2), c2 = u3;
        }
        e2 && e2.call(this, n2, t2, r2);
      }, r.shouldComponentUpdate = f2;
    }
    return o2.__N || o2.__;
  }
  function _(n, u2) {
    var i2 = h(t++, 3);
    !e.__s && C(i2.__H, u2) && (i2.__ = n, i2.i = u2, r.__H.__h.push(i2));
  }
  function F(n) {
    return o = 5, q(function() {
      return { current: n };
    }, []);
  }
  function q(n, r2) {
    var u2 = h(t++, 7);
    return C(u2.__H, r2) ? (u2.__V = n(), u2.i = r2, u2.__h = n, u2.__V) : u2.__;
  }
  function x(n, t2) {
    return o = 8, q(function() {
      return n;
    }, t2);
  }
  function j() {
    for (var n; n = f.shift(); ) if (n.__P && n.__H) try {
      n.__H.__h.forEach(z), n.__H.__h.forEach(B), n.__H.__h = [];
    } catch (t2) {
      n.__H.__h = [], e.__e(t2, n.__v);
    }
  }
  e.__b = function(n) {
    r = null, a && a(n);
  }, e.__ = function(n, t2) {
    n && t2.__k && t2.__k.__m && (n.__m = t2.__k.__m), d && d(n, t2);
  }, e.__r = function(n) {
    v && v(n), t = 0;
    var i2 = (r = n.__c).__H;
    i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n2) {
      n2.__N && (n2.__ = n2.__N), n2.__V = c, n2.__N = n2.i = void 0;
    })) : (i2.__h.forEach(z), i2.__h.forEach(B), i2.__h = [], t = 0)), u = r;
  }, e.diffed = function(n) {
    l && l(n);
    var t2 = n.__c;
    t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === e.requestAnimationFrame || ((i = e.requestAnimationFrame) || w)(j)), t2.__H.__.forEach(function(n2) {
      n2.i && (n2.__H = n2.i), n2.__V !== c && (n2.__ = n2.__V), n2.i = void 0, n2.__V = c;
    })), u = r = null;
  }, e.__c = function(n, t2) {
    t2.some(function(n2) {
      try {
        n2.__h.forEach(z), n2.__h = n2.__h.filter(function(n3) {
          return !n3.__ || B(n3);
        });
      } catch (r2) {
        t2.some(function(n3) {
          n3.__h && (n3.__h = []);
        }), t2 = [], e.__e(r2, n2.__v);
      }
    }), m && m(n, t2);
  }, e.unmount = function(n) {
    s && s(n);
    var t2, r2 = n.__c;
    r2 && r2.__H && (r2.__H.__.forEach(function(n2) {
      try {
        z(n2);
      } catch (n3) {
        t2 = n3;
      }
    }), r2.__H = void 0, t2 && e.__e(t2, r2.__v));
  };
  var k = "function" == typeof requestAnimationFrame;
  function w(n) {
    var t2, r2 = function() {
      clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n);
    }, u2 = setTimeout(r2, 100);
    k && (t2 = requestAnimationFrame(r2));
  }
  function z(n) {
    var t2 = r, u2 = n.__c;
    "function" == typeof u2 && (n.__c = void 0, u2()), r = t2;
  }
  function B(n) {
    var t2 = r;
    n.__c = n.__(), r = t2;
  }
  function C(n, t2) {
    return !n || n.length !== t2.length || t2.some(function(t3, r2) {
      return t3 !== n[r2];
    });
  }
  function D(n, t2) {
    return "function" == typeof t2 ? t2(n) : t2;
  }
  function IconExpand(props) {
    return /* @__PURE__ */ u$1("svg", { class: "kcet-expand", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", "p-id": "5560", width: "24", height: "24", ...props, children: /* @__PURE__ */ u$1("path", { d: "M368 416L320 464l194.24 194.24 194.24-194.24-48-48-146.24 146.24L368 416z", fill: "#000000", "fill-opacity": ".87", "p-id": "5561" }) });
  }
  function IconCollapse(props) {
    return /* @__PURE__ */ u$1("svg", { class: "kcet-collapse", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", "p-id": "6586", width: "24", height: "24", ...props, children: /* @__PURE__ */ u$1("path", { d: "M514.24 384L320 578.24l48 48L514.24 480l146.24 146.24 48-48L514.24 384z", fill: "#000000", "fill-opacity": ".87", "p-id": "6587" }) });
  }
  function IconClear(props) {
    return /* @__PURE__ */ u$1("svg", { class: "kcet-clear", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", "p-id": "7600", width: "24", height: "24", ...props, children: /* @__PURE__ */ u$1("path", { d: "M916.138667 198.4 919.296 195.242667 828.757333 104.704 825.6 107.861333C738.901333 40.533333 630.272 0 512 0 229.205333 0 0 229.290667 0 512 0 630.272 40.448 738.901333 107.861333 825.6L104.704 828.757333 195.157333 919.296 198.4 916.053333C285.013333 983.466667 393.642667 1024 512 1024 794.709333 1024 1024 794.709333 1024 512 1024 393.728 983.466667 285.098667 916.138667 198.4ZM73.130667 512C73.130667 269.994667 269.994667 73.130667 512 73.130667 606.634667 73.130667 721.578667 112.725333 793.344 163.84L177.493333 779.52C126.378667 707.84 73.130667 606.634667 73.130667 512ZM512 950.869333C417.365333 950.869333 307.029333 897.536 235.178667 846.421333L855.637333 226.133333C906.666667 297.898667 950.869333 417.365333 950.869333 512 950.869333 754.005333 754.005333 950.869333 512 950.869333Z", fill: "#272636", "p-id": "7601" }) });
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
    format = format.replace(/(y+|Y+)/g, (p2) => {
      return date.getFullYear().toString().slice(-p2.length);
    });
    format = format.replace(/(S+)/g, (p2) => {
      const v2 = date.getMilliseconds().toString();
      return p2.length > v2.length ? ("00" + v2).slice(-p2.length) : v2;
    });
    return format.replace(/(M+|d+|h+|m+|s+)/g, (p2) => {
      return ((p2.length > 1 ? "0" : "") + map[p2.slice(-1)]).slice(-2);
    });
  }
  function HighlightSearchText({ text, search }) {
    const fragments = q(() => {
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
    return /* @__PURE__ */ u$1(preact.Fragment, { children: fragments.map(([item, matched], idx) => matched ? /* @__PURE__ */ u$1("span", { class: "highlight", children: item }, idx) : item) });
  }
  function EventItemView(props) {
    var _a, _b, _c;
    const { data: item, type, category, pageId, spmId } = props;
    const [expanded, setExpanded] = p(false);
    return /* @__PURE__ */ u$1("div", { class: "kcet-event-item", children: [
      /* @__PURE__ */ u$1("div", { class: "summary", onClick: (e2) => {
        setExpanded(!expanded);
        e2.stopPropagation();
      }, children: [
        /* @__PURE__ */ u$1("span", { class: "col time", children: formatDate(item.time, "hh:mm:ss.SSS") }),
        " ",
        /* @__PURE__ */ u$1("span", { class: "col type", children: /* @__PURE__ */ u$1(HighlightSearchText, { text: item.type, search: type }) }),
        " ",
        /* @__PURE__ */ u$1("span", { class: "col event", children: /* @__PURE__ */ u$1(HighlightSearchText, { text: item.event, search: category }) }),
        " ",
        /* @__PURE__ */ u$1("span", { class: "col app_name", children: /* @__PURE__ */ u$1(HighlightSearchText, { text: (_a = item.properties) == null ? void 0 : _a.app_name, search: "" }) }),
        " ",
        /* @__PURE__ */ u$1("span", { class: "col page_id", children: /* @__PURE__ */ u$1(HighlightSearchText, { text: (_b = item.properties) == null ? void 0 : _b.page_id, search: pageId }) }),
        " ",
        /* @__PURE__ */ u$1("span", { class: "col spm_id", children: /* @__PURE__ */ u$1(HighlightSearchText, { text: (_c = item.properties) == null ? void 0 : _c.spm_id, search: spmId }) }),
        !expanded ? /* @__PURE__ */ u$1(IconExpand, {}) : /* @__PURE__ */ u$1(IconCollapse, {})
      ] }),
      expanded && /* @__PURE__ */ u$1("div", { class: "detail", children: /* @__PURE__ */ u$1("pre", { children: JSON.stringify(item, null, 4) }) })
    ] });
  }
  function useTapToDrag(options2) {
    const onDragStart = F(options2.onDragStart);
    const onDragMove = F(options2.onDragMove);
    const onDragEnd = F(options2.onDragEnd);
    onDragStart.current = options2.onDragStart;
    onDragMove.current = options2.onDragMove;
    onDragEnd.current = options2.onDragEnd;
    const handleTapStart = x((e2) => {
      var _a;
      document.addEventListener("mousemove", hanldeTapMove);
      document.addEventListener("mouseup", hanldeTapEnd);
      (_a = onDragStart.current) == null ? void 0 : _a.call(onDragStart, e2);
      e2.stopPropagation();
    }, []);
    const hanldeTapMove = x((e2) => {
      var _a;
      (_a = onDragMove.current) == null ? void 0 : _a.call(onDragMove, e2);
      e2.stopPropagation();
    }, []);
    const hanldeTapEnd = x((e2) => {
      var _a;
      document.removeEventListener("mousemove", hanldeTapMove);
      document.removeEventListener("mouseup", hanldeTapEnd);
      (_a = onDragEnd.current) == null ? void 0 : _a.call(onDragEnd, e2);
      e2.stopPropagation();
    }, []);
    return handleTapStart;
  }
  function useDragOffset() {
    const [dragging, setDragging] = p(false);
    const [offsetX, setOffsetX] = p(0);
    const [offsetY, setOffsetY] = p(0);
    const [relativeOffsetX, setRelativeOffsetX] = p(0);
    const [relativeOffsetY, setRelativeOffsetY] = p(0);
    const startX = F(0);
    const startY = F(0);
    const lastX = F(0);
    const lastY = F(0);
    const onTapStart = useTapToDrag({
      onDragStart: (e2) => {
        startX.current = e2.clientX;
        startY.current = e2.clientY;
        lastX.current = e2.clientX;
        lastY.current = e2.clientY;
        setDragging(true);
      },
      onDragMove: (e2) => {
        const offsetX2 = e2.clientX - startX.current;
        const offsetY2 = e2.clientY - startY.current;
        const relativeOffsetX2 = e2.clientX - lastX.current;
        const relativeOffsetY2 = e2.clientY - lastY.current;
        setOffsetX(offsetX2);
        setOffsetY(offsetY2);
        setRelativeOffsetX(relativeOffsetX2);
        setRelativeOffsetY(relativeOffsetY2);
        lastX.current = e2.clientX;
        lastY.current = e2.clientY;
      },
      onDragEnd: (e2) => {
        const offsetX2 = e2.clientX - startX.current;
        const offsetY2 = e2.clientY - startY.current;
        const relativeOffsetX2 = e2.clientX - lastX.current;
        const relativeOffsetY2 = e2.clientY - lastY.current;
        setOffsetX(offsetX2);
        setOffsetY(offsetY2);
        setRelativeOffsetX(relativeOffsetX2);
        setRelativeOffsetY(relativeOffsetY2);
        setDragging(false);
        lastX.current = e2.clientX;
        lastY.current = e2.clientY;
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
    _(() => {
      if (!target.current) return;
      const { width, height } = target.current.getBoundingClientRect();
      if (direction === "vertical") {
        target.current.style.height = `${height - relativeOffsetY}px`;
      } else {
        target.current.style.width = `${width - relativeOffsetY}px`;
      }
    }, [direction, relativeOffsetY]);
    return /* @__PURE__ */ u$1(
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
    str = Array.prototype.map.call(str, function(c2) {
      const code = c2.charCodeAt(0);
      if ([33, 45, 46, 95, 126].includes(code) || code >= 39 && code <= 42 || code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122) {
        return c2;
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
    const [datas, setDatas] = p([]);
    const [types, setTypes] = p([]);
    const [categories, setCategories] = p([]);
    const clearData = x(() => {
      setDatas([]);
    }, []);
    _(() => {
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
          } catch (e2) {
            console.error("[KCET] decodeTrackData error:", e2);
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
    const [panelVisible, setPanelVisible] = p(false);
    const [mode, setMode] = p("Filter");
    const [type, setType] = p("");
    const [category, setCategory] = p("");
    const [pageId, setPageId] = p("");
    const [spmId, setSpmId] = p("");
    const panelRef = F(null);
    const { datas, types, categories, clearData } = useEventCollector();
    const filteredDatas = q(() => {
      if (mode === "Highlight" || !type && !category && !pageId && !spmId) return datas;
      return datas.filter((item) => {
        var _a, _b, _c, _d;
        return (!type || item.type === type) && (!category || item.event === category) && (!pageId || !!((_b = (_a = item.properties) == null ? void 0 : _a.page_id) == null ? void 0 : _b.includes(pageId))) && (!spmId || !!((_d = (_c = item.properties) == null ? void 0 : _c.spm_id) == null ? void 0 : _d.includes(spmId)));
      });
    }, [datas, mode, type, category, pageId, spmId]);
    return /* @__PURE__ */ u$1(preact.Fragment, { children: [
      !panelVisible && /* @__PURE__ */ u$1("button", { class: "kcet-switch", onClick: () => setPanelVisible(true), children: "KC Event Tracker" }),
      panelVisible && /* @__PURE__ */ u$1("div", { class: "kcet-panel", ref: panelRef, children: [
        /* @__PURE__ */ u$1(DragLine, { target: panelRef }),
        /* @__PURE__ */ u$1("div", { class: "kcet-form", children: [
          /* @__PURE__ */ u$1("select", { class: "kcet-form-item", placeholder: "mode", value: mode, onChange: (e2) => setMode(e2.target.value), children: ["Filter", "Highlight"].map((item) => /* @__PURE__ */ u$1("option", { value: item, children: item })) }),
          /* @__PURE__ */ u$1("select", { class: "kcet-form-item", placeholder: "type", value: type, onChange: (e2) => setType(e2.target.value), children: ["All", ...types].map((item) => /* @__PURE__ */ u$1("option", { value: item === "All" ? "" : item, children: item })) }),
          /* @__PURE__ */ u$1("select", { class: "kcet-form-item", placeholder: "event", value: category, onChange: (e2) => setCategory(e2.target.value), children: ["All", ...categories].map((item) => /* @__PURE__ */ u$1("option", { value: item === "All" ? "" : item, children: item })) }),
          /* @__PURE__ */ u$1("input", { type: "text", class: "kcet-form-item", placeholder: "page_id (支持模糊搜索)", value: pageId, onInput: (e2) => {
            var _a;
            return setPageId((_a = e2.target) == null ? void 0 : _a.value);
          } }),
          /* @__PURE__ */ u$1("input", { type: "text", class: "kcet-form-item", placeholder: "spm_id (支持模糊搜索)", value: spmId, onInput: (e2) => {
            var _a;
            return setSpmId((_a = e2.target) == null ? void 0 : _a.value);
          } }),
          /* @__PURE__ */ u$1(IconClear, { width: "1.3em", height: "1.3em", title: "清空数据", onClick: clearData })
        ] }),
        /* @__PURE__ */ u$1("div", { class: "kcet-event-list", children: filteredDatas.map((item) => {
          return /* @__PURE__ */ u$1(EventItemView, { data: item, type, category, pageId, spmId }, item._track_id);
        }) }),
        /* @__PURE__ */ u$1("svg", { class: "kcet-close", onClick: () => setPanelVisible(false), viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", "p-id": "4555", width: "24", height: "24", children: /* @__PURE__ */ u$1("path", { d: "M504.224 470.288l207.84-207.84a16 16 0 0 1 22.608 0l11.328 11.328a16 16 0 0 1 0 22.624l-207.84 207.824 207.84 207.84a16 16 0 0 1 0 22.608l-11.328 11.328a16 16 0 0 1-22.624 0l-207.824-207.84-207.84 207.84a16 16 0 0 1-22.608 0l-11.328-11.328a16 16 0 0 1 0-22.624l207.84-207.824-207.84-207.84a16 16 0 0 1 0-22.608l11.328-11.328a16 16 0 0 1 22.624 0l207.824 207.84z", fill: "#000000", "p-id": "4556" }) })
      ] })
    ] });
  }
  if (/^nginx-web-.*\.(dev|sit).kucoin.net|www\.kucoin\.com|localhost\:?[0-9]*$/i.test(location.host)) {
    preact.render(
      /* @__PURE__ */ u$1(App, {}),
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

})(preact);