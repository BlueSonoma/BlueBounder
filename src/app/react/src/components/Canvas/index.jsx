import React, { memo, useEffect, useState } from 'react';
import '../../styles/bounder.css';
import '../../resources/images/test_image1.png';
import SelectorModeProvider from '../SelectorModeProvider';
import Button from '../additional-components/buttons/Button';
import IconLiveFolder from '../../resources/icons/live-folder.png';
import IconMaps from '../../resources/icons/map.png';
import IconCleanUp from '../../resources/icons/clean-up.png';
import IconGrainSize from '../../resources/icons/polygon-grain.png';
import IconPixelData from '../../resources/icons/table-data.png';
import IconClassify from '../../resources/icons/classify.png';

import '../../styles/sidebar.css';
import '../../styles/navbar.css';

import { DockPanelPosition } from '../../types/general';
import Navbar from '../../containers/Navbar';
import ImageUploadForm from '../additional-components/forms/ImageUploadForm';
import BottomSidebar from '../BottomSidebar';
import SettingsSidebar from '../SettingsSidebar';
import ProjectSidebar from '../ProjectSidebar';
import AppTitleBar from '../AppTitleBar';
import useSession from '../../hooks/useSession';
import Viewport from '../Viewport';
import TabbedPanel from '../TabbedPanel';
import { createBlobFromText, getNextId } from '../../utils/general';
import { createImageNode } from './utils';
import { HOST_URL } from '../../index';

function Canvas({ children }) {
  const session = useSession();
  const [nodes, setNodes] = useState([]);
  const [viewports, setViewports] = useState([]);
  const [showLeftDrawer, setShowLeftDrawer] = useState(true);
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const [showBottomDrawer, setShowBottomDrawer] = useState(false);


  useEffect(() => {
    const formData = new FormData();
    formData.append('sessionName', session.sessionName);

    fetch(`${HOST_URL}/api/sessions/get_session_images`, {
      method: 'POST', body: formData,
    })
      .then(response => response.json())
      .then(([data, status]) => {
        if (status === 200) {
          if (Array.isArray(data)) {
            data.forEach((file) => {
              console.log(viewports.length);
              createBlobFromText(file)
                .then((blob) => createImageNodeFromBlob(blob, file));
            });
          }
        } else {
          console.error('Error:', status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  function handleCreateNode(image, filepath) {
    // Create the node
    const node = createImageNode(image, filepath);
    const viewport = {
      label: node.data.file.name, component: Viewport, props: {
        id: `Viewport_${getNextId()}`, nodes: [node], onClick: onCanvasClickHandler,
      },
    };
    setViewports((prev) => [...prev, viewport]);
    node.data.viewport = viewport.props.id;
    setNodes([...nodes, node]);
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

  function createImageNodeFromBlob(blob, filepath) {
    if (!blob) {
      return;
    }

    const reader = new FileReader();
    // FileReader handles this asynchronously, so we define the callback to execute once its finished loading
    reader.onload = () => {
      const url = reader.result;

      // Don't add the same image
      if (typeof nodes.find((nd) => nd.data.src === url) !== 'undefined') {
        return;
      }

      // Load the image to get its dimensions to be used later when rendering the viewport for the first time
      const image = new Image();
      image.onload = () => {
        handleCreateNode(image, filepath);
      };
      image.src = url;
    };
    reader.readAsDataURL(blob);
  }

  function renderFileLoader() {
    return (<ImageUploadForm
      className={'bounder__mode-selector'}
      textForm={false}
      browseButtonProps={{
        imageUrl: IconLiveFolder, label: 'Open...',
      }}
      onChange={(event) => {
        const file = event.target.files[0];
        console.log(file);
        createImageNodeFromBlob(file, file.path);
      }}
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
    </div>);
  }

  function renderViewport() {
    /////////////////////////////////////////////////////////
    // TODO: This needs to create a viewport for each node
    /////////////////////////////////////////////////////////
    // const viewportComponents = viewports.map((viewport) => {
    //   let label = `${viewport.id}`;
    //   const vpNodes = [];
    //   nodes.forEach((node) => {
    //     if (node.data.viewport === viewport.id) {
    //       vpNodes.push(node);
    //     }
    //   });
    // const vpNodes = nodes.filter((nd) => {
    //   if (nd.data.viewport === viewport.id) {
    //     label = nd.data.file.prefix;
    //     return true;
    //   }
    //   return false;
    // });

    //   return {
    //     label: label, component: Viewport, props: {
    //       id: viewport.id, nodes: vpNodes, onClick: onCanvasClickHandler,
    //     },
    //   };
    // });

    // console.log(`Size of viewportComponents: ${viewportComponents.length}`);
    // viewportComponents.forEach((viewport) => {
    //   console.log(`Number of nodes in Viewport: ${viewport}: ${viewport.nodes.length}`);
    // });

    return (<TabbedPanel
      className={'viewport'}
      position={DockPanelPosition.Center}
      tabComponents={viewports}
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
      <label style={{ fontSize: 'small' }}>Status: Ready</label>
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
  return (<SelectorModeProvider>
    <Canvas>{children}</Canvas>
  </SelectorModeProvider>);
}

CanvasView.displayName = 'CanvasView';

export default memo(CanvasView);
