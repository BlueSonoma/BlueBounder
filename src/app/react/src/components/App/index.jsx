import React, { useEffect, useState } from 'react';

import useSessionManager from '../../hooks/useSessionManager';
import { HOST_URL } from '../../index';
import { addFilepathToNode, createImageNodeFromFilepath, createViewport, imageAlreadyLoaded } from './utils';
import ImageUploadForm from '../../additional-components/forms/ImageUploadForm';
import IconLiveFolder from '../../resources/icons/live-folder.png';
import Button from '../../additional-components/buttons/Button';
import IconPixelData from '../../resources/icons/table-data.png';
import IconMaps from '../../resources/icons/map.png';
import IconCleanUp from '../../resources/icons/clean-up.png';
import IconGrainSize from '../../resources/icons/polygon-grain.png';
import IconClassify from '../../resources/icons/classify.png';
import IconLayers from '../../resources/icons/layers.png';
import { DockPanelPosition } from '../../types/general';
import Navbar from '../../containers/Navbar';
import ProjectSidebar from '../sidebars/ProjectSidebar';
import SettingsSidebar from '../sidebars/SettingsSidebar';
import BottomSidebar from '../sidebars/BottomSidebar';
import WindowTitleBar from '../../additional-components/WindowTitleBar';
import Canvas from '../Canvas';
import useAppState from '../../hooks/useAppState';
import type { ImageNodeType } from '../../types/nodes';

import '../../styles/bounder.css';
import '../../styles/sidebar.css';
import '../../styles/navbar.css';

function App() {
  const appState = useAppState();

  const {
    sessionName, nodes, setNodes, viewports, setViewports, setActiveViewport,
  } = useSessionManager();

  const [showLeftDrawer, setShowLeftDrawer] = useState(true);
  const [showRightDrawer, setShowRightDrawer] = useState(true);
  const [showBottomDrawer, setShowBottomDrawer] = useState(false);

  useEffect(() => {
    if (!sessionName) {
      return;
    }
    appState.startLoadRequest();
    fetch(`${HOST_URL}/api/sessions/get_session_images?sessionName=${sessionName}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(async ([data, status]) => {
        if (status === 200) {
          if (Array.isArray(data)) {
            // Create a new viewport
            const viewport = createViewport(sessionName);

            // Create a new ImageNode with the file paths we got from the back-end
            for (const file of data) {
              const node = await handleCreateImageNode(file);

              if (!node) {
                continue;
              }
              node.data.viewport = viewport.id;
              nodes.push(node);
              viewport.props.nodes.push(node);
            }
            // Add the new viewport
            setViewports((prev) => [...prev, viewport]);
            setActiveViewport(viewport.id);
            setNodes(() => [...nodes]);
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
    appState.startLoadRequest();

    async function createImageNodes(event) {
      for (const file of event.target.files) {
        const node = await handleCreateImageNode(file);
        if (node) {
          const viewport = createViewport(node.data.file.prefix);
          node.data.viewport = viewport.id;
          nodes.push(node);

          viewport.props.nodes.push(node);
          viewport.props.active = true;
          setViewports((prev) => [...prev, viewport]);
          setActiveViewport(viewports.id);
        }
      }
    }

    await createImageNodes(event);
    appState.endLoadRequest();
    setNodes((() => [...nodes]));
  }

  async function handleCreateImageNode(pathOrFile): ImageNodeType {
    let filepath = pathOrFile;
    if (typeof filepath !== 'string') {
      filepath = pathOrFile.path;
    }
    if (imageAlreadyLoaded(filepath, nodes)) {
      return null;
    }

    const node = await createImageNodeFromFilepath(filepath);
    addFilepathToNode(node, filepath);

    return node;
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
        onClick={() => setShowBottomDrawer(!showBottomDrawer)}
        label={'Pixel Data'}
      />
      <Button
        id={'button__map'}
        onClick={() => setShowRightDrawer(showRightDrawer)}
        imageUrl={IconMaps}
        label={'Maps'}
      />
      <Button
        id={'button__clean-up'}
        onClick={() => setShowRightDrawer(showRightDrawer)}
        imageUrl={IconCleanUp}
        label={'Clean Up'}
      />
      <Button
        id={'button__grain-size'}
        onClick={() => setShowLeftDrawer(!showLeftDrawer)}
        imageUrl={IconGrainSize}
        label={'Grain Size'}
      />
      <Button
        id={'button__classify'}
        onClick={() => setShowRightDrawer(!showRightDrawer)}
        imageUrl={IconClassify}
        label={'Classify'}
      />
      <Button
        id={'button__layers'}
        onClick={() => setShowRightDrawer(!showRightDrawer)}
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
      showDrawer={showLeftDrawer}
      drawerComponent={ProjectSidebar}
    >
      <Button label={'Project'} onClick={() => setShowLeftDrawer(!showLeftDrawer)} />
    </Navbar>);
  }

  function renderRightNavbar() {
    return (<Navbar
      id={'navbar__right'}
      position={DockPanelPosition.Right}
      showDrawer={showRightDrawer}
      drawerComponent={SettingsSidebar}
    >
      <Button label={'Settings'} onClick={() => setShowRightDrawer(!showRightDrawer)} />
    </Navbar>);
  }

  function renderBottomNavbar() {
    return (<Navbar
      id={'navbar__bottom'}
      position={DockPanelPosition.Bottom}
      showDrawer={showBottomDrawer}
      drawerComponent={BottomSidebar}
    >
      <Button label={'Details'} onClick={() => setShowBottomDrawer(!showBottomDrawer)} />
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
