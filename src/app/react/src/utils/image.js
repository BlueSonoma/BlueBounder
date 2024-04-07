import { createBlobFromText, createImageFromBlob } from './general';

export async function createImageFromPath(filepath): HTMLImageElement {
  const blob = await createBlobFromText(filepath);
  return await createImageFromBlob(blob);
}

export function createThumbnailFromImage(image, width = 32, height = 32) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  const imgEl = document.createElement('img');
  imgEl.src = image.src;
  imgEl.alt = `${image.alt}.thumbnail`;
  imgEl.width = image.width;
  imgEl.height = image.height;

  ctx.drawImage(imgEl, 0, 0, width, height);

  imgEl.src = canvas.toDataURL();
  imgEl.width = width;
  imgEl.height = height;

  canvas.remove();

  return imgEl;
}