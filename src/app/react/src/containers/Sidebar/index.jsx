import { memo, useEffect, useState } from 'react';

import DockPanel from '../DockPanel';
import { DockPanelPosition } from '../../types/general';

import '../../styles/sidebar.css';
import '../../styles/mode-selector.css';

const Sidebar = ({ id, show, className, position, children, ...rest }) => {
  const [showSidebar, setShowSidebar] = useState(show ?? true);

  useEffect(() => {
    setShowSidebar(show);
  }, [show]);

  className = className ? className : '';
  className += ' resizable';
  position = position ?? DockPanelPosition.Left;

  return (<DockPanel
      id={id}
      position={position}
      className={'bounder__sidebar ' + className}
      show={showSidebar}
      {...rest}
    >
      <div className={'resize' + ` ${position}`} />
      <div className={`content-container`}>{children}</div>
    </DockPanel>);
};
export default memo(Sidebar);
