import { useCallback, useRef } from 'preact/hooks';

export interface TapToDragOptions {
  onDragStart?: (e: MouseEvent) => void;
  onDragMove?: (e: MouseEvent) => void;
  onDragEnd?: (e: MouseEvent) => void;
}

export default function useTapToDrag(options: TapToDragOptions) {
  const onDragStart = useRef(options.onDragStart);
  const onDragMove = useRef(options.onDragMove);
  const onDragEnd = useRef(options.onDragEnd);
  onDragStart.current = options.onDragStart;
  onDragMove.current = options.onDragMove;
  onDragEnd.current = options.onDragEnd;

  const handleTapStart = useCallback((e: MouseEvent) => {
    document.addEventListener('mousemove', hanldeTapMove);
    document.addEventListener('mouseup', hanldeTapEnd);
    onDragStart.current?.(e);
    e.stopPropagation();
  }, []);

  const hanldeTapMove = useCallback((e: MouseEvent) => {
    onDragMove.current?.(e);
    e.stopPropagation();
  }, []);

  const hanldeTapEnd = useCallback((e: MouseEvent) => {
    document.removeEventListener('mousemove', hanldeTapMove);
    document.removeEventListener('mouseup', hanldeTapEnd);
    onDragEnd.current?.(e);
    e.stopPropagation();
  }, []);

  return handleTapStart;
}
