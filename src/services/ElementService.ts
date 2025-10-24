/**
 * ElementService
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Manages element operations (CRUD)
 * - Open/Closed: Extensible for new element types
 * - Dependency Inversion: Depends on abstractions (interfaces)
 */

export interface IElement {
  id: string;
  element: HTMLElement;
  rect: DOMRect;
}

export interface IElementService {
  createElement(type: 'text' | 'image', container: HTMLElement): HTMLElement;
  deleteElement(element: HTMLElement): void;
  updateElementPosition(element: HTMLElement, x: number, y: number): void;
  updateElementStyle(element: HTMLElement, property: string, value: string): void;
  getElementData(element: HTMLElement, stageRect: DOMRect): IElement;
}

export class ElementService implements IElementService {
  private idCounter = 0;

  /**
   * Creates a new element of specified type
   */
  createElement(type: 'text' | 'image', container: HTMLElement): HTMLElement {
    const element = type === 'text' 
      ? this.createTextElement() 
      : this.createImageElement();
    
    container.appendChild(element);
    return element;
  }

  /**
   * Creates a new text element with default styles
   */
  private createTextElement(): HTMLElement {
    const textElement = document.createElement('p');
    textElement.id = `text-${this.idCounter++}`;
    textElement.textContent = 'Double-click to edit';
    textElement.style.position = 'absolute';
    textElement.style.left = '50px';
    textElement.style.top = '50px';
    textElement.style.fontSize = '16px';
    textElement.style.color = '#000000';
    textElement.style.cursor = 'move';
    textElement.style.userSelect = 'none';
    
    return textElement;
  }

  /**
   * Creates a new image element with placeholder
   */
  private createImageElement(): HTMLElement {
    const imgElement = document.createElement('img');
    imgElement.id = `img-${this.idCounter++}`;
    imgElement.src = this.getPlaceholderImageSrc();
    imgElement.alt = 'Placeholder Image';
    imgElement.style.position = 'absolute';
    imgElement.style.left = '100px';
    imgElement.style.top = '100px';
    imgElement.style.width = '200px';
    imgElement.style.height = '200px';
    imgElement.style.cursor = 'move';
    imgElement.style.userSelect = 'none';
    
    return imgElement;
  }

  /**
   * Generates placeholder image as data URL
   */
  private getPlaceholderImageSrc(): string {
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="20" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
  }

  /**
   * Deletes an element from the DOM
   */
  deleteElement(element: HTMLElement): void {
    element.remove();
  }

  /**
   * Updates element position with boundary constraints
   */
  updateElementPosition(element: HTMLElement, x: number, y: number, maxWidth = 720, maxHeight = 720): void {
    const rect = element.getBoundingClientRect();
    const constrainedX = Math.max(0, Math.min(x, maxWidth - rect.width));
    const constrainedY = Math.max(0, Math.min(y, maxHeight - rect.height));
    
    element.style.position = 'absolute';
    element.style.left = `${constrainedX}px`;
    element.style.top = `${constrainedY}px`;
  }

  /**
   * Updates element style property
   */
  updateElementStyle(element: HTMLElement, property: string, value: string): void {
    switch (property) {
      case 'fontSize':
        element.style.fontSize = value;
        break;
      case 'color':
        element.style.color = value;
        break;
      case 'fontWeight':
        element.style.fontWeight = value;
        break;
      case 'width':
        element.style.width = value;
        break;
      case 'height':
        element.style.height = value;
        break;
      default:
        // Use bracket notation for dynamic property access
        (element.style as any)[property] = value;
    }
  }

  /**
   * Gets element data with position relative to stage
   */
  getElementData(element: HTMLElement, stageRect: DOMRect): IElement {
    const rect = element.getBoundingClientRect();
    
    return {
      id: element.id || `element-${Date.now()}`,
      element,
      rect: new DOMRect(
        rect.left - stageRect.left,
        rect.top - stageRect.top,
        rect.width,
        rect.height
      )
    };
  }
}