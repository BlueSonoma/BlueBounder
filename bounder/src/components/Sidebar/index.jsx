import { memo, useEffect, useState } from 'react';

import DockPanel from '../../containers/DockPanel';
import { DockPanelPosition } from '../../types/general';

import '../../styles/sidebar.css';
import '../../styles/mode-selector.css';

const Sidebar = ({ id, hidden, className, position, children }) => {
  const [showSidebar, setShowSidebar] = useState(hidden ?? true);


  useEffect(() => {
    if (typeof hidden !== 'undefined') {
      setShowSidebar(!showSidebar);
    }
  }, [hidden]);

  return (
    <DockPanel
      id={id}
      position={position ?? DockPanelPosition.Left}
      className={'bounder__sidebar ' + className}
      hidden={showSidebar}
    >
      <div className={`content-container`}>
        <div className={'content'}>{children}</div>
      </div>
    </DockPanel>
  );
};
export default memo(Sidebar);
