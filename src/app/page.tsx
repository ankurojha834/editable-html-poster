/**
 * Main Page Component
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Coordinates editor components
 * - Dependency Inversion: Depends on service abstractions
 * - Open/Closed: Extensible through service injection
 */

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Toolbar } from '@/components/Toolbar';
import { Canvas } from '@/components/Canvas';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { ImportDialog } from '@/components/ImportDialog';
import { HTMLSanitizerService } from '@/services/HTMLSanitizerService';
import { ElementService, IElement } from '@/services/ElementService';
import { ExportService } from '@/services/ExportService';
import { HistoryService } from '@/services/HistoryService';
import { useElementSelection } from '@/hooks/useElementSelection';
import { useElementDrag } from '@/hooks/useElementDrag';

export default function HomePage() {
  // Services (following Dependency Injection pattern)
  const sanitizerService = useRef(new HTMLSanitizerService());
  const elementService = useRef(new ElementService());
  const exportService = useRef(new ExportService());
  const historyService = useRef(new HistoryService());

  // State
  const [htmlContent, setHtmlContent] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(true);
  const [isEditingText, setIsEditingText] = useState(false);

  // Refs
  const stageRef = useRef<HTMLDivElement>(null);

  // Custom Hooks
  const {
    selectedElement,
    handleElementClick,
    clearSelection,
    updateSelectedElementRect
  } = useElementSelection(stageRef);

  const { isDragging, handleDragStart } = useElementDrag(
    stageRef,
    selectedElement,
    updateSelectedElementRect
  );

  /**
   * Handles HTML import with sanitization
   */
  const handleImport = useCallback((html: string) => {
    const sanitized = sanitizerService.current.sanitize(html);
    setHtmlContent(sanitized);
    setShowImportDialog(false);
    clearSelection();
    
    // Save initial state to history
    setTimeout(() => {
      if (stageRef.current) {
        historyService.current.push(stageRef.current.innerHTML);
      }
    }, 100);
  }, [clearSelection]);

  /**
   * Adds a new text element to the stage
   */
  const handleAddText = useCallback(() => {
    if (!stageRef.current) return;

    const container = stageRef.current.querySelector('.poster, [class*="poster"], body > div, body') 
      || stageRef.current;
    
    elementService.current.createElement('text', container as HTMLElement);
    
    // Save state to history
    setTimeout(() => {
      if (stageRef.current) {
        historyService.current.push(stageRef.current.innerHTML);
      }
    }, 50);
  }, []);

  /**
   * Adds a new image element to the stage
   */
  const handleAddImage = useCallback(() => {
    if (!stageRef.current) return;

    const container = stageRef.current.querySelector('.poster, [class*="poster"], body > div, body') 
      || stageRef.current;
    
    elementService.current.createElement('image', container as HTMLElement);
    
    // Save state to history
    setTimeout(() => {
      if (stageRef.current) {
        historyService.current.push(stageRef.current.innerHTML);
      }
    }, 50);
  }, []);

  /**
   * Deletes the selected element
   */
  const handleDelete = useCallback(() => {
    if (selectedElement) {
      elementService.current.deleteElement(selectedElement.element);
      clearSelection();
      
      // Save state to history
      setTimeout(() => {
        if (stageRef.current) {
          historyService.current.push(stageRef.current.innerHTML);
        }
      }, 50);
    }
  }, [selectedElement, clearSelection]);

  /**
   * Exports current stage as HTML file
   */
  const handleExport = useCallback(() => {
    if (stageRef.current) {
      exportService.current.exportHTML(stageRef.current);
    }
  }, []);

  /**
   * Handles undo operation
   */
  const handleUndo = useCallback(() => {
    const previousState = historyService.current.undo();
    if (previousState && stageRef.current) {
      setHtmlContent(previousState);
      clearSelection();
    }
  }, [clearSelection]);

  /**
   * Handles redo operation
   */
  const handleRedo = useCallback(() => {
    const nextState = historyService.current.redo();
    if (nextState && stageRef.current) {
      setHtmlContent(nextState);
      clearSelection();
    }
  }, [clearSelection]);

  /**
   * Updates element property and saves to history
   */
  const handleUpdateProperty = useCallback((property: string, value: string) => {
    if (!selectedElement) return;

    if (property === 'src' || property === 'alt') {
      const imgElement = selectedElement.element as HTMLImageElement;
      if (property === 'src') imgElement.src = value;
      if (property === 'alt') imgElement.alt = value;
    } else if (property === 'width' || property === 'height') {
      elementService.current.updateElementStyle(selectedElement.element, property, value + 'px');
    } else {
      elementService.current.updateElementStyle(selectedElement.element, property, value);
    }

    updateSelectedElementRect();
    
    // Debounced history save
    setTimeout(() => {
      if (stageRef.current) {
        historyService.current.push(stageRef.current.innerHTML);
      }
    }, 500);
  }, [selectedElement, updateSelectedElementRect]);

  /**
   * Handles image file upload
   */
  const handleImageUpload = useCallback((file: File) => {
    if (!selectedElement || selectedElement.element.tagName !== 'IMG') return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      (selectedElement.element as HTMLImageElement).src = dataUrl;
      updateSelectedElementRect();
      
      // Save state to history
      setTimeout(() => {
        if (stageRef.current) {
          historyService.current.push(stageRef.current.innerHTML);
        }
      }, 50);
    };
    reader.readAsDataURL(file);
  }, [selectedElement, updateSelectedElementRect]);

  /**
   * Handles text content changes
   */
  const handleTextContentChange = useCallback((text: string) => {
    if (!selectedElement) return;
    selectedElement.element.textContent = text;
    
    // Save state to history (debounced)
    setTimeout(() => {
      if (stageRef.current) {
        historyService.current.push(stageRef.current.innerHTML);
      }
    }, 500);
  }, [selectedElement]);

  /**
   * Handles double-click for inline text editing
   */
  const handleDoubleClick = useCallback(() => {
    if (selectedElement && selectedElement.element.tagName !== 'IMG') {
      setIsEditingText(true);
      selectedElement.element.contentEditable = 'true';
      selectedElement.element.focus();
    }
  }, [selectedElement]);

  /**
   * Handles text editing blur
   */
  useEffect(() => {
    if (isEditingText && selectedElement) {
      const handleBlur = () => {
        selectedElement.element.contentEditable = 'false';
        setIsEditingText(false);
        
        // Save state to history
        if (stageRef.current) {
          historyService.current.push(stageRef.current.innerHTML);
        }
      };

      selectedElement.element.addEventListener('blur', handleBlur);
      return () => selectedElement.element.removeEventListener('blur', handleBlur);
    }
  }, [isEditingText, selectedElement]);

  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when editing text
      if (isEditingText) return;

      // Delete key
      if (e.key === 'Delete' && selectedElement) {
        e.preventDefault();
        handleDelete();
      }

      // Ctrl/Cmd + Z for Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z for Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement, isEditingText, handleDelete, handleUndo, handleRedo, clearSelection]);

  return (
    <main className="flex h-screen bg-gray-100">
      {/* Import Dialog */}
      <ImportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImport={handleImport}
      />

      {/* Toolbar */}
      <Toolbar
        onImport={() => setShowImportDialog(true)}
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onDelete={handleDelete}
        onExport={handleExport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        hasSelection={!!selectedElement}
        hasContent={!!htmlContent}
        canUndo={historyService.current.canUndo()}
        canRedo={historyService.current.canRedo()}
      />

      {/* Canvas */}
      <Canvas
        ref={stageRef}
        htmlContent={htmlContent}
        selectedElement={selectedElement}
        isDragging={isDragging}
        onElementClick={handleElementClick}
        onDoubleClick={handleDoubleClick}
        onDragStart={handleDragStart}
      />

      {/* Properties Panel */}
      <PropertiesPanel
        selectedElement={selectedElement}
        onUpdateProperty={handleUpdateProperty}
        onImageUpload={handleImageUpload}
        onTextContentChange={handleTextContentChange}
      />
    </main>
  );
}