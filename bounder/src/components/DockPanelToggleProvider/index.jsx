import { useContext, useState } from 'react';
import { Provider } from '../../contexts/DockPanelToggleContext';

export default function DockPanelToggleProvider({ children }) {
  const [toggleMap, setToggleMap] = useState(new Map());

  function getState(qualifiedName: string) {
    return toggleMap.get(qualifiedName);
  }

  function toggleState(qualifiedName: string) {
    if (toggleMap.has(qualifiedName)) {
      toggleMap.set(qualifiedName, !toggleMap.get(qualifiedName));
    } else {
      toggleMap.set(qualifiedName, true);
    }
    setToggleMap(toggleMap);
  }

  const contextProps = {
    getState,
    toggleMap,
    toggleState,
  };

  return <Provider value={contextProps}>{children}</Provider>;
}

