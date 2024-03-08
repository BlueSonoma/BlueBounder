import { memo } from 'react';
import { useState, useEffect } from 'react';
import useSession from '../../../hooks/useSession';
import { HOST_URL } from '../../../index';
import Grid2Column from '../../../containers/Grid/Grid2Column';


function ProjectInformationView({ children, ...rest }) {
  const { sessionName, csvFilePath, setCsvFilePath, ctfFilePath, setCtfFilePath } = useSession();
  const [stepSize, setStepSize] = useState(10);


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

    console.log(`This is the session name in ProjectInfo: ${sessionName}`);
  }, [sessionName, csvFilePath, ctfFilePath]);


  const gridData = [{
    label: 'Project Name', content: sessionName,
  }, {
    label: 'CSV Filepath', content: csvFilePath,
  }, {
    label: 'CTF Filepath', content: ctfFilePath,
  }, {
    label: 'Step Size', content: stepSize,
  }];

  return (<div style={{ padding: '5px', border: '2px inset lightgray' }} {...rest}>
    <Grid2Column data={gridData} />
  </div>);
}

export default memo(ProjectInformationView);