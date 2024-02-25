import React, { createRef, useEffect, useState } from 'react';
import '../../styles/new-session.css';
import { useNavigate } from 'react-router-dom';
import BackButton from '../additional-components/buttons/BackButton';
import UploadForm from '../additional-components/forms/UploadForm';
import AlertModal from '../additional-components/AlertModal';
import AppTitleBar from '../AppTitleBar';

function NewSession() {
  const [sessionName, setSessionName] = useState('');
  const [csvFilePath, setCsvFilePath] = useState('');
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const sessionNameInputRef = createRef(null);
  const csvFilePathInputRef = createRef(null);
  const formRef = createRef(null);

  useEffect(() => {
    sessionNameInputRef.current?.focus();
  }, []);

  function handleSetSessionName(event) {
    let name = event.target.value;
    // Escape any whitespaces in the string
    setSessionName(name);
  }

  function handleSetCsvFilePath(event, inputValue) {
    // Escape any whitespaces in the string
    setCsvFilePath(inputValue);
  }

  const handleSubmission = (event) => {
    event.preventDefault();

    if (sessionName === '') {
      setShowAlert(true);
      sessionNameInputRef.current?.focus();
      // return alert('Please enter a session name');
      return;
    }
    console.log(sessionName);
    console.log(csvFilePath);

    const formData = new FormData();
    formData.append('csvFilePath', csvFilePath);
    formData.append('sessionName', sessionName);

    fetch('http://localhost:8000/api/sessions/create_starter_images', {
      method: 'POST', body: formData,
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => {
        console.error('Error:', error);
      });
    navigate('/home');
  };

  return (<>
    <AppTitleBar/>
    <body className={`${showAlert ? 'disabled' : ''}`}>
    {showAlert && (<AlertModal
      buttonProps={{ className: 'butt1class' }}
      message={'Please enter a session name'}
      onClose={() => setShowAlert(false)}
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
            onChange={handleSetSessionName}
          />
          <UploadForm
            ref={csvFilePathInputRef}
            className={'inputClass'}
            name={'CSV'}
            id={'csvFilePath'}
            placeholder={'CSV File path (optional)'}
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
          <button className={'butt1class'}>Enter< /button>
        </form>
      </div>
    </div>
    </body>
  </>);
}

export default NewSession;