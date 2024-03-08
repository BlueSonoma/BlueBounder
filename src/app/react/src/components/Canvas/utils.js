import { getFileExtFromPath, getFilenameFromPath, getNextId } from '../../utils/general';

export function getZoomPercentage(zoom, minZoom, maxZoom, precision?: number) {
  return (((Math.log(zoom) - Math.log(minZoom)) / (Math.log(maxZoom) - Math.log(minZoom))) * 100).toFixed(precision ? precision : 0);
}

export function createImageNode(image, path) {
  const filePrefix = getFilenameFromPath(path, true);
  const fileExt = getFileExtFromPath(path);
  const filename = filePrefix + '.' + fileExt;

  return {
    id: `imageNode_${getNextId()}`,
    type: 'imageNode',
    position: { x: 0, y: 0 },
    selectable: false,
    focusable: true,
    draggable: false,
    deletable: false,
    data: {
      width: image.width, height: image.height, file: {
        prefix: filePrefix, name: filename, path: path, extension: fileExt,
      }, src: image.src, viewport: undefined,
    },
  };
}