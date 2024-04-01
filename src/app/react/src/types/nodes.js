import type { FileProps, ImageProps } from './general';
import type NodeBase, { Node } from '@xyflow/react';

export type NodeBaseData = {
  label?: string; viewport: string | null;
}

export type NodeType = Node & {
  data: NodeBaseData;
}

export type ImageNodeData = NodeBaseData & {
  width?: number; height?: number; image: ImageProps; file?: FileProps; reload?: () => void;
};

export type ImageNodeType = NodeBase & {
  data: ImageNodeData;
};

