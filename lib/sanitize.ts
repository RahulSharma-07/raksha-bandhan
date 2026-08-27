/**
 * Server-side XSS sanitization for user-submitted text fields.
 * Strips HTML tags and script content while preserving emojis, apostrophes, etc.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return ''

  return input
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove all HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers (onerror=, onclick=, etc.)
    .replace(/\bon\w+\s*=/gi, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Escape HTML special characters for safe rendering in cases where
 * content must be inserted as HTML (belt-and-suspenders with sanitizeText).
 */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
