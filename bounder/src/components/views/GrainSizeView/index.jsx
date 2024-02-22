import { memo } from 'react';

function GrainSizeView({children, ...rest}) {
  return(
    <div>
      <h4>Grain Size View</h4>
    </div>
  );

}

export default memo(GrainSizeView);