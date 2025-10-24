/**
 * Toolbar Component
 * 
 * Displays main action buttons for the editor
 * Follows Single Responsibility Principle
 */

'use client';

import { Upload, Download, Trash2, Type, ImageIcon, Undo, Redo } from 'lucide-react';

interface ToolbarProps {
  onImport: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onDelete: () => void;
  onExport: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  hasSelection: boolean;
  hasContent: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onImport,
  onAddText,
  onAddImage,
  onDelete,
  onExport,
  onUndo,
  onRedo,
  hasSelection,
  hasContent,
  canUndo = false,
  canRedo = false
}) => {
  return (
    <div className="w-64 bg-white border-r p-4 space-y-2 flex flex-col h-full">
      <h1 className="text-xl font-bold mb-4">HTML Poster Editor</h1>

      {/* Import Section */}
      <button
        onClick={onImport}
        className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        aria-label="Import HTML"
      >
        <Upload size={16} />
        Import HTML
      </button>

      {/* Add Elements Section */}
      <div className="border-t pt-4 mt-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">ADD ELEMENTS</p>
        <button
          onClick={onAddText}
          disabled={!hasContent}
          className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 mb-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Add text element"
        >
          <Type size={16} />
          Add Text
        </button>
        <button
          onClick={onAddImage}
          disabled={!hasContent}
          className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Add image element"
        >
          <ImageIcon size={16} />
          Add Image
        </button>
      </div>

      {/* History Section */}
      {(onUndo || onRedo) && (
        <div className="border-t pt-4 mt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">HISTORY</p>
          <div className="flex gap-2">
            {onUndo && (
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Undo"
                title="Undo (Ctrl+Z)"
              >
                <Undo size={16} />
                Undo
              </button>
            )}
            {onRedo && (
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Redo"
                title="Redo (Ctrl+Y)"
              >
                <Redo size={16} />
                Redo
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delete Section */}
      {hasSelection && (
        <div className="border-t pt-4 mt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">ACTIONS</p>
          <button
            onClick={onDelete}
            className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            aria-label="Delete selected element"
          >
            <Trash2 size={16} />
            Delete Element
          </button>
        </div>
      )}

      {/* Export Section */}
      <div className="border-t pt-4 mt-auto">
        <button
          onClick={onExport}
          disabled={!hasContent}
          className="w-full flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          aria-label="Export HTML"
        >
          <Download size={16} />
          Export HTML
        </button>
      </div>
    </div>
  );
};