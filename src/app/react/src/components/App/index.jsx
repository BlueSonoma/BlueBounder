import React, { useEffect, useState } from 'react';

import useSessionManager from '../../hooks/useSessionManager';
import {
  toggleShowSidebar,
} from './utils';
import ImageUploadForm from '../../additional-components/forms/ImageUploadForm';
import IconLiveFolder from '../../resources/icons/live-folder.png';
import Button from '../../additional-components/buttons/Button';
import IconPixelData from '../../resources/icons/table-data.png';
import IconMaps from '../../resources/icons/map.png';
import IconCleanUp from '../../resources/icons/clean-up.png';
import IconGrainSize from '../../resources/icons/polygon-grain.png';
import IconClassify from '../../resources/icons/classify.png';
import IconLayers from '../../resources/icons/layers.png';
import IconSegment from '../../resources/icons/segment.png';
import { DockPanelPosition } from '../../types';
import Navbar from '../../containers/Navbar';
import WindowTitleBar from '../../additional-components/WindowTitleBar';
import Canvas from '../Canvas';
import useAppState from '../../hooks/useAppState';
import { initialBottomSidebar, initialProjectSidebar, initialSettingsSidebar } from '../sidebars/initialSidebars';

import '../../styles/bounder.css';
import '../../styles/sidebar.css';
import '../../styles/navbar.css';
import { API } from '../../routes';
import { getFilenameFromPath } from '../../utils/general';

function App() {
  const appState = useAppState();
  const sessionManager = useSessionManager();
  const { sessionName, nodes, setNodes, setSelectedNodes } = sessionManager;

  const [leftSidebar, setLeftSidebar] = useState(initialProjectSidebar);
  const [rightSidebar, setRightSidebar] = useState(initialSettingsSidebar);
  const [bottomSidebar, setBottomSidebar] = useState(initialBottomSidebar);

  useEffect(() => {
    if (!sessionName) {
      return;
    }
    appState.startLoadRequest();
    fetch(`${API.Sessions}/get_session_images?sessionName=${sessionName}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(async ([data, status]) => {
        if (status === 200) {
          if (Array.isArray(data)) {
            // Create a new ImageNode with the file paths we got from the back-end
            for (const file of data) {
              const node = await sessionManager.createDefaultImageNode(file);
              if (!node) {
                continue;
              }
              nodes.push(node);
            }
            setNodes(() => [...nodes]);

            if (nodes.length > 0) {
              setSelectedNodes(nodes[nodes.length - 1]);
            }
          }
          appState.endLoadRequest();
        } else {
          console.error('Error:', status);
          appState.endLoadRequest();
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        appState.endLoadRequest();
      });
  }, []);

  async function handleOnImagesSelected(event) {
    async function doWork() {
      // Create a new ImageNode with the file paths we got from the back-end
      for (const file of event.target.files) {
        const node = await sessionManager.createDefaultImageNode(file);

        if (!node) {
          continue;
        }
        sessionManager.createAndAddViewport({
          name: `${getFilenameFromPath(file.path)}`, nodes: [node], options: { setActive: true },
        });
        nodes.push(node);
        setNodes(() => [...nodes]);

        if (nodes.length > 0) {
          setSelectedNodes(nodes[nodes.length - 1]);
        }
      }
    }

    appState.startLoadRequest();
    doWork().then().catch((e) => console.log(e));
    appState.endLoadRequest();
  }

  function renderFileLoader() {
    return (<ImageUploadForm
      className={'bounder__mode-selector'}
      multiple={true}
      textForm={false}
      browseButtonProps={{
        imageUrl: IconLiveFolder, label: 'Open...',
      }}
      onChange={handleOnImagesSelected}
    />);
  }

  function renderTopNavbarButtons() {
    return (<div
      className={'bounder__mode-selector'}
      style={{
        position: 'absolute',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
      }}
    >
      <Button
        id={'button__pixel-data'}
        imageUrl={IconPixelData}
        onClick={() => toggleShowSidebar(bottomSidebar, setBottomSidebar)}
        label={'Pixel Data'}
      />
      <Button
        id={'button__map'}
        onClick={() => toggleShowSidebar(rightSidebar, setRightSidebar)}
        imageUrl={IconMaps}
        label={'Maps'}
      />
      <Button
        id={'button__clean-up'}
        onClick={() => toggleShowSidebar(leftSidebar, setLeftSidebar())}
        imageUrl={IconCleanUp}
        label={'Clean Up'}
      />
      <Button
        id={'button__segment'}
        onClick={() => toggleShowSidebar(rightSidebar, setRightSidebar)}
        imageUrl={IconSegment}
        label={'Segment'}
      />
      <Button
        id={'button__grain-size'}
        onClick={() => toggleShowSidebar(leftSidebar, setLeftSidebar)}
        imageUrl={IconGrainSize}
        label={'Grain Size'}
      />
      <Button
        id={'button__classify'}
        onClick={() => toggleShowSidebar(rightSidebar, setRightSidebar)}
        imageUrl={IconClassify}
        label={'Classify'}
      />
      <Button
        id={'button__layers'}
        onClick={() => toggleShowSidebar(rightSidebar, setRightSidebar)}
        imageUrl={IconLayers}
        label={'Layers'}
      />
    </div>);
  }


  function renderTopNavbar() {
    return (<Navbar id={'navbar__top'} position={DockPanelPosition.Top}>
      {renderFileLoader()}
      {renderTopNavbarButtons()}
    </Navbar>);
  }

  function renderLeftNavbar() {
    return (<Navbar
      id={'navbar__left'}
      position={DockPanelPosition.Left}
      drawerComponent={leftSidebar}
    >
      <Button label={'Project'} onClick={() => toggleShowSidebar(leftSidebar, setLeftSidebar)} />
    </Navbar>);
  }

  function renderRightNavbar() {
    return (<Navbar
      id={'navbar__right'}
      position={DockPanelPosition.Right}
      drawerComponent={rightSidebar}
    >
      <Button label={'Settings'} onClick={() => toggleShowSidebar(rightSidebar, setRightSidebar)} />
    </Navbar>);
  }

  function renderBottomNavbar() {
    return (<Navbar
      id={'navbar__bottom'}
      position={DockPanelPosition.Bottom}
      drawerComponent={bottomSidebar}
    >
      <Button label={'Details'} onClick={() => toggleShowSidebar(bottomSidebar, setBottomSidebar)} />
    </Navbar>);
  }

  function renderFooter() {
    return (<div className={'footer'} style={{ justifyContent: 'center', textAlign: 'left', paddingLeft: '5px' }}>
      <label
        style={{ fontSize: 'small' }}>Status: {appState.loading ? 'Loading...' : appState.saving ? 'Saving...' : 'Ready'}</label>
    </div>);
  }

  return (<div id={'app'} className={'bounder'}>
    <WindowTitleBar />
    {renderTopNavbar()}
    {renderLeftNavbar()}
    <Canvas className={'viewport'} />
    {renderRightNavbar()}
    {renderBottomNavbar()}
    {renderFooter()}
  </div>);
}

export default App;
