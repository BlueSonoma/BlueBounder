import { memo } from 'react';
import { useState,useEffect } from 'react';
import { useContext } from 'react';
import { SessionContext } from '../../../contexts/sessionContext.js'; 


function ProjectInformationView({sessionname,children, ...rest}) {
  
  
  const [projectName, setProjectName] = useState('');
  const [CSVFilePath, setCsvFilePath] = useState('');
  const [CTFFilePath, setCtfFilePath] = useState('');
  const [StepSize, setStepSize] = useState(10);
  const { sessionName} = useContext(SessionContext);
  
  
  useEffect(() => {
    if (sessionName) {
      const formData = new FormData();
      formData.append('sessionName', sessionName);
  
      fetch('http://localhost:8000/api/sessions/get_session_Info', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(([data, status]) => {
        if (status === 200) {
          setProjectName(data.sessionName);
          setCsvFilePath(data.csvFilePath);
          setCtfFilePath(data.ctfFilePath);
          setStepSize(data.grainStepSize);
        } else {
          console.error('Error:', status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }, []);

  console.log(`This is the session name in ProjectInfo: ${sessionName}`);

  return (<div style={{padding: '5px', border: '2px inset lightgray'}}>
  
  <div>Project Name: {projectName.substring(0, 20)}</div>
<div>CSV-File-path: {CSVFilePath.substring(0, 20)}</div>
<div>CTF-File-path: {CTFFilePath.substring(0, 20)}</div>
<div>Step Size: {StepSize}</div>
  </div>)
}

export default memo(ProjectInformationView);