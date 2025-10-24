/**
 * ExportService
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Handles HTML export functionality
 * - Open/Closed: Can be extended for different export formats
 */

export interface IExportService {
  exportHTML(stageElement: HTMLElement, filename?: string): void;
}

export class ExportService implements IExportService {
  /**
   * Exports the stage content as an HTML file
   */
  exportHTML(stageElement: HTMLElement, filename = 'edited-poster.html'): void {
    const clonedStage = this.cloneStageWithoutOverlays(stageElement);
    const htmlContent = this.generateHTMLDocument(clonedStage.innerHTML);
    this.downloadFile(htmlContent, filename);
  }

  /**
   * Clones stage and removes selection overlays
   */
  private cloneStageWithoutOverlays(stageElement: HTMLElement): HTMLElement {
    const cloned = stageElement.cloneNode(true) as HTMLElement;
    
    // Remove selection overlays and editor artifacts
    const overlays = cloned.querySelectorAll('.selection-overlay, [class*="overlay"]');
    overlays.forEach(overlay => overlay.remove());
    
    // Remove contenteditable attributes
    const editableElements = cloned.querySelectorAll('[contenteditable]');
    editableElements.forEach(el => el.removeAttribute('contenteditable'));
    
    return cloned;
  }

  /**
   * Generates complete HTML document with metadata
   */
  private generateHTMLDocument(bodyContent: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta data-generated-by="editable-html-poster" />
  <title>Edited Poster</title>
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      font-family: sans-serif;
    }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
  }

  /**
   * Triggers browser download of file
   */
  private downloadFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  /**
   * Exports stage content as plain HTML string (for preview/debugging)
   */
  exportHTMLString(stageElement: HTMLElement): string {
    const cloned = this.cloneStageWithoutOverlays(stageElement);
    return this.generateHTMLDocument(cloned.innerHTML);
  }
}