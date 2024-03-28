import { useEffect, useState } from 'react';
import { Provider } from '../../../contexts/ViewportsManagerContext';
import type { NodeType, ViewportType } from '../../../types';
import { getNextId } from '../../../utils/general';
import Viewport from '../../Viewport';
import useNodesManager from '../../../hooks/useNodesManager';

type ViewportParams = ViewportType & { options: { setActive?: boolean } }

function ViewportManagerProvider({ children }) {
  const [viewports, setViewports] = useState([]);
  const [activeViewport, _setActiveViewport] = useState(null);
  const { nodes, selectedNodes } = useNodesManager();

  useEffect(() => {
    // Update the nodes for each viewport
    setViewports((prev) => prev.map((vp) => {
      vp.props.nodes = nodes.filter((nd) => nd.data.viewport === vp.id);
      return vp;
    }));
  }, [nodes]);

  useEffect(() => {
    // Update the active viewport
    if (typeof selectedNodes === 'undefined' || selectedNodes.length === 0) {
      return;
    }

    let currentViewport = selectedNodes[0].data.viewport;
    if (typeof currentViewport === 'undefined' || !currentViewport) {
      return;
    }
    if (selectedNodes.length === 1) {
      if (!activeViewport || currentViewport !== activeViewport.id) {
        setActiveViewport(currentViewport);
      }
    } else {
      let sameViewport = true;
      for (let i = 0; i < selectedNodes.length; i++) {
        const viewport = selectedNodes[i].data.viewport;
        if (typeof viewport !== 'undefined') {
          if (viewport !== currentViewport) {
            sameViewport = false;
            break;
          }
        }
      }
      // If all nodes are in the same viewport, set it as active, otherwise leave it alone.
      if (sameViewport) {
        setActiveViewport(currentViewport);
      }
    }
  }, [selectedNodes]);

  function createViewport(params: ViewportParams): ViewportType {
    let {
      id, name, nodes, ...rest
    } = params;

    id = id ?? `Viewport_${getNextId()}`;
    name = name ?? id;

    nodes = nodes ?? [];
    const isArray = Array.isArray(nodes);
    nodes = isArray ? nodes : [nodes];

    nodes = nodes.map((node: NodeType) => {
      console.log(node);
      node.data.viewport = id;
      return node;
    });

    return {
      id: id, label: name, component: Viewport, props: {
        id: id, nodes: nodes, ...rest,
      },
    };
  }

  function createAndAddViewport(params: ViewportParams): ViewportType {
    const viewport = createViewport(params);
    if (viewport.props.active) {
      setViewports((prev) => [...prev.map((vp) => {
        return {
          ...vp, props: {
            ...vp.props, active: false,
          },
        };
      }), viewport]);
    } else {
      setViewports((prev) => [...prev, viewport]);
    }
    return viewport;
  }

  function setActiveViewport(viewport: ViewportType | string) {
    if (typeof viewport === 'undefined') {
      return;
    }
    if (!viewport) {
      _setActiveViewport(null);
    } else {
      const index = getViewportIndex(viewport);
      if (index === -1) {
        return;
      }
      _setActiveViewport(() => viewports[index]);
    }
  }

  function getViewportIndex(viewport: ViewportType | string) {
    if (typeof viewport === 'string') {
      return viewports.findIndex((vp) => vp.id === viewport);
    }
    return viewports.findIndex((vp) => vp.id === viewport.id);
  }

  const contextProps = {
    viewports, setViewports, activeViewport, setActiveViewport, getViewportIndex, createViewport, createAndAddViewport,
  };

  return (<Provider value={contextProps}>
    {children}</Provider>);
}

export default ViewportManagerProvider;
