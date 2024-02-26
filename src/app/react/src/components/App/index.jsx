import React, { memo, useEffect } from 'react';

import '../../styles/bounder.css';
import { RoutesComponent } from '../screens/RoutesComponent';
import useAppState from '../../hooks/useAppState';
import AppStateProvider from '../AppStateProvider';
import SessionProvider from '../SessionProvider';

function AppMain() {
  const { loading, saving } = useAppState();

  useEffect(() => {
    console.log(`Loading: ${loading}`);
  }, [loading]);

  return (<div id={'app'} className='App'>
    <RoutesComponent />
  </div>);
}

function App() {
  return (<AppStateProvider>
    <SessionProvider>
      <AppMain />
    </SessionProvider>
  </AppStateProvider>);
}

export default App;
