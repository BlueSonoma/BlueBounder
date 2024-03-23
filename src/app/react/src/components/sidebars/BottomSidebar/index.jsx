import { memo } from 'react';
import TabbedSidebar from '../TabbedSidebar';
import { DockPanelPosition } from '../../../types';

function BottomSidebar({ show, children, ...rest }) {
  return (<TabbedSidebar position={DockPanelPosition.Bottom} show={show} {...rest}>
      {children}
    </TabbedSidebar>);
}

export default memo(BottomSidebar);
