import { memo } from 'react';
import TabbedSidebar from '../TabbedSidebar';
import { DockPanelPosition } from '../../../types';
import LayersView from '../../views/ViewportLayersView';
import SegmentationView from '../../views/SegmentationView';

const components = [{ label: 'Layers', component: <LayersView /> }, {
  label: 'Segment', component: <SegmentationView />,
}];

function SettingsSidebar({ show, children, ...rest }) {
  return (<TabbedSidebar
    show={show}
    position={DockPanelPosition.Right}
    tabComponents={components}
    {...rest}>
    {children}
  </TabbedSidebar>);
}

export default memo(SettingsSidebar);