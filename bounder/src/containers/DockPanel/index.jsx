import { memo } from 'react';
import { Panel } from '@xyflow/react';

const DockPanel = ({ id, className, position, show=true, children, ...rest }) => {
  if (!show) {
    return <></>;
  }

  return (
    <Panel id={id} position={position} className={className} {...rest}>
      {children}
    </Panel>
  );
};
export default memo(DockPanel);
