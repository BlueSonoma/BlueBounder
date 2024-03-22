import { useEffect, useState } from 'react';
import { Provider } from '../../../contexts/NodeSelectorContext';
import useSessionManager from '../../../hooks/useSessionManager';

function NodeSelectorProvider({ children }) {
  const { nodes, setNodes, activeViewport, setActiveViewport } = useSessionManager();
  const [_selectedNodes, _setSelectedNodes] = useState([]);

  useEffect(() => {
    _setSelectedNodes(() => [...nodes.filter((node) => node.selected)]);
  }, [nodes]);

  function setSelectedNodes(selected: Node | string | Node[] | string[]) {
    const isArray = Array.isArray(selected);
    selected = isArray ? selected : [selected];
    if (selected.length === 0) {
      return;
    }
    const selectedNodes = [];
    if (typeof selected[0] === 'string') {
      // Check using node IDs
      setNodes((prev) => prev.map((nd) => {
        const node = selected.find((id) => id === nd.id);
        if (typeof node !== 'undefined') {
          selectedNodes.push(node);
        }
        return {
          ...nd, selected: typeof node !== 'undefined',
        };
      }));
    } else {
      // Check using nodes
      setNodes((prev) => prev.map((nd) => {
        const node = selected.find((n) => n.id === nd.id);
        if (typeof node !== 'undefined') {
          selectedNodes.push(node);
        }
        return {
          ...nd, selected: typeof node !== 'undefined',
        };
      }));
    }
    _setSelectedNodes(selectedNodes);
  }

  useEffect(() => {
    if (_selectedNodes.length === 0) {
      return;
    }
    let currentViewport = _selectedNodes[0].data.viewport;
    if (typeof currentViewport === 'undefined') {
      return;
    }
    if (_selectedNodes.length === 1) {
      if (!activeViewport || currentViewport !== activeViewport.id) {
        setActiveViewport(currentViewport);
      }
    } else {
      let sameViewport = true;
      for (let i = 0; i < _selectedNodes.length; i++) {
        const vp = _selectedNodes[i].data.viewport;
        if (typeof vp !== 'undefined') {
          if (vp !== currentViewport) {
            sameViewport = false;
            break;
          }
        }
      }
      // If all nodes the same viewport, set it as active, otherwise leave it alone.
      if (!sameViewport) {
        setActiveViewport(currentViewport);
      }
    }
  }, [_selectedNodes]);

  const contextProps = { selectedNodes: _selectedNodes, setSelectedNodes };

  return <Provider value={contextProps}>
    {children}
  </Provider>;
}

export default NodeSelectorProvider;