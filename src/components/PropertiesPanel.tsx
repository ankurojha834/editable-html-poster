/**
 * PropertiesPanel Component
 * 
 * Context-aware property editor for selected elements
 */

'use client';

import { useRef } from 'react';
import { IElement } from '@/services/ElementService';

interface PropertiesPanelProps {
  selectedElement: IElement | null;
  onUpdateProperty: (property: string, value: string) => void;
  onImageUpload: (file: File) => void;
  onTextContentChange: (text: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateProperty,
  onImageUpload,
  onTextContentChange
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l p-4 overflow-auto">
        <h2 className="text-lg font-bold mb-4">Properties</h2>
        <div className="text-gray-500 text-sm">
          <p>Select an element to edit its properties.</p>
          <div className="mt-4 p-3 bg-blue-50 rounded text-blue-800 text-xs">
            <p className="font-semibold mb-1">Quick Tips:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Click any element to select it</li>
              <li>Double-click text to edit inline</li>
              <li>Drag the blue handle to move</li>
              <li>Press Delete to remove</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const isImage = selectedElement.element.tagName === 'IMG';
  const element = selectedElement.element;

  return (
    <div className="w-80 bg-white border-l p-4 overflow-auto">
      <h2 className="text-lg font-bold mb-4">Properties</h2>

      <div className="space-y-4">
        {/* Element Type */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Element Type</label>
          <input
            type="text"
            value={element.tagName.toLowerCase()}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-50 text-gray-600"
          />
        </div>

        {/* Element ID */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Element ID</label>
          <input
            type="text"
            value={element.id || 'No ID'}
            disabled
            className="w-full px-3 py-2 border rounded bg-gray-50 text-gray-600 text-sm"
          />
        </div>

        {isImage ? (
          // IMAGE PROPERTIES
          <>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Image Source</label>
              <input
                type="text"
                value={(element as HTMLImageElement).src}
                onChange={(e) => onUpdateProperty('src', e.target.value)}
                className="w-full px-3 py-2 border rounded mb-2 text-sm"
                placeholder="https://example.com/image.jpg"
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Alt Text</label>
              <input
                type="text"
                value={(element as HTMLImageElement).alt}
                onChange={(e) => onUpdateProperty('alt', e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="Image description"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Width (px)</label>
                <input
                  type="number"
                  value={parseInt(element.style.width) || Math.round(selectedElement.rect.width)}
                  onChange={(e) => onUpdateProperty('width', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  min="10"
                  max="720"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Height (px)</label>
                <input
                  type="number"
                  value={parseInt(element.style.height) || Math.round(selectedElement.rect.height)}
                  onChange={(e) => onUpdateProperty('height', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  min="10"
                  max="720"
                />
              </div>
            </div>
          </>
        ) : (
          // TEXT PROPERTIES
          <>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Text Content</label>
              <textarea
                value={element.textContent || ''}
                onChange={(e) => onTextContentChange(e.target.value)}
                className="w-full px-3 py-2 border rounded h-24 text-sm"
                placeholder="Enter text..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Font Size</label>
              <input
                type="text"
                value={element.style.fontSize || '16px'}
                onChange={(e) => onUpdateProperty('fontSize', e.target.value)}
                className="w-full px-3 py-2 border rounded"
                placeholder="e.g., 16px, 1.5rem, 2em"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.style.color || '#000000'}
                  onChange={(e) => onUpdateProperty('color', e.target.value)}
                  className="w-16 h-10 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={element.style.color || '#000000'}
                  onChange={(e) => onUpdateProperty('color', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Font Weight</label>
              <select
                value={element.style.fontWeight || 'normal'}
                onChange={(e) => onUpdateProperty('fontWeight', e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="normal">Normal (400)</option>
                <option value="bold">Bold (700)</option>
                <option value="lighter">Lighter (300)</option>
                <option value="bolder">Bolder (900)</option>
                <option value="100">Thin (100)</option>
                <option value="200">Extra Light (200)</option>
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi Bold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
                <option value="900">Black (900)</option>
              </select>
            </div>
          </>
        )}

        {/* Position Info */}
        <div className="pt-4 border-t">
          <p className="text-xs font-semibold text-gray-500 mb-2">POSITION</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-50 px-3 py-2 rounded">
              <span className="text-gray-600">X:</span> <strong>{Math.round(selectedElement.rect.left)}px</strong>
            </div>
            <div className="bg-gray-50 px-3 py-2 rounded">
              <span className="text-gray-600">Y:</span> <strong>{Math.round(selectedElement.rect.top)}px</strong>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="pt-4 border-t text-xs text-gray-500 space-y-1">
          <p>💡 <strong>Tip:</strong> Drag the blue handle to move this element</p>
          <p>⌨️ <strong>Shortcut:</strong> Press Delete to remove</p>
          {!isImage && <p>✏️ <strong>Edit:</strong> Double-click to edit text inline</p>}
        </div>
      </div>
    </div>
  );
};