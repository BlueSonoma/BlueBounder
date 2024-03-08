// https://github.com/xyflow/xyflow/blob/v11/packages/core/src/components/Panel/index.tsx/#L14

import { forwardRef } from 'react';

function Panel({ position, children, className, style, ...rest }, ref) {
  const positionClasses = `${position}`.split('-');

  return (<div
    ref={ref}
    className={'react-flow__panel ' + className + ` ${positionClasses.map((pos) => pos + ' ')}`}
    style={{ ...style }}
    {...rest}
  >
    {children}
  </div>);
}

export default forwardRef(Panel);