import { createContext } from 'react';
import { SelectorModes } from '../utils/selector-modes';

const SelectorModeContext = createContext(SelectorModes.FreeMove);

export const Provider = SelectorModeContext.Provider;

export default SelectorModeContext;
