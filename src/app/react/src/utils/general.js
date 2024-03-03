export function getNextId() {
  return Date.now();
}

export function getFilenameFromUrl(url) {
  const lastSlash = url.lastIndexOf('/') + 1;
  const lastDot = url.lastIndexOf('.');
  return url.slice(lastSlash, lastDot);
}