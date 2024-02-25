import {
  BackgroundVariant, Panel, Position, ReactFlow, ReactFlowProvider, useNodesState, Background,
} from '@xyflow/react';
import React, { memo, useEffect, useState } from 'react';
import useViewport from '../../hooks/useViewport';
import { nodeTypes } from '../component-types';
import '../../styles/bounder.css';
import '../../resources/images/test_image1.png';
import SelectorModeProvider from '../SelectorModeProvider';
import useSelectorMode from '../../hooks/useSelectorMode';
import { SelectorModes } from '../../utils/selector-modes';
import ModeSelector from '../additional-components/ModeSelector';
import Button from '../additional-components/buttons/Button';
import IconLiveFolder from '../../resources/icons/live-folder.png';
import IconMaps from '../../resources/icons/map.png';
import IconCleanUp from '../../resources/icons/clean-up.png';
import IconGrainSize from '../../resources/icons/polygon-grain.png';
import IconPixelData from '../../resources/icons/table-data.png';

import '../../styles/sidebar.css';
import '../../styles/navbar.css';

import { DockPanelPosition } from '../../types/general';
import Navbar from '../../containers/Navbar';
import ImageUploadForm from '../additional-components/forms/ImageUploadForm';
import ViewportMetricsBar from '../ViewportMetricsBar';
import BottomSidebar from '../BottomSidebar';
import SettingsSidebar from '../SettingsSidebar';
import ProjectSidebar from '../ProjectSidebar';
import AppTitleBar from '../AppTitleBar';

function Canvas({ children }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const {
    screenToFlowPosition, minZoom, setMinZoom, maxZoom, setMaxZoom, zoom, setViewportExtent, getViewportExtent, fitView,
  } = useViewport();
  const { selectorMode, setSelectorMode } = useSelectorMode();
  const [showLeftDrawer, setShowLeftDrawer] = useState(true);
  const [showRightDrawer, setShowRightDrawer] = useState(true);
  const [showBottomDrawer, setShowBottomDrawer] = useState(false);

  // TODO: Must have access to ImageNode dimensions to calculate the extent and zoom
  const width = 3523;
  const height = 2028;

  useEffect(() => {
    const padding = {
      x: maxZoom + width * (1 / 2), y: maxZoom + height * (1 / 2),
    };

    const extentUpperLeft = [-padding.x, -padding.y];
    const extentLowerRight = [width + padding.x, height + padding.y];
    setViewportExtent([extentUpperLeft, extentLowerRight]);
  }, []);

  useEffect(() => {
    //TODO: This should be moved to a function that gets called on only two occasions:
    //  1. A new image is added to the nodes (meaning the old image is replaced)
    //  2. The user selects an option to center the image in the viewport.
    // fitView(nodes, { duration: 0 });
  }, [nodes]);

  function onInit() {
    // The zoom is set such that it allows a full view of the image plus some extra.
    // Removes the unnecessary ability to zoom too far out.
    const zoom = Math.abs(1.5 - (width + height) / Math.sqrt(width * width + height * height));
    setMinZoom(zoom);
    setMaxZoom(20);
  }

  function onCanvasClickHandler(event) {
    if (selectorMode === SelectorModes.AddEllipse) {
      // Deselect any selected nodes
      const prevNodes = nodes.map((node) => {
        return {
          ...node, selected: false,
        };
      });

      // Make the new ellipse node
      const initialWidth = 100;
      const initialHeight = 100;
      const initialRadius = initialWidth / 2;

      const position = screenToFlowPosition(event.clientX - initialRadius * zoom, event.clientY - initialRadius * zoom);

      const ellipse = {
        id: `ellipse_${nodes.length}`, type: 'ellipseNode', position, data: {
          initialWidth, initialHeight,
        }, selected: true, draggable: true,
      };
      setNodes([...prevNodes, ellipse]);
    }

    if (nodes.length > 0 && selectorMode === SelectorModes.FreeMove) {
      const { x, y } = screenToFlowPosition(event.clientX, event.clientY);
      if (x < 0 || x > width - 1 || y < 0 || y > height - 1) {
        return;
      }

      const row = Math.round(x);
      const col = Math.round(y);
      console.log(row, col);

      /* Get grain boundary and create GrainNode */
      // const imgNode = nodes.find((node) => node.id === 'imageNode_1');
      // const pixelValues = [];
      // for (let i = 0; i < 3; i++) {
      //   pixelValues.push(imgNode.data.bytes.at(i)?.at(row)?.at(col));
      // }
      // console.log(pixelValues);
    }
  }

  function setImage(event) {
    const image = event.target.files[0];

    if (!image) {
      return;
    }

    // Find the previous image (if it exists)
    const index = nodes.findIndex((node) => node.type === 'imageNode');

    let node;
    if (index === -1) {
      // Create the new node if not found
      node = {
        id: 'imageNode_1',
        type: 'imageNode',
        position: { x: 0, y: 0 },
        selectable: false,
        focusable: true,
        draggable: false,
        deletable: false,
      };
    } else {
      // Remove it from the collections. When it's added back later, React Flow will be notified to update the state
      node = nodes.at(index);
      nodes.splice(index, 1, node);
    }

    const reader = new FileReader();
    // FileReader handles this asynchronously, so we define the callback to execute once its finished loading
    reader.onload = () => {
      const url = reader.result;

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

      node.data = {
        url: url, file: image, // bytes: bytes,
      };
      setNodes([...nodes, node]);
    };
    reader.readAsDataURL(image);
  }

  function renderFileLoader() {
    return (<>
      <ImageUploadForm
        className={'bounder__mode-selector'}
        textForm={false}
        browseButtonProps={{
          imageUrl: IconLiveFolder, label: 'Open...',
        }}
        onChange={setImage}
      />
    </>);
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
    </div>);
  }

  function renderViewport() {
    return (<>
      <AppTitleBar />
      <ReactFlow
        className={'viewport'} // className={'dark'}
        onInit={onInit}
        fitView={true}
        nodes={nodes}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        onNodesChange={onNodesChange}
        maxZoom={maxZoom}
        minZoom={minZoom}
        translateExtent={getViewportExtent()}
        onClick={onCanvasClickHandler}
      >
        <Panel position={Position.Top}>
          <ModeSelector />
        </Panel>
        <Background variant={BackgroundVariant.Lines} lineWidth={0.5} gap={100} color={'#303030'} />
      </ReactFlow>
      <ViewportMetricsBar
        className={'bounder__mode-selector'}
        onFitView={() => fitView(nodes)}
        zoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
      />
    </>);
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
  return (
    <ReactFlowProvider>
    <SelectorModeProvider>
      <Canvas>{children}</Canvas>
    </SelectorModeProvider>
  </ReactFlowProvider>);
}

CanvasView.displayName = 'CanvasView';

export default memo(CanvasView);
