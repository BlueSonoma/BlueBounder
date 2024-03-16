import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import Start from './Start';
import NewSession from './NewSession';
import OldSessions from './OldSessions';
import SessionInitializer from './SessionIntializer';
import App from '../App';

export function RoutesComponent() {
  return (<Router>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/newSession' element={<NewSession />} />
        <Route path='/app' element={<App />} />
        <Route path='/oldSessions' element={<OldSessions />} />
        <Route path='/initSession' element={<SessionInitializer />} />
      </Routes>
    </Router>);
}