export function getZoomPercentage(zoom, minZoom, maxZoom, precision?: number) {
  return (((Math.log(zoom) - Math.log(minZoom)) / (Math.log(maxZoom) - Math.log(minZoom))) * 100).toFixed(precision ? precision : 0);
}