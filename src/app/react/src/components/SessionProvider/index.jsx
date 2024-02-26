import { useState } from 'react';
import { Provider } from '../../contexts/SessionContext';

const SessionProvider = ({ children }) => {
  const [sessionName, setSessionName] = useState('');
  const [csvFilePath, setCsvFilePath] = useState('');

  const contextProps = {
    sessionName, setSessionName, csvFilePath, setCsvFilePath,
  };

  return (<Provider value={contextProps}>
    {children}
  </Provider>);
};

export default SessionProvider;