import { HashRouter as Router, Route, Routes } from 'react-router-dom';

import Start from './Start';
import NewSession from './newSession';
import HomePage from './HomePage';
import OldSessions from './OldSessions';
export const RoutesComponent = () => {
    return (
      <Router>
        <Routes>
            <Route path="/" element={<Start/>} />
            <Route path="/newSession" element={<NewSession/>} /> 
            <Route path="/home" element={<HomePage/>} />
            <Route path="/oldSessions" element={<OldSessions/>} />
        </Routes>
      </Router>
    );
};