/**
 * HTMLSanitizerService
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles HTML sanitization
 * - Open/Closed: Can be extended with custom sanitization rules
 * - Interface Segregation: Provides focused sanitization interface
 */

import DOMPurify, { Config } from 'dompurify';

export interface ISanitizerService {
  sanitize(html: string): string;
}

export class HTMLSanitizerService implements ISanitizerService {
  private config: Config;

  constructor(customConfig?: Config) {
    this.config = customConfig || {
      ALLOWED_TAGS: [
        'div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'img', 'a', 'ul', 'ol', 'li', 'strong', 'em', 'br',
        'table', 'thead', 'tbody', 'tr', 'td', 'th'
      ],
      ALLOWED_ATTR: [
        'class', 'id', 'style', 'src', 'alt', 'href', 'title',
        'width', 'height', 'data-*'
      ],
      ALLOW_DATA_ATTR: true,
      KEEP_CONTENT: true,
    };
  }

  /**
   * Sanitizes HTML content to remove potentially harmful scripts and events
   * @param html - Raw HTML string to sanitize
   * @returns Sanitized HTML string
   */
  sanitize(html: string): string {
    if (typeof window === 'undefined') {
      // Server-side: basic sanitization
      return this.basicSanitize(html);
    }

    // Client-side: use DOMPurify
    return DOMPurify.sanitize(html, this.config);
  }

  /**
   * Basic server-side sanitization fallback
   */
  private basicSanitize(html: string): string {
    // Remove script tags
    let sanitized = html.replace(/<script\b[^<](?:(?!<\/script>)<[^<])*<\/script>/gi, '');
    
    // Remove event handlers
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
    
    return sanitized;
  }

  /**
   * Updates sanitizer configuration
   */
  updateConfig(newConfig: Partial<Config>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
