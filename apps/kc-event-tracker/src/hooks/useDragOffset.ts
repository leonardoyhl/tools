import { useState, useRef } from 'preact/hooks';

import useTapToDrag from './useTapToDrag';

export default function useDragOffset() {
  const [dragging, setDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [relativeOffsetX, setRelativeOffsetX] = useState(0);
  const [relativeOffsetY, setRelativeOffsetY] = useState(0);

  const startX = useRef(0);
  const startY = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const onTapStart = useTapToDrag({
    onDragStart: (e) => {
      startX.current = e.clientX;
      startY.current = e.clientY;
      lastX.current = e.clientX;
      lastY.current = e.clientY;
      setDragging(true);
    },
    onDragMove: (e) => {
      const offsetX = e.clientX - startX.current;
      const offsetY = e.clientY - startY.current;
      const relativeOffsetX = e.clientX - lastX.current;
      const relativeOffsetY = e.clientY - lastY.current;
      setOffsetX(offsetX);
      setOffsetY(offsetY);
      setRelativeOffsetX(relativeOffsetX);
      setRelativeOffsetY(relativeOffsetY);
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    },
    onDragEnd: (e) => {
      const offsetX = e.clientX - startX.current;
      const offsetY = e.clientY - startY.current;
      const relativeOffsetX = e.clientX - lastX.current;
      const relativeOffsetY = e.clientY - lastY.current;
      setOffsetX(offsetX);
      setOffsetY(offsetY);
      setRelativeOffsetX(relativeOffsetX);
      setRelativeOffsetY(relativeOffsetY);
      setDragging(false);
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    },
  });

  return {
    dragging,
    offsetX,
    offsetY,
    relativeOffsetX,
    relativeOffsetY,
    onTapStart,
  };
}
