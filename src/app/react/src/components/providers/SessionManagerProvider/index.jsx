import { useEffect, useState } from 'react';
import { Provider } from '../../../contexts/SessionManagerContext';
import SelectorModeProvider from '../SelectorModeProvider';
import type { ViewportType } from '../../../types/general';
import { Node, ReactFlowProvider, useNodesState } from '@xyflow/react';
import NodeSelectorProvider from '../NodeSelectorProvider';

function SessionProvider({ children }) {
  const [sessionName, setSessionName] = useState('');
  const [csvFilePath, setCsvFilePath] = useState('');
  const [ctfFilePath, setCtfFilePath] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [viewports, setViewports] = useState([]);
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

  useEffect(() => {
    viewports.forEach((vp) => {
      vp.props.nodes = nodes.filter((nd) => nd.data.viewport === vp.id);
      return vp;
    });
    setViewports(() => [...viewports]);
  }, [nodes]);

  function setActiveViewport(viewportId) {
    if (typeof viewportId === 'undefined') {
      return;
    }

    const index = viewports.findIndex((vp) => vp.id === viewportId);
    if (index === -1) {
      return;
    }

    _setActiveViewport(() => viewports[index]);
    viewports.forEach((vp, i) => vp.props.active = i === index);
    setViewports(() => viewports);
  }

  function getViewportIndex(viewport: ViewportType) {
    return viewports.findIndex((vp) => vp.id === viewport.id);
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
    onNodesChange,
    viewports,
    setViewports,
    getViewportIndex,
    activeViewport,
    setActiveViewport,
  };

  return (<Provider value={contextProps}>
    {children}
  </Provider>);
}

function SessionManagerProvider({ children }) {
  return (<ReactFlowProvider>
    <SelectorModeProvider>
      <SessionProvider>
        <NodeSelectorProvider>
          {children}
        </NodeSelectorProvider>
      </SessionProvider>
    </SelectorModeProvider>
  </ReactFlowProvider>);
}

export default SessionManagerProvider;

