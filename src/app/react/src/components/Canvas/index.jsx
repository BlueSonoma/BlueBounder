import React, { memo, useEffect, useState } from 'react';
import '../../styles/bounder.css';
import '../../resources/images/test_image1.png';
import SelectorModeProvider from '../SelectorModeProvider';
import useSelectorMode from '../../hooks/useSelectorMode';
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
import { ReactFlowProvider } from '@xyflow/react';
import { getFilenameFromUrl, getNextId } from '../../utils/general';

function Canvas({ children }) {
  const [nodes, setNodes] = useState([]);
  // const {
  //   screenToFlowPosition, minZoom, setMinZoom, maxZoom, setMaxZoom, zoom, setViewportExtent, getViewportExtent, fitView,
  // } = useViewport();
  const { selectorMode, setSelectorMode } = useSelectorMode();
  const [showLeftDrawer, setShowLeftDrawer] = useState(true);
  const [showRightDrawer, setShowRightDrawer] = useState(true);
  const [showBottomDrawer, setShowBottomDrawer] = useState(false);

  const [viewports, setViewports] = useState([]);

  const session = useSession();

  // TODO: Must have access to ImageNode dimensions to calculate the extent and zoom
  const width = 3523;
  const height = 2028;

  useEffect(() => {
    //TODO: This should be moved to a function that gets called on only two occasions:
    //  1. A new image is added to the nodes (meaning the old image is replaced)
    //  2. The user selects an option to center the image in the viewport.
    // fitView(nodes, { duration: 0 });
  }, [nodes]);


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

  function setImageFromFile(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    // FileReader handles this asynchronously, so we define the callback to execute once its finished loading
    reader.onload = () => {

      //FIXME: Coordinates go beyond the width and height of the image, even in the negative direction??
      //  This is due to incorrect parsing of the image. Need to find the protocol/package to decode it.

      /** This should be handled on the server with callable functions;
       const [r,g,b,a] = image.getColorRgba(x,y);
       const grain = image.getGrain(x,y); // perform BFS to find boundary containing coords x,y and create a grainNode
       const bbox = boundary.getBoundingBox() // returns x,y,width, height
       const boundary: number[][] = boundary.getBoundary();
       ...

       Grain data may include:
       type GrainNode = Node & {
            data: {
              boundary: number[][],
              boundingBox: {
                x: number,
                y: number,
                width: number,
                height: number
              },
              parent?: any,
              eulerAngle?: number | string,
              composition?: string,
            },
            ...
          }
       */

      const url = reader.result;


      // Load the image to get its dimensions to be used later when rendering the viewport for the first time
      const image = new Image();
      image.src = url;

      // Don't add the same image
      if (typeof nodes.find((nd) => nd.data.src === image.src) !== 'undefined') {
        return;
      }

      image.onload = () => {
        const filename = getFilenameFromUrl(file.name);

        // Create the node
        const node = {
          id: `imageNode_${getNextId()}`,
          type: 'imageNode',
          position: { x: 0, y: 0 },
          selectable: false,
          focusable: true,
          draggable: false,
          deletable: false,
          data: {
            width: image.width,
            height: image.height,
            src: image.src,
            file: file,
            viewport: `Viewport_${viewports.length + 1}`,
          },
        };

        setNodes([...nodes, node]);
        setViewports([...viewports, { id: node.data.viewport }]);
      };
    };
    reader.readAsDataURL(file);
  }

  function renderFileLoader() {
    return (<ImageUploadForm
      className={'bounder__mode-selector'}
      textForm={false}
      browseButtonProps={{
        imageUrl: IconLiveFolder, label: 'Open...',
      }}
      onChange={setImageFromFile}
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
        onClick={() => {
          if (showRightDrawer) {
            setShowRightDrawer(false);
            return;
          }
          setShowRightDrawer(true);
        }}
        imageUrl={IconMaps}
        label={'Maps'}
      />
      <Button
        id={'button__clean-up'}
        onClick={() => {
          if (showRightDrawer) {
            setShowRightDrawer(false);
            return;
          }
          setShowRightDrawer(true);
        }}
        imageUrl={IconCleanUp}
        label={'Clean Up'}
      />
      <Button
        id={'button__grain-size'}
        onClick={() => {
          if (showLeftDrawer) {
            setShowLeftDrawer(false);
            return;
          }
          setShowLeftDrawer(true);
        }}
        imageUrl={IconGrainSize}
        label={'Grain Size'}
      />
      <Button
        id={'button__classify'}
        onClick={() => {
          if (showRightDrawer) {
            setShowRightDrawer(false);
            return;
          }
          setShowRightDrawer(true);
        }}
        imageUrl={IconClassify}
        label={'Classify'}
      />
    </div>);
  }

  function renderViewport() {
    const viewportComponents = viewports.map((viewport) => {
      let label = `${viewport.id}`;
      const vpNodes = nodes.filter((nd) => {
        if (nd.data.viewport === viewport.id) {
          label = nd.data.file.name;
          return true;
        }
        return false;
      });
      return {
        label: label, component: Viewport, props: {
          id: viewport.id, nodes: vpNodes, onClick: onCanvasClickHandler,
        },
      };
    });

    return (<TabbedPanel
      className={'viewport'}
      position={DockPanelPosition.Center}
      tabComponents={viewportComponents}
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
