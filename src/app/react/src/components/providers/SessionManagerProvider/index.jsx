import { useEffect, useState } from 'react';
import { Provider } from '../../contexts/SessionManagerContext';
import SelectorModeProvider from '../SelectorModeProvider';

function SessionProvider({ children }) {
  const [sessionName, setSessionName] = useState('');
  const [csvFilePath, setCsvFilePath] = useState('');
  const [ctfFilePath, setCtfFilePath] = useState('');
  const [nodes, setNodes] = useState([]);
  const [viewports, setViewports] = useState([]);
  const [activeViewportIndex, setActiveViewportIndex] = useState(null);
  const [activeViewport, _setActiveViewport] = useState(null);

  useEffect(() => {
    if (!activeViewport) {
      return;
    }
    viewports.forEach((viewport) => {
      if (viewport.id !== activeViewport.id) {
        viewport.props.active = false;
      }
    });
  }, [activeViewport]);

  function setActiveViewport(viewportId) {
    if (typeof viewportId === 'undefined') {
      return;
    }

    const index = viewports.findIndex((vp) => vp.id === viewportId);
    if (index === -1) {
      return;
    }

    _setActiveViewport(() => viewports[index]);
    setActiveViewportIndex(() => index);
    viewports.forEach((vp, i) => vp.props.active = i === index);
    setViewports(() => viewports);
  }

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
    activeViewport: [activeViewport, activeViewportIndex],
    setActiveViewport,
  };

  return (<Provider value={contextProps}>
    {children}
  </Provider>);
}

function SessionManagerProvider({ children }) {
  return (<SelectorModeProvider>
    <SessionProvider>
      {children}
    </SessionProvider>
  </SelectorModeProvider>);
}

export default SessionManagerProvider;

