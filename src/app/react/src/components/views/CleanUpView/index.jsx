import { memo, useState, useEffect } from 'react';
import Frame from '../../../containers/Frame';
import useNodesManager from '../../../hooks/useNodesManager';
import useSessionManager from '../../../hooks/useSessionManager';
import { API } from '../../../routes';
import useAppState from '../../../hooks/useAppState';

function CleanUpView({ children, ...rest }) {
  const [Area, setArea] = useState(0);
  const [Threshold, setThreshold] = useState(0);
  const [quantize, setQuantize] = useState(0);
  const [disableThreshold, setDisableThreshold] = useState(false);
  const [disableQuantize, setDisableQuantize] = useState(false);
  const [disableAll, setDisableAll] = useState(false);

  const { selectedNodes, addFilepathToNode } = useNodesManager();
  const { sessionName } = useSessionManager();
  const { startLoadRequest, endLoadRequest } = useAppState();

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
    async function handleImageEditAndGetFilepath(node) {
      async function fetchAndGetFilepath(fileName, imageType) {
        let url;
        if (imageType === 'Euler') {
          url = `${API.Sessions}/clean_Euler_img?sessionName=${sessionName}&imageName=${fileName}&area=${Area}&quant=${Quantization}`;
        } else if (imageType === 'Chemical') {
          url = `${API.Sessions}/clean_Chemical_img?sessionName=${sessionName}&imageName=${fileName}&area=${Area}&thresh=${Threshold}`;
        } else if (imageType === 'Band') {//image selected is Band execute corresponding code
        } else {
          throw new Error(`Error: Unknown image type "${imageType}"`);
        }

        return await fetch(url, {
          method: 'GET',
        })
          .then(response => response.json())
          .then(data => data[0].path)
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      const filename = node.data.file.name;
      const imageType = node.data.image.type;
      return await fetchAndGetFilepath(filename, imageType);
    }

    startLoadRequest();
    setDisableAll(true);

    const node = selectedNodes[0];
    handleImageEditAndGetFilepath(node).then(async (filepath) => {
      console.log(filepath);
      const label = node.data.label;
      addFilepathToNode(node, filepath);
      node.data.label = label;
      await node.data.reload();
      endLoadRequest();
      setDisableAll(false);
    }).catch((e) => {
      console.log(e);
      endLoadRequest();
      setDisableAll(false);
    });
  };


  return (<Frame label={'Clean Up View'}>

    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <input type='range' min='0' max='1' step='.01' value={Threshold} onChange={HandleThresholdChange}
             disabled={disableThreshold || disableAll} />
      <p style={{ paddingBottom: '20px' }}>Threshold: {Threshold}</p>
      <input type='range' min='0' max='8' value={quantize} onChange={HandleQuantizeChange}
             disabled={disableQuantize || disableAll} />
      <p style={{ paddingBottom: '20px' }}>Quantization 2^input: {Quantization}</p>
      <input type='range' min='0' max='300' value={Area} disabled={disableAll} onChange={HandleAreaChange} />
      <p>Reduce Area Under: {Area}</p>

      <button disabled={disableAll} onClick={handleSubmission}>Apply</button>
    </div>
  </Frame>);
}

export default memo(CleanUpView);