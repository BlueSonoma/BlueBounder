import { memo, useEffect, useState } from 'react';

import '../../styles/tabbed.css';
import '../../styles/mode-selector.css';
import Button from '../additional-components/buttons/Button';
import Panel from '../../containers/Panel';

function getInitialTabsLength(components) {
  if (typeof components === 'undefined') {
    return 0;
  }
  if (!Array.isArray(components)) {
    components = [components];
  }
  return components.length;
}

function getInitialSelectedIndex(components) {
  if (typeof components === 'undefined') {
    return -1;
  }

  if (!Array.isArray(components)) {
    components = [components];
  }

  if (components.length === 0) {
    return -1;
  }

  let selected = -1;
  for (let i = 0; i < components.length; i++) {
    if (components[i].props?.focused) {
      selected = i;
      break;
    }
  }
  if (selected === -1) {
    return components.length - 1;
  }

  components.forEach((comp, index) => {
    if (index !== selected) {
      comp.props.focused = false;
    }
  });

  return selected;
}

const TabbedPanel = ({ id, style, show, className, position, tabComponents, selectedIndex, children, ...rest }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(selectedIndex ?? getInitialSelectedIndex(tabComponents));
  const [tabsLength, setTabsLength] = useState(getInitialTabsLength(tabComponents));

  useEffect(() => {
    if (typeof tabComponents === 'undefined') {
      return;
    }
    if (!Array.isArray(tabComponents)) {
      tabComponents = [tabComponents];
    }

    const length = tabComponents.length;

    // A tab was deleted, make no change
    if (tabsLength > length) {
      return;
    }

    // Set the active tab as the newly added component
    setSelectedTabIndex(length - 1);
    setTabsLength(length);
  }, [tabComponents]);

  useEffect(() => {
    if (typeof selectedIndex === 'undefined' || selectedIndex === null) {
      return;
    }
    setSelectedTabIndex(selectedIndex);
  }, [selectedIndex]);

  if (!Array.isArray(tabComponents)) {
    tabComponents = [tabComponents].filter((label) => typeof label !== 'undefined');
  }

  const labels = tabComponents.map((tab) => tab.label);
  const components = tabComponents.map((tab) => tab.component);
  const props = tabComponents.map((tab) => tab.props);

  function onTabClickedHandler(event, index) {
    if (selectedTabIndex !== index) {
      setSelectedTabIndex(index);
    }
  }

  return (<Panel
    id={id}
    position={position}
    className={'bounder__tabbed ' + className}
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
      {components.map((Component, index) => {
        let componentProps = props[index];
        const isSelected = index === selectedTabIndex;
        componentProps = {
          ...componentProps, className: componentProps.className + ' tab-content', style: {
            zIndex: isSelected ? 1 : 0, ...componentProps.style, position: isSelected ? 'relative' : 'absolute',
          }, isFocused: isSelected,
        };
        return <Component key={index} {...componentProps} />;
      })}
    </div>
  </Panel>);
};
export default TabbedPanel;
