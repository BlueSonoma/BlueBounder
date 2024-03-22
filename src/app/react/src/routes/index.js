export const LocalHost = 'http://localhost:8000';

const Routes = {
  Root: '/',
  App: '/app',
  NewSession: '/newSession',
  OldSessions: '/oldSession',
  InitSession: '/initSession',
  API: {
    Root: `${LocalHost}/api`,
    Sessions: `${LocalHost}/api/sessions`,
    Imaging: `${LocalHost}/api/imaging`,
  },
};

export const { API } = Routes;

export default Routes;