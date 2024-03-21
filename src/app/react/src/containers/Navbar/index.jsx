import { DockPanelPosition } from '../../types/general';
import { HTMLProps } from 'react';
import Panel from '../Panel';

import '../../styles/navbar.css';
import '../../styles/bounder.css';

type DrawerComponentType = {
  show: boolean; component: React.Component;
}

type NavbarProps = HTMLProps & {
  position: DockPanelPosition; drawerComponent?: DrawerComponentType;
}

function Navbar({ id, className, style, position, drawerComponent, children, ...rest }: NavbarProps) {
  if (typeof position === 'undefined') {
    position = DockPanelPosition.Top;
  }

  className = className ?? '';

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

  function renderToggleBar() {
    return (<Panel
      id={id}
      position={position}
      className={'bounder__navbar ' + className}
      style={style}
      {...rest}
    >
      {children}
    </Panel>);
  }

  const DrawerComponent = drawerComponent?.component;
  if (typeof DrawerComponent === 'undefined') {
    return <>
      {renderToggleBar()}
    </>;
  }

  const componentStyle = {
    zIndex: drawerComponent.show ? 1 : -1, position: drawerComponent.show ? 'relative' : 'absolute',
  };

  return (<>
    {renderToggleBar()}
    {<DrawerComponent style={componentStyle} />}
  </>);
}

export default Navbar;
