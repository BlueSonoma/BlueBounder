export function getNextId() {
  return Date.now();
}

export async function streamFileIntoBlob(text) {
  const response = await fetch(text);
  if (!response.ok) {
    throw new Error('Failed to fetch file');
  }

  return await response.blob();
}

export async function createBlobFromText(text) {
  return streamFileIntoBlob(text)
    .then((blob) => blob)
    .catch((e) => console.log(e));
}

export function createFileFromPath(path) {
  const blob = createBlobFromText(path);
  return new File([blob], getFilenameFromPath(path), { type: 'image/png' });
}

export function createUrlFromPath(path) {
  const blob = createBlobFromText(path);
  return URL.createObjectURL(blob);
}

export function getFilenameFromPath(path, stripExt = false) {
  let start = path.lastIndexOf('\\') + 1;
  if (start === -1) {
    start = path.lastIndexOf('/') + 1;
    if (start === -1) {
      start = 0;
    }
  }
  let end = path.length;
  if (stripExt) {
    end = path.lastIndexOf('.');
  }
  return path.slice(start, end);
}

export function getFileExtFromPath(path) {
  const lastDot = path.lastIndexOf('.') + 1;
  return path.slice(lastDot);
}

