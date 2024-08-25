import { useMemo } from 'preact/hooks';

export default function HighlightSearchText({ text, search }: { text: string; search: string }) {
  const fragments = useMemo(() => {
    if (!text || !search) return [[text, false]];
    const fragments = [];
    let str = text;
    let lstr = str.toLowerCase();
    const lsearch = search.toLowerCase();
    let endIdx = lstr.indexOf(lsearch);
    while (endIdx >= 0 && endIdx < str.length) {
      fragments.push([str.substring(0, endIdx), false], [str.substring(endIdx, endIdx + search.length), true]);
      str = str.substring(endIdx + search.length);
      lstr = lstr.substring(endIdx + search.length);
      endIdx = lstr.indexOf(lsearch);
    }
    fragments.push([str, false]);
    return fragments.filter(Boolean);
  }, [text, search]);

  return (
    <>
      {fragments.map(([item, matched], idx) => matched ? <span key={idx} class='highlight'>{item}</span> : item)}
    </>
  );
}
