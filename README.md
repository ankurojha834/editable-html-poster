# Editable HTML Poster

A professional Next.js application that allows users to visually edit HTML posters with drag-and-drop functionality, real-time property editing, and export capabilities.

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8)](https://tailwindcss.com/)

## 🌐 Live Demo

**Deployed Application:** [https://editable-html-poster.vercel.app](https://editable-html-poster.vercel.app)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Architecture](#️-architecture)
- [SOLID Design Principles](#-solid-design-principles)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [Known Limitations](#️-known-limitations)
- [Potential Improvements](#-potential-improvements)
---

## ✨ Features

### Core Functionality
- ✅ **HTML Import**: Upload `.html` files or paste raw HTML content
- ✅ **720×720 Canvas**: Fixed-size editing stage with precise boundaries
- ✅ **Element Selection**: Click to select with visual highlighting and info display
- ✅ **Drag & Drop**: Intuitive element repositioning with boundary constraints
- ✅ **Text Editing**: Double-click inline editing + comprehensive properties panel
- ✅ **Image Editing**: Replace images via URL or file upload, edit dimensions and alt text
- ✅ **Add Elements**: Create new text blocks and images dynamically
- ✅ **Delete Elements**: Remove elements via button or Delete key
- ✅ **Export HTML**: Download edited poster with metadata tag
- ✅ **Undo/Redo**: Full history management (50 states) with keyboard shortcuts
- ✅ **Keyboard Shortcuts**: 
  - `Delete` - Remove selected element
  - `Ctrl/Cmd + Z` - Undo
  - `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z` - Redo
  - `Escape` - Deselect element

### Security Features
- 🔒 **HTML Sanitization**: DOMPurify removes malicious scripts
- 🔒 **XSS Prevention**: Event handlers stripped from imported HTML
- 🔒 **Safe Rendering**: Content isolated in stage container

### User Experience
- 🎨 **Visual Feedback**: Selection outlines, drag handles, status bar
- 🎯 **Context-Aware UI**: Properties panel adapts to element type
- ⚡ **Real-time Updates**: Instant visual feedback on all changes
- 📱 **Responsive Layout**: Three-panel interface (Toolbar, Canvas, Properties)

---

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.0 (Strict Mode)
- **Styling**: Tailwind CSS 3.3
- **State Management**: React Hooks (useState, useCallback, useEffect)

### Dependencies
- **dompurify** (3.0.6): HTML sanitization
- **lucide-react** (0.263.1): Icon library
- **react** (18.2.0): UI library
- **react-dom** (18.2.0): React DOM bindings

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Type checking
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

---

## 🚀 Setup Instructions

### Prerequisites

Ensure you have the following installed:
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: For version control

Check versions:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
git --version   # Any recent version
```

### Installation Steps

1. **Clone the repository**
```bash
   git clone https://github.com/YOUR_USERNAME/editable-html-poster.git
   cd editable-html-poster
```

2. **Install dependencies**
```bash
   npm install
```
   This installs all required packages (~312 packages, ~45 seconds)

3. **Run development server**
```bash
   npm run dev
```
   Server starts at: http://localhost:3000

4. **Build for production** (optional)
```bash
   npm run build
   npm start
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript type checking |

### Troubleshooting

**Port 3000 already in use:**
```bash
PORT=3001 npm run dev
```

**Module not found errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
rm -rf .next
npm run build
```

---

## 🏗️ Architecture

### Layered Architecture

This application follows a **Service-Oriented Architecture** with clear separation of concerns:
```
┌─────────────────────────────────────────────┐
│           Presentation Layer                │
│  (React Components - UI/UX)                 │
│  Toolbar, Canvas, PropertiesPanel           │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│           Application Layer                 │
│  (Custom Hooks - Business Logic)            │
│  useElementSelection, useElementDrag        │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│           Service Layer                     │
│  (Core Business Logic)                      │
│  ElementService, ExportService, etc.        │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│           Data Layer                        │
│  (DOM Manipulation - Browser APIs)          │
└─────────────────────────────────────────────┘
```

### Design Patterns Used

1. **Service Layer Pattern**: Business logic separated from UI
2. **Custom Hooks Pattern**: Reusable stateful logic
3. **Factory Pattern**: Element creation in ElementService
4. **Strategy Pattern**: Different sanitization strategies
5. **Command Pattern**: History/undo implementation
6. **Dependency Injection**: Services injected via useRef

---

## 🎯 SOLID Design Principles

This project strictly follows SOLID principles for maintainability and extensibility:

### 1. Single Responsibility Principle (SRP)
Each module has exactly one reason to change:

**Services:**
- `HTMLSanitizerService`: Only handles HTML sanitization
- `ElementService`: Manages element lifecycle (create, update, delete)
- `ExportService`: Handles HTML export operations
- `HistoryService`: Manages undo/redo functionality

**Components:**
- `Toolbar`: Displays action buttons
- `Canvas`: Renders editing stage
- `PropertiesPanel`: Shows element properties
- `ImportDialog`: Handles HTML import UI

**Example:**
```typescript
// ✅ Good: Single responsibility
class ElementService {
  createElement(type, container) { /* ... */ }
  deleteElement(element) { /* ... */ }
  updateElementPosition(element, x, y) { /* ... */ }
}

// ❌ Bad: Multiple responsibilities
class ElementService {
  createElement() { /* ... */ }
  exportHTML() { /* ... */ }  // Should be in ExportService
  sanitizeHTML() { /* ... */ }  // Should be in SanitizerService
}
```

### 2. Open/Closed Principle (OCP)
Classes are open for extension but closed for modification:
```typescript
// Base implementation
class HTMLSanitizerService implements ISanitizerService {
  constructor(customConfig?: DOMPurify.Config) {
    // Accepts custom configuration without modifying class
  }
}

// Extension without modification
const strictSanitizer = new HTMLSanitizerService({
  ALLOWED_TAGS: ['div', 'p', 'span'],  // More restrictive
});
```

### 3. Liskov Substitution Principle (LSP)
All implementations can be substituted without breaking functionality:
```typescript
interface ISanitizerService {
  sanitize(html: string): string;
}

// Both implementations can be used interchangeably
const sanitizer: ISanitizerService = new HTMLSanitizerService();
const customSanitizer: ISanitizerService = new CustomSanitizerService();
```

### 4. Interface Segregation Principle (ISP)
Interfaces are client-specific and minimal:
```typescript
// ✅ Good: Focused interface
interface IHistoryService {
  push(state: string): void;
  undo(): string | null;
  redo(): string | null;
  canUndo(): boolean;
  canRedo(): boolean;
}

// ❌ Bad: Fat interface
interface IHistoryService {
  push(): void;
  undo(): void;
  redo(): void;
  clear(): void;
  export(): void;      // Not needed by all clients
  import(): void;      // Not needed by all clients
  compress(): void;    // Not needed by all clients
}
```

### 5. Dependency Inversion Principle (DIP)
High-level modules depend on abstractions, not concrete implementations:
```typescript
// page.tsx depends on abstractions
const sanitizerService = useRef<ISanitizerService>(new HTMLSanitizerService());
const elementService = useRef<IElementService>(new ElementService());

// Easy to swap implementations for testing or different behavior
const mockSanitizer = useRef<ISanitizerService>(new MockSanitizerService());
```

---

## 📁 Project Structure
```
editable-html-poster/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout component
│   │   ├── page.tsx                # Main page (editor coordinator)
│   │   └── globals.css             # Global styles
│   │
│   ├── components/                 # React components
│   │   ├── Toolbar.tsx             # Left sidebar with actions
│   │   ├── Canvas.tsx              # 720x720 editing stage
│   │   ├── PropertiesPanel.tsx    # Right sidebar properties editor
│   │   └── ImportDialog.tsx        # HTML import modal
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useElementSelection.ts  # Element selection logic
│   │   └── useElementDrag.ts       # Drag and drop functionality
│   │
│   └── services/                   # Business logic services
│       ├── HTMLSanitizerService.ts # HTML sanitization
│       ├── ElementService.ts       # Element CRUD operations
│       ├── ExportService.ts        # HTML export functionality
│       └── HistoryService.ts       # Undo/redo management
│
├── public/                         # Static assets (empty, ready for use)
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # This file
```

### Key Files Explained

| File | Lines | Purpose |
|------|-------|---------|
| `src/app/page.tsx` | ~350 | Main coordinator, connects all components and services |
| `src/services/ElementService.ts` | ~140 | Core element manipulation logic |
| `src/components/PropertiesPanel.tsx` | ~200 | Context-aware property editing UI |
| `src/services/HistoryService.ts` | ~100 | Undo/redo state management |

**Total Code**: ~2,325 lines across 24 files

---

## 📖 Usage Guide

### Quick Start

1. **Import HTML**
   - Click "Import HTML" button
   - Choose one of three methods:
     - Upload `.html` file
     - Paste HTML code
     - Load sample poster

2. **Edit Elements**
   - **Select**: Click any element
   - **Move**: Drag the blue circular handle
   - **Edit Text**: Double-click text elements or use properties panel
   - **Edit Image**: Select image and upload new file or enter URL
   - **Delete**: Select element and press Delete key or click Delete button

3. **Add New Content**
   - Click "Add Text" to create text block
   - Click "Add Image" to add image placeholder
   - Both are immediately draggable and editable

4. **History**
   - **Undo**: Ctrl/Cmd + Z or click Undo button
   - **Redo**: Ctrl/Cmd + Y or click Redo button
   - History stores last 50 actions

5. **Export**
   - Click "Export HTML" button
   - File downloads as `edited-poster.html`
   - Includes `<meta data-generated-by="editable-html-poster" />` tag

### Sample HTML for Testing
```html
<!DOCTYPE html>
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
</html>
```

---

## ⚠️ Known Limitations

### 1. CSS Limitations
- **Issue**: Complex CSS features (flexbox, grid, animations) may not render perfectly in the 720×720 canvas
- **Impact**: Advanced layouts might look different than expected
- **Workaround**: Use absolute positioning for poster-style layouts

### 2. Nested Element Selection
- **Issue**: Deep nesting (>5 levels) can make precise element selection difficult
- **Impact**: May need multiple clicks to select deeply nested elements
- **Workaround**: Restructure HTML to reduce nesting depth

### 3. Responsive Design Constraints
- **Issue**: Media queries and responsive designs are ignored in fixed-size canvas
- **Impact**: Responsive layouts will render at 720×720 resolution only
- **Workaround**: Design specifically for 720×720 dimensions

### 4. External Resources
- **Issue**: External stylesheets and custom fonts may not load
- **Impact**: Styling might differ from original HTML
- **Workaround**: Use inline styles or <style> tags in HTML

### 5. Browser Compatibility
- **Issue**: Tested primarily on Chrome, Firefox, and Safari (latest versions)
- **Impact**: Older browsers may have compatibility issues
- **Workaround**: Use modern browser (Chrome 90+, Firefox 88+, Safari 14+)

### 6. Large Files
- **Issue**: Very large HTML files (>1MB) may slow down the editor
- **Impact**: Performance degradation with complex documents
- **Workaround**: Break large designs into smaller components

### 7. History Memory
- **Issue**: Undo/redo stores full HTML snapshots (limited to 50 states)
- **Impact**: Memory usage increases with complex documents
- **Workaround**: Clear history periodically (export and reimport)

### 8. Text Formatting
- **Issue**: Limited text formatting options (no bold/italic/underline buttons)
- **Impact**: Must use HTML tags or font-weight property
- **Workaround**: Edit HTML directly or use inline styles

---

## 🚀 Potential Improvements

### Short-Term (Quick Wins)

#### 1. Enhanced Text Editing
- [ ] Rich text toolbar (bold, italic, underline)
- [ ] Text alignment controls (left, center, right)
- [ ] Line height and letter spacing
- [ ] Font family selector

#### 2. Multi-Select
- [ ] Ctrl/Cmd + Click to select multiple elements
- [ ] Group operations (move, delete, style together)
- [ ] Bulk property editing

#### 3. Copy/Paste
- [ ] Copy elements (Ctrl+C)
- [ ] Paste elements (Ctrl+V)
- [ ] Duplicate selected element (Ctrl+D)

#### 4. Alignment Tools
- [ ] Snap-to-grid functionality
- [ ] Alignment guides (center, edges)
- [ ] Distribute elements evenly
- [ ] Align to canvas edges

#### 5. Resize Handles
- [ ] Corner handles for resizing elements
- [ ] Maintain aspect ratio (Shift+Drag)
- [ ] Resize from center (Alt+Drag)

### Medium-Term (Feature Enhancements)

#### 6. Element Tree Panel
- [ ] Hierarchical view of all elements
- [ ] Click to select from tree
- [ ] Drag to reorder in DOM
- [ ] Show/hide elements (visibility toggle)

#### 7. Layer Management
- [ ] Z-index controls (bring to front, send to back)
- [ ] Layer ordering panel
- [ ] Lock elements to prevent editing
- [ ] Group elements into layers

#### 8. Color Management
- [ ] Color picker with presets
- [ ] Recent colors palette
- [ ] Eyedropper tool for color selection
- [ ] Gradient support

#### 9. Grid System
- [ ] Optional grid overlay
- [ ] Snap to grid toggle
- [ ] Customizable grid size
- [ ] Guidelines at common positions (thirds, golden ratio)

#### 10. Keyboard Shortcuts Panel
- [ ] Searchable shortcuts list
- [ ] Customizable key bindings
- [ ] Quick reference overlay (? key)

### Long-Term (Major Features)

#### 11. Templates Library
- [ ] Pre-made poster templates
- [ ] Save custom templates
- [ ] Template categories
- [ ] Import/export templates

#### 12. Cloud Storage Integration
- [ ] Save projects to cloud
- [ ] Auto-save functionality
- [ ] Project versioning
- [ ] Share projects via link

#### 13. Collaboration Features
- [ ] Real-time multi-user editing
- [ ] Comments and annotations
- [ ] Change tracking
- [ ] User presence indicators

#### 14. Advanced Export Options
- [ ] Export as PNG/JPEG
- [ ] Export as SVG
- [ ] Export as PDF
- [ ] Export with different resolutions

#### 15. AI-Powered Features
- [ ] AI-suggested layouts
- [ ] Auto-optimize positioning
- [ ] Smart color palette generation
- [ ] Content-aware image cropping

#### 16. Accessibility Enhancements
- [ ] Full keyboard navigation
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Accessibility checker
- [ ] ARIA labels compliance

#### 17. Performance Optimizations
- [ ] Virtual rendering for large documents
- [ ] Lazy loading for images
- [ ] Web Worker for heavy operations
- [ ] IndexedDB for offline storage

#### 18. Mobile Support
- [ ] Touch gestures (pinch, pan)
- [ ] Mobile-optimized UI
- [ ] Responsive canvas
- [ ] Native mobile apps (React Native)

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] HTML import (file upload)
- [ ] HTML import (paste)
- [ ] Sample poster loads correctly
- [ ] Element selection works
- [ ] Drag and drop functions
- [ ] Text editing (double-click)
- [ ] Text property changes
- [ ] Image replacement (file)
- [ ] Image replacement (URL)
- [ ] Image dimension changes
- [ ] Add new text element
- [ ] Add new image element
- [ ] Delete element (button)
- [ ] Delete element (keyboard)
- [ ] Undo operation
- [ ] Redo operation
- [ ] Export HTML downloads
- [ ] Exported HTML opens correctly
- [ ] Metadata tag present in export

### Unit Testing (Future)
```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Run tests
npm test
```

Example test structure:
```typescript
describe('ElementService', () => {
  it('should create text element', () => {
    const service = new ElementService();
    const element = service.createElement('text', container);
    expect(element.tagName).toBe('P');
  });
});
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Style

- Follow existing TypeScript/React patterns
- Maintain SOLID principles
- Add JSDoc comments to public methods


---

## 📄 License

This project is created as an evaluation task and is intended for demonstration purposes.

---

## 👤 Author

**Frontend Engineer Candidate**

- GitHub: [@ankurojha834](https://github.com/ankurojha834)
- Email: ojhaankur2456@gmail.com

---

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- DOMPurify for HTML sanitization
- Tailwind CSS for rapid styling
- Lucide for beautiful icons
- Unsplash for sample images

---

## 📊 Project Statistics

- **Total Lines of Code**: ~2,325
- **Components**: 4
- **Services**: 4
- **Custom Hooks**: 2
- **Dependencies**: 5 (minimal)
- **Development Time**: 48 hours
- **Test Coverage**: Ready for implementation

---

## 🔗 Links

- **Live Demo**: [https://editable-html-poster.vercel.app](https://editable-html-poster.vercel.app)
- **GitHub Repository**: [https://github.com/ankurojha834/editable-html-poster](https://github.com/YOUR_USERNAME/editable-html-poster)
- **Documentation**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Issue Tracker**: [GitHub Issues](https://github.com/YOUR_USERNAME/editable-html-poster/issues)

---

**Last Updated**: October 2025

**Version**: 1.0.0
