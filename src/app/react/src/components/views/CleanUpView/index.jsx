import { memo, useState, useEffect } from 'react';
import Frame from '../../../containers/Frame';
import useNodesManager from '../../../hooks/useNodesManager';
import useSessionManager from '../../../hooks/useSessionManager';
import { API } from '../../../routes';
import useAppState from '../../../hooks/useAppState';
import useViewportsManager from '../../../hooks/useViewportsManager';
import Slider from '../../../additional-components/Slider';
import Button from '../../../additional-components/buttons/Button';
import { getData } from '../utils';

function CleanUpView({ children, ...rest }) {
  const [area, setArea] = useState(0);
  const [upperThreshold, setUpperThreshold] = useState(255);
  const [lowerThreshold, setLowerThreshold] = useState(0);
  const [windowSize, setWindowSize] = useState(1);
  const [quantize, setQuantize] = useState(0);
  const [disableThreshold, setDisableThreshold] = useState(false);
  const [disableQuantize, setDisableQuantize] = useState(false);
  const [disableAll, setDisableAll] = useState(false);
  const [disableChem, setDisableChem] = useState(false);
  const [disableEuler, setDisableEuler] = useState(false);

  const nodesManager = useNodesManager();
  const viewportManager = useViewportsManager();
  const { sessionName } = useSessionManager();
  const { loading, saving, startLoadRequest, endLoadRequest } = useAppState();

  const quantization = 2 ** quantize;

  useEffect(() => {
    if (loading || saving) {
      setDisableAll(true);
    } else {
      setDisableAll(false);
    }
  }, [loading, saving]);

  useEffect(() => {
    if (nodesManager.selectedNodes.length > 0) {
      // Safety: Unset disableAll in case it is currently set.
      // If this gets set again within this function, this will be overwritten.
      setDisableAll(false);
      const imageType = nodesManager.selectedNodes[0].data.image.type;
      if (imageType === 'Euler') {
        setDisableChem(true);
        setDisableEuler(false);
        setDisableQuantize(false);
      } else if (imageType === 'Band') {
        setDisableAll(true);

      } else if (imageType === 'Chemical') {
        setDisableEuler(true);
        setDisableChem(false);
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

  async function createChildImageNodeWithData(parentNode, data) {
    const newNode = await nodesManager.createDefaultImageNode({ ...data, parent: parentNode.data.file.prefix });
    nodesManager.addFilepathToNode(newNode, { path: parentNode.data.file.path, dir: parentNode.data.file.prefix });

    newNode.data.viewport = parentNode.data.viewport;
    if (!newNode.data.viewport) {
      const viewport = viewportManager.createAndAddViewport({
        label: newNode.data.label, options: { setActive: true },
      });
      newNode.data.viewport = viewport.id;
    }
    newNode.data.image.cached = true;
    newNode.selected = true;
    nodesManager.setNodes((prev) => [...prev.map((nd) => {
      if (nd.id === parentNode.id) {
        return {
          ...nd, selected: false, data: { ...nd.data, image: { ...nd.data.image, cached: false }, viewport: null },
        };
      }
      return nd;
    }), newNode]);
  }

  function submit(node, url) {
    startLoadRequest();
    setDisableAll(true);

    getData(url).then(async (data) => {
      console.log(data);
      await createChildImageNodeWithData(node, data);
      endLoadRequest();
      setDisableAll(false);
    }).catch((e) => {
      console.log(e);
      endLoadRequest();
      setDisableAll(false);
    });
  }

  const handleSubmissionQuantize = () => {
    const node = nodesManager.selectedNodes[0];
    const url = `${API.Sessions}/Quant_Euler?sessionName=${sessionName}&imageName=${node.data.file.name}&quant=${quantization}`;
    submit(node, url);
  };

  const handleSubmissionEulerAll = () => {
    const node = nodesManager.selectedNodes[0];
    const url = `${API.Sessions}/clean_Euler_img?sessionName=${sessionName}&imageName=${node.data.file.name}&area=${area}&quant=${quantization}`;
    submit(node, url);
  };

  const handleSubmission_OnlyThresh = () => {
    const node = nodesManager.selectedNodes[0];
    const url = `${API.Sessions}/clean_Chemical_img_OnlyThresh?sessionName=${sessionName}&imageName=${node.data.file.name}&upperThresh=${upperThreshold}&lowerThresh=${lowerThreshold}`;
    submit(node, url);
  };

  const handleBinary = () => {
    const node = nodesManager.selectedNodes[0];
    const url = `${API.Sessions}/ToBinary?sessionName=${sessionName}&imageName=${node.data.file.name}`;
    submit(node, url);
  };

  const handleSubmissionArea = () => {
    const node = nodesManager.selectedNodes[0];
    const fileName = node.data.file.name;
    const imageType = node.data.image.type;
    let url;
    if (imageType === 'Euler') {
      url = `${API.Sessions}/Reduce_Euler?sessionName=${sessionName}&imageName=${fileName}&area=${area}&type=${imageType}`;
    }
    if (imageType === 'Chemical') {
      url = `${API.Sessions}/ReduceArea?sessionName=${sessionName}&imageName=${fileName}&area=${area}&type=${imageType}`;
    }
    submit(node, url);
  };

  const HandleSubmissionNeighbor = () => {
    const node = nodesManager.selectedNodes[0];
    const fileName = node.data.file.name;
    const imageType = node.data.image.type;
    let url;
    if (imageType === 'Euler') {
      url = `${API.Sessions}/neighbor_Euler?sessionName=${sessionName}&imageName=${fileName}&window=${windowSize}`;
    }
    if (imageType === 'Chemical') {
      url = `${API.Sessions}/Neighbor_Chem?sessionName=${sessionName}&imageName=${fileName}&window=${windowSize}`;
    }
    submit(node, url);
  };

  const HandleSubmitAllChem = () => {
    const node = nodesManager.selectedNodes[0];
    const url = `${API.Sessions}/Clean_Chem_All?sessionName=${sessionName}&imageName=${node.data.file.name}&window=${windowSize}&area=${area}&upperThresh=${upperThreshold}&lowerThresh=${lowerThreshold}`;

    submit(node, url);
  };

  return (<Frame label={'Clean Up View'} bodyProps={{ style: { paddingBottom: '1px' } }}>
    <div style={{
      marginLeft: '-4px',
      marginTop: '-1px',
      marginRight: '-4px',
      padding: '2px 3px 8px 3px',
      fontSize: 'medium',
      border: '3px inset',
    }}>Choose to make changes step by step with the iterative option or instantly with "Apply All". The process for
      chemistry images involves applying a threshold followed by a maximum neighbor filter, and then converting to
      binary. For Euler images, the steps include quantization followed by applying a maximum neighbor filter.
    </div>

    <Frame label={'Chemical Images'}>
      <Frame label={'Thresholding'}>
        <Slider
          min={0}
          max={255}
          step={1}
          value={lowerThreshold}
          onChange={HandleLowerThresholdChange}
          disabled={disableThreshold || disableAll || disableChem}
          label={'Lower'}
        />
        <Slider
          min={0}
          max={255}
          step={1}
          value={upperThreshold}
          onChange={HandleUpperThresholdChange}
          disabled={disableThreshold || disableAll || disableChem}
          label={'Upper'}
        />
        <div style={{ paddingTop: '5px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            style={{ paddingRight: '5px' }}
            disabled={disableAll || disableThreshold || disableChem}
            onClick={handleSubmission_OnlyThresh}
            label={'Preview'}
          />
          <Button
            disabled={disableThreshold || disableAll || disableChem}
            label={'Apply'}
          />
        </div>
      </Frame>

      <Frame label={'Max Neighbor'}>
        <Slider
          min={1}
          max={25}
          disabled={disableAll || disableChem}
          onChange={HandleWindowChange}
          label={'Window Size'}
          value={windowSize}
          customValue={`${windowSize}x${windowSize}`}
          valueStyle={{ width: '40px' }}
          labelStyle={{ textWrap: 'nowrap' }}
        />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            disabled={disableAll || disableChem}
            onClick={HandleSubmissionNeighbor}
            label={'Preview'}
          />
          <Button
            disabled={disableAll || disableChem}
            label={'Apply'}
          />
        </div>
      </Frame>

      <Frame label={'Area Reduction'}>
        <Slider
          min={0}
          max={300}
          value={area}
          disabled={disableAll || disableChem}
          onChange={HandleAreaChange}
          label={'Minimum'}
        />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            disabled={disableAll || disableChem}
            onClick={handleSubmissionArea} label={'Preview'} />
          <Button
            disabled={disableAll || disableChem}
            label={'Apply'} />
        </div>
      </Frame>

      <Frame style={{ justifyContent: 'center' }}>
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '5px',
        }}>Convert to Binary
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button
              style={{ paddingTop: '5px' }}
              disabled={disableAll || disableChem}
              onClick={handleBinary}
              label={'Preview'}
            />
            <Button
              style={{ paddingTop: '5px' }}
              disabled={disableAll || disableChem}
              onClick={handleBinary}
              label={'Apply'}
            />
          </div>
        </div>
      </Frame>

      <Button
        disabled={disableAll || disableChem}
        onClick={HandleSubmitAllChem}
        label={'Apply All'}
      />
    </Frame>

    <Frame label={'Euler Images'} bodyProps={{ style: { paddingBottom: '1px' } }}>
      <Frame label={'Quantization'}>
        <div style={{
          display: 'flex', flexDirection: 'row',
        }}>
          <span style={{
            padding: '2px 5px',
          }}
          >2<sup>input</sup></span>
          <Slider
            min={0}
            max={8}
            value={quantize}
            onChange={HandleQuantizeChange}
            disabled={disableQuantize || disableAll || disableEuler}
            customValue={quantization}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button
            style={{ paddingTop: '5px' }}
            disabled={disableQuantize || disableAll || disableEuler}
            label={'Preview'}

            onClick={handleSubmissionQuantize}

          />
          <Button
            style={{ paddingTop: '5px' }}
            disabled={disableQuantize || disableAll || disableEuler}
            label={'Apply'}
          />
        </div>

        <Frame label={'Max Neighbor'}>
          <Slider
            min={1}
            max={25}
            disabled={disableAll || disableEuler}
            onChange={HandleWindowChange}
            label={'Window Size'}
            value={windowSize}
            customValue={`${windowSize}x${windowSize}`}
            valueStyle={{ width: '40px' }}
            labelStyle={{ textWrap: 'nowrap' }}
          />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button
              disabled={disableAll || disableEuler}
              onClick={HandleSubmissionNeighbor}
              label={'Preview'}
            />
            <Button
              disabled={disableAll || disableEuler}
              label={'Apply'}
            />
          </div>
        </Frame>

        <Frame label={'Area Reduction'}>
          <Slider
            min={0}
            max={300}
            value={area}
            disabled={disableQuantize || disableAll || disableEuler}
            onChange={HandleAreaChange}
            label={'Minimum'}
          />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button
              disabled={disableQuantize || disableAll || disableEuler}
              onClick={handleSubmissionArea} label={'Preview'}
            />
            <Button
              disabled={disableQuantize || disableAll || disableEuler}
              onClick={handleSubmissionQuantize}
              label={'Apply'}
            />
          </div>
        </Frame>
        <Button
          disabled={disableQuantize || disableAll || disableEuler}
          label={'Apply All'}
          onChange={handleSubmissionEulerAll}
        />
      </Frame>
    </Frame>
  </Frame>);
}

export default memo(CleanUpView);