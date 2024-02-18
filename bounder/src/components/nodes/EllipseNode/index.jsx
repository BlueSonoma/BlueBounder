import { memo, useState } from 'react';
import { NodeProps, NodeResizer, useStore } from '@xyflow/react';
import useSelectorMode from '../../../hooks/useSelectorMode';
import { SelectorModes } from '../../../utils/selector-modes';

function EllipseNode(props: NodeProps) {
  const {
    id, data, selected, xPos, yPos, type,
  } = props;

  const [lastRotation, setLastRotation] = useState(0);
  const [lastChange, setLastChange] = useState(0);

  const { selectorMode } = useSelectorMode();

  const nodes = useStore((store) => store.nodes);
  const node = nodes.find((node) => node.id === id);

  const width = node.width ?? data.initialWidth;
  const height = node.height ?? data.initialHeight;
  const rx = width / 2;
  const ry = height / 2;

  function onResizeHandler(event, params) {
    if (selectorMode === SelectorModes.Rotate) {
      const element = document.querySelector(`#node__${id}`);

      const diff = event.dy - lastChange;
      const direction = diff < 0 ? 1 : -1;
      setLastChange(direction);

      // const rotX = event.dx;
      // const rotY = event.dy;
      // const newRot = Math.atan2(rotY, rotX) * (180 / Math.PI);
      const rotation = lastRotation + direction;
      setLastRotation(rotation);
      element.style.transform = `rotate(${rotation}deg)`;
      console.log(`lastRotation: ${lastRotation}, rotation: ${rotation}, direction: ${direction}`);
    }
  }

  function onResizeStartHandler(event) {
    const element = document.querySelector(`#node__${id}`);
    const computedStyle = window.getComputedStyle(element);
    const transformValue = computedStyle.getPropertyValue('transform');
    const matrix = new DOMMatrix(transformValue);
    const rotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
    setLastRotation(rotation);
    setLastChange(event.y);
  }

  function onResizeEndHandler() {
  }

  return (<div
    id={`node__${id}`}
    style={{
      transform: 'rotate(0deg)',
      transformOrigin: `${rx}px ${ry}px`,
    }}
  >
    {selected && <NodeResizer
      onResizeStart={onResizeStartHandler}
      onResize={onResizeHandler}
      onResizeEnd={onResizeEndHandler}
      // keepAspectRatio={true}
      // shouldResize={() => false}
    />}
    <svg
      width={width}
      height={height}
      style={{ overflow: 'visible' }}
    >
      <ellipse
        cx={rx}
        cy={ry}
        rx={rx}
        ry={ry}
        fill={'none'}
        strokeWidth={3}
        stroke={'rgb(255,0,0)'}

      />
    </svg>
  </div>);
}

EllipseNode.displaName = 'EllipseNode';

export default memo(EllipseNode);
