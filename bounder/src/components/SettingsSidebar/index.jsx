import { memo } from 'react';
import TabbedSidebar from '../TabbedSidebar';
import { DockPanelPosition } from '../../types/general';

function SettingsSidebar({show, children, ...rest}) {
  return (
    <TabbedSidebar show={show} position={DockPanelPosition.Right} {...rest}>
      {children}
    </TabbedSidebar>
  );

}

export default memo(SettingsSidebar)