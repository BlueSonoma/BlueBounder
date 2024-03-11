import React from 'react';

import { RoutesComponent } from '../screens/RoutesComponent';
import AppStateProvider from '../AppStateProvider';
import SessionManagerProvider from '../SessionManagerProvider';

function AppMain() {
  return (<div id={'app'}>
    <RoutesComponent />
  </div>);
}

function App() {
  return (<AppStateProvider>
    <SessionManagerProvider>
      <AppMain />
    </SessionManagerProvider>
  </AppStateProvider>);
}

export default App;
