
const originalLog = console.log;

interface EventItem {
  _track_id: number;
  event: 'expose' | 'page_click';
  type: 'track';
  time: number;
  properties: {
    app_name: string;
    spm_id: string;
  };
}

export default class EventCollector {
  datas: EventItem[] = [];
  types: string[] = [];
  categories: string[] = [];

  constructor() {
    console.log = (...args) => {
      originalLog.apply(console, args);
      if (args.length === 1 && typeof args[0] === 'string') {
        try {
          const data: EventItem = JSON.parse(args[0]);
          if (typeof data === 'object' && '_track_id' in data && 'event' in data && 'properties' in data) {
            const { type, event } = data;
            if (type && !this.types.includes(type)) this.types.push(type);
            if (event && !this.categories.includes(event)) this.categories.push(event);
            this.datas.push(data);
          }
        } catch (e) {
          // error
        }
      }
    };
  }

  destroy() {
    console.log = originalLog;
  }
}
