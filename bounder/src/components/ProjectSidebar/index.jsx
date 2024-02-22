import { memo } from 'react';
import TabbedSidebar from '../TabbedSidebar';
import { DockPanelPosition } from '../../types/general';
import ProjectDetailsView from '../views/ProjectDetailsView';
import GrainSizeView from '../views/GrainSizeView';
import CleanUpView from '../views/CleanUpView';

function ProjectSidebar({ show, children, ...rest }) {
  return (
    <TabbedSidebar
      show={show}
      position={DockPanelPosition.Left}
      tabComponents={[
        {
          label: 'Project Details',
          component: <ProjectDetailsView />,
        },
        {
          label: 'Grain Size',
          component: <GrainSizeView />,
        },
        {
          label: 'Clean Up',
          component: <CleanUpView />,
        },
      ]}
      {...rest}
    />
  );
}

export default memo(ProjectSidebar);
