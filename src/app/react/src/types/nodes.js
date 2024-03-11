import { XYPosition } from '@xyflow/react';

export type ImageNodeType = {
  id: string;
  type: string;
  position: XYPosition,
  selectable?: boolean,
  focusable?: boolean,
  draggable?: boolean,
  deletable?: boolean,
  data: {
    width?: number; height?: number; src: string; file?: {
      prefix?: string; name?: string; path?: string; extension?: string;
    }; viewport: string | null;
  },
};
