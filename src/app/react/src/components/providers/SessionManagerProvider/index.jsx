import { useEffect, useState } from 'react';
import { ReactFlowProvider, useNodesState } from '@xyflow/react';
import { Provider } from '../../../contexts/SessionManagerContext';
import SelectorModeProvider from '../SelectorModeProvider';
import type { ViewportType } from '../../../types';
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
    // Update the viewport active status
    setViewports((prev) => prev.map((viewport) => {
      return {
        ...viewport, props: {
          ...viewport.props, active: viewport.id !== activeViewport.id,
        },
      };
    }));
  }, [activeViewport]);

  useEffect(() => {
    // Update the nodes for each viewport
    setViewports((prev) => prev.map((vp) => {
      vp.props.nodes = nodes.filter((nd) => nd.data.viewport === vp.id);
      return vp;
    }));
  }, [nodes]);

  function setActiveViewport(viewport: ViewportType | string) {
    if (typeof viewport === 'undefined') {
      return;
    }

    const index = getViewportIndex(viewport);
    if (index === -1) {
      return;
    }

    _setActiveViewport(() => viewports[index]);
  }

  function getViewportIndex(viewport: ViewportType | string) {
    if (typeof viewport === 'string') {
      return viewports.findIndex((vp) => vp.id === viewport);
    }
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

