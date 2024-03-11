import { NodeMouseHandler } from '@xyflow/react';

export const DockPanelPosition = {
  Left: 'left',
  Right: 'right',
  Top: 'top',
  Bottom: 'bottom',
  Center: 'center',
  TopLeft: 'top-left',
  TopCenter: 'top-center',
  TopRight: 'top-right',
  BottomLeft: 'bottom-left',
  BottomCenter: 'bottom-center',
  BottomRight: 'bottom-right',
};

export type ViewportType = {
  id: string, label: string, component: React.Component, props: {
    id: string, nodes: [], onClick: (NodeMouseHandler) => void; active: boolean;
  },
}