import type { ImageNodeType } from '../types';

export function imageExists(imagePath: string, nodes: ImageNodeType[]) {
  const isArray = Array.isArray(nodes);
  nodes = isArray ? nodes : [nodes];
  return typeof nodes.find((node) => node.data.file?.path === imagePath) !== 'undefined';
}