import { memo } from 'react';
import { useState, useEffect } from 'react';
import useSession from '../../../hooks/useSession';
import { HOST_URL } from '../../../index';
import { Grid2Column } from '../../../containers/Grid';


function ProjectInformationView({ children, ...rest }) {
  const [projectName, setProjectName] = useState('');
  const [ctfFilePath, setCtfFilePath] = useState('');
  const [stepSize, setStepSize] = useState(10);
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

  const gridData = [{
    label: 'Project Name', content: projectName,
  }, {
    label: 'CSV Filepath', content: csvFilePath,
  }, {
    label: 'CTF Filepath', content: ctfFilePath,
  }, {
    label: 'Step Size', content: stepSize,
  }];

  return (<div style={{ padding: '5px', border: '2px inset lightgray' }}>
    <Grid2Column data={gridData} />
  </div>);
}

export default memo(ProjectInformationView);