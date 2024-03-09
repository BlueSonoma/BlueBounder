import {
  Background, BackgroundVariant, ReactFlow, ReactFlowProvider, useNodesState,
} from '@xyflow/react';
import { nodeTypes } from '../component-types';
import React, { memo, useEffect, useState } from 'react';
import useViewport from '../../hooks/useViewport';
import ViewportMetricsBar from '../ViewportMetricsBar';

import '../../styles/canvas-viewport.css';
import ViewportProvider from '../ViewportProvider';

function ViewportFlow({ id, className, style, onClick, children, nodes, ...rest }) {
  const [_nodes, setNodes, onNodesChange] = useNodesState(nodes ?? []);
  const [initialized, setInitialized] = useState(false);
  const {
    setViewport, minZoom, setMinZoom, maxZoom, setViewportExtent, getViewportExtent, fitView,
  } = useViewport(id);

  useEffect(() => {
    fitView({ nodes: _nodes, options: { duration: 400 } });
  }, [initialized]);

  useEffect(() => {
    setNodes([...nodes]);
  }, [nodes]);

  function onInit() {
    if (_nodes.length > 0) {
      const node = _nodes[0];

      const width = node.data.width;
      const height = node.data.height;

      const padding = {
        x: maxZoom + width * (1 / 2), y: maxZoom + height * (1 / 2),
      };

      const extentUpperLeft = [-padding.x, -padding.y];
      const extentLowerRight = [width + padding.x, height + padding.y];
      setViewportExtent([extentUpperLeft, extentLowerRight]);

      // The zoom is set such that it allows a full view of the image plus some extra.
      // Removes the unnecessary ability to zoom too far out.
      const zoom = Math.abs(1.5 - (width + height) / Math.sqrt(width * width + height * height));
      setMinZoom(zoom);
      setViewport({
        nodes: _nodes, edges: [], zoom: 1,
      });
    }

    setInitialized(true);
  }

  return (<div className={'canvas ' + className} style={style} {...rest}>
    <ReactFlow
      id={id}
      className={'viewport'}
      onInit={onInit}
      fitView={true}
      nodes={_nodes}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      onNodesChange={onNodesChange}
      maxZoom={maxZoom}
      minZoom={minZoom}
      translateExtent={getViewportExtent()}
      onClick={onClick}
    >
      {/*<Panel position={Position.Top}>*/}
      {/*<ModeSelector />*/}
      {/*</Panel>*/}
      <Background
        id={`background__${id}`}
        variant={BackgroundVariant.Lines}
        lineWidth={0.5}
        gap={50}
        color={'#303030'}
      />
    </ReactFlow>
    <ViewportMetricsBar
      className={'bounder__mode-selector'}
      onFitView={() => fitView({ nodes: _nodes })}
    />
  </div>);
}

function Viewport({ children, ...rest }) {
  return (<ReactFlowProvider>
    <ViewportProvider>
      <ViewportFlow {...rest}>
        {children}
      </ViewportFlow>
    </ViewportProvider>
  </ReactFlowProvider>);
}

export default memo(Viewport);
