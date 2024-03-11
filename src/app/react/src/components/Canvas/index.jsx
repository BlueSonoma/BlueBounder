import React, { memo, useEffect, useState } from 'react';
import '../../styles/bounder.css';
import '../../resources/images/test_image1.png';
import Button from '../additional-components/buttons/Button';
import IconLiveFolder from '../../resources/icons/live-folder.png';
import IconMaps from '../../resources/icons/map.png';
import IconCleanUp from '../../resources/icons/clean-up.png';
import IconGrainSize from '../../resources/icons/polygon-grain.png';
import IconPixelData from '../../resources/icons/table-data.png';
import IconClassify from '../../resources/icons/classify.png';
import IconLayers from '../../resources/icons/layers.png';

import '../../styles/sidebar.css';
import '../../styles/navbar.css';

import { DockPanelPosition } from '../../types/general';
import Navbar from '../../containers/Navbar';
import ImageUploadForm from '../additional-components/forms/ImageUploadForm';
import BottomSidebar from '../BottomSidebar';
import SettingsSidebar from '../SettingsSidebar';
import ProjectSidebar from '../ProjectSidebar';
import AppTitleBar from '../AppTitleBar';
import useSessionManager from '../../hooks/useSessionManager';
import TabbedPanel from '../TabbedPanel';
import {
  addFilepathToNode, createImageNodeFromFilepath, createViewport, imageAlreadyLoaded,
} from './utils';
import { HOST_URL } from '../../index';
import type { ImageNodeType } from '../../types/nodes';
import useAppState from '../../hooks/useAppState';

function Canvas({ children }) {
  const appState = useAppState();

  const {
    sessionName, nodes, setNodes, viewports, setViewports, activeViewport, setActiveViewport,
  } = useSessionManager();

  const [showLeftDrawer, setShowLeftDrawer] = useState(true);
  const [showRightDrawer, setShowRightDrawer] = useState(true);
  const [showBottomDrawer, setShowBottomDrawer] = useState(false);
  const [currentViewportIndex, setCurrentViewportIndex] = useState(null);

  useEffect(() => {
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

              // Add the node to the viewport
              viewport.props.nodes.push(node);
            }

            setNodes(() => [...nodes]);
            viewport.props.active = true;
            // Add the new viewport
            setViewports((prev) => [...prev, viewport]);
            setActiveViewport(viewports.id);
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

  useEffect(() => {
    setCurrentViewportIndex(() => activeViewport ? activeViewport[1] : null);
  }, [activeViewport]);

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

  function onCanvasClickHandler(event) {
    // if (selectorMode === SelectorModes.AddEllipse) {
    //   // Deselect any selected nodes
    //   const prevNodes = nodes.map((node) => {
    //     return {
    //       ...node, selected: false,
    //     };
    //   });
    //
    //   // Make the new ellipse node
    //   const initialWidth = 100;
    //   const initialHeight = 100;
    //   const initialRadius = initialWidth / 2;
    //
    //   const position = screenToFlowPosition(event.clientX - initialRadius * zoom, event.clientY - initialRadius * zoom);
    //
    //   const ellipse = {
    //     id: `ellipse_${nodes.length}`, type: 'ellipseNode', position, data: {
    //       initialWidth, initialHeight,
    //     }, selected: true, draggable: true,
    //   };
    //   setNodes([...prevNodes, ellipse]);
    // }
    //
    // if (nodes.length > 0 && selectorMode === SelectorModes.FreeMove) {
    //   const { x, y } = screenToFlowPosition(event.clientX, event.clientY);
    //   if (x < 0 || x > width - 1 || y < 0 || y > height - 1) {
    //     return;
    //   }
    //
    //   const row = Math.round(x);
    //   const col = Math.round(y);
    //   console.log(row, col);
    //
    //   /* Get grain boundary and create GrainNode */
    //   // const imgNode = nodes.find((node) => node.id === 'imageNode_1');
    //   // const pixelValues = [];
    //   // for (let i = 0; i < 3; i++) {
    //   //   pixelValues.push(imgNode.data.bytes.at(i)?.at(row)?.at(col));
    //   // }
    //   // console.log(pixelValues);
    // }
  }

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

  function renderViewport() {
    return (<TabbedPanel
      className={'viewport'}
      position={DockPanelPosition.Center}
      tabComponents={viewports}
      selectedIndex={currentViewportIndex}
    />);
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

  return (<div id={'bounder__canvas'} className={'bounder'}>
    <AppTitleBar />
    {renderTopNavbar()}
    {renderLeftNavbar()}
    {renderViewport()}
    {renderRightNavbar()}
    {renderBottomNavbar()}
    {renderFooter()}
    {children}
  </div>);
}

function CanvasView({ children }) {
  return (<Canvas>{children}</Canvas>);
}

CanvasView.displayName = 'CanvasView';

export default memo(CanvasView);
