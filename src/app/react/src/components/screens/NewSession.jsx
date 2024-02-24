import React, { useState } from 'react';
import '../../styles/new-session.css';
import { useNavigate } from 'react-router-dom';
import BackButton from '../additional-components/buttons/BackButton';
import UploadForm from '../additional-components/forms/UploadForm';

function NewSession() {
  const [sessionName, setSessionName] = useState('');
  const [csvFilePath, setCsvFilePath] = useState('');
  const navigate = useNavigate();

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
    if (sessionName === '') {
      alert('Please enter a session name');
      return;
    }
    event.preventDefault();
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
    <head>
      <title>Blue Segment</title>
    </head>
    <body>
    <BackButton />
    <div className={'centered'}>
      <div className={'form_div'}>
        <form className={'formClass'} onSubmit={handleSubmission}>
          <input
            className={'inputClass'}
            type={'text'}
            name={'sessionName'}
            id={'sessionName'}
            placeholder={'Session Name'}
            onChange={handleSetSessionName}
          />
          <UploadForm
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