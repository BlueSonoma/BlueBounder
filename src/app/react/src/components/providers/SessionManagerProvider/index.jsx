import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Provider } from '../../../contexts/SessionManagerContext';
import useNodesManager from '../../../hooks/useNodesManager';
import NodesManagerProvider from '../NodesManagerProvider';
import useViewportsManager from '../../../hooks/useViewportsManager';
import ViewportManagerProvider from '../ViewportManagerProvider';

function SessionManagerProvider({ children }) {
  const [sessionName, setSessionName] = useState('');
  const [csvFilePath, setCsvFilePath] = useState('');
  const [ctfFilePath, setCtfFilePath] = useState('');
  const [chemCachePointer, setChemCachePointer] = useState(null);
  const [eulerCachePointer, setEulerCachePointer] = useState(null);

  const contextProps = {
   
    sessionName,
    setSessionName,
    csvFilePath,
    setCsvFilePath,
    ctfFilePath,
    setCtfFilePath,
    setChemCachePointer,
    setEulerCachePointer,
    chemCachePointer,
    eulerCachePointer, ...useNodesManager(), ...useViewportsManager(),
  };

  return (<Provider value={contextProps}>
    {children}
  </Provider>);
}

export default ({ children }) => {
  return (<ReactFlowProvider>
    <NodesManagerProvider>
      <ViewportManagerProvider>
        <SessionManagerProvider>
          {children}
        </SessionManagerProvider>
      </ViewportManagerProvider>
    </NodesManagerProvider>
  </ReactFlowProvider>);
}
