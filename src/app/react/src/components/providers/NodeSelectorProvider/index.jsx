import { useEffect, useState } from 'react';
import { Provider } from '../../../contexts/NodeSelectorContext';
import useNodes from '../../../hooks/useNodes';

function NodeSelectorProvider({ children }) {
  const [_selectedNodes, _setSelectedNodes] = useState([]);
  const { nodes, setNodes } = useNodes();

  useEffect(() => {
    if (nodes) {
      _setSelectedNodes([...nodes.filter((node) => node.selected)]);
    }
  }, [nodes]);

  useEffect(() => {
    console.log('Selected nodes updated');
  }, [_selectedNodes]);

  function setSelectedNodes(selected: Node | string | Node[] | string[]) {
    const isArray = Array.isArray(selected);
    selected = isArray ? selected : [selected];

    if (selected.length === 0) {
      setNodes((prev) => prev.map((nd) => {
        return {
          ...nd, selected: false,
        };
      }));
    }

    if (typeof selected[0] !== 'string') {
      selected = selected.map((nd) => nd.id);
    }

    let numSelected = 0;
    _selectedNodes.forEach((nd) => {
      if (selected.find((id) => id === nd.id) !== 'undefined') {
        numSelected++;
      }
    });

    // Just set nodes and the selected nodes will be set in the useEffect above
    setNodes((prev) => prev.map((nd) => {
      const index = selected.findIndex((id) => id === nd.id);
      return {
        ...nd, selected: index !== -1,
      };
    }));
  }

  const contextProps = { selectedNodes: _selectedNodes, setSelectedNodes };

  return <Provider value={contextProps}>
    {children}
  </Provider>;
}

export default NodeSelectorProvider;