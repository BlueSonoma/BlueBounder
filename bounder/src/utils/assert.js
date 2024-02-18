export function assert(pred, message) {
  if (!pred) {
    throw new Error(message || 'Assertion failed');
  }
}
