// Utility functions for URL Shortener

// Generate a random shortcode (6 chars, alphanumeric)
export function generateShortcode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Check if a shortcode is unique in the current list
export function isShortcodeUnique(shortcode, allShortened) {
  return !allShortened.some(item => item.shortcode === shortcode);
}

// Calculate expiry date from now and validity (in minutes)
export function getExpiryDate(validityMinutes) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + validityMinutes);
  return now;
} 