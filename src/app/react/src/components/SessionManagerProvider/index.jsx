import { useState } from 'react';
import { Provider } from '../../contexts/SessionContext';

function SessionProvider({ children }) {
  const [sessionName, setSessionName] = useState('');
  const [csvFilePath, setCsvFilePath] = useState('');
  const [ctfFilePath, setCtfFilePath] = useState('');
  const [nodes, setNodes] = useState([]);
  const [viewports, setViewports] = useState([]);


  const contextProps = {
    sessionName,
    setSessionName,
    csvFilePath,
    setCsvFilePath,
    ctfFilePath,
    setCtfFilePath,
    nodes,
    setNodes,
    viewports,
    setViewports,
  };

  return (<Provider value={contextProps}>
    {children}
  </Provider>);
}

export default SessionProvider;