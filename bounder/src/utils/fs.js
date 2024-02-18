import { saveAs } from 'file-saver';

export function saveToFile(data: string, type: string, filename: string) {
  const blob = new Blob([JSON.stringify(data)], {
    type: type,
  });
  saveAs(blob, filename);
}

