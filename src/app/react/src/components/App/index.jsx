import React, { useEffect, useState } from 'react';

import useSessionManager from '../../hooks/useSessionManager';
import {
  addFilepathToNode, createImageNodeFromFilepath, createViewport, imageAlreadyLoaded, toggleShowSidebar,
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
import { DockPanelPosition } from '../../types/general';
import Navbar from '../../containers/Navbar';
import WindowTitleBar from '../../additional-components/WindowTitleBar';
import Canvas from '../Canvas';
import useAppState from '../../hooks/useAppState';
import type { ImageNodeType } from '../../types/nodes';
import { initialBottomSidebar, initialProjectSidebar, initialSettingsSidebar } from '../sidebars/initialSidebars';

import '../../styles/bounder.css';
import '../../styles/sidebar.css';
import '../../styles/navbar.css';
import { API } from '../../routes';

function App() {
  const appState = useAppState();

  const {
    sessionName, nodes, setNodes, viewports, setViewports, setActiveViewport,
  } = useSessionManager();

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
    node.data.reload = async () => {
      const reNode = await createImageNodeFromFilepath(node.data.file.path);
      node.data.image = reNode.data.image;
      node.width = reNode.width;
      node.height = reNode.height;
      setNodes((prev) => prev.map((nd) => {
        if (nd.id === node.id) {
          return {
            ...node,
          };
        }
        return nd;
      }));
    };
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
        onClick={() => toggleShowSidebar(rightSidebar, setRightSidebar)}
        imageUrl={IconCleanUp}
        label={'Clean Up'}
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
