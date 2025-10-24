/**
 * ImportDialog Component
 * 
 * Modal dialog for importing HTML via file upload or paste
 */

'use client';

import { useRef, useState } from 'react';
import { X } from 'lucide-react';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (html: string) => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({ isOpen, onClose, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pastedHtml, setPastedHtml] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onImport(content);
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = () => {
    if (pastedHtml.trim()) {
      onImport(pastedHtml);
      setPastedHtml('');
    }
  };

  const handleLoadSample = () => {
    const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Sample Poster</title>
<style>
body { margin: 0; padding: 0; }
.poster {
  width: 720px; height: 720px; position: relative;
  background: #f3f4f6; overflow: hidden; font-family: sans-serif;
}
.title {
  position: absolute; top: 80px; left: 40px;
  font-size: 48px; font-weight: bold; color: #111827;
}
.subtitle {
  position: absolute; top: 160px; left: 40px;
  font-size: 20px; color: #374151;
}
.hero {
  position: absolute; bottom: 0; right: 0; width: 380px; height: 380px;
  object-fit: cover; border-top-left-radius: 16px;
}
</style>
</head>
<body>
<div class="poster">
  <h1 class="title">Summer Sale</h1>
  <p class="subtitle">Up to <strong>50% off</strong> on select items!</p>
  <img class="hero" src="https://images.unsplash.com/photo-1520975922284-7bcd4290b0e1?q=80&w=1200&auto=format&fit=crop" alt="Model" />
</div>
</body>
</html>`;
    onImport(sampleHTML);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Import HTML</h2>
            <p className="text-sm text-gray-600 mt-1">Upload a file or paste HTML content to get started</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Method 1: File Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Method 1: Upload HTML File
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 
                file:mr-4 file:py-3 file:px-6
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer border border-dashed border-gray-300 rounded-lg p-4"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Method 2: Paste HTML */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Method 2: Paste HTML Content
            </label>
            <textarea
              value={pastedHtml}
              onChange={(e) => setPastedHtml(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Paste your HTML code here..."
            />
            <button
              onClick={handlePaste}
              disabled={!pastedHtml.trim()}
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Import Pasted HTML
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Method 3: Load Sample */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Method 3: Load Sample Poster
            </label>
            <button
              onClick={handleLoadSample}
              className="w-full px-6 py-3 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors font-medium"
            >
              Load Sample "Summer Sale" Poster
            </button>
            <p className="text-xs text-gray-500 mt-2">
              A pre-made 720×720 poster with text and image elements
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <p className="text-xs text-gray-600">
            <strong>Note:</strong> HTML will be sanitized for security. Scripts and event handlers will be removed.
          </p>
        </div>
      </div>
    </div>
  );
};