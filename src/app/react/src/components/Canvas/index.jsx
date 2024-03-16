import React, { memo, useEffect, useState } from 'react';
import '../../styles/bounder.css';
import '../../resources/images/test_image1.png';

import { DockPanelPosition } from '../../types/general';
import TabbedPanel from '../TabbedPanel';
import useAppState from '../../hooks/useAppState';
import useSessionManager from '../../hooks/useSessionManager';

function Canvas({ className, ...rest }) {
  const { viewports, getViewportIndex } = useSessionManager();
  const { activeViewport, setActiveViewport } = useSessionManager();
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    if (activeViewport) {
      setCurrentIndex(() => getViewportIndex(activeViewport));
    }
  }, [activeViewport]);

  function onTabClickHandler(event, tabs) {
    if (tabs) {
      setActiveViewport(() => tabs.current);
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
