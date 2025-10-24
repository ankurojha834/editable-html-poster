/**
 * useElementSelection Hook
 * 
 * Custom hook for managing element selection state
 * Follows React best practices and separation of concerns
 */

import { useState, useCallback, RefObject } from 'react';
import { IElement } from '@/services/ElementService';

export const useElementSelection = (stageRef: RefObject<HTMLDivElement>) => {
  const [selectedElement, setSelectedElement] = useState<IElement | null>(null);

  /**
   * Handles element selection from click event
   */
  const handleElementClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;

    // Deselect if clicking stage itself
    if (target === stageRef.current) {
      setSelectedElement(null);
      return;
    }

    // Ignore clicks on overlays
    if (target.classList.contains('selection-overlay') || 
        target.closest('.selection-overlay')) {
      return;
    }

    // Get element bounds relative to stage
    const rect = target.getBoundingClientRect();
    const stageRect = stageRef.current?.getBoundingClientRect();

    if (stageRect) {
      const relativeRect = new DOMRect(
        rect.left - stageRect.left,
        rect.top - stageRect.top,
        rect.width,
        rect.height
      );

      setSelectedElement({
        id: target.id || `element-${Date.now()}`,
        element: target,
        rect: relativeRect
      });
    }
  }, [stageRef]);

  /**
   * Clears current selection
   */
  const clearSelection = useCallback(() => {
    setSelectedElement(null);
  }, []);

  /**
   * Updates selected element's rect (useful after repositioning)
   */
  const updateSelectedElementRect = useCallback(() => {
    if (!selectedElement || !stageRef.current) return;

    const rect = selectedElement.element.getBoundingClientRect();
    const stageRect = stageRef.current.getBoundingClientRect();

    setSelectedElement(prev => prev ? {
      ...prev,
      rect: new DOMRect(
        rect.left - stageRect.left,
        rect.top - stageRect.top,
        rect.width,
        rect.height
      )
    } : null);
  }, [selectedElement, stageRef]);

  return {
    selectedElement,
    setSelectedElement,
    handleElementClick,
    clearSelection,
    updateSelectedElementRect
  };
};