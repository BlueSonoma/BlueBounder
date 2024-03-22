import React, { memo, useEffect, useState } from 'react';
import '../../styles/bounder.css';

import { DockPanelPosition } from '../../types';
import TabbedPanel from '../TabbedPanel';
import useSessionManager from '../../hooks/useSessionManager';

function Canvas({ className, ...rest }) {
  const [currentIndex, setCurrentIndex] = useState(null);
  const { viewports, getViewportIndex, activeViewport, setActiveViewport } = useSessionManager();

  useEffect(() => {
    if (activeViewport) {
      const index = getViewportIndex(activeViewport);
      setCurrentIndex(() => index);
    }
  }, [activeViewport]);

  function onTabClickHandler(event, tab) {
    if (tab) {
      const index = tab.current;
      if (viewports.length < index) {
        setActiveViewport(viewports[index]);
      }
    }
  }

  return (<div id={'bounder__canvas'} className={className} {...rest}>
    <TabbedPanel
      className={'viewport'}
      position={DockPanelPosition.Center}
      tabComponents={viewports}
      onTabClick={onTabClickHandler}
      selectedIndex={currentIndex}
    />
  </div>);
}

export default memo(Canvas);
