import { memo } from 'react';

function CleanUpView({ children, ...rest }) {
  return (<div>
      <h4>Clean Up View</h4>
    </div>);
}

export default memo(CleanUpView);