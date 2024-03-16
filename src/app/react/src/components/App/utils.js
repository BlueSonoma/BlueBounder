import {
  createBlobFromText, createImageFromBlob, getFileExtFromPath, getFilenameFromPath, getNextId,
} from '../../utils/general';
import Viewport from '../Viewport';
import type { ImageNodeType } from '../../types/nodes';
import type { ViewportType } from '../../types/general';

export function getZoomPercentage(zoom, minZoom, maxZoom, precision?: number) {
  return (((Math.log(zoom) - Math.log(minZoom)) / (Math.log(maxZoom) - Math.log(minZoom))) * 100).toFixed(precision ? precision : 0);
}

export function createImageNode(image): ImageNodeType {
  const id = `imageNode_${getNextId(4)}`;
  return {
    id: id,
    type: 'imageNode',
    position: { x: 0, y: 0 },
    selectable: true,
    focusable: true,
    draggable: false,
    deletable: false,
    data: {
      label: image.alt ?? id, viewport: null, width: image.width, height: image.height, src: image.src,
    },
  };
}

export function imageAlreadyLoaded(imagePath: string, nodes: ImageNodeType[]) {
  return typeof nodes.find((node) => node.data.file?.path === imagePath) !== 'undefined';
}

export function addFilepathToNode(node, filepath) {
  const filePrefix = getFilenameFromPath(filepath, true);
  const fileExt = getFileExtFromPath(filepath);
  const filename = filePrefix + '.' + fileExt;
  node.data.file = {
    prefix: filePrefix, name: filename, path: filepath, extension: fileExt,
  };
}

export async function createImageNodeFromFilepath(filepath) {
  const blob = await createBlobFromText(filepath);
  const altLabel = getFilenameFromPath(filepath);
  return createImageNodeFromBlob(blob, altLabel);
}

export async function createImageNodeFromBlob(blob, altLabel) {
  const image = await createImageFromBlob(blob, altLabel);
  return createImageNode(image);
}

export async function createImageFromPath(filepath): HTMLImageElement {
  const blob = await createBlobFromText(filepath);
  return await createImageFromBlob(blob);
}

export function createViewport(name, onClick): ViewportType {
  const id = `Viewport_${getNextId()}`;
  return {
    id: id, label: name, component: Viewport, props: {
      id: id, nodes: [], onClick: onClick, active: false,
    },
  };
}
