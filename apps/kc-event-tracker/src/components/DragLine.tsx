import { useEffect } from 'preact/hooks';

import useDragOffset from '../hooks/useDragOffset';

export interface DragLineProps {
  target: { current: HTMLElement | null };
  direction?: 'horizontal' | 'vertical';
}

export default function DragLine({ target, direction = 'vertical' }: DragLineProps) {
  const { dragging, relativeOffsetY, onTapStart } = useDragOffset();

  useEffect(() => {
    if (!target.current) return;
    const { width, height } = target.current.getBoundingClientRect();
    if (direction === 'vertical') {
      target.current.style.height = `${height - relativeOffsetY}px`;
    } else {
      target.current.style.width = `${width - relativeOffsetY}px`;
    }
  }, [direction, relativeOffsetY]);

  return (
    <div
      class={'kcet-drag-line ' + (dragging ? 'dragging' : '')}
      onMouseDown={onTapStart}
      // onTouchStart={onTapStart}
    />
  );
}
