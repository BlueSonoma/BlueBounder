import React, { useState } from 'react';

import '../../styles/bounder.css';
import CanvasView from '../Canvas';

function App() {
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

  return (
    <div id={'app'} className="App">
      <CanvasView />
    </div>
  );
}

export default App;
