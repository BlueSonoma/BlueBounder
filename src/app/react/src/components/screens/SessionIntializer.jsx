import { useEffect, useState } from 'react';
import useAppState from '../../hooks/useAppState';
import { useLocation, useNavigate } from 'react-router-dom';
import WindowTitleBar from '../../additional-components/WindowTitleBar';
import { HOST_URL } from '../../index';

function SessionInitializer() {
  const appState = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  const [ellipses, setEllipses] = useState('');

  function updateEllipses() {
    let nextLength = (ellipses.length + 1) % 4;
    let nextEllipse = '';
    for (let i = 0; i < nextLength; i++) {
      nextEllipse += '.';
    }
    setEllipses(nextEllipse);
  }

  useEffect(() => {
    updateEllipses();
  }, []);

  setTimeout(() => {
    updateEllipses();
  }, 500);

  useEffect(() => {
    const sessionData = location.state.formData;

    if (typeof sessionData === 'undefined' || sessionData.path.length === 0) {
      navigate('/app');
      return;
    }

    appState.startLoadRequest();

    const formData = new FormData();
    formData.append('sessionName', sessionData.name);
    formData.append('csvFilePath', sessionData.path);

    const fetchAddr = `${HOST_URL}/api/sessions/create_starter_images`;

    fetch(fetchAddr, {
      method: 'POST', body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        appState.endLoadRequest();
        navigate('/app');
      })
      .catch((error) => {
        appState.endLoadRequest();
        error = `${error.message} ${fetchAddr}`;
        navigate('/newSession', { state: { formData: sessionData, error } });
      });
  }, []);

  return (<div className={'init-session'}>
    <WindowTitleBar text={'Loading Session'} />
    <h1>Loading{ellipses}</h1>
  </div>);
}

export default SessionInitializer;