export function getNextId(size = 8) {
  let length = 10;
  for (let i = 0; i < size; i++) {
    length *= 10;
  }

  return Date.now() % length;
}

export async function streamFileIntoBlob(text) {
  const response = await fetch(text);
  if (!response.ok) {
    throw new Error(`Failed to fetch file '${text}'`);
  }

  return await response.blob();
}

export async function createBlobFromText(text) {
  return streamFileIntoBlob(text)
    .then((blob) => blob)
    .catch((e) => console.log(e));
}

export function createFileFromPath(path, type) {
  const blob = createBlobFromText(path);
  return new File([blob], getFilenameFromPath(path), { type });
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

export function createFileReader(blob) {
  if (!blob) {
    throw new Error('Blob is undefined or null');
  }

  return new FileReader();
}

export async function createImageFromBlob(blob, onLoad) {
  let image;
  let imageLoaded = false;

  const reader = createFileReader(blob);
  reader.onload = () => {
    const result = reader.result;
    const img = new Image();
    img.onload = () => {
      onLoad?.(img);
    };
    img.src = result;
    image = img;
    imageLoaded = true;
  };
  reader.readAsDataURL(blob);

  while (!imageLoaded) {
    await sleep(100);
  }
  return image;
}

// https://stackoverflow.com/a/39914235
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

