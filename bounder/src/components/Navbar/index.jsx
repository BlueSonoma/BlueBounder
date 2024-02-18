import { memo, useState } from 'react';

import '../../styles/navbar.css';
import '../../styles/bounder.css';
import { Panel } from '@xyflow/react';
import { DockPanelPosition } from '../../types/general';
import Button from "../additional-components/buttons/Button";

//NOTE: `drawerComponent` may serve better as an array. This way, a collection of components can be
// passed to the navbar to be rendered as tabbed views. Likewise, the navbar buttons will reflect
// the components that are passed.
// Example: drawerComponents: [PixelDataComponent, ...], buttons: [pixelDataButton, ...]

function Navbar({
  id,
  // buttonId,
  // buttonLabel,
  // buttonStyle,
  className,
  position,
  style,
  toggleButtonProps,
  drawerTypes,
  drawerPosition,
  drawerProps,
  children,
}) {
  const [currentButtonId, setCurrentButtonId] = useState(null);
  const [currentDrawerIndex, setCurrentDrawerIndex] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  function selectButtonById(event) {
    const id = event.target.id;
    document.getElementById(currentButtonId)?.classList.toggle('select', false);

    if (currentButtonId === id) {
      setCurrentButtonId(null);
      setCurrentDrawerIndex(null);
      setShowDrawer(false);
      return;
    }

    document.getElementById(id).classList.toggle('select', true);
    setCurrentButtonId(id);
    setCurrentDrawerIndex(toggleButtonProps?.find((button) => button.id === id));
    setShowDrawer(true);
  }

  if (!Array.isArray(toggleButtonProps)) {
    toggleButtonProps = [toggleButtonProps].filter((button) => typeof button !== 'undefined');
  }

  if (position) {
    if (position === DockPanelPosition.Bottom || position === DockPanelPosition.Top) {
      style = {
        ...style,
        display: 'flex',
        flexDirection: 'row',
        width: 'auto',
        alightItems: 'center',
      };

      toggleButtonProps.forEach((button, idx, arr) => {
        button.style = {
          ...style,
          transform: 'rotate(0deg)',
        };
        arr[idx] = button;
      });
    }
  }

  function renderToggleBar() {
    return (
      <Panel id={id} position={position} className={'bounder__navbar ' + className} style={style}>
        {toggleButtonProps.map((button, idx) => {
          return (
            <Button
              key={idx}
              id={button.id}
              className={'bounder__mode-selector'}
              onClick={selectButtonById}
              label={button.label}
              style={button.style}
            />
          );
        })}
        {children}
      </Panel>
    );
  }

  if (!Array.isArray(drawerTypes)) {
    drawerTypes = Array.from([drawerTypes].filter((drawer) => typeof drawer !== 'undefined'));
  }

  if (!currentDrawerIndex || currentDrawerIndex >= drawerTypes.length) {
    return <>{renderToggleBar()}</>;
  }

  if (!Array.isArray(drawerProps)) {
    drawerProps = Array.from([drawerProps].filter((props) => typeof props !== 'undefined'));
  }

  const Drawer = drawerTypes.at(currentDrawerIndex);
  const props = drawerProps?.at(currentDrawerIndex);

  if (drawerPosition && drawerPosition === DockPanelPosition.Left) {
    return (
      <>
        <Drawer hidden={showDrawer} {...props} />
        {renderToggleBar()}
      </>
    );
  }

  return (
    <>
      {renderToggleBar()}
      <Drawer hidden={showDrawer} {...props} />
    </>
  );
}

export default memo(Navbar);
