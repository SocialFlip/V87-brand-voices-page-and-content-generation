/**
 * Normalizes content text for comparison
 * @param {string} content - The content to normalize
 * @returns {string} - Normalized content
 */
export function normalizeContent(content) {
  if (!content) return '';
  return content
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Formats error messages for display
 * @param {Error} error - The error object
 * @returns {string} - Formatted error message
 */
export function formatErrorMessage(error) {
  if (error.message.includes('duplicate')) {
    return 'This content already exists in your library';
  }
  return error.message || 'An error occurred. Please try again.';
}