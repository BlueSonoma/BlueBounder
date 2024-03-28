import { createBlobFromText, createImageFromBlob } from './general';

export async function createImageFromPath(filepath): HTMLImageElement {
  const blob = await createBlobFromText(filepath);
  return await createImageFromBlob(blob);
}