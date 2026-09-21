/**
 * Escapes characters with special meaning in regular expressions to allow
 * safe inclusion of dynamic strings in new RegExp() constructors.
 */
export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
