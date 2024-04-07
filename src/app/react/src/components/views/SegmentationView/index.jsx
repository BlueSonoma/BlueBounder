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
import DirectoryPicker from '../../../additional-components/forms/DirectoryPicker';
import { getFilenameFromPath } from '../../../utils/general';
import { imageExists } from '../../../utils/nodes';

/** Segmentation Configuration Options
 bc_image: Image, chem_mask: Image, *, border_color='black', overlay_opacity=1.0, bc_scale=200,
 bc_sigma=0.55, bc_min_size=300, bc_outline_color='black', mask_scale=10, mask_sigma=0.1,
 mask_min_size=10, mask_outline_color='black', mask_label=True, mask_uniform_label=True,
 mask_label_color='yellow', mask_label_opacity=1.0
 **/


const colorSelections = Object.keys(Colors)
  .map((color) => {
    return {
      value: Colors[color], label: color,
    };
  });

function SegmentationView({ children, ...rest }) {
  const appState = useAppState();
  const sessionManager = useSessionManager();
  const [disabled, setDisabled] = useState(false);
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);

  const [outputPath, setOutputPath] = useState(initialState.outputPath);
  const [outputFilename, setOutputFilename] = useState(initialState.outputFilename);
  const [bandContrastPath, setBandContrastPath] = useState(initialState.bandContrastPath);
  const [maskPath, setMaskPath] = useState(initialState.maskPath);
  const [borderColor, setBorderColor] = useState(initialState.borderColor);
  const [overlayOpacity, setOverlayOpacity] = useState(initialState.overlayOpacity);
  const [bandContrastScale, setBandContrastScale] = useState(initialState.bandContrastScale);
  const [bandContrastSigma, setBandContrastSigma] = useState(initialState.bandContrastSigma);
  const [bandContrastMinSize, setBandContrastMinSize] = useState(initialState.bandContrastMinSize);
  const [bandContrastOutlineColor, setBandContrastOutlineColor] = useState(initialState.bandContrastOutlineColor);
  const [maskScale, setMaskScale] = useState(initialState.maskScale);
  const [maskSigma, setMaskSigma] = useState(initialState.maskSigma);
  const [maskMinSize, setMaskMinSize] = useState(initialState.maskMinSize);
  const [maskOutlineColor, setMaskOutlineColor] = useState(initialState.maskOutlineColor);
  const [labelRegions, setLabelRegions] = useState(initialState.labelRegions);
  const [uniformLabel, setUniformLabel] = useState(initialState.uniformLabel);
  const [labelColor, setLabelColor] = useState(initialState.labelColor);
  const [labelOpacity, setLabelOpacity] = useState(initialState.labelOpacity);

  function resetDefaults() {
    setOutputPath(initialState.outputPath);
    setOutputFilename(initialState.outputFilename);
    setBandContrastPath(initialState.bandContrastPath);
    setMaskPath(initialState.maskPath);
    setBorderColor(initialState.borderColor);
    setOverlayOpacity(initialState.overlayOpacity);
    setBandContrastScale(initialState.bandContrastScale);
    setBandContrastSigma(initialState.bandContrastSigma);
    setBandContrastMinSize(initialState.bandContrastMinSize);
    setBandContrastOutlineColor(initialState.bandContrastOutlineColor);
    setMaskScale(initialState.maskScale);
    setMaskSigma(initialState.maskSigma);
    setMaskMinSize(initialState.maskMinSize);
    setMaskOutlineColor(initialState.maskOutlineColor);
    setLabelRegions(initialState.labelRegions);
    setUniformLabel(initialState.uniformLabel);
    setLabelColor(initialState.labelColor);
    setLabelOpacity(initialState.labelOpacity);
  }

  useEffect(() => {
    setDisableSubmitButton(() => {
      return disabled || maskPath.length === 0 || bandContrastPath.length === 0 || outputPath.length === 0 || outputFilename.length === 0;
    });
  }, [disabled, disableSubmitButton, maskPath, bandContrastPath, outputPath, outputFilename]);

  function applyChanges() {
    async function applyChangesAsync() {
      console.log(`Filename: ${outputFilename}`);
      console.log(`Save path: ${outputPath}`);
      console.log(`Band contrast path: ${bandContrastPath}`);
      console.log(`Mask path: ${maskPath}`);

      const formData = new FormData();
      formData.append('outputPath', outputPath);
      formData.append('outputFilename', outputFilename);
      formData.append('bandContrastPath', bandContrastPath);
      formData.append('maskPath', maskPath);
      formData.append('borderColor', borderColor);
      formData.append('overlayOpacity', overlayOpacity);
      formData.append('bandContrastScale', bandContrastScale);
      formData.append('bandContrastSigma', bandContrastSigma);
      formData.append('bandContrastMinSize', bandContrastMinSize);
      formData.append('bandContrastOutlineColor', bandContrastOutlineColor);
      formData.append('maskScale', maskScale);
      formData.append('maskSigma', maskSigma);
      formData.append('maskMinSize', maskMinSize);
      formData.append('maskOutlineColor', maskOutlineColor);
      formData.append('labelRegions', labelRegions);
      formData.append('uniformLabel', uniformLabel);
      formData.append('labelColor', labelColor);
      formData.append('labelOpacity', labelOpacity);

      console.log(`Executing boundary segmentation...`);

      const filepath = await fetch(`${API.Imaging}/exec_segmentation`, { method: 'POST', body: formData })
        .catch((e) => {
          throw new Error('Error fetching `exec_segmentation` JSON', e);
        })
        .then((response) => response.json())
        .catch((e) => {
          throw new Error('Error in `exec_segmentation` data', e);
        })
        .then((data) => {
          console.log(JSON.stringify(data));
          return data[0];
        });

      appState.endSaveRequest();

      if (filepath) {
        appState.startLoadRequest();

        if (imageExists(filepath, sessionManager.nodes)) {
          sessionManager.nodes.find((node) => node.data.file.path === filepath).data.reload();
        } else {
          const node = await sessionManager.createDefaultImageNode(filepath);

          if (node) {
            const viewport = sessionManager.createAndAddViewport({
              name: `${getFilenameFromPath(filepath)}`, nodes: [node],
            });
            sessionManager.nodes.push(node);
            sessionManager.setNodes([...sessionManager.nodes]);
            sessionManager.setActiveViewport(viewport);
          }
        }
        appState.endLoadRequest();
      }
    }

    appState.startSaveRequest();
    setDisabled(true);
    applyChangesAsync().then(() => {
      console.log(`Boundary segmentation completed`);
      setDisabled(false);
    }).catch((e) => {
      console.log(`Error with boundary segmentation:`, e);
      setDisabled(false);
      appState.endSaveRequest();
    });
  }

  // File-related
  function onFilenameChange(event) {
    setOutputFilename(event.target.value);
  }

  function onSaveLocationChange(event, path) {
    if (typeof path !== 'undefined') {
      setOutputPath(path);
    }
  }

  function onBandImageChange(event, path) {
    if (typeof path !== 'undefined') {
      setBandContrastPath(path);
    }
  }

  // Mask settings

  function onMaskImageChange(event, path) {
    if (typeof path !== 'undefined') {
      setMaskPath(path);
    }
  }

  function onMaskScaleChange(event) {
    setMaskScale(event.target.value);
  }

  function onMaskSigmaChange(event) {
    setMaskSigma(event.target.value);
  }

  function onMaskMinSizeChange(event) {
    setMaskMinSize(event.target.value);
  }

  function onMaskOutlineColorChange(event) {
    setMaskOutlineColor(event.target.value);
  }

  // Band contrast settings

  function onBandContrastScaleChange(event) {
    setBandContrastScale(event.target.value);
  }

  function onBandContrastSigmaChange(event) {
    setBandContrastSigma(event.target.value);
  }

  function onBandContrastMinSizeChange(event) {
    setBandContrastMinSize(event.target.value);
  }

  function onBandContrastOutlineColorChange(event) {
    setBandContrastOutlineColor(event.target.value);
  }

  // Miscellaneous settings

  function onBorderColorChange(event) {
    setBorderColor(event.target.value);
  }

  function onOverlayOpacityChange(event) {
    setOverlayOpacity(event.target.value);
  }

  function onLabelRegionsChange(event) {
    labelRegions(event.target.checked);
  }

  function onUniformLabelsChange(event) {
    setUniformLabel(event.target.checked);
  }

  function onLabelColorChange(event) {
    setLabelColor(event.target.value);
  }

  function onLabelOpacityChange(event) {
    setLabelOpacity(event.target.value);
  }

  return (<>
    <div style={{ paddingLeft: '2px', paddingRight: '2px' }}>
      <Frame label={'Segmentation'}>

        {/* File-related
          Filename
          Output path
          Band Contrast image path
          Mask image path
        */}

        <Grid2Column data={[{
          label: 'Filename',
        }, {
          content: <input
            disabled={disabled}
            style={{ padding: '5px', width: '240px' }}
            type={'text'} value={outputFilename}
            onChange={onFilenameChange} />,
        }, {
          label: 'Save Directory',
        }, {
          content: <DirectoryPicker
            textFormStyle={{ width: '245px' }}
            disabled={disabled}
            value={outputPath}
            onChange={onSaveLocationChange}
          />,
        }, {
          label: 'Band Contrast Image Path',
        }, {
          content: <ImageUploadForm
            disabled={disabled}
            textFormStyle={{ left: '5px', right: '5px', width: '320px' }}
            browseButtonProps={{ marginTop: '5px' }}
            onChange={onBandImageChange}
          />,
        }, {
          label: 'Mask Image Path',
        }, {
          content: <ImageUploadForm
            disabled={disabled}
            textFormStyle={{ left: '5px', right: '5px', width: '320px' }}
            browseButtonProps={{ marginTop: '5px' }}
            onChange={onMaskImageChange} />,
        }]} />

        {/* Mask Settings
          Scale
          Sigma
          Minimum Size
          Outline Color
        */}

        <Frame label={'Mask Settings'}>
          <Grid2Column data={[{
            label: 'Scale',
          }, {
            content: <Slider
              disabled={disabled}
              min={0}
              max={300}
              value={maskScale}
              onChange={onMaskScaleChange}
            />,
          }, {
            label: 'Sigma',
          }, {
            content: <Slider
              disabled={disabled}
              min={0}
              max={1}
              step={0.1}
              value={maskSigma}
              onChange={onMaskSigmaChange}
            />,
          }, {
            label: 'Minimum Size',
          }, {
            content: <Slider
              disabled={disabled}
              min={0}
              max={500}
              value={maskMinSize}
              onChange={onMaskMinSizeChange}
            />,
          }, {
            label: 'Outline Color',
          }, {
            content: <select
              disabled={disabled}
              style={{ width: '200px' }}
              defaultValue={colorSelections[0]}
              value={maskOutlineColor}
              onChange={onMaskOutlineColorChange}>
              {colorSelections.map((item, i) => {
                return <option key={i} value={item.value}>{item.label}</option>;
              })}
            </select>,
          }]}>
          </Grid2Column>
        </Frame>

        {/* Band Contrast Settings
          Scale
          Sigma
          Minimum Size
          Outline Color
        */}

        <Frame label={'Band Contrast Settings'}>
          <Grid2Column data={[{
            label: 'Scale',
          }, {
            content: <Slider
              disabled={disabled}
              min={0}
              max={300}
              value={bandContrastScale}
              onChange={onBandContrastScaleChange}
            />,
          }, {
            label: 'Sigma',
          }, {
            content: <Slider
              disabled={disabled}
              min={0}
              max={1}
              step={0.1}
              value={bandContrastSigma}
              onChange={onBandContrastSigmaChange}
            />,
          }, {
            label: 'Minimum Size',
          }, {
            content: <Slider
              disabled={disabled}
              min={0}
              max={500}
              value={bandContrastMinSize}
              onChange={onBandContrastMinSizeChange}
            />,
          }, {
            label: 'Outline Color',
          }, {
            content: <select
              disabled={disabled}
              style={{ width: '200px' }}
              defaultValue={colorSelections[0]}
              value={bandContrastOutlineColor}
              onChange={onBandContrastOutlineColorChange}>
              {colorSelections.map((item, i) => {
                return <option key={i} value={item.value}>{item.label}</option>;
              })}
            </select>,
          }]}>
          </Grid2Column>
        </Frame>

        {/* Miscellaneous Settings:
            Border Color
            Overlay Opacity
            Label Regions
            Uniform Label
            Label Color
            Label Opacity
          */}

        <Frame label={'Miscellaneous Settings'}>
          <Grid2Column data={[{
            label: 'Border Color',
          }, {
            content: <select
              disabled={disabled}
              style={{ width: '200px' }}
              defaultValue={colorSelections[0]}
              value={borderColor}
              onChange={onBorderColorChange}>
              {colorSelections.map((item, i) => {
                return <option key={i} value={item.value}>{item.label}</option>;
              })}
            </select>,
          }, {
            label: 'Overlay Opacity',
          }, {
            content: <Slider
              disabled={disabled}
              min={0}
              max={1}
              step={0.1}
              value={overlayOpacity}
              onChange={onOverlayOpacityChange}
            />,
          }, {
            label: 'Label Regions', content: <input
              disabled={disabled}
              type='checkbox'
              checked={labelRegions}
              style={{ marginLeft: '60px' }}
              onChange={onLabelRegionsChange}
            />,
          }, {
            label: 'Uniform Labels', content: <input
              disabled={disabled || !labelRegions}
              type='checkbox'
              checked={uniformLabel}
              style={{ marginLeft: '60px' }}
              onChange={onUniformLabelsChange}
            />,
          }, {
            label: 'Label Opacity',
          }, {
            content: <Slider
              disabled={disabled || !labelRegions}
              min={0}
              max={1}
              step={0.1}
              value={labelOpacity}
              onChange={onLabelOpacityChange}
            />,
          }, {
            label: 'Label Color',
          }, {
            content: <select
              disabled={disabled || !uniformLabel}
              style={{ width: '200px' }}
              defaultValue={colorSelections[4]}
              value={labelColor}
              onChange={onLabelColorChange}>
              {colorSelections.map((item, i) => {
                return <option key={i} value={item.value}>{item.label}</option>;
              })}
            </select>,
          }]}>
          </Grid2Column>
        </Frame>
      </Frame>
    </div>
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
  </>);
}

export default SegmentationView;