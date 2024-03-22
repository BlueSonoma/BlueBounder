import React, { createRef, useEffect, useState } from 'react';
import '../../styles/new-session.css';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../additional-components/buttons/BackButton';
import UploadForm from '../../additional-components/forms/UploadForm';
import AlertModal from '../../additional-components/AlertModal';
import useSessionManager from '../../hooks/useSessionManager';
import WindowTitleBar from '../../additional-components/WindowTitleBar';
import Routes from '../../routes';

function NewSession() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const sessionNameInputRef = createRef();
  const csvFilePathInputRef = createRef();
  const formRef = createRef();

  const { sessionName, setSessionName, csvFilePath, setCsvFilePath } = useSessionManager();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location);
    const formData = location.state?.formData;

    if (typeof formData !== 'undefined') {
      if (typeof formData.name !== 'undefined') {
        setSessionName(formData.name);
      }
      if (typeof formData.path !== 'undefined') {
        setCsvFilePath(formData.path);
        console.log(formData.path);
      }
    }
    const error = location.state?.error;
    if (typeof error !== 'undefined') {
      setShowAlert(true);
      setAlertMessage(error);
    }

    console.log(sessionName);
    console.log(csvFilePath);

  }, []);

  useEffect(() => {
    sessionNameInputRef.current?.focus();
  }, []);

  function handleSetSessionName(event) {
    setSessionName(event.target.value);
  }

  function handleSetCsvFilePath(event, inputValue) {
    setCsvFilePath(inputValue);
  }

  const handleSubmission = (event) => {
    event.preventDefault();

    if (sessionName === '') {
      setShowAlert(true);
      setAlertMessage('Please enter a session name');
      sessionNameInputRef.current?.focus();
      return;
    }

    const formData = {
      name: sessionName, path: csvFilePath,
    };

    navigate(Routes.InitSession, { state: { formData: formData } });
  };

  return (<>
    <WindowTitleBar />
    <body className={`${showAlert ? 'disabled' : ''}`}>
    {showAlert && (<AlertModal
      buttonProps={{ className: 'butt1class' }}
      message={alertMessage}
      onClose={() => {
        setShowAlert(false);
        setAlertMessage('');
      }}
    />)}
    <BackButton />
    <div className={'centered'}>
      <div className={'form_div'}>
        <form ref={formRef} className={'formClass'} onSubmit={handleSubmission}>
          <input
            ref={sessionNameInputRef}
            className={'inputClass'}
            type={'text'}
            name={'sessionName'}
            id={'sessionName'}
            placeholder={'Session Name'}
            value={sessionName}
            onChange={handleSetSessionName}
          />
          <UploadForm
            ref={csvFilePathInputRef}
            className={'inputClass'}
            name={'CSV'}
            id={'csvFilePath'}
            placeholder={'CSV File path (optional)'}
            textValue={csvFilePath}
            acceptTypes={'.csv, .xlsx'}
            onChange={handleSetCsvFilePath}
            browseButtonProps={{
              className: 'butt1class', style: {
                width: 'fit-content',
                height: 'fit-content',
                padding: '7px 10px 7px 10px',
                margin: '10px 10px 10px 220px',
              },
            }}
          />
          <button className={'butt1class'} >Enter</button>
        </form>
      </div>
    </div>
    </body>
  </>);
}

export default NewSession;