export function formatDate(date: Date | number | string, format: string) {
  if (typeof date === 'number' || typeof date === 'string') {
    date = new Date(date);
  }

  const map: Record<string, number> = {
      'M': date.getMonth() + 1,
      'd': date.getDate(),
      'h': date.getHours(),
      'm': date.getMinutes(),
      's': date.getSeconds(),
      'S': date.getMilliseconds(),
  };

  format = format.replace(/(y+|Y+)/g, p => {
    return date.getFullYear().toString().slice(-p.length);
  });
  format = format.replace(/(S+)/g, p => {
    const v = date.getMilliseconds().toString();
    return p.length > v.length ? ('00' + v).slice(-p.length) : v;
  });

  return format.replace(/(M+|d+|h+|m+|s+)/g, p => {
      return ((p.length > 1 ? '0' : '') + map[p.slice(-1)]).slice(-2);
  });
}
