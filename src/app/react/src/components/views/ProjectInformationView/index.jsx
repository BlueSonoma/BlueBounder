import { memo } from 'react';

function ProjectInformationView({ children, ...rest }) {
  return (<div style={{ padding: '5px', border: '2px inset lightgray' }}>
    <div>Project Name</div>
    <div>Dataset Name</div>
    <div>Pixel Count</div>
    <div>Raster</div>
    <div>Step Size</div>
    <div>Zero Solutions</div>
  </div>);
}

export default memo(ProjectInformationView);