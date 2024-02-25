import { createContext } from 'react';

const AppStateContext = createContext(null);

export const Provider = AppStateContext.Provider;

export default AppStateContext;
