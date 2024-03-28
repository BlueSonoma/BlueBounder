import { useNodesState } from '@xyflow/react';
import { Provider } from '../../../contexts/NodesManagerContext';
import NodeSelectorProvider from '../NodeSelectorProvider';

function NodesManagerProvider({ initialNodes, children }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const contextProps = {
    nodes, setNodes, onNodesChange,
  };
  return <Provider value={contextProps}>{children}</Provider>;
}

export default ({ children }) => (<NodesManagerProvider>
  <NodeSelectorProvider>
    {children}
  </NodeSelectorProvider>
</NodesManagerProvider>;