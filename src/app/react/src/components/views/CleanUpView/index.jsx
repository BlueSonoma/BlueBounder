import { memo,useState } from 'react';
import useSessionManager from '../../../hooks/useSessionManager';
import Routes, { API } from '../../../routes';


function CleanUpView({ children, ...rest }) {
  const [Area, setArea] = useState(0);
  const [Threshold, setThreshold] = useState(0);
  const [Quanitize, setQuanitize] = useState(0);
  const [disableThreshold, setDisableThreshold] = useState(false);
  const [disableQuanitize, setDisableQuanitize] = useState(false);

  const HandleAreaChange = (event) => {
    setArea(event.target.value);
  }

  const HandleThresholdChange = (event) => {
    setThreshold(event.target.value);
  }

  const HandleQuanitizeChange = (event) => {
    setQuanitize(event.target.value);
  }



  return (<div style={{display: 'flex', flexDirection: 'column' }}>
      <input  type='range' min='0' max='1' step='.01' value={Threshold} onChange= {HandleThresholdChange} disabled={disableThreshold}/>
      <p style={{ paddingBottom:'20px'}}>Threshold: {Threshold}</p>
      <input type='range' min='0' max='8' value={Quanitize} onChange={HandleQuanitizeChange} disabled={disableQuanitize}/>
      <p style={{ paddingBottom:'20px'}}>Quanitization 2^input: {Quanitize}</p>
      <input type='range' min='0' max='300' value={Area} onChange={HandleAreaChange}/>
      <p>Reduce Area Under: {Area}</p>
    </div>);
}

export default memo(CleanUpView);