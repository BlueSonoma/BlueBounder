import DockPanel from '../DockPanel';
import { DockPanelPosition } from '../../types';

import '../../styles/sidebar.css';
import '../../styles/mode-selector.css';

const Sidebar = ({ id, show, className, position, children, ...rest }) => {
  className = className ? className : '';
  className += ' resizable';
  position = position ?? DockPanelPosition.Left;

  return (<DockPanel
    id={id}
    position={position}
    className={'bounder__sidebar ' + className}
    show={show}
    {...rest}
  >
    <div className={'resize' + ` ${position}`} />
    <div className={`content-container`}>{children}</div>
  </DockPanel>);
};
export default Sidebar;
