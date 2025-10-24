/**
 * Canvas Component
 * 
 * Main editing stage component
 * Displays the 720x720 editing area
 */

'use client';

import { forwardRef } from 'react';
import { IElement } from '@/services/ElementService';
import { Move } from 'lucide-react';

interface CanvasProps {
  htmlContent: string;
  selectedElement: IElement | null;
  isDragging: boolean;
  onElementClick: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onDragStart: (e: React.MouseEvent) => void;
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ htmlContent, selectedElement, isDragging, onElementClick, onDoubleClick, onDragStart }, ref) => {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto bg-gray-50">
          <div className="relative">
            {/* Main Stage */}
            <div
              ref={ref}
              className="relative bg-white shadow-2xl"
              style={{
                width: '720px',
                height: '720px',
                overflow: 'hidden'
              }}
              onClick={onElementClick}
              onDoubleClick={onDoubleClick}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Selection Overlay */}
            {selectedElement && !isDragging && (
              <div
                className="selection-overlay absolute pointer-events-none"
                style={{
                  left: selectedElement.rect.left,
                  top: selectedElement.rect.top,
                  width: selectedElement.rect.width,
                  height: selectedElement.rect.height,
                  border: '2px solid #3b82f6',
                  borderRadius: '2px'
                }}
              >
                {/* Element Label */}
                <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                  {selectedElement.element.tagName.toLowerCase()}
                </div>

                {/* Drag Handle */}
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full cursor-move pointer-events-auto flex items-center justify-center hover:bg-blue-600 transition-colors"
                  onMouseDown={onDragStart}
                  title="Drag to move"
                >
                  <Move size={14} className="text-white" />
                </div>

                {/* Corner Handles (visual only) */}
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-blue-500 rounded-full" />
                <div className="absolute -top-2 -left-2 w-3 h-3 bg-blue-500 rounded-full" />
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-500 rounded-full" />
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white border-t px-4 py-2 text-sm text-gray-600">
          {selectedElement ? (
            <span>
              Selected: <strong>{selectedElement.element.tagName.toLowerCase()}</strong> at (
              {Math.round(selectedElement.rect.left)}, {Math.round(selectedElement.rect.top)})
              • Size: {Math.round(selectedElement.rect.width)}×{Math.round(selectedElement.rect.height)}px
            </span>
          ) : (
            <span>No element selected • Click an element to edit</span>
          )}
        </div>
      </div>
    );
  }
);

Canvas.displayName = 'Canvas';