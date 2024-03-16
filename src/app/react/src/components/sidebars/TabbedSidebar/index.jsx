import { memo, useEffect, useState } from 'react';

import '../../styles/sidebar.css';
import '../../styles/tabbed.css';
import '../../styles/mode-selector.css';
import Sidebar from '../../containers/Sidebar';
import Button from '../additional-components/buttons/Button';

const TabbedSidebar = ({ id, style, show, className, position, tabComponents, children, ...rest }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(null);

  useEffect(() => {
    if (!selectedTabIndex && tabComponents.length > 0) {
      setSelectedTabIndex(0);
    }
  }, []);

  useEffect(() => {
    if (selectedTabIndex && selectedTabIndex >= tabComponents.length) {
      setSelectedTabIndex(0);
    }
  }, [tabComponents]);

  if (!Array.isArray(tabComponents)) {
    tabComponents = [tabComponents].filter((label) => typeof label !== 'undefined');
  }

  const labels = tabComponents.map((tab) => tab.label);
  const components = tabComponents.map((tab) => tab.component);

  let selectedComponent = null;
  if ((!selectedTabIndex && components.length > 0) || (selectedTabIndex && selectedTabIndex < components.length)) {
    selectedComponent = components[selectedTabIndex];
  }

  function onTabClickedHandler(event, index) {
    if (selectedTabIndex !== index) {
      setSelectedTabIndex(index);
    }
  }

  return (<Sidebar
    id={id}
    position={position}
    className={className}
    show={show}
    style={style}
    {...rest}
  >
    <div className={'tab-bar'}>
      {labels?.map((label, idx) => {
        return (<Button
          key={idx}
          className={'tab'}
          title={label}
          label={label}
          onClick={(event) => onTabClickedHandler(event, idx)}
        />);
      })}
    </div>
    <div className={'content-container'}
         style={{
           borderTop: labels?.length > 0 ? 'solid gray 2px' : '',
         }}
    >
      {selectedComponent}
    </div>
  </Sidebar>);
};
export default memo(TabbedSidebar);
