import { memo, useEffect, useRef } from 'react';
import Panel from '../Panel';

const DockPanel = ({ id, className, position, show, children, ...rest }) => {
  const panelRef = useRef(null);

  show = show ?? true;

  return (<>{show && <Panel
    ref={panelRef}
    id={id}
    className={className}
    position={position}
    {...rest}
  >
    {children}
  </Panel>}</>);
};
export default memo(DockPanel);
