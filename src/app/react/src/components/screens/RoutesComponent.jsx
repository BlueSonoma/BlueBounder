import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import Start from './Start';
import NewSession from './NewSession';
import OldSessions from './OldSessions';
import Canvas from '../Canvas';

export const RoutesComponent = () => {
  return (<Router>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/newSession' element={<NewSession />} />
        <Route path='/home' element={<Canvas />} />
        <Route path='/oldSessions' element={<OldSessions />} />
      </Routes>
    </Router>);
};