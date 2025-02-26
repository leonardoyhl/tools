import { useState } from 'preact/hooks';
import { EventItem } from '../hooks/useEventCollector';
import { IconExpand, IconCollapse } from '../icons';
import { formatDate } from '../utils';
import HighlightSearchText from './HighlightSearchText';


export interface EventItemViewProps {
  data: EventItem;
  type: string;
  category: string;
  pageId: string;
  spmId: string;
}

export default function EventItemView(props: EventItemViewProps) {
  const { data: item, type, category, pageId, spmId } = props;

  const [expanded, setExpanded] = useState(false);

  return (
    <div class="kcet-event-item">
      <div class="summary" onClick={(e) => { setExpanded(!expanded); e.stopPropagation(); }}>
        <span class="col time">{formatDate(item.time, 'hh:mm:ss.SSS')}</span>{' '}
        <span class="col type">
          <HighlightSearchText text={item.type} search={type} />
        </span>{' '}
        <span class="col event">
          <HighlightSearchText text={item.event} search={category} />
        </span>{' '}
        <span class="col app_name">
          <HighlightSearchText text={item.properties?.app_name} search={''} />
        </span>{' '}
        <span class="col page_id">
          <HighlightSearchText text={item.properties?.page_id} search={pageId} />
        </span>{' '}
        <span class="col spm_id">
          <HighlightSearchText text={item.properties?.spm_id} search={spmId} />
        </span>
        {!expanded ? <IconExpand /> : <IconCollapse />}
      </div>
      {expanded && (
        <div class="detail">
          <pre>{JSON.stringify(item, null, 4)}</pre>
        </div>
      )}
    </div>
  );
}
