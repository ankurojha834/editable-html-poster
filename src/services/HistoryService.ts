/**
 * HistoryService
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Manages undo/redo history
 * - Open/Closed: Can be extended with different history strategies
 */

export interface HistoryState {
  html: string;
  timestamp: number;
}

export interface IHistoryService {
  push(state: string): void;
  undo(): string | null;
  redo(): string | null;
  canUndo(): boolean;
  canRedo(): boolean;
  clear(): void;
}

export class HistoryService implements IHistoryService {
  private history: HistoryState[] = [];
  private currentIndex = -1;
  private maxHistorySize: number;

  constructor(maxHistorySize = 50) {
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Pushes a new state to history
   */
  push(state: string): void {
    // Remove any states after current index (when undoing then making new changes)
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new state
    this.history.push({
      html: state,
      timestamp: Date.now()
    });

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  /**
   * Undoes the last action
   */
  undo(): string | null {
    if (!this.canUndo()) {
      return null;
    }

    this.currentIndex--;
    return this.history[this.currentIndex].html;
  }

  /**
   * Redoes the previously undone action
   */
  redo(): string | null {
    if (!this.canRedo()) {
      return null;
    }

    this.currentIndex++;
    return this.history[this.currentIndex].html;
  }

  /**
   * Checks if undo is available
   */
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  /**
   * Checks if redo is available
   */
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  /**
   * Clears all history
   */
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  /**
   * Gets current state without modifying history
   */
  getCurrentState(): string | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex].html;
    }
    return null;
  }

  /**
   * Gets history size
   */
  size(): number {
    return this.history.length;
  }
}