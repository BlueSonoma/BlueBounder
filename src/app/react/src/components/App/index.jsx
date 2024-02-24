import React, { useState } from 'react';

import '../../styles/bounder.css';
import { RoutesComponent } from '../screens/RoutesComponent';

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

  return (<div id={'app'} className='App'>
      <RoutesComponent />
    </div>);
}

export default App;
