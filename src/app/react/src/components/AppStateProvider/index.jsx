import { useState } from 'react';
import { Provider } from '../../contexts/AppStateContext';

function AppStateProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  function startLoadRequest() {
    setLoading(true);
  }

  function endLoadRequest() {
    setLoading(false);
  }

  function startSaveRequest() {
    setSaving(true);
  }

  function endSaveRequest() {
    setSaving(false);
  }

  const contextProps = {
    loading, saving, startLoadRequest, endLoadRequest, startSaveRequest, endSaveRequest,
  };

  return (<Provider value={contextProps}>
      {children}
    </Provider>);
}

export default AppStateProvider;