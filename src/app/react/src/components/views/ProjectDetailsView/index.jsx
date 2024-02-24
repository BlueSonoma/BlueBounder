import { memo } from 'react';
import ProjectInformationView from '../ProjectInformationView';
import ProjectStructureListView from '../ProjectStuctureView';

function ProjectDetailsView({ children, ...rest }) {
  return (<div>
      <div style={{ marginTop: '5px', padding: '3px', border: '2px groove lightgray' }}>Project Structure</div>
      <ProjectStructureListView />
      <div style={{ marginTop: '10px', padding: '3px', border: '2px groove lightgray' }}>Information</div>
      <ProjectInformationView />
    </div>);
}

export default memo(ProjectDetailsView);
