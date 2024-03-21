import { memo } from 'react';
import TabbedSidebar from '../TabbedSidebar';
import { DockPanelPosition } from '../../../types/general';
import LayersView from '../../views/ViewportLayersView';

function SettingsSidebar({ show, children, ...rest }) {
  return (<TabbedSidebar
    show={show}
    position={DockPanelPosition.Right}
    tabComponents={{
      label: 'Layers', component: <LayersView />,
    }}
    {...rest}>
    {children}
  </TabbedSidebar>);
}

export default memo(SettingsSidebar);