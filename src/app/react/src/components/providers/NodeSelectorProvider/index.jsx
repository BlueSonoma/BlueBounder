import { useState } from 'react';
import { Provider } from '../../../contexts/NodeSelectorContext';
import useSessionManager from '../../../hooks/useSessionManager';

function NodeSelectorProvider({ children }) {
  const { setNodes } = useSessionManager();
  const [_selectedNodes, _setSelectedNodes] = useState([]);

  function setSelectedNodes(selected: Node[] | string[]) {
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
        if (node) {
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
        if (node) {
          selectedNodes.push(node);
        }
        return {
          ...nd, selected: typeof node !== 'undefined',
        };
      }));
    }
    _setSelectedNodes(selectedNodes);
  }

  const contextProps = { selectedNodes: _selectedNodes, setSelectedNodes };

  return <Provider value={contextProps}>
    {children}
  </Provider>;
}

export default NodeSelectorProvider;