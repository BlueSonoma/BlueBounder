import { memo } from 'react';
import { useState, useEffect } from 'react';
import useSession from '../../../hooks/useSession';
import { HOST_URL } from '../../../index';


function ProjectInformationView({ children, ...rest }) {
  const [projectName, setProjectName] = useState('');
  const [CTFFilePath, setCtfFilePath] = useState('');
  const [StepSize, setStepSize] = useState(10);
  const { sessionName, csvFilePath, setCsvFilePath } = useSession();


  useEffect(() => {
    if (sessionName) {
      const formData = new FormData();
      formData.append('sessionName', sessionName);

      fetch(`${HOST_URL}/api/sessions/get_session_Info`, {
        method: 'POST', body: formData,
      })
        .then(response => response.json())
        .then(([data, status]) => {
          if (status === 200) {
            console.log(data);
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

  return (<div style={{ padding: '5px', border: '2px inset lightgray' }}>

    <div>Project Name: {projectName.substring(0, 20)}</div>
    <div>CSV-File-path: {csvFilePath.substring(0, 20)}</div>
    <div>CTF-File-path: {CTFFilePath.substring(0, 20)}</div>
    <div>Step Size: {StepSize}</div>
  </div>);
}

export default memo(ProjectInformationView);