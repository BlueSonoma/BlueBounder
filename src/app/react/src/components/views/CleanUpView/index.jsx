import { memo, useState } from 'react';
import Frame from '../../../containers/Frame';

function CleanUpView({ children, ...rest }) {
  const [Area, setArea] = useState(0);
  const [Threshold, setThreshold] = useState(0);
  const [quantize, setQuantize] = useState(0);
  const [disableThreshold, setDisableThreshold] = useState(false);
  const [disableQuantize, setDisableQuantize] = useState(false);

  const HandleAreaChange = (event) => {
    setArea(event.target.value);
  };

  const HandleThresholdChange = (event) => {
    setThreshold(event.target.value);
  };

  const HandleQuantizeChange = (event) => {
    setQuantize(event.target.value);
  };

  return (<Frame label={'Clean Up View'}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <input type='range' min='0' max='1' step='.01' value={Threshold} onChange={HandleThresholdChange}
             disabled={disableThreshold} />
      <p style={{ paddingBottom: '20px' }}>Threshold: {Threshold}</p>
      <input type='range' min='0' max='8' value={quantize} onChange={HandleQuantizeChange} disabled={disableQuantize} />
      <p style={{ paddingBottom: '20px' }}>Quantization 2^input: {quantize}</p>
      <input type='range' min='0' max='300' value={Area} onChange={HandleAreaChange} />
      <p>Reduce Area Under: {Area}</p>
    </div>
  </Frame>);
}

export default memo(CleanUpView);