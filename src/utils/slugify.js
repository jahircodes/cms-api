/**
 * Slugify Utility
 * ---------------
 * Generates SEO-friendly URL slugs from text.
 * Handles normalization, special characters, and smart truncation.
 */

/**
 * Generate an SEO-friendly slug.
 *
 * @param {string} text - Input title
 * @param {Object} options
 * @param {number} options.maxLength - Max slug length (default 60)
 * @returns {string}
 */
function slugify(text, { maxLength = 60 } = {}) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // Base slug
  let slug = text
    .normalize('NFKD') // Normalize accented chars
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Smart truncate (avoid cutting in middle of word)
  if (slug.length > maxLength) {
    slug = slug.substring(0, maxLength);
    slug = slug.substring(0, slug.lastIndexOf('-')) || slug;
  }

  return slug;
}

module.exports = slugify;
