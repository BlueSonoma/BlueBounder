import { useState } from 'react';
import type { SelectorModeProviderProps } from '../../../types';
import { Provider } from '../../../contexts/SelectorModeContext';
import { SelectorModes } from '../../../utils/selector-modes';

export default function SelectorModeProvider({ initialMode, children }) {
  const [mode, setMode] = useState(initialMode ?? SelectorModes.FreeMove);

  const contextProps: SelectorModeProviderProps = {
    selectorMode: mode, setSelectorMode: setMode,
  };

  return (<Provider value={contextProps}>{children}</Provider>);
}