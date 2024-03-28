import useNodeSelector from '../../../hooks/useNodeSelector';
import { Provider } from '../../../contexts/NodesManagerContext';
import NodeSelectorProvider from '../NodeSelectorProvider';
import NodesProvider from '../NodesProvider';
import useNodes from '../../../hooks/useNodes';

function NodesManagerProvider({ children }) {
  const contextProps = {
    ...useNodeSelector(), ...useNodes(),
  };
  return (<Provider value={contextProps}>{children}</Provider>);
}

export default ({ children }) => (<NodesProvider>
  <NodeSelectorProvider>
    <NodesManagerProvider>
      {children}
    </NodesManagerProvider>
  </NodeSelectorProvider>
</NodesProvider>);