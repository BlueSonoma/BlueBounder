import { useEffect, useState } from 'react';
import useSessionManager from '../../../hooks/useSessionManager';
import Button from '../../../additional-components/buttons/Button';
import useAppState from '../../../hooks/useAppState';
import { API } from '../../../routes';
import Frame from '../../../containers/Frame';
import { Colors } from '../../../types';
import { initialState } from './initialState';
import Slider from '../../../additional-components/Slider';
import ImageUploadForm from '../../../additional-components/forms/ImageUploadForm';
import Grid2Column from '../../../containers/Grid/Grid2Column';
import UploadForm from '../../../additional-components/forms/UploadForm';
import DirectoryPicker from '../../../additional-components/forms/DirectoryPicker';

/** Segmentation Configuration Options
 'in_images'
 'scale'
 'sigma'
 'min_size'
 'outline_color'
 'label'
 'label_uniform'
 'overlay'
 'overlay_image'
 'label_color'
 'label_opacity'
 'update_callback'
 **/


const colorSelections = Object.keys(Colors)
  .map((color) => {
    return {
      value: Colors[color], label: color,
    };
  });

function SegmentationView({ children, ...rest }) {
  const appState = useAppState();
  const { setNodes } = useSessionManager();
  const [disabled, setDisabled] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);

  const [chemImagePath, setImagePath] = useState(initialState.chemImagePath);
  const [scale, setScale] = useState(initialState.scale);
  const [sigma, setSigma] = useState(initialState.sigma);
  const [minSize, setMinSize] = useState(initialState.minSize);
  const [outlineColor, setOutlineColor] = useState(initialState.outlineColor);
  const [label, setLabel] = useState(initialState.label);
  const [uniformLabel, setUniformLabel] = useState(initialState.uniformLabel);
  const [overlay, setOverlay] = useState(initialState.overlay);
  const [bandImagePath, setBandImagePath] = useState(initialState.bandImagePath);
  const [labelColor, setLabelColor] = useState(initialState.labelColor);
  const [labelOpacity, setLabelOpacity] = useState(initialState.labelOpacity);
  const [outputPath, setOutputPath] = useState(initialState.outputPath);
  const [outputFilename, setOutputFilename] = useState(initialState.outputFilename);

  function resetDefaults() {
    setImagePath(initialState.chemImagePath);
    setScale(initialState.scale);
    setSigma(initialState.sigma);
    setMinSize(initialState.minSize);
    setOutlineColor(initialState.outlineColor);
    setLabel(initialState.label);
    setUniformLabel(initialState.uniformLabel);
    setOverlay(initialState.overlay);
    setBandImagePath(initialState.bandImagePath);
    setLabelColor(initialState.labelColor);
    setLabelOpacity(initialState.labelOpacity);
    setOutputPath(initialState.outputPath);
    setOutputFilename(initialState.outputFilename);
  }

  useEffect(() => {
    setDisableSubmitButton(() => {
      return disabled || chemImagePath.length === 0 || bandImagePath.length === 0 || outputPath.length === 0 || outputFilename.length === 0;
    });
  }, [disableSubmitButton, chemImagePath, bandImagePath, outputPath, outputFilename, disabled]);

  function applyChanges() {
    async function applyChangesAsync() {
      const formData = new FormData();
      formData.append('chemImagePath', chemImagePath);
      formData.append('scale', scale);
      formData.append('sigma', sigma);
      formData.append('minSize', minSize);
      formData.append('outlineColor', outlineColor);
      formData.append('label', label);
      formData.append('uniformLabel', uniformLabel);
      formData.append('overlay', overlay);
      formData.append('bandImagePath', bandImagePath);
      formData.append('labelColor', labelColor);
      formData.append('labelOpacity', labelOpacity);
      formData.append('outputPath', outputPath);
      formData.append('outputFilename', outputFilename);

      console.log(`Executing boundary segmentation...`);

      const filepath = await fetch(`${API.Imaging}/exec_segmentation`, { method: 'POST', body: formData })
        .then((response) => response.json())
        .then((data) => data[0])
        .catch((e) => {
          console.log('Error fetching `exec_segmentation`', e);
        });

      if (filepath) {
        console.log(filepath);
      }
    }

    appState.startSaveRequest();
    setDisabled(true);
    applyChangesAsync().then(() => {
      appState.endSaveRequest();
      setDisabled(false);
      console.log(`Boundary segmentation completed`);
    });
  }

  function onChemistryImageChangeHandler(event, path) {
    setImagePath(path);
  }

  function onScaleChangeHandler(event) {
    setScale(event.target.value);
  }

  function onSigmaChangeHandler(event) {
    setSigma(event.target.value);
  }

  function onMinSizeChangeHandler(event) {
    setMinSize(event.target.value);
  }

  function onLabelOpacityChangeHandler(event) {
    setLabelOpacity(event.target.value);
  }

  function onOutlineColorChangeHandler(event) {
    setOutlineColor(event.target.value);
  }

  function onLabelColorChangeHandler(event) {
    setLabelColor(event.target.value);
  }

  function onLabelChangeHandler(event) {
    setLabel(event.target.checked);
  }

  function onUniformLabelsChangeHandler(event) {
    setUniformLabel(event.target.checked);
  }

  function onOverlayChangeHandler(event) {
    setOverlay(event.target.checked);
  }

  function onBandImageChangeHandler(event, path) {
    setBandImagePath(path);
  }

  function onSaveLocationChangeHandler(event, path) {
    console.log(`Save path: ${path}`);
    setOutputPath(path);
  }

  function onFilenameChangeHandler(event) {
    setOutputFilename(event.target.value);
  }

  return (<div style={{ paddingLeft: '2px', paddingRight: '2px' }}>
    <Frame label={'Segmentation'}>
      <Grid2Column data={[{
        label: 'Filename',
      }, {
        content: <input
          disabled={disabled}
          style={{ padding: '5px', width: '240px' }}
          type={'text'} value={outputFilename}
          onChange={onFilenameChangeHandler} />,
      }, {
        label: 'Save Directory',
      }, {
        content: <DirectoryPicker
          textFormStyle={{ width: '245px' }}
          disabled={disabled}
          value={outputPath}
          onChange={onSaveLocationChangeHandler}
        />,
      }, {
        label: 'Band Contrast Image',
      }, {
        content: <ImageUploadForm
          disabled={disabled}
          textFormStyle={{ left: '5px', right: '5px', width: '320px' }}
          browseButtonProps={{ marginTop: '5px' }}
          onChange={onBandImageChangeHandler}
        />,
      }, {
        label: 'Chemistry Mask Image',
      }, {
        content: <ImageUploadForm
          disabled={disabled}
          textFormStyle={{ left: '5px', right: '5px', width: '320px' }}
          browseButtonProps={{ marginTop: '5px' }}
          onChange={onChemistryImageChangeHandler} />,
      }, {
        label: 'Scale',
      }, {
        content: <Slider
          disabled={disabled}
          min={0}
          max={300}
          value={scale}
          onChange={onScaleChangeHandler}
        />,
      }, {
        label: 'Sigma',
      }, {
        content: <Slider
          disabled={disabled}
          min={0}
          max={1}
          step={0.1}
          value={sigma}
          onChange={onSigmaChangeHandler}
        />,
      }, {
        label: 'MinSize',
      }, {
        content: <Slider
          disabled={disabled}
          min={0}
          max={500}
          value={minSize}
          onChange={onMinSizeChangeHandler}
        />,
      }, {
        label: 'Outline Color',
      }, {
        content: <select
          disabled={disabled}
          style={{ width: '200px' }}
          defaultValue={colorSelections[0]}
          value={outlineColor}
          onChange={onOutlineColorChangeHandler}>
          {colorSelections.map((item, i) => {
            return <option key={i} value={item.value}>{item.label}</option>;
          })}
        </select>,
      }, {
        label: 'Label', content: <input
          disabled={disabled}
          type='checkbox'
          checked={label}
          style={{ marginLeft: '60px' }}
          onChange={onLabelChangeHandler}
        />,
      }, {
        label: 'Uniform Labels', content: <input
          disabled={disabled}
          type='checkbox'
          checked={uniformLabel}
          style={{ marginLeft: '60px' }}
          onChange={onUniformLabelsChangeHandler}
        />,
      }, {
        label: 'Label Color',
      }, {
        content: <select
          disabled={disabled}
          style={{ width: '200px' }}
          defaultValue={colorSelections[4]}
          value={labelColor}
          onChange={onLabelColorChangeHandler}>
          {colorSelections.map((item, i) => {
            return <option key={i} value={item.value}>{item.label}</option>;
          })}
        </select>,
      }, {
        label: 'Label Opacity',
      }, {
        content: <Slider
          disabled={disabled}
          min={0}
          max={1}
          step={0.1}
          value={labelOpacity}
          onChange={onLabelOpacityChangeHandler}
        />,
      }, {
        label: 'Overlay', content: <input
          disabled={disabled}
          type='checkbox'
          checked={overlay}
          style={{ marginLeft: '60px' }}
          onChange={onOverlayChangeHandler}
        />,
      }]}>
      </Grid2Column>
    </Frame>
    <span style={{ display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
    <Button
      disabled={disabled}
      label={'Reset'}
      onClick={resetDefaults}
    />
    <Button
      disabled={disableSubmitButton}
      label={'Apply'}
      onClick={applyChanges}
    />
      </span>
  </div>);
}

export default SegmentationView;