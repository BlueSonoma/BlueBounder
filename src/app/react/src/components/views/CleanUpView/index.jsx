import { memo, useState, useEffect } from 'react';
import Frame from '../../../containers/Frame';
import useNodesManager from '../../../hooks/useNodesManager';
import useSessionManager from '../../../hooks/useSessionManager';
import { API } from '../../../routes';
import useAppState from '../../../hooks/useAppState';
import useViewportsManager from '../../../hooks/useViewportsManager';

function CleanUpView({ children, ...rest }) {
  const [Area, setArea] = useState(0);
  const [upperThreshold, setUpperThreshold] = useState(255);
  const [lowerThreshold, setLowerThreshold] = useState(0);
  const [windowSize, setWindowSize] = useState(1);
  const [quantize, setQuantize] = useState(0);
  const [disableThreshold, setDisableThreshold] = useState(false);
  const [disableQuantize, setDisableQuantize] = useState(false);
  const [disableAll, setDisableAll] = useState(false);

  const nodesManager = useNodesManager();
  const viewportManager = useViewportsManager();
  const { sessionName } = useSessionManager();
  const { startLoadRequest, endLoadRequest } = useAppState();

  const Quantization = 2 ** quantize;

  useEffect(() => {
    if (nodesManager.selectedNodes.length > 0) {
      // Safety: Unset disableAll in case it is currently set.
      // If this gets set again within this function, this will be overwritten.
      setDisableAll(false);
      const imageType = nodesManager.selectedNodes[0].data.image.type;
      if (imageType === 'Euler') {
        setDisableThreshold(true);
        setDisableQuantize(false);
      } else if (imageType === 'Band') {
        setDisableAll(true);

      } else if (imageType === 'Chemical') {
        setDisableQuantize(true);
        setDisableThreshold(false);
      } else {
        // Throw error message for undefined type or unrecognized type
      }
    }
  }, [nodesManager.selectedNodes]);

  const HandleAreaChange = (event) => {
    setArea(event.target.value);
  };

  const HandleWindowChange = (event) => {
    setWindowSize(event.target.value);
  };

  const HandleUpperThresholdChange = (event) => {
    setUpperThreshold(event.target.value);
  };
  const HandleLowerThresholdChange = (event) => {
    setLowerThreshold(event.target.value);
  };

  const HandleQuantizeChange = (event) => {
    setQuantize(event.target.value);
  };

  const handleSubmission = () => {
    async function handleImageEditAndGetData(node) {
      async function fetchAndGetFilepath(fileName, imageType) {
        let url;
        if (imageType === 'Euler') {
          url = `${API.Sessions}/clean_Euler_img?sessionName=${sessionName}&imageName=${fileName}&area=${Area}&quant=${Quantization}`;
        } else if (imageType === 'Chemical') {
          url = `${API.Sessions}/clean_Chemical_img?sessionName=${sessionName}&imageName=${fileName}&area=${Area}&Uppthresh=${upperThreshold}&Lowthresh=${lowerThreshold}`;
        } else if (imageType === 'Band') {//image selected is Band execute corresponding code
        } else {
          throw new Error(`Error: Unknown image type "${imageType}"`);
        }

        return await fetch(url, {
          method: 'GET',
        })
          .then(response => response.json())
          .then(data => data[0])
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      let filename = node.data.file.name;
      const imageType = node.data.image.type;
      return await fetchAndGetFilepath(filename, imageType);
    }

    startLoadRequest();
    setDisableAll(true);

    const node = nodesManager.selectedNodes[0];
    handleImageEditAndGetData(node).then(async (data) => {
      console.log(data);
      const newNode = await nodesManager.createDefaultImageNode({ ...data, parent: node.data.file.prefix });
      nodesManager.addFilepathToNode(newNode, { path: node.data.file.path, dir: node.data.file.prefix });

      newNode.data.viewport = node.data.viewport;
      if (!newNode.data.viewport) {
        const viewport = viewportManager.createAndAddViewport({
          label: newNode.data.label, options: { setActive: true },
        });
        newNode.data.viewport = viewport.id;
      }
      newNode.data.image.cached = true;
      newNode.selected = true;
      nodesManager.setNodes((prev) => [...prev.map((nd) => {
        if (nd.id === node.id) {
          return {
            ...nd, selected: false, data: { ...nd.data, image: { ...nd.data.image, cached: false }, viewport: null },
          };
        }
        return nd;
      }), newNode]);

      endLoadRequest();
      setDisableAll(false);
    }).catch((e) => {
      console.log(e);
      endLoadRequest();
      setDisableAll(false);
    });
  };

  const handleSubmission_OnlyThresh = () => {
    async function handleImageEditAndGetData(node) {
      async function fetchAndGetFilepath(fileName, imageType) {
        let url;
        if (imageType === 'Euler') {
          
        } else if (imageType === 'Chemical') {
          url = `${API.Sessions}/clean_Chemical_img_OnlyThresh?sessionName=${sessionName}&imageName=${fileName}&Uppthresh=${upperThreshold}&Lowthresh=${lowerThreshold}`;
        } else if (imageType === 'Band') {//image selected is Band execute corresponding code
        } else {
          throw new Error(`Error: Unknown image type "${imageType}"`);
        }

        return await fetch(url, {
          method: 'GET',
        })
          .then(response => response.json())
          .then(data => data[0])
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      let filename = node.data.file.name;
      const imageType = node.data.image.type;
      return await fetchAndGetFilepath(filename, imageType);
    }

    startLoadRequest();
    setDisableAll(true);

    const node = nodesManager.selectedNodes[0];
    handleImageEditAndGetData(node).then(async (data) => {
      console.log(data);
      const newNode = await nodesManager.createDefaultImageNode({ ...data, parent: node.data.file.prefix });
      nodesManager.addFilepathToNode(newNode, { path: node.data.file.path, dir: node.data.file.prefix });

      newNode.data.viewport = node.data.viewport;
      if (!newNode.data.viewport) {
        const viewport = viewportManager.createAndAddViewport({
          label: newNode.data.label, options: { setActive: true },
        });
        newNode.data.viewport = viewport.id;
      }
      newNode.data.image.cached = true;
      newNode.selected = true;
      nodesManager.setNodes((prev) => [...prev.map((nd) => {
        if (nd.id === node.id) {
          return {
            ...nd, selected: false, data: { ...nd.data, image: { ...nd.data.image, cached: false }, viewport: null },
          };
        }
        return nd;
      }), newNode]);

      endLoadRequest();
      setDisableAll(false);
    }).catch((e) => {
      console.log(e);
      endLoadRequest();
      setDisableAll(false);
    });
  };

  const handleBinary = () => {
    async function handleImageEditAndGetData(node) {
      async function fetchAndGetFilepath(fileName, imageType) {
        let url;
        if (imageType === 'Euler') {
          
        } else if (imageType === 'Chemical') {
          url = `${API.Sessions}/ToBinary?sessionName=${sessionName}&imageName=${fileName}`;
        } else if (imageType === 'Band') {//image selected is Band execute corresponding code
        } else {
          throw new Error(`Error: Unknown image type "${imageType}"`);
        }

        return await fetch(url, {
          method: 'GET',
        })
          .then(response => response.json())
          .then(data => data[0])
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      let filename = node.data.file.name;
      const imageType = node.data.image.type;
      return await fetchAndGetFilepath(filename, imageType);
    }

    startLoadRequest();
    setDisableAll(true);

    const node = nodesManager.selectedNodes[0];
    handleImageEditAndGetData(node).then(async (data) => {
      console.log(data);
      const newNode = await nodesManager.createDefaultImageNode({ ...data, parent: node.data.file.prefix });
      nodesManager.addFilepathToNode(newNode, { path: node.data.file.path, dir: node.data.file.prefix });

      newNode.data.viewport = node.data.viewport;
      if (!newNode.data.viewport) {
        const viewport = viewportManager.createAndAddViewport({
          label: newNode.data.label, options: { setActive: true },
        });
        newNode.data.viewport = viewport.id;
      }
      newNode.data.image.cached = true;
      newNode.selected = true;
      nodesManager.setNodes((prev) => [...prev.map((nd) => {
        if (nd.id === node.id) {
          return {
            ...nd, selected: false, data: { ...nd.data, image: { ...nd.data.image, cached: false }, viewport: null },
          };
        }
        return nd;
      }), newNode]);

      endLoadRequest();
      setDisableAll(false);
    }).catch((e) => {
      console.log(e);
      endLoadRequest();
      setDisableAll(false);
    });
  };

  const handleSubmissionArea = () => { 
    async function handleImageEditAndGetData(node) {
      async function fetchAndGetFilepath(fileName, imageType) {
        let url;
        if (imageType === 'Euler') {
          
        } else if (imageType === 'Chemical') {
          url = `${API.Sessions}/ReduceArea?sessionName=${sessionName}&imageName=${fileName}&area=${Area}`;
        } else if (imageType === 'Band') {//image selected is Band execute corresponding code
        } else {
          throw new Error(`Error: Unknown image type "${imageType}"`);
        }

        return await fetch(url, {
          method: 'GET',
        })
          .then(response => response.json())
          .then(data => data[0])
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      let filename = node.data.file.name;
      const imageType = node.data.image.type;
      return await fetchAndGetFilepath(filename, imageType);
    }

    startLoadRequest();
    setDisableAll(true);

    const node = nodesManager.selectedNodes[0];
    handleImageEditAndGetData(node).then(async (data) => {
      console.log(data);
      const newNode = await nodesManager.createDefaultImageNode({ ...data, parent: node.data.file.prefix });
      nodesManager.addFilepathToNode(newNode, { path: node.data.file.path, dir: node.data.file.prefix });

      newNode.data.viewport = node.data.viewport;
      if (!newNode.data.viewport) {
        const viewport = viewportManager.createAndAddViewport({
          label: newNode.data.label, options: { setActive: true },
        });
        newNode.data.viewport = viewport.id;
      }
      newNode.data.image.cached = true;
      newNode.selected = true;
      nodesManager.setNodes((prev) => [...prev.map((nd) => {
        if (nd.id === node.id) {
          return {
            ...nd, selected: false, data: { ...nd.data, image: { ...nd.data.image, cached: false }, viewport: null },
          };
        }
        return nd;
      }), newNode]);

      endLoadRequest();
      setDisableAll(false);
    }).catch((e) => {
      console.log(e);
      endLoadRequest();
      setDisableAll(false);
    });
  };

  const HandleSubmissionNeighbor= () => { 
    async function handleImageEditAndGetData(node) {
      async function fetchAndGetFilepath(fileName, imageType) {
        let url;
        if (imageType === 'Euler') {
          
        } else if (imageType === 'Chemical') {
          url = `${API.Sessions}/Neighbor_Chem?sessionName=${sessionName}&imageName=${fileName}&window=${windowSize}`;
        } else if (imageType === 'Band') {//image selected is Band execute corresponding code
        } else {
          throw new Error(`Error: Unknown image type "${imageType}"`);
        }

        return await fetch(url, {
          method: 'GET',
        })
          .then(response => response.json())
          .then(data => data[0])
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      let filename = node.data.file.name;
      const imageType = node.data.image.type;
      return await fetchAndGetFilepath(filename, imageType);
    }

    startLoadRequest();
    setDisableAll(true);

    const node = nodesManager.selectedNodes[0];
    handleImageEditAndGetData(node).then(async (data) => {
      console.log(data);
      const newNode = await nodesManager.createDefaultImageNode({ ...data, parent: node.data.file.prefix });
      nodesManager.addFilepathToNode(newNode, { path: node.data.file.path, dir: node.data.file.prefix });

      newNode.data.viewport = node.data.viewport;
      if (!newNode.data.viewport) {
        const viewport = viewportManager.createAndAddViewport({
          label: newNode.data.label, options: { setActive: true },
        });
        newNode.data.viewport = viewport.id;
      }
      newNode.data.image.cached = true;
      newNode.selected = true;
      nodesManager.setNodes((prev) => [...prev.map((nd) => {
        if (nd.id === node.id) {
          return {
            ...nd, selected: false, data: { ...nd.data, image: { ...nd.data.image, cached: false }, viewport: null },
          };
        }
        return nd;
      }), newNode]);

      endLoadRequest();
      setDisableAll(false);
    }).catch((e) => {
      console.log(e);
      endLoadRequest();
      setDisableAll(false);
    });
  };

  const HandleSubmitAllChem = () => {
    async function handleImageEditAndGetData(node) {
      async function fetchAndGetFilepath(fileName, imageType) {
        let url;
        if (imageType === 'Euler') {
          
        } else if (imageType === 'Chemical') {
          url = `${API.Sessions}/Clean_Chem_All?sessionName=${sessionName}&imageName=${fileName}&window=${windowSize}&window=${windowSize}&area=${Area}&Uppthresh=${upperThreshold}&Lowthresh=${lowerThreshold}`;
        } else if (imageType === 'Band') {//image selected is Band execute corresponding code
        } else {
          throw new Error(`Error: Unknown image type "${imageType}"`);
        }

        return await fetch(url, {
          method: 'GET',
        })
          .then(response => response.json())
          .then(data => data[0])
          .catch((error) => {
            console.error('Error:', error);
          });
      }

      let filename = node.data.file.name;
      const imageType = node.data.image.type;
      return await fetchAndGetFilepath(filename, imageType);
    }

    startLoadRequest();
    setDisableAll(true);

    const node = nodesManager.selectedNodes[0];
    handleImageEditAndGetData(node).then(async (data) => {
      console.log(data);
      const newNode = await nodesManager.createDefaultImageNode({ ...data, parent: node.data.file.prefix });
      nodesManager.addFilepathToNode(newNode, { path: node.data.file.path, dir: node.data.file.prefix });

      newNode.data.viewport = node.data.viewport;
      if (!newNode.data.viewport) {
        const viewport = viewportManager.createAndAddViewport({
          label: newNode.data.label, options: { setActive: true },
        });
        newNode.data.viewport = viewport.id;
      }
      newNode.data.image.cached = true;
      newNode.selected = true;
      nodesManager.setNodes((prev) => [...prev.map((nd) => {
        if (nd.id === node.id) {
          return {
            ...nd, selected: false, data: { ...nd.data, image: { ...nd.data.image, cached: false }, viewport: null },
          };
        }
        return nd;
      }), newNode]);

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
    <p> The following could either be done in steps iteratively or all in one go. Chemistery images should be 
    Thresholded then applied a max neighbor. Then converted to Binary. Euler images should be quanatized then max neighbored.</p>
      <p style={{fontWeight: 'bold'}}><br /> Chemistery Images </p>

      <input type='range' min='0' max='255' step='1' value={upperThreshold} onChange={HandleUpperThresholdChange}
             disabled={disableThreshold || disableAll} />
      <p style={{ paddingBottom: '20px' }}>Upper Threshold: {upperThreshold}</p>

      <input type='range' min='0' max='255' step='1' value={lowerThreshold} onChange={HandleLowerThresholdChange}
             disabled={disableThreshold || disableAll} />
      <p style={{ paddingBottom: '20px' }}>Lower Threshold: {lowerThreshold}</p>

      <div style ={{display: 'flex', flexDirection: 'row'}}>
      <button style ={{paddingRight:'5px'}} disabled={disableAll || disableThreshold} onClick={handleSubmission_OnlyThresh}>Preview Thresh</button>
      <button disabled={disableAll || disableThreshold} >Apply Threshold</button>
      </div>

      <br />
      <input type='range' min='0' max='25'  disabled={disableAll|| disableThreshold} value={windowSize}  onChange={HandleWindowChange}/>
      <p>WindowSize: {windowSize}X{windowSize}</p>

      <div style ={{display: 'flex', flexDirection: 'row'}}>
      <button style ={{paddingRight:'5px'}} disabled={disableAll|| disableThreshold} onClick={HandleSubmissionNeighbor}>Preview Max Neighbor</button>
      <button disabled={disableAll|| disableThreshold} >Apply Max Neighbor</button>
      </div>

      <br />
      <input type='range' min='0' max='300' value={Area} disabled={disableAll|| disableThreshold} onChange={HandleAreaChange} />
      <p>Reduce Area Under: {Area}</p>

      <div style ={{display: 'flex', flexDirection: 'row'}}>
      <button disabled={disableAll} onClick={handleSubmissionArea}>Preview Reduce Areas</button>
      <button disabled={disableAll} >Apply Reduce Areas</button>
      </div>


      <br />

      <div style ={{display: 'flex', flexDirection: 'row'}}>
      <button style={{paddingTop:'5px'}}disabled={disableAll} onClick={handleBinary}> To binary</button>
      <button style={{paddingTop:'5px'}}disabled={disableAll} onClick={handleBinary}> Apply binary</button>
      </div>
      
      <button disabled={disableAll} onClick={HandleSubmitAllChem}>Apply All</button>




      <p style={{fontWeight: 'bold'}}><br /> Euler Images </p>
      <input type='range' min='0' max='8' value={quantize} onChange={HandleQuantizeChange}
             disabled={disableQuantize || disableAll} />
      <p style={{ paddingBottom: '20px' }}>Quantization = 2^input: {Quantization}</p>
      <button disabled={disableAll|| disableQuantize} >Quanatize</button>
      <input type='range' min='0' max='300' value={Area} disabled={disableAll|| disableQuantize} onChange={HandleAreaChange} />
      <p>Reduce Area Under: {Area}</p>
      
      <button disabled={disableAll|| disableQuantize} onClick={handleSubmissionArea}>Reduce Areas</button>

      
      <button disabled={disableAll}>Only Quant</button>
      
     

    </div>
  </Frame>);
}

export default memo(CleanUpView);