// Utility functions for the app

/**
 * Returns a color for a given label string, consistent across the app.
 * @param {string} label
 * @returns {string} Hex color code
 */
export function labelColor(label) {
  const colors = ["#6C5CE7", "#00B894", "#00B0FF", "#FF7043", "#FFD600", "#FF5252"];
  let hash = 0;
  for (let i = 0; i < label.length; i++) hash += label.charCodeAt(i);
  return colors[hash % colors.length];
} 