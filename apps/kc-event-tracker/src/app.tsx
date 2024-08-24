import { useMemo, useRef, useState } from 'preact/hooks';

import EventItemView from './components/EventItemView';
import DragLine from './components/DragLine';
import { IconClear } from './icons';
import useEventCollector from './hooks/useEventCollector';

import './index.less';

export function App() {
  const [panelVisible, setPanelVisible] = useState(false);

  // 模式：过滤模式-只展示符合条件的数据；高亮模式-展示全部数据，高亮满足条件的数据
  const [mode, setMode] = useState('Filter');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [pageId, setPageId] = useState('');
  const [spmId, setSpmId] = useState('');

  const panelRef = useRef<HTMLDivElement>(null);

  const { datas, types, categories, clearData } = useEventCollector(panelVisible);

  const filteredDatas = useMemo(() => {
    if (mode === 'Highlight' || !type && !category && !pageId && !spmId) return datas;
    return datas.filter(item => {
      return (!type || item.type === type) && (!category || item.event === category)
        && (!pageId || !!item.properties?.page_id?.includes(pageId)) && (!spmId || !!item.properties?.spm_id?.includes(spmId));
    });
  }, [datas, mode, type, category, pageId, spmId]);

  return (
    <>
      {!panelVisible && <button class="kcet-switch" onClick={() => setPanelVisible(true)}>KC Event Tracker</button>}
      {panelVisible && (
        <div class="kcet-panel" ref={panelRef}>
          <DragLine target={panelRef} />
          <div class="kcet-form">
            {/* @ts-expect-error */}
            <select class="kcet-form-item" placeholder="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
              {['Filter', 'Highlight'].map(item => <option value={item}>{item}</option>)}
            </select>
            {/* @ts-expect-error */}
            <select class="kcet-form-item" placeholder="type" value={type} onChange={(e) => setType(e.target.value)}>
              {['All', ...types].map(item => <option value={item === 'All' ? '' : item}>{item}</option>)}
            </select>
            {/* @ts-expect-error */}
            <select class="kcet-form-item" placeholder="event" value={category} onChange={(e) => setCategory(e.target.value)}>
              {['All', ...categories].map(item => <option value={item === 'All' ? '' : item}>{item}</option>)}
            </select>
            {/* @ts-expect-error */}
            <input type="text" class="kcet-form-item" placeholder="page_id (支持模糊搜索)" value={pageId} onInput={(e) => setPageId(e.target?.value)} />
            {/* @ts-expect-error */}
            <input type="text" class="kcet-form-item" placeholder="spm_id (支持模糊搜索)" value={spmId} onInput={(e) => setSpmId(e.target?.value)} />
            <IconClear width="1.3em" height="1.3em" title="清空数据" onClick={clearData} />
          </div>
          <div class="kcet-event-list">
            {filteredDatas.map(item => {
              return (
                <EventItemView key={item._track_id} data={item} type={type} category={category} pageId={pageId} spmId={spmId} />
              );
            })}
          </div>
          <svg class="kcet-close" onClick={() => setPanelVisible(false)} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4555" width="24" height="24"><path d="M504.224 470.288l207.84-207.84a16 16 0 0 1 22.608 0l11.328 11.328a16 16 0 0 1 0 22.624l-207.84 207.824 207.84 207.84a16 16 0 0 1 0 22.608l-11.328 11.328a16 16 0 0 1-22.624 0l-207.824-207.84-207.84 207.84a16 16 0 0 1-22.608 0l-11.328-11.328a16 16 0 0 1 0-22.624l207.84-207.824-207.84-207.84a16 16 0 0 1 0-22.608l11.328-11.328a16 16 0 0 1 22.624 0l207.824 207.84z" fill="#000000" p-id="4556"></path></svg>
        </div>
      )}
    </>
  );
}
