import type { FileProps, ImageProps } from './general';
import type NodeBase from '@xyflow/react';

export type ImageNodeData = {
  label?: string;
  width?: number;
  height?: number;
  image: ImageProps; file?: FileProps; viewport: string | null; reload?: () => void;
};

export type ImageNodeType = NodeBase & {
  data: ImageNodeData,
};

