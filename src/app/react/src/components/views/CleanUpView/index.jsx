import { memo, useState, useEffect } from 'react';
import Frame from '../../../containers/Frame';
import useNodesManager from '../../../hooks/useNodesManager';
import useSessionManager from '../../../hooks/useSessionManager';
import { API } from '../../../routes';

function CleanUpView({ children, ...rest }) {
  const [Area, setArea] = useState(0);
  const [Threshold, setThreshold] = useState(0);
  const [quantize, setQuantize] = useState(0);
  const [disableThreshold, setDisableThreshold] = useState(false);
  const [disableQuantize, setDisableQuantize] = useState(false);
  const { selectedNodes } = useNodesManager();
  const { sessionName } = useSessionManager();
  const Quantization = 2 ** quantize;

  // console.log('Session Name: ', sessionName);
  console.log('Selected Nodes: ', selectedNodes);
  useEffect(() => {
    if (selectedNodes.length === 1) {
      const imageType = selectedNodes[0].data.image.type;
      if (imageType === 'Euler') {
        setDisableThreshold(true);
        setDisableQuantize(false);
      } else if (imageType === 'Band') {
        setDisableThreshold(true);
        setDisableQuantize(true);
      } else if (imageType === 'Chemical') {
        setDisableQuantize(true);
        setDisableThreshold(false);
      } else {
        // Throw error message for undefined type or unrecognized type
      }
    }
  }, [selectedNodes]);


  console.log('Selected Nodes image type: ', selectedNodes[0].data.image.type);

  const HandleAreaChange = (event) => {
    setArea(event.target.value);
  };

  const HandleThresholdChange = (event) => {
    setThreshold(event.target.value);
  };

  const HandleQuantizeChange = (event) => {
    setQuantize(event.target.value);
  };

  const handleSubmission = () => {
    const imageName = selectedNodes[0].data.file.name;
    if (selectedNodes[0].data.image.type === 'Euler') {//image selected is Euler execute corresponding code

      // console.log('Image Name: ', imageName)

      fetch(`${API.Sessions}/clean_Euler_img?sessionName=${sessionName}&imageName=${imageName}&area=${Area}&quant=${Quantization}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
          console.error('Error:', error);
        });

    } else if (selectedNodes[0].data.image.type === 'Band') {//image selected is Band execute corresponding code

    } else if (selectedNodes[0].data.image.type === 'Chemical') {//image selected is Chemical execute corresponding code
      fetch(`${API.Sessions}/clean_Chemical_img?sessionName=${sessionName}&imageName=${imageName}&area=${Area}&thresh=${Threshold}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
          console.error('Error:', error);
        });

    } else {
      //throw error message for undefined type or unrecognized type
    }
  };


  return (<Frame label={'Clean Up View'}>

    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <input type='range' min='0' max='1' step='.01' value={Threshold} onChange={HandleThresholdChange}
             disabled={disableThreshold} />
      <p style={{ paddingBottom: '20px' }}>Threshold: {Threshold}</p>
      <input type='range' min='0' max='8' value={quantize} onChange={HandleQuantizeChange} disabled={disableQuantize} />
      <p style={{ paddingBottom: '20px' }}>Quantization 2^input: {Quantization}</p>
      <input type='range' min='0' max='300' value={Area} onChange={HandleAreaChange} />
      <p>Reduce Area Under: {Area}</p>

      <button onClick={handleSubmission}>Apply</button>
    </div>
  </Frame>);
}

export default memo(CleanUpView);