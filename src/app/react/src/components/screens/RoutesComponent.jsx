import { HashRouter as DomRouter, Route as DomRoute, Routes as DomRoutes } from 'react-router-dom';

import Start from './Start';
import NewSession from './NewSession';
import OldSessions from './OldSessions';
import SessionInitializer from './SessionIntializer';
import App from '../App';
import AppRoutes from '../../routes';



export function RoutesComponent() {
  return (<DomRouter>
    <DomRoutes>
      <DomRoute path={AppRoutes.Root} element={<Start />} />
      <DomRoute path={AppRoutes.NewSession} element={<NewSession />} />
      <DomRoute path={AppRoutes.App} element={<App />} />
      <DomRoute path={AppRoutes.OldSessions} element={<OldSessions />} />
      <DomRoute path={AppRoutes.NewSession} element={<SessionInitializer />} />
    </DomRoutes>
  </DomRouter>);
}