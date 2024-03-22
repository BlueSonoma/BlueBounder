import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import '@xyflow/react/dist/style.css';
import { RoutesComponent } from './components/screens/RoutesComponent';
import SessionManagerProvider from './components/providers/SessionManagerProvider';
import AppStateProvider from './components/providers/AppStateProvider';

ReactDOM.render(<AppStateProvider>
  <SessionManagerProvider>
    <RoutesComponent />
  </SessionManagerProvider>
</AppStateProvider>, document.getElementById('root'));

