import { createContext } from 'react';

const SessionContext = createContext({});

export const Provider = SessionContext.Provider;

export default SessionContext;