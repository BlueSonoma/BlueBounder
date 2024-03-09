import {
  createBlobFromText, createImageFromBlob, getFileExtFromPath, getFilenameFromPath, getNextId,
} from '../../utils/general';
import Viewport from '../Viewport';
import type { ImageNodeType } from '../../types/nodes';

export function getZoomPercentage(zoom, minZoom, maxZoom, precision?: number) {
  return (((Math.log(zoom) - Math.log(minZoom)) / (Math.log(maxZoom) - Math.log(minZoom))) * 100).toFixed(precision ? precision : 0);
}

export function createImageNode(image) {
  const imageNode: ImageNodeType = {
    id: `imageNode_${getNextId(4)}`,
    type: 'imageNode',
    position: { x: 0, y: 0 },
    selectable: false,
    focusable: true,
    draggable: false,
    deletable: false,
    data: {
      width: image.width, height: image.height, src: image.src,
    },
  };

  return imageNode;
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
  return createImageNodeFromBlob(blob);
}

export async function createImageNodeFromBlob(blob) {
  const image = await createImageFromBlob(blob);
  return createImageNode(image);
}

export function createViewport(name, onClick) {
  return {
    label: name, component: Viewport, props: {
      id: `Viewport_${getNextId()}`, nodes: [], onClick: onClick,
    },
  };
}
