import { Node, NodeMouseHandler } from '@xyflow/react';

export const Colors = {
  Black: 'black',
  Red: 'red',
  Green: 'green',
  Blue: 'blue',
  Yellow: 'yellow',
  Pink: 'pink',
  Purple: 'purple',
};

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

export type SelectorModeProviderProps = {
  selectorMode: string;
  setSelectorMode(mode: string): void;
}

export type ViewportProps = {
  id: string, nodes: [Node], onClick: (NodeMouseHandler) => void; active?: boolean;
}

export type ViewportType = {
  id: string, label: string, component: React.Component, props: ViewportProps,
}

export type FileProps = {
  prefix?: string; name?: string; path?: string; extension?: string;
}

export type ImageProps = {
  width?: number; height?: number; src: string
}