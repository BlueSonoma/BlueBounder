import { memo } from 'react';
import { useState, useEffect } from 'react';
import useSessionManager from '../../../hooks/useSessionManager';
import Grid2Column from '../../../containers/Grid/Grid2Column';
import { API } from '../../../routes';
import Frame from '../../../containers/Frame';


function ProjectInformationView({ children, ...rest }) {
  const { sessionName, csvFilePath, setCsvFilePath, ctfFilePath, setCtfFilePath } = useSessionManager();
  const [stepSize, setStepSize] = useState(10);


  useEffect(() => {
    if (sessionName) {
      fetch(`${API.Sessions}/get_session_Info?sessionName=${sessionName}`, {
        method: 'GET',
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

  return (<Frame label={'Information'} {...rest}>
    <Grid2Column data={gridData} />
  </Frame>);
}

export default memo(ProjectInformationView);