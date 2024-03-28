import React, { memo, useEffect, useState } from 'react';
import { DockPanelPosition } from '../../types';
import TabbedPanel from '../TabbedPanel';
import useSessionManager from '../../hooks/useSessionManager';

import '../../styles/bounder.css';

function Canvas({ className, ...rest }) {
  const [currentIndex, setCurrentIndex] = useState(null);
  const { viewports, setViewports, getViewportIndex, activeViewport, setActiveViewport } = useSessionManager();

  useEffect(() => {
    if (activeViewport) {
      const index = getViewportIndex(activeViewport);
      setCurrentIndex(() => index);
    }
  }, [activeViewport]);

  function onTabClickHandler(event, tab) {
    if (tab) {
      const index = tab.current;
      if (index < viewports.length) {
        setActiveViewport(viewports[index]);
      }
    }
  }

  function onTabCloseHandler(event, tab) {
    if (tab) {
      const index = tab.current;
      if (index < viewports.length) {
        const viewport = viewports[index];
        if (typeof viewport !== 'undefined') {
          setViewports((prev) => prev.filter((vp) => vp.id !== viewport.id));
          setActiveViewport(null);
          setCurrentIndex(null);
        }
      }
    }
  }

  return (<div id={'bounder__canvas'} className={className} {...rest}>
    <TabbedPanel
      className={'viewport'}
      position={DockPanelPosition.Center}
      tabComponents={viewports}
      onTabClick={onTabClickHandler}
      onTabClose={onTabCloseHandler}
      selectedIndex={currentIndex}
    />
  </div>);
}

export default memo(Canvas);
