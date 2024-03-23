import { memo } from 'react';
import ProjectInformationView from '../ProjectInformationView';
import ProjectStructureListView from '../ProjectStuctureView';

function ProjectDetailsView({ children, ...rest }) {
  return (<>
    <ProjectStructureListView />
    <ProjectInformationView />
  </>);
}

export default memo(ProjectDetailsView);
