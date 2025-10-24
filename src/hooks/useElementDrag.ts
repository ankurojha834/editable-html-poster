/**
 * useElementDrag Hook
 * 
 * Custom hook for managing drag and drop functionality
 */

import { useState, useEffect, RefObject, useCallback } from 'react';
import { IElement } from '@/services/ElementService';
import { ElementService } from '@/services/ElementService';

interface Position {
  x: number;
  y: number;
}

export const useElementDrag = (
  stageRef: RefObject<HTMLDivElement>,
  selectedElement: IElement | null,
  updateSelectedElementRect: () => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const elementService = new ElementService();

  /**
   * Initiates drag operation
   */
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (!selectedElement) return;
    e.preventDefault();

    const rect = selectedElement.element.getBoundingClientRect();
    const stageRect = stageRef.current?.getBoundingClientRect();

    if (stageRect) {
      setDragOffset({
        x: e.clientX - (rect.left - stageRect.left),
        y: e.clientY - (rect.top - stageRect.top)
      });
      setIsDragging(true);
    }
  }, [selectedElement, stageRef]);

  /**
   * Handles mouse movement during drag
   */
  useEffect(() => {
    if (!isDragging || !selectedElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const stageRect = stageRef.current?.getBoundingClientRect();
      if (!stageRect) return;

      const x = e.clientX - stageRect.left - dragOffset.x;
      const y = e.clientY - stageRect.top - dragOffset.y;

      elementService.updateElementPosition(selectedElement.element, x, y);
      updateSelectedElementRect();
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedElement, dragOffset, stageRef, updateSelectedElementRect, elementService]);

  return {
    isDragging,
    handleDragStart
  };
};