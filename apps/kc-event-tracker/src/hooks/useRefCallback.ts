import { useCallback, useRef } from 'preact/hooks';

export default function useRefCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);
  ref.current = callback;

  const cbk = useCallback((...args: any[]) => {
    return ref.current?.(...args);
  }, []);

  return cbk as T;
}
