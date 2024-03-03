import { memo } from 'react';

import '../../styles/navbar.css';
import '../../styles/bounder.css';
import { DockPanelPosition } from '../../types/general';
import { HTMLProps } from 'react';
import Panel from '../Panel';

type NavbarProps = HTMLProps & {
  position: DockPanelPosition, drawerProps: any, showDrawer?: boolean,
}

function Navbar({ id, className, position, style, drawerComponent, showDrawer, children }: NavbarProps) {
  if (typeof position === 'undefined') {
    position = DockPanelPosition.Top;
  }

  className = className ?? '';

  function renderToggleBar() {
    return (<Panel
      id={id}
      position={position}
      className={'bounder__navbar ' + className}
      style={style}
    >
      {children}
    </Panel>);
  }

  if (!drawerComponent || !showDrawer) {
    return <>{renderToggleBar()}</>;
  }

  const DrawerComponent = drawerComponent;

  function selectButtonById(event, toggle: boolean = true) {
    // const buttonId = event.target.id;
    // document.getElementById(currentButtonId)?.classList.toggle('select', false);
    //
    // if (currentButtonId === buttonId) {
    //   setCurrentButtonId(null);
    //   setCurrentDrawerIndex(null);
    //   setShowDrawer(false);
    // } else if (toggle) {
    //   document.getElementById(buttonId).classList.toggle('select', true);
    //   setCurrentButtonId(buttonId);
    //   setCurrentDrawerIndex(toggleButtons?.find((button) => button.id === buttonId));
    //   setShowDrawer(true);
    // }
  }

  return (<>
    {renderToggleBar()}
    <DrawerComponent show={showDrawer} />
  </>);
}

export default memo(Navbar);
