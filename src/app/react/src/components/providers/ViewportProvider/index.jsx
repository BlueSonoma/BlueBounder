import { memo, useEffect, useState } from 'react';
import { Viewport, useReactFlow, useOnViewportChange } from '@xyflow/react';
import { Provider } from '../../contexts/ViewportContext';

const DEFAULT_MAX_ZOOM = 15;
const DEFAULT_MIN_ZOOM = 1;
const DEFAULT_VIEWPORT_TRANSITION_SPEED = 300;
const DEFAULT_FITVIEW_TRANSITION_SPEED = 200;
const DEFAULT_VIEWPORT_PADDING = 2;
const DEFAULT_FITVIEW_PADDING = 0.1;

function ViewportProvider({ children }) {
  const reactFlow = useReactFlow();
  const [viewportId, setViewportId] = useState(undefined);
  const [maxZoom, setMaxZoom] = useState(DEFAULT_MAX_ZOOM);
  const [minZoom, setMinZoom] = useState(DEFAULT_MIN_ZOOM);
  const [viewportExtent, setViewportExtent] = useState([[0, 0], [0, 0]]);
  const [viewportTransitionSpeed, setViewportTransitionSpeed] = useState(DEFAULT_VIEWPORT_TRANSITION_SPEED);
  const [fitViewTransitionSpeed, setFitViewTransitionSpeed] = useState(DEFAULT_FITVIEW_TRANSITION_SPEED);
  const [viewportPadding, setViewportPadding] = useState(DEFAULT_VIEWPORT_PADDING);
  const [fitViewPadding, setFitViewPadding] = useState(DEFAULT_FITVIEW_PADDING);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (typeof viewportId === 'undefined') {
      return;
    }

    function updateMousePosition(event: MouseEvent) {
      const position = screenToFlowPosition(event.clientX, event.clientY);
      if (typeof position !== 'undefined') {
        setMousePosition(position);
      }
    }

    const pane = document.querySelector(`[class^="react-flow"][id="${viewportId}"]`);
    if (pane) {
      pane.addEventListener('mousemove', updateMousePosition);
      return () => {
        pane.removeEventListener('mousemove', updateMousePosition);
      };
    }
  }, [viewportId]);


  useOnViewportChange({
    onChange: (viewport) => {
      setZoom(viewport.zoom);
    },
  });


  function getDefaultFitViewOptions() {
    return {
      duration: fitViewTransitionSpeed, minZoom, maxZoom, padding: fitViewPadding, includeHiddenNodes: false,
    };
  }

  function getDefaultSetViewportOptions() {
    return { duration: viewportTransitionSpeed };
  }

  function zoomIn(options) {
    if (typeof options === 'undefined') {
      options = getDefaultFitViewOptions();
    }
    reactFlow?.zoomIn(options);
  }

  function zoomOut(options) {
    if (typeof options === 'undefined') {
      options = getDefaultFitViewOptions();
    }
    reactFlow?.zoomOut(options);
  }

  function fitView({ nodes, options }) {
    if (typeof options === 'undefined') {
      options = getDefaultFitViewOptions();
    } else {
      if (!options.padding) {
        options.padding = fitViewPadding;
      } else if (!options.duration) {
        options.duration = fitViewTransitionSpeed;
      }
    }
    if (typeof nodes !== 'undefined') {
      options = {
        ...options, nodes,
      };
    }
    reactFlow?.fitView(options);
  }

  function setViewport(viewport: Viewport, duration) {
    if (typeof viewport === 'undefined') return;
    if (typeof duration === 'undefined') {
      duration = getDefaultSetViewportOptions().duration;
    }
    reactFlow?.setViewport(viewport, duration);
  }

  function getViewport() {
    return reactFlow.getViewport();
  }

  const centerViewport = (nodes) => {
    if (typeof nodes === 'undefined') return;

    if (!(Array.isArray(nodes))) {
      nodes = [nodes];
    }
    fitView({ nodes, padding: viewportPadding });
  };

  function screenToFlowPosition(x, y) {
    return reactFlow?.screenToFlowPosition({ x, y }, false);
  }

  function flowToScreenPosition(x, y) {
    return reactFlow?.flowToScreenPosition({ x, y });
  }

  function getViewportExtent() {
    return viewportExtent;
  }

  const contextProps = {
    viewportId,
    setViewportId,
    setViewport,
    getViewport,
    zoomIn,
    zoomOut,
    fitView,
    maxZoom,
    minZoom,
    viewportTransitionSpeed,
    setMaxZoom,
    setMinZoom,
    setViewportTransitionSpeed,
    screenToFlowPosition,
    flowToScreenPosition,
    getDefaultFitViewOptions,
    setViewportExtent,
    getViewportExtent,
    mousePosition,
    zoom,
  };

  return <Provider value={contextProps}>
    {children}
  </Provider>;
}

export default ViewportProvider;