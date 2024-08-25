import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

export interface EventItem {
  _track_id: number;
  event: 'expose' | 'page_click';
  type: 'track';
  time: number;
  properties: {
    app_name: string;
    page_id: string;
    spm_id: string;
  };
}

/**
 * 解码事件数据
 * @param str 
 * 
 * @example
 * ```js
  function encodeTrackData(e = JSON.stringify(o)) {
    var t = btoa(encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, function(e, t) {
        return String.fromCharCode("0x" + t)
    }));
    return 'data=' + encodeURIComponent(t) + '&ext=' + encodeURIComponent(r = 'crc' + number);
  }
 * ```
 */
function decodeTrackData(str: string) {
  const startIdx = 'data='.length;
  const endIdx = str.lastIndexOf('&ext=');
  if (endIdx < 0 || str.length <= startIdx) return null;
  str = str.substring(startIdx, endIdx);
  str = atob(decodeURIComponent(str));
  str = Array.prototype.map.call(str, function (c: string) {
    const code = c.charCodeAt(0);
    // encodeURIComponent不会编码的ASCII: 33, 39~42, 45-46,48~57, 65~90, 95, 97~122, 126
    if (
      [33, 45, 46, 95, 126].includes(code)
      || code >= 39 && code <= 42
      || code >= 48 && code <= 57
      || code >= 65 && code <= 90
      || code >= 97 && code <= 122
    ) {
      return c;
    }
    return '%' + ('00' + code.toString(16)).slice(-2);
  }).join('');
  str = decodeURIComponent(str);
  return JSON.parse(str);
}

function isTrackEvent(data: any): data is EventItem {
  return typeof data === 'object' && data !== null && '_track_id' in data && 'event' in data && 'properties' in data;
}

const originalSendBeacon = navigator.sendBeacon;

/**
 * 通过劫持 API 收集埋点数据
 */
export default function useEventCollector(panelVisible: boolean) {
  const [datas, setDatas] = useState<EventItem[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const clearData = useCallback(() => {
    setDatas([]);
  }, []);

  // 劫持 navigator.sendBeacon 版本
  useEffect(() => {
    navigator.sendBeacon = (url, data, ...rest) => {
      const result = originalSendBeacon.call(navigator, url, data, ...rest);
      if (typeof url === 'string' && url.startsWith('https://bigdata-scfx-push.kucoin.plus/sa.gif') && typeof data === 'string') {
        try {
          const obj = decodeTrackData(data);
          if (isTrackEvent(obj)) {
            const { type, event } = obj;
            setTypes((types) => {
              if (!type || types.includes(type)) return types;
              return [...types, type];
            });
            setCategories((categories) => {
              if (!event || categories.includes(event)) return categories;
              return [...categories, event];
            });
            setDatas((datas) => [obj, ...datas]);
          }
        } catch (e) {
          console.error('[KCET] decodeTrackData error:', e);
        }
      }
      return result;
    };

    return () => {
      // 恢复
      navigator.sendBeacon = originalSendBeacon;
    };
  }, []);

  return {
    datas,
    types,
    categories,
    clearData,
  };
}
