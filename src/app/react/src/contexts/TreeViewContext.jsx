import { createContext } from 'react';

const TreeViewContext = createContext(null);

export const TreeViewContextProvider = TreeViewContext.Provider;

export default TreeViewContext;
