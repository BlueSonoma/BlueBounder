import {
  Background, BackgroundVariant, ReactFlow, ReactFlowProvider,
} from '@xyflow/react';
import { nodeTypes } from '../component-types';
import React, { memo, useEffect, useMemo, useState } from 'react';
import useViewport from '../../hooks/useViewport';
import ViewportMetricsBar from '../ViewportMetricsBar';

import ViewportProvider from '../providers/ViewportProvider';

import '../../styles/canvas-viewport.css';
import useNodesManager from '../../hooks/useNodesManager';
import useViewportsManager from '../../hooks/useViewportsManager';

function ViewportFlow({ id, className, style, onClick, children, nodes, ...rest }) {
  const [nodeSize, setNodeSize] = useState(0);
  const [lastNodeSize, setLastNodeSize] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const {
    setViewport, minZoom, setMinZoom, maxZoom, zoom, setViewportExtent, getViewportExtent, fitView,
  } = useViewport(id);
  const { setActiveViewport } = useViewportsManager();
  const { setSelectedNodes, onNodesChange } = useNodesManager();

  function fitViewOnLoad() {
    fitView({ nodes, options: { duration: 400 } });
  }

  useEffect(() => {
    fitViewOnLoad();
  }, [initialized]);

  useEffect(() => {
    if (lastNodeSize === 0 && nodeSize > 0) {
      onInit();
      fitViewOnLoad();
    }
  }, [lastNodeSize, nodeSize]);

  useEffect(() => {
    const size = nodes.length;
    if (size !== nodeSize) {
      setLastNodeSize(nodeSize);
      setNodeSize(size);
    }
  }, [nodes]);

  function onInit() {
    if (nodeSize > 0) {
      const node = nodes[nodes.length - 1];
      let isSelected = false;
      for (let i = 0; i < nodes.length; i++) {
        if (nodes.selected) {
          isSelected = true;
          break;
        }
      }
      if (!isSelected) {
        setSelectedNodes(node);
      }

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
        nodes: nodes, edges: [], zoom: 1,
      });
    }
    setInitialized(true);
  }

  function onClickHandler() {
    // If there is a node within the viewport, make sure that there is a selected node
    if (nodes.length > 0) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].selected) {
          return;
        }
      }
      setSelectedNodes(nodes[nodes.length - 1]);
    }
  }

  function onNodeClickHandler(event, node) {
    event.preventDefault();
    setSelectedNodes(node);
    setActiveViewport(id);
  }

  const backgroundLineWidth = useMemo(() => {
    return Math.min(0.5, 0.5 * zoom);
  });

  return (<div className={'canvas ' + className} style={style} {...rest}>
    <ReactFlow
      id={id}
      className={'viewport'}
      onInit={onInit}
      fitView={true}
      nodes={nodes}
      nodeTypes={nodeTypes}
      nodesDraggable={false}
      onPaneClick={onClickHandler}
      onNodeClick={onNodeClickHandler}
      onNodesChange={onNodesChange}
      maxZoom={maxZoom}
      minZoom={minZoom}
      translateExtent={getViewportExtent()}
      onClick={onClick}
    >
      <Background
        id={`background__${id}`}
        variant={BackgroundVariant.Lines}
        lineWidth={backgroundLineWidth}
        gap={50}
        color={'#303030'}
      />
    </ReactFlow>
    <ViewportMetricsBar
      className={'bounder__mode-selector'}
      onFitView={() => fitView({ nodes })}
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
