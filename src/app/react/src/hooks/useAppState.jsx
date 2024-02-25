import { useState } from 'react';

function AppStateProvider() {
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

  return {
    loading, saving, startLoadRequest, endLoadRequest, startSaveRequest, endSaveRequest,
  };
}

export default AppStateProvider;