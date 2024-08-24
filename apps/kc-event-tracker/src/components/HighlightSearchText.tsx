import { useMemo } from 'preact/hooks';

export default function HighlightSearchText({ text, search }: { text: string; search: string }) {
  if (!text?.includes(search) || !search) return <>{text}</>;

  const fragments = useMemo(() => {
    const fragments = [];
    let str = text;
    let endIdx = str.indexOf(search);
    while (endIdx >= 0 && endIdx < str.length) {
      fragments.push(str.substring(0, endIdx), str.substring(endIdx, endIdx + search.length));
      str = str.substring(endIdx + search.length);
      endIdx = str.indexOf(search);
    }
    fragments.push(str);
    return fragments.filter(Boolean);
  }, [text, search]);

  return (
    <>
      {fragments.map((item, idx) => item === search ? <span key={idx} class='highlight'>{item}</span> : item)}
    </>
  );
}
