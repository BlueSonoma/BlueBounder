import { getZoomPercentage } from '../Canvas/utils';
import Button from '../additional-components/buttons/Button';
import IconFullScreen from '../../resources/icons/full-screen.png';
import { memo } from 'react';
import useViewport from '../../hooks/useViewport';

function ViewportMetricsBar({ className, zoom, minZoom, maxZoom, onFitView, children }) {
  const { mousePosition } = useViewport();

  //TODO: Implement pixel measurement as such:
  //  1 pixel = 10µm
  //  Use relative window size to get width and height of viewport
  //  Calculate a round measurement reference (ex: |_____ 100 nm _____|) based on width and height and pixel size
  //  Display measurement reference on LHS of status bar
  //  Update calculated measurement as necessary as the zoom value changes
  // Note: The size of the measurement bar (i.e. |___ xyz ___|) may change based on users' display / browser settings
  //  so be sure to pick an appropriate length

  return (<div className={'viewport-footer ' + className}>
      <div style={{ paddingLeft: '10px' }}>|______50µm______|</div>
      <div
        style={{
          display: 'flex', flexDirection: 'row', paddingRight: '5px', alignItems: 'center',
        }}
      >
        <div style={{ paddingRight: '10px' }}>
          X={mousePosition.x.toFixed(2)} Y={mousePosition.y.toFixed(2)} Zoom=
          {`${getZoomPercentage(zoom, minZoom, maxZoom)}%`}
        </div>
        <Button
          onClick={onFitView}
          style={{ marginTop: '7px', border: 'none' }}
          imageStyle={{ width: '20px', height: '20px' }}
          imageUrl={IconFullScreen}
        />
        {children}
      </div>
    </div>);
}

export default memo(ViewportMetricsBar);
